// src/components/CreateEventForm.tsx

import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom'; // Dipindahkan ke FormActions
// import { Loader2 } from 'lucide-react'; // Dipindahkan ke FormActions
import { useAuth } from '../../..//auth/hooks/useAuth';
import { toast } from 'react-hot-toast';

// Impor Sub-Komponen
import EventBasicDetails from './CreateEvent/EventBasicDisplay';
import EventDateTimeLocation from './CreateEvent/EventDateTimeLocation';
import EventRequirementsInput from './CreateEvent/EventRequirementsInput';
import EventAgendaInput from './CreateEvent/EventAgendaInput';
import EventImageUpload from './CreateEvent/EventImageUpload';
import FormActions from './CreateEvent/FormActions';
// FormErrorDisplay digunakan di dalam sub-komponen


// --- Tipe Data ---
interface CreateEventFormProps {
  onSubmit: (fd: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export interface AgendaItem { // Ekspor tipe ini jika digunakan oleh sub-komponen (EventAgendaInput)
  time: string;
  topic: string;
}

type FormErrors = {
  [key:string]: string | undefined;
  title?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  location?: string;
  image?: string;
  maxAttendees?: string;
};

// FormErrorDisplay tidak lagi didefinisikan di sini

export default function CreateEventForm({ onSubmit, isSubmitting }: CreateEventFormProps) {
  const { user } = useAuth();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [maxAttendees, setMaxAttendees] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [agenda, setAgenda] = useState<AgendaItem[]>([{ time: '', topic: '' }]);
  const [errors, setErrors] = useState<FormErrors>({});

  const getMinDateTimeForInput = () => {
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };
  const [minDateTime, setMinDateTime] = useState(getMinDateTimeForInput());

  useEffect(() => {
    setMinDateTime(getMinDateTimeForInput());
  }, []);

  const validateField = (name: keyof FormErrors, value: string | File | null) => {
    let errorMsg: string | undefined;
    const stringValue = typeof value === 'string' ? value : '';

    switch (name) {
      case 'title':
        if (!stringValue.trim()) errorMsg = 'Event title is required.';
        else if (stringValue.length > 255) errorMsg = 'Title cannot exceed 255 characters.';
        break;
      case 'description':
        if (!stringValue.trim()) errorMsg = 'Description is required.';
        break;
      case 'location':
        if (!stringValue.trim()) errorMsg = 'Location is required.';
        break;
      case 'startDate':
        if (!stringValue) errorMsg = 'Start date is required.';
        else if (new Date(stringValue) < new Date(minDateTime)) errorMsg = 'Start date cannot be in the past or less than 1 hour from now.';
        break;
      case 'endDate':
        if (!stringValue) errorMsg = 'End date is required.';
        else if (startDate && new Date(stringValue) < new Date(startDate)) errorMsg = 'End date cannot be before the start date.';
        break;
      case 'maxAttendees':
        if (stringValue && (isNaN(Number(stringValue)) || Number(stringValue) < 0)) errorMsg = 'Max attendees must be a non-negative number.';
        break;
      case 'image':
        if (value && (value as File).size > 10 * 1024 * 1024) errorMsg = 'Image size must be under 10MB.';
        break;
      default:
        break;
    }
    setErrors(prev => ({ ...prev, [name]: errorMsg }));
  };
  
  const validateForm = (): boolean => {
    validateField('title', title);
    validateField('description', description);
    validateField('location', location);
    validateField('startDate', startDate);
    validateField('endDate', endDate);
    validateField('maxAttendees', maxAttendees);
    if (selectedImage) validateField('image', selectedImage);

    const currentErrors: FormErrors = {};
    if (!title.trim()) currentErrors.title = 'Event title is required.';
    if (title.length > 255) currentErrors.title = 'Title cannot exceed 255 characters.';
    if (!description.trim()) currentErrors.description = 'Description is required.';
    if (!location.trim()) currentErrors.location = 'Location is required.';
    if (!startDate) currentErrors.startDate = 'Start date is required.';
    else if (new Date(startDate) < new Date(minDateTime)) currentErrors.startDate = 'Start date cannot be in the past or less than 1 hour from now.';
    if (!endDate) currentErrors.endDate = 'End date is required.';
    else if (startDate && new Date(endDate) < new Date(startDate)) currentErrors.endDate = 'End date cannot be before the start date.';
    if (maxAttendees && (isNaN(Number(maxAttendees)) || Number(maxAttendees) < 0)) currentErrors.maxAttendees = 'Max attendees must be a non-negative number.';
    if (selectedImage && selectedImage.size > 10 * 1024 * 1024) currentErrors.image = 'Image size must be under 10MB.';
    
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };
  
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    validateField('startDate', newStartDate);
    if (endDate && new Date(endDate) < new Date(newStartDate)) {
      setEndDate(newStartDate);
      validateField('endDate', newStartDate);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      validateField('image', file);
      if (file.size <= 10 * 1024 * 1024) {
        setSelectedImage(file);
        setErrors(prev => ({ ...prev, image: undefined }));
      } else {
        setSelectedImage(null);
        e.target.value = '';
      }
    } else {
        setSelectedImage(null);
        validateField('image', null);
    }
  };

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };
  const addRequirement = () => setRequirements([...requirements, '']);
  const removeRequirement = (index: number) => {
    if (requirements.length > 1) {
      setRequirements(requirements.filter((_, i) => i !== index));
    } else {
      setRequirements(['']);
    }
  };

