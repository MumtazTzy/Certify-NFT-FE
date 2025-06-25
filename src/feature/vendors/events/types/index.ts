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
export interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  location: string;
  picture: string;
  requirements: string[];
  agenda: AgendaItem[];
  
  // --- Dates and Status ---
  // ✅ Menggunakan snake_case agar konsisten dengan API
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'canceled' | 'minting';

  // --- Numeric Data & Stats ---
  // ✅ Menggunakan snake_case agar konsisten
  vendor_id: number;
  max_attendees: number; // ✅ Diperbaiki dari `maxattendees` menjadi `max_attendees` untuk konsistensi
  attendees: number;
  whitelisted: number;
  certificates_minted?: number; // ✅ Diubah menjadi snake_case dan tetap opsional
  
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
}

// Tipe data mentah dari API
export interface ApiWhitelistEntry {
  id: number;
  user_id: number;
  name: string;
  email: string;
  wallet_address: string;
  status: string; // misal: "approved"
  created_at: string;
}