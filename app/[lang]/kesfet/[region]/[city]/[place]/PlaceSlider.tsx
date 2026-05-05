"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

// Cloudinary Yapılandırması (CityPage ile aynı)
const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  // Path başında / varsa temizler ve optimizasyon parametrelerini ekler
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

export default function PlaceSlider({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight" && index < images.length - 1) setIndex(index + 1);
      if (e.key === "ArrowLeft" && index > 0) setIndex(index - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length]);

  if (!images?.length) return null;

  const extraImages = images.length - 5;

  return (
    <>
      {/* DESKTOP GRID */}
      {images.length === 1 ? (
        <div className="hidden md:block mb-12 cursor-zoom-in" onClick={() => setIndex(0)}>
          <div className="relative h-[500px] overflow-hidden rounded-[2.5rem] border border-gray-100">
            <img
              src={getCloudinaryUrl(images[0], 1200)}
              alt={title}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-4 mb-12 h-[500px]">
          {/* HERO GÖRSEL (SOL BÜYÜK) */}
          <div
            className="relative col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] cursor-zoom-in border border-gray-100"
            onClick={() => setIndex(0)}
          >
            <img
              src={getCloudinaryUrl(images[0], 800)}
              alt={title}
              loading="eager"
              className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
            />
          </div>

          {/* SAĞDAKİ KÜÇÜK GÖRSELLER */}
          {images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl cursor-zoom-in border border-gray-100"
              onClick={() => setIndex(i + 1)}
            >
              <img
                src={getCloudinaryUrl(img, 400)}
                alt={`${title} ${i + 2}`}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-700"
              />
              {i === 3 && extraImages > 0 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white transition-colors hover:bg-black/20">
                  <span className="text-2xl font-black">+{extraImages}</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Fotoğraf</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* MOBILE SLIDER */}
      <div className="md:hidden mb-10">
        <Swiper
          modules={[Navigation, Pagination]}
          slidesPerView={1}
          spaceBetween={10}
          navigation
          pagination={{ clickable: true }}
          className="rounded-[2rem] overflow-hidden"
        >
          {images.slice(0, 8).map((img, i) => (
            <SwiperSlide key={i}>
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100" onClick={() => setIndex(i)}>
                <img
                  src={getCloudinaryUrl(img, 600)}
                  alt={`${title} ${i + 1}`}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LIGHTBOX */}
      {index !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center">
          <button 
            onClick={() => setIndex(null)} 
            className="absolute top-8 right-8 text-white/50 hover:text-white text-5xl font-light transition-colors z-50"
          >
            ×
          </button>
          
          {index > 0 && (
            <button 
              onClick={() => setIndex(index - 1)} 
              className="absolute left-4 md:left-10 text-white/30 hover:text-white text-6xl transition-colors z-50"
            >
              ‹
            </button>
          )}

          <div className="relative w-[90vw] h-[80vh] flex items-center justify-center">
            <img
              src={getCloudinaryUrl(images[index], 1600)}
              alt={title}
              className="max-w-full max-h-full object-contain shadow-2xl"
            />
          </div>

          {index < images.length - 1 && (
            <button 
              onClick={() => setIndex(index + 1)} 
              className="absolute right-4 md:right-10 text-white/30 hover:text-white text-6xl transition-colors z-50"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-2 bg-white/10 rounded-full text-white/80 text-xs font-black tracking-widest uppercase">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}