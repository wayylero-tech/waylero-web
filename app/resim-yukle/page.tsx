"use client";
import { useState } from "react";
import { db, storage } from "../../lib/firebase"; 
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function BulkUploader() {
  const [jsonData, setJsonData] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // --- 1. RESİM SIKIŞTIRMA FONKSİYONU ---
  const compressImage = async (blob: Blob): Promise<Blob> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(blob);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        const MAX_WIDTH = 1280;
        if (width > MAX_WIDTH) {
          height = (MAX_WIDTH / width) * height;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob((result) => {
          resolve(result || blob);
        }, "image/jpeg", 0.8);
      };
    });
  };

  // 🔥 TAM ÖZGÜR FORMAT: Karakter yemez, ı harfini i yapmaz.
  const formatNameCustom = (text: string) => {
    return text
      .trim()
      // Küçük harf yapmak istersen sadece Türkçe uyumlu küçültür:
      .toLocaleLowerCase('tr-TR') 
      // Sadece boşlukları tire yapar
      .replace(/\s+/g, '-') 
      // Sadece klasör yapısını bozacak kritik karakterleri temizler (slash, nokta vs.)
      // Türkçe harfler (ğüşıöç) burada GÜVENDE.
      .replace(/[^\wğüşıöçĞÜŞİÖÇ\-]/gu, ''); 
  };

  const startBulkUpload = async () => {
    if (!jsonData) return alert("JSON verisini yapıştır kanka!");
    
    setLoading(true);
    setStatus(["🚀 İşlem başlatıldı..."]);

    try {
      const data = JSON.parse(jsonData);
      
      for (const cityKey in data) {
        const places = data[cityKey];
        const citySlug = formatNameCustom(cityKey);

        for (const placeKey in places) {
          const links = places[placeKey];
          const placeSlug = formatNameCustom(placeKey); 

          setStatus(prev => [...prev, `🔍 ${placeSlug} hazırlanıyor...`]);

          for (const link of links) {
            try {
              const res = await fetch(link);
              if (!res.ok) throw new Error("Linke ulaşılamadı");
              const originalBlob = await res.blob();

              setStatus(prev => [...prev, `⚡ Sıkıştırılıyor: ${placeSlug}`]);
              const compressedBlob = await compressImage(originalBlob);

              // 3. STORAGE YÜKLE: Türkçe karakterli yol (Örn: .../nallıhan-gökkuşağı-tepeleri/...)
              const storagePath = `place_photos/${citySlug}/${placeSlug}/${Date.now()}.jpg`;
              const sRef = ref(storage, storagePath);
              await uploadBytes(sRef, compressedBlob);
              const firebaseUrl = await getDownloadURL(sRef);

              // 4. FIRESTORE YAZ: Doküman ID'si de Türkçe karakterli
              const docRef = doc(db, "city", citySlug, "places", placeSlug);
              await setDoc(docRef, {
                imageUrls: arrayUnion(firebaseUrl),
                updatedAt: new Date(),
                name: placeKey // Orijinal ismi de içinde saklıyoruz
              }, { merge: true });

              setStatus(prev => [...prev, `✅ Başarılı: ${placeSlug}`]);
            } catch (err) {
              console.error(err);
              setStatus(prev => [...prev, `❌ HATA: ${placeSlug} (${link})`]);
            }
          }
        }
      }
      setStatus(prev => [...prev, "✨ TÜM İŞLEMLER TAMAMLANDI!"]);
    } catch (e) {
      alert("JSON formatı hatalı kanka!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white font-sans">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-black text-emerald-400 tracking-tighter">
            POWEROAD UPLOADER <span className="text-xs font-normal text-slate-500 italic">v2.2</span>
          </h1>
          <div className="bg-emerald-500/10 px-4 py-1 rounded-full border border-emerald-500/20 text-emerald-500 text-sm font-bold">
            🇹🇷 %100 Türkçe Harf Desteği
          </div>
        </header>
        
        <div className="grid grid-cols-1 gap-6">
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl">
            <label className="block text-sm font-bold text-slate-400 mb-3 ml-2 uppercase tracking-widest">
              JSON Verisini Buraya Bırak
            </label>
            <textarea 
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='{"ankara": {"nallıhan-gökkuşağı-tepeleri": ["link"]}}'
              className="w-full h-80 p-5 bg-slate-900 rounded-2xl border border-slate-700 outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 font-mono text-sm text-emerald-100 transition-all"
            />
          </div>

          <button 
            onClick={startBulkUpload}
            disabled={loading}
            className={`w-full p-6 rounded-2xl font-black text-xl transition-all active:scale-95 ${
              loading ? 'bg-slate-700 cursor-not-allowed text-slate-500' : 'bg-emerald-600 hover:bg-emerald-500 shadow-xl shadow-emerald-900/20'
            }`}
          >
            {loading ? "İŞLEM YAPILIYOR..." : "YÜKLEMEYİ BAŞLAT (TR KARAKTER KORUMALI) 🚀"}
          </button>

          <div className="bg-black/50 backdrop-blur-md p-6 rounded-3xl border border-slate-800 h-80 overflow-y-auto custom-scrollbar shadow-inner">
            <div className="space-y-2">
              {status.map((s, i) => (
                <div key={i} className={`text-xs font-mono p-2 rounded-lg border-l-2 ${
                  s.includes('✅') ? 'bg-emerald-500/5 border-emerald-500 text-emerald-200' : 
                  s.includes('❌') ? 'bg-red-500/5 border-red-500 text-red-200' : 'bg-slate-800/50 border-slate-600 text-slate-400'
                }`}>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}