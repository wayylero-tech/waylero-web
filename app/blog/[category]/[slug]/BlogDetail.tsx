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

// Dil desteği
import { useLang } from "@/app/context/LanguageContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// Tip tanımı
type Post = {
  title: any;
  image?: string;
  gallery?: string[];
  content?: any;
};

export default function BlogDetail({ post }: { post: Post }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { lang } = useLang();

  // Dilli verileri çek
  const displayTitle =
    typeof post.title === "object"
      ? post.title[lang] || post.title["tr"]
      : post.title;

  const displayContent =
    typeof post.content === "object"
      ? post.content[lang] || post.content["tr"]
      : post.content;

  const images = post.gallery?.length
    ? post.gallery
    : post.image
    ? [post.image]
    : [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-5xl font-black mb-12 text-center text-gray-900 leading-tight">
        {displayTitle}
      </h1>

      {/* Slider */}
      {images.length > 0 && (
        <div className="mb-16 group">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, Autoplay]}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: images.length > 1 ? 2 : 1,
              },
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
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(img);
                  }}
                >
                  <img
                    src={img}
                    alt={displayTitle}
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
          className="fixed inset-0 bg-black/95 flex justify-center items-center z-[999] p-4 animate-in fade-in duration-300"
        >
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg shadow-2xl"
          />
          <button className="absolute top-6 right-6 text-white text-3xl font-light">
            ×
          </button>
        </div>
      )}

      {/* Content */}
      {displayContent && (
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6 text-gray-900">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-5 border-b pb-3 text-gray-800">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-8 mb-4 text-gray-800">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-9 mb-6 text-gray-700 text-justify">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-8 space-y-3 text-lg text-gray-700">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-8 space-y-3 text-lg text-gray-700">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed pl-2">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-8 italic text-gray-600 bg-blue-50 rounded-r-lg text-xl">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-12 border-gray-200" />,
              img: ({ src, alt }) => (
                <img
                  src={src as string}
                  alt={alt as string}
                  className="rounded-3xl my-10 shadow-lg w-full"
                />
              ),
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
