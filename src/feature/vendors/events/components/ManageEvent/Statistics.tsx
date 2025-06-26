// src/feature/vendors/events/components/EventStatistics.tsx
interface EventStatisticsProps {
    registrationRate: number;
    spotsRemaining: number | typeof Infinity;
}

export default function EventStatistics({ registrationRate, spotsRemaining }: EventStatisticsProps) {
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
            <div className="space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Registration Rate</span>
                    <span className="font-semibold">{spotsRemaining === Infinity ? 'N/A' : `${registrationRate}%`}</span>
                </div>
                {spotsRemaining !== Infinity && (
                    <div className="bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${registrationRate}%` }}></div>
                    </div>
                )}
                <div className="flex justify-between items-center pt-2">
                    <span className="text-gray-600">Spots Remaining</span>
                    <span className="font-semibold">{spotsRemaining === Infinity ? 'Unlimited' : spotsRemaining }</span>
                </div>
            </div>
        </div>
    );
}