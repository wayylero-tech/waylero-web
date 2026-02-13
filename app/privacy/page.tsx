export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Gizlilik Politikası</h1>

      <p className="text-sm text-gray-500 mb-8">
        Yürürlük Tarihi: Waylero platformunu ilk kez kullandığınız tarih
      </p>

      <section className="space-y-6 text-gray-700 leading-relaxed">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Waylero – Veri Koruma ve Gizlilik Beyanı
          </h2>
          <p>
            Waylero olarak kullanıcılarımızın gizliliğine büyük önem veriyoruz.
            Bu Gizlilik Politikası; Waylero mobil uygulaması ve web sitesi
            üzerinden sunulan hizmetler kapsamında elde edilen kişisel
            verilerin, 6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) ve
            Avrupa Birliği Genel Veri Koruma Tüzüğü (GDPR) uyarınca nasıl
            işlendiğini açıklamaktadır.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">1. Veri Sorumlusu</h3>
          <p>
            KVKK kapsamında veri sorumlusu: <strong>Waylero</strong>
          </p>
          <p>
            İletişim:&nbsp;
            <a
              href="mailto:wayylero@gmail.com"
              className="text-blue-600 underline"
            >
              wayylero@gmail.com
            </a>
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            2. Toplanan Kişisel Veriler
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Ad, soyad ve e-posta adresi</li>
            <li>Kullanıcı tarafından paylaşılan fotoğraf ve videolar</li>
            <li>Cihaz bilgileri (işletim sistemi, cihaz modeli, IP adresi)</li>
            <li>Kullanıcılar arası mesajlaşma içerikleri</li>
            <li>Uygulama içi kullanım ve etkileşim verileri</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            3. Mesajlaşma ve Medya Güvenliği
          </h3>
          <p>
            Waylero üzerinde paylaşılan içerikler ve mesajlar, güvenli altyapılar
            kullanılarak korunur. Fotoğraf ve videolar Google Firebase Storage
            altyapısında saklanır ve yalnızca yetkili kullanıcılar tarafından
            erişilebilir.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            4. Verilerin İşlenme Amaçları
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Platform hizmetlerinin sunulması</li>
            <li>İçerik paylaşımı ve keşif özelliklerinin sağlanması</li>
            <li>Kullanıcı deneyiminin geliştirilmesi</li>
            <li>Teknik destek ve kullanıcı taleplerinin karşılanması</li>
            <li>Yasal yükümlülüklerin yerine getirilmesi</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">5. Veri Saklama Süresi</h3>
          <p>
            Kişisel veriler, işlenme amacının gerektirdiği süre boyunca saklanır.
            Kullanıcı hesabının silinmesi halinde, veriler geri döndürülemez
            şekilde silinir veya anonim hale getirilir.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            6. Verilerin Saklandığı Yer
          </h3>
          <p>
            Waylero kapsamında işlenen veriler, Google Firebase altyapısı
            kullanılarak Avrupa Birliği sınırları içerisinde bulunan veri
            merkezlerinde saklanmaktadır.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">7. Kullanıcı Hakları</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Kişisel verilere erişim talep etme</li>
            <li>Eksik veya hatalı verilerin düzeltilmesini isteme</li>
            <li>Verilerin silinmesini talep etme</li>
            <li>Veri işlemeye itiraz etme</li>
            <li>İlgili kuruma şikâyette bulunma</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">
            8. Politika Güncellemeleri
          </h3>
          <p>
            Waylero, işbu Gizlilik Politikası’nı mevzuat veya hizmet
            değişiklikleri doğrultusunda güncelleyebilir. Güncel metin her zaman
            bu sayfa üzerinden erişilebilir olacaktır.
          </p>
        </div>
      </section>
    </main>
  );
}
