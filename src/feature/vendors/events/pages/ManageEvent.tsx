// src/feature/vendors/events/pages/ManageEvent.tsx

import { useState, useEffect, useCallback } from 'react';
import { useParams, Link} from 'react-router-dom';
import {
    Loader2, AlertCircle, Sparkles, CheckCircle, Users, Info, UploadCloud, Clock
} from 'lucide-react';
import toast from 'react-hot-toast';

import { Event, WhitelistEntry, EventStatus } from '../types';
import ConfirmationModal from '../../../../components/ConfirmationModal';
import Modal from '../../../../components/Modal';
import FileUploadForm from '../components/FileUploadForm';
import { useAuth } from '../../../auth/hooks/useAuth';
import { useWhitelist } from '../hooks/useWhitelist';

// Import API service functions
import {
    getEventData,
    cancelEventAPI,
    updateEventStatusAPI,
    uploadCertificateImageAPI,
    mintCertificateAPI,
} from '../services/eventApiService';

// Import UI Components
import EventHeader from '../components/ManageEvent/Header';
import EventDetailsDisplay from '../components/ManageEvent/EventDetail';
import EventControlPanel from '../components/ManageEvent/ControlPanel';
import EventQuickActions from '../components/ManageEvent/QuickActions';
import EventStatistics from '../components/ManageEvent/Statistics';
import ParticipantCertificatesTable from '../components/ManageEvent/ParticipantCertificatesTable';

// Interface for the successfully uploaded event-wide certificate data
interface EventCertificateApiData {
    file: File | null; // Keep the original file for local preview / re-upload reference
    originalFileName: string;
    filePath: string;
    tokenURI: string;
}

