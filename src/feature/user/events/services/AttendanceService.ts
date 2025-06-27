/**
 * Menandai seorang pengguna sebagai "hadir" (attended) di sebuah event.
 * Dipanggil oleh vendor dari halaman manajemen whitelist.
 * 
 * @param {string} eventId - ID dari event yang sedang dikelola.
 * @returns {Promise<{  attended: boolean }>} Respons dari server.
 */
export async function isUserAsAttended(wallet_address: string, eventId: string): Promise<{ attended: boolean }> {
    const API_BASE_URL = 'https://api.gpadaka.com/api3/api';
    const endpoint = `${API_BASE_URL}/users/${wallet_address}/events/${eventId}/attendance-status`;

    try {
        const response = await fetch(endpoint, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to get attendance.");
        }
        return data;
    } catch (error) {
        console.error("Error in get UserAsAttended:", error);
        throw error;
    }
}

/**
 * Menandai kehadiran user pada event menggunakan token event dan wallet address user.
 * @param {string} token - Token event (event token).
 * @param {string} wallet_address - Alamat wallet user.
 * @returns {Promise<{ message: string }>} Respons dari server.
 */
export async function attendEventWithToken(event_token: string, wallet_address: string): Promise<{ message: string }> {
    const API_BASE_URL = 'https://api.gpadaka.com/api3/api';
    const endpoint = `${API_BASE_URL}/users/attend`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event_token, wallet_address })
        });
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Failed to mark attendance.');
        }
        return data;
    } catch (error) {
        console.error('Error in attendEventWithToken:', error);
        throw error;
    }
}

