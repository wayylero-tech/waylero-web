import { Metadata } from "next";

// --- METADATA ---
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    title: isEn ? "About Us | Waylero" : "Hakkımızda | Waylero",
    description: isEn 
      ? "Discover the story, vision, and mission of Waylero." 
      : "Waylero'nun hikayesini, vizyonunu ve misyonunu keşfedin.",
  };
}

// --- PAGE COMPONENT ---
export default async function HakkimizdaPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  // ✅ Dili direkt params üzerinden çekiyoruz
  const { lang } = await params;
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
    <main className="max-w-4xl mx-auto px-6 py-24">
      {/* Başlık ve Intro */}
      <div className="mb-20">
        <h1 className="text-6xl md:text-8xl font-serif font-bold text-gray-900 mb-10 tracking-tighter italic leading-none">
          {content.title}
        </h1>
        <div className="space-y-8 text-2xl text-gray-500 leading-relaxed font-medium max-w-3xl">
          <p className="text-gray-900 leading-snug">{content.introP1}</p>
          <p className="opacity-80 italic">{content.introP2}</p>
        </div>
      </div>

      <div className="grid gap-20 border-t border-gray-50 pt-20">
        {/* Hikaye */}
        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.3em] text-orange-600 mb-8 flex items-center gap-4">
            <span className="w-12 h-[1px] bg-orange-600"></span>
            {content.storyTitle}
          </h2>
          <div className="text-xl text-gray-700 space-y-6 leading-relaxed max-w-2xl">
            <p>{content.storyP1}</p>
            <p className="font-serif italic text-gray-500">{content.storyP2}</p>
          </div>
        </section>

        {/* Ne Sunuyoruz - List */}
        <section className="bg-white p-10 md:p-16 rounded-[3rem] border border-gray-100 shadow-2xl shadow-black/[0.03]">
          <h2 className="text-3xl font-serif font-bold mb-10 text-gray-900 italic">
            {content.offerTitle}
          </h2>
          <ul className="grid md:grid-cols-2 gap-6">
            {content.offerList.map((item, index) => (
              <li key={index} className="flex items-center gap-4 text-gray-700 group">
                <span className="w-2 h-2 rounded-full bg-orange-500 group-hover:scale-150 transition-transform" />
                <span className="font-semibold text-lg tracking-tight">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Vizyon & Misyon - Yanyana */}
        <div className="grid md:grid-cols-2 gap-16">
          <section className="space-y-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-blue-600 opacity-60">{content.visionTitle}</h2>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">{content.visionP}</p>
          </section>
          <section className="space-y-4 border-l border-gray-100 pl-8">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-orange-600 opacity-60">{content.missionTitle}</h2>
            <p className="text-xl text-gray-800 leading-relaxed font-medium">{content.missionP}</p>
          </section>
        </div>

        {/* Topluluk & Gelecek */}
        <div className="space-y-16">
          <section className="max-w-2xl">
            <h2 className="text-4xl font-serif font-bold mb-8 text-gray-900 tracking-tight italic">{content.communityTitle}</h2>
            <p className="text-xl text-gray-600 leading-relaxed">{content.communityP1}</p>
            <p className="text-lg text-gray-400 mt-6 italic font-medium">{content.communityP2}</p>
          </section>

          <section className="bg-gray-900 text-white p-12 md:p-20 rounded-[4rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600 rounded-full blur-[120px] opacity-20 group-hover:opacity-40 transition-opacity"></div>
            <h2 className="text-sm font-black uppercase tracking-[0.4em] text-orange-500 mb-8">{content.futureTitle}</h2>
            <p className="text-2xl md:text-3xl text-gray-300 mb-10 leading-tight font-medium">{content.futureP1}</p>
            <p className="text-4xl md:text-5xl font-serif italic text-white tracking-tighter">{content.futureP2}</p>
          </section>
        </div>

        {/* Footer Slogan */}
        <div className="pt-20 border-t border-gray-50 flex flex-col items-center text-center pb-10">
          <p className="text-4xl font-serif font-bold text-gray-900 mb-4 tracking-tighter italic">Waylero</p>
          <div className="flex items-center gap-6">
            <div className="h-[1px] w-8 bg-orange-200"></div>
            <p className="text-orange-600 font-black tracking-[0.4em] uppercase text-[10px]">
                {content.slogan}
            </p>
            <div className="h-[1px] w-8 bg-orange-200"></div>
          </div>
        </div>
      </div>
    </main>
  );
}