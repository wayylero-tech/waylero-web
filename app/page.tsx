"use client";

import { useEffect } from "react";
import Link from "next/link";
import HomeSearch from "./HomeSearch";
import HomeBlogSlider from "./components/HomeBlogSlider";

/* 🔹 QUICK MENU */
const quickMenu = [
  { title: "Aktiviteler", image: "/assets/menu/aktiviteler.png", route: "/aktiviteler" },
  { title: "Keşfet", image: "/assets/menu/kesfet.png", route: "/kesfet" },
  { title: "Harita", image: "/assets/menu/harita.png", url: "https://www.google.com/maps" },
 {
  title: "Seyehat Rehberi ✍️",
  image: "/assets/blog/konya/tinaztepe/cover.png",
  route: "/blog",
},
];

/* 🔹 ÖNE ÇIKAN ŞEHİRLER */
const featuredCities = [
  { name: "İstanbul", slug: "istanbul", country: "turkiye", image: "/assets/cities/istanbul.png" },
  { name: "Viyana", slug: "viyana", country: "avusturya", image: "/assets/cities/viyana.png" },
  { name: "Dubai", slug: "dubai", country: "bae", image: "/assets/cities/dubai.png" },
  { name: "New York", slug: "newyork", country: "amerika", image: "/assets/cities/new.png" },
  { name: "Pekin", slug: "pekin", country: "cin", image: "/assets/cities/pekin.png" },
  { name: "Paris", slug: "paris", country: "fransa", image: "/assets/cities/paris.png" },
  { name: "Londra", slug: "londra", country: "ingiltere", image: "/assets/cities/londra.png" },
  { name: "Antalya", slug: "antalya", country: "turkiye", image: "/assets/cities/antalya.png" },
  { name: "Tokyo", slug: "tokyo", country: "japonya", image: "/assets/cities/tokyo.png" },
  { name: "Hong Kong", slug: "hongkong", country: "cin", image: "/assets/cities/hongkong.png" },
  { name: "Bangkok", slug: "bangkok", country: "tayland", image: "/assets/cities/bangkok.png" },
  { name: "Singapur", slug: "singapur", country: "singapur", image: "/assets/cities/singapur.png" },
  { name: "Barselona", slug: "barselona", country: "ispanya", image: "/assets/cities/barcelona.png" },
  { name: "Roma", slug: "roma", country: "italya", image: "/assets/cities/roma.png" },
  { name: "Mekke", slug: "mekke", country: "suudi-arabistan", image: "/assets/cities/mekke.png" },
];


/* 🔹 REKLAM SLOT */
function AdSlot({ slot }: { slot: string }) {
  return (
    <div className="relative w-[160px] h-[600px] overflow-hidden rounded-xl">
      <ins
        className="adsbygoogle block w-full h-full"
        style={{ display: "block" }}
        data-ad-client="ca-pub-4779947503854024"
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="false"
      />
    </div>
  );
}

export default function HomePage() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const ads = document.querySelectorAll(".adsbygoogle");
    ads.forEach((ad) => {
      // @ts-ignore
      if (!ad.getAttribute("data-adsbygoogle-status")) {
        try {
          // @ts-ignore
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch {}
      }
    });
  }, []);

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col">
      <div className="flex-1 flex justify-center max-w-[1600px] mx-auto gap-4 w-full">

        <aside className="hidden xl:block sticky top-10">
          <AdSlot slot="6195494093" />
        </aside>

        <div className="flex-1 max-w-6xl bg-white shadow-sm px-4 py-6">

          {/* HEADER */}
          <header className="mb-6">
            <div className="flex items-center justify-between">
              
              {/* SOL TARAF */}
              <div className="flex flex-col items-start">
                <Link href="/" target="_blank" rel="noopener noreferrer">
                  <img src="/assets/logo.png" className="h-20" />
                </Link>
                <p className="mt-4 text-base font-semibold ml-6 
                  bg-gradient-to-r from-blue-700 via-cyan-500 to-blue-500 
                  bg-clip-text text-transparent">
                  Keşfet, Planla, Paylaş.
                </p>
              </div>

              {/* SAĞ LOGO */}
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <img src="/assets/logo-sag.png" className="h-40" />
              </Link>
            </div>
          </header>

          <HomeSearch />

          {/* QUICK MENU */}
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-10">
            {quickMenu.map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                {item.url ? (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-60 w-full rounded-2xl overflow-hidden block"
                  >
                    <div
                      className="h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </a>
                ) : (
                  <Link
                    href={item.route!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-60 w-full rounded-2xl overflow-hidden block"
                  >
                    <div
                      className="h-full bg-cover bg-center"
                      style={{ backgroundImage: `url(${item.image})` }}
                    />
                  </Link>
                )}
                <span className="mt-2 font-medium">{item.title}</span>
              </div>
            ))}
          </section>

          <HomeBlogSlider />

          {/* FEATURED CITIES */}
<section className="mt-10">
  <h2 className="text-xl font-bold mb-4">Dünyanın En Çok Ziyaret Edilen Şehirleri</h2>
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
    {featuredCities.map((c) => {
      const countrySlug = c.country.toLowerCase().replace(/ /g, "-"); // ülke slug
      return (
        <Link
          key={c.slug}
         href={`/${c.country.toLowerCase().replace(/ /g, "-")}/${c.slug}`}
          className="relative h-60 rounded-2xl overflow-hidden block group"
        >
          <div
            className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform"
            style={{ backgroundImage: `url(${c.image})` }}
          />
          <div className="absolute inset-0 bg-black/30" />
          <span className="absolute bottom-4 left-4 text-white font-semibold text-lg">
            {c.name}
          </span>
        </Link>
      );
    })}
  </div>
</section>

        </div>

        <aside className="hidden xl:block sticky top-10">
          <AdSlot slot="5241070307" />
        </aside>
      </div>
    </main>
  );
}
