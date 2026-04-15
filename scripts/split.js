const fs = require("fs");
const path = require("path");

const regions = ["turkey", "europa", "asia"];

regions.forEach((region) => {
  const inputPath = path.join(process.cwd(), `app/data/${region}.json`);
  const outputDir = path.join(process.cwd(), `public/data/${region}`);

  // JSON oku
  const data = JSON.parse(fs.readFileSync(inputPath, "utf-8"));

  // klasör oluştur
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // böl
  Object.entries(data).forEach(([city, places]) => {
    const fileName = `${slugify(city)}.json`;
    const filePath = path.join(outputDir, fileName);

    fs.writeFileSync(filePath, JSON.stringify(places, null, 2), "utf-8");

    console.log(`✅ ${region} → ${fileName}`);
  });
});

// slugify
function slugify(text) {
  const trMap = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "c", Ğ: "g", İ: "i", I: "i", Ö: "o", Ş: "s", Ü: "u"
  };

  return text
    .toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");
}