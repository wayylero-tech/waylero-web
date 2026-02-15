import { client } from "@/lib/sanity";
import BlogDetail from "./BlogDetail";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string; category: string }>;
}) {
  const { slug } = await params; // 🔥 BURASI ÖNEMLİ

  const query = `
    *[_type == "post" && slug.current == $slug][0]{
      title,
      body,
      mainImage
    }
  `;

  const post = await client.fetch(query, {
    slug: slug, // 🔥 slug burada gerçekten gönderiliyor
  });

  if (!post) {
    return <div>Post bulunamadı</div>;
  }

  return <BlogDetail post={post} />;
}
