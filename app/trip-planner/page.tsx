import { headers } from "next/headers";
import TripPlannerClient from "./TripPlannerClient";

const translations = {
  tr: {
    title: "Yapay Zeka Destekli Gezi Planlayıcı | Explore",
    description: "Mükemmel rotanı oluştur, harita üzerinde gez ve PDF olarak indir.",
  },
  en: {
    title: "AI-Powered Trip Planner | Explore",
    description: "Create your perfect itinerary, explore on the map, and download as PDF.",
  },
};

// 1. Dinamik Metadata
export async function generateMetadata() {
  const headerList = await headers(); // await ekledik
  const lang = headerList.get("x-url-lang") || "tr";
  
  const t = translations[lang === "en" ? "en" : "tr"];

  return {
    title: t.title,
    description: t.description,
  };
}

// 2. Server Component
export default async function Page() { // async yaptık
  const headerList = await headers(); // await ekledik
  const lang = headerList.get("x-url-lang") || "tr";

  return (
    <main>
      <TripPlannerClient lang={lang} />
    </main>
  );
}