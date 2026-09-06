"use client";

interface Props {
  image: string | null;
  onClose: () => void;
}

export default function BlogLightbox({ image, onClose }: Props) {
  if (!image) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out"
    >
      <img
        src={`${image}?f=auto&q=85&w=1600`}
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