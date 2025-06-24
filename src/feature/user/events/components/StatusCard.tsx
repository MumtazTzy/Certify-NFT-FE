// src/components/StatusCard.tsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown'; // Pastikan path ini benar
import { Event } from '../types'; // Pastikan path ini benar

// Sub-komponen untuk menampilkan countdown timer, dipisahkan agar rapi
interface CountdownTimerProps {
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => (
  <div className="grid grid-cols-4 gap-3 mb-8">
    {Object.entries(timeLeft).map(([unit, value]) => (
      <div key={unit} className="flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 w-full px-4 py-4 flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{String(value).padStart(2, '0')}</div>
          <div className="mt-1 text-wrap text-xs font-semibold text-blue-700 tracking-wide uppercase">{unit}</div>
        </div>
      </div>
    ))}
  </div>
);

// Prop interface untuk komponen utama StatusCard
interface StatusCardProps {
    event: Event;
    isWhitelisted: boolean; // Prop baru untuk status whitelist
}

const StatusCard: React.FC<StatusCardProps> = ({ event, isWhitelisted }) => {
    // Gunakan custom hook untuk menghitung waktu mundur
    const { isTimeUp, ...timeLeft } = useCountdown(event.start_date);

    // Event dianggap 'upcoming' jika waktu belum habis DAN status dari API bukan 'completed'
    const isUpcoming = !isTimeUp && event.status !== 'completed';

    // --- RENDER LOGIC ---

    // 1. Tampilan jika event masih AKAN DATANG
    if (isUpcoming) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-6 flex items-center justify-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Event Starts In
                </h3>
                
                <CountdownTimer timeLeft={timeLeft} />

                {/* Logika Dinamis untuk Tombol Whitelist */}
                {isWhitelisted ? (
                    // Tampilan jika pengguna SUDAH terdaftar di whitelist
                    <div className="text-center">
                        <div className="bg-green-100 text-green-800 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
                            <CheckCircle className="h-5 w-5" />
                            <span>You're on the Whitelist!</span>
                        </div>
                        <p className="text-xs text-green-700 mt-2">You are eligible to receive the certificate.</p>
                    </div>
                ) : (
                    // Tampilan default jika BELUM terdaftar
                    <Link
                        to={`/whitelist/${event.id}`}
                        className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105"
                    >
                        Join Whitelist
                    </Link>
                )}
            </div>
        );
    }

    // 2. Tampilan jika event sudah SELESAI
    // Ini akan menjadi fallback jika `isUpcoming` adalah false
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Event Completed
            </h3>
            <p className="text-gray-700 mb-4 text-center">
                This event has already ended.
            </p>
            <button
                disabled
                className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
                Event Closed
            </button>
        </div>
    );
};

export default StatusCard;