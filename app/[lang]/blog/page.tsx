import { Metadata } from "next";
import BlogClient from "./BlogClient";
import { allPosts } from "@/lib/blog/posts";

interface Props {
  params: Promise<{ lang?: string }>;
}

export const revalidate = 2592000; // 1 ay cache

const BASE_URL = "https://www.waylero.com";

// 🧠 SEO METADATA
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";
  const isEn = lang === "en";

  const title = isEn
    ? "Travel Blog | Guides, Tips & Destinations - Waylero"
    : "Seyahat Blogu | Rehberler ve Gezi Yazıları - Waylero";

  const description = isEn
    ? "Discover the latest travel guides, tips and destination stories on Waylero Blog."
    : "En güncel gezi rehberleri, ipuçları ve seyahat yazıları Waylero Blog’da.";

  const pathUrl = "/blog";
  const url = `${BASE_URL}/${lang}${pathUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/blog`,
        "en-US": `${BASE_URL}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og/blog.jpg`,
          width: 1200,
          height: 630,
          alt: "Waylero Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og/blog.jpg`],
    },
  };
}

// 🧠 PAGE
export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  return (
    <BlogClient
      posts={allPosts}
      currentLang={lang}
    />
  );
}