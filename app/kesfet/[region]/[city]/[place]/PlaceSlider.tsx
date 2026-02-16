"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function PlaceSlider({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // ESC ve ok tuşları
  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);

      if (e.key === "ArrowRight" && lightboxIndex < images.length - 1) {
        setLightboxIndex((prev) => (prev !== null ? prev + 1 : prev));
      }

      if (e.key === "ArrowLeft" && lightboxIndex > 0) {
        setLightboxIndex((prev) => (prev !== null ? prev - 1 : prev));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, images.length]);

  return (
    <>
      {/* 🔹 SLIDER */}
      <div className="mb-16">
        <Swiper
          modules={[Navigation, Pagination, Keyboard, Autoplay]}
          slidesPerView={images.length > 1 ? 2 : 1}
          spaceBetween={20}
          navigation={images.length > 1}
          pagination={{ clickable: true }}
          keyboard={{ enabled: true }}
          loop={images.length > 1}
          autoplay={
            images.length > 1
              ? { delay: 3000, disableOnInteraction: false }
              : false
          }
          className="py-10"
        >
          {images.map((img, index) => (
            <SwiperSlide key={index}>
              <img
                src={img}
                alt={`${title} ${index + 1}`}
                draggable={false}
                onClick={() => setLightboxIndex(index)}
                className="cursor-zoom-in max-h-[600px] w-full object-contain select-none rounded-[2rem]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* 🔹 FULLSCREEN LIGHTBOX */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          
          {/* Kapat */}
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-6 right-6 text-white text-4xl font-black"
          >
            ×
          </button>

          {/* Sol ok */}
          {lightboxIndex > 0 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex - 1)}
              className="absolute left-6 text-white text-6xl select-none"
            >
              ‹
            </button>
          )}

          {/* Resim */}
          <img
            src={images[lightboxIndex]}
            className="max-w-[92vw] max-h-[92vh] object-contain"
          />

          {/* Sağ ok */}
          {lightboxIndex < images.length - 1 && (
            <button
              onClick={() => setLightboxIndex(lightboxIndex + 1)}
              className="absolute right-6 text-white text-6xl select-none"
            >
              ›
            </button>
          )}

          {/* Sayaç */}
          <div className="absolute bottom-6 text-white text-sm opacity-70">
            {lightboxIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
