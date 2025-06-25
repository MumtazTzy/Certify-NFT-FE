import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// ✅ FIX: Impor ikon disederhanakan, hanya yang dibutuhkan oleh halaman ini.
import { Calendar, Search, Frown } from 'lucide-react'; 

// ✅ FIX: Path impor disesuaikan untuk konsistensi
import { useAuth } from '../../../auth/hooks/useAuth';
import { fetchUserEvents,Event } from '../services/MyeventServices';
import EventCard from '../components/MyEventCard'; // ✅ Menggunakan EventCard yang sudah pintar

// Komponen helper (tidak ada UserStatusBadge lagi di sini)
const LoadingSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
        <div className="bg-gray-200 aspect-video w-full"></div>
        <div className="p-6"><div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div><div className="h-10 bg-gray-200 rounded w-full mb-4"></div><div className="h-4 bg-gray-200 rounded w-1/2"></div></div>
      </div>
    ))}
  </div>
);

const NotAuthenticatedPrompt = () => (
  <div className="max-w-7xl mx-auto px-4 py-20 text-center">
    <h2 className="text-3xl font-bold text-gray-800">View Your Registered Events</h2>
    <p className="text-gray-600 mt-2 mb-6 max-w-xl mx-auto">Please log in with your wallet to see a personalized list of all the events you have joined.</p>
    <Link to="/login" className="bg-purple-600 text-white font-semibold py-3 px-8 rounded-lg hover:bg-purple-700 transition-transform hover:scale-105">Go to Login</Link>
  </div>
);

const EmptyState = ({ isSearching }: { isSearching: boolean }) => (
  <div className="text-center py-20 bg-white rounded-2xl shadow-lg">
    {isSearching ? (
      <><Frown className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">No Events Found</h3><p className="text-gray-500 max-w-md mx-auto">Your search did not match any of your registered events. Please try a different keyword.</p></>
    ) : (
      <><Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" /><h3 className="text-2xl font-semibold mb-2">You Haven't Joined Any Events Yet</h3><p className="text-gray-500 mb-6 max-w-md mx-auto">Explore our available events and start your journey to earn new certificates!</p><Link to="/events" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold"><span>Browse All Events</span></Link></>
    )}
  </div>
);

export default function MyEventsPage() {
  const { isAuthenticated, walletAddress } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  // useEffect (tidak ada perubahan, sudah baik)
  useEffect(() => {
    if (!isAuthenticated || !walletAddress) { setLoading(false); return; }
    const loadMyEvents = async () => {
      setLoading(true);
      try {
        const data = await fetchUserEvents(walletAddress);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) { console.error('Failed to fetch my events:', err); setEvents([]); }
      finally { setLoading(false); }
    };
    loadMyEvents();
  }, [isAuthenticated, walletAddress]);

  const filteredEvents = events.filter((e) => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (!isAuthenticated) { return <NotAuthenticatedPrompt />; }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">My Events</h1>
        <p className="text-lg text-gray-600 mb-8">A record of all events you have registered for.</p>
        
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input type="text" placeholder="Search in your events by title..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/>
        </div>

        {loading ? (
          <LoadingSkeleton />
        ) : filteredEvents.length > 0 ? (
          // ✅ FIX: Logika mapping sekarang SANGAT sederhana
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <EmptyState isSearching={!!searchTerm} />
        )}
      </div>
    </div>
  );
}