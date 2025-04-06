import { FaMedal } from 'react-icons/fa'
import { HiOutlineGift, HiStar } from 'react-icons/hi'
import { FaCoins } from 'react-icons/fa'

export default function Achievements({ userData }) {
  // Add this function to handle achievement claiming
  const handleClaimAchievement = (achievementId) => {
    console.log(`Claiming achievement: ${achievementId}`);
    // Implement your claim logic here
  };

  return (
    <>
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <FaMedal className="text-yellow-500 mr-2" />
        Achievements
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {/* First Donation Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.donation_count >= 1 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.donation_count >= 1 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <HiOutlineGift className={`text-xl ${userData.donation_count >= 1 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">First Donation</h4>
          <p className="text-xs text-gray-400">Make your first donation</p>
          {userData.donation_count >= 1 ? (
            <button 
              onClick={() => handleClaimAchievement('first_donation')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">Locked</span>
          )}
        </div>
        
        {/* Regular Donor Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.donation_count >= 5 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.donation_count >= 5 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <HiOutlineGift className={`text-xl ${userData.donation_count >= 5 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">Regular Donor</h4>
          <p className="text-xs text-gray-400">Make 5 donations</p>
          {userData.donation_count >= 5 ? (
            <button 
              onClick={() => handleClaimAchievement('regular_donor')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">{userData.donation_count}/5</span>
          )}
        </div>
        
        {/* Big Supporter Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.total_donated >= 100 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.total_donated >= 100 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <FaCoins className={`text-xl ${userData.total_donated >= 100 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">Big Supporter</h4>
          <p className="text-xs text-gray-400">Donate 100 XRP total</p>
          {userData.total_donated >= 100 ? (
            <button 
              onClick={() => handleClaimAchievement('big_supporter')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">{userData.total_donated}/100</span>
          )}
        </div>
        
        {/* XP Master Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.xp >= 1000 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.xp >= 1000 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <HiStar className={`text-xl ${userData.xp >= 1000 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">XP Master</h4>
          <p className="text-xs text-gray-400">Earn 1000 XP</p>
          {userData.xp >= 1000 ? (
            <button 
              onClick={() => handleClaimAchievement('xp_master')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">{userData.xp}/1000</span>
          )}
        </div>
        
        {/* Philanthropist Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.total_donated >= 500 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.total_donated >= 500 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <FaCoins className={`text-xl ${userData.total_donated >= 500 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">Philanthropist</h4>
          <p className="text-xs text-gray-400">Donate 500 XRP total</p>
          {userData.total_donated >= 500 ? (
            <button 
              onClick={() => handleClaimAchievement('philanthropist')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">{userData.total_donated}/500</span>
          )}
        </div>
        
        {/* Veteran Supporter Achievement */}
        <div className={`bg-gray-800/60 rounded-xl p-4 text-center border ${userData.donation_count >= 20 ? 'border-green-400' : 'border-gray-700'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2 ${userData.donation_count >= 20 ? 'bg-green-400' : 'bg-gray-700'}`}>
            <HiOutlineGift className={`text-xl ${userData.donation_count >= 20 ? 'text-gray-900' : 'text-gray-400'}`} />
          </div>
          <h4 className="font-medium">Veteran Supporter</h4>
          <p className="text-xs text-gray-400">Make 20 donations</p>
          {userData.donation_count >= 20 ? (
            <button 
              onClick={() => handleClaimAchievement('veteran_supporter')}
              className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
            >
              Claim
            </button>
          ) : (
            <span className="text-xs text-gray-500">{userData.donation_count}/20</span>
          )}
        </div>
      </div>
    </>
  )
}