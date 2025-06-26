// src/feature/vendors/pages/VendorDashboard.tsx

import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  Calendar, 
  Award, 
  Users, 
  BarChart3, 
  Settings, 
  AlertTriangle,
  ClipboardList,
  Eye, 
  EyeOff 
} from 'lucide-react';

import { useAuth } from '../../auth/hooks/useAuth';
import { fetchVendorEvents } from '../services/DashboardServices'; 
import { Event } from '../types'; 

// --- Komponen Helper (Tidak ada perubahan) ---
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

// --- Komponen Halaman Utama ---
export default function VendorDashboard() {
  const { user } = useAuth();
  const walletAddress = user?.walletAddress;
  
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showAllEvents, setShowAllEvents] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;

  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      setError("Could not find wallet address. Please try logging in again.");
      return;
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        const baseEvents: Event[] = await fetchVendorEvents(walletAddress); // Pastikan fetchVendorEvents mengembalikan Event[]

        // --- Langkah Pengurutan ---
        // Pastikan baseEvents adalah array sebelum mencoba sort
        if (!Array.isArray(baseEvents)) {
            console.error("fetchVendorEvents did not return an array:", baseEvents);
            setEvents([]); // Atur ke array kosong atau tangani error
            setError("Failed to load events data in expected format.");
            setIsLoading(false);
            return;
        }

        const sortedEvents = [...baseEvents].sort((a, b) => { // Buat salinan sebelum sort untuk menghindari mutasi state (jika baseEvents adalah state)
          // Penanganan jika start_date bisa null/undefined atau bukan string tanggal valid
          const timeA = a.start_date ? new Date(a.start_date).getTime() : 0;
          const timeB = b.start_date ? new Date(b.start_date).getTime() : 0;

          // Jika salah satu tanggal tidak valid (getTime() menghasilkan NaN), perlakukan sebagai tanggal yang lebih lama
          if (isNaN(timeA) && isNaN(timeB)) return 0; // Keduanya tidak valid, anggap sama
          if (isNaN(timeA)) return 1;  // Anggap a lebih lama (pindahkan ke akhir untuk descending)
          if (isNaN(timeB)) return -1; // Anggap b lebih lama (pindahkan ke akhir untuk descending)

          return timeB - timeA; // timeB - timeA untuk descending (terbaru dulu)
        });
        // --- Akhir Langkah Pengurutan ---

        // Debugging: Cetak beberapa event pertama setelah diurutkan
        console.log("Sorted Events (first 3):", sortedEvents.slice(0, 10).map(e => ({ title: e.title, start_date: e.start_date })));

        const eventsWithData = await Promise.all(
          sortedEvents.map(async (event) => { // Gunakan sortedEvents di sini
            let whitelistedCount = 0;
            try {
              const res = await fetch(`https://api.gpadaka.com/api3/api/events/${event.id}/whitelist`);
              if (res.ok) {
                const whitelistData = await res.json();
                whitelistedCount = Array.isArray(whitelistData) 
                                   ? whitelistData.length 
                                   : (whitelistData?.count || whitelistData?.data?.length || 0);
              } else {
                console.warn(`Failed to fetch whitelist for event ${event.id}: ${res.status}`);
              }
            } catch (e) {
              console.error(`Error fetching whitelist for event ${event.id}:`, e);
            }
            return { 
                ...event, 
                whitelisted_count: event.whitelisted_count ?? whitelistedCount,
                certificates_minted: event.certificates_minted ?? 0,
            };
          })
        );
        
        setEvents(eventsWithData);
        setError(null);
      } catch (err: any) {
        console.error("Error in loadData:", err);
        setError(err.message || 'An unknown error occurred while loading data.');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [walletAddress]);

  // ... (sisa kode komponen tetap sama: stats, getStatusColor, handleToggleViewEvents, displayedEvents, JSX)
  const stats = useMemo(() => {
    if (!events) return { totalEvents: 0, totalCertificates: 0, totalAttendees: 0, totalWhitelisted: 0, activeEvents: 0 };
    
    const totalEvents = events.length;
    const totalCertificates = events.reduce((sum, event) => sum + (event.certificates_minted || 0), 0); 
    const totalAttendees = events.reduce((sum, event) => sum + (event.attendees || 0), 0);
    const totalWhitelisted = events.reduce((sum, event) => sum + (event.whitelisted_count || 0), 0);
    const activeEvents = events.filter(event => event.status === 'upcoming' || event.status === 'ongoing' || event.status === 'minting').length;

    return { totalEvents, totalCertificates, totalAttendees, totalWhitelisted, activeEvents };
  }, [events]);

  const getStatusColor = (status: Event['status']) => {
    const colors: Record<Event['status'], string> = {
      upcoming: 'bg-blue-100 text-blue-800',
      ongoing: 'bg-green-100 text-green-800',
      minting: 'bg-purple-100 text-purple-800',
      completed: 'bg-gray-200 text-gray-800',
      ended: 'bg-gray-200 text-gray-800',
      canceled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.completed;
  };

  const handleToggleViewEvents = () => {
    setShowAllEvents(prev => !prev);
  };

  const displayedEvents = useMemo(() => {
    if (showAllEvents) {
      return events; // events sudah diurutkan saat di-load
    }
    return events.slice(0, INITIAL_DISPLAY_COUNT); // events.slice juga akan mengambil dari array yang sudah diurutkan
  }, [events, showAllEvents]);
  
  if (isLoading) {
    return <DashboardLoading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-gray-600">Total Events</p><p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p></div>
                      <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center"><Calendar className="h-6 w-6 text-blue-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-gray-600">Active Events</p><p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p></div>
                      <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center"><BarChart3 className="h-6 w-6 text-green-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-gray-600">Total Whitelisted</p><p className="text-3xl font-bold text-gray-900">{stats.totalWhitelisted}</p></div>
                      <div className="bg-teal-50 w-12 h-12 rounded-lg flex items-center justify-center"><ClipboardList className="h-6 w-6 text-teal-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-gray-600">Total Attendees</p><p className="text-3xl font-bold text-gray-900">{stats.totalAttendees}</p></div>
                      <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center"><Users className="h-6 w-6 text-orange-600" /></div>
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex items-center justify-between">
                      <div><p className="text-sm font-medium text-gray-600">Total Minted</p><p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p></div>
                      <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center"><Award className="h-6 w-6 text-purple-600" /></div>
                    </div>
                  </div>
                </div>

                {/* Tabel Event */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Your Events</h2>
                    {events.length > INITIAL_DISPLAY_COUNT && (
                        <button 
                            onClick={handleToggleViewEvents} 
                            className="text-purple-600 hover:text-purple-700 font-semibold text-sm inline-flex items-center"
                        >
                            {showAllEvents ? (
                                <>
                                    <EyeOff className="h-4 w-4 mr-1" />
                                    View Less
                                </>
                            ) : (
                                <>
                                    <Eye className="h-4 w-4 mr-1" />
                                    View All Events ({events.length})
                                </>
                            )}
                        </button>
                    )}
                  </div>
                  <div className="overflow-x-auto">
                    {displayedEvents.length > 0 ? (
                      <table className="w-full text-sm text-left text-gray-500">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3">Event</th>
                            <th scope="col" className="px-6 py-3">Date</th>
                            <th scope="col" className="px-6 py-3">Status</th>
                            <th scope="col" className="px-6 py-3 text-center">Whitelisted</th>
                            <th scope="col" className="px-6 py-3 text-center">Attendees</th>
                            <th scope="col" className="px-6 py-3 text-center">Minted</th>
                            <th scope="col" className="px-6 py-3 text-center">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {displayedEvents.map(event => (
                            <tr key={event.id} className="bg-white border-b hover:bg-gray-50">
                              <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{event.title}</th>
                              <td className="px-6 py-4">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                              <td className="px-6 py-4"><span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>{event.status.charAt(0).toUpperCase() + event.status.slice(1)}</span></td>
                              <td className="px-6 py-4 text-center font-medium">{event.whitelisted_count || 0}</td>
                              <td className="px-6 py-4 text-center font-medium">{event.attendees || 0}</td>
                              <td className="px-6 py-4 text-center font-medium text-purple-600">{event.certificates_minted || 0}</td>
                              <td className="px-6 py-4">
                                <div className="flex items-center justify-center space-x-3">
                                  <Link to={`/vendor/event/${event.id}`} className="text-purple-600 hover:text-purple-700" title="Manage Event"><Settings className="h-5 w-5" /></Link>
                                  <Link to={`/vendor/event/${event.id}/whitelist`} className="text-blue-600 hover:text-blue-700" title="Manage Whitelist"><Users className="h-5 w-5" /></Link>
                                  <Link to={`/vendor/event/${event.id}/minted-certificates`} className="text-green-600 hover:text-green-700" title="View Minted Certificates"><Award className="h-5 w-5" /></Link>
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

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Link to="/vendor/event/create" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"><div className="bg-purple-50 group-hover:bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors"><Plus className="h-6 w-6 text-purple-600" /></div><div><h3 className="font-semibold text-gray-900">Create New Event</h3><p className="text-sm text-gray-600">Set up a new certification event.</p></div></Link>
                  <Link to="/vendor/profile" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"><div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors"><Settings className="h-6 w-6 text-blue-600" /></div><div><h3 className="font-semibold text-gray-900">Manage Profile</h3><p className="text-sm text-gray-600">Update your vendor information.</p></div></Link>
                  <Link to="/vendor/analytics" className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group flex items-center space-x-4"><div className="bg-green-50 group-hover:bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors"><BarChart3 className="h-6 w-6 text-green-600" /></div><div><h3 className="font-semibold text-gray-900">Analytics</h3><p className="text-sm text-gray-600">View detailed event metrics.</p></div></Link>
                </div>
            </>
        )}
      </div>
    </div>
  );
}