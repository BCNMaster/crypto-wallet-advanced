import React, { useState } from 'react';
import BottleChainWallet from '../components/BottleChainWallet';
import WalletAuth from '../components/WalletAuth';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthComplete = async (authData) => {
    setIsAuthenticated(true);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {!isAuthenticated ? (
        <WalletAuth onAuthComplete={handleAuthComplete} />
      ) : (
        <BottleChainWallet />
      )}
    </div>
  );
}
