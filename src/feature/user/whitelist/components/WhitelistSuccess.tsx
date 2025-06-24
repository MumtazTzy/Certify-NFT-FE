// src/components/whitelist/WhitelistSuccess.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Event } from '../types';

interface WhitelistSuccessProps {
    event: Event;
}

const WhitelistSuccess: React.FC<WhitelistSuccessProps> = ({ event }) => (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">You're Whitelisted! 🎉</h1>
        <p className="text-gray-600 mb-6">You are all set for <strong>{event.title}</strong>. We look forward to seeing you there!</p>
        <div className="bg-blue-50 rounded-xl p-4 mb-6">
            <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
            <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Attend the event on {new Date(event.start_date).toLocaleDateString()}.</li>
                <li>• Receive a unique token code to mint your NFT certificate.</li>
            </ul>
        </div>
        <div className="space-y-3">
            <Link to={`/events/${event.id}`} className="w-full block bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all">Back to Event</Link>
            <Link to="/events" className="w-full block border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-all">Browse More Events</Link>
        </div>
    </div>
);

export default WhitelistSuccess;