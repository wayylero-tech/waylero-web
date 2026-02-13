import cities from "../../data/cities.json";
import { notFound } from "next/navigation";

// 🔹 Static export için tüm parametreleri üret
export async function generateStaticParams() {
  return cities.map((city) => ({
    region: city.region,
    city: city.slug,
  }));
}

// 🔹 Tip tanımı
type City = {
  slug: string;
  region: string;
  country: string;
  image: string;
  names: Record<string, string>;
  descriptions: Record<string, string>;
  additionalImages?: string[];
};

type Props = {
  params: Promise<{
    region: string;
    city: string;
  }>;
};

// 🔹 Server Component
export default async function CityPage({ params }: Props) {
  const { region, city: citySlug } = await params;

  const city = (cities as City[]).find(
    (c) => c.slug === citySlug && c.region === region
  );

  if (!city) return notFound();

  const lang = "tr";

  return (
    <main className="max-w-5xl mx-auto px-4 py-8">
      {/* HERO IMAGE */}
      <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden bg-black">
        <img
          src={city.image}
          alt={city.names[lang]}
          className="absolute inset-0 w-full h-full object-cover object-center"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Title */}
        <h1 className="absolute bottom-6 left-6 text-white text-4xl md:text-5xl font-bold drop-shadow-lg">
          {city.names[lang] || city.names["tr"]}
        </h1>
      </div>

      {/* Country */}
      <p className="mt-4 text-gray-500 text-lg font-medium">
        {city.country}
      </p>

      {/* Description */}
      <p className="mt-6 text-gray-700 leading-relaxed text-justify">
        {city.descriptions[lang] || city.descriptions["tr"]}
      </p>

      {/* Additional images */}
      {city.additionalImages?.length ? (
        <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
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

      {/* 🔥 GEZİLECEK YERLER BUTONU */}
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
