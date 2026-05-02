"use client";

import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";

interface Post {
  city: string;
  slug: string;
  title: { tr: string; en: string }; // Artık hep object geliyor
  excerpt: { tr: string; en: string }; // Artık hep object geliyor
  image: string;
}

interface BlogClientProps {
  posts: Post[];
  currentLang: "tr" | "en";
}

export default function BlogClient({ posts, currentLang }: BlogClientProps) {
  const lang = currentLang;

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
  };

  const t = {
    tr: { heading: "Seyahat Rehberi", badge: "EDİTÖRÜN SEÇİMLERİ", readMore: "Devamını Oku" },
    en: { heading: "Travel Guide", badge: "EDITOR'S PICKS", readMore: "Read More" }
  }[lang];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Bölümü */}
      <section className="pt-24 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-orange-100 shadow-sm">
            <Sparkles size={14} className="text-orange-500" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tight uppercase">
            {t.heading} <span className="inline-block animate-bounce">✍️</span>
          </h1>
        </div>
      </section>

      {/* Grid Bölümü */}
      <section className="container mx-auto px-6 -mt-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {posts.map((post) => {
            // Dil bazlı verileri çekiyoruz
            const displayTitle = post.title?.[lang] || post.title?.["tr"] || "";
            const displayExcerpt = post.excerpt?.[lang] || post.excerpt?.["tr"] || "";
            
            // Link Yapısı: /blog/sehir/slug veya /en/blog/sehir/slug
            const rawHref = `/blog/${post.city}/${post.slug}`;
            const localizedHref = getLocalizedLink(rawHref);

            return (
              <Link key={post.slug} href={localizedHref}>
                <div className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full">
                  <div className="relative h-60 overflow-hidden">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                      style={{ backgroundImage: `url(${post.image || '/placeholder.jpg'})` }}
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600">
                      {displayTitle}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-3 mb-6">
                      {displayExcerpt}
                    </p>
                    <div className="mt-auto flex justify-between text-xs font-black uppercase text-gray-400 group-hover:text-orange-600 transition-colors">
                      <span>{t.readMore}</span>
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}