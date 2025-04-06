import { motion } from 'framer-motion'
import Link from 'next/link'

export default function ActionBanner() {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4 }}
      className="bg-gray-900/80 backdrop-blur-md text-white rounded-2xl shadow-xl p-6 border border-green-400/30"
    >
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold mb-1">Ready to make a bigger impact?</h3>
          <p className="text-gray-300">Discover organizations that need your support.</p>
        </div>
        <Link 
          href="/associations"
          className="bg-green-400 text-gray-900 px-6 py-2 rounded-lg hover:bg-green-500 transition duration-300 whitespace-nowrap font-medium"
        >
          Donate Now
        </Link>
      </div>
    </motion.div>
  )
}
