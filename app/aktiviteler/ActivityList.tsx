"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

const translations = {
  tr: {
    title: "TÜRKİYE GENELİ",
    subtitle: "Waylero ile {city}{suffix} konserleri keşfet",
    loading: "WAYLERO YÜKLENİYOR",
    noEvents: "Bu şehirde sessizlik hakim...",
    buyTicket: "BİLETİ AL →",
    otherCities: "+ DİĞER ŞEHİRLER",
    liveExp: "CANLI DENEYİMLER",
    soon: "Tarih Yakında",
    dataBy: "Etkinlik verileri",
    providedBy: "tarafından sağlanmaktadır.",
    noVenue: "Mekan Belirtilmemiş",
    event: "Etkinlik"
  },
  en: {
    title: "ALL OVER TURKEY",
    subtitle: "Discover concerts in {city} with Waylero",
    loading: "WAYLERO LOADING",
    noEvents: "Silence prevails in this city...",
    buyTicket: "BUY TICKET →",
    otherCities: "+ OTHER CITIES",
    liveExp: "LIVE EXPERIENCES",
    soon: "Date Soon",
    dataBy: "Event data provided by",
    providedBy: "",
    noVenue: "Venue Not Specified",
    event: "Event"
  }
};

interface ActivityListProps {
  initialEvents: any[];
  initialCityName: string;
  lang?: "tr" | "en";
}

