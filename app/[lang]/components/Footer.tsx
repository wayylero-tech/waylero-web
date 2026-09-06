
import Link from "next/link";

export default function Footer({ lang }: { lang: "tr" | "en" }) {
  const isEn = lang === "en";

  const t = isEn
    ? {
        slogan: "Explore, Plan, Share.",
        hakkimizda: "About Us",
        gizlilik: "Privacy Policy",
        sozlesme: "Terms of Service",
        iletisim: "Contact",
        takip: "Follow Us",
        indir: "Download App",
      }
    : {
        slogan: "Keşfet, Planla, Paylaş.",
        hakkimizda: "Hakkımızda",
        gizlilik: "Gizlilik Politikası",
        sozlesme: "Kullanıcı Sözleşmesi",
        iletisim: "İletişim",
        takip: "Bizi Takip Et",
        indir: "Uygulamayı İndir",
      };

  const getLocalizedLink = (path: string) => {
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `/${lang}${cleanPath === "/" ? "" : cleanPath}`;
  };

  return (
    <footer className="border-t border-gray-800 bg-black w-full text-white">
      <div className="w-full px-6 md:px-12 py-8 flex flex-col md:flex-row justify-between items-start gap-15 text-sm text-white/80">
        <div className="flex flex-col items-start min-w-[200px]">
          <img
            src="/assets/logo/logo.webp"
            alt="Waylero Logo"
            width={180}
            height={45}
            className="h-11 mb-3 object-contain"
            loading="lazy"
          />

          <p className="font-bold text-white text-base">
            Waylero © {new Date().getFullYear()}
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <span className="font-bold text-white mb-1 tracking-wider">
            {isEn ? "CORPORATE" : "KURUMSAL"}
          </span>

          <Link href={getLocalizedLink("/hakkimizda")}>
            {t.hakkimizda}
          </Link>

          <Link href={getLocalizedLink("/privacy")}>
            {t.gizlilik}
          </Link>

          <Link href={getLocalizedLink("/terms")}>
            {t.sozlesme}
          </Link>

          <Link href={getLocalizedLink("/contact")}>
            {t.iletisim}
          </Link>
        </div>

        <div className="flex flex-col gap-3 min-w-[250px] max-w-[500px] overflow-hidden">
          <span className="font-bold text-white tracking-wider">
            {isEn ? "PARTNERS" : "İŞ BİRLİKLERİMİZ"}
          </span>

          <div className="relative flex overflow-hidden border-l border-gray-700 pl-4 group">
            <div className="flex animate-[partner-slider_20s_linear_infinite] hover:[animation-play-state:paused] whitespace-nowrap py-2 gap-16 items-center">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-16 flex-shrink-0"
                >
                  <div className="flex items-center gap-4">
                    <a
                      href="https://etkinlik.io"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/logo/etkinlikio.webp"
                        alt="Etkinlik.io"
                        width={100}
                        height={30}
                        className="h-10 object-contain"
                      />
                    </a>

                    <span className="text-white/60 text-xs">
                      {isEn
                        ? "• Event data provided by etkinlikio."
                        : "• Etkinlik verileri etkinlikio tarafından sağlanmaktadır."}
                    </span>
                  </div>

                  <div className="flex items-center gap-4">
                    <a
                      href="https://www.getyourguide.com"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        src="/assets/logo/getyourguide.webp"
                        alt="GetYourGuide"
                        width={110}
                        height={30}
                        className="h-10 object-contain"
                      />
                    </a>

                    <span className="text-white/60 text-xs">
                      {isEn
                        ? "• Tours are provided via GetYourGuide."
                        : "• Turlar GetYourGuide üzerinden sunulmaktadır."}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-start gap-10 ml-auto">
          <div className="flex flex-col gap-8 items-end">
            <div className="flex flex-col items-end">
              <span className="font-bold text-white tracking-wider">
                {t.takip}
              </span>

              <div className="flex gap-4 items-center h-9">
                {[
                  [
                    "instagram.webp",
                    "https://www.instagram.com/waylero_ile_kesfet/",
                    "Instagram",
                  ],
                  [
                    "facebook.webp",
                    "https://www.facebook.com/share/1cc67aspSp/",
                    "Facebook",
                  ],
                  [
                    "youtube.webp",
                    "https://www.youtube.com/@way_lero",
                    "YouTube",
                  ],
                  ["x.webp", "https://x.com/wayylero", "X"],
                ].map(([img, url, label]) => (
                  <a
                    key={url}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                  >
                    <img
                      src={`/assets/logo/${img}`}
                      width={24}
                      height={24}
                      alt={label}
                      className="h-6 w-6 object-contain"
                      loading="lazy"
                    />
                  </a>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end">
              <span className="font-bold text-white tracking-wider">
                {t.indir}
              </span>

              <div className="flex gap-4 items-center h-9">
                <a
                  href="https://play.google.com/store/apps/details?id=app.waylero.mobile"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src="/assets/logo/google-play.webp"
                    width={140}
                    height={42}
                    alt="Google Play"
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                  />
                </a>

                <div className="flex items-center opacity-40 grayscale">
                  <img
                    src="/assets/logo/app-store.webp"
                    width={140}
                    height={42}
                    alt="App Store"
                    className="h-7 w-auto object-contain"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-start pt-1">
            <img
              src="/assets/logo/logo-sag.webp"
              width={180}
              height={144}
              alt="Waylero Logo"
              className="h-36 w-auto object-contain opacity-80"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}
