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

// Base API tanpa wallet address
const API_BASE_URL = 'https://api.gpadaka.com/api1/api/certificate';

export async function fetchCertificates(): Promise<Certificate[]> {
  // Ambil walletAddress dari localStorage
  const walletAddress = localStorage.getItem('walletAddress');

  if (!walletAddress) {
    throw new Error('Wallet address not found in localStorage');
  }

  const response = await fetch(`${API_BASE_URL}/${walletAddress}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch certificates');
  }

  return await response.json();
}
