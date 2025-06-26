// src/feature/vendors/events/components/EventDetailsDisplay.tsx
import { Calendar, MapPin, Users, Award } from 'lucide-react';
import { Event } from '../../types';
import { API_IMAGE_BASE_URL } from '../../services/eventApiService';

interface EventDetailsDisplayProps {
    event: Event;
    uploadedCertificatesCount: number;
    mintedCertificatesCount: number;
}

export default function EventDetailsDisplay({ 
    event, 
    uploadedCertificatesCount, 
    mintedCertificatesCount 
}: EventDetailsDisplayProps) {
    return (
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Details</h2>
                <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="font-semibold text-gray-900">Date</p>
                            <p className="text-gray-600">{new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="font-semibold text-gray-900">Location</p>
                            <p className="text-gray-600">{event.location}</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="font-semibold text-gray-900">Registered</p>
                            <p className="text-gray-600">{event.whitelisted}/{event.max_attendees > 0 ? event.max_attendees : 'Unlimited'} registered</p>
                        </div>
                    </div>
                     <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="font-semibold text-gray-900">Attendees</p>
                            <p className="text-gray-600">{event.attendees}/{event.max_attendees > 0 ? event.max_attendees : 'Unlimited'} Attend</p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-gray-400" />
                        <div>
                            <p className="font-semibold text-gray-900">Certificates</p>
                            <p className="text-gray-600">{mintedCertificatesCount} minted of {uploadedCertificatesCount} prepared</p>
                        </div>
                    </div>
                </div>
                <div className="border-t border-gray-200 pt-4 mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Event Image</h2>
                {event.picture ? (
                    <div className="relative h-48 rounded-xl overflow-hidden">
                        <img src={`${API_IMAGE_BASE_URL}/${event.picture}`} alt={event.title} className="w-full h-full object-cover"/>
                    </div>
                ) : ( <p className="text-gray-500">No image available.</p> )}
            </div>
        </div>
    );
}