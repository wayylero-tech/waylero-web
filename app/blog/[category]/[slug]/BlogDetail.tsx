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

type Post = {
  title: string;
  image?: string;
  gallery?: string[];
  content?: string;
};

export default function BlogDetail({ post }: { post: Post }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const images = post.gallery?.length
    ? post.gallery
    : post.image
    ? [post.image]
    : [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">
        {post.title}
      </h1>

      {/* Slider */}
      {images.length > 0 && (
        <div className="mb-16">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, Autoplay]}
            slidesPerView={images.length > 1 ? 2 : 1}
            spaceBetween={20}
            navigation={images.length > 1}
            pagination={{ clickable: true }}
            keyboard={{ enabled: true }}
            loop={images.length > 1}   // 🔥 SONSZ DÖNGÜ
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
                  alt={post.title}
                  draggable={false}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(img);
                  }}
                  className="cursor-pointer max-h-[600px] w-full object-contain select-none"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
        >
          <img
            src={lightboxImage}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />
        </div>
      )}

      {/* Content */}
      {post.content && (
        <div className="prose prose-lg max-w-none whitespace-pre-line">
          {post.content}
        </div>
      )}
    </div>
  );
}
