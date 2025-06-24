// src/pages/vendor/events/ManageEvent.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Award, Settings, Trash2, Edit, Play, Pause, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

// Impor komponen, tipe, dan hook dari lokasi yang sesuai di proyek Anda
import { Event } from '../tyoes'; 
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useAuth } from '../../../auth/hooks/useAuth';

// --- API Service Functions ---
// Dalam proyek besar, ini sebaiknya berada di file terpisah (misal: src/services/vendorEventService.ts)
const API_BASE_URL = 'https://api.gpadaka.com/api3';
const API_IMAGE_BASE_URL = 'https://api.gpadaka.com'; 

/**
 * Mengambil data event publik.
 */
const getEventData = async (eventId: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch event data.');
    }
    return response.json();
}

/**
 * Menghapus event menggunakan endpoint /delete/:id.
 */
const deleteEvent = async (eventId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/events/delete/${eventId}`, {
        method: 'DELETE',
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to delete the event.');
    }
    return result;
}
// --- Selesai API Service Functions ---


export default function ManageEvent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated, walletAddress } = useAuth(); 

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        if (!id) {
            setError("Event ID not found in URL.");
            setLoading(false);
            return;
        }

        const loadEvent = async () => {
            try {
                const data = await getEventData(id);
                setEvent(data);
            } catch (err) {
                if (err instanceof Error) setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [id]);

    const handleActivateMinting = () => {
        // Di sini Anda akan memanggil API untuk mengubah status minting
        toast.success(`Minting status for "${event?.title}" has been updated.`);
    };

    const handleConfirmDelete = async () => {
        setIsModalOpen(false);
        if (!id || !isAuthenticated) {
            toast.error("Authentication required to perform this action.");
            return;
        }
        
        const promise = deleteEvent(id);

        toast.promise(promise, {
            loading: 'Deleting event...',
            success: (data) => {
                setTimeout(() => navigate('/vendor/dashboard'), 1500);
                return data.message || "Event successfully deleted.";
            },
            error: (err) => err.message
        });
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-600">Failed to load event</h2>
                <p className="text-gray-600">{error}</p>
                <Link to="/vendor/dashboard" className="mt-6 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }
    
    if (!event) return null;

    const registrationRate = event.maxattendees > 0 ? Math.round((event.attendees / event.maxattendees) * 100) : 0;
    const spotsRemaining = event.maxattendees - event.attendees;

    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Header */}
                    <div className="mb-8">
                        <Link to="/vendor/dashboard" className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"><ArrowLeft className="h-5 w-5" /><span>Back to Dashboard</span></Link>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                            <div><h1 className="text-3xl font-bold text-gray-900">Manage Event</h1><p className="text-gray-600 mt-1">{event.title}</p></div>
                            <div className="mt-4 md:mt-0 flex items-center space-x-3">
                                <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold"><Edit className="h-4 w-4" /><span>Edit</span></button>
                                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold"><Trash2 className="h-4 w-4" /><span>Delete</span></button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3"><Calendar className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Date</p><p className="text-gray-600">{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                                    <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Location</p><p className="text-gray-600">{event.location}</p></div></div>
                                    <div className="flex items-center space-x-3"><Users className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Attendees</p><p className="text-gray-600">{event.attendees}/{event.maxattendees} registered</p></div></div>
                                    <div className="flex items-center space-x-3"><Award className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Certificates</p><p className="text-gray-600">{event.certificatesMinted ?? 0} minted</p></div></div>
                                </div>
                                <div className="border-t border-gray-200 pt-4 mt-6"><h3 className="font-semibold text-gray-900 mb-2">Description</h3><p className="text-gray-700 leading-relaxed">{event.description}</p></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Image</h2>
                                <div className="relative h-48 rounded-xl overflow-hidden"><img src={`${API_IMAGE_BASE_URL}/${event.picture}`} alt={event.title} className="w-full h-full object-cover"/></div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status</h3>
                                <div className="space-y-4">
                                    <div><span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></div>
                                    <div><p className="text-sm font-medium text-gray-700 mb-2">Certificate Minting</p><div className="flex items-center justify-between"><span className={`text-sm ${event.mintingActive ? 'text-green-600' : 'text-gray-600'}`}>{event.mintingActive ? 'Active' : 'Inactive'}</span><button onClick={handleActivateMinting} className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${event.mintingActive ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>{event.mintingActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}<span>{event.mintingActive ? 'Deactivate' : 'Activate'}</span></button></div></div>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3"><Link to={`/vendor/event/${event.id}/whitelist`} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Users className="h-4 w-4" /><span>View Whitelist ({event.whitelisted})</span></Link><Link to={`/vendor/event/${event.id}/minted`} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Award className="h-4 w-4" /><span>View Minted Certificates</span></Link><button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Settings className="h-4 w-4" /><span>Edit Metadata</span></button></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                                <div className="space-y-3"><div className="flex justify-between items-center"><span className="text-gray-600">Registration Rate</span><span className="font-semibold">{registrationRate}%</span></div><div className="bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${registrationRate}%` }}></div></div><div className="flex justify-between items-center pt-2"><span className="text-gray-600">Spots Remaining</span><span className="font-semibold">{spotsRemaining}</span></div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmDelete}
                title="Delete Event"
                message={`Are you sure you want to delete "${event.title}"? This action cannot be undone and will remove all associated data.`}
            />
        </>
    );
}