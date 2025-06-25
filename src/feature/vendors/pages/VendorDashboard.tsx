// src/pages/vendor/VendorDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Calendar, Award, Users, BarChart3, Settings, AlertCircle
} from 'lucide-react';

import { useAuth } from '../../auth/hooks/useAuth';
import { Event, DashboardStats, EventStatus } from '../types';
import { fetchVendorEvents } from '../services/DashboardServices';

const getStatusColor = (status: EventStatus) => {
  switch (status) {
    case 'upcoming': return 'bg-blue-100 text-blue-800';
    case 'active':
    case 'ongoing': return 'bg-green-100 text-green-800';
    case 'completed': return 'bg-gray-100 text-gray-800';
    case 'canceled': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

const StatCardSkeleton = () => (
  <div className="bg-white rounded-2xl shadow-lg p-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-8 bg-gray-300 rounded w-16"></div>
      </div>
      <div className="bg-gray-200 w-12 h-12 rounded-lg"></div>
    </div>
    <div className="mt-4 h-4 bg-gray-200 rounded w-20"></div>
  </div>
);

export default function VendorDashboard() {
  const { walletAddress, isAuthenticated } = useAuth(); // ✅ Fix: gunakan walletAddress
  const [events, setEvents] = useState<Event[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !walletAddress) {
      setLoading(false);
      setError("Please log in to view your dashboard.");
      return;
    }

    const loadDashboardData = async () => {
      try {
        const fetchedEvents = await fetchVendorEvents(walletAddress);
        setEvents(fetchedEvents);

        const totalAttendees = fetchedEvents.reduce((sum, event) => sum + event.attendees, 0);
        const activeEvents = fetchedEvents.filter(e => e.status === 'active' || e.status === 'ongoing').length;
        const totalCertificates = fetchedEvents.reduce((sum, event) => sum + (event.certificatesMinted || 0), 0);

        setStats({
          totalEvents: fetchedEvents.length,
          totalAttendees,
          activeEvents,
          totalCertificates,
        });
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        else setError('An unknown error occurred while fetching data.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [walletAddress, isAuthenticated]);

  const recentEvents = events.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Vendor Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome back! Here's what's happening with your events.</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/vendor/event/create" className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105">
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg mb-8 flex items-center space-x-3">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {loading ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />) : (
            <>
              <StatCard label="Total Events" value={stats?.totalEvents} icon={<Calendar className="h-6 w-6 text-blue-600" />} color="bg-blue-50" />
              <StatCard label="Total Certificates" value={stats?.totalCertificates} icon={<Award className="h-6 w-6 text-purple-600" />} color="bg-purple-50" />
              <StatCard label="Active Events" value={stats?.activeEvents} icon={<BarChart3 className="h-6 w-6 text-green-600" />} color="bg-green-50" />
              <StatCard label="Total Attendees" value={stats?.totalAttendees} icon={<Users className="h-6 w-6 text-orange-600" />} color="bg-orange-50" />
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Link to="/vendor/my-events" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
              View All
            </Link>
          </div>
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : recentEvents.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Event</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendees</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEvents.map(event => (
                    <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4 font-semibold text-gray-900">{event.title}</td>
                      <td className="py-4 px-4 text-gray-600">
                        {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                          {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-gray-600">{event.attendees} / {event.maxattendees}</td>
                      <td className="py-4 px-4">
                        <div className="flex items-center space-x-3">
                          <Link to={`/vendor/event/${event.id}`} className="text-purple-600 hover:text-purple-700">
                            <Settings className="h-5 w-5" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">You haven't created any events yet. Time to create your first one!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Optional: Extracted stat card for reusability
const StatCard = ({
  label,
  value,
  icon,
  color
}: {
  label: string;
  value: number | undefined;
  icon: React.ReactNode;
  color: string;
}) => (
  <div className="bg-white rounded-2xl shadow-lg p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-3xl font-bold text-gray-900">{value ?? '...'}</p>
      </div>
      <div className={`${color} w-12 h-12 rounded-lg flex items-center justify-center`}>
        {icon}
      </div>
    </div>
  </div>
);
