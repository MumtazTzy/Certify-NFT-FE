import React from 'react';

interface LoaderProps {
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ message = "Loading..." }) => (
  <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    <p className="mt-4 text-lg text-gray-600">{message}</p>
  </div>
);

export default Loader;