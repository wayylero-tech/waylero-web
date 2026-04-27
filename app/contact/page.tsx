import { headers } from "next/headers";

export async function generateMetadata() {
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";

  return {
    title: lang === "en" ? "Contact Us | Waylero" : "İletişim | Waylero",
    description: lang === "en" 
      ? "Contact Waylero for your questions and suggestions." 
      : "Sorularınız ve önerileriniz için Waylero ile iletişime geçin.",
  };
}

export default async function ContactPage() {
  // 1. Dil bilgisini direkt sunucuda çekiyoruz
  const headerList = await headers();
  const lang = headerList.get("x-url-lang") === "en" ? "en" : "tr";
  const isEn = lang === "en";

  // 2. İçerik Objesi
  const content = {
    title: isEn ? "Contact Us" : "İletişim",
    intro: isEn
      ? "If you have any questions, suggestions, or business inquiries regarding Waylero, feel free to contact us. We aim to respond as quickly as possible."
      : "Waylero ile ilgili her türlü soru, öneri ve iş birlikleri için bizimle iletişime geçebilirsiniz. En kısa sürede geri dönüş sağlamaya çalışıyoruz.",
    emailTitle: isEn ? "Email" : "E-posta",
    websiteTitle: isEn ? "Website" : "Web Sitesi",
    note: isEn
      ? "For partnerships, advertising, or legal inquiries, please clearly state your request in your message."
      : "İş birlikleri, reklam ve yasal talepleriniz için lütfen mesajınızda konuyu açıkça belirtiniz.",
    closing: isEn
      ? "Thank you for being part of Waylero."
      : "Waylero’nun bir parçası olduğunuz için teşekkür ederiz.",
    slogan: isEn ? "Explore. Plan. Share." : "Keşfet. Planla. Paylaş."
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-20">
      <h1 className="text-4xl font-serif font-bold mb-8 text-gray-900">{content.title}</h1>

      <section className="space-y-8 text-gray-700 leading-relaxed text-lg">
        <p className="text-xl text-gray-600">{content.intro}</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-orange-600 mb-2">
              {content.emailTitle}
            </h2>
            <a
              href="mailto:wayylero@gmail.com"
              className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors break-all"
            >
              wayylero@gmail.com
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100">
            <h2 className="text-sm font-black uppercase tracking-widest text-blue-600 mb-2">
              {content.websiteTitle}
            </h2>
            <a
              href="https://www.waylero.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              www.waylero.com
            </a>
          </div>
        </div>

        <div className="bg-orange-50/50 p-6 rounded-2xl border border-orange-100 italic text-gray-600">
          <p>“{content.note}”</p>
        </div>

        <div className="pt-10 border-t flex flex-col gap-2">
          <p className="font-serif text-2xl font-bold text-gray-900">Waylero</p>
          <p className="text-orange-600 font-bold tracking-widest text-xs uppercase">
            {content.slogan}
          </p>
          <p className="mt-4 text-gray-400 text-sm italic">
            {content.closing}
          </p>
        </div>
      </section>
    </main>
  );
}