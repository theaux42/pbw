'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

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
      <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 px-4 py-8 md:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-red-500/10 border border-red-500/20 rounded-2xl p-4">
            <p className="text-red-300">Une erreur est survenue : {error}</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            Découvrez les Associations
          </h1>
          <p className="mt-4 text-gray-400 max-w-2xl">
            Explorez et soutenez les associations qui acceptent les dons en XRP.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 h-[300px]" />
            ))}
          </div>
        ) : orgs.length === 0 ? (
          <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 p-8 text-center">
            <p className="text-gray-400">Aucune association n'est disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {orgs.map((org) => (
              <Link
                key={org.id}
                href={`/association-full/${org.id}`}
                className="group backdrop-blur-xl bg-gray-800/30 rounded-3xl border border-gray-700/50 shadow-xl overflow-hidden transition-all duration-200 hover:border-green-500/30 hover:shadow-green-500/10"
              >
                <div className="relative h-48">
                  {org.banner_url ? (
                    <>
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" />
                      <img
                        src={org.banner_url}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </>
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-gray-800 to-gray-900" />
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-4 mb-4">
                    {org.logo_url && (
                      <img
                        src={org.logo_url}
                        alt={`${org.name} logo`}
                        className="w-12 h-12 rounded-full border-2 border-green-500/20"
                      />
                    )}
                    <h2 className="text-xl font-bold text-green-400 group-hover:text-green-300 transition-colors">
                      {org.name}
                    </h2>
                  </div>

                  <p className="text-gray-400 mb-4 line-clamp-2">
                    {org.description || 'Aucune description disponible.'}
                  </p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" 
                        />
                      </svg>
                      <span className="truncate max-w-[150px]">
                        {org.wallet_address}
                      </span>
                    </div>
                    
                    <span className="text-xs text-green-500 group-hover:translate-x-1 transition-transform">
                      Voir plus →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}