"use client";

import { useState } from "react";
import { PortableText } from "@portabletext/react";
import imageUrlBuilder from "@sanity/image-url";

import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Keyboard,
  Autoplay,
  EffectCoverflow,
} from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

const builder = imageUrlBuilder(client);

function urlFor(source: any) {
  return builder.image(source);
}

export default function BlogDetail({ post }: { post: any }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [reverse, setReverse] = useState(false);

  const bodyImages =
    post?.body?.filter((block: any) => block._type === "image") || [];

  const cleanBody =
    post?.body?.filter((block: any) => block._type !== "image") || [];

  const allImages = [
    ...(Array.isArray(post?.mainImage)
      ? post.mainImage
      : post?.mainImage
      ? [post.mainImage]
      : []),
    ...bodyImages,
  ];

  const imageCount = allImages.length;

  const getSlidesPerView = () => {
    if (imageCount === 1) return 1;
    if (imageCount === 2) return 2;
    if (imageCount === 3) return 2.2;
    if (imageCount === 4) return 2.5;
    return 3;
  };

  const enableCoverflow = imageCount >= 5;

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-12 text-center">
        {post?.title}
      </h1>

      {imageCount > 0 && (
        <div className="mb-16">
          <Swiper
            modules={[
              Navigation,
              Pagination,
              Keyboard,
              Autoplay,
              EffectCoverflow,
            ]}
            effect={enableCoverflow ? "coverflow" : "slide"}
            centeredSlides={imageCount > 1}
            slidesPerView={getSlidesPerView()}
            loop={false} // 🔥 loop kapalı (ping-pong için)
            speed={1000}
            autoplay={
              imageCount > 1
                ? {
                    delay: 2500,
                    disableOnInteraction: false,
                    reverseDirection: reverse,
                  }
                : false
            }
            onReachEnd={() => setReverse(true)}
            onReachBeginning={() => setReverse(false)}
            keyboard={{ enabled: true }}
            pagination={{ clickable: true }}
            navigation={imageCount > 1}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 200,
              modifier: 2.5,
              slideShadows: false,
            }}
            breakpoints={{
              768: {
                slidesPerView:
                  imageCount >= 5
                    ? 3
                    : imageCount === 4
                    ? 2.5
                    : imageCount === 3
                    ? 2
                    : imageCount,
              },
            }}
            className="py-10"
          >
            {allImages.map((img: any, index: number) => {
              const imageUrl = urlFor(img).width(1600).url();

              return (
                <SwiperSlide key={index}>
                  <img
                    src={imageUrl}
                    alt={post?.title}
                    onClick={() => setLightboxImage(imageUrl)}
                    className="cursor-pointer max-h-[600px] w-full object-contain transition duration-500 hover:scale-105"
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      )}

      {/* 🔥 LIGHTBOX */}
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

      {cleanBody.length > 0 && (
        <div className="prose prose-lg max-w-none mt-0 [&>*:first-child]:mt-0">
          <PortableText value={cleanBody} />
        </div>
      )}
    </div>
  );
}
