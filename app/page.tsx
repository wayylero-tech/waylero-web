"use client";

import TourCard from "@/components/TourCard";
import toursData from "@/data/tours.json"; 
import { useLang } from "./context/LanguageContext"; // Hook'u burada tanımlıyoruz
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeBlogSlider from "./components/HomeBlogSlider";
import { wayleroLiveVideos, addSlugs } from "@/videos";
import HomeSearch from './HomeSearch';

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




const trackClick = (type: string, label: string, destination?: string) => {
  window.gtag?.("event", "click", {
    click_type: type,
    label: label,
    destination: destination || "",
  });
};

export default function HomePage() {
  const { lang } = useLang();
  const router = useRouter();
  const targetCities = ["istanbul", "antalya", "izmir", "nevsehir"];

const featuredTours = targetCities
  .map(city => toursData.find(t => t.city?.toLowerCase() === city))
  .filter(Boolean);

  const [events, setEvents] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

    const videos = addSlugs(wayleroLiveVideos);

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

 

useEffect(() => {
  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events?take=4&city_ids=40");
      const data = await res.json();

      if (data?.items) {
        setEvents(data.items);
      }
    } catch (err) {
      console.error("Event fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchEvents();
}, []);


  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">
  {/* 1. SECTION: HERO - pt-10 ile yukarı çekildi */}
  <section className="min-h-[700px] flex items-center pt-10 pb-20 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
  <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
    
    {/* Sol: Metin ve İstatistik */}
    <div className="space-y-6">
      <h1 className="text-6xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
        {lang === "tr" ? (
          <>
            Hayalini <br />
            <span className="text-sky-500 font-medium">kurduğun</span> <br />
            yerler artık <br />
            sadece bir plan değil
          </>
        ) : (
          <>
            The places you’ve <br />
            <span className="text-sky-500 font-medium">dreamed of</span> <br />
            are no longer <br />
            just ideas
          </>
        )}
      </h1>

      {/* Paragraph */}
      <p className="text-lg text-gray-600 max-w-md leading-relaxed">
        {lang === "tr"
          ? "Rotanı oluştur, gerçek deneyimleri keşfet, şehirleri hisset. Seyahati planlamaktan çık, yaşamaya başla. 12.500+ deneyim seni bekliyor."
          : "Build your route, discover real experiences, feel the cities. Stop planning travel — start living it. 12,500+ experiences are waiting for you."
        }
      </p>
      
      <div className="flex flex-wrap gap-4 pt-2">

  <Link href={getLocalizedLink("/trip-planner")}>
    <button className="bg-black text-white px-8 py-4 rounded-2xl font-semibold hover:bg-gray-800 transition-all shadow-lg shadow-black/10">
      {lang === "tr" ? "Gezi Planı Oluştur" : "Create Trip Plan"}
    </button>
  </Link>
</div>
      
      
      {/* İstatistikler */}
<div className="flex gap-12 pt-10 border-t border-gray-200/50">
  <div>
    <p className="text-3xl font-bold text-gray-900">40+</p>
    <p className="text-gray-500 text-sm font-medium">
      {lang === "tr" ? "Ülke" : "Countries"}
    </p>
  </div>

  <div>
    <p className="text-3xl font-bold text-gray-900">300+</p>
    <p className="text-gray-500 text-sm font-medium">
      {lang === "tr" ? "Şehir" : "Cities"}
    </p>
  </div>

  <div>
    <p className="text-3xl font-bold text-gray-900">2000+</p>
    <p className="text-gray-500 text-sm font-medium">
      {lang === "tr" ? "Gezi noktası" : "Tour spots"}
    </p>
  </div>
</div>
    </div>

    {/* Sağ: Hızlı Arama Kartı - HomeSearch ve Hızlı Şehirler Entegreli */}
<div className="relative">
  <div className="absolute -inset-4 bg-white/30 blur-2xl rounded-full -z-10"></div>
  
  <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white max-w-lg w-full ml-auto min-h-[520px] flex flex-col justify-center">
    
    <h2 className="text-3xl font-serif font-bold mb-10 text-gray-900">
      {lang === "tr" ? "Hızlı Arama" : "Quick Search"}
    </h2>
    
    {/* Entegre Edilen Bileşen */}
    <div className="w-full">
      <HomeSearch forcedLang={lang} />
    </div>

    {/* POPÜLER ŞEHİRLER */}
    <div className="mt-8">
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
        {lang === "tr" ? "POPÜLER ŞEHİRLER" : "POPULAR CITIES"}
      </p>
      <div className="flex flex-wrap gap-2">
        {[
          { name: "İstanbul", path: "/kesfet/turkiye/istanbul" },
          { name: "Viyana", path: "/kesfet/avusturya/viyana" },
          { name: "Paris", path: "/kesfet/fransa/paris" },
          { name: "Roma", path: "/kesfet/italya/roma" },
        ].map((city) => (
          <Link 
            key={city.path} 
            href={city.path}
            className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-xs font-medium transition-all border border-gray-100"
          >
            {city.name}
          </Link>
        ))}
      </div>
    </div>

    {/* Opsiyonel: Kart altı boşluk hissini doldurmak için */}
    <p className="text-[11px] text-gray-400 mt-auto pt-8 text-center font-medium">
      {lang === "tr" 
        ? "Şehir, etkinlik veya mekan aratarak keşfe başla." 
        : "Start exploring by searching for cities, events, or venues."}
    </p>
  </div>
</div>

  </div>
</section>

     {/* SECTION: GENİŞ VE FERAH YAPILANDIRMA */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 sm:px-4 sm:px-6 lg:px-16">

  {/* Başlık ve Buton */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
      {lang === "tr" ? "Popüler Turlar & Deneyimler" : "Popular Tours & Experiences"}
    </h2>

    <Link
      href={getLocalizedLink("/etkinlikler")}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 will-change-transform"
    >
      {lang === "tr" ? "Tümünü Gör" : "See All"}
      <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-stretch">

    {/* DİKKAT: Fazla olan '{' işaretlerini kaldırdım */}
    {featuredTours?.length > 0 ? (
      featuredTours.map((tour: any) => (
        <div key={tour.id} className="h-full">
          <TourCard {...tour} />
        </div>
      ))
    ) : (
      Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="h-[320px] sm:h-[380px] lg:h-[420px] bg-gray-100 animate-pulse rounded-2xl"
        />
      ))
    )}

  </div>
</section>

{/* 4. SECTION: KONSERLER CTA */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full bg-transparent">

  <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">

    {/* Başlık ve Buton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
        {lang === "tr" ? "Konserler & Etkinlikler" : "Concerts & Events"}
      </h2>

      <Link
        href={getLocalizedLink("/aktiviteler")}
        className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
      >
        {lang === "tr" ? "Tümünü Gör" : "See All"}
        <span className="text-xl">→</span>
      </Link>
    </div>

    {/* Grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-stretch">

      {loading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[320px] sm:h-[380px] lg:h-[420px] bg-gray-100 animate-pulse rounded-2xl"
          />
        ))
      ) : (
  events.map((event) => (
    <div
      key={event.id}
      className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden 
                 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col" // <--- BURAYA EKLENDİ: flex flex-col
    >
      {/* Image */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={event.poster_url || event.afis || "/assets/genel/no-image.webp"}
          loading="lazy"
          alt={event.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1"> {/* <--- BURADA DEĞİŞTİ: h-full yerine flex-1 */}

        <h3 className="font-bold text-sm sm:text-base text-gray-900 line-clamp-2 leading-snug">
          {event.name}
        </h3>

        <p className="text-xs text-gray-500 mt-2">
          📍 {event.venue?.name || "Mekan"}
        </p>

        <p className="text-xs font-bold text-blue-600 mt-2">
          {new Date(event.start).toLocaleDateString("tr-TR")}
        </p>

        <div className="mt-auto pt-4"> {/* Artık bu düzgün çalışacaktır */}
          <a
            href={event.ticket_url || event.url}
            target="_blank"
            className="block w-full text-center bg-orange-500 text-white text-xs font-bold py-3 rounded-xl 
                       hover:bg-orange-600 transition-colors"
          >
            {lang === "tr" ? "Bilet Al" : "Get Ticket"} →
          </a>
        </div>

      </div>
    </div>
  ))
      )}

    </div>
  </div>
</section>

{/* 4. SECTION: DÜNYAYI KEŞFET CTA */}
<section className="w-full max-w-[1800px] mx-auto px-8 md:px-16 my-24">
  {/* Arka planı beyaz/hafif mavi gradyan yaptık, shadow'u yumuşattık */}
  <div className="relative rounded-[3rem] overflow-hidden bg-gradient-to-br from-blue-50 to-white border border-gray-100 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10">
    
    <div className="relative z-10 max-w-2xl">
      <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-gray-900 tracking-tight font-serif mb-6 leading-snug sm:leading-tight">
        {lang === "tr" ? "Bir Sonraki Durağın" : "Your Next Stop"} <br />
        <span className="text-blue-600">
          {lang === "tr" ? "Neresi Olsun?" : "Where Should It Be?"}
        </span>
      </h2>
      
      <p className="text-lg text-gray-600 mb-10 max-w-lg leading-relaxed">
        {lang === "tr" 
          ? "Rotanı çizmek, gezilecek yerleri görmek ve unutulmaz bir deneyim planlamak için gitmek istediğin ülkeyi seç." 
          : "Select the country you want to visit to start mapping your route, explore top attractions, and plan an unforgettable experience."}
      </p>

      <Link 
        href={getLocalizedLink("/kesfet")} 
        className="inline-flex items-center gap-3 bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-lg hover:bg-black transition-all hover:scale-105 shadow-xl"
      >
        {lang === "tr" ? "Ülkeleri Keşfet" : "Explore Countries"} 
        <span className="text-xl">→</span>
      </Link>
    </div>

    {/* Sağ taraf - Siyah yerine daha soft bir daire */}
    <div className="relative z-10 hidden md:block">
      <div className="w-64 h-64 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-inner">
        <span className="text-8xl">✈️</span>
      </div>
    </div>
  </div>
</section>

{/* BLOG BÖLÜMÜ */}
<section className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-16 my-12 md:my-20">

  {/* Başlık ve Buton */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-8 md:mb-12 border-b border-gray-100 pb-6">

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
      {lang === "tr" ? "Blog Yazıları" : "Blog Posts"}
    </h2>

    <Link
      href={getLocalizedLink("/blog")}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
    >
      {t.seeAll} <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Slider Wrapper */}
  <div className="relative">
    <HomeBlogSlider />
  </div>

</section>


  {/* 🏙️ ŞEHİRLER - YENİ TASARIM */}
       <section className="mt-24 mb-24 w-full max-w-[1800px] mx-auto px-8 md:px-16">
  
  {/* Başlık */}
  <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-10">
    <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
      {t.cityTitle}
    </h2>
  </div>

  {/* Yana Kaydırılabilir (Horizontal Scroll) Container */}
  <div className="flex flex-row overflow-x-auto gap-8 pb-8 snap-x scrollbar-hide">
    {featuredCities.map((c) => {
      const localizedName = lang === "en" ? c.name.en : c.name.tr;
      return (
        <Link
          key={c.slug}
          href={getLocalizedLink(`/${c.country}/${c.slug}`)}
          onClick={() => trackClick("city", localizedName, `${c.country}/${c.slug}`)}
          className="flex-shrink-0 w-[280px] md:w-[400px] snap-start" // Flex-shrink-0 kartların ezilmesini engeller
        >
          <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-500 bg-gray-100">
            <img
              src={c.image}
              alt={localizedName}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8 w-full transform group-hover:-translate-y-1 transition-transform duration-300">
              <h3 className="text-white text-2xl md:text-3xl font-black tracking-tight">
                {localizedName}
              </h3>
              <p className="text-blue-300 font-extrabold text-[11px] uppercase tracking-widest mt-2">
                {c.country.replace(/-/g, " ")}
              </p>
            </div>
          </div>
        </Link>
      );
    })}
  </div>
</section>

{/* 🎬 VİDEOLAR */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-16">

  {/* Başlık ve Buton */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
      {t.videoTitle}
    </h2>

    <Link
      href={getLocalizedLink("/videolar")}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 whitespace-nowrap"
    >
      {t.seeAll} <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Horizontal Scroll */}
  <div className="flex gap-5 sm:gap-7 overflow-x-auto pb-6 snap-x snap-mandatory scrollbar-hide">

    {videos.slice(0, 6).map((video) => (
      <div
        key={video.id}
        onClick={() => {
          trackClick("video", video.title, video.slug);
          router.push(getLocalizedLink(`/videolar/${video.slug}`));
        }}
        className="flex-shrink-0 w-[220px] sm:w-[260px] md:w-[300px] snap-start cursor-pointer group"
      >

        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">

          {/* Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <svg className="w-5 h-5 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 6v12l10-6z" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <div className="absolute bottom-0 left-0 p-4 sm:p-5">
            <h3 className="text-white text-sm sm:text-base font-bold line-clamp-2">
              {video.title}
            </h3>
            <p className="text-orange-300 text-[10px] sm:text-xs font-semibold uppercase tracking-widest mt-1">
              VIDEO
            </p>
          </div>

        </div>
      </div>
    ))}

  </div>
</section>
        
    </main>
  );
}
