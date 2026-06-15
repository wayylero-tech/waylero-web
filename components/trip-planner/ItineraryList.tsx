"use client";

import Link from "next/link";
import { Hotel, Map, Music } from "lucide-react";


const validCities = [
  "istanbul", "nevsehir", "antalya", "izmir", "mugla", 
  "aydin", "trabzon", "viyana", "roma", "paris", "dubai", "bangkok"
];

// 🗺️ 81 ili ve tüm dünyayı güvenceye alan şehir-ülke haritamız kanka
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "las-vegas": "amerika", "berlin": "almanya", "munih": "almanya", "frankfurt": "almanya", "paris": "fransa", "roma": "italya", "milano": "italya", "venedik": "italya", "madrid": "ispanya", "barselona": "ispanya", "londra": "ingiltere", "amsterdam": "hollanda", "viyana": "avusturya", "kopenhag": "danimarka", "stockholm": "isvec", "oslo": "norvec", "zurich": "isvicre", "atina": "yunanistan", "lizbon": "portekiz", "delhi": "hindistan", "bangkok": "tayland", "dubai": "bae", "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "pekin": "cin", "sangay": "cin"
  // (Not: İstersen lib altındaki dosyandan import et, istersen buradaki map'i genişlet kanka)
};

interface Place {
  country: string;
  city: string;
  slug: string;
  name_tr: string;
  name_en: string;
  lat: number;
  lng: number;
  visit_time?: string;          
  suggested_duration?: string;  
  ai_tips_tr?: string;
  ai_tips_en?: string;
}

interface ItineraryListProps {
  lang: "tr" | "en";
  t: any;
  itinerary: Place[];
  preferences: { wantsHotels: boolean; wantsTours: boolean; wantsEvents: boolean };
  city: string;
}

export default function ItineraryList({ lang, t, itinerary, preferences, city }: ItineraryListProps) {
  
  const citySlug = city.toLowerCase().trim();
  const isSupportedCity = validCities.includes(citySlug);
  const targetCitySlug = isSupportedCity ? citySlug : "tumsehirler";
  const displayName = city.charAt(0).toUpperCase() + city.slice(1);

  const affiliateData = [
    { 
      id: "hotel-1", 
      type: "hotel", 
      icon: <Hotel size={24} className="text-orange-500" />,
      text_tr: `${displayName} şehrindeki otelleri görmek için tıkla`, 
      text_en: `Click to see hotels in ${displayName}`, 
      link: `/hotels/${targetCitySlug}` 
    },
    { 
      id: "tour-1", 
      type: "tour", 
      icon: <Map size={24} className="text-blue-500" />,
      text_tr: `${displayName} şehrindeki turları görmek için tıkla`, 
      text_en: `Click to see tours in ${displayName}`, 
      link: `/etkinlikler/${targetCitySlug}` 
    },
    { 
      id: "event-1", 
      type: "event", 
      icon: <Music size={24} className="text-purple-500" />,
      text_tr: `${displayName} şehrindeki konserleri görmek için tıkla`, 
      text_en: `Click to see concerts in ${displayName}`, 
      link: `/aktiviteler/${targetCitySlug}` 
    }
  ];

  // 🎯 KRİTİK DEĞİŞİKLİK: Artık gelen itinerary verisine bağımlı değiliz.
  // Doğrudan aratılan şehri haritamızdan sorgulayıp "turkiye" mi diye bakıyoruz kanka.
  const isTurkeyCity = cityToCountryMap[citySlug] === "turkiye";

  const activeOffers = affiliateData.filter(item => {
    if (item.type === "hotel" && !preferences.wantsHotels) return false;
    if (item.type === "tour" && !preferences.wantsTours) return false;
    if (item.type === "event" && !preferences.wantsEvents) return false;
    
    // Eğer rota Türkiye dışında bir yerse konser kartını gizle
    if (item.type === "event" && !isTurkeyCity) return false;
    
    return true;
  });

  return (
    <div className="space-y-8">
      {/* 📍 Gezi Durakları Listesi */}
      {itinerary.map((item, index) => (
        <div key={index} className="flex gap-8 items-start relative pb-2 border-l-2 border-dashed border-gray-100 ml-6 pl-12">
          <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-[#1e445e] border-4 border-white shadow-md z-10"></div>
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex-1">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest block mb-1">
              {t.stop} #{index + 1}
            </span>
            
            {/* Üst Başlık ve Süre Alanı */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <h4 className="font-bold text-gray-900 text-xl tracking-tight">
                {lang === "tr" ? item.name_tr : item.name_en}
              </h4>
              {item.suggested_duration && (
                <span className="inline-flex items-center gap-1 bg-blue-50 text-[#1e445e] px-3 py-1 rounded-full text-xs font-black tracking-tight border border-blue-100/30 w-max">
                  ⏳ {lang === "tr" ? "Önerilen Gezi Süre:" : "Suggested Time:"} {item.suggested_duration}
                </span>
              )}
            </div>

            {/* İpucu Alanı */}
            {(item.ai_tips_tr || item.ai_tips_en) && (
              <div className="text-sm text-gray-600 bg-orange-50/50 border border-orange-100/50 p-4 rounded-2xl italic leading-relaxed mt-2">
                "{lang === "tr" ? item.ai_tips_tr : item.ai_tips_en}"
              </div>
            )}
          </div>
        </div>
      ))}

      {/* 🚀 Aksiyon Kartları (Affiliate Gelir Modeli) */}
      {activeOffers.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-100">
          <h4 className="text-xs font-black text-gray-400 uppercase tracking-wider pl-6 mb-6">
            {lang === "tr" ? "Seyahat Avantajları" : "Travel Perks"}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pl-6">
            {activeOffers.map((offer) => (
              <Link 
                key={offer.id} 
                href={offer.link}
                className="group bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all flex flex-col items-center text-center gap-4 cursor-pointer"
              >
                <div className="p-3 bg-gray-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  {offer.icon}
                </div>
                <span className="font-bold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">
                  {lang === "tr" ? offer.text_tr : offer.text_en}
                </span>
                <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                  {lang === "tr" ? "İNCELE →" : "EXPLORE →"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}