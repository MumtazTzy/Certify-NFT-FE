import React from 'react';
import { CheckCircle, AlertTriangle, Info, BookOpen, Users, Clock, Award } from 'lucide-react';

interface RequirementsListProps {
  requirements: string[];
  eventType?: string;
  difficulty?: string;
  duration?: string;
}

const RequirementsList: React.FC<RequirementsListProps> = ({ 
  requirements = [], 
  eventType,
  difficulty,
  duration 
}) => {
  const getRequirementIcon = (requirement: string) => {
    const lowerReq = requirement.toLowerCase();
    if (lowerReq.includes('wallet') || lowerReq.includes('metamask')) return <Award className="h-4 w-4" />;
    if (lowerReq.includes('experience') || lowerReq.includes('knowledge')) return <BookOpen className="h-4 w-4" />;
    if (lowerReq.includes('device') || lowerReq.includes('computer')) return <Info className="h-4 w-4" />;
    if (lowerReq.includes('time') || lowerReq.includes('duration')) return <Clock className="h-4 w-4" />;
    if (lowerReq.includes('age') || lowerReq.includes('participant')) return <Users className="h-4 w-4" />;
    return <CheckCircle className="h-4 w-4" />;
  };

  const getRequirementColor = (requirement: string) => {
    const lowerReq = requirement.toLowerCase();
    if (lowerReq.includes('required') || lowerReq.includes('must')) return 'text-red-600 bg-red-50 border-red-200';
    if (lowerReq.includes('recommended') || lowerReq.includes('preferred')) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (lowerReq.includes('optional') || lowerReq.includes('nice to have')) return 'text-gray-600 bg-gray-50 border-gray-200';
    return 'text-green-600 bg-green-50 border-green-200';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-orange-100 rounded-lg p-2">
          <BookOpen className="h-5 w-5 text-orange-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Event Requirements</h3>
      </div>

      {/* Event Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {eventType && (
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-4 border border-blue-200">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-500 rounded-lg p-2">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Event Type</p>
                <p className="text-blue-900 font-semibold">{eventType}</p>
              </div>
            </div>
          </div>
        )}

        {difficulty && (
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl p-4 border border-purple-200">
            <div className="flex items-center space-x-3">
              <div className="bg-purple-500 rounded-lg p-2">
                <AlertTriangle className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-700">Difficulty</p>
                <p className="text-purple-900 font-semibold">{difficulty}</p>
              </div>
            </div>
          </div>
        )}

        {duration && (
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-4 border border-green-200">
            <div className="flex items-center space-x-3">
              <div className="bg-green-500 rounded-lg p-2">
                <Clock className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-700">Duration</p>
                <p className="text-green-900 font-semibold">{duration}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Requirements List */}
      <div className="space-y-3">
        {requirements.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Specific Requirements</h4>
            <p className="text-gray-500 text-sm">
              This event is open to all participants. No special requirements needed.
            </p>
          </div>
        ) : (
          requirements.map((req, index) => (
            <div 
              key={index} 
              className={`flex items-start space-x-3 p-4 rounded-xl border transition-all hover:shadow-sm ${getRequirementColor(req)}`}
            >
              <div className="flex-shrink-0 mt-0.5">
                {getRequirementIcon(req)}
              </div>
              <div className="flex-1">
                <span className="text-sm font-medium leading-relaxed">{req}</span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Requirements Summary */}
      {requirements.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-xl border border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="bg-orange-500 rounded-lg p-2">
              <Info className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-orange-700">Requirements Summary</p>
              <p className="text-orange-900 font-semibold">
                {requirements.length} requirement{requirements.length !== 1 ? 's' : ''} to participate
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-2">
          <Info className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800 mb-1">Important Notes</p>
            <p className="text-xs text-blue-700">
              Please ensure you meet all requirements before joining the event. Contact the organizer if you have any questions about the requirements.
            </p>
          </div>
        </div>
      </div>

      {/* Requirement Categories */}
      {requirements.length > 0 && (
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Required</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Recommended</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
            <span className="text-gray-600">Optional</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequirementsList;