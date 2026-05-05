"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { cityMap } from "@/lib/cityMap";
import { MapPin, ChevronRight, Sparkles, X } from 'lucide-react';

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
    buyTicket: "BİLETİ AL",
    otherCities: "+ DİĞER ŞEHİRLER",
    liveExp: "CANLI DENEYİMLER",
    noEvents: "Bu kriterlere uygun etkinlik bulunamadı...",
    noVenue: "Mekan Belirtilmemiş",
    event: "Etkinlik",
    loadMore: "DAHA FAZLA GÖR",
    loading: "YÜKLENİYOR...",
    thisWeek: "BU HAFTA",
    nextWeek: "GELECEK HAFTA",
    nextMonth: "GELECEK AY",
    resetDate: "SIFIRLA",
    footerText: "Etkinlik verileri {link} tarafından sağlanmaktadır.",
  },
  en: {
    title: "ALL OVER TURKEY",
    subtitle: "Discover concerts in {city} with Waylero",
    buyTicket: "BUY TICKET",
    otherCities: "+ OTHER CITIES",
    liveExp: "LIVE EXPERIENCES",
    noEvents: "No events found for these criteria...",
    noVenue: "Venue Not Specified",
    event: "Event",
    loadMore: "LOAD MORE",
    loading: "LOADING...",
    thisWeek: "THIS WEEK",
    nextWeek: "NEXT WEEK",
    nextMonth: "NEXT MONTH",
    resetDate: "RESET",
    footerText: "Event data is provided by {link}.",
  },
};

interface ActivityListProps {
  initialEvents: any[];
  initialCityName: string;
  lang: "tr" | "en";
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

