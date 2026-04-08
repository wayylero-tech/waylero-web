"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeBlogSlider from "./components/HomeBlogSlider";
import { useLang } from "./context/LanguageContext";
import { wayleroLiveVideos, addSlugs } from "@/videos";

/* 🔹 ÖNE ÇIKAN ŞEHİRLER */
const featuredCities = [
  { name: { tr: "İstanbul", en: "Istanbul" }, slug: "istanbul", country: "turkiye", image: "/assets/genel/istanbul.webp" },
  { name: { tr: "Viyana", en: "Vienna" }, slug: "viyana", country: "avusturya", image: "/assets/genel/viyana.webp" },
  { name: { tr: "Dubai", en: "Dubai" }, slug: "dubai", country: "bae", image: "/assets/genel/dubai.webp" },
  { name: { tr: "New York", en: "New York" }, slug: "newyork", country: "amerika", image: "/assets/genel/new.webp" },
  { name: { tr: "Pekin", en: "Beijing" }, slug: "pekin", country: "cin", image: "/assets/genel/pekin.webp" },
  { name: { tr: "Paris", en: "Paris" }, slug: "paris", country: "fransa", image: "/assets/genel/paris.webp" },
  { name: { tr: "Londra", en: "London" }, slug: "londra", country: "ingiltere", image: "/assets/genel/londra.webp" },
  { name: { tr: "Antalya", en: "Antalya" }, slug: "antalya", country: "turkiye", image: "/assets/genel/antalya.webp" },
  { name: { tr: "Tokyo", en: "Tokyo" }, slug: "tokyo", country: "japonya", image: "/assets/genel/tokyo.webp" },
  { name: { tr: "Hong Kong", en: "Hong Kong" }, slug: "hongkong", country: "cin", image: "/assets/genel/hongkong.webp" },
  { name: { tr: "Bangkok", en: "Bangkok" }, slug: "bangkok", country: "tayland", image: "/assets/genel/bangkok.webp" },
  { name: { tr: "Singapur", en: "Singapore" }, slug: "singapur", country: "singapur", image: "/assets/genel/singapur.webp" },
  { name: { tr: "Barselona", en: "Barcelona" }, slug: "barselona", country: "ispanya", image: "/assets/genel/barcelona.webp" },
  { name: { tr: "Roma", en: "Rome" }, slug: "roma", country: "italya", image: "/assets/genel/roma.webp" },
  { name: { tr: "Mekke", en: "Mecca" }, slug: "mekke", country: "suudi-arabistan", image: "/assets/genel/mekke.webp" },
];

/* 🔹 REKLAM */
function AdSlot({ slot }: { slot: string }) {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  return (
    <div className="relative w-[160px] h-[600px] overflow-hidden rounded-xl">
      <ins
        className="adsbygoogle block w-full h-full"
        data-ad-client="ca-pub-4779947503854024"
        data-ad-slot={slot}
      />
    </div>
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const router = useRouter();

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

  const t = {
    tr: { cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri" },
    en: { cityTitle: "World's Most Visited Cities" }
  }[lang as "tr" | "en"] || {
    cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri"
  };

  const quickMenu = [
    { title: "Etkinlikler", image: "/assets/genel/aktiviteler.webp", route: "/aktiviteler" },
    { title: "Keşfet", image: "/assets/genel/kesfet.webp", route: "/kesfet" },
    { title: "Harita", image: "/assets/genel/harita.webp", url: "https://www.google.com/maps" },
    { title: "Blog", image: "/assets/genel/tinaztepe.webp", route: "/blog" },
  ];

  const videos = addSlugs(wayleroLiveVideos);

  return (
    <main className="bg-gray-50/50 flex justify-center max-w-[1600px] mx-auto gap-4 w-full">

      {/* SOL REKLAM */}
      <aside className="hidden xl:block sticky top-10">
        <AdSlot slot="6195494093" />
      </aside>

      <div className="flex-1 max-w-6xl bg-white shadow-sm px-3 md:px-6 py-6">

        {/* HIZLI MENÜ */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {quickMenu.map((item) => (
            <div key={item.title}>
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <div className="relative h-40 md:h-60 rounded-2xl overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-105 transition" />
                  </div>
                </a>
              ) : (
                <Link href={getLocalizedLink(item.route!)}>
                  <div className="relative h-40 md:h-60 rounded-2xl overflow-hidden">
                    <Image src={item.image} alt={item.title} fill className="object-cover hover:scale-105 transition" />
                  </div>
                </Link>
              )}
              <p className="mt-2 text-center text-sm font-medium">{item.title}</p>
            </div>
          ))}
        </section>

        <HomeBlogSlider />

        {/* VİDEOLAR */}
<section className="mt-12 mb-8">
  
  {/* HEADER */}
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-lg md:text-xl font-bold">
      {lang === "tr" ? "Videolar" : "Videos"}
    </h2>
  </div>

  {/* GRID SİSTEMİ (FIX) */}
  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {videos.slice(0, 4).map((video) => (
      
      <div
        key={video.id}
        onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))}
        className="cursor-pointer group"
      >

        {/* VIDEO CARD */}
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden shadow-md">

          <Image
            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition duration-300"
          />

          {/* DARK OVERLAY */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition" />

          {/* 🔥 PLAY BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition">
              
              <svg
                className="w-6 h-6 text-white translate-x-[2px]"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M7 6v12l10-6z" />
              </svg>

            </div>
          </div>

        </div>

        {/* TEXT */}
        <p className="text-sm mt-2 font-semibold line-clamp-2 group-hover:text-red-600 transition">
          {video.title}
        </p>

      </div>
    ))}
  </div>
</section>

        {/* ŞEHİRLER */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">{t.cityTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredCities.map((c) => {
              const localized = lang === "en" ? c.name.en : c.name.tr;
              return (
                <Link key={c.slug} href={getLocalizedLink(`/${c.country}/${c.slug}`)}>
                  <div className="relative h-44 md:h-60 rounded-2xl overflow-hidden group">
                    <Image
                      src={c.image}
                      alt={localized}
                      fill
                      className="object-cover group-hover:scale-110 transition"
                    />
                    <div className="absolute inset-0 bg-black/30" />
                    <span className="absolute bottom-3 left-3 text-white font-semibold">
                      {localized}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      {/* SAĞ REKLAM */}
      <aside className="hidden xl:block sticky top-10">
        <AdSlot slot="5241070307" />
      </aside>

    </main>
  );
}