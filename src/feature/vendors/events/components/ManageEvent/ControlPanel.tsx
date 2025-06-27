// src/feature/vendors/events/components/EventControlPanel.tsx
import { Play, StopCircle, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';
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

const statusConfig: Record<EventStatus, { color: string; bgColor: string; icon: React.ReactNode; description: string }> = {
    upcoming: {
        color: 'text-blue-700',
        bgColor: 'bg-blue-50',
        icon: <Clock className="h-4 w-4" />,
        description: 'Event is scheduled and waiting to start'
    },
    ongoing: {
        color: 'text-green-700',
        bgColor: 'bg-green-50',
        icon: <Play className="h-4 w-4" />,
        description: 'Event is currently running'
    },
    minting: {
        color: 'text-purple-700',
        bgColor: 'bg-purple-50',
        icon: <Settings className="h-4 w-4" />,
        description: 'Certificate minting period is active'
    },
    ended: {
        color: 'text-gray-700',
        bgColor: 'bg-gray-50',
        icon: <StopCircle className="h-4 w-4" />,
        description: 'Event has concluded'
    },
    canceled: {
        color: 'text-red-700',
        bgColor: 'bg-red-50',
        icon: <AlertCircle className="h-4 w-4" />,
        description: 'Event has been canceled'
    },
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
    const statusInfo = statusConfig[currentStatus];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 rounded-lg p-2">
                    <Settings className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Event Control</h3>
            </div>
            
            {/* Current Status Display */}
            <div className="mb-6">
                <div className={`${statusInfo.bgColor} ${statusInfo.color} rounded-xl p-4 border border-current border-opacity-20`}>
                    <div className="flex items-center space-x-3">
                        {statusInfo.icon}
                        <div className="flex-1">
                            <p className="font-semibold text-sm">
                                Current Status: {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                            </p>
                            <p className="text-xs opacity-80 mt-1">{statusInfo.description}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Action Buttons */}
            <div className="space-y-3">
                {canStartOrReopenMinting && (
                    <button 
                        onClick={() => onChangeEventStatus('minting')} 
                        className="w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:from-purple-300 disabled:to-purple-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isProcessing}
                    >
                        <Play className="h-4 w-4" />
                        <span>{currentStatus === 'ended' ? 'Re-open Minting Period' : 'Start Minting Period'}</span>
                    </button>
                )}
                
                {canEndMinting && (
                    <button 
                        onClick={() => onChangeEventStatus('ended')} 
                        className="w-full inline-flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md disabled:from-red-300 disabled:to-red-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                        disabled={isProcessing}
                    >
                        <StopCircle className="h-4 w-4" />
                        <span>End Minting Period</span>
                    </button>
                )}
            </div>
            
            {/* Status Messages */}
            <div className="mt-6 space-y-3">
                {isEventEnded && !canStartOrReopenMinting && (
                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <CheckCircle className="h-5 w-5 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-gray-700">Event Completed</p>
                                <p className="text-xs text-gray-500 mt-1">
                                    This event has ended successfully.
                                    {!isEventCanceled && (
                                        <button 
                                            onClick={() => onChangeEventStatus('minting')} 
                                            className="text-purple-600 hover:text-purple-700 font-medium ml-1 underline"
                                        >
                                            Re-open minting?
                                        </button>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {isEventCanceled && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-red-700">Event Canceled</p>
                                <p className="text-xs text-red-600 mt-1">
                                    This event has been canceled and cannot be modified.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
                
                {!canStartOrReopenMinting && !canEndMinting && !isEventEnded && !isEventCanceled && currentStatus !== 'minting' && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-start space-x-3">
                            <Settings className="h-5 w-5 text-blue-500 mt-0.5" />
                            <div className="flex-1">
                                <p className="text-sm font-medium text-blue-700">Status Information</p>
                                <p className="text-xs text-blue-600 mt-1">
                                    Event is currently {currentStatus}. 
                                    {(currentStatus === 'upcoming' || currentStatus === 'ongoing') 
                                        ? ' You can start the minting period when ready.' 
                                        : ' No manual status actions available at this stage.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            
            {/* Processing Indicator */}
            {isProcessing && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent"></div>
                        <div>
                            <p className="text-sm font-medium text-blue-700">Processing...</p>
                            <p className="text-xs text-blue-600">Please wait while we update the event status</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}