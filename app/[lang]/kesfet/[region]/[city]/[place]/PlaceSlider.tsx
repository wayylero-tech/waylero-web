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
<div className="hidden md:block mb-12">
  {/* 1 RESİM VARSA */}
  {images.length === 1 && (
    <div className="relative h-[500px] overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in" onClick={() => setIndex(0)}>
      <img
        src={getCloudinaryUrl(images[0], 1200)}
        alt={title}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
      />
    </div>
  )}

  {/* 2 RESİM VARSA: Yan yana eşit iki büyük blok */}
  {images.length === 2 && (
    <div className="grid grid-cols-2 gap-4 h-[500px]">
      {images.map((img, i) => (
        <div key={i} className="relative overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in" onClick={() => setIndex(i)}>
          <img
            src={getCloudinaryUrl(img, 800)}
            alt={`${title} ${i + 1}`}
            loading="eager"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />
        </div>
      ))}
    </div>
  )}

  {/* 3 RESİM VARSA: Sol büyük, sağda alt alta iki orta boy */}
  {images.length === 3 && (
    <div className="grid grid-cols-2 grid-rows-2 gap-4 h-[500px]">
      <div className="relative row-span-2 overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in" onClick={() => setIndex(0)}>
        <img
          src={getCloudinaryUrl(images[0], 800)}
          alt={title}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      {images.slice(1, 3).map((img, i) => (
        <div key={i} className="relative overflow-hidden rounded-3xl border border-gray-100 cursor-zoom-in" onClick={() => setIndex(i + 1)}>
          <img
            src={getCloudinaryUrl(img, 600)}
            alt={`${title} ${i + 2}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
      ))}
    </div>
  )}

  {/* 4 RESİM VARSA: Sol büyük, sağ üst tek büyük, sağ alt yan yana iki küçük */}
  {images.length === 4 && (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
      {/* Sol Büyük */}
      <div className="relative col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in" onClick={() => setIndex(0)}>
        <img
          src={getCloudinaryUrl(images[0], 800)}
          alt={title}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>
      {/* Sağ Üst Tek Büyük */}
      <div className="relative col-span-2 row-span-1 overflow-hidden rounded-3xl border border-gray-100 cursor-zoom-in" onClick={() => setIndex(1)}>
        <img
          src={getCloudinaryUrl(images[1], 800)}
          alt={`${title} 2`}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
      </div>
      {/* Sağ Alt Yan Yana İki Küçük */}
      {images.slice(2, 4).map((img, i) => (
        <div key={i} className="relative col-span-1 row-span-1 overflow-hidden rounded-3xl border border-gray-100 cursor-zoom-in" onClick={() => setIndex(i + 2)}>
          <img
            src={getCloudinaryUrl(img, 400)}
            alt={`${title} ${i + 3}`}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          />
        </div>
      ))}
    </div>
  )}

  {/* 5 VEYA DAHA FAZLA RESİM VARSA (Orijinal Düzenin) */}
  {images.length >= 5 && (
    <div className="grid grid-cols-4 grid-rows-2 gap-4 h-[500px]">
      <div className="relative col-span-2 row-span-2 overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in" onClick={() => setIndex(0)}>
        <img
          src={getCloudinaryUrl(images[0], 800)}
          alt={title}
          loading="eager"
          className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
        />
      </div>
      {images.slice(1, 5).map((img, i) => (
        <div key={i} className="relative overflow-hidden rounded-3xl border border-gray-100 cursor-zoom-in" onClick={() => setIndex(i + 1)}>
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
</div>

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
  <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center">

    {/* BLUR BACKGROUND */}
    <div className="absolute inset-0">
      <img
        src={getCloudinaryUrl(images[index], 300)}
        alt=""
        className="w-full h-full object-cover scale-110 blur-3xl opacity-40"
      />

      {/* GLASS OVERLAY */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-2xl" />
    </div>

    {/* CLOSE */}
    <button
      onClick={() => setIndex(null)}
      className="absolute top-6 right-6 md:top-8 md:right-8 z-50
      w-14 h-14 rounded-full
      bg-white/10 hover:bg-white/20
      backdrop-blur-xl
      border border-white/10
      text-white/70 hover:text-white
      text-4xl font-light
      transition-all duration-300"
    >
      ×
    </button>

    {/* LEFT */}
    {index > 0 && (
      <button
        onClick={() => setIndex(index - 1)}
        className="absolute left-3 md:left-8 top-1/2 -translate-y-1/2 z-50
        w-14 h-14 rounded-full
        bg-white/10 hover:bg-white/20
        backdrop-blur-xl
        border border-white/10
        text-white/60 hover:text-white
        text-5xl
        transition-all duration-300"
      >
        ‹
      </button>
    )}

    {/* IMAGE CONTAINER (Düzenlenen Kısım) */}
    <div className="relative z-10 w-full max-w-[90vw] h-[80vh] flex items-center justify-center px-4">
      <img
        src={getCloudinaryUrl(images[index], 1600)}
        alt={title}
        className="
        max-w-full
        max-h-full
        object-contain
        rounded-[2rem]
        border border-white/10
        shadow-[0_20px_80px_rgba(0,0,0,0.45)]
        "
      />
    </div>

    {/* RIGHT */}
    {index < images.length - 1 && (
      <button
        onClick={() => setIndex(index + 1)}
        className="absolute right-3 md:right-8 top-1/2 -translate-y-1/2 z-50
        w-14 h-14 rounded-full
        bg-white/10 hover:bg-white/20
        backdrop-blur-xl
        border border-white/10
        text-white/60 hover:text-white
        text-5xl
        transition-all duration-300"
      >
        ›
      </button>
    )}

    {/* COUNTER */}
    <div
      className="
      absolute bottom-8 left-1/2 -translate-x-1/2 z-50
      px-6 py-3
      rounded-full
      bg-white/10
      backdrop-blur-xl
      border border-white/10
      text-white/80
      text-xs
      font-black
      tracking-[0.25em]
      uppercase
      shadow-xl
      "
    >
      {index + 1} / {images.length}
    </div>
  </div>
)}
    </>
  );
}