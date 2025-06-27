import React from 'react';
import { Calendar, MapPin, Users, Award, Clock, Globe, CheckCircle } from 'lucide-react';

interface EventInfoCardProps {
  date: string;
  location: string;
  Whitelisted: number;
  maxAttendees: number;
  status?: string;
  organizer?: string;
  description?: string;
}

const EventInfoCard: React.FC<EventInfoCardProps> = ({ 
  date, 
  location, 
  Whitelisted, 
  maxAttendees, 
  status,
  organizer,
  description 
}) => {
  const attendancePercentage = maxAttendees > 0 ? Math.round((Whitelisted / maxAttendees) * 100) : 0;
  
  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'upcoming': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'ongoing': return 'text-green-600 bg-green-50 border-green-200';
      case 'minting': return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'canceled': return 'text-red-600 bg-red-50 border-red-200';
      case 'ended': return 'text-gray-600 bg-gray-50 border-gray-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Event Details</h2>
        {status && (
          <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
            <span className="capitalize">{status}</span>
          </span>
        )}
      </div>

      {/* Organizer Info */}
      {organizer && (
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
          <div className="flex items-center space-x-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Organizer</p>
              <p className="text-gray-600">{organizer}</p>
            </div>
          </div>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-2">About this event</h3>
          <p className="text-gray-600 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Event Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="bg-blue-100 rounded-lg p-2">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Date & Time</p>
            <p className="text-gray-600 text-sm">{formatDate(date)}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="bg-green-100 rounded-lg p-2">
            <MapPin className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Location</p>
            <p className="text-gray-600 text-sm">{location}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="bg-purple-100 rounded-lg p-2">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Registration</p>
            <p className="text-gray-600 text-sm">{Whitelisted}/{maxAttendees} registered</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
          <div className="bg-orange-100 rounded-lg p-2">
            <Award className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">Certificate</p>
            <p className="text-gray-600 text-sm">NFT Certificate included</p>
          </div>
        </div>
      </div>

      {/* Attendance Progress */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Registration Progress</h3>
          <span className="text-sm font-medium text-gray-600">{attendancePercentage}%</span>
        </div>
        
        <div className="bg-white rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              status === 'ended' || status === 'canceled'
                ? 'bg-gray-400'
                : attendancePercentage > 80
                  ? 'bg-red-500'
                  : attendancePercentage > 50
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
            }`}
            style={{ width: `${attendancePercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between mt-2 text-sm text-gray-600">
          <span>{Whitelisted} registered</span>
          <span>{maxAttendees - Whitelisted} spots remaining</span>
        </div>
      </div>

      {/* Quick Info */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Blockchain verified</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Globe className="h-4 w-4 text-blue-500" />
          <span>Digital certificate</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4 text-purple-500" />
          <span>Lifetime access</span>
        </div>
      </div>
    </div>
  );
};

export default EventInfoCard;