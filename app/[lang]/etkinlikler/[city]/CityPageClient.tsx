"use client";

import {
  MapPin,
  Clock,
  CalendarDays,
  Lightbulb,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import Link from "next/link";

type LangText = {
  tr: string;
  en: string;
};

type LangList = {
  tr: string[];
  en: string[];
};

type City = {
  id: string;
  name: LangText;
  image: string;
  desc: LangText;
  intro: LangText;

  thingsToDo: {
    title: LangText;
    text: LangText;
  }[];

  itinerary: LangList;

  bestTime: LangText;

  tips: LangList;

  faq: {
    tr: {
      q: string;
      a: string;
    }[];

    en: {
      q: string;
      a: string;
    }[];
  };
};

/* =========================================================
   ŞEHİR VERİLERİ
   ========================================================= */

const citiesData: City[] = [
  /* =======================================================
     İSTANBUL
  ======================================================= */

  {
    id: "istanbul",

    name: {
      tr: "İstanbul",
      en: "Istanbul",
    },

    image: "/assets/sehir1/istanbul.webp",

    desc: {
      tr: "Boğaz manzaraları, tarihi yapılar, müzeler ve unutulmaz şehir deneyimleriyle İstanbul'u keşfedin.",
      en: "Discover Istanbul with its Bosphorus views, historic landmarks, museums and unforgettable city experiences.",
    },

    intro: {
      tr: "İstanbul, Avrupa ile Asya'yı birbirine bağlayan eşsiz konumuyla Türkiye'nin en özel şehirlerinden biridir. Tarihi yarımadadaki görkemli yapılar, Boğaz'ın iki yakasındaki mahalleler, hareketli çarşılar ve farklı mutfak kültürleri şehri keşfetmeyi başlı başına bir deneyime dönüştürür. İlk kez İstanbul'a gelenler için tarihi yarımadayı gezmek, Boğaz'ı görmek ve şehrin farklı semtlerini keşfetmek güzel bir başlangıçtır.",

      en: "Istanbul is one of Turkey's most fascinating cities, with a unique location connecting Europe and Asia. Magnificent landmarks on the historic peninsula, neighborhoods along the Bosphorus, lively markets and diverse food culture make exploring the city an experience in itself. For first-time visitors, exploring the historic peninsula, seeing the Bosphorus and discovering different neighborhoods are great places to start.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Boğaz Turu",
          en: "Bosphorus Cruise",
        },
        text: {
          tr: "İstanbul'u sudan görmek şehrin atmosferini farklı bir açıdan deneyimlemenizi sağlar. Avrupa ve Asya kıyıları boyunca ilerleyen turlar özellikle gün batımında keyifli olabilir.",
          en: "Seeing Istanbul from the water offers a completely different perspective. Cruises along the European and Asian shores can be especially enjoyable around sunset.",
        },
      },
      {
        title: {
          tr: "Tarihi Yarımadayı Keşfet",
          en: "Explore the Historic Peninsula",
        },
        text: {
          tr: "Ayasofya, Sultanahmet Camii, Topkapı Sarayı ve Kapalıçarşı İstanbul'un tarihi dokusunu keşfetmek isteyenlerin rotasında bulunmalı.",
          en: "Hagia Sophia, the Blue Mosque, Topkapi Palace and the Grand Bazaar are essential stops for discovering Istanbul's historic character.",
        },
      },
      {
        title: {
          tr: "Galata ve Karaköy",
          en: "Galata & Karakoy",
        },
        text: {
          tr: "Galata Kulesi çevresindeki sokaklar ve Karaköy'ün kafeleri, restoranları ve sahil bölgesi İstanbul'un modern yüzünü keşfetmek için güzel seçeneklerdir.",
          en: "The streets around Galata Tower and the cafes, restaurants and waterfront of Karakoy offer a great way to experience modern Istanbul.",
        },
      },
      {
        title: {
          tr: "Kadıköy'ü Keşfet",
          en: "Explore Kadikoy",
        },
        text: {
          tr: "Kadıköy çarşısı, kafeleri, restoranları ve sahil yürüyüşleriyle şehrin Anadolu yakasını deneyimlemek isteyenler için keyifli bir duraktır.",
          en: "Kadikoy is a lively destination for experiencing Istanbul's Asian side, with its market, cafes, restaurants and waterfront.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Sultanahmet Meydanı, Ayasofya ve Sultanahmet Camii çevresini keşfedin.",
        "Öğle: Tarihi yarımadada Türk mutfağından bir öğle yemeği deneyin.",
        "Öğleden sonra: Kapalıçarşı ve Eminönü çevresinde yürüyüş yapın.",
        "Akşam: Boğaz manzaralı bir noktada gün batımını izleyin veya akşam Boğaz turuna katılın.",
      ],
      en: [
        "Morning: Explore Sultanahmet Square, Hagia Sophia and the Blue Mosque area.",
        "Lunch: Enjoy traditional Turkish cuisine in the historic peninsula.",
        "Afternoon: Walk through the Grand Bazaar and around Eminonu.",
        "Evening: Watch the sunset from a Bosphorus viewpoint or join an evening cruise.",
      ],
    },

    bestTime: {
      tr: "İstanbul yıl boyunca ziyaret edilebilir. İlkbahar ve sonbahar yürüyerek şehir keşfetmek için genellikle daha rahat dönemlerdir. Yaz aylarında Boğaz turları ve açık hava aktiviteleri öne çıkar.",
      en: "Istanbul can be visited throughout the year. Spring and autumn are generally comfortable for exploring the city on foot, while summer is ideal for Bosphorus cruises and outdoor activities.",
    },

    tips: {
      tr: [
        "Tarihi bölgeleri yürüyerek keşfedecekseniz rahat ayakkabı tercih edin.",
        "Boğaz turundan önce hava durumunu kontrol edin.",
        "Toplu taşımada İstanbulkart kullanmak işleri kolaylaştırabilir.",
        "Popüler aktiviteler için yoğun dönemlerde önceden rezervasyon yapmayı düşünün.",
      ],
      en: [
        "Wear comfortable shoes when exploring historic areas on foot.",
        "Check the weather before taking a Bosphorus cruise.",
        "An Istanbulkart can make public transportation easier.",
        "Consider booking popular activities in advance during busy periods.",
      ],
    },

    faq: {
      tr: [
        {
          q: "İstanbul'da kaç gün kalınmalı?",
          a: "Şehrin önemli noktalarını görmek için en az 2-3 gün ayırmak iyi bir başlangıçtır. Daha sakin bir gezi için 4-5 gün planlanabilir.",
        },
        {
          q: "İstanbul'da Boğaz turu yapılır mı?",
          a: "Evet. Boğaz turları İstanbul'daki en popüler deneyimlerden biridir ve farklı sürelerde seçenekler bulunabilir.",
        },
        {
          q: "İstanbul'da ilk nereler gezilmeli?",
          a: "İlk ziyaretinizde Sultanahmet, Ayasofya, Topkapı Sarayı, Kapalıçarşı, Galata, Karaköy ve Boğaz çevresini değerlendirebilirsiniz.",
        },
        {
          q: "İstanbul'a ne zaman gidilir?",
          a: "Şehir yıl boyunca ziyaret edilebilir. İlkbahar ve sonbahar şehir yürüyüşleri için özellikle keyifli dönemlerdir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Istanbul?",
          a: "At least 2-3 days is a good starting point for the main sights. A 4-5 day trip allows for a more relaxed experience.",
        },
        {
          q: "Can you take a Bosphorus cruise in Istanbul?",
          a: "Yes. Bosphorus cruises are among the city's most popular experiences, with different durations available.",
        },
        {
          q: "Where should you visit first in Istanbul?",
          a: "For a first visit, consider Sultanahmet, Hagia Sophia, Topkapi Palace, the Grand Bazaar, Galata, Karakoy and the Bosphorus.",
        },
        {
          q: "When is the best time to visit Istanbul?",
          a: "Istanbul can be visited year-round, while spring and autumn are particularly pleasant for walking and sightseeing.",
        },
      ],
    },
  },

  /* =======================================================
     NEVŞEHİR
  ======================================================= */

  {
    id: "nevsehir",

    name: {
      tr: "Nevşehir",
      en: "Nevsehir",
    },

    image: "/assets/sehir1/nevsehir.webp",

    desc: {
      tr: "Kapadokya'nın peri bacaları, vadileri, yer altı şehirleri ve sıcak hava balonlarıyla eşsiz bir deneyim yaşayın.",
      en: "Experience Cappadocia's fairy chimneys, valleys, underground cities and hot air balloon adventures.",
    },

    intro: {
      tr: "Nevşehir denildiğinde akla ilk olarak Kapadokya gelir. Peri bacaları, kayalara oyulmuş yerleşimler, vadiler ve gün doğumunda gökyüzünü dolduran sıcak hava balonları bölgeyi Türkiye'nin en özel seyahat rotalarından biri haline getirir. Kapadokya'yı keşfederken yalnızca balon turuna değil, vadilerde yürüyüşe, yer altı şehirlerine ve bölgenin geleneksel yaşamına da zaman ayırmak gerekir.",

      en: "Nevsehir is closely associated with Cappadocia, one of Turkey's most distinctive travel destinations. Fairy chimneys, rock-cut settlements, valleys and hot air balloons filling the sky at sunrise create an unforgettable landscape. When exploring Cappadocia, it is worth making time not only for a balloon flight but also for valley walks, underground cities and local culture.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Sıcak Hava Balonu",
          en: "Hot Air Balloon Ride",
        },
        text: {
          tr: "Kapadokya'nın gün doğumu manzarasını gökyüzünden izlemek bölgenin en unutulmaz deneyimlerinden biridir.",
          en: "Watching Cappadocia's sunrise landscape from the sky is one of the region's most memorable experiences.",
        },
      },
      {
        title: {
          tr: "Göreme Vadilerini Keşfet",
          en: "Explore the Valleys",
        },
        text: {
          tr: "Göreme çevresindeki vadiler yürüyüş, fotoğraf ve gün doğumu veya gün batımı manzaraları açısından oldukça zengindir.",
          en: "The valleys around Goreme are excellent for hiking, photography and sunrise or sunset views.",
        },
      },
      {
        title: {
          tr: "Yer Altı Şehirleri",
          en: "Underground Cities",
        },
        text: {
          tr: "Derinkuyu ve Kaymaklı gibi yer altı şehirleri Kapadokya'nın geçmişine farklı bir pencereden bakmanızı sağlar.",
          en: "Underground cities such as Derinkuyu and Kaymakli offer a fascinating glimpse into Cappadocia's past.",
        },
      },
      {
        title: {
          tr: "Avanos",
          en: "Avanos",
        },
        text: {
          tr: "Kızılırmak kıyısındaki Avanos, özellikle çömlekçilik geleneği ve atölyeleriyle bölge kültürünü tanımak için güzel bir duraktır.",
          en: "Avanos, located along the Kizilirmak River, is a great place to experience Cappadocia's pottery tradition and local culture.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Gün doğumunda balonları izleyin veya balon turuna katılın.",
        "Öğle: Göreme ve çevresindeki kaya oluşumlarını keşfedin.",
        "Öğleden sonra: Kaymaklı veya Derinkuyu yer altı şehirlerinden birini ziyaret edin.",
        "Akşam: Gün batımını vadilerden birinde izleyin ve Kapadokya mutfağını deneyin.",
      ],
      en: [
        "Morning: Watch the balloons at sunrise or take a balloon flight.",
        "Lunch: Explore Goreme and its surrounding rock formations.",
        "Afternoon: Visit either Kaymakli or Derinkuyu underground city.",
        "Evening: Watch the sunset from one of the valleys and try Cappadocian cuisine.",
      ],
    },

    bestTime: {
      tr: "İlkbahar ve sonbahar Kapadokya'yı yürüyerek keşfetmek için oldukça güzel dönemlerdir. Yaz aylarında günler sıcak olabilir. Kışın ise karla kaplı peri bacaları farklı bir manzara sunar.",
      en: "Spring and autumn are excellent seasons for exploring Cappadocia on foot. Summer days can be hot, while winter can transform the fairy chimneys into a very different snow-covered landscape.",
    },

    tips: {
      tr: [
        "Vadilerde yürüyüş için rahat ve kaymayan ayakkabılar kullanın.",
        "Balon turu için hava koşullarının uygun olması gerektiğini unutmayın.",
        "Gün doğumu ve gün batımı için konumunuzu önceden planlayın.",
        "Kapadokya'da farklı bölgeler birbirine uzak olabileceğinden günlük rotanızı önceden oluşturun.",
      ],
      en: [
        "Wear comfortable shoes with good grip for valley walks.",
        "Remember that balloon flights depend on suitable weather conditions.",
        "Plan your location in advance for sunrise and sunset.",
        "Different areas of Cappadocia can be spread out, so planning your daily route is useful.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Kapadokya'da kaç gün kalınmalı?",
          a: "Bölgenin temel noktalarını görmek için 2-3 gün iyi bir başlangıçtır. Daha kapsamlı bir gezi için 4 gün veya daha fazla ayırabilirsiniz.",
        },
        {
          q: "Kapadokya'da balon turu yapılır mı?",
          a: "Evet. Sıcak hava balonu bölgenin en bilinen aktivitelerinden biridir ancak uçuşlar hava koşullarına bağlıdır.",
        },
        {
          q: "Kapadokya'da nereler gezilmeli?",
          a: "Göreme, Avanos, yer altı şehirleri ve bölgedeki vadiler başlıca seçenekler arasındadır.",
        },
        {
          q: "Kapadokya'ya ne zaman gidilir?",
          a: "İlkbahar ve sonbahar yürüyüşler için uygun dönemlerdir. Kış ise kar manzaraları nedeniyle farklı bir deneyim sunar.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Cappadocia?",
          a: "Two to three days is a good starting point, while four or more days allow for a more comprehensive trip.",
        },
        {
          q: "Can you take a hot air balloon ride in Cappadocia?",
          a: "Yes. Hot air ballooning is one of the region's most famous activities, although flights depend on weather conditions.",
        },
        {
          q: "What should you visit in Cappadocia?",
          a: "Goreme, Avanos, underground cities and the surrounding valleys are among the main highlights.",
        },
        {
          q: "When is the best time to visit Cappadocia?",
          a: "Spring and autumn are excellent for hiking, while winter offers a unique snow-covered landscape.",
        },
      ],
    },
  },

  /* =======================================================
     ANTALYA
  ======================================================= */

  {
    id: "antalya",

    name: {
      tr: "Antalya",
      en: "Antalya",
    },

    image: "/assets/sehir1/antalya.webp",

    desc: {
      tr: "Akdeniz kıyıları, plajlar, şelaleler, antik kentler ve tekne turlarıyla Antalya'yı keşfedin.",
      en: "Discover Antalya with Mediterranean beaches, waterfalls, ancient cities and boat tours.",
    },

    intro: {
      tr: "Antalya, Akdeniz kıyısındaki doğal güzellikleri ve tarihi zenginlikleri bir arada sunan önemli bir tatil destinasyonudur. Şehir merkezinden kısa sürede plajlara, şelalelere ve antik kentlere ulaşılabilir. Deniz tatilini kültür gezileriyle birleştirmek isteyenler için Antalya oldukça geniş bir seçenek sunar.",

      en: "Antalya is a major Mediterranean destination where natural beauty and history come together. From the city center, travelers can reach beaches, waterfalls and ancient sites relatively easily. It offers a wide range of options for combining a beach holiday with cultural exploration.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Kaleiçi'ni Keşfet",
          en: "Explore Kaleici",
        },
        text: {
          tr: "Tarihi sokakları, eski evleri, restoranları ve marina manzarasıyla Kaleiçi Antalya'nın en karakteristik bölgelerinden biridir.",
          en: "With historic streets, old houses, restaurants and marina views, Kaleici is one of Antalya's most distinctive areas.",
        },
      },
      {
        title: {
          tr: "Düden Şelaleleri",
          en: "Duden Waterfalls",
        },
        text: {
          tr: "Şehir merkezine yakın konumuyla Düden Şelaleleri kısa bir doğa kaçamağı yapmak isteyenler için güzel bir seçenektir.",
          en: "Located close to the city center, Duden Waterfalls are a convenient option for a short nature escape.",
        },
      },
      {
        title: {
          tr: "Antik Kentleri Gezin",
          en: "Visit Ancient Cities",
        },
        text: {
          tr: "Perge, Aspendos ve Side gibi antik kentler Antalya'nın tarihini keşfetmek isteyenler için önemli duraklardır.",
          en: "Ancient sites such as Perge, Aspendos and Side are important stops for travelers interested in Antalya's history.",
        },
      },
      {
        title: {
          tr: "Tekne Turu",
          en: "Boat Tour",
        },
        text: {
          tr: "Akdeniz kıyılarını denizden keşfetmek, koyları görmek ve sıcak havalarda serinlemek için tekne turları tercih edilebilir.",
          en: "Boat tours are a great way to explore the Mediterranean coastline, discover hidden bays and cool off in warm weather.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Kaleiçi sokaklarında yürüyüş yapın.",
        "Öğle: Marina çevresinde Akdeniz manzarası eşliğinde yemek yiyin.",
        "Öğleden sonra: Düden Şelalesi veya yakın çevredeki doğal güzellikleri keşfedin.",
        "Akşam: Sahil boyunca yürüyüş yapın veya gün batımı tekne turuna katılın.",
      ],
      en: [
        "Morning: Walk through the historic streets of Kaleici.",
        "Lunch: Enjoy a meal with Mediterranean views around the marina.",
        "Afternoon: Visit Duden Waterfalls or explore nearby natural attractions.",
        "Evening: Walk along the coast or join a sunset boat tour.",
      ],
    },

    bestTime: {
      tr: "Deniz tatili için yaz ayları oldukça hareketlidir. İlkbahar ve sonbahar ise hem şehir gezileri hem de antik kent ziyaretleri için daha ılıman koşullar sunabilir.",
      en: "Summer is the busiest season for beach holidays. Spring and autumn can offer milder conditions for sightseeing and visiting ancient sites.",
    },

    tips: {
      tr: [
        "Yaz aylarında açık hava gezileri için güneşten korunmayı unutmayın.",
        "Antik kentleri gezerken su ve rahat ayakkabı bulundurun.",
        "Tekne turlarında hava durumunu kontrol edin.",
        "Şehir merkezinden farklı bölgelere gidecekseniz ulaşım süresini hesaba katın.",
      ],
      en: [
        "Protect yourself from the sun during outdoor activities in summer.",
        "Carry water and wear comfortable shoes when visiting ancient sites.",
        "Check the weather before joining a boat tour.",
        "Allow enough travel time when visiting areas outside the city center.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Antalya'da kaç gün kalınmalı?",
          a: "Sadece şehir merkezini gezmek için 2-3 gün yeterli olabilir. Çevredeki antik kentleri ve doğal alanları görmek için daha uzun plan yapmak gerekir.",
        },
        {
          q: "Antalya'da hangi antik kentler gezilmeli?",
          a: "Perge, Aspendos ve Side en bilinen seçenekler arasındadır.",
        },
        {
          q: "Antalya'da tekne turu yapılır mı?",
          a: "Evet. Antalya ve çevresindeki kıyılarda farklı sürelerde tekne turları düzenlenmektedir.",
        },
        {
          q: "Antalya'ya ne zaman gidilir?",
          a: "Deniz tatili için yaz, daha rahat şehir ve kültür gezileri için ilkbahar ve sonbahar tercih edilebilir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Antalya?",
          a: "Two to three days can be enough for the city center, while more time is needed for surrounding ancient sites and natural attractions.",
        },
        {
          q: "Which ancient cities should you visit near Antalya?",
          a: "Perge, Aspendos and Side are among the most popular ancient sites.",
        },
        {
          q: "Can you take a boat tour in Antalya?",
          a: "Yes. Different boat tours are available along the Antalya coastline.",
        },
        {
          q: "When is the best time to visit Antalya?",
          a: "Summer is popular for beach holidays, while spring and autumn are comfortable for sightseeing.",
        },
      ],
    },
  },

  /* =======================================================
     İZMİR
  ======================================================= */

  {
    id: "izmir",

    name: {
      tr: "İzmir",
      en: "Izmir",
    },

    image: "/assets/sehir1/izmir.webp",

    desc: {
      tr: "Ege kıyıları, tarihi kentler, sahil yürüyüşleri ve canlı şehir hayatıyla İzmir'i keşfedin.",
      en: "Discover Izmir with its Aegean coastline, ancient sites, waterfront walks and lively city life.",
    },

    intro: {
      tr: "İzmir, Ege Denizi kıyısındaki konumu, uzun sahil şeridi ve çevresindeki tarihi yerleriyle hem şehir gezisi hem de kısa tatiller için tercih edilen destinasyonlardan biridir. Kordon'da yürüyüş yapmak, tarihi çarşıları keşfetmek ve çevredeki antik kentlere gitmek İzmir gezisinin öne çıkan deneyimleri arasında yer alır.",

      en: "Izmir is a popular destination for city breaks and short holidays thanks to its Aegean location, long waterfront and nearby historical sites. Walking along the Kordon, exploring historic markets and visiting ancient cities around the region are among the highlights of an Izmir trip.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Kordon'da Yürüyüş",
          en: "Walk Along Kordon",
        },
        text: {
          tr: "İzmir'in sahil atmosferini hissetmek için Kordon boyunca yürüyüş yapmak ve gün batımını izlemek güzel bir başlangıçtır.",
          en: "Walking along the Kordon and watching the sunset is a great way to experience Izmir's waterfront atmosphere.",
        },
      },
      {
        title: {
          tr: "Efes Antik Kenti",
          en: "Ephesus Ancient City",
        },
        text: {
          tr: "İzmir çevresindeki en önemli tarihi duraklardan biri olan Efes, antik dünyanın izlerini yakından görmek isteyenler için mutlaka değerlendirilmelidir.",
          en: "Ephesus is one of the region's most important historical sites and a must for travelers interested in the ancient world.",
        },
      },
      {
        title: {
          tr: "Kemeraltı Çarşısı",
          en: "Kemeralti Bazaar",
        },
        text: {
          tr: "Tarihi Kemeraltı Çarşısı, alışveriş, yerel lezzetler ve İzmir'in şehir kültürünü deneyimlemek için hareketli bir bölgedir.",
          en: "The historic Kemeralti Bazaar is a lively area for shopping, local food and experiencing Izmir's urban culture.",
        },
      },
      {
        title: {
          tr: "Şirince",
          en: "Sirince",
        },
        text: {
          tr: "Taş evleri, dar sokakları ve Ege atmosferiyle Şirince, İzmir çevresinde günübirlik ziyaret edilebilecek keyifli yerlerden biridir.",
          en: "With stone houses, narrow streets and Aegean charm, Sirince is a pleasant day-trip destination near Izmir.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Konak Meydanı ve çevresini keşfedin.",
        "Öğle: Kemeraltı Çarşısı'nda yerel lezzetleri deneyin.",
        "Öğleden sonra: Kordon boyunca yürüyüş yapın.",
        "Akşam: Alsancak çevresinde gün batımının ve şehir hayatının tadını çıkarın.",
      ],
      en: [
        "Morning: Explore Konak Square and its surroundings.",
        "Lunch: Try local food around Kemeralti Bazaar.",
        "Afternoon: Walk along the Kordon waterfront.",
        "Evening: Enjoy the sunset and lively atmosphere around Alsancak.",
      ],
    },

    bestTime: {
      tr: "İzmir'i gezmek için ilkbahar ve sonbahar oldukça keyifli dönemlerdir. Yaz ayları ise sahil bölgeleri ve çevredeki tatil noktaları için daha hareketlidir.",
      en: "Spring and autumn are pleasant seasons for exploring Izmir. Summer is busier, particularly around the coastal areas and nearby holiday destinations.",
    },

    tips: {
      tr: [
        "Şehir merkezinde toplu taşıma kullanmak pratik olabilir.",
        "Efes gibi açık hava alanlarını gezerken güneşten korunmayı unutmayın.",
        "Çevre ilçeleri ziyaret edecekseniz ulaşım süresini hesaba katın.",
        "Kordon gün batımı için özellikle güzel bir seçenektir.",
      ],
      en: [
        "Public transportation can be practical in the city center.",
        "Protect yourself from the sun when visiting open-air sites such as Ephesus.",
        "Allow enough travel time when visiting surrounding districts.",
        "The Kordon is particularly enjoyable around sunset.",
      ],
    },

    faq: {
      tr: [
        {
          q: "İzmir'de kaç gün kalınmalı?",
          a: "Şehir merkezini görmek için 2 gün yeterli olabilir. Efes ve çevredeki yerleri de görmek için 3-4 gün planlanabilir.",
        },
        {
          q: "İzmir'de Efes'e nasıl gidilir?",
          a: "Efes, İzmir çevresindeki Selçuk ilçesi yakınındadır ve şehirden günübirlik ziyaret edilebilir.",
        },
        {
          q: "İzmir'de nereler gezilmeli?",
          a: "Konak, Kemeraltı, Kordon, Alsancak ve çevredeki Efes ve Şirince gibi destinasyonlar değerlendirilebilir.",
        },
        {
          q: "İzmir'e ne zaman gidilir?",
          a: "İlkbahar ve sonbahar şehir gezileri için rahat dönemlerdir. Yaz ayları sahil tatilleri için daha hareketlidir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Izmir?",
          a: "Two days can be enough for the city center, while three to four days allow time for Ephesus and nearby destinations.",
        },
        {
          q: "How can you visit Ephesus from Izmir?",
          a: "Ephesus is near Selcuk and can be visited as a day trip from Izmir.",
        },
        {
          q: "What should you visit in Izmir?",
          a: "Konak, Kemeralti, Kordon, Alsancak, Ephesus and Sirince are good options.",
        },
        {
          q: "When is the best time to visit Izmir?",
          a: "Spring and autumn are comfortable for sightseeing, while summer is busier around the coast.",
        },
      ],
    },
  },

  /* =======================================================
     MUĞLA
  ======================================================= */

  {
    id: "mugla",

    name: {
      tr: "Muğla",
      en: "Mugla",
    },

    image: "/assets/sehir1/mugla.webp",

    desc: {
      tr: "Bodrum, Marmaris ve Fethiye'nin koyları, plajları ve tekne turlarıyla Muğla'yı keşfedin.",
      en: "Discover Mugla through the bays, beaches and boat trips of Bodrum, Marmaris and Fethiye.",
    },

    intro: {
      tr: "Muğla, Türkiye'nin en popüler kıyı destinasyonlarından bazılarına ev sahipliği yapan geniş bir bölgedir. Bodrum'un hareketli atmosferi, Marmaris'in koyları ve Fethiye'nin doğal güzellikleri aynı bölgede farklı tatil deneyimleri sunar. Deniz, doğa ve açık hava aktivitelerini sevenler için Muğla oldukça geniş bir seçenek yelpazesine sahiptir.",

      en: "Mugla is home to some of Turkey's most popular coastal destinations. Bodrum's lively atmosphere, Marmaris's bays and Fethiye's natural landscapes offer very different holiday experiences within the same region. Mugla provides a wide range of options for travelers interested in beaches, nature and outdoor activities.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Bodrum'u Keşfet",
          en: "Explore Bodrum",
        },
        text: {
          tr: "Bodrum Kalesi, marina çevresi ve sahil bölgeleri şehrin atmosferini deneyimlemek için güzel başlangıç noktalarıdır.",
          en: "Bodrum Castle, the marina and waterfront areas are good places to start experiencing the town.",
        },
      },
      {
        title: {
          tr: "Marmaris Koyları",
          en: "Marmaris Bays",
        },
        text: {
          tr: "Marmaris çevresindeki koyları denizden keşfetmek için tekne turları oldukça popülerdir.",
          en: "Boat trips are a popular way to explore the bays around Marmaris.",
        },
      },
      {
        title: {
          tr: "Fethiye ve Ölüdeniz",
          en: "Fethiye & Oludeniz",
        },
        text: {
          tr: "Fethiye çevresindeki koylar, yürüyüş rotaları ve Ölüdeniz bölgesi doğa ve deniz tatilini bir araya getirir.",
          en: "The bays, hiking routes and Oludeniz area around Fethiye combine nature and beach experiences.",
        },
      },
      {
        title: {
          tr: "Tekne Turları",
          en: "Boat Trips",
        },
        text: {
          tr: "Muğla kıyılarında denizden ulaşılabilen koyları keşfetmek için farklı tekne turları tercih edilebilir.",
          en: "Various boat trips are available for discovering secluded bays along the Mugla coastline.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Konakladığınız bölgedeki sahil veya koylardan birini keşfedin.",
        "Öğle: Deniz kenarında yerel Ege mutfağından yemek deneyin.",
        "Öğleden sonra: Tekne turu veya kıyı gezisi planlayın.",
        "Akşam: Sahil boyunca yürüyüş yaparak gün batımını izleyin.",
      ],
      en: [
        "Morning: Explore a beach or bay near your accommodation.",
        "Lunch: Try local Aegean cuisine by the sea.",
        "Afternoon: Plan a boat trip or coastal excursion.",
        "Evening: Walk along the waterfront and watch the sunset.",
      ],
    },

    bestTime: {
      tr: "Yaz ayları deniz tatili açısından en hareketli dönemdir. İlkbahar ve sonbahar ise daha sakin bir atmosfer ve açık hava aktiviteleri için tercih edilebilir.",
      en: "Summer is the busiest season for beach holidays. Spring and autumn can offer a quieter atmosphere and pleasant conditions for outdoor activities.",
    },

    tips: {
      tr: [
        "Yaz aylarında güneş koruması kullanın.",
        "Tekne turlarından önce hava durumunu kontrol edin.",
        "Bölgedeki koylar arasında mesafeler uzun olabileceğinden günlük rotayı önceden planlayın.",
        "Yoğun yaz döneminde popüler aktiviteleri önceden ayırtmayı düşünün.",
      ],
      en: [
        "Use sun protection during the summer months.",
        "Check the weather before boat trips.",
        "Distances between coastal destinations can be significant, so plan your route in advance.",
        "Consider booking popular activities ahead during the busy summer season.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Muğla'da nereler gezilmeli?",
          a: "Bodrum, Marmaris, Fethiye ve Ölüdeniz bölgenin en bilinen destinasyonları arasındadır.",
        },
        {
          q: "Muğla'da tekne turu yapılır mı?",
          a: "Evet. Bodrum, Marmaris ve Fethiye çevresinde farklı rotalarda tekne turları bulunabilir.",
        },
        {
          q: "Muğla'ya ne zaman gidilir?",
          a: "Deniz tatili için yaz, daha sakin geziler için ilkbahar ve sonbahar değerlendirilebilir.",
        },
        {
          q: "Muğla'da kaç gün kalınmalı?",
          a: "Tek bir bölgeyi keşfetmek için 3-4 gün yeterli olabilir. Birden fazla bölgeyi görmek için daha uzun süre gerekir.",
        },
      ],

      en: [
        {
          q: "What should you visit in Mugla?",
          a: "Bodrum, Marmaris, Fethiye and Oludeniz are among the region's best-known destinations.",
        },
        {
          q: "Can you take boat trips in Mugla?",
          a: "Yes. Boat trips are available around Bodrum, Marmaris and Fethiye.",
        },
        {
          q: "When is the best time to visit Mugla?",
          a: "Summer is popular for beach holidays, while spring and autumn are quieter.",
        },
        {
          q: "How many days should you spend in Mugla?",
          a: "Three to four days can work for one area, while longer trips are better for exploring multiple destinations.",
        },
      ],
    },
  },

  /* =======================================================
     AYDIN
  ======================================================= */

  {
    id: "aydin",

    name: {
      tr: "Aydın",
      en: "Aydin",
    },

    image: "/assets/sehir1/aydin.webp",

    desc: {
      tr: "Kuşadası, Didim, Ege plajları ve antik kentleriyle Aydın'ı keşfedin.",
      en: "Discover Aydin with Kusadasi, Didim, Aegean beaches and ancient sites.",
    },

    intro: {
      tr: "Aydın, Ege kıyısındaki tatil beldeleri ve çevresindeki antik kentleriyle deniz ve kültür gezisini bir arada sunar. Kuşadası ve Didim özellikle yaz aylarında hareketlenirken, Milet, Priene ve Afrodisias gibi tarihi alanlar bölgenin geçmişini keşfetmek isteyenlere farklı rotalar sunar.",

      en: "Aydin combines coastal holidays with ancient history. Kusadasi and Didim become particularly lively in summer, while historical sites such as Miletus, Priene and Aphrodisias offer different routes for travelers interested in the region's past.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Kuşadası",
          en: "Kusadasi",
        },
        text: {
          tr: "Sahil, marina ve çevredeki plajlarıyla Kuşadası Ege kıyısında popüler bir tatil noktasıdır.",
          en: "With its waterfront, marina and nearby beaches, Kusadasi is a popular Aegean holiday destination.",
        },
      },
      {
        title: {
          tr: "Didim",
          en: "Didim",
        },
        text: {
          tr: "Didim'in sahilleri ve Altınkum çevresi özellikle deniz tatili yapmak isteyenlerin ilgisini çeker.",
          en: "Didim's beaches and the Altinkum area are popular among travelers looking for a beach holiday.",
        },
      },
      {
        title: {
          tr: "Milet Antik Kenti",
          en: "Miletus Ancient City",
        },
        text: {
          tr: "Milet, Ege'nin antik geçmişini görmek isteyenler için önemli tarihi duraklardan biridir.",
          en: "Miletus is an important historical stop for travelers interested in the ancient history of the Aegean.",
        },
      },
      {
        title: {
          tr: "Ege Plajları",
          en: "Aegean Beaches",
        },
        text: {
          tr: "Aydın kıyılarında farklı özelliklere sahip birçok plaj ve koy bulunur.",
          en: "The Aydin coastline offers many beaches and bays with different characteristics.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Kuşadası veya Didim'de sahil bölgesini keşfedin.",
        "Öğle: Ege mutfağından deniz ürünleri veya yerel yemekler deneyin.",
        "Öğleden sonra: Plajda dinlenin veya çevredeki tarihi noktalardan birini ziyaret edin.",
        "Akşam: Sahil boyunca gün batımı yürüyüşü yapın.",
      ],
      en: [
        "Morning: Explore the waterfront in Kusadasi or Didim.",
        "Lunch: Try seafood or local Aegean dishes.",
        "Afternoon: Relax at the beach or visit a nearby historical site.",
        "Evening: Take a sunset walk along the coast.",
      ],
    },

    bestTime: {
      tr: "Deniz tatili için yaz ayları en hareketli dönemdir. Antik kent gezileri için ilkbahar ve sonbahar daha ılıman olabilir.",
      en: "Summer is the busiest season for beach holidays. Spring and autumn can be more comfortable for visiting ancient sites.",
    },

    tips: {
      tr: [
        "Yaz aylarında plajlarda yoğunluk olabileceğini unutmayın.",
        "Antik kent ziyaretleri için sabah veya akşam saatlerini değerlendirin.",
        "Kıyı bölgelerinde güneşten korunmaya dikkat edin.",
        "Birden fazla antik kenti ziyaret edecekseniz ulaşım rotasını önceden planlayın.",
      ],
      en: [
        "Be aware that beaches can be busy during summer.",
        "Consider visiting ancient sites in the morning or late afternoon.",
        "Take sun protection seriously along the coast.",
        "Plan transportation in advance if visiting multiple ancient sites.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Aydın'da nereler gezilmeli?",
          a: "Kuşadası, Didim, Milet ve çevredeki tarihi alanlar değerlendirilebilir.",
        },
        {
          q: "Aydın'da denize girilir mi?",
          a: "Kuşadası ve Didim başta olmak üzere Ege kıyılarında birçok plaj seçeneği bulunur.",
        },
        {
          q: "Aydın'a ne zaman gidilir?",
          a: "Deniz tatili için yaz, kültür gezileri için ilkbahar ve sonbahar tercih edilebilir.",
        },
        {
          q: "Aydın'da kaç gün kalınmalı?",
          a: "Kuşadası veya Didim odaklı bir gezi için 3-4 gün yeterli olabilir.",
        },
      ],

      en: [
        {
          q: "What should you visit in Aydin?",
          a: "Kusadasi, Didim, Miletus and nearby historical sites are good options.",
        },
        {
          q: "Can you swim in Aydin?",
          a: "Yes. The coastline around Kusadasi and Didim offers many beaches.",
        },
        {
          q: "When is the best time to visit Aydin?",
          a: "Summer is popular for beaches, while spring and autumn are good for cultural sightseeing.",
        },
        {
          q: "How many days should you spend in Aydin?",
          a: "Three to four days can work well for a Kusadasi or Didim-focused trip.",
        },
      ],
    },
  },

  /* =======================================================
     TRABZON
  ======================================================= */

  {
    id: "trabzon",

    name: {
      tr: "Trabzon",
      en: "Trabzon",
    },

    image: "/assets/sehir1/trabzon.webp",

    desc: {
      tr: "Karadeniz yaylaları, Sümela Manastırı, göller ve yemyeşil doğasıyla Trabzon'u keşfedin.",
      en: "Discover Trabzon with Black Sea plateaus, Sumela Monastery, mountain lakes and lush landscapes.",
    },

    intro: {
      tr: "Trabzon, Karadeniz'in yemyeşil doğasını ve tarihi mirasını bir arada görmek isteyenler için önemli bir seyahat rotasıdır. Şehir merkezinin yanı sıra Maçka çevresi, Sümela Manastırı ve yaylalar bölgenin en çok ilgi gören noktaları arasındadır. Doğa yürüyüşleri, manzara seyri ve yöresel yemekler Trabzon gezisinin önemli parçalarıdır.",

      en: "Trabzon is an important destination for travelers who want to experience the lush landscapes and cultural heritage of Turkey's Black Sea region. Beyond the city center, the Macka area, Sumela Monastery and mountain plateaus are among the most popular attractions. Hiking, scenic views and local cuisine are key parts of a Trabzon trip.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Sümela Manastırı",
          en: "Sumela Monastery",
        },
        text: {
          tr: "Dağ yamacındaki konumu ve tarihi dokusuyla Sümela Manastırı Trabzon çevresindeki en dikkat çekici yapılardan biridir.",
          en: "Set on a mountain cliff, Sumela Monastery is one of the most striking historical sites near Trabzon.",
        },
      },
      {
        title: {
          tr: "Uzungöl",
          en: "Uzungol",
        },
        text: {
          tr: "Dağlarla çevrili göl manzarası ve çevredeki yürüyüş rotaları Uzungöl'ü Karadeniz'in en bilinen destinasyonlarından biri haline getirir.",
          en: "Surrounded by mountains, Uzungol is one of the Black Sea region's best-known destinations, with scenic walks and lake views.",
        },
      },
      {
        title: {
          tr: "Yaylalar",
          en: "Mountain Plateaus",
        },
        text: {
          tr: "Karadeniz yaylaları serin havası, yeşil manzaraları ve sakin atmosferiyle şehir hayatından uzaklaşmak isteyenlere hitap eder.",
          en: "Black Sea mountain plateaus offer cool air, green landscapes and a peaceful escape from city life.",
        },
      },
      {
        title: {
          tr: "Karadeniz Mutfağı",
          en: "Black Sea Cuisine",
        },
        text: {
          tr: "Trabzon'da yöresel kahvaltılar, kuymak, hamsi ve farklı Karadeniz lezzetlerini denemek gezinin önemli parçalarından biridir.",
          en: "Trying local breakfasts, kuymak, anchovies and other Black Sea specialties is an important part of visiting Trabzon.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Trabzon şehir merkezinde tarihi noktaları keşfedin.",
        "Öğle: Yöresel Karadeniz yemeklerinden birini deneyin.",
        "Öğleden sonra: Maçka ve Sümela Manastırı çevresine gidin.",
        "Akşam: Şehir merkezine dönerek sahil çevresinde yürüyüş yapın.",
      ],
      en: [
        "Morning: Explore historic areas in central Trabzon.",
        "Lunch: Try a local Black Sea specialty.",
        "Afternoon: Visit the Macka area and Sumela Monastery.",
        "Evening: Return to the city and walk along the waterfront.",
      ],
    },

    bestTime: {
      tr: "Yaz ayları yaylaları ve doğayı keşfetmek için popülerdir. İlkbahar ve sonbaharda doğa farklı renkler sunarken yağış ihtimalini de hesaba katmak gerekir.",
      en: "Summer is popular for exploring plateaus and nature. Spring and autumn offer changing landscapes, although rain should be expected.",
    },

    tips: {
      tr: [
        "Karadeniz'de hava kısa sürede değişebileceğinden hazırlıklı olun.",
        "Yayla gezileri için rahat ve suya dayanıklı ayakkabı tercih edin.",
        "Sümela ve çevresine giderken ulaşım süresini hesaba katın.",
        "Yağmurluk veya ince bir dış katman bulundurmak faydalı olabilir.",
      ],
      en: [
        "Weather can change quickly in the Black Sea region, so be prepared.",
        "Wear comfortable and water-resistant shoes for plateau trips.",
        "Allow enough travel time when visiting Sumela and surrounding areas.",
        "A rain jacket or light outer layer can be useful.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Trabzon'da nereler gezilmeli?",
          a: "Sümela Manastırı, Uzungöl, şehir merkezi ve çevredeki yaylalar başlıca seçeneklerdir.",
        },
        {
          q: "Trabzon'da kaç gün kalınmalı?",
          a: "Şehir ve çevresini görmek için 3-4 gün iyi bir başlangıçtır.",
        },
        {
          q: "Trabzon'a ne zaman gidilir?",
          a: "Yaz ayları yaylalar için popülerdir. İlkbahar ve sonbahar ise daha farklı doğa manzaraları sunabilir.",
        },
        {
          q: "Trabzon'da ne yenir?",
          a: "Kuymak, hamsi ve yöresel kahvaltı seçenekleri Karadeniz mutfağının öne çıkan lezzetleri arasındadır.",
        },
      ],

      en: [
        {
          q: "What should you visit in Trabzon?",
          a: "Sumela Monastery, Uzungol, the city center and surrounding plateaus are among the main attractions.",
        },
        {
          q: "How many days should you spend in Trabzon?",
          a: "Three to four days is a good starting point for exploring the city and nearby areas.",
        },
        {
          q: "When is the best time to visit Trabzon?",
          a: "Summer is popular for mountain plateaus, while spring and autumn offer different landscapes.",
        },
        {
          q: "What food should you try in Trabzon?",
          a: "Kuymak, anchovies and local breakfast dishes are among the highlights of Black Sea cuisine.",
        },
      ],
    },
  },

  /* =======================================================
     VİYANA
  ======================================================= */

  {
    id: "viyana",

    name: {
      tr: "Viyana",
      en: "Vienna",
    },

    image: "/assets/sehir1/viyana.webp",

    desc: {
      tr: "Saraylar, klasik müzik, müzeler, tarihi meydanlar ve Avusturya kültürüyle Viyana'yı keşfedin.",
      en: "Discover Vienna with imperial palaces, classical music, museums, historic squares and Austrian culture.",
    },

    intro: {
      tr: "Viyana, Avrupa'nın kültür ve sanat açısından en zengin şehirlerinden biridir. Habsburg döneminden kalan saraylar, müzeler, tarihi merkez ve klasik müzik geleneği şehrin karakterini oluşturur. Şehir merkezinde yürüyerek birçok önemli noktayı görmek mümkünken, müzeler ve saraylar için daha fazla zaman ayırmak gerekir.",

      en: "Vienna is one of Europe's richest cities for culture and the arts. Imperial palaces, museums, the historic center and its classical music tradition shape the character of the city. Many major sights can be explored on foot in the center, while museums and palaces deserve additional time.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Schönbrunn Sarayı",
          en: "Schonbrunn Palace",
        },
        text: {
          tr: "Viyana'nın en önemli tarihi yapılarından biri olan Schönbrunn Sarayı ve bahçeleri şehrin görülmesi gereken noktaları arasındadır.",
          en: "Schonbrunn Palace and its gardens are among Vienna's most important historic attractions.",
        },
      },
      {
        title: {
          tr: "Tarihi Merkez",
          en: "Historic Center",
        },
        text: {
          tr: "Stephansplatz ve çevresindeki tarihi sokaklar Viyana'nın şehir atmosferini keşfetmek için idealdir.",
          en: "Stephansplatz and the surrounding historic streets are ideal for experiencing Vienna's city center.",
        },
      },
      {
        title: {
          tr: "Müzeler",
          en: "Museums",
        },
        text: {
          tr: "Viyana'da sanat, tarih ve imparatorluk dönemine ilişkin çok sayıda müze bulunur.",
          en: "Vienna offers a wide range of museums covering art, history and the imperial era.",
        },
      },
      {
        title: {
          tr: "Klasik Müzik",
          en: "Classical Music",
        },
        text: {
          tr: "Konserler ve opera etkinlikleri Viyana'nın kültürel kimliğinin önemli parçalarındandır.",
          en: "Concerts and opera performances are an important part of Vienna's cultural identity.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Stephansplatz ve tarihi şehir merkezini keşfedin.",
        "Öğle: Geleneksel Avusturya mutfağından yemek deneyin.",
        "Öğleden sonra: Schönbrunn Sarayı'nı ziyaret edin.",
        "Akşam: Klasik müzik veya opera etkinliği değerlendirin.",
      ],
      en: [
        "Morning: Explore Stephansplatz and Vienna's historic center.",
        "Lunch: Try traditional Austrian cuisine.",
        "Afternoon: Visit Schonbrunn Palace.",
        "Evening: Consider a classical music concert or opera performance.",
      ],
    },

    bestTime: {
      tr: "İlkbahar ve sonbahar şehir gezileri için keyifli dönemlerdir. Noel pazarları nedeniyle kış ayları da Viyana'da farklı bir atmosfer sunar.",
      en: "Spring and autumn are pleasant for sightseeing. Winter offers a different atmosphere, especially around the Christmas markets.",
    },

    tips: {
      tr: [
        "Şehir merkezinde yürüyerek birçok noktayı keşfedebilirsiniz.",
        "Müze ve sarayların açılış saatlerini önceden kontrol edin.",
        "Konser veya opera planlıyorsanız biletleri önceden araştırın.",
        "Toplu taşıma şehir içinde pratik bir seçenektir.",
      ],
      en: [
        "Many central attractions can be explored on foot.",
        "Check opening hours for museums and palaces in advance.",
        "Research tickets ahead of time if you want to attend a concert or opera.",
        "Public transportation is practical within the city.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Viyana'da kaç gün kalınmalı?",
          a: "Şehir merkezini ve başlıca sarayları görmek için 3 gün iyi bir başlangıçtır.",
        },
        {
          q: "Viyana'da ne yapılır?",
          a: "Saraylar, müzeler, tarihi merkez, klasik müzik etkinlikleri ve şehir kafeleri öne çıkan seçeneklerdir.",
        },
        {
          q: "Viyana'ya ne zaman gidilir?",
          a: "İlkbahar ve sonbahar şehir gezileri için uygundur. Kış aylarında Noel pazarları farklı bir deneyim sunar.",
        },
        {
          q: "Viyana yürüyerek gezilir mi?",
          a: "Tarihi merkezdeki birçok önemli nokta yürüyerek birbirine ulaşılabilecek mesafededir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Vienna?",
          a: "Three days is a good starting point for the historic center and main palaces.",
        },
        {
          q: "What can you do in Vienna?",
          a: "Palaces, museums, the historic center, classical music and traditional cafes are among the main experiences.",
        },
        {
          q: "When is the best time to visit Vienna?",
          a: "Spring and autumn are good for sightseeing, while winter offers Christmas markets.",
        },
        {
          q: "Can you explore Vienna on foot?",
          a: "Many major attractions in the historic center are within walking distance.",
        },
      ],
    },
  },

  /* =======================================================
     ROMA
  ======================================================= */

  {
    id: "roma",

    name: {
      tr: "Roma",
      en: "Rome",
    },

    image: "/assets/sehir1/roma.webp",

    desc: {
      tr: "Antik Roma'nın izleri, Kolezyum, Vatikan ve tarihi meydanlarıyla Roma'yı keşfedin.",
      en: "Discover Rome through the Colosseum, Vatican, ancient ruins and historic squares.",
    },

    intro: {
      tr: "Roma, binlerce yıllık tarihi ile Avrupa'nın en etkileyici şehirlerinden biridir. Antik Roma kalıntıları, Rönesans ve Barok dönemlerinden kalan yapılar, meydanlar ve Vatikan aynı şehirde farklı dönemleri keşfetme imkanı sunar. Roma'yı gezerken önemli tarihi noktaların yanı sıra sokaklarda yürümeye ve İtalyan mutfağını deneyimlemeye de zaman ayırmak gerekir.",

      en: "Rome is one of Europe's most fascinating cities, with thousands of years of history. Ancient Roman ruins, Renaissance and Baroque architecture, historic squares and Vatican City allow visitors to experience different eras in one trip. Beyond the major sights, walking through Rome's streets and enjoying Italian cuisine are essential parts of the experience.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Kolezyum",
          en: "Colosseum",
        },
        text: {
          tr: "Antik Roma'nın en tanınan yapılarından Kolezyum, Roma gezisinin en önemli duraklarından biridir.",
          en: "The Colosseum is one of Ancient Rome's most recognizable landmarks and a major highlight of any visit.",
        },
      },
      {
        title: {
          tr: "Vatikan",
          en: "Vatican City",
        },
        text: {
          tr: "Vatikan Müzeleri, Sistine Şapeli ve Aziz Petrus Bazilikası Roma'daki kültür rotalarının önemli parçalarıdır.",
          en: "The Vatican Museums, Sistine Chapel and St. Peter's Basilica are key cultural attractions in Rome.",
        },
      },
      {
        title: {
          tr: "Trevi Çeşmesi",
          en: "Trevi Fountain",
        },
        text: {
          tr: "Roma'nın en ünlü meydanlarından bazılarını yürüyerek keşfederken Trevi Çeşmesi'ni de rotanıza ekleyebilirsiniz.",
          en: "Add the Trevi Fountain to your walking route while exploring some of Rome's most famous squares.",
        },
      },
      {
        title: {
          tr: "İtalyan Mutfağı",
          en: "Italian Cuisine",
        },
        text: {
          tr: "Roma'da makarna, pizza, tiramisu ve geleneksel Roma mutfağının farklı örneklerini denemek gezinin keyifli bölümlerindendir.",
          en: "Trying pasta, pizza, tiramisu and traditional Roman dishes is an enjoyable part of exploring the city.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Kolezyum ve Roma Forumu çevresini keşfedin.",
        "Öğle: Roma mutfağından geleneksel bir yemek deneyin.",
        "Öğleden sonra: Pantheon ve tarihi meydanlara yürüyün.",
        "Akşam: Trevi Çeşmesi ve çevresindeki sokakları keşfedin.",
      ],
      en: [
        "Morning: Explore the Colosseum and Roman Forum.",
        "Lunch: Try a traditional Roman dish.",
        "Afternoon: Walk to the Pantheon and historic squares.",
        "Evening: Explore the Trevi Fountain and surrounding streets.",
      ],
    },

    bestTime: {
      tr: "İlkbahar ve sonbahar Roma'yı yürüyerek keşfetmek için rahat dönemlerdir. Yaz aylarında sıcaklık ve kalabalıklar dikkate alınmalıdır.",
      en: "Spring and autumn are comfortable seasons for exploring Rome on foot. Summer heat and crowds should be taken into account.",
    },

    tips: {
      tr: [
        "Tarihi merkezde bolca yürüyüş yapacağınız için rahat ayakkabı kullanın.",
        "Popüler tarihi noktalar için önceden rezervasyon seçeneklerini araştırın.",
        "Yaz aylarında su taşımayı unutmayın.",
        "Roma'da kısa mesafelerde yürümek çoğu zaman keyifli bir seçenektir.",
      ],
      en: [
        "Wear comfortable shoes because you will likely walk a lot.",
        "Look into advance reservation options for popular attractions.",
        "Carry water during the summer.",
        "Walking between nearby attractions can often be enjoyable.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Roma'da kaç gün kalınmalı?",
          a: "Başlıca tarihi noktaları görmek için 3 gün iyi bir başlangıçtır. Daha sakin bir gezi için 4-5 gün planlanabilir.",
        },
        {
          q: "Roma'da ilk nereler gezilmeli?",
          a: "Kolezyum, Roma Forumu, Pantheon, Trevi Çeşmesi ve Vatikan başlıca seçeneklerdir.",
        },
        {
          q: "Roma yürüyerek gezilir mi?",
          a: "Tarihi merkezde birçok önemli nokta yürüyerek keşfedilebilir.",
        },
        {
          q: "Roma'ya ne zaman gidilir?",
          a: "İlkbahar ve sonbahar yürüyüş ve şehir keşfi açısından rahat dönemlerdir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Rome?",
          a: "Three days is a good starting point for the major sights, while four to five days allow a slower trip.",
        },
        {
          q: "What should you visit first in Rome?",
          a: "The Colosseum, Roman Forum, Pantheon, Trevi Fountain and Vatican are among the main attractions.",
        },
        {
          q: "Can you explore Rome on foot?",
          a: "Many important attractions in the historic center can be explored on foot.",
        },
        {
          q: "When is the best time to visit Rome?",
          a: "Spring and autumn are comfortable seasons for walking and sightseeing.",
        },
      ],
    },
  },

  /* =======================================================
     PARİS
  ======================================================= */

  {
    id: "paris",

    name: {
      tr: "Paris",
      en: "Paris",
    },

    image: "/assets/sehir1/paris.webp",

    desc: {
      tr: "Eyfel Kulesi, Louvre, Seine Nehri ve tarihi mahalleleriyle Paris'i keşfedin.",
      en: "Discover Paris through the Eiffel Tower, Louvre, Seine River and historic neighborhoods.",
    },

    intro: {
      tr: "Paris, sanat, mimari, tarih ve gastronominin bir araya geldiği Avrupa'nın en tanınmış şehirlerinden biridir. Eyfel Kulesi ve Louvre Müzesi gibi simge noktaların yanında Montmartre, Seine Nehri kıyıları ve tarihi mahalleler şehrin farklı yüzlerini keşfetme fırsatı sunar.",

      en: "Paris is one of Europe's best-known cities, bringing together art, architecture, history and gastronomy. Beyond landmarks such as the Eiffel Tower and Louvre Museum, areas like Montmartre, the Seine riverbanks and historic neighborhoods offer different ways to experience the city.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Eyfel Kulesi",
          en: "Eiffel Tower",
        },
        text: {
          tr: "Paris'in sembolü olan Eyfel Kulesi'ni farklı noktalardan görmek ve çevresinde yürümek şehir deneyiminin önemli parçalarındandır.",
          en: "Seeing the Eiffel Tower from different viewpoints and walking around the surrounding area are essential Paris experiences.",
        },
      },
      {
        title: {
          tr: "Louvre Müzesi",
          en: "Louvre Museum",
        },
        text: {
          tr: "Sanat tarihi açısından dünyanın en önemli müzelerinden biri olan Louvre için birkaç saat ayırmak faydalı olabilir.",
          en: "The Louvre is one of the world's most important art museums and can easily require several hours to explore.",
        },
      },
      {
        title: {
          tr: "Montmartre",
          en: "Montmartre",
        },
        text: {
          tr: "Dar sokakları, sanat atmosferi ve Sacré-Cœur çevresiyle Montmartre Paris'in karakteristik mahallelerinden biridir.",
          en: "With its narrow streets, artistic atmosphere and Sacré-Cœur, Montmartre is one of Paris's most distinctive neighborhoods.",
        },
      },
      {
        title: {
          tr: "Seine Nehri",
          en: "Seine River",
        },
        text: {
          tr: "Seine kıyısında yürüyüş yapmak veya nehir turuna katılmak Paris'i farklı bir açıdan görmek için güzel seçeneklerdir.",
          en: "Walking along the Seine or taking a river cruise offers another perspective of Paris.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Eyfel Kulesi ve çevresini keşfedin.",
        "Öğle: Fransız mutfağından bir öğle yemeği deneyin.",
        "Öğleden sonra: Louvre veya tarihi merkezdeki müzelerden birini ziyaret edin.",
        "Akşam: Seine kıyısında yürüyüş yapın ve Montmartre'ı keşfedin.",
      ],
      en: [
        "Morning: Explore the Eiffel Tower and surrounding area.",
        "Lunch: Enjoy a French meal.",
        "Afternoon: Visit the Louvre or another museum in the historic center.",
        "Evening: Walk along the Seine and explore Montmartre.",
      ],
    },

    bestTime: {
      tr: "İlkbahar ve sonbahar Paris'i yürüyerek keşfetmek için keyifli dönemlerdir. Yaz aylarında şehir hareketli olur ve popüler noktalar daha yoğun olabilir.",
      en: "Spring and autumn are pleasant for exploring Paris on foot. Summer is lively, although popular attractions can be more crowded.",
    },

    tips: {
      tr: [
        "Paris'te rahat yürüyüş ayakkabıları kullanın.",
        "Popüler müzeler için giriş planınızı önceden yapın.",
        "Şehrin farklı bölgelerini metro ile birbirine bağlayabilirsiniz.",
        "Seine çevresinde gün batımı yürüyüşünü değerlendirin.",
      ],
      en: [
        "Wear comfortable walking shoes.",
        "Plan your visits to popular museums in advance.",
        "The metro makes it easy to connect different areas of the city.",
        "Consider a sunset walk along the Seine.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Paris'te kaç gün kalınmalı?",
          a: "İlk ziyaret için 3-4 gün iyi bir başlangıçtır. Daha sakin bir gezi için 5 gün veya daha fazlası tercih edilebilir.",
        },
        {
          q: "Paris'te nereler gezilmeli?",
          a: "Eyfel Kulesi, Louvre, Montmartre, Seine Nehri çevresi ve tarihi merkez başlıca seçeneklerdir.",
        },
        {
          q: "Paris yürüyerek gezilir mi?",
          a: "Birçok merkezi bölge yürüyerek keşfedilebilir. Daha uzak noktalar için metro oldukça kullanışlıdır.",
        },
        {
          q: "Paris'e ne zaman gidilir?",
          a: "İlkbahar ve sonbahar şehir yürüyüşleri için oldukça keyifli dönemlerdir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Paris?",
          a: "Three to four days is a good starting point for a first visit. Five or more days allow a slower trip.",
        },
        {
          q: "What should you visit in Paris?",
          a: "The Eiffel Tower, Louvre, Montmartre, Seine and historic center are among the main highlights.",
        },
        {
          q: "Can you explore Paris on foot?",
          a: "Many central areas can be explored on foot, while the metro is useful for longer distances.",
        },
        {
          q: "When is the best time to visit Paris?",
          a: "Spring and autumn are particularly pleasant for walking and sightseeing.",
        },
      ],
    },
  },

  /* =======================================================
     DUBAİ
  ======================================================= */

  {
    id: "dubai",

    name: {
      tr: "Dubai",
      en: "Dubai",
    },

    image: "/assets/sehir1/dubai.webp",

    desc: {
      tr: "Gökdelenler, çöl safarileri, modern mimari, alışveriş ve deniz aktiviteleriyle Dubai'yi keşfedin.",
      en: "Discover Dubai through skyscrapers, desert safaris, modern architecture, shopping and beach experiences.",
    },

    intro: {
      tr: "Dubai, modern mimarisi, lüks alışveriş merkezleri, çöl manzaraları ve deniz aktiviteleriyle farklı deneyimleri aynı şehirde bir araya getirir. Burj Khalifa ve Dubai Marina gibi modern bölgelerin yanında çöl safarileri ve geleneksel pazarlar şehrin farklı yüzlerini görme fırsatı sunar.",

      en: "Dubai brings together modern architecture, luxury shopping, desert landscapes and beach experiences in one destination. Alongside modern areas such as Burj Khalifa and Dubai Marina, desert safaris and traditional markets offer a glimpse of another side of the city.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Burj Khalifa",
          en: "Burj Khalifa",
        },
        text: {
          tr: "Dubai'nin simgesi olan Burj Khalifa, şehir manzarasını yüksekten görmek isteyenlerin en popüler duraklarından biridir.",
          en: "Burj Khalifa is one of Dubai's most popular attractions for travelers wanting panoramic city views.",
        },
      },
      {
        title: {
          tr: "Çöl Safarisi",
          en: "Desert Safari",
        },
        text: {
          tr: "Şehir merkezinden uzaklaşarak çöl manzaralarını görmek, gün batımını izlemek ve farklı açık hava aktivitelerini deneyimlemek mümkündür.",
          en: "A desert safari offers a chance to leave the city behind, experience desert landscapes and watch the sunset.",
        },
      },
      {
        title: {
          tr: "Dubai Marina",
          en: "Dubai Marina",
        },
        text: {
          tr: "Gökdelenlerle çevrili marina bölgesi yürüyüş, restoranlar ve tekne aktiviteleri için popülerdir.",
          en: "Surrounded by skyscrapers, Dubai Marina is popular for walks, restaurants and boat experiences.",
        },
      },
      {
        title: {
          tr: "Geleneksel Çarşılar",
          en: "Traditional Souks",
        },
        text: {
          tr: "Dubai'nin geleneksel çarşıları modern şehir yaşamından farklı bir atmosfer görmek isteyenler için iyi bir seçenektir.",
          en: "Dubai's traditional souks offer a different atmosphere from the city's modern districts.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Downtown Dubai ve Burj Khalifa çevresini keşfedin.",
        "Öğle: Dubai Mall ve çevresinde vakit geçirin.",
        "Öğleden sonra: Dubai Marina bölgesini keşfedin.",
        "Akşam: Çöl safarisi veya marina çevresinde akşam etkinliği planlayın.",
      ],
      en: [
        "Morning: Explore Downtown Dubai and Burj Khalifa.",
        "Lunch: Spend time around Dubai Mall.",
        "Afternoon: Explore Dubai Marina.",
        "Evening: Plan a desert safari or an evening activity around the marina.",
      ],
    },

    bestTime: {
      tr: "Daha serin hava isteyenler için kış ayları ve ilkbaharın ilk dönemleri açık hava aktiviteleri açısından daha rahat olabilir. Yaz aylarında sıcaklıklar oldukça yüksek olabilir.",
      en: "Winter and early spring can be more comfortable for outdoor activities. Summer temperatures can be extremely high.",
    },

    tips: {
      tr: [
        "Açık hava aktivitelerini daha serin saatlere planlayın.",
        "Çöl safarisi için hava durumunu ve tur içeriğini önceden kontrol edin.",
        "Şehir içinde mesafeler uzun olabileceği için günlük rotayı bölgelere göre planlayın.",
        "Yaz aylarında sıcak hava koşullarını dikkate alın.",
      ],
      en: [
        "Plan outdoor activities during cooler parts of the day.",
        "Check the weather and tour details before booking a desert safari.",
        "Distances can be long, so organize your daily route by area.",
        "Take the hot summer weather into account.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Dubai'de kaç gün kalınmalı?",
          a: "İlk ziyaret için 3-4 gün iyi bir başlangıçtır. Çöl safarisi ve farklı bölgeleri görmek için daha uzun kalabilirsiniz.",
        },
        {
          q: "Dubai'de çöl safarisi yapılır mı?",
          a: "Evet. Çöl safarileri Dubai'nin en popüler deneyimleri arasındadır.",
        },
        {
          q: "Dubai'ye ne zaman gidilir?",
          a: "Daha serin hava için kış ayları daha rahat olabilir. Yaz aylarında sıcaklıklar çok yüksek olabilir.",
        },
        {
          q: "Dubai'de ne yapılır?",
          a: "Burj Khalifa, Dubai Marina, çöl safarileri, alışveriş ve geleneksel çarşılar öne çıkan deneyimlerdir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Dubai?",
          a: "Three to four days is a good starting point, with extra time useful for desert safaris and exploring different districts.",
        },
        {
          q: "Can you take a desert safari in Dubai?",
          a: "Yes. Desert safaris are among Dubai's most popular experiences.",
        },
        {
          q: "When is the best time to visit Dubai?",
          a: "Winter can be more comfortable because of the cooler temperatures, while summer can be extremely hot.",
        },
        {
          q: "What can you do in Dubai?",
          a: "Burj Khalifa, Dubai Marina, desert safaris, shopping and traditional souks are popular choices.",
        },
      ],
    },
  },

  /* =======================================================
     BANGKOK
  ======================================================= */

  {
    id: "bangkok",

    name: {
      tr: "Bangkok",
      en: "Bangkok",
    },

    image: "/assets/sehir1/bangkok.webp",

    desc: {
      tr: "Tapınaklar, sokak lezzetleri, pazarlar ve hareketli şehir hayatıyla Bangkok'u keşfedin.",
      en: "Discover Bangkok through temples, street food, markets and vibrant city life.",
    },

    intro: {
      tr: "Bangkok, Tayland'ın geleneksel kültürü ile modern şehir yaşamının bir arada görülebildiği hareketli bir destinasyondur. Büyük saraylar ve tapınaklardan sokak pazarlarına, nehir turlarından yerel yemeklere kadar şehir farklı deneyimleri kısa bir seyahatte bir araya getirebilir.",

      en: "Bangkok is a vibrant destination where traditional Thai culture meets modern city life. Grand palaces and temples, street markets, river cruises and local food create a wide range of experiences within a relatively short trip.",
    },

    thingsToDo: [
      {
        title: {
          tr: "Büyük Saray",
          en: "Grand Palace",
        },
        text: {
          tr: "Bangkok'un tarihi ve kültürel mirasını görmek isteyenlerin şehir rotasına ekleyebileceği önemli yapılardan biridir.",
          en: "The Grand Palace is an important stop for travelers interested in Bangkok's history and cultural heritage.",
        },
      },
      {
        title: {
          tr: "Tapınaklar",
          en: "Temples",
        },
        text: {
          tr: "Wat Arun ve Wat Pho gibi tapınaklar Bangkok'un kültürel kimliğini keşfetmek için öne çıkan duraklardır.",
          en: "Temples such as Wat Arun and Wat Pho are key places for experiencing Bangkok's cultural character.",
        },
      },
      {
        title: {
          tr: "Sokak Lezzetleri",
          en: "Street Food",
        },
        text: {
          tr: "Bangkok'un sokaklarında farklı Tayland yemeklerini denemek şehri keşfetmenin en keyifli yollarından biridir.",
          en: "Trying different Thai dishes from Bangkok's street food scene is one of the city's most enjoyable experiences.",
        },
      },
      {
        title: {
          tr: "Chao Phraya Nehri",
          en: "Chao Phraya River",
        },
        text: {
          tr: "Nehir boyunca yapılan tekne gezileri Bangkok'un tarihi ve modern bölgelerini farklı bir açıdan görmenizi sağlar.",
          en: "Boat trips along the river provide a different view of Bangkok's historic and modern areas.",
        },
      },
    ],

    itinerary: {
      tr: [
        "Sabah: Büyük Saray ve çevresindeki tarihi yapıları keşfedin.",
        "Öğle: Yerel Tayland yemeklerinden birini deneyin.",
        "Öğleden sonra: Wat Arun veya Wat Pho'yu ziyaret edin.",
        "Akşam: Chao Phraya çevresinde tekne turu veya gece pazarı deneyimi planlayın.",
      ],
      en: [
        "Morning: Explore the Grand Palace and nearby historic sites.",
        "Lunch: Try a local Thai dish.",
        "Afternoon: Visit Wat Arun or Wat Pho.",
        "Evening: Take a boat trip along the Chao Phraya or visit a night market.",
      ],
    },

    bestTime: {
      tr: "Daha serin ve kuru dönemler şehir gezileri için daha rahat olabilir. Yağışlı dönemlerde kısa süreli yoğun yağmurlar görülebilir.",
      en: "Cooler and drier periods can be more comfortable for sightseeing. During the rainy season, short periods of heavy rain are possible.",
    },

    tips: {
      tr: [
        "Tapınak ziyaretlerinde uygun kıyafet kurallarına dikkat edin.",
        "Günün sıcak saatlerinde kapalı alanları değerlendirin.",
        "Sokak yemeklerinde hijyen konusunda dikkatli olun.",
        "Trafik yoğunluğu nedeniyle günlük rotanızda ulaşım süresini hesaba katın.",
      ],
      en: [
        "Follow appropriate dress rules when visiting temples.",
        "Consider indoor attractions during the hottest part of the day.",
        "Use reasonable caution regarding hygiene when trying street food.",
        "Allow extra travel time because traffic can be heavy.",
      ],
    },

    faq: {
      tr: [
        {
          q: "Bangkok'ta kaç gün kalınmalı?",
          a: "İlk ziyaret için 3-4 gün iyi bir başlangıçtır. Şehrin farklı bölgelerini daha sakin görmek için daha uzun kalabilirsiniz.",
        },
        {
          q: "Bangkok'ta ne yapılır?",
          a: "Tapınaklar, Büyük Saray, sokak yemekleri, pazarlar ve Chao Phraya Nehri çevresindeki aktiviteler öne çıkar.",
        },
        {
          q: "Bangkok'a ne zaman gidilir?",
          a: "Daha serin ve kuru dönemler şehir gezileri için daha rahat olabilir.",
        },
        {
          q: "Bangkok'ta tekne turu yapılır mı?",
          a: "Evet. Chao Phraya Nehri üzerinde farklı tekne deneyimleri bulunabilir.",
        },
      ],

      en: [
        {
          q: "How many days should you spend in Bangkok?",
          a: "Three to four days is a good starting point, with more time useful for exploring different districts.",
        },
        {
          q: "What can you do in Bangkok?",
          a: "Temples, the Grand Palace, street food, markets and activities around the Chao Phraya River are popular.",
        },
        {
          q: "When is the best time to visit Bangkok?",
          a: "Cooler and drier periods can be more comfortable for sightseeing.",
        },
        {
          q: "Can you take a boat tour in Bangkok?",
          a: "Yes. Various boat experiences are available along the Chao Phraya River.",
        },
      ],
    },
  },
];

