// src/pages/user/MyCertificatesPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar } from 'lucide-react';
import WalletConnectPrompt from '../components/WalletConnectPrompt';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Certificate, fetchCertificatesByWallet } from '../services/certificateService';

export default function MyCertificatesPage() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchCertificatesByWallet(walletAddress);
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
        setCertificates([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [walletAddress]);

  const filtered = certificates.filter((c) =>
    c.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.event_description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">My Certificates</h1>

      <input
        type="text"
        placeholder="Search certificates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full max-w-xl mb-6 p-3 border border-gray-300 rounded-lg shadow-sm"
      />

      {loading ? (
        <p>Loading certificates...</p>
      ) : filtered.length > 0 ? (
        <div className="w-full max-w-3xl mx-auto overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b">Event</th>
                <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b">Description</th>
                <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 border-b">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((cert) => (
                <tr key={cert.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-900">{cert.event_title}</td>
                  <td className="py-4 px-6 text-gray-600">{cert.event_description}</td>
                  <td className="py-4 px-6 text-center">
                    <Link
                      to={"#"}
                      className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No certificates found' : 'No certificates yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Attend events and mint your first certificate!'}
          </p>
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            <Calendar className="h-5 w-5" />
            <span>Browse Events</span>
          </Link>
        </div>
      )}
    </div>
  );
}
