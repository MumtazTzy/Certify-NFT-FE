// src/components/CreateEventForm/EventDateTimeLocation.tsx
import { Calendar, MapPin } from 'lucide-react';
import FormErrorDisplay from './FormErrorDisplay';

interface EventDateTimeLocationProps {
  startDate: string;
  onStartDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  endDate: string;
  onEndDateChange: (value: string) => void;
  location: string;
  onLocationChange: (value: string) => void;
  maxAttendees: string;
  onMaxAttendeesChange: (value: string) => void;
  minDateTime: string;
  validateField: (name: 'startDate' | 'endDate' | 'location' | 'maxAttendees', value: string) => void;
  errors: { startDate?: string; endDate?: string; location?: string; maxAttendees?: string; };
}

export default function EventDateTimeLocation({
  startDate, onStartDateChange, endDate, onEndDateChange,
  location, onLocationChange, maxAttendees, onMaxAttendeesChange,
  minDateTime, validateField, errors,
}: EventDateTimeLocationProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Date, Time, Location & Capacity</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date & Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="datetime-local" id="startDate" value={startDate} onChange={onStartDateChange} onBlur={() => validateField('startDate', startDate)} required min={minDateTime} className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${errors.startDate ? 'border-red-500' : 'border-gray-300'}`}/>
            </div>
            <FormErrorDisplay message={errors.startDate} />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date & Time <span className="text-red-500">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="datetime-local" id="endDate" value={endDate} onChange={(e) => onEndDateChange(e.target.value)} onBlur={() => validateField('endDate', endDate)} required min={startDate || minDateTime} disabled={!startDate} className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors text-sm ${errors.endDate ? 'border-red-500' : 'border-gray-300'}`} />
            </div>
            {!startDate && <p className="text-xs text-gray-500 mt-1">Select start date to enable end date.</p>}
            <FormErrorDisplay message={errors.endDate} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <input type="text" id="location" value={location} onChange={(e) => onLocationChange(e.target.value)} onBlur={() => validateField('location', location)} required className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${errors.location ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Grand Ballroom or 'Online'"/>
            </div>
            <FormErrorDisplay message={errors.location} />
          </div>
          <div>
            <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-1">Max Attendees (Optional)</label>
            <input type="number" id="maxAttendees" value={maxAttendees} onChange={(e) => onMaxAttendeesChange(e.target.value)} onBlur={() => validateField('maxAttendees', maxAttendees)} min="0" className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${errors.maxAttendees ? 'border-red-500' : 'border-gray-300'}`} placeholder="0 or empty for unlimited"/>
            <FormErrorDisplay message={errors.maxAttendees} />
          </div>
        </div>
      </div>
    </div>
  );
}