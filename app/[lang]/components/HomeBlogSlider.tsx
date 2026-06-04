"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // URL kontrolü için
import { allPosts } from "@/lib/blog/posts";

const posts = allPosts;

export default function HomeBlogSlider() {
  const pathname = usePathname();
  
  // 🔥 GARANTİLİ DİL TESPİTİ
  const activeLang = pathname.startsWith("/en") ? "en" : "tr";

  const getLocalizedLink = (path: string) => {
    if (activeLang === "tr") return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/en${cleanPath}`;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {posts
        .sort((a, b) => Number(new Date(b.date)) - Number(new Date(a.date)))
        .slice(0, 4)
        .map((post, i) => {
          const rawHref = `/blog/${post.city}/${post.slug}`;
          const localizedHref = getLocalizedLink(rawHref);

          // Dile göre başlık ve özet seçimi
          const displayTitle = typeof post.title === 'object' 
            ? (post.title[activeLang as keyof typeof post.title] || post.title['tr']) 
            : post.title;
            
          const displayExcerpt = typeof post.excerpt === 'object' 
            ? (post.excerpt[activeLang as keyof typeof post.excerpt] || post.excerpt['tr']) 
            : post.excerpt;

          return (
            <Link
              key={`${post.slug}-${i}`}
              href={localizedHref}
              className="group w-full h-[750px] rounded-[2.5rem] overflow-hidden bg-white shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 flex flex-col"
            >
              <div className="h-150 overflow-hidden rounded-t-[2.5rem]">
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