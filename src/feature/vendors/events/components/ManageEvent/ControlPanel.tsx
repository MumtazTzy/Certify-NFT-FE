// src/feature/vendors/events/components/EventControlPanel.tsx
import { Play, StopCircle } from 'lucide-react';
import { EventStatus } from '../../types';

interface EventControlPanelProps {
    currentStatus: EventStatus;
    isProcessing: boolean;
    canStartOrReopenMinting: boolean;
    canEndMinting: boolean;
    isEventEnded: boolean;
    isEventCanceled: boolean;
    onChangeEventStatus: (newStatus: EventStatus) => void;
}

const statusToColorMap: Record<EventStatus, string> = {
    upcoming: 'bg-blue-100 text-blue-800',
    ongoing: 'bg-green-100 text-green-800',
    minting: 'bg-indigo-100 text-indigo-800',
    ended: 'bg-gray-200 text-gray-700',
    canceled: 'bg-red-100 text-red-800',
};

export default function EventControlPanel({
    currentStatus,
    isProcessing,
    canStartOrReopenMinting,
    canEndMinting,
    isEventEnded,
    isEventCanceled,
    onChangeEventStatus,
}: EventControlPanelProps) {
    const eventStatusColor = statusToColorMap[currentStatus] || 'bg-gray-100 text-gray-800';

    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Control</h3>
            <div className="space-y-4">
                <div>Current Status: <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${eventStatusColor}`}>
                    {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </span></div>
                
                {canStartOrReopenMinting && (
                    <button 
                        onClick={() => onChangeEventStatus('minting')} 
                        className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-purple-300"
                        disabled={isProcessing}>
                        <Play className="h-4 w-4" />
                        <span>{currentStatus === 'ended' ? 'Re-open Minting Period' : 'Start Minting Period'}</span>
                    </button>
                )}
                {canEndMinting && (
                    <button 
                        onClick={() => onChangeEventStatus('ended')} 
                        className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-red-300"
                        disabled={isProcessing}>
                        <StopCircle className="h-4 w-4" />
                        <span>End Minting Period</span>
                    </button>
                )}
                {isEventEnded && !canStartOrReopenMinting && ( 
                    <p className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md text-center">
                        This event has ended.{' '}
                        {!isEventCanceled && <button onClick={() => onChangeEventStatus('minting')} className="text-purple-600 hover:underline text-xs">(Re-open Minting?)</button>}
                    </p> 
                )}
                {isEventCanceled && ( <p className="text-sm text-red-600 p-2 bg-red-50 rounded-md text-center">This event is canceled.</p> )}
                {!canStartOrReopenMinting && !canEndMinting && !isEventEnded && !isEventCanceled && currentStatus !== 'minting' && (
                    <p className="text-sm text-gray-500 p-2 text-center">
                        Event is currently {currentStatus}. 
                        {(currentStatus === 'upcoming' || currentStatus === 'ongoing') ? ' You can start the minting period when ready.' : 'No manual status actions available at this stage.'}
                    </p>
                )}
            </div>
        </div>
    );
}