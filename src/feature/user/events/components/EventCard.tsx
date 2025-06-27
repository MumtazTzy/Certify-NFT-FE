import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, XCircle, CheckCircle, Clock, Award } from 'lucide-react';
import { Event } from '../services/EventServices'; // Pastikan path ini benar

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  const isCanceled = event.status === 'canceled';

  const getStatusColor = (status: Event['status']) => {
    // ... (fungsi ini tidak berubah)
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'minting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'canceled': return 'bg-red-100 text-red-800 border-red-200';
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: Event['status']) => {
    // ... (fungsi ini tidak berubah)
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'ongoing': return (
        <span className="relative flex h-3 w-3 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
      );
      case 'minting': return <Award className="h-4 w-4" />;
      case 'canceled': return <XCircle className="h-4 w-4" />;
      case 'ended': return <CheckCircle className="h-4 w-4" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };
  
  // 1. Fungsi baru untuk mendapatkan semua properti tombol berdasarkan status
  // Ini membuat kode lebih bersih dan mudah dikelola.
  const getButtonProps = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return {
          text: 'View Details',
          className: 'bg-blue-600 hover:bg-blue-700 text-white group-hover:transform group-hover:scale-105 transition-all duration-200',
          icon: <ArrowRight className="h-4 w-4" />
        };
      case 'ongoing':
        return {
          text: 'Join Event',
          className: 'bg-green-600 hover:bg-green-700 text-white group-hover:transform group-hover:scale-105 transition-all duration-200',
          icon: <ArrowRight className="h-4 w-4" />
        };
      case 'minting':
        return {
          text: 'Mint Certificate',
          className: 'bg-purple-600 hover:bg-purple-700 text-white group-hover:transform group-hover:scale-105 transition-all duration-200',
          icon: <Award className="h-4 w-4" />
        };
      case 'ended':
        return {
          text: 'Event Ended',
          className: 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200 transition-colors',
          icon: <CheckCircle className="h-4 w-4" />
        };
      case 'canceled':
        return {
          text: 'Event Canceled',
          className: 'bg-red-50 text-red-600 border border-red-200 cursor-not-allowed',
          icon: <XCircle className="h-4 w-4" />
        };
      default: // Fallback
        return {
          text: 'Loading...',
          className: 'bg-gray-300 text-gray-500 pointer-events-none',
          icon: null
        };
    }
  };

  const buttonProps = getButtonProps(event.status);
  const isLinkDisabled = !event.id || isCanceled;

  // Calculate attendance percentage
  const attendancePercentage = typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" && event.maxAttendees > 0 
    ? Math.min((event.whitelisted / event.maxAttendees) * 100, 100) 
    : 0;

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 flex flex-col h-full ${
      isCanceled ? 'opacity-60 cursor-not-allowed select-none' : 'group hover:shadow-lg hover:border-purple-200'
    }`}>
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {event.image ? (
          <img 
            src={event.image} 
            alt={event.title || "Event image"} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <div className="text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status)}
            <span className="capitalize font-medium">{event.status || "Loading..."}</span>
          </span>
        </div>

        {/* Attendance Badge */}
        {typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-sm">
              <Users className="h-3 w-3 mr-1" />
              {event.whitelisted}/{event.maxAttendees}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className={`text-lg font-bold text-gray-900 mb-2 line-clamp-2 transition-colors ${
          !isCanceled && 'group-hover:text-purple-700'
        }`}>
          {event.title || <span className="inline-block bg-gray-200 rounded w-3/4 h-5 animate-pulse"></span>}
        </h3>

        {/* Organizer */}
        <p className="text-gray-600 mb-3 text-sm">
          <span className="font-medium text-gray-700">Organizer: </span>
          {event.organizer || <span className="inline-block bg-gray-100 rounded w-1/2 h-4 animate-pulse"></span>}
        </p>

        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">
          {event.description || <span className="inline-block bg-gray-100 rounded w-full h-4 animate-pulse"></span>}
        </p>

        {/* Event Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {event.date ? (
                new Date(event.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })
              ) : (
                <span className="inline-block bg-gray-100 rounded w-24 h-4 animate-pulse"></span>
              )}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">
              {event.location || <span className="inline-block bg-gray-100 rounded w-20 h-4 animate-pulse"></span>}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        {typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>Attendance</span>
              <span>{Math.round(attendancePercentage)}%</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className={`h-2 rounded-full transition-all duration-500 ${
                  isCanceled || event.status === 'ended' 
                    ? 'bg-gray-400' 
                    : attendancePercentage > 80 
                      ? 'bg-red-500' 
                      : attendancePercentage > 50 
                        ? 'bg-yellow-500' 
                        : 'bg-green-500'
                }`}
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="mt-auto">
          <Link
            to={isLinkDisabled ? "#" : `/events/${event.id}`}
            className={`w-full py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center space-x-2 ${
              buttonProps.className
            }`}
            tabIndex={isLinkDisabled ? -1 : 0}
            aria-disabled={isLinkDisabled}
            onClick={(e) => isLinkDisabled && e.preventDefault()}
          >
            <span>{buttonProps.text}</span>
            {buttonProps.icon}
          </Link>
        </div>
      </div>
    </div>
  );
}