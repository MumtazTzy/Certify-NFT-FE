import { Search, Filter, X } from 'lucide-react';

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  showClearButton?: boolean;
  className?: string;
}

export default function SearchBar({ 
  value, 
  onChange, 
  placeholder = "Search certificates...",
  showClearButton = true,
  className = ""
}: Props) {
  const handleClear = () => {
    onChange('');
  };

  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-6 ${className}`}>
      <div className="relative">
        {/* Search Icon */}
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        
        {/* Input Field */}
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-gray-700 placeholder-gray-500 font-medium"
        />
        
        {/* Clear Button */}
        {showClearButton && value && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
        
        {/* Decorative Filter Icon */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <Filter className="h-4 w-4 text-gray-300" />
        </div>
      </div>
      
      {/* Search Tips */}
      {!value && (
        <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Search by event name</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Search by organizer</span>
          </span>
          <span className="flex items-center space-x-1">
            <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
            <span>Search by date</span>
          </span>
        </div>
      )}
    </div>
  );
}
