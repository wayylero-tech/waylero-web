"use client";

import TourCard from "@/components/TourCard";
import { useLang } from "./context/LanguageContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import HomeBlogSlider from "./components/HomeBlogSlider";
import HomeSearch from './HomeSearch';
import { usePathname } from "next/navigation";


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

  const { lang: clientLang } = useLang();
  // Eğer sunucudan dil gelmezse client context'ine bak, o da yoksa 'tr'
  const lang = serverLang || clientLang || "tr";
  const router = useRouter();

  const getLocalizedLink = (path: string) => {
    if (lang === "tr") return path;
    return `/${lang}${path === "/" ? "" : path}`;
  };

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
      stats: { country: "Ülke", city: "Şehir", spot: "Gezi noktası" }
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
      stats: { country: "Countries", city: "Cities", spot: "Tour spots" }
    }
  }[lang as "tr" | "en"] || { /* fallback */ };

  const pathname = usePathname();

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
          href={getLocalizedLink(city.path)} 
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

      <p className="text-lg text-gray-600 leading-relaxed font-medium">
        {lang === "tr"
          ? "Rotanı oluştur, gerçek deneyimleri keşfet, şehirleri hisset. Seyahati planlamaktan çık, yaşamaya başla. 12.500+ deneyim seni bekliyor."
          : "Create your route, discover real experiences, feel the cities. Stop just planning your travel, start living it. 12,500+ experiences await you."
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
        {/* ÜST SLIDER - [mask-image] eklendi */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex scroll-left pause-slider gap-6 py-4">
            {[...featuredCities.slice(0, 8), ...featuredCities.slice(0, 8)].map((c, i) => (
              <div key={i} className="w-[180px] flex-shrink-0">
                <div className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg group">
                  <img src={c.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={c.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg leading-tight">{c.name}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
                      {c.country.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ALT SLIDER - [mask-image] eklendi */}
        <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
          <div className="flex scroll-right pause-slider gap-6 py-4">
            {[...featuredCities.slice(8, 15), ...featuredCities.slice(8, 15)].map((c, i) => (
              <div key={i} className="w-[180px] flex-shrink-0">
                <div className="relative h-[260px] rounded-2xl overflow-hidden shadow-lg group">
                  <img src={c.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={c.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <p className="font-bold text-lg leading-tight">{c.name}</p>
                    <p className="text-[10px] opacity-70 mt-1 uppercase tracking-widest">
                      {c.country.replace(/-/g, " ")}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    
  </div>
</section>

    {/*4SECTION: GENİŞ VE FERAH YAPILANDIRMA */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16">

  {/* Başlık ve Buton */}
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">

    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
      {t.tourTitle}
    </h2>

    <Link
      href={getLocalizedLink("/etkinlikler")}
      className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-bold hover:bg-orange-600 transition-all duration-300 transform hover:scale-105 will-change-transform"
    >
      {t.seeAll}
      <span className="text-xl">→</span>
    </Link>
  </div>

  {/* Grid */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 sm:gap-7 lg:gap-10 items-stretch">

    {featuredTours?.length > 0 ? (
      featuredTours.map((tour: any) => (
        <div key={tour.id} className="h-full">
          {/* CRITICAL: TourCard'a lang prop'unu geçiyoruz ki içindeki metinler çevrilsin */}
          <TourCard {...tour} lang={lang} />
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

     {/* 5. SECTION: konserler */}
<section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 lg:px-16">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 border-b border-gray-100 pb-10">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">
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
        const activeLang = pathname.startsWith("/en") ? "en" : "tr";
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

 {/* 7. SECTION: BLOG */}
<section 
  id="blog-section" 
  className="w-full max-w-[1800px] mx-auto px-4 lg:px-16 my-20 scroll-mt-24"
>
  <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
    <h2 className="text-2xl md:text-4xl font-black text-gray-900 font-serif">{t.blogTitle}</h2>
    <Link href={getLocalizedLink("/blog")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold">
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
    <h2 className="text-2xl md:text-4xl font-black text-gray-900 font-serif">{t.videoTitle}</h2>
    <Link href={getLocalizedLink("/videolar")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold">
      {t.seeAll} →
    </Link>
  </div>
  
  <div className="flex gap-7 overflow-x-auto pb-6 snap-x scrollbar-hide">
    {(videos ?? []).slice(0, 6).map((video) => (
      <div 
        key={video.id} 
        onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))} 
        className="flex-shrink-0 w-[220px] md:w-[300px] snap-start cursor-pointer group"
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