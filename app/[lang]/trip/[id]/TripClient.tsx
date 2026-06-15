"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { Hotel, Map as MapIcon, Music } from "lucide-react";

const MapComponent = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

const validCities = [
  "istanbul", "nevsehir", "antalya", "izmir", "mugla", "aydin", "trabzon",
  "viyana", "roma", "paris", "dubai", "bangkok", "konya",
];

// 🗺️ Senin sağladığın devasa şehir-ülke haritası kanka
const cityToCountryMap: Record<string, string> = {
  "adana": "turkiye", "adiyaman": "turkiye", "afyonkarahisar": "turkiye", "agri": "turkiye", "aksaray": "turkiye", "amasya": "turkiye", "ankara": "turkiye", "istanbul": "turkiye", "antalya": "turkiye", "ardahan": "turkiye", "artvin": "turkiye", "aydin": "turkiye", "balikesir": "turkiye", "bartin": "turkiye", "batman": "turkiye", "bayburt": "turkiye", "bilecik": "turkiye", "bingol": "turkiye", "bitlis": "turkiye", "bolu": "turkiye", "bursa": "turkiye", "burdur": "turkiye", "canakkale": "turkiye", "cankiri": "turkiye", "corum": "turkiye", "denizli": "turkiye", "diyarbakir": "turkiye", "duzce": "turkiye", "edirne": "turkiye", "elazig": "turkiye", "erzincan": "turkiye", "erzurum": "turkiye", "eskisehir": "turkiye", "gaziantep": "turkiye", "giresun": "turkiye", "gumushane": "turkiye", "hakkari": "turkiye", "hatay": "turkiye", "igdir": "turkiye", "isparta": "turkiye", "izmir": "turkiye", "kahramanmaras": "turkiye", "karabuk": "turkiye", "karaman": "turkiye", "kars": "turkiye", "kastamonu": "turkiye", "kayseri": "turkiye", "kirikkale": "turkiye", "kirsehir": "turkiye", "kocaeli": "turkiye", "konya": "turkiye", "kutahya": "turkiye", "malatya": "turkiye", "manisa": "turkiye", "mardin": "turkiye", "mersin": "turkiye", "mugla": "turkiye", "mus": "turkiye", "nevsehir": "turkiye", "nigde": "turkiye", "ordu": "turkiye", "osmaniye": "turkiye", "rize": "turkiye", "sakarya": "turkiye", "samsun": "turkiye", "siirt": "turkiye", "sinop": "turkiye", "sivas": "turkiye", "sanliurfa": "turkiye", "tekirdag": "turkiye", "tokat": "turkiye", "trabzon": "turkiye", "tunceli": "turkiye", "usak": "turkiye", "van": "turkiye", "yalova": "turkiye", "yozgat": "turkiye", "zonguldak": "turkiye", "sirnak": "turkiye", "kirklareli": "turkiye", "kilis": "turkiye",
  "newyork": "amerika", "los-angeles": "amerika", "chicago": "amerika", "las-vegas": "amerika", "berlin": "almanya", "munih": "almanya", "frankfurt": "almanya", "paris": "fransa", "roma": "italya", "milano": "italya", "venedik": "italya", "madrid": "ispanya", "barselona": "ispanya", "londra": "ingiltere", "amsterdam": "hollanda", "viyana": "avusturya", "kopenhag": "danimarka", "stockholm": "isvec", "oslo": "norvec", "zurich": "isvicre", "atina": "yunanistan", "lizbon": "portekiz", "delhi": "hindistan", "bangkok": "tayland", "dubai": "bae", "tokyo": "japonya", "kyoto": "japonya", "osaka": "japonya", "pekin": "cin", "sangay": "cin"
  // (Not: Kod kalabalığı yapmasın diye burayı kısa tuttum kanka, senin listenin tamamı burada geçerli olacak)
};

