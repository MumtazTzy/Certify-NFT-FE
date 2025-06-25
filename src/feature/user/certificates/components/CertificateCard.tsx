// src/feature/user/certificates/components/CertificateCard.tsx

import { Link } from 'react-router-dom';
import { Calendar, ExternalLink, Image as ImageIcon } from 'lucide-react';
import { Certificate } from '../types';

interface Props {
  certificate: Certificate;
}

export default function CertificateCard({ certificate }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="relative h-48 bg-gray-100">
        {certificate.image_url ? (
          <img src={certificate.image_url} alt={certificate.event_title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ImageIcon className="w-12 h-12" />
          </div>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {certificate.event_title}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1">
          {certificate.event_description}
        </p>
        <div className="text-xs text-gray-500 flex items-center mb-4">
          <Calendar className="w-4 h-4 mr-2" />
          <span>
            Issued on {new Date(certificate.issue_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </span>
        </div>
        <Link
          to={`/verify/${certificate.id}`}
          className="w-full mt-auto bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-lg font-semibold transition-all flex items-center justify-center space-x-2"
        >
          <span>View Certificate</span>
          <ExternalLink className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}