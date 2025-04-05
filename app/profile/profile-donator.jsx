'use client'

import { useState, useEffect } from 'react'

export function ProfileDonatorPage({ account, onLogout })  {
    const [donations, setDonations] = useState([])
    
    // Charger les dons de l'utilisateur
    useEffect(() => {
        const fetchDonations = async () => {
        try {
            const res = await fetch(`/api/donations/${account}`)
            if (!res.ok) {
            throw new Error(`Fetch donations response not ok: ${res.status}`)
            }
            const data = await res.json()
            setDonations(data)
        } catch (err) {
            console.error('[Fetch Donations Error]', err)
        }
        }
    
        if (account) {
        fetchDonations()
        }
    }, [account])
    
    return (
        <main className="mt-8">
        <h1 className="text-3xl font-bold mb-4">Mon Profil</h1>
        <p className="text-gray-100">
            Bienvenue sur votre page de profil, {account}. Voici vos dons :
        </p>
        <ul className="mt-4">
            {donations.map((donation) => (
            <li key={donation.id} className="mb-2">
                {donation.amount} XRP à {donation.charity_name}
            </li>
            ))}
        </ul>
        <button onClick={onLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">
            Se déconnecter
        </button>
        </main>
    )
}

