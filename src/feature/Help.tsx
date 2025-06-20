import React from 'react';
import { CheckCircle, KeyRound, Download, UserPlus, LogIn } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Help() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-purple-100 flex items-center justify-center py-16 px-4">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-md border border-blue-100 shadow-xl rounded-2xl p-8 relative">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-700 mb-8 text-center flex items-center justify-center gap-2">
          <KeyRound className="h-8 w-8 text-blue-500" />
          Wallet Connection Guide
        </h1>
        <div className="absolute left-6 top-32 bottom-24 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-blue-100 rounded-full opacity-60 hidden md:block" style={{zIndex:0}}></div>
        <ol className="space-y-8 text-gray-800 relative z-10">
          <li className="flex items-start gap-4 bg-blue-50/60 rounded-lg p-4 shadow-sm">
            <Download className="h-7 w-7 text-blue-500 mt-1" />
            <div>
              <span className="font-semibold">1. Download MetaMask Extension</span>
              <p>Make sure you have downloaded and installed the <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MetaMask</a> extension in your browser.</p>
            </div>
          </li>
          <li className="flex items-start gap-4 bg-purple-50/60 rounded-lg p-4 shadow-sm">
            <UserPlus className="h-7 w-7 text-blue-500 mt-1" />
            <div>
              <span className="font-semibold">2. Create a Wallet & Save Your Secret Phrase</span>
              <p>If you don't have a wallet yet, create a new wallet in MetaMask and securely save your secret phrase.</p>
            </div>
          </li>
          <li className="flex items-start gap-4 bg-blue-50/60 rounded-lg p-4 shadow-sm">
            <KeyRound className="h-7 w-7 text-blue-500 mt-1" />
            <div>
              <span className="font-semibold">3. Import Wallet from Another Platform (Optional)</span>
              <p>If you already have a wallet (other than MetaMask), you can import it into MetaMask using your private key:</p>
              <ul className="list-decimal ml-6 mt-2 space-y-1 text-sm">
                <li>Open the MetaMask extension</li>
                <li>Click the account icon at the top center</li>
                <li>Select <b>+ Add account or hardware wallet</b></li>
                <li>Click <b>Import wallet or account</b></li>
                <li>Choose <b>Private Key</b> (make sure your previous wallet is an Ethereum wallet)</li>
                <li>Paste your private key, then confirm</li>
                <li><span className="text-green-600 font-semibold">Done! Your wallet has been imported to MetaMask</span></li>
              </ul>
            </div>
          </li>
          <li className="flex items-start gap-4 bg-purple-50/60 rounded-lg p-4 shadow-sm">
            <LogIn className="h-7 w-7 text-blue-500 mt-1" />
            <div>
              <span className="font-semibold">4. Connect to the Application</span>
              <p>Return to the <Link to="/login" className="text-blue-600 underline">Login</Link> page, click <b>Connect Wallet</b>, then press <b>Confirm</b> in MetaMask.</p>
            </div>
          </li>
        </ol>
        <div className="mt-10 text-center">
          <CheckCircle className="inline h-7 w-7 text-green-500 mb-1" />
          <p className="text-lg font-semibold text-green-700">Your wallet is now ready to use!</p>
        </div>
      </div>
    </div>
  );
} 