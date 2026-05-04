// @/app/blog/page.tsx (veya ilgili sayfanız)
import BlogClient from "./BlogClient";
import { headers } from "next/headers";
import { allPosts } from "@/lib/blog/posts";


export const dynamic = "force-static";



export async function generateMetadata() {
  const headerList = await headers(); 
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  const metaMap = {
    tr: {
      title: "Seyahat Rehberi | Waylero",
      description: "En güncel seyahat rehberleri Waylero Blog'da.",
      canonical: "https://www.waylero.com/blog",
    },
    en: {
      title: "Travel Guide | Waylero",
      description: "The most up-to-date travel guides on Waylero Blog.",
      canonical: "https://www.waylero.com/en/blog",
    }
  };

  const current = metaMap[lang] || metaMap.tr;

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical: current.canonical,
      languages: { "tr-TR": "https://www.waylero.com/blog", "en-US": "https://www.waylero.com/en/blog" },
    },
  };
}

export default async function Page() {
  const headerList = await headers();
  const lang = (headerList.get("x-url-lang") === "en" ? "en" : "tr") as "tr" | "en";

  // Veriyi Firebase'den çekiyoruz
  const posts = allPosts;

  return <BlogClient posts={posts as any} currentLang={lang} />;
}