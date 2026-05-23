"use client";

import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, ChevronRight, Hotel, Ticket, Globe2 } from "lucide-react";

const CLOUDINARY_BASE_URL = "https://res.cloudinary.com/dewd42ppf/image/upload";

const getCloudinaryUrl = (path: string, width: number) => {
  if (!path) return "";
  return `${CLOUDINARY_BASE_URL}/f_auto,q_auto:eco,w_${width},c_fill/${path.replace(/^\/+/, "")}`;
};

const capitalizeCityName = (str: string) => {
  if (!str) return "";
  return str
    .replace(/-/g, " ")
    .split(" ")
    .map((word) => {
      if (word.startsWith("i") || word.startsWith("İ")) {
        return "İ" + word.slice(1).toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

// 🌟 Tam Ekran Görüntüsündeki Gibi iStock Tarzı Zengin Vektörel İllüstrasyonlar
const getFallbackIllustration = (placeName: string, placeSlug: string) => {
  const text = `${placeName} ${placeSlug}`.toLowerCase();

  // 1. ANTİK KENT / HARABE / TARİHİ KALINTI (Dağ yerine tam bir antik tapınak/şehir havası)
  if (text.includes("antik") || text.includes("ancient") || text.includes("harabe") || text.includes("ruins") || text.includes("kalinti") || text.includes("kalıntı") || text.includes("anit") || text.includes("monument")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-orange-50 to-orange-200 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-lg">
          {/* Arkadaki hafif gökyüzü bulutu veya yumuşak güneş tonu */}
          <circle cx="100" cy="90" r="35" fill="#F4A261" opacity="0.2" />
          {/* Zemin Taşları ve Platform */}
          <rect x="20" y="200" width="160" height="15" fill="#D4A373" rx="2" />
          <rect x="30" y="190" width="140" height="12" fill="#E9C46A" rx="1" />
          
          {/* Antik Tapınak Üst Çatı / Alınlık Kısmı */}
          <polygon points="35,90 100,50 165,90" fill="#CDA47E" />
          <rect x="40" y="90" width="120" height="12" fill="#B58A63" />

          {/* Antik Sütunlar (Soldan Sağa 4 adet karakteristik sütun) */}
          {/* Sütun 1 */}
          <rect x="48" y="102" width="12" height="88" fill="#E5BA93" />
          <rect x="45" y="102" width="18" height="6" fill="#CDA47E" rx="1" />
          <rect x="45" y="184" width="18" height="6" fill="#CDA47E" rx="1" />
          
          {/* Sütun 2 */}
          <rect x="78" y="102" width="12" height="88" fill="#E5BA93" />
          <rect x="75" y="102" width="18" height="6" fill="#CDA47E" rx="1" />
          <rect x="75" y="184" width="18" height="6" fill="#CDA47E" rx="1" />

          {/* Sütun 3 (Hafif zamana yenik düşmüş/harabe havası için kırık detaylı veya düz simetrik) */}
          <rect x="108" y="102" width="12" height="88" fill="#E5BA93" />
          <rect x="105" y="102" width="18" height="6" fill="#CDA47E" rx="1" />
          <rect x="105" y="184" width="18" height="6" fill="#CDA47E" rx="1" />

          {/* Sütun 4 */}
          <rect x="138" y="102" width="12" height="88" fill="#E5BA93" />
          <rect x="135" y="102" width="18" height="6" fill="#CDA47E" rx="1" />
          <rect x="135" y="184" width="18" height="6" fill="#CDA47E" rx="1" />

          {/* Yere düşmüş tarihi taş bloklar (Tam harabe efekti) */}
          <rect x="15" y="205" width="20" height="10" transform="rotate(-15 15 205)" fill="#B58A63" rx="1" />
          <rect x="165" y="210" width="15" height="10" transform="rotate(10 165 210)" fill="#CDA47E" rx="1" />
        </svg>
      </div>
    );
  }

  // 2. MAĞARA / YERALTI ŞEHRİ
  if (text.includes("magara") || text.includes("mağara") || text.includes("cave") || text.includes("yeralti") || text.includes("in")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-stone-800 to-stone-950 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-2xl">
          <circle cx="100" cy="110" r="50" fill="#FCEADE" opacity="0.15" filter="blur(4px)" />
          <path d="M 30 50 L 50 110 L 70 50 M 130 50 L 145 100 L 160 50" fill="#4A3E3D" />
          <path d="M 0 50 Q 100 90, 200 50 L 200 0 L 0 0 Z" fill="#362E2D" />
          <path d="M 0 200 Q 100 160, 200 200 L 200 250 L 0 250 Z" fill="#2C2524" />
          <path d="M 0 0 C 40 40, 30 120, 0 250 L 200 250 C 170 150, 160 40, 200 0 Z" fill="none" stroke="#231E1D" strokeWidth="25" />
          <path d="M 0 0 C 40 40, 30 120, 0 250 L 200 250 C 170 150, 160 40, 200 0 Z" fill="none" stroke="#1A1514" strokeWidth="12" />
          <polygon points="40,210 52,140 65,210" fill="#362E2D" />
          <polygon points="120,215 135,130 150,215" fill="#4A3E3D" />
        </svg>
      </div>
    );
  }

  // 3. KİLİSE / MANASTIR / KATEDRAL
  if (text.includes("kilise") || text.includes("church") || text.includes("monastery") || text.includes("manastir") || text.includes("katedral")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-amber-100 to-amber-200 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-lg">
          <path d="M-20 250 Q 60 170, 220 250 Z" fill="#D4A373" opacity="0.5" />
          <rect x="40" y="120" width="120" height="100" fill="#C49A6C" rx="2" />
          <rect x="55" y="90" width="90" height="40" fill="#DEB887" rx="2" />
          <polygon points="50,90 100,35 150,90" fill="#A06A42" />
          <polygon points="35,120 100,85 165,120" fill="#8B5A2B" opacity="0.15" />
          <rect x="98" y="10" width="4" height="25" fill="#5C3A21" rx="1" />
          <rect x="91" y="17" width="18" height="4" fill="#5C3A21" rx="1" />
          <circle cx="100" cy="70" r="14" fill="#4A2F1B" />
          <circle cx="100" cy="70" r="10" fill="#F4A261" />
          <path d="M 65 160 A 10 10 0 0 1 85 160 L 85 190 L 65 190 Z" fill="#4A2F1B" />
          <path d="M 115 160 A 10 10 0 0 1 135 160 L 135 190 L 115 190 Z" fill="#4A2F1B" />
          <path d="M 90 200 A 10 10 0 0 1 110 200 L 110 220 L 90 220 Z" fill="#2E1C0C" />
        </svg>
      </div>
    );
  }

  // 4. ŞELALE / AKARSU / DOĞA
  if (text.includes("selale") || text.includes("şelale") || text.includes("waterfall") || text.includes("ırmak") || text.includes("nehir")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-sky-300 flex items-center justify-center overflow-hidden">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-md">
          <path d="M 0 250 L 55 70 L 105 250 Z" fill="#8B7355" />
          <path d="M 20 250 L 55 70 L 75 250 Z" fill="#7A6448" />
          <path d="M 95 250 L 145 90 L 200 250 Z" fill="#A08866" />
          <path d="M 95 250 L 145 90 L 125 250 Z" fill="#8B7355" />
          <path d="M 65 250 L 75 110 L 115 110 L 125 250 Z" fill="#3A86FF" />
          <path d="M 75 250 L 82 115 L 108 115 L 115 250 Z" fill="#00B4D8" />
          <path d="M 82 250 L 88 130 L 102 130 L 108 250 Z" fill="#90E0EF" opacity="0.75" />
          <path d="M 85 250 L 88 150 L 90 250 Z" fill="#FFFFFF" opacity="0.6" />
          <path d="M 100 250 L 102 160 L 105 250 Z" fill="#FFFFFF" opacity="0.6" />
          <polygon points="15,210 22,190 29,210" fill="#1B4332" />
          <polygon points="170,220 177,200 184,220" fill="#1B4332" />
        </svg>
      </div>
    );
  }

  // 5. CAMİ / KÜLLİYE / TÜRBE
  if (text.includes("cami") || text.includes("mosque") || text.includes("turbe") || text.includes("türbe") || text.includes("mescit")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-emerald-50 to-emerald-200 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-md">
          <rect x="30" y="180" width="140" height="15" fill="#7F8C8D" rx="2" />
          <rect x="55" y="120" width="90" height="60" fill="#BDC3C7" />
          <rect x="65" y="110" width="70" height="10" fill="#95A5A6" />
          <path d="M 65 110 C 65 50, 135 50, 135 110 Z" fill="#34495E" />
          <circle cx="100" cy="45" r="4" fill="#F1C40F" />
          <rect x="40" y="70" width="10" height="110" fill="#ECF0F1" />
          <polygon points="37,70 45,45 53,70" fill="#2C3E50" />
          <rect x="38" y="90" width="14" height="6" fill="#7F8C8D" rx="1" />
          <rect x="150" y="70" width="10" height="110" fill="#ECF0F1" />
          <polygon points="147,70 155,45 163,70" fill="#2C3E50" />
          <rect x="148" y="90" width="14" height="6" fill="#7F8C8D" rx="1" />
          <path d="M 90 180 C 90 155, 110 155, 110 180 Z" fill="#2C3E50" />
        </svg>
      </div>
    );
  }

  // 6. DENİZ / PLAJ / SAHİL / ADA
  if (text.includes("plaj") || text.includes("beach") || text.includes("koy") || text.includes("sahil") || text.includes("deniz") || text.includes("ada")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-orange-100 to-sky-200 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-md">
          <circle cx="140" cy="70" r="22" fill="#E63946" opacity="0.8" />
          <path d="M0 160 Q 50 150, 100 160 T 200 160 L 200 250 L 0 250 Z" fill="#457B9D" />
          <path d="M0 180 Q 50 175, 100 180 T 200 180 L 200 250 L 0 250 Z" fill="#1D3557" />
          <path d="M-10 190 C 30 140, 100 150, 120 190 Z" fill="#E9C46A" />
          <path d="M40 180 Q 50 130, 75 105" stroke="#764114" strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M75 105 Q 50 95, 35 105 M75 105 Q 70 80, 60 70 M75 105 Q 95 85, 110 95 M75 105 Q 90 115, 95 130" stroke="#2A9D8F" strokeWidth="5" fill="none" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // 7. KÖPRÜ / KULE / TARİHİ YAPI
  if (text.includes("kopru") || text.includes("köprü") || text.includes("bridge") || text.includes("kule") || text.includes("saray") || text.includes("kale")) {
    return (
      <div className="relative w-full h-full bg-gradient-to-b from-indigo-100 to-indigo-200 flex items-center justify-center">
        <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-md">
          <rect x="0" y="170" width="200" height="80" fill="#2B2D42" />
          <rect x="45" y="60" width="12" height="130" fill="#EF233C" rx="1" />
          <rect x="135" y="60" width="12" height="130" fill="#EF233C" rx="1" />
          <rect x="0" y="130" width="200" height="10" fill="#8D99AE" />
          <path d="M0 85 Q 45 130, 90 130" stroke="#EDF2F4" strokeWidth="2.5" fill="none" />
          <path d="M57 60 Q 95 130, 135 130" stroke="#EDF2F4" strokeWidth="2.5" fill="none" />
          <path d="M147 60 Q 170 100, 200 130" stroke="#EDF2F4" strokeWidth="2.5" fill="none" />
        </svg>
      </div>
    );
  }

  // 8. GENEL DOĞA / DAĞ / PARK / DİĞER DURUMLAR (Rengarenk Dağ Manzarası)
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-teal-50 to-teal-100 flex items-center justify-center">
      <svg viewBox="0 0 200 250" className="w-44 h-44 drop-shadow-md">
        <polygon points="20,200 95,70 170,200" fill="#A8DADC" />
        <polygon points="80,95 95,70 110,95 102,90 95,95 88,90" fill="#F1FAEE" />
        <path d="M-20 200 Q 50 140, 130 200 T 220 200 L 220 250 L -20 250 Z" fill="#457B9D" />
        <path d="M40 200 Q 110 160, 180 200 L 200 250 L 0 250 Z" fill="#1D3557" opacity="0.4" />
        <polygon points="45,190 52,170 59,190" fill="#1B4332" />
        <polygon points="145,195 152,175 159,195" fill="#1B4332" />
      </svg>
    </div>
  );
};

