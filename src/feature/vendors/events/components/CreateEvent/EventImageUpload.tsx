// src/components/CreateEventForm/EventImageUpload.tsx
import { Upload } from 'lucide-react';
import FormErrorDisplay from './FormErrorDisplay';

interface EventImageUploadProps {
  selectedImage: File | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export default function EventImageUpload({
  selectedImage, onImageChange, error,
}: EventImageUploadProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <label className="block text-sm font-medium text-gray-700 mb-1">Event Image (Optional)</label>
      <p className="text-xs text-gray-500 mb-2">Recommended: 16:9 aspect ratio. Max 10MB (PNG, JPG, WEBP).</p>
      <label htmlFor="eventImageUpload" className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg p-4 text-center hover:border-purple-400 cursor-pointer transition-colors ${error ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}>
        <Upload className="h-8 w-8 text-gray-400 mb-2" />
        <p className="text-xs text-gray-600 mb-1">
          {selectedImage ? <span className="text-green-700 font-medium">{selectedImage.name}</span> : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-500">Max file size: 10MB</p>
        <input id="eventImageUpload" type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={onImageChange} />
      </label>
      <FormErrorDisplay message={error} />
    </div>
  );
}