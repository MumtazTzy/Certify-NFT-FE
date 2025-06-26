// FileUploadForm.tsx
// Hapus 'React' dari impor jika tidak digunakan secara eksplisit
import { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { Upload, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface FileUploadFormProps {
  onFileSelect: (file: File | null) => void;
  label?: string;
  subText?: string;
  allowedFileTypes?: string;
  maxFileSizeMB?: number;
  currentFile?: File | null;
  error?: string | null; // error eksternal bisa null atau string
  className?: string;
}

// Ubah tipe prop message di sini agar lebih fleksibel
const FormErrorDisplay = ({ message }: { message?: string | null }) => {
  if (!message) return null; // Ini sudah benar, akan mengevaluasi false untuk null, undefined, atau string kosong
  return (
    <div className="flex items-center text-red-600 text-sm mt-1" role="alert">
      <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0" />
      <span>{message}</span>
    </div>
  );
};

export default function FileUploadForm({
  onFileSelect,
  label = "Upload File",
  subText = "PNG, JPG, PDF up to 5MB",
  allowedFileTypes = "image/*,application/pdf",
  maxFileSizeMB = 5,
  currentFile,
  error: externalError, // externalError bisa string | null | undefined dari props
  className = "",
}: FileUploadFormProps) {
  const [internalError, setInternalError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(
    currentFile ? currentFile.name : null
  );
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // finalError akan menjadi string | null | undefined
  // Jika externalError adalah undefined dan internalError adalah null, finalError akan null.
  // Jika externalError adalah string, finalError akan string.
  // Jika externalError adalah null, dan internalError adalah null, finalError akan null.
  const finalError = externalError !== undefined ? externalError : internalError;


  const handleFileChange = (file: File | null) => {
    setInternalError(null);

    if (!file) {
      setSelectedFileName(null);
      onFileSelect(null);
      return;
    }

    const maxSizeInBytes = maxFileSizeMB * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      const errorMsg = `File size must be under ${maxFileSizeMB}MB.`;
      setInternalError(errorMsg);
      toast.error(errorMsg);
      setSelectedFileName(null);
      onFileSelect(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      return;
    }

    setSelectedFileName(file.name);
    onFileSelect(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    handleFileChange(file || null);
  };

  const handleLabelClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEnter = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileChange(files[0]);
      e.dataTransfer.clearData();
    }
  };

  return (
    <div className={`p-6 border rounded-lg bg-white shadow-sm ${className}`}>
      <label
        htmlFor="file-upload-input"
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors block
                    ${finalError ? 'border-red-500 hover:border-red-600' : 'border-gray-300 hover:border-purple-400'}
                    ${isDragging ? 'border-purple-500 bg-purple-50' : ''}`}
        onClick={handleLabelClick}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleLabelClick(); }}
      >
        <Upload className={`h-8 w-8 mx-auto mb-2 ${isDragging ? 'text-purple-600' : 'text-gray-400'}`} />
        <p className={`text-sm mb-2 ${isDragging ? 'text-purple-700' : 'text-gray-600'}`}>
          {label}
        </p>
        <p className="text-xs text-gray-500">{subText}</p>
        <input
          id="file-upload-input"
          type="file"
          accept={allowedFileTypes}
          className="hidden"
          onChange={handleInputChange}
          ref={fileInputRef}
        />
        {selectedFileName && !finalError && (
          <p className="mt-2 text-sm text-green-700 font-medium">
            Selected: {selectedFileName}
          </p>
        )}
      </label>
      {/* Tidak perlu konversi lagi jika FormErrorDisplay sudah menerima string | null | undefined */}
      <FormErrorDisplay message={finalError} />
    </div>
  );
}