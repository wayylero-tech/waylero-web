export const normalizeText = (text: string): string => {
  if (!text) return "";

  return text
    .toLocaleLowerCase("tr-TR")
    .trim()
    .replace(/[.,!?]/g, "")
    .replace(/ğ/g, "g").replace(/ü/g, "u")
    .replace(/ş/g, "s").replace(/ı/g, "i")
    .replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/i̇/g, "i");
};

export const cleanSearchQuery = (query: string): string => {
  const stopWords = [
    "gezilecek", "yerler", "mekanlar", "listesi", "rehberi",
    "en", "iyi", "ne", "yapilir", "yapılacak",
    "nasil", "gidilir", "yol", "tarifi", "nerede",
    "how", "to", "go", "best", "places", "visit"
  ];

  let cleaned = normalizeText(query);

  cleaned = cleaned.replace(/['’]\w+/g, "");

  let words = cleaned.split(/\s+/);

  const processed = words.map(word => {
    if (word.length <= 3) return word;

    return word.replace(
      /(deki|daki|daki|dan|den|ya|ye|yi|yu|de|da|te|ta|e|a)$/,
      ""
    );
  });

  return processed
    .filter(w => !stopWords.includes(w) && w.length > 1)
    .join(" ")
    .trim();
};

export const fuzzyMatch = (text: string, query: string): boolean => {
  if (!query) return true;

  const t = normalizeText(text);
  const q = cleanSearchQuery(query);

  if (!q) return false;

  if (t.includes(q)) return true;

  const tWords = t.split(" ");
  const qWords = q.split(" ");

  return qWords.every(qw =>
    tWords.some(tw => tw.includes(qw) || qw.includes(tw))
  );
};