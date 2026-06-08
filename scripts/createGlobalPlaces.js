const fs = require("fs");
const path = require("path");

// KLASÖRLER
const PLACES_DIR = path.join(
  __dirname,
  "../data/ulkelerdata"
);

const IMAGES_DIR = path.join(
  __dirname,
  "../data/ulkedataimages"
);

const OUTPUT_FILE = path.join(
  __dirname,
  "globalPlaces.json"
);

const results = [];
const countryCache = {};

// ülke görsel json cache
function getCountryData(country) {
  if (countryCache[country]) {
    return countryCache[country];
  }

  const filePath = path.join(
    IMAGES_DIR,
    `${country}.json`
  );

  if (!fs.existsSync(filePath)) {
    console.log(
      `❌ Ülke görsel dosyası yok: ${country}.json`
    );
    return null;
  }

  try {
    const data = JSON.parse(
      fs.readFileSync(filePath, "utf8")
    );

    countryCache[country] = data;

    return data;
  } catch (err) {
    console.log(
      `❌ JSON okunamadı: ${country}.json`
    );

    return null;
  }
}

// görsel bul
function getImage(country, city, slug) {
  const countryData = getCountryData(country);

  if (!countryData) return "";

  const cityData = countryData[city];

  if (!cityData) return "";

  // desteklenen formatlar
  const possibleKeys = [
    slug,
    `${city}-${slug}`,
  ];

  for (const key of possibleKeys) {
    if (
      cityData[key] &&
      Array.isArray(cityData[key]) &&
      cityData[key].length > 0
    ) {
      return cityData[key][0];
    }
  }

  return "";
}

// place ekle
function extractItem(item, country, city) {
  if (
    !item ||
    !item.slug ||
    !item.latitude ||
    !item.longitude
  ) {
    return;
  }

  const image = getImage(
    country,
    city,
    item.slug
  );

  if (!image) {
    console.log(
      `⚠️ Görsel bulunamadı: ${country}/${city}/${item.slug}`
    );
  }

  results.push({
    country,
    city,
    slug: item.slug,

    name_tr: item.name?.tr || "",
    name_en: item.name?.en || "",

    lat: item.latitude,
    lng: item.longitude,

    image,
  });
}

// recursive tara
function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!file.endsWith(".json")) {
      continue;
    }

    try {
      const raw = fs.readFileSync(
        fullPath,
        "utf8"
      );

      const data = JSON.parse(raw);

      const relative = path.relative(
        PLACES_DIR,
        fullPath
      );

      const parts = relative.split(path.sep);

      if (parts.length < 2) {
        continue;
      }

      const country = parts[0];
      const city = path.basename(
        parts[1],
        ".json"
      );

      if (Array.isArray(data)) {
        data.forEach((item) =>
          extractItem(item, country, city)
        );
      } else {
        extractItem(data, country, city);
      }
    } catch (err) {
      console.log(
        `❌ Hata: ${fullPath}`
      );
    }
  }
}

// çalıştır
walk(PLACES_DIR);

// kaydet
fs.writeFileSync(
  OUTPUT_FILE,
  JSON.stringify(results, null, 2),
  "utf8"
);

console.log("");
console.log("✅ Tamamlandı");
console.log(`📍 Toplam Yer: ${results.length}`);
console.log(`💾 Çıktı: ${OUTPUT_FILE}`);