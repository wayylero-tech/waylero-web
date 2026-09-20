import { Metadata } from "next";

type Props = {
  params: Promise<{ lang: string }>;
};

// 🌍 SEO ve Metadata
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";
  const baseUrl = "https://www.waylero.com";

  const title = isEn
    ? "Terms of Service | Waylero"
    : "Kullanım Koşulları | Waylero";

  const description = isEn
    ? "Read Waylero's terms of service, platform rules, user responsibilities and conditions for using our travel discovery services."
    : "Waylero kullanım koşullarını, platform kurallarını, kullanıcı sorumluluklarını ve seyahat hizmetlerimizin kullanım şartlarını inceleyin.";

  const url = `${baseUrl}${isEn ? "/en" : "/tr"}/terms`;

  return {
    title,
    description,

    alternates: {
      canonical: url,
      languages: {
        "tr-TR": `${baseUrl}/tr/terms`,
        "en-US": `${baseUrl}/en/terms`,
        "x-default": `${baseUrl}/en/terms`,
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
export default async function TermsPage({ params }: Props) {
  const { lang } = await params;
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Terms of Service" : "Kullanım Koşulları",

    // Kullanıcının istediği ifade korunuyor
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
          ? "Waylero provides travel discovery, destination information and travel planning services. By accessing or using the platform, you agree to comply with these Terms of Service and all applicable laws and regulations."
          : "Waylero; seyahat keşfi, destinasyon bilgileri ve seyahat planlama hizmetleri sunar. Platforma erişerek veya platformu kullanarak bu Kullanım Koşulları'na ve yürürlükteki tüm yasa ve düzenlemelere uymayı kabul etmiş olursunuz.",
      },
      {
        title: isEn ? "2. Use of the Platform" : "2. Platformun Kullanımı",
        body: isEn
          ? "You agree to use Waylero only for lawful purposes. You must not use the platform in a way that may damage, disable, overload or interfere with its operation or the experience of other users."
          : "Waylero'yu yalnızca yasal amaçlarla kullanmayı kabul edersiniz. Platformun çalışmasına veya diğer kullanıcıların deneyimine zarar verecek, platformu devre dışı bırakacak, aşırı yükleyecek ya da işleyişine müdahale edecek şekilde kullanamazsınız.",
      },
      {
        title: isEn ? "3. Travel Information" : "3. Seyahat Bilgileri",
        body: isEn
          ? "Waylero provides travel-related information for general informational and planning purposes. Information such as opening hours, prices, availability, transportation details and event schedules may change. Users should verify important details with the relevant official provider before making travel arrangements."
          : "Waylero, seyahatle ilgili bilgileri genel bilgilendirme ve planlama amacıyla sunar. Açılış saatleri, fiyatlar, müsaitlik, ulaşım bilgileri ve etkinlik programları gibi bilgiler değişebilir. Seyahat planı yapmadan önce önemli bilgileri ilgili resmi kaynak veya hizmet sağlayıcıdan doğrulamanız önerilir.",
      },
      {
        title: isEn
          ? "4. Third-Party Services and Links"
          : "4. Üçüncü Taraf Hizmetler ve Bağlantılar",
        body: isEn
          ? "Waylero may contain links to third-party websites, booking platforms, tour providers or other external services. These services are operated independently and may have their own terms, policies and conditions."
          : "Waylero; üçüncü taraf web sitelerine, rezervasyon platformlarına, tur sağlayıcılarına veya diğer harici hizmetlere bağlantılar içerebilir. Bu hizmetler bağımsız olarak işletilir ve kendi kullanım koşullarına, politikalarına ve şartlarına sahip olabilir.",
      },
      {
        title: isEn ? "5. User Content" : "5. Kullanıcı İçerikleri",
        body: isEn
          ? "You retain ownership of content you submit to Waylero. By submitting content, you grant Waylero a non-exclusive license to display and use that content as necessary to operate and improve the platform."
          : "Waylero'ya gönderdiğiniz içeriklerin mülkiyeti size aittir. İçerik paylaşarak, Waylero'ya platformu işletmek ve geliştirmek için gerekli olduğu ölçüde bu içeriği görüntüleme ve kullanma konusunda münhasır olmayan bir lisans vermiş olursunuz.",
      },
      {
        title: isEn ? "6. Service Availability" : "6. Hizmet Kullanılabilirliği",
        body: isEn
          ? "We work to keep Waylero available and reliable, but we do not guarantee that the platform will always operate without interruption, delay or technical issues."
          : "Waylero'nun erişilebilir ve güvenilir olması için çalışıyoruz ancak platformun her zaman kesintisiz, gecikmesiz veya teknik sorunlardan tamamen uzak şekilde çalışacağını garanti etmiyoruz.",
      },
      {
        title: isEn
          ? "7. Changes to These Terms"
          : "7. Kullanım Koşullarında Değişiklikler",
        body: isEn
          ? "We may update these Terms of Service from time to time. Updated terms will be published on this page, and continued use of Waylero after changes are published constitutes acceptance of the updated terms."
          : "Bu Kullanım Koşulları zaman zaman güncellenebilir. Güncellenen koşullar bu sayfada yayımlanır ve değişikliklerin yayımlanmasından sonra Waylero'yu kullanmaya devam etmeniz güncellenen koşulları kabul ettiğiniz anlamına gelir.",
      },
      {
        title: isEn ? "8. Contact" : "8. İletişim",
        body: isEn
          ? "If you have questions about these Terms of Service, you can contact Waylero through the contact information provided on our website."
          : "Bu Kullanım Koşulları hakkında sorularınız varsa web sitemizde yer alan iletişim bilgileri üzerinden Waylero ile iletişime geçebilirsiniz.",
      },
    ],
  };

  const pageUrl = `https://www.waylero.com/${lang}/terms`;

  // 🔥 JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: content.title,
    description: isEn
      ? "Waylero's terms of service and platform usage conditions."
      : "Waylero kullanım koşulları ve platform kullanım şartları.",
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Waylero",
      url: "https://www.waylero.com",
    },
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
          {/* Intro Box */}
          <div className="bg-orange-50/50 p-10 md:p-12 rounded-[3rem] border border-orange-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-orange-100/30 rounded-full -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />

            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-6 text-orange-950 relative z-10 italic">
              {content.introTitle}
            </h2>

            <p className="text-orange-900/80 relative z-10 leading-relaxed font-medium text-lg">
              {content.introText}
            </p>
          </div>

          {/* Sections */}
          <div className="grid gap-12">
            {content.sections.map((section, i) => (
              <section
                key={i}
                className="group border-l border-gray-100 hover:border-orange-500 pl-8 md:pl-10 transition-all duration-500"
              >
                <h2 className="text-2xl font-serif font-bold mb-5 text-gray-900 group-hover:text-orange-600 transition-colors italic tracking-tight">
                  {section.title}
                </h2>

                <p className="text-gray-500 font-medium text-lg leading-relaxed max-w-3xl">
                  {section.body}
                </p>
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
                {isEn ? "Terms & Conditions" : "Kullanım Koşulları"}
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