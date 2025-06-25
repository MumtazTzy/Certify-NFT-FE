// src/pages/user/MyCertificatesPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar } from 'lucide-react';
import WalletConnectPrompt from '../components/WalletConnectPrompt';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Certificate, fetchCertificatesByWallet } from '../services/certificateService';

// OPTIONAL: Card minimal untuk demo
const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold">{certificate.event_title}</h3>
    <p className="text-sm text-gray-500">{certificate.event_description}</p>
    <a
      href="#"
      className="text-blue-600 hover:underline mt-2 block"
    >
      View Details
    </a>
  </div>
);

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
        setCertificates([]); // fallback
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

  // if (!isAuthenticated) {
  //   return (
  //     <WalletConnectPrompt
  //       onConnect={() => {
  //         // Simulasi: ganti dengan real wallet connect logic
  //         const dummyToken = 'dummyToken';
  //         const dummyAddress = '0x12d7A5E92D17dcb068e512660B24A9A3072a755e';
  //         login(dummyToken, dummyAddress);
  //       }}
  //     />
  //   );
  // }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Certificates</h1>

      <input
        type="text"
        placeholder="Search certificates..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
      />

      {loading ? (
        <p>Loading certificates...</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((cert) => (
            <CertificateCard key={cert.id} certificate={cert} />
          ))}
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
