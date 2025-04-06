import { FaMedal } from 'react-icons/fa'
import { HiOutlineGift, HiStar } from 'react-icons/hi'
import { FaCoins } from 'react-icons/fa'
import { useState } from 'react'

export default function Achievements({ userData }) {
  const [isLoading, setIsLoading] = useState({});

  // Implement the achievement claim function
  const handleClaimAchievement = async (achievementId) => {
    try {
      console.log(`Claiming achievement: ${achievementId}`);
      
      // Get wallet address from localStorage first, then fall back to userData
      let walletAddress;
      
      if (typeof window !== 'undefined') {
        walletAddress = localStorage.getItem('xumm_account');
      }
      
      // If not in localStorage, use from userData
      if (!walletAddress && userData.wallet_address) {
        walletAddress = userData.wallet_address;
      }
      
      // Check if wallet address exists
      if (!walletAddress) {
        throw new Error('Wallet address is required to claim achievements');
      }
      
      console.log(`Using wallet address: ${walletAddress}`);
      
      // Set loading state for this specific achievement
      setIsLoading(prev => ({ ...prev, [achievementId]: true }));
      
      const response = await fetch('/api/achievements/claim', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          achievementId,
          userId: userData.user_id,
          wallet_address: walletAddress 
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        // Extract detailed error information from the response
        const errorMessage = data.message || data.error || 'Failed to claim achievement';
        const errorDetails = data.details ? `\n\nDetails: ${JSON.stringify(data.details)}` : '';
        throw new Error(`${errorMessage}${errorDetails}`);
      }
      
      // Show success message
      alert(`Achievement claimed successfully!`);
      
      // Refresh the page to update UI
      window.location.reload();
    } catch (error) {
      console.error('Error claiming achievement:', error);
      
      // Provide more helpful error message based on error type
      let userMessage = error.message;
      
      // Add specific guidance for common errors
      if (error.message.includes('join.decode: string expected') || 
          error.message.includes('NFT minting failed')) {
        userMessage = `The NFT minting service encountered an error. This may be a temporary issue with the XRPL service. Please try again later or contact support if the problem persists.\n\nTechnical details: ${error.message}`;
      }
      
      alert(userMessage);
    } finally {
      // Reset loading state
      setIsLoading(prev => ({ ...prev, [achievementId]: false }));
    }
  };

  // Update the button to show loading state
  const renderClaimButton = (achievementId) => (
    <button 
      onClick={() => handleClaimAchievement(achievementId)}
      className="mt-1 px-3 py-1 text-xs bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors"
      disabled={isLoading[achievementId]}
    >
      {isLoading[achievementId] ? 'Claiming...' : 'Claim'}
    </button>
  );

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
            renderClaimButton('first_donation')
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
            renderClaimButton('regular_donor')
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
            renderClaimButton('big_supporter')
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
            renderClaimButton('xp_master')
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
            renderClaimButton('philanthropist')
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
            renderClaimButton('veteran_supporter')
          ) : (
            <span className="text-xs text-gray-500">{userData.donation_count}/20</span>
          )}
        </div>
      </div>
    </>
  )
}