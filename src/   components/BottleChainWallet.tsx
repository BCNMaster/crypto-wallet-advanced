// src/components/BottleChainWallet.tsx
import React, { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  ArrowDownRight, 
  TrendingUp, 
  TrendingDown, 
  Send, 
  RefreshCcw, 
  BarChart2,
  Repeat2,
  Link 
} from 'lucide-react';

const CoinLogos = {
  btl: '/api/placeholder/50/50',  // Bottle Chain Network Logo
  eth: '/api/placeholder/50/50',  // Ethereum Logo
  usdc: '/api/placeholder/50/50'  // USDC Logo
};

const BottleChainWallet = () => {
  const [balance, setBalance] = useState({
    btl: {
      amount: 1.5342,
      price: 45.67,
      change: 3.24,
      logo: CoinLogos.btl
    },
    eth: {
      amount: 24.7891,
      price: 3456.22,
      change: -1.55,
      logo: CoinLogos.eth
    },
    usdc: {
      amount: 5234.56,
      price: 1.00,
      change: 0.01,
      logo: CoinLogos.usdc
    }
  });

  const [transactions, setTransactions] = useState([
    { 
      id: 1, 
      type: 'receive', 
      crypto: 'BTL', 
      amount: 0.5, 
      usdValue: 22.85,
      date: '2024-06-15', 
      status: 'Completed' 
    },
    { 
      id: 2, 
      type: 'send', 
      crypto: 'ETH', 
      amount: 2.3, 
      usdValue: 7945.32,
      date: '2024-06-14', 
      status: 'Completed' 
    }
  ]);

  const [activeModal, setActiveModal] = useState(null);

  const renderSwapModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Swap Tokens</h2>
        <div className="space-y-4">
          <div className="flex items-center bg-gray-700 rounded-lg p-4">
            <img src={CoinLogos.eth} alt="From Token" className="w-8 h-8 mr-4" />
            <select className="bg-transparent text-white w-full">
              <option>ETH</option>
              <option>BTL</option>
              <option>USDC</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <Repeat2 className="text-white" />
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-4">
            <img src={CoinLogos.btl} alt="To Token" className="w-8 h-8 mr-4" />
            <select className="bg-transparent text-white w-full">
              <option>BTL</option>
              <option>ETH</option>
              <option>USDC</option>
            </select>
          </div>
          <button 
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
            onClick={() => setActiveModal(null)}
          >
            Swap
          </button>
          <button 
            className="w-full text-white py-3 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderBridgeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl p-8 w-96">
        <h2 className="text-2xl font-bold mb-6">Bridge Tokens</h2>
        <div className="space-y-4">
          <div className="flex items-center bg-gray-700 rounded-lg p-4">
            <img src={CoinLogos.btl} alt="From Network" className="w-8 h-8 mr-4" />
            <select className="bg-transparent text-white w-full">
              <option>Bottle Chain Network</option>
              <option>Ethereum</option>
              <option>Binance Smart Chain</option>
            </select>
          </div>
          <div className="flex items-center justify-center">
            <Link className="text-white" />
          </div>
          <div className="flex items-center bg-gray-700 rounded-lg p-4">
            <img src={CoinLogos.eth} alt="To Network" className="w-8 h-8 mr-4" />
            <select className="bg-transparent text-white w-full">
              <option>Ethereum</option>
              <option>Bottle Chain Network</option>
              <option>Binance Smart Chain</option>
            </select>
          </div>
          <button 
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
            onClick={() => setActiveModal(null)}
          >
            Bridge
          </button>
          <button 
            className="w-full text-white py-3 rounded-lg hover:bg-gray-700 transition"
            onClick={() => setActiveModal(null)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Modals */}
      {activeModal === 'swap' && renderSwapModal()}
      {activeModal === 'bridge' && renderBridgeModal()}

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <BottleChainLogo className="w-12 h-12" />
            <h1 className="text-2xl font-bold">Bottle Chain Network</h1>
          </div>
          <div className="flex space-x-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition">
              <Send size={16} className="mr-2" /> Send
            </button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition">
              <ArrowDownRight size={16} className="mr-2" /> Receive
            </button>
          </div>
        </div>

        {/* Crypto Balances */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {Object.entries(balance).map(([crypto, details]) => (
            <div 
              key={crypto} 
              className="bg-gray-800 rounded-xl p-6 shadow-xl hover:scale-105 transition-transform"
            >
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={details.logo} 
                    alt={`${crypto} logo`} 
                    className="w-8 h-8 rounded-full"
                  />
                  <h2 className="text-xl font-semibold uppercase">{crypto}</h2>
                </div>
                {details.change >= 0 ? (
                  <TrendingUp className="text-green-500" />
                ) : (
                  <TrendingDown className="text-red-500" />
                )}
              </div>
              <div>
                <p className="text-3xl font-bold mb-2">{details.amount}</p>
                <div className="flex justify-between">
                  <p className="text-sm text-gray-400">${details.price.toLocaleString()}</p>
                  <p className={`
                    font-semibold ${details.change >= 0 ? 'text-green-500' : 'text-red-500'}
                  `}>
                    {details.change >= 0 ? '+' : ''}{details.change}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Transactions and Portfolio */}
        <div className="grid md:grid-cols-3 gap-4">
          {/* Transactions */}
          <div className="md:col-span-2 bg-gray-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Transactions</h2>
              <button className="text-blue-400 hover:text-blue-300 transition flex items-center">
                <RefreshCcw size={16} className="mr-2" /> Refresh
              </button>
            </div>
            <table className="w-full">
              <thead className="border-b border-gray-700">
                <tr>
                  <th className="text-left p-3">Type</th>
                  <th className="text-left p-3">Crypto</th>
                  <th className="text-right p-3">Amount</th>
                  <th className="text-right p-3">USD Value</th>
                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(transaction => (
                  <tr 
                    key={transaction.id} 
                    className="border-b border-gray-700 hover:bg-gray-700 transition"
                  >
                    <td className="p-3">
                      <span className={`
                        ${transaction.type === 'receive' ? 'text-green-400' : 'text-red-400'}
                        font-medium capitalize
                      `}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="p-3 font-semibold">{transaction.crypto}</td>
                    <td className="p-3 text-right">{transaction.amount}</td>
                    <td className="p-3 text-right">${transaction.usdValue.toLocaleString()}</td>
                    <td className="p-3 text-gray-400">{transaction.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-800 rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="space-y-4">
              <button 
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-blue-700 transition"
                onClick={() => setActiveModal('swap')}
              >
                <Repeat2 size={20} className="mr-2" /> Swap
              </button>
              <button 
                className="w-full bg-green-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-green-700 transition"
                onClick={() => setActiveModal('bridge')}
              >
                <Link size={20} className="mr-2" /> Bridge
              </button>
              <button className="w-full bg-gray-600 text-white py-3 rounded-lg flex items-center justify-center hover:bg-gray-700 transition">
                <BarChart2 size={20} className="mr-2" /> Trade
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Inline Logo Component
const BottleChainLogo = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 200 200" 
    className={className}
  >
    <defs>
      <linearGradient id="bottleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
        <stop offset="100%" stopColor="#1E40AF" stopOpacity="1" />
      </linearGradient>
    </defs>
    
    {/* Bottle Outline */}
    <path 
      d="M100 40 L130 70 L130 140 C130 170 100 180 100 180 C100 180 70 170 70 140 L70 70 Z" 
      fill="url(#bottleGradient)" 
      stroke="#FFFFFF" 
      strokeWidth="6"
    />
    
    {/* Chain Links */}
    <path 
      d="M70 100 L130 100" 
      stroke="#FFFFFF" 
      strokeWidth="6" 
      strokeDasharray="10 10"
    />
    
    {/* Network Nodes */}
    <circle cx="60" cy="100" r="10" fill="#FFFFFF" />
    <circle cx="140" cy="100" r="10" fill="#FFFFFF" />
  </svg>
);

export default BottleChainWallet;
