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
      {/* 1. SECTION: HERO */}
    
<section className="relative min-h-[700px] flex items-center pt-10 pb-20 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)] overflow-hidden">
  
  {/* ✈️ BUTONDAN SAĞ ÜSTE YÜKSELİŞ ANİMASYONU */}
  <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
    <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="none">
      <path 
        id="takeoffPath"
        d="M150,700 C300,500 600,200 1100,50" 
        fill="none"
      />
      
      {/* 1. Uçak */}
      <text className="text-5xl fill-sky-500/25">
        <textPath href="#takeoffPath" startOffset="-10%">
          ✈️
          <animate 
            attributeName="startOffset" 
            from="-10%" 
            to="110%" 
            dur="12s" 
            repeatCount="indefinite" 
          />
        </textPath>
      </text>

      {/* 2. Uçak (6. saniyede başlar) */}
      <text className="text-5xl fill-sky-500/15">
        <textPath href="#takeoffPath" startOffset="-10%">
          ✈️
          <animate 
            attributeName="startOffset" 
            from="-10%" 
            to="110%" 
            dur="12s" 
            begin="6s" 
            repeatCount="indefinite" 
          />
        </textPath>
      </text>
    </svg>
  </div>

  {/* İÇERİK KATMANI */}
  <div className="relative z-10 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-16 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
    
    {/* SOL TARAF: YENİ METİNLER */}
    <div className="space-y-6">
      <h1 className="text-5xl lg:text-7xl font-serif font-bold text-gray-900 leading-[1.1]">
        {lang === "tr" ? (
          <>
            Hayalini <br />
            kurduğun <br />
            yerler artık <br />
            <span className="text-sky-500 font-medium">sadece bir plan değil</span>
          </>
        ) : (
          <>
            The places <br />
            you dream of <br />
            are no longer <br />
            <span className="text-sky-500 font-medium">just a plan</span>
          </>
        )}
      </h1>
      
      <p className="text-lg text-gray-600 max-w-md leading-relaxed font-medium">
        {lang === "tr"
          ? "Rotanı oluştur, gerçek deneyimleri keşfet, şehirleri hisset. Seyahati planlamaktan çık, yaşamaya başla. 12.500+ deneyim seni bekliyor."
          : "Create your route, discover real experiences, feel the cities. Stop just planning your travel, start living it. 12,500+ experiences await you."
        }
      </p>

      {/* KALKIŞ NOKTASI BUTONU */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Link href={getLocalizedLink("/trip-planner")}>
          <button className="bg-black text-white px-10 py-5 rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-black/20 active:scale-95 text-lg">
            {lang === "tr" ? "Gezi Planı Oluştur" : "Create Trip Plan"}
          </button>
        </Link>
      </div>

      <div className="flex gap-12 pt-10 border-t border-gray-200/50">
        <div><p className="text-3xl font-bold text-gray-900">40+</p><p className="text-gray-500 text-sm font-medium">{t.stats.country}</p></div>
        <div><p className="text-3xl font-bold text-gray-900">300+</p><p className="text-gray-500 text-sm font-medium">{t.stats.city}</p></div>
        <div><p className="text-3xl font-bold text-gray-900">2000+</p><p className="text-gray-500 text-sm font-medium">{t.stats.spot}</p></div>
      </div>
    </div>

    {/* SAĞ TARAF: Arama Kartı (Aynı kalıyor) */}
    <div className="relative">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-white max-w-lg w-full ml-auto min-h-[520px] flex flex-col justify-center">
        <h2 className="text-3xl font-serif font-bold mb-10 text-gray-900">{t.quickSearch}</h2>
        <div className="w-full"><HomeSearch forcedLang={lang} /></div>
        
        <div className="mt-8">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">{t.popularCities}</p>
          <div className="flex flex-wrap gap-2">
            {[
              { name: lang === "tr" ? "İstanbul" : "Istanbul", path: "/kesfet/turkiye/istanbul" },
              { name: lang === "tr" ? "Viyana" : "Vienna", path: "/kesfet/avusturya/viyana" },
              { name: "Paris", path: "/kesfet/fransa/paris" },
              { name: lang === "tr" ? "Roma" : "Rome", path: "/kesfet/italya/roma" },
            ].map((city) => (
              <Link key={city.path} href={getLocalizedLink(city.path)} className="px-4 py-2 bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 rounded-full text-xs font-medium transition-all border border-gray-100">
                {city.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* 2. SECTION: TURLAR */}
      <section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-10 md:mb-16 border-b border-gray-100 pb-6 md:pb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-gray-900 tracking-tight font-serif">{t.tourTitle}</h2>
          <Link href={getLocalizedLink("/etkinlikler")} className="inline-flex items-center justify-center gap-2 bg-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-orange-600 transition-all transform hover:scale-105">
            {t.seeAll} <span className="text-xl">→</span>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {featuredTours?.length > 0 ? (
            featuredTours.map((tour: any) => <div key={tour.id} className="h-full"><TourCard {...tour} /></div>)
          ) : (
            Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[400px] bg-gray-100 animate-pulse rounded-2xl" />)
          )}
        </div>
      </section>

     {/* 2. SECTION: konserler */}
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
      {/* 4. SECTION: KEŞFET CTA */}
     <section className="w-full max-w-[1800px] mx-auto px-8 md:px-16 my-24">
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

      {/* 5. SECTION: BLOG */}
      <section className="w-full max-w-[1800px] mx-auto px-4 lg:px-16 my-20">
        <div className="flex items-center justify-between mb-12 border-b border-gray-100 pb-6">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 font-serif">{t.blogTitle}</h2>
          <Link href={getLocalizedLink("/blog")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold">{t.seeAll} →</Link>
        </div>
        <HomeBlogSlider />
      </section>

      {/* 6. SECTION: ŞEHİRLER (Horizontal Scroll) */}
      <section className="mt-24 mb-24 w-full max-w-[1800px] mx-auto px-8 md:px-16">
        <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-10">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 font-serif">{t.cityTitle}</h2>
        </div>
        <div className="flex flex-row overflow-x-auto gap-8 pb-8 snap-x scrollbar-hide">
          {featuredCities.map((c) => (
            <Link key={c.slug} href={getLocalizedLink(`/${c.country}/${c.slug}`)} onClick={() => trackClick("city", c.name, `${c.country}/${c.slug}`)} className="flex-shrink-0 w-[280px] md:w-[400px] snap-start group">
              <div className="relative h-[450px] rounded-[2.5rem] overflow-hidden shadow-lg transition-all duration-500 bg-gray-100">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 w-full">
                  <h3 className="text-white text-2xl md:text-3xl font-black">{c.name}</h3>
                  <p className="text-blue-300 font-extrabold text-[11px] uppercase tracking-widest mt-2">{c.country.replace(/-/g, " ")}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. SECTION: VİDEOLAR */}
      <section className="mt-16 md:mt-24 mb-16 md:mb-24 w-full max-w-[1800px] mx-auto px-4 lg:px-16">
        <div className="flex items-center justify-between mb-16 border-b border-gray-100 pb-10">
          <h2 className="text-2xl md:text-4xl font-black text-gray-900 font-serif">{t.videoTitle}</h2>
          <Link href={getLocalizedLink("/videolar")} className="bg-orange-500 text-white px-8 py-4 rounded-full font-bold">{t.seeAll} →</Link>
        </div>
        <div className="flex gap-7 overflow-x-auto pb-6 snap-x scrollbar-hide">
          {(videos ?? []).slice(0, 6).map((video) => (
            <div key={video.id} onClick={() => router.push(getLocalizedLink(`/videolar/${video.slug}`))} className="flex-shrink-0 w-[220px] md:w-[300px] snap-start cursor-pointer group">
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-gray-100 shadow-sm group-hover:shadow-xl transition-all">
                <img src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center group-hover:scale-110 transition-all"><svg className="w-5 h-5 text-white translate-x-[1px]" fill="currentColor" viewBox="0 0 24 24"><path d="M7 6v12l10-6z" /></svg></div>
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