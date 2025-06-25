import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Award, 
  Users, 
  BarChart3, 
  Settings, 
  AlertTriangle 
} from 'lucide-react';

import { useAuth } from '../../auth/hooks/useAuth';
import { fetchVendorEvents } from '../services/DashboardServices';
import { Event } from '../types'; // Pastikan path ini benar

// Komponen Loading & Error tidak berubah, sudah sangat baik.
const DashboardLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">Loading Vendor Dashboard...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
    <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center my-8">
        <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-red-800">Failed to Load Data</h3>
        <p className="text-red-700 mt-2">{message}</p>
    </div>
);

export default function VendorDashboard() {
  const { walletAddress } = useAuth();
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      setError("Could not find wallet address. Please try logging in again.");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const fetchedEvents = await fetchVendorEvents(walletAddress);
        setEvents(fetchedEvents);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'An unknown error occurred.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [walletAddress]);

  // ✅ Kalkulasi statistik disesuaikan dengan field API yang baru (`minted`)
  const stats = useMemo(() => {
    const totalEvents = events.length;
    // Gunakan `event.minted` bukan `event.certificates`
    const totalCertificates = events.reduce((sum, event) => sum + event.minted, 0); 
    const activeEvents = events.filter(event => event.status === 'active').length;
    const totalAttendees = events.reduce((sum, event) => sum + event.attendees, 0);
    return { totalEvents, totalCertificates, activeEvents, totalAttendees };
  }, [events]);

  const getStatusColor = (status: Event['status']) => {
    const colors = {
      // Status Positif / Netral
      upcoming: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      ongoing: 'bg-green-100 text-green-800', // Diperlakukan sama seperti 'active'
      
      // Status Proses Khusus
      minting: 'bg-purple-100 text-purple-800', // Warna unik untuk proses minting
      
      // Status Selesai / Negatif
      completed: 'bg-gray-200 text-gray-800', // Netral, selesai
      canceled: 'bg-red-100 text-red-800',   // Dibatalkan, butuh perhatian
    };
    // Mengembalikan warna yang sesuai, atau warna 'completed' jika status tidak terduga
    return colors[status] || colors.completed;
  };
  
  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header tidak berubah */}
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
        
        {error && <ErrorMessage message={error} />}

        {!error && (
            <>
                {/* ✅ Stats Grid diperbarui dengan data dinamis */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Events</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                      </div>
                      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center"><Calendar className="h-6 w-6 text-blue-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Certificates Minted</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
                      </div>
                      <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center"><Award className="h-6 w-6 text-purple-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Active Events</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
                      </div>
                      <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center"><BarChart3 className="h-6 w-6 text-green-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                        <p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p>
                      </div>
                      <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center"><Users className="h-6 w-6 text-orange-600" /></div>
                    </div>
                  </div>
                </div>

                {/* ✅ Tabel Event diperbarui dengan data dinamis yang benar */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
                    <Link to="/vendor/events/all" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">View All Events</Link>
                  </div>

                  <div className="overflow-x-auto">
                    {events.length > 0 ? (
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">Event</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Attendees</th>
                            <th scope="col" className="px-6 py-3 text-center">Minted</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {events.slice(0, 4).map(event => (
                            <tr key={event.id} className="bg-white border-b hover:bg-gray-50">
                              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{event.title}</th>
                              <td className="px-6 py-4">
                                {/* Gunakan `event.start_date` */}
                                {new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                              </td>
                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-center">{event.attendees}</td>
                              {/* Gunakan `event.minted` */}
                              <td className="px-6 py-4 text-center">{event.minted}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-3">
                                  <Link to={`/vendor/event/${event.id}`} className="text-purple-600 hover:text-purple-700" title="Manage Event"><Settings className="h-5 w-5" /></Link>
                                  <Link to={`/vendor/event/${event.id}/whitelist`} className="text-blue-600 hover:text-blue-700" title="Manage Whitelist"><Users className="h-5 w-5" /></Link>
                                  <Link to={`/vendor/event/${event.id}/minted`} className="text-green-600 hover:text-green-700" title="View Minted Certificates"><Award className="h-5 w-5" /></Link>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="text-center py-12">
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                        <h3 className="mt-4 text-lg font-semibold text-gray-800">No Events Found</h3>
                        <p className="mt-1 text-gray-500">Get started by creating your first event.</p>
                        <Link to="/vendor/event/create" className="mt-6 inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg font-semibold">
                          <Plus className="h-5 w-5" />
                          <span>Create Event</span>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Actions - Diimplementasikan Penuh */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link
                    to="/vendor/event/create"
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"
                  >
                    <div className="bg-purple-50 group-hover:bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <Plus className="h-6 w-6 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Create New Event</h3>
                      <p className="text-sm text-gray-600">Set up a new certification event.</p>
                    </div>
                  </Link>

                  <Link
                    to="/vendor/profile"
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"
                  >
                    <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <Settings className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Manage Profile</h3>
                      <p className="text-sm text-gray-600">Update your vendor information.</p>
                    </div>
                  </Link>

                  <Link
                    to="/vendor/analytics"
                    className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"
                  >
                    <div className="bg-green-50 group-hover:bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                      <BarChart3 className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Analytics</h3>
                      <p className="text-sm text-gray-600">View detailed event metrics.</p>
                    </div>
                  </Link>
                </div>
            </>
        )}
      </div>
    </div>
  );
}