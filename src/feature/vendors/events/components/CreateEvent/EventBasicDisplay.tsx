// src/components/CreateEventForm/EventBasicDetails.tsx
import { FileText } from 'lucide-react';
import FormErrorDisplay from './FormErrorDisplay';

interface EventBasicDetailsProps {
  title: string;
  onTitleChange: (value: string) => void;
  description: string;
  onDescriptionChange: (value: string) => void;
  validateField: (name: 'title' | 'description', value: string) => void;
  errors: { title?: string; description?: string };
}

export default function EventBasicDetails({
  title, onTitleChange, description, onDescriptionChange, validateField, errors,
}: EventBasicDetailsProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-4 text-gray-700">Event Details</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Event Title <span className="text-red-500">*</span></label>
          <div className="relative">
            <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input type="text" id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} onBlur={() => validateField('title', title)} required className={`w-full pl-9 pr-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm ${errors.title ? 'border-red-500' : 'border-gray-300'}`} placeholder="e.g., Web3 Developer Workshop"/>
          </div>
          <FormErrorDisplay message={errors.title} />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description <span className="text-red-500">*</span></label>
          <textarea id="description" value={description} onChange={(e) => onDescriptionChange(e.target.value)} onBlur={() => validateField('description', description)} required rows={3} className={`w-full px-3 py-2 border rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 resize-y transition-colors text-sm ${errors.description ? 'border-red-500' : 'border-gray-300'}`} placeholder="Provide a detailed description of your event..."/>
          <FormErrorDisplay message={errors.description} />
        </div>
      </div>
    </div>
  );
}