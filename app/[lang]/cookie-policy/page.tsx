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
    title: isEn
      ? "Cookie Policy | Waylero"
      : "Çerez Politikası | Waylero",

    description: isEn
      ? "Waylero's cookie policy explains how cookies and similar technologies are used on the platform."
      : "Waylero çerez politikası, çerezlerin ve benzer teknolojilerin platform üzerinde nasıl kullanıldığını açıklar.",

    alternates: {
      canonical: `${baseUrl}${isEn ? "/en" : ""}/cerez-politikasi`,
      languages: {
        "tr-TR": `${baseUrl}/cerez-politikasi`,
        "en-US": `${baseUrl}/en/cerez-politikasi`,
      },
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CookiePolicyPage({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Cookie Policy" : "Çerez Politikası",

    date: isEn
      ? "Effective Date: May 2026"
      : "Yürürlük Tarihi: Mayıs 2026",

    introTitle: isEn
      ? "Waylero – Cookie and Similar Technologies Statement"
      : "Waylero – Çerez ve Benzer Teknolojiler Beyanı",

    introText: isEn
      ? "At Waylero, we use cookies and similar technologies to provide a better, more secure and useful experience. This policy explains what cookies are, why they are used and how users can manage them."
      : "Waylero olarak daha iyi, güvenli ve kullanışlı bir kullanıcı deneyimi sunmak amacıyla çerezler ve benzer teknolojiler kullanabiliriz. Bu politika, çerezlerin ne olduğunu, neden kullanıldığını ve kullanıcıların çerezleri nasıl yönetebileceğini açıklar.",

    sections: [
      {
        title: isEn
          ? "1. What Are Cookies?"
          : "1. Çerezler Nedir?",

        body: isEn
          ? "Cookies are small text files stored on your device when you visit a website. They help websites remember certain information and understand how visitors use the platform."
          : "Çerezler, bir web sitesini ziyaret ettiğinizde cihazınızda saklanan küçük metin dosyalarıdır. Web sitelerinin belirli bilgileri hatırlamasına ve ziyaretçilerin platformu nasıl kullandığını anlamasına yardımcı olurlar.",
      },

      {
        title: isEn
          ? "2. Why Do We Use Cookies?"
          : "2. Çerezleri Neden Kullanıyoruz?",

        list: isEn
          ? [
              "To ensure the website works properly",
              "To improve website performance and user experience",
              "To understand website usage and visitor interactions",
              "To maintain security and prevent misuse",
              "To support analytics and measurement activities",
              "To display or measure advertisements when advertising services are enabled",
            ]
          : [
              "Web sitesinin düzgün çalışmasını sağlamak",
              "Web sitesi performansını ve kullanıcı deneyimini geliştirmek",
              "Web sitesinin kullanımını ve ziyaretçi etkileşimlerini anlamak",
              "Güvenliği sağlamak ve kötüye kullanımı önlemek",
              "Analiz ve ölçüm faaliyetlerini desteklemek",
              "Reklam hizmetleri etkinleştirildiğinde reklamların gösterilmesini veya ölçümlenmesini desteklemek",
            ],
      },

      {
        title: isEn
          ? "3. Types of Cookies We May Use"
          : "3. Kullanabileceğimiz Çerez Türleri",

        list: isEn
          ? [
              "Essential cookies: Required for basic website functions and security.",
              "Analytics cookies: Help us understand how visitors use the website and improve our services.",
              "Preference cookies: Help remember certain user preferences and settings.",
              "Advertising cookies: May be used to deliver, personalize or measure advertisements when advertising services are active.",
            ]
          : [
              "Zorunlu çerezler: Web sitesinin temel işlevleri ve güvenliği için gereklidir.",
              "Analitik çerezler: Ziyaretçilerin web sitesini nasıl kullandığını anlamamıza ve hizmetlerimizi geliştirmemize yardımcı olur.",
              "Tercih çerezleri: Bazı kullanıcı tercihlerini ve ayarlarını hatırlamaya yardımcı olur.",
              "Reklam çerezleri: Reklam hizmetleri aktif olduğunda reklamların sunulması, kişiselleştirilmesi veya ölçümlenmesi amacıyla kullanılabilir.",
            ],
      },

      {
        title: isEn
          ? "4. Third-Party Services"
          : "4. Üçüncü Taraf Hizmetleri",

        body: isEn
          ? "Waylero may use third-party services such as analytics, security, hosting or advertising providers. These services may use their own cookies or similar technologies according to their respective privacy and cookie policies."
          : "Waylero; analiz, güvenlik, barındırma veya reklam hizmetleri gibi üçüncü taraf hizmetlerden yararlanabilir. Bu hizmet sağlayıcıları, kendi gizlilik ve çerez politikaları doğrultusunda kendi çerezlerini veya benzer teknolojilerini kullanabilir.",
      },

      {
        title: isEn
          ? "5. Google Services and Advertising"
          : "5. Google Hizmetleri ve Reklamlar",

        body: isEn
          ? "Waylero may use Google services for analytics and advertising purposes. When advertising services such as Google AdSense are enabled, Google and its partners may use cookies or similar technologies to provide, personalize or measure advertisements in accordance with their applicable policies."
          : "Waylero, analiz ve reklam amaçlarıyla Google hizmetlerini kullanabilir. Google AdSense gibi reklam hizmetleri etkinleştirildiğinde Google ve iş ortakları, geçerli politikaları doğrultusunda reklamları sunmak, kişiselleştirmek veya ölçmek amacıyla çerezler veya benzer teknolojiler kullanabilir.",
      },

      {
        title: isEn
          ? "6. Managing Cookies"
          : "6. Çerezlerin Yönetilmesi",

        body: isEn
          ? "You can control or delete cookies through your browser settings. Most browsers allow you to block cookies, delete existing cookies or receive a warning before a cookie is stored. Please note that disabling certain cookies may affect some website functions."
          : "Çerezleri tarayıcı ayarlarınız üzerinden kontrol edebilir veya silebilirsiniz. Çoğu tarayıcı çerezleri engellemenize, mevcut çerezleri silmenize veya bir çerez kaydedilmeden önce uyarı almanıza olanak tanır. Bazı çerezlerin devre dışı bırakılması web sitesinin bazı işlevlerini etkileyebilir.",
      },

      {
        title: isEn
          ? "7. Changes to This Cookie Policy"
          : "7. Çerez Politikasındaki Değişiklikler",

        body: isEn
          ? "We may update this Cookie Policy from time to time to reflect changes in our services, technologies or legal requirements. The updated version will be published on this page with a revised effective date."
          : "Hizmetlerimizde, teknolojilerimizde veya yasal gerekliliklerde meydana gelen değişiklikleri yansıtmak amacıyla bu Çerez Politikasını zaman zaman güncelleyebiliriz. Güncellenmiş politika, yeni yürürlük tarihiyle birlikte bu sayfada yayınlanır.",
      },

      {
        title: isEn
          ? "8. Contact"
          : "8. İletişim",

        body: isEn
          ? "If you have any questions about this Cookie Policy, you can contact Waylero."
          : "Bu Çerez Politikası hakkında herhangi bir sorunuz varsa Waylero ile iletişime geçebilirsiniz.",

        contact: "wayylero@gmail.com",
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 bg-white">
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
            <div
              key={i}
              className="group border-l-2 border-gray-100 hover:border-orange-500 pl-8 transition-all duration-300"
            >
              <h3 className="text-2xl font-serif font-bold mb-4 text-gray-900 group-hover:text-orange-600 transition-colors">
                {section.title}
              </h3>

              {section.body && (
                <p className="mb-4 text-gray-600 font-medium text-lg">
                  {section.body}
                </p>
              )}

              {section.list && (
                <ul className="grid gap-3">
                  {section.list.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-gray-600 text-lg"
                    >
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
          <p className="font-serif text-3xl font-bold text-gray-900 mb-1">
            Waylero
          </p>

          <p className="text-[10px] text-orange-600 font-black tracking-[0.4em] uppercase">
            Trust & Transparency
          </p>
        </div>
      </section>
    </div>
  );
}