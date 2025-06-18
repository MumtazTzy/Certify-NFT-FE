import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Building, Wallet, CheckCircle, PenTool } from 'lucide-react';

export default function VendorLogin() {
  const [isConnected, setIsConnected] = useState(false);
  const [isSignatureRequested, setIsSignatureRequested] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleWalletConnect = () => {
    setIsConnected(true);
  };

  const handleSignatureRequest = () => {
    setIsSignatureRequested(true);
    
    // Simulate signature process
    setTimeout(() => {
      setIsAuthenticated(true);
      
      // Redirect to dashboard after successful authentication
      setTimeout(() => {
        navigate('/vendor/dashboard');
      }, 1500);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Vendor Login
            </h1>
            <p className="text-gray-600">
              Connect your wallet and sign to access your vendor dashboard
            </p>
          </div>

          <div className="space-y-6">
            {/* Step 1: Wallet Connection */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isConnected ? 'bg-green-500 text-white' : 'bg-purple-600 text-white'
                }`}>
                  {isConnected ? '✓' : '1'}
                </div>
                <label className="text-sm font-medium text-gray-700">
                  Connect Your Wallet
                </label>
              </div>
              
              {!isConnected ? (
                <button
                  onClick={handleWalletConnect}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm">0x1234...5678</p>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2: Signature */}
            {isConnected && (
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    isAuthenticated ? 'bg-green-500 text-white' : 
                    isSignatureRequested ? 'bg-yellow-500 text-white' : 'bg-purple-600 text-white'
                  }`}>
                    {isAuthenticated ? '✓' : isSignatureRequested ? '...' : '2'}
                  </div>
                  <label className="text-sm font-medium text-gray-700">
                    Sign Authentication Message
                  </label>
                </div>
                
                {!isSignatureRequested ? (
                  <button
                    onClick={handleSignatureRequest}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                  >
                    <PenTool className="h-5 w-5" />
                    <span>Sign Message</span>
                  </button>
                ) : !isAuthenticated ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-600"></div>
                      <div>
                        <p className="text-yellow-900 font-medium">Waiting for signature...</p>
                        <p className="text-yellow-700 text-sm">Please sign the message in your wallet</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3 mb-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-green-800 font-medium">Authentication Successful!</p>
                        <p className="text-green-600 text-sm">Redirecting to dashboard...</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Information */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">
                Vendor Authentication
              </h3>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Secure wallet-based authentication</li>
                <li>• No passwords required</li>
                <li>• Access your vendor dashboard</li>
                <li>• Manage events and certificates</li>
              </ul>
            </div>
          </div>

          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600">
              Don't have a vendor account?{' '}
              <Link to="/register/vendor" className="text-purple-600 hover:text-purple-700 font-semibold">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}