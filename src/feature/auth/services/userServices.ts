// services/authService.ts

export interface RegisterUserPayload {
  name: string;
  email: string;
  wallet_address: string; // tambahkan jika kamu punya info wallet
  acceptTerms: boolean;
}

export async function registerUser(payload: RegisterUserPayload): Promise<any> {
  try {
    const response = await fetch('https://api.gpadaka.com/api3/api/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register user');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Register user error:', error);
    throw error;
  }
}
