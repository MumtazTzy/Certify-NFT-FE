import React, { useState } from "react";
import toast from "react-hot-toast";
import { useParams } from 'react-router-dom';

interface MintCertificateButtonProps {
  eventId?: string;
  disabled?: boolean;
}

const API_BASE_URL = "https://api.gpadaka.com/api1";

const MintCertificateButton: React.FC<MintCertificateButtonProps> = (props) => {
  const params = useParams<{ id: string }>();
  const eventId = props.eventId || params.id;
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
    setMinting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/certificates/mint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
        // sertakan auth jika perlu
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mint failed.");
      toast.success("Certificate minted successfully!");
      // Bisa tampilkan link NFT, dsb
    } catch (err: any) {
      toast.error(err.message || "Mint failed.");
    } finally {
      setMinting(false);
    }
  };

  return (
    <button
      onClick={handleMint}
      disabled={minting || props.disabled}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      {minting ? "Minting..." : "Mint Certificate"}
    </button>
  );
};

export default MintCertificateButton;
