import { motion } from "framer-motion";

export default function DonationAmountSelection({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  transactionLoading,
  handleDonation
}) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300 } },
    hover: { scale: 1.05, transition: { type: "spring", stiffness: 400 } },
    tap: { scale: 0.95 }
  };

  const inputVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, delay: 0.5 } }
  };

  return (
    <>
      <motion.div 
        className="grid grid-cols-2 gap-3 mb-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {[2, 5, 10, 20, 50].map((amt) => (
          <motion.button
            key={amt}
            onClick={() => {
              setSelectedAmount(amt);
              setCustomAmount('');
            }}
            variants={buttonVariants}
            whileHover="hover"
            whileTap="tap"
            className={`
              px-4 py-4 rounded-xl font-medium transition-all duration-200
              ${selectedAmount === amt && !customAmount
                ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border-2 border-transparent'}
            `}
          >
            {amt} XRP
          </motion.button>
        ))}
      </motion.div>

      {/* Custom amount input */}
      <motion.div 
        className="mb-8"
        variants={inputVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="relative">
          <motion.input
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant personnalisé"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            whileFocus={{ scale: 1.02 }}
            className="w-full px-4 py-4 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 border-2 border-transparent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">XRP</span>
        </div>
      </motion.div>

      <motion.button
        onClick={handleDonation}
        disabled={transactionLoading}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: transactionLoading ? 1 : 1.03 }}
        whileTap={{ scale: transactionLoading ? 1 : 0.97 }}
        transition={{ type: "spring", stiffness: 400 }}
        className={`w-full px-8 py-4 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all duration-200 
          ${transactionLoading
            ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}
      >
        {transactionLoading ? 'Chargement...' : 'Confirmer le don'}
      </motion.button>
    </>
  );
}