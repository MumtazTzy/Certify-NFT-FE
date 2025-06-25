// src/components/whitelist/WhitelistHeader.tsx

import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';

interface Props {
  eventId?: string;
  eventTitle: string;
  onExportCSV: () => void;
}

export default function WhitelistHeader({ eventId, eventTitle, onExportCSV }: Props) {
  return (
    <div className="mb-8">
      <Link
        to={`/vendor/event/${eventId}`}
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back to Event Management</span>
      </Link>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Whitelist</h1>
          <p className="text-gray-600 mt-1">{eventTitle}</p>
        </div>
        <div className="mt-4 md:mt-0">
          <button
            onClick={onExportCSV}
            className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>
    </div>
  );
}