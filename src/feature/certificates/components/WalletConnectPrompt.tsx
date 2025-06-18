import { Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function WalletConnectPrompt({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Connect Your Wallet
          </h1>
          <p className="text-gray-600 mb-6">
            Connect your wallet to view your NFT certificates
          </p>
          <button
            onClick={onConnect}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Wallet className="h-5 w-5" />
            <span>Connect Wallet</span>
          </button>
          <div className="text-center mt-6">
            <Link to="/events" className="text-blue-600 hover:text-blue-700 underline">
              Browse available events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
