import { Wallet } from 'lucide-react';

export default function WalletConnectPrompt({ onConnect }: { onConnect: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white shadow p-8 rounded-lg text-center">
        <Wallet className="h-10 w-10 text-blue-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Connect Your Wallet</h2>
        <p className="text-gray-600 mb-4">Please connect your wallet to access your certificates.</p>
        <button
          onClick={onConnect}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Connect Wallet
        </button>
      </div>
    </div>
  );
}
