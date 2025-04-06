'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function OnboardingPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [selectedImage, setSelectedImage] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [walletAddress, setWalletAddress] = useState(null)

  // Check if user is logged in
  useEffect(() => {
    const wallet = localStorage.getItem('xumm_account')
    if (!wallet) {
      router.push('/login')
    } else {
      setWalletAddress(wallet)
    }
  }, [router])

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image est trop volumineuse (2MB maximum)')
        return
      }

      setSelectedImage(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('Veuillez entrer un nom d\'utilisateur')
      return
    }
    
    if (!selectedImage) {
      setError('Veuillez sélectionner une image de profil')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create a FormData object to send files
      const formData = new FormData()
      formData.append('username', username)
      formData.append('profilePic', selectedImage)
      formData.append('xumm_id', walletAddress)

      console.log('Submitting form with wallet:', walletAddress)

      // Submit data to API
      const response = await fetch('/api/user/create-user', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.log('Error response:', data)
        throw new Error(data.message || 'Une erreur est survenue')
      }

      console.log('User created successfully:', data)

      // Redirect to profile page after successful registration
      router.push('/profile')
    } catch (err) {
      console.error('Error creating user:', err)
      setError(err.message || 'Erreur lors de la création du profil')
    } finally {
      setLoading(false)
    }
  }

  if (!walletAddress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement...</p>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-100">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Complétez votre profil
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username input */}
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
              Nom d'utilisateur
            </label>
            <input
              type="text"
              id="username"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Votre nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {/* Image upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image de profil
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Preview image */}
              {previewUrl ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30">
                  <Image
                    src={previewUrl}
                    alt="Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">Aucune image</span>
                </div>
              )}
              
              {/* Upload button */}
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors">
                <span>Sélectionner une image</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
          
          {/* Wallet display */}
          <div className="pt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Adresse du portefeuille</p>
            <p className="bg-gray-100 p-3 rounded-lg text-gray-600 font-mono text-sm overflow-hidden text-ellipsis">
              {walletAddress}
            </p>
          </div>
          
          {/* Submit button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-lg font-medium transition-colors ${
                loading
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? "Création du profil..." : "Compléter mon profil"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}