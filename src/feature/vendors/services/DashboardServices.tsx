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
// src/hooks/useWhitelist.ts

import { useState, useEffect, useCallback } from 'react';
import { WhitelistEntry } from '../events/types';

export function useWhitelist(eventId: string | undefined) {
  // Inisialisasi state dengan array kosong, ini sudah benar.
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) {
      setError("Event ID is missing.");
      setLoading(false);
      return;
    }

    const fetchWhitelist = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`https://api.gpadaka.com/api3/api/events/${eventId}/whitelist`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }

        const apiData = await response.json();

        // =================================================================
        // PERBAIKAN: Tambahkan pengecekan di sini
        // Pastikan apiData adalah sebuah array sebelum memanggil .map()
        // =================================================================
        if (Array.isArray(apiData)) {
          const mappedData: WhitelistEntry[] = apiData.map(entry => ({
            id: String(entry.id),
            name: entry.name,
            email: entry.email,
            walletAddress: entry.wallet_address,
            registrationDate: entry.created_at,
            status: entry.status === 'approved' ? 'active' : 'revoked'
          }));
          setWhitelist(mappedData);
        } else {
          // Jika API mengembalikan null atau bukan array, set state ke array kosong
          // Ini mencegah error ".map is not a function"
          console.warn("API response was not an array. Defaulting to an empty whitelist.", apiData);
          setWhitelist([]);
        }

      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWhitelist();
  }, [eventId]);

  const revokeAccess = useCallback((entryId: string) => {
    setWhitelist(current =>
      current.map(entry =>
        entry.id === entryId ? { ...entry, status: 'revoked' } : entry
      )
    );
  }, []);

  return { whitelist, loading, error, revokeAccess };
}