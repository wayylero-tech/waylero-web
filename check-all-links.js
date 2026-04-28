const fs = require('fs');

const slugMap = JSON.parse(fs.readFileSync('./slug-city-map.json', 'utf8'));
const slugs = Object.keys(slugMap);
const BASE_URL = 'http://localhost:3000';

async function checkLinks() {
  const failedLinks = [];
  
  // Test edilecek diller (Boş olan default Türkçe, 'en/' olan İngilizce)
  const langPrefixes = ['', 'en/'];

  console.log("🚀 Hem Türkçe hem İngilizce linkler taranıyor...");

  for (const slug of slugs) {
    for (const prefix of langPrefixes) {
      try {
        // encodeURI ile linki oluştur (Örn: /slug veya /en/slug)
        const url = encodeURI(`${BASE_URL}/${prefix}${slug}`);
        const response = await fetch(url, { redirect: 'manual' });
        
        // 404 mü diye bak, veya 500'lü bir hata mı
        if (response.status === 404 || response.status >= 500) {
          console.error(`❌ Hata (${response.status}): ${url}`);
          failedLinks.push({ url, error: `Status: ${response.status}` });
        } else {
          // OK olarak logla (isteğe bağlı, çok kalabalık olursa burayı kaldırabilirsin)
          console.log(`✅ OK (${response.status}): ${url}`);
        }
      } catch (err) {
        console.error(`⚠️ Bağlantı hatası: ${prefix}${slug} -> ${err.message}`);
        failedLinks.push({ url: `${prefix}${slug}`, error: err.message });
      }
    }
  }

  fs.writeFileSync('404-raporu.json', JSON.stringify(failedLinks, null, 2));
  console.log(`\n🏁 İşlem tamam! Hatalı ${failedLinks.length} adet link "404-raporu.json" dosyasına yazıldı.`);
}

checkLinks();