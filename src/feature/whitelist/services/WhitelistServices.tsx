// src/services/eventService.ts
import { Event } from '../types';

const API_BASE_URL = 'https://api.gpadaka.com/api3';

/**
 * Mengambil detail event berdasarkan ID.
 */
export const getEventById = async (eventId: string): Promise<Event> => {
    const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`);
    if (!response.ok) {
        throw new Error('Could not fetch event details.');
    }
    return response.json();
};

/**
 * Mengirimkan registrasi whitelist ke API.
 */
export const submitToWhitelist = async (
    eventId: string,
    walletAddress: string
): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/users/whitelist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            event_id: parseInt(eventId, 10), // Pastikan event_id adalah number
            wallet_address: walletAddress,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        // Lemparkan error dengan pesan dari API jika ada
        throw new Error(result.message || 'An unknown error occurred during submission.');
    }
    
    // Kembalikan data sukses dari API
    return result;
};