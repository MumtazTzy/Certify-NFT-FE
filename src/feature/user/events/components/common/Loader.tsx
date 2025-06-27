import React from 'react';
import { Loader2, Calendar, Clock } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'card' | 'inline';
}

const Loader: React.FC<LoaderProps> = ({ 
  message = "Loading...", 
  size = 'md',
  variant = 'default'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'p-4',
          spinner: 'h-6 w-6',
          text: 'text-sm',
          icon: 'h-4 w-4'
        };
      case 'lg':
        return {
          container: 'p-8',
          spinner: 'h-16 w-16',
          text: 'text-xl',
          icon: 'h-8 w-8'
        };
      default: // md
        return {
          container: 'p-6',
          spinner: 'h-12 w-12',
          text: 'text-lg',
          icon: 'h-6 w-6'
        };
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'card':
        return 'bg-white rounded-2xl shadow-sm border border-gray-100';
      case 'inline':
        return 'bg-transparent';
      default:
        return 'min-h-screen bg-gray-50';
    }
  };

  const sizeClasses = getSizeClasses();
  const variantClasses = getVariantClasses();

  if (variant === 'inline') {
    return (
      <div className="flex items-center justify-center space-x-2">
        <Loader2 className={`${sizeClasses.spinner} animate-spin text-purple-600`} />
        {message && (
          <span className={`${sizeClasses.text} text-gray-600 font-medium`}>
            {message}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`${variantClasses} flex flex-col items-center justify-center`}>
      <div className="text-center">
        {/* Main Spinner */}
        <div className="relative">
          <Loader2 className={`${sizeClasses.spinner} animate-spin text-purple-600 mx-auto`} />
          
          {/* Decorative elements */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 bg-purple-100 rounded-full animate-pulse"></div>
          </div>
        </div>

        {/* Loading Message */}
        {message && (
          <div className="mt-4">
            <p className={`${sizeClasses.text} text-gray-700 font-medium mb-2`}>
              {message}
            </p>
            <div className="flex items-center justify-center space-x-1">
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Additional visual elements for larger loaders */}
        {size === 'lg' && (
          <div className="mt-6 flex items-center justify-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400">
              <Calendar className="h-4 w-4" />
              <span className="text-sm">Preparing events</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Loading data</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Loader;