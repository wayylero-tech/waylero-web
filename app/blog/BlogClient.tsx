"use client";

import Link from "next/link";
import { useLang } from "@/app/context/LanguageContext";

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