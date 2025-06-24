// src/lib/api.ts
import { Event } from '../types';

export const API_BASE_URL = 'https://api.gpadaka.com/api3';
export const API_IMAGE_URL = 'https://api.gpadaka.com';

export const fetchEventById = async (id: string): Promise<Event> => {
  const response = await fetch(`${API_BASE_URL}/api/events/${id}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch event data. The event might not exist.');
  }
  
  const data = await response.json();
  return data as Event; // Asserting the response data matches our Event type
};