// src/pages/ViewWhitelist.tsx

import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import { useWhitelist } from '../hooks/useWhitelist';

// Import komponen-komponen modular
import WhitelistHeader from '../components/WhitelistHeader';
import WhitelistStats from '../components/WhitelistStats';
import WhitelistTable from '../components/WhitelistTable';
import RevokeModal from '../components/RevokeModal';

export default function ViewWhitelist() {
  const { id } = useParams<{ id: string }>();
  const { whitelist, loading, error, revokeAccess } = useWhitelist(id);

  const [searchTerm, setSearchTerm] = useState('');
  const [revokingId, setRevokingId] = useState<string | null>(null);

  // Mock data event, bisa juga diambil dari API lain jika ada
  const event = {
    title: 'User Whitelisted'
  };

  const filteredWhitelist = useMemo(() => {
    if (!searchTerm) return whitelist;
    const lowercasedFilter = searchTerm.toLowerCase();
    return whitelist.filter(entry =>
      entry.name.toLowerCase().includes(lowercasedFilter) ||
      entry.email.toLowerCase().includes(lowercasedFilter) ||
      entry.walletAddress.toLowerCase().includes(lowercasedFilter)
    );
  }, [searchTerm, whitelist]);

  const stats = useMemo(() => ({
    total: whitelist.length,
    active: whitelist.filter(e => e.status === 'active').length,
    revoked: whitelist.filter(e => e.status === 'revoked').length,
  }), [whitelist]);

  const handleConfirmRevoke = () => {
    if (revokingId) {
      revokeAccess(revokingId);
      setRevokingId(null);
    }
  };

  const handleExportCSV = () => {
    const csvContent = [
      ['ID', 'Name', 'Email', 'Wallet Address', 'Registration Date', 'Status'],
      ...whitelist.map(e => `"${e.id}","${e.name}","${e.email}","${e.walletAddress}","${e.registrationDate}","${e.status}"`)
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${event.title.replace(/\s+/g, '_')}_whitelist.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen flex items-center justify-center text-red-500">Error: {error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WhitelistHeader eventId={id} eventTitle={event.title} onExportCSV={handleExportCSV} />
        <WhitelistStats total={stats.total} active={stats.active} revoked={stats.revoked} />
        
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or wallet address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
        </div>

        <WhitelistTable 
          entries={filteredWhitelist} 
          onRevokeClick={setRevokingId}
          searchTerm={searchTerm}
        />
        
        <RevokeModal 
          isOpen={!!revokingId} 
          onClose={() => setRevokingId(null)} 
          onConfirm={handleConfirmRevoke} 
        />
      </div>
    </div>
  );
}