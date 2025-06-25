// src/lib/wallet.ts

import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';

// Membuat satu instance provider yang akan digunakan bersama untuk efisiensi
let provider: BrowserProvider | null = null;

export const getProvider = (): BrowserProvider => {
  if (provider) {
    return provider;
  }
  if (typeof window.ethereum !== 'undefined') {
    provider = new ethers.BrowserProvider(window.ethereum);
    return provider;
  }
  throw new Error('No wallet provider found. Please install a wallet like MetaMask.');
};

/**
 * Menghubungkan wallet, meminta akses akun, dan mengembalikan signer serta address.
 * Ini adalah fungsi utama yang harus dipanggil saat pengguna mengklik "Connect".
 */
export const connectWallet = async (): Promise<{ signer: JsonRpcSigner, address: string }> => {
  const currentProvider = getProvider();
  
  // Meminta pengguna untuk menghubungkan wallet mereka. getSigner() akan melakukan ini.
  const signer = await currentProvider.getSigner();
  const address = await signer.getAddress();

  if (!address) {
    throw new Error('Could not retrieve wallet address.');
  }

  // Mengembalikan signer dan address untuk digunakan lebih lanjut
  return { signer, address };
};

/**
 * Menandatangani pesan dengan signer yang sudah ada.
 * Fungsi ini TIDAK lagi menghubungkan wallet sendiri.
 */
export const signMessage = async (signer: JsonRpcSigner, message: string): Promise<string> => {
  if (!signer) {
    throw new Error('Signer is not available. Please connect your wallet first.');
  }
  return signer.signMessage(message);
};