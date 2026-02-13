export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">
        Waylero Kullanım Koşulları ve Topluluk Kuralları
      </h1>

      <p className="text-sm text-gray-500 mb-8">
        Yürürlük Tarihi: Waylero platformunun kullanıcı tarafından ilk kez
        kullanıldığı tarih
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          Waylero’yu kullandığınız için teşekkür ederiz. İşbu Kullanım Koşulları,
          Waylero mobil uygulaması ve web platformu üzerinden sunulan
          hizmetlerin kullanımına ilişkin şartları, kullanıcı hak ve
          yükümlülüklerini ve topluluk standartlarını düzenler. Waylero’yu
          kullanarak bu koşulları kabul etmiş sayılırsınız.
        </p>

        <div>
          <h2 className="text-xl font-semibold mb-2">1. Genel Hükümler</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Bu kullanım koşulları, Waylero platformunu kullanan tüm kullanıcılar
              için geçerlidir.
            </li>
            <li>
              Waylero; gezi planlama, içerik paylaşımı, keşif, arkadaş ekleme ve
              kullanıcılar arası mesajlaşma gibi sosyal özellikler sunan bir
              platformdur.
            </li>
            <li>
              Waylero, bireysel geliştirici tarafından işletilmekte olup Türkiye
              Cumhuriyeti mevzuatına tabidir.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            2. Topluluk Kuralları ve Davranış Standartları
          </h2>

          <h3 className="font-semibold mt-2 mb-1">2.1 Saygı ve Etik Davranış</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Kullanıcılar, diğer kullanıcılara karşı saygılı ve yapıcı bir dil
              kullanmalıdır.
            </li>
            <li>
              Ayrımcılık, nefret söylemi, tehdit, hakaret ve taciz yasaktır.
            </li>
          </ul>

          <h3 className="font-semibold mt-4 mb-1">2.2 İçerik Paylaşımı</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Paylaşılan içerikler yürürlükteki mevzuata ve topluluk kurallarına
              uygun olmalıdır.
            </li>
            <li>
              Pornografik, şiddet içeren, müstehcen veya yasa dışı içerikler
              yasaktır.
            </li>
            <li>
              Telif hakkı kullanıcıya ait olmayan içerikler izinsiz paylaşılamaz.
            </li>
            <li>
              Spam ve izinsiz reklam içerikleri paylaşmak yasaktır.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            3. Hesap Kullanımı ve Güvenliği
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Kullanıcılar doğru ve güncel bilgilerle kayıt olmalıdır.
            </li>
            <li>
              Sahte veya başkasına ait hesaplar yasaktır.
            </li>
            <li>
              Hesap güvenliği kullanıcının sorumluluğundadır.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            4. Gizlilik ve Kişisel Verilerin Korunması
          </h2>
          <p>
            Kişisel veriler, 6698 sayılı KVKK ve GDPR hükümlerine uygun olarak
            işlenir. Detaylı bilgi için Gizlilik Politikası sayfasını
            inceleyebilirsiniz.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            5. İhlaller ve Yaptırımlar
          </h2>
          <p>
            Topluluk kurallarının ihlali halinde, Waylero içerikleri kaldırma,
            hesabı geçici veya kalıcı olarak kapatma hakkını saklı tutar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            6. Hizmet Değişiklikleri
          </h2>
          <p>
            Waylero, hizmetlerinde ve kullanım koşullarında dilediği zaman
            değişiklik yapma hakkını saklı tutar.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">7. Yetkili Mahkeme</h2>
          <p>
            İşbu sözleşmeden doğabilecek uyuşmazlıklarda Türkiye Cumhuriyeti
            hukuku uygulanır ve İstanbul Mahkemeleri yetkilidir.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">8. İletişim</h2>
          <p>
            Her türlü soru ve talepleriniz için bizimle iletişime geçebilirsiniz:
          </p>
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
      </section>
    </main>
  );
}
