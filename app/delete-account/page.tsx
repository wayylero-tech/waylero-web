export const metadata = {
  title: "Waylero Hesap Silme",
};

export default function DeleteAccount() {
  return (
    <main style={{ maxWidth: 800, margin: "0 auto", padding: 20 }}>
      <h1>Waylero Hesap Silme</h1>

      <p>
        Waylero hesabınızı silmek için aşağıdaki yöntemlerden birini
        kullanabilirsiniz:
      </p>

      <h2>Uygulama Üzerinden</h2>
      <p>
        Profil → Ayarlar → Hesabı Sil adımlarını takip ederek hesabınızı
        kalıcı olarak silebilirsiniz.
      </p>

      <h2>E-posta ile Talep</h2>
      <p>
        Kayıtlı e-posta adresinizden 
        <strong> wayylero@gmail.com </strong>
        adresine hesap silme talebi gönderebilirsiniz.
      </p>

      <h2>Silinen Veriler</h2>
      <ul>
        <li>Profil bilgileri</li>
        <li>Paylaşılan fotoğraf ve videolar</li>
        <li>Mesajlaşma içerikleri</li>
        <li>Hesap bilgileri</li>
      </ul>

      <p>
        Yasal yükümlülükler kapsamında bazı teknik kayıtlar sınırlı süreyle
        saklanabilir.
      </p>
    </main>
  );
}
