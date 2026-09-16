"use client";

interface Props {
  image: string | null;
  onClose: () => void;
}

// Cloudinary URL'lerini güvenle optimize eden helper
function getCloudinaryUrl(url: string, params: string) {
  if (!url || !url.includes("/upload/")) return url;

  const uploadIndex = url.indexOf("/upload/") + "/upload/".length;
  const baseUrl = url.substring(0, uploadIndex);
  let restUrl = url.substring(uploadIndex);

  // Varsa eski parametreleri temizler
  if (/^(?:[a-z]_[^/]+,?)+\//.test(restUrl)) {
    restUrl = restUrl.replace(/^(?:[a-z]_[^/]+,?)+\//, "");
  }

  return `${baseUrl}${params}/${restUrl}`;
}

export default function BlogLightbox({ image, onClose }: Props) {
  if (!image) return null;

  // URL'i Cloudinary standartlarına uygun şekilde optimize et
  const optimizedImage = getCloudinaryUrl(image, "f_auto,q_85,w_1600");

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out"
    >
      <img
        src={optimizedImage}
        alt="Lightbox"
        decoding="async"
        className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl animate-in zoom-in-95 duration-300"
      />

      <div className="absolute top-10 right-10 text-white/50 text-[10px] font-black tracking-widest uppercase">
        Kapatmak için tıkla
      </div>
    </div>
  );
}