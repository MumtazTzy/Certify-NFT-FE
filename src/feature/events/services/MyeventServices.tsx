// src/api/events.ts

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'minting' | 'closed';
  attendees: number;
  maxAttendees: number;
  description: string;
  image: string;
}

// Fetch events by user ID
export async function fetchUserEvents(userId: number): Promise<Event[]> {
  const res = await fetch(`https://api.gpadaka.com/api3/api/users/${userId}/events`);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || `Failed to fetch events`);
  }

  return res.json();
}
