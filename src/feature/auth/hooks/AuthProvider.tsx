import { createContext, useState, useEffect, ReactNode, useMemo } from 'react';

export interface User {
  walletAddress: string;
  // ✅ FIX 1: Gunakan nama role yang konsisten (singular) dan izinkan null.
  role: 'users' | 'vendors' | null;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  walletAddress: string | null;
  // ✅ FIX 2: Izinkan fungsi login menerima 'null' sebagai role yang valid.
  // Ini sangat penting untuk alur pengguna baru.
  login: (walletAddress: string, role: 'users' | 'vendors' | null) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Efek untuk memuat user dari localStorage saat aplikasi pertama kali dimuat.
  useEffect(() => {
    try {
      const storedAddress = localStorage.getItem('walletAddress'); 
      // ✅ FIX 3: Sesuaikan tipe role yang diambil dari storage.
      const storedRole = localStorage.getItem('userRole') as 'users' | 'vendors' | null;

      // Logika ini benar: hanya set user jika address DAN role-nya valid (bukan null).
      // Kita tidak ingin pengguna yang belum selesai registrasi dianggap login penuh saat refresh.
      if (storedAddress && (storedRole === 'users' || storedRole === 'vendors')) {
        setUser({ walletAddress: storedAddress, role: storedRole });
      }
    } catch (err) {
      console.error('Failed to load user from storage:', err);
    }
  }, []); // Dependensi kosong memastikan ini hanya berjalan sekali.

  // ✅ FIX 4: Implementasi fungsi login yang sekarang lebih fleksibel.
  const login = (walletAddress: string, role: 'users' | 'vendors' | null) => {
    localStorage.setItem('walletAddress', walletAddress);
    
    // Logika yang lebih baik untuk localStorage:
    // Jika role ada, simpan. Jika role null, hapus dari storage.
    if (role) {
        localStorage.setItem('userRole', role);
    } else {
        localStorage.removeItem('userRole');
    }

    setUser({ walletAddress, role });
  };

  const logout = () => {
    localStorage.removeItem('walletAddress'); 
    localStorage.removeItem('userRole');
    setUser(null);
  };

  // Menggunakan useMemo untuk optimisasi agar value tidak dibuat ulang di setiap render.
  const value = useMemo(
    () => ({
      // ✅ Logika ini sekarang menangani status "login parsial":
      // isAuthenticated akan true bahkan jika role masih null.
      isAuthenticated: !!user,
      user,
      walletAddress: user?.walletAddress ?? null,
      login,
      logout,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};