"use client";

import { useEffect } from "react";
import { useLang } from "@/app/context/LanguageContext";
import { useRouter, usePathname } from "next/navigation";

export default function ContactPage() {
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
      : "Waylero’nun bir parçası olduğunuz için teşekkür ederiz."
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{content.title}</h1>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>{content.intro}</p>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {content.emailTitle}
          </h2>
          <p>
            📧{" "}
            <a
              href="mailto:wayylero@gmail.com"
              className="text-blue-600 underline"
            >
              wayylero@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            {content.websiteTitle}
          </h2>
          <p>
            🌐{" "}
            <a
              href="https://www.waylero.com"
              target="_blank"
              className="text-blue-600 underline"
            >
              www.waylero.com
            </a>
          </p>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl border">
          <p>{content.note}</p>
        </div>

        <div className="pt-6 border-t">
          <p className="font-semibold text-gray-900">Waylero</p>
          <p className="text-sm text-gray-500">
            {isEn ? "Explore. Plan. Share." : "Keşfet. Planla. Paylaş."}
          </p>
        </div>

        <p className="text-sm text-gray-500">
          {content.closing}
        </p>
      </section>
    </main>
  );
}