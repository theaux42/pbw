import { motion } from 'framer-motion';

export default function ErrorDisplay({ error }) {
  return (
    <motion.main 
      className="mt-8"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <motion.p 
          className="text-red-300 p-4 rounded-lg bg-red-500/10 border border-red-500/20"
          initial={{ x: 0 }}
          animate={{ 
            x: [0, -5, 5, -5, 5, 0],
          }}
          transition={{ 
            duration: 0.5, 
            delay: 0.3,
            type: "spring",
            stiffness: 200
          }}
        >
          Erreur : {error}
        </motion.p>
      </motion.div>
    </motion.main>
  );
}