'use client' // Obligatoire pour pouvoir utiliser useState/useEffect

import { useState, useEffect } from 'react'

export default function HomePage() {
  const [account, setAccount] = useState(null)
  const [payload, setPayload] = useState(null)
  const [checking, setChecking] = useState(false)

  // Au premier chargement, on récupère l'adresse si déjà stockée
  useEffect(() => {
    const saved = localStorage.getItem('xumm_account')
    if (saved) setAccount(saved)
  }, [])

  // Polling: vérifie toutes les 3s si le payload a été signé
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
            clearInterval(interval)
          }
        } catch (err) {
          console.error('[Polling Error]', err)
        }
      }, 3000)
    }

    return () => clearInterval(interval)
  }, [payload, account])

  // Génére un payload Xumm via /api/xumm/login (POST)
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
      alert('Erreur lors du login')
    }
  }

  // Logout => supprime l'adresse stockée
  const handleLogout = () => {
    setAccount(null)
    localStorage.removeItem('xumm_account')
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>XRPact - Xumm Login</h1>
      {account ? (
        <div>
          <p>Connecté : <strong>{account}</strong></p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <button onClick={handleLogin}>Login via Xumm</button>
          {payload && (
            <div style={{ marginTop: 20 }}>
              <p>Scannez ce QR code :</p>
              <img src={payload.qr} alt="QR Xumm" style={{ width: '150px' }} />
              <p>Ou utilisez le lien mobile :</p>
              <a href={payload.link} target="_blank" rel="noreferrer">
                {payload.link}
              </a>
              {checking && <p>En attente de signature...</p>}
            </div>
          )}
        </div>
      )}
    </main>
  )
}
