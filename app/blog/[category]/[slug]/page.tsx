import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "./BlogDetail";

// Veri importlarını buraya olduğu gibi bırakıyoruz
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { konyaRehberPost } from "@/app/data/blog/konya/posts3";
import { selalelerRehberPost } from "@/app/data/blog/selale/posts";
import { magaralarRehberPost } from "@/app/data/blog/magaralar/posts";
import { turkeyPost } from "@/app/data/blog/turkey/posts";
import { kanyonlarRehberPosts } from "@/app/data/blog/kanyonlar/posts";
import { mersinRehberPosts } from "@/app/data/blog/mersin/posts";
import { turkiyeEnCokZiyaretEdilen10YerPost } from "@/app/data/blog/ziyaretedilenonyer/posts";
import { antalyaRehberPost } from "@/app/data/blog/antalya/posts";
import { trekkingPosts } from "@/app/data/blog/likya/posts";
import { istanbulRehberPosts } from "@/app/data/blog/istanbul/post";
import { antalyaPosts2 } from "@/app/data/blog/antalya/posts2";
import { ispanyaRehberPosts } from "@/app/data/blog/ispanya/posts";
import { spainPosts } from "@/app/data/blog/ispanya/posts2";
import { nevsehirRehberPosts } from "@/app/data/blog/nevsehir/posts";
import { cappadociaPosts } from "@/app/data/blog/nevsehir/cappadociaPosts";

const posts = [
  ...generalPosts,
  ...uygulamaPosts,
  ...antikkentPosts,
  ...konyaPosts,
  ...istanbulPosts,
  ...konyaPosts2,
  ...konyaRehberPost,
  ...selalelerRehberPost,
  ...magaralarRehberPost,
  ...turkeyPost,
  ...kanyonlarRehberPosts,
  ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost,
  ...antalyaRehberPost,
  ...trekkingPosts,
  ...istanbulRehberPosts,
  ...antalyaPosts2,
  ...ispanyaRehberPosts,
  ...spainPosts,
  ...nevsehirRehberPosts,
  ...cappadociaPosts,
];

// 1. SSG İÇİN PARAMETRELERİ ÖNCEDEN OLUŞTURMA
export async function generateStaticParams() {
  return posts.map((post) => ({
    category: post.city,
    slug: post.slug,
  }));
}

// 2. DİNAMİK SEO METADATA YÖNETİMİ
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const post = posts.find((p) => p.city === category && p.slug === slug);

  if (!post) return { title: "Sayfa Bulunamadı - Waylero" };

  const postAny = post as any;
  const titleText = typeof postAny.title === "object" ? postAny.title["tr"] : postAny.title;
  const descriptionText = postAny.seo?.description || 
    (typeof postAny.excerpt === "object" ? postAny.excerpt["tr"] : postAny.excerpt) ||
    (typeof postAny.description === "object" ? postAny.description["tr"] : postAny.description);

  const fullUrl = `https://www.waylero.com/blog/${category}/${slug}`;

  return {
    title: `${titleText} | Waylero Blog`,
    description: descriptionText || `${titleText} hakkında detaylı gezi rehberi ve tavsiyeler.`,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: titleText,
      description: descriptionText,
      url: fullUrl,
      type: "article",
      images: post.image ? [{ url: post.image }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: titleText,
      description: descriptionText,
      images: post.image ? [post.image] : [],
    },
  };
}

// 3. SAYFA BİLEŞENİ (SERVER COMPONENT)
export default async function Page({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;

  const post = posts.find(
    (p) => p.city === category && p.slug === slug
  );

  if (!post) {
    return notFound();
  }

  return <BlogDetail post={post} />;
}