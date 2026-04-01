import ReactMarkdown from "react-markdown";
import BlogGallery from "./BlogGallery";

type Post = {
  title: any;
  image?: string;
  gallery?: string[];
  content?: any;
};

export default function BlogDetail({ post }: { post: Post }) {
  const displayTitle =
    typeof post.title === "object" ? post.title["tr"] : post.title;

  const displayContent =
    typeof post.content === "object" ? post.content["tr"] : post.content;

  const images = post.gallery?.length
    ? post.gallery
    : post.image
    ? [post.image]
    : [];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-3xl md:text-5xl font-black mb-12 text-center text-gray-900 leading-tight">
        {displayTitle}
      </h1>

      {/* ✅ CLIENT GALERİ */}
      <BlogGallery images={images} title={displayTitle} />

      {/* ✅ CONTENT (SERVER → SEO OKUR) */}
      {displayContent && (
        <div className="max-w-3xl mx-auto">
          <ReactMarkdown
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold mt-12 mb-6">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold mt-10 mb-5 border-b pb-3">
                  {children}
                </h2>
              ),
              p: ({ children }) => (
                <p className="text-lg leading-9 mb-6 text-gray-700 text-justify">
                  {children}
                </p>
              ),
            }}
          >
            {displayContent}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
