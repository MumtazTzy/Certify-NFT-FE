import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Award, Settings, Edit, Play, Pause, Loader2, AlertCircle, XCircle } from 'lucide-react'; // Import XCircle untuk cancel
import toast from 'react-hot-toast';

import { Event } from '../types'; 
import ConfirmationModal from '../../../../components/ConfirmationModal';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useWhitelist } from '../../events/hooks/useWhitelist';

// --- API Service Functions ---
const API_BASE_URL = 'https://api.gpadaka.com/api3';
const API_IMAGE_BASE_URL = 'https://api.gpadaka.com'; 

const getEventData = async (eventId: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch event data.');
    }
    return response.json();
}

/**
 * Membatalkan event menggunakan endpoint /cancel/:id.
 * Biasanya ini adalah request PUT atau POST. Kita asumsikan PUT.
 */
const cancelEvent = async (eventId: string): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/events/cancel/${eventId}`, {
        method: 'POST', // Atau 'POST', sesuai spesifikasi backend
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message || 'Failed to cancel the event.');
    }
    return result;
}
// --- Selesai API Service Functions ---


export default function ManageEvent() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth(); 
    const { whitelist, loading: whitelistLoading } = useWhitelist(id);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});

    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const loadEvent = async () => {
        if (!id) return;
        try {
            const data = await getEventData(id);
            setEvent(data);
        } catch (err) {
            if (err instanceof Error) setError(err.message);
        }
    };

    useEffect(() => {
        setLoading(true);
        loadEvent().finally(() => setLoading(false));
    }, [id]);

    const handleActivateMinting = () => {
        toast.success(`Minting status for "${event?.title}" has been updated.`);
    };

    const handleConfirmCancel = async () => {
        setIsModalOpen(false);
        if (!id || !isAuthenticated) {
            toast.error("Authentication required to perform this action.");
            return;
        }
        
        const promise = cancelEvent(id);

        toast.promise(promise, {
            loading: 'canceling event...',
            success: (data) => {
                // Setelah berhasil, muat ulang data event untuk menampilkan status 'canceled'
                loadEvent();
                return data.message || "Event successfully canceled.";
            },
            error: (err) => err.message
        });
    };

    // Handler to mark user as present
    const handleMarkPresent = (userId: string) => {
        setAttendance((prev) => ({ ...prev, [userId]: true }));
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

    const registrationRate = event.max_attendees > 0 ? Math.round((event.attendees / event.max_attendees) * 100) : 0;
    const spotsRemaining = event.max_attendees - event.attendees;
    const isEventcanceled = event.status === 'canceled';

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
                                <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-blue-300" disabled={isEventcanceled}><Edit className="h-4 w-4" /><span>Edit</span></button>
                                {/* Tombol diubah menjadi "Cancel" dan dinonaktifkan jika event sudah dibatalkan */}
                                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-red-300" disabled={isEventcanceled}><XCircle className="h-4 w-4" /><span>Cancel Event</span></button>
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
                                    <div className="flex items-center space-x-3"><Users className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Attendees</p><p className="text-gray-600">{event.attendees}/{event.max_attendees} registered</p></div></div>
                                    <div className="flex items-center space-x-3"><Award className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Certificates</p><p className="text-gray-600">{event.certificates_minted ?? 0} minted</p></div></div>
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
                                    <div>
                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                            event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' : 
                                            event.status === 'canceled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                                        }`}>
                                            {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                        </span>
                                    </div>
                                    <div><p className="text-sm font-medium text-gray-700 mb-2">Certificate Minting</p><div className="flex items-center justify-between"><span className={`text-sm ${event.minting_active ? 'text-green-600' : 'text-gray-600'}`}>{event.minting_active ? 'Active' : 'Inactive'}</span><button onClick={handleActivateMinting} className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${event.minting_active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`} disabled={isEventcanceled}>{event.minting_active ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}<span>{event.minting_active ? 'Deactivate' : 'Activate'}</span></button></div></div>
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
                    {/* Attendance Table spanning all columns */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-8 overflow-x-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Attendance</h2>
                        {whitelistLoading ? (
                            <div className="text-center py-8">Loading whitelist...</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th className="text-left py-2 px-4">Name</th>
                                        <th className="text-left py-2 px-4">Email</th>
                                        <th className="text-left py-2 px-4">Wallet</th>
                                        <th className="text-left py-2 px-4">Attendance</th>
                                        <th className="text-left py-2 px-4">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {whitelist.map((user) => (
                                        <tr key={user.id}>
                                            <td className="py-2 px-4">{user.name}</td>
                                            <td className="py-2 px-4">{user.email}</td>
                                            <td className="py-2 px-4 font-mono text-xs">{user.walletAddress}</td>
                                            <td className="py-2 px-4">{attendance[user.id] ? 'Present' : 'Absent'}</td>
                                            <td className="py-2 px-4">
                                                <button
                                                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:bg-gray-300"
                                                    disabled={attendance[user.id]}
                                                    onClick={() => handleMarkPresent(user.id)}
                                                >
                                                    Mark as Present
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Event"
                message={`Are you sure you want to cancel "${event.title}"? This action will mark the event as canceled, but the data will be preserved. Attendees will be notified.`}
            />
        </>
    );
}