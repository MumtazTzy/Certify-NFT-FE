// src/components/CreateEventForm/FormActions.tsx
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface FormActionsProps {
  isSubmitting: boolean;
  hasErrors: boolean; // Untuk disable tombol submit jika ada error validasi
  cancelLink: string;
}

export default function FormActions({ isSubmitting, hasErrors, cancelLink }: FormActionsProps) {
  return (
    <div className="flex items-center justify-end space-x-3 pt-4 mt-4 border-t border-gray-200">
      <Link to={cancelLink} className="px-6 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50 font-medium transition-colors">
        Cancel
      </Link>
      <button
        type="submit"
        disabled={isSubmitting || hasErrors}
        className="px-6 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 disabled:cursor-not-allowed text-white rounded-md font-medium text-sm transition-colors flex items-center justify-center"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          'Create Event'
        )}
      </button>
    </div>
  );
}