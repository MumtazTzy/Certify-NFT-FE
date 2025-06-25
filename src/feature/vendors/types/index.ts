// src/types/index.ts

// Tipe untuk kemungkinan status event
export type EventStatus = 'upcoming' | 'active' | 'completed' | 'canceled' | 'minting' | 'ongoing';

export interface Event {
id: number; // Sebelumnya string
  title: string;
  description: string;
  organizer: string;
  start_date: string; // Sebelumnya date
  end_date: string;
  status: EventStatus;
  picture: string;
  location: string;
  
  // Data numerik
  attendees: number;
  minted: number; // Sebelumnya certificates
  whitelisted: number;
  maxattendees: number;

  // Data yang belum digunakan di dashboard saat ini (siap untuk masa depan)
  vendor_id: number;
  created_at: string;
  updated_at: string;
  requirements: string[];
  agenda: { time: string; topic: string }[];
}

// Tipe untuk data statistik dashboard
export interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
  totalCertificates: number;
  activeEvents: number;
}