import { MetadataRoute } from "next";

// 🔒 STATIC EXPORT İÇİN ZORUNLU
export const dynamic = "force-static";
export const revalidate = false;

// 🌍 Gezi yerleri
import turkey from "@/app/data/turkey.json";
import europa from "@/app/data/europa.json";
import asia from "@/app/data/asia.json";

// ⭐ Şehirler
import cities from "@/app/data/cities.json";

// 📝 Bloglar
import { konyaPosts } from "@/app/data/blog/konya/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";

// ✅ TÜM BLOGLARI BİRLEŞTİR
const allPosts = [
  ...generalPosts,
  ...uygulamaPosts,
  ...antikkentPosts,
  ...konyaPosts,
  ...konyaPosts2,
  ...istanbulPosts,
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.waylero.com";
  const now = new Date();

  // 🌍 Gezi yerleri
  const placeUrls = [
    ...Object.values(turkey).flat(),
    ...Object.values(europa).flat(),
    ...Object.values(asia).flat(),
  ].map((place: any) => ({
    url: `${baseUrl}/${place.slug}`,
    lastModified: now,
  }));

  // ⭐ Şehirler
  const cityUrls = cities.map((city: any) => ({
    url: `${baseUrl}/${city.slug}`,
    lastModified: now,
  }));

  // 📝 Blog yazıları
  const blogUrls = allPosts.map((post: any) => ({
    url: `${baseUrl}/blog/${post.city}/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.createdAt ?? now),
  }));

  return [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/kesfet`, lastModified: now },
    ...cityUrls,
    ...placeUrls,
    ...blogUrls,
  ];
}