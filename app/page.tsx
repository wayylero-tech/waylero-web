"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import HomeBlogSlider from "./components/HomeBlogSlider";
import { useLang } from "./context/LanguageContext";
import { wayleroLiveVideos } from "@/videos";
import YouTube, { YouTubeProps } from "react-youtube";

/* 🔹 ÖNE ÇIKAN ŞEHİRLER */
const featuredCities = [
  { name: { tr: "İstanbul", en: "Istanbul" }, slug: "istanbul", country: "turkiye", image: "/assets/cities/istanbul.png" },
  { name: { tr: "Viyana", en: "Vienna" }, slug: "viyana", country: "avusturya", image: "/assets/cities/viyana.png" },
  { name: { tr: "Dubai", en: "Dubai" }, slug: "dubai", country: "bae", image: "/assets/cities/dubai.png" },
  { name: { tr: "New York", en: "New York" }, slug: "newyork", country: "amerika", image: "/assets/cities/new.png" },
  { name: { tr: "Pekin", en: "Beijing" }, slug: "pekin", country: "cin", image: "/assets/cities/pekin.png" },
  { name: { tr: "Paris", en: "Paris" }, slug: "paris", country: "fransa", image: "/assets/cities/paris.png" },
  { name: { tr: "Londra", en: "London" }, slug: "londra", country: "ingiltere", image: "/assets/cities/londra.png" },
  { name: { tr: "Antalya", en: "Antalya" }, slug: "antalya", country: "turkiye", image: "/assets/cities/antalya.png" },
  { name: { tr: "Tokyo", en: "Tokyo" }, slug: "tokyo", country: "japonya", image: "/assets/cities/tokyo.png" },
  { name: { tr: "Hong Kong", en: "Hong Kong" }, slug: "hongkong", country: "cin", image: "/assets/cities/hongkong.png" },
  { name: { tr: "Bangkok", en: "Bangkok" }, slug: "bangkok", country: "tayland", image: "/assets/cities/bangkok.png" },
  { name: { tr: "Singapur", en: "Singapore" }, slug: "singapur", country: "singapur", image: "/assets/cities/singapur.png" },
  { name: { tr: "Barselona", en: "Barcelona" }, slug: "barselona", country: "ispanya", image: "/assets/cities/barcelona.png" },
  { name: { tr: "Roma", en: "Rome" }, slug: "roma", country: "italya", image: "/assets/cities/roma.png" },
  { name: { tr: "Mekke", en: "Mecca" }, slug: "mekke", country: "suudi-arabistan", image: "/assets/cities/mekke.png" },
];

function AdSlot({ slot }: { slot: string }) {
  return (
    <div className="relative w-[160px] h-[600px] overflow-hidden rounded-xl">
      <ins
        className="adsbygoogle block w-full h-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4779947503854024"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="false"
      />
    </div>
  );
}

export default function HomePage() {
  const { lang } = useLang();
  const [mounted, setMounted] = useState(false);
   const [players, setPlayers] = useState<Record<number, any>>({});
  useEffect(() => { setMounted(true); }, []);

  const getLocalizedLink = (path: string) => (lang === "tr" ? path : `/${lang}${path === "/" ? "" : path}`);

  const translations = {
    tr: { cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri", menu: ["Etkinlikler/Konserler", "Keşfet", "Harita", "Seyahat Rehberi ✍️"] },
    en: { cityTitle: "World's Most Visited Cities", menu: ["Activities", "Explore", "Map", "Travel Guide ✍️"] }
  };
  const t = translations[lang as "tr" | "en"] || translations.tr;

  const quickMenu = [
    { title: t.menu[0], image: "/assets/menu/aktiviteler.png", route: "/aktiviteler" },
    { title: t.menu[1], image: "/assets/menu/kesfet.png", route: "/kesfet" },
    { title: t.menu[2], image: "/assets/menu/harita.png", url: "https://www.google.com/maps" },
    { title: t.menu[3], image: "/assets/blog/konya/tinaztepe/cover.png", route: "/blog" },
  ];

  useEffect(() => {
    if (!mounted) return;
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => { if (!ad.getAttribute("data-adsbygoogle-status")) { try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch {} } });
  }, [mounted]);

  if (!mounted) return null;

  // Tek video oynatma için
 const handlePlay = (id: number) => {
  Object.keys(players).forEach(key => {
    const keyNum = parseInt(key);  // key artık number
    if (keyNum !== id) {
      players[keyNum]?.pauseVideo?.();
    }
  });
};

  const opts: YouTubeProps['opts'] = { width: "267", height: "476", playerVars: { autoplay: 0 } };

  return (
    <main className="bg-gray-50/50 flex justify-center max-w-[1600px] mx-auto gap-4 w-full">

      <aside className="hidden xl:block sticky top-10 h-fit"><AdSlot slot="6195494093" /></aside>

      <div className="flex-1 max-w-6xl bg-white shadow-sm px-4 py-6">

        {/* QUICK MENU */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
          {quickMenu.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="h-60 w-full rounded-2xl overflow-hidden block">
                  <div className="h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }}/>
                </a>
              ) : (
                <Link href={getLocalizedLink(item.route!)} className="h-60 w-full rounded-2xl overflow-hidden block">
                  <div className="h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }}/>
                </Link>
              )}
              <span className="mt-2 font-medium">{item.title}</span>
            </div>
          ))}
        </section>

        <HomeBlogSlider />

        {/* 🎥 WAYLERO LIVE - ÖNE ÇIKANLAR */}
        <section className="mt-12 mb-8 px-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
              </span>
              <h2 className="text-xl font-black uppercase tracking-tighter italic text-gray-900">
                {lang === "tr" ? "VİDEOLAR" : "VIDEOS"}
              </h2>
            </div>
            
            <Link href={getLocalizedLink("/videolar")} className="group flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-black transition-all uppercase tracking-widest">
              {lang === "tr" ? "Tümünü Gör" : "See All"} 
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4">
            {wayleroLiveVideos.slice(0, 4).map(video => (
              <div key={video.id} className="flex-shrink-0 flex flex-col gap-3 group">
                <div className="shadow-lg rounded-[20px] overflow-hidden bg-black border border-gray-100 group-hover:shadow-2xl transition-all duration-300">
                  <YouTube
                    videoId={video.youtubeId}
                    opts={opts}
                    onReady={(event) => setPlayers(prev => ({ ...prev, [video.id]: event.target }))}
                    onPlay={() => handlePlay(video.id)}
                  />
                </div>
                <div className="px-2">
                  <p className="text-xs font-black uppercase tracking-tighter text-gray-800 group-hover:text-red-600 transition-colors">
                    {video.title}
                  </p>
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{video.location}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FEATURED CITIES */}
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">{t.cityTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {featuredCities.map((c) => {
              const countrySlug = c.country.toLowerCase().replace(/ /g, "-");
              const localizedCityName = lang === "en" ? c.name.en : c.name.tr;
              return (
                <Link key={c.slug} href={getLocalizedLink(`/${countrySlug}/${c.slug}`)} className="relative h-60 rounded-2xl overflow-hidden block group">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${c.image})` }}/>
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold text-lg">{localizedCityName}</span>
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      <aside className="hidden xl:block sticky top-10 h-fit"><AdSlot slot="5241070307" /></aside>

    </main>
  );
}