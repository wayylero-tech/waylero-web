import EtkinliklerClient from "./EtkinliklerClient";
import globalPlaces from "@/data/globalPlaces.json";

type Props = {
  params: Promise<{ lang?: string }>;
};

type Place = {
  country?: string;
  city?: string;
  image?: string;
};

type City = {
  id: string;
  country: string;
  image: string;
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const lang = resolvedParams?.lang === "en" ? "en" : "tr";

  const cityMap = new Map<string, City>();

  for (const place of globalPlaces as Place[]) {
    const rawCity = place.city?.trim();
    const rawCountry = place.country?.trim();

    if (!rawCity || !rawCountry) continue;

    const city = rawCity.toLowerCase();
    const country = rawCountry.toLowerCase();

    const existing = cityMap.get(city);

    if (!existing) {
      cityMap.set(city, {
        id: city,
        country,
        image: place.image?.trim() || "",
      });
      continue;
    }

    if (!existing.image && place.image?.trim()) {
      existing.image = place.image.trim();
    }
  }

  const cities = Array.from(cityMap.values());

  return (
    <EtkinliklerClient
      currentLang={lang}
      cities={cities}
    />
  );
}