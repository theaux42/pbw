export async function GET(request) {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address")
  
    const body = {
      method: "account_nfts",
      params: [{ account: address }],
    }
  
    try {
      const response = await fetch("https://s.altnet.rippletest.net:51234", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
  
      const data = await response.json()
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    } catch (err) {
      console.error("Erreur XRPL:", err)
      return new Response(JSON.stringify({ error: "Erreur XRPL" }), {
        status: 500,
      })
    }
  }
  