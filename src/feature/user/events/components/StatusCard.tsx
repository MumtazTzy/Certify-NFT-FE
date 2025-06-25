// src/components/StatusCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { Event } from '../types';

// Sub-komponen untuk menampilkan countdown timer
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
    isWhitelisted: boolean;
    onCancel: () => void; // Callback untuk handle pembatalan
    isCancelling: boolean; // Status pembatalan.
    userRole?: string | null; // <-- Tambahkan prop role
}

const StatusCard: React.FC<StatusCardProps> = ({ event, isWhitelisted, onCancel, userRole }) => {
    const { isTimeUp, ...timeLeft } = useCountdown(event.start_date);
    const isUpcoming = !isTimeUp && event.status !== 'ended';

    // Helper untuk render tombol aksi
    const renderAction = () => {
        if (userRole === 'vendors') {
            return (
                <div className="w-full bg-yellow-100 text-yellow-800 py-3 px-4 rounded-lg font-semibold text-center mt-2">
                    You are a vendor and cannot participate any event.
                </div>
            );
        }
        if (isUpcoming) {
            return isWhitelisted ? (
                <div className="text-center space-y-3">
                    <div className="bg-green-100 text-green-800 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2">
                        <CheckCircle className="h-5 w-5" />
                        <span>You're on the Whitelist!</span>
                    </div>
                    <button
                        onClick={onCancel}
                        className="w-full inline-flex items-center justify-center space-x-2 bg-red-100 hover:bg-red-200 text-red-700 py-2 px-4 rounded-lg font-semibold transition-colors text-sm"
                    >
                        <XCircle className="h-4 w-4" />
                        <span>Leave Whitelist</span>
                    </button>
                </div>
            ) : (
                <Link
                    to={`/whitelist/${event.id}`}
                    className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-semibold text-center transition-all transform hover:scale-105"
                >
                    Join Whitelist
                </Link>
            );
        }
        // Event sudah selesai
        if (event.status === 'ended') {
            return (
                <>
                    <Link
                        to={`/mint/${event.id}`}
                        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-semibold text-center block transition-all"
                    >
                        Mint Certificate
                    </Link>
                    <button
                        disabled
                        className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed mt-2"
                    >
                        Event Closed
                    </button>
                </>
            );
        }
        return null;
    };

    if (isUpcoming) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-6 flex items-center justify-center">
                    <Clock className="h-5 w-5 mr-2" />
                    Event Starts In
                </h3>
                <CountdownTimer timeLeft={timeLeft} />
                {renderAction()}
            </div>
        );
    }

    // Tampilan jika event sudah SELESAI
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                Event Completed
            </h3>
            <p className="text-gray-700 mb-4 text-center">
                This event has already ended.
            </p>
            {renderAction()}
        </div>
    );
};

export default StatusCard;