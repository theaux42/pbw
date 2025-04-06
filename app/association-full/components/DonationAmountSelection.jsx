export default function DonationAmountSelection({
  selectedAmount,
  setSelectedAmount,
  customAmount,
  setCustomAmount,
  transactionLoading,
  handleDonation
}) {
  return (
    <>
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[2, 5, 10, 20, 50].map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setSelectedAmount(amt);
              setCustomAmount('');
            }}
            className={`
              px-4 py-4 rounded-xl font-medium transition-all duration-200
              ${selectedAmount === amt && !customAmount
                ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                : 'bg-gray-700/50 hover:bg-gray-700 text-gray-300 border-2 border-transparent'}
            `}
          >
            {amt} XRP
          </button>
        ))}
      </div>

      {/* Custom amount input */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Montant personnalisé"
            value={customAmount}
            onChange={(e) => {
              setCustomAmount(e.target.value);
              setSelectedAmount(null);
            }}
            className="w-full px-4 py-4 rounded-xl bg-gray-700/50 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 border-2 border-transparent"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">XRP</span>
        </div>
      </div>

      <button
        onClick={handleDonation}
        disabled={transactionLoading}
        className={`w-full px-8 py-4 rounded-xl font-medium shadow-lg shadow-green-500/20 transition-all duration-200 
          ${transactionLoading
            ? 'bg-gray-700 text-gray-300 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700'}`}
      >
        {transactionLoading ? 'Chargement...' : 'Confirmer le don'}
      </button>
    </>
  );
}
