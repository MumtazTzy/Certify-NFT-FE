import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Shield, Award, CheckCircle, XCircle, Calendar, MapPin, ExternalLink, ArrowLeft } from 'lucide-react';

interface CertificateData {
  tokenId: string;
  eventTitle: string;
  recipientAddress: string;
  eventDate: string;
  eventLocation: string;
  organizer: string;
  issueDate: string;
  ipfsUrl: string;
  status: 'valid' | 'revoked' | 'not-found';
  transactionHash?: string;
}

export default function VerifyCertificate() {
  const { tokenId } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);

  useEffect(() => {
    // Simulate API call to verify certificate
    const verifyCertificate = async () => {
      setIsLoading(true);
      
      // Mock verification process
      setTimeout(() => {
        if (tokenId === '12345') {
          setCertificate({
            tokenId: tokenId!,
            eventTitle: 'Web3 Development Workshop',
            recipientAddress: '0x1234567890abcdef1234567890abcdef12345678',
            eventDate: '2024-04-15',
            eventLocation: 'Virtual Event',
            organizer: 'Blockchain Education Foundation',
            issueDate: '2024-04-16',
            ipfsUrl: 'ipfs://QmX1234567890abcdef',
            status: 'valid',
            transactionHash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890ab'
          });
        } else if (tokenId === '99999') {
          setCertificate({
            tokenId: tokenId!,
            eventTitle: 'Revoked Event Certificate',
            recipientAddress: '0x9999999999999999999999999999999999999999',
            eventDate: '2024-03-01',
            eventLocation: 'Test Location',
            organizer: 'Test Organizer',
            issueDate: '2024-03-02',
            ipfsUrl: 'ipfs://QmRevoked123456789',
            status: 'revoked'
          });
        } else {
          setCertificate({
            tokenId: tokenId!,
            eventTitle: '',
            recipientAddress: '',
            eventDate: '',
            eventLocation: '',
            organizer: '',
            issueDate: '',
            ipfsUrl: '',
            status: 'not-found'
          });
        }
        setIsLoading(false);
      }, 2000);
    };

    verifyCertificate();
  }, [tokenId]);

  const getStatusDisplay = () => {
    if (!certificate) return null;

    switch (certificate.status) {
      case 'valid':
        return (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <h2 className="text-2xl font-bold text-green-900">Certificate Valid</h2>
                <p className="text-green-700">This certificate is authentic and verified on the blockchain</p>
              </div>
            </div>
          </div>
        );
      case 'revoked':
        return (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <h2 className="text-2xl font-bold text-red-900">Certificate Revoked</h2>
                <p className="text-red-700">This certificate has been revoked by the issuer</p>
              </div>
            </div>
          </div>
        );
      case 'not-found':
        return (
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <XCircle className="h-8 w-8 text-gray-600" />
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Certificate Not Found</h2>
                <p className="text-gray-700">No certificate found with this token ID</p>
              </div>
            </div>
          </div>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Verifying Certificate
            </h2>
            <p className="text-gray-600">
              Checking blockchain records for token ID: {tokenId}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            to="/my-certificates"
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to My Certificates</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Verify Certificate
          </h1>
          <p className="text-xl text-gray-600">
            Token ID: #{tokenId}
          </p>
        </div>

        {/* Status Display */}
        {getStatusDisplay()}

        {/* Certificate Details */}
        {certificate && certificate.status !== 'not-found' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Certificate Preview */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white text-center mb-6">
                <Award className="h-16 w-16 mx-auto mb-4 opacity-90" />
                <h3 className="text-xl font-bold mb-2">{certificate.eventTitle}</h3>
                <p className="text-sm opacity-90 mb-1">Certificate of Completion</p>
                <p className="text-xs opacity-75">Token ID: #{certificate.tokenId}</p>
              </div>
            </div>

            {/* Certificate Information */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Certificate Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Event Title</label>
                      <p className="text-gray-900 font-semibold">{certificate.eventTitle}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Organizer</label>
                      <p className="text-gray-900">{certificate.organizer}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Event Date</label>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">
                          {new Date(certificate.eventDate).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Location</label>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">{certificate.eventLocation}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Recipient Address</label>
                      <p className="text-gray-900 font-mono text-sm break-all">
                        {certificate.recipientAddress}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Issue Date</label>
                      <p className="text-gray-900">
                        {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Token ID</label>
                      <p className="text-gray-900 font-mono">#{certificate.tokenId}</p>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        certificate.status === 'valid' 
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {certificate.status === 'valid' ? '✓ Valid' : '✗ Revoked'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Blockchain Information */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Blockchain Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">IPFS URL</label>
                    <div className="flex items-center space-x-2">
                      <p className="text-gray-900 font-mono text-sm flex-1 break-all">
                        {certificate.ipfsUrl}
                      </p>
                      <a
                        href={certificate.ipfsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                  
                  {certificate.transactionHash && (
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-1">Transaction Hash</label>
                      <div className="flex items-center space-x-2">
                        <p className="text-gray-900 font-mono text-sm flex-1 break-all">
                          {certificate.transactionHash}
                        </p>
                        <a
                          href={`https://etherscan.io/tx/${certificate.transactionHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Not Found Message */}
        {certificate && certificate.status === 'not-found' && (
          <div className="text-center py-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md mx-auto">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Certificate Not Found
              </h3>
              <p className="text-gray-600 mb-6">
                No certificate exists with token ID #{tokenId}. Please check the token ID and try again.
              </p>
              <Link
                to="/events"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
              >
                <Calendar className="h-5 w-5" />
                <span>Browse Events</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}