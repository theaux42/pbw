export default function OrgInfo({ org, copySuccess, handleCopyWallet }) {
  return (
    <div className="lg:col-span-2">
      <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl mb-8">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-6">
          {org.name}
        </h1>
        <button
          onClick={handleCopyWallet}
          className="group flex items-center space-x-2 mb-6 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg px-3 py-2 w-fit transition-all duration-200"
        >
          <svg className="w-4 h-4 text-green-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          <span className="text-xs font-mono text-gray-400/70 group-hover:text-gray-300 transition-colors">
            {copySuccess ? 'Copié !' : org.wallet_address}
          </span>
        </button>
        <p className="text-gray-300 leading-relaxed whitespace-pre-line text-lg">
          {org.full_description || 'Pas de description complète.'}
        </p>
      </div>
    </div>
  );
}
