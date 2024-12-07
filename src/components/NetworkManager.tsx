// src/components/NetworkManager.tsx

import React, { useState, useEffect } from 'react';
import { Settings, Wifi, WifiOff, Plus, Check, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const defaultNetworks = [
  {
    id: 'bottle-chain',
    name: 'Bottle Chain Mainnet',
    rpcUrl: 'https://mainnet.bottlechain.network',
    chainId: '0x1',
    symbol: 'BTL',
    explorer: 'https://explorer.bottlechain.network',
    isActive: true,
  },
  {
    id: 'btl-testnet',
    name: 'Bottle Chain Testnet',
    rpcUrl: 'https://testnet.bottlechain.network',
    chainId: '0x2',
    symbol: 'tBTL',
    explorer: 'https://testnet.explorer.bottlechain.network',
    isActive: false,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    rpcUrl: 'https://mainnet.infura.io/v3/your-api-key',
    chainId: '0x1',
    symbol: 'ETH',
    explorer: 'https://etherscan.io',
    isActive: false,
  }
];

const NetworkManager = ({ onNetworkChange }) => {
  const [networks, setNetworks] = useState(defaultNetworks);
  const [showAddNetwork, setShowAddNetwork] = useState(false);
  const [newNetwork, setNewNetwork] = useState({
    name: '',
    rpcUrl: '',
    chainId: '',
    symbol: '',
    explorer: ''
  });
  const [networkStatus, setNetworkStatus] = useState({});
  const [selectedNetwork, setSelectedNetwork] = useState(networks[0]);

  // Check network status periodically
  useEffect(() => {
    const checkNetworkStatus = async () => {
      const status = {};
      for (const network of networks) {
        try {
          const response = await fetch(network.rpcUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              jsonrpc: '2.0',
              method: 'net_version',
              params: [],
              id: 1
            })
          });
          status[network.id] = response.ok;
        } catch {
          status[network.id] = false;
        }
      }
      setNetworkStatus(status);
    };

    checkNetworkStatus();
    const interval = setInterval(checkNetworkStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [networks]);

  const handleNetworkSelect = (network) => {
    setSelectedNetwork(network);
    onNetworkChange(network);
    setNetworks(networks.map(n => ({
      ...n,
      isActive: n.id === network.id
    })));
  };

  const handleAddNetwork = () => {
    if (!newNetwork.name || !newNetwork.rpcUrl || !newNetwork.chainId) {
      return;
    }

    const network = {
      id: `custom-${Date.now()}`,
      ...newNetwork,
      isActive: false
    };

    setNetworks([...networks, network]);
    setShowAddNetwork(false);
    setNewNetwork({
      name: '',
      rpcUrl: '',
      chainId: '',
      symbol: '',
      explorer: ''
    });
  };

  const renderAddNetworkForm = () => (
    <div className="bg-gray-800 p-6 rounded-lg space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Add Custom Network</h3>
        <button onClick={() => setShowAddNetwork(false)}>
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <input
          className="w-full bg-gray-700 rounded px-4 py-2"
          placeholder="Network Name"
          value={newNetwork.name}
          onChange={e => setNewNetwork({...newNetwork, name: e.target.value})}
        />
        <input
          className="w-full bg-gray-700 rounded px-4 py-2"
          placeholder="RPC URL"
          value={newNetwork.rpcUrl}
          onChange={e => setNewNetwork({...newNetwork, rpcUrl: e.target.value})}
        />
        <input
          className="w-full bg-gray-700 rounded px-4 py-2"
          placeholder="Chain ID"
          value={newNetwork.chainId}
          onChange={e => setNewNetwork({...newNetwork, chainId: e.target.value})}
        />
        <input
          className="w-full bg-gray-700 rounded px-4 py-2"
          placeholder="Symbol"
          value={newNetwork.symbol}
          onChange={e => setNewNetwork({...newNetwork, symbol: e.target.value})}
        />
        <input
          className="w-full bg-gray-700 rounded px-4 py-2"
          placeholder="Block Explorer URL"
          value={newNetwork.explorer}
          onChange={e => setNewNetwork({...newNetwork, explorer: e.target.value})}
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          onClick={handleAddNetwork}
        >
          Add Network
        </button>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold flex items-center">
          <Settings className="mr-2" /> Network Management
        </h2>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition"
          onClick={() => setShowAddNetwork(!showAddNetwork)}
        >
          <Plus className="mr-2" /> Add Network
        </button>
      </div>

      {showAddNetwork && renderAddNetworkForm()}

      <div className="space-y-4">
        {networks.map(network => (
          <div
            key={network.id}
            className={`flex items-center justify-between p-4 rounded-lg ${
              network.isActive ? 'bg-blue-600' : 'bg-gray-800'
            } hover:bg-blue-700 transition cursor-pointer`}
            onClick={() => handleNetworkSelect(network)}
          >
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {networkStatus[network.id] ? (
                  <Wifi className="text-green-400" />
                ) : (
                  <WifiOff className="text-red-400" />
                )}
                <span className="font-medium">{network.name}</span>
              </div>
              <span className="text-sm text-gray-400">({network.symbol})</span>
            </div>
            {network.isActive && (
              <Check className="text-white" />
            )}
          </div>
        ))}
      </div>

      {selectedNetwork && networkStatus[selectedNetwork.id] === false && (
        <Alert variant="destructive" className="mt-4">
          <AlertDescription>
            Unable to connect to {selectedNetwork.name}. Please check your connection or try again later.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default NetworkManager;
