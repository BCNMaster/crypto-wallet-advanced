// src/components/TransactionConfirm.tsx

import React, { useState, useEffect } from 'react';
import { ArrowRight, AlertTriangle, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Mock transaction for demo purposes
const mockTransaction = {
  from: '0x1234...5678',
  to: '0x8765...4321',
  value: '1.5',
  symbol: 'BTL',
  gasLimit: '21000',
  gasPrice: '20000000000'
};

const TransactionConfirm = ({ 
  transaction = mockTransaction, 
  onConfirm = () => {}, 
  onCancel = () => {},
  transactionService = {
    estimateGas: async () => ({ estimatedCost: '0.001', maxCost: '0.0012' }),
    getGasPrice: async () => ({
      slow: '15000000000',
      medium: '20000000000',
      fast: '25000000000'
    }),
    formatGasPrice: (price) => `${parseInt(price) / 1000000000} Gwei`,
    formatCost: (cost) => cost
  }
}) => {
  const [gasEstimate, setGasEstimate] = useState(null);
  const [gasPrices, setGasPrices] = useState(null);
  const [selectedSpeed, setSelectedSpeed] = useState('medium');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEstimates = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [estimateResult, pricesResult] = await Promise.all([
          transactionService.estimateGas(transaction),
          transactionService.getGasPrice()
        ]);

        setGasEstimate(estimateResult);
        setGasPrices(pricesResult);
      } catch (err) {
        setError('Failed to estimate gas costs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchEstimates();
  }, [transaction]);

  const handleConfirm = async () => {
    if (!gasPrices || !transaction) return;
    
    const finalTransaction = {
      ...transaction,
      gasPrice: gasPrices[selectedSpeed].toString()
    };
    await onConfirm(finalTransaction);
  };

  const renderGasOptions = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Transaction Speed</h3>
      <div className="grid grid-cols-3 gap-4">
        {['slow', 'medium', 'fast'].map((speed) => (
          <button
            key={speed}
            onClick={() => setSelectedSpeed(speed)}
            className={`p-4 rounded-lg border-2 ${
              selectedSpeed === speed 
                ? 'border-blue-500 bg-blue-500/20' 
                : 'border-gray-600 hover:border-blue-400'
            }`}
          >
            <div className="text-sm font-medium capitalize">{speed}</div>
            {gasPrices && (
              <div className="text-xs text-gray-400">
                {transactionService.formatGasPrice(gasPrices[speed])}
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );

  const renderTransactionDetails = () => (
    <>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-700 rounded-lg">
          <div>
            <div className="text-sm text-gray-400">From</div>
            <div className="font-mono text-sm">{transaction.from}</div>
          </div>
          <ArrowRight className="text-gray-400" />
          <div>
            <div className="text-sm text-gray-400">To</div>
            <div className="font-mono text-sm">{transaction.to}</div>
          </div>
        </div>

        <div className="p-4 bg-gray-700 rounded-lg">
          <div className="text-sm text-gray-400">Amount</div>
          <div className="text-xl font-bold">
            {transaction.value} {transaction.symbol}
          </div>
        </div>

        {gasEstimate && (
          <div className="p-4 bg-gray-700 rounded-lg space-y-2">
            <div className="text-sm text-gray-400">Estimated Gas Cost</div>
            <div>
              {transactionService.formatCost(gasEstimate.estimatedCost)} {transaction.symbol}
            </div>
            <div className="text-xs text-gray-400">
              Max Cost: {transactionService.formatCost(gasEstimate.maxCost)} {transaction.symbol}
            </div>
          </div>
        )}

        {renderGasOptions()}
      </div>

      <div className="flex space-x-4">
        <button
          onClick={handleConfirm}
          className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={loading || !!error}
        >
          Confirm
        </button>
        <button
          onClick={onCancel}
          className="flex-1 bg-gray-700 text-white py-3 rounded-lg hover:bg-gray-600 transition"
        >
          Cancel
        </button>
      </div>
    </>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 space-y-6">
        <h2 className="text-2xl font-bold">Confirm Transaction</h2>
        
        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          renderTransactionDetails()
        )}
      </div>
    </div>
  );
};

export default TransactionConfirm;
