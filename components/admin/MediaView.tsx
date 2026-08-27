"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

type PreviewFile = {
  id: string;
  file: File;
  preview: string;
  sizeMB: number;
  progress: number;
  status: string;
};

export default function MediaView({ user }: any) {
  const [status, setStatus] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // INPUTS
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");

  // FILES
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);

  const CLOUD_NAME = "dewd42ppf";
  const UPLOAD_PRESET = "waylero";

  // 🧠 SLUG FORMAT
  const formatNameCustom = (text: string) =>
    text
      .trim()
      .toLocaleLowerCase("tr-TR")
      .replace(/\s+/g, "-")
      .replace(/[^\wğüşıöçĞÜŞİÖÇ\-]/gu, "");

  // 🗜️ ULTRA OPTİMİZE RESİM SIKIŞTIRMA (Gelişmiş Çözünürlük + Kalite Dengesi)
  const compressImage = async (file: File, targetMB: number = 9.5): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);

      img.onload = async () => {
        URL.revokeObjectURL(objectUrl);

        let currentWidth = img.width;
        let currentHeight = img.height;
        let quality = 0.95; // Yüksek kaliteden başla

        // Tarayıcı WebP destekliyor mu kontrol et
        const mimeType = "image/webp"; 
        const fileExt = ".webp";

        const attemptCompression = (width: number, height: number, q: number): Promise<File> => {
          return new Promise((res, rej) => {
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext("2d");
            if (!ctx) return rej(new Error("Canvas context oluşturulamadı."));

            // Yumuşatılmış pürüzsüz ölçekleme ayarları
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = "high";
            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob(
              (blob) => {
                if (!blob) return rej(new Error("Blob oluşturulamadı."));

                const compressedFile = new File(
                  [blob],
                  file.name.replace(/\.[^/.]+$/, fileExt),
                  {
                    type: mimeType,
                    lastModified: Date.now(),
                  }
                );
                res(compressedFile);
              },
              mimeType,
              q
            );
          });
        };

        try {
          let currentFile = await attemptCompression(currentWidth, currentHeight, quality);

          // Dosya boyutu 9.5 MB altına inene kadar adımlarla döngüye gir
          while (currentFile.size / 1024 / 1024 > targetMB) {
            // Eğer kalite hala 0.65 üzerindeyse hassas %5 kalite düşür
            if (quality > 0.65) {
              quality -= 0.05;
            } else {
              // Kalite düşmesine rağmen hala büyükse boyutu %10 küçült
              currentWidth = Math.round(currentWidth * 0.9);
              currentHeight = Math.round(currentHeight * 0.9);
            }

            // Güvenlik sınırı: Çok aşırı küçük boyutlara düşmeyi engelle
            if (currentWidth < 1200 || currentHeight < 1200) {
              break;
            }

            currentFile = await attemptCompression(currentWidth, currentHeight, quality);
          }

          resolve(currentFile);
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = (err) => reject(err);
      img.src = objectUrl;
    });
  };

  // ☁️ CLOUDINARY + FIREBASE
  const uploadToCloudAndFirebase = async (
    fileBlob: Blob,
    regionSlug: string,
    citySlug: string,
    placeSlug: string,
    placeKey: string,
    fileId: string
  ) => {
    const folderPath = `places/${regionSlug}/${citySlug}/${placeSlug}`;
    const fileName = `${placeSlug}_${Date.now()}_${Math.random()}`;

    const formData = new FormData();
    formData.append("file", fileBlob);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folderPath);
    formData.append("public_id", fileName);

    updateProgress(fileId, 50);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    updateProgress(fileId, 80);

    const cloudData = await cloudRes.json();
    if (cloudData.error) {
      throw new Error(cloudData.error.message);
    }

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

    updateProgress(fileId, 100);
    return finalPath;
  };

  // 📊 UPDATE PROGRESS
  const updateProgress = (id: string, value: number) => {
    setSelectedFiles((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, progress: value } : item
      )
    );
  };

  // 📸 HANDLE FILE SELECT
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const previews: PreviewFile[] = files.map((file) => ({
      id: `${file.name}_${Date.now()}_${Math.random()}`,
      file,
      preview: URL.createObjectURL(file),
      sizeMB: file.size / 1024 / 1024,
      progress: 0,
      status: "Bekliyor",
    }));

    setSelectedFiles(previews);
  };

  // ✕ REMOVE FILE
  const handleRemoveFile = (id: string) => {
    setSelectedFiles((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target) {
        URL.revokeObjectURL(target.preview);
      }
      return prev.filter((item) => item.id !== id);
    });
  };

  // 🚀 MULTI UPLOAD
  const handleMultiUpload = async () => {
    if (!region || !city || !place || selectedFiles.length === 0) {
      return alert("Eksik bilgi var kanka!");
    }

    setLoading(true);
    setStatus(["📸 Çoklu upload başladı..."]);

    try {
      const regionSlug = formatNameCustom(region);
      const citySlug = formatNameCustom(city);
      const placeSlug = formatNameCustom(place);
      const temp: string[] = [...uploadedPaths];

      for (let i = 0; i < selectedFiles.length; i++) {
        let item = selectedFiles[i];

        if (item.status.includes("Yüklendi")) continue;

        let uploadFile = item.file;

        // 🛑 10 MB SIKIŞTIRMA KONTROLÜ
        if (item.sizeMB > 10) {
          try {
            setSelectedFiles((prev) =>
              prev.map((x) =>
                x.id === item.id
                  ? { ...x, status: "Akıllı Sıkıştırma... 🗜️", progress: 15 }
                  : x
              )
            );
            setStatus((p) => [
              ...p,
              `🗜️ ${item.file.name} (${item.sizeMB.toFixed(1)}MB) 10MB üstü. Kalite korunarak optimizasyon başlatıldı...`,
            ]);

            uploadFile = await compressImage(item.file, 9.5);
            const newSizeMB = uploadFile.size / 1024 / 1024;

            setSelectedFiles((prev) =>
              prev.map((x) =>
                x.id === item.id
                  ? {
                      ...x,
                      file: uploadFile,
                      sizeMB: newSizeMB,
                      status: "Optimize Edildi 👌",
                      progress: 30,
                    }
                  : x
              )
            );

            setStatus((p) => [
              ...p,
              `✨ Sıkıştırma Başarılı: ${item.file.name} ➔ ${newSizeMB.toFixed(2)} MB (${uploadFile.type})`,
            ]);
          } catch (compErr: any) {
            setSelectedFiles((prev) =>
              prev.map((x) =>
                x.id === item.id
                  ? { ...x, status: "Sıkıştırma Hatası ❌" }
                  : x
              )
            );
            setStatus((p) => [
              ...p,
              `❌ Sıkıştırma Başarısız (${item.file.name}): ${compErr.message}`,
            ]);
            continue;
          }
        }

        try {
          updateProgress(item.id, 35);
          const finalPath = await uploadToCloudAndFirebase(
            uploadFile,
            regionSlug,
            citySlug,
            placeSlug,
            place,
            item.id
          );

          temp.push(finalPath);
          setUploadedPaths([...temp]);
          setStatus((p) => [...p, `✅ Yüklendi: ${finalPath}`]);

          setSelectedFiles((prev) =>
            prev.map((x) =>
              x.id === item.id
                ? { ...x, status: "Yüklendi ✅", progress: 100 }
                : x
            )
          );
        } catch (fileErr: any) {
          setSelectedFiles((prev) =>
            prev.map((x) =>
              x.id === item.id ? { ...x, status: "Hata oluştu ❌" } : x
            )
          );
          setStatus((p) => [
            ...p,
            `❌ Hata (${item.file.name}): ${fileErr.message}`,
          ]);
        }
      }
      setStatus((p) => [...p, "✨ TÜM İŞLEMLER TAMAMLANDI"]);
    } catch (err: any) {
      setStatus((p) => [...p, `❌ Genel Hata: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 space-y-10">
      <div>
        <h1 className="text-3xl font-black">☁️ WAYLERO MEDIA PANEL</h1>
        <p className="text-slate-400 mt-2">
          Cloudinary + Firebase Upload ve Akıllı Görsel Optimizasyonu
        </p>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        <div className="grid md:grid-cols-3 gap-4">
          <input
            placeholder="Region (Örn: Turkey)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition"
          />
          <input
            placeholder="City (Örn: Çanakkale)"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition"
          />
          <input
            placeholder="Place (Örn: Adatepe Köyü)"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="bg-slate-800 p-4 rounded-xl border border-slate-700 focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {(region || city || place) && (
          <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl space-y-2">
            <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">
              📁 Sunucu Klasör Yapısı Önizlemesi
            </div>
            <div className="font-mono text-sm break-all flex flex-wrap items-center gap-1">
              <span className="text-slate-500">places /</span>
              <span className="text-amber-400 font-bold">
                {region ? formatNameCustom(region) : "[:region]"}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-cyan-400 font-bold">
                {city ? formatNameCustom(city) : "[:city]"}
              </span>
              <span className="text-slate-500">/</span>
              <span className="text-emerald-400 font-bold">
                {place ? formatNameCustom(place) : "[:place]"}
              </span>
            </div>
          </div>
        )}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm
          file:mr-4 file:py-3 file:px-6
          file:rounded-full file:border-0
          file:bg-emerald-600 file:text-white
          file:font-bold hover:file:bg-emerald-500"
        />

        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {selectedFiles.map((item) => (
              <div
                key={item.id}
                className="relative bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 group"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveFile(item.id)}
                  className="absolute top-2 right-2 z-10 w-6 h-6 flex items-center justify-center bg-rose-600 hover:bg-rose-500 active:scale-95 text-white font-bold rounded-full text-xs transition shadow-lg opacity-80 group-hover:opacity-100"
                  title="Listeden Kaldır"
                >
                  ✕
                </button>
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.preview}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs text-slate-300 truncate">
                      {item.file.name}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {item.sizeMB.toFixed(2)} MB
                    </p>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        item.status.includes("❌")
                          ? "bg-rose-500"
                          : "bg-emerald-500"
                      }`}
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.progress}%</span>
                    <span
                      className={
                        item.status.includes("❌")
                          ? "text-rose-400 font-bold"
                          : "text-emerald-400"
                      }
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleMultiUpload}
          disabled={loading || selectedFiles.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 py-4 rounded-2xl font-black text-lg transition"
        >
          {loading ? "İŞLENİYOR & YÜKLENİYOR..." : `🚀 YÜKLE (${selectedFiles.length})`}
        </button>
      </div>

      <div className="bg-black/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm text-slate-400 mb-4">📊 Upload Logları</h3>
        <div className="space-y-2 text-xs max-h-72 overflow-y-auto font-mono">
          {status.map((s, i) => (
            <div key={i}>{s}</div>
          ))}
        </div>
      </div>

      {uploadedPaths.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h3 className="font-bold mb-4 text-emerald-400">
            ☁️ Uploaded Public IDs
          </h3>
          <div className="space-y-2 text-xs">
            <div className="break-all text-slate-300 bg-black/40 p-4 rounded-xl font-mono">
              {uploadedPaths.map((p, i) => (
                <span key={i}>
                  "{p}"{i !== uploadedPaths.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}