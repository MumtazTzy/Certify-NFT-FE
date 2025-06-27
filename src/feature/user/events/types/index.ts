// src/types/index.ts

export interface AgendaItem {
  time: string;
  topic: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  start_date: string;
  end_date: string;
  status: string;
  user_status?: string;
  token?: string | null;
}