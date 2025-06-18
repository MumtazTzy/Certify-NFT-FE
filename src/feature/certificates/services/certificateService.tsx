// src/services/certificateService.ts
export interface Certificate {
  id: string;
  tokenId: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  organizer: string;
  mintDate: string;
  ipfsUrl: string;
  status: 'valid' | 'revoked';
}

const API_BASE_URL = 'http://localhost:3000';

export async function fetchCertificates(): Promise<Certificate[]> {
  const response = await fetch(`${API_BASE_URL}/certificates`);
  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }
  return await response.json();
}
