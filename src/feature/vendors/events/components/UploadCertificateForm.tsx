import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';

interface UploadCertificateFormProps {
  eventId?: string;
  onUploaded?: () => void; // Callback jika upload sukses
}

const API_BASE_URL = "https://api.gpadaka.com/api3";

const UploadCertificateForm: React.FC<UploadCertificateFormProps> = (props) => {
  const params = useParams<{ id: string }>();
  const eventId = props.eventId || params.id;
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a certificate image.");
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append("certificate", file);

    try {
      const res = await fetch(`${API_BASE_URL}/api/events/${eventId}/upload-certificate`, {
        method: "POST",
        body: formData,
        // credentials, headers, dsb jika perlu
      });
      if (!res.ok) throw new Error("Failed to upload certificate.");
      toast.success("Certificate template uploaded!");
      setFile(null);
      props.onUploaded?.();
    } catch (err: any) {
      toast.error(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="font-bold mb-2">Upload Certificate Template</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        disabled={uploading}
        className="mb-2"
      />
      <button
        onClick={handleUpload}
        disabled={uploading || !file}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default UploadCertificateForm;
