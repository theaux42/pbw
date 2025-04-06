export default function TransactionStatus({ transactionStatus, qrCode, xummLink }) {
  if (!transactionStatus && !qrCode && !xummLink) return null;
  
  return (
    <>
      {/* Transaction status notification */}
      {transactionStatus && (
        <div className={`mb-6 p-4 rounded-lg ${
          transactionStatus.type === 'error' ? 'bg-red-950/50 text-red-300 border border-red-800/50' :
          transactionStatus.type === 'success' ? 'bg-green-950/50 text-green-300 border border-green-800/50' :
          'bg-blue-950/50 text-blue-300 border border-blue-800/50'
        }`}>
          <p>{transactionStatus.message}</p>
          {transactionStatus.txid && (
            <a
              href={transactionStatus.transactionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:underline mt-2 inline-block"
            >
              Voir la transaction
            </a>
          )}
        </div>
      )}

      {/* QR Code display if available */}
      {qrCode && !transactionStatus?.txid && (
        <div className="mb-6 flex justify-center">
          <div className="bg-white p-2 rounded-lg">
            <img src={qrCode} alt="QR Code XUMM" className="w-48 h-48" />
          </div>
        </div>
      )}

      {/* XUMM link if available */}
      {xummLink && !transactionStatus?.txid && (
        <div className="mb-6 text-center">
          <a
            href={xummLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-400 hover:underline"
          >
            Ouvrir dans l'app XUMM
          </a>
        </div>
      )}
    </>
  );
}
