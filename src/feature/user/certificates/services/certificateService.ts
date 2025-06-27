import { Certificate } from '../types';

export async function fetchCertificatesByWallet(walletAddress: string): Promise<Certificate[]> {
  const API_BASE_URL = 'https://api.gpadaka.com/api3/api';
  const endpoint = `${API_BASE_URL}/users/${walletAddress}/certificate`;
  
  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw new Error('Failed to fetch certificates');
    }
    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}
