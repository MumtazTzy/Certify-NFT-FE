import { Event } from '../types';

export type { Event };

export async function fetchUserEvents(walletAddress: string): Promise<Event[]> {
  const API_BASE_URL = 'https://api.gpadaka.com/api3/api';
  const endpoint = `${API_BASE_URL}/users/${walletAddress}/events`;
  try {
    const response = await fetch(endpoint);
    if (!response.ok) throw new Error('Failed to fetch user events');
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching user events:', error);
    return [];
  }
}
