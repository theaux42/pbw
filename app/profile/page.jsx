'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

// Import components
import LoadingSpinner from './components/LoadingSpinner'
import ProfileNotFound from './components/ProfileNotFound'
import ProfileSidebar from './components/ProfileSidebar'
import ProfileContent from './components/ProfileContent'
import ActionBanner from './components/ActionBanner'

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
          router.push('/login')
          return
        }else if (localStorage.getItem('account_type') !== 'user') {
	  // If the account type is not user, redirect to home
	  console.error('only users can access this page')
	  router.push('/')
	  return
	}

        // Use the get-data-user API endpoint with the xumm_id as query parameter
        const res = await fetch(`/api/user/get-user-data?xumm_id=${stored}`)
        
        if (res.status === 200) {
          const data = await res.json()
          // The API returns { user: data } so we need to access the user property
          setUserData(data.user)
          
          // Store or update the user UUID
          if (data.user && data.user.id) {
	    localStorage.setItem('user_uuid', data.user.id)
	  }
	  else if (res.status === 404) {
	    router.push('/on-boarding/user')
          } else {
            console.error('Failed to fetch user data')
            // If user data not found, may need to onboard
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
    localStorage.removeItem('user_uuid') // Also remove user UUID on logout
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
    return <LoadingSpinner />
  }

  // No user data (should redirect, but just in case)
  if (!userData) {
    return <ProfileNotFound />
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-gray-950)] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          <ProfileSidebar 
            userData={userData}
            calculateLevel={calculateLevel}
            calculateProgress={calculateProgress}
            formatDate={formatDate}
            getLevelTitle={getLevelTitle}
            handleLogout={handleLogout}
          />
          
          <ProfileContent 
            userData={userData}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            calculateLevel={calculateLevel}
            getLevelTitle={getLevelTitle}
            formatDate={formatDate}
          />
          
          <div className="lg:col-span-12">
            <ActionBanner />
          </div>
        </motion.div>
      </div>
    </div>
  )
}