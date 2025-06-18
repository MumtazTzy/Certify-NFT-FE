import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  return null;
};

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not found');
    }
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    const provider = getProvider();
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    
    return { provider, signer, address };
  } catch (error) {
    console.error('Error connecting wallet:', error);
    throw error;
  }
};

export const signMessage = async (message) => {
  try {
    const { signer } = await connectWallet();
    const signature = await signer.signMessage(message);
    return signature;
  } catch (error) {
    console.error('Error signing message:', error);
    throw error;
  }
};