// src/hooks/useAuth.ts
import { useContext } from 'react';
import { AuthContext, AuthContextType } from './AuthProvider'; // pastikan path sesuai

/**
 * Custom hook untuk mengakses context autentikasi.
 * Wajib dipakai di dalam <AuthProvider>
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};
