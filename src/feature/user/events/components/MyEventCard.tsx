import { Link } from 'react-router-dom';
// ✅ Impor semua ikon yang dibutuhkan oleh KEDUA jenis badge
import { 
  Calendar, MapPin, ArrowRight, Sparkles, XCircle, CheckCircle, 
  Clock, Award, CheckSquare, XSquare 
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
      case 'upcoming': return { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: <Calendar className="h-4 w-4" /> };
      case 'ongoing': return { color: 'bg-green-100 text-green-800 border-green-200', icon: <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span> };
      case 'minting': return { color: 'bg-purple-100 text-purple-800 border-purple-200', icon: <Sparkles className="h-4 w-4" /> };
      case 'canceled': return { color: 'bg-red-100 text-red-800 border-red-200', icon: <XCircle className="h-4 w-4" /> };
      case 'ended': return { color: 'bg-gray-200 text-gray-700 border-gray-300', icon: <CheckCircle className="h-4 w-4" /> };
      default: return { color: 'bg-gray-200 text-gray-700 border-gray-300', icon: <div className="h-4 w-4 bg-gray-400 rounded-full"></div> };
    }
  };

  const { color, icon } = getStatusInfo();

  return (
    <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${color}`}>
      {icon}
      <span className="capitalize">{status}</span>
    </span>
  );
};

/**
 * @description Menampilkan badge status partisipasi PENGGUNA di sebuah event.
 */
const UserStatusBadge = ({ status }: { status: Event['user_status'] }) => {
  if (!status) return null; // Tidak akan render jika status pengguna tidak ada

  const statusInfo = {
    present: { text: 'Present', icon: <CheckSquare className="w-4 h-4" />, color: 'bg-green-100 text-green-800 border border-green-200' },
    registered: { text: 'Registered', icon: <Clock className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800 border border-blue-200' },
    absent: { text: 'Absent', icon: <XSquare className="w-4 h-4" />, color: 'bg-red-100 text-red-800 border border-red-200' },
    claimed: { text: 'Claimed', icon: <Award className="w-4 h-4" />, color: 'bg-purple-100 text-purple-800 border border-purple-200' },
  };

  const currentStatus = statusInfo[status] || { text: status, icon: null, color: 'text-gray-700 bg-gray-100' };

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${currentStatus.color}`}>
      {currentStatus.icon}
      <span>{currentStatus.text}</span>
    </span>
  );
};

// --- Komponen Utama ---

export default function EventCard({ event }: EventCardProps) {
  const API_IMAGE_BASE_URL = 'https://api.gpadaka.com/'; // Disesuaikan
  const imageUrl = event.picture ? `${API_IMAGE_BASE_URL}/${event.picture}` : 'https://placehold.co/600x400/e2e8f0/cccccc?text=Event+Image';

  const attendeesPercentage = typeof event.attendees === "number" && event.maxattendees > 0
    ? Math.min((event.attendees / event.maxattendees) * 100, 100) : 0;
    
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-video overflow-hidden">
        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        
        {/* ✅ FIX: Container untuk KEDUA badge di atas gambar */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2">
          <div className="bg-white/70 backdrop-blur-sm p-0.5 rounded-full">
            <EventStatusBadge status={event.status} />
          </div>
          {/* Badge ini hanya akan muncul jika `event.user_status` ada */}
          {event.user_status && (
            <div className="bg-white/70 backdrop-blur-sm p-0.5 rounded-full">
              <UserStatusBadge status={event.user_status} />
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">{event.title}</h3>
        
        {/* ❌ FIX: UserStatusBadge tidak lagi ditampilkan di sini */}
        
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow">{event.description}</p>
        
        <div className="space-y-3 mb-4 text-sm text-gray-700 border-t pt-4">
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" /><span>{new Date(event.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
          <div className="flex items-center"><MapPin className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" /><span className="truncate">{event.location}</span></div>
        </div>

        <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Attendees</span>
                <span>{event.attendees} / {event.maxattendees > 0 ? event.maxattendees : '∞'}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 w-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${attendeesPercentage}%` }}></div>
            </div>
        </div>
        
        <div className="mt-auto">
          <Link to={`/events/${event.id}`} className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 group-hover:gap-3">
            <span>View Details</span>
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}