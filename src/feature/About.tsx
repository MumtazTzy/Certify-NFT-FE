import React from 'react';
import { Shield, Award, Users, Globe, CheckCircle, Zap, Lock } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: <Shield className="h-6 w-6" />,
      title: 'Blockchain Security',
      description: 'All certificates are secured on the blockchain, making them tamper-proof and permanently verifiable.'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'NFT Certificates',
      description: 'Recipients truly own their certificates as NFTs, which can be displayed, traded, or verified anywhere.'
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Verification',
      description: 'Anyone can verify certificate authenticity instantly using just the token ID.'
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: 'Easy Management',
      description: 'Vendors can easily create events, manage whitelists, and track certificate issuance.'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Global Accessibility',
      description: 'Accessible worldwide with just a crypto wallet - no complex registration required.'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Decentralized',
      description: 'No central authority controls your certificates - they exist permanently on the blockchain.'
    }
  ];

  const stats = [
    { number: '10,000+', label: 'Certificates Issued' },
    { number: '500+', label: 'Events Hosted' },
    { number: '100+', label: 'Organizations' },
    { number: '50+', label: 'Countries' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg"></div>
                <Shield className="relative h-16 w-16 text-blue-600" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              About
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Certify
              </span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Revolutionizing digital credentials through blockchain technology, making certificates truly owned, instantly verifiable, and permanently secure.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                We believe that digital credentials should be owned by the people who earn them, not controlled by centralized institutions. Certify empowers individuals and organizations to issue, manage, and verify certificates on the blockchain.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">True Ownership</h4>
                    <p className="text-gray-600">Recipients own their certificates as NFTs forever</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Global Verification</h4>
                    <p className="text-gray-600">Instant verification anywhere in the world</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Decentralized Trust</h4>
                    <p className="text-gray-600">No single point of failure or control</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="grid grid-cols-2 gap-6">
                  {stats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold mb-2">{stat.number}</div>
                      <div className="text-sm text-white/80">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Certify?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built with cutting-edge blockchain technology to provide the most secure and user-friendly certificate platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="bg-blue-50 group-hover:bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center text-blue-600 mb-6 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to issue and receive blockchain certificates
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Create Event</h3>
              <p className="text-gray-600">
                Organizations create events and set up certificate templates on our platform
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-purple-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Attend & Participate</h3>
              <p className="text-gray-600">
                Users register for events, attend, and receive unique token codes upon completion
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-green-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Mint Certificate</h3>
              <p className="text-gray-600">
                Use the token code to mint your NFT certificate, which you own forever
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Built for the Future
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Certify represents the next evolution in digital credentials, combining the security of blockchain with the ease of modern web applications.
            </p>
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-white text-center">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Ready to Transform Your Certificates?
            </h3>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join the blockchain revolution and start issuing tamper-proof, verifiable certificates today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/register"
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
              >
                Get Started
              </a>
              <a
                href="/events"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Browse Events
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}