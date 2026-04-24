"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cityMap } from "@/lib/cityMap";
import { MapPin, ChevronRight, Sparkles, X, Calendar } from 'lucide-react';

// 🔥 Linkleri Türkçe karakterden arındıran fonksiyon (Aynen Korundu)
function slugify(text: string) {
  const charMap: { [key: string]: string } = {
    'ç': 'c', 'ğ': 'g', 'ı': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
    'Ç': 'C', 'Ğ': 'G', 'İ': 'I', 'Ö': 'O', 'Ş': 'S', 'Ü': 'U'
  };
  return text
    .split('')
    .map(char => charMap[char] || char)
    .join('')
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .trim();
}

const translations = {
  tr: {
    title: "TÜRKİYE GENELİ",
    subtitle: "Waylero ile {city} konserlerini keşfet",
    buyTicket: "BİLETİ AL →",
    otherCities: "+ DİĞER ŞEHİRLER",
    liveExp: "CANLI DENEYİMLER",
    soon: "Tarih Yakında",
    noEvents: "Bu tarih aralığında etkinlik bulunamadı...",
    noVenue: "Mekan Belirtilmemiş",
    event: "Etkinlik",
    loadMore: "DAHA FAZLA ETKİNLİK GÖR",
    loading: "YÜKLENİYOR...",
    thisWeek: "BU HAFTA",
    nextWeek: "GELECEK HAFTA",
    nextMonth: "GELECEK AY",
    resetDate: "TARİHİ SIFIRLA",
    footerText: "Etkinlik verileri {link} tarafından sağlanmaktadır.",
    allCities: "Tüm Şehirler"
  },
  en: {
    title: "ALL OVER TURKEY",
    subtitle: "Discover concerts in {city} with Waylero",
    buyTicket: "BUY TICKET →",
    otherCities: "+ OTHER CITIES",
    liveExp: "LIVE EXPERIENCES",
    soon: "Date TBA",
    noEvents: "No events found for these dates...",
    noVenue: "Venue Not Specified",
    event: "Event",
    loadMore: "LOAD MORE EVENTS",
    loading: "LOADING...",
    thisWeek: "THIS WEEK",
    nextWeek: "NEXT WEEK",
    nextMonth: "NEXT MONTH",
    resetDate: "RESET DATE",
    footerText: "Event data is provided by {link}.",
    allCities: "All Cities"
  },
};

interface ActivityListProps {
  initialEvents: any[];
  initialCityName: string;
  lang?: "tr" | "en";
}

