// src/feature/vendors/events/pages/ManageEvent.tsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    ArrowLeft, Calendar, MapPin, Users, Award, Settings, Edit, Play, 
    Loader2, AlertCircle, XCircle, UploadCloud, Sparkles, CheckCircle, StopCircle, Info
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Event, WhitelistEntry, EventStatus } from '../types'; 
import ConfirmationModal from '../../../../components/ConfirmationModal';
import Modal from '../../../../components/Modal'; 
import FileUploadForm from '../components/FileUploadForm'; 
import { useAuth } from '../../../auth/hooks/useAuth';
import { useWhitelist } from '../../events/hooks/useWhitelist';

// --- API Service Functions ---
const API_BASE_URL_V3 = 'https://api.gpadaka.com/api3';
const API_BASE_URL_V1 = 'https://api.gpadaka.com/api1';
const API_IMAGE_BASE_URL = 'https://api.gpadaka.com'; 

// GANTI DENGAN IMPLEMENTASI FETCH SEBENARNYA
// Di ManageEvent.tsx (atau di mana pun fungsi getEventData didefinisikan)

const getEventData = async (eventId: number): Promise<Event> => {
    // console.log(`Fetching event data for ID: ${eventId}`); // Untuk debugging
    const response = await fetch(`${API_BASE_URL_V3}/api/events/${eventId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || 'Failed to fetch event data.');
    }
    const eventDataFromApi = await response.json();

    // Transformasi dan pemberian nilai default agar sesuai dengan tipe Event kita
    return {
        id: eventDataFromApi.id,
        title: eventDataFromApi.title,
        description: eventDataFromApi.description,
        organizer: eventDataFromApi.organizer,
        location: eventDataFromApi.location,
        picture: eventDataFromApi.picture,
        requirements: Array.isArray(eventDataFromApi.requirements) ? eventDataFromApi.requirements : [],
        agenda: Array.isArray(eventDataFromApi.agenda) ? eventDataFromApi.agenda : [],
        
        start_date: eventDataFromApi.start_date,
        end_date: eventDataFromApi.end_date,
        created_at: eventDataFromApi.created_at,
        updated_at: eventDataFromApi.updated_at,
        status: eventDataFromApi.status as EventStatus, // Pastikan status dari API adalah salah satu dari EventStatus

        vendor_id: eventDataFromApi.vendor_id,
        // Menggunakan snake_case sesuai definisi tipe Event kita
        max_attendees: eventDataFromApi.max_attendees ?? (eventDataFromApi.maxattendees ?? 0), // Fallback ke maxattendees jika API mengirim itu
        attendees: eventDataFromApi.attendees ?? 0,
        whitelisted: eventDataFromApi.whitelisted ?? 0,
        certificates_minted: eventDataFromApi.certificates_minted ?? (eventDataFromApi.minted ?? 0), // Fallback ke minted
        
        minting_active: eventDataFromApi.minting_active ?? false, // Default ke false jika tidak ada dari API
        // token: eventDataFromApi.token, // Jika Anda menambahkan 'token' ke tipe Event
    };
};

const cancelEventAPI = async (eventId: number, token?: string): Promise<{ message: string }> => {
    console.log(`Canceling event ID: ${eventId}`);
    const headers: HeadersInit = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL_V3}/api/events/${eventId}/cancel`, {
        method: 'POST', headers: headers,
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to cancel the event.');
    return result;
};

const updateEventStatusAPI = async (eventId: number, newStatus: EventStatus, token?: string): Promise<{ message: string, event: Event }> => {
    console.log(`Updating event ID ${eventId} to status: ${newStatus}`);
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const UPDATE_STATUS_ENDPOINT = `${API_BASE_URL_V3}/api/events/${eventId}/update-status`; 
    const response = await fetch(UPDATE_STATUS_ENDPOINT, {
        method: 'PUT', 
        headers: headers,
        body: JSON.stringify({ status: newStatus })
    });
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || 'Failed to update event status on the server.');
    const updatedEventData = result.event || result;
     return {
        message: result.message,
        event: { /* ... transformasi data seperti di getEventData ... */ } as Event
    };
};


const uploadCertificateImageAPI = async ( 
    file: File, name: string, description: string, userAddress: string, 
    eventIdContext: number, vendorAddress: string
): Promise<{ message: string, filePath?: string, tokenURI?: string, event_id_from_upload?: string, certificateId?: string }> => {
    console.log(`Uploading certificate for user ${userAddress} for event ${eventIdContext}`);
    const UPLOAD_ENDPOINT = `${API_BASE_URL_V1}/api/certificate/upload`; 
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('image', file);
    formData.append('user_address', userAddress);
    formData.append('event_id', String(eventIdContext));
    formData.append('vendor_address', vendorAddress);
    try {
        const response = await fetch(UPLOAD_ENDPOINT, { method: 'POST', body: formData });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Upload failed. Status: ${response.status}`);
        return { 
            message: result.message || 'Certificate uploaded.', 
            filePath: result.urlCertificate || result.filePath,
            tokenURI: result.tokenURI,
            event_id_from_upload: result.event_id, 
            certificateId: result.id || result.certificateId 
        }; 
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Unknown upload error.");
    }
};

const mintCertificateAPI = async ( 
    userAddress: string, tokenURI: string, eventIdForMint: string, token?: string 
): Promise<{ message: string, transactionHash?: string }> => {
    console.log(`Minting certificate for user ${userAddress}, tokenURI: ${tokenURI}, event_id: ${eventIdForMint}`);
    const MINT_ENDPOINT = `${API_BASE_URL_V1}/api/certificate/mint`;
    const body = JSON.stringify({
        user_address: userAddress, tokenURI: tokenURI, event_id: eventIdForMint,
    });
    const headers: HeadersInit = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    try {
        const response = await fetch(MINT_ENDPOINT, { method: 'POST', headers: headers, body: body });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Minting failed. Status: ${response.status}`);
        return { message: result.message || 'Certificate minted.', transactionHash: result.transactionHash };
    } catch (error) {
        if (error instanceof Error) throw error;
        throw new Error("Unknown minting error.");
    }
};
// --- Selesai API Service Functions ---

