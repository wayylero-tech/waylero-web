export default function TourCard({
  title,
  imageUrl,
  link,
  tag,
  duration,
  features,
  city,
  lang, // 👈 EKLENDİ
}: any) {

  const activeLang = lang === "en" ? "en" : "tr";

  const t = {
    tr: {
      reserve: "Fiyat bilgisi ve turları incelemek için tıkla",
      durationLabel: "Süre:",
    },
    en: {
      reserve: "Click to view prices and tours",
      durationLabel: "Duration:",
    },
  }[activeLang];

  const getLabel = (field: any) => {
    if (!field) return "";
    return field[activeLang] || field["tr"] || field;
  };

  const safeImageUrl = imageUrl?.startsWith("/")
    ? imageUrl
    : `/${imageUrl}`;

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden h-[560px] hover:shadow-2xl transition-all duration-500 hover:border-blue-500">

      {/* IMAGE */}
      <div className="relative w-full h-80 bg-gray-200 overflow-hidden">
        <img
          src={safeImageUrl}
          alt={getLabel(title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />

        {tag && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            {getLabel(tag)}
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-6 flex flex-col flex-grow">

        <h3>{getLabel(title)}</h3>

        <div className="text-blue-600">
          {getLabel(city)}
        </div>

        <div className="text-gray-500">
          <span className="font-bold text-gray-700">
            {t.durationLabel}
          </span>{" "}
          {getLabel(duration)}{" "}
          {features?.[activeLang]?.length
            ? `• ${features[activeLang][0]}`
            : ""}
        </div>

        <a href={link} target="_blank">
          {t.reserve}
        </a>

      </div>
    </div>
  );
}