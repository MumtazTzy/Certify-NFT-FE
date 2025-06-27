import React, { useState, useEffect, useRef } from 'react';
import { Check, Share2, Link, MessageCircle, Twitter, Facebook, Linkedin } from 'lucide-react';

interface ShareCardProps {
  eventTitle?: string;
  eventUrl?: string;
}

const ShareCard: React.FC<ShareCardProps> = ({ 
  eventTitle = "Check out this amazing event!", 
  eventUrl 
}) => {
  const [isCopied, setIsCopied] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleCopyLink = () => {
    if (isCopied) return;

    const urlToCopy = eventUrl || window.location.href;
    navigator.clipboard.writeText(urlToCopy)
      .then(() => {
        setIsCopied(true);
        timeoutRef.current = window.setTimeout(() => {
          setIsCopied(false);
        }, 2000);
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
      });
  };

  const shareData = {
    title: eventTitle,
    url: eventUrl || window.location.href,
    text: `Join me at ${eventTitle}! Check out this amazing blockchain event.`
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy link if native sharing is not available
      handleCopyLink();
    }
  };

  const handleSocialShare = (platform: string) => {
    const url = encodeURIComponent(shareData.url);
    const text = encodeURIComponent(shareData.text);

    let shareUrl = '';
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-purple-100 rounded-lg p-2">
          <Share2 className="h-5 w-5 text-purple-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Share Event</h3>
      </div>

      {/* Native Share Button */}
      <button
        onClick={handleNativeShare}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white py-4 px-4 rounded-xl font-semibold transition-all transform hover:scale-105 text-base shadow-lg mb-4 flex items-center justify-center space-x-2"
      >
        <Share2 className="h-5 w-5" />
        <span>Share Event</span>
      </button>

      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        disabled={isCopied}
        className={`w-full py-4 px-4 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 mb-6 ${
          isCopied 
            ? 'bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 border border-green-200 cursor-default' 
            : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-700 border border-gray-200 cursor-pointer hover:border-gray-300'
        }`}
      >
        {isCopied ? (
          <>
            <Check className="h-5 w-5" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Link className="h-5 w-5" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      {/* Social Media Share */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Share on Social Media</h4>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleSocialShare('twitter')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 text-blue-700 py-3 px-4 rounded-xl font-medium transition-all border border-blue-200 hover:border-blue-300"
          >
            <Twitter className="h-4 w-4" />
            <span className="text-sm">Twitter</span>
          </button>

          <button
            onClick={() => handleSocialShare('facebook')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-sm"
          >
            <Facebook className="h-4 w-4" />
            <span className="text-sm">Facebook</span>
          </button>

          <button
            onClick={() => handleSocialShare('linkedin')}
            className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-700 to-blue-800 hover:from-blue-800 hover:to-blue-900 text-white py-3 px-4 rounded-xl font-medium transition-all shadow-sm"
          >
            <Linkedin className="h-4 w-4" />
            <span className="text-sm">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Event URL Display */}
      <div className="mt-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
        <div className="flex items-center space-x-2 mb-2">
          <Link className="h-4 w-4 text-gray-500" />
          <span className="text-xs font-medium text-gray-600">Event URL</span>
        </div>
        <p className="text-sm text-gray-700 break-all">
          {eventUrl || window.location.href}
        </p>
      </div>

      {/* Share Tips */}
      <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start space-x-2">
          <MessageCircle className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-xs font-medium text-blue-800 mb-1">Share Tips</p>
            <p className="text-xs text-blue-700">
              Share this event with friends and colleagues who might be interested in blockchain technology and certification opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareCard;