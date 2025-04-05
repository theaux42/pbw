'use client'
import React, { useState } from 'react'

export default function Page() {
  const [address, setAddress] = useState("rPaCLUhWq2vEwBKRtYFRCydbJNNEBAm35n")
  const [tab, setTab] = useState("wallet")
  const [walletInfo, setWalletInfo] = useState(null)
  const [nfts, setNfts] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchWalletData = async () => {
    setLoading(true)
    try {
      const [walletRes, nftRes] = await Promise.all([
        fetch(`/api/wallet?address=${address}`),
        fetch(`/api/nfts?address=${address}`)
      ])
      const walletData = await walletRes.json()
      const nftData = await nftRes.json()

      setWalletInfo(walletData.result.account_data)

      const rawNFTs = nftData.result.account_nfts || []
      const detailedNFTs = await Promise.all(
        rawNFTs.map(async (nft) => {
          try {
            const uri = Buffer.from(nft.URI, "hex").toString("utf8")
            const meta = await fetch(uri).then(res => res.json())
            return { id: nft.NFTokenID, ...meta }
          } catch {
            return null
          }
        })
      )
      setNfts(detailedNFTs.filter(Boolean))
    } catch (err) {
      console.error("Fetch error", err)
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0D0D12] text-white font-sans px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-center text-white">XRPL Wallet Explorer</h1>

        <div className="flex gap-2 justify-center">
          <input
            className="px-4 py-2 rounded-lg bg-[#1A1A22] text-white border border-[#333] w-full max-w-md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter XRPL address"
          />
          <button
            onClick={fetchWalletData}
            disabled={loading}
            className="bg-[#8287F7] hover:bg-[#6366f1] text-white px-4 py-2 rounded-lg transition"
          >
            {loading ? "Loading..." : "Explore"}
          </button>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={() => setTab("wallet")}
            className={`px-4 py-2 rounded ${tab === "wallet" ? "bg-[#2A2A40]" : "bg-[#1A1A22]"}`}
          >
            Wallet Info
          </button>
          <button
            onClick={() => setTab("nfts")}
            className={`px-4 py-2 rounded ${tab === "nfts" ? "bg-[#2A2A40]" : "bg-[#1A1A22]"}`}
          >
            Owned NFTs
          </button>
        </div>

        {/* Wallet Info */}
        {tab === "wallet" && walletInfo && (
          <div className="bg-[#1A1A22] p-6 rounded-lg space-y-2 shadow-md">
            <p><span className="font-semibold">Address:</span> {walletInfo.Account}</p>
            <p><span className="font-semibold">Balance:</span> {parseFloat(walletInfo.Balance) / 1_000_000} XRP</p>
            <p><span className="font-semibold">Reserve:</span> {parseFloat(walletInfo.OwnerCount) * 2 + 10} XRP (est.)</p>
            <p><span className="font-semibold">Sequence:</span> {walletInfo.Sequence}</p>
            <p><span className="font-semibold">Flags:</span> {walletInfo.Flags}</p>
          </div>
        )}

        {/* NFTs */}
        {tab === "nfts" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {nfts.length > 0 ? (
              nfts.map((nft) => (
                <div
                  key={nft.id}
                  className="bg-[#1A1A22] rounded-lg overflow-hidden shadow-md"
                >
                  <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{nft.name}</h2>
                    <p className="text-sm text-gray-400">{nft.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 col-span-full">Aucun NFT trouvé</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
