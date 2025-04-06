import { FaTrophy, FaChartLine } from 'react-icons/fa'
import { HiLightningBolt } from 'react-icons/hi'

export default function StatsOverview({ userData, calculateLevel, getLevelTitle }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <div className="bg-gray-800/60 rounded-xl p-5 flex items-center">
        <div className="bg-green-400/20 rounded-full p-3 mr-4">
          <FaTrophy className="text-yellow-500 text-2xl" />
        </div>
        <div>
          <p className="text-gray-400 text-xs">Current Rank</p>
          <p className="text-xl font-bold">{getLevelTitle(calculateLevel(userData.xp))}</p>
          <p className="text-xs text-green-400">Level {calculateLevel(userData.xp)}</p>
        </div>
      </div>
      
      <div className="bg-gray-800/60 rounded-xl p-5 flex items-center">
        <div className="bg-green-400/20 rounded-full p-3 mr-4">
          <HiLightningBolt className="text-green-400 text-2xl" />
        </div>
        <div>
          <p className="text-gray-400 text-xs">Experience Points</p>
          <p className="text-xl font-bold">{userData.xp} XP</p>
          <p className="text-xs text-green-400">{Math.pow(calculateLevel(userData.xp), 2) * 100 - userData.xp} XP to next level</p>
        </div>
      </div>
      
      <div className="bg-gray-800/60 rounded-xl p-5 flex items-center">
        <div className="bg-green-400/20 rounded-full p-3 mr-4">
          <FaChartLine className="text-green-400 text-2xl" />
        </div>
        <div>
          <p className="text-gray-400 text-xs">Average Donation</p>
          <p className="text-xl font-bold">
            {userData.donation_count > 0 
              ? (userData.total_donated / userData.donation_count).toFixed(2) 
              : '0'} XRP
          </p>
          <p className="text-xs text-green-400">{userData.donation_count} total donations</p>
        </div>
      </div>
    </div>
  )
}
