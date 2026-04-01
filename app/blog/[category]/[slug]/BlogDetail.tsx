"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Autoplay } from "swiper/modules";
import { useLang } from "@/app/context/LanguageContext";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

// 🔹 Tip
type LocalizedField = string | Record<string, string>;

type Post = {
  title: LocalizedField;
  content?: LocalizedField;
  image?: string;
  gallery?: string[];
};

// 🔹 Dilli veri çözümleyici
function resolveLang(field: LocalizedField | undefined, lang: string) {
  if (!field) return "";
  if (typeof field === "string") return field;
  return field[lang] || field["tr"] || "";
}

export default function BlogDetail({ post }: { post: Post }) {
  const { lang } = useLang();
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const title = resolveLang(post.title, lang);
  const content = resolveLang(post.content, lang);

  const images =
    post.gallery?.length
      ? post.gallery
      : post.image
      ? [post.image]
      : [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      
      {/* 🔹 Başlık */}
      <h1 className="text-3xl md:text-5xl font-black mb-12 text-center text-gray-900 leading-tight">
        {title}
      </h1>

      {/* 🔹 Slider */}
      {images.length > 0 && (
        <div className="mb-16">
          <Swiper
            modules={[Navigation, Pagination, Keyboard, Autoplay]}
            slidesPerView={1}
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
            breakpoints={{
              640: { slidesPerView: images.length > 1 ? 2 : 1 },
            }}
            className="rounded-[2.5rem] overflow-hidden"
          >
            {images.map((img, i) => (
              <SwiperSlide key={i}>
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
        </div>
      )}

      {/* 🔹 Lightbox */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 bg-black/95 flex items-center justify-center z-[999] p-4"
        >
          <img
            src={lightboxImage}
            alt="preview"
            className="max-h-[90vh] max-w-[90vw] object-contain rounded-lg"
          />
          <button className="absolute top-6 right-6 text-white text-3xl">
            ×
          </button>
        </div>
      )}

      {/* 🔹 Content */}
      {content && (
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-5 border-b pb-3">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-bold mt-8 mb-4">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-9 mb-6 text-gray-700 text-justify">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc pl-6 mb-8 space-y-3 text-lg">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal pl-6 mb-8 space-y-3 text-lg">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="leading-relaxed">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-blue-500 pl-6 py-2 my-8 italic bg-blue-50">
                  {children}
                </blockquote>
              ),
              hr: () => <hr className="my-12 border-gray-200" />,
              img: ({ src, alt }) => (
                <img
                  src={src || ""}
                  alt={alt || ""}
                  className="rounded-3xl my-10 shadow-lg w-full"
                />
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
