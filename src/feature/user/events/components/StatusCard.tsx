// src/components/StatusCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Ban, Award, UserCheck, Loader2 } from 'lucide-react'; // Menambahkan Ban, Award, UserCheck, Loader2
import { useCountdown } from '../hooks/useCountdown'; // Asumsi path hook benar
import { Event } from '../types'; // Asumsi path tipe benar

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
  <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-6"> {/* Mengurangi gap dan mb */}
    {Object.entries(timeLeft).map(([unit, value]) => (
      <div key={unit} className="flex flex-col items-center">
        <div className="bg-white rounded-xl shadow-md border border-blue-100 w-full px-2 py-3 sm:px-4 sm:py-4 flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-xs font-semibold text-blue-500 tracking-wide uppercase">{unit}</div> {/* Warna teks unit disesuaikan */}
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
  let currentEventState: 'upcoming' | 'ongoing' | 'minting' | 'ended' | 'canceled' = event.status;
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


  // Helper untuk render tombol aksi utama
  const renderPrimaryAction = () => {
    // 1. Vendor tidak bisa ikut
    if (userRole === 'vendors') {
      return (
        <div className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg font-semibold text-center mt-2 text-sm flex items-center justify-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Vendors manage events, not participate.
        </div>
      );
    }

    // 2. Event dibatalkan
    if (currentEventState === 'canceled') {
      return (
        <div className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg font-semibold text-center mt-2 text-sm flex items-center justify-center">
          <Ban className="h-5 w-5 mr-2" />
          Event Canceled
        </div>
      );
    }

    // 3. Event sedang berlangsung (ongoing)
    if (currentEventState === 'ongoing') {
      return isWhitelisted ? (
        <Link
          to={`/attend/${event.id}`} // Pastikan path ini benar
          className="w-full inline-block bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105 text-base"
        >
          Join Event Now
        </Link>
      ) : (
        <Link
            to={`/whitelist/${event.id}`} // Atau ke halaman detail event jika whitelist sudah ditutup
            className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105 text-base"
        >
            Join Whitelist to Attend
        </Link>
      );
    }

    // 4. Event akan datang (upcoming)
    if (currentEventState === 'upcoming') {
      return isWhitelisted ? (
        <div className="text-center space-y-2">
          <div className="bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2 text-sm">
            <CheckCircle className="h-5 w-5" />
            <span>You're on the Whitelist!</span>
          </div>
          {onCancelWhitelist && ( // Hanya tampilkan jika callback ada
            <button
              onClick={onCancelWhitelist}
              disabled={isCancellingWhitelist}
              className="w-full inline-flex items-center justify-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 py-2.5 px-4 rounded-lg font-medium transition-colors text-sm disabled:opacity-70"
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
          className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105 text-base"
        >
          Join Whitelist
        </Link>
      );
    }

    // 5. Periode Minting
    if (currentEventState === 'minting') {
      if (isAttended) { // User hadir
        return (
          <Link
            to={`/mint/${event.id}`} // Pastikan path ini benar
            className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105 text-base"
          >
            <Award className="h-5 w-5" />
            <span>Mint Your Certificate</span>
          </Link>
        );
      } else { // User tidak hadir atau status kehadiran tidak diketahui
        return (
          <div className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg font-semibold text-center mt-2 text-sm">
            Certificate minting is active, but attendance record not found.
          </div>
        );
      }
    }
    
    // 6. Event sudah berakhir (ended)
    if (currentEventState === 'ended') {
      return (
        <div className="w-full bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold text-center mt-2 text-sm">
          Event Has Ended
        </div>
      );
    }

    return null; // Fallback jika tidak ada kondisi yang cocok
  };

  // Tampilan utama berdasarkan state event
  if (currentEventState === 'upcoming' && !isTimeUp) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 sm:p-6 shadow-lg">
        <h3 className="text-base sm:text-lg font-semibold text-blue-800 mb-2 sm:mb-4 flex items-center justify-center">
          <Clock className="h-5 w-5 mr-2" />
          Event Starts In
        </h3>
        <CountdownTimer timeLeft={timeLeft} />
        {renderPrimaryAction()}
      </div>
    );
  }

  // Tampilan jika event sudah lewat waktu mulainya ATAU sudah selesai/dibatalkan
  // Kita bisa membuat judul yang lebih dinamis di sini
  let cardTitle = "Event Status";
  let cardDescription = "";

  if (currentEventState === 'ongoing') {
    cardTitle = "Event is Live!";
    cardDescription = "Join now to participate.";
  } else if (currentEventState === 'minting') {
    cardTitle = "Certificate Minting Open";
    cardDescription = "If you attended, you can now mint your certificate.";
  } else if (currentEventState === 'ended') {
    cardTitle = "Event Concluded";
    cardDescription = "This event has finished.";
  } else if (currentEventState === 'canceled') {
    cardTitle = "Event Canceled";
    cardDescription = "This event will no longer take place.";
  }


  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 shadow-lg">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 text-center">
        {cardTitle}
      </h3>
      {cardDescription && (
        <p className="text-sm text-gray-600 mb-4 text-center">
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