import {
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  walletAddress: string | null;
  login: (token: string, walletAddress: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

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
      value={{ isAuthenticated, walletAddress, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 👉 Export context for custom hook only
export { AuthContext };
