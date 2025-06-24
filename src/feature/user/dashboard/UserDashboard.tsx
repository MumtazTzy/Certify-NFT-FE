import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Award, Users, BarChart3, Settings, TrendingUp, User } from 'lucide-react';
import { useAuth } from '../../auth/hooks/useAuth';
import { Event, fetchUserEvents } from '../events/services/MyeventServices';
import { Certificate, fetchCertificatesByWallet } from '../certificates/services/certificateService';

export default function UserDashboard() {
  const { isAuthenticated, walletAddress, login } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [loadingCertificates, setLoadingCertificates] = useState(false);

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

  // Event Card
  const EventCard = ({ event }: { event: Event }) => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-1">{event.title}</h3>
      <p className="text-sm text-gray-500 mb-3">{event.description}</p>
      <div className="flex flex-col gap-1 text-sm text-gray-600 mb-3">
        <span className="flex items-center gap-1">
          <Calendar className="w-4 h-4" />
          {new Date(event.start_date).toLocaleDateString()}
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-4 h-4" />
          {event.attendees}/{event.maxattendees} attendees
        </span>
      </div>
      <Link
        to={`/events/${event.id}`}
        className="text-blue-600 hover:underline block"
      >
        View Details
      </Link>
    </div>
  );

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
          <button
            onClick={() => {
              // Simulasi: ganti dengan real wallet connect logic
              const dummyToken = 'dummyToken';
              const dummyAddress = '0x12d7A5E92D17dcb068e512660B24A9A3072a755e';
              login(dummyToken, dummyAddress);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Connect Wallet
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
            <div className="mt-4 md:mt-0">
              <Link
                to="/profile"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Settings className="h-5 w-5" />
                <span>Manage Profile</span>
              </Link>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            to="/profile"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Profile</h3>
                <p className="text-sm text-gray-600">Update your personal information</p>
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
      </div>
    </div>
  );
}
