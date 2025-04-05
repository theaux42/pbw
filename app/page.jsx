"use client";

import { useState } from "react";
import './globals.css'

export default function FundXR() {
  const [walletConnected, setWalletConnected] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <header className="flex justify-between items-center p-6 border-b border-neutral-700">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-bold">FundXR</span>
          <nav className="flex gap-6 text-neutral-400">
            <a href="#">Gallery</a>
            <a href="#">Give Tips</a>
          </nav>
        </div>
        <div className="flex gap-4">
          <button className="bg-green-500 px-4 py-2 rounded-md text-sm" onClick={() => setWalletConnected(true)}>
            Connect Wallet
          </button>
          <button className="border border-neutral-600 px-4 py-2 rounded-md text-sm">
            Sign In
          </button>
        </div>
      </header>

      <main className="flex flex-col md:flex-row gap-8 p-10">
        <div className="flex-1 flex flex-col justify-center">
          <p className="text-xs text-neutral-400 mb-2">Powered by XRP Ledger</p>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-4">
            A New Era of Transparent Giving
          </h1>
          <p className="text-neutral-400 mb-6">
            FundXR transforms charitable donations with blockchain technology,
            making every contribution transparent, traceable, and rewarding.
          </p>
          <div className="flex gap-4">
            <button className="bg-green-500 px-6 py-3 rounded-md font-medium">
              Connect Wallet
            </button>
            <button className="bg-neutral-700 px-6 py-3 rounded-md font-medium">
              Learn More
            </button>
          </div>
        </div>

        <aside className="w-full md:w-96 bg-neutral-800 p-6 rounded-xl">
          <div className="mb-6">
            <h2 className="text-sm mb-2 text-neutral-400">Top Donors This Week</h2>
            <ul className="space-y-2 text-sm">
              <li>🥇 David Kim — 1,250 XP</li>
              <li>🥈 Alex Johnson — 980 XP</li>
              <li>🥉 James Lee — 875 XP</li>
            </ul>
          </div>

          <div className="mb-6">
            <p className="text-sm mb-2">Earth Day Challenge</p>
            <div className="w-full bg-neutral-700 h-2 rounded-full mb-2">
              <div className="bg-green-500 h-2 w-2/3 rounded-full"></div>
            </div>
            <button className="bg-neutral-700 px-4 py-2 rounded-md text-xs">
              Join Challenge
            </button>
          </div>

          <div className="space-y-4">
            <Donation user="William Taylor" amount="100 XRP" xp="+10 XP" badge="Gold Donor" />
            <Donation user="Emma Wilson" amount="50 XRP" xp="+5 XP" badge="Bronze Donor" />
            <Donation user="Michael Brown" amount="100 XRP" xp="+10 XP" badge="Gold Donor" />
          </div>
        </aside>
      </main>

      <footer className="p-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-neutral-700 text-center text-neutral-400 text-sm">
        <div>Active Donors</div>
        <div>Total Donated</div>
        <div>NFTs Minted</div>
        <div>Projects Funded</div>
      </footer>
    </div>
  );
}

function Donation({ user, amount, xp, badge }) {
  return (
    <div className="bg-neutral-700 p-4 rounded-lg text-sm">
      <p className="mb-1">
        <span className="font-semibold">{user}</span> donated
      </p>
      <p className="mb-1">{amount}</p>
      <p className="text-green-400 mb-1">{xp}</p>
      <span className="text-xs bg-yellow-500 text-black px-2 py-0.5 rounded">{badge}</span>
    </div>
  );
}
