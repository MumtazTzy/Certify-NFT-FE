import { ethers } from 'ethers';

export const getProvider = () => {
  if (typeof window.ethereum !== 'undefined') {
    return new ethers.BrowserProvider(window.ethereum);
  }
  throw new Error('MetaMask is not installed');
};

export const connectWallet = async () => {
  if (!window.ethereum) {
    throw new Error('MetaMask is not available');
  }

  await window.ethereum.request({ method: 'eth_requestAccounts' });
  const provider = getProvider();
  const signer = await provider.getSigner();
  const address = await signer.getAddress();

  return { provider, signer, address };
};

export const signMessage = async (message: string) => {
  const { signer } = await connectWallet();
  return signer.signMessage(message);
};
