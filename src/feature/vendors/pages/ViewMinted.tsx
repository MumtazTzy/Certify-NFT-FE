import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Search, Award, ExternalLink } from 'lucide-react';

interface MintedCertificate {
  id: string;
  tokenId: string;
  walletAddress: string;
  mintDate: string;
  transactionHash: string;
  ipfsUrl: string;
}

export default function ViewMinted() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');

  // Mock event data
  const event = {
    id: id,
    title: 'User minted certificates',
    date: '2024-04-15'
  };

  // Mock minted certificates data
  const mintedCertificates: MintedCertificate[] = [
    {
      id: '1',
      tokenId: '12345',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      mintDate: '2024-04-16',
      transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab',
      ipfsUrl: 'ipfs://QmX1234567890abcdef'
    },
    {
      id: '2',
      tokenId: '12346',
      walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
      mintDate: '2024-04-16',
      transactionHash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
      ipfsUrl: 'ipfs://QmY9876543210fedcba'
    },
    {
      id: '3',
      tokenId: '12347',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      mintDate: '2024-04-17',
      transactionHash: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
      ipfsUrl: 'ipfs://QmZ1122334455667788'
    }
  ];

  const filteredCertificates = mintedCertificates.filter(cert =>
    cert.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.tokenId.includes(searchTerm)
  );

  const handleExportCSV = () => {
    const csvContent = [
      ['Token ID', 'Wallet Address', 'Mint Date', 'Transaction Hash', 'IPFS URL'],
      ...mintedCertificates.map(cert => [
        cert.tokenId,
        cert.walletAddress,
        cert.mintDate,
        cert.transactionHash,
        cert.ipfsUrl
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_minted_certificates.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to={`/vendor/event/${id}`}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Event Management</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Minted Certificates</h1>
              <p className="text-gray-600 mt-1">{event.title}</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={handleExportCSV}
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Download className="h-5 w-5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Minted</p>
                <p className="text-3xl font-bold text-gray-900">{mintedCertificates.length}</p>
              </div>
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Minting Rate</p>
                <p className="text-3xl font-bold text-blue-600">75%</p>
              </div>
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-1">of registered attendees</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Latest Mint</p>
                <p className="text-lg font-bold text-gray-900">
                  {new Date(Math.max(...mintedCertificates.map(c => new Date(c.mintDate).getTime()))).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-purple-600 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by wallet address or token ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Certificates Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Certificate Records</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Token ID</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Wallet Address</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Mint Date</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Transaction</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">IPFS</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert, index) => (
                  <tr key={cert.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Award className="h-4 w-4 text-green-600" />
                        <span className="font-mono font-semibold">#{cert.tokenId}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm">
                        {cert.walletAddress.slice(0, 10)}...{cert.walletAddress.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {cert.walletAddress}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(cert.mintDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={`https://etherscan.io/tx/${cert.transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <span className="font-mono text-sm">
                          {cert.transactionHash.slice(0, 8)}...{cert.transactionHash.slice(-6)}
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="py-4 px-6">
                      <a
                        href={cert.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-1 text-purple-600 hover:text-purple-700 transition-colors"
                      >
                        <span className="text-sm">View</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredCertificates.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? 'No certificates found' : 'No certificates minted yet'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Try adjusting your search terms'
                  : 'Certificates will appear here once attendees start minting them'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}