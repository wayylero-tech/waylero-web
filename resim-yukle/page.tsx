"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  query,
  getDocs,
  orderBy,
  addDoc,
  serverTimestamp
} from "firebase/firestore";

export default function MediaView({ user }: any) {
  const [images, setImages] = useState<any[]>([]);
  const [status, setStatus] = useState("");
  const [lastUploaded, setLastUploaded] = useState<string | null>(null);

  const fetchImages = async () => {
    try {
      const q = query(collection(db, "media"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);

      setImages(
        snap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data()
        }))
      );
    } catch (err) {
      console.log("FETCH ERROR:", err);
      setStatus("❌ Firestore veri çekme hatası");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const openWidget = () => {
    setStatus("⏳ Upload hazırlanıyor...");

    // Cloudinary kontrol
    // @ts-ignore
    if (!window.cloudinary) {
      setStatus("❌ Cloudinary script yüklenmemiş!");
      alert("Cloudinary script ekli değil!");
      return;
    }

    // @ts-ignore
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: "cloud_adin", // 🔴 değiştir
        uploadPreset: "unsigned_preset", // 🔴 değiştir
        folder: "waylero_blog",
        multiple: false,
        sources: ["local", "url", "camera"],
      },
      async (error: any, result: any) => {
        console.log("UPLOAD DEBUG:", error, result);

        if (error) {
          setStatus("❌ Upload hatası");
          return;
        }

        if (result?.event === "success") {
          const url = result.info.secure_url;

          setLastUploaded(url);
          setStatus("✅ Upload başarılı, kaydediliyor...");

          try {
            await addDoc(collection(db, "media"), {
              url,
              createdAt: serverTimestamp(),
              uploadedBy: user?.email || "anon"
            });

            setStatus("✅ Firestore'a kaydedildi");
            fetchImages();
          } catch (err) {
            console.log("FIRESTORE ERROR:", err);
            setStatus("❌ Firestore kayıt hatası");
          }
        }
      }
    );

    widget.open();
  };

  return (
    <section className="space-y-6">

      {/* STATUS PANEL */}
      <div className="p-4 bg-gray-900 rounded-xl border border-gray-800">
        <p className="text-sm text-gray-300">{status}</p>

        {lastUploaded && (
          <div className="mt-3">
            <p className="text-xs text-green-400">Son yüklenen:</p>
            <a
              href={lastUploaded}
              target="_blank"
              className="text-blue-400 text-xs break-all"
            >
              {lastUploaded}
            </a>
          </div>
        )}
      </div>

      {/* UPLOAD BUTTON */}
      <button
        onClick={openWidget}
        className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-lg font-bold"
      >
        + Resim Yükle
      </button>

      {/* GALLERY */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="aspect-square bg-gray-800 rounded-2xl overflow-hidden relative group"
          >
            <img
              src={img.url}
              className="w-full h-full object-cover"
              alt=""
            />

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(img.url);
                  alert("URL kopyalandı");
                }}
                className="bg-white text-black px-3 py-1 text-xs rounded"
              >
                URL KOPYALA
              </button>
            </div>

            <div className="absolute bottom-1 left-1 text-[10px] text-white bg-black/50 px-2 py-1 rounded">
              {img.uploadedBy}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}