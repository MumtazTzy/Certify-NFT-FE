// src/components/whitelist/WhitelistForm.tsx
import React from 'react';
import { Award, Loader2, CheckCircle, Shield } from 'lucide-react';
import { Event } from '../types';

const shortenAddress = (address: string, chars = 4): string => `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;

interface WhitelistFormProps {
    event: Event;
    walletAddress: string;
    isSubmitting: boolean;
    onSubmit: (e: React.FormEvent) => void;
}

const WhitelistForm: React.FC<WhitelistFormProps> = ({ event, walletAddress, isSubmitting, onSubmit }) => (
    <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="relative h-32 rounded-xl overflow-hidden mb-6">
            <img src={`https://api.gpadaka.com/${event.picture}`} alt={event.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            <div className="absolute bottom-2 left-3 right-3"><h2 className="text-white font-bold text-lg">{event.title}</h2></div>
        </div>
        <div className="text-center mb-8">
            <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"><Award className="h-8 w-8 text-blue-600" /></div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Whitelist</h1>
            <p className="text-gray-600">Register your wallet to be eligible for this event's certificate.</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Connected Wallet</label>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3"><CheckCircle className="h-5 w-5 text-green-600" /><div><p className="text-green-800 font-medium">Ready to register</p><p className="text-green-600 text-sm font-mono">{shortenAddress(walletAddress)}</p></div></div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Event Details</h3>
                <div className="space-y-1 text-sm text-gray-600"><p><span className="font-medium">Date:</span> {new Date(event.start_date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p><p><span className="font-medium">Location:</span> {event.location}</p><p><span className="font-medium">Certificate:</span> NFT Certificate included</p></div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <h3 className="font-semibold text-yellow-900 mb-2">📝 Important Note</h3>
                <p className="text-sm text-yellow-800">Being whitelisted doesn't guarantee a certificate. You must attend the event and receive a token code to mint your certificate.</p>
            </div>
            <button type="submit" disabled={isSubmitting} className="w-full flex justify-center items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg font-semibold transition-all">{isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Shield className="h-5 w-5" />}<span>{isSubmitting ? 'Submitting...' : 'Confirm Registration'}</span></button>
        </form>
    </div>
);

export default WhitelistForm;