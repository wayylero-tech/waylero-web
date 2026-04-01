"use client";

import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";

// 🔹 Tüm veri importları
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

// 🔹 Tüm postları tek yerde topla
const allPosts = [
  generalPosts,
  uygulamaPosts,
  antikkentPosts,
  konyaPosts,
  istanbulPosts,
  konyaPosts2,
  konyaRehberPost,
  selalelerRehberPost,
  magaralarRehberPost,
  turkeyPost,
  kanyonlarRehberPosts,
  mersinRehberPosts,
  turkiyeEnCokZiyaretEdilen10YerPost,
  antalyaRehberPost,
  trekkingPosts,
  istanbulRehberPosts,
  antalyaPosts2,
  ispanyaRehberPosts,
  spainPosts,
  nevsehirRehberPosts,
  cappadociaPosts,
].flat();

// 🔹 Tipler
type Lang = "tr" | "en";
type LocalizedField = string | Record<string, string>;

function resolveLang(field: LocalizedField, lang: Lang) {
  if (typeof field === "string") return field;
  return field[lang] || field["tr"];
}

function buildLink(path: string, lang: Lang) {
  if (lang === "tr") return path;
  return `/${lang}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function BlogPage() {
  const { lang } = useLang() as { lang: Lang };

  const title =
    {
      tr: "Seyahat Rehberi ✍️",
      en: "Travel Guide ✍️",
    }[lang] || "Travel Guide ✍️";

  return (
    <main className="max-w-6xl mx-auto py-10 px-4">
      
      {/* 🔹 Sayfa Başlığı */}
      <h1 className="text-3xl font-bold mb-8">{title}</h1>

      {/* 🔹 Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allPosts.map((post, i) => {
          const href = buildLink(`/blog/${post.city}/${post.slug}`, lang);

          const postTitle = resolveLang(post.title, lang);
          const postExcerpt = post.excerpt
            ? resolveLang(post.excerpt, lang)
            : "";

          return (
            <Link
              key={`${post.slug}-${i}`}
              href={href}
              className="group w-full h-80 rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              
              {/* 🔹 Image */}
              <div
                className="h-44 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                style={{ backgroundImage: `url(${post.image})` }}
              />

              {/* 🔹 Content */}
              <div className="p-4">
                <h3 className="font-bold text-gray-900 text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                  {postTitle}
                </h3>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                  {postExcerpt}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
