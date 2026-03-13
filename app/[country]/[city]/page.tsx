import cities from "../../data/cities.json";
import { notFound } from "next/navigation";

// 🔹 Tip tanımı
type City = {
  slug: string;
  country: string;
  region?: string;
  image: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  additionalImages?: string[];
  travel_info?: Record<
    string,
    {
      best_time: string;
      timezone: string;
      currency: string;
      language: string;
      population: string;
    }
  >;
};

type Props = {
  params: Promise<{
    country: string;
    city: string;
  }>;
};

// 🔹 Static export için tüm parametreleri üret
export async function generateStaticParams() {
  return cities.map((city) => ({
    country: city.country.toLowerCase().replace(/ /g, "-"),
    city: city.slug,
  }));
}

// 🔹 Server Component
export default async function CityPage({ params }: Props) {
  const { country, city: citySlug } = await params; // <-- await ile açıyoruz

  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.country.toLowerCase().replace(/ /g, "-") === country
  );

  if (!city) return notFound();

  const lang = "tr";
  const travelInfo = city.travel_info?.[lang] || city.travel_info?.["tr"];

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black">
        <img
          src={city.image}
          alt={city.names[lang]}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <h1 className="absolute bottom-6 left-6 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
          {city.names[lang] || city.names["tr"]}
        </h1>
      </div>

      <p className="mt-4 text-gray-500 text-lg font-medium">{city.country}</p>
      <p className="mt-6 text-gray-700 leading-relaxed text-justify">
        {city.descriptions[lang] || city.descriptions["tr"]}
      </p>

      {travelInfo && (
        <div className="mt-10">
          <h2 className="text-2xl font-semibold mb-6">✈️ Seyahat Bilgileri</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-gray-100">
              <p className="text-sm text-gray-500">🌤 En iyi zaman</p>
              <p className="font-semibold">{travelInfo.best_time}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100">
              <p className="text-sm text-gray-500">🕒 Saat Dilimi</p>
              <p className="font-semibold">{travelInfo.timezone}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100">
              <p className="text-sm text-gray-500">💶 Para Birimi</p>
              <p className="font-semibold">{travelInfo.currency}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100">
              <p className="text-sm text-gray-500">🗣 Dil</p>
              <p className="font-semibold">{travelInfo.language}</p>
            </div>
            <div className="p-4 rounded-xl bg-gray-100">
              <p className="text-sm text-gray-500">👥 Nüfus</p>
              <p className="font-semibold">{travelInfo.population}</p>
            </div>
          </div>
        </div>
      )}

      {city.additionalImages?.length ? (
        <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-4">
          {city.additionalImages.map((img, idx) => (
            <div
              key={idx}
              className="w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black"
            >
              <img
                src={img}
                alt={`${city.names[lang]} ${idx + 1}`}
                className="w-full h-full object-cover object-center"
              />
            </div>
          ))}
        </div>
      ) : null}

      <div className="mt-14 flex justify-center">
        <a
          href={`/kesfet?q=${encodeURIComponent(citySlug)}`}
          className="px-10 py-4 rounded-full bg-black text-white text-lg font-semibold hover:bg-gray-800 transition"
        >
          📍 {city.names[lang]}’da Gezilecek Yerler
        </a>
      </div>
    </main>
  );
}
