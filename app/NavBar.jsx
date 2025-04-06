'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NavBar() {
  const [account, setAccount] = useState(null)
  const [activeItem, setActiveItem] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('xumm_account')
    if (stored) {
      setAccount(stored)
    }
    
    // Set active item based on current path
    const path = window.location.pathname
    if (path === '/') setActiveItem('home')
    else if (path === '/associations') setActiveItem('associations')
    else if (path === '/about') setActiveItem('about')
    else if (path === '/profile') setActiveItem('profile')
  }, [])

  const navItems = [
    { name: 'associations', label: 'Associations', path: '/associations' },
    { name: 'about', label: 'À propos', path: '/about' },
    { name: 'profile', label: account ? 'Profil' : 'Se connecter', path: account ? '/profile' : '/login', isButton: true },
    { name: 'leaderboard', label: 'Leaderboard', path: '/leaderboard', isButton: true } // Nouveau bouton ajouté
  ]

  return (
    <motion.nav 
      className="sticky top-0 z-50 backdrop-blur-xl border-b border-gray-800/50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo on left */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-shrink-0"
          >
            <Link href="/" className="relative">
              <motion.span 
                className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                FundXR
              </motion.span>
              {(activeItem === 'home' || !activeItem) && (
                <motion.div 
                  className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                  layoutId="underline"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          </motion.div>

          {/* Navigation Items on right (Dock Style) */}
          <div className="flex items-center space-x-2 md:space-x-8">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                className="relative flex items-center justify-center"
                whileHover={{ y: -5 }}
              >
                {item.isButton ? (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link 
                      href={item.path} 
                      className="relative px-6 py-2.5 rounded-xl text-sm font-medium 
                        bg-gradient-to-r from-green-500/20 to-emerald-500/20 
                        border border-green-500/30 text-green-400
                        transition-all duration-200 group"
                    >
                      <motion.span
                        className="relative z-10"
                      >
                        {item.label}
                      </motion.span>
                      <motion.div 
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 bg-gradient-to-r from-green-500/30 to-emerald-500/30 blur-sm"
                        transition={{ duration: 0.3 }}
                      />
                    </Link>
                  </motion.div>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link href={item.path} className="relative text-gray-300 hover:text-green-400 transition-colors text-sm font-medium">
                      <motion.span>{item.label}</motion.span>
                      {activeItem === item.name && (
                        <motion.div 
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
                          layoutId="underline"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </Link>
                  </motion.div>
                )}
                
                {/* Glow effect only for active items, not on hover */}
                {activeItem === item.name && (
                  <motion.div
                    className="absolute bottom-0 w-full h-1 rounded-full bg-green-500/20 filter blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.nav>
  )
}