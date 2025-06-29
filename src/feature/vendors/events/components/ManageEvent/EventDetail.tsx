// src/feature/vendors/events/components/EventDetailsDisplay.tsx
import { Calendar, MapPin, Users, Award, Clock, FileText } from 'lucide-react';
import TokenCard from './TokenCard';
import { Event } from '../../types';

interface EventDetailsDisplayProps {
    event: Event;
    uploadedCertificatesCount: number;
    mintedCertificatesCount: number;
    eventToken?: string;
}

export default function EventDetailsDisplay({ 
    event, 
    uploadedCertificatesCount, 
    mintedCertificatesCount,
    eventToken
}: EventDetailsDisplayProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    const formatTime = (dateString: string) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="lg:col-span-2 space-y-6">
            {/* Event Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="bg-blue-100 rounded-lg p-2">
                        <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Event Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date & Time */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-blue-50 rounded-lg p-2 mt-1">
                                <Calendar className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Date & Time</p>
                                <p className="text-gray-700">{formatDate(event.start_date)}</p>
                                <p className="text-gray-500 text-sm">{formatTime(event.start_date)}</p>
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="bg-green-50 rounded-lg p-2 mt-1">
                                <MapPin className="h-4 w-4 text-green-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Location</p>
                                <p className="text-gray-700">{event.location}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Registration & Attendance */}
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                            <div className="bg-purple-50 rounded-lg p-2 mt-1">
                                <Users className="h-4 w-4 text-purple-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Registration</p>
                                <p className="text-gray-700">
                                    {event.whitelisted}/{event.max_attendees > 0 ? event.max_attendees : '∞'} registered
                                </p>
                                {event.max_attendees > 0 && (
                                    <div className="mt-2">
                                        <div className="bg-gray-200 rounded-full h-2">
                                            <div 
                                                className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                                                style={{ width: `${Math.min((event.whitelisted / event.max_attendees) * 100, 100)}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {Math.round((event.whitelisted / event.max_attendees) * 100)}% capacity
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                            <div className="bg-orange-50 rounded-lg p-2 mt-1">
                                <Clock className="h-4 w-4 text-orange-600" />
                            </div>
                            <div className="flex-1">
                                <p className="font-semibold text-gray-900 text-sm">Attendance</p>
                                <p className="text-gray-700">
                                    {event.attendees || 0}/{event.whitelisted > 0 ? event.whitelisted : 'N/A'} attended
                                </p>
                                {event.whitelisted > 0 && (
                                    <p className="text-xs text-gray-500 mt-1">
                                        {Math.round(((event.attendees || 0) / event.whitelisted) * 100)}% attendance rate
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Certificates Section */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="bg-emerald-50 rounded-lg p-2">
                            <Award className="h-4 w-4 text-emerald-600" />
                        </div>
                        <h3 className="font-semibold text-gray-900">Certificates</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-emerald-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-emerald-700">Prepared</span>
                                <span className="text-lg font-bold text-emerald-800">
                                    {event.certificate_uploaded || event.urlCertificate ? 'Available' : uploadedCertificatesCount}
                                </span>
                            </div>
                            {(event.certificate_uploaded || event.urlCertificate) && (
                                <p className="text-xs text-emerald-600 mt-1">
                                    {event.urlCertificate ? 'Event template' : 'Custom template'}
                                </p>
                            )}
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-blue-700">Minted</span>
                                <span className="text-lg font-bold text-blue-800">{mintedCertificatesCount}</span>
                            </div>
                        </div>
                    </div>
                    
                    {(event.certificate_uploaded || event.urlCertificate) && (
                        <div className="mt-3">
                            <div className="bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                    style={{ width: `${Math.min((mintedCertificatesCount / (event.whitelisted || 1)) * 100, 100)}%` }}
                                ></div>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                                {Math.round((mintedCertificatesCount / (event.whitelisted || 1)) * 100)}% of registered users minted
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Description */}
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
                    <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                            {event.description || "No description available."}
                        </p>
                    </div>
                </div>
            </div>
            {/* Event Token Card */}
            {eventToken && (
                    <div className="mt-6">
                        <TokenCard token={eventToken} />
                    </div>
                )}
            
            {/* Event Image Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center space-x-3 mb-4">
                    <div className="bg-purple-100 rounded-lg p-2">
                        <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Event Image</h2>
                </div>
                
                {event.picture ? (
                    <div className="relative group">
                        <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden bg-gray-100">
                            <img 
                                src={`${event.picture}`} 
                                alt={event.title} 
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
                        </div>
                        <div className="mt-3 text-center">
                            <p className="text-sm text-gray-500">Event promotional image</p>
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                            <FileText className="h-8 w-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">No image available</p>
                        <p className="text-gray-400 text-sm mt-1">Upload an image to make your event more attractive</p>
                    </div>
                )}
            </div>
        </div>
    );
}