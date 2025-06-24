// src/pages/user/MyEventsPage.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, CalendarDays } from 'lucide-react';
import WalletConnectPrompt from '../../certificates/components/WalletConnectPrompt';
import { useAuth } from '../../../auth/hooks/useAuth';
import { Event, fetchUserEvents } from '../services/MyeventServices';

// Card component for event
const EventCard = ({ event }: { event: Event }) => (
  <div className="bg-white p-4 rounded-lg shadow">
    <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
    <p className="text-sm text-gray-500 mb-3">{event.description}</p>
    <div className="flex flex-col gap-1 text-sm text-gray-600 mb-3">
      <span className="flex items-center gap-1">
        <Calendar className="w-4 h-4" />
        {new Date(event.start_date).toLocaleDateString()}
      </span>
      <span className="flex items-center gap-1">
        <MapPin className="w-4 h-4" />
        {event.location}
      </span>
      <span className="flex items-center gap-1">
        <Users className="w-4 h-4" />
        {event.attendees}/{event.maxattendees} attendees
      </span>
    </div>
    <Link
      to={`/events/${event.id}`}
      className="text-blue-600 hover:underline block"
    >
      View Details
    </Link>
  </div>
);

export default function MyEventsPage() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const load = async () => {
      setLoading(true);
      try {
        const data = await fetchUserEvents(walletAddress);
        setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setEvents([]); // fallback
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [walletAddress]);

  const filtered = events.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">My Events</h1>

      <input
        type="text"
        placeholder="Search events..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full mb-6 p-3 border border-gray-300 rounded-lg"
      />

      {loading ? (
        <p>Loading events...</p>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">
            {searchTerm ? 'No events found' : 'No events yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm
              ? 'Try adjusting your search'
              : 'Explore and join your first event!'}
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
