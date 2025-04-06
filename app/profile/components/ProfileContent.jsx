import { motion } from 'framer-motion'
import StatsOverview from './StatsOverview'
import Achievements from './Achievements'
import DonationHistory from './DonationHistory'

export default function ProfileContent({ userData, activeTab, setActiveTab, calculateLevel, getLevelTitle, formatDate }) {
  return (
    <motion.div 
      initial={{ y: 20 }}
      animate={{ y: 0 }}
      className="lg:col-span-8 space-y-6"
    >
      {/* Stats & Achievements Panel */}
      <div className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-6 border border-green-400/30">
        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'stats' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-green-300'}`}
            onClick={() => setActiveTab('stats')}
          >
            Stats & Achievements
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'donations' ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-400 hover:text-green-300'}`}
            onClick={() => setActiveTab('donations')}
          >
            Donation History
          </button>
        </div>
        
        {activeTab === 'stats' && (
          <div>
            <StatsOverview 
              userData={userData} 
              calculateLevel={calculateLevel} 
              getLevelTitle={getLevelTitle} 
            />
            <Achievements userData={userData} />
          </div>
        )}
        
        {activeTab === 'donations' && (
          <DonationHistory userData={userData} formatDate={formatDate} />
        )}
      </div>
    </motion.div>
  )
}
