'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function NavBar() {
  const [account, setAccount] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('xumm_account')
    if (stored) {
      setAccount(stored)
    }
  }, [])

  const rightLabel = account ? 'Profil' : 'Se connecter'

  return (
    <nav className="
      flex items-center justify-between 
      bg-indigo-800/90 backdrop-blur 
      px-6 py-3 shadow
    ">
      {/* Logo / Accueil */}
      <Link href="/" className="text-xl font-bold hover:opacity-90">
        XRPact
      </Link>

      {/* Liens à droite */}
      <div className="space-x-6 text-sm font-semibold">
        <Link href="/associations" className="hover:text-teal-300">
          Associations
        </Link>
        <Link href="/about" className="hover:text-teal-300">
          À propos
        </Link>
        <Link href="/profile" className="hover:text-teal-300">
          {rightLabel}
        </Link>
      </div>
    </nav>
  )
}
