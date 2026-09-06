
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ lang }: { lang: "tr" | "en" }) {
  return (
    <header
      className="sticky top-0 z-50 bg-[#F9F7F2]/95 backdrop-blur-md shadow-sm border-b border-black/5 px-4"
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <Link href={`/${lang}`}>
            <img
              src="/assets/logo/logo.webp"
              width={224}
              height={56}
              className="object-contain h-12"
              alt="Waylero logo"
            />
          </Link>
        </div>

        <div className="flex-1 flex justify-end">
          <LanguageSwitcher lang={lang} />
        </div>
      </div>
    </header>
  );
}

