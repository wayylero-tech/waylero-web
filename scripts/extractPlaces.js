const fs = require("fs");
const path = require("path");

// ANA KLASÖR
const BASE_DIR = path.join(__dirname, "../data/ulkelerdata");

const results = [];

// Recursive klasör tara
function walk(dir) {
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir);

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      walk(fullPath);
    } else if (file.endsWith(".json")) {
      try {
        const raw = fs.readFileSync(fullPath, "utf8");
        const data = JSON.parse(raw);

        // path parçaları
        // örnek:
        // data/ulkelerdata/almanya/berlin.json

        const relativePath = path.relative(BASE_DIR, fullPath);
        const parts = relativePath.split(path.sep);

        const country = parts[0]; // almanya
        const city = path.basename(parts[1], ".json"); // berlin

        if (Array.isArray(data)) {
          data.forEach((item) =>
            extractItem(item, country, city)
          );
        } else if (typeof data === "object") {
          extractItem(data, country, city);
        }
      } catch (err) {
        console.log("❌ JSON okunamadı:", fullPath);
      }
    }
  }
}

// Veri çıkar
function extractItem(item, country, city) {
  if (!item) return;

  if (
    item.slug &&
    item.latitude &&
    item.longitude
  ) {
    results.push({
      country,
      city,
      slug: item.slug,

      name_tr: item.name?.tr || "",
      name_en: item.name?.en || "",

      lat: item.latitude,
      lng: item.longitude,
    });
  }
}

// Tara
walk(BASE_DIR);

// Çıktı oluştur
const outputPath = path.join(__dirname, "allPlaces.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(results, null, 2),
  "utf8"
);

console.log(`✅ ${results.length} adet yer bulundu.`);
console.log(`📦 Çıktı: ${outputPath}`);