export default function ManageEvent() {
    const { id: eventIdParam } = useParams<{ id: string }>();
    const { user } = useAuth();

    const eventIdAsNumber = eventIdParam ? parseInt(eventIdParam, 10) : null;
    const { whitelist, loading: whitelistLoading, error: whitelistError, refreshWhitelist, updateUserAttendance } = useWhitelist(eventIdParam || "");

    const [event, setEvent] = useState<Event | null>(null);
    const [loadingPage, setLoadingPage] = useState(true);
    const [pageError, setPageError] = useState<string | null>(null);

    // States for event-wide certificate template
    const [pendingEventCertificatePreviewFile, setPendingEventCertificatePreviewFile] = useState<File | null>(null); // File selected, in preview modal
    const [eventCertificateDisplayInfo, setEventCertificateDisplayInfo] = useState<EventCertificateApiData | null>(null); // Successfully uploaded event cert data
    const [eventCertificateUploadError, setEventCertificateUploadError] = useState<string | null>(null);
    const [isEventCertPreviewModalOpen, setIsEventCertPreviewModalOpen] = useState(false);
    const [isProcessingEventCertUpload, setIsProcessingEventCertUpload] = useState(false);


    // States for per-user certificate uploads (modal flow)
    const [uploadedCertificates, setUploadedCertificates] = useState<Record<string, {
        filePath: string; tokenURI?: string; event_id_from_upload?: string;
    }>>({});
    const [mintedCertificates, setMintedCertificates] = useState<Record<string, {
        transactionHash?: string; 
        apiResponse?: Record<string, unknown>;
    }>>({});
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadTargetUser, setUploadTargetUser] = useState<WhitelistEntry | null>(null);
    const [fileToUpload, setFileToUpload] = useState<File | null>(null);
    const [uploadModalError, setUploadModalError] = useState<string | null>(null);

    // States for minting confirmation
    const [isMintConfirmModalOpen, setIsMintConfirmModalOpen] = useState(false);
    const [mintTargetUser, setMintTargetUser] = useState<WhitelistEntry | null>(null);
    const [mintCertificateType, setMintCertificateType] = useState<string>('');

    // General states
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false); // General processing for actions like status change, cancel, mint, per-user upload

    const loadEventData = useCallback(async () => {
        if (!eventIdAsNumber) {
            setPageError("Event ID is invalid.");
            setLoadingPage(false);
            return; // <-- Ini memastikan kode di bawah tidak berjalan jika eventIdAsNumber adalah null
        }
        try {
            const data = await getEventData(eventIdAsNumber);
            setEvent(data);

            // BAGIAN BARU: Mengisi info display template jika data ada di objek 'event'
            if (data.event_template_image_url && data.certificate_uploaded) {
                setEventCertificateDisplayInfo({
                    file: null,
                    originalFileName: data.event_template_original_filename || "template_from_server.jpg",
                    filePath: data.event_template_image_url,
                    tokenURI: data.event_template_image_url,
                });
            } else if (data.urlCertificate && data.certificate_uploaded) {
                // Use urlCertificate from event detail if available
                setEventCertificateDisplayInfo({
                    file: null,
                    originalFileName: "certificate_from_event_detail.jpg",
                    filePath: data.urlCertificate,
                    tokenURI: data.urlCertificate,
                });
            } else {
                // Pastikan state bersih jika tidak ada template di server
                console.log("No event template found in server.");
                
            }
            setPageError(null);
        } catch (err) {
            console.error("Error loading event data:", err);
            setPageError(err instanceof Error ? err.message : "Failed to load event data.");
            // ... (error handling)
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
        
        // Prevent changes if event is canceled
        if (currentStatus === 'canceled') {
            toast("Event is canceled and its status cannot be changed.", { icon: <Info className="text-blue-500" /> }); 
            return;
        }
        
        // Prevent minting during ongoing events
        if (currentStatus === 'ongoing' && newStatus === 'minting') {
            toast.error("Cannot start minting while event is ongoing. Please wait for the event to finish first.", { 
                icon: <Clock className="text-orange-500" />,
                duration: 4000
            }); 
            return;
        }
        
        // Handle minting <-> ended toggle
        if ((currentStatus === 'minting' && newStatus === 'ended') || 
            (currentStatus === 'ended' && newStatus === 'minting')) {
            // This is a valid toggle, proceed
        } else {
            // For other status changes, apply the original validation logic
            if (newStatus === 'minting') {
                if (!['upcoming', 'ended'].includes(currentStatus)) {
                    toast.error(`Cannot start/re-open minting period from current status: ${currentStatus}. Event must be finished first.`); 
                    return;
                }
            } else if (newStatus === 'ended') {
                if (currentStatus !== 'minting') {
                    toast.error(`Event must be in 'minting' status to be marked as 'ended'. Current: ${currentStatus}`); 
                    return;
                }
            }
        }

        const originalStatus = event.status;
        setEvent(prev => prev ? { ...prev, status: newStatus } : null);
        setIsProcessing(true);
        
        try {
            const result = await updateEventStatusAPI(eventIdAsNumber, newStatus, user.walletAddress);
            
            // Show appropriate success message based on the toggle
            if (currentStatus === 'minting' && newStatus === 'ended') {
                toast.success("Minting period ended successfully. Participants can no longer mint certificates.");
            } else if (currentStatus === 'ended' && newStatus === 'minting') {
                toast.success("Minting period re-opened successfully. Participants can now mint certificates.");
            } else {
                toast.success(result.message || `Event status successfully updated to ${newStatus}.`);
            }
            
            // If API returned updated event data, use it; otherwise reload event data
            if (result.event) {
                setEvent(result.event);
            } else {
                // Reload event data to get the updated status
                await loadEventData();
            }
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
            setIsCancelModalOpen(false);
            setIsProcessing(false);
        }
    };

    // --- Event-Wide Certificate Template Upload Logic ---
    const handleEventCertificateFileSelect = (file: File | null) => {
        if (file) {
            setPendingEventCertificatePreviewFile(file);
            setEventCertificateUploadError(null); // Clear previous error on new selection
            setIsEventCertPreviewModalOpen(true);
        }
    };

    const confirmAndInitiateEventCertificateUpload = async () => {
        if (!pendingEventCertificatePreviewFile || !eventIdAsNumber || !user?.walletAddress || !event) {
            toast.error("Missing file, event details, or authentication for certificate upload.");
            closeEventCertPreviewModal();
            return;
        }
        

        const fileToUpload = pendingEventCertificatePreviewFile;
        closeEventCertPreviewModal(); // Close modal before processing
        setIsProcessingEventCertUpload(true);
        setEventCertificateUploadError(null);

        try {
            const result = await uploadCertificateImageAPI(
                fileToUpload,
                `Event Certificate Template for: ${event.title}`,
                eventIdAsNumber,
                user.walletAddress
            );

            if (!result.filePath) {
                throw new Error("Upload response missing crucial data (filePath/urlCertificate).");
            }
            setEventCertificateDisplayInfo({
                file: fileToUpload,
                originalFileName: fileToUpload.name,
                filePath: result.filePath ?? "",
                tokenURI: result.filePath ?? "",
            });
            toast.success("Event certificate template uploaded successfully!");
            setEvent(prevEvent => {
                if (!prevEvent) return null;
                return {
                    ...prevEvent,
                    event_template_image_url: result.filePath ?? "",
                    event_template_token_uri: result.filePath ?? "",
                    event_template_original_filename: fileToUpload.name,
                    certificate_uploaded: true,
                };
            });
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to upload event certificate template.";
            setEventCertificateUploadError(msg);
            toast.error(msg);
            setEventCertificateDisplayInfo(null); // Clear on error
        } finally {
            setIsProcessingEventCertUpload(false);
        }
    };
    
    const closeEventCertPreviewModal = () => {
        setIsEventCertPreviewModalOpen(false);
        setPendingEventCertificatePreviewFile(null);
    };

    // --- Per-User Certificate Upload Logic (Modal Flow) ---
    const isUserConsideredPresent = (whEntry: WhitelistEntry): boolean => {
        if (!event) return false;
        if (whEntry.attendance === true) return true;
        if (whEntry.attendance === false) return false;
        // Allow uploads at any time, not just during specific event statuses
        return true;
    };

    const closeUploadModal = () => {
        setIsUploadModalOpen(false); setUploadTargetUser(null);
        setFileToUpload(null); setUploadModalError(null);
    };

    const handleFileSelectedForUpload = (file: File | null) => {
        setFileToUpload(file); setUploadModalError(null);
    };

    const handleConfirmUpload = async () => { // This is for PER-USER certificate upload
        if (!fileToUpload || !uploadTargetUser || !eventIdAsNumber || !event) {
            setUploadModalError("File, target user, or Event ID is missing."); return;
        }
        if (!user || !user.walletAddress) {
            setUploadModalError("Vendor authentication missing. Please log in."); return;
        }
        if (event.status === 'canceled') {
            setUploadModalError("Cannot upload for a canceled event."); return;
        }
        if (!isUserConsideredPresent(uploadTargetUser)) {
            setUploadModalError(`${uploadTargetUser.name} is not considered present or event is not in a stage for uploads.`); return;
        }

        setIsProcessing(true); setUploadModalError(null);
        try {
            const result = await uploadCertificateImageAPI(
                fileToUpload,
                `Certificate for ${uploadTargetUser.name} - Event: ${event.title || eventIdAsNumber}`,
                eventIdAsNumber, user.walletAddress
            );
            if (!result.filePath) {
                throw new Error("Upload response missing crucial data (filePath).");
            }
            setUploadedCertificates((prev) => ({
                ...prev, [uploadTargetUser.id]: {
                    filePath: result.filePath ?? "",
                }
            }));
            toast.success("Certificate for " + uploadTargetUser.name + " uploaded.");
            refreshWhitelist();
            closeUploadModal();
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Upload failed.";
            setUploadModalError(msg); toast.error(msg);
        } finally {
            setIsProcessing(false);
        }
    };

    // Function to handle attendance status updates
    const handleAttendanceUpdate = async (userId: string, attended: boolean) => {
        try {
            await updateUserAttendance(userId, attended);
            toast.success(`Attendance status updated for user.`);
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Failed to update attendance status.");
        }
    };

    // --- Minting Logic ---
    const handleMintCertificate = async (userId: string) => {
        // Check if certificate is available before minting
        const targetUser = whitelist.find(u => u.id === userId);
        if (!targetUser) { toast.error("User not found."); return; }
        
        const userSpecificCert = uploadedCertificates[userId];
        const hasEventTemplate = eventCertificateDisplayInfo?.tokenURI || event?.urlCertificate;
        
        // Show detailed alert if no certificate is available
        if (!userSpecificCert?.tokenURI && !hasEventTemplate) {
            toast.error(
                `No certificate available for ${targetUser.name}. Please upload either:
                • An event-wide certificate template, or
                • A specific certificate for this user`,
                {
                    icon: <AlertCircle className="text-red-500" />,
                    duration: 6000,
                    style: {
                        maxWidth: '400px',
                        whiteSpace: 'pre-line'
                    }
                }
            );
            return;
        }
        
        // Show warning if using event template instead of user-specific
        if (!userSpecificCert?.tokenURI && hasEventTemplate) {
            toast(
                `Using event template for ${targetUser.name}. Consider uploading a specific certificate for better personalization.`,
                {
                    icon: <Info className="text-blue-500" />,
                    duration: 4000
                }
            );
        }
        
        // Set up confirmation modal
        const certificateType = userSpecificCert?.tokenURI ? "user-specific" : "event template";
        setMintTargetUser(targetUser);
        setMintCertificateType(certificateType);
        setIsMintConfirmModalOpen(true);
    };

    const handleConfirmMint = async () => {
        if (!mintTargetUser) return;
        
        const userId = mintTargetUser.id;
        setIsMintConfirmModalOpen(false);
        setIsProcessing(true);
        
        try {
            if (!event || !eventIdAsNumber) { toast.error("Event data not loaded."); return; }
            if (event.status !== 'minting') {
                toast.error(`Minting is only allowed when the event is in 'minting' period. Current status: ${event.status}`); return;
            }
            if (!user || !user.walletAddress) { toast.error("Authentication token missing."); return; }

            let tokenToMint: string | undefined = undefined;
            const userSpecificCert = uploadedCertificates[userId];

            if (userSpecificCert?.tokenURI) {
                tokenToMint = userSpecificCert.tokenURI;
                toast.success(`Using specific certificate for ${mintTargetUser.name}.`);
            } else if (eventCertificateDisplayInfo?.tokenURI) {
                tokenToMint = eventCertificateDisplayInfo.tokenURI;
            } else if (event?.urlCertificate) {
                // Use urlCertificate from event detail as fallback
                tokenToMint = event.urlCertificate;
                toast.success(`Using event certificate template for ${mintTargetUser.name}.`);
            } else {
                toast.error("No certificate available for minting. Please upload an event-wide template or a specific one for this user.");
                return;
            }

            if (!tokenToMint) { // Should be caught by above, but as a safeguard
                toast.error("Could not determine tokenURI for minting.");
                return;
            }

            const mintResult = await mintCertificateAPI(
                mintTargetUser.walletAddress,
                tokenToMint,
                String(eventIdAsNumber)
            );

            setMintedCertificates((prev) => ({
                ...prev, [userId]: {
                    transactionHash: mintResult.transactionHash, apiResponse: mintResult
                }
            }));
            toast.success(mintResult.message || `Certificate for ${mintTargetUser.name} minted!`);
            
            // Optimistically update event's minted count or reload event data
            setEvent(prevEvent => {
                if (!prevEvent) return null;
                // Check if current minted count is from API or local state summing
                const currentMinted = prevEvent.certificates_minted ?? Object.keys(mintedCertificates).length;
                return { ...prevEvent, certificates_minted: currentMinted + 1 };
            });
            // loadEventData(); // Alternative: reload all event data to get fresh counts

            refreshWhitelist(); // Refresh whitelist if it contains minting status per user

        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Minting failed.");
        } finally {
            setIsProcessing(false);
        }
    };

    const getUserStatusNode = (whEntry: WhitelistEntry): React.ReactNode => {
        const userId = whEntry.id;
        if (mintedCertificates[userId]?.transactionHash) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Minted</span>;
        }
        if (uploadedCertificates[userId]?.tokenURI || eventCertificateDisplayInfo?.tokenURI || event?.urlCertificate) { // Check specific, event-wide, and event detail certificate
            // More specific status if only event-wide is available vs user-specific
            let bgColor = "bg-purple-100";
            let textColor = "text-purple-800";
            let text = "Ready to Mint (User Specific)";
            if(!uploadedCertificates[userId]?.tokenURI && eventCertificateDisplayInfo?.tokenURI){
                text = "Ready to Mint (Event Template)";
                bgColor = "bg-indigo-100"; // Different color for event template
                textColor = "text-indigo-800";
            } else if (!uploadedCertificates[userId]?.tokenURI && !eventCertificateDisplayInfo?.tokenURI && event?.urlCertificate) {
                text = "Ready to Mint (Event Detail)";
                bgColor = "bg-blue-100"; // Different color for event detail certificate
                textColor = "text-blue-800";
            } else if (!uploadedCertificates[userId]?.tokenURI && !eventCertificateDisplayInfo?.tokenURI && !event?.urlCertificate) {
                 // Fallback if somehow this condition is met incorrectly (should be caught by mint logic)
                 return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Needs Cert</span>;
            }
            return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${textColor}`}><Sparkles className="h-3 w-3 mr-1" />{text}</span>;
        }
        if (isUserConsideredPresent(whEntry)) {
            return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><Users className="h-3 w-3 mr-1" />Present</span>;
        }
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Absent</span>;
    };


    if (loadingPage) {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-12 w-12 animate-spin text-purple-600" /></div>;
    }
    if (pageError || (whitelistError && !event)) {
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

    // Simplified logic for toggle functionality
    const canToggleMinting = (event.status === 'minting' || event.status === 'ended') && !isEventCanceled;
    const canStartMinting = event.status === 'upcoming' && !isEventCanceled;

    return (
        <>
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <EventHeader
                        eventTitle={event.title}
                        eventId={event.id}
                        isEventCanceled={isEventCanceled}
                        isEventEnded={isEventEnded}
                        isProcessing={isProcessing || isProcessingEventCertUpload}
                        onOpenCancelModal={() => setIsCancelModalOpen(true)}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <EventDetailsDisplay
                            event={event}
                            uploadedCertificatesCount={Object.keys(uploadedCertificates).length}
                            mintedCertificatesCount={event.certificates_minted ?? Object.keys(mintedCertificates).length}
                            eventToken={event.token}
                        />

                        <div className="space-y-6">
                            <EventControlPanel
                                currentStatus={event.status}
                                isProcessing={isProcessing}
                                canStartOrReopenMinting={canToggleMinting || canStartMinting}
                                canEndMinting={isEventInMintingPeriod && !isEventCanceled}
                                isEventEnded={isEventEnded}
                                isEventCanceled={isEventCanceled}
                                onChangeEventStatus={handleChangeEventStatus}
                            />
                            
                            <EventQuickActions
                                eventId={event.id}
                                whitelistCount={event.whitelisted ?? whitelist.length ?? 0}
                                renderUploadCertificateButton={
                                    <div className="flex flex-col items-center w-full">
                                        {!eventCertificateDisplayInfo && !event?.urlCertificate ? (
                                            <button
                                                onClick={() => document.getElementById('event-certificate-upload-input')?.click()}
                                                disabled={isProcessingEventCertUpload || isEventCanceled}
                                                className="w-full px-4 py-3 rounded-xl font-semibold shadow-sm transition-all duration-200 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                {isProcessingEventCertUpload ? (
                                                    <Loader2 className="h-5 w-5 mr-2 inline animate-spin" />
                                                ) : (
                                                    <UploadCloud className="h-5 w-5 mr-2 inline" />
                                                )}
                                                {isProcessingEventCertUpload ? 'Uploading Template...' : 'Upload Event Certificate Template'}
                                            </button>
                                        ) : (
                                            <div className="w-full p-4 border border-green-300 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl text-center">
                                                <div className="flex items-center justify-center text-green-700 mb-3">
                                                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                                                    <span className="font-semibold text-sm">Template Available</span>
                                                </div>
                                                <p className="text-xs text-gray-600 truncate mb-3" title={eventCertificateDisplayInfo?.originalFileName || "Certificate from Event Detail"}>
                                                    {eventCertificateDisplayInfo?.originalFileName || "Certificate from Event Detail"}
                                                </p>
                                                <img
                                                    src={eventCertificateDisplayInfo?.filePath || event?.urlCertificate}
                                                    alt="Certificate Template Preview"
                                                    className="rounded-lg shadow-sm max-h-32 border border-gray-200 object-contain mx-auto mb-3"
                                                    style={{ maxWidth: 160 }}
                                                />
                                            </div>
                                        )}
                                        
                                        <input
                                            id="event-certificate-upload-input"
                                            type="file"
                                            accept="image/png,image/jpeg"
                                            style={{ display: 'none' }}
                                            onChange={e => {
                                                if (e.target.files && e.target.files[0]) {
                                                    handleEventCertificateFileSelect(e.target.files[0]);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        
                                        {eventCertificateUploadError && (
                                            <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                                                <p className="text-xs text-red-600">{eventCertificateUploadError}</p>
                                            </div>
                                        )}
                                    </div>
                                }
                            />

                            <EventStatistics
                                registrationRate={registrationRate}
                                spotsRemaining={spotsRemaining}
                            />
                        </div>
                    </div>

                    <ParticipantCertificatesTable
                        whitelist={whitelist}
                        whitelistLoading={whitelistLoading}
                        whitelistError={whitelistError}
                        uploadedCertificates={uploadedCertificates}
                        mintedCertificates={mintedCertificates}
                        eventStatus={event.status}
                        isProcessing={isProcessing}
                        isEventCanceled={isEventCanceled}
                        onMintCertificate={handleMintCertificate}
                        onAttendanceUpdate={handleAttendanceUpdate}
                        isUserConsideredPresent={isUserConsideredPresent}
                        getUserStatusNode={getUserStatusNode}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="Cancel Event"
                message={`Are you sure you want to cancel "${event?.title ?? 'this event'}"? This action cannot be undone.`}
                isProcessing={isProcessing}
            />

            {isUploadModalOpen && uploadTargetUser && (
                <Modal
                    isOpen={isUploadModalOpen}
                    onClose={closeUploadModal}
                    title={`Upload Specific Certificate for ${uploadTargetUser.name}`}
                >
                    <div className="mt-4">
                        <FileUploadForm
                            onFileSelect={handleFileSelectedForUpload}
                            label="Drag & drop specific certificate image, or click to select"
                            subText="PNG, JPG (Max 5MB)"
                            allowedFileTypes="image/png,image/jpeg"
                            maxFileSizeMB={5}
                            currentFile={fileToUpload}
                            error={uploadModalError}
                        />
                        <div className="mt-6 flex justify-end space-x-3">
                            <button 
                                type="button" 
                                onClick={closeUploadModal} 
                                disabled={isProcessing} 
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirmUpload}
                                disabled={!fileToUpload || isProcessing || isEventCanceled || (uploadTargetUser && !isUserConsideredPresent(uploadTargetUser))}
                                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 border border-transparent rounded-lg shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:from-purple-300 disabled:to-purple-400 transition-all duration-200"
                            >
                                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2 inline" /> : null}
                                {isProcessing ? 'Processing...' : 'Upload & Prepare for User'}
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isEventCertPreviewModalOpen && pendingEventCertificatePreviewFile && (
                <Modal
                    isOpen={isEventCertPreviewModalOpen}
                    onClose={closeEventCertPreviewModal}
                    title="Preview Event Certificate Template"
                >
                    <div className="flex flex-col items-center">
                        <div className="relative group mb-4">
                            <img
                                src={URL.createObjectURL(pendingEventCertificatePreviewFile)}
                                alt="Event Certificate Template Preview"
                                className="rounded-xl shadow-lg max-h-64 border border-gray-200 object-contain group-hover:scale-105 transition-transform duration-300"
                                style={{ maxWidth: 320 }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300 rounded-xl"></div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                            <p className="text-sm text-gray-600">File: {pendingEventCertificatePreviewFile.name}</p>
                        </div>
                        
                        <div className="flex gap-4 mt-4">
                            <button
                                className="px-6 py-2 rounded-lg bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400 transition-colors"
                                onClick={closeEventCertPreviewModal}
                                disabled={isProcessingEventCertUpload}
                            >
                                Cancel
                            </button>
                            <button
                                className="px-6 py-2 rounded-lg bg-gradient-to-r from-green-600 to-green-700 text-white font-semibold hover:from-green-700 hover:to-green-800 disabled:from-green-300 disabled:to-green-400 flex items-center justify-center transition-all duration-200 shadow-sm hover:shadow-md"
                                onClick={confirmAndInitiateEventCertificateUpload}
                                disabled={isProcessingEventCertUpload}
                            >
                                {isProcessingEventCertUpload ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Confirm & Upload Template
                            </button>
                        </div>
                    </div>
                </Modal>
            )}

            {isMintConfirmModalOpen && (
                <ConfirmationModal
                    isOpen={isMintConfirmModalOpen}
                    onClose={() => setIsMintConfirmModalOpen(false)}
                    onConfirm={handleConfirmMint}
                    title="Confirm Certificate Minting"
                    message={`Are you sure you want to mint a certificate for ${mintTargetUser?.name}?

Certificate Type: ${mintCertificateType}
${mintCertificateType === 'user-specific' ? '✅ Using personalized certificate for this user' : '⚠️ Using event-wide template (consider uploading specific certificate for better personalization)'}

This action will create an NFT certificate on the blockchain.`}
                    isProcessing={isProcessing}
                />
            )}
        </>
    );
}