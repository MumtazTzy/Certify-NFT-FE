import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-300 mb-4">404</div>
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-gray-600 mb-8">
          Sorry, we couldn't find the page you're looking for. The page might have been moved, deleted, or you might have entered the wrong URL.
        </p>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
          >
            <Home className="h-5 w-5" />
            <span>Go Home</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 px-6 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Go Back</span>
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            Looking for something specific?
          </p>
          <div className="flex flex-col sm:flex-row gap-2 text-sm">
            <Link to="/events" className="text-blue-600 hover:text-blue-700 underline">
              Browse Events
            </Link>
            <Link to="/about" className="text-blue-600 hover:text-blue-700 underline">
              About Certify
            </Link>
            <Link to="/faq" className="text-blue-600 hover:text-blue-700 underline">
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}