import Link from 'next/link'
import { FaHistory } from 'react-icons/fa'
import { HiOutlineGift } from 'react-icons/hi'

export default function DonationHistory({ userData, formatDate }) {
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
          <div className="bg-gray-800/40 rounded-xl p-6 text-center">
            <p className="text-gray-300 mb-3">Donation history feature coming soon!</p>
            <p className="text-sm text-gray-400">We're working on adding detailed donation history.</p>
          </div>
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
