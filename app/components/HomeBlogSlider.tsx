import Link from "next/link";
import { client } from "@/lib/sanity";

async function getPosts() {
  return await client.fetch(`
    *[_type == "post"] | order(publishedAt desc)[0...8]{
      title,
      "slug": slug.current,
      "category": categories[0]->title,
      "image": mainImage.asset->url,
      body
    }
  `);
}

export default async function HomeBlogSlider() {
  const posts = await getPosts();

  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-4">Seyehat Rehberi ✍️</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post: any, i: number) => {
          const href = `/blog/${post.category}/${post.slug}`;

          return (
            <Link
              key={post.slug + i}
              href={href}
              className="w-full h-72 rounded-2xl overflow-hidden bg-white shadow cursor-pointer hover:shadow-md transition"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />

              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">
                  {post.title}
                </h3>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
