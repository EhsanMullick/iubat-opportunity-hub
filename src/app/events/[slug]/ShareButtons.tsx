'use client';

import React, { useState } from 'react';
import { Share2, Copy, Check } from 'lucide-react';

export default function ShareButtons({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    if (typeof window === 'undefined') return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  const handleShare = async () => {
    if (typeof window === 'undefined') return;
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: window.location.href,
        });
      } catch {
        // user aborted share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="grid grid-cols-2 gap-2 pt-1">
      <button
        onClick={handleCopyLink}
        className="py-2.5 px-3 rounded-xl glass-input hover:bg-white text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
            <span className="text-emerald-700">Copied!</span>
          </>
        ) : (
          <>
            <Copy className="w-3.5 h-3.5 text-slate-500" />
            <span>Copy Link</span>
          </>
        )}
      </button>

      <button
        onClick={handleShare}
        className="py-2.5 px-3 rounded-xl glass-input hover:bg-white text-slate-700 font-semibold text-xs transition-all flex items-center justify-center gap-1.5"
      >
        <Share2 className="w-3.5 h-3.5 text-indigo-600" />
        <span>Share Event</span>
      </button>
    </div>
  );
}
