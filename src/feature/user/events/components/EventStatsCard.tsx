// src/components/event/EventStatsCard.tsx
import React from 'react';

// 1. Define the interface for the component's props
interface EventStatsCardProps {
  attendees: number;
  maxAttendees: number;
}

// 2. Use the interface with React.FC to type the component
const EventStatsCard: React.FC<EventStatsCardProps> = ({ attendees, maxAttendees }) => {
  const registrationPercentage = maxAttendees > 0 ? Math.round((attendees / maxAttendees) * 100) : 0;
  
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
      <div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Registration</span>
          <span className="font-semibold">{registrationPercentage}%</span>
        </div>
        <div className="bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${registrationPercentage}%` }}
          ></div>
        </div>
      </div>
      <div className="pt-4 mt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600 space-y-1">
          <p><span className="font-semibold">{attendees}</span> registered</p>
          <p><span className="font-semibold">{maxAttendees - attendees}</span> spots remaining</p>
        </div>
      </div>
    </div>
  );
};

export default EventStatsCard;