export const loginWithWallet = async (address: string, message: string, signature: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ address, message, signature })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed');
  }

  return data;
};