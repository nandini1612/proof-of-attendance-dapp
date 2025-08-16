import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Wallet, ChevronDown, LogOut, Copy, Check } from 'lucide-react';
import toast from 'react-hot-toast';

const WalletSelector: React.FC = () => {
  const { 
    connect, 
    disconnect, 
    account, 
    connected, 
    wallets, 
    wallet: currentWallet 
  } = useWallet();
  
  const [showWallets, setShowWallets] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleConnect = async (walletName: string) => {
    try {
      await connect(walletName as any); // Type assertion to handle WalletName type
      setShowWallets(false);
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection failed:', error);
      toast.error('Failed to connect wallet. Please try again.');
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnect();
      toast.success('Wallet disconnected');
    } catch (error) {
      console.error('Wallet disconnection failed:', error);
      toast.error('Failed to disconnect wallet');
    }
  };

  const copyAddress = async () => {
    if (account?.address) {
      try {
        await navigator.clipboard.writeText(account.address);
        setCopied(true);
        toast.success('Address copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        toast.error('Failed to copy address');
      }
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (connected && account) {
    return (
      <div className="relative">
        <div className="flex items-center space-x-3 bg-white rounded-lg shadow-sm border border-gray-200 p-3">
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              {currentWallet?.name || 'Connected'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {formatAddress(account.address)}
            </p>
          </div>
          <button
            onClick={copyAddress}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
            title="Copy address"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-500" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          <button
            onClick={handleDisconnect}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Disconnect wallet"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowWallets(!showWallets)}
        className="flex items-center justify-center space-x-2 w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
      >
        <Wallet className="h-5 w-5" />
        <span>Connect Wallet</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${showWallets ? 'rotate-180' : ''}`} />
      </button>

      {showWallets && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-2">
            <div className="text-sm text-gray-500 px-3 py-2 border-b">
              Choose a wallet to connect
            </div>
            {wallets && wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() => handleConnect(wallet.name)}
                className="w-full flex items-center space-x-3 px-3 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
              >
                {wallet.icon && (
                  <img 
                    src={wallet.icon} 
                    alt={wallet.name}
                    className="w-6 h-6 rounded"
                  />
                )}
                <div>
                  <div className="font-medium text-gray-900">{wallet.name}</div>
                  <div className="text-xs text-gray-500">{wallet.url}</div>
                </div>
              </button>
            ))}
            {(wallets?.length || 0) === 0 && (
              <div className="text-center py-6 text-gray-500">
                <Wallet className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p className="text-sm">No Aptos wallets found</p>
                <p className="text-xs mt-1">
                  Please install Petra, Martian, or another Aptos wallet
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WalletSelector;