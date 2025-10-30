// src/components/Layout.tsx (Versi Baru)

import { useState } from 'react';
// 1. Impor Outlet dan ScrollRestoration
import { Link, useLocation, Outlet, ScrollRestoration } from 'react-router-dom'; 
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../feature/auth/hooks/useAuth';
import ProfileDropdown from '../feature/Profile';

// 2. Hapus props 'children' dari definisi komponen
export default function Layout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/events', label: 'Events' },
    { to: '/about', label: 'About' },
    { to: '/faq', label: 'FAQ' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow border-b">
        {/* Konten header Anda tidak perlu diubah */}
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/assets/logo.webp" 
              alt="Certify NFT Logo" 
              className="h-12 w-12" 
              width="48" 
              height="48"
              loading="eager"
            />
            <span className="font-bold text-xl">Certify-NFT</span>
          </Link>
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className={`${location.pathname === link.to ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'} px-3 py-2 rounded-md`}>
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (<ProfileDropdown />) : (<>
              <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">Login</Link>
              <Link to="/register" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register</Link>
            </>)}
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden p-2">☰</button>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 space-y-2">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-gray-700 hover:text-blue-600">{link.label}</Link>
            ))}
            {isAuthenticated ? (<ProfileDropdown />) : (<>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
              <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
            </>)}
          </div>
        )}
      </header>

      {/* 3. Ganti {children} dengan <Outlet /> */}
      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-white border-t py-8 text-center text-gray-500">
        © 2025 WLNO. All rights reserved.
      </footer>
      
      <Toaster position="top-center" />

      {/* 4. Sekarang <ScrollRestoration /> akan berfungsi dengan benar */}
      <ScrollRestoration />
    </div>
  );
}