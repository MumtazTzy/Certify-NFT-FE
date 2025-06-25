import { Link } from 'react-router-dom';
import { User, Building, ArrowRight } from 'lucide-react';

export default function RegisterRole() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Register to Certify
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with blockchain-powered certificates
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Register as User */}
          <Link
            to="/register/user"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-blue-300 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="bg-blue-50 group-hover:bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <User className="h-10 w-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Register as User
              </h2>
              
              <p className="text-gray-600 mb-6">
                Join events, receive certificates, and build your digital credential portfolio
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Attend events and workshops</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Mint your certificates as NFTs</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span>Verify and share your credentials</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-8 text-blue-600 group-hover:text-blue-700 font-semibold">
                <span>Continue as User</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>

          {/* Register as Vendor */}
          <Link
            to="/register/vendor"
            className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-transparent hover:border-purple-300 transform hover:scale-105"
          >
            <div className="text-center">
              <div className="bg-purple-50 group-hover:bg-purple-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
                <Building className="h-10 w-10 text-purple-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Register as Vendor
              </h2>
              
              <p className="text-gray-600 mb-6">
                Create events, manage attendees, and issue blockchain certificates
              </p>
              
              <div className="space-y-3 text-left">
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Create and manage events</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Control whitelist and access</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                  <span>Issue verified certificates</span>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-2 mt-8 text-purple-600 group-hover:text-purple-700 font-semibold">
                <span>Continue as Vendor</span>
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}