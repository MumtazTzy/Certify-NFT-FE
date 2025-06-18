import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Search, X, Users } from 'lucide-react';

interface WhitelistEntry {
  id: string;
  walletAddress: string;
  registrationDate: string;
  status: 'active' | 'revoked';
}

export default function ViewWhitelist() {
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRevokeModal, setShowRevokeModal] = useState<string | null>(null);

  // Mock event data
  const event = {
    id: id,
    title: 'Web3 Development Workshop',
    date: '2024-04-15'
  };

  // Mock whitelist data
  const whitelist: WhitelistEntry[] = [
    {
      id: '1',
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      registrationDate: '2024-04-01',
      status: 'active'
    },
    {
      id: '2',
      walletAddress: '0x9876543210fedcba9876543210fedcba98765432',
      registrationDate: '2024-04-02',
      status: 'active'
    },
    {
      id: '3',
      walletAddress: '0xabcdef1234567890abcdef1234567890abcdef12',
      registrationDate: '2024-04-03',
      status: 'revoked'
    },
    {
      id: '4',
      walletAddress: '0x5555666677778888999900001111222233334444',
      registrationDate: '2024-04-04',
      status: 'active'
    },
    {
      id: '5',
      walletAddress: '0xaaaaaabbbbbbccccccddddddeeeeeeffffffffff',
      registrationDate: '2024-04-05',
      status: 'active'
    }
  ];

  const filteredWhitelist = whitelist.filter(entry =>
    entry.walletAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = whitelist.filter(entry => entry.status === 'active').length;
  const revokedCount = whitelist.filter(entry => entry.status === 'revoked').length;

  const handleRevokeAccess = (entryId: string) => {
    console.log('Revoking access for:', entryId);
    setShowRevokeModal(null);
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['Wallet Address', 'Registration Date', 'Status'],
      ...whitelist.map(entry => [
        entry.walletAddress,
        entry.registrationDate,
        entry.status
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_whitelist.csv`;
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
              <h1 className="text-3xl font-bold text-gray-900">Event Whitelist</h1>
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
                <p className="text-sm font-medium text-gray-600">Total Registered</p>
                <p className="text-3xl font-bold text-gray-900">{whitelist.length}</p>
              </div>
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-3xl font-bold text-green-600">{activeCount}</p>
              </div>
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <div className="w-6 h-6 bg-green-600 rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revoked</p>
                <p className="text-3xl font-bold text-red-600">{revokedCount}</p>
              </div>
              <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <X className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Whitelist Table */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Whitelisted Addresses</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Wallet Address</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Registration Date</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWhitelist.map((entry, index) => (
                  <tr key={entry.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="py-4 px-6">
                      <div className="font-mono text-sm">
                        {entry.walletAddress.slice(0, 10)}...{entry.walletAddress.slice(-8)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {entry.walletAddress}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-gray-600">
                      {new Date(entry.registrationDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        entry.status === 'active' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {entry.status === 'active' ? '✓ Active' : '✗ Revoked'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      {entry.status === 'active' ? (
                        <button
                          onClick={() => setShowRevokeModal(entry.id)}
                          className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors"
                        >
                          Revoke
                        </button>
                      ) : (
                        <span className="text-gray-400 text-sm">Revoked</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredWhitelist.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No entries found
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms' : 'No one has registered for the whitelist yet'}
              </p>
            </div>
          )}
        </div>

        {/* Revoke Modal */}
        {showRevokeModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Revoke Whitelist Access</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to revoke whitelist access for this wallet address? This action cannot be undone.
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowRevokeModal(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleRevokeAccess(showRevokeModal)}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Revoke Access
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}