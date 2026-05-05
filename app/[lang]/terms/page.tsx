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
    title: isEn ? "Privacy Policy | Waylero" : "Gizlilik Politikası | Waylero",
    description: isEn 
      ? "Waylero's data protection and privacy statement." 
      : "Waylero veri koruma ve gizlilik beyanı.",
    alternates: {
      canonical: `${baseUrl}${isEn ? "/en" : ""}/privacy`,
      languages: {
        "tr-TR": `${baseUrl}/privacy`,
        "en-US": `${baseUrl}/en/privacy`,
      },
    },
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Privacy Policy" : "Gizlilik Politikası",
    date: isEn
      ? "Effective Date: May 2026"
      : "Yürürlük Tarihi: Mayıs 2026",
    introTitle: isEn
      ? "Waylero – Data Protection and Privacy Statement"
      : "Waylero – Veri Koruma ve Gizlilik Beyanı",
    introText: isEn
      ? "At Waylero, we value the privacy of our users. This Privacy Policy explains how personal data obtained through the Waylero platform is processed in accordance with KVKK and GDPR."
      : "Waylero olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu beyan, kişisel verilerin KVKK ve GDPR uyarınca nasıl işlendiğini açıklamaktadır.",

    sections: [
      {
        title: isEn ? "1. Data Controller" : "1. Veri Sorumlusu",
        body: isEn
          ? "Data controller under the scope of KVKK: Waylero"
          : "KVKK kapsamında veri sorumlusu: Waylero",
        contact: "wayylero@gmail.com"
      },
      {
        title: isEn ? "2. Collected Personal Data" : "2. Toplanan Kişisel Veriler",
        list: isEn
          ? [
              "Name, surname and e-mail address",
              "Photos and videos shared by the user",
              "Device information (IP address, device model)",
              "Messaging content between users",
              "In-app usage and interaction data",
            ]
          : [
              "Ad, soyad ve e-posta adresi",
              "Kullanıcı tarafından paylaşılan fotoğraf ve videolar",
              "Cihaz bilgileri (IP adresi, cihaz modeli)",
              "Kullanıcılar arası mesajlaşma içerikleri",
              "Uygulama içi kullanım ve etkileşim verileri",
            ],
      },
      {
        title: isEn ? "3. Security & Storage" : "3. Güvenlik ve Saklama",
        body: isEn
          ? "Data is stored in European Union data centers via Google Firebase infrastructure. Photos and videos are stored in secure Firebase Storage."
          : "Veriler, Google Firebase altyapısı kullanılarak AB sınırlarındaki veri merkezlerinde saklanır. Medya içerikleri güvenli Firebase Storage üzerinde tutulur.",
      },
      {
        title: isEn ? "4. User Rights" : "4. Kullanıcı Hakları",
        list: isEn
          ? [
              "Access your personal data",
              "Request correction or deletion",
              "Object to data processing",
              "Withdraw consent at any time",
            ]
          : [
              "Verilerinize erişim talep etme",
              "Düzeltme veya silme isteme",
              "Veri işlemeye itiraz etme",
              "Rızayı dilediği zaman geri çekme",
            ],
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-20 bg-white">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-900 tracking-tight">
        {content.title}
      </h1>
      <p className="text-xs text-gray-400 mb-12 font-black uppercase tracking-widest italic border-b pb-6">
        {content.date}
      </p>

      <section className="space-y-12 text-gray-700 leading-relaxed">
        {/* Vurgu Kutusu */}
        <div className="bg-orange-50 p-8 rounded-[2.5rem] border border-orange-100 relative overflow-hidden transition-hover hover:shadow-lg duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full -mr-16 -mt-16" />
          <h2 className="text-2xl font-serif font-bold mb-4 text-orange-900 relative z-10">
            {content.introTitle}
          </h2>
          <p className="text-orange-800 relative z-10 leading-relaxed font-medium">
            {content.introText}
          </p>
        </div>

        {/* Bölümler */}
        <div className="grid gap-12">
          {content.sections.map((section, i) => (
            <div key={i} className="group border-l-2 border-gray-100 hover:border-orange-500 pl-8 transition-all duration-300">
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">
                {section.title}
              </h3>
              
              {section.body && <p className="mb-4 text-gray-600 font-medium text-lg">{section.body}</p>}
              
              {section.list && (
                <ul className="grid gap-3">
                  {section.list.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600 text-lg">
                      <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.contact && (
                <div className="mt-6 flex items-center gap-3 bg-gray-50 w-fit px-5 py-3 rounded-2xl border border-gray-100">
                  <span className="text-lg">📧</span>
                  <a 
                    href={`mailto:${section.contact}`} 
                    className="text-gray-900 font-bold hover:text-orange-600 transition-colors underline decoration-orange-200 underline-offset-4"
                  >
                    {section.contact}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Marka Bilgisi */}
        <div className="pt-16 border-t text-center">
          <p className="font-serif text-3xl font-bold text-gray-900 mb-1">Waylero</p>
          <p className="text-[10px] text-orange-600 font-black tracking-[0.4em] uppercase">
            Trust & Transparency
          </p>
        </div>
      </section>
    </main>
  );
}