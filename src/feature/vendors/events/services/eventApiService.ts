// src/feature/vendors/events/services/eventApiService.ts
import { Event, EventStatus } from '../types';

export const API_BASE_URL_V3 = 'https://api.gpadaka.com/api3';
export const API_BASE_URL_V1 = 'https://api.gpadaka.com/api1';
export const API_IMAGE_BASE_URL = 'https://api.gpadaka.com';

const transformEventData = (eventDataFromApi: any): Event => {
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
        status: eventDataFromApi.status as EventStatus,

        vendor_id: eventDataFromApi.vendor_id,
        max_attendees: eventDataFromApi.max_attendees ?? (eventDataFromApi.maxattendees ?? 0),
        attendees: eventDataFromApi.attendees ?? 0,
        whitelisted: eventDataFromApi.whitelisted ?? 0,
        certificates_minted: eventDataFromApi.certificates_minted ?? (eventDataFromApi.minted ?? 0),
        
        minting_active: eventDataFromApi.minting_active ?? false,
    };
};

export const getEventData = async (eventId: number): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL_V3}/api/events/${eventId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || 'Failed to fetch event data.');
    }
    const eventDataFromApi = await response.json();
    return transformEventData(eventDataFromApi);
};

export const cancelEventAPI = async (eventId: number, token?: string): Promise<{ message: string }> => {
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

export const updateEventStatusAPI = async (eventId: number, newStatus: EventStatus, token?: string): Promise<{ message: string, event: Event }> => {
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
    
    const updatedEventFromApi = result.event || result; // API might return event directly or nested
    return {
        message: result.message,
        event: transformEventData(updatedEventFromApi)
    };
};

export const uploadCertificateImageAPI = async ( 
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

export const mintCertificateAPI = async ( 
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