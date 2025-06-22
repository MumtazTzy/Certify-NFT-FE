import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Users, Award, Settings, Trash2, Edit, Play, Pause } from 'lucide-react';

export default function ManageEvent() {
  const { id } = useParams();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Mock event data
  const event = {
    id: id,
    title: 'Web3 Development Workshop',
    date: '2024-04-15',
    location: 'Virtual Event',
    description: 'Join us for an intensive Web3 development workshop where you will learn the fundamentals of blockchain development, smart contract programming, and decentralized application (dApp) creation.',
    maxAttendees: 100,
    currentAttendees: 45,
    certificatesMinted: 0,
    status: 'upcoming' as const,
    mintingActive: false,
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const handleActivateMinting = () => {
    // Handle minting activation
    console.log('Activating minting for event:', id);
  };

  const handleDeleteEvent = () => {
    // Handle event deletion
    console.log('Deleting event:', id);
    setShowDeleteModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/vendor/dashboard"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Event</h1>
              <p className="text-gray-600 mt-1">{event.title}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center space-x-3">
              <button className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={() => setShowDeleteModal(true)}
                className="inline-flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Date</p>
                    <p className="text-gray-600">
                      {new Date(event.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Attendees</p>
                    <p className="text-gray-600">{event.currentAttendees}/{event.maxAttendees} registered</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="font-semibold text-gray-900">Certificates</p>
                    <p className="text-gray-600">{event.certificatesMinted} minted</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-6">
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700 leading-relaxed">{event.description}</p>
              </div>
            </div>

            {/* Event Image */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Event Image</h2>
              <div className="relative h-48 rounded-xl overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Status</h3>
              
              <div className="space-y-4">
                <div>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    event.status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                    event.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                  </span>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Certificate Minting</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-sm ${event.mintingActive ? 'text-green-600' : 'text-gray-600'}`}>
                      {event.mintingActive ? 'Active' : 'Inactive'}
                    </span>
                    <button
                      onClick={handleActivateMinting}
                      className={`inline-flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                        event.mintingActive 
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {event.mintingActive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                      <span>{event.mintingActive ? 'Deactivate' : 'Activate'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  to={`/vendor/event/${event.id}/whitelist`}
                  className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Users className="h-4 w-4" />
                  <span>View Whitelist</span>
                </Link>

                <Link
                  to={`/vendor/event/${event.id}/minted`}
                  className="w-full bg-green-50 hover:bg-green-100 text-green-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Award className="h-4 w-4" />
                  <span>View Minted Certificates</span>
                </Link>

                <button className="w-full bg-purple-50 hover:bg-purple-100 text-purple-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                  <Settings className="h-4 w-4" />
                  <span>Edit Metadata</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistics</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registration Rate</span>
                  <span className="font-semibold">{Math.round((event.currentAttendees / event.maxAttendees) * 100)}%</span>
                </div>
                
                <div className="bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(event.currentAttendees / event.maxAttendees) * 100}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-gray-600">Spots Remaining</span>
                  <span className="font-semibold">{event.maxAttendees - event.currentAttendees}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Delete Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md mx-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Delete Event</h3>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{event.title}"? This action cannot be undone and will remove all associated data.
              </p>
              <div className="flex items-center justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteEvent}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  Delete Event
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}