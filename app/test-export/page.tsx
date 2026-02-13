"use client";
import { useState } from "react";
import { db } from "../../lib/firebase"; 
import { collection, getDocs } from "firebase/firestore";

export default function ExportPage() {
  const [cityName, setCityName] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 TÜRKÇE KARAKTERLERİ TEMİZLEYİP SLUG YAPAN FONKSİYON
  const slugify = (text: string) => {
    const trMap: any = {
      'ç': 'c', 'Ç': 'c', 'ğ': 'g', 'Ğ': 'g', 'ş': 's', 'Ş': 's',
      'ü': 'u', 'Ü': 'u', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'Ö': 'o'
    };
    return text.replace(/[çğşüıöÇĞŞÜİÖ]/g, (match) => trMap[match])
               .toLowerCase()
               .trim()
               .replace(/[^a-z0-9]/g, '-') // Harf ve rakam dışındakileri tire yap
               .replace(/-+/g, '-')       // Peş peşe tireleri teke indir
               .replace(/^-|-$/g, '');    // Başta ve sondaki tireleri sil
  };

  const exportManualCity = async () => {
    if (!cityName.trim()) {
      alert("Lütfen bir şehir ismi yaz kanka!");
      return;
    }

    setLoading(true);
    const imagesDB: any = {};
    const targetCityRaw = cityName.trim(); // Firestore'daki orijinal isim (örn: bursa)
    const targetCitySlug = slugify(targetCityRaw); // Temizlenmiş isim

    try {
      console.log(`🔎 Firestore taranıyor: city -> ${targetCityRaw} -> places`);
      const querySnapshot = await getDocs(collection(db, "city", targetCityRaw, "places"));
      
      if (querySnapshot.empty) {
        alert("Firestore'da bu isimle bir şehir bulunamadı!");
        setLoading(false);
        return;
      }

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.imageUrls && data.imageUrls.length > 0) {
          // 🔥 HEM ŞEHİR HEM DÖKÜMAN ID'Sİ TERTEMİZ OLUYOR
          const cleanDocId = slugify(doc.id);
          const uniqueKey = `${targetCitySlug}-${cleanDocId}`;
          
          imagesDB[uniqueKey] = data.imageUrls;
        }
      });

      console.log(`✅ ${targetCitySlug.toUpperCase()} İÇİN TERTEMİZ ÇIKTI:`);
      console.log(JSON.stringify(imagesDB, null, 2));
      
      alert(`İşlem Başarılı!\n"${targetCitySlug}" önekiyle veriler konsola döküldü.`);
    } catch (error) {
      console.error("Hata:", error);
      alert("Bir hata oluştu kanka, konsolu kontrol et.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-20 text-center bg-slate-950 min-h-screen flex items-center justify-center font-sans">
      <div className="bg-white p-10 rounded-[3rem] shadow-2xl w-full max-w-lg border-b-[12px] border-blue-600">
        <div className="mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🧹</span>
          </div>
          <h1 className="text-3xl font-black text-gray-800 tracking-tight">Karakter Süpürücü</h1>
          <p className="text-gray-400 font-medium mt-2">Türkçe karakterleri uçurur, slugları bağlar.</p>
        </div>
        
        <div className="space-y-4">
          <input 
            type="text"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            placeholder="Şehir adı (örn: bursa)"
            className="w-full p-5 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-gray-700 text-center text-xl"
          />

          <button 
            onClick={exportManualCity}
            disabled={loading}
            className={`w-full py-5 rounded-2xl font-black text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-3 ${
              loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-500 shadow-blue-200'
            }`}
          >
            {loading ? "SÜPÜRÜLÜYOR..." : "TEMİZ VERİLERİ PATLAT 🚀"}
          </button>
        </div>

        <div className="mt-8 p-6 bg-slate-50 rounded-3xl border border-dashed border-slate-200 text-left">
          <h3 className="text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Örnek Dönüşüm</h3>
          <div className="flex items-center gap-3 text-xs font-mono">
             <span className="text-red-400 strike line-through">Bursa-Cumalıkızık</span>
             <span className="text-slate-300">➜</span>
             <span className="text-emerald-500 font-bold">bursa-cumalikizik</span>
          </div>
        </div>
      </div>
    </div>
  );
}