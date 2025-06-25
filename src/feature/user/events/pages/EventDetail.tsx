import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast'; 
// Import types, helpers, and components
import { Event } from '../types';
import { fetchEventById , } from '../services/EventdetailServices';
import Loader from '../components/common/Loader';
import EventHero from '../components/EventHero';
import EventInfoCard from '../components/EventInfoCard';
import RequirementsList from '../components/RequirementsList';
import AgendaList from '../components/AgendaList';
import StatusCard from '../components/StatusCard';
import EventStatsCard from '../components/EventStatsCard';
import ShareCard from '../components/ShareCard';
import { cancelWhitelist } from '../../whitelist/services/WhitelistServices';

import { useAuth } from '../../../auth/hooks/useAuth'; // <-- IMPORT useAuth
import ConfirmationModal from '../../../../components/ConfirmationModal'; // <-- IMPORT MODAL

const getWhitelistStorageKey = (walletAddress: string, eventId: string) => {
    return `whitelist-status-${walletAddress}-${eventId}`;
};

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, walletAddress, user } = useAuth(); // <-- GUNAKAN AUTH CONTEXT

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isWhitelisted, setIsWhitelisted] = useState<boolean>(false); // <-- STATE BARU
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

   const handleConfirmCancel = async () => {
    setIsModalOpen(false); // Tutup modal terlebih dahulu

    if (!id || !walletAddress) {
      toast.error("Authentication error. Please log in again.");
      return;
    }

    setIsCancelling(true);

    const promise = cancelWhitelist(id, walletAddress); // Panggil API service

    // Gunakan toast.promise untuk UX yang hebat
    toast.promise(
      promise,
      {
        loading: 'Leaving whitelist...',
        success: (data) => {
          // Update UI setelah berhasil
          setIsWhitelisted(false);
          if (walletAddress) {
            localStorage.removeItem(getWhitelistStorageKey(walletAddress, id));
          }
          return data.message || "Successfully left the whitelist!";
        },
        error: (err) => err.message || "Failed to leave whitelist.",
      }
    );

    // Reset status loading setelah promise selesai (baik sukses maupun gagal)
    promise.finally(() => setIsCancelling(false));
  };

  useEffect(() => {
      if (isAuthenticated && walletAddress && id) {
          const key = getWhitelistStorageKey(walletAddress, id);
          if (localStorage.getItem(key)) {
              setIsWhitelisted(true);
          } else {
              setIsWhitelisted(false);
          }
      } else {
          setIsWhitelisted(false);
      }
  }, [id, isAuthenticated, walletAddress]); // Dijalankan saat user/event berubah

  useEffect(() => {
    const loadEvent = async (eventId: string) => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadEvent(id);
    } else {
      setError("No event ID provided in the URL.");
      setLoading(false);
    }
  }, [id]);

  if (loading) {
    return <Loader message="Loading event details..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong.</h2>
        <p className="text-lg text-red-500 mb-6">{error}</p>
        <Link to="/events" className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }
  
  if (!event) {
     return <Loader message="Event data could not be loaded." />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/events" className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Events</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            <EventHero id={event.id} title={event.title} organizer={event.organizer} picture={event.picture} />
            <EventInfoCard date={event.start_date} location={event.location} Whitelisted={event.whitelisted} maxAttendees={event.maxattendees} />
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
              <p className="text-gray-700 leading-relaxed">{event.description}</p>
            </div>
            <RequirementsList requirements={event.requirements} />
            <AgendaList agenda={event.agenda} />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <StatusCard 
                event={event} 
                isWhitelisted={isWhitelisted} 
                onCancel={() => setIsModalOpen(true)} // Buka modal saat diklik
                isCancelling={isCancelling} // Beri tahu StatusCard saat sedang loading
                userRole={user?.role} // <-- tambahkan prop role
              />
              <EventStatsCard whitelisted={event.whitelisted} maxAttendees={event.maxattendees} />
              <ShareCard />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Leave Whitelist"
        message="Are you sure you want to cancel your registration? You will lose your spot and may not be able to join again if the event is full."
      />
    </div>
    
  );
};

export default EventDetail;