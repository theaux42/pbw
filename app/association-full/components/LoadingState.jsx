export default function LoadingState() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-gray-100 px-4 py-8 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse">
          {/* Banner skeleton */}
          <div className="w-full h-56 md:h-72 lg:h-80 rounded-3xl overflow-hidden mb-8 bg-gray-800/30" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Info Card skeleton */}
            <div className="lg:col-span-2">
              <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50">
                <div className="h-12 w-2/3 bg-gray-700/50 rounded-lg mb-6" />
                <div className="h-4 w-1/4 bg-gray-700/50 rounded mb-6" />
                <div className="space-y-3">
                  <div className="h-4 bg-gray-700/50 rounded w-full" />
                  <div className="h-4 bg-gray-700/50 rounded w-5/6" />
                  <div className="h-4 bg-gray-700/50 rounded w-4/6" />
                </div>
              </div>
            </div>

            {/* Donation Card skeleton */}
            <div className="backdrop-blur-xl bg-gray-800/30 rounded-3xl p-8 border border-gray-700/50">
              <div className="h-8 w-1/2 bg-gray-700/50 rounded-lg mb-6" />
              <div className="h-4 w-5/6 bg-gray-700/50 rounded mb-8" />
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-14 bg-gray-700/50 rounded-xl" />
                ))}
              </div>
              <div className="h-14 bg-gray-700/50 rounded-xl mb-8" />
              <div className="h-14 bg-gray-700/50 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
