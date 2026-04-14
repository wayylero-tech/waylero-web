const cache = new Map<string, string>();

export const slugify = (text: string) => {
  if (!text) return "";

  if (cache.has(text)) return cache.get(text)!;

  const trMap: any = {
    ç: "c", ğ: "g", ı: "i", i: "i", ö: "o", ş: "s", ü: "u",
    Ç: "C", Ğ: "G", İ: "I", I: "i", Ö: "O", Ş: "S", Ü: "U"
  };

  const result = text
    .toString()
    .replace(/[çğışüöÇĞİŞÜÖ]/g, (m) => trMap[m])
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-");

  cache.set(text, result);
  return result;
};