import ReactMarkdown from 'react-markdown';

export default function OrgInfo({ org, copySuccess, handleCopyWallet }) {
  return (
    <div className="lg:col-span-2">
      <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50 shadow-xl mb-8">
        <div className="flex items-center gap-4 mb-6">
          {org.logo_url && (
            <img 
              src={org.logo_url} 
              alt={`${org.name} logo`} 
              className="w-16 h-16 rounded-full object-cover border border-gray-700/50"
            />
          )}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
              {org.name}
            </h1>
            {org.total_received && (
              <p className="text-gray-300 mt-2">
                Total reçu: <span className="font-semibold text-green-400">{org.total_received}</span>
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handleCopyWallet}
            className="group flex items-center space-x-2 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg px-3 py-2 w-fit transition-all duration-200"
          >
            <svg className="w-4 h-4 text-green-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <span className="text-xs font-mono text-gray-400/70 group-hover:text-gray-300 transition-colors">
              {copySuccess ? 'Copié !' : org.wallet_address}
            </span>
          </button>
          
          {org.website && (
            <a
              href={org.website}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center space-x-2 bg-gray-800/30 hover:bg-gray-800/50 rounded-lg px-3 py-2 w-fit transition-all duration-200"
            >
              <svg className="w-4 h-4 text-green-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              <span className="text-xs text-gray-400/70 group-hover:text-gray-300 transition-colors">
                {org.website}
              </span>
            </a>
          )}
        </div>
        <div className="markdown-content text-gray-300 leading-relaxed text-lg">
          <ReactMarkdown>
            {org.full_description || 'Pas de description complète.'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}