import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

// --- METADATA ---
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const baseUrl = "https://www.waylero.com";

  const title = isEn
    ? "Privacy Policy | Waylero"
    : "Gizlilik Politikası | Waylero";

  const description = isEn
    ? "Read Waylero's privacy policy, data protection practices, user rights and information about how personal data is processed."
    : "Waylero gizlilik politikasını, kişisel verilerin korunmasına ilişkin uygulamaları, kullanıcı haklarını ve verilerin nasıl işlendiğini inceleyin.";

  const url = `${baseUrl}${isEn ? "/en" : "/tr"}/privacy`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${baseUrl}/tr/privacy`,
        "en-US": `${baseUrl}/en/privacy`,
        "x-default": `${baseUrl}/en/privacy`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title,
      description,
      url,
      siteName: "Waylero",
      locale: isEn ? "en_US" : "tr_TR",
      type: "website",
    },

    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

// --- PAGE COMPONENT ---
export default async function PrivacyPage({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === "en";

  const baseUrl = "https://www.waylero.com";
  const pageUrl = `${baseUrl}/${lang}/privacy`;

  const content = {
    title: isEn ? "Privacy Policy" : "Gizlilik Politikası",

    date: isEn
      ? "Effective Date: The date you first use the Waylero platform"
      : "Yürürlük Tarihi: Waylero platformunu ilk kez kullandığınız tarih",

    introTitle: isEn
      ? "Waylero – Data Protection and Privacy Statement"
      : "Waylero – Veri Koruma ve Gizlilik Beyanı",

    introText: isEn
      ? "At Waylero, we value the privacy of our users. This Privacy Policy explains how personal data obtained through the Waylero mobile application and website is processed in accordance with applicable data protection laws, including the Law No. 6698 on the Protection of Personal Data (KVKK) and, where applicable, the European Union General Data Protection Regulation (GDPR)."
      : "Waylero olarak kullanıcılarımızın gizliliğine önem veriyoruz. Bu Gizlilik Politikası; Waylero mobil uygulaması ve web sitesi üzerinden elde edilen kişisel verilerin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve uygulanabilir olduğu durumlarda Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) kapsamında nasıl işlendiğini açıklamaktadır.",

    sections: [
      {
        title: isEn
          ? "1. Data Controller"
          : "1. Veri Sorumlusu",

        body: isEn
          ? "For the purposes of applicable data protection legislation, the data controller is Waylero."
          : "Uygulanabilir veri koruma mevzuatı kapsamında veri sorumlusu Waylero'dur.",

        contact: "wayylero@gmail.com",
      },

      {
        title: isEn
          ? "2. Personal Data We May Collect"
          : "2. Toplanabilecek Kişisel Veriler",

        list: isEn
          ? [
              "Name, surname and e-mail address",
              "Photos and videos shared by the user",
              "Device information such as operating system, device model and IP address",
              "Messaging content between users",
              "In-app usage and interaction data",
            ]
          : [
              "Ad, soyad ve e-posta adresi",
              "Kullanıcı tarafından paylaşılan fotoğraf ve videolar",
              "İşletim sistemi, cihaz modeli ve IP adresi gibi cihaz bilgileri",
              "Kullanıcılar arasındaki mesajlaşma içerikleri",
              "Uygulama içi kullanım ve etkileşim verileri",
            ],
      },

      {
        title: isEn
          ? "3. Messaging and Media Security"
          : "3. Mesajlaşma ve Medya Güvenliği",

        body: isEn
          ? "Content and messages shared through Waylero are handled using appropriate technical infrastructure and security measures. Photos and videos are stored using Google Firebase Storage infrastructure. Access to stored content is controlled according to the relevant platform permissions and authorization mechanisms."
          : "Waylero üzerinden paylaşılan içerikler ve mesajlar uygun teknik altyapı ve güvenlik önlemleri kullanılarak işlenir. Fotoğraf ve videolar Google Firebase Storage altyapısı kullanılarak saklanır. Saklanan içeriklere erişim, ilgili platform izinleri ve yetkilendirme mekanizmalarına göre kontrol edilir.",
      },

      {
        title: isEn
          ? "4. Purposes of Processing Personal Data"
          : "4. Kişisel Verilerin İşlenme Amaçları",

        list: isEn
          ? [
              "Providing and operating Waylero platform services",
              "Enabling content sharing and discovery features",
              "Improving platform functionality and user experience",
              "Responding to technical support requests and user inquiries",
              "Maintaining platform security and preventing misuse",
              "Fulfilling applicable legal obligations",
            ]
          : [
              "Waylero platform hizmetlerinin sunulması ve işletilmesi",
              "İçerik paylaşımı ve keşif özelliklerinin sağlanması",
              "Platform işlevlerinin ve kullanıcı deneyiminin geliştirilmesi",
              "Teknik destek taleplerinin ve kullanıcı başvurularının yanıtlanması",
              "Platform güvenliğinin sağlanması ve kötüye kullanımın önlenmesi",
              "Yürürlükteki yasal yükümlülüklerin yerine getirilmesi",
            ],
      },

      {
        title: isEn
          ? "5. Legal Basis for Processing"
          : "5. Veri İşlemenin Hukuki Dayanağı",

        body: isEn
          ? "Where required by applicable law, personal data is processed on the basis of one or more applicable legal grounds, such as providing requested services, complying with legal obligations, protecting legitimate interests, or obtaining consent where consent is required."
          : "Uygulanabilir mevzuatın gerektirdiği durumlarda kişisel veriler; talep edilen hizmetlerin sunulması, yasal yükümlülüklerin yerine getirilmesi, meşru menfaatlerin korunması veya mevzuatın gerekli gördüğü durumlarda açık rıza gibi hukuki dayanaklara dayanılarak işlenir.",
      },

      {
        title: isEn
          ? "6. Data Retention Period"
          : "6. Veri Saklama Süresi",

        body: isEn
          ? "Personal data is retained only for as long as necessary for the purposes for which it is processed, unless a longer retention period is required or permitted by applicable law. When a user account is deleted, personal data is deleted or anonymized where technically and legally appropriate."
          : "Kişisel veriler, daha uzun bir saklama süresi yürürlükteki mevzuat tarafından zorunlu veya izin verilen bir durum olmadıkça, işlenme amaçlarının gerektirdiği süre boyunca saklanır. Kullanıcı hesabı silindiğinde kişisel veriler, teknik ve hukuki olarak uygun olduğu ölçüde silinir veya anonim hale getirilir.",
      },

      {
        title: isEn
          ? "7. Data Storage and Third-Party Infrastructure"
          : "7. Verilerin Saklanması ve Üçüncü Taraf Altyapılar",

        body: isEn
          ? "Waylero uses third-party infrastructure providers, including Google Firebase services, to support certain platform functions and store data. Depending on the service configuration and applicable requirements, data may be processed or stored in locations outside the user's country. Appropriate safeguards are applied where required by applicable data protection laws."
          : "Waylero, platformun belirli işlevlerini desteklemek ve verileri saklamak amacıyla Google Firebase hizmetleri de dahil olmak üzere üçüncü taraf altyapı sağlayıcılarından yararlanır. Hizmet yapılandırmasına ve uygulanabilir yasal gerekliliklere bağlı olarak veriler kullanıcının bulunduğu ülke dışındaki konumlarda işlenebilir veya saklanabilir. Uygulanabilir veri koruma mevzuatının gerektirdiği durumlarda uygun güvenlik önlemleri uygulanır.",
      },

      {
        title: isEn
          ? "8. User Rights"
          : "8. Kullanıcı Hakları",

        list: isEn
          ? [
              "Request access to personal data",
              "Request correction of inaccurate or incomplete data",
              "Request deletion of personal data where legally applicable",
              "Object to or restrict certain forms of data processing where applicable",
              "Withdraw consent where processing is based on consent",
              "File a complaint with the relevant data protection authority",
            ]
          : [
              "Kişisel verilere erişim talep etme",
              "Hatalı veya eksik kişisel verilerin düzeltilmesini talep etme",
              "Yasal olarak mümkün olduğu durumlarda kişisel verilerin silinmesini isteme",
              "Uygulanabilir olduğu durumlarda belirli veri işleme faaliyetlerine itiraz etme veya bunların sınırlandırılmasını talep etme",
              "Veri işleme açık rızaya dayanıyorsa rızayı geri çekme",
              "İlgili veri koruma kurumuna veya yetkili makama şikâyette bulunma",
            ],
      },

      {
        title: isEn
          ? "9. Third-Party Services and Links"
          : "9. Üçüncü Taraf Hizmetler ve Bağlantılar",

        body: isEn
          ? "Waylero may contain links or integrations to third-party websites and services. These third parties may process personal data according to their own privacy policies and terms. Users should review the privacy practices of third-party services before providing personal information."
          : "Waylero, üçüncü taraf web sitelerine ve hizmetlerine bağlantılar veya entegrasyonlar içerebilir. Bu üçüncü taraflar kişisel verileri kendi gizlilik politikalarına ve kullanım koşullarına göre işleyebilir. Kullanıcıların kişisel bilgilerini paylaşmadan önce üçüncü taraf hizmetlerin gizlilik uygulamalarını incelemeleri önerilir.",
      },

      {
        title: isEn
          ? "10. Policy Updates"
          : "10. Politika Güncellemeleri",

        body: isEn
          ? "Waylero may update this Privacy Policy when necessary due to changes in legislation, technology or platform services. The latest version will be published on this page together with its effective date."
          : "Waylero; mevzuat, teknoloji veya platform hizmetlerinde meydana gelen değişiklikler nedeniyle gerekli gördüğü durumlarda bu Gizlilik Politikası'nı güncelleyebilir. Güncel sürüm, yürürlük tarihiyle birlikte bu sayfada yayımlanır.",
      },

      {
        title: isEn
          ? "11. Contact"
          : "11. İletişim",

        body: isEn
          ? "For questions, requests or concerns regarding this Privacy Policy or the processing of personal data, you can contact Waylero using the e-mail address below."
          : "Bu Gizlilik Politikası veya kişisel verilerin işlenmesiyle ilgili sorularınız, talepleriniz ya da endişeleriniz için aşağıdaki e-posta adresi üzerinden Waylero ile iletişime geçebilirsiniz.",

        contact: "wayylero@gmail.com",
      },
    ],
  };

  // 🔥 JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: isEn
      ? "Waylero's privacy policy, data protection practices and user privacy rights."
      : "Waylero gizlilik politikası, veri koruma uygulamaları ve kullanıcı gizliliği hakları.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Waylero",
      url: baseUrl,
    },
    inLanguage: isEn ? "en-US" : "tr-TR",
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <main className="max-w-4xl mx-auto px-6 py-24">
        {/* Header */}
        <header className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-10 bg-orange-500" />

            <span className="text-[10px] text-orange-600 font-black uppercase tracking-[0.35em]">
              Waylero
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif font-bold text-gray-900 tracking-tighter italic leading-none">
            {content.title}
          </h1>

          <p className="mt-6 text-[10px] text-gray-400 font-black uppercase tracking-[0.3em] italic border-b border-gray-100 pb-8">
            {content.date}
          </p>
        </header>

        <section className="space-y-16 text-gray-700 leading-relaxed">
          {/* Intro Highlight */}
          <div className="bg-orange-50/50 p-10 md:p-12 rounded-[3rem] border border-orange-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />

            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-orange-950 relative z-10 italic">
              {content.introTitle}
            </h2>

            <p className="text-orange-900/80 relative z-10 leading-relaxed font-medium text-lg">
              {content.introText}
            </p>
          </div>

          {/* Policy Sections */}
          <div className="grid gap-12">
            {content.sections.map((section, i) => (
              <section
                key={i}
                className="group border-l border-gray-100 hover:border-orange-500 pl-8 md:pl-10 transition-all duration-500"
              >
                <h2 className="text-2xl font-serif font-bold mb-6 text-gray-900 group-hover:text-orange-600 transition-colors italic tracking-tight">
                  {section.title}
                </h2>

                {section.body && (
                  <p className="mb-6 text-gray-500 font-medium text-lg leading-relaxed max-w-3xl">
                    {section.body}
                  </p>
                )}

                {section.list && (
                  <ul className="grid gap-4">
                    {section.list.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-4 text-gray-600"
                      >
                        <span className="w-1.5 h-1.5 mt-2.5 rounded-full bg-orange-400 shrink-0 group-hover:scale-150 transition-transform" />

                        <span className="font-semibold text-base tracking-tight leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.contact && (
                  <div className="mt-8 inline-flex items-center gap-4 bg-white px-6 py-4 rounded-2xl border border-gray-100 shadow-xl shadow-black/[0.02] hover:shadow-orange-100 transition-all">
                    <span className="text-xs font-black uppercase tracking-widest text-orange-600">
                      {isEn ? "Contact" : "İletişim"}
                    </span>

                    <a
                      href={`mailto:${section.contact}`}
                      className="text-gray-900 font-serif font-bold italic hover:text-orange-600 transition-colors"
                    >
                      {section.contact}
                    </a>
                  </div>
                )}
              </section>
            ))}
          </div>

          {/* Footer */}
          <footer className="pt-20 border-t border-gray-100 flex flex-col items-center text-center pb-10">
            <p className="font-serif text-4xl font-bold text-gray-900 mb-2 italic tracking-tighter">
              Waylero
            </p>

            <div className="flex items-center gap-4 mb-4">
              <div className="h-px w-8 bg-orange-200" />

              <p className="text-[10px] text-orange-600 font-black tracking-[0.4em] uppercase">
                {isEn ? "Trust & Privacy" : "Güven ve Gizlilik"}
              </p>

              <div className="h-px w-8 bg-orange-200" />
            </div>

            <p className="text-gray-400 text-xs italic opacity-60">
              © {new Date().getFullYear()} Waylero Platform
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
}