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

  // Improved: loading/fallbacks for date, location, attendees, and layout consistency
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title || "Event image"}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center animate-pulse">
            <span className="text-gray-400">Loading image...</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status)}
            <span className="capitalize">{event.status || "Loading..."}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 md:p-6">
        <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-2 ">
          {event.title ? (
            event.title
          ) : (
            <span className="inline-block bg-gray-200 animate-pulse rounded w-1/2 h-5"></span>
          )}
        </h3>
        <p className="text-gray-600 mb-1 md:mb-1 text-sm leading-relaxed line-clamp-1 min-h-[2.5rem]">
          <span className="font-semibold">Organizer: </span>
          {event.organizer ? (
            event.organizer
          ) : (
            <span className="inline-block bg-gray-100 animate-pulse rounded w-3/4 h-4"></span>
          )}
        </p>
        <p className="text-gray-600 mb-3 md:mb-4 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {event.description ? (
            event.description
          ) : (
            <span className="inline-block bg-gray-100 animate-pulse rounded w-3/4 h-4"></span>
          )}
        </p>

        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4">
          {/* Date */}
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]">
            <Calendar className="h-4 w-4" />
            <span>
              {event.date
                ? new Date(event.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })
                : <span className="inline-block bg-gray-100 animate-pulse rounded w-20 h-4"></span>
              }
            </span>
          </div>
          {/* Location */}
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]">
            <MapPin className="h-4 w-4" />
            <span className="truncate">
              {event.location
                ? event.location
                : <span className="inline-block bg-gray-100 animate-pulse rounded w-16 h-4"></span>
              }
            </span>
          </div>
          {/* Attendees */}
          <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]">
            <Users className="h-4 w-4" />
            <span>
              {typeof event.whitelisted === "number" && typeof event.maxAttendees === "number"
                ? `${event.whitelisted}/${event.maxAttendees} attendees`
                : <span className="inline-block bg-gray-100 animate-pulse rounded w-14 h-4"></span>
              }
            </span>
          </div>
        </div>

        <div className="mb-3 md:mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{
                width:
                  typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" && event.maxAttendees > 0
                    ? `${Math.min((event.whitelisted / event.maxAttendees) * 100, 100)}%`
                    : "0%",
              }}
            ></div>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={event.id ? `/events/${event.id}` : "#"}
            className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 md:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 group-hover:transform group-hover:scale-105 ${!event.id ? "pointer-events-none opacity-50" : ""}`}
            tabIndex={event.id ? 0 : -1}
            aria-disabled={!event.id}
          >
            <span>View Details</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}