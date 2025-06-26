// src/pages/EventDetail.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react'; // DoorOpen, CheckCircle tidak digunakan secara langsung di sini lagi
import toast from 'react-hot-toast';

// Import types, helpers, and components
import { Event } from '../types'; // Asumsi path benar
import { fetchEventById } from '../services/EventdetailServices'; // Asumsi path benar
import Loader from '../components/common/Loader'; // Asumsi path benar
import EventHero from '../components/EventHero'; // Asumsi path benar
import EventInfoCard from '../components/EventInfoCard'; // Asumsi path benar
import RequirementsList from '../components/RequirementsList'; // Asumsi path benar
import AgendaList from '../components/AgendaList'; // Asumsi path benar
import StatusCard from '../components/StatusCard'; // Asumsi path benar
import EventStatsCard from '../components/EventStatsCard'; // Asumsi path benar
import ShareCard from '../components/ShareCard'; // Asumsi path benar
import { cancelWhitelist } from '../../whitelist/services/WhitelistServices'; // Asumsi path benar

import { useAuth } from '../../../auth/hooks/useAuth';
import ConfirmationModal from '../../../../components/ConfirmationModal'; // Asumsi path benar

// Helper untuk localStorage key
const getWhitelistStorageKey = (walletAddress: string, eventId: string) => {
    return `whitelist-status-${walletAddress}-${eventId}`;
};

// Asumsi tipe Event Anda mungkin memiliki field ini dari API
interface EventWithUserStatus extends Event {
  is_current_user_whitelisted?: boolean;
  is_current_user_attended?: boolean;
}

