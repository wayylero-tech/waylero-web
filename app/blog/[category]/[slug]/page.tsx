import { Metadata } from "next";
import { notFound } from "next/navigation";
import { headers } from "next/headers"; // Header'ı ekledik
import BlogDetail from "./BlogDetail";
import { allPosts } from "@/lib/blog/posts";

const posts = allPosts;

export async function generateStaticParams() {
  return posts.map((post) => ({
    category: post.city,
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  
  // Dil bilgisini header'dan çekiyoruz
  const headerList = await headers();
  const lang = (headerList.get("x-url-lang") === "en" ? "en" : "tr") as "en" | "tr";
  
  const post = posts.find((p) => 
    p.city.toLowerCase() === category.toLowerCase() && 
    p.slug === slug
  );

  if (!post) {
    return { title: "Not Found | Waylero" };
  }

  const postAny = post as any;
  
  // Dile göre Title seçimi
  const titleText = (typeof postAny.title === "object" ? postAny.title[lang] : postAny.title) 
                    || "Travel Guide";
  
  // Dile göre Description seçimi
  let descriptionText = postAny.seo?.description?.[lang] || 
    (typeof postAny.excerpt === "object" ? postAny.excerpt[lang] : postAny.excerpt) ||
    (typeof postAny.description === "object" ? postAny.description[lang] : postAny.description);

  if (!descriptionText) {
    descriptionText = lang === "tr" 
      ? `${titleText} hakkında detaylı gezi rehberi Waylero'da.`
      : `Detailed travel guide for ${titleText} on Waylero.`;
  }

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
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  
  // Buradaki dilde de header'ı okuyoruz
  const headerList = await headers();
  const lang = (headerList.get("x-url-lang") === "en" ? "en" : "tr") as "en" | "tr";

  const post = posts.find(
    (p) => p.city === category && p.slug === slug
  );

  if (!post) {
    return notFound();
  }

  // BlogDetail'e dili de gönderiyoruz ki içeride metinleri ona göre bassın
  return <BlogDetail post={post} currentLang={lang} />;
}