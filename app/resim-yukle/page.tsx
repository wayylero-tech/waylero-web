"use client";
import { useState } from "react";
import { db } from "../../lib/firebase"; 
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export default function FinalCloudinaryUploader() {
  const [jsonData, setJsonData] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]); // Linkleri burada biriktireceğiz
  const [loading, setLoading] = useState(false);

  const CLOUD_NAME = "dewd42ppf";
  const UPLOAD_PRESET = "waylero"; 

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
        canvas.toBlob((result) => resolve(result || blob), "image/jpeg", 0.8);
      };
    });
  };

  const formatNameCustom = (text: string) => {
    return text
      .trim()
      .toLocaleLowerCase('tr-TR')
      .replace(/\s+/g, '-')
      .replace(/[^\wğüşıöçĞÜŞİÖÇ\-]/gu, '');
  };

  const startBulkUpload = async () => {
    if (!jsonData) return alert("JSON yapıştır kanka!");
    setLoading(true);
    setStatus(["🚀 İşlem başlatıldı..."]);
    setUploadedPaths([]); // Yeni yükleme öncesi listeyi temizle

    try {
      const data = JSON.parse(jsonData);
      const tempPaths: string[] = [];
      
      for (const regionKey in data) {
        const regionSlug = formatNameCustom(regionKey);

        for (const cityKey in data[regionKey]) {
          const citySlug = formatNameCustom(cityKey);

          for (const placeKey in data[regionKey][cityKey]) {
            const links = data[regionKey][cityKey][placeKey];
            const placeSlug = formatNameCustom(placeKey);

            for (const link of links) {
              try {
                const res = await fetch(link);
                const originalBlob = await res.blob();
                const compressedBlob = await compressImage(originalBlob);

                const folderPath = `places/${regionSlug}/${citySlug}/${placeSlug}`;
                const fileName = `${placeSlug}_${Date.now()}`;

                const formData = new FormData();
                formData.append("file", compressedBlob);
                formData.append("upload_preset", UPLOAD_PRESET);
                formData.append("folder", folderPath);
                formData.append("public_id", fileName);

                const cloudRes = await fetch(
                  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
                  { method: "POST", body: formData }
                );
                
                const cloudData = await cloudRes.json();
                if (cloudData.error) throw new Error(cloudData.error.message);

                const finalPath = cloudData.public_id;
                tempPaths.push(finalPath); // Listeye ekle

                const docRef = doc(db, "city", citySlug, "places", placeSlug);
                await setDoc(docRef, {
                  imageUrls: arrayUnion(finalPath), 
                  region: regionSlug,
                  updatedAt: new Date(),
                  name: placeKey
                }, { merge: true });

                setStatus(prev => [...prev, `✅ Bitti: ${finalPath}`]);
                setUploadedPaths([...tempPaths]); // State'i güncelle

              } catch (err: any) {
                setStatus(prev => [...prev, `❌ HATA: ${placeSlug} -> ${err.message}`]);
              }
            }
          }
        }
      }
      setStatus(prev => [...prev, "✨ TÜMÜ TAMAMLANDI!"]);
    } catch (e) {
      alert("JSON hatası!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-slate-700 pb-6">
          <h1 className="text-3xl font-black text-blue-400 italic">POWEROAD UPLOADER v3.5</h1>
          {uploadedPaths.length > 0 && (
            <div className="bg-emerald-500 text-white px-4 py-1 rounded-full text-xs font-bold animate-pulse">
              {uploadedPaths.length} DOSYA HAZIR
            </div>
          )}
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* SOL TARAF: INPUT VE STATUS */}
          <div className="space-y-6">
            <textarea 
              value={jsonData}
              onChange={(e) => setJsonData(e.target.value)}
              placeholder='JSON Yapısı: {"turkey": {"antalya": {"kas": ["url"]}}}'
              className="w-full h-80 p-5 bg-slate-800 rounded-2xl border border-slate-700 font-mono text-sm text-blue-100 outline-none focus:border-blue-500"
            />

            <button 
              onClick={startBulkUpload}
              disabled={loading}
              className={`w-full p-6 rounded-2xl font-black text-xl transition-all shadow-xl ${
                loading ? 'bg-slate-700' : 'bg-blue-600 hover:bg-blue-500'
              }`}
            >
              {loading ? "BULUTA UÇUYOR..." : "YÜKLEMEYİ BAŞLAT 🚀"}
            </button>

            <div className="bg-black/40 p-4 rounded-2xl h-48 overflow-y-auto border border-slate-800 text-[10px] font-mono">
              {status.map((s, i) => (
                <div key={i} className="mb-1">{s}</div>
              ))}
            </div>
          </div>

          {/* SAĞ TARAF: ÇIKTI LİSTESİ (KOPYALAMAK İÇİN) */}
          <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 flex flex-col h-[600px]">
            <h2 className="text-emerald-400 font-bold mb-4 flex justify-between items-center">
              <span>ALINACAK PATH LİSTESİ</span>
              <span className="text-[10px] text-slate-500 font-normal italic underline cursor-pointer" onClick={() => {
                navigator.clipboard.writeText(uploadedPaths.join('\n'));
                alert("Tüm yollar kopyalandı!");
              }}>Hepsini Kopyala</span>
            </h2>
            
            <div className="bg-slate-900 rounded-xl p-4 flex-grow overflow-y-auto font-mono text-[11px] border border-slate-950 shadow-inner text-emerald-100/70 select-all">
              {uploadedPaths.length > 0 ? (
                uploadedPaths.map((path, index) => (
                  <div key={index} className="mb-2 pb-2 border-b border-white/5 hover:text-white transition-colors">
                    "{path}"
                  </div>
                ))
              ) : (
                <div className="text-slate-600 italic flex items-center justify-center h-full">
                  Yükleme tamamlandığında yollar burada listelenecek kanka...
                </div>
              )}
            </div>
            
            <p className="mt-4 text-[10px] text-slate-500 leading-relaxed">
              * Bu yolları direkt <strong>explore-meta.json</strong> dosyasındaki <strong>coverPath</strong> alanına yapıştırabilirsin.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}