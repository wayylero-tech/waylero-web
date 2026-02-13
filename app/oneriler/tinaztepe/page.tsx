import { weeklySuggestion } from "./data";

export default function TinaztepePage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      {/* 🔥 BADGE */}
      <div className="mb-4 flex justify-start">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                         bg-orange-100 text-orange-700 text-sm font-semibold">
          🔥 Haftanın Önerisi
        </span>
      </div>

      <h1 className="text-3xl font-bold mb-4">
        {weeklySuggestion.name}
      </h1>

      <img
        src={weeklySuggestion.image}
        alt={weeklySuggestion.name}
        className="w-full h-96 object-cover rounded-2xl mb-6"
      />

      <p className="text-gray-600 mb-4">
        {weeklySuggestion.excerpt}
      </p>

      <p className="leading-relaxed mb-8">
        {weeklySuggestion.description}
      </p>

      {/* 🔥 PREMIUM CTA */}
      <div className="flex justify-center">
        <a
          href="https://www.waylero.com/blog/konya/tinaztepe-magarasi-gezi-rehberi/"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-3 px-6 py-3 rounded-2xl
                     bg-gradient-to-r from-orange-500 to-red-500
                     text-white font-semibold shadow-lg
                     hover:from-orange-600 hover:to-red-600
                     hover:shadow-xl transition-all"
        >
          📖 Tınaztepe Gezi Rehberini Oku
          <span className="transform group-hover:translate-x-1 transition-transform">
            →
          </span>
        </a>
      </div>
    </main>
  );
}
