"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, deleteDoc, serverTimestamp } from "firebase/firestore";

export default function BlogEditModal({ blog, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // Form State'leri (Yazarın verileri default geliyor)
  const [slug, setSlug] = useState(blog.title.toLowerCase().replace(/ /g, "-"));
  const [titleTr, setTitleTr] = useState(blog.title);
  const [titleEn, setTitleEn] = useState("");
  const [city, setCity] = useState("aksaray");
  const [contentTr, setContentTr] = useState(blog.content);
  const [contentEn, setContentEn] = useState("");
  const [excerptTr, setExcerptTr] = useState("");
  const [excerptEn, setExcerptEn] = useState("");

  const handleFinalApprove = async () => {
    setLoading(true);
    try {
      // 1. TAM SENİN İSTEDİĞİN YAPIYI OLUŞTURUYORUZ
      const finalData = {
        slug: slug,
        title: {
          tr: titleTr,
          en: titleEn || titleTr + " (EN)" // Boşsa geçici bir şey
        },
        excerpt: {
          tr: excerptTr,
          en: excerptEn
        },
        image: blog.gallery?.[0] || "", // İlk resmi kapak yap
        gallery: blog.gallery || [],
        date: new Date().toISOString().split('T')[0], // 2026-04-20 formatı
        city: city.toLowerCase(),
        seo: {
          tr: { title: titleTr, description: excerptTr },
          en: { title: titleEn, description: excerptEn }
        },
        content: {
          tr: contentTr,
          en: contentEn
        },
        authorEmail: blog.authorEmail,
        authorName: blog.authorName,
        createdAt: serverTimestamp()
      };

      // 2. Ana blogs koleksiyonuna ekle
      await addDoc(collection(db, "blogs"), finalData);

      // 3. Bekleyenlerden sil
      await deleteDoc(doc(db, "pending_blogs", blog.id));

      alert("Blog başarıyla zenginleştirildi ve yayınlandı!");
      onClose();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <h2 className="text-xl font-bold text-yellow-500">🚀 Blogu Yayına Hazırla</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">✕ Kapat</button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* SLUG & CITY */}
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold">URL (Slug)</label>
            <input value={slug} onChange={e => setSlug(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-700" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold">Şehir</label>
            <input value={city} onChange={e => setCity(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-700" />
          </div>

          {/* TITLES */}
          <div className="space-y-2">
            <label className="text-xs text-blue-400 uppercase font-bold">Başlık (TR)</label>
            <input value={titleTr} onChange={e => setTitleTr(e.target.value)} className="w-full bg-gray-800 p-2 rounded border border-gray-700" />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-pink-400 uppercase font-bold">Başlık (EN)</label>
            <input value={titleEn} onChange={e => setTitleEn(e.target.value)} placeholder="English Title..." className="w-full bg-gray-800 p-2 rounded border border-gray-700" />
          </div>
        </div>

        {/* CONTENT TR */}
        <div className="space-y-2">
          <label className="text-xs text-blue-400 uppercase font-bold">İçerik (TR - Markdown Destekli)</label>
          <textarea value={contentTr} onChange={e => setContentTr(e.target.value)} className="w-full h-40 bg-gray-800 p-2 rounded border border-gray-700 font-mono text-sm" />
        </div>

        {/* CONTENT EN */}
        <div className="space-y-2">
          <label className="text-xs text-pink-400 uppercase font-bold">İçerik (EN - DeepL'den yapıştır)</label>
          <textarea value={contentEn} onChange={e => setContentEn(e.target.value)} className="w-full h-40 bg-gray-800 p-2 rounded border border-gray-700 font-mono text-sm" />
        </div>

        <div className="flex gap-4">
           <button 
            disabled={loading}
            onClick={handleFinalApprove}
            className="flex-1 bg-green-600 hover:bg-green-700 py-3 rounded-xl font-bold transition disabled:opacity-50"
           >
             {loading ? "Yayınlanıyor..." : "✅ her Şeyi Onayla ve Yayına Al"}
           </button>
        </div>
      </div>
    </div>
  );
}