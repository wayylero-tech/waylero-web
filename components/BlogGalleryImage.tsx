"use client";

import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  priority?: boolean;
  quality?: number;
  width?: number;
  className?: string;
  imageClassName?: string;
  loading?: "lazy" | "eager";
}

function isCloudinaryUrl(url: string): boolean {
  return Boolean(url && url.includes("res.cloudinary.com") && url.includes("/upload/"));
}

function getCloudinaryUrl(url: string, params: string): string {
  if (!url || !isCloudinaryUrl(url)) {
    return url;
  }

  const uploadMarker = "/upload/";
  const uploadIndex = url.indexOf(uploadMarker);

  if (uploadIndex === -1) {
    return url;
  }

  const baseUrl = url.substring(
    0,
    uploadIndex + uploadMarker.length
  );

  let restUrl = url.substring(
    uploadIndex + uploadMarker.length
  );

  // Mevcut Cloudinary transformation'larını temizle
  const firstSlash = restUrl.indexOf("/");

  if (firstSlash !== -1) {
    const firstPart = restUrl.substring(0, firstSlash);

    const looksLikeTransformation =
      firstPart.includes("_") &&
      /^[a-zA-Z0-9_,:.@-]+$/.test(firstPart);

    if (looksLikeTransformation) {
      restUrl = restUrl.substring(firstSlash + 1);
    }
  }

  return `${baseUrl}${params}/${restUrl}`;
}

export default function BlogGalleryImage({
  src,
  alt,
  priority = false,
  quality = 70,
  width = 1200,
  className =
    "relative h-[500px] overflow-hidden rounded-[2.5rem] border border-gray-100 cursor-zoom-in",
  imageClassName =
    "absolute inset-0 w-full h-full object-cover transition-transform duration-700 hover:scale-105",
  loading,
}: Props) {
  const [open, setOpen] = useState(false);

  const cloudinary = isCloudinaryUrl(src);

  const optimizedSrc = cloudinary
    ? getCloudinaryUrl(
        src,
        `f_auto,q_${quality},w_${width},c_fill`
      )
    : src;

  const lightboxSrc = cloudinary
    ? getCloudinaryUrl(
        src,
        "f_auto,q_85,w_1600"
      )
    : src;

  return (
    <>
      <div
        className={className}
        onClick={() => setOpen(true)}
      >
        <img
          src={optimizedSrc}
          alt={alt}
          fetchPriority={priority ? "high" : "low"}
          loading={
            loading ??
            (priority ? "eager" : "lazy")
          }
          decoding="async"
          className={imageClassName}
        />
      </div>

      {open && (
        <div
          onClick={() => setOpen(false)}
          className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out"
        >
          <img
            src={lightboxSrc}
            alt={alt}
            decoding="async"
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl animate-in zoom-in-95 duration-300"
          />

          <div className="absolute top-10 right-10 text-white/50 text-[10px] font-black tracking-widest uppercase">
            Kapatmak için tıkla
          </div>
        </div>
      )}
    </>
  );
}