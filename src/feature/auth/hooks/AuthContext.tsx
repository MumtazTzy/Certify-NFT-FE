import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;      // ✅ tambahkan ini
  walletAddress: string | null;
  login: (token: string, walletAddress: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const address = localStorage.getItem('userAddress');

    if (token && address) {
      setIsAuthenticated(true);
      setWalletAddress(address);
    }
  }, []);

  const login = (token: string, address: string) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userAddress', address);
    setIsAuthenticated(true);
    setWalletAddress(address);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userAddress');
    setIsAuthenticated(false);
    setWalletAddress(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,   // ✅ pastikan properti ini di-ekspos
        walletAddress,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
