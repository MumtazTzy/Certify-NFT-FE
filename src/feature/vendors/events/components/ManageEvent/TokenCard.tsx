import React from 'react';
import { Copy, Key, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface TokenCardProps {
  token: string;
}

const TokenCard: React.FC<TokenCardProps> = ({ token }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      toast.success('Token copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy token');
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="bg-orange-100 rounded-lg p-2">
          <Key className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="text-lg font-bold text-gray-900">Event Token</h3>
      </div>
      
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl p-4 border border-orange-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-orange-700">Access Token</span>
            <button
              onClick={handleCopy}
              className="inline-flex items-center space-x-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-medium rounded-lg transition-colors duration-200 shadow-sm hover:shadow-md"
              title="Copy token"
            >
              {copied ? (
                <>
                  <CheckCircle className="h-3 w-3" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3 w-3" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
          
          <div className="bg-white rounded-lg p-3 border border-orange-200">
            <div className="font-mono text-sm text-gray-800 break-all select-all text-center">
              {token}
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-600 rounded-lg p-1.5 mt-0.5">
              <Key className="h-3 w-3 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">How to use this token</p>
              <ul className="text-xs text-blue-600 mt-2 space-y-1">
                <li>• Share this token with event participants</li>
                <li>• Participants use it to mark attendance</li>
                <li>• Keep it secure and don't share publicly</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard; 