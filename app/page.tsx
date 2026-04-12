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
    tr: { 
      cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri",
      videoTitle: "Videolar",
      seeAll: "Tümünü Gör",
      menu: { events: "Etkinlikler", explore: "Keşfet", map: "Harita", blog: "Blog" }
    },
    en: { 
      cityTitle: "World's Most Visited Cities",
      videoTitle: "Videos",
      seeAll: "See All",
      menu: { events: "Events", explore: "Explore", map: "Map", blog: "Blog" }
    }
  }[lang as "tr" | "en"];

  const quickMenu = [
    { title: t.menu.events, image: "/assets/genel/aktiviteler.webp", route: "/aktiviteler" },
    { title: t.menu.explore, image: "/assets/genel/kesfet.webp", route: "/kesfet" },
    { title: t.menu.map, image: "/assets/genel/harita.webp", url: "https://google.com/maps" },
    { title: t.menu.blog, image: "/assets/genel/tinaztepe.webp", route: "/blog" },
  ];

  const videos = addSlugs(wayleroLiveVideos);

  return (
    <main className="bg-gray-50/50 flex justify-center max-w-[1600px] mx-auto gap-4 w-full font-sans selection:bg-blue-100 selection:text-blue-900">

      <aside className="hidden xl:block sticky top-10 h-fit">
        <AdSlot slot="6195494093" />
      </aside>

      <div className="flex-1 max-w-6xl bg-white shadow-sm px-4 md:px-8 py-8">

        {/* 🚀 HIZLI MENÜ - YENİ TASARIM */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-12">
          {quickMenu.map((item, index) => (
            <div key={item.title} className="group block cursor-pointer">
              <Link href={item.url || getLocalizedLink(item.route!)} target={item.url ? "_blank" : "_self"}>
                <div className="aspect-square sm:aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-100 mb-3 shadow-sm group-hover:shadow-xl transition-all duration-500 relative">
                <Image 
  src={item.image} 
  alt={item.title} 
  fill 
  priority={index === 0}
  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 25vw"
  className="object-cover group-hover:scale-110 transition-transform duration-700" 
/>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
              </Link>
              <h3 className="font-bold text-center text-gray-900 group-hover:text-blue-600 transition-colors text-sm md:text-base tracking-tight uppercase">
                {item.title}
              </h3>
            </div>
          ))}
        </section>

        <HomeBlogSlider />

        {/* 🎬 VİDEOLAR - YENİ TASARIM */}
        <section className="mt-16 mb-12">
          <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight">
              {t.videoTitle}
            </h2>
            <Link 
              href={getLocalizedLink("/videolar")} 
              className="text-sm font-bold text-blue-600 hover:text-red-600 transition-all flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full"
            >
              {t.seeAll} <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {videos.slice(0, 4).map((video) => (
              <div
                key={video.id}
                onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))}
                className="cursor-pointer group"
              >
                <div className="relative aspect-[9/16] rounded-[2rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500">
                  <Image
  src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
  alt={video.title}
  fill
  sizes="(max-width: 768px) 50vw, 25vw"
  className="object-cover group-hover:scale-110 transition-transform duration-700"
/>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 group-hover:border-red-600 transition-all duration-300">
                      <svg className="w-6 h-6 text-white translate-x-[2px]" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M7 6v12l10-6z" />
                      </svg>
                    </div>
                  </div>
                </div>
                <h3 className="text-sm mt-4 font-bold text-gray-900 line-clamp-2 group-hover:text-red-600 transition-colors px-1">
                  {video.title}
                </h3>
              </div>
            ))}
          </div>
        </section>

        {/* 🏙️ ŞEHİRLER - YENİ TASARIM */}
        <section className="mt-16">
          <h2 className="text-2xl md:text-3xl font-black text-gray-900 tracking-tight mb-8 border-b border-gray-100 pb-4">
            {t.cityTitle}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {featuredCities.map((c) => {
              const localizedName = lang === "en" ? c.name.en : c.name.tr;
              return (
                <Link key={c.slug} href={getLocalizedLink(`/${c.country}/${c.slug}`)} className="group block">
                  <div className="relative h-56 md:h-72 rounded-[2.5rem] overflow-hidden shadow-sm group-hover:shadow-2xl transition-all duration-500 bg-gray-100">
                   <Image
  src={c.image}
  alt={localizedName}
  fill
  sizes="(max-width: 768px) 50vw, 33vw"
  className="object-cover group-hover:scale-110 transition-transform duration-700"
/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-6 w-full transform group-hover:-translate-y-1 transition-transform duration-300">
                      <h3 className="text-white text-xl md:text-2xl font-black tracking-tight">
                        {localizedName}
                      </h3>
                      <p className="text-blue-300 font-extrabold text-[10px] uppercase tracking-widest mt-1">
                        {c.country.replace(/-/g, " ")}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      <aside className="hidden xl:block sticky top-10 h-fit">
        <AdSlot slot="5241070307" />
      </aside>

    </main>
  );
}