import { client } from "@/lib/sanity";

export default async function BlogPage() {
  const posts = await client.fetch(`
    *[_type == "post"]{
      title,
      "slug": slug.current
    }
  `);

  return (
    <div>
      <h1>Blog</h1>
      {posts.map((post: any) => (
        <div key={post.slug}>
          <a href={`/blog/${post.slug}`}>
            {post.title}
          </a>
        </div>
      ))}
    </div>
  );
}
