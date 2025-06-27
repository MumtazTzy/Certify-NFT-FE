import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, BarChart3, TrendingUp, User, CheckCircle, DoorOpen } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Event, fetchUserEvents } from '../events/services/MyeventServices';
import { Certificate, fetchCertificatesByWallet } from '../certificates/services/certificateService';
import { connectWallet, signMessage } from '../../auth/lib/wallet';
import { loginWithWallet } from '../../auth/services/authServices';
import { useState as useLocalState } from 'react';
import toast from 'react-hot-toast';

// Dummy token for simulation
const DUMMY_TOKEN = 'DUMMYTOKEN';

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
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold">{certificate.event_title}</h3>
      <p className="text-sm text-gray-500">{certificate.event_description}</p>
      <a
        href="#"
        className="text-blue-600 hover:underline mt-2 block"
      >
        View Details
      </a>
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
              } catch (err: any) {
                setConnectError(err.message || 'Failed to connect wallet.');
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
            <Link
              to="/myevents"
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm"
            >
              View All Events
            </Link>
          </div>
          {loadingEvents ? (
            <p>Loading events...</p>
          ) : events.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-xl shadow-lg">
                <thead>
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b">Event</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b">Date</th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 border-b">Status</th>
                    <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 border-b">View Detail</th>
                    <th className="py-3 px-6 text-center text-sm font-semibold text-gray-700 border-b">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {events.slice(0, 3).map((event) => {
                    // Determine button states and icons
                    const isWhitelist = event.status === 'upcoming' && event.user_status === 'registered';
                    const isAttended = attendedEvents.includes(event.id) || event.user_status === 'present' || event.user_status === 'claimed';
                    const isMinted = event.user_status === 'claimed';
                    const canAttend = event.status === 'ongoing' && !isAttended && !isWhitelist;
                    const canMint = (event.status === 'ended' || event.status === 'minting') && isAttended && !isMinted && !isWhitelist;
                    return (
                      <tr key={event.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-900">
                          <div>{event.title}</div>
                          <div className="text-xs text-gray-500">{event.location}</div>
                        </td>
                        <td className="py-4 px-6 text-gray-600">{new Date(event.start_date).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-gray-600 capitalize">{event.status}</td>
                        <td className="py-4 px-6 text-center">
                          <Link
                            to={`/events/${event.id}`}
                            className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors"
                          >
                            View Detail
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-center space-x-2">
                          {/* Attend Button */}
                          {isAttended ? (
                            <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-2"><CheckCircle className="h-5 w-5" /></span>
                          ) : (
                            <button
                              className={`inline-flex items-center justify-center bg-gray-100 hover:bg-blue-100 text-blue-600 rounded-full p-2 transition-colors ${!canAttend ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!canAttend}
                              title={canAttend ? 'Attend Event' : 'Cannot attend yet'}
                              onClick={() => setAttendanceModal({ open: true, eventId: event.id })}
                            >
                              <DoorOpen className="h-5 w-5" />
                            </button>
                          )}
                          {/* Mint Button */}
                          {isMinted ? (
                            <span className="inline-flex items-center justify-center bg-green-100 text-green-600 rounded-full p-2"><CheckCircle className="h-5 w-5" /></span>
                          ) : (
                            <button
                              className={`inline-flex items-center justify-center bg-gray-100 hover:bg-purple-100 text-purple-600 rounded-full p-2 transition-colors ${!canMint ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={!canMint}
                              title={canMint ? 'Mint Certificate' : 'Cannot mint yet'}
                            >
                              <Award className="h-5 w-5" />
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No events found.</p>
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
                  onClick={() => {
                    if (attendanceToken.trim() === DUMMY_TOKEN) {
                      setAttendedEvents([...attendedEvents, attendanceModal.eventId!]);
                      toast.success('Attendance successful!');
                      setAttendanceModal({ open: false, eventId: null });
                      setAttendanceToken('');
                    } else {
                      toast.error('Invalid token. Please try again.');
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
