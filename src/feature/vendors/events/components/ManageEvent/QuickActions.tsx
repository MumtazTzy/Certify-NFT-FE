// src/feature/vendors/events/components/EventQuickActions.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Users, Award, Settings } from 'lucide-react';

interface EventQuickActionsProps {
    eventId: number;
    whitelistCount: number;
}

export default function EventQuickActions({ eventId, whitelistCount }: EventQuickActionsProps) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
                <Link 
                    to={`/vendor/event/${eventId}/whitelist`} 
                    className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                    <Users className="h-4 w-4" />
                    <span>View Whitelist ({whitelistCount})</span>
                </Link>
                <Link 
                    to={`/vendor/event/${eventId}/minted`} 
                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                    <Award className="h-4 w-4" />
                    <span>View Minted Certificates</span>
                </Link>
                <button 
                    onClick={() => navigate(`/vendor/event/${eventId}/metadata`)} 
                    className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"
                >
                    <Settings className="h-4 w-4" />
                    <span>Edit Metadata</span>
                </button>
            </div>
        </div>
    );
}