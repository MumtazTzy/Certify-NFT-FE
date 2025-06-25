// src/services/vendorService.ts
import { Event } from '../types';

const API_BASE_URL = 'https://api.gpadaka.com/api3';

export async function fetchVendorEvents(walletAddress: string): Promise<Event[]> {
    // Di aplikasi nyata, Anda mungkin perlu mengirim token otentikasi di header
    const response = await fetch(`${API_BASE_URL}/api/vendors/${walletAddress}/events`);
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Tangkap error jika body bukan JSON
        throw new Error(errorData.message || 'Failed to fetch vendor events.');
    }

    const data = await response.json();
    // Pastikan data yang dikembalikan adalah array untuk mencegah error saat mapping
    return Array.isArray(data) ? data : [];
}