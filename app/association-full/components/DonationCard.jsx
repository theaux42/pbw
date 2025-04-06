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
  return (
    <div className="lg:sticky lg:top-8 h-fit">
      <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl">
        <h2 className="text-2xl font-bold text-green-400 mb-6">Faire un don</h2>
        <p className="text-gray-400 mb-8">
          Choisissez un montant ou définissez le vôtre pour soutenir cette organisation.
        </p>

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
          <button
            onClick={() => {
              setTransactionStatus(null);
              setPayloadUuid(null);
              setQrCode(null);
              setXummLink(null);
            }}
            className="w-full px-8 py-4 mt-4 bg-gray-700/50 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
          >
            Nouveau don
          </button>
        )}
      </div>
    </div>
  );
}
