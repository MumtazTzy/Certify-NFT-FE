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

const API_BASE_URL = 'https://api.gpadaka.com/api1/api/certificate/0x7D6e7fBaaE4b18dcD093bb12d687Af871aF8bEf8';

export async function fetchCertificates(): Promise<Certificate[]> {
  const response = await fetch(`${API_BASE_URL}/certificates`);
  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }
  return await response.json();
}
