export default function TourCard({
  title,
  imageUrl,
  link,
  tag,
  duration,
  features,
  city,
  lang,
}: any) {
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

  const getLabel = (field: any) => {
    if (!field) return "";
    return field[activeLang] || field["tr"] || field;
  };

  const safeImageUrl = imageUrl?.startsWith("/") ? imageUrl : `/${imageUrl}`;

  return (
    <div className="group relative flex flex-col bg-white border border-gray-100 rounded-3xl overflow-hidden h-full min-h-[540px] hover:shadow-2xl transition-all duration-500 hover:border-orange-500">
      
      {/* IMAGE SECTION */}
      <a 
        href={link} 
        target="_blank" 
        rel="nofollow noopener noreferrer" 
        className="relative w-full h-64 bg-gray-200 overflow-hidden block"
      >
        <img
          src={safeImageUrl}
          alt={getLabel(title)}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {tag && (
          <div className="absolute top-4 left-4 bg-orange-600 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg z-10">
            {getLabel(tag)}
          </div>
        )}
      </a>

      {/* CONTENT SECTION */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="text-orange-600 text-xs font-bold uppercase tracking-wider mb-2">
          {getLabel(city)}
        </div>

        <h3 className="text-lg font-bold text-gray-900 leading-snug mb-3 group-hover:text-orange-600 transition-colors">
          <a href={link} target="_blank" rel="nofollow noopener noreferrer">
            {getLabel(title)}
          </a>
        </h3>

        <div className="text-sm text-gray-500 mb-6">
          <span className="font-semibold text-gray-700">
            {t.durationLabel}
          </span>{" "}
          {getLabel(duration)}{" "}
          {features?.[activeLang]?.length
            ? `• ${features[activeLang][0]}`
            : ""}
        </div>

        {/* CTA BUTTON */}
        <div className="mt-auto pt-4">
          <a 
            href={link} 
            target="_blank" 
            rel="nofollow noopener noreferrer"
            className="block w-full py-3.5 bg-orange-600 hover:bg-orange-700 text-white text-center text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            {t.reserve}
          </a>
        </div>
      </div>
    </div>
  );
}