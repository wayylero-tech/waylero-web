"use client";

import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";
import { Sparkles, ChevronRight, BookOpen } from "lucide-react";

interface Post {
  city: string;
  slug: string;
  title: string | { tr: string; en: string };
  excerpt: string | { tr: string; en: string };
  image: string;
}

interface BlogClientProps {
  posts: Post[];
}

export default function BlogClient({ posts }: BlogClientProps) {
  const { lang } = useLang() as { lang: "tr" | "en" };

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  const t = {
    tr: {
      heading: "Seyahat Rehberi",
      badge: "EDİTÖRÜN SEÇİMLERİ",
      readMore: "Devamını Oku"
    },
    en: {
      heading: "Travel Guide",
      badge: "EDITOR'S PICKS",
      readMore: "Read More"
    }
  }[lang];

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION: İmzalı çapraz gradyan */}
      <section className="pt-24 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-orange-100 shadow-sm">
            <Sparkles size={14} className="text-orange-500" />
            <span>{t.badge}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tight uppercase">
            {t.heading} <span className="inline-block animate-bounce">✍️</span>
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto text-lg font-medium opacity-80">
            {lang === "tr" 
              ? "Dünyayı Waylero editörlerinin gözünden keşfedin, en özel rotalara tanıklık edin." 
              : "Discover the world through the eyes of Waylero editors and witness the most exclusive routes."}
          </p>
        </div>
      </section>

      {/* 2. BLOG GRID: Premium Kart Tasarımı */}
      <section className="container mx-auto px-6 -mt-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {posts.map((post, i) => {
            const rawHref = `/blog/${post.city}/${post.slug}`;
            const localizedHref = getLocalizedLink(rawHref);

            const displayTitle = typeof post.title === "object"
              ? post.title[lang] || post.title["tr"]
              : (post.title as string);

            const displayExcerpt = typeof post.excerpt === "object"
              ? post.excerpt[lang] || post.excerpt["tr"]
              : (post.excerpt as string);

            return (
              <Link
                key={`${post.slug}-${i}`}
                href={localizedHref}
                className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl shadow-black/[0.02] hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 transform hover:-translate-y-3 flex flex-col"
              >
                {/* Image Area */}
                <div className="relative h-60 overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 ease-out group-hover:scale-110"
                    style={{ backgroundImage: `url(${post.image})` }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500" />
                  
                  {/* City Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-900 shadow-sm border border-white">
                      {post.city}
                    </span>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen size={14} className="text-orange-500" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Article</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight group-hover:text-orange-600 transition-colors">
                    {displayTitle}
                  </h3>
                  
                  <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed mb-8 opacity-90">
                    {displayExcerpt}
                  </p>

                  <div className="mt-auto flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-900 group-hover:text-orange-600 transition-colors">
                    <span>{t.readMore}</span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. NEWSLETTER OR DECORATION (Opsiyonel Stil) */}
      <section className="container mx-auto px-6 pb-20">
        <div className="bg-gray-900 rounded-[3rem] p-12 text-center text-white overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="text-3xl font-serif font-bold mb-4">Yeniliklerden Haberdar Olun</h2>
            <p className="text-gray-400 max-w-md mx-auto text-sm">En yeni rotalar ve seyahat ipuçları her hafta e-posta kutunuzda.</p>
          </div>
          {/* Arka plan süsü */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
        </div>
      </section>
    </main>
  );
}