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

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/70 border-b border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Accueil */}
          <Link 
            href="/" 
            className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity"
          >
            XRPact
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            <Link 
              href="/associations" 
              className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium"
            >
              Associations
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-green-400 transition-colors text-sm font-medium"
            >
              À propos
            </Link>
            
            {/* Profile/Login Button */}
            <Link 
              href="/profile" 
              className="px-4 py-2 rounded-xl text-sm font-medium 
                bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                hover:from-green-500/30 hover:to-emerald-500/30
                border border-green-500/30 text-green-400
                transition-all duration-200"
            >
              {account ? 'Profil' : 'Se connecter'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}