export default function ActivityList({ initialEvents, initialCityName, lang = "tr" }: ActivityListProps) {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const t = translations[lang];

  const [selectedCityName, setSelectedCityName] = useState(initialCityName || t.title);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const cityMap: { [key: string]: number } = { "ADANA": 1, "ADIYAMAN": 2, "AFYON": 3, "AFYONKARAHİSAR": 85, "AĞRI": 4, "AKSARAY": 5, "AMASYA": 6, "ANKARA": 7, "ANTALYA": 8, "ARDAHAN": 9, "ARTVİN": 10, "AYDIN": 11, "BALIKESİR": 12, "BARTIN": 13, "BATMAN": 14, "BAYBURT": 15, "BİLECİK": 16, "BİNGÖL": 17, "BİTLİS": 18, "BOLU": 19, "BURDUR": 20, "BURSA": 21, "ÇANAKKALE": 22, "ÇANKIRI": 23, "ÇORUM": 24, "DENİZLİ": 25, "DİYARBAKIR": 26, "DÜZCE": 27, "EDİRNE": 28, "ELAZIĞ": 29, "ERZİNCAN": 30, "ERZURUM": 31, "ESKİŞEHİR": 32, "GAZİANTEP": 33, "GİRESUN": 34, "GÜMÜŞHANE": 35, "HAKKARİ": 36, "HATAY": 37, "IĞDIR": 38, "ISPARTA": 39, "İSTANBUL": 40, "İZMİR": 41, "KAHRAMANMARAŞ": 42, "KARABÜK": 43, "KARAMAN": 44, "KARS": 45, "KASTAMONU": 46, "KAYSERİ": 47, "KİLİS": 51, "KIRIKKALE": 48, "KIRKLARELİ": 49, "KIRŞEHİR": 50, "KKTC": 84, "KOCAELİ": 52, "KONYA": 53, "KÜTAHYA": 54, "LEFKOŞA": 83, "MALATYA": 55, "MANİSA": 56, "MARDİN": 57, "MERSİN": 58, "MUĞLA": 59, "MUŞ": 60, "NEVŞEHİR": 61, "NİĞDE": 62, "ORDU": 63, "OSMANİYE": 64, "RİZE": 65, "SAKARYA": 66, "SAMSUN": 67, "ŞANLIURFA": 71, "SİİRT": 68, "SİNOP": 69, "ŞIRNAK": 72, "SİVAS": 70, "TEKİRDAĞ": 73, "TOKAT": 74, "TRABZON": 75, "TUNCELİ": 76, "UŞAK": 77, "VAN": 78, "YALOVA": 79, "YOZGAT": 80, "ZONGULDAK": 81 }
  const formatEvents = (rawItems: any[]) => {
    return rawItems.map((item: any) => {
      const rawDate = item.start || item.start_date || item.baslangic;
      let eventDate = null;
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
    });
  };

  const fetchEventsClient = async (citySlug: string = "") => {
    try {
      setLoading(true);
      if (!citySlug) {
        const res = await fetch(`/api/events`, { cache: 'no-store' });
        const data = await res.json();
        const rawItems = data.items || (Array.isArray(data) ? data : []);
        setEvents(formatEvents(rawItems));
        setSelectedCityName(t.title);
        return;
      }

      const decodedSlug = decodeURIComponent(citySlug).trim();
      const cityName = decodedSlug.replace(/-/g, " ").toLocaleUpperCase("tr-TR").trim();
      const cityId = cityMap[cityName];
      setSelectedCityName(cityName);

      const params = new URLSearchParams();
      if (cityId) params.append("city_ids", cityId.toString());
      else params.append("q", decodedSlug);

      const res = await fetch(`/api/events?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      const rawItems = data.items || (Array.isArray(data) ? data : []);
      setEvents(formatEvents(rawItems));
    } catch (err) {
      console.error("Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCitySuffix = (cityName: string) => {
    if (lang === "en" || !cityName || cityName === t.title) return "";
    const lastChar = cityName.slice(-1).toLocaleUpperCase("tr-TR");
    const vowels = cityName.match(/[aıoueiöü]/gi);
    const lastVowel = vowels ? vowels[vowels.length - 1].toLocaleUpperCase("tr-TR") : "";
    const isHard = "FSTKÇŞHP".includes(lastChar);
    const dOrT = isHard ? "T" : "D";
    const aOrE = "AIOU".includes(lastVowel) ? "A" : "E";
    return `'${dOrT}${aOrE}Kİ`;
  };

  useEffect(() => {
    const cityParam = searchParams.get("city");
    if (!cityParam) {
      if (initialEvents && initialEvents.length > 0) {
        setEvents(formatEvents(initialEvents));
        setSelectedCityName(t.title);
      } else {
        fetchEventsClient("");
      }
    } else {
      fetchEventsClient(cityParam);
    }
  }, [searchParams.get("city"), lang]);

  return (
    <main className="min-h-screen bg-[#0A0A0A] text-white p-4 md:p-12">
      <div className="max-w-[1400px] mx-auto">
        <header className="flex flex-col items-center mb-12 md:mb-20">
          <div className="inline-block px-3 py-0.5 border border-white/10 rounded-full mb-4 bg-white/5">
            <span className="text-[9px] font-bold tracking-[0.2em] text-yellow-500 uppercase">{t.liveExp}</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-center mb-3 uppercase">{selectedCityName}</h1>
          <p className="text-yellow-500 text-[10px] md:text-xs font-light tracking-[0.15em] uppercase text-center opacity-75">
            {t.subtitle.replace("{city}", selectedCityName).replace("{suffix}", getCitySuffix(selectedCityName))}
          </p>

          <div className="flex gap-3 mt-6 flex-wrap justify-center">
            {["İSTANBUL", "ANKARA", "İZMİR", "KONYA", "ANTALYA"].map((c) => {
              const isActive = selectedCityName.toLocaleUpperCase("tr-TR") === c;
              return (
                <button
                  key={c}
                  onClick={() => router.push(`${pathname}?city=${c.toLocaleLowerCase("tr-TR")}`)}
                  className={`px-5 py-2 rounded-xl text-[11px] font-bold tracking-widest transition-all border ${
                    isActive ? "bg-white text-black border-white" : "bg-transparent text-gray-400 border-white/10 hover:border-white/40"
                  }`}
                >
                  {c}
                </button>
              );
            })}
            <button
              onClick={() => { window.dispatchEvent(new Event("triggerSearchFocus")); window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className={`px-5 py-2 rounded-xl text-[11px] font-bold tracking-widest border transition-all ${
                selectedCityName !== t.title && !["İSTANBUL", "ANKARA", "İZMİR", "KONYA", "ANTALYA"].includes(selectedCityName)
                ? "bg-yellow-500 text-black border-yellow-500"
                : "border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
              }`}
            >
              {t.otherCities}
            </button>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="font-black tracking-[0.3em] text-sm animate-pulse text-gray-500">{t.loading}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="group relative bg-[#121212] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col">
                  <div className="relative h-72 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 opacity-60"></div>
                    <img src={event.image} alt={event.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute top-6 left-6 z-20">
                      <span className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase text-yellow-500">
                        {event.category}
                      </span>
                    </div>
                    <div className="absolute bottom-6 left-6 z-20">
                      <div className="flex items-baseline gap-1">
                        {event.date ? (
                          <>
                            <span className="text-3xl font-black text-white">{event.date.getDate()}</span>
                            <span className="text-xs font-bold text-gray-300 uppercase">
                              {event.date.toLocaleDateString(lang === "tr" ? "tr-TR" : "en-US", { month: "short" })}
                            </span>
                          </>
                        ) : (
                          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t.soon}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="p-8 pt-2 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] tracking-tight group-hover:text-yellow-400 transition-colors">
                      {event.name}
                    </h2>
                    <div className="flex items-center gap-2 text-gray-500 mb-8">
                      <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                      <span className="text-xs font-semibold italic truncate">{event.venue}</span>
                    </div>
                    <div className="mt-auto">
                      <a href={event.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center w-full py-5 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-yellow-400 transition-all active:scale-95">
                        {t.buyTicket}
                      </a>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-32 rounded-[3rem] border border-dashed border-white/10 text-gray-600 font-bold tracking-widest uppercase">
                {t.noEvents}
              </div>
            )}
          </div>
        )}
      </div>
      <footer className="mt-16 text-center text-white text-sm md:text-base font-medium opacity-90 pb-10">
        {t.dataBy} <a href="https://etkinlik.io" className="text-yellow-500 underline" target="_blank" rel="noopener noreferrer">etkinlik.io</a> {t.providedBy}
      </footer>
    </main>
  );
}