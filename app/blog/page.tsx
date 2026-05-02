// @/app/blog/page.tsx (veya ilgili sayfanız)
import BlogClient from "./BlogClient";
import { headers } from "next/headers";
import { db } from "@/lib/firebase"; // Firebase yapılandırman
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { cache } from "react";



export const revalidate = 60 * 60 * 24 * 14; // 14 gün cache

const getFirebasePosts = cache(async () => {
  try {
    const blogsRef = collection(db, "blogs");
    const q = query(blogsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Firebase veri çekme hatası:", error);
    return [];
  }
});

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
  const posts = await getFirebasePosts();

  return <BlogClient posts={posts as any} currentLang={lang} />;
}