/* =========================================================
   AFFILIATE LİNKLERİ
   ========================================================= */

const cityLinks: Record<string, string> = {
  istanbul: "https://getyourguide.tp.st/nTBcXECr",
  nevsehir: "https://getyourguide.tp.st/jf5oS4u4",
  antalya: "https://getyourguide.tp.st/hwXRhIEO",
  izmir: "https://getyourguide.tp.st/Zcv1aMld",
  mugla: "https://getyourguide.tp.st/lzZDpwcu",
  aydin: "https://getyourguide.tp.st/hkZDFUO7",
  trabzon: "https://getyourguide.tp.st/fSiK9Sbq",
  viyana: "https://getyourguide.tp.st/Y1byIa5k",
  roma: "https://getyourguide.tp.st/VfYfG5ft",
  paris: "https://getyourguide.tp.st/bGcMEFlD",
  dubai: "https://getyourguide.tp.st/ZkaT4ETm",
  bangkok: "https://getyourguide.tp.st/rCKN04Sa",
};

/* =========================================================
   SAYFA
   ========================================================= */

export default function CityPageClient({
  city,
  lang,
}: {
  city: string;
  lang: "tr" | "en";
}) {
  const cityInfo = citiesData.find(
    (item) => item.id === city.toLowerCase()
  );

  const [openFaq, setOpenFaq] = useState<number | null>(null);

  if (!cityInfo) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center px-6">
          <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
            {lang === "tr"
              ? "Şehir bulunamadı"
              : "City not found"}
          </h1>

          <p className="text-gray-500">
            {lang === "tr"
              ? "Aradığınız şehir için henüz bir sayfa bulunmuyor."
              : "A page for this city is not available yet."}
          </p>
        </div>
      </main>
    );
  }

  const isTR = lang === "tr";

  const affiliateLink = cityLinks[cityInfo.id];

  const faqItems = cityInfo.faq[lang];

  const hotelCities = [
  "istanbul",
  "nevsehir",
  "antalya",
  "izmir",
  "mugla",
  "aydin",
  "trabzon",
  "roma",
  "paris",
  "dubai",
  "bangkok",
];

