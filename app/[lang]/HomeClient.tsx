"use client";

import TourCard from "@/components/TourCard";
import Link from "next/link";
import HomeBlogSlider from "./components/HomeBlogSlider";
import HomeSearch from './HomeSearch';
import { useRouter } from "next/navigation"; // App Router için doğrusu budur.
import { Suspense } from "react"; // 1. Import et
import HotelCard from "@/components/HotelCard";


const trackClick = (type: string, label: string, destination?: string) => {
  window.gtag?.("event", "click", {
    click_type: type,
    label: label,
    destination: destination || "",
  });
};

// 🟢 TypeScript hatasını bitiren Interface
interface HomeClientProps {
  lang: string; // Page.tsx'ten gelen
  events: any[];
  featuredTours: any[];
  videos: any[];
  featuredCities: any[];
}

export default function HomeClient({
  lang: serverLang, // Page.tsx'ten gelen dili yakaladık
  events,
  featuredTours,
  videos,
  featuredCities
}: HomeClientProps) {

 const lang = serverLang || "tr";
  const router = useRouter();

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

  const slugify = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD") // 🔥 kritik
    .replace(/[\u0300-\u036f]/g, "") // 🔥 combining karakterleri sil
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/\s+/g, "-");

    
  // 🌍 Genişletilmiş Sözlük
  const t = {
    tr: {
      cityTitle: "Dünyanın En Çok Ziyaret Edilen Şehirleri",
      videoTitle: "Videolar",
      seeAll: "Tümünü Gör",
      quickSearch: "Hızlı Arama",
      popularCities: "POPÜLER ŞEHİRLER",
      searchHint: "Şehir, etkinlik veya mekan aratarak keşfe başla.",
      tourTitle: "Popüler Turlar & Deneyimler",
      eventTitle: "Konserler & Etkinlikler",
      ticketBtn: "Bilet Al",
      blogTitle: "Blog Yazıları",
      nextStop: "Bir Sonraki Durağın",
      where: "Neresi Olsun?",
      exploreDesc: "Rotanı çizmek, gezilecek yerleri görmek ve unutulmaz bir deneyim planlamak için gitmek istediğin ülkeyi seç.",
      exploreBtn: "Ülkeleri Keşfet",
      stats: { country: "Ülke", city: "Şehir", spot: "Gezi noktası" },
      mobileAppTag: "WAYLERO APP",
    mobileAppTitle1: "Maceranı paylaş,",
    mobileAppTitle2: "birlikte keşfet",
    mobileAppDesc: "Kendi rotanı oluştur, seyahat anılarını paylaş ve yeni yol arkadaşlarıyla tanış. Waylero ile gezmek artık daha sosyal!",
    mobileFeatures: [
      "Kişiselleştirilmiş rotalar",
      "Anlık fotoğraf paylaşımı",
      "Gezginlerle tanışma",
      "Mesajlaşma"
    ],
    indir: "HEMEN İNDİR",
    ekle: "+ Ekle",
    hazirMi: "Kanka Kapadokya rotasını güncelledim, herkes hazır mı? ✈️"
    },
    en: {
      cityTitle: "World's Most Visited Cities",
      videoTitle: "Videos",
      seeAll: "See All",
      quickSearch: "Quick Search",
      popularCities: "POPULAR CITIES",
      searchHint: "Start exploring by searching for cities, events, or venues.",
      tourTitle: "Popular Tours & Experiences",
      eventTitle: "Concerts & Events",
      ticketBtn: "Get Ticket",
      blogTitle: "Blog Posts",
      nextStop: "Your Next Stop",
      where: "Where Should It Be?",
      exploreDesc: "Select the country you want to visit to start mapping your route, explore top attractions, and plan an unforgettable experience.",
      exploreBtn: "Explore Countries",
      stats: { country: "Countries", city: "Cities", spot: "Tour spots" },
      mobileAppTag: "WAYLERO SOCIAL",
    mobileAppTitle1: "Share your adventure,",
    mobileAppTitle2: "explore together",
    mobileAppDesc: "Create your own route, share your travel memories and meet new travel companions. Traveling with Waylero is now more social!",
    mobileFeatures: [
      "Personalized routes",
      "Instant photo sharing",
      "Meet fellow travelers",
      "Group messaging"
    ],
    indir: "DOWNLOAD NOW",
    ekle: "+ Add",
    hazirMi: "I updated the Cappadocia route, is everyone ready? ✈️"
    }
  }[lang as "tr" | "en"] || { /* fallback */ };

  
  return (
    <main className="min-h-screen w-full bg-white overflow-x-hidden">

     {/* ✅ YENİ ÜST ALAN */}
    <section className="w-full py-10 bg-[#fdfaf7]">
  <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 flex flex-col items-center">
    
    {/* 🔍 ŞEFFAF VE SADE ARAMA ALANI */}
    <div className="w-full max-w-2xl">
      <div className="relative bg-transparent border-b-2 border-gray-200 focus-within:border-sky-500 transition-all duration-300">
        <HomeSearch forcedLang={lang} />
      </div>
    </div>

    {/* 📍 RENKLİ VE CANLI BUTONLAR */}
    <div className="mt-10 flex flex-wrap justify-center gap-4">
      {/* Şehirler - Modern & Soft Mavi Tonları */}
      {[
        { name: { tr: "İstanbul", en: "Istanbul" }, path: "/kesfet/turkiye/istanbul", icon: "🕌" },
        { name: { tr: "Viyana", en: "Vienna" }, path: "/kesfet/avusturya/viyana", icon: "🏰" },
        { name: { tr: "Paris", en: "Paris" }, path: "/kesfet/fransa/paris", icon: "🗼" },
        { name: { tr: "Roma", en: "Rome" }, path: "/kesfet/italya/roma", icon: "🏛️" },
      ].map((city) => (
        <Link 
          key={city.path} 
          href={`/${lang}${city.path}`}
          className="flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-sky-50 text-sky-700 rounded-full text-sm font-bold transition-all border border-sky-100 shadow-sm hover:shadow-sky-200/50 hover:-translate-y-1 active:scale-95"
        >
          <span>{city.icon}</span>
          {lang === "en" ? city.name.en : city.name.tr}
        </Link>
      ))}

      {/* Kategoriler - Enerjik & Renkli Tonlar */}
{[
  { name: { tr: "Konserler", en: "Concerts" }, path: "/aktiviteler?type=concert", icon: "🎸", color: "bg-purple-50 text-purple-700 border-purple-100 hover:bg-purple-600 hover:text-white" },
  { name: { tr: "Tiyatro", en: "Theater" }, path: "/aktiviteler?type=theater", icon: "🎭", color: "bg-rose-50 text-rose-700 border-rose-100 hover:bg-rose-600 hover:text-white" },
  { name: { tr: "Turlar", en: "Tours" }, path: "/etkinlikler", icon: "🌍", color: "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-600 hover:text-white" },
  { name: { tr: "Oteller", en: "Hotels" }, path: "/hotels", icon: "🏨", color: "bg-cyan-50 text-cyan-700 border-cyan-100 hover:bg-cyan-600 hover:text-white" },
].map((cat) => (
  <Link 
    key={cat.path} 
    href={getLocalizedLink(cat.path)} 
    className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-black transition-all border shadow-sm hover:shadow-lg hover:-translate-y-1 active:scale-95 ${cat.color}`}
  >
    <span>{cat.icon}</span>
    {lang === "tr" ? cat.name.tr : cat.name.en}
  </Link>
))}
    </div>

  </div>
</section>

  {/* 📍 2 */}

<section className="w-full py-10 bg-[linear-gradient(110deg,#fdfaf7_60%,#fff5ed_40%)]">
  <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">
    
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      
    {/* 🔍 KEŞFET (Yenilenmiş & Bağlanmış) */}
<div 
  onClick={() => document.getElementById('kesfet-section')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
>
  <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl bg-sky-50 group-hover:rotate-12 transition-transform">
    🌍
  </div>
  <div>
    <h3 className="text-base font-bold text-gray-900 leading-tight">
      {lang === "tr" ? "Maceraya Başla" : "Start Adventure"}
    </h3>
    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-tight">
      {lang === "tr" 
        ? "Sıradaki durak neresi? Sana özel rotaları keşfet." 
        : "Where is the next stop? Discover routes just for you."}
    </p>
  </div>
</div>

     {/* 📍 PLANLA (Trip Planner Sayfasına Yönlendirir) */}
<Link 
  href={getLocalizedLink("/trip-planner")}
  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
>
  <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl bg-orange-50 group-hover:scale-110 transition-transform">
    📍
  </div>
  <div>
    <h3 className="text-base font-bold text-gray-900 leading-tight">
      {lang === "tr" ? "Yolculuk Planla" : "Plan a Trip"}
    </h3>
    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-tight">
      {lang === "tr" 
        ? "Yapay zeka destekli akıllı rota oluşturucu." 
        : "AI-powered smart route planner."}
    </p>
  </div>
</Link>

      {/* ✅ İLHAM AL (GEZİ BLOĞU - TIKLANABİLİR) */}
      <div 
        onClick={() => document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' })}
        className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
      >
        <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl bg-amber-50 group-hover:scale-110 transition-transform">📖</div>
        <div>
          <h3 className="text-base font-bold text-gray-900 leading-tight">
            {lang === "tr" ? "İlham Al" : "Get Inspired"}
          </h3>
          <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-tight">
            {lang === "tr" ? "Gezi Bloğu: Deneyimler, rotalar ve ipuçları..." : "Travel Blog: Experiences, routes, and tips..."}
          </p>
        </div>
      </div>

      {/* 🎥 GEZİ VİDEOLARI (Eski Paylaş Kartı) */}
<div 
  onClick={() => document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' })}
  className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 border border-white shadow-sm hover:shadow-md transition-all flex items-center gap-4 cursor-pointer group"
>
  <div className="w-12 h-12 shrink-0 rounded-2xl flex items-center justify-center text-xl bg-green-50 group-hover:scale-110 transition-transform">
    🎬
  </div>
  <div>
    <h3 className="text-base font-bold text-gray-900 leading-tight">
      {lang === "tr" ? "Gezi Videoları" : "Travel Videos"}
    </h3>
    <p className="text-gray-500 text-[10px] sm:text-xs mt-0.5 leading-tight">
      {lang === "tr" 
        ? "Gezginlerin objektifinden dünyanın dört bir yanı." 
        : "The world through the lens of travelers."}
    </p>
  </div>
</div>

    </div>
  </div>
</section>
 {/* 📍 3 */}

<section className="relative min-h-[700px] flex items-center pt-10 pb-20 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)] overflow-hidden">
  <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
    
    {/* 🔵 SOL TARAF */}
    <div className="max-w-2xl space-y-6">
      <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
        {lang === "tr" ? (
          <>
            Hayalini <br /> kurduğun <br /> yerler artık <br />
            <span className="text-sky-500 font-medium">sadece bir plan değil</span>
          </>
        ) : (
          <>
            The places <br /> you dream of <br /> are no longer <br />
            <span className="text-sky-500 font-medium">just a plan</span>
          </>
        )}
      </h1>

     <p className="text-lg text-orange-600 leading-relaxed font-medium">
  {lang === "tr"
    ? "40’tan fazla ülkenin sokaklarına düş, 300+ şehrin ritmini hisset, 2000’den fazla noktada kaybol… konserlerin kalabalığında, tiyatroların sessizliğinde, turların heyecanında hayatı yeniden keşfet."
    : "Step into 40+ countries, feel the rhythm of 300+ cities, get lost in 2000+ places… rediscover life in the crowd of concerts, the silence of theaters, and the thrill of guided journeys."
  }
</p>

      <div className="flex flex-wrap gap-4 pt-2">
        <Link href={getLocalizedLink("/trip-planner")}>
          <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 text-lg">
            {lang === "tr" ? "Gezi Planı Oluştur" : "Create Trip Plan"}
          </button>
        </Link>
      </div>
    </div>

   {/* 🔵 SAĞ TARAF */}
<div className="flex flex-col gap-4">
  
  <div className="text-right w-full pr-2">
    <h3 className="text-xl font-bold text-gray-800 tracking-tight uppercase">
      {t.popularCities}
    </h3>
    <div className="w-12 h-1 bg-sky-500 mt-1 rounded-full ml-auto"></div>
  </div>

  <div className="grid grid-cols-1 gap-6">

    {/* 🔥 ÜST SLIDER */}
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="flex scroll-left pause-slider gap-6 py-4">
        {[...featuredCities.slice(0, 8), ...featuredCities.slice(0, 8)].map((c, i) => {
          
          const countrySlug = slugify(c.country);
          const citySlug = c.slug;
          const getCityUrl = (country: string, city: string) =>
           `/${lang}/${country}/${city}`;
          return (
            <Link key={i} href={getCityUrl(countrySlug, citySlug)}>
              <div className="w-[180px] flex-shrink-0 cursor-pointer">
                <div className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={c.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={c.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg leading-tight">{c.name}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
                      {c.country.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>

    {/* 🔥 ALT SLIDER */}
    <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
      <div className="flex scroll-right pause-slider gap-6 py-4">
        {[...featuredCities.slice(8, 15), ...featuredCities.slice(8, 15)].map((c, i) => {
          
          const countrySlug = slugify(c.country);
          const citySlug = c.slug;
         const getCityUrl = (country: string, city: string) =>
           `/${lang}/${country}/${city}`;
          return (
            <Link key={i} href={getCityUrl(countrySlug, citySlug)}>
              <div className="w-[180px] flex-shrink-0 cursor-pointer">
                <div className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg group">
                  <img
                    src={c.image}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    alt={c.name}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg leading-tight">{c.name}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
                      {c.country.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>

  </div>
</div>
    
  </div>
</section>

{/* 4SECTION: GENİŞ VE FERAH YAPILANDIRMA */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">

  {/* Başlık ve Buton */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">
    <div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
        {t.tourTitle}
      </h2>
      <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-2xl">
        {lang === "tr"
          ? "Şehrin en sevilen rotalarını ve popüler etkinliklerini uzman rehberliğiyle keşfedin."
          : "Explore the city's favorite routes and popular events with expert guidance."}
      </p>
    </div>

    <Link
      href={lang === "tr" ? "/etkinlikler" : "/en/etkinlikler"}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-orange-500/20"
    >
      {t.seeAll}
      <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Grid - Yüksekliği Artırılmış Kartlar */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-stretch">
    {[
      { 
        city: "İstanbul", 
        link: "https://getyourguide.tp.st/nTBcXECr", 
        imageUrl: "/assets/sehir/istanbul.webp", 
        title: lang === "tr" ? "İstanbul Turlarını İncele" : "Explore Istanbul Tours" 
      },
      { 
        city: "Nevşehir", 
        link: "https://getyourguide.tp.st/jf5oS4u4", 
        imageUrl: "/assets/sehir/nevsehir.webp", 
        title: lang === "tr" ? "Kapadokya Turlarını İncele" : "Explore Cappadocia Tours" 
      },
      { 
        city: "Antalya", 
        link: "https://getyourguide.tp.st/hwXRhIEO", 
        imageUrl: "/assets/sehir/antalya.webp", 
        title: lang === "tr" ? "Antalya Turlarını İncele" : "Explore Antalya Tours" 
      },
      { 
        city: "İzmir", 
        link: "https://getyourguide.tp.st/Zcv1aMld", 
        imageUrl: "/assets/sehir/izmir.webp", 
        title: lang === "tr" ? "İzmir Turlarını İncele" : "Explore Izmir Tours" 
      }
    ].map((tour, i) => (
      <div key={i} className="h-full">
        {/* min-h-[420px] yaparak kartı biraz daha uzattım kanka */}
        <div className="group relative flex flex-col bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden h-full min-h-[420px] hover:shadow-2xl transition-all duration-500 hover:border-blue-500">
          
          {/* IMAGE */}
          <a
            href={tour.link}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="relative w-full h-64 bg-gray-200 overflow-hidden block"
          >
            <img
              src={tour.imageUrl}
              alt={tour.city}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
          </a>

          {/* CONTENT */}
          <div className="p-7 flex flex-col flex-grow">
            <div className="text-blue-600 text-xs font-bold uppercase tracking-wider mb-3">
              {tour.city}
            </div>

            <h3 className="text-xl font-bold text-gray-900 leading-tight mb-6 group-hover:text-blue-600 transition-colors">
              <a href={tour.link} target="_blank" rel="nofollow noopener noreferrer">
                {tour.title}
              </a>
            </h3>

            {/* CTA */}
            <div className="mt-auto">
              <a
                href={tour.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="block w-full py-4 bg-blue-600 hover:bg-orange-500 text-white text-center text-sm font-bold rounded-2xl transition-all duration-300 shadow-md active:scale-95"
              >
                {lang === "tr" ? "İncele ve Rezervasyon Yap" : "View and Book Now"}
              </a>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>

{/* HOTEL SECTION */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">

  {/* Başlık */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">
    <div>
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
        {lang === "tr"
          ? "Hayalindeki Konaklamayı Bul"
          : "Find Your Perfect Stay"}
      </h2>

      <p className="mt-3 text-gray-500 text-sm sm:text-base max-w-2xl">
        {lang === "tr"
          ? "Dünyanın en popüler şehirlerinde en iyi otelleri keşfet."
          : "Discover top-rated hotels in the world’s most popular cities."}
      </p>
    </div>

    <Link
      href={getLocalizedLink("/hotels")}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105"
    >
      {lang === "tr" ? "Tümünü Gör" : "See All"}
      <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Kartlar */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-stretch">

    <div className="h-full">
  <HotelCard
    city="istanbul"
    link="https://booking.tp.st/ZtWXbtwj"
    lang={lang as "tr" | "en"}
  />
</div>

<div className="h-full">
  <HotelCard
    city="antalya"
    link="https://booking.tp.st/3YML2Z43"
    lang={lang as "tr" | "en"}
  />
</div>

<div className="h-full">
  <HotelCard
    city="paris"
    link="https://booking.tp.st/vs4oDzlc"
    lang={lang as "tr" | "en"}
  />
</div>

<div className="h-full">
  <HotelCard
    city="roma"
    link="https://booking.tp.st/JoXA9ovm"
    lang={lang as "tr" | "en"}
  />
</div>

  </div>
</section>


     {/* 5. SECTION: konserler */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 lg:px-16">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 border-b border-gray-100 pb-10">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
  {t.eventTitle}
</h2>
    <Link 
      href={getLocalizedLink("/aktiviteler")} 
      className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all text-center"
    >
      {t.seeAll} <span className="text-xl">→</span>
    </Link>
  </div>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
    {events.length > 0 ? (
      events.map((event) => {
        // 🔥 Tarih Formatı İçin URL Kontrolü
        const activeLang = lang;
        const eventDate = new Date(event.start).toLocaleDateString(
          activeLang === "tr" ? "tr-TR" : "en-US",
          { day: 'numeric', month: 'long', year: 'numeric' }
        );

        return (
          <div key={event.id} className="h-full bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col group">
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <img 
                src={event.poster_url || event.afis || "/assets/genel/no-image.webp"} 
                loading="lazy" 
                alt={event.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
            </div>
            
            <div className="p-5 flex flex-col flex-1">
              <h3 className="font-bold text-gray-900 line-clamp-2 min-h-[3rem]">
                {event.name}
              </h3>
              
              <div className="flex flex-col gap-1 mt-3">
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  📍 {event.venue?.name || (activeLang === "en" ? "Venue" : "Mekan")}
                </p>
                <p className="text-xs font-bold text-blue-600">
                  📅 {eventDate}
                </p>
              </div>

              <div className="mt-auto pt-5">
                <a 
                  href={event.ticket_url || event.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block w-full text-center bg-orange-500 text-white text-xs font-bold py-3.5 rounded-xl hover:bg-orange-600 transition-colors shadow-lg shadow-orange-500/20"
                >
                  {t.ticketBtn} →
                </a>
              </div>
            </div>
          </div>
        );
      })
    ) : (
      // Veri yüklenirken veya boşken skeleton/loading
      Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[350px] bg-gray-50 animate-pulse rounded-2xl border border-gray-100" />
      ))
    )}
  </div>
</section>
      {/* 6. SECTION: KEŞFET CTA - ID Eklendi */}
<section 
  id="kesfet-section" 
  className="w-full max-w-[1800px] mx-auto px-8 md:px-16 my-24 scroll-mt-24"
>
  <div className="rounded-[3rem] bg-gradient-to-br from-blue-50 via-white to-orange-50/30 border border-gray-100 p-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
    
    <div className="max-w-2xl text-center md:text-left">
      <h2 className="text-4xl md:text-7xl font-black text-gray-900 tracking-tight font-serif mb-6 leading-[1.1]">
        {t.nextStop} <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500 underline decoration-blue-200 decoration-8 underline-offset-8">
          {t.where}
        </span>
      </h2>
      <p className="text-xl text-gray-600 mb-12 max-w-lg leading-relaxed">
        {t.exploreDesc}
      </p>

      {/* 🔥 İŞTE O BOMBA BUTON */}
      <Link 
  href={getLocalizedLink("/kesfet")} 
  className="group relative inline-flex items-center gap-4 bg-orange-500 text-white px-12 py-7 rounded-2xl font-black text-xl overflow-hidden transition-all duration-500 hover:bg-orange-600 hover:shadow-[0_20px_50px_rgba(235,140,37,0.5)] active:scale-95 border-2 border-orange-400/50"
>
  {/* ✈️ MAVİ UÇAK VE ROTA ANİMASYONU */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <svg className="w-full h-full opacity-60" viewBox="0 0 300 100" fill="none">
      <path 
        id="flightPath"
        d="M-20,70 Q50,20 150,50 T320,30" 
        stroke="#3b82f6" 
        strokeWidth="3" 
        strokeDasharray="8 6"
      />
      <text className="text-3xl fill-blue-500 filter drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
        <textPath href="#flightPath" startOffset="0%">
          ✈️
          <animate 
            attributeName="startOffset" 
            from="-15%" 
            to="115%" 
            dur="2.5s" 
            repeatCount="indefinite" 
          />
        </textPath>
      </text>
    </svg>
  </div>

  {/* Shimmer Efekti */}
  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:animate-[shimmer_2s_infinite]" />
  
  {/* YAZI VE OK YAN YANA */}
  <div className="relative z-10 flex items-center gap-3">
    <span className="tracking-tight drop-shadow-md">{t.exploreBtn}</span>
    
    {/* Dairesiz, Serbest Ok Animasyonu */}
    <span className="text-2xl transition-all duration-300 group-hover:translate-x-2 group-hover:scale-110">
      →
    </span>
  </div>

  {/* Sadece küçük bir hedef ışığı (Pin yerine) */}
  <div className="absolute right-6 top-1/2 -translate-y-1/2">
    <span className="w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-40"></span>
  </div>
</Link>
    </div>

    {/* SAĞ TARAF: GÖRSEL ALAN */}
    <div className="hidden md:block relative">
      {/* Arkadaki dekoratif halkalar */}
      <div className="absolute -inset-4 border-2 border-dashed border-blue-100 rounded-full animate-[spin_20s_linear_infinite]" />
      
      <div className="relative w-80 h-80 bg-white border border-gray-100 rounded-[3rem] flex flex-col items-center justify-center shadow-2xl rotate-3 transition-transform hover:rotate-0 duration-500 group">
        <span className="text-9xl mb-2 group-hover:scale-110 transition-transform duration-500">✈️</span>
        <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase">
          Ready for Takeoff
        </div>
      </div>
    </div>

  </div>
</section>

 {/* Mobil Uygulama Reklam Alanı */}
<section className="w-full max-w-[1800px] mx-auto px-4 lg:px-16 my-20">
  <div className="bg-[#1a364d] rounded-[3rem] overflow-hidden relative min-h-[600px] flex flex-col lg:flex-row items-center p-8 lg:p-20 shadow-2xl">
    
    {/* Arka Plan Dekoratif Elementler */}
    <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-600/20 to-transparent pointer-events-none" />
    <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
    <div className="absolute top-10 right-10 opacity-20 pointer-events-none">
       <div className="grid grid-cols-6 gap-2">
         {[...Array(24)].map((_, i) => (
           <div key={i} className="w-1.5 h-1.5 bg-orange-500 rounded-full" />
         ))}
       </div>
    </div>

    {/* Sol İçerik Alanı */}
    <div className="w-full lg:w-1/2 z-10 space-y-8">
      <div className="inline-flex items-center gap-2 bg-orange-500/20 text-orange-400 px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] border border-orange-500/30">
        <span className="w-2 h-2 bg-orange-500 rounded-full animate-ping" />
        {t.mobileAppTag}
      </div>
      
      <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] font-serif italic">
        {t.mobileAppTitle1} <br />
        <span className="text-orange-500 drop-shadow-sm">{t.mobileAppTitle2}</span>
      </h2>
      
      <p className="text-gray-300 text-xl max-w-md leading-relaxed">
        {t.mobileAppDesc}
      </p>

      {/* Özellik Listesi */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-white">
        {t.mobileFeatures?.map((item: string, idx: number) => (
          <li key={idx} className="flex items-center gap-3 group">
            <div className="bg-orange-500 rounded-lg p-1.5 group-hover:scale-110 transition-transform">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <span className="font-bold text-sm tracking-wide">{item}</span>
          </li>
        ))}
      </ul>

      {/* Mağaza Butonları */}
      <div className="flex flex-col items-start pt-4">
        <span className="font-bold text-white tracking-wider mb-3 whitespace-nowrap">
          {t.indir}
        </span>

        <div className="flex flex-wrap gap-4 items-center h-12">
          <a
            href="https://play.google.com/store/apps/details?id=app.waylero.mobile"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity flex items-center bg-black/20 p-2 rounded-xl border border-white/5"
          >
            <img
              src="/assets/logo/google-play.webp"
              width={140}
              height={42}
              alt="Google Play"
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          </a>

          <div className="flex items-center opacity-40 grayscale bg-black/10 p-2 rounded-xl border border-white/5">
            <img
              src="/assets/logo/app-store.webp"
              width={140}
              height={42}
              alt="App Store"
              className="h-8 w-auto object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </div>

    {/* Sağ Telefon Mockup Alanı */}
    <div className="w-full lg:w-1/2 mt-16 lg:mt-0 flex justify-center relative scale-110">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border-[2px] border-orange-500/30 animate-[spin_10s_linear_infinite]" />
      
      <div className="relative z-10 w-[280px] h-[590px] bg-[#fdfbf7] rounded-[3.5rem] border-[10px] border-slate-900 shadow-[0_0_50px_rgba(0,0,0,0.5)] p-4 overflow-hidden">
        <div className="flex flex-col gap-4 h-full">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <span className="font-serif font-black text-[#1a364d] text-2xl tracking-tighter">Waylero</span>
              <div className="relative">
                <span className="text-xl">🔔</span>
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 rounded-full border-2 border-white text-[8px] flex items-center justify-center text-white font-bold">3</span>
              </div>
            </div>
            
            {/* Profil Kartları */}
            {[
              { name: "Mert Yılmaz", status: lang === "tr" ? "İstanbul • Yeni Rota" : "Istanbul • New Route", seed: "Mert" },
              { name: "Ayşe Demir", status: lang === "tr" ? "Antalya • Fotoğraf" : "Antalya • Photo", seed: "Ayse" },
              { name: "Can Özcan", status: lang === "tr" ? "Ankara • Katıldı" : "Ankara • Joined", seed: "Can" }
            ].map((p, i) => (
              <div key={i} className={`bg-white p-3 rounded-2xl shadow-sm border border-gray-50/50 flex flex-col gap-2 ${i > 0 ? 'opacity-90 scale-95' : 'scale-100'}`}>
                <div className="flex items-center gap-3">
                  <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.seed}`} alt={p.name} className="w-10 h-10 rounded-xl bg-orange-50" />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-black text-slate-800">{p.name}</p>
                      <button className="text-[9px] bg-slate-100 px-2 py-1 rounded-md font-bold text-slate-500">{t.ekle}</button>
                    </div>
                    <p className="text-[9px] text-gray-400 font-medium">{p.status}</p>
                  </div>
                </div>
                {i === 0 && (
                   <div className="w-full h-28 bg-gray-100 rounded-xl overflow-hidden relative">
                      <img src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="travel" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <div className="absolute bottom-2 left-2 text-white text-[10px] font-bold">📍 {lang === "tr" ? "Karadeniz" : "Black Sea"}</div>
                   </div>
                )}
              </div>
            ))}

            <div className="mt-auto bg-slate-800 text-white p-3 rounded-2xl rounded-br-none text-[10px] leading-relaxed shadow-lg">
               {t.hazirMi}
            </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* 7. SECTION: BLOG */}
