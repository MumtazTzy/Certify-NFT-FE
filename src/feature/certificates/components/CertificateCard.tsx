import { Certificate } from '../types/certificate';
import { Calendar, MapPin, ExternalLink } from 'lucide-react';

export default function CertificateCard({ certificate }: { certificate: Certificate }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition">
      <img
        src={certificate.event_picture}
        alt={certificate.event_title}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold mb-1">{certificate.event_title}</h3>
        <p className="text-sm text-gray-500 mb-2">{certificate.event_description}</p>

        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Calendar className="h-4 w-4 mr-1" />
          <span>{new Date(certificate.event_start_date).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-sm text-gray-600 mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span>{certificate.event_location}</span>
        </div>

        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
          certificate.mint_status === 'minted' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
        }`}>
          {certificate.mint_status}
        </span>

        <a
          href={`https://etherscan.io/tx/${certificate.mint_transaction_hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="block mt-3 text-blue-600 hover:underline text-sm flex items-center"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          View Transaction
        </a>
      </div>
    </div>
  );
}
