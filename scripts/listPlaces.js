const fs = require("fs");
const path = require("path");

const BASE_DIR = path.join(process.cwd(), "app", "data", "data");

function getAllJsonFiles(dir) {
  let results = [];

  fs.readdirSync(dir).forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results = results.concat(getAllJsonFiles(filePath));
    } else if (file.endsWith(".json")) {
      results.push(filePath);
    }
  });

  return results;
}

// şehir adı = klasör / dosya adı
function getCity(filePath) {
  return path.basename(filePath, ".json").toUpperCase();
}

function run() {
  const files = getAllJsonFiles(BASE_DIR);

  const cities = {};

  files.forEach((file) => {
    const raw = fs.readFileSync(file, "utf-8");
    const json = JSON.parse(raw);

    const city = getCity(file);

    const items = Array.isArray(json) ? json : [json];

    items.forEach((item) => {
      if (!item?.name?.tr) return;

      if (!cities[city]) cities[city] = [];
      cities[city].push(item.name.tr);
    });
  });

  // OUTPUT
  console.log("\n📍 ŞEHİR BAZLI LİSTE\n");

  Object.keys(cities).forEach((city) => {
    console.log(`🏙️ ${city}`);

    cities[city].forEach((name) => {
      console.log(`  - ${name}`);
    });

    console.log("");
  });
}

run();