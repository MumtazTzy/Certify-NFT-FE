// src/components/forms/CreateEventForm.tsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Upload, FileText, Plus, Trash2, Clock, ListChecks } from 'lucide-react';
import { useAuth } from '../../../auth/hooks/useAuth'; // ✅ Impor useAuth untuk mendapatkan data vendor

interface CreateEventFormProps {
  onSubmit: (fd: FormData) => Promise<void>;
  isSubmitting: boolean;
}

// Tipe untuk item agenda
interface AgendaItem {
  time: string;
  topic: string;
}

export default function CreateEventForm({ onSubmit, isSubmitting }: CreateEventFormProps) {
  // ✅ Dapatkan user dari AuthContext untuk mengambil vendor_id
  const { user } = useAuth();

  // ✅ State disesuaikan dengan field API
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  // ✅ State untuk field dinamis (requirements & agenda)
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [agenda, setAgenda] = useState<AgendaItem[]>([{ time: '', topic: '' }]);

  // --- Handlers untuk Requirements ---
  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  const addRequirement = () => {
    setRequirements([...requirements, '']);
  };

  const removeRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // --- Handlers untuk Agenda ---
  const handleAgendaChange = (index: number, field: keyof AgendaItem, value: string) => {
    const newAgenda = [...agenda];
    newAgenda[index][field] = value;
    setAgenda(newAgenda);
  };

  const addAgendaItem = () => {
    setAgenda([...agenda, { time: '', topic: '' }]);
  };

  const removeAgendaItem = (index: number) => {
    setAgenda(agenda.filter((_, i) => i !== index));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || user.role !== 'vendors') {
        alert("You must be logged in as a vendor to create an event.");
        return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    // ✅ Mengambil vendor_id dari user yang sedang login
    fd.append('wallet_address', String(user.walletAddress)); // Asumsi user object punya vendor_id
    fd.append('location', location);
    fd.append('maxattendees', maxAttendees || '0');
    fd.append('status', 'upcoming'); // Status untuk event baru

    // Format tanggal ke ISO string
    if (startDate) fd.append('start_date', new Date(startDate).toISOString());
    if (endDate) fd.append('end_date', new Date(endDate).toISOString());
    if (selectedImage) fd.append('picture', selectedImage);

    // ✅ Mengirim array sebagai string JSON
    fd.append('requirements', JSON.stringify(requirements.filter(req => req.trim() !== '')));
    fd.append('agenda', JSON.stringify(agenda.filter(item => item.topic.trim() !== '')));

    await onSubmit(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* --- Detail Utama Event --- */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-4">Event Details</h3>
        <div className="space-y-6">
          {/* Judul Event */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Event Title *</label>
            <div className="relative"><FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="e.g., Web3 Developer Workshop"/></div>
          </div>

          {/* Deskripsi */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 resize-y" placeholder="Tell us more about your event..."/>
          </div>
        </div>
      </div>
      
      {/* --- Tanggal, Lokasi, dan Kapasitas --- */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-4">Date, Time, and Location</h3>
        <div className="space-y-6">
          {/* ✅ Input Tanggal & Waktu Mulai dan Selesai */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date & Time *</label>
              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="datetime-local" id="startDate" value={startDate} onChange={(e) => setStartDate(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/></div>
            </div>
            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date & Time *</label>
              <div className="relative"><Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="datetime-local" id="endDate" value={endDate} onChange={(e) => setEndDate(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"/></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <div className="relative"><MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" /><input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="e.g., Grand Ballroom or 'Online'"/></div>
            </div>
            <div>
              <label htmlFor="maxAttendees" className="block text-sm font-medium text-gray-700 mb-2">Max Attendees</label>
              <input type="number" id="maxAttendees" value={maxAttendees} onChange={(e) => setMaxAttendees(e.target.value)} min="1" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Leave empty for unlimited"/>
            </div>
          </div>
        </div>
      </div>

      {/* --- ✅ Bagian Requirements (Dinamis) --- */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><ListChecks className="h-5 w-5 mr-2" /> Requirements</h3>
        <div className="space-y-4">
          {requirements.map((req, index) => (
            <div key={index} className="flex items-center space-x-2">
              <input type="text" value={req} onChange={(e) => handleRequirementChange(index, e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder={`Requirement #${index + 1}`}/>
              <button type="button" onClick={() => removeRequirement(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="h-5 w-5" /></button>
            </div>
          ))}
          <button type="button" onClick={addRequirement} className="inline-flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-800"><Plus className="h-4 w-4" /><span>Add Requirement</span></button>
        </div>
      </div>

      {/* --- ✅ Bagian Agenda (Dinamis) --- */}
      <div className="p-6 border rounded-lg bg-white">
        <h3 className="text-lg font-semibold mb-4 flex items-center"><Clock className="h-5 w-5 mr-2" /> Agenda</h3>
        <div className="space-y-4">
          {agenda.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <input type="time" value={item.time} onChange={(e) => handleAgendaChange(index, 'time', e.target.value)} className="md:col-span-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder="Time"/>
              <div className="md:col-span-2 flex items-center space-x-2">
                <input type="text" value={item.topic} onChange={(e) => handleAgendaChange(index, 'topic', e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500" placeholder={`Topic for item #${index + 1}`}/>
                <button type="button" onClick={() => removeAgendaItem(index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full"><Trash2 className="h-5 w-5" /></button>
              </div>
            </div>
          ))}
          <button type="button" onClick={addAgendaItem} className="inline-flex items-center space-x-2 text-sm font-medium text-purple-600 hover:text-purple-800"><Plus className="h-4 w-4" /><span>Add Agenda Item</span></button>
        </div>
      </div>
      
      {/* --- Upload Gambar --- */}
      <div className="p-6 border rounded-lg bg-white">
        <label className="block text-sm font-medium text-gray-700 mb-2">Event Image</label>
        <label className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-purple-400 cursor-pointer transition-colors block">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
          <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          {selectedImage && <p className="mt-2 text-sm text-gray-700">Selected: {selectedImage.name}</p>}
        </label>
      </div>
      
      {/* --- Tombol Aksi --- */}
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Link to="/vendor/dashboard" className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold">Cancel</Link>
        <button type="submit" disabled={isSubmitting} className="px-6 py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white rounded-lg font-semibold transition-all transform hover:scale-105 disabled:transform-none">
          {isSubmitting ? 'Creating Event...' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}