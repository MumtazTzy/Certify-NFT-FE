import React from 'react';
import { Calendar, MapPin, Users, Award } from 'lucide-react';

interface EventInfoCardProps {
  date: string;
  location: string;
  attendees: number;
  maxAttendees: number;
}

const EventInfoCard: React.FC<EventInfoCardProps> = ({ date, location, attendees, maxAttendees }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex items-center space-x-3">
        <Calendar className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-900">Date</p>
          <p className="text-gray-600">
            {new Date(date).toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <MapPin className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-900">Location</p>
          <p className="text-gray-600">{location}</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Users className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-900">Attendees</p>
          <p className="text-gray-600">{attendees}/{maxAttendees} registered</p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <Award className="h-5 w-5 text-blue-600" />
        <div>
          <p className="font-semibold text-gray-900">Certificate</p>
          <p className="text-gray-600">NFT Certificate included</p>
        </div>
      </div>
    </div>
  </div>
);

export default EventInfoCard;