"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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

// Tip
type Post = {
  title: any;
  image?: string;
  gallery?: string[];
  content?: any;
};

export default function BlogDetail({ post }: { post: Post }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { lang } = useLang();

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
          className="fixed inset-0 bg-black/95 flex justify-center items-center z-[999] p-4"
        >
          <img
            src={lightboxImage}
            alt="Lightbox"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
        </div>
      )}

      {/* CONTENT */}
      {displayContent && (
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]} // 🔥 TABLO AKTİF
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-5 border-b pb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-8 mb-4">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-9 mb-6 text-gray-700 text-justify">
                  {children}
                </p>
              ),

              // 🔥 TABLE DESIGN
              table: ({ children }) => (
                <div className="overflow-x-auto my-10">
                  <table className="min-w-full border border-gray-200 rounded-xl overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gray-100">{children}</thead>
              ),
              tr: ({ children }) => (
                <tr className="border-b last:border-none">
                  {children}
                </tr>
              ),
              th: ({ children }) => (
                <th className="text-left px-4 py-3 font-semibold text-gray-800">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-gray-700">
                  {children}
                </td>
              ),

              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-blue-600 underline"
                >
                  {children}
                </a>
              ),

              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-8 space-y-3 text-lg">
                  {children}
                </ul>
              ),
              li: ({ children }) => (
                <li>{children}</li>
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