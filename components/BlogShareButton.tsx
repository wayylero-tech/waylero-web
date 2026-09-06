"use client";

import { useState } from "react";
import { Share2 } from "lucide-react";

interface Props {
  title: string;
  label: string;
  copiedLabel: string;
}

export default function BlogShareButton({
  title,
  label,
  copiedLabel,
}: Props) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const shareData = {
      title,
      text: `${title} 🌍 Waylero Journal`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        console.log("Paylaşma iptal edildi");
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        console.error("Link kopyalanamadı");
      }
    }
  };

  return (
    <>
      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 uppercase"
      >
        <Share2 size={16} />
        {label}
      </button>

      {copied && (
        <div className="text-center text-[10px] font-black text-orange-600 animate-bounce">
          {copiedLabel}
        </div>
      )}
    </>
  );
}