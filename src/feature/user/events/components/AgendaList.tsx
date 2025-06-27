import React from 'react';
import { Clock, Calendar, List, CheckCircle } from 'lucide-react';
import { AgendaItem } from '../types';

interface AgendaListProps {
  agenda: AgendaItem[];
  eventDate?: string;
}

const AgendaList: React.FC<AgendaListProps> = ({ agenda = [], eventDate }) => {
  const formatTime = (time: string) => {
    // Assuming time is in format "HH:MM" or "HH:MM AM/PM"
    return time;
  };

  const getTimeColor = (index: number) => {
    const colors = [
      'bg-blue-100 text-blue-700 border-blue-200',
      'bg-purple-100 text-purple-700 border-purple-200',
      'bg-green-100 text-green-700 border-green-200',
      'bg-orange-100 text-orange-700 border-orange-200',
      'bg-pink-100 text-pink-700 border-pink-200',
      'bg-indigo-100 text-indigo-700 border-indigo-200'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-blue-100 rounded-lg p-2">
          <List className="h-5 w-5 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Event Agenda</h3>
      </div>

      {/* Event Date Display */}
      {eventDate && (
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-100">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-500 rounded-lg p-2">
              <Calendar className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-blue-700">Event Date</p>
              <p className="text-blue-900 font-semibold">
                {new Date(eventDate).toLocaleDateString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Agenda Items */}
      <div className="space-y-4">
        {agenda.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <List className="h-8 w-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-semibold text-gray-800 mb-2">No Agenda Available</h4>
            <p className="text-gray-500 text-sm">
              The event agenda will be updated soon. Check back later for the detailed schedule.
            </p>
          </div>
        ) : (
          agenda.map((item, index) => (
            <div 
              key={index} 
              className={`relative p-4 rounded-xl border transition-all hover:shadow-sm ${
                index === agenda.length - 1 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-gray-200 bg-white hover:border-blue-200'
              }`}
            >
              {/* Timeline connector */}
              {index < agenda.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200"></div>
              )}
              
              <div className="flex items-start space-x-4">
                {/* Time Badge */}
                <div className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm font-semibold border ${getTimeColor(index)}`}>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{formatTime(item.time)}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-gray-900 font-semibold mb-1 line-clamp-2">
                    {item.topic}
                  </h4>
                  {item.description && (
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {item.description}
                    </p>
                  )}
                  
                  {/* Additional info if available */}
                  {item.speaker && (
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">
                        Speaker: {item.speaker}
                      </span>
                    </div>
                  )}
                  
                  {item.duration && (
                    <div className="flex items-center space-x-2 mt-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-gray-500">
                        Duration: {item.duration}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status indicator */}
                <div className="flex-shrink-0">
                  <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Agenda Summary */}
      {agenda.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center space-x-3">
            <div className="bg-green-500 rounded-lg p-2">
              <CheckCircle className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-green-700">Agenda Summary</p>
              <p className="text-green-900 font-semibold">
                {agenda.length} session{agenda.length !== 1 ? 's' : ''} scheduled
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <p className="text-xs text-blue-700">
          <strong>Tip:</strong> Arrive 10 minutes early to each session to ensure you don't miss any important information.
        </p>
      </div>
    </div>
  );
};

export default AgendaList;