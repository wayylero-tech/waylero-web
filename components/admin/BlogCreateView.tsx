"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function BlogCreateView({ user }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const isUserReady = !!user?.email;

  // ☁️ CLOUDINARY UPLOAD
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();

    if (!data.secure_url) {
      console.error("Cloudinary Error:", data);
      throw new Error("Resim yüklenemedi");
    }

    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!isUserReady) return alert("Giriş yapmalısın");
    if (!title.trim() || !content.trim()) return alert("Başlık ve içerik zorunlu");

    setLoading(true);

    try {
      // ☁️ IMAGE PROCESS (file + url mix)
      const uploadedImages = await Promise.all(
  images.map(async (img) => {
    // 🔥 URL ise direkt kullan
    if (typeof img === "string") {
      return img;
    }

    // 🔥 File ise Cloudinary upload
    return await uploadImageToCloudinary(img);
  })
);

      await addDoc(collection(db, "pending_blogs"), {
        title: title.trim(),
        content: content.trim(),
        gallery: uploadedImages.filter(Boolean),

        authorEmail: user.email || "",
        authorName: user.displayName || user.email || "",

        status: "pending",
        createdAt: serverTimestamp(),
      });

      alert("Blog onaya gönderildi 🚀");

      // RESET
      setTitle("");
      setContent("");
      setImages([]);
      setImageUrl("");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Bir hata oluştu");
    }

    setLoading(false);
  };

  return (
    <div className="text-white space-y-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">✍️ Blog Yazısı Gönder</h1>

      {/* TITLE */}
      <input
        className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* CONTENT */}
      <textarea
        className="w-full h-[400px] p-4 rounded bg-gray-800 border border-gray-700"
        placeholder="Blog içeriğini yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* LINK INPUT */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          🔗 Resim Linki (Cloudinary URL)
        </label>

        <div className="flex gap-2">
          <input
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://res.cloudinary.com/..."
            className="flex-1 p-2 rounded bg-gray-800 border border-gray-700"
          />

          <button
            type="button"
            onClick={() => {
              if (!imageUrl.trim()) return;

              setImages((prev) => {
  if (prev.includes(imageUrl)) return prev;
  return [...prev, imageUrl];
});
              setImageUrl("");
            }}
            className="px-4 bg-blue-600 hover:bg-blue-700 rounded"
          >
            Ekle
          </button>
        </div>
      </div>

      {/* FILE UPLOAD */}
      <div>
        <label className="text-sm text-gray-300 block mb-2">
          📸 Dosyadan Resim Yükle
        </label>

        <input
          type="file"
          multiple
          accept="image/*"
          className="bg-gray-800 p-2 rounded border border-gray-700 w-full"
          onChange={(e) =>
            setImages((prev) => [
              ...prev,
              ...Array.from(e.target.files || []),
            ])
          }
        />
      </div>

      {/* PREVIEW */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img, index) => {
            const src =
              typeof img === "string" ? img : URL.createObjectURL(img);

            return (
              <div
                key={index}
                className="relative h-40 rounded-lg overflow-hidden border border-gray-700"
              >
                <img src={src} className="w-full h-full object-cover" />

                <button
                  onClick={() =>
                    setImages((prev) => prev.filter((_, i) => i !== index))
                  }
                  className="absolute top-2 right-2 bg-red-600 w-6 h-6 rounded-full"
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded font-bold w-full"
      >
        {loading ? "Gönderiliyor..." : "Onaya Gönder"}
      </button>
    </div>
  );
}