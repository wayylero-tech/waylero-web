"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Calendar, BookOpen, Sparkles, LayoutGrid, Mail, Share2, MapPin, Compass, Heart } from "lucide-react";

interface Post {
  title: { tr: string; en: string };
  content: { tr: string; en: string };
  image?: string;
  gallery?: string[];
  date?: string;
  authorName?: string;
  authorEmail?: string;
}

export default function BlogDetail({ post, currentLang }: { post: Post, currentLang: "tr" | "en" }) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const lang = currentLang || "tr";

  const displayTitle = post.title?.[lang] || post.title?.["tr"] || "";
  const displayContent = post.content?.[lang] || post.content?.["tr"] || "";

  const allImages = post.gallery?.length ? post.gallery : post.image ? [post.image] : [];
  const gridImages = allImages.slice(0, 5);

  const handleShare = async () => {
    const shareData = {
      title: displayTitle,
      text: `${displayTitle} 🌍 Waylero Journal`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Paylaşma iptal edildi");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

 const t = {
    tr: {
      journal: "WAYLERO JOURNAL 🧭",
      meta: post.authorName 
        ? `Bu yazı, seyahat uzmanımız ${post.authorName} tarafından 2026 yılı güncel verileriyle sevgiyle hazırlandı. ✨`
        : "Bu yazı, Waylero seyahat ekibi tarafından 2026 yılı güncel verileriyle hazırlandı. 🌍",
      more: "Daha Fazla Keşfet 📂",
      explore: "Waylero Journal’daki diğer maceraları ve gizli rotaları incele.",
      allPosts: "TÜM REHBERLER 🚀",
      share: "Bu Yazıyı Paylaş 📱",
      shareNow: "Hemen Paylaş 🌍", // <-- TR eklendi
      authorTitle: "Yazarın Notu ✍️",
      contact: "İletişime Geç ✉️",
      team: "Waylero Ekibi 🎒",
      copied: "Link Cebe Atıldı! 🔗"
    },
    en: {
      journal: "WAYLERO JOURNAL 🧭",
      meta: post.authorName 
        ? `This article was crafted with love by our travel expert ${post.authorName} using 2026 data. ✨`
        : "This article was prepared by the Waylero team with 2026 up-to-date data. 🌍",
      more: "Explore More 📂",
      explore: "Check out other adventures and hidden gems in Waylero Journal.",
      allPosts: "ALL GUIDES 🚀",
      share: "Share This Post 📱",
      shareNow: "Share Now 🌍", // <-- EN eklendi
      authorTitle: "Author's Note ✍️",
      contact: "Get in Touch ✉️",
      team: "Waylero Team 🎒",
      copied: "Link Copied! 🔗"
    },
  };

  const ui = t[lang];

  return (
    <main className="min-h-screen bg-white pb-32">
      {/* HEADER SECTION */}
      <section className="relative pt-20 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-orange-100 shadow-sm">
            <Sparkles size={14} className="animate-pulse" />
            <span>{ui.journal}</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 mb-6 tracking-tighter uppercase leading-tight max-w-5xl mx-auto italic">
            {displayTitle}
          </h1>
          <div className="flex items-center justify-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
            <MapPin size={14} className="text-red-500" />
            <span>{post.date || "2026"}</span>
          </div>
        </div>

        {/* GALERİ GRID */}
        <div className="max-w-6xl mx-auto relative z-10 px-4 mt-12">
          {gridImages.length > 0 && (
            <div className="grid grid-cols-4 gap-2 md:gap-3 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white aspect-[4/3] md:aspect-[21/10]">
              <div className="col-span-2 row-span-2 relative group overflow-hidden cursor-zoom-in" onClick={() => setLightboxImage(gridImages[0])}>
                <img src={gridImages[0]} alt="Main" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              {[1, 2, 3, 4].map((idx) => (
                <div key={idx} className="relative group overflow-hidden cursor-zoom-in bg-gray-50" onClick={() => gridImages[idx] && setLightboxImage(gridImages[idx])}>
                  {gridImages[idx] && (
                    <>
                      <img src={gridImages[idx]} alt={`Gallery ${idx}`} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      {idx === 4 && allImages.length > 5 && (
                        <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                          <LayoutGrid size={24} className="mb-1" />
                          <span className="text-[10px] font-black tracking-widest">+{allImages.length - 5}</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <article className="max-w-none">
  <ReactMarkdown 
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({ children }) => (
        <h1 className="text-4xl md:text-5xl font-serif font-bold mt-16 mb-8 text-gray-900">
          {children}
        </h1>
      ),
      h2: ({ children }) => (
        <h2 className="text-3xl md:text-4xl font-serif font-bold mt-14 mb-6 text-gray-900">
          {children}
        </h2>
      ),
      h3: ({ children }) => (
        <h3 className="text-2xl md:text-3xl font-serif font-semibold mt-10 mb-4 text-gray-800">
          {children}
        </h3>
      ),
      h4: ({ children }) => (
        <h4 className="text-xl font-semibold mt-8 mb-3 text-gray-800">
          {children}
        </h4>
      ),
      p: ({ children }) => (
        <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-6">
          {children}
        </p>
      ),
      li: ({ children }) => (
        <li className="text-base md:text-lg text-gray-600 mb-2 list-disc ml-4">
          {children}
        </li>
      ),
      strong: ({ children }) => (
        <strong className="font-bold text-gray-900">{children}</strong>
      ),
    }}
  >
    {displayContent}
  </ReactMarkdown>
</article>

            {/* YAZAR KARTI & PAYLAŞ BUTONU */}
            <div className="mt-20 p-10 rounded-[3rem] bg-[linear-gradient(135deg,#fff,#f8fbff)] border border-blue-50 flex flex-col gap-8 shadow-sm">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-4xl font-serif font-bold shadow-xl shadow-orange-100 uppercase">
                    {post.authorName ? post.authorName[0] : "W"}
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white p-1.5 rounded-full shadow-md border border-gray-50">
                    <Heart size={16} className="text-red-500 fill-red-500" />
                  </div>
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <span className="text-[10px] font-black tracking-[0.2em] text-orange-600 uppercase flex items-center justify-center md:justify-start gap-1">
                    {ui.authorTitle}
                  </span>
                  <h4 className="text-3xl font-serif font-bold text-gray-900 mt-1">{post.authorName || ui.team}</h4>
                  {post.authorEmail && <p className="text-blue-500/70 text-sm mt-1 font-bold">{post.authorEmail}</p>}
                </div>

                <div className="flex flex-wrap justify-center gap-3">
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-orange-600 transition-all shadow-xl shadow-gray-200 uppercase"
                  >
                    <Share2 size={16} />
                    {ui.share}
                  </button>
                  
                  {post.authorEmail && (
                    <a href={`mailto:${post.authorEmail}`} className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-orange-600 hover:border-orange-100 transition-all shadow-sm">
                      <Mail size={20} />
                    </a>
                  )}
                </div>
              </div>
              {copied && <div className="text-center text-[10px] font-black text-orange-600 animate-bounce">{ui.copied}</div>}
            </div>
          </div>

          {/* SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="sticky top-24 space-y-10">
              {/* Dinamik Yazar/Journal Kartı */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                   <Compass size={80} />
                </div>
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                   {post.authorName ? `👤 ${post.authorName}` : ui.journal}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium">
                  {ui.meta}
                </p>
              </div>

             {/* Paylaş Kartı */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group">
                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                  <Share2 size={20} className="text-orange-500" /> {ui.share}
                </h3>
                <button 
                  onClick={handleShare}
                  className="w-full flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-gray-100 uppercase"
                >
                  {ui.shareNow}
                </button>
                {copied && (
                  <p className="text-[10px] text-center mt-3 font-black text-orange-600 animate-pulse">
                    {ui.copied}
                  </p>
                )}
              </div>

              {/* Daha Fazla Yazı Kartı */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group">
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-500" /> {ui.more}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{ui.explore}</p>
                <a href={lang === "tr" ? "/blog" : "/en/blog"} className="block w-full text-center py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all uppercase">
                  {ui.allPosts}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div onClick={() => setLightboxImage(null)} className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out">
          <img src={lightboxImage} alt="Lightbox" className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl" />
        </div>
      )}
    </main>
  );
}