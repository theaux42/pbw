'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import useConfetti from "canvas-confetti";
import { motion, AnimatePresence } from 'framer-motion'; // Added Framer Motion import
import LoadingState from '../components/LoadingState'
import ErrorDisplay from '../components/ErrorDisplay'
import OrgBanner from '../components/OrgBanner'
import OrgInfo from '../components/OrgInfo'
import DonationCard from '../components/DonationCard'

export default function AssociationFullPage() {
  const router = useRouter()
  const params = useParams()
  const { uuid } = params

  const [org, setOrg] = useState(null)
  const [error, setError] = useState(null)
  const [userData, setUserData] = useState(null)

  // Pour le formulaire de don
  const [selectedAmount, setSelectedAmount] = useState(10)
  const [customAmount, setCustomAmount] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  // États pour la transaction XUMM
  const [transactionLoading, setTransactionLoading] = useState(false)
  const [transactionStatus, setTransactionStatus] = useState(null)
  const [payloadUuid, setPayloadUuid] = useState(null)
  const [qrCode, setQrCode] = useState(null)
  const [xummLink, setXummLink] = useState(null)

  // For status polling
  const [isPolling, setIsPolling] = useState(false)

  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        duration: 0.6,
        staggerChildren: 0.2
      }
    },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const handleCopyWallet = async () => {
    try {
      await navigator.clipboard.writeText(org.wallet_address)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Récupérer l'organisation
  useEffect(() => {
    async function fetchOrg() {
      try {
        const res = await fetch(`/api/organizations/${uuid}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        const data = await res.json()
        setOrg(data.organization)
      } catch (err) {
        setError(err.message)
      }
    }
    if (uuid) {
      fetchOrg()
    }
  }, [uuid])

  // Récupérer les informations de l'utilisateur connecté
  useEffect(() => {
    async function fetchUserData() {
      try {
        const walletAddress = localStorage.getItem('xumm_account')
        
        if (!walletAddress) {
          console.log('Aucun utilisateur connecté')
          return
        }
        
        const res = await fetch(`/api/user/get-user-data?xumm_id=${walletAddress}`)
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }
        
        const data = await res.json()
        if (data.exists && data.user) {
          setUserData(data.user)
        }
      } catch (err) {
        console.error('Erreur lors de la récupération des données utilisateur:', err)
      }
    }
    
    fetchUserData()
  }, [])

  // Gère la logique de don avec l'API XUMM
  const handleDonation = async () => {
    const donationAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  
    if (!donationAmount || donationAmount < 1) {
      setTransactionStatus({ type: 'error', message: 'Le montant minimum de don est de 1 XRP' });
      return;
    }
  
    if (!org.wallet_address) {
      setTransactionStatus({ type: 'error', message: "Adresse du wallet de l'organisation non disponible" });
      return;
    }
  
    const walletAddress = localStorage.getItem('xumm_account');
    if (!walletAddress) {
      setTransactionStatus({ 
        type: 'error', 
        message: 'Vous devez être connecté pour faire un don' 
      });
      setTimeout(() => router.push('/login'), 2000);
      return;
    }
  
    let userId = userData?.id;
  
    if (!userId) {
      try {
        const res = await fetch(`/api/user/get-user-data?xumm_id=${walletAddress}`);
        if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  
        const userDataRes = await res.json();
        
        if (userDataRes.error) throw new Error(userDataRes.error);
        
        if (userDataRes.user?.id) {
          userId = userDataRes.user.id;
          setUserData(userDataRes.user);
        } else {
          setTransactionStatus({  
            type: 'error', 
            message: "Votre profil n'est pas complet. Redirection vers la page d'accueil..." 
          });
          setTimeout(() => router.push('/on-boarding'), 2000);
          return;
        }
      } catch (err) {
        console.error('Erreur récupération données utilisateur:', err);
        setTransactionStatus({ 
          type: 'error', 
          message: `Impossible de récupérer vos infos utilisateur: ${err.message}` 
        });
        return;
      }
    }
  
    try {
      setTransactionLoading(true);
      setTransactionStatus({ type: 'info', message: 'Préparation de votre transaction...' });
  
      const response = await fetch('/api/xumm/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          org_id: uuid,
          amount: donationAmount,
        }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la création de la transaction');
      }
  
      const data = await response.json();
  
      if (data.success) {
        setPayloadUuid(data.payload.uuid);
        setQrCode(data.payload.qrcode);
        setXummLink(data.payload.link);
        setTransactionStatus({
          type: 'success',
          message: 'Transaction prête ! Scannez le QR code avec l\'app XUMM ou cliquez sur le lien',
        });
  
        startPolling(data.donation_id, data.payload.uuid);
      } else {
        throw new Error(data.error || 'Échec de la création de la transaction');
      }
  
    } catch (err) {
      console.error('Erreur de transaction:', err);
      setTransactionStatus({
        type: 'error',
        message: `Erreur: ${err.message}`,
      });
    } finally {
      setTransactionLoading(false);
    }
  };
  
  const startPolling = (donation_id, uuid) => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/xumm/transactions?uuid=${uuid}&donation_id=${donation_id}`);
        const data = await response.json();
  
        if (data.error) {
          setTransactionStatus({ type: 'error', message: data.error });
          setIsPolling(false);
          return;
        }
  
        if (data.status === 'resolved') {
          if (data.signed) {
            setTransactionStatus({
              type: 'success',
              message: 'Transaction signée avec succès!',
              txid: data.txid,
              transactionUrl: data.transactionUrl
            });
            useConfetti({
              particleCount: 160,
              spread: 360,
              origin: { y: 0.6 },
              colors: ['#10B981', '#34D399', '#6EE7B7', '#A7F3D0']
            });
          } else {
            setTransactionStatus({
              type: 'error',
              message: 'Transaction rejetée'
            });
          }
          setIsPolling(false);
          return;
        }
  
        if (data.status === 'expired') {
          setTransactionStatus({
            type: 'error',
            message: 'La transaction a expiré'
          });
          setIsPolling(false);
          return;
        }
  
        setTimeout(checkStatus, 3000);
      } catch (err) {
        console.error('Erreur lors de la vérification du statut:', err);
        setTransactionStatus({
          type: 'error',
          message: 'Erreur lors de la vérification du statut'
        });
        setIsPolling(false);
      }
    };
  
    checkStatus();
  };
  
  if (error) {
    return <ErrorDisplay error={error} />
  }
  
  if (!org) {
    return <LoadingState />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.main 
        className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-8 md:px-8"
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        key="main-content"
      >
        <OrgBanner bannerUrl={org.banner_url} />

        <motion.div 
          className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8"
          variants={contentVariants}
        >
          <motion.div 
            variants={contentVariants}
            className="lg:col-span-2"
          >
            <OrgInfo 
              org={org} 
              copySuccess={copySuccess} 
              handleCopyWallet={handleCopyWallet} 
            />
          </motion.div>

          <motion.div 
            variants={contentVariants}
            className="lg:col-span-1"
          >
            <DonationCard
              selectedAmount={selectedAmount}
              setSelectedAmount={setSelectedAmount}
              customAmount={customAmount}
              setCustomAmount={setCustomAmount}
              transactionLoading={transactionLoading}
              transactionStatus={transactionStatus}
              setTransactionStatus={setTransactionStatus}
              qrCode={qrCode}
              xummLink={xummLink}
              handleDonation={handleDonation}
              payloadUuid={payloadUuid}
              setPayloadUuid={setPayloadUuid}
              setQrCode={setQrCode}
              setXummLink={setXummLink}
            />
          </motion.div>
        </motion.div>
      </motion.main>
    </AnimatePresence>
  )
}