

import { notFound } from "next/navigation";
import { cookies, headers } from "next/headers";
import { cache } from "react";
import Link from "next/link"; // <--- BU SATIRI EKLE
import PlaceSlider from "./PlaceSlider";
import fs from "fs";
import path from "path";
import { slugify } from "@/lib/utils/slugify";
import { Sparkles, MapPin, Navigation, Calendar, Info, Activity, ArrowRight } from "lucide-react";
export const runtime = "nodejs";
const BASE_URL = "https://www.waylero.com";

type Params = { region: string; city: string; place: string };

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1.25;
}

async function getLanguage() {
  const h = await headers();
  const currentPath = h.get("x-url") || "";
  const middlewareLang = h.get("x-url-lang");
  if (middlewareLang === "en" || currentPath.includes("/en/")) return "en";
  const cookieStore = await cookies();
  return (cookieStore.get("lang")?.value || "tr") as "tr" | "en";
}

const loadCityData = cache(async (region: string, city: string) => {
  const filePath = path.join(process.cwd(), "app/data/ulkelerdata", region, `${city}.json`);
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
});

const loadImages = cache((region: string) => {
  const filePath = path.join(process.cwd(), "app/data/ulkedataimages", `${region}.json`);
  return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf-8")) : {};
});

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();
  const cityData = await loadCityData(region, city);
  if (!cityData) return { title: "Waylero" };
  const found = cityData.find((p: any) => slugify(p.slug) === slugify(decodeURIComponent(place)));
  if (!found) return { title: "Waylero" };
  const name = found.name?.[lang] || found.name?.tr;
  const seo = {
    tr: { title: `${name} | Gezi Rehberi`, desc: `${name} hakkında bilgiler ve gezilecek yerler.` },
    en: { title: `${name} | Travel Guide`, desc: `Discover ${name} and nearby places.` },
  }[lang];
  return { title: `${seo.title} | Waylero`, description: (seo.desc + " " + (found.description?.[lang] || "")).slice(0, 158) };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { region, city, place } = await params;
  const lang = await getLanguage();
  const cityData = await loadCityData(region, city);
  if (!cityData) return notFound();

  const foundPlace = cityData.find((p: any) => slugify(p.slug) === slugify(decodeURIComponent(place)));
  if (!foundPlace) return notFound();

  const imagesData = loadImages(region);
  const imageGroup = imagesData[city] || {};
  const imageKey = `${slugify(city)}-${slugify(foundPlace.slug)}`;
  const images = imageGroup[imageKey] || [];

  const nearbyPlaces = cityData
    .filter((p: any) => p.slug !== foundPlace.slug && p.latitude && p.longitude)
    .map((p: any) => ({
      ...p,
      distance: getDistance(foundPlace.latitude, foundPlace.longitude, p.latitude, p.longitude),
    }))
    .sort((a: any, b: any) => a.distance - b.distance)
    .slice(0, 3);

  const t = {
    tr: {
      badge: "DENEYİM NOKTASI",
      about: "Mekan Hakkında",
      todo: "Burada Neler Yapılır?",
      nearby: "Çevreyi Keşfet",
      location: "Harita Konumu",
      noPhoto: "Fotoğraf henüz eklenmedi",
      unit: "km",
      distanceNote: "yakınında",
      eventsTitle: "Etkinlikleri",
      eventsText: "Konser ve festivalleri kaçırma →"
    },
    en: {
      badge: "EXPERIENCE POINT",
      about: "About the Place",
      todo: "Things to Do Here",
      nearby: "Explore Nearby",
      location: "Map Location",
      noPhoto: "No photos yet",
      unit: "km",
      distanceNote: "away",
      eventsTitle: "Events",
      eventsText: "Don't miss concerts and festivals →"
    }
  }[lang];

  const langPrefix = lang === "en" ? "/en" : "";
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <main className="min-h-screen bg-white">
      {/* 1. HERO SECTION: Diagonal Signature with Integrated Slider */}
      <section className="relative pt-20 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 backdrop-blur-md text-orange-600 text-[10px] font-black uppercase tracking-[0.2em] rounded-full mb-6 border border-orange-100 shadow-sm">
              <Sparkles size={14} />
              <span>{t.badge}</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-serif font-bold text-gray-900 mb-6 tracking-tighter leading-tight max-w-4xl">
              {foundPlace.name?.[lang]}
            </h1>
            <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-widest">
              <MapPin size={14} className="text-blue-500" />
              <span>{region} / {city}</span>
            </div>
          </div>

          {/* Place Slider: Centered Jewel */}
          <div className="max-w-5xl mx-auto relative z-10">
            {images.length > 0 ? (
              <div className="rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white">
                <PlaceSlider images={images} title={foundPlace.name?.[lang]} />
              </div>
            ) : (
              <div className="h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-[3rem] border-4 border-dashed border-gray-200 text-gray-300 gap-4">
                <Info size={48} />
                <span className="font-bold uppercase tracking-widest text-xs">{t.noPhoto}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. CONTENT GRID */}
      <section className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                  <Info size={24} />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">{t.about}</h2>
              </div>
              <p className="text-xl text-gray-600 leading-relaxed font-medium">
                {foundPlace.description?.[lang]}
              </p>
            </div>

            {/* Map Section */}
            {foundPlace.latitude && foundPlace.longitude && (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
        <Navigation size={24} />
      </div>
      <h2 className="text-3xl font-serif font-bold text-gray-900">{t.location}</h2>
    </div>
    <div className="rounded-[3rem] overflow-hidden shadow-xl border border-gray-100 h-[450px]">
      <iframe
        className="w-full h-full"
        src={`https://maps.google.com/maps?q=${foundPlace.latitude},${foundPlace.longitude}&z=15&output=embed`}
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
)}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-10">
            
            {/* Activities Card */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center gap-3 mb-6">
                <Activity className="text-orange-500" size={20} />
                <h3 className="font-serif font-bold text-xl">{t.todo}</h3>
              </div>
              <ul className="space-y-4">
                {(foundPlace.activities?.[lang] || []).map((a: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-gray-600 group">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 group-hover:scale-150 transition-transform" />
                    <span className="text-sm font-medium">{a}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Events Card (Turkiye Only) */}
            {region === "turkiye" && (
              <Link
                href={`${langPrefix}/aktiviteler?city=${city}`}
                className="block bg-gradient-to-br from-green-600 to-green-800 rounded-[2.5rem] p-8 text-white shadow-lg hover:scale-[1.02] transition-transform"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Calendar size={24} />
                  <h3 className="font-serif font-bold text-xl">{cityName} {t.eventsTitle}</h3>
                </div>
                <p className="text-green-100 text-sm mb-6 opacity-90">{t.eventsText}</p>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest">
                  <span>KEŞFETMEYE BAŞLA</span>
                  <ArrowRight size={14} />
                </div>
              </Link>
            )}

            {/* Nearby Places Card */}
            <div className="bg-gray-50 rounded-[2.5rem] p-8 border border-gray-100">
              <h3 className="font-serif font-bold text-xl mb-6">{t.nearby}</h3>
              <div className="space-y-6">
                {nearbyPlaces.map((p: any) => (
                  <Link
                    key={p.slug}
                    href={`${langPrefix}/kesfet/${region}/${city}/${p.slug}`}
                    className="flex flex-col gap-1 group"
                  >
                    <span className="text-gray-900 font-bold group-hover:text-blue-600 transition-colors">
                      {p.name?.[lang]}
                    </span>
                    <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
                      {p.distance.toFixed(1)} {t.unit} {t.distanceNote}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}