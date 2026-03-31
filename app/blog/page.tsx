
"use client";

import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";

// Veri importların (Aynen korundu)
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

export default function BlogPage() {
  // 🔥 Tip güvenliği için 'as "tr" | "en"' ekledik
  const { lang } = useLang() as { lang: "tr" | "en" }; 

  // 🔥 URL YÖNETİCİSİ
  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  // 🔹 Sayfa başlığı sözlüğü (DE silindi)
  const t = {
    tr: "Seyahat Rehberi ✍️",
    en: "Travel Guide ✍️"
  }[lang] || "Travel Guide ✍️";

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">{t}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post, i) => {
          const rawHref = `/blog/${post.city}/${post.slug}`;
          const localizedHref = getLocalizedLink(rawHref);

          // 🔥 Çeviri kontrolü - TypeScript hatası as keyof ile çözüldü
          const displayTitle = typeof post.title === 'object' 
            ? (post.title[lang as keyof typeof post.title] || post.title['tr']) 
            : post.title;
            
          const displayExcerpt = typeof post.excerpt === 'object' 
            ? (post.excerpt[lang as keyof typeof post.excerpt] || post.excerpt['tr']) 
            : post.excerpt;

          return (
            <Link
              key={`${post.slug}-${i}`}
              href={localizedHref}
              className="group w-full h-80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div
                className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${post.image})` }}
              />

              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {displayExcerpt}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
