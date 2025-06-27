// src/feature/vendors/events/components/EventStatistics.tsx
import { TrendingUp, Users, Calendar, BarChart3 } from 'lucide-react';

interface EventStatisticsProps {
    registrationRate: number;
    spotsRemaining: number | typeof Infinity;
}

export default function EventStatistics({ registrationRate, spotsRemaining }: EventStatisticsProps) {
    const getRegistrationColor = (rate: number) => {
        if (rate >= 80) return 'text-green-600';
        if (rate >= 60) return 'text-yellow-600';
        if (rate >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getRegistrationBgColor = (rate: number) => {
        if (rate >= 80) return 'bg-green-600';
        if (rate >= 60) return 'bg-yellow-600';
        if (rate >= 40) return 'bg-orange-600';
        return 'bg-red-600';
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-purple-100 rounded-lg p-2">
                    <BarChart3 className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Event Statistics</h3>
            </div>
            
            <div className="space-y-6">
                {/* Registration Rate */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <TrendingUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Registration Rate</span>
                        </div>
                        <span className={`font-bold text-lg ${getRegistrationColor(registrationRate)}`}>
                            {spotsRemaining === Infinity ? 'N/A' : `${registrationRate}%`}
                        </span>
                    </div>
                    
                    {spotsRemaining !== Infinity && (
                        <div className="space-y-2">
                            <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div 
                                    className={`h-3 rounded-full transition-all duration-500 ease-out ${getRegistrationBgColor(registrationRate)}`}
                                    style={{ width: `${Math.min(registrationRate, 100)}%` }}
                                ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500">
                                <span>0%</span>
                                <span>50%</span>
                                <span>100%</span>
                            </div>
                        </div>
                    )}
                </div>
                
                {/* Spots Remaining */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Users className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">Spots Remaining</span>
                        </div>
                        <div className="text-right">
                            <span className="font-bold text-lg text-gray-900">
                                {spotsRemaining === Infinity ? '∞' : spotsRemaining}
                            </span>
                            {spotsRemaining !== Infinity && (
                                <p className="text-xs text-gray-500">
                                    {spotsRemaining === 0 ? 'Fully Booked' : 'Available'}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                
                {/* Status Indicator */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">Status</span>
                    </div>
                    
                    <div className="mt-2">
                        {spotsRemaining === Infinity ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-700">Unlimited Capacity</span>
                            </div>
                        ) : spotsRemaining === 0 ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                <span className="text-sm text-red-700">Fully Booked</span>
                            </div>
                        ) : spotsRemaining <= 5 ? (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <span className="text-sm text-orange-700">Almost Full</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                <span className="text-sm text-green-700">Available</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            {/* Summary Card */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                    <div className="flex items-center space-x-3">
                        <div className="bg-purple-600 rounded-lg p-2">
                            <BarChart3 className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-purple-700">Event Summary</p>
                            <p className="text-xs text-purple-600 mt-1">
                                {spotsRemaining === Infinity 
                                    ? 'Unlimited capacity event' 
                                    : spotsRemaining === 0 
                                        ? 'Event is fully booked' 
                                        : `${spotsRemaining} spots remaining`
                                }
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}