// src/components/forms/CreateEventForm.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Upload, FileText } from 'lucide-react';

interface CreateEventFormProps {
  onSubmit: (fd: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export default function CreateEventForm({ onSubmit, isSubmitting }: CreateEventFormProps) {
  const [formData, setFormData] = useState({
    eventName: '',
    date: '',
    description: '',
    location: '',
    maxAttendees: '',
  });

  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData();
    fd.append('title', formData.eventName);
    fd.append('description', formData.description);
    fd.append('vendor_id', '1'); // TODO: dynamic
    fd.append('start_date', new Date(formData.date).toISOString());
    fd.append('end_date', new Date(formData.date).toISOString());
    fd.append('status', 'upcoming');
    fd.append('location', formData.location);
    fd.append('maxattendees', formData.maxAttendees || '0');
    if (selectedImage) fd.append('picture', selectedImage);
    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* --- Event Name --- */}
      <div>
        <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
          Event Name *
        </label>
        <div className="relative">
          <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            id="eventName"
            name="eventName"
            value={formData.eventName}
            onChange={handleInputChange}
            required
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            placeholder="Enter event name"
          />
        </div>
      </div>

      {/* --- Date & Location --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
            Event Date *
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
            Location *
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              placeholder="Event location or 'Virtual Event'"
            />
          </div>
        </div>
      </div>

      {/* --- Max Attendees --- */}
      <div>
        <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">
          Maximum Attendees
        </label>
        <input
          type="number"
          id="maxAttendees"
          name="maxAttendees"
          value={formData.maxAttendees}
          onChange={handleInputChange}
          min="1"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          placeholder="Enter maximum number of attendees"
        />
        <p className="text-sm text-gray-500 mt-1">Leave empty for unlimited attendees</p>
      </div>

      {/* --- Description --- */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Event Description *
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-none"
          placeholder="Describe your event..."
        />
      </div>

      {/* --- Image Upload --- */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 cursor-pointer transition-colors">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          {selectedImage && (
            <p className="mt-2 text-sm text-gray-700">Selected: {selectedImage.name}</p>
          )}
        </label>
      </div>

      {/* --- Submit Button --- */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
        <Link
          to="/vendor/dashboard"
          className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
        >
          {isSubmitting ? 'Creating...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
