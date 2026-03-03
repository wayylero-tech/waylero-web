"use client";
import ReactMarkdown from "react-markdown";

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
  <div
className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden"
    onClick={(e) => {
      e.stopPropagation();
      setLightboxImage(img);
    }}
  >
    <img
      src={img}
      alt={post.title}
      draggable={false}
      className="absolute inset-0 w-full h-full object-cover"
    />
  </div>
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
 <div className="max-w-3xl mx-auto">
  <ReactMarkdown
    components={{
      h1: ({ children }) => (
        <h1 className="text-3xl font-bold mt-10 mb-6">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-2xl font-bold mt-8 mb-4 border-b pb-2">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-xl font-semibold mt-6 mb-3">
          {children}
        </h3>
      ),
      p: ({ children }) => (
        <p className="text-lg leading-8 mb-4 text-gray-700">
          {children}
        </p>
      ),
      ul: ({ children }) => (
        <ul className="list-disc pl-6 mb-6 space-y-2 text-lg text-gray-700">
          {children}
        </ul>
      ),
      ol: ({ children }) => (
        <ol className="list-decimal pl-6 mb-6 space-y-2 text-lg text-gray-700">
          {children}
        </ol>
      ),
      li: ({ children }) => (
        <li className="leading-8">
          {children}
        </li>
      ),
      hr: () => (
        <hr className="my-10 border-gray-300" />
      ),
    }}
  >
    {post.content}
  </ReactMarkdown>
</div>
)}
    </div>
  );
}
