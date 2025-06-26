// src/components/CreateEventForm/EventAgendaInput.tsx
import { Clock, Plus, Trash2 } from 'lucide-react';
import { AgendaItem } from '../CreateEventForm'; // Asumsi tipe AgendaItem diekspor dari file utama

interface EventAgendaInputProps {
  agenda: AgendaItem[];
  onAgendaChange: (index: number, field: keyof AgendaItem, value: string) => void;
  onAddAgendaItem: () => void;
  onRemoveAgendaItem: (index: number) => void;
}

export default function EventAgendaInput({
  agenda, onAgendaChange, onAddAgendaItem, onRemoveAgendaItem,
}: EventAgendaInputProps) {
  return (
    <div className="p-6 border rounded-lg bg-white shadow-md">
      <h3 className="text-lg font-semibold mb-1 text-gray-700 flex items-center"><Clock className="h-5 w-5 mr-2 text-gray-500" /> Agenda</h3>
      <p className="text-xs text-gray-500 mb-3">Outline the event schedule. Time & topic are needed for each item if added. Optional.</p>
      <div className="space-y-3">
        {agenda.map((item, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-x-2 gap-y-2 items-center">
            <div className="md:col-span-4">
              <label htmlFor={`agenda-time-${index}`} className="sr-only">Time</label>
              <input id={`agenda-time-${index}`} type="time" value={item.time} onChange={(e) => onAgendaChange(index, 'time', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" />
            </div>
            <div className="md:col-span-7">
              <label htmlFor={`agenda-topic-${index}`} className="sr-only">Topic</label>
              <input id={`agenda-topic-${index}`} type="text" value={item.topic} onChange={(e) => onAgendaChange(index, 'topic', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-purple-500 focus:border-purple-500 transition-colors text-sm" placeholder={`Topic (e.g., Opening Remarks)`}/>
            </div>
            <div className="md:col-span-1 flex justify-end">
              <button type="button" onClick={() => onRemoveAgendaItem(index)} className="p-2 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-full transition-colors disabled:opacity-50" aria-label={`Remove agenda item ${index + 1}`} disabled={agenda.length <= 1 && agenda[0].time.trim() === '' && agenda[0].topic.trim() === ''}>
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button type="button" onClick={onAddAgendaItem} className="inline-flex items-center space-x-1 text-xs font-medium text-purple-600 hover:text-purple-800 py-1 transition-colors">
          <Plus className="h-3 w-3" /><span>Add Agenda Item</span>
        </button>
      </div>
    </div>
  );
}