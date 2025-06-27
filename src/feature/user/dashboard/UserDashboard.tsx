import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, BarChart3, TrendingUp, User, CheckCircle, DoorOpen, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Event, fetchUserEvents } from '../events/services/MyeventServices';
import { Certificate } from '../certificates/types';
import { fetchCertificatesByWallet } from '../certificates/services/certificateService';
import { connectWallet, signMessage } from '../../auth/lib/wallet';
import { loginWithWallet } from '../../auth/services/authServices';
import { useState as useLocalState } from 'react';
import toast from 'react-hot-toast';
import { attendEventWithToken, isUserAsAttended } from '../events/services/AttendanceService';

export default function UserDashboard() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);
  // Attendance modal state
  const [attendanceModal, setAttendanceModal] = useLocalState<{ open: boolean; eventId: number | null }>({ open: false, eventId: null });
  const [attendanceToken, setAttendanceToken] = useLocalState('');
  const [attendedEvents, setAttendedEvents] = useLocalState<number[]>([]);

  // --- View All/Toggle Logic (VendorDashboard style) ---
  const [showAllEvents, setShowAllEvents] = useState(false);
  const INITIAL_DISPLAY_COUNT = 5;
  const displayedEvents = showAllEvents ? events : events.slice(0, INITIAL_DISPLAY_COUNT);
  const handleToggleViewEvents = () => setShowAllEvents(prev => !prev);

  useEffect(() => {
    if (!walletAddress) return;
    setLoadingEvents(true);
    fetchUserEvents(walletAddress)
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoadingEvents(false));
  }, [walletAddress]);

  useEffect(() => {
    if (!walletAddress) return;
    setLoadingCertificates(true);
    fetchCertificatesByWallet(walletAddress)
      .then((data) => setCertificates(Array.isArray(data) ? data : []))
      .catch(() => setCertificates([]))
      .finally(() => setLoadingCertificates(false));
  }, [walletAddress]);

  // --- Attendance check on mount for each event ---
  useEffect(() => {
    if (!walletAddress || events.length === 0) return;
    (async () => {
      const attended: number[] = [];
      for (const event of events) {
        try {
          const res = await isUserAsAttended(walletAddress, String(event.id));
          if (res.attended) attended.push(event.id);
        } catch {
          // ignore error, treat as not attended
        }
      }
      setAttendedEvents(attended);
    })();
  }, [walletAddress, events, setAttendedEvents]);

  // Stats
  const stats = {
    totalEvents: events.length,
    totalCertificates: certificates.length,
    activeEvents: events.filter(e => e.status === 'ongoing').length,
    // Example: count certificates minted this month (dummy logic)
    monthlyCertificates: certificates.length, // Replace with real logic if available
  };


  // Certificate Card
  const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <img 
            src={certificate.event_picture} 
            alt={certificate.event_title}
            className="w-12 h-12 rounded-lg object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://via.placeholder.com/48x48?text=Event';
            }}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 truncate">{certificate.event_title}</h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{certificate.event_description}</p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-400">
              {new Date(certificate.event_start_date).toLocaleDateString()}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              certificate.mint_status === 'minted' ? 'bg-green-100 text-green-800' :
              certificate.mint_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {certificate.mint_status.charAt(0).toUpperCase() + certificate.mint_status.slice(1)}
            </span>
          </div>
          {certificate.mint_transaction_hash && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Transaction:</p>
              <p className="text-xs text-blue-600 font-mono truncate">
                {certificate.mint_transaction_hash}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-gray-100">
        <a
          href="#"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
        >
          View Certificate →
        </a>
      </div>
    </div>
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <User className="mx-auto h-12 w-12 text-blue-600 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Welcome to Your Dashboard</h2>
          <p className="text-gray-600 mb-6">Please connect your wallet to view your dashboard.</p>
          {connectError && <p className="text-red-500 mb-2">{connectError}</p>}
          <button
            onClick={async () => {
              setConnectError(null);
              setIsConnecting(true);
              try {
                if (typeof window.ethereum === 'undefined') {
                  setConnectError('MetaMask is not installed. Please install it first.');
                  return;
                }
                const { signer, address } = await connectWallet();
                await signMessage(signer, `Login attempt at ${new Date().toISOString()}`);
                const data = await loginWithWallet(address);
                if (data.isNewUser) {
                  // Login parsial, role null
                  login(address, null);
                  // Navigasi ke halaman pemilihan role jika perlu
                  // navigate('/register'); // Uncomment jika ingin redirect otomatis
                } else {
                  login(address, data.role);
                }
              } catch (err: unknown) {
                if (err instanceof Error) {
                  setConnectError(err.message || 'Failed to connect wallet.');
                } else {
                  setConnectError('Failed to connect wallet.');
                }
              } finally {
                setIsConnecting(false);
              }
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
            disabled={isConnecting}
          >
            {isConnecting ? 'Connecting...' : 'Connect Wallet'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
              <p className="text-gray-600 mt-1">Welcome! Here is your activity summary and quick access to your features.</p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
              </div>
              <div className="bg-blue-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
              </div>
              <div className="bg-purple-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
              </div>
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates This Month</p>
                <p className="text-3xl font-bold text-gray-900">{stats.monthlyCertificates}</p>
              </div>
              <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* User Events Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Events</h2>
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
          {loadingEvents ? (
            <p>Loading events...</p>
          ) : (
            <div className="overflow-x-auto">
              {displayedEvents.length > 0 ? (
                <table className="w-full text-sm text-left text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">Event</th>
                      <th scope="col" className="px-6 py-3">Date</th>
                      <th scope="col" className="px-6 py-3">Status</th>
                      <th scope="col" className="px-6 py-3 text-center">View Detail</th>
                      <th scope="col" className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayedEvents.map((event) => {
                      // Determine button states and icons
                      const isWhitelist = event.status === 'upcoming' && event.user_status === 'registered';
                      const isAttended = attendedEvents.includes(event.id) || event.user_status === 'present' || event.user_status === 'claimed';
                      const isMinted = event.user_status === 'claimed';
                      const canAttend = event.status === 'ongoing' && !isAttended && !isWhitelist;
                      const canMint = (event.status === 'ended' || event.status === 'minting') && isAttended && !isMinted && !isWhitelist;
                      return (
                        <tr key={event.id} className="bg-white border-b hover:bg-gray-50">
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            <div>{event.title}</div>
                            <div className="text-xs text-gray-500">{event.location}</div>
                          </th>
                          <td className="px-6 py-4">{new Date(event.start_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                              event.status === 'ongoing' ? 'bg-green-100 text-green-800' :
                              event.status === 'minting' ? 'bg-purple-100 text-purple-800' :
                              event.status === 'ended' ? 'bg-gray-200 text-gray-800' :
                              'bg-gray-200 text-gray-800'
                            }`}>
                              {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center">
                            <Link
                              to={`/events/${event.id}`}
                              className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
                            >
                              View Detail
                            </Link>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center space-x-3">
                              {/* Attend Button */}
                              {isAttended ? (
                                <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-2">
                                  <CheckCircle className="h-5 w-5" />
                                </span>
                              ) : (
                                <button
                                  className={`inline-flex items-center justify-center bg-gray-100 text-blue-600 rounded-full p-2 transition-colors
                                    ${canAttend ? 'animate-pulse' : 'opacity-50 cursor-not-allowed'}`}
                                  disabled={!canAttend}
                                  title={canAttend ? 'Attend Event' : 'Cannot attend yet'}
                                  onClick={() => setAttendanceModal({ open: true, eventId: event.id })}
                                >
                                  <DoorOpen className={`h-5 w-5 ${canAttend ? 'animate-pulse text-green-600' : ''}`} />
                                </button>
                              )}
                              {/* Mint Button */}
                              {isMinted ? (
                                <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-2">
                                  <CheckCircle className="h-5 w-5" />
                                </span>
                              ) : (
                                <button
                                  className={`inline-flex items-center justify-center bg-gray-100 hover:bg-purple-100 text-purple-600 rounded-full p-2 transition-colors ${!canMint ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  disabled={!canMint}
                                  title={canMint ? 'Mint Certificate' : 'Cannot mint yet'}
                                >
                                  <Award className="h-5 w-5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto" />
                  <h3 className="mt-4 text-lg font-semibold text-gray-800">No Events Found</h3>
                  <p className="mt-1 text-gray-500">You haven't registered for any events yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">My Certificates</h2>
            <Link
              to="/my-certificates"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All Certificates
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Kiri: Sertifikat */}
            <div>
              {loadingCertificates ? (
                <p>Loading certificates...</p>
              ) : certificates.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {certificates.slice(0, 3).map((cert) => (
                    <CertificateCard key={cert.id} certificate={cert} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No certificates found.</p>
              )}
            </div>
            {/* Kanan: Verifikasi Sertifikat */}
            <div className="flex flex-col items-center justify-center h-full bg-purple-50 rounded-2xl p-6">
              <h3 className="text-lg font-bold text-purple-800 mb-2">Verify Certificate</h3>
              <p className="text-sm text-purple-700 mb-4 text-center">Check the authenticity of a certificate by entering its code.</p>
              <Link
                to="/user/verify"
                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                Go to Verification
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">My Profile</h3>
                <p className="text-sm text-gray-600">View and update your profile information</p>
              </div>
            </div>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6 group">
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Activity Statistics</h3>
                <p className="text-sm text-gray-600">See your event and certificate stats</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Token Modal */}
        {attendanceModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Enter Attendance Token</h3>
              <p className="mb-4 text-gray-600 text-sm">Ask the event vendor for your attendance token, then enter it below to mark your attendance.</p>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
                placeholder="Enter token..."
                value={attendanceToken}
                onChange={e => setAttendanceToken(e.target.value)}
                autoFocus
              />
              <div className="flex justify-end space-x-2">
                <button
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300"
                  onClick={() => { setAttendanceModal({ open: false, eventId: null }); setAttendanceToken(''); }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700"
                  onClick={async () => {
                    if (!attendanceToken.trim()) return;
                    try {
                      const res = await attendEventWithToken(attendanceToken.trim(), walletAddress ?? '');
                      toast.success(res.message || 'Attendance successful!');
                      setAttendedEvents([...attendedEvents, attendanceModal.eventId!]);
                      setAttendanceModal({ open: false, eventId: null });
                      setAttendanceToken('');
                    } catch (err: unknown) {
                      if (err instanceof Error) {
                        toast.error(err.message || 'Failed to mark attendance.');
                      } else {
                        toast.error('Failed to mark attendance.');
                      }
                    }
                  }}
                  disabled={!attendanceToken.trim()}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
