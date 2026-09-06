"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  width?: number;
  className?: string;
  imageClassName?: string;
  loading?: "lazy" | "eager";
}

export default function BlogGalleryImage({
  src,
  alt,
  priority = false,
  quality = 70,
  width = 1200,
  className = "relative h-[500px] overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in",
  imageClassName = "absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105",
  loading,
}: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={className} onClick={() => setOpen(true)}>
        <img
          src={src.replace(
  "/upload/",
  `/upload/f_auto,q_${quality},w_${width}/`
)}
          alt={alt}
          fetchPriority={priority ? "high" : "low"}
          loading={loading}
          decoding="async"
          className={imageClassName}
        />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out"
        >
          <img
           src={src.replace(
  "/upload/",
  "/upload/f_auto,q_85,w_1600/"
)}
            alt={alt}
            decoding="async"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl animate-in zoom-in-95 duration-300"
          />

          <div className="absolute top-10 right-10 text-white/50 text-[10px] font-black tracking-widest uppercase">
            Kapatmak için tıkla
          </div>
        </div>
      )}
    </>
  );
}