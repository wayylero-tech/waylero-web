import TripPlannerClient from "../TripPlannerClient"; // 🚀 Bir üst klasördeki bileşeni çağırıyoruz
import { Suspense } from "react";
import { notFound } from "next/navigation";
import globalPlacesData from "@/data/globalPlaces.json"; // 🚀 Senin JSON veri yolun

type Props = {
  params: Promise<{ lang: string; city: string }>;
};

// ✅ ŞEHRE ÖZEL DİNAMİK METADATA
export async function generateMetadata({ params }: Props) {
  const { lang, city } = await params;
  const currentLang = lang === "en" ? "en" : "tr";
  
  // Şehir isminin baş harfini büyütelim (Örn: istanbul -> Istanbul)
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  const title = currentLang === "en" 
    ? `${cityName} Trip Planner & Custom Itinerary | Waylero` 
    : `${cityName} Gezi Planlayıcı ve Sana Özel Rota | Waylero`;

  const description = currentLang === "en"
    ? `Create your custom ${cityName} travel itinerary, explore tourist attractions on the map.`
    : `${cityName} için harika bir gezi rotası oluştur, popüler yerleri haritada keşfet.`;

  const baseUrl = "https://www.waylero.com";
  const path = `/trip-plan/${city.toLowerCase()}`;

  return {
    title,
    description: description, // 🚀 Hata buradaydı kanka, blockquote yerine temizce description değişkenini bağladık!

    // ✅ CANONICAL (Her şehrin kendi URL'i indexlensin kanka)
    alternates: {
      canonical: `${baseUrl}/${currentLang}${path}`,
      languages: {
        tr: `${baseUrl}/tr${path}`,
        en: `${baseUrl}/en${path}`,
      },
    },

    openGraph: {
      title,
      description,
      url: `${baseUrl}/${currentLang}${path}`,
      siteName: "Waylero",
      locale: currentLang === "en" ? "en_US" : "tr_TR",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

// ✅ PAGE
export default async function CityPage({ params }: Props) {
  const { lang, city } = await params;
  const currentLang = lang === "en" ? "en" : "tr";
  const currentCity = city.toLowerCase();

  // 🚀 Güvenlik Kontrolü: Gelen şehir bizim JSON data içinde var mı?
  const cityExists = globalPlacesData.some(
    (place) => place.city.toLowerCase() === currentCity
  );

  // Eğer json içinde bu şehir hiç yoksa, Next.js otomatik 404 sayfasına atsın
  if (!cityExists) {
    notFound();
  }

  return (
    <main>
      <Suspense fallback={<div>Yükleniyor...</div>}>
        {/* 🚀 URL'den gelen şehri istemci bileşenine ilk değer olarak paslıyoruz */}
        <TripPlannerClient lang={currentLang} initialCity={currentCity} />
      </Suspense>
    </main>
  );
}