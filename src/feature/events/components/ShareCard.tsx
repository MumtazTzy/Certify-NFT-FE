import React, { useState, useEffect, useRef } from 'react';
// Impor ikon Check untuk feedback
import { ExternalLink, Check } from 'lucide-react';

const ShareCard: React.FC = () => {
  // State untuk melacak status "ter-copy"
  const [isCopied, setIsCopied] = useState(false);
  // Ref untuk menyimpan ID dari setTimeout, untuk cleanup
  const timeoutRef = useRef<number | null>(null);

  // useEffect untuk membersihkan timeout saat komponen unmount
  // Ini mencegah error "Can't perform a React state update on an unmounted component"
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = () => {
    // Jika sudah di-copy, jangan lakukan apa-apa sampai reset
    if (isCopied) return;

    navigator.clipboard.writeText(window.location.href)
      .then(() => {
        // 1. Set status menjadi "ter-copy"
        setIsCopied(true);
        
        // 2. Set timer untuk mereset status setelah 2 detik (2000 ms)
        timeoutRef.current = window.setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        // Anda bisa menambahkan feedback untuk error di sini jika perlu
      });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Share Event</h3>
      <button
        onClick={handleCopyLink}
        // Tombol dinonaktifkan sementara saat dalam status "Copied!"
        disabled={isCopied}
        // ClassName dinamis berdasarkan status isCopied
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 
          ${isCopied 
            ? 'bg-green-100 text-green-700 cursor-default' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-700 cursor-pointer'
          }`
        }
      >
        {isCopied ? (
          <>
            <Check className="h-5 w-5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <ExternalLink className="h-5 w-5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
};

export default ShareCard;