/**
 * @description Represents a single item in an event's agenda.
 */
export interface AgendaItem {
  time: string;
  topic: string;
}

/**
 * @description Represents a User object from the authentication context.
 * Role can be null if the user has authenticated but not yet completed registration.
 */
export interface User {
  walletAddress: string;
  role: 'users' | 'vendor' | null;
  // Jika ada ID spesifik dari backend (user_id atau vendor_id), bagus untuk menambahkannya di sini.
  // Contoh: user_id?: number; vendor_id?: number;
}

/**
 * @description Represents a complete Event object as received from the backend API.
 * Naming convention uses snake_case to directly match the API response,
 * which simplifies data handling and debugging.
 */
export type EventStatus = 
  | 'upcoming' 
  | 'ongoing' 
  | 'minting' 
  | 'ended' 
  | 'canceled';
export interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  location: string;
  picture: string;
  requirements: string[];
  agenda: AgendaItem[];
    // Add the missing properties here:
  token?: string;                  // Add this line. Make it optional if it might not always exist.
  certificate_uploaded: boolean;  // Add this line
  urlCertificate?: string; // Optional, if the URL is provided by the API
  // --- Dates and Status ---
  // ✅ Menggunakan snake_case agar konsisten dengan API
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  status: EventStatus; // ✅ Menggunakan tipe data yang sudah didefinisikan

  // --- Numeric Data & Stats ---
  // ✅ Menggunakan snake_case agar konsisten
  vendor_id: number;
  max_attendees: number; // ✅ Diperbaiki dari `maxattendees` menjadi `max_attendees` untuk konsistensi
  attendees: number;
  whitelisted: number;
  certificates_minted?: number; // ✅ Diubah menjadi snake_case dan tetap opsional
   event_template_image_url?: string | null;
    event_template_token_uri?: string | null;
    event_template_original_filename?: string | null;
  // --- Flags ---
  minting_active?: boolean; // ✅ Diubah menjadi snake_case dan tetap opsional
}

// src/types/index.ts

export interface WhitelistEntry {
  id: string;
  name: string;
  email: string;
  walletAddress: string;
  registrationDate: string;
  status: 'active' | 'revoked';
  certificate_tx_hash?: string; // Example if you store minting transaction hash
  attendance?: boolean; // true if present, false or undefined if absent
}

// Tipe data mentah dari API
export interface ApiWhitelistEntry {
  id: number;
  user_id: number;
  name: string;
  email: string;
  wallet_address: string;
  status: string; // misal: "approved"
  
  certificate_tx_hash?: string; // Example if you store minting transaction hash
  created_at: string;
}

export interface MintCertificateResponse {
    message: string;
    user_address: string;
    tokenURI: string;
    urlMetadata: string;
    urlCertificate: string;
    certificateType: string;
    txHash: string; // transactionHash di kode Anda, txHash di API
}