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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-900/80 border-b border-gray-800/50">
      <div className="max-w-8xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-20">
          {/* Logo / Home */}
          <Link 
            href="/" 
            className="text-3xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent hover:opacity-80 transition-opacity font-mono"
          >
            FundXR
          </Link>

          <div className="flex items-center space-x-24 justify-between text-xl font-mono">
            <Link 
              href="/associations" 
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              NGOs
            </Link>
            <Link 
              href="/about" 
              className="text-gray-300 hover:text-green-400 transition-colors"
            >
              About
            </Link>
            
            {/* Profile/Login Button */}
            <Link 
              href="/profile" 
              className="px-10 py-4 rounded-2xl text-base text-xl 
                bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                hover:from-green-500/30 hover:to-emerald-500/30
                border border-green-500/30 text-green-400
                transition-all duration-200 font-mono"
            >
              {account ? 'Profile' : 'Log In'}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}