import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, ArrowRight } from 'lucide-react';
import { fetchUserEvents, Event } from '../services/MyeventServices';

// Group helper
function groupEvents(events: Event[]) {
  return {
    upcoming: events.filter(e => e.status === 'upcoming'),
    minting: events.filter(e => e.status === 'minting'),
    past: events.filter(e => e.status === 'closed'),
  };
}

// Next event helper
function getNextEvent(events: Event[]) {
  const upcoming = events.filter(e => e.status === 'upcoming');
  if (upcoming.length === 0) return null;
  return upcoming.reduce((next, curr) => {
    const currDate = new Date(curr.date);
    const nextDate = new Date(next.date);
    return currDate < nextDate ? curr : next;
  }, upcoming[0]);
}

export default function MyEventPage() {
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchUserEvents(2); // hardcoded user ID = 2
        setMyEvents(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Failed to load events');
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const filtered = myEvents.filter(e =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const { upcoming, minting, past } = groupEvents(filtered);
  const nextEvent = getNextEvent(filtered);

  const renderEventCard = (event: Event) => (
    <div key={event.id} className="bg-white shadow p-4 rounded-lg mb-4">
      <h3 className="text-xl font-bold">{event.title}</h3>
      <p>{event.description}</p>
      <div className="flex gap-4 text-sm text-gray-600 mt-2">
        <span><Calendar className="inline w-4 h-4" /> {event.date}</span>
        <span><MapPin className="inline w-4 h-4" /> {event.location}</span>
        <span><Users className="inline w-4 h-4" /> {event.attendees}/{event.maxAttendees}</span>
      </div>
      <Link to={`/events/${event.id}`} className="text-blue-600 mt-2 inline-flex items-center">
        View Details <ArrowRight className="ml-1 w-4 h-4" />
      </Link>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Events</h1>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search my events..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg"
        />
      </div>

      {/* Status */}
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && (
        <>
          {filtered.length === 0 ? (
            <p>No events found.</p>
          ) : (
            <>
              {upcoming.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
                  {upcoming.map(renderEventCard)}
                </>
              )}

              {minting.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold mb-2 mt-4">Minting Open</h2>
                  {minting.map(renderEventCard)}
                </>
              )}

              {past.length > 0 && (
                <>
                  <h2 className="text-lg font-semibold mb-2 mt-4">Past Events</h2>
                  {past.map(renderEventCard)}
                </>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
