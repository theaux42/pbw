'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AssoOnboardingPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website: '',
    full_description: '',
  })
  const [logoImage, setLogoImage] = useState(null)
  const [logoPreview, setLogoPreview] = useState(null)
  const [bannerImage, setBannerImage] = useState(null)
  const [bannerPreview, setBannerPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [walletAddress, setWalletAddress] = useState(null)
  const [walletSeed, setWalletSeed] = useState(null)

  // Check if user is logged in
  useEffect(() => {
    const wallet = localStorage.getItem('xumm_account')
    const seed = localStorage.getItem('xumm_seed') // If you store seed somewhere
    if (!wallet) {
      router.push('/login')
    } else {
      setWalletAddress(wallet)
      if (seed) setWalletSeed(seed)
    }
  }, [router])

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Handle logo image selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide pour le logo')
        return
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('L\'image du logo est trop volumineuse (2MB maximum)')
        return
      }

      setLogoImage(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle banner image selection
  const handleBannerChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setError('Veuillez sélectionner une image valide pour la bannière')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('L\'image de bannière est trop volumineuse (5MB maximum)')
        return
      }

      setBannerImage(file)
      setError('')
      
      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        setBannerPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Veuillez entrer un nom pour l\'association')
      return
    }
    
    if (!formData.description.trim()) {
      setError('Veuillez entrer une description pour l\'association')
      return
    }

    if (!logoImage) {
      setError('Veuillez sélectionner un logo pour l\'association')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Create a FormData object to send files
      const submitData = new FormData()
      submitData.append('name', formData.name)
      submitData.append('description', formData.description)
      submitData.append('wallet_address', walletAddress)
      submitData.append('website', formData.website)
      submitData.append('full_description', formData.full_description)
      
      if (walletSeed) {
        submitData.append('wallet_seed', walletSeed)
      }

      // Append files if they exist
      if (logoImage) {
        submitData.append('logo', logoImage)
      }
      
      if (bannerImage) {
        submitData.append('banner', bannerImage)
      }

      console.log('Submitting association with wallet:', walletAddress)

      // Submit data to API
      const response = await fetch('/api/organizations/create-asso', {
        method: 'POST',
        body: submitData
      })

      const data = await response.json()
      
      if (!response.ok) {
        console.log('Error response:', data)
        throw new Error(data.error || 'Une erreur est survenue')
      }

      console.log('Association created successfully:', data)

      // Redirect to organization page after successful creation
      router.push('/full_association/' + data.organization.id)
    } catch (err) {
      console.error('Error creating association:', err)
      setError(err.message || 'Erreur lors de la création de l\'association')
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
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
          Créer une association
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'association *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Nom de votre association"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          {/* Description input */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
              Description courte *
            </label>
            <input
              type="text"
              id="description"
              name="description"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Brève description (maximum 150 caractères)"
              value={formData.description}
              onChange={handleInputChange}
              maxLength={150}
              required
            />
          </div>
          
          {/* Website input */}
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
              Site web
            </label>
            <input
              type="url"
              id="website"
              name="website"
              className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="https://www.votreassociation.org"
              value={formData.website}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Full description textarea */}
          <div>
            <label htmlFor="full_description" className="block text-sm font-medium text-gray-700 mb-2">
              Description complète
            </label>
            <textarea
              id="full_description"
              name="full_description"
              rows={5}
              className="w-full px-4 py-3 rounded-lg bg-gray-50 text-gray-900 border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              placeholder="Description détaillée de votre association"
              value={formData.full_description}
              onChange={handleInputChange}
            />
          </div>
          
          {/* Logo upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo de l'association *
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Preview image */}
              {logoPreview ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-500/30">
                  <Image
                    src={logoPreview}
                    alt="Logo Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">Aucun logo</span>
                </div>
              )}
              
              {/* Upload button */}
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors">
                <span>Sélectionner un logo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
              </label>
            </div>
          </div>
          
          {/* Banner upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bannière de l'association
            </label>
            
            <div className="flex flex-col items-center space-y-4">
              {/* Preview banner */}
              {bannerPreview ? (
                <div className="relative w-full h-40 rounded-lg overflow-hidden border-4 border-blue-500/30">
                  <Image
                    src={bannerPreview}
                    alt="Banner Preview"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              ) : (
                <div className="w-full h-40 rounded-lg bg-gray-200 border-4 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">Aucune bannière</span>
                </div>
              )}
              
              {/* Upload button */}
              <label className="cursor-pointer px-4 py-2 rounded-lg bg-gray-200 border border-gray-300 text-gray-700 hover:bg-gray-300 transition-colors">
                <span>Sélectionner une bannière</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleBannerChange}
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
              {loading ? "Création de l'association..." : "Créer l'association"}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}