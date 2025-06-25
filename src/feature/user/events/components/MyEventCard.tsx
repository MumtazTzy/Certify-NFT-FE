import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, ArrowRight, Sparkles, XCircle, CheckCircle } from 'lucide-react';
import { Event } from '../services/MyeventServices';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  // Fungsi helper tidak berubah, sudah baik.
  const getStatusColor = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ongoing': return 'bg-green-100 text-green-800 border-green-200';
      case 'minting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'ended': return 'bg-gray-200 text-gray-700 border-gray-300';
      default: return 'bg-gray-200 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: Event['status']) => {
    switch (status) {
      case 'upcoming': return <Calendar className="h-4 w-4" />;
      case 'ongoing': return (
        <span className="relative flex h-3 w-3"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span></span>
      );
      case 'minting': return <Sparkles className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'ended': return <CheckCircle className="h-4 w-4" />;
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const API_IMAGE_BASE_URL = 'https://api.gpadaka.com/'; // ✅ Pastikan base URL benar
  const imageUrl = event.picture ? `${API_IMAGE_BASE_URL}/${event.picture}` : 'https://placehold.co/600x400/e2e8f0/cccccc?text=Event+Image';

  // ✅ UX IMPROVEMENT: Menghitung persentase untuk progress bar
  const attendeesPercentage = typeof event.attendees === "number" && event.maxattendees > 0
    ? Math.min((event.attendees / event.maxattendees) * 100, 100)
    : 0;

  return (
    // ✅ UI/UX IMPROVEMENT: Menggunakan `rounded-b-2xl` agar bisa menyatu dengan badge status di atasnya.
    <div className="bg-white rounded-b-2xl shadow-lg hover:shadow-2xl transition-all duration-300 group flex flex-col h-full">
      {/* Gambar dengan rasio aspek yang konsisten */}
      <div className="relative aspect-video overflow-hidden">
        <img src={imageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        <div className="absolute top-3 left-3 bg-white/70 backdrop-blur-sm p-1 rounded-full">
          <span className={`inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)}`}>
            {getStatusIcon(event.status)}
            <span className="capitalize">{event.status}</span>
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors line-clamp-2">{event.title}</h3>
        <p className="text-gray-600 mb-4 text-sm leading-relaxed line-clamp-3 flex-grow">{event.description}</p>
        
        {/* Detail Event yang lebih rapi */}
        <div className="space-y-3 mb-4 text-sm text-gray-700 border-t pt-4">
          <div className="flex items-center"><Calendar className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" /><span>{new Date(event.start_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span></div>
          <div className="flex items-center"><MapPin className="h-4 w-4 mr-3 text-gray-500 flex-shrink-0" /><span className="truncate">{event.location}</span></div>
        </div>

        {/* Progress bar peserta yang lebih informatif */}
        <div className="space-y-2 mb-5">
            <div className="flex justify-between text-sm font-medium text-gray-600">
                <span>Attendees</span>
                <span>{event.attendees} / {event.maxattendees > 0 ? event.maxattendees : '∞'}</span>
            </div>
            <div className="bg-gray-200 rounded-full h-2.5 w-full overflow-hidden">
                <div className="bg-gradient-to-r from-purple-500 to-blue-500 h-2.5 rounded-full" style={{ width: `${attendeesPercentage}%` }}></div>
            </div>
        </div>
        
        {/* Tombol Aksi */}
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