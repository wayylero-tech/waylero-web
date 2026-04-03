"use client";

import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image"; // 🔥 Next.js Image eklendi

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
          <div className="relative h-[420px] overflow-hidden rounded-3xl">
            <Image
              src={images[0]}
              alt={title}
              fill
              priority // İlk resim olduğu için hızlı yüklensin
              className="object-cover"
              sizes="(max-width: 1200px) 100vw, 1200px"
            />
          </div>
        </div>
      ) : (
        <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-3 mb-12">
          {/* HERO GÖRSEL */}
          <div
            className="relative col-span-2 row-span-2 overflow-hidden rounded-3xl cursor-zoom-in h-[420px]"
            onClick={() => setIndex(0)}
          >
            <Image
              src={images[0]}
              alt={title}
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
            />
          </div>

          {/* DİĞER KÜÇÜK GÖRSELLER */}
          {images.slice(1, 5).map((img, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-3xl cursor-zoom-in h-[200px]"
              onClick={() => setIndex(i + 1)}
            >
              <Image
                src={img}
                alt={`${title} ${i + 2}`}
                fill
                className="object-cover"
                sizes="300px"
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
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
                <Image
                  src={img}
                  alt={`${title} ${i + 1}`}
                  fill
                  onClick={() => setIndex(i)}
                  className="object-cover"
                  sizes="100vw"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* LIGHTBOX (Büyük hali için de Image kullanıyoruz) */}
      {index !== null && (
        <div className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center">
          <button onClick={() => setIndex(null)} className="absolute top-6 right-6 text-white text-4xl font-black z-50">×</button>
          
          {index > 0 && (
            <button onClick={() => setIndex(index - 1)} className="absolute left-6 text-white text-6xl z-50">‹</button>
          )}

          <div className="relative w-[92vw] h-[92vh]">
            <Image
              src={images[index]}
              alt={title}
              fill
              className="object-contain"
              unoptimized={false} // Wikipedia büyük resimlerini burada da optimize etsin
            />
          </div>

          {index < images.length - 1 && (
            <button onClick={() => setIndex(index + 1)} className="absolute right-6 text-white text-6xl z-50">›</button>
          )}

          <div className="absolute bottom-6 text-white text-sm opacity-70">
            {index + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}