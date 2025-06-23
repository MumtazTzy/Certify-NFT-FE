import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Award, Users, CheckCircle, ArrowRight, Zap, Globe, Lock } from 'lucide-react';

export default function Home() {
  const features = [
    {
      icon: <Zap className="h-6 w-6" />,
      title: 'Instant Verification',
      description: 'Verify certificates instantly on the blockchain with just a token ID'
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: 'NFT Certificates',
      description: 'Own your certificates as NFTs - fully yours, forever'
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: 'Decentralized & Transparent',
      description: 'Built on blockchain technology for maximum transparency and security'
    },
    {
      icon: <Lock className="h-6 w-6" />,
      title: 'Tamper-Proof',
      description: 'Certificates cannot be forged or altered once issued'
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 blur-lg"></div>
                <img
                    src="/assets/logo.webp"
                    alt="Certify-NFT_logo"
                    className="h-24 w-24"
                    width="1000"
                    height="1510"
                  />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Certify
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {' '}Blockchain-Powered
              </span>
              <br />
              Certificates
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Issue, manage, and verify digital certificates as NFTs. Secure, transparent, and fully owned by the recipients.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 flex items-center justify-center group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all"
              >
                Login
              </Link>
              <Link
                to="/events"
                className="text-blue-600 hover:text-blue-700 px-8 py-4 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Certify?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Modern certificate management built for the decentralized web
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

      {/* About Section */}
      <div className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Revolutionizing Digital Credentials
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Certify transforms how digital certificates are issued, managed, and verified. 
                Built on blockchain technology, our platform ensures every certificate is authentic, 
                tamper-proof, and fully owned by the recipient.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">For Event Organizers</h3>
                    <p className="text-gray-600">Issue certificates easily and track attendance</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">For Recipients</h3>
                    <p className="text-gray-600">Own your certificates forever as NFTs</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900">For Verifiers</h3>
                    <p className="text-gray-600">Instantly verify authenticity on the blockchain</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Award className="h-8 w-8 text-white" />
                    <div>
                      <h3 className="font-bold">Certificate #1234</h3>
                      <p className="text-sm text-white/80">Web3 Workshop 2024</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/80">Issued to:</span>
                      <span>John Doe</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Date:</span>
                      <span>March 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/80">Status:</span>
                      <span className="text-green-300">✓ Verified</span>
                    </div>
                  </div>
                </div>
                <p className="text-center text-white/90 text-sm">
                  Preview of certificate dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of organizations already using Certify for their certification needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105"
            >
              Register Now
            </Link>
            <Link
              to="/events"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-lg font-semibold transition-all"
            >
              Browse Events
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}