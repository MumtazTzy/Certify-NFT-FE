import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Privacy Policy</h1>
        <div className="space-y-6 text-gray-800 text-base">
          <p>Certify-NFT is committed to protecting your privacy. This policy explains how we handle your information:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><b>Wallet Information:</b> We do not collect or store your private keys, secret phrases, or wallet balances. All wallet interactions occur locally in your browser.</li>
            <li><b>Personal Data:</b> We may collect minimal information (such as email, if provided) for account-related notifications or support.</li>
            <li><b>Blockchain Data:</b> Certificate transactions and ownership are recorded on public blockchains and are visible to anyone.</li>
            <li><b>Cookies & Analytics:</b> We may use cookies or analytics tools to improve user experience, but do not track personal browsing outside our platform.</li>
            <li><b>Third-Party Services:</b> Our platform may link to third-party wallets or services. Please review their privacy policies separately.</li>
            <li><b>Data Security:</b> We implement reasonable security measures, but cannot guarantee absolute security of blockchain or internet transmissions.</li>
            <li><b>Policy Updates:</b> We may update this policy from time to time. Continued use of the platform means you accept the latest version.</li>
            <li><b>Contact:</b> For privacy questions, contact us at support@certify.com.</li>
          </ul>
          <p className="text-gray-500 text-sm mt-6">Last updated: 2024</p>
        </div>
      </div>
    </div>
  );
} 