<<<<<<< HEAD
import { headers } from "next/headers";

export default async function PrivacyPage() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Privacy Policy" : "Gizlilik Politikası",
    dateLabel: isEn ? "Effective Date:" : "Yürürlük Tarihi:",
    dateValue: isEn
      ? "The date you first used the Waylero platform"
      : "Waylero platformunu ilk kez kullandığınız tarih",

    sections: [
      {
        id: "intro",
        title: isEn
          ? "Waylero – Data Protection and Privacy Statement"
          : "Waylero – Veri Koruma ve Gizlilik Beyanı",
        body: isEn
          ? "At Waylero, we value the privacy of our users. This Privacy Policy explains how personal data obtained through the Waylero mobile application and website is processed in accordance with the Law No. 6698 on the Protection of Personal Data (KVKK) and the European Union General Data Protection Regulation (GDPR)."
          : "Waylero olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası; Waylero mobil uygulaması ve web sitesi üzerinden sunulan hizmetler kapsamında elde edilen kişisel verilerin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyarınca nasıl işlendiğini açıklamaktadır.",
      },
      {
        id: 1,
        title: isEn ? "1. Data Controller" : "1. Veri Sorumlusu",
        body: isEn
          ? "Data controller under the scope of KVKK: Waylero"
          : "KVKK kapsamında veri sorumlusu: Waylero",
        contactLabel: isEn ? "Contact:" : "İletişim:",
      },
      {
        id: 2,
        title: isEn
          ? "2. Collected Personal Data"
          : "2. Toplanan Kişisel Veriler",
        list: isEn
          ? [
              "Name, surname and e-mail address",
              "Photos and videos shared by the user",
              "Device information (operating system, device model, IP address)",
              "Messaging content between users",
              "In-app usage and interaction data",
=======
"use client";

import { useEffect } from "react";
import { useLang } from "@/app/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

export default function PrivacyPage() {
  const { lang } = useLang();
  const router = useRouter();
  const pathname = usePathname();

  const isEn = lang === "en";

  // 🔥 URL SENKRON
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
    title: isEn ? "Privacy Policy" : "Gizlilik Politikası",
    date: isEn
      ? "Effective Date: The date you first use the Waylero platform"
      : "Yürürlük Tarihi: Waylero platformunu ilk kez kullandığınız tarih",

    introTitle: isEn
      ? "Waylero – Data Protection and Privacy Statement"
      : "Waylero – Veri Koruma ve Gizlilik Beyanı",

    introText: isEn
      ? "At Waylero, we place great importance on user privacy. This Privacy Policy explains how personal data collected through the Waylero mobile application and website is processed in accordance with GDPR and applicable data protection laws."
      : "Waylero olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz. Bu Gizlilik Politikası; Waylero mobil uygulaması ve web sitesi üzerinden elde edilen kişisel verilerin KVKK ve GDPR kapsamında nasıl işlendiğini açıklar.",

    sections: [
      {
        title: isEn ? "1. Data Controller" : "1. Veri Sorumlusu",
        body: isEn
          ? "Data Controller under applicable law: Waylero"
          : "KVKK kapsamında veri sorumlusu: Waylero",
      },
      {
        title: isEn ? "2. Collected Personal Data" : "2. Toplanan Kişisel Veriler",
        list: isEn
          ? [
              "Name, surname, and email address",
              "User shared photos and videos",
              "Device information (OS, model, IP)",
              "Messaging content between users",
              "Usage and interaction data",
>>>>>>> 48a16b0 (cms ignore)
            ]
          : [
              "Ad, soyad ve e-posta adresi",
              "Kullanıcı tarafından paylaşılan fotoğraf ve videolar",
              "Cihaz bilgileri (işletim sistemi, cihaz modeli, IP adresi)",
              "Kullanıcılar arası mesajlaşma içerikleri",
<<<<<<< HEAD
              "Uygulama içi kullanım ve etkileşim verileri",
            ],
      },
      {
        id: 3,
=======
              "Uygulama içi kullanım verileri",
            ],
      },
      {
>>>>>>> 48a16b0 (cms ignore)
        title: isEn
          ? "3. Messaging and Media Security"
          : "3. Mesajlaşma ve Medya Güvenliği",
        body: isEn
<<<<<<< HEAD
          ? "Contents and messages shared on Waylero are protected using secure infrastructures. Photos and videos are stored in Google Firebase Storage and are only accessible by authorized users."
          : "Waylero üzerinde paylaşılan içerikler ve mesajlar güvenli altyapılar kullanılarak korunur. Fotoğraf ve videolar Google Firebase Storage altyapısında saklanır ve yalnızca yetkili kullanıcılar tarafından erişilebilir.",
      },
      {
        id: 4,
        title: isEn
          ? "4. Purposes of Processing Data"
          : "4. Verilerin İşlenme Amaçları",
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
        id: 5,
        title: isEn
          ? "5. Data Retention Period"
          : "5. Veri Saklama Süresi",
        body: isEn
          ? "Personal data is stored for as long as necessary for the purposes for which it is processed. When a user account is deleted, the data is irreversibly deleted or anonymized."
          : "Kişisel veriler, işlenme amacının gerektirdiği süre boyunca saklanır. Kullanıcı hesabı silindiğinde veriler geri döndürülemez şekilde silinir veya anonim hale getirilir.",
      },
      {
        id: 6,
        title: isEn
          ? "6. Data Storage Location"
          : "6. Verilerin Saklandığı Yer",
        body: isEn
          ? "Data processed within Waylero is stored in data centers located in the European Union via Google Firebase infrastructure."
          : "Waylero kapsamında işlenen veriler, Google Firebase altyapısı kullanılarak Avrupa Birliği sınırları içerisindeki veri merkezlerinde saklanmaktadır.",
      },
      {
        id: 7,
=======
          ? "All content and messages are protected using secure infrastructures. Media files are stored on Google Firebase Storage and only accessible by authorized users."
          : "Paylaşılan içerikler güvenli altyapılar ile korunur. Medyalar Firebase Storage üzerinde saklanır ve sadece yetkili kullanıcılar erişebilir.",
      },
      {
        title: isEn ? "4. Purpose of Processing" : "4. Verilerin İşlenme Amaçları",
        list: isEn
          ? [
              "Providing platform services",
              "Enabling content sharing and discovery",
              "Improving user experience",
              "Technical support",
              "Legal compliance",
            ]
          : [
              "Platform hizmetlerinin sunulması",
              "İçerik paylaşımı ve keşif",
              "Kullanıcı deneyiminin geliştirilmesi",
              "Teknik destek",
              "Yasal yükümlülükler",
            ],
      },
      {
        title: isEn ? "5. Data Retention" : "5. Veri Saklama Süresi",
        body: isEn
          ? "Personal data is stored as long as necessary. When an account is deleted, data is permanently removed or anonymized."
          : "Veriler gerekli süre boyunca saklanır. Hesap silindiğinde kalıcı olarak silinir veya anonim hale getirilir.",
      },
      {
        title: isEn ? "6. Data Storage Location" : "6. Verilerin Saklandığı Yer",
        body: isEn
          ? "Data is stored in EU-based servers via Google Firebase infrastructure."
          : "Veriler Firebase altyapısı ile Avrupa Birliği veri merkezlerinde saklanır.",
      },
      {
>>>>>>> 48a16b0 (cms ignore)
        title: isEn ? "7. User Rights" : "7. Kullanıcı Hakları",
        list: isEn
          ? [
              "Request access to personal data",
<<<<<<< HEAD
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
        id: 8,
        title: isEn ? "8. Policy Updates" : "8. Politika Güncellemeleri",
        body: isEn
          ? "Waylero may update this Privacy Policy in line with legal requirements or service changes. The latest version will always be available on this page."
          : "Waylero, bu Gizlilik Politikası’nı mevzuat veya hizmet değişikliklerine göre güncelleyebilir. Güncel versiyon her zaman bu sayfada yayınlanır.",
=======
              "Request correction",
              "Request deletion",
              "Object to processing",
              "File complaints",
            ]
          : [
              "Verilere erişim talep etme",
              "Düzeltme isteme",
              "Silme talep etme",
              "İtiraz etme",
              "Şikâyet hakkı",
            ],
      },
      {
        title: isEn ? "8. Policy Updates" : "8. Politika Güncellemeleri",
        body: isEn
          ? "Waylero may update this policy. The latest version is always available on this page."
          : "Waylero bu politikayı güncelleyebilir. Güncel hali her zaman burada yayınlanır.",
>>>>>>> 48a16b0 (cms ignore)
      },
    ],
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
<<<<<<< HEAD

      <p className="text-sm text-gray-500 mb-8">
        {content.dateLabel} {content.dateValue}
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        {content.sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold mb-2">
              {section.title}
            </h2>

            {section.body && <p>{section.body}</p>}

            {section.contactLabel && (
              <p>
                {section.contactLabel}{" "}
                <a
                  href="mailto:wayylero@gmail.com"
                  className="text-blue-600 underline"
                >
                  wayylero@gmail.com
                </a>
              </p>
            )}

            {section.list && (
              <ul className="list-disc pl-5 space-y-1">
                {section.list.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            )}
=======
      <p className="text-sm text-gray-500 mb-8">{content.date}</p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            {content.introTitle}
          </h2>
          <p>{content.introText}</p>
        </div>

        {content.sections.map((section, i) => (
          <div key={i}>
            <h3 className="text-lg font-semibold mb-2">
              {section.title}
            </h3>

            {section.body && <p>{section.body}</p>}

            {section.list && (
              <ul className="list-disc pl-5 space-y-1">
                {section.list.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            )}

            {i === 0 && (
              <p className="mt-2">
                📧{" "}
                <a
                  href="mailto:wayylero@gmail.com"
                  className="text-blue-600 underline"
                >
                  wayylero@gmail.com
                </a>
              </p>
            )}
>>>>>>> 48a16b0 (cms ignore)
          </div>
        ))}
      </section>
    </main>
  );
}