'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FaWallet, FaCoins, FaTrophy, FaHistory, FaCalendarAlt, FaSignOutAlt, FaMedal, FaChartLine } from 'react-icons/fa'
import { HiOutlineGift, HiStar, HiLightningBolt } from 'react-icons/hi'
import Link from 'next/link'

export default function ProfilePage() {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('stats')

  // Load user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true)
      try {
        const stored = localStorage.getItem('xumm_account')
        if (!stored) {
          // If no wallet is connected, redirect to login
          window.location.href = '/login'
          return
        }

        const res = await fetch(`/api/user/${stored}`)
        if (res.ok) {
          const data = await res.json()
          setUserData(data)
        } else {
          console.error('Failed to fetch user data')
          // If user data not found, may need to onboard
          if (res.status === 404) {
            window.location.href = '/on-boarding'
            return
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchUserData()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('xumm_account')
    window.location.href = '/login'
  }

  // Calculate user level based on XP
  const calculateLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1
  }

  // Calculate progress to next level
  const calculateProgress = (xp) => {
    const currentLevel = calculateLevel(xp)
    const currentLevelMinXP = (currentLevel - 1) * (currentLevel - 1) * 100
    const nextLevelMinXP = (currentLevel) * (currentLevel) * 100
    return ((xp - currentLevelMinXP) / (nextLevelMinXP - currentLevelMinXP)) * 100
  }

  // Format date nicely
  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  }

  // Get level title based on level
  const getLevelTitle = (level) => {
    const titles = [
      'Novice',
      'Explorer', 
      'Contributor',
      'Supporter',
      'Champion',
      'Benefactor',
      'Philanthropist',
      'Legend',
      'Whale',
      'Crypto God'
    ]
    return titles[Math.min(level - 1, titles.length - 1)]
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[color:var(--color-gray-950)]">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          className="w-16 h-16 border-4 border-green-400 border-t-transparent rounded-full"
        />
      </div>
    )
  }

  // No user data (should redirect, but just in case)
  if (!userData) {
    return (
      <div className="min-h-screen bg-[color:var(--color-gray-950)] p-4 md:p-8">
        <div className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-green-400/30">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
            <p className="text-gray-300 mb-6">We couldn't find your profile. You might need to create one first.</p>
            <Link
              href="/login"
              className="bg-green-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 inline-block font-medium"
            >
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-gray-950)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Profile Card - Left Column */}
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
          
          {/* Main Content Area - Right Column */}
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
                  {/* Stats Overview */}
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
                  
                  {/* Achievements */}
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
                        <span className="text-xs text-green-400">Unlocked</span>
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
                        <span className="text-xs text-green-400">Unlocked</span>
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
                        <span className="text-xs text-green-400">Unlocked</span>
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
                        <span className="text-xs text-green-400">Unlocked</span>
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
                        <span className="text-xs text-green-400">Unlocked</span>
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
                        <span className="text-xs text-green-400">Unlocked</span>
                      ) : (
                        <span className="text-xs text-gray-500">{userData.donation_count}/20</span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'donations' && (
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
              )}
            </div>
            
            {/* Banner */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-6 border border-green-400/30"
            >
              <div className="flex flex-col md:flex-row items-center justify-between">
                <div className="mb-4 md:mb-0">
                  <h3 className="text-lg font-semibold mb-1">Ready to make a bigger impact?</h3>
                  <p className="text-gray-300">Discover organizations that need your support.</p>
                </div>
                <Link 
                  href="/associations"
                  className="bg-green-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 whitespace-nowrap font-medium"
                >
                  Donate Now
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}