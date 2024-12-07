// src/components/ChainBridge.tsx

import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, Loader, ExternalLink, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const networks = [
  {
    id: 'bottle-chain',
    name: 'Bottle Chain',
    icon: '/api/placeholder/32/32',
    nativeCurrency: 'BTL',
    explorerUrl: 'https://explorer.bottlechain.network'
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    icon: '/api/placeholder/32/32',
    nativeCurrency: 'ETH',
    explorerUrl: 'https://etherscan.io'
  },
  {
    id: 'bsc',
    name: 'BNB Chain',
    icon: '/api/placeholder/32/32',
    nativeCurrency: 'BNB',
    explorerUrl: 'https://bscscan.com'
  }
];

const mockTokens = [
  { symbol: 'BTL', name: 'Bottle Token', balance: '1000.00', price: 45.67 },
  { symbol: 'ETH', name: 'Ethereum', balance: '5.5', price: 3000.00 },
  { symbol: 'USDC', name: 'USD Coin', balance: '5000.00', price: 1.00 }
];

const ChainBridge = () => {
  const [sourceNetwork, setSourceNetwork] = useState(networks[0]);
  const [targetNetwork, setTargetNetwork] = useState(networks[1]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [bridgeFee, setBridgeFee] = useState(null);
  const [estimatedTime, setEstimatedTime] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    if (selectedToken && amount) {
      estimateBridgeFee();
    }
  }, [selectedToken, amount, sourceNetwork, targetNetwork]);

  const estimateBridgeFee = async () => {
    try {
      setBridgeFee({
        amount: (parseFloat(amount) * 0.001).toFixed(6),
        token: selectedToken.symbol,
        usdValue: (parseFloat(amount) * 0.001 * selectedToken.price).toFixed(2)
      });
      setEstimatedTime('~15 minutes');
    } catch (err) {
      setError('Failed to estimate bridge fee');
    }
  };

  const handleBridge = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock bridge transaction
      await new Promise(res => setTimeout(res, 2000));

      const txHash = '0x' + Math.random().toString(16).slice(2);
      const newTx = {
        hash: txHash,
        sourceNetwork,
        targetNetwork,
        token: selectedToken,
        amount,
        status: 'pending',
        timestamp: Date.now()
      };

      setRecentTransactions([newTx, ...recentTransactions]);

      // Reset form
      setAmount('');
      setSelectedToken(null);
    } catch (err) {
      setError('Bridge transaction failed');
    } finally {
      setLoading(false);
    }
  };

  const renderNetworkSelector = (type, selected, onChange) => (
    <div className="bg-gray-800 rounded-lg p-4">
      <label className="block text-sm text-gray-400 mb-2">
        {type === 'source' ? 'From' : 'To'} Network
      </label>
      <div className="relative">
        <select
          className="w-full bg-gray-700 rounded-lg px-4 py-2 appearance-none"
          value={selected.id}
          onChange={(e) => {
            const network = networks.find(n => n.id === e.target.value);
            onChange(network);
          }}
        >
          {networks.map(network => (
            <option key={network.id} value={network.id}>
              {network.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <img
            src={selected.icon}
            alt={selected.name}
            className="w-6 h-6 rounded-full"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold mb-6">Bridge Assets</h2>

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4">
          {renderNetworkSelector('source', sourceNetwork, setSourceNetwork)}
          {renderNetworkSelector('target', targetNetwork, setTargetNetwork)}
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">
            Select Token
          </label>
          <div className="relative">
            <select
              className="w-full bg-gray-700 rounded-lg px-4 py-2 appearance-none"
              value={selectedToken?.symbol || ''}
              onChange={(e) => {
                const token = mockTokens.find(t => t.symbol === e.target.value);
                setSelectedToken(token);
              }}
            >
              <option value="">Select a token</option>
              {mockTokens.map(token => (
                <option key={token.symbol} value={token.symbol}>
                  {token.symbol} - Balance: {token.balance}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-4">
          <label className="block text-sm text-gray-400 mb-2">
            Amount
          </label>
          <input
            type="number"
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            placeholder="0.0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          {selectedToken && (
            <div className="text-sm text-gray-400 mt-2">
              Balance: {selectedToken.balance} {selectedToken.symbol}
            </div>
          )}
        </div>

        {bridgeFee && (
          <div className="bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Bridge Fee</span>
              <span>{bridgeFee.amount} {bridgeFee.token} (${bridgeFee.usdValue})</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Estimated Time</span>
              <span>{estimatedTime}</span>
            </div>
          </div>
        )}

        <button
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading || !selectedToken || !amount}
          onClick={handleBridge}
        >
          {loading ? (
            <Loader className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            'Bridge Assets'
          )}
        </button>

        {recentTransactions.length > 0 && (
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
            <div className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.hash} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                  <div>
                    <div className="flex items-center space-x-2">
                      <img src={tx.sourceNetwork.icon} alt="" className="w-4 h-4 rounded-full" />
                      <ArrowRight size={16} />
                      <img src={tx.targetNetwork.icon} alt="" className="w-4 h-4 rounded-full" />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {tx.amount} {tx.token.symbol}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className={`text-sm ${
                      tx.status === 'completed' ? 'text-green-400' :
                      tx.status === 'pending' ? 'text-yellow-400' :
                      'text-red-400'
                    }`}>
                      {tx.status}
                    </div>
                    <a
                      href={`${tx.sourceNetwork.explorerUrl}/tx/${tx.hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChainBridge;
