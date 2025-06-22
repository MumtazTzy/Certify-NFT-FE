export const loginWithWallet = async (wallet_address: string,) => {
  const response = await fetch('https://api.gpadaka.com/api3/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ wallet_address })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Authentication failed');
  }

  return data;
};