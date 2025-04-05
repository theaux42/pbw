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

  // Le label de droite selon connexion
  const rightLabel = account ? 'Profil' : 'Se connecter'
  // Le lien pointe toujours vers "/profile"
  // (la page gère le fait d’afficher le QR ou les infos)

  return (
    <nav className="flex items-center justify-between bg-zinc-200 shadow px-4 py-2">
      {/* À gauche : Accueil */}
      <Link href="/" className="text-lg font-bold">
        Accueil
      </Link>

      {/* À droite : Associations, À propos, Profil/Se connecter */}
      <div className="space-x-6">
        <Link href="/associations" className="hover:underline">
          Associations
        </Link>
        <Link href="/about" className="hover:underline">
          A propos
        </Link>
        <Link href="/profile" className="hover:underline">
          {rightLabel}
        </Link>
      </div>
    </nav>
  )
}
