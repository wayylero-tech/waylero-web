
"use client";

import { useEffect, useState } from "react";

interface Props {
  src: string;
  alt: string;
  displayTitle: string;
  gallery?: string[];
}

export default function BlogLightboxImage({
  src,
  alt,
  displayTitle,
  gallery = [],
}: Props) {
  const images = gallery.length > 0 ? gallery : [src];

  const initialIndex = Math.max(
    0,
    images.indexOf(src)
  );

  const [open, setOpen] = useState(false);
  const [currentIndex, setCurrentIndex] =
    useState(initialIndex);

  const currentSrc =
    images[currentIndex] || src;

  const hasPrevious = currentIndex > 0;
  const hasNext =
    currentIndex < images.length - 1;

  const closeLightbox = () => {
    setOpen(false);
  };

  const previousImage = () => {
    if (!hasPrevious) return;
    setCurrentIndex((prev) => prev - 1);
  };

  const nextImage = () => {
    if (!hasNext) return;
    setCurrentIndex((prev) => prev + 1);
  };

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeLightbox();
      }

      if (event.key === "ArrowLeft") {
        previousImage();
      }

      if (event.key === "ArrowRight") {
        nextImage();
      }
    };

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow = "";
    };
  }, [open, currentIndex]);

  return (
    <>
      {/* NORMAL IMAGE */}
      <div className="my-12 relative group">
        <img
          src={`${src}?f=auto&q=70&w=1200`}
          loading="lazy"
          decoding="async"
          alt={
            alt ||
            `${displayTitle} İçerik Görseli`
          }
          className="w-full h-auto rounded-[2.5rem] shadow-xl transition-transform duration-500 group-hover:scale-[1.01] cursor-zoom-in border-4 border-white shadow-gray-200"
          onClick={() => {
            setCurrentIndex(initialIndex);
            setOpen(true);
          }}
        />

        {alt && (
          <span className="block text-center text-xs font-medium text-gray-400 mt-4 tracking-widest uppercase italic font-sans">
            — {alt}
          </span>
        )}
      </div>

      {/* LIGHTBOX */}
      {open && (
        <div
          className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4"
          onClick={closeLightbox}
        >
          {/* CLOSE BUTTON */}
          <button
            type="button"
            aria-label="Kapat"
            onClick={(event) => {
              event.stopPropagation();
              closeLightbox();
            }}
            className="absolute top-6 right-6 md:top-10 md:right-10 z-20 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center transition"
          >
            ×
          </button>

          {/* PREVIOUS */}
          {hasPrevious && (
            <button
              type="button"
              aria-label="Önceki fotoğraf"
              onClick={(event) => {
                event.stopPropagation();
                previousImage();
              }}
              className="absolute left-4 md:left-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl flex items-center justify-center transition"
            >
              ‹
            </button>
          )}

          {/* IMAGE */}
          <img
            src={`${currentSrc}?f=auto&q=85&w=1600`}
            alt={`${displayTitle} - Fotoğraf ${
              currentIndex + 1
            }`}
            decoding="async"
            onClick={(event) =>
              event.stopPropagation()
            }
            className="max-h-[85vh] max-w-[85vw] object-contain rounded-2xl animate-in zoom-in-95 duration-300 select-none"
          />

          {/* NEXT */}
          {hasNext && (
            <button
              type="button"
              aria-label="Sonraki fotoğraf"
              onClick={(event) => {
                event.stopPropagation();
                nextImage();
              }}
              className="absolute right-4 md:right-8 z-20 w-12 h-12 md:w-14 md:h-14 rounded-full bg-white/10 hover:bg-white/20 text-white text-3xl flex items-center justify-center transition"
            >
              ›
            </button>
          )}

          {/* COUNTER */}
          {images.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-5 py-2 rounded-full text-xs font-bold tracking-widest">
              {currentIndex + 1} / {images.length}
            </div>
          )}

          {/* HELP */}
          <div className="absolute top-8 left-1/2 -translate-x-1/2 text-white/50 text-[10px] font-black tracking-widest uppercase hidden md:block">
            ESC Kapat · ← → Geçiş
          </div>
        </div>
      )}
    </>
  );
}
