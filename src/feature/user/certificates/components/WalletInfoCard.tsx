import { Wallet } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth';

interface WalletInfoCardProps {
  total: number;
  label: string; // e.g. "Total Certificates" OR "Total Events"
}

export default function WalletInfoCard({ total, label }: WalletInfoCardProps) {
  const { walletAddress } = useAuth();

  // Helper to shorten the wallet address
  const shortAddress = walletAddress
    ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`
    : 'No wallet';

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center">
            <Wallet className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Wallet Connected</p>
            <p className="text-gray-600 text-sm">{shortAddress}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-blue-600">{total}</p>
          <p className="text-sm text-gray-600">{label}</p>
        </div>
      </div>
    </div>
  );
}
