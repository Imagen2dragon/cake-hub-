import React, { useState } from 'react';

interface QrCodeShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QrCodeShareModal: React.FC<QrCodeShareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(
    `Check out CakeHub Digital Cake Catalogue & Order Online: ${shareUrl}`
  )}`;

  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    shareUrl
  )}&text=${encodeURIComponent('Browse our fresh cake designs on CakeHub!')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 select-none animate-fade-in">
      <div className="bg-[#ffffff] rounded-3xl border border-[#d7c1c4] shadow-2xl w-full max-w-md overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-[#8b4b58] text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[28px] text-[#ffd9de]">qr_code_2</span>
            <div>
              <h3 className="font-bold text-[18px]">Share Storefront QR Code</h3>
              <p className="text-[12px] text-[#ffd9de]">Scan to browse digital cake catalogue</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* QR Display */}
        <div className="p-8 flex flex-col items-center space-y-6 text-center">
          {/* Stylized QR Code Box */}
          <div className="bg-[#f8ebe6] p-6 rounded-3xl border-2 border-[#8b4b58] shadow-lg flex flex-col items-center">
            <div className="w-48 h-48 bg-white rounded-2xl p-3 shadow-inner flex flex-col items-center justify-center border border-[#d7c1c4]">
              {/* Generated SVG QR Code pattern */}
              <svg className="w-full h-full text-[#8b4b58]" viewBox="0 0 100 100" fill="currentColor">
                <rect x="0" y="0" width="30" height="30" rx="4" />
                <rect x="4" y="4" width="22" height="22" fill="white" rx="2" />
                <rect x="8" y="8" width="14" height="14" rx="2" />

                <rect x="70" y="0" width="30" height="30" rx="4" />
                <rect x="74" y="4" width="22" height="22" fill="white" rx="2" />
                <rect x="78" y="8" width="14" height="14" rx="2" />

                <rect x="0" y="70" width="30" height="30" rx="4" />
                <rect x="4" y="74" width="22" height="22" fill="white" rx="2" />
                <rect x="8" y="78" width="14" height="14" rx="2" />

                {/* Data dots */}
                <circle cx="50" cy="15" r="4" />
                <circle cx="40" cy="25" r="3" />
                <circle cx="60" cy="25" r="3" />
                <rect x="35" y="35" width="30" height="30" rx="6" />
                <rect x="42" y="42" width="16" height="16" fill="white" rx="3" />

                <circle cx="15" cy="50" r="4" />
                <circle cx="85" cy="50" r="4" />
                <circle cx="50" cy="85" r="4" />
                <circle cx="70" cy="70" r="3" />
                <circle cx="80" cy="80" r="4" />
              </svg>
            </div>
            <span className="text-[12px] font-bold text-[#8b4b58] mt-3 uppercase tracking-wider">
              Artisan Bakes Digital Storefront
            </span>
          </div>

          <div className="w-full space-y-3">
            <button
              onClick={handleCopyLink}
              className="w-full py-3 bg-[#8b4b58] text-white rounded-xl font-bold text-[13px] tracking-wider shadow-md hover:bg-[#8b4b58]/90 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">
                {copied ? 'check_circle' : 'content_copy'}
              </span>
              <span>{copied ? 'Catalogue Link Copied!' : 'Copy Storefront Link'}</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>WhatsApp</span>
              </a>

              <a
                href={telegramShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-2.5 bg-sky-700 hover:bg-sky-600 text-white rounded-xl text-[12px] font-bold text-center transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span>Telegram</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
