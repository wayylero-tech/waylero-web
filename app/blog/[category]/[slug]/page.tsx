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


const posts = [
  ...generalPosts,
  ...uygulamaPosts,
  ...antikkentPosts,
  ...konyaPosts,
  ...istanbulPosts,
  ...konyaPosts2,
  ...konyaRehberPost,
  ...selalelerRehberPost,

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
