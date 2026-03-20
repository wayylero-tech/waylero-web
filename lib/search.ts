// lib/search.ts

export const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
};

export const cleanSearchQuery = (query: string): string => {
  const stopWords = [
    "gezilecek", "yerler", "mekanlar", "nelerdir", "bul", "bana",
    "nereler", "listesi", "rehberi", "en iyi", "gezi", "neler",
    "da", "de", "ta", "te", "mi", "mu" // "da/de" ayrı yazılırsa silinsin
  ];

  let cleaned = normalizeText(query);

  // 1. Kesme işareti ve sonrasını at (ankara'da -> ankara)
  cleaned = cleaned.replace(/'\w+/g, "");

  // 2. Metni kelimelere böl
  let words = cleaned.split(/\s+/);

  // 3. Her kelimenin sonundaki ekleri temizle (bitişik yazılanlar için)
  const processedWords = words.map(word => {
    // Sadece kelime 4 harften uzunsa ek temizle (Örn: "edirne'de" -> "edirne", ama "de" kalmasın)
    if (word.length > 3) {
      return word.replace(/(da|de|ta|te|deki|daki|naki|neki)$/, "");
    }
    return word;
  });

  // 4. Gereksiz kelimeleri (stopWords) filtrele
  return processedWords
    .filter((word) => !stopWords.includes(word) && word.length > 1)
    .join(" ")
    .trim();
};

export const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;

  const t = normalizeText(text);
  const q = normalizeText(query);

  // Doğrudan içeren bir yapı varsa (Örn: "ankara" metinde geçiyor mu?)
  if (t.includes(q)) return true;

  const tWords = t.split(" ");
  const qWords = q.split(" ");

  // Aranan her kelime, hedef metindeki kelimelerden biriyle tam eşleşmeli veya başlamalı
  return qWords.every((qw) => 
    tWords.some((tw) => tw === qw || tw.startsWith(qw))
  );
};