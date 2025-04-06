import { motion } from 'framer-motion';
import TransactionStatus from './TransactionStatus';
import DonationAmountSelection from './DonationAmountSelection';

export default function DonationCard({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  transactionLoading,
  transactionStatus,
  setTransactionStatus,
  qrCode,
  xummLink,
  handleDonation,
  payloadUuid,
  setPayloadUuid,
  setQrCode,
  setXummLink
}) {
  // Card animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.15
      }
    }
  };

  // Text content variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 300 }
    }
  };

  // Button animation variants
  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        delay: 0.2 
      }
    },
    hover: { 
      scale: 1.03, 
      backgroundColor: "rgba(55, 65, 81, 1)" 
    },
    tap: { scale: 0.97 }
  };

  return (
    <motion.div 
      className="lg:sticky lg:top-8 h-fit"
      initial="hidden"
      animate="visible"
      variants={cardVariants}
    >
      <motion.div 
        className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl"
        variants={cardVariants}
      >
        <motion.h2 
          className="text-2xl font-bold text-green-400 mb-6"
          variants={itemVariants}
        >
          Faire un don
        </motion.h2>
        
        <motion.p 
          className="text-gray-400 mb-8"
          variants={itemVariants}
        >
          Choisissez un montant ou définissez le vôtre pour soutenir cette organisation.
        </motion.p>

        <TransactionStatus 
          transactionStatus={transactionStatus} 
          qrCode={qrCode} 
          xummLink={xummLink} 
        />

        {!qrCode && (
          <DonationAmountSelection
            selectedAmount={selectedAmount}
            setSelectedAmount={setSelectedAmount}
            customAmount={customAmount}
            setCustomAmount={setCustomAmount}
            transactionLoading={transactionLoading}
            handleDonation={handleDonation}
          />
        )}

        {/* Reset button when transaction is completed or failed */}
        {(transactionStatus?.txid || transactionStatus?.type === 'error') && (
          <motion.button
            onClick={() => {
              setTransactionStatus(null);
              setPayloadUuid(null);
              setQrCode(null);
              setXummLink(null);
            }}
            variants={buttonVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            whileTap="tap"
            className="w-full px-8 py-4 mt-4 bg-gray-700/50 text-white rounded-xl font-medium transition-all duration-200"
          >
            Nouveau don
          </motion.button>
        )}
      </motion.div>
    </motion.div>
  );
}