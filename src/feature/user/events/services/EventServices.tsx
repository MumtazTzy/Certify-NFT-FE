export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'upcoming' | 'ongoing' | 'ended' | 'canceled' | 'minting';
  whitelisted: number;
  maxAttendees: number;
  description: string;
  organizer: string;
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
    date: item.start_date || new Date().toISOString(),
    location: item.location || 'Unknown',
    status: item.status as 'upcoming' | 'ongoing' | 'minting' | 'closed' || 'upcoming',
    whitelisted: item.whitelisted || 0,
    maxAttendees: item.maxattendees || 100,
    organizer: item.organizer || 'Unknown',
    description: item.description || '',
      image: item.picture
      ? `https://api.gpadaka.com/${item.picture}`
      : 'https://via.placeholder.com/400x200?text=No+Image',}));
}
