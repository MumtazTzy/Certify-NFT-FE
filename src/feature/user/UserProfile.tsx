import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Wallet } from 'lucide-react';
import { useAuth } from '../auth/hooks/useAuth';

export default function UserProfile() {
  const { walletAddress, user } = useAuth();
  // Simulasi: data profile, ganti dengan data asli jika ada backend
  const fullname = '-';
  const email = '-';
  const navigate = useNavigate();

  const formatAddress = (address?: string | null) =>
    address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
          <p className="text-gray-600 mt-1">View your profile information below.</p>
        </div>
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </button>
        </div>
        {/* Profile Info (Read Only) */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Wallet Address */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Wallet Address</label>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
              <Wallet className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-green-800 font-medium">Wallet Connected</p>
                <p className="text-green-600 text-sm font-mono">{walletAddress || <span className="italic text-gray-400">-</span>}</p>
              </div>
            </div>
          </div>
          {/* Full Name */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-800">{fullname || <span className="italic text-gray-400">-</span>}</span>
            </div>
          </div>
          {/* Email */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <div className="flex items-center bg-gray-50 border border-gray-200 rounded-lg p-3">
              <Mail className="h-5 w-5 text-gray-400 mr-2" />
              <span className="text-gray-800">{email || <span className="italic text-gray-400">-</span>}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 