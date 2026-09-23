import { cache } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogDetail from "./BlogDetail";
import { allPosts } from "@/lib/blog/posts";

export const dynamic = "force-static";
export const dynamicParams = true; // 🔥 EKLENDİ: SSG'de listede bulunmayan sayfalar kullanıcı tıklayınca dinamik üretilir, build kilitlenmez!
export const revalidate = 2592000; // 1 ay cache

const BASE_URL = "https://www.waylero.com";

interface Props {
  params: Promise<{
    lang: string;
    category: string;
    slug: string;
  }>;
}

// 🔥 İşlemciyi yormayan hızlı clean helper
const cleanText = (text: string) => {
  if (!text) return "";
  return text.toLowerCase().trim();
};

// 📌 cache lookup
const getPostBySlug = cache(async (slug: string) => {
  const normalizedSlug = cleanText(slug);

  return (
    allPosts.find(
      (p: any) => cleanText(p.slug) === normalizedSlug
    ) || null
  );
});

// --------------------
// STATIC PARAMS
// --------------------
export async function generateStaticParams() {
  const paths: any[] = [];

  // Orijinal diziyi bozmadan en son eklenen 20 yazıyı alıyoruz
  const recentPosts = allPosts.slice(-20);

  recentPosts.forEach((post: any) => {
    const category = cleanText(post.city || "travel");
    const slug = cleanText(post.slug);

    paths.push({
      lang: "tr",
      category,
      slug,
    });

    paths.push({
      lang: "en",
      category,
      slug,
    });
  });

  return paths;
}

// --------------------
// METADATA
// --------------------
export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const lang = resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(resolvedParams.slug);

  if (!post) {
    return {
      title: "Not Found | Waylero",
    };
  }

  const p: any = post;

  const title =
    p.title?.[lang] ||
    p.title?.tr ||
    "Travel Guide";

  const description =
    p.seo?.description?.[lang] ||
    p.excerpt?.[lang] ||
    p.excerpt?.tr ||
    "";

  const url =
    `${BASE_URL}/${lang}/blog/` +
    `${resolvedParams.category}/${resolvedParams.slug}`;

  return {
    title: `${title} | Waylero`,

    description: description.slice(0, 155),

    alternates: {
      canonical: url,

      languages: {
        "tr-TR":
          `${BASE_URL}/tr/blog/` +
          `${resolvedParams.category}/${resolvedParams.slug}`,

        "en-US":
          `${BASE_URL}/en/blog/` +
          `${resolvedParams.category}/${resolvedParams.slug}`,
      },
    },

    openGraph: {
      title,
      description,
      url,
      type: "article",

      siteName: "Waylero",

      images: p.image
        ? [
            {
              url: p.image,
              width: 1200,
              height: 630,
              alt: title,
            },
          ]
        : [],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: p.image ? [p.image] : [],
    },
  };
}

// --------------------
// PAGE
// --------------------
export default async function Page({
  params,
}: Props) {
  const resolvedParams = await params;
  const lang =
    resolvedParams.lang === "en" ? "en" : "tr";

  const post = await getPostBySlug(
    resolvedParams.slug
  );

  if (!post) return notFound();

  const p: any = post;

  const dbCategory = cleanText(
    p.city || "travel"
  );

  const urlCategory = cleanText(
    resolvedParams.category
  );

  // ❌ category check
  if (dbCategory !== urlCategory) {
    return notFound();
  }

  // 🔥 RELATED POSTS
  const currentSlug = cleanText(p.slug);

  const relatedPosts = allPosts
    .filter((item: any) => {
      const itemCategory = cleanText(
        item.city || "travel"
      );

      const itemSlug = cleanText(item.slug);

      return (
        itemCategory === urlCategory &&
        itemSlug !== currentSlug
      );
    })
    .slice(0, 6);

  // --------------------
  // JSON-LD
  // --------------------

  const title =
    p.seo?.title?.[lang] ||
    p.title?.[lang] ||
    p.title?.tr ||
    "Travel Guide";

  const description =
    p.seo?.description?.[lang] ||
    p.excerpt?.[lang] ||
    p.excerpt?.tr ||
    "";

  const pageUrl =
    `${BASE_URL}/${lang}/blog/` +
    `${resolvedParams.category}/${resolvedParams.slug}`;

  const imageUrl = p.image || undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",

    headline: title,

    description: description.slice(0, 155),

    image: imageUrl
      ? {
          "@type": "ImageObject",
          url: imageUrl,
        }
      : undefined,

    url: pageUrl,

    inLanguage: lang === "en" ? "en-US" : "tr-TR",

    datePublished: p.date,

    author: {
      "@type": "Organization",
      name: p.authorName || "Waylero",
      url: BASE_URL,
    },

    publisher: {
      "@type": "Organization",
      name: "Waylero",
      url: BASE_URL,
    },

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },

    isPartOf: {
      "@type": "WebSite",
      name: "Waylero",
      url: BASE_URL,
    },

    breadcrumb: {
      "@type": "BreadcrumbList",

      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: lang === "en" ? "Home" : "Anasayfa",
          item: `${BASE_URL}/${lang}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: lang === "en" ? "Travel Blog" : "Seyahat Blogu",
          item: `${BASE_URL}/${lang}/blog`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: title,
          item: pageUrl,
        },
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <BlogDetail
        post={p}
        currentLang={lang}
        relatedPosts={relatedPosts}
      />
    </>
  );
}