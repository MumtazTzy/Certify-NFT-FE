import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wallet, Award, CheckCircle, ArrowLeft, Key, ExternalLink } from 'lucide-react';

export default function MintPage() {
  const { eventId } = useParams();
  const [tokenCode, setTokenCode] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [mintedTokenId, setMintedTokenId] = useState('');

  // Mock event data
  const event = {
    id: eventId,
    title: 'Web3 Development Workshop',
    date: '2024-04-15',
    location: 'Virtual Event',
    organizer: 'Blockchain Education Foundation',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const handleWalletConnect = () => {
    setIsConnected(true);
  };

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !tokenCode) return;
    
    setIsMinting(true);
    
    // Simulate minting process
    setTimeout(() => {
      setIsMinting(false);
      setIsMinted(true);
      setMintedTokenId('12345');
    }, 3000);
  };

  if (isMinted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Certificate Minted! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Congratulations! Your NFT certificate has been successfully minted and added to your wallet.
            </p>
            
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm opacity-90 mb-2">Certificate of Completion</p>
                <p className="text-xs opacity-75">Token ID: #{mintedTokenId}</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <Link
                to="/my-certificates"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <Award className="h-5 w-5" />
                <span>View My Certificates</span>
              </Link>
              
              <Link
                to={`/verify/${mintedTokenId}`}
                className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
              >
                <ExternalLink className="h-5 w-5" />
                <span>Verify Certificate</span>
              </Link>
              
              <Link
                to="/events"
                className="w-full text-gray-600 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-colors"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to event</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Mint Your Certificate
            </h1>
            <p className="text-gray-600">
              Enter your token code to mint your NFT certificate
            </p>
          </div>

          {/* Event Preview */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="text-center">
              <Award className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm opacity-90 mb-1">Certificate of Completion</p>
              <p className="text-xs opacity-75">Issued by {event.organizer}</p>
            </div>
          </div>

          <form onSubmit={handleMint} className="space-y-6">
            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wallet Connection
              </label>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
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

            {/* Token Code Input */}
            <div>
              <label htmlFor="tokenCode" className="block text-sm font-medium text-gray-700 mb-2">
                Token Code *
              </label>
              <div className="relative">
                <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="tokenCode"
                  value={tokenCode}
                  onChange={(e) => setTokenCode(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Enter your token code"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                You received this code during or after attending the event
              </p>
            </div>

            {/* Event Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Event:</span> {event.title}</p>
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Organizer:</span> {event.organizer}</p>
              </div>
            </div>

            {/* Minting Process */}
            {isMinting && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-blue-900 font-medium">Minting your certificate...</p>
                    <p className="text-blue-700 text-sm">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isConnected || !tokenCode || isMinting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isMinting ? 'Minting...' : 'Mint Certificate'}
            </button>
          </form>

          {/* Help */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Don't have a token code?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">
                Contact event organizer
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}