// src/pages/WhitelistRegistration.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader2, Shield } from 'lucide-react';

import WhitelistForm from '../components/WhitelistForm';
import WhitelistSuccess from '../components/WhitelistSuccess';
import { useAuth } from '../../auth/hooks/useAuth';
import { getEventById, submitToWhitelist } from '../services/WhitelistServices';
import { Event } from '../types';

const getWhitelistStorageKey = (walletAddress: string, eventId: string) => {
    return `whitelist-status-${walletAddress}-${eventId}`;
};

export default function WhitelistRegistration() {
    const { eventId } = useParams<{ eventId: string }>();
    const { isAuthenticated, walletAddress } = useAuth();

    const [event, setEvent] = useState<Event | null>(null);
    const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
    const [loading, setLoading] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialData = async () => {
            if (!eventId) {
                setPageError("Event ID is missing from the URL.");
                setLoading(false);
                return;
            }

            if (isAuthenticated && walletAddress) {
                const key = getWhitelistStorageKey(walletAddress, eventId);
                if (localStorage.getItem(key)) {
                    setIsAlreadyRegistered(true);
                }
            }
            
            try {
                const eventData = await getEventById(eventId);
                setEvent(eventData);
            } catch (err) {
                if (err instanceof Error) setPageError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadInitialData();
    }, [eventId, isAuthenticated, walletAddress]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated || !walletAddress || !eventId) {
            setSubmitError("Authentication is required. Please log in again.");
            return;
        }

        setIsSubmitting(true);
        setSubmitError(null);
        
        try {
            await submitToWhitelist(eventId, walletAddress);
            const key = getWhitelistStorageKey(walletAddress, eventId);
            localStorage.setItem(key, 'true');
            setIsAlreadyRegistered(true);
        } catch (err) {
            if (err instanceof Error) {
                const key = getWhitelistStorageKey(walletAddress, eventId);
                if (err.message.toLowerCase().includes('already registered')) {
                    setIsAlreadyRegistered(true);
                    localStorage.setItem(key, 'true');
                } else {
                    setSubmitError(err.message);
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderLoginPrompt = () => (
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-yellow-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-yellow-700" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h1>
            <p className="text-gray-600 mb-6">You must be logged in to join an event's whitelist.</p>
            <Link to="/login" className="w-full block bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all">Go to Login Page</Link>
        </div>
    );

    const renderContent = () => {
        if (loading) return <Loader2 className="h-12 w-12 animate-spin text-blue-600" />;
        if (pageError) return <div className="text-center text-red-600 p-8 bg-white rounded-xl shadow-lg">{pageError}</div>;
        if (!event) return null;

        if (!isAuthenticated) return renderLoginPrompt();
        if (isAlreadyRegistered) return <WhitelistSuccess event={event} />;
        
        return (
            <>
                {submitError && <p className="text-center text-red-500 mb-4 bg-red-50 p-3 rounded-lg">{submitError}</p>}
                <WhitelistForm event={event} walletAddress={walletAddress!} isSubmitting={isSubmitting} onSubmit={handleSubmit} />
            </>
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
            <div className="max-w-md mx-auto w-full">
                <div className="mb-8">
                    <Link to={`/events/${eventId}`} className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600"><ArrowLeft className="h-5 w-5" /><span>Back to event</span></Link>
                </div>
                <div className="flex justify-center">{renderContent()}</div>
            </div>
        </div>
    );
}