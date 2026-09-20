import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "./BlogDetail";
import { allPosts } from "@/lib/blog/posts";

export const dynamic = "force-static";
export const revalidate = 2592000; // 1 ay cache

const BASE_URL = "https://www.waylero.com";

interface Props {
  params: Promise<{ lang: string; category: string; slug: string }>;
}

// 🔥 İşlemciyi yormayan hızlı clean helper (Ağır normalize işlemleri kaldırıldı)
const cleanText = (text: string) => {
  if (!text) return "";
  return text.toLowerCase().trim();
};

// 📌 cache lookup
const getPostBySlug = cache(async (slug: string) => {
  const normalizedSlug = cleanText(slug);

  return (
    allPosts.find((p: any) => cleanText(p.slug) === normalizedSlug) || null
  );
});

// --------------------
// STATIC PARAMS
// --------------------
export async function generateStaticParams() {
  const paths: any[] = [];

  // Orijinal diziyi bozmadan en son eklenen 20 yazıyı alıyoruz
  const recentPosts = allPosts.slice(-20);

  recentPosts.forEach((post: any) => {
    const category = cleanText(post.city || "travel");
    const slug = cleanText(post.slug);

    paths.push({ lang: "tr", category, slug });
    paths.push({ lang: "en", category, slug });
  });

  return paths;
}

// --------------------
// METADATA
// --------------------
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Not Found | Waylero" };

  const p: any = post;

 const title = p.title?.[lang] || p.title?.tr || "Travel Guide";

const description =
  p.seo?.description?.[lang] ||
  p.excerpt?.[lang] ||
  p.excerpt?.tr ||
  "";

  const url = `${BASE_URL}/${lang}/blog/${resolvedParams.category}/${resolvedParams.slug}`;

  return {
   title: `${title} | Waylero`,
description: description.slice(0, 155),

    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/blog/${resolvedParams.category}/${resolvedParams.slug}`,
        "en-US": `${BASE_URL}/en/blog/${resolvedParams.category}/${resolvedParams.slug}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Waylero",
      images: p.image
        ? [
            {
              url: p.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.image ? [p.image] : [],
    },
  };
}

// --------------------
// PAGE
// --------------------
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return notFound();

  const p: any = post;

  const dbCategory = cleanText(p.city || "travel");
  const urlCategory = cleanText(resolvedParams.category);

  // ❌ category check
  if (dbCategory !== urlCategory) return notFound();

  // 🔥 RELATED POSTS (Hızlı karşılaştırma ile CPU yükü hafifletildi)
  const currentSlug = cleanText(p.slug);
  const relatedPosts = allPosts
    .filter((item: any) => {
      const itemCategory = cleanText(item.city || "travel");
      const itemSlug = cleanText(item.slug);
      return itemCategory === urlCategory && itemSlug !== currentSlug;
    })
    .slice(0, 6);

  return (
    <BlogDetail
      post={p}
      currentLang={lang}
      relatedPosts={relatedPosts}
    />
  );
}