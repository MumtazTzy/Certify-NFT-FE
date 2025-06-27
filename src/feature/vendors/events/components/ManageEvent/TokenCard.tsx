import React from 'react';
import { Copy } from 'lucide-react';
import toast from 'react-hot-toast';

interface TokenCardProps {
  token: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const handleCopy = () => {
    navigator.clipboard.writeText(token);
    toast.success('Token copied to clipboard!');
  };

  return (
    <div className="w-full bg-white rounded-2xl  shadow-lg p-6  flex flex-col gap-2 mb-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-semibold text-gray-700">Event Token</span>
        <button
          onClick={handleCopy}
          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
          title="Copy token"
        >
          <Copy className="h-4 w-4 text-gray-500 hover:text-gray-700" />
        </button>
      </div>
      <div className="text-base font-mono text-purple-700 break-all select-all bg-purple-50 px-3 py-2 rounded-lg border border-purple-100 text-center">
        {token}
      </div>
    </div>
  );
};

export default TokenCard; 