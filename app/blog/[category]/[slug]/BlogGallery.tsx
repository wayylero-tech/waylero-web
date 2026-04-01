"use client";

import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Autoplay,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function BlogGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  if (!images.length) return null;

  return (
    <div className="mb-16 group">
      <Swiper
        modules={[Navigation, Pagination, Keyboard, Autoplay]}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: images.length > 1 ? 2 : 1 },
        }}
        spaceBetween={20}
        navigation={images.length > 1}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        loop={images.length > 1}
        autoplay={
          images.length > 1
            ? { delay: 4000, disableOnInteraction: false }
            : false
        }
        className="rounded-[2.5rem] overflow-hidden"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full aspect-video bg-gray-100 cursor-zoom-in"
              onClick={() => setLightboxImage(img)}
            >
              <img
                src={img}
                alt={title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 flex justify-center items-center z-[999]"
        >
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}
    </div>
  );
}
