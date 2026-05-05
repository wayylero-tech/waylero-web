import { Metadata } from "next";

// --- METADATA ---
// Artık dili 'params' üzerinden alıyoruz, headers'a gerek kalmadı.
export async function generateMetadata({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}): Promise<Metadata> {
  const { lang } = await params;
  const isEn = lang === "en";

  return {
    title: isEn ? "Contact Us | Waylero" : "İletişim | Waylero",
    description: isEn 
      ? "Contact Waylero for your questions and suggestions." 
      : "Sorularınız ve önerileriniz için Waylero ile iletişime geçin.",
  };
}

// --- PAGE COMPONENT ---
export default async function ContactPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  // 1. Dil bilgisini direkt URL parametresinden (params) çekiyoruz
  const { lang } = await params;
  const isEn = lang === "en";

  // 2. İçerik Objesi (Waylero Stili)
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
    <main className="max-w-4xl mx-auto px-6 py-24">
      {/* Waylero Signature Title */}
      <h1 className="text-5xl md:text-7xl font-serif font-bold mb-12 text-gray-900 tracking-tighter italic uppercase leading-[0.85]">
        {content.title}
      </h1>

      <section className="space-y-12 text-gray-700 leading-relaxed">
        <p className="text-2xl text-gray-500 font-medium opacity-90 leading-relaxed max-w-3xl">
          {content.intro}
        </p>

        {/* Contact Cards - Waylero Style */}
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-black/5 hover:shadow-orange-100 transition-all duration-500 transform hover:-translate-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
              {content.emailTitle}
            </h2>
            <a
              href="mailto:wayylero@gmail.com"
              className="text-2xl font-serif font-bold text-gray-900 hover:text-orange-600 transition-colors break-all italic"
            >
              wayylero@gmail.com
            </a>
          </div>

          <div className="group p-8 rounded-[2.5rem] bg-white border border-gray-100 shadow-xl shadow-black/5 hover:shadow-blue-100 transition-all duration-500 transform hover:-translate-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
              {content.websiteTitle}
            </h2>
            <a
              href="https://www.waylero.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-2xl font-serif font-bold text-gray-900 hover:text-blue-600 transition-colors italic"
            >
              www.waylero.com
            </a>
          </div>
        </div>

        {/* Note Section */}
        <div className="bg-orange-50/40 p-10 rounded-[3rem] border border-orange-100/50 italic text-gray-600 text-lg leading-relaxed relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 font-serif text-8xl text-orange-900 select-none pointer-events-none">”</div>
          <p className="relative z-10 font-medium">“{content.note}”</p>
        </div>

        {/* Footer Signature */}
        <div className="pt-16 border-t border-gray-50 flex flex-col gap-3">
          <p className="font-serif text-4xl font-bold text-gray-900 tracking-tighter italic">Waylero</p>
          <div className="flex items-center gap-4">
             <div className="h-[1px] w-12 bg-orange-200" />
             <p className="text-orange-600 font-black tracking-[0.3em] text-[10px] uppercase">
                {content.slogan}
             </p>
          </div>
          <p className="mt-6 text-gray-400 text-sm font-medium italic opacity-70 uppercase tracking-widest">
            {content.closing}
          </p>
        </div>
      </section>
    </main>
  );
}