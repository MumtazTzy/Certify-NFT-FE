import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, XCircle, CheckCircle } from 'lucide-react';
import { Event } from '../services/EventServices'; // Pastikan path ini benar

interface Props {
  event: Event;
}

export default function EventCard({ event }: Props) {
  // 1. Variabel baru untuk mengontrol status non-aktif.
  // Kartu dinonaktifkan jika statusnya 'canceled' ATAU 'ended'.
  const isCardDisabled = event.status === 'canceled' || event.status === 'ended';

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
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'ongoing': return <span className="relative flex h-3 w-3 items-center justify-center"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>;
      case 'minting': return <Sparkles className="h-4 w-4" />;
      case 'canceled': return <XCircle className="h-4 w-4" />;
      case 'ended': return <CheckCircle className="h-4 w-4" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };
  
  // 2. Fungsi getButtonProps diperbarui.
  // 'ended' dan 'canceled' sekarang berbagi logika yang sama.
  const getButtonProps = (status: Event['status']) => {
    switch (status) {
      case 'upcoming':
        return { text: 'View Details', className: 'bg-blue-600 hover:bg-blue-700 text-white group-hover:transform group-hover:scale-105', icon: <ArrowRight className="h-5 w-5" /> };
      case 'ongoing':
        return { text: 'Join Event', className: 'bg-green-600 hover:bg-green-700 text-white animate-pulse group-hover:transform group-hover:scale-105', icon: <ArrowRight className="h-5 w-5" /> };
      case 'minting':
        return { text: 'Mint Now', className: 'bg-purple-600 hover:bg-purple-700 text-white group-hover:transform group-hover:scale-105', icon: <Sparkles className="h-4 w-4" /> };
      
      // Menggunakan fall-through untuk menggabungkan case 'ended' dan 'canceled'
      case 'ended':
      case 'canceled':
        return {
          text: status === 'ended' ? 'Event Ended' : 'Event Canceled',
          className: 'bg-gray-400 text-gray-700 pointer-events-none',
          icon: null
        };
      
      default:
        return { text: 'Loading...', className: 'bg-gray-300 text-gray-500 pointer-events-none', icon: null };
    }
  };

  const buttonProps = getButtonProps(event.status);
  // Logika isLinkDisabled sekarang menggunakan variabel isCardDisabled
  const isLinkDisabled = !event.id || isCardDisabled;

  return (
    // 3. Kontainer utama sekarang menggunakan isCardDisabled
    <div className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 flex flex-col h-full ${isCardDisabled ? 'opacity-60 cursor-not-allowed select-none' : 'group hover:shadow-xl'}`}>
      <div className="relative h-44 sm:h-48 md:h-56 overflow-hidden">
        {event.image ? <img src={event.image} alt={event.title || "Event image"} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <div className="w-full h-full bg-gray-100 flex items-center justify-center"><span className="text-gray-400">No image available</span></div>}
        <div className="absolute top-3 left-3"><span className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>{getStatusIcon(event.status)}<span className="capitalize">{event.status || "Loading..."}</span></span></div>
      </div>
      <div className="flex flex-col flex-1 p-4 md:p-6">
        {/* Efek hover pada judul juga dinonaktifkan berdasarkan isCardDisabled */}
        <h3 className={`text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2 line-clamp-2 transition-colors ${!isCardDisabled && 'group-hover:text-blue-600'}`}>{event.title || <span className="inline-block bg-gray-200 rounded w-1/2 h-5"></span>}</h3>
        
        {/* Detail lainnya... */}
        <p className="text-gray-600 mb-1 text-sm min-h-[1.5rem]"><span className="font-semibold">Organizer: </span>{event.organizer || <span className="inline-block bg-gray-100 rounded w-3/4 h-4"></span>}</p>
        <p className="text-gray-600 mb-3 md:mb-4 text-sm leading-relaxed line-clamp-2 min-h-[2.5rem]">{event.description || <span className="inline-block bg-gray-100 rounded w-3/4 h-4"></span>}</p>
        <div className="space-y-1.5 md:space-y-2 mb-3 md:mb-4"><div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]"><Calendar className="h-4 w-4" /><span>{event.date ? new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : <span className="inline-block bg-gray-100 rounded w-20 h-4"></span>}</span></div><div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]"><MapPin className="h-4 w-4" /><span className="truncate">{event.location || <span className="inline-block bg-gray-100 rounded w-16 h-4"></span>}</span></div><div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600 min-h-[1.25rem]"><Users className="h-4 w-4" /><span>{typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" ? `${event.whitelisted}/${event.maxAttendees} attendees` : <span className="inline-block bg-gray-100 rounded w-14 h-4"></span>}</span></div></div>
        
        <div className="mb-3 md:mb-4">
          <div className="bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${isCardDisabled ? 'bg-gray-500' : 'bg-blue-600'}`}
              style={{ width: isCardDisabled ? "100%" : typeof event.whitelisted === "number" && typeof event.maxAttendees === "number" && event.maxAttendees > 0 ? `${Math.min((event.whitelisted / event.maxAttendees) * 100, 100)}%` : "0%" }}
            ></div>
          </div>
        </div>

        <div className="mt-auto">
          <Link
            to={isLinkDisabled ? "#" : `/events/${event.id}`}
            className={`w-full py-2.5 md:py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 ${buttonProps.className}`}
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