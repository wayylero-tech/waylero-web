import { headers } from "next/headers";

export default async function TermsPage() {
  // 🔥 Dil kontrolü
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") || "tr";
  const isEn = lang === "en";

  const content = {
    title: isEn ? "Terms of Use and Community Guidelines" : "Waylero Kullanım Koşulları ve Topluluk Kuralları",
    effectiveDate: isEn 
      ? "Effective Date: The date the Waylero platform is first used by the user" 
      : "Yürürlük Tarihi: Waylero platformunun kullanıcı tarafından ilk kez kullanıldığı tarih",
    intro: isEn
      ? "Thank you for using Waylero. These Terms of Use govern the conditions for the use of services offered through the Waylero mobile application and web platform, user rights and obligations, and community standards. By using Waylero, you are deemed to have accepted these terms."
      : "Waylero’yu kullandığınız için teşekkür ederiz. İşbu Kullanım Koşulları, Waylero mobil uygulaması ve web platformu üzerinden sunulan hizmetlerin kullanımına ilişkin şartları, kullanıcı hak ve yükümlülüklerini ve topluluk standartlarını düzenler. Waylero’yu kullanarak bu koşulları kabul etmiş sayılırsınız.",
    sections: [
      {
        id: 1,
        title: isEn ? "1. General Provisions" : "1. Genel Hükümler",
        list: isEn
          ? [
              "These terms of use apply to all users using the Waylero platform.",
              "Waylero is a platform that offers social features such as travel planning, content sharing, discovery, adding friends, and messaging between users.",
              "Waylero is operated by an individual developer and is subject to the legislation of the Republic of Turkey."
            ]
          : [
              "Bu kullanım koşulları, Waylero platformunu kullanan tüm kullanıcılar için geçerlidir.",
              "Waylero; gezi planlama, içerik paylaşımı, keşif, arkadaş ekleme ve kullanıcılar arası mesajlaşma gibi sosyal özellikler sunan bir platformdur.",
              "Waylero, bireysel geliştirici tarafından işletilmekte olup Türkiye Cumhuriyeti mevzuatına tabidir."
            ]
      },
      {
        id: 2,
        title: isEn ? "2. Community Rules and Conduct Standards" : "2. Topluluk Kuralları ve Davranış Standartları",
        subSections: [
          {
            subTitle: isEn ? "2.1 Respect and Ethical Conduct" : "2.1 Saygı ve Etik Davranış",
            subList: isEn
              ? ["Users must use a respectful and constructive language towards other users.", "Discrimination, hate speech, threats, insults, and harassment are prohibited."]
              : ["Kullanıcılar, diğer kullanıcılara karşı saygılı ve yapıcı bir dil kullanmalıdır.", "Ayrımcılık, nefret söylemi, tehdit, hakaret ve taciz yasaktır."]
          },
          {
            subTitle: isEn ? "2.2 Content Sharing" : "2.2 İçerik Paylaşımı",
            subList: isEn
              ? [
                  "Shared contents must comply with current legislation and community rules.",
                  "Pornographic, violent, obscene, or illegal contents are prohibited.",
                  "Contents whose copyright does not belong to the user cannot be shared without permission.",
                  "Sharing spam and unauthorized advertising content is prohibited."
                ]
              : [
                  "Paylaşılan içerikler yürürlükteki mevzuata ve topluluk kurallarına uygun olmalıdır.",
                  "Pornografik, şiddet içeren, müstehcen veya yasa dışı içerikler yasaktır.",
                  "Telif hakkı kullanıcıya ait olmayan içerikler izinsiz paylaşılamaz.",
                  "Spam ve izinsiz reklam içerikleri paylaşmak yasaktır."
                ]
          }
        ]
      },
      {
        id: 3,
        title: isEn ? "3. Account Usage and Security" : "3. Hesap Kullanımı ve Güvenliği",
        list: isEn
          ? ["Users must register with accurate and up-to-date information.", "Fake accounts or accounts belonging to others are prohibited.", "Account security is the responsibility of the user."]
          : ["Kullanıcılar doğru ve güncel bilgilerle kayıt olmalıdır.", "Sahte veya başkasına ait hesaplar yasaktır.", "Hesap güvenliği kullanıcının sorumluluğundadır."]
      },
      {
        id: 4,
        title: isEn ? "4. Privacy and Data Protection" : "4. Gizlilik ve Kişisel Verilerin Korunması",
        body: isEn
          ? "Personal data is processed in accordance with KVKK and GDPR provisions. You can review the Privacy Policy page for detailed information."
          : "Kişisel veriler, 6698 sayılı KVKK ve GDPR hükümlerine uygun olarak işlenir. Detaylı bilgi için Gizlilik Politikası sayfasını inceleyebilirsiniz."
      },
      {
        id: 5,
        title: isEn ? "5. Violations and Sanctions" : "5. İhlaller ve Yaptırımlar",
        body: isEn
          ? "In case of violation of community rules, Waylero reserves the right to remove content and temporarily or permanently close the account."
          : "Topluluk kurallarının ihlali halinde, Waylero içerikleri kaldırma, hesabı geçici veya kalıcı olarak kapatma hakkını saklı tutar."
      },
      {
        id: 6,
        title: isEn ? "6. Service Changes" : "6. Hizmet Değişiklikleri",
        body: isEn
          ? "Waylero reserves the right to make changes to its services and terms of use at any time."
          : "Waylero, hizmetlerinde ve kullanım koşullarında dilediği zaman değişiklik yapma hakkını saklı tutar."
      },
      {
        id: 7,
        title: isEn ? "7. Authorized Court" : "7. Yetkili Mahkeme",
        body: isEn
          ? "In disputes that may arise from this agreement, the laws of the Republic of Turkey shall apply, and Istanbul Courts are authorized."
          : "İşbu sözleşmeden doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti hukuku uygulanır ve İstanbul Mahkemeleri yetkilidir."
      },
      {
        id: 8,
        title: isEn ? "8. Contact" : "8. İletişim",
        body: isEn 
          ? "You can contact us for any questions and requests:" 
          : "Her türlü soru ve talepleriniz için bizimle iletişime geçebilirsiniz:"
      }
    ]
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>
      <p className="text-sm text-gray-500 mb-8">{content.effectiveDate}</p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>{content.intro}</p>

        {content.sections.map((section) => (
          <div key={section.id}>
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            {section.list && (
              <ul className="list-disc pl-5 space-y-1">
                {section.list.map((item, idx) => <li key={idx}>{item}</li>)}
              </ul>
            )}
            {section.subSections && section.subSections.map((sub, sIdx) => (
              <div key={sIdx} className="mt-4">
                <h3 className="font-semibold mb-1">{sub.subTitle}</h3>
                <ul className="list-disc pl-5 space-y-1">
                  {sub.subList.map((item, iIdx) => <li key={iIdx}>{item}</li>)}
                </ul>
              </div>
            ))}
            {section.body && <p>{section.body}</p>}
            {section.id === 8 && (
              <p className="mt-2">
                📧 <a href="mailto:wayylero@gmail.com" className="text-blue-600 underline">wayylero@gmail.com</a>
              </p>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