export default function CityClient({ lang, region, city, cityPlaces, images }: any) {
  const isEn = lang === "en";

  const t = isEn ? {
    badge: "EXPLORE ROUTE",
    suffix2: "amazing spots to discover.",
    exploreBtn: "View Details",
    backBtn: "All Routes",
    hotelBadge: "Stay",
    hotelText: "Hotels in ",
    tourBadge: "Experience",
    tourText: "Tours in "
  } : {
    badge: "KEŞİF ROTASI",
    suffix2: "farklı deneyim sizi bekliyor.",
    exploreBtn: "Detayları Gör",
    backBtn: "Başka Rotalar",
    hotelBadge: "Konaklama",
    hotelText: "Otelleri",
    tourBadge: "Deneyim",
    tourText: "Turları"
  };


  const cityNameMapTR: Record<string, string> = {
  adana: "Adana",
  adiyaman: "Adıyaman",
  afyonkarahisar: "Afyonkarahisar",
  agri: "Ağrı",
  amasya: "Amasya",
  ankara: "Ankara",
  antalya: "Antalya",
  artvin: "Artvin",
  aydin: "Aydın",
  balikesir: "Balıkesir",
  bilecik: "Bilecik",
  bingol: "Bingöl",
  bitlis: "Bitlis",
  bolu: "Bolu",
  burdur: "Burdur",
  bursa: "Bursa",
  canakkale: "Çanakkale",
  cankiri: "Çankırı",
  corum: "Çorum",
  denizli: "Denizli",
  diyarbakir: "Diyarbakır",
  edirne: "Edirne",
  elazig: "Elazığ",
  erzincan: "Erzincan",
  erzurum: "Erzurum",
  eskisehir: "Eskişehir",
  gaziantep: "Gaziantep",
  giresun: "Giresun",
  gumushane: "Gümüşhane",
  hakkari: "Hakkari",
  hatay: "Hatay",
  isparta: "Isparta",
  mersin: "Mersin",
  istanbul: "İstanbul",
  izmir: "İzmir",
  kars: "Kars",
  kastamonu: "Kastamonu",
  kayseri: "Kayseri",
  kirklareli: "Kırklareli",
  kirsehir: "Kırşehir",
  kocaeli: "Kocaeli",
  konya: "Konya",
  kutahya: "Kütahya",
  malatya: "Malatya",
  manisa: "Manisa",
  kahramanmaras: "Kahramanmaraş",
  mardin: "Mardin",
  mugla: "Muğla",
  mus: "Muş",
  nevsehir: "Nevşehir",
  nigde: "Niğde",
  ordu: "Ordu",
  rize: "Rize",
  sakarya: "Sakarya",
  samsun: "Samsun",
  siirt: "Siirt",
  sinop: "Sinop",
  sivas: "Sivas",
  tekirdag: "Tekirdağ",
  tokat: "Tokat",
  trabzon: "Trabzon",
  tunceli: "Tunceli",
  sanliurfa: "Şanlıurfa",
  usak: "Uşak",
  van: "Van",
  yozgat: "Yozgat",
  zonguldak: "Zonguldak",
  aksaray: "Aksaray",
  bayburt: "Bayburt",
  karaman: "Karaman",
  kirikkale: "Kırıkkale",
  batman: "Batman",
  sirnak: "Şırnak",
  bartin: "Bartın",
  ardahan: "Ardahan",
  igdir: "Iğdır",
  yalova: "Yalova",
  karabuk: "Karabük",
  kilis: "Kilis",
  osmaniye: "Osmaniye",
  duzce: "Düzce"
};

  const exploreBase = isEn ? "/en/kesfet" : "/kesfet";
  
  const citySlug = (cityPlaces?.[0]?.cityName || city)?.toLowerCase();

const actualCityKey =
  lang === "tr"
    ? cityNameMapTR[citySlug] || capitalizeCityName(citySlug)
    : capitalizeCityName(citySlug);
  const cityImages = images[city] || images[slugify(city)] || {};

  const availableFeatureCities = ["istanbul", "paris", "roma", "viyana", "dubai", "bangkok", "antalya"];
  
  const currentCitySlug = slugify(city);
  const hasSpecificPage = availableFeatureCities.includes(currentCitySlug);

  const hotelLink = hasSpecificPage ? `/${lang}/hotels/${currentCitySlug}` : `/${lang}/hotels`;
  const tourLink = hasSpecificPage ? `/${lang}/etkinlikler/${currentCitySlug}` : `/${lang}/etkinlikler`;

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION */}
      <section className="pt-24 pb-48 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">
          <nav className="inline-flex items-center gap-3 px-6 py-2.5 bg-white/80 backdrop-blur-md rounded-full mb-10 border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400">
            <Link href={exploreBase} className="hover:text-blue-600 transition-colors">
              {isEn ? "EXPLORE" : "KEŞFET"}
            </Link>
            <ChevronRight size={12} />
            <Link href={`${exploreBase}/${region}`} className="hover:text-blue-600 transition-colors uppercase">
              {region.replace(/-/g, " ")}
            </Link>
            <ChevronRight size={12} />
            <span className="text-blue-600 font-bold">{actualCityKey}</span>
          </nav>

          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 mb-6 text-orange-600 bg-orange-50 px-4 py-1.5 rounded-xl border border-orange-100 shadow-sm">
              <Sparkles size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">{t.badge}</span>
            </div>
            <h1 className="text-7xl md:text-9xl font-serif font-bold text-gray-900 mb-8 tracking-tighter leading-none">
              {actualCityKey}
            </h1>
            <p className="text-xl text-gray-500 font-medium italic opacity-80">
              {cityPlaces.length} {t.suffix2}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PLACES GRID */}
      <section className="container mx-auto px-6 -mt-24 pb-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {cityPlaces.map((place: any) => {
            const placeName = place.name?.[lang] || place.name?.tr || "Place";
            const imageKey = `${slugify(actualCityKey)}-${slugify(place.slug)}`;
            const coverImage = cityImages[imageKey]?.[0] || cityImages[place.slug]?.[0];

            return (
              <Link
                key={place.slug}
                href={`${exploreBase}/${region}/${city}/${place.slug}`}
                className="group relative flex flex-col bg-white rounded-[3rem] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {coverImage ? (
                    <img
                      src={getCloudinaryUrl(coverImage, 600)}
                      alt={placeName}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                  ) : (
                    /* 🌟 Tamamen Özelleştirilmiş Vektörel Kart Arka Planı */
                    <div className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-105">
                      {getFallbackIllustration(placeName, place.slug)}
                      <div className="absolute top-6 left-6 bg-white/80 backdrop-blur-md p-2 rounded-full shadow-sm">
                        <MapPin size={16} className="text-gray-600" />
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-10 z-10">                   
                  <h3 className="text-3xl font-serif font-bold text-white mb-4 group-hover:text-blue-200 transition-colors leading-tight">
                    {placeName}
                  </h3>
                  <div className="flex items-center justify-between opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-white/80 text-[10px] font-black uppercase tracking-widest">{t.exploreBtn}</span>
                    <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xl">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. FOOTER ACTIONS */}
      <footer className="container mx-auto px-6 pb-24">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 bg-gray-900 p-8 md:p-10 rounded-[3.5rem] relative overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px] opacity-10"></div>
          
          <div className="flex items-center gap-4 text-left w-full md:w-auto">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-blue-400 shrink-0">
              <Globe2 size={24} />
            </div>
            <div>
              <h4 className="text-white font-serif text-xl font-bold tracking-tight">
                {actualCityKey}
              </h4>
              <p className="text-gray-400 text-xs mt-0.5">
                {isEn ? "Discover hotel options, local tours and alternative routes." : "Otel seçeneklerini, yerel turları ve alternatif rotaları keşfedin."}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto shrink-0">
            <Link
              href={hotelLink}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-orange-500 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg flex flex-col items-start min-w-[160px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black opacity-80 flex items-center gap-1">
                <Hotel size={10} /> {t.hotelBadge}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {isEn ? `${t.hotelText}${actualCityKey}` : `${actualCityKey} ${t.hotelText}`}
              </span>
            </Link>

            <Link
              href={tourLink}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-white/10 text-white border border-white/10 transition-all duration-300 hover:bg-white/20 hover:scale-105 flex flex-col items-start min-w-[160px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black text-orange-400 flex items-center gap-1">
                <Ticket size={10} /> {t.tourBadge}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {isEn ? `${t.tourText}${actualCityKey}` : `${actualCityKey} ${t.tourText}`}
              </span>
            </Link>

            <Link
              href={exploreBase}
              className="w-full sm:w-auto group relative overflow-hidden px-6 py-4 rounded-2xl bg-white text-black transition-all duration-300 hover:bg-blue-600 hover:text-white hover:scale-105 flex flex-col items-start justify-center min-w-[140px] h-[52px]"
            >
              <span className="text-[9px] tracking-widest uppercase font-black text-gray-400 group-hover:text-white/80">
                {isEn ? "EXPLORE" : "KEŞFET"}
              </span>
              <span className="text-xs font-bold mt-0.5 whitespace-nowrap">
                {t.backBtn}
              </span>
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}