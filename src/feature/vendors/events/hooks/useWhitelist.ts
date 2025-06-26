// src/feature/vendors/events/hooks/useWhitelist.ts
// Or src/hooks/useWhitelist.ts if that's your actual path

import { useState, useEffect, useCallback } from 'react';
import { WhitelistEntry } from '../types'; // Adjust path if necessary, e.g., '../../types' or '../types'

// Ensure WhitelistEntry matches what your API and UI expect.
// It seems your API might return `wallet_address` and `created_at`.
// The WhitelistEntry type should reflect this if it's used directly for API data.
// For example:
// interface ApiWhitelistEntry {
//   id: string | number;
//   name: string;
//   email: string;
//   wallet_address: string; // snake_case from API
//   created_at: string;     // snake_case from API
//   status: 'approved' | 'revoked' | string; // API status values
// }

export function useWhitelist(eventId: string | undefined) {
  const [whitelist, setWhitelist] = useState<WhitelistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Encapsulate fetching logic into a useCallback to be reusable
  const fetchWhitelistData = useCallback(async () => {
    if (!eventId) {
      setError("Event ID is missing.");
      setWhitelist([]); // Ensure whitelist is reset if eventId is missing
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`https://api.gpadaka.com/api3/api/events/${eventId}/whitelist`);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        throw new Error(errorData.message || `Failed to fetch: ${response.status} ${response.statusText}`);
      }

      const apiData = await response.json();

      if (Array.isArray(apiData)) {
        const mappedData: WhitelistEntry[] = apiData.map((entry: any) => ({ // Use 'any' for entry if API structure is loose, or define an ApiWhitelistEntry type
          id: String(entry.id),
          name: entry.name,
          email: entry.email,
          walletAddress: entry.wallet_address, // Map from snake_case
          registrationDate: entry.created_at, // Map from snake_case
          status: entry.status === 'approved' ? 'active' : 'revoked', // Adapt based on actual API status values
          attendance: entry.attendance ?? null, // Assuming attendance might come from API
        }));
        setWhitelist(mappedData);
      } else if (apiData === null) {
        // API explicitly returned null, treat as empty
        console.warn("API response was null. Defaulting to an empty whitelist.");
        setWhitelist([]);
      }
      else {
        console.warn("API response was not an array. Defaulting to an empty whitelist.", apiData);
        setWhitelist([]);
        // Optionally, set an error if the data shape is unexpected but not an HTTP error
        // setError("Received unexpected data format from whitelist API.");
      }

    } catch (e: any) {
      setError(e.message || "An unknown error occurred while fetching whitelist.");
      setWhitelist([]); // Clear whitelist on error
    } finally {
      setLoading(false);
    }
  }, [eventId]); // Dependency: eventId

  // Initial fetch
  useEffect(() => {
    fetchWhitelistData();
  }, [fetchWhitelistData]); // Dependency: fetchWhitelistData (which depends on eventId)

  // Function to manually refresh the whitelist
  const refreshWhitelist = useCallback(() => {
    fetchWhitelistData();
  }, [fetchWhitelistData]);

  // Example: revokeAccess - this is a client-side only update in your current code.
  // For a real revoke, you'd likely make an API call here and then refresh.
  const revokeAccess = useCallback(async (entryId: string, userToken?: string) => {
    // ---- Example API call for revoking ----
    // setLoading(true); // Indicate processing
    // try {
    //   const response = await fetch(`https://api.gpadaka.com/api3/api/events/${eventId}/whitelist/${entryId}/revoke`, {
    //     method: 'POST',
    //     headers: {
    //       'Authorization': `Bearer ${userToken}`, // If auth is needed
    //     },
    //   });
    //   if (!response.ok) {
    //     throw new Error('Failed to revoke access');
    //   }
    //   // If API call is successful, refresh the whitelist from the server
    //   await fetchWhitelistData(); 
    //   // Or, if the API returns the updated entry, update locally:
    //   // setWhitelist(current =>
    //   //   current.map(entry =>
    //   //     entry.id === entryId ? { ...entry, status: 'revoked' } : entry
    //   //   )
    //   // );
    // } catch (err: any) {
    //   setError(err.message || "Failed to revoke access.");
    // } finally {
    //   setLoading(false);
    // }
    // ---- End Example API call ----

    // Current client-side only optimistic update:
    setWhitelist(current =>
      current.map(entry =>
        entry.id === entryId ? { ...entry, status: 'revoked' } : entry
      )
    );
  }, [fetchWhitelistData, eventId]); // Added fetchWhitelistData and eventId if revoke becomes async

  return { whitelist, loading, error, revokeAccess, refreshWhitelist };
}