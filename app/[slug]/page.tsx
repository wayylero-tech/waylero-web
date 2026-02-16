import { notFound } from "next/navigation";
import turkey from "../data/turkey.json";
import asia from "../data/asia.json";
import europa from "../data/europa.json";

type RegionData = {
  [city: string]: {
    slug: string;
  }[];
};

const regions = [
  { name: "turkey", data: turkey as RegionData },
  { name: "asia", data: asia as RegionData },
  { name: "europa", data: europa as RegionData },
];

export default function SlugPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  for (const region of regions) {
    for (const city in region.data) {
      const place = region.data[city].find(
        (p) => p.slug === slug
      );

      if (place) {
        return (
          <main style={{ padding: 40 }}>
            <h1>{slug}</h1>
            <p>
              <a href={`/kesfet/${region.name}/${city}/${slug}`}>
                Detay sayfasına git
              </a>
            </p>
          </main>
        );
      }
    }
  }

  notFound();
}
