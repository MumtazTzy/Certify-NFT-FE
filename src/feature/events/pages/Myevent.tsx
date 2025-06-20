import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'minting' | 'closed';
  attendees: number;
  maxAttendees: number;
  description: string;
  image: string;
}

// Mock: events the user is registered for
const myEvents: Event[] = [
  {
    id: '1',
    title: 'Web3 Development Workshop',
    date: '2024-04-15',
    location: 'Virtual Event',
    status: 'upcoming',
    attendees: 45,
    maxAttendees: 100,
    description: 'Learn the fundamentals of Web3 development with hands-on coding sessions.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '3',
    title: 'DeFi Masterclass',
    date: '2024-03-28',
    location: 'New York, NY',
    status: 'closed',
    attendees: 150,
    maxAttendees: 150,
    description: 'Advanced strategies for decentralized finance protocols and yield farming.',
    image: 'https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=400'
  },
  {
    id: '5',
    title: 'NFT Creation & Marketing',
    date: '2024-04-12',
    location: 'Los Angeles, CA',
    status: 'minting',
    attendees: 75,
    maxAttendees: 120,
    description: 'From concept to market: comprehensive guide to NFT creation and sales.',
    image: 'https://images.pexels.com/photos/1181355/pexels-photo-1181355.jpeg?auto=compress&cs=tinysrgb&w=400'
  }
];

function groupEvents(events: Event[]) {
  return {
    upcoming: events.filter(e => e.status === 'upcoming'),
    minting: events.filter(e => e.status === 'minting'),
    past: events.filter(e => e.status === 'closed'),
  };
}

function getNextEvent(events: Event[]) {
  const now = new Date();
  const upcoming = events.filter(e => e.status === 'upcoming');
  if (upcoming.length === 0) return null;
  return upcoming.reduce((next, curr) => {
    const currDate = new Date(curr.date);
    const nextDate = new Date(next.date);
    return currDate < nextDate ? curr : next;
  }, upcoming[0]);
}

export default function MyEventPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [walletAddress, setWalletAddress] = useState('');

  const filteredEvents = myEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const { upcoming, minting, past } = groupEvents(filteredEvents);
  const nextEvent = getNextEvent(filteredEvents);

  useEffect(() => {
    async function fetchMyEvents() {
      // Misal walletAddress sudah didapat dari auth/session
      const res = await fetch(`/api/events?participant=${walletAddress}`);
      const data = await res.json();
      setMyEvents(data);
    }
    fetchMyEvents();
  }, [walletAddress]);

  const renderEventCard = (event: Event) => (
    <div
      key={event.id}
      className="flex flex-col md:flex-row bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group mb-6"
    >
      <div className="md:w-1/3 h-48 md:h-auto overflow-hidden flex-shrink-0">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="flex-1 p-6 flex flex-col justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
            {event.title}
          </h3>
          <p className="text-gray-600 mb-4 text-sm leading-relaxed">
            {event.description}
          </p>
          <div className="flex flex-wrap gap-6 mb-2">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>{new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Users className="h-4 w-4" />
              <span>{event.attendees}/{event.maxAttendees} attendees</span>
            </div>
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase">
              {event.status === 'upcoming' && <span className="text-blue-600">Upcoming</span>}
              {event.status === 'minting' && <span className="text-green-600">Minting</span>}
              {event.status === 'closed' && <span className="text-gray-500">Past</span>}
            </div>
          </div>
        </div>
        <div className="mt-4">
          <Link
            to={`/events/${event.id}`}
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
          >
            <span>View Details</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Summary Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="text-2xl font-bold text-blue-700">{myEvents.length}</div>
            <div className="text-gray-600">Total Events Registered</div>
          </div>
          <div className="hidden md:block w-px h-12 bg-gray-200"></div>
          <div>
            <div className="text-gray-600 mb-1">Next Event</div>
            {nextEvent ? (
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span className="font-semibold text-gray-900">{nextEvent.title}</span>
                <span className="text-gray-500">({new Date(nextEvent.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})</span>
              </div>
            ) : (
              <span className="text-gray-400">No upcoming events</span>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search my events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Grouped Events */}
        {filteredEvents.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? 'No events found' : 'You have not registered for any events yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm
                ? 'Try adjusting your search terms'
                : 'Browse available events and register to see them here!'}
            </p>
            <Link
              to="/events"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
            >
              <ArrowRight className="h-5 w-5" />
              <span>Browse Events</span>
            </Link>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-blue-700 mb-4">Upcoming Events</h2>
                {upcoming.map(renderEventCard)}
              </div>
            )}
            {minting.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-green-700 mb-4">Minting Open</h2>
                {minting.map(renderEventCard)}
              </div>
            )}
            {past.length > 0 && (
              <div className="mb-10">
                <h2 className="text-xl font-bold text-gray-600 mb-4">Past Events</h2>
                {past.map(renderEventCard)}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
