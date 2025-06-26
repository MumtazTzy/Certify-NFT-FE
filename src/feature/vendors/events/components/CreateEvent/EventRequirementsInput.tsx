// src/components/CreateEventForm/EventRequirementsInput.tsx
import { ListChecks, Plus, Trash2 } from 'lucide-react';

interface EventRequirementsInputProps {
  requirements: string[];
  onRequirementChange: (index: number, value: string) => void;
  onAddRequirement: () => void;
  onRemoveRequirement: (index: number) => void;
}

export default function EventRequirementsInput({
  requirements, onRequirementChange, onAddRequirement, onRemoveRequirement,
}: EventRequirementsInputProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-1 text-gray-700 flex items-center"><ListChecks className="h-5 w-5 mr-2 text-gray-500" /> Requirements</h3>
      <p className="text-xs text-gray-500 mb-3">List any prerequisites for attendees (e.g., laptop, specific software). Optional.</p>
      <div className="space-y-2">
        {requirements.map((req, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input type="text" value={req} onChange={(e) => onRequirementChange(index, e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" placeholder={`Requirement #${index + 1}`}/>
            <button type="button" onClick={() => onRemoveRequirement(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50" aria-label={`Remove requirement ${index + 1}`} disabled={requirements.length <=1 && requirements[0].trim() === ''}>
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <button type="button" onClick={onAddRequirement} className="inline-flex items-center space-x-1 text-xs font-medium text-purple-600 hover:text-purple-800 py-1 transition-colors">
          <Plus className="h-3 w-3" /><span>Add Requirement</span>
        </button>
      </div>
    </div>
  );
}