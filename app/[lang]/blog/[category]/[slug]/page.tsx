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

// 🔥 clean helper (stable SEO slug)
const cleanText = (text: string) => {
  if (!text) return "";
  try {
    return decodeURIComponent(text)
      .normalize("NFC")
      .toLowerCase()
      .trim();
  } catch {
    return text.normalize("NFC").toLowerCase().trim();
  }
};

// 📌 cache lookup
const getPostBySlug = cache(async (slug: string) => {
  const normalizedSlug = cleanText(slug);
  return allPosts.find(
    (p: any) => cleanText(p.slug) === normalizedSlug
  ) || null;
});

// --------------------
// STATIC PARAMS (SEO BOOST)
// --------------------
export async function generateStaticParams() {
  const paths: any[] = [];

  allPosts.forEach((post: any) => {
    const category = cleanText(post.city || "travel");
    const slug = cleanText(post.slug);

    paths.push({ lang: "tr", category, slug });
    paths.push({ lang: "en", category, slug });
  });

  return paths;
}

// --------------------
// METADATA (FULL SEO FIX)
// --------------------
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return { title: "Not Found | Waylero" };

  const p: any = post;

  const title =
    p.title?.[lang] || p.title?.tr || "Travel Guide";

  const description =
    p.seo?.description?.[lang] ||
    p.excerpt?.[lang] ||
    p.excerpt?.tr ||
    "";

  const pathUrl = `/${lang}/blog/${resolvedParams.category}/${resolvedParams.slug}`;
  const url = `${BASE_URL}${pathUrl}`;

  return {
    title: `${title} | Waylero Blog`,
    description: description.slice(0, 160),

    // 🔥 canonical + hreflang (CRITICAL SEO)
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/blog/${resolvedParams.category}/${resolvedParams.slug}`,
        "en-US": `${BASE_URL}/en/blog/${resolvedParams.category}/${resolvedParams.slug}`,
      },
    },

    // 🔥 OPEN GRAPH (WhatsApp / Discord / Facebook)
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

    // 🔥 TWITTER
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
export default async function Page({
  params,
}: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(resolvedParams.slug);
  if (!post) return notFound();

  const p: any = post;

  const dbCategory = cleanText(p.city || "travel");
  const urlCategory = cleanText(resolvedParams.category);

  // ❌ wrong category protection
  if (dbCategory !== urlCategory) return notFound();

  return (
    <BlogDetail
      post={p}
      currentLang={lang}
    />
  );
}