import { Certificate } from '../pages/MyCertificates';
import { Link } from 'react-router-dom';
import { Award, Calendar, MapPin, Download, ExternalLink } from 'lucide-react';

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
        <div className="text-center">
          <Award className="h-12 w-12 mx-auto mb-3 opacity-90" />
          <h3 className="font-bold text-lg mb-2">{certificate.eventTitle}</h3>
          <p className="text-sm opacity-90">Certificate of Completion</p>
          <p className="text-xs opacity-75 mt-2">Token ID: #{certificate.tokenId}</p>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-3 mb-6">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{new Date(certificate.eventDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{certificate.eventLocation}</span>
          </div>
          <div className="flex items-start space-x-2 text-sm text-gray-600">
            <Award className="h-4 w-4 mt-0.5" />
            <div>
              <p>Issued by {certificate.organizer}</p>
              <p>Minted: {new Date(certificate.mintDate).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
        <div className="mb-6">
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
              certificate.status === 'valid' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {certificate.status === 'valid' ? '✓ Valid' : '✗ Revoked'}
          </span>
        </div>
        <div className="space-y-3">
          <Link
            to={`/verify/${certificate.tokenId}`}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2 text-sm"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Verify Certificate</span>
          </Link>
          <div className="flex space-x-2">
            <button className="flex-1 border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg font-semibold transition-all text-sm flex items-center justify-center space-x-1">
              <Download className="h-4 w-4" />
              <span>Download</span>
            </button>
            <a
              href={certificate.ipfsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 border border-gray-300 hover:border-blue-600 text-gray-700 hover:text-blue-600 py-2 px-3 rounded-lg font-semibold transition-all text-sm flex items-center justify-center space-x-1"
            >
              <ExternalLink className="h-4 w-4" />
              <span>IPFS</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
