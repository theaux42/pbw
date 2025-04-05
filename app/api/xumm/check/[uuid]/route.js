import { XummSdk } from 'xumm-sdk'

const xumm = new XummSdk(
  process.env.XUMM_API_KEY,
  process.env.XUMM_API_SECRET
)

// Pour GET /api/xumm/check/[uuid], on récupère le paramètre via context.params.uuid
export async function GET(request, context) {
  const { uuid } = context.params

  if (!uuid) {
    return new Response(JSON.stringify({ error: 'Missing UUID' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })
  }

  try {
    const result = await xumm.payload.get(uuid)

    if (result.meta.signed) {
      // Signé => renvoie success + account
      return new Response(JSON.stringify({
        success: true,
        account: result.response.account
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    } else {
      // Pas encore signé => success = false
      return new Response(JSON.stringify({ success: false }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  } catch (error) {
    console.error('[Check Error]', error)
    return new Response(JSON.stringify({
      error: 'Xumm check failed'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
