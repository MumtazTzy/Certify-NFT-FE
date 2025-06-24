import React from 'react';
import { AgendaItem } from '../types';

interface AgendaListProps {
  agenda: AgendaItem[];
}

const AgendaList: React.FC<AgendaListProps> = ({ agenda = [] }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Agenda</h3>
    <div className="space-y-4">
      {agenda.map((item, index) => (
        <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
          <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold">
            {item.time}
          </div>
          <p className="text-gray-900 font-medium flex-1">{item.topic}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AgendaList;