export default function TripClient({ trip, currentLang }: any) {
  const isEn = currentLang === "en";

  const citySlug = (trip.city || "").toLowerCase().trim();
  const isSupportedCity = validCities.includes(citySlug);
  const targetCitySlug = isSupportedCity ? citySlug : "tumsehirler";

  const rawCity = trip.city || (isEn ? "City" : "Şehir");
  const displayName = rawCity.charAt(0).toUpperCase() + rawCity.slice(1);

  const normalizedPlaces = (trip.places || []).map((p: any) => ({
    ...p,
    lat: Number(p.lat),
    lng: Number(p.lng),
  }));

  // 🎯 KRİTİK DEĞİŞİKLİK: Şehrin Türkiye'de olup olmadığını maptan kontrol ediyoruz
  // Eğer map'te eşleşen değer "turkiye" ise true döner.
  const isTurkeyCity = cityToCountryMap[citySlug] === "turkiye";

  const affiliateData = [
    {
      id: "hotel-1",
      type: "hotel",
      icon: <Hotel size={24} className="text-orange-500" />,
      text: isEn
        ? `Click to see hotels in ${displayName}`
        : `${displayName} şehrindeki otelleri görmek için tıkla`,
      link: `/${currentLang}/hotels/${targetCitySlug}`,
    },
    {
      id: "tour-1",
      type: "tour",
      icon: <MapIcon size={24} className="text-blue-500" />,
      text: isEn
        ? `Click to see tours in ${displayName}`
        : `${displayName} şehrindeki turları görmek için tıkla`,
      link: `/${currentLang}/etkinlikler/${targetCitySlug}`,
    },
    {
      id: "event-1",
      type: "event",
      icon: <Music size={24} className="text-purple-500" />,
      text: isEn
        ? `Click to see concerts in ${displayName}`
        : `${displayName} şehrindeki konserleri görmek için tıkla`,
      link: `/${currentLang}/aktiviteler/${targetCitySlug}`,
    },
  ];

  // 🛡️ MAP BAZLI GÜVENLİ FİLTRELEME
  const activeOffers = affiliateData.filter(item => {
    // Kart konser kartıysa sadece Türkiye şehirlerinde gösterilsin
    if (item.type === "event") {
      return isTurkeyCity;
    }
    // Otel ve Tur kartları her durumda listelensin kanka
    return true;
  });

  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900">
      <section className="relative">
        <div className="h-[420px] w-full overflow-hidden rounded-b-[32px]">
          <MapComponent
            key={trip.id}
            places={normalizedPlaces}
            showControls={true}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        <div className="absolute top-0 left-0 z-[1000] p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">
            📍 {displayName} {isEn ? "Route" : "Rotası"}
          </h1>
          <p className="text-sm text-white/80 mt-1">
            {normalizedPlaces?.length || 0} {isEn ? "stops" : "durak"}
          </p>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-10 space-y-3">
        <div className="bg-white border rounded-2xl p-5 mb-6">
          <h2 className="font-bold text-lg">
            {isEn ? "Trip Stops" : "Gezi Durakları"}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {isEn ? `Route created in ${displayName}` : `${displayName} şehrinde oluşturulan rota`}
          </p>
        </div>

        {normalizedPlaces?.map((p: any, i: number) => (
          <div
            key={p.slug + i}
            className="bg-white border rounded-2xl p-4 flex justify-between items-center hover:shadow-sm transition"
          >
            <div>
              <div className="font-semibold text-gray-900">
                {isEn ? p.name_en : p.name_tr}
              </div>
              <div className="text-xs text-gray-400">
                {isEn ? p.name_tr : p.name_en}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#1e445e] text-white flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>
          </div>
        ))}

        {/* 🚀 Filtrelenmiş akıllı aksiyon kartları */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-8">
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
                {offer.text}
              </span>

              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                {isEn ? "VIEW →" : "İNCELE →"}
              </span>
            </Link>
          ))}
        </div>

        {trip.savedTrips && trip.savedTrips.length > 0 && (
          <section className="pt-16 mt-8 border-t border-gray-100">
            <h3 className="text-sm font-black text-gray-400 uppercase tracking-wider pl-2 mb-6">
              {isEn ? "Other Saved Routes" : "Kaydedilen Diğer Rotalar"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trip.savedTrips.map((savedTrip: any) => (
                <Link
                  key={savedTrip.id}
                  href={`/${currentLang}/trip/${savedTrip.id}`}
                  className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-all flex items-center justify-between"
                >
                  <span className="font-bold text-gray-700">
                    {(savedTrip.city || (isEn ? "Route" : "Rota"))
                      .charAt(0)
                      .toUpperCase() +
                      (savedTrip.city || (isEn ? "Route" : "Rota")).slice(1)}{" "}
                    {isEn ? "Trip Route" : "Gezi Rotası"}
                  </span>

                  <span className="text-[10px] text-blue-500 font-bold uppercase">
                    {isEn ? "VIEW →" : "Görüntüle →"}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </section>
    </main>
  );
}