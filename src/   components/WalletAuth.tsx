// src/components/WalletAuth.tsx

import React, { useState } from 'react';
import { Lock, Key, AlertTriangle, Eye, EyeOff, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const WalletAuth = ({ onAuthComplete }) => {
  const [step, setStep] = useState('welcome'); // welcome, create, import, backup
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [seedPhrase, setSeedPhrase] = useState('');
  const [confirmedBackup, setConfirmedBackup] = useState(false);

  const generateSeedPhrase = () => {
    // In a real implementation, this would use a proper crypto library
    const mockPhrase = "wallet nephew criterion grocery dance typical dry forum coffee shop decay brave";
    setSeedPhrase(mockPhrase);
  };

  const renderWelcome = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Welcome to Bottle Chain Wallet</h2>
      <button
        onClick={() => setStep('create')}
        className="w-full bg-blue-600 text-white py-4 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
      >
        <Key className="mr-2" /> Create New Wallet
      </button>
      <button
        onClick={() => setStep('import')}
        className="w-full bg-gray-700 text-white py-4 rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
      >
        <RefreshCw className="mr-2" /> Import Existing Wallet
      </button>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Create Your Wallet</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Set Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Confirm Password</label>
          <input
            type="password"
            className="w-full bg-gray-700 rounded-lg px-4 py-3"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm your password"
          />
        </div>
        <button
          onClick={() => {
            generateSeedPhrase();
            setStep('backup');
          }}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={!password || password !== confirmPassword}
        >
          Continue
        </button>
      </div>
    </div>
  );

  const renderBackup = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-4">Backup Your Wallet</h2>
      
      <Alert variant="warning" className="bg-yellow-900/50 border-yellow-600">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Save these words in a secure location. Never share them with anyone.
        </AlertDescription>
      </Alert>

      <div className="bg-gray-700 p-6 rounded-lg">
        <div className="grid grid-cols-3 gap-4">
          {seedPhrase.split(' ').map((word, index) => (
            <div key={index} className="flex items-center">
              <span className="text-gray-400 mr-2">{index + 1}.</span>
              <span className="font-mono">{word}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="backup-confirm"
          checked={confirmedBackup}
          onChange={(e) => setConfirmedBackup(e.target.checked)}
          className="rounded bg-gray-700"
        />
        <label htmlFor="backup-confirm">
          I have safely stored my recovery phrase
        </label>
      </div>

      <button
        onClick={() => onAuthComplete({ type: 'create', seedPhrase })}
        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
        disabled={!confirmedBackup}
      >
        Complete Setup
      </button>
    </div>
  );

  const renderImport = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center mb-8">Import Your Wallet</h2>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium">Recovery Phrase</label>
          <textarea
            className="w-full bg-gray-700 rounded-lg px-4 py-3 min-h-[100px]"
            value={seedPhrase}
            onChange={(e) => setSeedPhrase(e.target.value)}
            placeholder="Enter your 12-word recovery phrase"
          />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">New Password</label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              className="w-full bg-gray-700 rounded-lg px-4 py-3 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Set a new password"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>
        <button
          onClick={() => onAuthComplete({ type: 'import', seedPhrase })}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
          disabled={!seedPhrase || !password}
        >
          Import Wallet
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-xl p-8">
        {step === 'welcome' && renderWelcome()}
        {step === 'create' && renderCreate()}
        {step === 'backup' && renderBackup()}
        {step === 'import' && renderImport()}
      </div>
    </div>
  );
};

export default WalletAuth;
