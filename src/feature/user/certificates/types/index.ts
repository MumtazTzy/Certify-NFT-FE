// src/feature/user/certificates/types/index.ts

// Tipe data mentah dari API
export interface ApiCertificate {
  id: number;
  event_id: number;
  user_id: number;
  certificate_data: string;
  mint_status: string;
  mint_transaction_hash: string;
  created_at: string;
  updated_at: string;
  event_title: string;
  event_description: string;
  event_start_date: string;
  event_location: string;
  event_picture: string;
}

// Tipe data bersih yang digunakan oleh komponen UI
export interface Certificate {
  id: number;
  event_id: number;
  user_id: number;
  certificate_data: string; // JSON string, bisa di-parse jika perlu
  mint_status: string;
  mint_transaction_hash: string;
  created_at: string;
  updated_at: string;
  event_title: string;
  event_description: string;
  event_start_date: string;
  event_location: string;
  event_picture: string;
}