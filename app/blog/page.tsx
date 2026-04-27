import BlogClient from "./BlogClient";
import { allPosts } from "@/lib/blog/posts";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  // headers() artık await edilmeli
  const headerList = await headers(); 
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";


  const metaMap = {
    tr: {
      title: "Seyahat Rehberi | Gezi Notları ve İpuçları - Waylero",
      description: "Türkiye ve dünyadan en güncel seyahat rehberleri, antik kentler ve gezi ipuçları Waylero Blog'da.",
      canonical: "https://www.waylero.com/blog",
    },
    en: {
      title: "Travel Guide | Travel Notes and Tips - Waylero",
      description: "The most up-to-date travel guides, ancient cities, and travel tips from Turkey and the world on Waylero Blog.",
      canonical: "https://www.waylero.com/en/blog",
    }
  };

  const current = metaMap[lang];

  return {
    title: current.title,
    description: current.description,
    alternates: {
      canonical: current.canonical,
      languages: {
        "tr-TR": "https://www.waylero.com/blog",
        "en-US": "https://www.waylero.com/en/blog",
      },
    },
  };
}

export default async function Page() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  return <BlogClient posts={allPosts} currentLang={lang} />;
}