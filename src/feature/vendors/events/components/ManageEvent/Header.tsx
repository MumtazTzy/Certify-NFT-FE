// src/feature/vendors/events/components/EventHeader.tsx
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, XCircle } from 'lucide-react';

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
            <Link 
                to="/vendor/dashboard" 
                className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
            >
                <ArrowLeft className="h-5 w-5" />
                <span>Back to Dashboard</span>
            </Link>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manage Event</h1>
                    <p className="text-gray-600 mt-1">{eventTitle}</p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <button 
                        onClick={() => navigate(`/vendor/event/${eventId}/edit`)} 
                        className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-blue-300" 
                        disabled={isEventCanceled || isProcessing}
                    >
                        <Edit className="h-4 w-4" />
                        <span>Edit</span>
                    </button>
                    <button 
                        onClick={onOpenCancelModal} 
                        className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-red-300" 
                        disabled={isEventCanceled || isProcessing || isEventEnded}
                    >
                        <XCircle className="h-4 w-4" />
                        <span>Cancel Event</span>
                    </button>
                </div>
            </div>
        </div>
    );
}