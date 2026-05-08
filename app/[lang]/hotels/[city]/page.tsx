import HotelCityPageClient from "./HotelCityPageClient";

type Params = { lang: string; city: string };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { lang, city } = await params;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  return {
    title: lang === "tr" ? `${cityName} Otelleri | En İyi Fiyatlarla` : `Best Hotels in ${cityName} | Book Now`,
    description: `${cityName} şehri için en uygun konaklama seçeneklerini listeleyin.`
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;

  // Sadece o şehre ait kart verisi
  const cityData = [
    {
      id: 1,
      city: city, // URL'den gelen şehir (örn: antalya)
      link: "https://booking.tp.st/3YML2Z43", // Affiliate linkin
    }
  ];

  return (
    <HotelCityPageClient
      city={city}
      lang={lang as "tr" | "en"}
      cityHotels={cityData}
    />
  );
}