// src/hooks/useWhitelist.ts

import { useState, useEffect, useCallback } from 'react';
import { WhitelistEntry, ApiWhitelistEntry } from '../types';

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