export default function ActivityList({
  initialEvents,
  initialCityName,
  lang = "tr",
}: ActivityListProps) {
  const t = translations[lang];
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [showCityList, setShowCityList] = useState(false);

  const displayCityName = (initialCityName.toUpperCase() === "TÜRKİYE GENELİ" || initialCityName.toUpperCase() === "ALL OVER TURKEY") 
    ? t.title 
    : initialCityName.toLocaleUpperCase(lang === "tr" ? "tr-TR" : "en-US");

  const activeCity = displayCityName;
  const cities = ["İSTANBUL", "ANKARA", "İZMİR", "KONYA", "ANTALYA"];
  const otherCities = Object.keys(cityMap)
    .filter((c) => !cities.includes(c))
    .sort((a, b) => a.localeCompare(b, lang === "tr" ? "tr" : "en"));

  const mapEvent = (item: any) => {
    const rawDate = item.start || item.start_date || item.baslangic;
    let eventDate: Date | null = null;
    if (rawDate) {
      const d = new Date(rawDate);
      if (!isNaN(d.getTime())) eventDate = d;
    }
    return {
      id: item.id || Math.random(),
      name: item.name || item.adi,
      image: item.poster_url || item.afis || "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
      date: eventDate,
      time: eventDate ? eventDate.toLocaleTimeString(lang === "tr" ? "tr-TR" : "en-US", { hour: "2-digit", minute: "2-digit" }) : null,
      venue: item.venue?.name || item.mekan?.ad || t.noVenue,
      category: item.category?.name || t.event,
      url: item.ticket_url || item.url || "#",
    };
  };


  function pushWithParams(newParams: Record<string, string | null>) {
  const params = new URLSearchParams(searchParams.toString());

  Object.entries(newParams).forEach(([key, value]) => {
    if (value === null) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
  });

  router.push(`${pathname}?${params.toString()}`);
}


  useEffect(() => {
    const mapped = (initialEvents || []).map(mapEvent);
    setEvents(mapped);
    setSkip(0);
    setHasMore(mapped.length === 50);
  }, [initialEvents]);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const nextSkip = skip + 50;
    const params = new URLSearchParams(searchParams.toString());
    params.set("skip", nextSkip.toString());
    params.set("take", "50");

    try {
      const res = await fetch(`/api/events?${params.toString()}`);
      const data = await res.json();
      if (data.items && data.items.length > 0) {
        const newEvents = data.items.map(mapEvent);
        setEvents((prev) => [...prev, ...newEvents]);
        setSkip(nextSkip);
        if (newEvents.length < 50) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateRange = (startOffset: number, endOffset: number) => {
    const start = new Date();
    start.setDate(start.getDate() + startOffset);
    const end = new Date();
    end.setDate(end.getDate() + endOffset);
    const startStr = start.toISOString().split('T')[0];
    const endStr = end.toISOString().split('T')[0];
    const params = new URLSearchParams(searchParams.toString());
    params.set("start_gte", startStr);
    params.set("end_lte", endStr);
    params.delete("start");
    params.delete("end");
    pushWithParams({
  start_gte: startStr,
  end_lte: endStr,
});
  };

 const handleCityChange = (cityName: string) => {
  const cleanSlug = slugify(cityName);
  
  // pushWithParams'ı kullanma, direkt eski usul yap:
  const params = new URLSearchParams(window.location.search); // window.location kullanarak en güncel URL'yi al
  params.set("city", cleanSlug);
  
  router.push(`${pathname}?${params.toString()}`);
  setShowCityList(false);
};

  return (
    <main className="min-h-screen bg-white text-gray-900">
      {/* 1. HERO SECTION: İmzalı iki renkli gradyan */}
      <section className="pt-24 pb-40 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/60 backdrop-blur-md text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-orange-100 shadow-sm">
            <Sparkles size={14} className="animate-pulse" />
            <span>{t.liveExp}</span>
          </div>
          <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-8 tracking-tight">
            {displayCityName}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-medium opacity-90">
            {t.subtitle.replace("{city}", displayCityName)}
          </p>
        </div>
      </section>

      {/* 2. FILTER & CITY SELECTOR (Üstüne Binen Kısım) */}
      <section className="container mx-auto px-6 -mt-24 mb-16 relative z-10">
        <div className="bg-white p-6 md:p-8 rounded-[3rem] shadow-xl shadow-black/5 border border-gray-100">
          <div className="flex flex-col gap-8">
            {/* Tarih Butonları & Input */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => handleDateRange(0, 7)} className="px-6 py-3 text-[11px] font-black border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all uppercase tracking-wider">
                {t.thisWeek}
              </button>
              <button onClick={() => handleDateRange(7, 14)} className="px-6 py-3 text-[11px] font-black border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all uppercase tracking-wider">
                {t.nextWeek}
              </button>
              <button onClick={() => handleDateRange(14, 45)} className="px-6 py-3 text-[11px] font-black border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all uppercase tracking-wider">
                {t.nextMonth}
              </button>
              
              <div className="relative group min-w-[180px]">
                <input 
                  type="date" 
                  value={searchParams.get("start_gte") || ""}
                  onChange={(e) => {
  pushWithParams({
    start_gte: e.target.value,
    end_lte: e.target.value,
  });
}}
                  className="appearance-none bg-gray-50 border border-gray-100 rounded-2xl px-6 py-3 text-[11px] font-black outline-none focus:border-orange-500 transition-all cursor-pointer text-gray-900 hover:bg-gray-100 w-full pr-10"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-orange-500 pointer-events-none" size={16} />
              </div>

              {(searchParams.get("start_gte") || searchParams.get("end_lte")) && (
                <button 
                  onClick={() => {
  pushWithParams({
    start_gte: null,
    end_lte: null,
  });
}}
                  className="px-6 py-3 text-[11px] font-black text-red-500 border border-red-100 rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase flex items-center gap-2"
                >
                  <X size={14} /> {t.resetDate}
                </button>
              )}
            </div>

            {/* Hızlı Şehirler */}
            <div className="flex flex-wrap justify-center gap-2 pt-6 border-t border-gray-50">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCityChange(c)}
                  className={`px-5 py-2.5 text-xs font-bold border rounded-2xl transition-all ${activeCity === c ? "bg-black text-white border-black" : "bg-white text-gray-500 border-gray-100 hover:border-gray-300"}`}
                >
                  {c}
                </button>
              ))}
              <button 
                onClick={() => setShowCityList(!showCityList)} 
                className={`px-5 py-2.5 text-xs font-bold border rounded-2xl transition-all ${showCityList ? "bg-orange-500 text-white border-orange-500" : "border-orange-200 text-orange-600 hover:bg-orange-50"}`}
              >
                {t.otherCities}
              </button>
            </div>
          </div>
        </div>

        {/* Diğer Şehirler Listesi (Açılır Panel) */}
        {showCityList && (
          <div className="mt-4 w-full bg-white border border-gray-100 rounded-[2.5rem] p-8 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {otherCities.map((city) => (
                <button 
                  key={city} 
                  onClick={() => handleCityChange(city)} 
                  className="text-[11px] font-bold px-4 py-3 rounded-xl border border-gray-50 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 transition-all text-left truncate uppercase tracking-tight"
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 3. EVENTS GRID */}
      <section className="container mx-auto px-6 pb-24">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
            {events.map((event) => (
              <div key={event.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 hover:shadow-2xl hover:shadow-black/5 transition-all duration-500 transform hover:-translate-y-2">
                <div className="relative h-72 overflow-hidden">
                    <img
    src={event.image}
    alt={event.name}
    loading="lazy"
    decoding="async"
    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
  />
                  {/* Tarih Badge */}
                  <div className="absolute top-5 left-5">
                    <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-sm text-center">
                      <span className="block text-[10px] font-black text-orange-600 uppercase">
                        {event.date ? event.date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { month: "short" }) : "-"}
                      </span>
                      <span className="block text-lg font-black text-gray-900 leading-none">
                        {event.date ? event.date.getDate() : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{event.category}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 min-h-[56px] leading-snug group-hover:text-orange-600 transition-colors">
                    {event.name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400 mb-6">
                    <MapPin size={14} className="text-gray-300" />
                    <p className="text-xs font-medium truncate uppercase tracking-tighter">{event.venue}</p>
                  </div>
                  
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="mt-auto flex items-center justify-between bg-gray-50 group-hover:bg-black text-gray-900 group-hover:text-white p-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all"
                  >
                    {t.buyTicket}
                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-serif italic text-lg">{t.noEvents}</p>
          </div>
        )}

        {/* 4. LOAD MORE */}
        {hasMore && events.length >= 50 && (searchParams.get("city") || searchParams.get("start_gte")) && (
          <div className="flex justify-center mt-20">
            <button 
              onClick={loadMore}
              disabled={loading}
              className="group flex items-center gap-4 px-12 py-5 bg-white border-2 border-gray-100 text-gray-900 rounded-[2rem] font-black hover:bg-black hover:text-white hover:border-black transition-all disabled:opacity-50 uppercase tracking-[0.2em] text-xs"
            >
              {loading ? t.loading : (
                <>
                  {t.loadMore}
                  <ChevronRight size={20} className="group-hover:rotate-90 transition-transform" />
                </>
              )}
            </button>
          </div>
        )}
      </section>

      {/* 5. FOOTER */}
      <footer className="container mx-auto px-6 py-16 border-t border-gray-50 text-center">
        <p className="text-gray-400 text-xs font-medium tracking-wide">
          {t.footerText.split("{link}")[0]}
          <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer" className="text-orange-500 font-bold hover:underline mx-1">etkinlik.io</a>
          {t.footerText.split("{link}")[1]}
        </p>
      </footer>
    </main>
  );
}