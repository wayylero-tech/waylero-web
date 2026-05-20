"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useState } from "react";
import { Calendar, BookOpen, Sparkles, LayoutGrid, Mail, Share2, MapPin, Compass, Heart } from "lucide-react";
import Link from "next/link";
import BlogViewCounter from "@/components/BlogViewCounter";

interface Post {
  slug: string;
  title: { tr: string; en: string };
  content: { tr: string; en: string };
  image?: string;
  gallery?: string[];
  date?: string;
  authorName?: string;
  authorEmail?: string;
  social?: {
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
}

interface RelatedPost {
  slug: string;
  city: string;
  title: { tr: string; en: string };
  image?: string;
}

export default function BlogDetail({
  post,
  currentLang,
  relatedPosts = [],
}: {
  post: Post;
  currentLang: "tr" | "en";
  relatedPosts?: RelatedPost[];
}) {
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const lang = currentLang || "tr";
  const isEn = lang === "en";
  const displayTitle = post.title?.[lang] || post.title?.tr || "";
  const displayContent = post.content?.[lang] || post.content?.tr || "";

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
      shareNow: "Hemen Paylaş 🌍",
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
      shareNow: "Share Now 🌍",
      authorTitle: "Author's Note ✍️",
      contact: "Get in Touch ✉️",
      team: "Waylero Team 🎒",
      copied: "Link Copied! 🔗"
    },
  };

  const ui = t[lang];

  return (
     <>
    <BlogViewCounter slug={post.slug} />
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

        {/* TOP GALLERY GRID */}
        <div className="max-w-6xl mx-auto relative z-10 px-4 mt-12">
          {gridImages.length > 0 && (
            <>
              {/* 1 IMAGE */}
              {gridImages.length === 1 && (
                <div className="rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white">
                  <div
                    className="relative aspect-[16/9] cursor-zoom-in group"
                    onClick={() => setLightboxImage(gridImages[0])}
                  >
                    <img
                      src={`${gridImages[0]}?f=auto&q=75&w=1400`}
                      alt={`${displayTitle} Ana Görseli`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              )}

              {/* 2 IMAGES */}
              {gridImages.length === 2 && (
                <div className="grid grid-cols-2 gap-3 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white">
                  {gridImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[4/5] cursor-zoom-in group overflow-hidden"
                      onClick={() => setLightboxImage(img)}
                    >
                      <img
                        src={`${img}?f=auto&q=60&w=800`}
                        alt={`${displayTitle} - Detay Görseli ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 3 IMAGES */}
              {gridImages.length === 3 && (
                <div className="grid grid-cols-3 gap-3 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white">
                  {gridImages.map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-[3/4] cursor-zoom-in group overflow-hidden"
                      onClick={() => setLightboxImage(img)}
                    >
                      <img
                        src={`${img}?f=auto&q=55&w=600`}
                        alt={`${displayTitle} - Galeri Görseli ${idx + 1}`}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* 4+ IMAGES */}
              {gridImages.length >= 4 && (
                <div className="grid grid-cols-4 gap-2 md:gap-3 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden shadow-2xl border-4 md:border-8 border-white bg-white aspect-[4/3] md:aspect-[21/10]">
                  <div
                    className="col-span-2 row-span-2 relative group overflow-hidden cursor-zoom-in"
                    onClick={() => setLightboxImage(gridImages[0])}
                  >
                    <img
                      src={`${gridImages[0]}?f=auto&q=70&w=1200`}
                      alt={`${displayTitle} Ana Görseli`}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>

                  {[1, 2, 3, 4].map((idx) => (
                    <div
                      key={idx}
                      className="relative group overflow-hidden cursor-zoom-in bg-gray-50"
                      onClick={() => gridImages[idx] && setLightboxImage(gridImages[idx])}
                    >
                      {gridImages[idx] && (
                        <>
                          <img
                            src={`${gridImages[idx]}?f=auto&q=50&w=400`}
                            alt={`${displayTitle} - Galeri Görseli ${idx}`}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />

                          {idx === 4 && allImages.length > 5 && (
                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white">
                              <LayoutGrid size={24} className="mb-1" />
                              <span className="text-[10px] font-black tracking-widest">
                                +{allImages.length - 5}
                              </span>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* CONTENT SECTION */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <article className="max-w-none prose prose-lg prose-slate prose-img:rounded-[2.5rem]">
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-4xl md:text-5xl font-serif font-bold mt-16 mb-8 text-gray-900 leading-tight">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-3xl md:text-4xl font-serif font-bold mt-14 mb-6 text-gray-900 border-b pb-4">{children}</h2>,
                  h3: ({ children }) => <h3 className="text-2xl md:text-3xl font-serif font-semibold mt-10 mb-4 text-gray-800">{children}</h3>,
                  p: ({ children }) => <p className="text-base md:text-lg leading-relaxed text-gray-600 mb-8">{children}</p>,
                  
                  // Site içi linkleri Next.js Link'i yaparak sayfayı uçuran kısım:
                  a: ({ href, children }) => {
                    if (href?.startsWith("http")) {
                      return (
                        <a href={href} target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline font-bold">
                          {children}
                        </a>
                      );
                    }
                    return (
                      <Link href={href || "#"} className="text-orange-600 hover:underline font-bold">
                        {children}
                      </Link>
                    );
                  },

                  img: ({ ...props }) => (
                    <div className="my-12 relative group">
                      <img 
                        {...props}
                        src={`${props.src}?f=auto&q=70&w=1200`}
                        loading="lazy"
                        decoding="async"
                        alt={props.alt || `${displayTitle} İçerik Görseli`} 
                        className="w-full h-auto rounded-[2.5rem] shadow-xl transition-transform duration-500 group-hover:scale-[1.01] cursor-zoom-in border-4 border-white shadow-gray-200"
                        onClick={() => {
                          if (props.src) setLightboxImage(props.src as string);
                        }}
                      />
                      {props.alt && (
                        <span className="block text-center text-xs font-medium text-gray-400 mt-4 tracking-widest uppercase italic font-sans">
                          — {props.alt}
                        </span>
                      )}
                    </div>
                  ),
                  
                  li: ({ children }) => (
                    <li className="text-base md:text-lg text-gray-600 mb-4 flex gap-3 italic">
                      <Sparkles size={18} className="text-orange-400 shrink-0 mt-1" />
                      <span>{children}</span>
                    </li>
                  ),
                  strong: ({ children }) => <strong className="font-bold text-gray-900 bg-orange-50 px-1 rounded">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-orange-500 pl-6 py-2 my-10 italic text-xl font-serif text-gray-700 bg-gray-50 rounded-r-2xl shadow-sm">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {displayContent}
              </ReactMarkdown>
            </article>

            {/* AUTHOR CARD */}
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
                  {post.social && (
                    <div className="flex items-center justify-center md:justify-start gap-3 mt-3 flex-wrap">
                      {post.social.instagram && (
                        <a href={post.social.instagram} target="_blank" className="text-pink-500 text-xs font-black hover:underline">
                          Instagram
                        </a>
                      )}
                      {post.social.twitter && (
                        <a href={post.social.twitter} target="_blank" className="text-sky-500 text-xs font-black hover:underline">
                          X
                        </a>
                      )}
                      {post.social.linkedin && (
                        <a href={post.social.linkedin} target="_blank" className="text-blue-600 text-xs font-black hover:underline">
                          LinkedIn
                        </a>
                      )}
                      {post.social.website && (
                        <a href={post.social.website} target="_blank" className="text-gray-700 text-xs font-black hover:underline">
                          Website
                        </a>
                      )}
                    </div>
                  )}
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

              {/* RELATED POSTS */}
              {relatedPosts.length > 0 && (
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group">
                  <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                    <Compass size={20} className="text-orange-500" />
                    {isEn ? "More From This City" : "Bu Şehirden Daha Fazla"}
                  </h3>

                  <div className="space-y-4">
                    {relatedPosts.map((item, idx) => (
                      <Link
                        key={idx}
                        href={`/${lang}/blog/${item.city}/${item.slug}`}
                        className="group block rounded-2xl overflow-hidden border border-gray-100 hover:border-orange-200 transition-all bg-gray-50 hover:bg-white hover:shadow-lg"
                      >
                        {item.image && (
                          <div className="aspect-[16/9] overflow-hidden">
                            <img
                              src={`${item.image}?f=auto&q=60&w=800`}
                              alt={item.title?.[lang] || item.title?.tr}
                              loading="lazy"
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>
                        )}

                        <div className="p-4">
                          <p className="text-[10px] uppercase tracking-[0.25em] text-orange-500 font-black mb-2">
                            {isEn ? "Travel Guide" : "Gezi Rehberi"}
                          </p>
                          <h4 className="font-serif text-lg font-bold text-gray-900 leading-snug">
                            {item.title?.[lang] || item.title?.tr}
                          </h4>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm group">
                <h3 className="font-serif font-bold text-xl mb-4 flex items-center gap-2">
                  <BookOpen size={20} className="text-orange-500" /> {ui.more}
                </h3>
                <p className="text-sm text-gray-500 mb-6">{ui.explore}</p>
                <Link href={lang === "tr" ? "/blog" : "/en/blog"} className="block w-full text-center py-4 bg-gray-50 text-gray-900 rounded-2xl font-black text-[10px] tracking-[0.2em] hover:bg-gray-900 hover:text-white transition-all uppercase">
                  {ui.allPosts}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImage && (
        <div onClick={() => setLightboxImage(null)} className="fixed inset-0 bg-black/98 backdrop-blur-xl flex justify-center items-center z-[9999] p-4 cursor-zoom-out">
          <img
            src={`${lightboxImage}?f=auto&q=85&w=1600`}
            alt="Lightbox"
            decoding="async" 
            className="max-h-[85vh] max-w-[90vw] object-contain rounded-2xl animate-in zoom-in-95 duration-300" 
          />
          <div className="absolute top-10 right-10 text-white/50 text-[10px] font-black tracking-widest uppercase">Kapatmak için tıkla</div>
        </div>
      )}
   </main>
  </>
);
}