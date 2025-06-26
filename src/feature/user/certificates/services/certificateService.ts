export interface Certificate {
  id: number;
  certificate_data: string;
  mint_status: string;
  mint_transaction_hash: string;
  created_at: string;
  updated_at: string;
  event_title: string;
  event_description: string;
  event_start_date: string;
  event_location: string;
  event_picture: string;
}

export async function fetchCertificatesByWallet(walletAddress: string): Promise<Certificate[]> {
  if (!walletAddress) throw new Error('Wallet address is required');
  const res = await fetch(`https://api.gpadaka.com/api3/api/users/${walletAddress}/certificate`);
  if (!res.ok) throw new Error('Failed to fetch certificates');
  const data = await res.json();
  return Array.isArray(data) ? data : [];
}
