import { Link } from 'react-router-dom';
// ✅ Impor semua ikon yang dibutuhkan oleh KEDUA jenis badge
import { 
  Calendar, MapPin, ArrowRight, XCircle, CheckCircle, 
  Clock, Award, CheckSquare, XSquare, Users, Play
} from 'lucide-react';
// ✅ Asumsikan path impor ini benar
import { Event } from '../services/MyeventServices'; 

interface EventCardProps {
  event: Event;
}

// --- Helper Components untuk Badges (sekarang keduanya di dalam file ini) ---

/**
 * @description Menampilkan badge status umum sebuah event (mis. Upcoming, Ended).
 */
const EventStatusBadge = ({ status }: { status: Event['status'] }) => {
  const getStatusInfo = () => {
    switch (status) {
      case 'upcoming': return { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        icon: <Clock className="h-4 w-4" /> 
      };
      case 'ongoing': return { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        icon: <Play className="h-4 w-4" /> 
      };
      case 'minting': return { 
        color: 'bg-purple-100 text-purple-800 border-purple-200', 
        icon: <Award className="h-4 w-4" /> 
      };
      case 'canceled': return { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        icon: <XCircle className="h-4 w-4" /> 
      };
      case 'ended': return { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <CheckCircle className="h-4 w-4" /> 
      };
      default: return { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        icon: <div className="h-4 w-4 bg-gray-400 rounded-full"></div> 
      };
    }
  };

  const { color, icon } = getStatusInfo();

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium border shadow-sm ${color}`}>
      {icon}
      <span className="capitalize font-medium">{status}</span>
    </span>
  );
};

/**
 * @description Menampilkan badge status partisipasi PENGGUNA di sebuah event.
 */
const UserStatusBadge = ({ status }: { status: Event['user_status'] }) => {
  if (!status) return null;

  const statusInfo: Record<string, { text: string; icon: JSX.Element; color: string }> = {
    present: { 
      text: 'Present', 
      icon: <CheckSquare className="w-4 h-4" />, 
      color: 'bg-green-100 text-green-800 border border-green-200' 
    },
    registered: { 
      text: 'Registered', 
      icon: <Clock className="w-4 h-4" />, 
      color: 'bg-blue-100 text-blue-800 border border-blue-200' 
    },
    absent: { 
      text: 'Absent', 
      icon: <XSquare className="w-4 h-4" />, 
      color: 'bg-red-100 text-red-800 border border-red-200' 
    },
    claimed: { 
      text: 'Claimed', 
      icon: <Award className="w-4 h-4" />, 
      color: 'bg-purple-100 text-purple-800 border border-purple-200' 
    },
  };

  const currentStatus = statusInfo[status] || { 
    text: status, 
    icon: <div className="w-4 h-4" />, 
    color: 'text-gray-700 bg-gray-100 border border-gray-200' 
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium shadow-sm ${currentStatus.color}`}>
      {currentStatus.icon}
      <span className="font-medium">{currentStatus.text}</span>
    </span>
  );
};

// --- Komponen Utama ---

export default function EventCard({ event }: EventCardProps) {
  // Handle optional properties with fallbacks
  const imageUrl = (event as any).picture ? `${(event as any).picture}` : null;
  const attendees = (event as any).attendees || 0;
  const maxAttendees = (event as any).maxattendees || 0;
  
  const attendeesPercentage = maxAttendees > 0
    ? Math.min((attendees / maxAttendees) * 100, 100) : 0;
    
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-300 group flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={event.title} 
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
        
        {/* Status Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <div className="bg-white/90 backdrop-blur-sm p-0.5 rounded-full shadow-sm">
            <EventStatusBadge status={event.status} />
          </div>
          {event.user_status && (
            <div className="bg-white/90 backdrop-blur-sm p-0.5 rounded-full shadow-sm">
              <UserStatusBadge status={event.user_status} />
            </div>
          )}
        </div>

        {/* Attendance Badge */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-gray-700 border border-gray-200 shadow-sm">
            <Users className="h-3 w-3 mr-1" />
            {attendees}/{maxAttendees > 0 ? maxAttendees : '∞'}
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="flex flex-col flex-1 p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors line-clamp-2">
          {event.title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow">
          {event.description}
        </p>
        
        {/* Event Details */}
        <div className="space-y-2 mb-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span>
              {new Date(event.start_date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="truncate">{event.location}</span>
          </div>
        </div>

        {/* Attendance Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
            <span>Attendance</span>
            <span>{Math.round(attendeesPercentage)}%</span>
          </div>
          <div className="bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${
                event.status === 'ended' || event.status === 'canceled'
                  ? 'bg-gray-400'
                  : attendeesPercentage > 80
                    ? 'bg-red-500'
                    : attendeesPercentage > 50
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
              }`}
              style={{ width: `${attendeesPercentage}%` }}
            ></div>
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-auto">
          <Link 
            to={`/events/${event.id}`} 
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 group-hover:transform group-hover:scale-105 shadow-lg"
          >
            <span>View Details</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}