/**
 * Menandai seorang pengguna sebagai "hadir" (attended) di sebuah event.
 * Dipanggil oleh vendor dari halaman manajemen whitelist.
 * 
 * @param {string} eventId - ID dari event yang sedang dikelola.
 * @param {string} userId - ID dari pengguna yang akan ditandai hadir.
 * @param {string} vendorAuthToken - Token otentikasi (JWT) milik vendor.
 * @returns {Promise<{ success: boolean; message: string }>} Respons dari server.
 */
export async function markUserAsAttended(eventId: string, userId: string, vendorAuthToken: string): Promise<{ success: boolean; message: string }> {
    const API_BASE_URL = 'https://api.gpadaka.com/api3/api';
    const endpoint = `${API_BASE_URL}/events/${eventId}/attendees`;

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Otentikasi vendor sangat penting di sini
                'Authorization': `Bearer ${vendorAuthToken}`
            },
            body: JSON.stringify({ user_id: userId })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || "Failed to mark attendance.");
        }
        return data;
    } catch (error) {
        console.error("Error in markUserAsAttended:", error);
        throw error;
    }
}