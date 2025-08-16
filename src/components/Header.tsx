import React from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Award, Wallet } from 'lucide-react';
import WalletSelector from './WalletSelector';

const Header: React.FC = () => {
  const { connected } = useWallet();

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">
                Proof of Attendance
              </h1>
              <p className="text-sm text-gray-600">
                Decentralized Event Badges on Aptos
              </p>
            </div>
          </div>

          {/* Network Status */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center space-x-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">Aptos Devnet</span>
            </div>
          </div>

          {/* Wallet Connection */}
          <div className="flex items-center space-x-4">
            {!connected && (
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <Wallet className="h-4 w-4 mr-2" />
                <span>Connect to get started</span>
              </div>
            )}
            <WalletSelector />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;