"use client";

import { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

type PreviewFile = {
  file: File;
  preview: string;
  sizeMB: string;
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

  // ☁️ CLOUDINARY + FIREBASE
  const uploadToCloudAndFirebase = async (
    fileBlob: Blob,
    regionSlug: string,
    citySlug: string,
    placeSlug: string,
    placeKey: string,
    index: number
  ) => {
    const folderPath = `places/${regionSlug}/${citySlug}/${placeSlug}`;
    const fileName = `${placeSlug}_${Date.now()}_${Math.random()}`;

    const formData = new FormData();
    formData.append("file", fileBlob);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", folderPath);
    formData.append("public_id", fileName);

    // PROGRESS SIMULATION
    updateProgress(index, 15);

    const cloudRes = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    updateProgress(index, 70);

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

    updateProgress(index, 100);

    return finalPath;
  };

  // 📊 UPDATE PROGRESS
  const updateProgress = (index: number, value: number) => {
    setSelectedFiles((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              progress: value,
            }
          : item
      )
    );
  };

  // 📸 HANDLE FILE SELECT
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    const previews: PreviewFile[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      sizeMB: (file.size / 1024 / 1024).toFixed(2),
      progress: 0,
      status: "Bekliyor",
    }));

    setSelectedFiles(previews);
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

      const temp: string[] = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const item = selectedFiles[i];

        updateProgress(i, 10);

        const finalPath = await uploadToCloudAndFirebase(
          item.file,
          regionSlug,
          citySlug,
          placeSlug,
          place,
          i
        );

        temp.push(finalPath);
        setUploadedPaths([...temp]);
        setStatus((p) => [...p, `✅ ${finalPath}`]);

        setSelectedFiles((prev) =>
          prev.map((x, index) =>
            index === i
              ? {
                  ...x,
                  status: "Yüklendi ✅",
                  progress: 100,
                }
              : x
          )
        );
      }

      setStatus((p) => [...p, "✨ TÜM FOTOĞRAFLAR YÜKLENDİ"]);
    } catch (err: any) {
      setStatus((p) => [...p, `❌ Hata: ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-10 space-y-10">
      
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black">☁️ WAYLERO MEDIA PANEL</h1>
        <p className="text-slate-400 mt-2">
          Cloudinary + Firebase upload sistemi
        </p>
      </div>

      {/* UPLOAD BOX */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-6">
        
        {/* INPUTS */}
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

        {/* 🎯 CANLI SLUG VE KLASÖR ÖNİZLEME ALANI */}
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
            
            {place && (
              <div className="text-[11px] font-mono text-slate-400 pt-1 border-t border-slate-900">
                <span className="text-slate-500">Örnek Üretilecek Path: </span> 
                <span className="text-slate-300">
                  places/{formatNameCustom(region || "turkey")}/{formatNameCustom(city || "canakkale")}/{formatNameCustom(place)}
                </span>
              </div>
            )}
          </div>
        )}

        {/* FILE INPUT */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="block w-full text-sm
          file:mr-4
          file:py-3
          file:px-6
          file:rounded-full
          file:border-0
          file:bg-emerald-600
          file:text-white
          file:font-bold
          hover:file:bg-emerald-500"
        />

        {/* PREVIEW GRID */}
        {selectedFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-5">
            {selectedFiles.map((item, index) => (
              <div
                key={index}
                className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700"
              >
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
                      {item.sizeMB} MB
                    </p>
                  </div>

                  {/* PROGRESS */}
                  <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{
                        width: `${item.progress}%`,
                      }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">{item.progress}%</span>
                    <span className="text-emerald-400">{item.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BUTTON */}
        <button
          onClick={handleMultiUpload}
          disabled={loading || selectedFiles.length === 0}
          className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 py-4 rounded-2xl font-black text-lg transition"
        >
          {loading ? "YÜKLENİYOR..." : `🚀 YÜKLE (${selectedFiles.length})`}
        </button>
      </div>

      {/* LOG PANEL */}
      <div className="bg-black/50 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-sm text-slate-400 mb-4">📊 Upload Logları</h3>
        <div className="space-y-2 text-xs max-h-72 overflow-y-auto">
          {status.map((s, i) => (
            <div key={i}>{s}</div>
          ))}
        </div>
      </div>

      {/* PATHS */}
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