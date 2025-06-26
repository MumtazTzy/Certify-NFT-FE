import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';

export default function VerifyCertificate() {
  const { walletAddress } = useAuth();
  const [token, setToken] = useState('');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">Verify Certificate</h1>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate Token</label>
          <input
            type="text"
            className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
            placeholder="Enter certificate token"
            value={token}
            onChange={e => setToken(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Your Wallet Address</label>
          <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 text-purple-800 font-mono text-sm break-all">
            {walletAddress ? (
              <span className="block sm:hidden">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </span>
            ) : (
              'Not connected'
            )}
            {walletAddress && (
              <span className="hidden sm:block">{walletAddress}</span>
            )}
          </div>
        </div>
        <button
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all"
          // onClick={handleVerify} // Tambahkan handler jika ingin verifikasi
        >
          Submit
        </button>
      </div>
    </div>
  );
}
