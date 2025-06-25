import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../feature/auth/hooks/useAuth';
import ProfileDropdown from '../feature/Profile';
export default function Layout({ children }: { children: React.ReactNode }) {
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
        <div className="max-w-7xl mx-auto px-4 flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/assets/logo.webp" alt="logo" className="h-12" />
            <span className="font-bold text-xl">Certify</span>
          </Link>

          {/* Nav links center */}
          <nav className="hidden md:flex flex-1 justify-center items-center space-x-6">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`${
                  location.pathname === link.to
                    ? 'text-blue-600'
                    : 'text-gray-700 hover:text-blue-600'
                } px-3 py-2 rounded-md`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right side: Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2"
          >
            ☰
          </button>
        </div>

        {/* Mobile dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white px-4 pb-4 space-y-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-2 text-gray-700 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <ProfileDropdown />
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}>Register</Link>
              </>
            )}
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-white border-t py-8 text-center text-gray-500">
        © 2025 Certify. All rights reserved.
      </footer>

      {/* ✅ Letakkan Toaster di dalam layout */}
      <Toaster position="top-center" />
    </div>
  );
}