const hasHotelPage = hotelCities.includes(cityInfo.id);

  return (
    <main className="min-h-screen bg-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="pt-24 pb-28 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">

        <div className="container mx-auto px-6 text-center">

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/80 text-blue-600 text-xs font-bold rounded-full shadow-sm border border-blue-50 mb-6">
            <MapPin size={14} />

            <span>
              {isTR
                ? "Destinasyon Rehberi"
                : "Destination Guide"}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900">
            {isTR
              ? `${cityInfo.name.tr} Turları ve Deneyimleri`
              : `${cityInfo.name.en} Tours & Experiences`}
          </h1>

          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-8 mt-6">
            {cityInfo.desc[lang]}
          </p>

        </div>

      </section>


      {/* =====================================================
          INTRO
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-7">
            {isTR
              ? `${cityInfo.name.tr} Hakkında`
              : `About ${cityInfo.name.en}`}
          </h2>

          <p className="text-lg leading-8 text-gray-600">
            {cityInfo.intro[lang]}
          </p>

        </div>

      </section>


      {/* =====================================================
          THINGS TO DO
      ===================================================== */}

      <section className="bg-gray-50 py-20">

        <div className="container mx-auto px-6">

          <div className="max-w-5xl mx-auto">

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-12">
              {isTR
                ? `${cityInfo.name.tr}'da Yapılacaklar`
                : `Things to Do in ${cityInfo.name.en}`}
            </h2>

            <div className="grid md:grid-cols-2 gap-8">

              {cityInfo.thingsToDo.map((item, index) => (

                <article
                  key={index}
                  className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100"
                >

                  <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold mb-5">
                    {index + 1}
                  </div>

                  <h3 className="text-2xl font-serif font-bold text-gray-900 mb-4">
                    {item.title[lang]}
                  </h3>

                  <p className="text-gray-600 leading-7">
                    {item.text[lang]}
                  </p>

                </article>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          ITINERARY
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-3 mb-10">

            <Clock className="text-orange-600" />

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {isTR
                ? `${cityInfo.name.tr} İçin 1 Günlük Gezi Önerisi`
                : `One-Day ${cityInfo.name.en} Itinerary`}
            </h2>

          </div>

          <div className="space-y-4">

            {cityInfo.itinerary[lang].map((item, index) => (

              <div
                key={index}
                className="flex gap-5 p-6 rounded-2xl bg-gray-50"
              >

                <div className="font-bold text-orange-600">
                  {index + 1}
                </div>

                <p className="text-gray-700 leading-7">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          BEST TIME
      ===================================================== */}

      <section className="bg-blue-50 py-20">

        <div className="container mx-auto px-6">

          <div className="max-w-4xl mx-auto">

            <div className="flex items-center gap-3 mb-7">

              <CalendarDays className="text-blue-600" />

              <h2 className="text-3xl font-serif font-bold text-gray-900">
                {isTR
                  ? `${cityInfo.name.tr}'a Ne Zaman Gidilir?`
                  : `When to Visit ${cityInfo.name.en}?`}
              </h2>

            </div>

            <p className="text-lg text-gray-700 leading-8">
              {cityInfo.bestTime[lang]}
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          TRAVEL TIPS
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-4xl mx-auto">

          <div className="flex items-center gap-3 mb-10">

            <Lightbulb className="text-orange-600" />

            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900">
              {isTR
                ? `${cityInfo.name.tr} Gezi İpuçları`
                : `${cityInfo.name.en} Travel Tips`}
            </h2>

          </div>

          <div className="grid md:grid-cols-2 gap-5">

            {cityInfo.tips[lang].map((tip, index) => (

              <div
                key={index}
                className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm"
              >
                <p className="text-gray-600 leading-7">
                  {tip}
                </p>
              </div>

            ))}

          </div>

        </div>

      </section>




      {/* =====================================================
          AFFILIATE
      ===================================================== */}

      {affiliateLink && (

        <section className="bg-gray-900 py-20">

          <div className="container mx-auto px-6">

            <div className="max-w-4xl mx-auto text-center">

              <div className="inline-flex px-4 py-1.5 rounded-full bg-white/10 text-orange-300 text-xs font-bold uppercase tracking-widest mb-6">
                {isTR
                  ? "Turlar ve Aktiviteler"
                  : "Tours & Activities"}
              </div>

              <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-5">
                {isTR
                  ? `${cityInfo.name.tr} Turlarını ve Deneyimlerini Keşfet`
                  : `Explore ${cityInfo.name.en} Tours & Experiences`}
              </h2>

              <p className="text-gray-300 max-w-2xl mx-auto mb-9 leading-7">
                {isTR
                  ? `${cityInfo.name.tr} için farklı tur, aktivite ve deneyim seçeneklerini inceleyebilir, seyahatinize uygun olanları değerlendirebilirsiniz.`
                  : `Explore different tours, activities and experiences in ${cityInfo.name.en} and find options that fit your trip.`}
              </p>

              <a
                href={affiliateLink}
                target="_blank"
                rel="sponsored noopener noreferrer"
                className="inline-flex px-9 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-2xl transition"
              >
                {isTR
                  ? "Turları ve Deneyimleri İncele →"
                  : "Explore Tours & Experiences →"}
              </a>

            </div>

          </div>

        </section>

      )}




      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="container mx-auto px-6 py-20">

        <div className="max-w-4xl mx-auto">

          <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-10">
            {isTR
              ? `${cityInfo.name.tr} Hakkında Sık Sorulan Sorular`
              : `Frequently Asked Questions About ${cityInfo.name.en}`}
          </h2>

          <div className="space-y-4">

            {faqItems.map((item, index) => {

              const isOpen = openFaq === index;

              return (

                <div
                  key={index}
                  className="border border-gray-200 rounded-2xl overflow-hidden"
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        isOpen ? null : index
                      )
                    }
                    className="w-full flex items-center justify-between gap-5 p-6 text-left font-bold text-gray-900"
                  >

                    <span>
                      {item.q}
                    </span>

                    <ChevronDown
                      size={20}
                      className={`shrink-0 transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />

                  </button>

                  {isOpen && (

                    <div className="px-6 pb-6 text-gray-600 leading-7">
                      {item.a}
                    </div>

                  )}

                </div>

              );

            })}

          </div>

        </div>

      </section>

     {hasHotelPage && (
  <section className="py-16 px-4">
    <div className="max-w-6xl mx-auto">
      <div className="rounded-[2rem] bg-gray-50 border border-gray-100 p-8 md:p-12">
        <div className="max-w-3xl">
          <span className="text-orange-600 text-xs font-black uppercase tracking-[0.2em]">
            {isTR ? "Konaklama Rehberi" : "Accommodation Guide"}
          </span>

          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mt-3 mb-4">
            {isTR
              ? `${cityInfo.name.tr} Geziniz İçin Nerede Kalınır?`
              : `Where to Stay in ${cityInfo.name.en}?`}
          </h2>

          <p className="text-gray-600 leading-relaxed mb-7">
            {isTR
              ? `${cityInfo.name.tr} gezinizi planlarken konaklama seçeneklerini de inceleyin. Şehirde hangi bölgelerde kalabileceğinizi ve otel seçeneklerini keşfedin.`
              : `Planning a trip to ${cityInfo.name.en}? Explore the best areas to stay and discover hotel options for your visit.`}
          </p>

          <Link
            href={`/${lang}/hotels/${cityInfo.id}`}
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-gray-900 text-white font-bold text-sm hover:bg-orange-600 transition-colors duration-300"
          >
            {isTR
              ? `${cityInfo.name.tr} Otellerini Keşfet →`
              : `Explore ${cityInfo.name.en} Hotels →`}
          </Link>
        </div>
      </div>
    </div>
  </section>
)}

    </main>
  );
}