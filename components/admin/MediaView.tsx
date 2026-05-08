"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export default function MediaView({ user }: any) {
  const [jsonData, setJsonData] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 📌 SINGLE UPLOAD STATES
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Buton için dosyayı burada tutuyoruz

  const CLOUD_NAME = "dewd42ppf";
  const UPLOAD_PRESET = "waylero";

  // 🗜️ COMPRESS
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

  // 🔤 SLUG
  const formatNameCustom = (text: string) => {
    return text
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/\s+/g, "-")
      .replace(/[^\wğüşıöçĞÜŞİÖÇ\-]/gu, "");
  };

  // ☁️ CORE UPLOAD ENGINE
  const uploadToCloudAndFirebase = async (
    fileBlob: Blob,
    regionSlug: string,
    citySlug: string,
    placeSlug: string,
    placeKey: string
  ) => {
    const folderPath = `places/${regionSlug}/${citySlug}/${placeSlug}`;
    const fileName = `${placeSlug}_${Date.now()}`;

    const formData = new FormData();
    formData.append("file", fileBlob);
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
    const docRef = doc(db, "city", citySlug, "places", placeSlug);

    await setDoc(
      docRef,
      {
        imageUrls: arrayUnion(finalPath),
        region: regionSlug,
        updatedAt: new Date(),
        name: placeKey,
      },
      { merge: true }
    );

    return finalPath;
  };

  // 📦 JSON BULK UPLOAD
  const startBulkUpload = async () => {
    if (!jsonData) return alert("JSON yapıştır!");
    setLoading(true);
    setStatus(["🚀 Toplu yükleme başladı..."]);
    try {
      const data = JSON.parse(jsonData);
      const temp: string[] = [];
      for (const regionKey in data) {
        const regionSlug = formatNameCustom(regionKey);
        for (const cityKey in data[regionKey]) {
          const citySlug = formatNameCustom(cityKey);
          for (const placeKey in data[regionKey][cityKey]) {
            const placeSlug = formatNameCustom(placeKey);
            const links = data[regionKey][cityKey][placeKey];
            for (const link of links) {
              const res = await fetch(link);
              const blob = await res.blob();
              const compressed = await compressImage(blob);
              const finalPath = await uploadToCloudAndFirebase(
                compressed,
                regionSlug,
                citySlug,
                placeSlug,
                placeKey
              );
              temp.push(finalPath);
              setUploadedPaths([...temp]);
              setStatus((p) => [...p, `✅ ${finalPath}`]);
            }
          }
        }
      }
      setStatus((p) => [...p, "✨ TÜMÜ BİTTİ"]);
    } catch {
      alert("JSON formatı hatalı!");
    } finally {
      setLoading(false);
    }
  };

  // 📸 SINGLE UPLOAD
  const handleSingleUpload = async () => {
    if (!region || !city || !place || !selectedFile) {
      return alert("Eksik bilgi var kanka (Bölge, Şehir, Mekan veya Dosya)!");
    }

    setLoading(true);
    setStatus(["📸 Tekli yükleme başladı..."]);

    try {
      const compressed = await compressImage(selectedFile);
      const finalPath = await uploadToCloudAndFirebase(
        compressed,
        formatNameCustom(region),
        formatNameCustom(city),
        formatNameCustom(place),
        place
      );

      setUploadedPaths((p) => [...p, finalPath]);
      setStatus((p) => [...p, `✅ Yüklendi: ${finalPath}`]);
      setSelectedFile(null); // Yükleme bitince dosyayı temizle
    } catch (err: any) {
      setStatus((p) => [...p, `❌ Hata: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white space-y-10">
      
      {/* 📦 JSON UPLOAD SECTION */}
      <div className="bg-slate-800 p-6 rounded-xl space-y-4 shadow-xl">
        <h2 className="text-xl font-bold text-blue-400 flex items-center gap-2">
          <span>📦</span> BULK JSON UPLOAD
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <textarea
            value={jsonData}
            onChange={(e) => setJsonData(e.target.value)}
            placeholder="JSON verisini buraya yapıştır..."
            className="w-full h-80 bg-slate-900 p-4 rounded border border-slate-700 font-mono text-sm focus:border-blue-500 outline-none"
          />
          <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs text-slate-300">
            <p className="text-blue-400 font-bold mb-2">📌 JSON FORMAT ÖRNEĞİ</p>
            <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-emerald-200 bg-black/30 p-2 rounded">
{`{
  "turkey": {
    "antalya": {
      "kas": ["url1", "url2"]
    }
  }
}`}
            </pre>
            <p className="mt-4 text-slate-400 italic">👉 Region → City → Place → URL Array</p>
          </div>
        </div>
        <button
          onClick={startBulkUpload}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 px-10 py-3 rounded-lg font-bold transition-all"
        >
          {loading ? "İŞLENİYOR..." : "TOPLU YÜKLEMEYİ BAŞLAT"}
        </button>
      </div>

      {/* 📸 SINGLE UPLOAD SECTION */}
      <div className="bg-slate-800 p-6 rounded-xl space-y-4 shadow-xl border-l-4 border-emerald-500">
        <h2 className="text-xl font-bold text-emerald-400 flex items-center gap-2">
          <span>📸</span> TEK RESİM UPLOAD
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            placeholder="Region (Ege)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-3 bg-slate-900 rounded border border-slate-700 outline-none focus:border-emerald-500"
          />
          <input
            placeholder="City (Muğla)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-3 bg-slate-900 rounded border border-slate-700 outline-none focus:border-emerald-500"
          />
          <input
            placeholder="Place (Bodrum Antik Tiyatro)"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="p-3 bg-slate-900 rounded border border-slate-700 outline-none focus:border-emerald-500"
          />
        </div>
        <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 cursor-pointer"
          />
          <button
            onClick={handleSingleUpload}
            disabled={loading || !selectedFile}
            className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-600 px-10 py-3 rounded-lg font-bold transition-all"
          >
            {loading ? "YÜKLENİYOR..." : "RESMİ YÜKLE"}
          </button>
        </div>
      </div>

      {/* 📊 LOGS / STATUS */}
      <div className="bg-black/60 p-4 rounded-xl border border-slate-800">
        <h3 className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-widest">İşlem Günlüğü</h3>
        <div className="text-xs font-mono space-y-1 max-h-40 overflow-y-auto scrollbar-hide">
          {status.length === 0 && <span className="text-slate-600 italic">Henüz bir işlem yapılmadı...</span>}
          {status.map((s, i) => (
            <div key={i} className={`${s.includes('✅') ? 'text-emerald-400' : s.includes('❌') ? 'text-red-400' : 'text-blue-300'}`}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}