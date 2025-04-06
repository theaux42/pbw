import { motion } from 'framer-motion';

export default function OrgBanner({ bannerUrl }) {
  if (!bannerUrl) return null;
  
  return (
    <motion.div 
      className="relative w-full h-56 md:h-72 lg:h-80 rounded-3xl overflow-hidden mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.div 
        className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent z-10" 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      />
      <motion.img
        src={bannerUrl}
        alt="Banner"
        className="w-full h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 1.2 }}
      />
    </motion.div>
  );
}