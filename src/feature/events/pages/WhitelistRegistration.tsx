import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Wallet, CheckCircle, ArrowLeft, Award } from 'lucide-react';

export default function WhitelistRegistration() {
  const { eventId } = useParams();
  const [isConnected, setIsConnected] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Mock event data
  const event = {
    id: eventId,
    title: 'Web3 Development Workshop',
    date: '2024-04-15',
    location: 'Virtual Event',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=400'
  };

  const handleWalletConnect = () => {
    setIsConnected(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return;
    
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              You're Whitelisted! 🎉
            </h1>
            
            <p className="text-gray-600 mb-6">
              Congratulations! You've been successfully added to the whitelist for <strong>{event.title}</strong>.
            </p>
            
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
              <ul className="text-sm text-blue-800 space-y-1 text-left">
                <li>• Attend the event on {new Date(event.date).toLocaleDateString()}</li>
                <li>• Receive your unique token code during/after the event</li>
                <li>• Use the token code to mint your NFT certificate</li>
              </ul>
            </div>
            
            <div className="space-y-3">
              <Link
                to={`/events/${event.id}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-all"
              >
                Back to Event
              </Link>
              
              <Link
                to="/events"
                className="w-full border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-3 px-4 rounded-lg font-semibold transition-all"
              >
                Browse More Events
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <Link
            to={`/events/${eventId}`}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to event</span>
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Event Preview */}
          <div className="mb-6">
            <div className="relative h-32 rounded-xl overflow-hidden mb-4">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              <div className="absolute bottom-2 left-3 right-3">
                <h2 className="text-white font-bold text-lg">{event.title}</h2>
              </div>
            </div>
          </div>

          <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Join Whitelist
            </h1>
            <p className="text-gray-600">
              Register your wallet to be eligible for this event's certificate
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Wallet Connection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Connect Your Wallet
              </label>
              {!isConnected ? (
                <button
                  type="button"
                  onClick={handleWalletConnect}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
                >
                  <Wallet className="h-5 w-5" />
                  <span>Connect Wallet</span>
                </button>
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="text-green-800 font-medium">Wallet Connected</p>
                    <p className="text-green-600 text-sm">0x1234...5678</p>
                  </div>
                </div>
              )}
            </div>

            {/* Event Details */}
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
              <div className="space-y-1 text-sm text-gray-600">
                <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString('en-US', { 
                  weekday: 'long',
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><span className="font-medium">Location:</span> {event.location}</p>
                <p><span className="font-medium">Certificate:</span> NFT Certificate included</p>
              </div>
            </div>

            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">📝 Important Note</h3>
              <p className="text-sm text-yellow-800">
                Being whitelisted doesn't guarantee a certificate. You must attend the event and receive a token code to mint your certificate.
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!isConnected}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none"
            >
              Join Whitelist
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}