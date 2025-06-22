// src/components/loading/FullscreenSpinner.tsx

export default function FullscreenSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{message}</h3>
        <p className="text-gray-600">Please wait...</p>
      </div>
    </div>
  );
}
