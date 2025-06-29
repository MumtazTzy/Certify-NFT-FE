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
    attendedEvents: attendedEvents.length,
  };

  // Certificate Card
  const CertificateCard = ({ certificate }: { certificate: Certificate }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all duration-200 group">
      <div className="p-5">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="relative">
              <img 
                src={certificate.event_picture} 
                alt={certificate.event_title}
                className="w-16 h-16 rounded-lg object-cover shadow-sm"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://via.placeholder.com/64x64?text=Event';
                }}
              />
              <div className={`absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center ${
                certificate.mint_status === 'minted' ? 'bg-green-500' :
                certificate.mint_status === 'pending' ? 'bg-yellow-500' :
                'bg-red-500'
              }`}>
                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-semibold text-gray-900 group-hover:text-purple-700 transition-colors line-clamp-1">
              {certificate.event_title}
            </h3>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {certificate.event_description}
            </p>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-xs text-gray-500">{certificate.event_location}</span>
              </div>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                certificate.mint_status === 'minted' ? 'bg-green-100 text-green-800' :
                certificate.mint_status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {certificate.mint_status.charAt(0).toUpperCase() + certificate.mint_status.slice(1)}
              </span>
            </div>
            <div className="flex items-center mt-2">
              <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-500">
                {new Date(certificate.event_start_date).toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric', 
                  year: 'numeric' 
                })}
              </span>
            </div>
          </div>
        </div>
        
        {certificate.mint_transaction_hash && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Transaction Hash:</span>
              <span className="text-xs text-blue-600 font-mono truncate max-w-32">
                {certificate.mint_transaction_hash.slice(0, 8)}...{certificate.mint_transaction_hash.slice(-6)}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="px-5 pb-4">
        <div className="flex items-center justify-between">
          <button className="text-purple-600 hover:text-purple-700 text-sm font-medium group-hover:underline transition-colors">
            View Certificate
          </button>
          <div className="flex items-center space-x-2">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
            </button>
          </div>
        </div>
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
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
            <p className="text-gray-600">Welcome back! Here's your activity summary and quick access to your features.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalEvents}</p>
                <p className="text-xs text-gray-500 mt-1">Registered events</p>
              </div>
              <div className="bg-blue-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Total Certificates</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalCertificates}</p>
                <p className="text-xs text-gray-500 mt-1">Earned certificates</p>
              </div>
              <div className="bg-purple-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Active Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeEvents}</p>
                <p className="text-xs text-gray-500 mt-1">Currently ongoing</p>
              </div>
              <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Events Attended</p>
                <p className="text-3xl font-bold text-gray-900">{stats.attendedEvents}</p>
                <p className="text-xs text-gray-500 mt-1">Successfully attended</p>
              </div>
              <div className="bg-orange-50 w-12 h-12 rounded-xl flex items-center justify-center">
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
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading events...</span>
            </div>
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
                        <tr key={event.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
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
                              className="inline-flex items-center px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium shadow-sm transition-colors"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
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
                              ) : canMint ? (
                                <Link
                                  to={`/mint/${event.id}`}
                                  className="inline-flex items-center justify-center bg-gray-100 hover:bg-purple-100 text-purple-600 rounded-full p-2 transition-colors"
                                  title="Mint Certificate"
                                >
                                  <Award className="h-5 w-5" />
                                </Link>
                              ) : (
                                <button
                                  className="inline-flex items-center justify-center bg-gray-100 text-purple-600 rounded-full p-2 opacity-50 cursor-not-allowed"
                                  disabled
                                  title={!isAttended ? 'You must attend the event first' : 'Cannot mint yet'}
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
                <div className="text-center py-16">
                  <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                    <Calendar className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No Events Found</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto">
                    You haven't registered for any events yet. Start exploring events to build your certificate collection.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                      to="/events"
                      className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-colors font-medium"
                    >
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Events
                    </Link>
                    <Link
                      to="/profile"
                      className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                    >
                      <User className="w-5 h-5 mr-2" />
                      Update Profile
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Certificates Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">My Certificates</h2>
              <p className="text-sm text-gray-600 mt-1">Your earned certificates from completed events</p>
            </div>
            <Link
              to="/my-certificates"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm inline-flex items-center"
            >
              View All Certificates
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
          
          {loadingCertificates ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="ml-3 text-gray-600">Loading certificates...</span>
            </div>
          ) : certificates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {certificates.slice(0, 6).map((cert) => (
                <CertificateCard key={cert.id} certificate={cert} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No Certificates Yet</h3>
              <p className="text-gray-500 mb-6">Complete events and mint your certificates to see them here.</p>
              <Link
                to="/events"
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Browse Events
              </Link>
            </div>
          )}
        </div>

        {/* Certificate Verification Section */}
        <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Verify Certificate</h3>
              <p className="text-gray-600 mb-4">Check the authenticity of any certificate by entering its verification code or transaction hash.</p>
              <Link
                to="/user/verify"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all transform hover:scale-105"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Verify Certificate
              </Link>
            </div>
            <div className="hidden lg:block ml-8">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 rounded-full p-2">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Blockchain Verified</p>
                    <p className="text-xs text-gray-500">Immutable & Secure</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group border border-gray-100 hover:border-purple-200"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-xl flex items-center justify-center transition-colors">
                <User className="h-6 w-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">My Profile</h3>
                <p className="text-sm text-gray-600 mt-1">View and update your profile information</p>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 w-12 h-12 rounded-xl flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Activity Statistics</h3>
                <p className="text-sm text-gray-600 mt-1">See your event and certificate stats</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">{stats.totalEvents}</p>
                <p className="text-xs text-gray-500">Total Events</p>
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Token Modal */}
        {attendanceModal.open && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md mx-4 transform transition-all">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-50 rounded-full p-2">
                    <DoorOpen className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Mark Attendance</h3>
                    <p className="text-sm text-gray-500">Enter your attendance token</p>
                  </div>
                </div>
                <button
                  onClick={() => { setAttendanceModal({ open: false, eventId: null }); setAttendanceToken(''); }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Attendance Token
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter your token..."
                    value={attendanceToken}
                    onChange={e => setAttendanceToken(e.target.value)}
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Ask the event organizer for your attendance token
                  </p>
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-5 h-5 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-blue-900">How to get your token?</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Contact the event organizer or check your event details for the attendance token.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition-colors"
                  onClick={() => { setAttendanceModal({ open: false, eventId: null }); setAttendanceToken(''); }}
                >
                  Cancel
                </button>
                <button
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={async () => {
                    if (!attendanceToken.trim()) return;
                    try {
                      const res = await attendEventWithToken(attendanceToken.trim(), walletAddress ?? '');
                      toast.success(res.message || 'Attendance marked successfully!');
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
                  Mark Attendance
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
