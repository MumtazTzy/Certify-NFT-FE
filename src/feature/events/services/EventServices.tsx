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

export async function getEvents(): Promise<Event[]> {
  const response = await fetch('https://api.gpadaka.com/api3/api/events/all');
  if (!response.ok) {
    throw new Error('Failed to fetch events');
  }
  const data = await response.json();

  return data.map((item: any) => ({
    id: String(item.id),
    title: item.title || 'Untitled',
    date: item.date || new Date().toISOString(),
    location: item.location || 'Unknown',
    status: item.status as 'upcoming' | 'minting' | 'closed' || 'upcoming',
    attendees: item.attendees || 0,
    maxAttendees: item.maxAttendees || 100,
    description: item.description || '',
      image: item.picture
      ? `https://api.gpadaka.com/${item.picture}`
      : 'https://via.placeholder.com/400x200?text=No+Image',}));
}
