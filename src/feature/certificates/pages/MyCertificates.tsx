// src/pages/user/MyCertificates.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CertificateCard from '../components/CertificateCard';
import SearchBar from '../components/SearchBar';
import WalletConnectPrompt from '../components/WalletConnectPrompt';
import WalletInfoCard from '../components/WalletInfoCard';
import { Award, Calendar } from 'lucide-react';
import { Certificate, fetchCertificates } from '../services/certificateService';

export default function MyCertificatesPage() {
  const [isConnected, setIsConnected] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadCertificates = async () => {
      setLoading(true);
      try {
        const data = await fetchCertificates();
        setCertificates(data);
      } catch (error) {
        console.error('Failed to fetch certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, []);

  const filteredCertificates = certificates.filter((cert) =>
    cert.eventTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.organizer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isConnected) {
    return <WalletConnectPrompt onConnect={() => setIsConnected(true)} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            My Certificates
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your blockchain-verified certificates and achievements
          </p>
        </div>

        <WalletInfoCard total={certificates.length} />

        <SearchBar value={searchTerm} onChange={setSearchTerm} />

        {loading ? (
          <p className="text-center text-gray-500">Loading certificates...</p>
        ) : filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCertificates.map((certificate) => (
              <CertificateCard key={certificate.id} certificate={certificate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No certificates found' : 'No certificates yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Attend events and mint your first certificate!'}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <Calendar className="h-5 w-5" />
              <span>Browse Events</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
