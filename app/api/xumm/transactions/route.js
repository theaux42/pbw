import { NextResponse } from 'next/server'
import { XummSdk } from 'xumm-sdk'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
)

const xumm = new XummSdk(
  process.env.XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

// POST → Créer une transaction et enregistrer la donation
export async function POST(request) {
  try {
    const body = await request.json()
    const { user_id, org_id, amount, callbackUrl } = body

    if (!user_id || !org_id || !amount) {
      return NextResponse.json(
        { error: 'Missing required parameters: user_id, org_id, amount' },
        { status: 400 }
      )
    }

    const parsedAmount = parseFloat(amount)
    if (isNaN(parsedAmount)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('wallet_address')
      .eq('id', org_id)
      .maybeSingle()

    if (!org || orgError) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    const platform_fee = parseFloat((parsedAmount * 0.05).toFixed(6))
    const amountToSend = parsedAmount - platform_fee

    const txJson = {
      TransactionType: 'Payment',
      Destination: org.wallet_address,
      Amount: (amountToSend * 1_000_000).toString()
    }

    let payload
    try {
      payload = await xumm.payload.create({
        txjson: txJson,
        options: {
          submit: true,
          expire: 300,
          return_url: {
            app: callbackUrl || null,
            web: callbackUrl || null
          }
        }
      })
    } catch (err) {
      console.error('xumm.payload.create error:', err)
      return NextResponse.json(
        { error: 'XUMM payload creation error', details: err.message },
        { status: 500 }
      )
    }

    if (!payload || !payload.uuid) {
      console.error('XUMM payload is null:', payload)
      return NextResponse.json(
        { error: 'Failed to create XUMM payload' },
        { status: 500 }
      )
    }

    const { data: donation, error: insertError } = await supabase
      .from('donations')
      .insert({
        user_id,
        org_id,
        amount: parsedAmount,
        platform_fee,
        status: 'pending'
      })
      .select('id')
      .single()

    if (insertError || !donation) {
      console.error('Donation insert error:', insertError)
      return NextResponse.json(
        { error: 'Failed to record donation', details: insertError?.message || 'no data returned' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      donation_id: donation.id,
      payload: {
        uuid: payload.uuid,
        qrcode: payload.refs.qr_png,
        link: payload.next.always
      }
    })

  } catch (error) {
    console.error('Transaction creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}

// GET → Vérifie le statut et met à jour la donation et l'utilisateur
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const uuid = searchParams.get('uuid')
    const donation_id = searchParams.get('donation_id')

    if (!uuid || !donation_id) {
      return NextResponse.json(
        { error: 'Missing parameters: uuid and donation_id are required' },
        { status: 400 }
      )
    }

    let payload
    try {
      payload = await xumm.payload.get(uuid)
    } catch (err) {
      console.error('xumm.payload.get error:', err)
      return NextResponse.json(
        { error: 'XUMM payload retrieval error', details: err.message },
        { status: 500 }
      )
    }

    if (!payload || !payload.meta) {
      return NextResponse.json({ error: 'Payload not found or invalid' }, { status: 404 })
    }

    if (payload.meta.expired) {
      await supabase
        .from('donations')
        .update({ status: 'expired' })
        .eq('id', donation_id)

      return NextResponse.json({ status: 'expired' })
    }

    if (payload.meta.resolved) {
      const signed = payload.meta.signed

      if (signed) {
        const txHash = payload.response?.txid || null

        const { data: donation } = await supabase
          .from('donations')
          .update({
            tx_hash: txHash,
            status: 'completed'
          })
          .eq('id', donation_id)
          .select('user_id, amount')
          .single()

        // Mise à jour automatique des données utilisateur 🎯
        if (donation) {
          const { user_id, amount } = donation

          // Récupérer les données actuelles de l'utilisateur
          const { data: user } = await supabase
            .from('users')
            .select('donation_count, total_donated, xp')
            .eq('id', user_id)
            .single()

          if (user) {
            await supabase
              .from('users')
              .update({
                donation_count: (user.donation_count || 0) + 1,
                total_donated: (user.total_donated || 0) + amount,
                xp: (user.xp || 0) + Math.floor(amount * 10), // 1 XRP = 10 XP (exemple)
                last_donation: new Date().toISOString()
              })
              .eq('id', user_id)
          }
        }

        return NextResponse.json({
          status: 'resolved',
          signed: true,
          txid: txHash,
          transactionUrl: txHash
            ? `https://testnet.xrpl.org/transactions/${txHash}`
            : null
        })
      } else {
        await supabase
          .from('donations')
          .update({ status: 'failed' })
          .eq('id', donation_id)

        return NextResponse.json({ status: 'failed' })
      }
    }

    return NextResponse.json({ status: 'pending' })

  } catch (error) {
    console.error('Status check error:', error)
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    )
  }
}
