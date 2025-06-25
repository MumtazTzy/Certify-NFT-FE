// src/components/whitelist/RevokeModal.tsx

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function RevokeModal({ isOpen, onClose, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Revoke Whitelist Access</h3>
        <p className="text-gray-600 mb-6">Are you sure you want to revoke whitelist access? This action cannot be undone.</p>
        <div className="flex items-center justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">
            Cancel
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold">
            Revoke Access
          </button>
        </div>
      </div>
    </div>
  );
}