import BlogDetail from "./BlogDetail";
import { notFound } from "next/navigation";

// Tüm post importları
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

// Tüm postları tek yerde topluyoruz
const allPosts = [
  generalPosts,
  uygulamaPosts,
  antikkentPosts,
  konyaPosts,
  istanbulPosts,
  konyaPosts2,
  konyaRehberPost,
  selalelerRehberPost,
  magaralarRehberPost,
  turkeyPost,
  kanyonlarRehberPosts,
  mersinRehberPosts,
  turkiyeEnCokZiyaretEdilen10YerPost,
  antalyaRehberPost,
  trekkingPosts,
  istanbulRehberPosts,
  antalyaPosts2,
  ispanyaRehberPosts,
  spainPosts,
  nevsehirRehberPosts,
  cappadociaPosts,
].flat();

type PageProps = {
  params: {
    category: string;
    slug: string;
  };
};

export default function Page({ params }: PageProps) {
  const { category, slug } = params;

  const post = allPosts.find(
    (p) => p.city === category && p.slug === slug
  );

  if (!post) {
    notFound();
  }

  return <BlogDetail post={post} />;
}
