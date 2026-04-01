import BlogDetail from "./BlogDetail";
import { notFound } from "next/navigation";

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

// Param tipi
interface Params {
  category: string;
  slug: string;
}

// ✅ SEO METADATA
export function generateMetadata({ params }: { params: Params }) {
  const { category, slug } = params;
  const post = posts.find((p) => p.city === category && p.slug === slug);
  if (!post) return {};

  // 🔹 SEO objesi tip güvenli şekilde seçiliyor
  let seoTitle = "";
  let seoDescription = "";
  if (post.seo) {
    if ("tr" in post.seo) {
      seoTitle = post.seo.tr.title;
      seoDescription = post.seo.tr.description;
    } else {
      seoTitle = post.seo.title;
      seoDescription = post.seo.description;
    }
  }

  const title = typeof post.title === "object" ? post.title.tr : post.title;

  return {
    title: seoTitle || title,
    description: seoDescription,
    alternates: {
      canonical: `https://www.waylero.com/blog/${category}/${slug}`,
    },
    openGraph: {
      title: seoTitle || title,
      description: seoDescription,
      images: post.image ? [post.image] : [],
      url: `https://www.waylero.com/blog/${category}/${slug}`,
      type: "article",
    },
  };
}

// ✅ PAGE
export default function Page({ params }: { params: Params }) {
  const { category, slug } = params;
  const post = posts.find((p) => p.city === category && p.slug === slug);
  if (!post) return notFound();
  return <BlogDetail post={post} />;
}
