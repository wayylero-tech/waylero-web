// videos.ts
export const wayleroLiveVideos = [
  { 
    id: 1, 
    title: "Tantavi Kültür ve Sanat Merkezi", 
    youtubeId: "B5pG6oETEqQ",
    location: "Konya, Türkiye" 
  },
  { 
    id: 2, 
    title: "Zenburi Camii", 
    youtubeId: "tZXjrwIAhcg",
    location: "Konya, Türkiye"
  },
  { 
    id: 3, 
    title: "Kızlar Kayası", 
    youtubeId: "HOMMUxmU97c",
    location: "Konya, Türkiye"
  },
  { 
    id: 4, 
    title: "Sırçalı Mescid", 
    youtubeId: "Fx4obbMFTbA",
    location: "Konya, Türkiye"
  },
  { 
    id: 5, 
    title: "Eşrefoğlu Camii", 
    youtubeId: "xh8GzzdfMB0",
    location: "Konya, Türkiye"
  },
  { 
    id: 6, 
    title: "Şemsi Tebrizi Camii ve Türbesi", 
    youtubeId: "U9-KHPRN8m4",
    location: "Konya, Türkiye"
  },
  { 
    id: 7, 
    title: "Başarakavak Hanı", 
    youtubeId: "mY6d5R8RaVg",
    location: "Konya, Türkiye"
  }
];

/**
 * addSlugs: Videolar için URL dostu slug üretir
 * - Küçük harf
 * - Boşluk yerine tire
 * - Türkçe karakterleri İngilizce karşılıkları ile değiştirir
 * - Özel karakterleri kaldırır
 */
export const addSlugs = (videos: typeof wayleroLiveVideos) => {
  const turkishMap: { [key: string]: string } = {
    ç: "c",
    ğ: "g",
    ı: "i",
    İ: "i",
    ö: "o",
    ş: "s",
    ü: "u"
  };

  return videos.map(video => {
    let slug = video.title.toLowerCase();
    // Türkçe karakterleri değiştir
    slug = slug.replace(/[çğıİöşü]/g, (char) => turkishMap[char] || char);
    // Boşlukları tireye çevir
    slug = slug.replace(/\s+/g, "-");
    // Özel karakterleri temizle
    slug = slug.replace(/[^\w-]+/g, "");
    return { ...video, slug };
  });
};