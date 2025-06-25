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
  id: string;
  event_title: string;
  event_description: string;
  issue_date: string;
  image_url: string;
  transaction_hash: string;
}