// src/feature/vendors/events/components/EventQuickActions.tsx
import { Link, useNavigate } from 'react-router-dom';
import { Users, Award, Settings, ExternalLink, ArrowRight } from 'lucide-react';

interface EventQuickActionsProps {
    eventId: number;
    whitelistCount: number;
    renderUploadCertificateButton?: React.ReactNode;
}

export default function EventQuickActions({ eventId, whitelistCount, renderUploadCertificateButton }: EventQuickActionsProps) {
    const navigate = useNavigate();
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
                <div className="bg-green-100 rounded-lg p-2">
                    <Settings className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
            </div>
            
            <div className="space-y-4">
                {/* View Whitelist */}
                <Link 
                    to={`/vendor/event/${eventId}/whitelist`} 
                    className="group block w-full bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 py-4 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-blue-600 rounded-lg p-2 group-hover:bg-blue-700 transition-colors">
                                <Users className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">View Whitelist</p>
                                <p className="text-xs opacity-80">{whitelistCount} participants</p>
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
                
                {/* View Minted Certificates */}
                <Link 
                    to={`/vendor/event/${eventId}/minted`} 
                    className="group block w-full bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 py-4 px-4 rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98]"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                            <div className="bg-green-600 rounded-lg p-2 group-hover:bg-green-700 transition-colors">
                                <Award className="h-4 w-4 text-white" />
                            </div>
                            <div className="text-left">
                                <p className="font-semibold">View Minted Certificates</p>
                                <p className="text-xs opacity-80">Check minted certificates</p>
                            </div>
                        </div>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
                
                {/* Upload Certificate Template */}
                {renderUploadCertificateButton && (
                    <div className="pt-2">
                        {renderUploadCertificateButton}
                    </div>
                )}
            </div>
            
            {/* Additional Info */}
            <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                        <div className="bg-gray-600 rounded-lg p-2">
                            <ExternalLink className="h-4 w-4 text-white" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-700">Quick Tips</p>
                            <ul className="text-xs text-gray-600 mt-2 space-y-1">
                                <li>• Upload certificate template before minting</li>
                                <li>• Monitor whitelist for participant updates</li>
                                <li>• Check minted certificates for verification</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}