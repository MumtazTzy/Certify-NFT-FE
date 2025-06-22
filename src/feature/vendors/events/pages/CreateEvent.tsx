// src/pages/CreateEventPage.tsx

import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import CreateEventForm from '../components/CreateEventForm';
import FullscreenSpinner from '../components/FullscreenSpinner';
import { createEventFormData } from '../services/eventService';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (fd: FormData) => {
    setIsSubmitting(true);
    try {
      await createEventFormData(fd);
      navigate('/vendor/dashboard');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Event</h1>
          <p className="text-gray-600 mt-1">Set up a new certification event</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <CreateEventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        {isSubmitting && <FullscreenSpinner message="Creating Event..." />}
      </div>
    </div>
  );
}
