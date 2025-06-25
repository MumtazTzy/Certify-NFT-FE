// src/components/whitelist/WhitelistTable.tsx

import { Search } from 'lucide-react';
import { WhitelistEntry } from '../types';

interface Props {
  entries: WhitelistEntry[];
  onRevokeClick: (id: string) => void;
  searchTerm: string;
}

export default function WhitelistTable({ entries, onRevokeClick, searchTerm }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900">Whitelisted Participants</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">User</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Registration Date</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Status</th>
              <th className="text-left py-3 px-6 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry) => (
              <tr key={entry.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="font-semibold text-gray-900">{entry.name}</div>
                  <div className="text-sm text-gray-500">{entry.email}</div>
                  <div className="font-mono text-xs text-purple-700 mt-1">{entry.walletAddress}</div>
                </td>
                <td className="py-4 px-6 text-gray-600">
                  {new Date(entry.registrationDate).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                  })}
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${entry.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {entry.status === 'active' ? '✓ Active' : '✗ Revoked'}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {entry.status === 'active' ? (
                    <button onClick={() => onRevokeClick(entry.id)} className="text-red-600 hover:text-red-700 font-semibold text-sm transition-colors">
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
      {entries.length === 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No entries found</h3>
          <p className="text-gray-600">{searchTerm ? 'Try adjusting your search terms' : 'No one has registered for the whitelist yet'}</p>
        </div>
      )}
    </div>
  );
}