import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wallet, Award, CheckCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth';
import { fetchEventById } from '../../events/services/EventdetailServices';

interface Certificate {
  tokenId?: string;
  id?: string;
  // tambahkan properti lain sesuai kebutuhan
}
interface EventType {
  title?: string;
  organizer?: string;
  start_date?: string;
  date?: string;
  location?: string;
}

export default function MintPage() {
  const { eventId } = useParams();
  const [isMinting, setIsMinting] = useState(false);
  const [isMinted, setIsMinted] = useState(false);
  const [mintedCertificate, setMintedCertificate] = useState<Certificate | null>(null);
  const [event, setEvent] = useState<EventType | null>(null);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventError, setEventError] = useState<string | null>(null);
  const [mintError, setMintError] = useState<string | null>(null);
  const { walletAddress } = useAuth();

  useEffect(() => {
    if (!eventId) return;
    setLoadingEvent(true);
    setEventError(null);
    fetchEventById(eventId)
      .then(setEvent)
      .catch(() => setEventError('Failed to load event details.'))
      .finally(() => setLoadingEvent(false));
  }, [eventId]);

  const handleMint = async (e: React.FormEvent) => {
    e.preventDefault();
    setMintError(null);
    if (!walletAddress || !eventId) return;
    setIsMinting(true);
    try {
      const res = await fetch('https://api.gpadaka.com/api1/api/certificate/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_address: walletAddress,
          event_id: Number(eventId)
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error((data as { message?: string }).message || 'Mint failed.');
      setIsMinted(true);
      setMintedCertificate(data as Certificate);
    } catch (err: unknown) {
      setMintError(err instanceof Error ? err.message : 'Mint failed.');
    } finally {
      setIsMinting(false);
    }
  };

  if (loadingEvent) {
    return <div className="min-h-screen flex items-center justify-center"><p>Loading event details...</p></div>;
  }
  if (eventError || !event) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">{eventError || 'Event not found.'}</p></div>;
  }

  if (isMinted && mintedCertificate) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Certificate Minted! 🎉</h1>
            <p className="text-gray-600 mb-6">Congratulations! Your NFT certificate has been successfully minted and added to your wallet.</p>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
              <div className="text-center">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-90" />
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm opacity-90 mb-2">Certificate of Completion</p>
                <p className="text-xs opacity-75">Token ID: #{mintedCertificate.tokenId || mintedCertificate.id}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Link to="/my-certificates" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                <Award className="h-5 w-5" />
                <span>View My Certificates</span>
              </Link>
              {mintedCertificate.tokenId && (
                <Link to={`/verify/${mintedCertificate.tokenId}`} className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2">
                  <ExternalLink className="h-5 w-5" />
                  <span>Verify Certificate</span>
                </Link>
              )}
              <Link to="/events" className="w-full text-gray-600 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-colors">
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link to={`/events/${eventId}`} className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to event</span>
          </Link>
        </div>
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mint Your Certificate</h1>
            <p className="text-gray-600">Enter your token code to mint your NFT certificate</p>
          </div>
          {/* Event Preview */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6">
            <div className="text-center">
              <Award className="h-10 w-10 mx-auto mb-3 opacity-90" />
              <h3 className="font-bold text-lg">{event.title}</h3>
              <p className="text-sm opacity-90 mb-1">Certificate of Completion</p>
              <p className="text-xs opacity-75">Issued by {event.organizer}</p>
            </div>
          </div>
          <form onSubmit={handleMint} className="space-y-6">
            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Connection</label>
              {walletAddress ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</p>
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3">
                  <Wallet className="h-5 w-5 text-red-600" />
                  <div>
                    <p className="text-red-800 font-medium">Wallet Not Connected</p>
                    <p className="text-red-600 text-sm">Please login and connect your wallet to mint</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Info */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Event:</span> {event.title}</p>
                <p><span className="font-medium">Date:</span> {event.start_date || event.date ? new Date(event.start_date || event.date as string).toLocaleDateString() : '-'}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Organizer:</span> {event.organizer}</p>
              </div>
            </div>
            {/* Minting Process */}
            {isMinting && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  <div>
                    <p className="text-blue-900 font-medium">Minting your certificate...</p>
                    <p className="text-blue-700 text-sm">This may take a few moments</p>
                  </div>
                </div>
              </div>
            )}
            {mintError && <div className="text-red-600 text-sm">{mintError}</div>}
            {/* Submit Button */}
            <button
              type="submit"
              disabled={!walletAddress || isMinting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isMinting ? 'Minting...' : 'Mint Certificate'}
            </button>
          </form>
          {/* Help */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Can't mint ?{' '}
              <a href="#" className="text-blue-600 hover:text-blue-700 underline">Contact event organizer</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}