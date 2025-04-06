import { motion } from 'framer-motion'
import { FaWallet, FaCoins, FaHistory, FaCalendarAlt, FaSignOutAlt } from 'react-icons/fa'
import { HiOutlineGift } from 'react-icons/hi'

export default function ProfileSidebar({ userData, calculateLevel, calculateProgress, formatDate, getLevelTitle, handleLogout }) {
  return (
    <motion.div 
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="lg:col-span-4 bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-6 border border-green-400/30"
    >
      <div className="flex flex-col items-center">
        {/* Profile Header with Avatar and Level Badge */}
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400 mb-4">
            <img 
              src={userData.pic_url || "https://via.placeholder.com/200"} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-400 rounded-full p-2 border-2 border-gray-900">
            <span className="font-bold text-gray-900">Lvl {calculateLevel(userData.xp)}</span>
          </div>
        </div>
        
        {/* Username and Title */}
        <h1 className="text-2xl font-bold mt-2">{userData.username}</h1>
        <p className="text-green-400 font-medium">
          {getLevelTitle(calculateLevel(userData.xp))}
        </p>
        
        {/* XP Progress Bar */}
        <div className="w-full mt-4 mb-2">
          <div className="flex justify-between text-xs mb-1">
            <span>XP: {userData.xp}</span>
            <span>Next: {Math.pow(calculateLevel(userData.xp), 2) * 100}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div 
              className="bg-green-400 h-2.5 rounded-full" 
              style={{ width: `${calculateProgress(userData.xp)}%` }}
            ></div>
          </div>
        </div>
        
        {/* User Stats Cards */}
        <div className="w-full grid grid-cols-2 gap-3 mt-6">
          <div className="bg-gray-800/60 rounded-xl p-4 text-center">
            <FaCoins className="text-yellow-500 text-xl mx-auto mb-2" />
            <p className="text-xs text-gray-400">Total Donated</p>
            <p className="text-xl font-bold">{userData.total_donated} XRP</p>
          </div>
          
          <div className="bg-gray-800/60 rounded-xl p-4 text-center">
            <HiOutlineGift className="text-green-400 text-xl mx-auto mb-2" />
            <p className="text-xs text-gray-400">Donations</p>
            <p className="text-xl font-bold">{userData.donation_count}</p>
          </div>
        </div>
        
        {/* User Info */}
        <div className="mt-6 w-full">
          <div className="bg-gray-800/60 rounded-lg p-3 mb-3">
            <div className="flex items-center">
              <FaWallet className="text-gray-400 mr-2" />
              <div className="flex-1 overflow-hidden">
                <p className="text-xs text-gray-400">Wallet Address</p>
                <p className="text-sm truncate">{userData.xumm_id}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/60 rounded-lg p-3 mb-3">
            <div className="flex items-center">
              <FaCalendarAlt className="text-gray-400 mr-2" />
              <div>
                <p className="text-xs text-gray-400">Member Since</p>
                <p>{formatDate(userData.created_at)}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800/60 rounded-lg p-3 mb-5">
            <div className="flex items-center">
              <FaHistory className="text-gray-400 mr-2" />
              <div>
                <p className="text-xs text-gray-400">Last Donation</p>
                <p>{formatDate(userData.last_donation)}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-600/80 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center justify-center transition duration-200"
        >
          <FaSignOutAlt className="mr-2" />
          Disconnect Wallet
        </button>
      </div>
    </motion.div>
  )
}
