'use client'

import { useState, useEffect } from 'react'

export default function AssociationsPage() {
  const [orgs, setOrgs] = useState([])
  const [error, setError] = useState(null)

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
      }
    }
    fetchOrgs()
  }, [])

  return (
    <main className="mt-8">
      <h1 className="text-3xl font-bold mb-6">Associations</h1>

      {error && (
        <p className="text-red-400 mb-4">
          Erreur lors du chargement: {error}
        </p>
      )}

      {orgs.length === 0 && !error ? (
        <p className="text-gray-200">Aucune association trouvée.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {orgs.map((org) => (
            <div
              key={org.id}
              className="
                bg-white/90 text-gray-800 rounded-lg shadow p-4 flex
                hover:shadow-lg transition-shadow
              "
            >
              {org.logo_url && (
                <img
                  src={org.logo_url}
                  alt={org.name}
                  className="w-16 h-16 object-cover rounded-full mr-4"
                />
              )}
              <div>
                <h2 className="text-xl font-bold mb-1">{org.name}</h2>
                <p className="text-sm text-gray-600 mb-1">
                  {org.description || 'Aucune description.'}
                </p>
                <p className="text-sm text-teal-700 font-semibold">
                  Wallet: {org.wallet_address}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  )
}
