// src/feature/vendors/events/components/EventHeader.tsx
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, XCircle, Calendar, Users } from 'lucide-react';

interface EventHeaderProps {
    eventTitle: string;
    eventId: number;
    isEventCanceled: boolean;
    isEventEnded: boolean;
    isProcessing: boolean;
    onOpenCancelModal: () => void;
}

export default function EventHeader({
    eventTitle,
    eventId,
    isEventCanceled,
    isEventEnded,
    isProcessing,
    onOpenCancelModal,
}: EventHeaderProps) {
    const navigate = useNavigate();

    return (
        <div className="mb-8">
            {/* Back Navigation */}
            <Link 
                to="/vendor/dashboard" 
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-6 group"
            >
                <ArrowLeft className="h-5 w-5 group-hover:-translate-x-1 transition-transform" />
                <span className="font-medium">Back to Dashboard</span>
            </Link>
            
            {/* Main Header */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="bg-purple-100 rounded-lg p-2">
                                <Calendar className="h-6 w-6 text-purple-600" />
                            </div>
                            <div>
                                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Manage Event</h1>
                                <p className="text-gray-600 mt-1 font-medium">{eventTitle}</p>
                            </div>
                        </div>
                        
                        {/* Event ID Badge */}
                        <div className="inline-flex items-center space-x-2 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                            <span>ID:</span>
                            <span className="font-mono">{eventId}</span>
                        </div>
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="mt-6 lg:mt-0 flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                        <button 
                            onClick={() => navigate(`/vendor/event/${eventId}/edit`)} 
                            className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-blue-300 disabled:cursor-not-allowed" 
                            disabled={isEventCanceled || isProcessing}
                        >
                            <Edit className="h-4 w-4" />
                            <span>Edit Event</span>
                        </button>
                        
                        <button 
                            onClick={onOpenCancelModal} 
                            className="inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:bg-red-300 disabled:cursor-not-allowed" 
                            disabled={isEventCanceled || isProcessing || isEventEnded}
                        >
                            <XCircle className="h-4 w-4" />
                            <span>Cancel Event</span>
                        </button>
                    </div>
                </div>
                
                {/* Status Indicators */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex flex-wrap items-center space-x-4">
                        {isEventCanceled && (
                            <div className="flex items-center space-x-2 bg-red-50 text-red-700 px-3 py-2 rounded-lg">
                                <XCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">Event Canceled</span>
                            </div>
                        )}
                        
                        {isEventEnded && !isEventCanceled && (
                            <div className="flex items-center space-x-2 bg-gray-50 text-gray-700 px-3 py-2 rounded-lg">
                                <Calendar className="h-4 w-4" />
                                <span className="text-sm font-medium">Event Ended</span>
                            </div>
                        )}
                        
                        {isProcessing && (
                            <div className="flex items-center space-x-2 bg-blue-50 text-blue-700 px-3 py-2 rounded-lg">
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                <span className="text-sm font-medium">Processing...</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}