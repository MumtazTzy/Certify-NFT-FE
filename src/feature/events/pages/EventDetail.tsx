import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Clock, Award, ArrowLeft, ExternalLink } from 'lucide-react';

export default function EventDetail() {
  const { id } = useParams();
  const [timeLeft, setTimeLeft] = useState({
    days: 5,
    hours: 12,
    minutes: 34,
    seconds: 22
  });

  // Mock countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        const newTime = { ...prevTime };
        
        // Decrease seconds
        if (newTime.seconds > 0) {
          newTime.seconds -= 1;
        } else {
          newTime.seconds = 59;
          
          // Decrease minutes
          if (newTime.minutes > 0) {
            newTime.minutes -= 1;
          } else {
            newTime.minutes = 59;
            
            // Decrease hours
            if (newTime.hours > 0) {
              newTime.hours -= 1;
            } else {
              newTime.hours = 23;
              
              // Decrease days
              if (newTime.days > 0) {
                newTime.days -= 1;
              }
            }
          }
        }
        
        return newTime;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(timer);
  }, []);

  // Mock event data
  const event = {
    id: id,
    title: 'Web3 Development Workshop',
    date: '2024-04-15',
    location: 'Virtual Event',
    status: 'upcoming' as 'upcoming' | 'closed' | 'minting',
    attendees: 45,
    maxAttendees: 100,
    description: 'Join us for an intensive Web3 development workshop where you will learn the fundamentals of blockchain development, smart contract programming, and decentralized application (dApp) creation. This hands-on workshop is perfect for developers looking to enter the Web3 space.',
    image: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=800',
    organizer: 'Blockchain Education Foundation',
    requirements: [
      'Basic programming knowledge (JavaScript recommended)',
      'Laptop with internet connection',
      'MetaMask wallet installed',
      'Enthusiasm to learn!'
    ],
    agenda: [
      { time: '9:00 AM', topic: 'Introduction to Web3 & Blockchain Fundamentals' },
      { time: '10:30 AM', topic: 'Setting up Development Environment' },
      { time: '12:00 PM', topic: 'Lunch Break' },
      { time: '1:00 PM', topic: 'Smart Contract Development with Solidity' },
      { time: '3:00 PM', topic: 'Building Your First DApp' },
      { time: '4:30 PM', topic: 'Deployment and Testing' },
      { time: '5:30 PM', topic: 'Q&A and Certificate Ceremony' }
    ]
  };

  const getStatusDisplay = () => {
    switch(event.status) {
      case 'upcoming':
        return (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-8 flex items-center justify-center">
              <Clock className="h-5 w-5 mr-2" />
              Event Starts In
            </h3>

            <div className="grid grid-cols-4 gap-3 mb-8">
              {Object.entries(timeLeft).map(([unit, value]) => (
                <div key={unit} className="flex flex-col items-center">
                  <div className="bg-white rounded-2xl shadow-md border border-blue-100 w-full px-4 py-4 flex flex-col items-center justify-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-blue-600">{value}</div>
                    <div className="mt-1 text-wrap text-xs font-semibold text-blue-700 tracking-wide uppercase">{unit}</div>
                  </div>
                </div>
              ))}
            </div>

            <Link
              to={`/whitelist/${event.id}`}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 px-4 rounded-lg font-semibold text-center transition-all"
            >
              Join Whitelist
            </Link>
          </div>
        );
      case 'closed':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Event Completed
            </h3>
            <p className="text-gray-700 mb-4">
              This event has ended and certificate minting is now closed.
            </p>
            <button
              disabled
              className="w-full bg-gray-300 text-gray-500 py-3 px-4 rounded-lg font-semibold cursor-not-allowed"
            >
              Minting Closed
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/events"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Events</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-8">
            {/* Event Hero */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {event.title}
                  </h1>
                  <p className="text-white/90">
                    by {event.organizer}
                  </p>
                </div>
              </div>
            </div>

            {/* Event Details */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Event Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
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
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600">{event.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Attendees</p>
                    <p className="text-gray-600">{event.attendees}/{event.maxAttendees} registered</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Certificate</p>
                    <p className="text-gray-600">NFT Certificate included</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">About This Event</h3>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements</h3>
              <ul className="space-y-2">
                {event.requirements.map((req, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <span className="text-gray-700">{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Agenda */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Agenda</h3>
              <div className="space-y-4">
                {event.agenda.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-b-0">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-sm font-semibold">
                      {item.time}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900 font-medium">{item.topic}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            {/* Status Card */}
            {getStatusDisplay()}

            {/* Event Stats */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Registration</span>
                    <span className="font-semibold">{Math.round((event.attendees / event.maxAttendees) * 100)}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(event.attendees / event.maxAttendees) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-semibold">{event.attendees}</span> registered</p>
                    <p><span className="font-semibold">{event.maxAttendees - event.attendees}</span> spots remaining</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Share */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Event</h3>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2">
                <ExternalLink className="h-5 w-5" />
                <span>Copy Link</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}