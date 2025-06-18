import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Wallet, Building, Mail, Phone, ArrowLeft, CheckCircle } from 'lucide-react';

export default function RegisterVendor() {
  const [formData, setFormData] = useState({
    vendorName: '',
    email: '',
    contactInfo: ''
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const handleWalletConnect = () => {
    // Placeholder for wallet connection
    setIsConnected(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !acceptTerms || !formData.vendorName || !formData.email) return;
    
    // Handle vendor registration logic
    console.log('Vendor registration:', { ...formData, acceptTerms });
  };

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
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm">0x1234...5678</p>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Your Organization Name"
                />
              </div>
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="your@organization.com"
                />
              </div>
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
              disabled={!isConnected || !acceptTerms || !formData.vendorName || !formData.email}
              className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              Complete Registration
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