import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Award, Users, BarChart3, Eye, Settings, TrendingUp } from 'lucide-react';

interface Event {
  id: string;
  title: string;
  date: string;
  status: 'upcoming' | 'active' | 'completed';
  attendees: number;
  certificates: number;
}

export default function VendorDashboard() {
  const stats = {
    totalEvents: 12,
    totalCertificates: 847,
    activeEvents: 3,
    monthlyGrowth: 23
  };

  const recentEvents: Event[] = [
    {
      id: '1',
      title: 'Web3 Development Workshop',
      date: '2024-04-15',
      status: 'upcoming',
      attendees: 45,
      certificates: 0
    },
    {
      id: '2',
      title: 'Blockchain Security Summit',
      date: '2024-04-10',
      status: 'active',
      attendees: 200,
      certificates: 150
    },
    {
      id: '3',
      title: 'DeFi Masterclass',
      date: '2024-03-28',
      status: 'completed',
      attendees: 150,
      certificates: 150
    },
    {
      id: '4',
      title: 'Smart Contract Audit Workshop',
      date: '2024-04-20',
      status: 'upcoming',
      attendees: 30,
      certificates: 0
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

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
              <Link
                to="/vendor/event/create"
                className="inline-flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                <Plus className="h-5 w-5" />
                <span>Create Event</span>
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
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+2 this month</span>
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
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+{stats.monthlyGrowth}% this month</span>
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
            <div className="mt-4">
              <span className="text-sm text-gray-600">Events in progress</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Attendees</p>
                <p className="text-3xl font-bold text-gray-900">2,341</p>
              </div>
              <div className="bg-orange-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600">+156 this month</span>
            </div>
          </div>
        </div>

        {/* Recent Events */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Events</h2>
            <Link
              to="/vendor/event/create"
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              View All Events
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Event</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Attendees</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Certificates</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentEvents.map(event => (
                  <tr key={event.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{event.title}</p>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{event.attendees}</td>
                    <td className="py-4 px-4 text-gray-600">{event.certificates}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/vendor/event/${event.id}`}
                          className="text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          <Settings className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/vendor/event/${event.id}/whitelist`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Users className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/vendor/event/${event.id}/minted`}
                          className="text-green-600 hover:text-green-700 transition-colors"
                        >
                          <Award className="h-4 w-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/vendor/event/create"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-purple-50 group-hover:bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                <Plus className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Create New Event</h3>
                <p className="text-sm text-gray-600">Set up a new certification event</p>
              </div>
            </div>
          </Link>

          <Link
            to="/vendor/profile"
            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all group"
          >
            <div className="flex items-center space-x-4">
              <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center transition-colors">
                <Settings className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Manage Profile</h3>
                <p className="text-sm text-gray-600">Update your vendor information</p>
              </div>
            </div>
          </Link>

          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center space-x-4">
              <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Analytics</h3>
                <p className="text-sm text-gray-600">View detailed event metrics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}