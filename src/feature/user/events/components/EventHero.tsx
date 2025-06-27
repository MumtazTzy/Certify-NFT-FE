import React from 'react';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

interface EventHeroProps {
  id: number;
  title: string;
  organizer: string;
  picture: string;
  date?: string;
  location?: string;
  maxAttendees?: number;
  whitelisted?: number;
  status?: string;
}

const EventHero: React.FC<EventHeroProps> = ({ 
  title, 
  organizer, 
  picture, 
  date, 
  location, 
  maxAttendees, 
  whitelisted, 
  status 
}) => {
  const imageUrl = `${picture}`;
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-500';
      case 'ongoing': return 'bg-green-500';
      case 'minting': return 'bg-purple-500';
      case 'canceled': return 'bg-red-500';
      case 'ended': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      <div className="relative h-80 overflow-hidden">
        {picture ? (
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <span className="text-gray-500 text-lg">No image available</span>
            </div>
          </div>
        )}
        
        {/* Enhanced gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        
        {/* Status badge */}
        {status && (
          <div className="absolute top-4 left-4">
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium text-white shadow-lg ${getStatusColor(status)}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        )}

        {/* Attendance badge */}
        {typeof whitelisted === "number" && typeof maxAttendees === "number" && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-lg">
              <Users className="h-4 w-4 mr-1.5" />
              {whitelisted}/{maxAttendees} attendees
            </span>
          </div>
        )}

        {/* Content overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="space-y-3">
            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-white leading-tight">
              {title}
            </h1>
            
            {/* Organizer */}
            <div className="flex items-center space-x-2">
              <Award className="h-5 w-5 text-white/80" />
              <p className="text-white/90 text-lg font-medium">
                Organized by {organizer}
              </p>
            </div>

            {/* Event details */}
            <div className="flex flex-wrap items-center gap-4 text-white/80">
              {date && (
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{formatDate(date)}</span>
                </div>
              )}
              
              {location && (
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{location}</span>
                </div>
              )}
            </div>

            {/* Progress bar for attendance */}
            {typeof whitelisted === "number" && typeof maxAttendees === "number" && maxAttendees > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between text-white/90 text-sm mb-2">
                  <span>Attendance</span>
                  <span>{Math.round((whitelisted / maxAttendees) * 100)}%</span>
                </div>
                <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      status === 'ended' || status === 'canceled'
                        ? 'bg-gray-400'
                        : (whitelisted / maxAttendees) > 0.8
                          ? 'bg-red-400'
                          : (whitelisted / maxAttendees) > 0.5
                            ? 'bg-yellow-400'
                            : 'bg-green-400'
                    }`}
                    style={{ width: `${Math.min((whitelisted / maxAttendees) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventHero;