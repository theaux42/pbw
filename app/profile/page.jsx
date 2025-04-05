'use client'

import { useState, useEffect } from 'react'

export default function ProfilePage() {
  const [account, setAccount] = useState(null)
  const [payload, setPayload] = useState(null)
  const [checking, setChecking] = useState(false)

  // Charger si déjà connecté
  useEffect(() => {
    const stored = localStorage.getItem('xumm_account')
    if (stored) {
      setAccount(stored)
    }
  }, [])

  // Polling Xumm
  useEffect(() => {
    let interval
    if (payload && !account) {
      setChecking(true)
      interval = setInterval(async () => {
        try {
          const res = await fetch(`/api/xumm/check/${payload.uuid}`)
          const data = await res.json()
          if (data.success) {
            setAccount(data.account)
            localStorage.setItem('xumm_account', data.account)
            setPayload(null)
            setChecking(false)
          }
        } catch (err) {
          console.error('[Polling Error]', err)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [payload, account])

  // Génére un payload Xumm
  const handleLogin = async () => {
    try {
      setPayload(null)
      setAccount(null)
      const res = await fetch('/api/xumm/login', { method: 'POST' })
      if (!res.ok) {
        throw new Error(`Login response not ok: ${res.status}`)
      }
      const data = await res.json()
      setPayload(data)
    } catch (err) {
      console.error('[handleLogin Error]', err)
      alert('Erreur lors de la génération du QR Xumm')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('xumm_account')
    setAccount(null)
  }

  return (
    <main className="mt-8 flex flex-col items-center">
      <div className="
        bg-white/90 text-gray-800 rounded-lg shadow p-6 w-full 
        max-w-md
      ">
        {account ? (
          <div>
            <h1 className="text-2xl font-bold mb-2">Mon Profil</h1>
            <p className="mb-4">
              Connecté en tant que : 
              <span className="font-semibold"> {account}</span>
            </p>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Se déconnecter
            </button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-2">Connexion Xumm</h1>
            <p className="text-sm text-gray-600 mb-4">
              Scannez le QR ou cliquez sur le lien mobile pour signer.
            </p>
            <button
              onClick={handleLogin}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Générer QR Xumm
            </button>

            {payload && (
              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600 mb-2">
                  Scannez ce QR code :
                </p>
                <img
                  src={payload.qr}
                  alt="QR Xumm"
                  className="mx-auto w-48 h-48 mb-2"
                />
                <p className="text-sm text-gray-600">Ou lien mobile :</p>
                <a
                  href={payload.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-500 underline break-all"
                >
                  {payload.link}
                </a>
                {checking && (
                  <p className="text-orange-500 mt-4">En attente de signature...</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
