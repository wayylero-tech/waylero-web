import CityPageClient from "./CityPageClient";

// Yardımcı fonksiyonlar
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

type Params = { city: string; lang: 'tr' | 'en' };

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;
  const citySlug = city.toLowerCase();
  const cityName = capitalize(citySlug);

  const isTR = lang === 'tr';
  const title = isTR ? `${cityName} Turlar & Deneyimler | Waylero` : `${cityName} Tours & Experiences | Waylero`;
  const description = isTR 
    ? `${cityName} şehrindeki en iyi turları, etkinlikleri ve gezilecek yerleri keşfedin.` 
    : `Discover the best tours, events, and things to do in ${cityName}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `https://www.waylero.com/${lang === 'en' ? 'en/' : ''}etkinlikler/${citySlug}`,
      languages: {
        'tr-TR': `https://www.waylero.com/etkinlikler/${citySlug}`,
        'en-US': `https://www.waylero.com/en/etkinlikler/${citySlug}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `https://www.waylero.com/${lang === 'en' ? 'en/' : ''}etkinlikler/${citySlug}`,
      siteName: "Waylero",
      type: "website",
      locale: isTR ? 'tr_TR' : 'en_US',
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { city, lang } = await params;
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: capitalize(city),
            description: `${city} tours and experiences`,
            url: `https://www.waylero.com/${lang === 'en' ? 'en/' : ''}etkinlikler/${city}`,
          }),
        }}
      />
      <CityPageClient city={city} lang={lang} />
    </>
  );
}

// ✅ Statik üretim için şehir listesini artık başka bir kaynaktan almalısın 
// veya bu kısmı tamamen kaldırıp dynamic rendering'e bırakabilirsin.
// Şimdilik boş bir array dönüyorum veya bu fonksiyonu silebilirsin.
export function generateStaticParams() {
  return [];
}