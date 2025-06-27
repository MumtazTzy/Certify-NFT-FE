import { Event, EventStatus, AgendaItem } from '../types'; // Assuming Event type is defined in '../types'

export const API_BASE_URL_V3 = 'https://api.gpadaka.com/api3';
export const API_BASE_URL_V1 = 'https://api.gpadaka.com/api1';

// Helper to ensure requirements/agenda are always arrays
const ensureStringArray = (value: unknown): string[] => {
    return Array.isArray(value) ? value.map(item => String(item)) : [];
};

const ensureAgendaArray = (value: unknown): AgendaItem[] => {
    if (!Array.isArray(value)) return [];
    return value.map(item => {
        if (typeof item === 'object' && item !== null) {
            const agendaItem = item as Record<string, unknown>;
            return {
                time: String(agendaItem.time || ''),
                topic: String(agendaItem.topic || '')
            };
        }
        return { time: '', topic: String(item) };
    });
};

const transformEventData = (eventDataFromApi: Record<string, unknown>): Event => {
    // Ensure your Event type definition includes 'token' and 'certificate_uploaded'
    return {
        id: eventDataFromApi.id as number,
        title: eventDataFromApi.title as string,
        description: eventDataFromApi.description as string,
        organizer: eventDataFromApi.organizer as string, // Remains, might be optional or from other event detail endpoints
        location: eventDataFromApi.location as string,
        picture: eventDataFromApi.picture as string,
        requirements: ensureStringArray(eventDataFromApi.requirements),
        agenda: ensureAgendaArray(eventDataFromApi.agenda),
        
        start_date: eventDataFromApi.start_date as string,
        end_date: eventDataFromApi.end_date as string,
        created_at: eventDataFromApi.created_at as string,
        updated_at: eventDataFromApi.updated_at as string,
        status: eventDataFromApi.status as EventStatus,

        vendor_id: eventDataFromApi.vendor_id as number,
        max_attendees: (eventDataFromApi.max_attendees as number) ?? ((eventDataFromApi.maxattendees as number) ?? 0),
        attendees: (eventDataFromApi.attendees as number) ?? 0,
        whitelisted: (eventDataFromApi.whitelisted as number) ?? 0, // Assuming API provides this for detailed event view
        certificates_minted: (eventDataFromApi.certificates_minted as number) ?? ((eventDataFromApi.minted as number) ?? 0),
        certificate_uploaded: (eventDataFromApi.certificate_uploaded as boolean) ?? !!(eventDataFromApi.event_template_image_url as string),
        
        event_template_image_url: eventDataFromApi.event_template_image_url as string ?? null,
        event_template_token_uri: eventDataFromApi.event_template_token_uri as string ?? null,
        event_template_original_filename: eventDataFromApi.event_template_original_filename as string ?? null,
        
        token: eventDataFromApi.token as string, // Mapped from API
        minting_active: (eventDataFromApi.minting_active as boolean) ?? false, // Remains, assuming it can be API-provided
    };
};

export const getEventData = async (eventId: number): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL_V3}/api/events/${eventId}`);
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Failed to parse error response' }));
        throw new Error(errorData.message || `Failed to fetch event data. Status: ${response.status}`);
    }
    const eventDataFromApi = await response.json();
    return transformEventData(eventDataFromApi);
};

export const cancelEventAPI = async (eventId: number, token?: string): Promise<{ message: string }> => {
    console.log(`Canceling event ID: ${eventId}`);
    const headers: HeadersInit = { 'Accept': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE_URL_V3}/api/events/${eventId}/cancel`, {
        method: 'POST', 
        headers: headers,
    });
    // Try to parse JSON for errors too, as backend might provide error details in JSON
    const result = await response.json().catch(() => ({ message: `Request failed with status ${response.status}` }));
    if (!response.ok) throw new Error(result.message || `Failed to cancel the event. Status: ${response.status}`);
    return result;
};

export const updateEventStatusAPI = async (
    eventId: number,
    newStatus: EventStatus,
    vendorWalletAddress: string 
): Promise<{ message: string; event: Event }> => {
    const targetUrl = `${API_BASE_URL_V3}/api/events/${eventId}/update`;

    const requestPayload = {
        status: newStatus,
        wallet_address: vendorWalletAddress,
    };

    const response = await fetch(targetUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify(requestPayload),
    });

    const result = await response.json(); 

    if (!response.ok) {
        throw new Error(result.message || `API Error (${response.status}): Failed to update event status.`);
    }
    
    if (!result.event) {
        // This case should ideally not happen if API guarantees 'event' field on success
        throw new Error('API Error: Event data not found in successful update response.');
    }
    
    // Transform the event data received in the response
    const transformedEvent = transformEventData(result.event);
    
    return {
        message: result.message,
        event: transformedEvent, // Return transformed event
    };
};


export const uploadCertificateImageAPI = async ( 
    file: File, 
    description: string,
    eventIdContext: number, 
    vendorAddress: string  
): Promise<{ eventIdContext : number, vendorAddress: string, description: string, filePath?: string}> => {
    console.log(`Uploading certificate for event ${eventIdContext} (Description: "${description}") by vendor ${vendorAddress}`);
    const UPLOAD_ENDPOINT = `${API_BASE_URL_V1}/api/certificate/upload`; 
    const formData = new FormData();
    formData.append('description', description);
    formData.append('image', file);
    formData.append('event_id', String(eventIdContext)); 
    formData.append('vendor_address', vendorAddress);
    
    try {
        const response = await fetch(UPLOAD_ENDPOINT, { 
            method: 'POST', 
            body: formData, 
            headers: {'Accept': 'application/json'} // Added Accept header
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Upload failed. Status: ${response.status}`);
        return {
            vendorAddress: result.vendor_address,
            filePath: result.urlCertificate,
            eventIdContext: result.event_id, // <--- Use event_id if it's meant to be the event_id_from_upload
            description: result.description,
        };
    } catch (error) {
        console.error("Upload certificate error:", error); 
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred during certificate upload.");
    }
};

export const mintCertificateAPI = async ( 
    userAddress: string, 
    tokenURI: string, 
    eventIdForMint: string
): Promise<{ message: string, transactionHash?: string }> => {
    console.log(`Minting certificate for user ${userAddress}, tokenURI: ${tokenURI}, event_id: ${eventIdForMint}`);
    const MINT_ENDPOINT = `${API_BASE_URL_V1}/api/certificate/mint`;
    const body = JSON.stringify({
        user_address: userAddress, 
        tokenURI: tokenURI, 
        event_id: eventIdForMint,
    });
    
    try {
        const response = await fetch(MINT_ENDPOINT, { 
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: body 
        });
        const result = await response.json();
        if (!response.ok) throw new Error(result.message || `Minting failed. Status: ${response.status}`);
        return { 
            message: result.message || 'Certificate minted.', 
            transactionHash: result.transactionHash 
        };
    } catch (error) {
        console.error("Mint certificate error:", error); 
        if (error instanceof Error) throw error;
        throw new Error("An unknown error occurred during certificate minting.");
    }
};