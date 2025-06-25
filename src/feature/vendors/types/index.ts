// src/types/index.ts

// Tipe untuk kemungkinan status event
export type EventStatus = 'upcoming' | 'active' | 'completed' | 'canceled' | 'minting' | 'ongoing';

export interface Event {
  id: string; // atau number, sesuaikan dengan kebutuhan
  title: string;
  description: string;
  vendor_id: number;
  start_date: string;
  end_date: string;
  status: EventStatus;
  picture: string;
  maxattendees: number;
  location: string;
  attendees: number;
  whitelisted?: number;
  certificatesMinted?: number; // Mungkin tidak selalu ada di setiap panggilan API
}

// Tipe untuk data statistik dashboard
export interface DashboardStats {
  totalEvents: number;
  totalAttendees: number;
  totalCertificates: number;
  activeEvents: number;
}