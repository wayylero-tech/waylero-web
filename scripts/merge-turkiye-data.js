const fs = require("fs");
const path = require("path");

// Türkiye şehir JSON dosyalarının bulunduğu klasör
const sourceDir = path.join(
  __dirname,
  "..",
  "data",
  "ulkelerdata",
  "turkiye"
);

// Birleştirilecek ana JSON dosyası
const outputFile = path.join(
  __dirname,
  "..",
  "data",
  "ulkelerdata",
  "turkiye.json"
);

console.log("🇹🇷 Türkiye verileri birleştiriliyor...\n");

// Klasör kontrolü
if (!fs.existsSync(sourceDir)) {
  console.error("❌ Türkiye veri klasörü bulunamadı:");
  console.error(sourceDir);
  process.exit(1);
}

// JSON dosyalarını bul
const files = fs
  .readdirSync(sourceDir)
  .filter((file) => file.toLowerCase().endsWith(".json"));

// Sonuç
const mergedData = {};

let successCount = 0;
let errorCount = 0;
let totalPlaces = 0;

for (const file of files) {
  const filePath = path.join(sourceDir, file);

  // Dosya isminden il adını al
  // adana.json -> adana
  const provinceName = path.basename(file, ".json").toLowerCase();

  try {
    const fileContent = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContent);

    // Her il dosyası array olmalı
    if (!Array.isArray(data)) {
      console.error(`❌ ${file}: JSON array değil.`);
      errorCount++;
      continue;
    }

    // İl verisini ekle
    mergedData[provinceName] = data;

    totalPlaces += data.length;
    successCount++;

    console.log(`✅ ${provinceName}.json → ${data.length} mekan`);
  } catch (error) {
    console.error(`❌ ${file} okunamadı:`);
    console.error(`   ${error.message}`);
    errorCount++;
  }
}

// İlleri alfabetik sıraya koy
const sortedData = Object.keys(mergedData)
  .sort((a, b) => a.localeCompare(b, "tr"))
  .reduce((result, province) => {
    result[province] = mergedData[province];
    return result;
  }, {});

// Tek JSON dosyasını oluştur
fs.writeFileSync(
  outputFile,
  JSON.stringify(sortedData, null, 2),
  "utf8"
);

console.log("\n========================================");
console.log("🎉 İŞLEM TAMAMLANDI");
console.log("========================================");
console.log(`🇹🇷 Toplam il     : ${successCount}`);
console.log(`📍 Toplam mekan   : ${totalPlaces}`);
console.log(`❌ Hatalı dosya   : ${errorCount}`);
console.log(`📄 Çıktı          : ${outputFile}`);
console.log("========================================\n");
