import { headers } from "next/headers";

export async function generateMetadata() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  return {
    title: lang === "en" ? "About Us | Waylero" : "Hakkımızda | Waylero",
    description: lang === "en" 
      ? "Discover the story, vision, and mission of Waylero." 
      : "Waylero'nun hikayesini, vizyonunu ve misyonunu keşfedin.",
  };
}

export default async function HakkimizdaPage() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";
  const isEn = lang === "en";

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
    <main className="max-w-4xl mx-auto px-6 py-20">
      {/* Başlık ve Intro */}
      <div className="mb-16">
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-8 tracking-tight">
          {content.title}
        </h1>
        <div className="space-y-6 text-xl text-gray-600 leading-relaxed font-medium">
          <p>{content.introP1}</p>
          <p className="text-gray-500">{content.introP2}</p>
        </div>
      </div>

      <div className="grid gap-16 border-t pt-16">
        {/* Hikaye */}
        <section>
          <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900 flex items-center gap-3">
            <span className="w-8 h-1 bg-orange-500 rounded-full"></span>
            {content.storyTitle}
          </h2>
          <div className="text-lg text-gray-600 space-y-4">
            <p>{content.storyP1}</p>
            <p>{content.storyP2}</p>
          </div>
        </section>

        {/* Ne Sunuyoruz - List */}
        <section className="bg-gray-50 p-8 md:p-12 rounded-[2.5rem] border border-gray-100">
          <h2 className="text-3xl font-serif font-bold mb-8 text-gray-900">
            {content.offerTitle}
          </h2>
          <ul className="grid md:grid-cols-2 gap-4">
            {content.offerList.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                <span className="font-medium text-lg">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Vizyon & Misyon - Yanyana */}
        <div className="grid md:grid-cols-2 gap-12">
          <section>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">{content.visionTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{content.visionP}</p>
          </section>
          <section>
            <h2 className="text-2xl font-serif font-bold mb-4 text-gray-900">{content.missionTitle}</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{content.missionP}</p>
          </section>
        </div>

        {/* Topluluk & Gelecek */}
        <div className="space-y-12">
          <section>
            <h2 className="text-3xl font-serif font-bold mb-6 text-gray-900">{content.communityTitle}</h2>
            <p className="text-lg text-gray-600 leading-relaxed">{content.communityP1}</p>
            <p className="text-lg text-gray-600 mt-4 italic">{content.communityP2}</p>
          </section>

          <section className="bg-orange-600 text-white p-10 md:p-16 rounded-[3rem] shadow-xl shadow-orange-100">
            <h2 className="text-3xl font-serif font-bold mb-6">{content.futureTitle}</h2>
            <p className="text-xl text-orange-50 mb-6">{content.futureP1}</p>
            <p className="text-2xl font-serif italic">{content.futureP2}</p>
          </section>
        </div>

        {/* Footer Slogan */}
        <div className="pt-12 border-t flex flex-col items-center text-center">
          <p className="text-3xl font-serif font-bold text-gray-900 mb-2">Waylero</p>
          <p className="text-orange-600 font-black tracking-[0.3em] uppercase text-xs">
            {content.slogan}
          </p>
        </div>
      </div>
    </main>
  );
}