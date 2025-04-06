import Link from 'next/link'

export default function ProfileNotFound() {
  return (
    <div className="min-h-screen bg-[color:var(--color-gray-950)] p-4 md:p-8">
      <div className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-green-400/30">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-gray-300 mb-6">We couldn't find your profile. You might need to create one first.</p>
          <Link
            href="/login"
            className="bg-green-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 inline-block font-medium"
          >
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
