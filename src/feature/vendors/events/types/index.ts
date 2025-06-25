// src/types/index.ts
export interface AgendaItem {
  time: string;
  topic: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  organizer: string;
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled' | 'minting';
  picture: string;
  maxattendees: number;
  attendees: number;
  whitelisted: number; // Jumlah yang di-whitelist
  certificatesMinted?: number; // Opsional jika API tidak selalu menyediakannya
  mintingActive?: boolean; // Opsional
  requirements: string[];
  agenda: AgendaItem[];
}