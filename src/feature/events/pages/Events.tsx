import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';

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

export default function Events() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'minting' | 'closed'>('all');

  const events: Event[] = [
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
      id: '2',
      title: 'Blockchain Security Summit',
      date: '2024-04-10',
      location: 'San Francisco, CA',
      status: 'minting',
      attendees: 200,
      maxAttendees: 200,
      description: 'Deep dive into blockchain security best practices and emerging threats.',
      image: 'https://images.pexels.com/photos/1181263/pexels-photo-1181263.jpeg?auto=compress&cs=tinysrgb&w=400'
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
      id: '4',
      title: 'Smart Contract Audit Workshop',
      date: '2024-04-20',
      location: 'Virtual Event',
      status: 'upcoming',
      attendees: 30,
      maxAttendees: 80,
      description: 'Learn to identify vulnerabilities and audit smart contracts effectively.',
      image: 'https://images.pexels.com/photos/1181298/pexels-photo-1181298.jpeg?auto=compress&cs=tinysrgb&w=400'
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || event.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'minting': return 'bg-green-100 text-green-800 border-green-200';
      case 'closed': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'minting': return <Clock className="h-4 w-4" />;
      case 'closed': return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Available Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover blockchain events, workshops, and certification opportunities
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Events</option>
                <option value="upcoming">Upcoming</option>
                <option value="minting">Minting Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map(event => (
            <div
              key={event.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Event Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
                    {getStatusIcon(event.status)}
                    <span className="capitalize">{event.status}</span>
                  </span> 
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {event.title}
                </h3>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {event.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(event.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{event.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{event.attendees}/{event.maxAttendees} attendees</span>
                  </div>
                </div>

                {/* Attendance Progress */}
                <div className="mb-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  to={`/events/${event.id}`}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 group-hover:transform group-hover:scale-105"
                >
                  <span>View Details</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
}