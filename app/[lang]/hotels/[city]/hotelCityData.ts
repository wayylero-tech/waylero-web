export type HotelCityContent = {
  name: {
    tr: string;
    en: string;
  };

  intro: {
    tr: string;
    en: string;
  };

  whereToStay: {
    tr: string;
    en: string;
  };

  areas: {
    name: {
      tr: string;
      en: string;
    };
    description: {
      tr: string;
      en: string;
    };
  }[];

  tips: {
    tr: string[];
    en: string[];
  };
};

export const HOTEL_CITIES = [
  "istanbul",
  "nevsehir",
  "antalya",
  "izmir",
  "mugla",
  "aydin",
  "trabzon",
  "edirne",
  "bangkok",
  "paris",
  "londra",
  "dubai",
  "roma",
] as const;

export const hotelCityData: Record<string, HotelCityContent> = {
  istanbul: {
    name: {
      tr: "İstanbul",
      en: "Istanbul",
    },

    intro: {
      tr: "İstanbul'da konaklama seçimi, şehrin iki kıtaya yayılan yapısı nedeniyle seyahatinizin nasıl geçeceğini doğrudan etkiler. Tarihi yarımadada kalmak isteyenler Sultanahmet ve Eminönü çevresini, merkezi ve hareketli bir atmosfer arayanlar Taksim ve Beyoğlu'nu, daha yerel bir deneyim isteyenler ise Kadıköy ve çevresini değerlendirebilir.",
      en: "Choosing where to stay in Istanbul can shape your entire trip because the city stretches across two continents. Sultanahmet and Eminonu are ideal for historic sights, while Taksim and Beyoglu offer a central and lively atmosphere. Travelers looking for a more local experience can consider Kadikoy and nearby neighborhoods.",
    },

    whereToStay: {
      tr: "İstanbul'da nerede kalacağınız gezi planınıza göre değişir. İlk kez gelenler için tarihi bölgelere yakınlık önemliyken, uzun süre kalanlar için metro, tramvay ve vapur bağlantılarına yakın olmak büyük avantaj sağlar.",
      en: "The best area to stay in Istanbul depends on your itinerary. First-time visitors may prefer being close to the historic sights, while longer stays can benefit from easy access to metro, tram and ferry connections.",
    },

    areas: [
      {
        name: {
          tr: "Sultanahmet",
          en: "Sultanahmet",
        },
        description: {
          tr: "Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve Yerebatan Sarnıcı gibi tarihi yapılara yakın olmak isteyenler için en pratik bölgelerden biridir.",
          en: "One of the most convenient areas for travelers who want to stay close to Hagia Sophia, the Blue Mosque, Topkapi Palace and the Basilica Cistern.",
        },
      },
      {
        name: {
          tr: "Taksim & Beyoğlu",
          en: "Taksim & Beyoglu",
        },
        description: {
          tr: "Restoran, kafe, alışveriş ve gece hayatına yakın olmak isteyenler için merkezi bir seçenektir.",
          en: "A central choice for travelers who want easy access to restaurants, cafes, shopping and nightlife.",
        },
      },
      {
        name: {
          tr: "Kadıköy",
          en: "Kadikoy",
        },
        description: {
          tr: "Anadolu yakasında daha canlı ve yerel bir atmosfer arayanlar için restoranları, kafeleri ve ulaşım bağlantılarıyla öne çıkar.",
          en: "A lively area on the Asian side, known for its restaurants, cafes and convenient transport connections.",
        },
      },
    ],

    tips: {
      tr: [
        "Otel seçerken metro, tramvay veya vapur bağlantısını kontrol edin.",
        "Tarihi yerleri ağırlıklı gezecekseniz Sultanahmet çevresi zaman kazandırabilir.",
        "Gece hayatı ve restoranlar önemliyse Beyoğlu çevresini değerlendirin.",
        "Otelin konumunu haritada kontrol etmek, sadece şehir adına bakmaktan daha sağlıklıdır.",
      ],
      en: [
        "Check access to metro, tram or ferry connections before booking.",
        "Sultanahmet can save time if historic attractions are your main focus.",
        "Consider Beyoglu if restaurants and nightlife are important to you.",
        "Check the hotel's exact location on a map rather than relying only on the city name.",
      ],
    },
  },

  nevsehir: {
    name: {
      tr: "Kapadokya",
      en: "Cappadocia",
    },

    intro: {
      tr: "Kapadokya'da konaklama denince yalnızca otelin kendisi değil, hangi bölgede kaldığınız da önemlidir. Göreme, Ürgüp, Uçhisar ve Avanos farklı atmosferlere sahip olduğu için seyahat tarzınıza göre doğru bölgeyi seçmek deneyiminizi oldukça değiştirebilir.",
      en: "In Cappadocia, the area you choose can be just as important as the hotel itself. Goreme, Urgup, Uchisar and Avanos each offer a different atmosphere, so choosing the right base can make a noticeable difference to your trip.",
    },

    whereToStay: {
      tr: "Balonları ve vadileri yakından görmek isteyenler genellikle Göreme'yi tercih eder. Daha sakin ve butik bir atmosfer isteyenler Uçhisar veya Ürgüp'e bakabilir.",
      en: "Goreme is popular for travelers who want easy access to balloon views and valleys. Uchisar and Urgup are better options for those seeking a quieter and more boutique atmosphere.",
    },

    areas: [
      {
        name: {
          tr: "Göreme",
          en: "Goreme",
        },
        description: {
          tr: "Vadiler, seyir noktaları, restoranlar ve günlük turlara kolay erişimiyle Kapadokya'nın en pratik konaklama bölgelerinden biridir.",
          en: "One of the most convenient bases in Cappadocia, with easy access to valleys, viewpoints, restaurants and daily tours.",
        },
      },
      {
        name: {
          tr: "Uçhisar",
          en: "Uchisar",
        },
        description: {
          tr: "Daha sakin bir atmosfer ve panoramik manzaralar isteyenler için iyi bir alternatiftir.",
          en: "A good alternative for travelers looking for a quieter atmosphere and panoramic views.",
        },
      },
      {
        name: {
          tr: "Ürgüp",
          en: "Urgup",
        },
        description: {
          tr: "Restoranları, taş otelleri ve daha sakin şehir atmosferiyle uzun konaklamalar için değerlendirilebilir.",
          en: "Known for stone hotels, restaurants and a calmer town atmosphere, making it suitable for longer stays.",
        },
      },
    ],

    tips: {
      tr: [
        "Balon uçuşu planlıyorsanız tur şirketlerinin transfer bölgelerini kontrol edin.",
        "Mağara otellerin fotoğraflarını ve oda özelliklerini rezervasyondan önce inceleyin.",
        "Göreme'de konaklamak birçok noktaya ulaşımı kolaylaştırabilir.",
        "Kış aylarında oda ısıtmasını mutlaka kontrol edin.",
      ],
      en: [
        "If you plan a balloon flight, check the tour company's transfer area.",
        "Review cave hotel photos and room details before booking.",
        "Staying in Goreme can make reaching many attractions easier.",
        "Check the heating system carefully during winter stays.",
      ],
    },
  },

  antalya: {
    name: {
      tr: "Antalya",
      en: "Antalya",
    },

    intro: {
      tr: "Antalya'da otel seçerken tatilinizin şehir merkezinde mi, sahil bölgesinde mi geçeceğine karar vermek önemlidir. Kaleiçi tarihi atmosferiyle öne çıkarken Konyaaltı ve Lara daha çok deniz, plaj ve tatil odaklı konaklama seçenekleri sunar.",
      en: "When choosing a hotel in Antalya, first decide whether you want to stay near the historic center or closer to the beaches. Kaleici offers historic surroundings, while Konyaalti and Lara are more focused on beaches and resort-style stays.",
    },

    whereToStay: {
      tr: "Denize yakın olmak isteyenler Konyaaltı veya Lara'yı değerlendirebilir. Şehir gezileri ve tarihi atmosfer öncelikliyse Kaleiçi daha merkezi bir seçimdir.",
      en: "Konyaalti and Lara are good choices for beach-focused stays, while Kaleici is more convenient for exploring the old town and historic atmosphere.",
    },

    areas: [
      {
        name: {
          tr: "Kaleiçi",
          en: "Kaleici",
        },
        description: {
          tr: "Tarihi sokakları, restoranları ve liman çevresiyle şehir gezisi yapmak isteyenler için karakterli bir bölgedir.",
          en: "A charming area with historic streets, restaurants and access to the old harbor.",
        },
      },
      {
        name: {
          tr: "Konyaaltı",
          en: "Konyaalti",
        },
        description: {
          tr: "Uzun sahili ve plaja yakın konaklama seçenekleriyle yaz tatilleri için popülerdir.",
          en: "Popular for summer stays thanks to its long beach and wide range of nearby accommodation.",
        },
      },
      {
        name: {
          tr: "Lara",
          en: "Lara",
        },
        description: {
          tr: "Büyük oteller ve resort seçenekleriyle özellikle deniz tatiline odaklanan ziyaretçiler için uygundur.",
          en: "Known for large hotels and resorts, making it suitable for beach-focused holidays.",
        },
      },
    ],

    tips: {
      tr: [
        "Yaz aylarında plaja yakınlık fiyatları önemli ölçüde etkileyebilir.",
        "Kaleiçi'nde araçla ulaşım ve otopark durumunu önceden kontrol edin.",
        "Resort otellerde yemek ve transfer seçeneklerini karşılaştırın.",
        "Şehir merkezinden uzak bölgelerde ulaşım süresini hesaba katın.",
      ],
      en: [
        "Beach proximity can significantly affect prices during summer.",
        "Check parking and vehicle access before staying in Kaleici.",
        "Compare meal and transfer options at resort hotels.",
        "Consider travel times if staying farther from the city center.",
      ],
    },
  },

  izmir: {
    name: {
      tr: "İzmir",
      en: "Izmir",
    },

    intro: {
      tr: "İzmir'de konaklama için şehir merkezi, Alsancak, Konak ve Karşıyaka gibi bölgeler öne çıkar. Şehir gezileri için merkezi ulaşım bağlantılarına yakın olmak avantaj sağlarken, sahil atmosferi isteyenler farklı kıyı bölgelerini de değerlendirebilir.",
      en: "Izmir offers several convenient areas for accommodation, including Alsancak, Konak and Karsiyaka. Staying near central transport connections is useful for sightseeing, while coastal neighborhoods offer a more relaxed atmosphere.",
    },

    whereToStay: {
      tr: "İlk kez İzmir'e gelenler için Alsancak merkezi konumu nedeniyle pratik bir seçimdir. Daha sakin bir atmosfer isteyenler Karşıyaka tarafına bakabilir.",
      en: "Alsancak is a practical choice for first-time visitors because of its central location. Karsiyaka is worth considering for a calmer atmosphere.",
    },

    areas: [
      {
        name: {
          tr: "Alsancak",
          en: "Alsancak",
        },
        description: {
          tr: "Kafeler, restoranlar, sahil ve şehir merkezine yakınlığıyla hareketli bir konaklama bölgesidir.",
          en: "A lively area close to cafes, restaurants, the waterfront and central Izmir.",
        },
      },
      {
        name: {
          tr: "Konak",
          en: "Konak",
        },
        description: {
          tr: "Şehir merkezindeki tarihi ve kültürel noktalara ulaşmak isteyenler için avantajlıdır.",
          en: "Convenient for travelers interested in central historic and cultural attractions.",
        },
      },
      {
        name: {
          tr: "Karşıyaka",
          en: "Karsiyaka",
        },
        description: {
          tr: "Sahil boyunca uzanan yürüyüş alanları ve daha yerel atmosferiyle öne çıkar.",
          en: "Known for its waterfront walks and more local neighborhood atmosphere.",
        },
      },
    ],

    tips: {
      tr: [
        "İzmir'de toplu taşıma bağlantılarına yakın oteller günlük gezileri kolaylaştırır.",
        "Alsancak'ta hafta sonları yoğunluk yaşanabileceğini unutmayın.",
        "Sahil manzaralı odalarda manzaranın gerçekten odaya ait olup olmadığını kontrol edin.",
        "Yaz aylarında klima önemli bir kriterdir.",
      ],
      en: [
        "Hotels near public transport can make exploring Izmir much easier.",
        "Alsancak can become busy on weekends.",
        "Check whether a sea view actually belongs to the room category you book.",
        "Air conditioning is an important factor during summer.",
      ],
    },
  },

  mugla: {
    name: {
      tr: "Muğla",
      en: "Mugla",
    },

    intro: {
      tr: "Muğla'da konaklama seçenekleri şehir merkezinden çok Bodrum, Fethiye, Marmaris ve Datça gibi tatil bölgelerinde yoğunlaşır. Bu nedenle otel seçerken yalnızca Muğla adına değil, hangi tatil beldesinde kalacağınıza da dikkat etmek gerekir.",
      en: "Accommodation in Mugla is concentrated around destinations such as Bodrum, Fethiye, Marmaris and Datca rather than the city center. Your choice of resort town is therefore just as important as the hotel itself.",
    },

    whereToStay: {
      tr: "Deniz tatili için Bodrum, Marmaris veya Fethiye öne çıkarken daha sakin bir tatil isteyenler Datça'yı değerlendirebilir.",
      en: "Bodrum, Marmaris and Fethiye are popular for beach holidays, while Datca is a good option for a quieter escape.",
    },

    areas: [
      {
        name: {
          tr: "Bodrum",
          en: "Bodrum",
        },
        description: {
          tr: "Marina, restoranlar, koylar ve hareketli gece hayatıyla farklı bütçelere hitap eden geniş bir konaklama seçeneği sunar.",
          en: "Offers a wide range of accommodation around marinas, restaurants, beaches and nightlife.",
        },
      },
      {
        name: {
          tr: "Fethiye",
          en: "Fethiye",
        },
        description: {
          tr: "Doğa, koylar ve tekne turlarıyla ilgilenenler için iyi bir başlangıç noktasıdır.",
          en: "A strong base for travelers interested in nature, bays and boat trips.",
        },
      },
      {
        name: {
          tr: "Marmaris",
          en: "Marmaris",
        },
        description: {
          tr: "Plaj, marina ve eğlence seçeneklerinin bir arada olduğu popüler bir tatil merkezidir.",
          en: "A popular resort combining beaches, a marina and entertainment options.",
        },
      },
    ],

    tips: {
      tr: [
        "Muğla'da otel seçerken beldeyi mutlaka kontrol edin.",
        "Yaz sezonunda fiyatlar ciddi şekilde değişebilir.",
        "Aracınız varsa otopark imkanını önceden kontrol edin.",
        "Koylara ulaşım planlıyorsanız konumunuzu buna göre seçin.",
      ],
      en: [
        "Always check the exact resort town when booking in Mugla.",
        "Prices can vary significantly during the summer season.",
        "Check parking availability if you are traveling by car.",
        "Choose your location according to the beaches and bays you plan to visit.",
      ],
    },
  },

  aydin: {
    name: {
      tr: "Aydın",
      en: "Aydin",
    },

    intro: {
      tr: "Aydın'da konaklama denildiğinde Kuşadası ve Didim gibi sahil bölgeleri öne çıkar. Antik kentleri gezmek isteyenler için de bölgenin farklı noktalarında konaklamak, günlük gezi planlarını kolaylaştırabilir.",
      en: "When staying in Aydin, coastal destinations such as Kusadasi and Didim are among the most popular choices. Travelers interested in ancient sites can also choose a base that makes day trips easier.",
    },

    whereToStay: {
      tr: "Deniz tatili için Kuşadası veya Didim, daha sakin bir konaklama için ise çevredeki küçük sahil yerleşimleri değerlendirilebilir.",
      en: "Kusadasi and Didim are popular for beach holidays, while smaller coastal settlements can provide a quieter stay.",
    },

    areas: [
      {
        name: {
          tr: "Kuşadası",
          en: "Kusadasi",
        },
        description: {
          tr: "Plajlara, restoranlara, marinaya ve çevredeki tarihi noktalara ulaşım açısından pratik bir merkezdir.",
          en: "A convenient base for beaches, restaurants, the marina and nearby historic sites.",
        },
      },
      {
        name: {
          tr: "Didim",
          en: "Didim",
        },
        description: {
          tr: "Uzun plajları ve yazlık atmosferiyle deniz tatiline odaklanan ziyaretçiler için uygundur.",
          en: "Suitable for beach-focused travelers thanks to its long beaches and summer atmosphere.",
        },
      },
    ],

    tips: {
      tr: [
        "Kuşadası'nda marina ve merkez çevresindeki konumları karşılaştırın.",
        "Didim'de plaja mesafeyi harita üzerinden kontrol edin.",
        "Yaz aylarında erken rezervasyon avantaj sağlayabilir.",
        "Antik kent gezileri planlıyorsanız ulaşım süresini hesaba katın.",
      ],
      en: [
        "Compare locations around the marina and center of Kusadasi.",
        "Check the exact distance to the beach in Didim.",
        "Early booking can be useful during the summer season.",
        "Consider travel times if you plan to visit ancient sites.",
      ],
    },
  },

  trabzon: {
    name: {
      tr: "Trabzon",
      en: "Trabzon",
    },

    intro: {
      tr: "Trabzon'da konaklama için şehir merkezi, Ortahisar ve sahil çevresi öne çıkar. Şehri keşfetmenin yanında Uzungöl, Sümela Manastırı ve çevredeki yaylalara günübirlik geziler planlayanlar için ulaşım açısından uygun bir konum seçmek önemlidir.",
      en: "Trabzon offers accommodation around the city center, Ortahisar and coastal areas. If you also plan day trips to Uzungol, Sumela Monastery and nearby highlands, choosing a convenient location can save considerable travel time.",
    },

    whereToStay: {
      tr: "Şehir merkezini keşfetmek isteyenler merkezi bölgelerde, çevre gezileri yapacak olanlar ise araçla ulaşımı kolay konumlarda kalabilir.",
      en: "Travelers focused on the city can stay centrally, while those planning road trips may prefer locations with easier vehicle access.",
    },

    areas: [
      {
        name: {
          tr: "Ortahisar",
          en: "Ortahisar",
        },
        description: {
          tr: "Şehir merkezine, restoranlara ve tarihi noktalara yakınlığıyla pratik bir seçimdir.",
          en: "A practical choice close to the city center, restaurants and historic attractions.",
        },
      },
      {
        name: {
          tr: "Sahil Çevresi",
          en: "Coastal Area",
        },
        description: {
          tr: "Deniz manzarası ve şehirden biraz daha ferah bir atmosfer isteyenler için değerlendirilebilir.",
          en: "Worth considering for travelers looking for sea views and a more open atmosphere.",
        },
      },
    ],

    tips: {
      tr: [
        "Yağışlı havalar için otelin konumunu ve ulaşım imkanlarını kontrol edin.",
        "Uzungöl veya Sümela gezileri planlıyorsanız araç erişimini düşünün.",
        "Şehir merkezinde kalmak restoranlara ulaşımı kolaylaştırır.",
        "Manzara için rezervasyon yapıyorsanız oda tipini kontrol edin.",
      ],
      en: [
        "Check transport options and location for rainy weather.",
        "Consider vehicle access if you plan trips to Uzungol or Sumela.",
        "Staying centrally makes reaching restaurants easier.",
        "Check the exact room category if a view is important to you.",
      ],
    },
  },

  edirne: {
    name: {
      tr: "Edirne",
      en: "Edirne",
    },

    intro: {
      tr: "Edirne, özellikle Selimiye Camii ve tarihi merkez çevresinde konaklamak isteyenler için yürüyerek keşfedilebilecek şehirlerden biridir. Merkezi bir otel seçmek, tarihi yapılar, çarşılar ve restoranlar arasında ulaşımı kolaylaştırır.",
      en: "Edirne is a city that can be explored comfortably on foot, especially around Selimiye Mosque and the historic center. Staying centrally makes it easier to reach historic sights, bazaars and restaurants.",
    },

    whereToStay: {
      tr: "İlk kez gelenler için şehir merkezi en pratik seçenektir. Tarihi noktalara yakınlık, kısa şehir gezilerinde zaman kazandırır.",
      en: "The city center is the most practical choice for first-time visitors, especially for short trips focused on historic attractions.",
    },

    areas: [
      {
        name: {
          tr: "Şehir Merkezi",
          en: "City Center",
        },
        description: {
          tr: "Selimiye Camii, çarşılar, restoranlar ve tarihi yapılara ulaşmak için en kullanışlı bölgedir.",
          en: "The most convenient area for reaching Selimiye Mosque, bazaars, restaurants and historic buildings.",
        },
      },
    ],

    tips: {
      tr: [
        "Kısa ziyaretlerde merkezi konum ciddi zaman kazandırabilir.",
        "Otopark ihtiyacınız varsa otelin kendi otoparkını kontrol edin.",
        "Tarihi merkezde yürüyerek ulaşabileceğiniz otelleri değerlendirin.",
        "Hafta sonu yoğunluğunu göz önünde bulundurun.",
      ],
      en: [
        "A central location can save significant time on short visits.",
        "Check hotel parking if you are traveling by car.",
        "Consider hotels within walking distance of the historic center.",
        "Keep weekend crowds in mind.",
      ],
    },
  },

  bangkok: {
    name: {
      tr: "Bangkok",
      en: "Bangkok",
    },

    intro: {
      tr: "Bangkok'ta konaklama bölgesi seçimi, şehrin yoğun trafiği ve geniş ulaşım ağı nedeniyle önemlidir. Tarihi tapınaklara yakın olmak isteyenler Old Town çevresini, alışveriş ve modern şehir hayatı isteyenler Sukhumvit veya Siam bölgelerini değerlendirebilir.",
      en: "Choosing the right area in Bangkok is important because of the city's traffic and extensive transport network. Travelers focused on temples can consider the Old Town, while Sukhumvit and Siam are better suited to shopping and modern city life.",
    },

    whereToStay: {
      tr: "İlk ziyaretlerde ulaşım bağlantıları güçlü bir bölgede kalmak günlük gezileri kolaylaştırır. BTS veya MRT istasyonlarına yakınlık özellikle değerlidir.",
      en: "For a first visit, staying near strong transport connections can make sightseeing much easier. Proximity to BTS or MRT stations is especially useful.",
    },

    areas: [
      {
        name: {
          tr: "Sukhumvit",
          en: "Sukhumvit",
        },
        description: {
          tr: "Modern oteller, restoranlar, alışveriş ve BTS bağlantılarıyla şehir gezileri için pratik bir bölgedir.",
          en: "A practical area with modern hotels, restaurants, shopping and BTS connections.",
        },
      },
      {
        name: {
          tr: "Old Town",
          en: "Old Town",
        },
        description: {
          tr: "Tapınaklara ve Bangkok'un tarihi noktalarına yakın olmak isteyenler için daha karakterli bir seçimdir.",
          en: "A more atmospheric choice for travelers who want to stay near Bangkok's temples and historic sights.",
        },
      },
      {
        name: {
          tr: "Siam",
          en: "Siam",
        },
        description: {
          tr: "Alışveriş merkezleri ve modern şehir hayatına yakın olmak isteyenler için merkezi bir seçenektir.",
          en: "A central option for travelers focused on shopping malls and modern city life.",
        },
      },
    ],

    tips: {
      tr: [
        "BTS veya MRT'ye yakın otelleri önceliklendirin.",
        "Otelin konumunu trafik saatlerini düşünerek değerlendirin.",
        "Tapınak gezileri için Old Town ulaşımını kontrol edin.",
        "Klima ve havuz özellikle sıcak aylarda önemli olabilir.",
      ],
      en: [
        "Prioritize hotels close to BTS or MRT stations.",
        "Consider traffic when evaluating a hotel's location.",
        "Check access to Old Town if temples are a priority.",
        "Air conditioning and a pool can be valuable in hot weather.",
      ],
    },
  },

  paris: {
    name: {
      tr: "Paris",
      en: "Paris",
    },

    intro: {
      tr: "Paris'te otel seçerken bölge seçimi seyahatinizin temposunu belirler. Louvre, Notre-Dame ve Seine çevresine yakın olmak isteyenler merkezi bölgeleri, daha yerel ve bohem bir atmosfer arayanlar ise Montmartre veya Latin Mahallesi gibi bölgeleri değerlendirebilir.",
      en: "The neighborhood you choose in Paris can shape the pace of your trip. Central areas are convenient for the Louvre, Notre-Dame and the Seine, while Montmartre and the Latin Quarter offer a more local and atmospheric experience.",
    },

    whereToStay: {
      tr: "İlk Paris seyahatlerinde metro bağlantısı güçlü merkezi bir konum seçmek birçok noktaya ulaşmayı kolaylaştırır.",
      en: "For a first trip to Paris, choosing a central area with strong Metro connections can make exploring the city much easier.",
    },

    areas: [
      {
        name: {
          tr: "Latin Mahallesi",
          en: "Latin Quarter",
        },
        description: {
          tr: "Kafeler, restoranlar ve tarihi atmosferiyle yürüyerek keşfetmeyi sevenler için keyifli bir bölgedir.",
          en: "A charming area with cafes, restaurants and historic atmosphere, ideal for exploring on foot.",
        },
      },
      {
        name: {
          tr: "Montmartre",
          en: "Montmartre",
        },
        description: {
          tr: "Sanat atmosferi, dar sokakları ve Sacré-Cœur çevresiyle karakterli bir konaklama deneyimi sunar.",
          en: "Known for its artistic atmosphere, narrow streets and Sacré-Cœur surroundings.",
        },
      },
      {
        name: {
          tr: "Le Marais",
          en: "Le Marais",
        },
        description: {
          tr: "Restoranlar, mağazalar ve tarihi sokaklarıyla merkezi ve hareketli bir alternatiftir.",
          en: "A central and lively area with restaurants, shops and historic streets.",
        },
      },
    ],

    tips: {
      tr: [
        "Metro istasyonuna yakınlık Paris'te önemli bir avantajdır.",
        "Otel odalarının metrekare bilgilerini kontrol edin.",
        "Merkezi bölgelerde fiyatlar yükseldiği için çevre mahalleleri de karşılaştırın.",
        "Gece geç saatlerde ulaşım planınızı önceden düşünün.",
      ],
      en: [
        "Being close to a Metro station is a major advantage in Paris.",
        "Check the actual room size before booking.",
        "Compare nearby neighborhoods because central areas can be expensive.",
        "Consider your late-night transport options in advance.",
      ],
    },
  },

  londra: {
    name: {
      tr: "Londra",
      en: "London",
    },

    intro: {
      tr: "Londra çok geniş bir şehir olduğu için otel seçerken yalnızca fiyat ve oda özelliklerine bakmak yerine ulaşım bağlantılarını da değerlendirmek gerekir. Westminster, Soho, Covent Garden ve South Bank gibi merkezi bölgeler farklı seyahat tarzlarına hitap eder.",
      en: "London is a large city, so transport connections should be considered alongside price and room features. Westminster, Soho, Covent Garden and South Bank each suit different travel styles.",
    },

    whereToStay: {
      tr: "Londra'da merkezi bir Metro veya Tube istasyonuna yakın olmak, şehirde geçireceğiniz zamanı daha verimli kullanmanızı sağlar.",
      en: "Staying near a central Tube station can help you make much better use of your time in London.",
    },

    areas: [
      {
        name: {
          tr: "Westminster",
          en: "Westminster",
        },
        description: {
          tr: "Parlamento, Big Ben ve Thames çevresindeki önemli noktalara yakın olmak isteyenler için uygundur.",
          en: "Suitable for travelers who want to stay near Parliament, Big Ben and the Thames.",
        },
      },
      {
        name: {
          tr: "Covent Garden",
          en: "Covent Garden",
        },
        description: {
          tr: "Tiyatro, restoran, alışveriş ve merkezi konum arayanlar için hareketli bir bölgedir.",
          en: "A lively choice for travelers interested in theaters, restaurants, shopping and central access.",
        },
      },
      {
        name: {
          tr: "South Bank",
          en: "South Bank",
        },
        description: {
          tr: "Thames kıyısında yürüyüş yapmak ve şehir manzarasının tadını çıkarmak isteyenler için güzel bir seçenektir.",
          en: "A good option for travelers who enjoy riverside walks and city views along the Thames.",
        },
      },
    ],

    tips: {
      tr: [
        "Tube istasyonuna yürüme mesafesini kontrol edin.",
        "Londra'da merkezi konum fiyatı ciddi şekilde etkileyebilir.",
        "Otelin çevresindeki gece ulaşım seçeneklerini inceleyin.",
        "Oda büyüklüğünü ve yatak tipini rezervasyondan önce kontrol edin.",
      ],
      en: [
        "Check the walking distance to the nearest Tube station.",
        "Central locations can significantly affect hotel prices in London.",
        "Check late-night transport options around the hotel.",
        "Review room size and bed type before booking.",
      ],
    },
  },

  dubai: {
    name: {
      tr: "Dubai",
      en: "Dubai",
    },

    intro: {
      tr: "Dubai'de konaklama seçimi tatilinizin tarzına göre yapılmalı. Downtown Dubai Burj Khalifa ve alışveriş merkezlerine yakınlığıyla öne çıkarken Dubai Marina ve JBR sahil odaklı konaklamalar için tercih edilebilir.",
      en: "Choosing where to stay in Dubai depends heavily on your travel style. Downtown Dubai is convenient for Burj Khalifa and major malls, while Dubai Marina and JBR are better suited to beach-focused stays.",
    },

    whereToStay: {
      tr: "Şehir gezileri için Downtown, sahil tatili için Marina ve JBR, daha sakin ve resort odaklı bir deneyim için Palm Jumeirah değerlendirilebilir.",
      en: "Downtown works well for sightseeing, Marina and JBR for beach stays, and Palm Jumeirah for a more resort-focused experience.",
    },

    areas: [
      {
        name: {
          tr: "Downtown Dubai",
          en: "Downtown Dubai",
        },
        description: {
          tr: "Burj Khalifa, Dubai Mall ve şehir merkezindeki önemli noktalara yakın olmak isteyenler için merkezi bir seçimdir.",
          en: "A central choice for travelers who want easy access to Burj Khalifa, Dubai Mall and downtown attractions.",
        },
      },
      {
        name: {
          tr: "Dubai Marina",
          en: "Dubai Marina",
        },
        description: {
          tr: "Marina manzarası, restoranlar ve sahile yakınlığıyla modern bir tatil atmosferi sunar.",
          en: "Offers a modern holiday atmosphere with marina views, restaurants and beach access.",
        },
      },
      {
        name: {
          tr: "JBR",
          en: "JBR",
        },
        description: {
          tr: "Plaja ve yürüyüş alanlarına yakın olmak isteyenler için popüler bir bölgedir.",
          en: "A popular area for travelers who want to stay close to the beach and waterfront walks.",
        },
      },
    ],

    tips: {
      tr: [
        "Metroya yakınlık şehir içinde ulaşımı kolaylaştırabilir.",
        "Yaz aylarında otelin havuz ve klima imkanlarını kontrol edin.",
        "Sahile yakın otellerin plaj erişimini ayrıca inceleyin.",
        "Havalimanı ve otel arasındaki transfer süresini hesaba katın.",
      ],
      en: [
        "Being close to the Metro can make getting around easier.",
        "Check pool and air-conditioning facilities during summer.",
        "Review the exact beach access offered by coastal hotels.",
        "Consider transfer time between the airport and hotel.",
      ],
    },
  },

  roma: {
    name: {
      tr: "Roma",
      en: "Rome",
    },

    intro: {
      tr: "Roma'da konaklama seçerken tarihi merkez ile ulaşım kolaylığı arasında denge kurmak önemlidir. Kolezyum, Trevi Çeşmesi ve Pantheon gibi noktalara yakın bölgeler yürüyerek keşif için avantaj sağlarken Termini çevresi ulaşım bağlantıları açısından pratiktir.",
      en: "When choosing accommodation in Rome, it is useful to balance historic location with transport convenience. Areas near the Colosseum, Trevi Fountain and Pantheon are great for walking, while Termini offers strong transport connections.",
    },

    whereToStay: {
      tr: "İlk kez Roma'ya gelenler için tarihi merkeze yakın konaklama yürüyerek daha fazla yer görmeyi sağlayabilir. Günübirlik tren gezileri planlayanlar Termini çevresini değerlendirebilir.",
      en: "For first-time visitors, staying near the historic center makes it easier to explore on foot. Travelers planning train day trips may prefer the Termini area.",
    },

    areas: [
      {
        name: {
          tr: "Tarihi Merkez",
          en: "Historic Center",
        },
        description: {
          tr: "Pantheon, Trevi Çeşmesi ve Piazza Navona gibi önemli noktalara yürüyerek ulaşmak isteyenler için idealdir.",
          en: "Ideal for travelers who want to walk to the Pantheon, Trevi Fountain and Piazza Navona.",
        },
      },
      {
        name: {
          tr: "Monti",
          en: "Monti",
        },
        description: {
          tr: "Kolezyum'a yakınlığı ve restoranlarıyla merkezi fakat daha mahalle hissi veren bir bölgedir.",
          en: "A central neighborhood with a local feel, restaurants and easy access to the Colosseum.",
        },
      },
      {
        name: {
          tr: "Termini",
          en: "Termini",
        },
        description: {
          tr: "Tren ve metro bağlantıları nedeniyle şehir içi ve şehir dışı geziler için pratiktir.",
          en: "Practical for both city transport and train trips thanks to strong rail and Metro connections.",
        },
      },
    ],

    tips: {
      tr: [
        "Tarihi merkezde kalıyorsanız birçok noktaya yürüyerek ulaşabilirsiniz.",
        "Termini çevresinde otelin tam konumunu önceden kontrol edin.",
        "Eski binalardaki asansör ve oda büyüklüklerini inceleyin.",
        "Yaz aylarında klima önemli bir kriterdir.",
      ],
      en: [
        "Staying in the historic center can let you reach many sights on foot.",
        "Check the exact hotel location around Termini before booking.",
        "Review elevator availability and room size in older buildings.",
        "Air conditioning is important during summer.",
      ],
    },
  },
};