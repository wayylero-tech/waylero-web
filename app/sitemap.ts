import { MetadataRoute } from "next";
import { cityToCountryMap } from "@/app/middleware"; // middleware’den import

export const dynamic = "force-static";
export const revalidate = false;

import turkey from "@/app/data/turkey.json";
import europa from "@/app/data/europa.json";
import asia from "@/app/data/asia.json";

import cities from "@/app/data/cities.json";

import { konyaPosts } from "@/app/data/blog/konya/posts";
import { konyaPosts2 } from "@/app/data/blog/konya/posts2";
import { istanbulPosts } from "@/app/data/blog/istanbul/posts";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";

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

  const places = [
    ...Object.values(turkey).flat(),
    ...Object.values(europa).flat(),
    ...Object.values(asia).flat(),
  ];

  // 🌍 Mekan URL
  const placeUrls = places.map((place: any) => {
    const country = cityToCountryMap[place.city.toLowerCase()] || "turkiye"; // default turkiye
    return {
      url: `${baseUrl}/kesfet/${country}/${place.city}/${place.slug}`,
      lastModified: now,
    };
  });

  // ⭐ Şehir URL
  const cityUrls = cities.map((city: any) => {
    const country = cityToCountryMap[city.slug.toLowerCase()] || "turkiye";
    return {
      url: `${baseUrl}/${country}/${city.slug}`,
      lastModified: now,
    };
  });

  // 📝 Blog URL
  const blogUrls = allPosts.map((post: any) => {
    const country = cityToCountryMap[post.city.toLowerCase()] || "turkiye";
    return {
      url: `${baseUrl}/blog/${post.city}/${post.slug}`,
      lastModified: new Date(post.updatedAt ?? post.createdAt ?? now),
    };
  });

  return [
    { url: baseUrl, lastModified: now },
    { url: `${baseUrl}/kesfet`, lastModified: now },
    ...cityUrls,
    ...placeUrls,
    ...blogUrls,
  ];
}