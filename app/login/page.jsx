'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [account, setAccount] = useState(null)
  const [payload, setPayload] = useState(null)
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    const checkUserAndRedirect = async () => {
      const stored = localStorage.getItem('xumm_account')
      if (stored) {
        try {
          const res = await fetch(`/api/user/get-user-data?wallet=${stored}`)
          const userData = await res.json()
          
          console.log('User data:', userData);
          
          if (userData.exists) {
            router.push('/profile')
          } else {
            router.push('/on-boarding')
          }
        } catch (err) {
          console.error('Error checking user data:', err)
          router.push('/profile')
        }
      }
    }
    
    checkUserAndRedirect()
  }, [router])

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

            // Vérifier si l'utilisateur existe avant de rediriger
            try {
              const userRes = await fetch(`/api/user/get-user-data?wallet=${data.account}`)
              const userData = await userRes.json()
              
              console.log('User data after login:', userData);
              
              // Store user UUID if it exists
              if (userData.exists && userData.user && userData.user.id) {
                localStorage.setItem('user_uuid', userData.user.id);
              }
              
              // Rediriger selon l'existence de l'utilisateur
              if (userData.exists) {
                router.push('/profile')
              } else {
                router.push('/on-boarding')
              }
            } catch (err) {
              console.error('Error checking user after login:', err)
              router.push('/on-boarding') // Par défaut, aller à l'onboarding
            }
          }
        } catch (err) {
          console.error('[Polling Error]', err)
        }
      }, 3000)
    }
    return () => clearInterval(interval)
  }, [payload, account, router])

  // Génére un payload Xumm via /api/xumm/login (POST)
  const handleLogin = async () => {
    try {
      setPayload(null)
      setAccount(null)

      const res = await fetch('/api/xumm/login', {
        method: 'POST',
      })

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

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md w-full bg-white shadow-md rounded p-6">
        <h1 className="text-xl font-bold mb-4">Connexion via Xumm</h1>
        <p className="mb-4 text-gray-600">
          Scannez le QR ou utilisez l'appli Xumm pour vous connecter.
        </p>

        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Générer un QR Xumm
        </button>

        {payload && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Scannez ce QR code :
            </p>
            <img
              src={payload.qr}
              alt="QR Xumm"
              className="mx-auto w-48 h-48 mb-2"
            />
            <p className="text-sm text-gray-600">
              Ou lien mobile :
            </p>
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
    </main>
  )
}