"use client";

import { useEffect, useState } from "react";

export default function PlaceLightboxGallery({
  images,
  children,
}: {
  images: string[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight" && index < images.length - 1)
        setIndex((i) => i + 1);
      if (e.key === "ArrowLeft" && index > 0)
        setIndex((i) => i - 1);
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, index, images.length]);

  return (
    <>
      <div
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="cursor-zoom-in"
      >
        {children}
      </div>

      {open && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          {/* KAPAT */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 text-white text-4xl font-black"
          >
            ×
          </button>

          {/* SOL */}
          {index > 0 && (
            <button
              onClick={() => setIndex(index - 1)}
              className="absolute left-6 text-white text-6xl select-none"
            >
              ‹
            </button>
          )}

          {/* RESİM */}
          <img
            src={images[index]}
            className="max-w-[92vw] max-h-[92vh] object-contain"
          />

          {/* SAĞ */}
          {index < images.length - 1 && (
            <button
              onClick={() => setIndex(index + 1)}
              className="absolute right-6 text-white text-6xl select-none"
            >
              ›
            </button>
          )}

          {/* SAYI */}
          <div className="absolute bottom-6 text-white text-sm opacity-70">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
