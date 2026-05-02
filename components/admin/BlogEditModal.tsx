"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";
import { collection, addDoc, doc, deleteDoc, serverTimestamp, setDoc } from "firebase/firestore";

export default function BlogEditModal({ blog, onClose }: any) {
  const [loading, setLoading] = useState(false);
  
  // Form State'leri
  const [slug, setSlug] = useState(blog.slug || blog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  const [city, setCity] = useState(blog.city || "aksaray");
  
  const [titleTr, setTitleTr] = useState(blog.title || "");
  const [titleEn, setTitleEn] = useState("");
  
  const [contentTr, setContentTr] = useState(blog.content || "");
  const [contentEn, setContentEn] = useState("");
  
  const [excerptTr, setExcerptTr] = useState("");
  const [excerptEn, setExcerptEn] = useState("");

  const handleFinalApprove = async () => {
    if (!slug) return alert("Lütfen bir slug (URL) belirleyin!");
    setLoading(true);

    try {
      const finalData = {
        slug,
        title: {
          tr: titleTr,
          en: titleEn
        },
        excerpt: {
          tr: excerptTr,
          en: excerptEn
        },
        image: blog.gallery?.[0] || "",
        gallery: blog.gallery || [],
        date: new Date().toISOString().split("T")[0],
        city: city.toLowerCase(),

        seo: {
          title: {
            tr: titleTr,
            en: titleEn
          },
          description: {
            tr: excerptTr,
            en: excerptEn
          }
        },

        content: {
          tr: contentTr,
          en: contentEn
        },

        authorEmail: blog.authorEmail || "",
        authorName: blog.authorName || "Admin",
        createdAt: serverTimestamp()
      };

      // Blogs koleksiyonuna slug ID'si ile kaydet
      await setDoc(doc(db, "blogs", slug), finalData);
      
      // Bekleyenlerden sil
      if (blog.id) {
        await deleteDoc(doc(db, "pending_blogs", blog.id));
      }

      alert("Blog başarıyla yayınlandı! 🚀");
      onClose();
    } catch (err) {
      console.error("Hata:", err);
      alert("Bir hata oluştu, konsolu kontrol et.");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-yellow-500">🚀 Blogu Yayına Hazırla</h2>
            <p className="text-xs text-gray-400 mt-1">Gerekli çevirileri ve SEO ayarlarını tamamla.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg transition">✕ Kapat</button>
        </div>

        {/* URL & CITY */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">URL (Slug)</label>
            <input 
              value={slug} 
              onChange={e => setSlug(e.target.value)} 
              className="w-full bg-gray-800 p-2.5 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none text-sm" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-500 uppercase font-bold tracking-wider">Şehir</label>
            <input 
              value={city} 
              onChange={e => setCity(e.target.value)} 
              className="w-full bg-gray-800 p-2.5 rounded-lg border border-gray-700 focus:border-yellow-500 outline-none text-sm" 
            />
          </div>
        </div>

        {/* TITLES */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs text-blue-400 uppercase font-bold tracking-wider">Başlık (TR)</label>
            <input 
              value={titleTr} 
              onChange={e => setTitleTr(e.target.value)} 
              className="w-full bg-gray-800 p-2.5 rounded-lg border border-gray-700 focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-pink-400 uppercase font-bold tracking-wider">Başlık (EN)</label>
            <input 
              value={titleEn} 
              onChange={e => setTitleEn(e.target.value)} 
              placeholder="English Title..." 
              className="w-full bg-gray-800 p-2.5 rounded-lg border border-gray-700 focus:border-pink-500 outline-none" 
            />
          </div>
        </div>

        {/* CONTENT TR */}
        <div className="space-y-2">
          <label className="text-xs text-blue-400 uppercase font-bold tracking-wider">İçerik (TR - Markdown)</label>
          <textarea 
            value={contentTr} 
            onChange={e => setContentTr(e.target.value)} 
            className="w-full h-40 bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono text-sm focus:border-blue-500 outline-none" 
          />
        </div>

        {/* CONTENT EN */}
        <div className="space-y-2">
          <label className="text-xs text-pink-400 uppercase font-bold tracking-wider">İçerik (EN)</label>
          <textarea 
            value={contentEn} 
            onChange={e => setContentEn(e.target.value)} 
            placeholder="Translate your content into English..."
            className="w-full h-40 bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono text-sm focus:border-pink-500 outline-none" 
          />
        </div>

        {/* EXCERPT & SEO DESCRIPTION */}
        <div className="grid grid-cols-2 gap-4 bg-gray-800/30 p-4 rounded-xl border border-gray-800">
          <div className="space-y-2">
            <label className="text-xs text-blue-400 uppercase font-bold tracking-wider">Özet & SEO Açıklaması (TR)</label>
            <textarea 
              value={excerptTr} 
              onChange={e => setExcerptTr(e.target.value)} 
              placeholder="Google sonuçlarında görünecek kısa açıklama..."
              className="w-full h-24 bg-gray-900 p-2.5 rounded-lg border border-gray-700 text-sm focus:border-blue-500 outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-pink-400 uppercase font-bold tracking-wider">Excerpt & SEO Description (EN)</label>
            <textarea 
              value={excerptEn} 
              onChange={e => setExcerptEn(e.target.value)} 
              placeholder="SEO description for global search engines..."
              className="w-full h-24 bg-gray-900 p-2.5 rounded-lg border border-gray-700 text-sm focus:border-pink-500 outline-none" 
            />
          </div>
        </div>

        {/* FOOTER ACTION */}
        <div className="pt-4 border-t border-gray-800">
           <button 
            disabled={loading}
            onClick={handleFinalApprove}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-bold text-lg transition disabled:opacity-50 shadow-lg shadow-green-900/20"
           >
             {loading ? (
               <span className="flex items-center justify-center gap-2">
                 <span className="animate-spin inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                 Yayınlanıyor...
               </span>
             ) : "✅ Her Şeyi Onayla ve Yayına Al"}
           </button>
        </div>
      </div>
    </div>
  );
}