
"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";

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
  const [index, setIndex] = useState<number | null>(null);

  useEffect(() => {
    if (index === null) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIndex(null);

      if (e.key === "ArrowRight" && index < images.length - 1) {
        setIndex((i) => (i !== null ? i + 1 : i));
      }

      if (e.key === "ArrowLeft" && index > 0) {
        setIndex((i) => (i !== null ? i - 1 : i));
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [index, images.length]);

  if (!images?.length) return null;

  const extraImages = images.length - 5;

  return (
    <>
      {/* DESKTOP */}

      {images.length === 1 ? (
        <div
          className="hidden md:block mb-12 cursor-zoom-in"
          onClick={() => setIndex(0)}
        >
          <div className="h-[420px] overflow-hidden rounded-3xl">
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 mb-12">

          {/* HERO */}
          <div
            className="col-span-2 row-span-2 overflow-hidden rounded-3xl cursor-zoom-in h-[420px]"
            onClick={() => setIndex(0)}
          >
            <img
              src={images[0]}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>

          {images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl cursor-zoom-in h-[200px]"
              onClick={() => setIndex(i + 1)}
            >
              <img
                src={img}
                alt={`${title} ${i + 2}`}
                className="w-full h-full object-cover"
              />

              {i === 3 && extraImages > 0 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-xl font-bold">
                  +{extraImages} fotoğraf
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
        >
          {images.map((img, i) => (
            <SwiperSlide key={i}>
              <img
                src={img}
                alt={`${title} ${i + 1}`}
                onClick={() => setIndex(i)}
                className="rounded-3xl object-cover w-full aspect-[4/3]"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LIGHTBOX */}

      {index !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">

          <button
            onClick={() => setIndex(null)}
            className="absolute top-6 right-6 text-white text-4xl font-black"
          >
            ×
          </button>

          {index > 0 && (
            <button
              onClick={() => setIndex(index - 1)}
              className="absolute left-6 text-white text-6xl"
            >
              ‹
            </button>
          )}

          <img
            src={images[index]}
            className="max-w-[92vw] max-h-[92vh] object-contain"
          />

          {index < images.length - 1 && (
            <button
              onClick={() => setIndex(index + 1)}
              className="absolute right-6 text-white text-6xl"
            >
              ›
            </button>
          )}

          <div className="absolute bottom-6 text-white text-sm opacity-70">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
