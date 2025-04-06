import Link from 'next/link'
import { FaHistory, FaExternalLinkAlt } from 'react-icons/fa'
import { HiOutlineGift } from 'react-icons/hi'
import { useState, useEffect } from 'react'
import Image from 'next/image'

export default function DonationHistory({ userData, formatDate }) {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDonationHistory() {
      if (!userData?.xumm_id) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/user/get-user-donation?wallet_address=${userData.xumm_id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch donation history');
        }
        
        const data = await response.json();
        setDonations(data.donations || []);
      } catch (err) {
        console.error('Error fetching donation history:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchDonationHistory();
  }, [userData?.xumm_id]);

  return (
    <div>
      {/* Donation Summary */}
      <div className="bg-gray-800/60 rounded-xl p-5 mb-6">
        <div className="flex items-center mb-4">
          <FaHistory className="text-green-400 mr-2 text-xl" />
          <h3 className="text-lg font-semibold">Donation Summary</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-2">
          <div>
            <p className="text-gray-400 text-sm">Total Donated</p>
            <p className="text-2xl font-bold">{userData.total_donated} XRP</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Donation Count</p>
            <p className="text-xl font-semibold">{userData.donation_count}</p>
          </div>
          <div>
            <p className="text-gray-400 text-sm">Last Donation</p>
            <p className="text-xl font-semibold">{formatDate(userData.last_donation)}</p>
          </div>
        </div>
      </div>
      
      {userData.donation_count > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xl font-bold mb-4">Recent Donations</h3>
          
          {loading ? (
            <div className="bg-gray-800/40 rounded-xl p-6 text-center">
              <p className="text-gray-300">Loading donation history...</p>
            </div>
          ) : error ? (
            <div className="bg-gray-800/40 rounded-xl p-6 text-center">
              <p className="text-red-400">Error loading donation history: {error}</p>
            </div>
          ) : donations.length === 0 ? (
            <div className="bg-gray-800/40 rounded-xl p-6 text-center">
              <p className="text-gray-300">No donation history found for your wallet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {donations.map((donation) => (
                <div key={donation.id} className="bg-gray-800/40 rounded-xl p-4 hover:bg-gray-700/50 transition">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      {donation.organization.logo_url && (
                        <div className="w-10 h-10 mr-3 relative rounded-full overflow-hidden">
                          <Image 
                            src={donation.organization.logo_url} 
                            alt={donation.organization.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium">{donation.organization.name}</h4>
                        <p className="text-sm text-gray-400">{formatDate(donation.created_at)}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">{donation.amount} XRP</p>
                      <p className="text-xs text-gray-400">Fee: {donation.platform_fee || 0} XRP</p>
                    </div>
                  </div>
                  
                  {donation.tx_hash && (
                    <div className="text-xs flex justify-end mt-2">
                      <a 
                        href={`https://xrpscan.com/tx/${donation.tx_hash}`}
                        target="_blank"
                        rel="noopener noreferrer" 
                        className="text-blue-400 hover:text-blue-300 flex items-center"
                      >
                        View Transaction <FaExternalLinkAlt className="ml-1" />
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-10">
          <HiOutlineGift className="text-5xl text-gray-600 mx-auto mb-3" />
          <h3 className="text-xl font-semibold mb-2">No Donations Yet</h3>
          <p className="text-gray-400 mb-4">Make your first donation to start your journey!</p>
          <Link 
            href="/associations"
            className="bg-green-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 inline-block font-medium"
          >
            Browse Causes
          </Link>
        </div>
      )}
    </div>
  )
}
