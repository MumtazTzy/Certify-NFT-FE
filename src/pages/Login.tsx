import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, CheckCircle, Shield, AlertCircle } from 'lucide-react';

export default function Login() {
  const [account, setAccount] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  // Check if wallet is already connected on component mount
  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ 
          method: 'eth_accounts' 
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        const userAccount = accounts[0];
        setAccount(userAccount);
        
        // Sign a message to verify wallet ownership
        const message = `Login to Certify App\nTimestamp: ${Date.now()}`;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [message, userAccount]
        });

        // Send to backend for verification and user creation/login
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: userAccount,
            message: message,
            signature: signature
          })
        });

        const data = await response.json();

        if (response.ok) {
          // Store JWT token
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('userAddress', userAccount);
          
          setIsConnected(true);
          
          if (data.isNewUser) {
            setIsRegistering(true);
            setTimeout(() => {
              navigate('/profile-setup');
            }, 2000);
          } else {
            setTimeout(() => {
              navigate('/events');
            }, 1500);
          }
        } else {
          setError(data.error || 'Authentication failed');
        }
      }
    } catch (error: unknown) {
  const err = error as { code?: number; message?: string };
  if (err.code === 4001) {
    setError('Connection rejected by user');
  } else {
    setError(err.message || 'Failed to connect wallet. Please try again.');
  }
}

  };

  const disconnectWallet = () => {
    setAccount('');
    setIsConnected(false);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userAddress');
  };

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome to Certify
            </h1>
            <p className="text-gray-600">
              Connect your wallet to access your certificates
            </p>
          </div>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connect Your Wallet
              </label>
              
              {!isConnected ? (
                <button
                  onClick={connectWallet}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none"
                >
                  <Wallet className="h-5 w-5" />
                  <span>
                    {isLoading ? 'Connecting...' : 'Connect MetaMask'}
                  </span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-green-800 font-medium">Wallet Connected</p>
                        <p className="text-green-600 text-sm">{formatAddress(account)}</p>
                      </div>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="text-green-600 hover:text-green-700 text-sm underline"
                    >
                      Disconnect
                    </button>
                  </div>
                  <div className="bg-green-100 rounded-lg p-3">
                    <p className="text-green-800 text-sm font-medium">
                      {isRegistering 
                        ? '🎉 Welcome! Setting up your profile...' 
                        : '🎉 Login successful! Redirecting to events...'
                      }
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="text-center">
                <div className="inline-flex items-center space-x-2 text-blue-600">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <span className="text-sm">Connecting to your wallet...</span>
                </div>
              </div>
            )}

            {/* Information */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">
                Why connect a wallet?
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Secure authentication without passwords</li>
                <li>• Own your certificates as NFTs</li>
                <li>• Verify authenticity on the blockchain</li>
                <li>• Decentralized identity management</li>
              </ul>
            </div>

            {/* MetaMask Installation */}
            {typeof window.ethereum === 'undefined' && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  MetaMask Required
                </h3>
                <p className="text-sm text-yellow-800 mb-3">
                  You need MetaMask to connect your wallet.
                </p>
                <a
                  href="https://metamask.io/download/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  <span>Install MetaMask</span>
                </a>
              </div>
            )}

            {/* Support */}
            <div className="text-center text-sm text-gray-600">
              <p>
                Need help connecting your wallet?{' '}
                <a href="/help" className="text-blue-600 hover:text-blue-700 underline">
                  View our guide
                </a>
              </p>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm">
              By connecting your wallet, you agree to our{' '}
              <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}