import { Metadata } from "next";
import Link from "next/link";
import { Sparkles, ChevronRight } from "lucide-react";
import { allPosts } from "@/lib/blog/posts";
import BlogViews from "./BlogViews";

interface Props {
  params: Promise<{ lang?: string }>;
}

export const revalidate = 2592000; // 1 ay cache

const BASE_URL = "https://www.waylero.com";

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";
  const isEn = lang === "en";

  const title = isEn
    ? "Travel Blog | Guides, Tips & Destinations - Waylero"
    : "Seyahat Blogu | Rehberler ve Gezi Yazıları - Waylero";

  const description = isEn
    ? "Discover the latest travel guides, tips and destination stories on Waylero Blog."
    : "En güncel gezi rehberleri, ipuçları ve seyahat yazıları Waylero Blog’da.";

  const pathUrl = "/blog";
  const url = `${BASE_URL}/${lang}${pathUrl}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${BASE_URL}/tr/blog`,
        "en-US": `${BASE_URL}/en/blog`,
      },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      type: "website",
      images: [
        {
          url: `${BASE_URL}/og/blog.jpg`,
          width: 1200,
          height: 630,
          alt: "Waylero Blog",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${BASE_URL}/og/blog.jpg`],
    },
  };
}

function optimizeCloudinaryImage(url: string, width = 640): string {
  if (!url) return "/placeholder.jpg";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  if (url.includes("/f_auto") || url.includes("/q_auto")) {
    return url;
  }

  return url.replace(
    "/image/upload/",
    `/image/upload/f_auto,q_auto,w_${width},dpr_auto/`
  );
}

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";
  const isEn = lang === "en";

  const t = isEn
    ? {
        heading: "Travel Guide",
        badge: "EDITOR'S PICKS",
        readMore: "Read More",
      }
    : {
        heading: "Seyahat Rehberi",
        badge: "EDİTÖRÜN SEÇİMLERİ",
        readMore: "Devamını Oku",
      };

  const langPrefix = `/${lang}`;

  const displayPosts = [...allPosts].reverse();

  return (
    <main className="min-h-screen bg-white">
      <section className="pt-24 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-orange-100 shadow-sm">
            <Sparkles size={14} className="text-orange-500" />
            <span>{t.badge}</span>
          </div>

          <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tight uppercase">
            {t.heading}{" "}
            <span className="inline-block animate-bounce">
              ✍️
            </span>
          </h1>
        </div>
      </section>

      <section className="container mx-auto px-6 -mt-16 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {displayPosts.map((post, index) => {
            const displayTitle =
              post.title?.[lang] || post.title?.tr || "";

            const displayExcerpt =
              post.excerpt?.[lang] || post.excerpt?.tr || "";

            const localizedHref =
              `${langPrefix}/blog/${post.city}/${post.slug}`;

            const isPriority = index < 2;

            const imageUrl = optimizeCloudinaryImage(
              post.image,
              640
            );

            return (
              <Link
                key={post.slug}
                href={localizedHref}
                className="h-full"
              >
                <article className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 flex flex-col h-full">
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={imageUrl}
                      alt={displayTitle}
                      width={640}
                      height={426}
                      loading={isPriority ? "eager" : "lazy"}
                      fetchPriority={
                        isPriority ? "high" : "auto"
                      }
                      decoding="async"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-8 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {displayTitle}
                    </h2>

                    <p className="text-sm text-gray-500 line-clamp-3 mb-6 font-medium leading-relaxed">
                      {displayExcerpt}
                    </p>

                    <div className="mt-auto flex justify-between items-center text-[10px] font-black uppercase text-gray-400 group-hover:text-orange-600 transition-colors tracking-widest">
                      <BlogViews
                        slug={post.slug}
                        lang={lang}
                      />

                      <span className="flex items-center gap-1">
                        {t.readMore}
                        <ChevronRight size={18} />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}