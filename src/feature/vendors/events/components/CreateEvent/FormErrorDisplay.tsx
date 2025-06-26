// src/components/CreateEventForm/FormErrorDisplay.tsx
import { AlertCircle } from 'lucide-react';

const FormErrorDisplay = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <div className="flex items-center text-red-600 text-sm mt-1" role="alert">
      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};
export default FormErrorDisplay;