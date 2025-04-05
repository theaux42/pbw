'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function AssociationFullPage() {
  const router = useRouter()
  const params = useParams()
  const { uuid } = params

  const [org, setOrg] = useState(null)
  const [error, setError] = useState(null)

  // Pour le formulaire de don
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyWallet = async () => {
    try {
      await navigator.clipboard.writeText(org.wallet_address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Récupérer l’organisation
  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`/api/organizations/${uuid}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        setOrg(data.organization)
      } catch (err) {
        setError(err.message)
      }
    }
    if (uuid) {
      fetchOrg()
    }
  }, [uuid])

  // Gère la logique de don (placeholder)
  const handleDonation = () => {
    const amount = customAmount ? parseFloat(customAmount) : selectedAmount
    if (!amount || amount < 1) {
      alert('Montant invalide')
      return
    }
    // Ici, vous pouvez lancer la logique de transaction Xumm,
    // ex: payload pour don vers org.wallet_address.
    alert(`Vous souhaitez faire un don de ${amount} XRP à ${org?.name}`)
  }

  if (error) {
    return (
      <main className="mt-8">
        <p className="text-red-300">Erreur : {error}</p>
      </main>
    )
  }

  if (!org) {
    return (
      <main className="mt-8">
        <p>Chargement en cours...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-8 md:px-8">
      {/* Banner avec overlay gradient */}
      {org.banner_url && (
        <div className="relative w-full h-56 md:h-72 lg:h-80 rounded-3xl overflow-hidden mb-8">
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
          <img
            src={org.banner_url}
            alt="Banner"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info Card - Prend 2 colonnes */}
        <div className="lg:col-span-2">
          <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
              {org.name}
            </h1>
            <button 
              onClick={handleCopyWallet}
              className="group flex items-center space-x-2 mb-6 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg px-3 py-2 w-fit transition-all duration-200"
            >
              <svg className="w-4 h-4 text-green-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <span className="text-xs font-mono text-gray-400/70 group-hover:text-gray-300 transition-colors">
                {copySuccess ? 'Copié !' : org.wallet_address}
              </span>
            </button>
            <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
              {org.full_description || 'Pas de description complète.'}
            </p>
          </div>
        </div>

        {/* Donation Card - Prend 1 colonne et reste fixe */}
        <div className="lg:sticky lg:top-8 h-fit">
          <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl">
            <h2 className="text-2xl font-bold text-green-400 mb-6">Faire un don</h2>
            <p className="text-gray-400 mb-8">
              Choisissez un montant ou définissez le vôtre pour soutenir cette organisation.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[2, 5, 10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setSelectedAmount(amt)
                    setCustomAmount('')
                  }}
                  className={`
                    px-4 py-4 rounded-xl font-medium transition-all duration-200
                    ${selectedAmount === amt && !customAmount 
                      ? 'bg-green-500/20 text-green-400 border-2 border-green-500' 
                      : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border-2 border-transparent'}
                  `}
                >
                  {amt} XRP
                </button>
              ))}
            </div>

            {/* Custom amount input */}
            <div className="mb-8">
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Montant personnalisé"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value)
                    setSelectedAmount(null)
                  }}
                  className="w-full px-4 py-4 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 border-2 border-transparent"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">XRP</span>
              </div>
            </div>

            <button
              onClick={handleDonation}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-medium hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg shadow-green-500/20"
            >
              Confirmer le don
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}