'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import useConfetti from "canvas-confetti";

export default function AssociationFullPage() {
  const router = useRouter()
  const params = useParams()
  const { uuid } = params

  const [org, setOrg] = useState(null)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  // Pour le formulaire de don
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // États pour la transaction XUMM
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [payloadUuid, setPayloadUuid] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [xummLink, setXummLink] = useState(null)

  // For status polling
  const [isPolling, setIsPolling] = useState(false)

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

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    async function fetchUserData() {
      try {
        // Récupérer l'adresse du wallet stockée localement
        const walletAddress = localStorage.getItem('xumm_account')
        
        if (!walletAddress) {
          console.log('Aucun utilisateur connecté')
          return
        }
        
        // Récupérer les données de l'utilisateur
        const res = await fetch(`/api/user/get-user-data?xumm_id=${walletAddress}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        
        const data = await res.json()
        if (data.exists && data.user) {
          setUserData(data.user)
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err)
      }
    }
    
    fetchUserData()
  }, [])

  // Gère la logique de don avec l'API XUMM
  const handleDonation = async () => {
    const donationAmount = customAmount ? parseFloat(customAmount) : selectedAmount

    if (!donationAmount || donationAmount < 1) {
      setTransactionStatus({ type: 'error', message: 'Le montant minimum de don est de 1 XRP' })
      return
    }

    if (!org.wallet_address) {
      setTransactionStatus({ type: 'error', message: 'Adresse du wallet de l\'organisation non disponible' })
      return
    }

    // Vérifier si l'utilisateur est connecté
    const walletAddress = localStorage.getItem('xumm_account')
    if (!walletAddress) {
      setTransactionStatus({ 
        type: 'error', 
        message: 'Vous devez être connecté pour faire un don' 
      })
      // Rediriger vers la page de connexion après un délai
      setTimeout(() => {
        router.push('/login')
      }, 2000)
      return
    }

    // Si nous n'avons pas encore les données utilisateur, les récupérer maintenant
    let userId = userData?.id
    
    if (!userId) {
      try {
        const res = await fetch(`/api/user/get-user-data?xumm_id=${walletAddress}`)
        if (!res.ok) {
          throw new Error(`Erreur HTTP ${res.status}`)
        }
        
        const data = await res.json()
        console.log('Données utilisateur récupérées:', data)
        
        if (data.error) {
          // Une erreur s'est produite lors de la récupération des données
          throw new Error(data.error)
        }
        
        if (data.user && data.user.id) {
          userId = data.user.id
          setUserData(data.user)
        } else {
          // L'utilisateur n'existe pas dans la base de données
          setTransactionStatus({  
            type: 'error', 
            message: 'Votre profil n\'est pas complet. Redirection vers la page d\'accueil...' 
          })
          setTimeout(() => {
            router.push('/on-boarding')
          }, 2000) // Reduced from 20000000 to a more reasonable 2 seconds
          return
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err)
        setTransactionStatus({ 
          type: 'error', 
          message: `Impossible de récupérer vos informations utilisateur: ${err.message}` 
        })
        return
      }
    }

    try {
      setTransactionLoading(true)
      setTransactionStatus({ type: 'info', message: 'Préparation de votre transaction...' })

      // Appel à l'API XUMM avec l'ID utilisateur correct
      const response = await fetch('/api/xumm/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orgId: uuid,
          userId: userId, // Utiliser l'ID de l'utilisateur connecté
          platformFee: 0,
          nftId: null,
          destination: org.wallet_address,
          amount: donationAmount,
          callbackUrl: window.location.href, // Retour à la page actuelle
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erreur lors de la création de la transaction')
      }

      const data = await response.json()

      if (data.success) {
        // Stocker les infos de la transaction
        setPayloadUuid(data.payload.uuid)
        setQrCode(data.payload.qrcode)
        setXummLink(data.payload.link)
        setTransactionStatus({
          type: 'success',
          message: 'Transaction prête ! Scannez le QR code avec l\'app XUMM ou cliquez sur le lien'
        })

        // Démarrer le polling pour vérifier le statut
        startPolling(data.payload.uuid)
      } else {
        throw new Error(data.error || 'Échec de la création de la transaction')
      }
    } catch (err) {
      console.error('Erreur de transaction:', err)
      setTransactionStatus({
        type: 'error',
        message: `Erreur: ${err.message}`
      })
    } finally {
      setTransactionLoading(false)
    }
  }

  // Fonction de polling pour vérifier le statut de la transaction
  const startPolling = (uuid) => {
    if (isPolling) return

    setIsPolling(true)

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/xumm/transactions?uuid=${uuid}`)
        const data = await response.json()

        if (data.error) {
          setTransactionStatus({ type: 'error', message: data.error })
          setIsPolling(false)
          return
        }

        if (data.status === 'resolved') {
          if (data.signed) {
            setTransactionStatus({
              type: 'success',
              message: 'Transaction signée avec succès!',
              txid: data.txid,
              transactionUrl: data.transactionUrl
            })
            // Animation de confetti
            useConfetti({
              particleCount: 140,
              spread: 90,
              origin: { y: 0.6 },
              colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0'] // Green color palette to match your theme
            });
          } else {
            setTransactionStatus({
              type: 'error',
              message: 'Transaction rejetée'
            })
          }
          setIsPolling(false)
          return
        }

        if (data.status === 'expired') {
          setTransactionStatus({
            type: 'error',
            message: 'La transaction a expiré'
          })
          setIsPolling(false)
          return
        }

        // If still pending, continue polling
        setTimeout(checkStatus, 3000)
      } catch (err) {
        console.error('Erreur lors de la vérification du statut:', err)
        setTransactionStatus({
          type: 'error',
          message: 'Erreur lors de la vérification du statut'
        })
        setIsPolling(false)
      }
    }

    checkStatus()
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
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            {/* Banner skeleton */}
            <div className="w-full h-56 md:h-72 lg:h-80 rounded-3xl overflow-hidden mb-8 bg-gray-800/30" />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Info Card skeleton */}
              <div className="lg:col-span-2">
                <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50">
                  <div className="h-12 w-2/3 bg-gray-700/50 rounded-lg mb-6" />
                  <div className="h-4 w-1/4 bg-gray-700/50 rounded mb-6" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-700/50 rounded w-full" />
                    <div className="h-4 bg-gray-700/50 rounded w-5/6" />
                    <div className="h-4 bg-gray-700/50 rounded w-4/6" />
                  </div>
                </div>
              </div>

              {/* Donation Card skeleton */}
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50">
                <div className="h-8 w-1/2 bg-gray-700/50 rounded-lg mb-6" />
                <div className="h-4 w-5/6 bg-gray-700/50 rounded mb-8" />
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-14 bg-gray-700/50 rounded-xl" />
                  ))}
                </div>
                <div className="h-14 bg-gray-700/50 rounded-xl mb-8" />
                <div className="h-14 bg-gray-700/50 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
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

            {/* Transaction status notification */}
            {transactionStatus && (
              <div className={`mb-6 p-4 rounded-lg ${
                transactionStatus.type === 'error' ? 'bg-red-950/50 text-red-300 border border-red-800/50' :
                transactionStatus.type === 'success' ? 'bg-green-950/50 text-green-300 border border-green-800/50' :
                'bg-blue-950/50 text-blue-300 border border-blue-800/50'
              }`}>
                <p>{transactionStatus.message}</p>
                {transactionStatus.txid && (
                  <a
                    href={transactionStatus.transactionUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-400 hover:underline mt-2 inline-block"
                  >
                    Voir la transaction
                  </a>
                )}
              </div>
            )}

            {/* QR Code display if available */}
            {qrCode && !transactionStatus?.txid && (
              <div className="mb-6 flex justify-center">
                <div className="bg-white p-2 rounded-lg">
                  <img src={qrCode} alt="QR Code XUMM" className="w-48 h-48" />
                </div>
              </div>
            )}

            {/* XUMM link if available */}
            {xummLink && !transactionStatus?.txid && (
              <div className="mb-6 text-center">
                <a
                  href={xummLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline"
                >
                  Ouvrir dans l'app XUMM
                </a>
              </div>
            )}

            {/* Only show amount selection if no active transaction */}
            {!qrCode && (
              <>
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
                  disabled={transactionLoading}
                  className={`w-full px-8 py-4 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all duration-200 
                    ${transactionLoading
                      ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}
                >
                  {transactionLoading ? 'Chargement...' : 'Confirmer le don'}
                </button>
              </>
            )}

            {/* Reset button when transaction is completed or failed */}
            {(transactionStatus?.txid || transactionStatus?.type === 'error') && (
              <button
                onClick={() => {
                  setTransactionStatus(null)
                  setPayloadUuid(null)
                  setQrCode(null)
                  setXummLink(null)
                }}
                className="w-full px-8 py-4 mt-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
              >
                Nouveau don
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}