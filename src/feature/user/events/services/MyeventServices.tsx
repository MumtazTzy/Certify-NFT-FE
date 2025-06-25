// ✅ Definisikan tipe untuk item agenda agar lebih bersih dan dapat digunakan kembali
export interface AgendaItem {
  time: string;
  topic: string;
}

/**
 * @description Merepresentasikan objek Event yang lengkap seperti yang diterima dari API.
 * Semua properti yang ada di JSON API telah disertakan untuk akurasi tipe.
 */
export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  picture: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'canceled' | 'minting';
  
  // --- Properti yang hilang sekarang ditambahkan ---
  vendor_id: number;          // ✅ DITAMBAHKAN
  created_at: string;         // ✅ DITAMBAHKAN
  updated_at: string;         // ✅ DITAMBAHKAN
  requirements: string[];     // ✅ DITAMBAHKAN
  agenda: AgendaItem[];       // ✅ DITAMBAHKAN

  // --- Properti yang sudah ada ---
  start_date: string;
  end_date: string;
  attendees: number;
  maxattendees: number;
  user_status?: 'present' | 'absent' | 'registered' | 'claimed';
}

/**
 * Mengambil event yang diikuti oleh pengguna berdasarkan alamat wallet mereka.
 * Fungsi ini sudah ditulis dengan baik dan tidak memerlukan perubahan.
 */
export async function fetchUserEvents(walletAddress: string): Promise<Event[]> {
  const res = await fetch(`https://api.gpadaka.com/api3/api/users/${walletAddress}/events`);

  if (!res.ok) {
    // Penanganan error yang solid sudah ada di sini
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch events`);
  }

  const data = await res.json();
  // Pemeriksaan tipe data yang aman sudah ada di sini
  return Array.isArray(data) ? data : [];
}