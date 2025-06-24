import React from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useCountdown } from '../hooks/useCountdown';
import { Event } from '../types';

interface CountdownTimerProps {
  timeLeft: { days: number; hours: number; minutes: number; seconds: number };
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ timeLeft }) => (
  <div className="grid grid-cols-4 gap-3 mb-8">
    {Object.entries(timeLeft).map(([unit, value]) => (
      <div key={unit} className="flex flex-col items-center">
        <div className="bg-white rounded-2xl shadow-md border border-blue-100 w-full px-4 py-4 flex flex-col items-center justify-center">
          <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{value}</div>
          <div className="mt-1 text-wrap text-xs font-semibold text-blue-700 tracking-wide uppercase">{unit}</div>
        </div>
      </div>
    ))}
  </div>
);

interface StatusCardProps {
  event: Event;
}

const StatusCard: React.FC<StatusCardProps> = ({ event }) => {
  const { isTimeUp, ...timeLeft } = useCountdown(event.start_date);
  const isUpcoming = !isTimeUp && event.status !== 'completed';

  if (isUpcoming) {
    return (
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-8 flex items-center justify-center">
          <Clock className="h-5 w-5 mr-2" />
          Event Starts In
        </h3>
        <CountdownTimer timeLeft={timeLeft} />
        <Link to={`/whitelist/${event.id}`} className="w-full inline-block bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-semibold text-center transition-all">
          Join Whitelist
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Completed</h3>
      <p className="text-gray-700 mb-4">This event has ended and certificate minting is now closed.</p>
      <button disabled className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed">
        Minting Closed
      </button>
    </div>
  );
};

export default StatusCard;