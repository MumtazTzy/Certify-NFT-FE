import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Wallet, CheckCircle, User, Mail, Shield, AlertCircle } from 'lucide-react';

import { connectWallet, signMessage } from '../lib/wallet';
import { registerUser } from '../services/userServices';

export default function RegisterUser() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string; general?: string }>({});

  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      const { address } = await connectWallet();
      const message = `Register at Certify\nTime: ${new Date().toLocaleString()}`;
      await signMessage(message);
      setWalletAddress(address);
      setIsConnected(true);
    } catch (err: any) {
      if (err.code === 4001) {
        setErrors({ general: 'You rejected the wallet request.' });
      } else {
        setErrors({ general: 'Failed to connect wallet.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Invalid email';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      setErrors({ general: 'Please connect your wallet first.' });
      return;
    }
    if (!acceptTerms) {
      setErrors({ general: 'Please accept the Terms and Privacy Policy.' });
      return;
    }
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const payload = {
        name: formData.fullName,
        email: formData.email,
        wallet_address: walletAddress!,
        acceptTerms,
      };
      const result = await registerUser(payload);
      console.log('Registration success:', result);
      navigate('/events'); // or wherever you want
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Account</h1>
            <p className="text-gray-600">Connect your wallet & fill in your details</p>
          </div>

          {/* Error Message */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <p className="text-red-800 text-sm">{errors.general}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connect Your Wallet
              </label>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  disabled={isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 transform hover:scale-105 disabled:transform-none"
                >
                  <Wallet className="h-5 w-5" />
                  <span>{isLoading ? 'Connecting...' : 'Connect MetaMask'}</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-green-800 font-medium">Wallet Connected</p>
                      <p className="text-green-600 text-sm">{formatAddress(walletAddress!)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.fullName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="Your full name"
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors`}
                  placeholder="mail@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Terms */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700 underline">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline">
                  Privacy Policy
                </a>.
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 underline">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
