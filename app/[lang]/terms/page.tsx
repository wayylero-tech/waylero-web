import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

// 🌍 SEO ve Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const baseUrl = "https://www.waylero.com";

  return {
    title: isEn ? "Terms of Service | Waylero" : "Kullanım Koşulları | Waylero",
    description: isEn 
      ? "Waylero's terms of service and usage conditions." 
      : "Waylero kullanım koşulları ve şartları.",
    alternates: {
      // ✅ İŞTE KRİTİK YER: Canonical artık privacy'yi değil, tam olarak /terms sayfasını işaret ediyor
      canonical: `${baseUrl}${isEn ? "/en" : "/tr"}/terms`,
      languages: {
        "tr-TR": `${baseUrl}/tr/terms`,
        "en-US": `${baseUrl}/en/terms`,
      },
    },
    robots: { index: true, follow: true },
  };
}

// --- PAGE COMPONENT ---
export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Terms of Service" : "Kullanım Koşulları",
    date: isEn
      ? "Effective Date: The date you first use the Waylero platform"
      : "Yürürlük Tarihi: Waylero platformunu ilk kez kullandığınız tarih",
    introTitle: isEn
      ? "Waylero – Terms of Service"
      : "Waylero – Kullanım Koşulları",
    introText: isEn
      ? "Welcome to Waylero. By accessing or using our platform, you agree to be bound by these Terms of Service."
      : "Waylero'ya hoş geldiniz. Platformumuza erişerek veya kullanarak bu Kullanım Koşulları'na uymayı kabul etmiş olursunuz.",

    sections: [
      {
        title: isEn ? "1. General Conditions" : "1. Genel Koşullar",
        body: isEn
          ? "Waylero provides travel discovery and planning services. Users must comply with applicable local laws while using the platform."
          : "Waylero seyahat keşfi ve planlama hizmetleri sunar. Kullanıcılar platformu kullanırken ilgili yerel yasalara uymakla yükümlüdür.",
      },
      {
        title: isEn ? "2. User Content" : "2. Kullanıcı İçerikleri",
        body: isEn
          ? "You retain ownership of the content you share on Waylero. However, by sharing, you grant Waylero a non-exclusive license to display this content."
          : "Waylero'da paylaştığınız içeriklerin mülkiyeti size aittir. Ancak paylaşarak Waylero'ya bu içeriği görüntüleme lisansı vermiş olursunuz.",
      },
      {
        title: isEn ? "3. Service Availability" : "3. Hizmet Kullanılabilirliği",
        body: isEn
          ? "We strive to keep Waylero running smoothly, but we do not guarantee uninterrupted service access at all times."
          : "Waylero'nun kesintisiz çalışması için çabalıyoruz ancak her zaman kesintisiz erişim garantisi vermiyoruz.",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-24">
      {/* Title */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-gray-900 tracking-tighter italic leading-none uppercase">
        {content.title}
      </h1>
      <p className="text-[10px] text-gray-400 mb-16 font-black uppercase tracking-[0.3em] italic border-b border-gray-50 pb-8">
        {content.date}
      </p>

      <section className="space-y-16 text-gray-700 leading-relaxed">
        {/* Intro Box */}
        <div className="bg-orange-50/50 p-10 rounded-[3rem] border border-orange-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
          <h2 className="text-2xl font-serif font-bold mb-6 text-orange-950 relative z-10 italic">
            {content.introTitle}
          </h2>
          <p className="text-orange-900/80 relative z-10 leading-relaxed font-medium text-lg">
            {content.introText}
          </p>
        </div>

        {/* Sections */}
        <div className="grid gap-12">
          {content.sections.map((section, i) => (
            <div key={i} className="group border-l-[1px] border-gray-100 hover:border-orange-500 pl-10 transition-all duration-500">
              <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900 group-hover:text-orange-600 transition-colors italic tracking-tight">
                {section.title}
              </h3>
              <p className="mb-6 text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-20 border-t border-gray-50 flex flex-col items-center text-center pb-10">
          <p className="font-serif text-4xl font-bold text-gray-900 mb-2 italic tracking-tighter">Waylero</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="h-[1px] w-8 bg-orange-200" />
            <p className="text-[10px] text-orange-600 font-black tracking-[0.4em] uppercase">Terms & Conditions</p>
            <div className="h-[1px] w-8 bg-orange-200" />
          </div>
          <p className="text-gray-400 text-xs italic opacity-60">© {new Date().getFullYear()} Waylero Platform</p>
        </div>
      </section>
    </div>
  );
}