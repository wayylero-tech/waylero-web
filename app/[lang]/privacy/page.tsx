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
    title: isEn ? "Privacy Policy | Waylero" : "Gizlilik Politikası | Waylero",
    description: isEn 
      ? "Waylero's data protection and privacy statement." 
      : "Waylero veri koruma ve gizlilik beyanı.",
    robots: { index: true, follow: true },
  };
}

// --- PAGE COMPONENT ---
export default async function PrivacyPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  // ✅ Dili direkt URL params üzerinden alıyoruz
  const { lang } = await params;
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Privacy Policy" : "Gizlilik Politikası",
    date: isEn
      ? "Effective Date: The date you first use the Waylero platform"
      : "Yürürlük Tarihi: Waylero platformunu ilk kez kullandığınız tarih",
    introTitle: isEn
      ? "Waylero – Data Protection and Privacy Statement"
      : "Waylero – Veri Koruma ve Gizlilik Beyanı",
    introText: isEn
      ? "At Waylero, we value the privacy of our users. This Privacy Policy explains how personal data obtained through the Waylero mobile application and website is processed in accordance with the Law No. 6698 on the Protection of Personal Data (KVKK) and the European Union General Data Protection Regulation (GDPR)."
      : "Waylero olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası; Waylero mobil uygulaması ve web sitesi üzerinden sunulan hizmetler kapsamında elde edilen kişisel verilerin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyarınca nasıl işlendiğini açıklamaktadır.",

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
              "Device information (operating system, device model, IP address)",
              "Messaging content between users",
              "In-app usage and interaction data",
            ]
          : [
              "Ad, soyad ve e-posta adresi",
              "Kullanıcı tarafından paylaşılan fotoğraf ve videolar",
              "Cihaz bilgileri (işletim sistemi, cihaz modeli, IP adresi)",
              "Kullanıcılar arası mesajlaşma içerikleri",
              "Uygulama içi kullanım ve etkileşim verileri",
            ],
      },
      {
        title: isEn ? "3. Messaging and Media Security" : "3. Mesajlaşma ve Medya Güvenliği",
        body: isEn
          ? "Contents and messages shared on Waylero are protected using secure infrastructures. Photos and videos are stored in Google Firebase Storage and are only accessible by authorized users."
          : "Waylero üzerinde paylaşılan içerikler ve mesajlar güvenli altyapılar kullanılarak korunur. Fotoğraf ve videolar Google Firebase Storage altyapısında saklanır ve yalnızca yetkili kullanıcılar tarafından erişilebilir.",
      },
      {
        title: isEn ? "4. Purposes of Processing Data" : "4. Verilerin İşlenme Amaçları",
        list: isEn
          ? [
              "Providing platform services",
              "Ensuring content sharing and discovery features",
              "Improving user experience",
              "Meeting technical support and user requests",
              "Fulfilling legal obligations",
            ]
          : [
              "Platform hizmetlerinin sunulması",
              "İçerik paylaşımı ve keşif özelliklerinin sağlanması",
              "Kullanıcı deneyiminin geliştirilmesi",
              "Teknik destek ve kullanıcı taleplerinin karşılanması",
              "Yasal yükümlülüklerin yerine getirilmesi",
            ],
      },
      {
        title: isEn ? "5. Data Retention Period" : "5. Veri Saklama Süresi",
        body: isEn
          ? "Personal data is stored for as long as necessary for the purposes for which it is processed. When a user account is deleted, the data is irreversibly deleted or anonymized."
          : "Kişisel veriler, işlenme amacının gerektirdiği süre boyunca saklanır. Kullanıcı hesabı silindiğinde veriler geri döndürülemez şekilde silinir veya anonim hale getirilir.",
      },
      {
        title: isEn ? "6. Data Storage Location" : "6. Verilerin Saklandığı Yer",
        body: isEn
          ? "Data processed within Waylero is stored in data centers located in the European Union via Google Firebase infrastructure."
          : "Waylero kapsamında işlenen veriler, Google Firebase altyapısı kullanılarak Avrupa Birliği sınırları içerisindeki veri merkezlerinde saklanmaktadır.",
      },
      {
        title: isEn ? "7. User Rights" : "7. Kullanıcı Hakları",
        list: isEn
          ? [
              "Request access to personal data",
              "Request correction of incomplete or inaccurate data",
              "Request deletion of data",
              "Object to data processing",
              "File a complaint with the relevant authority",
            ]
          : [
              "Kişisel verilere erişim talep etme",
              "Eksik veya hatalı verilerin düzeltilmesini isteme",
              "Verilerin silinmesini talep etme",
              "Veri işlemeye itiraz etme",
              "İlgili kuruma şikâyette bulunma",
            ],
      },
      {
        title: isEn ? "8. Policy Updates" : "8. Politika Güncellemeleri",
        body: isEn
          ? "Waylero may update this Privacy Policy in line with legal requirements or service changes. The latest version will always be available on this page."
          : "Waylero, bu Gizlilik Politikası’nı mevzuat veya hizmet değişikliklerine göre güncelleyebilir. Güncel versiyon her zaman bu sayfada yayınlanır.",
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-6 py-24">
      {/* Waylero Hero Title */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold mb-4 text-gray-900 tracking-tighter italic leading-none uppercase">
        {content.title}
      </h1>
      <p className="text-[10px] text-gray-400 mb-16 font-black uppercase tracking-[0.3em] italic border-b border-gray-50 pb-8">
        {content.date}
      </p>

      <section className="space-y-16 text-gray-700 leading-relaxed">
        {/* Intro Highlight Box */}
        <div className="bg-orange-50/50 p-10 rounded-[3rem] border border-orange-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
          <h2 className="text-2xl font-serif font-bold mb-6 text-orange-950 relative z-10 italic">
            {content.introTitle}
          </h2>
          <p className="text-orange-900/80 relative z-10 leading-relaxed font-medium text-lg">
            {content.introText}
          </p>
        </div>

        {/* Policy Sections */}
        <div className="grid gap-12">
          {content.sections.map((section, i) => (
            <div key={i} className="group border-l-[1px] border-gray-100 hover:border-orange-500 pl-10 transition-all duration-500">
              <h3 className="text-2xl font-serif font-bold mb-6 text-gray-900 group-hover:text-orange-600 transition-colors italic tracking-tight">
                {section.title}
              </h3>
              
              {section.body && (
                <p className="mb-6 text-gray-500 font-medium text-lg leading-relaxed max-w-2xl">
                  {section.body}
                </p>
              )}
              
              {section.list && (
                <ul className="grid gap-4">
                  {section.list.map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-gray-600">
                      <span className="w-1 h-1 rounded-full bg-orange-400 shrink-0 group-hover:scale-150 transition-transform" />
                      <span className="font-semibold text-base tracking-tight">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
              
              {section.contact && (
                <div className="mt-8 inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.02] hover:shadow-orange-100 transition-all">
                  <span className="text-xs font-black uppercase tracking-widest text-orange-600">Contact:</span>
                  <a 
                    href={`mailto:${section.contact}`} 
                    className="text-gray-900 font-serif font-bold italic hover:text-orange-600 transition-colors"
                  >
                    {section.contact}
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Signature */}
        <div className="pt-20 border-t border-gray-50 flex flex-col items-center text-center pb-10">
          <p className="font-serif text-4xl font-bold text-gray-900 mb-2 italic tracking-tighter">Waylero</p>
          <div className="flex items-center gap-4 mb-4">
             <div className="h-[1px] w-8 bg-orange-200" />
             <p className="text-[10px] text-orange-600 font-black tracking-[0.4em] uppercase">Trust & Privacy</p>
             <div className="h-[1px] w-8 bg-orange-200" />
          </div>
          <p className="text-gray-400 text-xs italic opacity-60">© {new Date().getFullYear()} Waylero Platform</p>
        </div>
      </section>
    </main>
  );
}