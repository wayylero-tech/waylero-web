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
    title: "Haftanın Önerisi",
    image: "/assets/blog/konya/tinaztepe/cover.png",
    route: "/oneriler/tinaztepe",
  },
];

/* 🔹 ÖNE ÇIKAN ŞEHİRLER */
const featuredCities = [
  { name: "İstanbul", slug: "istanbul", region: "turkiye", image: "/assets/cities/istanbul.png" },
  { name: "Viyana", slug: "viyana", region: "avrupa", image: "/assets/cities/viyana.png" },
  { name: "Dubai", slug: "dubai", region: "asya", image: "/assets/cities/dubai.png" },
  { name: "New York", slug: "newyork", region: "amerika", image: "/assets/cities/new.png" },
  { name: "Pekin", slug: "pekin", region: "asya", image: "/assets/cities/pekin.png" },
  { name: "Paris", slug: "paris", region: "avrupa", image: "/assets/cities/paris.png" },
  { name: "Londra", slug: "londra", region: "avrupa", image: "/assets/cities/londra.png" },
  { name: "Antalya", slug: "antalya", region: "turkiye", image: "/assets/cities/antalya.png" },
  { name: "Tokyo", slug: "tokyo", region: "asya", image: "/assets/cities/tokyo.png" },
  { name: "Hong Kong", slug: "hongkong", region: "asya", image: "/assets/cities/hongkong.png" },
  { name: "Bangkok", slug: "bangkok", region: "asya", image: "/assets/cities/bangkok.png" },
  { name: "Singapur", slug: "singapur", region: "asya", image: "/assets/cities/singapur.png" },
  { name: "Barselona", slug: "barselona", region: "avrupa", image: "/assets/cities/barcelona.png" },
  { name: "Roma", slug: "roma", region: "avrupa", image: "/assets/cities/roma.png" },
  { name: "Kuala Lumpur", slug: "kualalumpur", region: "asya", image: "/assets/cities/kualalumpur.png" },
  { name: "Mekke", slug: "mekke", region: "asya", image: "/assets/cities/mekke.png" },
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

  const openNearbyPharmacies = () => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        window.open(
          `https://www.google.com/maps/search/eczane/@${coords.latitude},${coords.longitude},14z`,
          "_blank",
          "noopener,noreferrer"
        );
      },
      () => alert("Konum alınamadı")
    );
  };

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col">
      <div className="flex-1 flex justify-center max-w-[1600px] mx-auto gap-4 w-full">

        <aside className="hidden xl:block sticky top-10">
          <AdSlot slot="6195494093" />
        </aside>

        <div className="flex-1 max-w-6xl bg-white shadow-sm px-4 py-6">

          {/* HEADER */}
          <header className="flex items-center justify-between mb-6">
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/logo.png" className="h-20" />
            </Link>
            <Link href="/" target="_blank" rel="noopener noreferrer">
              <img src="/assets/logo-sag.png" className="h-20" />
            </Link>
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
            <h2 className="text-xl font-bold mb-4">Öne Çıkan Şehirler</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {featuredCities.map((c) => (
                <Link
                  key={c.slug}
                  href={`/${c.region}/${c.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
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
              ))}
            </div>
          </section>
        </div>

        <aside className="hidden xl:block sticky top-10">
          <AdSlot slot="5241070307" />
        </aside>
      </div>

    {/* 🔻 FOOTER */}
      <footer className="border-t bg-gray-50 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 grid md:grid-cols-3 gap-6 text-sm text-gray-600">

          <div>
            <img src="/assets/logo.png" className="h-10 mb-2" />
            <p>Waylero © {new Date().getFullYear()}</p>
            <p>Keşfet, planla, paylaş.</p>
          </div>

          <div className="flex flex-col gap-1">
            <Link href="/hakkimizda">Hakkımızda</Link>
            <Link href="/privacy">Gizlilik Politikası</Link>
            <Link href="/terms">Kullanıcı Sözleşmesi</Link>
          </div>

          <div className="flex justify-between md:justify-end gap-6">

            <div>
              <span className="font-semibold">Bizi Takip Et</span>
              <div className="flex gap-2 mt-1">
                <a href="https://www.instagram.com/waylero_ile_kesfet/" target="_blank">
                  <img src="/assets/social/instagram.png" className="h-6" />
                </a>
                <a href="https://www.facebook.com/share/1cc67aspSp/" target="_blank">
                  <img src="/assets/social/facebook.png" className="h-6" />
                </a>
                <a href="https://www.youtube.com/@way_lero" target="_blank">
                  <img src="/assets/social/youtube.png" className="h-6" />
                </a>
                <a href="https://x.com/wayylero" target="_blank">
                  <img src="/assets/social/x.png" className="h-6" />
                </a>
              </div>
            </div>

            <div className="text-right">
              <span className="font-semibold">Uygulamayı İndir</span>
              <div className="flex gap-2 mt-1">
                <a
                  href="https://play.google.com/store/apps/details?id=app.waylero.mobile"
                  target="_blank"
                >
                  <img src="/assets/store/google-play.png" className="h-6" />
                </a>
                <img src="/assets/store/app-store.png" className="h-6 opacity-50" />
              </div>
            </div>

          </div>
        </div>
      </footer>

    </main>
  );
}