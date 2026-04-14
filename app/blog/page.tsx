import { cookies } from "next/headers";
import BlogClient from "./BlogClient"; // BlogClient dosyanın ismiyle aynı olmalı

// Veri importları
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "../data/blog/konya/posts";
import { istanbulPosts } from "../data/blog/istanbul/posts";
import { konyaPosts2 } from "../data/blog/konya/posts2";
import { konyaRehberPost } from "../data/blog/konya/posts3";
import { selalelerRehberPost } from "../data/blog/selale/posts";
import { magaralarRehberPost } from "../data/blog/magaralar/posts";
import { turkeyPost } from "../data/blog/turkey/posts";
import { kanyonlarRehberPosts } from "../data/blog/kanyonlar/posts";
import { mersinRehberPosts } from "../data/blog/mersin/posts";
import { turkiyeEnCokZiyaretEdilen10YerPost } from "../data/blog/ziyaretedilenonyer/posts";
import { antalyaRehberPost } from "../data/blog/antalya/posts";
import { trekkingPosts } from "../data/blog/likya/posts";
import { istanbulRehberPosts } from "../data/blog/istanbul/post";
import { antalyaPosts2 } from "../data/blog/antalya/posts2";
import { ispanyaRehberPosts } from "../data/blog/ispanya/posts";
import { spainPosts } from "../data/blog/ispanya/posts2";
import { nevsehirRehberPosts } from "../data/blog/nevsehir/posts";
import { cappadociaPosts } from "../data/blog/nevsehir/cappadociaPosts";
import { turkeyPostsAkdeniz } from "../data/blog/turkey/postsakdeniz";
import { turkeyPostEge } from "../data/blog/turkey/postsege";
import { turkeyPostMarmara } from "../data/blog/turkey/postsmarmara";
import { turkeyPostIcAnadolu } from "../data/blog/turkey/postsicanadolu";
import { turkeyPostKaradeniz } from "../data/blog/turkey/postkaradeniz";
import { turkeyPostDoguAnadolu } from "../data/blog/turkey/psostsdoguanadolu";
import { turkeyPostGunaydogu } from "../data/blog/turkey/postsguneydoguanadolu";
import { catalhoyukPosts } from "../data/blog/konya/posts4";

const allPosts = [
  ...generalPosts, ...uygulamaPosts, ...antikkentPosts, ...konyaPosts,
  ...istanbulPosts, ...konyaPosts2, ...konyaRehberPost, ...selalelerRehberPost,
  ...magaralarRehberPost, ...turkeyPost, ...kanyonlarRehberPosts, ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost, ...antalyaRehberPost, ...trekkingPosts,
  ...istanbulRehberPosts, ...antalyaPosts2, ...ispanyaRehberPosts, ...spainPosts,
  ...nevsehirRehberPosts, ...cappadociaPosts, ...turkeyPostKaradeniz, ...turkeyPostsAkdeniz,
  ...turkeyPostEge, ...turkeyPostMarmara, ...turkeyPostDoguAnadolu, 
  ...turkeyPostIcAnadolu, ...turkeyPostGunaydogu, ...catalhoyukPosts,
];

export async function generateMetadata() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value || "tr";

  const metaMap = {
    tr: {
      title: "Seyahat Rehberi | Gezi Notları ve İpuçları - Waylero",
      description: "Türkiye ve dünyadan en güncel seyahat rehberleri, antik kentler ve gezi ipuçları Waylero Blog'da."
    },
    en: {
      title: "Travel Guide | Travel Notes and Tips - Waylero",
      description: "The most up-to-date travel guides, ancient cities, and travel tips from Turkey and the world on Waylero Blog."
    }
  };

  const currentMeta = metaMap[lang as "tr" | "en"] || metaMap.tr;

  return {
    title: currentMeta.title,
    description: currentMeta.description,
    alternates: {
      canonical: lang === "en" ? "https://www.waylero.com/en/blog" : "https://www.waylero.com/blog",
      languages: {
        "tr-TR": "https://www.waylero.com/blog",
        "en-US": "https://www.waylero.com/en/blog",
      },
    },
  };
}

export default function Page() {
  return <BlogClient posts={allPosts} />;
}