// @/app/blog/[category]/[slug]/page.tsx

import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "./BlogDetail";
import { allPosts } from "@/lib/blog/posts";

// ✅ Static render (EN ÖNEMLİ)
export const dynamic = "force-static";


// 🔹 URL temizleme
const cleanText = (text: string) => {
  if (!text) return "";
  try {
    return decodeURIComponent(text).normalize("NFC").toLowerCase().trim();
  } catch {
    return text.normalize("NFC").toLowerCase().trim();
  }
};


// ✅ Static params (build time)
export async function generateStaticParams() {
  return allPosts.map((post: any) => ({
    category: cleanText(post.city || "travel"),
    slug: cleanText(post.slug),
  }));
}


// ✅ Slug’dan post bul
const getPostBySlug = cache(async (slug: string) => {
  const normalizedSlug = cleanText(slug);

  return (
    allPosts.find((p: any) => cleanText(p.slug) === normalizedSlug) || null
  );
});


// ✅ SEO metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {

  const { category, slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return { title: "Not Found | Waylero" };

  const postAny = post as any;

  const titleText =
    postAny.title?.tr || "Travel Guide";

  const descriptionText =
    postAny.seo?.description?.tr ||
    postAny.excerpt?.tr ||
    "";

  const fullUrl = `https://www.waylero.com/blog/${category}/${slug}`;

  return {
    title: `${titleText} | Waylero Blog`,
    description: descriptionText,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: fullUrl,
      type: "article",
      images: postAny.image ? [{ url: postAny.image }] : [],
    },
  };
}


// ✅ PAGE
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {

  const { category, slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) return notFound();

  const postAny = post as any;

  const urlCategory = cleanText(category);
  const dbCity = cleanText(postAny.city || "travel");

  // ✅ kategori güvenliği
  if (dbCity !== urlCategory) return notFound();

  return <BlogDetail post={postAny} currentLang="tr" />;
}