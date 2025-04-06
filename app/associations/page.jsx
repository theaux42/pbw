'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function AssociationsPage() {
  const [orgs, setOrgs] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrgs() {
      try {
        const res = await fetch('/api/organizations')
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        setOrgs(data.organizations || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [])

  if (error) {
    return (
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 px-4 py-12 md:px-8"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-6 shadow-lg"
          >
            <motion.p 
              animate={{ x: [0, 5, -5, 5, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-red-300 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              Une erreur est survenue : {error}
            </motion.p>
          </motion.div>
        </div>
      </motion.main>
    )
  }

  return (
    <motion.main 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-12 md:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <div className="mb-16 relative">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1.5 }}
            className="absolute -top-20 -left-20 w-64 h-64 bg-green-500/5 rounded-full blur-3xl"
          ></motion.div>
          <motion.h1 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, type: "spring" }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent relative z-10"
          >
            Découvrez les Associations
          </motion.h1>
          <motion.p 
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-gray-400 max-w-2xl text-lg"
          >
            Explorez et soutenez les associations qui acceptent les dons en XRP.
          </motion.p>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "5rem" }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-8 h-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"
          ></motion.div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {[1, 2, 3].map((i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="relative overflow-hidden backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 shadow-xl"
                >
                  <div className="animate-pulse bg-gray-800/50 h-48"></div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-5">
                      <div className="animate-pulse bg-gray-700 w-12 h-12 rounded-full"></div>
                      <div className="animate-pulse bg-gray-700 h-6 w-32 rounded-md"></div>
                    </div>
                    <div className="animate-pulse bg-gray-700 h-4 w-full rounded mb-2"></div>
                    <div className="animate-pulse bg-gray-700 h-4 w-3/4 rounded mb-4"></div>
                    <div className="flex justify-between mt-6">
                      <div className="animate-pulse bg-gray-700 h-4 w-32 rounded"></div>
                      <div className="animate-pulse bg-gray-700 h-4 w-16 rounded"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : orgs.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, type: "spring" }}
              className="backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 p-10 text-center shadow-xl"
            >
              <motion.svg 
                initial={{ opacity: the0, scale: 0.5, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="w-16 h-16 mx-auto text-gray-600 mb-4" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </motion.svg>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-xl text-gray-400"
              >
                Aucune association n'est disponible pour le moment.
              </motion.p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-2 text-gray-500"
              >
                Revenez bientôt pour découvrir de nouveaux projets à soutenir.
              </motion.p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
            >
              {orgs.map((org, index) => (
                <motion.div
                  key={org.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ 
                    duration: 0.5, 
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 100
                  }}
                >
                  <Link
                    href={`/association-full/${org.id}`}
                    className="group relative backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 shadow-xl overflow-hidden block"
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/0"
                      whileHover={{ 
                        background: 'linear-gradient(to right, rgba(34, 197, 94, 0.05), rgba(16, 185, 129, 0.1))',
                      }}
                      transition={{ duration: 0.5 }}
                    ></motion.div>
                    
                    <div className="relative h-52">
                      {org.banner_url ? (
                        <>
                          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent z-10" />
                          <motion.img
                            src={org.banner_url}
                            alt=""
                            whileHover={{ scale: 1.05 }}
                            transition={{ duration: 0.5 }}
                            className="w-full h-full object-cover"
                          />
                        </>
                      ) : (
                        <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
                      )}
                      
                      {org.logo_url && (
                        <div className="absolute bottom-0 left-6 transform translate-y-1/2 z-20">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="p-1 bg-gray-900/80 backdrop-blur-sm rounded-full border-2 border-green-500/30 group-hover:border-green-400/50 transition-all duration-300"
                          >
                            <img
                              src={org.logo_url}
                              alt={`${org.name} logo`}
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          </motion.div>
                        </div>
                      )}
                    </div>

                    <div className="p-6 pt-12">
                      <motion.h2
                        whileHover={{ scale: 1.02 }}
                        className="text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent group-hover:from-green-300 group-hover:to-emerald-300 transition-all duration-300"
                      >
                        {org.name}
                      </motion.h2>

                      <p className="text-gray-400 mt-4 mb-6 line-clamp-2 group-hover:text-gray-300 transition-colors">
                        {org.description || 'Aucune description disponible.'}
                      </p>

                      {org.total_received && (
                        <motion.div 
                          whileHover={{ scale: 1.05 }}
                          className="mb-4 inline-flex items-center px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-sm"
                        >
                          <span className="mr-1 text-gray-400">Reçu:</span>
                          <span className="font-medium text-green-400">{org.total_received}</span>
                        </motion.div>
                      )}

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
                        <div className="flex items-center space-x-2 text-xs font-mono text-gray-500 group-hover:text-gray-400 transition-colors">
                          <motion.svg 
                            animate={{ rotate: [0, 5, 0] }}
                            transition={{ repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                            className="w-4 h-4 text-green-500/70" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                              d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                            />
                          </motion.svg>
                          <span className="truncate max-w-[120px]">
                            {org.wallet_address}
                          </span>
                        </div>
                        
                        <motion.span 
                          whileHover={{ x: 5 }}
                          className="flex items-center text-sm font-medium text-green-400 group-hover:text-green-300 transition-all duration-300"
                        >
                          Voir plus
                          <motion.svg 
                            whileHover={{ x: 3 }}
                            transition={{ type: "spring", stiffness: 400 }}
                            className="w-4 h-4 ml-1" 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                          </motion.svg>
                        </motion.span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  )
}