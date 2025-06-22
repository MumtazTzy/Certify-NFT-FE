// services/vendorServices.ts

export interface RegisterVendorPayload {
  vendor_name: string;
  email: string;
  contact_info: string; // misalnya nomor telepon atau website
  wallet_address: string; // dari MetaMask
  acceptTerms: boolean;
}

export async function registerVendor(payload: RegisterVendorPayload): Promise<any> {
  try {
    const response = await fetch('https://api.gpadaka.com/api3/api/vendors/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to register vendor');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Register vendor error:', error);
    throw error;
  }
}
