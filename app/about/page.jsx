'use client'

import React from 'react';
import { motion } from 'framer-motion';

function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 to-gray-900 text-white font-mono overflow-hidden">
      {/* Particules d'arrière-plan */}
      <div className="absolute inset-0 z-0">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-500/20 backdrop-blur-sm"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              x: [0, Math.random() * 100 - 50],
              y: [0, Math.random() * 100 - 50],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              repeat: Infinity,
              repeatType: "reverse",
              duration: Math.random() * 20 + 10,
            }}
          />
        ))}
      </div>

      {/* Grille décorative */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20" />

      {/* Contenu principal */}
      <div className="relative z-10 container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="inline-block mb-8"
          >
            <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-4 py-2 rounded-full text-xs font-medium">
              XRP Humanity & Solidarity
            </span>
          </motion.div>

          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-16 leading-tight bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            About the Project
          </motion.h1>
          
          <motion.div
            className="space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
          >
            <motion.div
              className="backdrop-blur-sm bg-gray-800/30 p-8 rounded-2xl border border-gray-700/50"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                This project aims to revolutionize the funding of NGOs and projects through tokenization. Donors receive unique
                NFTs based on the size of their donation, with increased chances of obtaining a rare NFT for larger
                contributions. Donors also accumulate XP that places them on a leaderboard, fostering healthy competition for
                solidarity and philanthropy.
              </p>
            </motion.div>

            <motion.div
              className="flex items-center justify-center gap-3 flex-wrap mt-16"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              {["Blockchain", "NFT", "XRP", "Tokenization", "Solidarity"].map((tag, i) => (
                <motion.span
                  key={i}
                  className="bg-gray-800/60 px-4 py-2 rounded-xl text-gray-400 text-sm border border-gray-700/50"
                  whileHover={{ 
                    scale: 1.05, 
                    backgroundColor: "rgba(52, 211, 153, 0.2)",
                    color: "#4ade80",
                    borderColor: "rgba(52, 211, 153, 0.3)"
                  }}
                >
                  #{tag}
                </motion.span>
              ))}
            </motion.div>

            <motion.div
              className="mt-24 pt-8 border-t border-gray-800/50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 1 }}
            >
              <p className="text-sm text-gray-400">
                Developed during the Paris Blockchain Week as part of the XRP Humanity & Solidarity track by Elina
                Jankovskaja, Ramzy Bouziane, Joseph Sommet, Teo Babou, and Lucas Maret.
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      {/* Décoration de bas de page */}
      <motion.div 
        className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-green-500"
        animate={{ 
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] 
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  );
}

export default AboutPage;