import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, ArrowRight } from 'lucide-react';
import { Event } from '../services/EventServices';

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
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
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
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

        <div className="mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
            ></div>
          </div>
        </div>

        <Link
          to={`/events/${event.id}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 group-hover:transform group-hover:scale-105"
        >
          <span>View Details</span>
          <ArrowRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}
