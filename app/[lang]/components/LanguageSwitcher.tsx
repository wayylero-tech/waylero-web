
"use client";

import { usePathname } from "next/navigation";

export default function LanguageSwitcher({
  lang,
}: {
  lang: "tr" | "en";
}) {
  const pathname = usePathname();

  const switchLanguage = (langToSet: "tr" | "en") => {
    const segments = pathname.split("/").filter(Boolean);

    if (segments[0] === "tr" || segments[0] === "en") {
      segments.shift();
    }

    const newPath =
      `/${langToSet}` +
      (segments.length > 0 ? `/${segments.join("/")}` : "");

    window.location.href = newPath;
  };

  return (
    <div className="flex items-center gap-1 border border-black/10 rounded-full p-1 bg-black/5 text-[11px] font-medium">
      <button
        onClick={() => switchLanguage("tr")}
        className={`px-2 py-0.5 rounded-full ${
          lang === "tr"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-black"
        }`}
        aria-label="Türkçe"
      >
        🇹🇷
      </button>

      <button
        onClick={() => switchLanguage("en")}
        className={`px-2 py-0.5 rounded-full ${
          lang === "en"
            ? "bg-white text-black shadow-sm"
            : "text-gray-500 hover:text-black"
        }`}
        aria-label="English"
      >
        🇺🇸
      </button>
    </div>
  );
}