// src/components/whitelist/WhitelistStats.tsx

import { Users, X } from 'lucide-react';

interface Props {
  total: number;
  active: number;
  revoked: number;
}

export default function WhitelistStats({ total, active, revoked }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Registered</p>
            <p className="text-3xl font-bold text-gray-900">{total}</p>
          </div>
          <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
            <Users className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Active</p>
            <p className="text-3xl font-bold text-green-600">{active}</p>
          </div>
          <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-green-600 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Revoked</p>
            <p className="text-3xl font-bold text-red-600">{revoked}</p>
          </div>
          <div className="bg-red-50 w-12 h-12 rounded-lg flex items-center justify-center">
            <X className="h-6 w-6 text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}