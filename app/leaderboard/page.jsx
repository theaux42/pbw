'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMedal, FaTrophy, FaSearch, FaAward, FaGem, FaDonate } from 'react-icons/fa';
import { HiChevronUp, HiChevronDown } from 'react-icons/hi';

// Achievement badge component
const AchievementBadge = ({ type, tooltip }) => {
  const getIcon = () => {
    switch (type) {
      case 'first_donation':
        return <FaDonate className="text-green-400" />;
      case 'xp_master':
        return <FaGem className="text-purple-400" />;
      case 'regular_donor':
        return <FaAward className="text-yellow-400" />;
      default:
        return <FaTrophy className="text-gray-400" />;
    }
  };

  return (
    <div className="relative group">
      <div className="bg-gray-800 border border-gray-700 rounded-full p-2 mx-1">
        {getIcon()}
      </div>
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-xs text-white rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none border border-gray-700">
        {tooltip}
      </div>
    </div>
  );
};

export default function LeaderboardPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('xp');
  const [sortDirection, setSortDirection] = useState('desc');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Create fake data for the leaderboard
  useEffect(() => {
    const generateFakeData = () => {
      const names = [
        'CryptoKing', 'XRPHodler', 'BlockchainBaron', 'SatoshiDreamer', 'RippleRider',
        'TokenMaster', 'DeFiQueen', 'ChainLinkHero', 'EtherEagle', 'BitcoinBull',
        'CryptoNova', 'RippleRanger', 'LedgerLegend', 'HashHunter', 'BlockExplorer',
        'WalletWarrior', 'NodeNavigator', 'MinerMaven', 'GasPriceGuru', 'XRPXplorer'
      ];
      
      return names.map((name, index) => {
        const xp = Math.floor(Math.random() * 5000) + 1000;
        const total_donated = (Math.random() * 1000 + 50).toFixed(2);
        const donation_count = Math.floor(Math.random() * 50) + 1;
        const last_donation = new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000);
        
        // Generate random achievements for each user
        const achievements = [];
        if (Math.random() > 0.3) {
          achievements.push({
            id: 'first_donation',
            name: 'First Donation',
            description: 'Made your first donation on FundXR'
          });
        }
        if (xp > 1000 && Math.random() > 0.5) {
          achievements.push({
            id: 'xp_master',
            name: 'XP Master',
            description: 'Earned 1000 XP on FundXR'
          });
        }
        if (donation_count >= 5 && Math.random() > 0.7) {
          achievements.push({
            id: 'regular_donor',
            name: 'Regular Donor',
            description: 'Made 5 donations on FundXR'
          });
        }
        
        return {
          id: index + 1,
          name,
          wallet: `r${Math.random().toString(36).substring(2, 10)}...${Math.random().toString(36).substring(2, 6)}`,
          xp,
          total_donated,
          donation_count,
          last_donation,
          avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${name}`,
          achievements
        };
      });
    };

    setTimeout(() => {
      setLeaderboardData(generateFakeData());
      setIsLoading(false);
    }, 1000); // Simulate loading
  }, []);

  // Filter and sort the data
  const filteredAndSortedData = leaderboardData
    .filter(player => 
      player.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.wallet.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const multiplier = sortDirection === 'asc' ? 1 : -1;
      if (sortField === 'xp') {
        return multiplier * (a.xp - b.xp);
      } else if (sortField === 'total_donated') {
        return multiplier * (parseFloat(a.total_donated) - parseFloat(b.total_donated));
      } else if (sortField === 'donation_count') {
        return multiplier * (a.donation_count - b.donation_count);
      }
      return 0;
    });

  // Helper function to calculate level from XP
  const calculateLevel = (xp) => {
    return Math.floor(Math.sqrt(xp / 100)) + 1;
  };

  // Helper function to format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Toggle sort direction
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Render medal or position
  const renderPosition = (position) => {
    if (position === 1) {
      return <FaMedal className="text-yellow-400 text-2xl" />;
    } else if (position === 2) {
      return <FaMedal className="text-gray-400 text-2xl" />;
    } else if (position === 3) {
      return <FaMedal className="text-amber-700 text-2xl" />;
    } else {
      return <span className="text-gray-500 font-semibold text-xl">{position}</span>;
    }
  };

  // Loading animation
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-2">Loading Leaderboard</h2>
        <p className="text-gray-400">Retrieving the latest champions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">XRP Community Leaderboard</h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            Celebrating the champions who are making a difference in the XRP community.
            Compete, donate, and earn your place at the top!
          </p>
        </div>
        
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FaSearch className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-gray-800 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
            placeholder="Search by name or wallet address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="bg-gray-800 rounded-xl shadow-xl overflow-hidden border border-gray-700">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead className="bg-gray-800">
                <tr>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Rank
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Player
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('xp')}
                  >
                    <div className="flex items-center">
                      XP / Level
                      {sortField === 'xp' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('total_donated')}
                  >
                    <div className="flex items-center">
                      Total Donated
                      {sortField === 'total_donated' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('donation_count')}
                  >
                    <div className="flex items-center">
                      Donations
                      {sortField === 'donation_count' && (
                        <span className="ml-1">
                          {sortDirection === 'asc' ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                        </span>
                      )}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Last Donation
                  </th>
                  <th scope="col" className="px-6 py-4 text-center text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Achievements
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {filteredAndSortedData.map((player, index) => (
                  <motion.tr 
                    key={player.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(16, 185, 129, 0.1)' }}
                    className="hover:bg-gray-750 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        {renderPosition(index + 1)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img 
                            className="h-10 w-10 rounded-full bg-gray-700 border border-gray-600" 
                            src={player.avatar} 
                            alt={player.name} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{player.name}</div>
                          <div className="text-sm text-gray-400">{player.wallet}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{player.xp.toLocaleString()} XP</div>
                      <div className="text-sm text-green-400">Level {calculateLevel(player.xp)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{player.total_donated} XRP</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{player.donation_count}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                      {formatDate(player.last_donation)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex justify-center">
                        {player.achievements.length > 0 ? (
                          player.achievements.map((achievement) => (
                            <AchievementBadge 
                              key={achievement.id}
                              type={achievement.id}
                              tooltip={achievement.name}
                            />
                          ))
                        ) : (
                          <span className="text-gray-500 text-sm">No achievements yet</span>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            The leaderboard updates every hour. Make your donations and climb the ranks!
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
