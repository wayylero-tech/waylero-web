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
];


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
