// src/components/StatusCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Ban, Award, UserCheck, Loader2, Play, Calendar, AlertTriangle } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { Event } from '../types';

// Sub-komponen untuk menampilkan countdown timer (TETAP SAMA)
interface CountdownTimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => (
  <div className="grid grid-cols-4 gap-3 mb-6">
    {Object.entries(timeLeft).map(([unit, value]) => (
      <div key={unit} className="flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-sm border border-blue-100 w-full px-3 py-4 flex flex-col items-center justify-center">
          <div className="text-2xl font-bold text-blue-600">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-xs font-medium text-blue-500 tracking-wide uppercase">{unit}</div>
        </div>
      </div>
    ))}
  </div>
);

// Prop interface untuk komponen utama StatusCard
interface StatusCardProps {
  event: Event;
  isWhitelisted?: boolean; // Dijadikan opsional jika tidak selalu tersedia
  isAttended?: boolean;    // BARU: Menandakan apakah user hadir
  onCancelWhitelist?: () => void; // Callback untuk handle pembatalan whitelist
  isCancellingWhitelist?: boolean; // Status pembatalan whitelist.
  userRole?: string | null;
}

const StatusCard: React.FC<StatusCardProps> = ({
  event,
  isWhitelisted,
  isAttended,
  onCancelWhitelist,
  isCancellingWhitelist,
  userRole,
}) => {
  const { isTimeUp, ...timeLeft } = useCountdown(event.start_date);

  // Status event yang lebih deskriptif
  let currentEventState: 'upcoming' | 'ongoing' | 'minting' | 'ended' | 'canceled' = event.status as 'upcoming' | 'ongoing' | 'minting' | 'ended' | 'canceled';
  if (event.status === 'upcoming' && !isTimeUp) {
    currentEventState = 'upcoming';
  } else if (event.status === 'upcoming' && isTimeUp) {
    // Jika status masih 'upcoming' tapi waktu sudah lewat, anggap 'ongoing' jika belum diupdate backend
    // Atau bisa jadi 'ended' jika durasinya sangat singkat.
    // Untuk amannya, kita bisa asumsikan ini perlu update dari backend atau jadi 'ended' jika end_date juga lewat.
    // Jika end_date juga sudah lewat, maka 'ended'
    if (new Date() > new Date(event.end_date)) {
        currentEventState = 'ended';
    } else {
        currentEventState = 'ongoing'; // Asumsi akan segera jadi ongoing
    }
  }

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'upcoming':
        return {
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          textColor: 'text-blue-800',
          icon: <Clock className="h-5 w-5" />,
          title: 'Event Starts In'
        };
      case 'ongoing':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: <Play className="h-5 w-5" />,
          title: 'Event is Live!'
        };
      case 'minting':
        return {
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200',
          textColor: 'text-purple-800',
          icon: <Award className="h-5 w-5" />,
          title: 'Certificate Minting Open'
        };
      case 'ended':
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <CheckCircle className="h-5 w-5" />,
          title: 'Event Concluded'
        };
      case 'canceled':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: <Ban className="h-5 w-5" />,
          title: 'Event Canceled'
        };
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: <Calendar className="h-5 w-5" />,
          title: 'Event Status'
        };
    }
  };

  // Helper untuk render tombol aksi utama
  const renderPrimaryAction = () => {
    // 1. Vendor tidak bisa ikut
    if (userRole === 'vendors') {
      return (
        <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 py-4 px-4 rounded-xl font-medium text-center text-sm flex items-center justify-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Vendors manage events, not participate
        </div>
      );
    }

    // 2. Event dibatalkan
    if (currentEventState === 'canceled') {
      return (
        <div className="w-full bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 text-red-700 py-4 px-4 rounded-xl font-medium text-center text-sm flex items-center justify-center">
          <Ban className="h-5 w-5 mr-2" />
          Event Canceled
        </div>
      );
    }

    // 3. Event sedang berlangsung (ongoing)
    if (currentEventState === 'ongoing') {
      return isWhitelisted ? (
        <Link
          to={`/user/dashboard`} // Pastikan path ini benar
          className="w-full inline-block bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white py-4 px-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 text-base shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <Play className="h-5 w-5" />
            <span>Attend Event Now</span>
          </div>
        </Link>
      ) : (
        <Link
          to={`/whitelist/${event.id}`} // Atau ke halaman detail event jika whitelist sudah ditutup
          className="w-full inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 text-base shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Join Whitelist to Attend</span>
          </div>
        </Link>
      );
    }

    // 4. Event akan datang (upcoming)
    if (currentEventState === 'upcoming') {
      return isWhitelisted ? (
        <div className="text-center space-y-3">
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 text-green-700 py-4 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 text-sm">
            <CheckCircle className="h-5 w-5" />
            <span>You're on the Whitelist!</span>
          </div>
          {onCancelWhitelist && ( // Hanya tampilkan jika callback ada
            <button
              onClick={onCancelWhitelist}
              disabled={isCancellingWhitelist}
              className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-red-50 to-pink-50 hover:from-red-100 hover:to-pink-100 text-red-600 py-3 px-4 rounded-xl font-medium transition-all text-sm disabled:opacity-70 border border-red-200"
            >
              {isCancellingWhitelist ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <span>{isCancellingWhitelist ? 'Cancelling...' : 'Leave Whitelist'}</span>
            </button>
          )}
        </div>
      ) : (
        <Link
          to={`/whitelist/${event.id}`} // Pastikan path ini benar
          className="w-full inline-block bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 px-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 text-base shadow-lg"
        >
          <div className="flex items-center justify-center space-x-2">
            <UserCheck className="h-5 w-5" />
            <span>Join Whitelist</span>
          </div>
        </Link>
      );
    }

    // 5. Periode Minting
    if (currentEventState === 'minting') {
      if (isAttended) { // User hadir
        return (
          <Link
            to={`/mint/${event.id}`} // Pastikan path ini benar
            className="w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-4 rounded-xl font-semibold text-center transition-all transform hover:scale-105 text-base shadow-lg"
          >
            <Award className="h-5 w-5" />
            <span>Mint Your Certificate</span>
          </Link>
        );
      } else { // User tidak hadir atau status kehadiran tidak diketahui
        return (
          <div className="w-full bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 text-yellow-800 py-4 px-4 rounded-xl font-medium text-center text-sm flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            Certificate minting is active, but attendance record not found
          </div>
        );
      }
    }
    
    // 6. Event sudah berakhir (ended)
    if (currentEventState === 'ended') {
      return (
        <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 text-gray-700 py-4 px-4 rounded-xl font-medium text-center text-sm flex items-center justify-center">
          <CheckCircle className="h-5 w-5 mr-2" />
          Event Has Ended
        </div>
      );
    }

    return null; // Fallback jika tidak ada kondisi yang cocok
  };

  const statusConfig = getStatusConfig(currentEventState);

  // Tampilan utama berdasarkan state event
  if (currentEventState === 'upcoming' && !isTimeUp) {
    return (
      <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-2xl p-6 shadow-sm`}>
        <h3 className={`text-lg font-bold ${statusConfig.textColor} mb-4 flex items-center justify-center`}>
          {statusConfig.icon}
          <span className="ml-2">{statusConfig.title}</span>
        </h3>
        <CountdownTimer timeLeft={timeLeft} />
        {renderPrimaryAction()}
      </div>
    );
  }

  // Tampilan jika event sudah lewat waktu mulainya ATAU sudah selesai/dibatalkan
  // Kita bisa membuat judul yang lebih dinamis di sini
  let cardDescription = "";

  if (currentEventState === 'ongoing') {
    cardDescription = "Join now to participate in this exciting event.";
  } else if (currentEventState === 'minting') {
    cardDescription = "If you attended, you can now mint your certificate.";
  } else if (currentEventState === 'ended') {
    cardDescription = "This event has finished. Thank you for participating.";
  } else if (currentEventState === 'canceled') {
    cardDescription = "This event will no longer take place.";
  }

  return (
    <div className={`${statusConfig.bgColor} border ${statusConfig.borderColor} rounded-2xl p-6 shadow-sm`}>
      <h3 className={`text-lg font-bold ${statusConfig.textColor} mb-3 text-center flex items-center justify-center`}>
        {statusConfig.icon}
        <span className="ml-2">{statusConfig.title}</span>
      </h3>
      {cardDescription && (
        <p className={`text-sm ${statusConfig.textColor} mb-6 text-center opacity-80`}>
          {cardDescription}
        </p>
      )}
      <div className="mt-4">
        {renderPrimaryAction()}
      </div>
    </div>
  );
};

export default StatusCard;