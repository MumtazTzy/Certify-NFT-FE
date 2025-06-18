import React from 'react';
import { Link } from 'react-router-dom';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';

export default function ServerError() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">500</div>
          <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="h-8 w-8 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Server Error
        </h1>
        
        <p className="text-gray-600 mb-8">
          Oops! Something went wrong on our end. Our team has been notified and is working to fix the issue. Please try again in a few moments.
        </p>

        <div className="space-y-4">
          <button
            onClick={handleRefresh}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <RefreshCw className="h-5 w-5" />
            <span>Try Again</span>
          </button>
          
          <Link
            to="/"
            className="w-full border border-gray-300 hover:border-red-600 text-gray-700 hover:text-red-600 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            If the problem persists, please contact our support team.
          </p>
          <div className="flex flex-col gap-2 text-sm">
            <a 
              href="mailto:support@certify.com" 
              className="text-red-600 hover:text-red-700 underline"
            >
              support@certify.com
            </a>
            <Link to="/faq" className="text-red-600 hover:text-red-700 underline">
              Visit FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}