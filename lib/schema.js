export function generateKesfetSchema(slugDizisi, data) {
  const site = "https://waylero.com";

  const languages = ["en", "de", "fr", "ar"];
  const isLang = languages.includes(slugDizisi[0]);

  const temizSlug = isLang ? slugDizisi.slice(1) : slugDizisi;

  const fullUrl = `${site}/${slugDizisi.join("/")}`;

  // 🔥 BREADCRUMB
  const breadcrumb = {
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Keşfet",
        item: `${site}/${isLang ? slugDizisi[0] + "/" : ""}kesfet`
      },
      ...temizSlug.slice(1).map((parca, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: formatName(parca),
        item: `${site}/${slugDizisi.slice(0, i + (isLang ? 2 : 1) + 1).join("/")}`
      }))
    ]
  };

  const level = temizSlug.length;

  let mainSchema;

  // 📍 DETAY SAYFA
  if (level >= 4) {
    mainSchema = {
      "@type": "TouristAttraction",
      name: data.baslik,
      description: data.aciklama,
      image: data.resim,
      url: fullUrl,
      geo: {
        "@type": "GeoCoordinates",
        latitude: data.enlem,
        longitude: data.boylam
      }
    };
  }

  // 📚 LİSTE SAYFA
  else {
    mainSchema = {
      "@type": "ItemList",
      name: data.baslik,
      itemListElement: (data.altListe || []).map((item, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${site}${item.yol}`
      }))
    };
  }

  return {
    "@context": "https://schema.org",
    "@graph": [breadcrumb, mainSchema]
  };
}

function formatName(text) {
  return text
    .replaceAll("-", " ")
    .replace(/\b\w/g, l => l.toUpperCase());
}