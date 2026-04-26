const fs = require("fs");
const path = require("path");

const baseDir = path.join(__dirname, "data/ulkelerdata");

let result = {};

function scanDir(dirPath) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith(".json")) {
      try {
        const city = path.basename(file, ".json"); // ankara.json → ankara
        const raw = fs.readFileSync(fullPath, "utf-8");
        const data = JSON.parse(raw);

        if (Array.isArray(data)) {
          data.forEach((item) => {
            if (item.slug) {
              result[item.slug] = city;
            }
          });
        } else if (data.slug) {
          result[data.slug] = city;
        }

      } catch (err) {
        console.error("Hata:", fullPath, err.message);
      }
    }
  });
}

scanDir(baseDir);

// çıktı dosyası
fs.writeFileSync(
  "slug-city-map.json",
  JSON.stringify(result, null, 2),
  "utf-8"
);

console.log("Bitti 🚀 slug-city-map.json oluşturuldu");