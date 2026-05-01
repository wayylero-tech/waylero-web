"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function BlogCreateView({ user }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const isUserReady = !!user?.email;

  // ☁️ CLOUDINARY UPLOAD
  const uploadImageToCloudinary = async (file: File) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_PRESET!
    );

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!isUserReady) return alert("Giriş yok");
    if (!title || !content) return alert("Başlık ve içerik zorunlu");

    setLoading(true);

    try {
      const uploadedImages = await Promise.all(
        images.map((img) => uploadImageToCloudinary(img))
      );

      const data = {
        title,
        content, // 🔥 TEK ALAN (TR gibi düşün)

        gallery: uploadedImages,

        authorEmail: user.email,
        authorName: user.displayName || user.email,

        status: "pending",
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "pending_blogs"), data);

      alert("Blog gönderildi");

      setTitle("");
      setContent("");
      setImages([]);
    } catch (err: any) {
      alert(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="text-white space-y-5 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold">✍️ Blog Editor</h1>

      {/* TITLE */}
      <input
        className="w-full p-3 rounded bg-gray-800 border border-gray-700"
        placeholder="Başlık"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      {/* CONTENT */}
      <textarea
        className="w-full h-[500px] p-4 rounded bg-gray-800 border border-gray-700 font-mono"
        placeholder="İçerik yaz..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      {/* IMAGE UPLOAD */}
      <div className="space-y-2">
        <label className="text-sm text-gray-300">
          🖼️ Resimler
        </label>

        <label className="cursor-pointer inline-block px-4 py-2 bg-gray-800 border border-gray-600 rounded hover:bg-gray-700">
          📸 Resim seç
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              setImages(Array.from(e.target.files || []))
            }
          />
        </label>

        {/* PREVIEW */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
            {images.map((img, index) => (
              <div
                key={index}
                className="relative w-full h-40 rounded-lg overflow-hidden border border-gray-700"
              >
                <img
                  src={URL.createObjectURL(img)}
                  className="w-full h-full object-cover"
                />

                <button
                  onClick={() =>
                    setImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                  className="absolute top-2 right-2 bg-red-600 text-white w-7 h-7 rounded-full"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* BUTTON */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 rounded font-bold"
      >
        {loading ? "Gönderiliyor..." : "Onaya Gönder"}
      </button>
    </div>
  );
}