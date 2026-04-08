"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeBlogSlider from "./components/HomeBlogSlider";
import { useLang } from "./context/LanguageContext";
import { wayleroLiveVideos, addSlugs } from "@/videos";

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

/* 🔹 REKLAM ALANI BİLEŞENİ */
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
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Hydration hatasını engellemek için mount kontrolü
  useEffect(() => {
    setMounted(true);
  }, []);

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

  const translations = {
    tr: { cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri", menu: ["Etkinlikler", "Keşfet", "Harita", "Seyahat Rehber ✍️"] },
    en: { cityTitle: "World's Most Visited Cities", menu: ["Activities", "Explore", "Map", "Travel Guide ✍️"] }
  };
  const t = translations[lang as "tr" | "en"] || translations.tr;

  const quickMenu = [
    { title: t.menu[0], image: "/assets/menu/aktiviteler.png", route: "/aktiviteler" },
    { title: t.menu[1], image: "/assets/menu/kesfet.png", route: "/kesfet" },
    { title: t.menu[2], image: "/assets/menu/harita.png", url: "https://www.google.com/maps" },
    { title: t.menu[3], image: "/assets/blog/konya/tinaztepe/cover.png", route: "/blog" },
  ];

  // Google Adsense tetikleyici
  useEffect(() => {
    if (!mounted) return;
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      if (!ad.getAttribute("data-adsbygoogle-status")) {
        try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
      }
    });
  }, [mounted]);

  // Sayfa yüklenene kadar boş dön (Next.js Hydration Güvenliği)
  if (!mounted) return null;

  // Videoları slug eklenmiş şekilde hazırla
  const videosWithSlugs = addSlugs(wayleroLiveVideos);

  return (
    <main className="bg-gray-50/50 flex justify-center max-w-[1600px] mx-auto gap-4 w-full">
      
      {/* SOL REKLAM */}
      <aside className="hidden xl:block sticky top-10 h-fit shrink-0"><AdSlot slot="6195494093" /></aside>

      <div className="flex-1 max-w-6xl bg-white shadow-sm px-3 md:px-6 py-6 overflow-hidden">
        
        {/* HIZLI MENÜ */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 md:gap-6 mb-10">
          {quickMenu.map((item) => (
            <div key={item.title} className="flex flex-col items-center">
              {item.url ? (
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="h-40 md:h-60 w-full rounded-2xl overflow-hidden block">
                  <div className="h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }} />
                </a>
              ) : (
                <Link href={getLocalizedLink(item.route!)} className="h-40 md:h-60 w-full rounded-2xl overflow-hidden block">
                  <div className="h-full bg-cover bg-center hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url(${item.image})` }} />
                </Link>
              )}
              <span className="mt-2 text-sm md:text-base font-medium">{item.title}</span>
            </div>
          ))}
        </section>

        <HomeBlogSlider />

       {/* 🎥 VİDEOLAR - YENİ MODAL SİSTEMİ */}
<section className="mt-12 mb-8">
  <div className="flex items-center justify-between mb-6 px-1">
    <div className="flex items-center gap-2">
      <span className="relative flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
      </span>
      <h2 className="text-lg md:text-xl font-black italic text-gray-900 uppercase tracking-tighter">
        {lang === "tr" ? "VİDEOLAR" : "VIDEOS"}
      </h2>
    </div>
    <Link 
    href={getLocalizedLink("/videolar")} 
    className="text-[15px] font-medium text-blue-600 hover:text-blue-800 transition-colors"
  >
    {lang === "tr" ? "Tümünü Gör" : "See All"} →
  </Link>
  </div>

  <div className="flex gap-4 overflow-x-auto no-scrollbar pb-6 -mx-3 px-3 md:mx-0 md:px-0">
    {videosWithSlugs?.slice(0, 4).map(video => (
      <div 
        key={video.id} 
        onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))}
        className="w-[200px] md:w-[calc(25%-12px)] flex-shrink-0 flex flex-col gap-3 group cursor-pointer"
      >
        <div className="relative aspect-[9/16] shadow-lg rounded-[20px] overflow-hidden bg-black border border-gray-100 group-hover:scale-[1.02] transition-transform duration-300">
          <img 
            src={`https://img.youtube.com/vi/${video.youtubeId}/maxresdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/50 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 transition-all">
               <svg className="w-6 h-6 text-white translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                 <path d="M7 6v12l10-6z" />
               </svg>
            </div>
          </div>
        </div>
        <div className="px-1">
          <p className="text-xs md:text-sm font-black uppercase tracking-tighter text-gray-800 line-clamp-1 group-hover:text-red-600 transition-colors">
            {video.title}
          </p>
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">📍 {video.location}</span>
        </div>
      </div>
    ))}
  </div>
</section>

        {/* ÖNE ÇIKAN ŞEHİRLER */}
        <section className="mt-10">
          <h2 className="text-lg md:text-xl font-bold mb-4">{t.cityTitle}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
            {featuredCities.map((c) => {
              const countrySlug = c.country.toLowerCase().replace(/ /g, "-");
              const localizedCityName = lang === "en" ? c.name.en : c.name.tr;
              return (
                <Link key={c.slug} href={getLocalizedLink(`/${countrySlug}/${c.slug}`)} className="relative h-44 md:h-60 rounded-2xl overflow-hidden block group">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url(${c.image})` }} />
                  <div className="absolute inset-0 bg-black/30" />
                  <span className="absolute bottom-3 left-3 md:bottom-4 md:left-4 text-white font-semibold text-sm md:text-lg">{localizedCityName}</span>
                </Link>
              );
            })}
          </div>
        </section>

      </div>

      {/* SAĞ REKLAM */}
      <aside className="hidden xl:block sticky top-10 h-fit shrink-0"><AdSlot slot="5241070307" /></aside>

    </main>
  );
}