
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
import { turkeyPostsAkdeniz } from "../data/blog/turkey/postsakdeniz";
import { turkeyPostEge } from "../data/blog/turkey/postsege";
import { turkeyPostMarmara } from "../data/blog/turkey/postsmarmara";
import { turkeyPostIcAnadolu } from "../data/blog/turkey/postsicanadolu";
import { turkeyPostKaradeniz } from "../data/blog/turkey/postkaradeniz";
import { turkeyPostDoguAnadolu } from "../data/blog/turkey/psostsdoguanadolu";
import { turkeyPostGunaydogu } from "../data/blog/turkey/postsguneydoguanadolu";
import { catalhoyukPosts } from "@/app/data/blog/konya/posts4";
import { ihlaraRehberPost } from "@/app/data/blog/aksaray/posts";


const posts = [
  ...generalPosts, ...uygulamaPosts, ...antikkentPosts, ...konyaPosts,
  ...istanbulPosts, ...konyaPosts2, ...konyaRehberPost, ...selalelerRehberPost,
  ...magaralarRehberPost, ...turkeyPost, ...kanyonlarRehberPosts, ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost, ...antalyaRehberPost, ...trekkingPosts,
  ...istanbulRehberPosts, ...antalyaPosts2, ...ispanyaRehberPosts, ...spainPosts,
  ...nevsehirRehberPosts, ...cappadociaPosts, ...turkeyPostKaradeniz, ...turkeyPostsAkdeniz,
  ...turkeyPostEge, ...turkeyPostMarmara, ...turkeyPostDoguAnadolu, ...ihlaraRehberPost,
  ...turkeyPostIcAnadolu, ...turkeyPostGunaydogu, ...catalhoyukPosts
];

export default function HomeBlogSlider() {
  const { lang } = useLang() as { lang: "tr" | "en" }; 

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {posts
        .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
        .slice(0, 4)
        .map((post, i) => {
          const rawHref = `/blog/${post.city}/${post.slug}`;
          const localizedHref = getLocalizedLink(rawHref);

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
              // YÜKSEKLİĞİ ARTIRDIK: h-80 -> h-[450px]
              className="group w-full h-[450px] rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              {/* GÖRSEL ALANI BÜYÜTTÜK: h-48 -> h-72 */}
              <div className="h-72 overflow-hidden rounded-t-[2.5rem]">
                <img
                  src={post.image}
                  alt={displayTitle}
                  loading={i < 2 ? "eager" : "lazy"}
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-center">
                <h3 className="font-bold text-gray-900 text-base line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {displayTitle}
                </h3>
                <p className="text-xs text-gray-500 mt-3 line-clamp-3 leading-relaxed">
                  {displayExcerpt}
                </p>
              </div>
            </Link>
          );
        })}
    </div>
  );
}
