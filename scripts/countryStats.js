const fs = require("fs");
const path = require("path");

const inputPath = path.join(__dirname, "countriesStats.json");

const data = JSON.parse(fs.readFileSync(inputPath, "utf8"));

// 🔥 SENİN ÖZEL SIRAN
const priorityOrder = [
  "turkiye",
  "ispanya",
  "avusturya",
  "bosna-hersek",
  "kktc",
  "azerbaycan",
  "gurcistan"
];

// sıralama
const sorted = {};

// 1. öncelikli ülkeler
for (const country of priorityOrder) {
  if (data[country]) {
    sorted[country] = data[country];
  }
}

// 2. geri kalanlar (alfabetik)
const rest = Object.keys(data)
  .filter((c) => !priorityOrder.includes(c))
  .sort();

for (const country of rest) {
  sorted[country] = data[country];
}

// output
const outputPath = path.join(
  __dirname,
  "countriesStats.sorted.json"
);

fs.writeFileSync(
  outputPath,
  JSON.stringify(sorted, null, 2),
  "utf8"
);

console.log("✅ Sıralandı");
console.log(outputPath);