export default function ManageEvent() {
    const { id: eventIdParam } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth(); 
    
    const eventIdAsNumber = eventIdParam ? parseInt(eventIdParam, 10) : null; 
    const { whitelist, loading: whitelistLoading, error: whitelistError } = useWhitelist(eventIdParam || ""); 
    
    const [uploadedCertificates, setUploadedCertificates] = useState<Record<string, { 
        filePath: string; tokenURI?: string; event_id_from_upload?: string; 
        certificateId?: string; apiResponse?: any;
    }>>({});
    const [mintedCertificates, setMintedCertificates] = useState<Record<string, { 
        transactionHash?: string; apiResponse?: any;
    }>>({});

    const [event, setEvent] = useState<Event | null>(null);
    const [loadingPage, setLoadingPage] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);
    
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadTargetUser, setUploadTargetUser] = useState<WhitelistEntry | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [uploadModalError, setUploadModalError] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const loadEventData = useCallback(async () => {
        if (!eventIdAsNumber) {
            setPageError("Event ID is invalid."); setLoadingPage(false); return;
        }
        setLoadingPage(true);
        try {
            const data = await getEventData(eventIdAsNumber);
            setEvent(data); setPageError(null);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error fetching event data.";
            setPageError(msg); toast.error(msg);
        } finally {
            setLoadingPage(false);
        }
    }, [eventIdAsNumber]); 

    useEffect(() => {
        if (eventIdAsNumber) {
            loadEventData();
        }
    }, [eventIdAsNumber, loadEventData]);

    const handleChangeEventStatus = async (newStatus: EventStatus) => {
        if (!event || !eventIdAsNumber || !user?.walletAddress) {
            toast.error("Event data or authentication is missing to change status."); return;
        }
        
        const currentStatus = event.status;

        if (currentStatus === 'canceled') {
            toast("Event is canceled and its status cannot be changed.", { icon: <Info className="text-blue-500"/> });
            return;
        }
         if (currentStatus === 'ended' && newStatus !== 'minting') {
            toast("Event has ended. Only re-opening for minting is allowed.", { icon: <Info className="text-blue-500"/> });
            return;
        }
        if (newStatus === 'minting') {
            if (!['upcoming', 'ongoing', 'ended'].includes(currentStatus)) {
                toast.error(`Cannot start/re-open minting period from current status: ${currentStatus}.`);
                return;
            }
        } else if (newStatus === 'ended') {
            if (currentStatus !== 'minting') {
                toast.error(`Event must be in 'minting' status to be marked as 'ended'. Current: ${currentStatus}`);
                return;
            }
        }
    
        const originalStatus = event.status;
        setEvent(prev => prev ? { ...prev, status: newStatus } : null); 
        setIsProcessing(true);
        try {
            const result = await updateEventStatusAPI(eventIdAsNumber, newStatus, user.walletAddress);
            toast.success(result.message || `Event status successfully updated to ${newStatus}.`);
            setEvent(result.event); 
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update event status.");
            setEvent(prev => prev ? { ...prev, status: originalStatus } : null); 
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleConfirmCancel = async () => {
        if (!eventIdAsNumber || !user?.walletAddress) { 
             toast.error("Authentication required to cancel event."); return; 
        }
        setIsProcessing(true);
        try {
            const result = await cancelEventAPI(eventIdAsNumber, user.walletAddress); 
            toast.success(result.message || "Event successfully canceled.");
            loadEventData(); 
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to cancel event.");
        } finally {
            setIsProcessing(false);
        }
    };

    const isUserConsideredPresent = (whEntry: WhitelistEntry): boolean => {
        if (!event) return false;
        if (whEntry.attendance === true) return true;
        if (whEntry.attendance === false) return false;
        const canUploadBasedOnEventStatus: Event['status'][] = ['ongoing', 'minting', 'ended'];
        return canUploadBasedOnEventStatus.includes(event.status);
    };

    const openUploadModal = (userForUpload: WhitelistEntry) => {
        setUploadTargetUser(userForUpload);
        setFileToUpload(null); setUploadModalError(null); setIsUploadModalOpen(true);
    };
    const closeUploadModal = () => {
        setIsUploadModalOpen(false); setUploadTargetUser(null);
        setFileToUpload(null); setUploadModalError(null);
    };
    const handleFileSelectedForUpload = (file: File | null) => {
        setFileToUpload(file); setUploadModalError(null); 
    };

    const handleConfirmUpload = async () => {
        if (!fileToUpload || !uploadTargetUser || !eventIdAsNumber) {
            setUploadModalError("File, target user, or Event ID is missing."); return;
        }
        if (!user || !user.walletAddress || !user.walletAddress) { 
            setUploadModalError("Vendor authentication missing. Please log in."); return;
        }
        if (!event || event.status === 'canceled') {
            setUploadModalError("Cannot upload for a canceled event."); return;
        }
        if (!isUserConsideredPresent(uploadTargetUser)) {
            setUploadModalError(`${uploadTargetUser.name} is not considered present or event is not in a stage for uploads.`); return;
        }

        setIsProcessing(true); setUploadModalError(null);
        try {
            const result = await uploadCertificateImageAPI(
                fileToUpload, uploadTargetUser.name, 
                `Certificate for ${uploadTargetUser.name} - Event: ${event?.title || eventIdAsNumber}`,
                uploadTargetUser.walletAddress, eventIdAsNumber, user.walletAddress
            );
            setUploadedCertificates((prev) => ({ 
                ...prev, [uploadTargetUser.id]: { 
                    filePath: result.filePath || "unknown_path", tokenURI: result.tokenURI, 
                    event_id_from_upload: result.event_id_from_upload, certificateId: result.certificateId,
                    apiResponse: result } }));
            toast.success(result.message || `Certificate for ${uploadTargetUser.name} uploaded.`);
            closeUploadModal();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Upload failed.";
            setUploadModalError(msg); toast.error(msg);
        } finally {
            setIsProcessing(false);
        }
    };
    
    const handleMintCertificate = async (userId: string) => {
        const certificateData = uploadedCertificates[userId];
        const targetUser = whitelist.find(u => u.id === userId);

        if (!targetUser) { toast.error("User not found."); return; }
        if (!certificateData || !certificateData.tokenURI) {
            toast.error("Certificate data or TokenURI is missing."); return;
        }
        if (!event) { toast.error("Event data not loaded."); return; }
        
        if (event.status !== 'minting') {
            toast.error(`Minting is only allowed when the event is in 'minting' period. Current status: ${event.status}`); return;
        }

        const eventIdForMint = certificateData.event_id_from_upload || String(eventIdAsNumber); 
        if (!eventIdForMint) { toast.error("Event ID for minting is missing."); return; }
        if (!user || !user.walletAddress) { toast.error("Authentication token missing."); return; }

        setIsProcessing(true);
        try {
            const mintResult = await mintCertificateAPI(
                targetUser.walletAddress, certificateData.tokenURI, 
                String(eventIdForMint), user.walletAddress
            );
            setMintedCertificates((prev) => ({
                ...prev, [userId]: { 
                    transactionHash: mintResult.transactionHash, apiResponse: mintResult }
            }));
            toast.success(mintResult.message || `Certificate for ${targetUser.name} minted!`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Minting failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getUserStatus = (whEntry: WhitelistEntry): React.ReactNode => {
        const userId = whEntry.id;
        if (mintedCertificates[userId]) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Minted</span>;
        }
        if (uploadedCertificates[userId]?.tokenURI) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"><Sparkles className="h-3 w-3 mr-1" />Ready to Mint</span>;
        }
        if (isUserConsideredPresent(whEntry)) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Users className="h-3 w-3 mr-1" />Present</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Absent</span>;
    };

    // --- JSX Rendering ---
    if (loadingPage) { 
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
    }
    if (pageError || whitelistError) { 
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
                <h2 className="text-xl font-bold text-red-600">Failed to load data</h2>
                <p className="text-gray-600">{pageError || String(whitelistError)}</p>
                <Link to="/vendor/dashboard" className="mt-6 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }
    if (!event) { 
        return (
             <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
                <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
                <h2 className="text-xl font-bold text-yellow-600">Event Not Found</h2>
                <p className="text-gray-600">The requested event (ID: {eventIdParam}) could not be found or loaded.</p>
                <Link to="/vendor/dashboard" className="mt-6 text-blue-600 hover:underline">Back to Dashboard</Link>
            </div>
        );
    }

    const registrationRate = event.max_attendees > 0 ? Math.round((event.whitelisted / event.max_attendees) * 100) : 0;
    const spotsRemaining = event.max_attendees > 0 ? event.max_attendees - event.whitelisted : Infinity;
    const isEventCanceled = event.status === 'canceled';
    const isEventEnded = event.status === 'ended';
    const isEventInMintingPeriod = event.status === 'minting';

    const canStartOrReopenMinting = (event.status === 'ongoing' || event.status === 'upcoming' || event.status === 'ended') && !isEventCanceled;
    const canEndMinting = isEventInMintingPeriod && !isEventCanceled;

    const statusToColorMap: Record<EventStatus, string> = {
        upcoming: 'bg-blue-100 text-blue-800',
        ongoing: 'bg-green-100 text-green-800',
        minting: 'bg-indigo-100 text-indigo-800',
        ended: 'bg-gray-200 text-gray-700',
        canceled: 'bg-red-100 text-red-800',
    };
    const eventStatusColor = statusToColorMap[event.status] || 'bg-gray-100 text-gray-800';

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
                                <button onClick={() => navigate(`/vendor/event/${event.id}/edit`)} className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-blue-300" disabled={isEventCanceled || isProcessing}><Edit className="h-4 w-4" /><span>Edit</span></button>
                                <button onClick={() => setIsCancelModalOpen(true)} className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-red-300" disabled={isEventCanceled || isProcessing || isEventEnded}><XCircle className="h-4 w-4" /><span>Cancel Event</span></button>
                            </div>
                        </div>
                    </div>

                    {/* Detail Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center space-x-3"><Calendar className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Date</p><p className="text-gray-600">{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p></div></div>
                                    <div className="flex items-center space-x-3"><MapPin className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Location</p><p className="text-gray-600">{event.location}</p></div></div>
                                    <div className="flex items-center space-x-3"><Users className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Registered</p><p className="text-gray-600">{event.whitelisted}/{event.max_attendees > 0 ? event.max_attendees : 'Unlimited'} registered</p></div></div>
                                    <div className="flex items-center space-x-3"><Users className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Attendees</p><p className="text-gray-600">{event.attendees}/{event.max_attendees > 0 ? event.max_attendees : 'Unlimited'} Attend</p></div></div>
                                    <div className="flex items-center space-x-3"><Award className="h-5 w-5 text-gray-400" /><div><p className="font-semibold text-gray-900">Certificates</p><p className="text-gray-600">{event.certificates_minted ?? Object.keys(mintedCertificates).length} minted of {Object.keys(uploadedCertificates).length} prepared</p></div></div>
                                </div>
                                <div className="border-t border-gray-200 pt-4 mt-6"><h3 className="font-semibold text-gray-900 mb-2">Description</h3><p className="text-gray-700 leading-relaxed">{event.description}</p></div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Image</h2>
                                {event.picture ? (
                                    <div className="relative h-48 rounded-xl overflow-hidden"><img src={`${API_IMAGE_BASE_URL}/${event.picture}`} alt={event.title} className="w-full h-full object-cover"/></div>
                                ) : ( <p className="text-gray-500">No image available.</p> )}
                            </div>
                        </div>
                        {/* Right Sidebar */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Control</h3>
                                <div className="space-y-4">
                                    <div>Current Status: <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${eventStatusColor}`}>
                                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                    </span></div>
                                    
                                    {canStartOrReopenMinting && (
                                        <button 
                                            onClick={() => handleChangeEventStatus('minting')} 
                                            className="w-full inline-flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-purple-300"
                                            disabled={isProcessing}>
                                            <Play className="h-4 w-4" />
                                            <span>{event.status === 'ended' ? 'Re-open Minting Period' : 'Start Minting Period'}</span>
                                        </button>
                                    )}
                                    {canEndMinting && (
                                        <button 
                                            onClick={() => handleChangeEventStatus('ended')} 
                                            className="w-full inline-flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold disabled:bg-red-300"
                                            disabled={isProcessing}>
                                            <StopCircle className="h-4 w-4" />
                                            <span>End Minting Period</span>
                                        </button>
                                    )}
                                    {isEventEnded && !canStartOrReopenMinting && ( 
                                        <p className="text-sm text-gray-600 p-2 bg-gray-100 rounded-md text-center">
                                            This event has ended.{' '}
                                            {/* Logika untuk menampilkan tombol re-open hanya jika kondisi lain terpenuhi, misal tidak dibatalkan */}
                                            {!isEventCanceled && <button onClick={() => handleChangeEventStatus('minting')} className="text-purple-600 hover:underline text-xs">(Re-open Minting?)</button>}
                                        </p> 
                                    )}
                                    {isEventCanceled && ( <p className="text-sm text-red-600 p-2 bg-red-50 rounded-md text-center">This event is canceled.</p> )}
                                    {!canStartOrReopenMinting && !canEndMinting && !isEventEnded && !isEventCanceled && event.status !== 'minting' && (
                                        <p className="text-sm text-gray-500 p-2 text-center">
                                            Event is currently {event.status}. 
                                            {(event.status === 'upcoming' || event.status === 'ongoing') ? ' You can start the minting period when ready.' : 'No manual status actions available at this stage.'}
                                        </p>
                                    )}
                                </div>
                            </div>
                             <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                <div className="space-y-3">
                                    <Link to={`/vendor/event/${event.id}/whitelist`} className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Users className="h-4 w-4" /><span>View Whitelist ({event.whitelisted ?? whitelist.length ?? 0})</span></Link>
                                    <Link to={`/vendor/event/${event.id}/minted-certificates`} className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Award className="h-4 w-4" /><span>View Minted Certificates</span></Link>
                                    <button onClick={() => navigate(`/vendor/event/${event.id}/metadata`)} className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold flex items-center justify-center space-x-2"><Settings className="h-4 w-4" /><span>Edit Metadata</span></button>
                                </div>
                            </div>
                            <div className="bg-white rounded-2xl shadow-lg p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center"><span className="text-gray-600">Registration Rate</span><span className="font-semibold">{spotsRemaining === Infinity ? 'N/A' : `${registrationRate}%`}</span></div>
                                    {spotsRemaining !== Infinity && <div className="bg-gray-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${registrationRate}%` }}></div></div> }
                                    <div className="flex justify-between items-center pt-2"><span className="text-gray-600">Spots Remaining</span><span className="font-semibold">{spotsRemaining === Infinity ? 'Unlimited' : spotsRemaining }</span></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Participant Certificates Table */}
                    <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-8 overflow-x-auto">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Participant Certificates</h2>
                        {whitelistLoading ? ( <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" /> Loading participants...</div>
                        ) : whitelist.length === 0 && !whitelistError ? ( <p className="text-center text-gray-500 py-8">No participants on the whitelist for this event yet.</p>
                        ) : (
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate Status</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {whitelist.map((whUser) => {
                                        const userIsPresent = isUserConsideredPresent(whUser);
                                        const certificateUploaded = !!uploadedCertificates[whUser.id]?.tokenURI;
                                        const certificateMinted = !!mintedCertificates[whUser.id];
                                        
                                        const canUpload = userIsPresent && !certificateUploaded && 
                                                        !['canceled', 'upcoming'].includes(event.status) && 
                                                        !isProcessing;
                                        const canMint = certificateUploaded && !certificateMinted && 
                                                        event.status === 'minting' &&
                                                        !isEventCanceled && !isProcessing;

                                        return (
                                            <tr key={whUser.id}>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900">{whUser.name}</div><div className="text-sm text-gray-500">{whUser.email}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap"><div className="font-mono text-xs text-gray-600">{whUser.walletAddress}</div></td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{getUserStatus(whUser)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex items-center space-x-2">
                                                        <button 
                                                            title="Upload Certificate" 
                                                            onClick={() => openUploadModal(whUser)} 
                                                            disabled={!canUpload} 
                                                            className="p-2 rounded-full text-blue-600 bg-blue-100 hover:bg-blue-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                                                            <UploadCloud className="h-4 w-4" />
                                                        </button>
                                                        <button 
                                                            title="Mint Certificate" 
                                                            onClick={() => handleMintCertificate(whUser.id)} 
                                                            disabled={!canMint} 
                                                            className="p-2 rounded-full text-purple-600 bg-purple-100 hover:bg-purple-200 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors">
                                                            <Sparkles className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                         {/* Menambahkan pesan error untuk whitelist jika ada */}
                         {!whitelistLoading && whitelistError && ( <p className="text-center text-red-500 py-8">Error loading whitelist: {String(whitelistError)}</p> )}
                    </div>
                </div>
            </div>

            <ConfirmationModal 
                isOpen={isCancelModalOpen} 
                onClose={() => setIsCancelModalOpen(false)} 
                onConfirm={handleConfirmCancel} 
                title="Cancel Event" 
                message={`Are you sure you want to cancel "${event?.title ?? 'this event'}"? This action cannot be undone.`}
            />

            {isUploadModalOpen && uploadTargetUser && ( 
                <Modal 
                    isOpen={isUploadModalOpen} 
                    onClose={closeUploadModal} 
                    title={`Upload Certificate for ${uploadTargetUser.name}`}
                > 
                    <div className="mt-4"> 
                        <FileUploadForm 
                            onFileSelect={handleFileSelectedForUpload} 
                            label="Drag & drop certificate image, or click to select" 
                            subText="PNG, JPG (Max 5MB)" 
                            allowedFileTypes="image/png,image/jpeg" 
                            maxFileSizeMB={5} 
                            currentFile={fileToUpload} 
                            error={uploadModalError} 
                        /> 
                        <div className="mt-6 flex justify-end space-x-3"> 
                            <button type="button" onClick={closeUploadModal} disabled={isProcessing} className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500  disabled:bg-gray-200">Cancel</button> 
                            <button 
                                type="button" 
                                onClick={handleConfirmUpload} 
                                disabled={!fileToUpload || isProcessing || isEventCanceled || (event && uploadTargetUser && !isUserConsideredPresent(uploadTargetUser)) } // Pastikan uploadTargetUser ada sebelum memanggil isUserConsideredPresent
                                className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-300"
                            > 
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null} 
                                {isProcessing ? 'Processing...' : 'Upload & Prepare'} 
                            </button> 
                        </div> 
                    </div> 
                </Modal> 
            )}
        </>
    );
}