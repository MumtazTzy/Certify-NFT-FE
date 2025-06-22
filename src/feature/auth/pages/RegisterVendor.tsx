import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Wallet,
  Building,
  Mail,
  Phone,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

import { connectWallet, signMessage } from '../lib/wallet';
import { registerVendor } from '../services/vendorServices';

export default function RegisterVendor() {
  const [formData, setFormData] = useState({
    vendorName: '',
    email: '',
    contactInfo: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ vendorName?: string; email?: string; general?: string }>({});

  const navigate = useNavigate();

  const handleWalletConnect = async () => {
    setErrors({});
    setIsLoading(true);
    try {
      const { address } = await connectWallet();
      const message = `Register as Vendor\nTime: ${new Date().toLocaleString()}`;
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
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!formData.vendorName.trim()) newErrors.vendorName = 'Organization name is required';
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
        vendor_name: formData.vendorName,
        email: formData.email,
        contact_info: formData.contactInfo,
        wallet_address: walletAddress!,
        acceptTerms,
      };
      const result = await registerVendor(payload);
      console.log('Vendor registration success:', result);
      navigate('/vendor/dashboard'); // Ganti sesuai halaman vendor kamu
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatAddress = (address: string) => `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            to="/register"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to role selection</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="bg-purple-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-purple-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Register as Vendor
            </h1>
            <p className="text-gray-600">
              Create and manage events with blockchain certificates
            </p>
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
                Wallet Connection
              </label>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>{isLoading ? 'Connecting...' : 'Connect Wallet'}</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm">{formatAddress(walletAddress!)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Vendor Name */}
            <div>
              <label htmlFor="vendorName" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Name *
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="vendorName"
                  name="vendorName"
                  value={formData.vendorName}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.vendorName ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  placeholder="Your Organization Name"
                />
              </div>
              {errors.vendorName && (
                <p className="mt-1 text-sm text-red-500">{errors.vendorName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full pl-10 pr-4 py-3 border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors`}
                  placeholder="your@organization.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Contact Info */}
            <div>
              <label htmlFor="contactInfo" className="block text-sm font-medium text-gray-700 mb-2">
                Contact Information
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="contactInfo"
                  name="contactInfo"
                  value={formData.contactInfo}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Phone number, website, etc."
                />
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-700">
                I accept the{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Terms of Service
                </a>,{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Privacy Policy
                </a>, and{' '}
                <a href="#" className="text-purple-600 hover:text-purple-700 underline">
                  Vendor Agreement
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              {isLoading ? 'Registering...' : 'Complete Registration'}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/vendor/login" className="text-purple-600 hover:text-purple-700 font-semibold">
                Vendor Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
