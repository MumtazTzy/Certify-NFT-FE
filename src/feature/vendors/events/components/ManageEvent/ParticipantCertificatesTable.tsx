// src/feature/vendors/events/components/ParticipantCertificatesTable.tsx
import { Loader2, UploadCloud, Sparkles } from 'lucide-react';
import { WhitelistEntry, EventStatus } from '../../types';

interface ParticipantCertificatesTableProps {
    whitelist: WhitelistEntry[];
    whitelistLoading: boolean;
    whitelistError: string | null;
    uploadedCertificates: Record<string, { tokenURI?: string; /* other fields */ }>;
    mintedCertificates: Record<string, { /* fields */ }>;
    eventStatus: EventStatus;
    isProcessing: boolean;
    isEventCanceled: boolean;
    onOpenUploadModal: (user: WhitelistEntry) => void;
    onMintCertificate: (userId: string) => void;
    isUserConsideredPresent: (user: WhitelistEntry) => boolean;
    getUserStatusNode: (user: WhitelistEntry) => React.ReactNode;
}

export default function ParticipantCertificatesTable({
    whitelist,
    whitelistLoading,
    whitelistError,
    uploadedCertificates,
    mintedCertificates,
    eventStatus,
    isProcessing,
    isEventCanceled,
    onOpenUploadModal,
    onMintCertificate,
    isUserConsideredPresent,
    getUserStatusNode,
}: ParticipantCertificatesTableProps) {

    if (whitelistLoading) {
        return <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin text-purple-600 mx-auto" /> Loading participants...</div>;
    }
    if (whitelistError) {
        return <p className="text-center text-red-500 py-8">Error loading whitelist: {String(whitelistError)}</p>;
    }
    
    return (
        <div className="bg-white rounded-2xl shadow-lg p-6 w-full mt-8 overflow-x-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Participant Info</h2>
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Wallet</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance Status</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mint Status</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {whitelist.length === 0 ? (
                        <tr>
                            <td colSpan={4} className="text-center text-gray-500 py-8">
                                <div>No entries found<br/>No one has registered for the whitelist yet</div>
                            </td>
                        </tr>
                    ) : (
                        whitelist.map((whUser) => {
                            const userIsPresent = isUserConsideredPresent(whUser);
                            const certificateUploaded = !!uploadedCertificates[whUser.id]?.tokenURI;
                            const certificateMinted = !!mintedCertificates[whUser.id];
                            
                            const canUpload = userIsPresent && !certificateUploaded && 
                                            !['canceled', 'upcoming'].includes(eventStatus) && 
                                            !isProcessing;
                            const canMint = certificateUploaded && !certificateMinted && 
                                            eventStatus === 'minting' &&
                                            !isEventCanceled && !isProcessing;

                            return (
                                <tr key={whUser.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{whUser.name}</div>
                                        <div className="text-sm text-gray-500">{whUser.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-mono text-xs text-gray-600">{whUser.walletAddress}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {getUserStatusNode(whUser)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {certificateMinted ? (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Minted</span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Minted</span>
                                        )}
                                    </td>
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>
        </div>
    );
}