  const displayCityName = initialCityName;
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
      venue: item.venue?.name || item.mekan?.ad || t.noVenue,
      category: item.category?.name || t.event,
      url: item.ticket_url || item.url || "#",
    };
  };

  function pushWithParams(newParams: Record<string, string | null>) {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null) params.delete(key);
      else params.set(key, value);
    });
    params.delete("skip");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  // ✅ initialEvents prop'u her değiştiğinde listeyi günceller
  useEffect(() => {
    if (initialEvents && Array.isArray(initialEvents)) {
      const mapped = initialEvents.map(mapEvent);
      setEvents(mapped);
      setSkip(0);
      setHasMore(mapped.length >= 50);
    }
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
      const rawItems = data.items || data.data || [];
      
      if (rawItems.length > 0) {
        const newEvents = rawItems.map(mapEvent);
        setEvents((prev) => [...prev, ...newEvents]);
        setSkip(nextSkip);
        if (newEvents.length < 50) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white text-gray-900">
      <section className="pt-24 pb-44 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/80 backdrop-blur-md text-orange-700 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-8 border border-orange-100">
            <Sparkles size={14} className="animate-pulse" />
            <span>{t.liveExp}</span>
          </div>
          <h1 className="text-5xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tighter uppercase italic leading-[0.85]">
            {displayCityName}
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto font-medium opacity-80 leading-relaxed">
            {t.subtitle.replace("{city}", displayCityName)}
          </p>
        </div>
      </section>

      <section className="container mx-auto px-6 -mt-28 mb-16 relative z-10">
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[3.5rem] shadow-2xl shadow-black/5 border border-white/50">
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center justify-center gap-3">
              {[
                { label: t.thisWeek, range: [0, 7] },
                { label: t.nextWeek, range: [7, 14] },
                { label: t.nextMonth, range: [14, 45] }
              ].map((btn) => (
                <button
                  key={btn.label}
                  onClick={() => {
                    const s = new Date(); s.setDate(s.getDate() + btn.range[0]);
                    const e = new Date(); e.setDate(s.getDate() + btn.range[1]);
                    pushWithParams({ start_gte: s.toISOString().split('T')[0], end_lte: e.toISOString().split('T')[0] });
                  }}
                  className="px-8 py-4 text-[10px] font-black border border-gray-100 rounded-2xl hover:bg-black hover:text-white transition-all uppercase tracking-widest"
                >
                  {btn.label}
                </button>
              ))}

              <div className="relative group">
                <input 
                  type="date" 
                  value={searchParams.get("start_gte") || ""}
                  onChange={(e) => pushWithParams({ start_gte: e.target.value, end_lte: e.target.value })}
                  className="bg-gray-50 border border-gray-100 rounded-2xl px-6 py-4 text-[10px] font-black outline-none focus:ring-2 ring-orange-500/20 transition-all uppercase"
                />
              </div>

              {(searchParams.get("start_gte")) && (
                <button onClick={() => pushWithParams({ start_gte: null, end_lte: null })} className="p-4 text-red-500 bg-red-50 rounded-2xl hover:bg-red-500 hover:text-white transition-all">
                  <X size={18} />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-2 pt-6 border-t border-gray-50">
              {cities.map((c) => (
                <button
                  key={c}
                  onClick={() => pushWithParams({ city: slugify(c) })}
                  className={`px-6 py-3 text-[10px] font-black border rounded-2xl transition-all tracking-widest uppercase ${
                    slugify(initialCityName) === slugify(c)
                    ? "bg-orange-600 text-white border-orange-600 shadow-xl shadow-orange-200" 
                    : "bg-white text-gray-400 border-gray-100 hover:border-orange-200 hover:text-orange-600"
                  }`}
                >
                  {c}
                </button>
              ))}
              <button 
                onClick={() => setShowCityList(!showCityList)}
                className={`px-6 py-3 text-[10px] font-black border rounded-2xl transition-all tracking-widest ${showCityList ? "bg-black text-white" : "border-orange-100 text-orange-600"}`}
              >
                {t.otherCities}
              </button>
            </div>
          </div>

          {showCityList && (
            <div className="mt-4 bg-white border border-gray-100 rounded-[2.5rem] p-10 shadow-2xl animate-in fade-in zoom-in duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {otherCities.map((city) => (
                  <button 
                    key={city} 
                    onClick={() => { pushWithParams({ city: slugify(city) }); setShowCityList(false); }} 
                    className="text-[10px] font-black px-4 py-4 rounded-xl border border-gray-50 hover:border-orange-500 hover:bg-orange-50 transition-all text-left uppercase truncate"
                  >
                    {city}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="container mx-auto px-6 pb-32">
        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {events.map((event) => (
              <div key={event.id} className="group bg-white rounded-[3rust] overflow-hidden border border-gray-50 hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-700 transform hover:-translate-y-3">
                <div className="relative h-80 overflow-hidden">
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute top-6 left-6">
                    <div className="bg-white/95 backdrop-blur-md w-14 h-16 rounded-2xl shadow-xl flex flex-col items-center justify-center">
                      <span className="text-[9px] font-black text-orange-600 uppercase tracking-tighter">
                        {event.date ? event.date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { month: "short" }) : "-"}
                      </span>
                      <span className="text-xl font-serif font-black text-gray-900 leading-none mt-1">
                        {event.date ? event.date.getDate() : "-"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 flex flex-col h-full">
                  <span className="text-[9px] font-black text-blue-500 uppercase tracking-[0.2em] mb-4 inline-block">{event.category}</span>
                  <h2 className="text-xl font-serif font-bold text-gray-900 mb-4 line-clamp-2 min-h-[56px] leading-tight group-hover:text-orange-600 transition-colors uppercase italic">
                    {event.name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-400 mb-8 border-b border-gray-50 pb-4">
                    <MapPin size={14} className="text-red-400" />
                    <p className="text-[10px] font-black truncate uppercase tracking-widest">{event.venue}</p>
                  </div>
                  
                  <a 
                    href={event.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-between bg-gray-900 text-white p-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 transition-all shadow-lg shadow-black/10 hover:shadow-orange-200"
                  >
                    {t.buyTicket}
                    <ChevronRight size={16} />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-40 bg-gray-50 rounded-[4rem] border-2 border-dashed border-gray-200">
             <p className="text-gray-400 font-serif italic text-2xl">{t.noEvents}</p>
          </div>
        )}

        {hasMore && (
          <div className="flex justify-center mt-20">
            <button 
              onClick={loadMore} 
              disabled={loading}
              className="px-16 py-6 bg-white border border-gray-100 text-gray-900 rounded-full font-black text-[11px] uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all shadow-xl shadow-black/5 disabled:opacity-50"
            >
              {loading ? t.loading : t.loadMore}
            </button>
          </div>
        )}
      </section>

      <footer className="container mx-auto px-6 py-20 border-t border-gray-50 text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">
          {t.footerText.split("{link}")[0]}
          <a href="https://etkinlik.io" target="_blank" rel="noopener noreferrer" className="text-orange-500 hover:underline mx-1">etkinlik.io</a>
          {t.footerText.split("{link}")[1]}
        </p>
      </footer>
    </main>
  );
}