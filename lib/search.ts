// lib/search.ts

export const normalizeText = (text: string): string => {
  if (!text) return "";
  return text
    .toLocaleLowerCase('tr-TR') // 🔥 Önce Türkçe küçük harfe çevir (İ -> i olsun)
    .trim()
    .replace(/[.,!?]/g, "")
    // 🔥 Karakter temizleme: Hem arananı hem veriyi aynı potada eritiyoruz
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/i̇/g, "i"); // Bazı sistemlerdeki hatalı i karakterini temizle
};

export const cleanSearchQuery = (query: string): string => {
  const stopWords = [
    "gezilecek", "yerler", "mekanlar", "nelerdir", "bul", "bana",
    "nereler", "listesi", "rehberi", "en iyi", "gezi", "neler",
    "da", "de", "ta", "te", "mi", "mu", "ne", "ve",
    "places", "to", "visit", "in", "best", "things", "do" // 🔥 İngilizce Stop Words eklendi
  ];

  let cleaned = normalizeText(query);

  // 1. Kesme işareti ve sonrasını at (ankara'da -> ankara, london's -> london)
  cleaned = cleaned.replace(/['’]\w+/g, "");

  // 2. Metni kelimelere böl
  let words = cleaned.split(/\s+/);

  // 3. Ek Temizleme (Sadece Türkçe karakter içeren kelimeler için)
  const processedWords = words.map(word => {
    // 🔥 İngilizce kelimelere zarar vermemek için kontrol: 
    // Eğer kelime sonu "de, da, te, ta" ile bitiyorsa ve kelime Türkçe kökenli gibiyse temizle
    // Ama "made", "node" gibi İngilizce kelimeleri bozmamak için sadece 4 harften büyükse bakıyoruz
    if (word.length > 4) {
      return word.replace(/(deki|daki|naki|neki|da|de|ta|te)$/, "");
    }
    return word;
  });

  // 4. Gereksiz kelimeleri filtrele
  return processedWords
    .filter((word) => !stopWords.includes(word) && word.length > 1)
    .join(" ")
    .trim();
};

export const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;

  const t = normalizeText(text);
  const q = cleanSearchQuery(query); // 🔥 Arama sorgusunu temizleyip öyle karşılaştırıyoruz

  if (!q) return false;

  // Doğrudan içeriyor mu?
  if (t.includes(q)) return true;

  const tWords = t.split(/\s+/);
  const qWords = q.split(/\s+/);

  // 🔥 Multi-language Fuzzy Match: 
  // Aranan her kelime (örn: "new" ve "mosque") hedefte geçiyor mu?
  return qWords.every((qw) => 
    tWords.some((tw) => tw.includes(qw) || qw.includes(tw))
  );
};