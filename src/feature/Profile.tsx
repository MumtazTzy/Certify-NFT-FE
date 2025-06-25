import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../feature/auth/hooks/useAuth';

export default function ProfileDropdown() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const formatAddress = (address: string) =>
    `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-blue-600 bg-gray-100"
      >
        {user?.walletAddress ? formatAddress(user.walletAddress) : 'Profile'}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded shadow border border-gray-200 z-50">
          <Link
            to={user?.role === 'vendors' ? '/vendor/dashboard' : '/user/dashboard'}
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setIsOpen(false)}
          >
            My Dashboard
          </Link>
          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
