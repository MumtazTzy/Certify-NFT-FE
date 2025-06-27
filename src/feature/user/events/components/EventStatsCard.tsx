// src/components/event/EventStatsCard.tsx
import React from 'react';
import { Users, TrendingUp, Clock, Award, CheckCircle, AlertCircle } from 'lucide-react';

// 1. Define the interface for the component's props
interface EventStatsCardProps {
  whitelisted: number;
  maxAttendees: number;
  status?: string;
  date?: string;
}

// 2. Use the interface with React.FC to type the component
const EventStatsCard: React.FC<EventStatsCardProps> = ({ 
  whitelisted, 
  maxAttendees, 
  status,
  date 
}) => {
  const registrationPercentage = maxAttendees > 0 ? Math.round((whitelisted / maxAttendees) * 100) : 0;
  const spotsRemaining = maxAttendees - whitelisted;
  
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

  const getProgressColor = () => {
    if (status === 'ended' || status === 'canceled') return 'bg-gray-400';
    if (registrationPercentage > 80) return 'bg-red-500';
    if (registrationPercentage > 50) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'upcoming': return <Clock className="h-4 w-4" />;
      case 'ongoing': return <TrendingUp className="h-4 w-4" />;
      case 'minting': return <Award className="h-4 w-4" />;
      case 'canceled': return <AlertCircle className="h-4 w-4" />;
      case 'ended': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">Event Statistics</h3>
        {status && (
          <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(status)}`}>
            {getStatusIcon(status)}
            <span className="capitalize">{status}</span>
          </span>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Registered</p>
              <p className="text-2xl font-bold text-blue-900">{whitelisted}</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 rounded-lg p-2">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Available</p>
              <p className="text-2xl font-bold text-green-900">{spotsRemaining}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Progress */}
      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-gray-900">Registration Progress</h4>
          <span className="text-lg font-bold text-gray-900">{registrationPercentage}%</span>
        </div>
        
        <div className="bg-white rounded-full h-3 overflow-hidden shadow-inner mb-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${getProgressColor()}`}
            style={{ width: `${registrationPercentage}%` }}
          ></div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{whitelisted} participants</span>
          <span>{maxAttendees} total capacity</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="space-y-3">
        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
          <div className="flex items-center space-x-2">
            <Award className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Certificate Type</span>
          </div>
          <span className="text-sm font-semibold text-purple-900">NFT Certificate</span>
        </div>

        <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Verification</span>
          </div>
          <span className="text-sm font-semibold text-orange-900">Blockchain</span>
        </div>

        {date && (
          <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Event Date</span>
            </div>
            <span className="text-sm font-semibold text-blue-900">
              {new Date(date).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          </div>
        )}
      </div>

      {/* Status Message */}
      {registrationPercentage >= 100 && (
        <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Event is fully booked!
            </span>
          </div>
        </div>
      )}

      {spotsRemaining <= 5 && spotsRemaining > 0 && (
        <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-sm font-medium text-red-800">
              Only {spotsRemaining} spots left!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventStatsCard;