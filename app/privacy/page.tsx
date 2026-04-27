import { headers } from "next/headers";

export async function generateMetadata() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  return {
    title: lang === "en" ? "Privacy Policy | Waylero" : "Gizlilik Politikası | Waylero",
    description: lang === "en" 
      ? "Waylero's data protection and privacy statement." 
      : "Waylero veri koruma ve gizlilik beyanı.",
    robots: { index: true, follow: true },
  };
}

export default async function PrivacyPage() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";
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
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl md:text-5xl font-serif font-bold mb-2 text-gray-900">{content.title}</h1>
      <p className="text-sm text-gray-400 mb-12 font-medium uppercase tracking-tighter italic border-b pb-6">{content.date}</p>

      <section className="space-y-12 text-gray-700 leading-relaxed text-lg">
        {/* Önemli Vurgu Kutusu */}
        <div className="bg-orange-50 p-8 rounded-[2rem] border border-orange-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/50 rounded-full -mr-16 -mt-16" />
          <h2 className="text-2xl font-serif font-bold mb-4 text-orange-900 relative z-10">{content.introTitle}</h2>
          <p className="text-orange-800 relative z-10 leading-relaxed font-medium">{content.introText}</p>
        </div>

        <div className="grid gap-10">
          {content.sections.map((section, i) => (
            <div key={i} className="group border-l-2 border-gray-100 hover:border-orange-500 pl-8 transition-all duration-300">
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">
                {section.title}
              </h3>
              
              {section.body && <p className="mb-4 text-gray-600 font-medium">{section.body}</p>}
              
              {section.list && (
                <ul className="grid gap-3">
                  {section.list.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-600">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
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

        {/* Alt Bilgi */}
        <div className="pt-12 border-t text-center flex flex-col items-center">
          <p className="font-serif text-2xl font-bold text-gray-900 mb-1">Waylero</p>
          <p className="text-xs text-orange-600 font-black tracking-[0.2em] uppercase">Trust & Privacy</p>
        </div>
      </section>
    </main>
  );
}