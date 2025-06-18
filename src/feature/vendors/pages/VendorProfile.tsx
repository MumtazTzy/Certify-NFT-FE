import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Building, Mail, Globe, Save } from 'lucide-react';

export default function VendorProfile() {
  const [formData, setFormData] = useState({
    vendorName: 'Blockchain Education Foundation',
    email: 'contact@blockchainedu.org',
    website: 'https://blockchainedu.org',
    description: 'Leading provider of blockchain education and certification programs worldwide.',
    contactPerson: 'John Smith',
    phone: '+1 (555) 123-4567'
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);

    // Simulate API call
    setTimeout(() => {
      setIsUpdating(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <h1 className="text-3xl font-bold text-gray-900">Vendor Profile</h1>
          <p className="text-gray-600 mt-1">Manage your organization's information and settings</p>
        </div>

        {/* Success Message */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <p className="text-green-800 font-medium">Profile updated successfully!</p>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Organization Name */}
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
                />
              </div>
            </div>

            {/* Email and Website */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  />
                </div>
              </div>

              <div>
                <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                    placeholder="https://your-website.com"
                  />
                </div>
              </div>
            </div>

            {/* Contact Person and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700 mb-2">
                  Contact Person
                </label>
                <input
                  type="text"
                  id="contactPerson"
                  name="contactPerson"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="Primary contact name"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Organization Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors resize-none"
                placeholder="Brief description of your organization and what you do..."
              />
            </div>

            {/* Wallet Information */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Wallet Information</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Connected Wallet</label>
                  <p className="font-mono text-sm text-gray-600 bg-white px-3 py-2 rounded-lg border">
                    0x1234567890abcdef1234567890abcdef12345678
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  This wallet is used for event creation and certificate issuance. Contact support to change your wallet address.
                </p>
              </div>
            </div>

            {/* Account Statistics */}
            <div className="bg-purple-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">12</p>
                  <p className="text-sm text-gray-600">Total Events</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">847</p>
                  <p className="text-sm text-gray-600">Certificates Issued</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">2,341</p>
                  <p className="text-sm text-gray-600">Total Attendees</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">6</p>
                  <p className="text-sm text-gray-600">Months Active</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                to="/vendor/dashboard"
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isUpdating}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none flex items-center space-x-2"
              >
                <Save className="h-5 w-5" />
                <span>{isUpdating ? 'Updating...' : 'Update Profile'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}