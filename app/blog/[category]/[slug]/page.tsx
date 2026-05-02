// @/app/blog/[category]/[slug]/page.tsx
import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers";
import BlogDetail from "./BlogDetail";
import { db } from "@/lib/firebase";
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  limit 
} from "firebase/firestore";


export const dynamic = "force-dynamic";


// URL ve Metin temizleme (Unicode ve % encoded karakterleri standardize eder)
const cleanText = (text: string) => {
  if (!text) return "";
  try {
    return decodeURIComponent(text).normalize("NFC").toLowerCase().trim();
  } catch (e) {
    return text.normalize("NFC").toLowerCase().trim();
  }
};

// Statik parametreler (Build anında çalışır)
export async function generateStaticParams() {
  try {
    const blogsRef = collection(db, "blogs");
    const snapshot = await getDocs(blogsRef);
    
    return snapshot.docs.map((doc) => ({
      category: doc.data().city || "travel",
      slug: doc.data().slug,
    }));
  } catch (e) {
    return [];
  }
}

// Firebase'den dökümanı slug alanına göre çekme
const getPostBySlug = cache(async (slug: string) => {
  const normalizedSlug = cleanText(slug);
  
  const blogsRef = collection(db, "blogs");
  const q = query(blogsRef, where("slug", "==", normalizedSlug), limit(1));
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    const doc = querySnapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  }
  return null;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const headerList = await headers();
  const lang = (headerList.get("x-url-lang") === "en" ? "en" : "tr") as "en" | "tr";
  
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found | Waylero" };

  const postAny = post as any;
  const titleText = postAny.title?.[lang] || postAny.title?.["tr"] || "Travel Guide";
  const descriptionText = postAny.seo?.description?.[lang] || postAny.excerpt?.[lang] || "";

  const baseUrl = lang === "en" ? "https://www.waylero.com/en" : "https://www.waylero.com";
  const fullUrl = `${baseUrl}/blog/${category}/${slug}`;

  return {
    title: `${titleText} | Waylero Blog`,
    description: descriptionText,
    alternates: {
      canonical: fullUrl,
      languages: {
        "tr-TR": `https://www.waylero.com/blog/${category}/${slug}`,
        "en-US": `https://www.waylero.com/en/blog/${category}/${slug}`,
      },
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: fullUrl,
      locale: lang === "tr" ? "tr_TR" : "en_US",
      type: "article",
      images: postAny.image ? [{ url: postAny.image }] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const headerList = await headers();
  const lang = (headerList.get("x-url-lang") === "en" ? "en" : "tr") as "en" | "tr";

  // Postu getir
  const post = await getPostBySlug(slug);
  const postAny = post as any;

  // Güvenlik Kontrolleri
  if (!postAny) {
    console.log("❌ POST BULUNAMADI: ", slug);
    return notFound();
  }

  const urlCategory = cleanText(category);
  const dbCity = cleanText(postAny.city);

  // LOG: Terminalde her şeyi açıkça görelim
  console.log("🔍 Blog Kontrolü:", {
    dbSlug: postAny.slug,
    dbCity: dbCity,
    urlCategory: urlCategory,
    match: dbCity === urlCategory
  });

  // Eğer URL'deki kategori Firebase'deki city ile eşleşmiyorsa (Örn: /blog/paris/... ama yazı ispanya ise)
  if (dbCity !== urlCategory) {
    console.log("⚠️ ŞEHİR UYUŞMAZLIĞI: 404'e yönlendiriliyor.");
    return notFound();
  }

  return <BlogDetail post={postAny} currentLang={lang} />;
}