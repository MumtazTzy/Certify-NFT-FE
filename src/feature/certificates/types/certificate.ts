export interface Certificate {
  id: number;
  event_id: number;
  user_id: number;
  certificate_data: string;
  mint_status: 'minted' | 'pending';
  mint_transaction_hash: string;
  created_at: string;
  updated_at: string;
  event_title: string;
  event_description: string;
  event_start_date: string;
  event_location: string;
  event_picture: string;
}
