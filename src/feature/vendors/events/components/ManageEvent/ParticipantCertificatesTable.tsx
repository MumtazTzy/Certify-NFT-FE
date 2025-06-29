// src/feature/vendors/events/components/ParticipantCertificatesTable.tsx
import { Loader2, Sparkles, Users, Award, AlertCircle, CheckCircle, Clock, UserCheck, UserX } from 'lucide-react';
import { WhitelistEntry, EventStatus } from '../../types';

interface ParticipantCertificatesTableProps {
    whitelist: WhitelistEntry[];
    whitelistLoading: boolean;
    whitelistError: string | null;
    uploadedCertificates: Record<string, { tokenURI?: string; filePath?: string; event_id_from_upload?: string }>;
    mintedCertificates: Record<string, { transactionHash?: string; apiResponse?: Record<string, unknown> }>;
    eventStatus: EventStatus;
    isProcessing: boolean;
    isEventCanceled: boolean;
    onMintCertificate: (userId: string) => void;
    onAttendanceUpdate?: (userId: string, attended: boolean) => void;
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
    onMintCertificate,
    onAttendanceUpdate,
    isUserConsideredPresent,
    getUserStatusNode,
}: ParticipantCertificatesTableProps) {

    if (whitelistLoading) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Participants</h3>
                    <p className="text-gray-500">Please wait while we fetch the participant data...</p>
                </div>
            </div>
        );
    }
    
    if (whitelistError) {
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <AlertCircle className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-red-900 mb-2">Error Loading Data</h3>
                    <p className="text-red-600">{String(whitelistError)}</p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 w-full mt-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 rounded-lg p-2">
                        <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Participant Management</h2>
                        <p className="text-sm text-gray-500">{whitelist.length} participants registered</p>
                    </div>
                </div>
                
                {/* Summary Stats */}
                <div className="hidden md:flex items-center space-x-4">
                    <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                            {whitelist.filter(user => isUserConsideredPresent(user)).length}
                        </div>
                        <div className="text-xs text-gray-500">Present</div>
                    </div>
                    <div className="text-center">
                        <div className="text-lg font-bold text-purple-600">
                            {Object.keys(mintedCertificates).length}
                        </div>
                        <div className="text-xs text-gray-500">Minted</div>
                    </div>
                </div>
            </div>
            
            {/* Certificate Status Alert */}
            {eventStatus === 'minting' && (
                <div className="mb-6">
                    {Object.keys(uploadedCertificates).length === 0 && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <AlertCircle className="h-5 w-5 text-yellow-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-yellow-700">No Certificates Uploaded</p>
                                    <p className="text-xs text-yellow-600 mt-1">
                                        No specific certificates have been uploaded for participants. 
                                        You can either upload individual certificates or use the event-wide template.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {Object.keys(uploadedCertificates).length > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start space-x-3">
                                <CheckCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-blue-700">Certificates Ready for Minting</p>
                                    <p className="text-xs text-blue-600 mt-1">
                                        {Object.keys(uploadedCertificates).length} participant(s) have certificates uploaded and are ready for minting.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
            
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Participant
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Wallet Address
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Attendance
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                Certificate
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {whitelist.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-12">
                                    <div className="text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                                            <Users className="h-8 w-8 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Participants Yet</h3>
                                        <p className="text-gray-500 mb-4">No one has registered for the whitelist yet</p>
                                        <div className="bg-blue-50 rounded-lg p-4 max-w-md mx-auto">
                                            <div className="flex items-center space-x-2">
                                                <Clock className="h-4 w-4 text-blue-600" />
                                                <span className="text-sm text-blue-700">Participants will appear here once they register</span>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            whitelist.map((whUser, index) => {
                                const userIsPresent = isUserConsideredPresent(whUser);
                                const certificateUploaded = !!uploadedCertificates[whUser.id]?.tokenURI;
                                const certificateMinted = !!mintedCertificates[whUser.id];
                                
                                const canMint = certificateUploaded && !certificateMinted && 
                                                eventStatus === 'minting' &&
                                                !isEventCanceled && !isProcessing;
                                const key = `${whUser.id}-${index}`;    
                                
                                return (
                                    <tr key={key} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="flex-shrink-0">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full flex items-center justify-center">
                                                        <span className="text-white font-semibold text-sm">
                                                            {whUser.name.charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">{whUser.name}</div>
                                                    <div className="text-sm text-gray-500">{whUser.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="font-mono text-xs text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                                                {whUser.walletAddress}
                                            </div>
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {getUserStatusNode(whUser)}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            {userIsPresent ? (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                        Present
                                                    </span>
                                                    {onAttendanceUpdate && (
                                                        <button
                                                            onClick={() => onAttendanceUpdate(whUser.id, false)}
                                                            disabled={isProcessing}
                                                            className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                                            title="Mark as absent"
                                                        >
                                                            <UserX className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="flex items-center space-x-2">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                        Absent
                                                    </span>
                                                    {onAttendanceUpdate && (
                                                        <button
                                                            onClick={() => onAttendanceUpdate(whUser.id, true)}
                                                            disabled={isProcessing}
                                                            className="ml-2 p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                                                            title="Mark as present"
                                                        >
                                                            <UserCheck className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                </div>
                                            )}
                                        </td>
                                        
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {certificateMinted ? (
                                                    <>
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            <Award className="h-3 w-3 mr-1" />
                                                            Minted
                                                        </span>
                                                    </>
                                                ) : certificateUploaded ? (
                                                    <>
                                                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                            <Sparkles className="h-3 w-3 mr-1" />
                                                            Ready to Mint
                                                        </span>
                                                        {canMint && (
                                                            <button
                                                                onClick={() => onMintCertificate(whUser.id)}
                                                                disabled={isProcessing}
                                                                className="ml-2 px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                                                            >
                                                                Mint
                                                            </button>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            No Certificate
                                                        </span>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
            
            {/* Footer Info */}
            {whitelist.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-green-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm font-medium text-green-700">Present</span>
                            </div>
                            <p className="text-lg font-bold text-green-800 mt-1">
                                {whitelist.filter(user => isUserConsideredPresent(user)).length}
                            </p>
                        </div>
                        
                        <div className="bg-purple-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <Sparkles className="h-4 w-4 text-purple-600" />
                                <span className="text-sm font-medium text-purple-700">Ready to Mint</span>
                            </div>
                            <p className="text-lg font-bold text-purple-800 mt-1">
                                {Object.keys(uploadedCertificates).length}
                            </p>
                        </div>
                        
                        <div className="bg-blue-50 rounded-lg p-4">
                            <div className="flex items-center space-x-2">
                                <Award className="h-4 w-4 text-blue-600" />
                                <span className="text-sm font-medium text-blue-700">Minted</span>
                            </div>
                            <p className="text-lg font-bold text-blue-800 mt-1">
                                {Object.keys(mintedCertificates).length}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}