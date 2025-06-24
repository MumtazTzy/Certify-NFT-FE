// src/types/index.ts

export interface AgendaItem {
  time: string;
  topic: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  vendor_id: number;
  start_date: string;
  end_date: string;
  status: 'completed' | 'upcoming' | 'minting' | 'closed';
  created_at: string;
  updated_at: string;
  picture: string;
  maxattendees: number;
  location: string; // <-- ADD THIS LINE
  attendees: number;
  requirements: string[];
  agenda: AgendaItem[];
  organizer: string;
}