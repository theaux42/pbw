"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import './globals.css'

export default function HomePage() {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <main className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 p-6 md:p-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 flex flex-col justify-center"
        >
          <div className="inline-block mb-4">
            <span className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-green-400 px-4 py-1.5 rounded-full text-xs font-medium">
              Powered by XRP Ledger
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
            A New Era of Transparent Giving
          </h1>
          
          <p className="text-gray-300 text-lg mb-8 max-w-2xl">
            FundXR transforms charitable donations with blockchain technology,
            making every contribution transparent, traceable, and rewarding.
          </p>
          
          <div className="flex flex-wrap gap-4">
            <button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 px-6 py-3 rounded-xl font-medium transition-colors shadow-md">
              Connect Wallet
            </button>
            <button className="bg-gray-800/40 backdrop-blur-sm hover:bg-gray-800/60 border border-gray-700/50 px-6 py-3 rounded-xl font-medium transition-all">
              Learn More
            </button>
          </div>
        </motion.div>

        <motion.aside 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="w-full md:w-96 bg-gray-800/30 backdrop-blur-md p-6 rounded-2xl border border-gray-700/50 shadow-xl"
        >
          <div className="mb-6">
            <h2 className="text-sm mb-3 text-gray-400 font-medium">Top Donors This Week</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2">
                <span className="text-lg">🥇</span>
                <span className="font-medium">David Kim</span>
                <span className="ml-auto text-green-400 font-medium">1,250 XP</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-lg">🥈</span>
                <span className="font-medium">Alex Johnson</span>
                <span className="ml-auto text-green-400 font-medium">980 XP</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-lg">🥉</span>
                <span className="font-medium">James Lee</span>
                <span className="ml-auto text-green-400 font-medium">875 XP</span>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm font-medium">Earth Day Challenge</p>
              <span className="text-xs text-green-400">65%</span>
            </div>
            <div className="w-full bg-gray-700/50 h-2 rounded-full mb-3">
              <div className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 w-2/3 rounded-full"></div>
            </div>
            <button className="bg-gray-700/50 hover:bg-gray-700/70 px-4 py-2 rounded-lg text-xs font-medium border border-green-500/20 hover:border-green-500/40 transition-all">
              Join Challenge
            </button>
          </div>

          <div className="space-y-4">
            <Donation user="William Taylor" amount="100 XRP" xp="+10 XP" badge="Gold Donor" />
            <Donation user="Emma Wilson" amount="50 XRP" xp="+5 XP" badge="Bronze Donor" />
            <Donation user="Michael Brown" amount="100 XRP" xp="+10 XP" badge="Gold Donor" />
          </div>
        </motion.aside>
      </main>

      <footer className="p-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-gray-800/50 text-center text-gray-400 text-sm">
        <div className="flex flex-col">
          <span className="font-medium text-lg text-green-400">1.2K+</span>
          <span>Active Donors</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-lg text-green-400">450K</span>
          <span>Total Donated XRP</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-lg text-green-400">3.5K</span>
          <span>NFTs Minted</span>
        </div>
        <div className="flex flex-col">
          <span className="font-medium text-lg text-green-400">82</span>
          <span>Projects Funded</span>
        </div>
      </footer>
    </div>
  );
}

function Donation({ user, amount, xp, badge }) {
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-xl text-sm border border-gray-700/50 hover:border-green-500/30 transition-all">
      <p className="mb-1">
        <span className="font-semibold">{user}</span> donated
      </p>
      <div className="flex justify-between items-center">
        <p className="font-medium text-lg">{amount}</p>
        <p className="text-green-400 font-medium">{xp}</p>
      </div>
      <div className="mt-2">
        <span className="text-xs bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 px-2 py-0.5 rounded-full font-medium">{badge}</span>
      </div>
    </div>
  );
}