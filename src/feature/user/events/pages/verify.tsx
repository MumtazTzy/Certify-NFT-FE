import React, { useState } from 'react';
import { useAuth } from '../../../auth/hooks/useAuth';

function ipfsToW3sUrl(ipfsUrl?: string) {
  if (!ipfsUrl) return '';
  if (ipfsUrl.startsWith('ipfs://')) {
    const hash = ipfsUrl.replace('ipfs://', '');
    return `https://${hash}.ipfs.w3s.link/`;
  }
  return ipfsUrl;
}

function MetadataModal({ open, onClose, image, metadata, error, tokenURI }: { open: boolean; onClose: () => void; image?: string; metadata?: Record<string, any>; error?: string | null; tokenURI?: string }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl w-full relative flex flex-col md:flex-row items-center justify-center">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl">&times;</button>
        {/* Kiri: Gambar */}
        <div className="flex-shrink-0 flex items-center justify-center mb-4 md:mb-0 md:mr-8">
          {image ? (
            <img
              src={ipfsToW3sUrl(image)}
              alt="Certificate"
              className="w-48 h-48 object-cover rounded-xl border"
            />
          ) : (
            <div className="w-48 h-48 flex items-center justify-center bg-gray-100 rounded-xl border text-gray-400">No Image</div>
          )}
        </div>
        {/* Kanan: Metadata tabel */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-sm border border-gray-200 rounded-lg overflow-hidden">
            <tbody>
              {metadata?.name && (
                <tr className="border-b">
                  <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">name</td>
                  <td className="py-2 px-3 break-all">{String(metadata.name)}</td>
                </tr>
              )}
              {metadata?.description && (
                <tr className="border-b">
                  <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">description</td>
                  <td className="py-2 px-3 break-all">{String(metadata.description)}</td>
                </tr>
              )}
              {tokenURI && (
                <tr className="border-b">
                  <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">Metadata</td>
                  <td className="py-2 px-3 break-all">
                    <a href={ipfsToW3sUrl(tokenURI)} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {ipfsToW3sUrl(tokenURI)}
                    </a>
                  </td>
                </tr>
              )}
              {metadata?.image && (
                <tr className="border-b last:border-b-0">
                  <td className="font-semibold capitalize py-2 px-3 bg-gray-50 w-1/3 align-top">image</td>
                  <td className="py-2 px-3 break-all">
                    <a href={ipfsToW3sUrl(String(metadata.image))} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:underline">
                      {ipfsToW3sUrl(String(metadata.image))}
                    </a>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function VerifyCertificate() {
  const { walletAddress } = useAuth();
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImage, setModalImage] = useState('');
  const [modalMetadata, setModalMetadata] = useState<Record<string, any>>({});
  const [modalTokenURI, setModalTokenURI] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setModalOpen(false);
    if (!walletAddress) {
      setError('Please connect your wallet first.');
      setLoading(false);
      setModalOpen(true);
      return;
    }
    try {
      const url = `https://api.gpadaka.com/api2/api/certificate/verify?address=${encodeURIComponent(walletAddress)}&tokenId=${encodeURIComponent(tokenId)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to verify certificate');
      const data = await res.json();
      if (data && data.valid && data.data && data.data.valid && data.data.metadata) {
        setModalImage(ipfsToW3sUrl(data.data.metadata.image));
        setModalTokenURI(data.data.tokenURI);
        setModalMetadata(data.data.metadata);
        setModalOpen(true);
      } else {
        setError('Certificate not valid or not found.');
        setModalOpen(true);
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed.');
      setModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">Verify Certificate</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Token ID</label>
            <input
              type="text"
              className="w-full border border-purple-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-400"
              placeholder="Enter certificate tokenId"
              value={tokenId}
              onChange={e => setTokenId(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
            <div className="bg-purple-50 border border-purple-200 rounded-lg px-4 py-2 text-purple-800 font-mono text-sm break-all">
              {walletAddress ? walletAddress : 'Not connected'}
            </div>
          </div>
          {error && <div className="text-red-600 mb-4 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all"
            disabled={loading || !walletAddress}
          >
            {loading ? 'Verifying...' : 'Submit'}
          </button>
        </form>
      </div>
      <MetadataModal open={modalOpen} onClose={() => setModalOpen(false)} image={modalImage} metadata={modalMetadata} error={error} tokenURI={modalTokenURI} />
    </div>
  );
}
