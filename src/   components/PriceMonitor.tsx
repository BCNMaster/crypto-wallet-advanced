// src/components/PriceMonitor.tsx

import React, { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Fuel, RefreshCw } from 'lucide-react';

// Mock data for demonstration
const mockPrices = new Map([
  ['BTL', {
    price: 45.67,
    change24h: 3.24,
    lastUpdated: Date.now(),
    source: 'bottleOracle'
  }],
  ['ETH', {
    price: 3456.22,
    change24h: -1.55,
    lastUpdated: Date.now(),
    source: 'chainlink'
  }],
  ['USDC', {
    price: 1.00,
    change24h: 0.01,
    lastUpdated: Date.now(),
    source: 'chainlink'
  }]
]);

const mockGasPrices = new Map([
  ['bottle-chain', {
    instant: { toString: () => '50' },
    fast: { toString: () => '40' },
    standard: { toString: () => '30' },
    slow: { toString: () => '20' },
    lastUpdated: Date.now()
  }],
  ['ethereum', {
    instant: { toString: () => '100' },
    fast: { toString: () => '80' },
    standard: { toString: () => '60' },
    slow: { toString: () => '40' },
    baseFee: { toString: () => '30' },
    lastUpdated: Date.now()
  }]
]);

// Mock services for demonstration
const mockServices = {
  priceFeedService: {
    subscribeToUpdates: (callback) => () => {},
    getAllPrices: () => mockPrices
  },
  gasService: {
    subscribeToUpdates: (callback) => () => {},
    getAllGasPrices: () => mockGasPrices,
    formatGasPrice: (chainId, price) => `${price.toString()} Gwei`
  }
};

const PriceMonitor = ({ 
  priceFeedService = mockServices.priceFeedService, 
  gasService = mockServices.gasService 
}) => {
  const [prices, setPrices] = useState(mockPrices);
  const [gasPrices, setGasPrices] = useState(mockGasPrices);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChain, setSelectedChain] = useState('bottle-chain');

  useEffect(() => {
    let priceUnsubscribe = () => {};
    let gasUnsubscribe = () => {};

    if (priceFeedService?.subscribeToUpdates) {
      priceUnsubscribe = priceFeedService.subscribeToUpdates((symbol, price) => {
        setPrices(prevPrices => new Map(prevPrices).set(symbol, price));
      });
    }

    if (gasService?.subscribeToUpdates) {
      gasUnsubscribe = gasService.subscribeToUpdates((chainId, gasPrice) => {
        setGasPrices(prevGas => new Map(prevGas).set(chainId, gasPrice));
      });
    }

    refreshData();

    return () => {
      priceUnsubscribe();
      gasUnsubscribe();
    };
  }, [priceFeedService, gasService]);

  const refreshData = async () => {
    setRefreshing(true);
    try {
      if (priceFeedService?.getAllPrices) {
        const currentPrices = priceFeedService.getAllPrices();
        setPrices(currentPrices);
      }
      
      if (gasService?.getAllGasPrices) {
        const currentGas = gasService.getAllGasPrices();
        setGasPrices(currentGas);
      }
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setRefreshing(false);
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const renderPriceCard = (symbol, priceData) => (
    <div key={symbol} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-700 transition">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <img
            src={`/api/placeholder/32/32`}
            alt={symbol}
            className="w-8 h-8 rounded-full"
          />
          <span className="font-semibold">{symbol}</span>
        </div>
        {priceData.change24h > 0 ? (
          <TrendingUp className="text-green-400" />
        ) : (
          <TrendingDown className="text-red-400" />
        )}
      </div>
      
      <div className="text-2xl font-bold mb-1">
        {formatCurrency(priceData.price)}
      </div>
      
      <div className="flex justify-between items-center">
        <span className={`text-sm ${
          priceData.change24h > 0 ? 'text-green-400' : 'text-red-400'
        }`}>
          {priceData.change24h > 0 ? '+' : ''}{priceData.change24h.toFixed(2)}%
        </span>
        <span className="text-sm text-gray-400">
          {priceData.source}
        </span>
      </div>
    </div>
  );

  const renderGasCard = (chainId, gasData) => (
    <div key={chainId} className="bg-gray-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Fuel className="text-yellow-400" />
          <span className="font-semibold">{chainId} Gas</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Instant</span>
          <span className="font-mono">
            {gasService.formatGasPrice(chainId, gasData.instant)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Fast</span>
          <span className="font-mono">
            {gasService.formatGasPrice(chainId, gasData.fast)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Standard</span>
          <span className="font-mono">
            {gasService.formatGasPrice(chainId, gasData.standard)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Slow</span>
          <span className="font-mono">
            {gasService.formatGasPrice(chainId, gasData.slow)}
          </span>
        </div>
      </div>

      {gasData.baseFee && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Base Fee</span>
            <span className="font-mono">
              {gasService.formatGasPrice(chainId, gasData.baseFee)}
            </span>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Market Data</h2>
        <button
          onClick={refreshData}
          className={`p-2 rounded-lg hover:bg-gray-800 transition ${
            refreshing ? 'animate-spin' : ''
          }`}
          disabled={refreshing}
        >
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(prices.entries()).map(([symbol, priceData]) =>
          renderPriceCard(symbol, priceData)
        )}
      </div>

      <h2 className="text-xl font-bold mt-8 mb-4">Gas Prices</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from(gasPrices.entries()).map(([chainId, gasData]) =>
          renderGasCard(chainId, gasData)
        )}
      </div>
    </div>
  );
};

export default PriceMonitor;
