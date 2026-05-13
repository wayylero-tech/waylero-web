export default function TourGrid({ lang = "tr" }: any) {
  const activeLang = lang === "en" ? "en" : "tr";

  const t = {
    tr: {
      reserve: "İncele ve Rezervasyon Yap",
      durationLabel: "Süre:",
    },
    en: {
      reserve: "View and Book Now",
      durationLabel: "Duration:",
    },
  }[activeLang];

 const tours = [
  { city: "İstanbul", link: "https://getyourguide.tp.st/nTBcXECr", imageUrl: "/assets/sehir1/istanbul.webp", title: "İstanbul Turları" },
  { city: "Nevşehir", link: "https://getyourguide.tp.st/jf5oS4u4", imageUrl: "/assets/sehir1/nevsehir.webp", title: "Kapadokya Turları" },
  { city: "Antalya", link: "https://getyourguide.tp.st/hwXRhIEO", imageUrl: "/assets/sehir1/antalya.webp", title: "Antalya Turları" },
  { city: "İzmir", link: "https://getyourguide.tp.st/Zcv1aMld", imageUrl: "/assets/sehir1/izmir.webp", title: "İzmir Turları" },
  { city: "Muğla", link: "https://getyourguide.tp.st/lzZDpwcu", imageUrl: "/assets/sehir1/mugla.webp", title: "Muğla Turları" },
  { city: "Aydın", link: "https://getyourguide.tp.st/hkZDFUO7", imageUrl: "/assets/sehir1/aydin.webp", title: "Aydın Turları" },
  { city: "Trabzon", link: "https://getyourguide.tp.st/fSiK9Sbq", imageUrl: "/assets/sehir1/trabzon.webp", title: "Trabzon Turları" },
  { city: "Viyana", link: "https://getyourguide.tp.st/Y1byIa5k", imageUrl: "/assets/sehir1/viyana.webp", title: "Viyana Turları" },
  { city: "Roma", link: "https://getyourguide.tp.st/VfYfG5ft", imageUrl: "/assets/sehir1/roma.webp", title: "Roma Turları" },
  { city: "Paris", link: "https://getyourguide.tp.st/bGcMEFlD", imageUrl: "/assets/sehir1/paris.webp", title: "Paris Turları" },
  { city: "Dubai", link: "https://getyourguide.tp.st/ZkaT4ETm", imageUrl: "/assets/sehir1/dubai.webp", title: "Dubai Turları" },
  { city: "Bangkok", link: "https://getyourguide.tp.st/rCKN04Sa", imageUrl: "/assets/sehir1/bangkok.webp", title: "Bangkok Turları" },
];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tours.map((tour, i) => (
        <div
          key={i}
          className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden h-full min-h-[540px] hover:shadow-2xl transition-all duration-500 hover:border-orange-500"
        >
          {/* IMAGE */}
          <a
            href={tour.link}
            target="_blank"
            rel="nofollow noopener noreferrer"
            className="relative w-full h-64 bg-gray-200 overflow-hidden block"
          >
            <img
              src={tour.imageUrl}
              alt={tour.city}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </a>

          {/* CONTENT */}
          <div className="p-5 flex flex-col flex-grow">
            <div className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
              {tour.city}
            </div>

            <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors">
              <a href={tour.link} target="_blank" rel="nofollow noopener noreferrer">
                {tour.title}
              </a>
            </h3>

            <div className="text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">
                {t.durationLabel}
              </span>{" "}
              1–2 Gün
            </div>

            {/* CTA */}
            <div className="mt-auto pt-4">
              <a
                href={tour.link}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="block w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-center text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95"
              >
                {t.reserve}
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}