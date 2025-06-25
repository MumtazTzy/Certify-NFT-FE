// src/pages/user/MyCertificatesPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar, ExternalLink, Image as ImageIcon } from 'lucide-react';
import WalletConnectPrompt from '../components/WalletConnectPrompt'; // Pastikan path ini benar
import { useAuth } from '../../../auth/hooks/useAuth';
// import { Certificate, fetchCertificatesByWallet } from '../services/certificateService'; // 1. Import asli dinonaktifkan

// --- MULAI MOCK DATA ---

// Mendefinisikan tipe 'Certificate' langsung di sini untuk development
interface Certificate {
  id: string;
  event_title: string;
  event_description: string;
  organizer_name: string;
  issue_date: string;
  image_url: string;
  transaction_hash: string;
}

// Data sertifikat palsu untuk pengujian
const mockCertificates: Certificate[] = [
  {
    id: '1',
    event_title: 'Web3 Development Masterclass',
    event_description: 'A comprehensive course on building decentralized applications from scratch using Solidity and React.',
    organizer_name: 'DevChain Academy',
    issue_date: '2023-10-26T10:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1642104790135-c3d1e45f3cac?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    transaction_hash: '0x123...abc'
  },
  {
    id: '2',
    event_title: 'Decentralized Finance (DeFi) Summit',
    event_description: 'An exclusive summit exploring the future of finance, including lending, borrowing, and yield farming protocols.',
    organizer_name: 'Fintech Innovators',
    issue_date: '2023-09-15T14:30:00Z',
    image_url: 'https://images.unsplash.com/photo-1642104790246-5629f345a72d?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    transaction_hash: '0x456...def'
  },
  {
    id: '3',
    event_title: 'NFT Art & Creator Economy',
    event_description: 'Learn how to create, mint, and market your digital art as NFTs and navigate the burgeoning creator economy.',
    organizer_name: 'CreativeBlock',
    issue_date: '2023-11-05T18:00:00Z',
    image_url: 'https://images.unsplash.com/photo-1639429469399-236b3c9cc9e9?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600',
    transaction_hash: '0x789...ghi'
  }
];

// Fungsi mock yang meniru pengambilan data dari API
const mockFetchCertificates = (walletAddress: string): Promise<Certificate[]> => {
  console.log(`Fetching mock certificates for wallet: ${walletAddress}`);
  return new Promise(resolve => {
    // Mensimulasikan jeda waktu jaringan (1 detik)
    setTimeout(() => {
      resolve(mockCertificates);
    }, 1000);
  });
};

// --- AKHIR MOCK DATA ---


// 2. CertificateCard diperbarui agar lebih menarik secara visual
const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
  <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="relative h-48 bg-gray-100">
      {certificate.image_url ? (
        <img src={certificate.image_url} alt={certificate.event_title} className="w-full h-full object-cover" />
      ) : (
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <ImageIcon className="w-12 h-12" />
        </div>
      )}
    </div>
    <div className="p-5 flex flex-col flex-1">
      <p className="text-sm text-gray-500 mb-1">
        Issued by <span className="font-semibold text-gray-700">{certificate.organizer_name}</span>
      </p>
      <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {certificate.event_title}
      </h3>
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
        {certificate.event_description}
      </p>
      <div className="text-xs text-gray-500 flex items-center mb-4">
        <Calendar className="w-4 h-4 mr-2" />
        <span>
          Issued on {new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </div>
      <Link
        to={`/certificate/${certificate.id}`} // Arahkan ke halaman detail jika ada
        className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
      >
        <span>View Certificate</span>
        <ExternalLink className="h-4 w-4" />
      </Link>
    </div>
  </div>
);

export default function MyCertificatesPage() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true); // Default-kan ke true

  useEffect(() => {
    if (!walletAddress) {
      setLoading(false);
      return;
    }

    const loadCertificates = async () => {
      setLoading(true);
      try {
        // 3. Menggunakan fungsi mockFetchCertificates, bukan yang asli
        const data = await mockFetchCertificates(walletAddress);
        setCertificates(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch certificates:', err);
        setCertificates([]); // fallback jika terjadi error
      } finally {
        setLoading(false);
      }
    };

    loadCertificates();
  }, [walletAddress]);

  const filteredCertificates = certificates.filter((c) =>
    c.event_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.event_description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.organizer_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <WalletConnectPrompt
        onConnect={() => {
          const dummyToken = 'dummyToken';
          const dummyAddress = '0x12d7A5E92D17dcb068e512660B24A9A3072a755e';
          login(dummyToken, dummyAddress);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">My Certificates</h1>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Search by event, description, or organizer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 pl-5 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading your certificates...</p>
          </div>
        ) : filteredCertificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCertificates.map((cert) => (
              <CertificateCard key={cert.id} certificate={cert} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              {searchTerm ? 'No certificates found' : 'You have no certificates yet'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm
                ? 'Try adjusting your search terms or clear the search to see all certificates.'
                : 'Attend events and mint your first certificate to see it appear here!'}
            </p>
            {!searchTerm && (
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-transform hover:scale-105"
              >
                <Calendar className="h-5 w-5" />
                <span>Browse Events</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}