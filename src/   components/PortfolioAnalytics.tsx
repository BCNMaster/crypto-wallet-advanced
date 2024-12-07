// src/components/PortfolioAnalytics.tsx

import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ChevronDown, TrendingUp, TrendingDown, DollarSign, BarChart2 } from 'lucide-react';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];
const TIMEFRAMES = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

// Mock data generator for demonstration
const generateMockData = (days) => {
  const now = Date.now();
  const data = [];
  let value = 10000;

  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.5) * 1000;
    value += change;
    data.push({
      timestamp: now - (days - i) * 24 * 60 * 60 * 1000,
      value: value,
      change: change
    });
  }
  return data;
};

// Mock portfolio data
const mockPortfolio = {
  totalValue: 25678.90,
  change24h: 1234.56,
  changePercent24h: 5.2,
  tokens: [
    { symbol: 'BTL', value: 12000, allocation: 46.7 },
    { symbol: 'ETH', value: 8000, allocation: 31.2 },
    { symbol: 'USDC', value: 5678.90, allocation: 22.1 }
  ],
  history: generateMockData(30)
};

const PortfolioAnalytics = () => {
  const [timeframe, setTimeframe] = useState('1M');
  const [portfolioData, setPortfolioData] = useState(mockPortfolio);
  const [showAllTokens, setShowAllTokens] = useState(false);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const handleTimeframeChange = (newTimeframe) => {
    setTimeframe(newTimeframe);
    // In a real implementation, fetch new data based on timeframe
    const days = {
      '1D': 1,
      '1W': 7,
      '1M': 30,
      '3M': 90,
      '1Y': 365,
      'ALL': 365
    }[newTimeframe];
    setPortfolioData({ ...portfolioData, history: generateMockData(days) });
  };

  const renderValueChart = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-semibold">Portfolio Value</h3>
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              {formatCurrency(portfolioData.totalValue)}
            </span>
            <span className={`flex items-center ${
              portfolioData.changePercent24h >= 0 ? 'text-green-400' : 'text-red-400'
            }`}>
              {portfolioData.changePercent24h >= 0 ? (
                <TrendingUp className="w-4 h-4 mr-1" />
              ) : (
                <TrendingDown className="w-4 h-4 mr-1" />
              )}
              {portfolioData.changePercent24h}%
            </span>
          </div>
        </div>
        <div className="flex space-x-2">
          {TIMEFRAMES.map(tf => (
            <button
              key={tf}
              onClick={() => handleTimeframeChange(tf)}
              className={`px-3 py-1 rounded ${
                timeframe === tf 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={portfolioData.history}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="timestamp"
            tickFormatter={formatDate}
            stroke="#9CA3AF"
          />
          <YAxis 
            tickFormatter={(value) => formatCurrency(value)}
            stroke="#9CA3AF"
          />
          <Tooltip 
            content={({ payload, label }) => {
              if (!payload?.length) return null;
              return (
                <div className="bg-gray-900 p-3 rounded shadow-lg border border-gray-700">
                  <p className="text-gray-400">{formatDate(label)}</p>
                  <p className="font-semibold">
                    {formatCurrency(payload[0].value)}
                  </p>
                </div>
              );
            }}
          />
          <Line 
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const renderAllocation = () => (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold mb-6">Asset Allocation</h3>
      <div className="grid grid-cols-2 gap-6">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={portfolioData.tokens}
              dataKey="allocation"
              nameKey="symbol"
              cx="50%"
              cy="50%"
              outerRadius={80}
            >
              {portfolioData.tokens.map((entry, index) => (
                <Cell 
                  key={entry.symbol}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              content={({ payload }) => {
                if (!payload?.length) return null;
                const { symbol, allocation, value } = payload[0].payload;
                return (
                  <div className="bg-gray-900 p-3 rounded shadow-lg border border-gray-700">
                    <p className="font-semibold">{symbol}</p>
                    <p className="text-gray-400">{allocation.toFixed(1)}%</p>
                    <p>{formatCurrency(value)}</p>
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="space-y-4">
          {portfolioData.tokens.slice(0, showAllTokens ? undefined : 3).map((token, index) => (
            <div key={token.symbol} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span>{token.symbol}</span>
              </div>
              <div className="text-right">
                <div>{formatCurrency(token.value)}</div>
                <div className="text-sm text-gray-400">
                  {token.allocation.toFixed(1)}%
                </div>
              </div>
            </div>
          ))}
          {portfolioData.tokens.length > 3 && (
            <button
              onClick={() => setShowAllTokens(!showAllTokens)}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Show {showAllTokens ? 'less' : 'all'} tokens
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {renderValueChart()}
      {renderAllocation()}
    </div>
  );
};

export default PortfolioAnalytics;
