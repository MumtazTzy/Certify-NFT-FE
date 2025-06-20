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
        <p className="text-gray-700 text-lg mb-8 text-center">
          In Certify, your crypto wallet is your digital identity. You need a wallet to log in, mint certificates, and manage your credentials securely on the blockchain. This guide will help you set up, connect, and troubleshoot your wallet for the best experience.
        </p>
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-blue-600 mb-2">What is a Crypto Wallet?</h2>
          <p className="text-gray-700 mb-4">A crypto wallet (like MetaMask) is a browser extension or app that lets you interact with blockchain applications. It stores your private keys and allows you to sign transactions securely. In Certify, your wallet is used to prove your identity, mint NFT certificates, and verify ownership.</p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Why Do I Need a Wallet?</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>To log in securely without a password</li>
            <li>To mint and own certificates as NFTs</li>
            <li>To verify your credentials on the blockchain</li>
            <li>To participate in events and receive certificates</li>
          </ul>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Supported Wallets</h2>
          <p className="text-gray-700 mb-4">We recommend <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">MetaMask</a> for the best experience. Other wallets compatible with Ethereum and Sepolia testnet may also work, but MetaMask is officially supported.</p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">About Sepolia Testnet</h2>
          <p className="text-gray-700 mb-4">Certify uses the Sepolia Ethereum testnet for issuing and managing certificates. You will need Sepolia ETH (testnet tokens) to pay for transaction fees. These tokens have no real-world value and can be requested for free from a faucet.</p>
          <h2 className="text-xl font-semibold text-blue-600 mb-2">Security Tips</h2>
          <ul className="list-disc ml-6 text-gray-700 mb-4">
            <li>Never share your wallet's secret phrase or private key with anyone</li>
            <li>Only use official wallet extensions/apps from trusted sources</li>
            <li>Always double-check URLs before entering your wallet information</li>
            <li>Keep your device secure and up to date</li>
          </ul>
        </div>
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
              <span className="font-semibold">3. (Vendors) Ensure You Have Sepolia ETH</span>
              <p>If you are a vendor, make sure your wallet has some ETH tokens on the Sepolia network. You can request free testnet ETH from a <a href="https://www.google.com/search?q=sepolia+faucet+web3" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Web3 faucet (search on Google)</a>.</p>
            </div>
          </li>
          <li className="flex items-start gap-4 bg-blue-50/60 rounded-lg p-4 shadow-sm">
            <KeyRound className="h-7 w-7 text-blue-500 mt-1" />
            <div>
              <span className="font-semibold">4. Import Wallet from Another Platform (Optional)</span>
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
              <span className="font-semibold">5. Connect to the Application</span>
              <p>Return to the <Link to="/login" className="text-blue-600 underline">Login</Link> page, click <b>Connect Wallet</b>, then press <b>Confirm</b> in MetaMask.</p>
            </div>
          </li>
        </ol>
        <div className="mt-10 text-center">
          <CheckCircle className="inline h-7 w-7 text-green-500 mb-1" />
          <p className="text-lg font-semibold text-green-700">Your wallet is now ready to use!</p>
        </div>
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-blue-600 mb-4">Frequently Asked Questions (FAQ)</h2>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Q: What if my wallet won't connect?</h3>
            <p className="text-gray-700">Make sure your wallet is unlocked, connected to the Sepolia network, and your browser allows pop-ups. Try refreshing the page or restarting your browser.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Q: I don't see my certificates after minting. What should I do?</h3>
            <p className="text-gray-700">Check that you are connected to the correct wallet and Sepolia network. Certificates may take a few moments to appear after minting.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Q: How do I get Sepolia ETH?</h3>
            <p className="text-gray-700">You can request free Sepolia ETH from a faucet. Search "Sepolia faucet Web3" on Google and follow the instructions on a trusted faucet site.</p>
          </div>
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800">Q: Is it safe to use my wallet on Certify?</h3>
            <p className="text-gray-700">Yes, as long as you follow security best practices and only use the official Certify website. Certify will never ask for your private key or secret phrase.</p>
          </div>
        </div>
      </div>
    </div>
  );
} 