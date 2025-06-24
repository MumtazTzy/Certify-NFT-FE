export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'cancelled' | 'minting';
  attendees: number;
  maxattendees: number;
  picture: string;
}

/**
 * Fetch events by wallet address (NOT numeric user ID)
 */
export async function fetchUserEvents(walletAddress: string): Promise<Event[]> {
  const res = await fetch(`https://api.gpadaka.com/api3/api/users/${walletAddress}/events`);

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch events`);
  }

  const data = await res.json();
  return Array.isArray(data) ? data : [];
}

