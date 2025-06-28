// src/pages/user/MyCertificatesPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Award, Calendar } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Certificate, fetchCertificatesByWallet } from '../services/certificateService';

// Modal metadata dengan fetch detail
function MetadataModal({ open, onClose, url, txHash }: { open: boolean; onClose: () => void; url: string; txHash: string }) {
  const [meta, setMeta] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to truncate long values
  const truncateValue = (value: string, maxLength: number = 40) => {
    if (value.length <= maxLength) return value;
    const start = value.substring(0, 30);
    const end = value.substring(value.length - 30);
    return `${start}....${end}`;
  };

  useEffect(() => {
    if (!open || !url) return;
    setMeta(null);
    setError(null);
    setLoading(true);
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch metadata');
        return res.json();
      })
      .then(data => {
        // Add transaction hash to metadata object
        const metadataWithTxHash = {
          ...data,
          transaction_hash: txHash
        };
        setMeta(metadataWithTxHash);
      })
      .catch(err => setError(err.message || 'Failed to fetch metadata'))
      .finally(() => setLoading(false));
  }, [open, url, txHash]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-2xl w-full relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        <h2 className="text-lg font-bold mb-4">Certificate Metadata</h2>
        {loading && <div className="text-gray-500">Loading metadata...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {meta && (
          <table className="w-full text-sm mb-4 border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              <tr className="border-b">
                <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">Metadata URL</td>
                <td className="py-2 px-3">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-600 underline font-mono text-xs"
                    title={url}
                  >
                    {truncateValue(url)}
                  </a>
                </td>
              </tr>
              {Object.entries(meta).map(([key, value]) => (
                <tr key={key} className="border-b last:border-b-0">
                  <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">
                    {key === 'transaction_hash' ? 'Transaction Hash' : key}
                  </td>
                  <td className="py-2 px-3">
                    {key === 'transaction_hash' ? (
                      <a
                        href={`https://sepolia.etherscan.io/tx/${value}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-mono text-xs"
                        title={String(value)}
                      >
                        {truncateValue(String(value))}
                      </a>
                    ) : typeof value === 'string' && value.startsWith('ipfs://') ? (
                      <a 
                        href={`https://ipfs.io/ipfs/${value.replace('ipfs://', '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 underline font-mono text-xs"
                        title={value}
                      >
                        {truncateValue(value)}
                      </a>
                    ) : key === 'image' && typeof value === 'string' ? (
                      <a
                        href={value.startsWith('ipfs://') ? `https://ipfs.io/ipfs/${value.replace('ipfs://', '')}` : value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline font-mono text-xs"
                        title={value}
                      >
                        {truncateValue(value)}
                      </a>
                    ) : (
                      <span className="font-mono text-xs" title={String(value)}>
                        {(key === 'description' || key === 'user_address') ? String(value) : truncateValue(String(value))}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function MyCertificatesPage() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalUrl, setModalUrl] = useState<string | null>(null);

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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-6 mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4 md:mb-0">My Certificates</h1>
        <input
          type="text"
          placeholder="Search certificates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xs p-3 border border-gray-300 rounded-lg shadow-sm"
        />
      </div>

      {loading ? (
        <p>Loading certificates...</p>
      ) : filtered.length > 0 ? (
        <div className="w-full max-w-6xl">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8">
            {filtered.map((cert) => {
              let urlMetadata = '';
              let urlCertificate = '';
              try {
                const parsed = JSON.parse(cert.certificate_data);
                urlMetadata = parsed.urlMetadata || '';
                urlCertificate = parsed.urlCertificate || '';
              } catch {}
              return (
                <div key={cert.id} className="flex flex-col items-center">
                  <div className="bg-white p-3 rounded-3xl border border-gray-200 shadow-sm hover:shadow-lg transition mb-2 w-full flex flex-col items-center">
                    {urlCertificate ? (
                      <img
                        src={urlCertificate}
                        alt={cert.event_title}
                        className="w-40 h-40 object-cover rounded-xl cursor-pointer mb-2"
                        onClick={() => urlMetadata && setModalUrl(`${urlMetadata}|${cert.mint_transaction_hash}`)}
                        title="Click to view metadata"
                      />
                    ) : (
                      <span className="inline-block w-40 h-40 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 mb-2">
                        <Award className="h-12 w-12" />
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <MetadataModal
            open={!!modalUrl}
            onClose={() => setModalUrl(null)}
            url={modalUrl ? modalUrl.split('|')[0] : ''}
            txHash={modalUrl ? modalUrl.split('|')[1] : ''}
          />
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