const EventDetail: React.FC = () => {
  const { id: eventId } = useParams<{ id: string }>(); // Ubah nama id menjadi eventId untuk kejelasan
  const { isAuthenticated, user } = useAuth(); // walletAddress ada di dalam user jika user tidak null

  const [event, setEvent] = useState<EventWithUserStatus | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk status whitelist dan kehadiran, idealnya diinisialisasi dari API
  const [isCurrentUserWhitelisted, setIsCurrentUserWhitelisted] = useState<boolean>(false);
  const [isCurrentUserAttended, setIsCurrentUserAttended] = useState<boolean>(false);
  
  const [isCancelWhitelistModalOpen, setIsCancelWhitelistModalOpen] = useState(false);
  const [isCancellingWhitelist, setIsCancellingWhitelist] = useState(false);

  // Fungsi untuk memuat data event, termasuk status user
  const loadEventData = useCallback(async (currentEventId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data: EventWithUserStatus = await fetchEventById(currentEventId);
      setEvent(data);

      // Idealnya, API mengembalikan status whitelist dan kehadiran user saat ini
      if (data.is_current_user_whitelisted !== undefined) {
        setIsCurrentUserWhitelisted(data.is_current_user_whitelisted);
        // Update localStorage berdasarkan API response
        if (user?.walletAddress) {
            const key = getWhitelistStorageKey(user.walletAddress, currentEventId);
            if (data.is_current_user_whitelisted) {
                localStorage.setItem(key, 'true');
            } else {
                localStorage.removeItem(key);
            }
        }
      } else if (isAuthenticated && user?.walletAddress) {
        // Fallback ke localStorage jika API tidak menyediakan
        const key = getWhitelistStorageKey(user.walletAddress, currentEventId);
        setIsCurrentUserWhitelisted(!!localStorage.getItem(key));
      }

      if (data.is_current_user_attended !== undefined) {
        setIsCurrentUserAttended(data.is_current_user_attended);
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred while fetching event details.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.walletAddress]); // Dependencies untuk useCallback

  useEffect(() => {
    if (eventId) {
      loadEventData(eventId);
    } else {
      const msg = "No event ID provided in the URL.";
      setError(msg);
      toast.error(msg);
      setLoading(false);
    }
  }, [eventId, loadEventData]); // loadEventData dimasukkan sebagai dependency

  // Handler untuk konfirmasi pembatalan whitelist
  const handleConfirmCancelWhitelist = async () => {
    setIsCancelWhitelistModalOpen(false);

    if (!eventId || !user?.walletAddress) {
      toast.error("Authentication error or missing event/user details. Please try again.");
      return;
    }

    setIsCancellingWhitelist(true);
    const promise = cancelWhitelist(eventId, user.walletAddress);

    toast.promise(
      promise,
      {
        loading: 'Leaving whitelist...',
        success: (data) => {
          setIsCurrentUserWhitelisted(false); // Update state UI
          if (user?.walletAddress && eventId) { // Periksa null sebelum akses
            localStorage.removeItem(getWhitelistStorageKey(user.walletAddress, eventId));
          }
          return data.message || "Successfully left the whitelist!";
        },
        error: (err) => err.message || "Failed to leave whitelist. Please try again.",
      }
    );

    promise.finally(() => setIsCancellingWhitelist(false));
  };


  if (loading) {
    return <Loader message="Loading event details, please wait..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4 py-8">
        <h2 className="text-xl font-semibold text-red-600 mb-2">Oops! Something Went Wrong</h2>
        <p className="text-red-500 mb-6">{error}</p>
        <Link to="/events" className="inline-flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Events</span>
        </Link>
      </div>
    );
  }
  
  if (!event) {
     return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center text-center px-4 py-8">
            <p className="text-gray-700 text-lg">Event data could not be loaded or the event does not exist.</p>
            <Link to="/events" className="mt-4 inline-flex items-center space-x-2 bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 text-sm font-medium">
                <ArrowLeft className="h-4 w-4" />
                <span>Go to Events</span>
            </Link>
        </div>
     );
  }

  // Pastikan properti yang diperlukan untuk sub-komponen ada di objek event
  const { 
    title = "Event Title Not Available", 
    organizer = "Organizer Not Available", 
  } = event;
  return (
    <div className="min-h-screen bg-gray-100 py-8 md:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... (bagian header dan tombol back) ... */}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* ... EventHero, EventInfoCard, About, RequirementsList, AgendaList ... */}
             <EventHero id={event.id} title={title} organizer={organizer} picture={event.picture} />
             <EventInfoCard 
              date={event.start_date} 
              location={event.location} 
              Whitelisted={event.whitelisted || 0} 
              maxAttendees={event.maxattendees || 0} 
            />
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3">About This Event</h3>
              <div className="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                {(event.description || "No description available.").split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </div>
            </div>
            {(event.requirements && event.requirements.length > 0) && <RequirementsList requirements={event.requirements} />}
            {(event.agenda && event.agenda.length > 0) && <AgendaList agenda={event.agenda} />}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6 md:space-y-8">
            <StatusCard 
                event={event} 
                isWhitelisted={isCurrentUserWhitelisted}
                isAttended={isCurrentUserAttended}
                onCancelWhitelist={() => setIsCancelWhitelistModalOpen(true)}
                isCancellingWhitelist={isCancellingWhitelist}
                userRole={user?.role} 
              />
            <EventStatsCard 
              whitelisted={event.whitelisted || 0} 
              maxAttendees={event.maxattendees || 0} 
            />
            {/* PASTIKAN ShareCard MENERIMA PROPS YANG BENAR */}
            <ShareCard/>
          </div>
        </div>
      </div>

      {/* ConfirmationModal dirender di sini, di luar grid utama */}
      <ConfirmationModal
        isOpen={isCancelWhitelistModalOpen}
        onClose={() => setIsCancelWhitelistModalOpen(false)}
        onConfirm={handleConfirmCancelWhitelist}
        title="Leave Whitelist"
        message="Are you sure you want to cancel your registration? You will lose your spot and may not be able to join again if the event is full."
      />
    </div>
  );
};

export default EventDetail;
