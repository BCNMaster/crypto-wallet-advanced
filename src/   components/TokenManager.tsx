// src/components/TokenManager.tsx

import React, { useState, useEffect } from 'react';
import { Plus, Search, AlertTriangle, Check, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock data for demonstration
const defaultTokens = [
  {
    address: '0x1234...5678',
    symbol: 'BTL',
    name: 'Bottle Chain Token',
    decimals: 18,
    balance: '1000.00',
    price: 45.67,
    priceChange: 3.24,
    logo: '/api/placeholder/40/40'
  },
  {
    address: '0x8765...4321',
    symbol: 'ETH',
    name: 'Ethereum',
    decimals: 18,
    balance: '24.7891',
    price: 3456.22,
    priceChange: -1.55,
    logo: '/api/placeholder/40/40'
  },
  {
    address: '0x9876...5432',
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    balance: '5234.56',
    price: 1.00,
    priceChange: 0.01,
    logo: '/api/placeholder/40/40'
  }
];

const TokenManager = ({ tokenService, onTokenSelect }) => {
  const [tokens, setTokens] = useState(defaultTokens);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddToken, setShowAddToken] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTokens, setSelectedTokens] = useState(new Set(['BTL', 'ETH', 'USDC']));
  
  const [newToken, setNewToken] = useState({
    address: '',
    symbol: '',
    name: '',
    decimals: 18
  });

  // Filter tokens based on search query
  const filteredTokens = tokens.filter(token => 
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTokenToggle = (symbol) => {
    const newSelected = new Set(selectedTokens);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedTokens(newSelected);
  };

  const validateTokenAddress = async (address) => {
    // In a real implementation, this would validate the token contract
    return address.length === 42 && address.startsWith('0x');
  };

  const handleAddToken = async () => {
    try {
      setLoading(true);
      setError(null);

      // Validate address
      const isValid = await validateTokenAddress(newToken.address);
      if (!isValid) {
        throw new Error('Invalid token address');
      }

      // In a real implementation, we would:
      // 1. Fetch token metadata from the contract
      // 2. Verify the contract is a valid ERC20
      // 3. Get token decimals and symbol
      // 4. Get current balance

      const mockNewToken = {
        ...newToken,
        balance: '0.00',
        price: 0,
        priceChange: 0,
        logo: '/api/placeholder/40/40'
      };

      setTokens([...tokens, mockNewToken]);
      setSelectedTokens(new Set([...selectedTokens, mockNewToken.symbol]));
      setShowAddToken(false);
      setNewToken({ address: '', symbol: '', name: '', decimals: 18 });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderAddTokenForm = () => (
    <div className="bg-gray-800 rounded-xl p-6 space-y-4">
      <h3 className="text-xl font-bold mb-4">Add Custom Token</h3>
      
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Token Contract Address</label>
          <input
            type="text"
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            placeholder="0x..."
            value={newToken.address}
            onChange={(e) => setNewToken({ ...newToken, address: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Token Symbol</label>
          <input
            type="text"
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            placeholder="e.g., BTL"
            value={newToken.symbol}
            onChange={(e) => setNewToken({ ...newToken, symbol: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Token Name</label>
          <input
            type="text"
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            placeholder="e.g., Bottle Chain Token"
            value={newToken.name}
            onChange={(e) => setNewToken({ ...newToken, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Decimals</label>
          <input
            type="number"
            className="w-full bg-gray-700 rounded-lg px-4 py-2"
            value={newToken.decimals}
            onChange={(e) => setNewToken({ ...newToken, decimals: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex space-x-4">
          <button
            className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={handleAddToken}
            disabled={loading}
          >
            Add Token
          </button>
          <button
            className="flex-1 bg-gray-700 text-white py-2 rounded-lg hover:bg-gray-600 transition"
            onClick={() => setShowAddToken(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  const renderTokenList = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            className="w-full bg-gray-700 rounded-lg pl-10 pr-4 py-2"
            placeholder="Search tokens..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button
          className="ml-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          onClick={() => setShowAddToken(true)}
        >
          <Plus className="w-4 h-4 mr-2" /> Add Token
        </button>
      </div>

      <div className="space-y-2">
        {filteredTokens.map((token) => (
          <div
            key={token.address}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
          >
            <div className="flex items-center space-x-4">
              <img
                src={token.logo}
                alt={token.name}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <div className="font-medium">{token.symbol}</div>
                <div className="text-sm text-gray-400">{token.name}</div>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="font-medium">{token.balance}</div>
                <div className="text-sm text-gray-400">
                  ${(parseFloat(token.balance) * token.price).toFixed(2)}
                </div>
              </div>

              <button
                onClick={() => handleTokenToggle(token.symbol)}
                className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  selectedTokens.has(token.symbol)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-600 hover:bg-gray-500'
                }`}
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="p-6">
      {showAddToken ? renderAddTokenForm() : renderTokenList()}
    </div>
  );
};

export default TokenManager;
