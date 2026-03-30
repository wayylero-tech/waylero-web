"use client";

import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";

// Data importları (Aynen korundu)
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "../data/blog/konya/posts";
import { istanbulPosts } from "../data/blog/istanbul/posts";
import { konyaPosts2 } from "../data/blog/konya/posts2";
import { konyaRehberPost } from "../data/blog/konya/posts3";
import { selalelerRehberPost } from "../data/blog/selale/posts";
import { magaralarRehberPost } from "../data/blog/magaralar/posts";
import { turkeyPost } from "../data/blog/turkey/posts";
import { kanyonlarRehberPosts } from "../data/blog/kanyonlar/posts";
import { mersinRehberPosts } from "../data/blog/mersin/posts";
import { turkiyeEnCokZiyaretEdilen10YerPost } from "../data/blog/ziyaretedilenonyer/posts";
import { antalyaRehberPost } from "../data/blog/antalya/posts";
import { trekkingPosts } from "../data/blog/likya/posts";
import { istanbulRehberPosts } from "../data/blog/istanbul/post";
import { antalyaPosts2 } from "../data/blog/antalya/posts2";
import { ispanyaRehberPosts } from "../data/blog/ispanya/posts";
import { spainPosts } from "../data/blog/ispanya/posts2";
import { nevsehirRehberPosts } from "../data/blog/nevsehir/posts";
import { cappadociaPosts } from "../data/blog/nevsehir/cappadociaPosts";

const posts = [
  ...generalPosts, ...uygulamaPosts, ...antikkentPosts, ...konyaPosts,
  ...istanbulPosts, ...konyaPosts2, ...konyaRehberPost, ...selalelerRehberPost,
  ...magaralarRehberPost, ...turkeyPost, ...kanyonlarRehberPosts, ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost, ...antalyaRehberPost, ...trekkingPosts,
  ...istanbulRehberPosts, ...antalyaPosts2, ...ispanyaRehberPosts, ...spainPosts,
  ...nevsehirRehberPosts, ...cappadociaPosts
];

export default function HomeBlogSlider() {
  const { lang } = useLang(); 

  // 🔥 URL YÖNETİCİSİ: Gidilecek linki mevcut dile göre hazırlar
  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  // 🔹 Sözlük yapısı (Tip güvenliği için opsiyonel fallback eklendi)
  const t = {
    tr: { title: "Seyahat Rehberi ✍️", subtitle: "Son blog yazıları", viewAll: "Tümünü Gör →" },
    en: { title: "Travel Guide ✍️", subtitle: "Latest blog posts", viewAll: "View All →" },
    de: { title: "Reiseführer ✍️", subtitle: "Neueste Blogbeiträge", viewAll: "Alle ansehen →" }
  }[lang as "tr" | "en" | "de"] || { title: "Travel Guide ✍️", subtitle: "Latest blog posts", viewAll: "View All →" };

  return (
    <section className="mb-16">
      {/* 🔥 BAŞLIK ALANI */}
      <div className="mb-6 flex items-end justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-gray-900">
            {t.title}
          </h2>
          <p className="text-sm text-gray-500 mt-1 font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* 🔥 DÜZELTME: Tümünü gör linki artık dile duyarlı */}
        <Link href={getLocalizedLink("/blog")} className="text-blue-600 text-sm font-bold hover:underline transition-all">
          {t.viewAll}
        </Link>
      </div>

      {/* 🔥 POST GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts
          .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
          .slice(0, 4)
          .map((post, i) => {
            // 🔥 DÜZELTME: Kart linki artık dile duyarlı
            const rawHref = `/blog/${post.city}/${post.slug}`;
            const localizedHref = getLocalizedLink(rawHref);

            const displayTitle = typeof post.title === 'object' ? (post.title[lang] || post.title['tr']) : post.title;
            const displayExcerpt = typeof post.excerpt === 'object' ? (post.excerpt[lang] || post.excerpt['tr']) : post.excerpt;

            return (
              <Link
                key={`${post.slug}-${i}`}
                href={localizedHref}
                className="group w-full h-80 rounded-[2rem] overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-500 border border-gray-100 flex flex-col"
              >
                {/* GÖRSEL */}
                <div
                  className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${post.image})` }}
                />

                {/* METİN */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                  <h3 className="font-bold text-gray-900 text-sm line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                    {displayTitle}
                  </h3>
                  <p className="text-[11px] text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {displayExcerpt}
                  </p>
                </div>
              </Link>
            );
          })}
      </div>
    </section>
  );
}