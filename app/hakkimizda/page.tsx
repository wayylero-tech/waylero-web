"use client";

import { useEffect } from "react";
import { useLang } from "@/app/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

export default function AboutPage() {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  const isEn = lang === "en";

  // URL SENKRONİZASYONU
  useEffect(() => {
    const isUrlEn = pathname.startsWith("/en/");

    if (isEn && !isUrlEn) {
      router.push(`/en${pathname}`, { scroll: false });
    } else if (!isEn && isUrlEn) {
      const newPath = pathname.replace("/en", "");
      router.push(newPath || "/", { scroll: false });
    }
  }, [lang, pathname, router, isEn]);

  const content = {
    title: isEn ? "About Us" : "Hakkımızda",
    introP1: isEn 
      ? "Waylero is a discovery platform born to bring together the paths, stories, and experiences of people who love to explore. For us, travel is not just about going from one place to another; it's about gaining new perspectives, collecting memories, and getting to know the world better." 
      : "Waylero, keşfetmeyi seven insanların yollarını, hikâyelerini ve deneyimlerini bir araya getirmek için doğmuş bir keşif platformudur. Bizim için seyahat yalnızca bir yerden bir yere gitmek değil; yeni bakış açıları kazanmak, anılar biriktirmek ve dünyayı daha yakından tanımaktır.",
    introP2: isEn
      ? "The foundation of Waylero is built on the idea of 'Explore, Plan, Share.' Users can discover cities, routes, places, and moments on a single platform, share their own experiences, and get inspired."
      : "Waylero’nun temeli, “Gez, keşfet, paylaş” fikri üzerine kuruludur. Kullanıcılar; şehirleri, rotaları, mekanları ve anlarını tek bir platformda keşfedebilir, kendi deneyimlerini paylaşabilir ve ilham alabilir.",
    storyTitle: isEn ? "The Story of Waylero" : "Waylero’nun Hikâyesi",
    storyP1: isEn
      ? "Waylero is a project fueled by the passion for discovery, set out with an individual vision. Our goal is to take travel out of complex plans and make it more accessible, more enjoyable, and more shareable for everyone."
      : "Waylero, bireysel bir vizyonla yola çıkmış, keşfetme tutkusundan beslenen bir projedir. Amacımız; seyahati karmaşık planlardan çıkarıp, herkes için daha ulaşılabilir, daha keyifli ve daha paylaşılabilir hale getirmektir.",
    storyP2: isEn
      ? "Everywhere from big cities to hidden villages, popular routes to little-known stops, holds a story in Waylero."
      : "Büyük şehirlerden saklı köylere, popüler rotalardan az bilinen duraklara kadar her yer Waylero’da bir hikâye barındırır.",
    offerTitle: isEn ? "What Do We Offer?" : "Ne Sunuyoruz?",
    offerList: isEn
      ? ["Discovery content for cities and places", "Travel planning and route creation experience", "Photo and video sharing by users", "Social interaction and messaging features", "Inspiring content based on real experiences"]
      : ["Şehirler ve mekanlar için keşif içerikleri", "Gezi planlama ve rota oluşturma deneyimi", "Kullanıcıların fotoğraf ve video paylaşımı", "Sosyal etkileşim ve mesajlaşma özellikleri", "Gerçek deneyimlere dayalı ilham verici içerikler"],
    visionTitle: isEn ? "Our Vision" : "Vizyonumuz",
    visionP: isEn
      ? "Our vision as Waylero is to be a reliable, inspiring, and sincere platform for everyone who wants to explore the world. We believe that travel is not just a 'vacation,' but a lifestyle."
      : "Waylero olarak vizyonumuz; dünyayı keşfetmek isteyen herkes için güvenilir, ilham verici ve samimi bir platform olmaktır. Seyahatin sadece bir “tatil” değil, bir yaşam biçimi olduğuna inanıyoruz.",
    missionTitle: isEn ? "Our Mission" : "Misyonumuz",
    missionP: isEn
      ? "To create an ecosystem that encourages people to explore, brings experiences together, and makes journeys more meaningful. Waylero is a travel companion that users don't just visit, but connect with, share, and remember."
      : "İnsanları keşfetmeye teşvik eden, deneyimleri bir araya getiren ve yolculukları daha anlamlı kılan bir ekosistem oluşturmak. Waylero, kullanıcıların sadece gezdiği değil; bağ kurduğu, paylaştığı ve hatırladığı bir yol arkadaşıdır.",
    communityTitle: isEn ? "Waylero Community" : "Waylero Topluluğu",
    communityP1: isEn
      ? "Waylero is much more than an app. Here, travelers, photography enthusiasts, adventure seekers, and everyone who loves to explore come together."
      : "Waylero, bir uygulamadan çok daha fazlasıdır. Burada gezginler, fotoğraf tutkunları, macera severler ve keşfetmeyi seven herkes bir araya gelir.",
    communityP2: isEn
      ? "Our community aims to grow in a respectful, creative, and sharing environment."
      : "Topluluğumuz; saygılı, yaratıcı ve paylaşımcı bir ortamda büyümeyi hedefler.",
    futureTitle: isEn ? "Looking to the Future" : "Geleceğe Bakış",
    futureP1: isEn
      ? "Waylero is a constantly evolving platform. We continue to work for new features, new cities, and a stronger discovery experience."
      : "Waylero sürekli gelişen bir platformdur. Yeni özellikler, yeni şehirler ve daha güçlü bir keşif deneyimi için çalışmaya devam ediyoruz.",
    futureP2: isEn
      ? "We thank everyone who is with us on this journey. Keep exploring."
      : "Bu yolculukta bizimle olan herkese teşekkür ederiz. Keşfetmeye devam.",
    slogan: isEn ? "Explore. Plan. Share." : "Keşfet. Planla. Paylaş."
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>{content.introP1}</p>
        <p>{content.introP2}</p>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.storyTitle}</h2>
          <p>{content.storyP1}</p>
          <p className="mt-2">{content.storyP2}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.offerTitle}</h2>
          <ul className="list-disc pl-5 space-y-1">
            {content.offerList.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.visionTitle}</h2>
          <p>{content.visionP}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.missionTitle}</h2>
          <p>{content.missionP}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.communityTitle}</h2>
          <p>{content.communityP1}</p>
          <p className="mt-2">{content.communityP2}</p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">{content.futureTitle}</h2>
          <p>{content.futureP1}</p>
          <p className="mt-2">{content.futureP2}</p>
        </div>

        <div className="pt-6 border-t">
          <p className="font-semibold text-gray-900">Waylero</p>
          <p className="text-sm text-gray-500">{content.slogan}</p>
        </div>
      </section>
    </main>
  );
}