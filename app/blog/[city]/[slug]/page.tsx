import { notFound } from "next/navigation";
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";

const allPosts = [...generalPosts,...uygulamaPosts, ...antikkentPosts, ...konyaPosts, ...istanbulPosts, ...konyaPosts2];

/* 🔥 STATIC EXPORT İÇİN ZORUNLU */
export async function generateStaticParams() {
  return allPosts.map((post) => ({
    city: post.city,
    slug: post.slug,
  }));
}

/* ✅ SEO */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;

  const post = allPosts.find(
    (p) => p.city === city && p.slug === slug
  );

  if (!post) return {};

  return {
    title: post.seo.title,
    description: post.seo.description,
  };
}

/* ✅ PAGE */
export default async function BlogDetail({
  params,
}: {
  params: Promise<{ city: string; slug: string }>;
}) {
  const { city, slug } = await params;

  const post = allPosts.find(
    (p) => p.city === city && p.slug === slug
  );

  if (!post) notFound();

  const images = post.gallery ?? [];
  const enableSlider = images.length >= 4;

  return (
    <article className="max-w-6xl mx-auto px-4 py-8">
      {/* 🖼️ IMAGE SECTION */}
      {images.length > 0 && (
        <div className="overflow-hidden mb-10">
          <div
            className={`
              flex gap-4
              ${enableSlider ? "w-max animate-slider" : "flex-wrap justify-center"}
            `}
          >
            {(enableSlider ? [...images, ...images] : images).map(
              (img, i) => (
              <img
  src={img}
  alt={post.title}
  loading="lazy"
  decoding="async"
  className="
    w-[340px]
    md:w-[280px]
    aspect-[9/16]
    object-cover
    object-top
    rounded-2xl
    shrink-0
  "
/>


              )
            )}
          </div>
        </div>
      )}

      {/* 📝 CONTENT */}
      <h1 className="text-3xl font-bold mb-4 text-black">
        {post.title}
      </h1>

      <p className="text-gray-600 mb-6">
        {post.excerpt}
      </p>

      <div className="prose prose-neutral max-w-none whitespace-pre-line text-black">
        {post.content}
      </div>
    </article>
  );
}
