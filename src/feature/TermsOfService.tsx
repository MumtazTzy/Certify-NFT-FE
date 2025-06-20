import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-white py-16 px-4">
      <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl shadow p-8">
        <h1 className="text-3xl font-bold text-blue-700 mb-6 text-center">Terms of Service</h1>
        <div className="space-y-6 text-gray-800 text-base">
          <p>Welcome to Certify-NFT! By using our platform, you agree to the following terms and conditions:</p>
          <ul className="list-disc ml-6 space-y-2">
            <li><b>Eligibility:</b> You must be at least 18 years old or have legal capacity to use blockchain services in your jurisdiction.</li>
            <li><b>Account Security:</b> You are responsible for maintaining the security of your wallet and private keys. Certify-NFT will never ask for your private key or secret phrase.</li>
            <li><b>Certificate Ownership:</b> All certificates issued as NFTs are fully owned by the recipient's wallet address. Certify-NFT does not control or recover lost certificates.</li>
            <li><b>Platform Usage:</b> You agree to use the platform only for lawful purposes and not to misuse, hack, or disrupt the service.</li>
            <li><b>Changes to Service:</b> Certify-NFT may update or discontinue features at any time without prior notice.</li>
            <li><b>Limitation of Liability:</b> Certify-NFT is not liable for any loss of funds, certificates, or damages resulting from blockchain network issues or user error.</li>
            <li><b>Third-Party Services:</b> The platform may integrate with third-party wallets or services. Certify-NFT is not responsible for their terms or privacy practices.</li>
            <li><b>Contact:</b> For questions, contact us at support@certify.com.</li>
          </ul>
          <p className="text-gray-500 text-sm mt-6">Last updated: 2024</p>
        </div>
      </div>
    </div>
  );
} 