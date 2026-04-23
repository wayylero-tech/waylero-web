"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { useLang } from "@/app/context/LanguageContext";
import { Maximize2, X, Calendar, Share2, BookOpen, Sparkles, MapPin, Clock, LayoutGrid } from "lucide-react";

type Post = {
  title: any;
  image?: string;
  gallery?: string[];
  content?: any;
};

export default function BlogDetail({ post }: { post: Post }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const { lang } = useLang();

  const displayTitle = typeof post.title === "object" ? post.title[lang] || post.title["tr"] : post.title;
  const displayContent = typeof post.content === "object" ? post.content[lang] || post.content["tr"] : post.content;
  
  // Tüm resimleri birleştir ve ilk 5'ini al
  const allImages = post.gallery?.length ? post.gallery : post.image ? [post.image] : [];
  const gridImages = allImages.slice(0, 5);
  
 const t = {
  tr: {
    journal: "Waylero Journal",
    meta: "Bu yazı, seyahat uzmanlarımız tarafından 2026 yılı güncel verileriyle hazırlanmıştır.",
    more: "Daha Fazla Yazı",
    explore: "Waylero Journal’daki diğer seyahat hikayelerini ve rehberleri keşfet.",
    allPosts: "TÜM YAZILAR",
    share: "Paylaş",
    editor: "Waylero Editör",
    team: "İçerik Ekibi",
  },
  en: {
    journal: "Waylero Journal",
    meta: "This article is prepared by our travel experts with 2026 up-to-date data.",
    more: "More Articles",
    explore: "Discover other travel stories and guides from Waylero Journal.",
    allPosts: "ALL POSTS",
    share: "Share",
    editor: "Waylero Editor",
    team: "Content Team",
  },
};

const ui = t[lang === "tr" ? "tr" : "en"];

  const handleShare = async () => {
  const url = window.location.href;
  const title = displayTitle;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        url,
      });
    } catch (err) {
      console.log("Share cancelled", err);
    }
  } else {
    // fallback: clipboard
    await navigator.clipboard.writeText(url);
    alert("Link kopyalandı!");
  }
};


  return (
    <main className="min-h-screen bg-white pb-32">
      {/* 1. HEADER SECTION: Diagonal Background */}
      <section className="relative pt-20 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-orange-100 shadow-sm">
              <Sparkles size={14} />
              <span>WAYLERO JOURNAL</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tighter leading-tight max-w-5xl uppercase">
              {displayTitle}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <Calendar size={14} className="text-blue-500" />
              <span>{new Date().toLocaleDateString(lang === 'tr' ? 'tr-TR' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
          </div>

          {/* 🖼️ KEŞFET STİLİ GRID GALERİ (Sol 1 Büyük, Sağ 4 Küçük) */}
          <div className="max-w-6xl mx-auto relative z-10 px-4">
            {gridImages.length > 0 ? (
              <div className="grid grid-cols-4 gap-2 md:gap-3 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white aspect-[4/3] md:aspect-[21/10]">
                
                {/* SOL BÜYÜK RESİM */}
                <div 
                  className="col-span-2 row-span-2 relative group overflow-hidden cursor-zoom-in"
                  onClick={() => setLightboxImage(gridImages[0])}
                >
                  <img 
                    src={gridImages[0]} 
                    alt="Main" 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors" />
                </div>

                {/* SAĞ KÜÇÜK RESİMLER */}
                {[1, 2, 3, 4].map((idx) => (
                  <div 
                    key={idx}
                    className="relative group overflow-hidden cursor-zoom-in bg-gray-50"
                    onClick={() => gridImages[idx] && setLightboxImage(gridImages[idx])}
                  >
                    {gridImages[idx] ? (
                      <>
                        <img 
                          src={gridImages[idx]} 
                          alt={`Gallery ${idx}`} 
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                        
                        {/* + Daha Fazla Göster (Eğer toplam resim 5'ten fazlaysa son karede göster) */}
                        {idx === 4 && allImages.length > 5 && (
                          <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                            <LayoutGrid size={24} className="mb-1" />
                            <span className="text-[10px] font-black tracking-widest">+{allImages.length - 5}</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                         <div className="w-8 h-8 rounded-full bg-gray-100" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {/* 2. CONTENT GRID (8+4 Düzeni) */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* SOL TARAF: Blog Metni */}
          <div className="lg:col-span-8">
            <article className="prose prose-lg prose-gray max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-serif font-bold mt-16 mb-8 text-gray-900 flex flex-col gap-2">
                      <span className="w-12 h-1 bg-orange-500 rounded-full"></span>
                      {children}
                    </h2>
                  ),
                  p: ({ children }) => (
                    <p className="text-lg md:text-xl leading-relaxed text-gray-600 mb-8 font-medium">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => <ul className="space-y-4 my-8 pl-2">{children}</ul>,
                  li: ({ children }) => (
                    <li className="flex items-start gap-4 text-lg text-gray-600">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span>{children}</span>
                    </li>
                  ),
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </article>

            {/* Alt Editör İmzası */}
<footer className="mt-20 pt-10 border-t border-gray-100 flex items-center justify-between">

  {/* LEFT: AUTHOR */}
  <div className="flex items-center gap-4">
    
    <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white font-serif italic text-xl">
      W
    </div>

    <div>
      <p className="text-sm font-bold">
        {lang === "tr" ? "Waylero Editör" : "Waylero Editor"}
      </p>
      <p className="text-xs text-gray-400 uppercase tracking-tighter">
        {lang === "tr" ? "İçerik Ekibi" : "Content Team"}
      </p>
    </div>

  </div>

  {/* RIGHT: SHARE */}
  <button
    onClick={handleShare}
    className="group flex items-center gap-2 px-6 py-3 rounded-full bg-gray-50 hover:bg-gray-900 hover:text-white active:scale-95 transition-all text-sm font-bold"
  >
    <Share2 size={16} className="group-hover:rotate-12 transition-transform" />
    <span>{lang === "tr" ? "Paylaş" : "Share"}</span>
  </button>

</footer>
          </div>

          {/* SAĞ TARAF: Sidebar Kartları */}
          <div className="lg:col-span-4 space-y-10">
  <div className="sticky top-24 space-y-10">

    {/* KART 1 */}
<div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm">
  <h3 className="font-serif font-bold text-xl mb-4">
    {lang === "tr" ? "Waylero Journal" : "Waylero Journal"}
  </h3>

  <p className="text-sm text-gray-500 leading-relaxed">
    {lang === "tr"
      ? "Bu yazı, Waylero seyahat editörleri tarafından 2026 yılı güncel verileriyle hazırlanmıştır."
      : "This article is prepared by Waylero travel editors with 2026 up-to-date insights."}
  </p>
</div>

{/* KART 2 */}
<div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group hover:shadow-md transition-all duration-300">
  
  <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
    <BookOpen size={20} className="text-orange-500" />
    {lang === "tr" ? "Daha Fazla Yazı" : "More Articles"}
  </h3>

  <p className="text-sm text-gray-500 mb-6 leading-relaxed">
    {lang === "tr"
      ? "Waylero Journal’daki diğer seyahat hikayelerini ve rehberleri keşfet."
      : "Discover more travel stories and guides from Waylero Journal."}
  </p>

  <a
    href={lang === "tr" ? "/blog" : "/en/blog"}
    className="block w-full text-center py-4 bg-gray-900 hover:bg-orange-500 text-white rounded-2xl font-black text-[10px] tracking-[0.2em] transition-all group-hover:scale-[1.02]"
  >
    {lang === "tr" ? "TÜM YAZILAR" : "ALL POSTS"}
  </a>
</div>

  </div>
</div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)} 
          className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out"
        >
          <button className="absolute top-10 right-10 text-white/50 hover:text-white transition-colors">
            <X size={40} />
          </button>
          <img 
            src={lightboxImage} 
            alt="Lightbox" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" 
          />
        </div>
      )}
    </main>
  );
}