  const handleAgendaChange = (index: number, field: keyof AgendaItem, value: string) => {
    const newAgenda = agenda.map((item, i) => 
      i === index ? { ...item, [field]: value } : item
    );
    setAgenda(newAgenda);
  };
  const addAgendaItem = () => setAgenda([...agenda, { time: '', topic: '' }]);
  const removeAgendaItem = (index: number) => {
    if (agenda.length > 1) {
      setAgenda(agenda.filter((_, i) => i !== index));
    } else {
      setAgenda([{ time: '', topic: ''}]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please review the form for errors before submitting.");
      const firstErrorKey = Object.keys(errors).find(key => errors[key as keyof FormErrors]);
      if (firstErrorKey) {
          const errorElement = document.getElementById(firstErrorKey);
          errorElement?.focus();
          errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    if (!user || user.role !== 'vendors' || !user.walletAddress) {
      toast.error("Authentication issue. Please ensure you are logged in as a vendor.");
      return;
    }

    const fd = new FormData();
    fd.append('title', title);
    fd.append('description', description);
    fd.append('wallet_address', user.walletAddress);
    if (selectedImage) {
      fd.append('picture', selectedImage, selectedImage.name);
    }
    fd.append('location', location);
    fd.append('maxattendees', maxAttendees.trim() === '' ? '0' : maxAttendees);
    if (startDate) fd.append('start_date', startDate);
    if (endDate) fd.append('end_date', endDate);
    
    const filteredRequirements = requirements.filter(req => req.trim() !== '');
    fd.append('requirements', JSON.stringify(filteredRequirements.length > 0 ? filteredRequirements : []));

    const filteredAgenda = agenda.filter(item => item.topic.trim() !== '' && item.time.trim() !== '');
    fd.append('agenda', JSON.stringify(filteredAgenda.length > 0 ? filteredAgenda : []));
    
    await onSubmit(fd);
  };

  const hasValidationErrors = Object.values(errors).some(e => e !== undefined);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <EventBasicDetails
        title={title}
        onTitleChange={setTitle}
        description={description}
        onDescriptionChange={setDescription}
        validateField={(name, value) => validateField(name as 'title' | 'description', value)}
        errors={{ title: errors.title, description: errors.description }}
      />
      <EventDateTimeLocation
        startDate={startDate}
        onStartDateChange={handleStartDateChange}
        endDate={endDate}
        onEndDateChange={(value) => {setEndDate(value); validateField('endDate', value);}}
        location={location}
        onLocationChange={(value) => {setLocation(value); validateField('location', value);}}
        maxAttendees={maxAttendees}
        onMaxAttendeesChange={(value) => {setMaxAttendees(value); validateField('maxAttendees', value);}}
        minDateTime={minDateTime}
        validateField={(name, value) => validateField(name as 'startDate' | 'endDate' | 'location' | 'maxAttendees', value)}
        errors={{
          startDate: errors.startDate,
          endDate: errors.endDate,
          location: errors.location,
          maxAttendees: errors.maxAttendees,
        }}
      />
      <EventRequirementsInput
        requirements={requirements}
        onRequirementChange={handleRequirementChange}
        onAddRequirement={addRequirement}
        onRemoveRequirement={removeRequirement}
      />
      <EventAgendaInput
        agenda={agenda}
        onAgendaChange={handleAgendaChange}
        onAddAgendaItem={addAgendaItem}
        onRemoveAgendaItem={removeAgendaItem}
      />
      <EventImageUpload
        selectedImage={selectedImage}
        onImageChange={handleImageChange}
        error={errors.image}
      />
      <FormActions
        isSubmitting={isSubmitting}
        hasErrors={hasValidationErrors}
        cancelLink="/vendor/dashboard"
      />
    </form>
  );
}