import { XummSdk } from 'xumm-sdk'

// Instancier le SDK Xumm avec vos clés
const xumm = new XummSdk(
  process.env.XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

// La route POST va créer un payload "SignIn" et renvoyer UUID / QR / lien
export async function POST() {
  try {
    const payload = await xumm.payload.create({
      txjson: { TransactionType: 'SignIn' }
    })

    // Retourne un JSON
    return new Response(JSON.stringify({
      uuid: payload.uuid,
      qr: payload.refs.qr_png,
      link: payload.next.always
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('[Login Error]', error)
    return new Response(JSON.stringify({
      error: 'Xumm login failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