<section 
  id="blog-section" 
  className="w-full max-w-[1800px] mx-auto px-4 lg:px-16 my-20 scroll-mt-24"
>
  <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-10">
    {/* Başlık Mavi Gradyan Yapıldı */}
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
      {t.blogTitle}
    </h2>
    <Link href={getLocalizedLink("/blog")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-colors">
      {t.seeAll} →
    </Link>
  </div>
  <HomeBlogSlider />
</section>


       {/* 7. SECTION: VİDEOLAR - ID ve Scroll Margin Eklendi */}
<section 
  id="video-section" 
  className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 lg:px-16 scroll-mt-24"
>
  <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-10">
    <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-serif text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-blue-600">
  {t.videoTitle}
</h2>
    <Link href={getLocalizedLink("/videolar")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold">
      {t.seeAll} →
    </Link>
  </div>
  
  <div className="flex gap-7 overflow-x-auto pb-6 snap-x scrollbar-hide">
    {(videos ?? []).slice(0, 4).map((video) => (
      <div 
        key={video.id} 
        onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))} 
        className="flex-shrink-0 w-[220px] md:w-[320px] snap-start cursor-pointer group"
      >
        <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all">
          <img 
            src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} 
            alt={video.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-all">
              <svg className="w-5 h-5 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M7 6v12l10-6z" />
              </svg>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 p-5">
            <h3 className="text-white text-sm font-bold line-clamp-2">{video.title}</h3>
            <p className="text-orange-300 text-[10px] font-semibold uppercase tracking-widest mt-1">VIDEO</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</section>
    </main>
  );
}