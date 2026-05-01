"use client";
import { useState } from "react";
import { db } from "../../lib/firebase";
import { doc, setDoc, arrayUnion } from "firebase/firestore";

export default function MediaView({ user }: any) {
  const [jsonData, setJsonData] = useState("");
  const [status, setStatus] = useState<string[]>([]);
  const [uploadedPaths, setUploadedPaths] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 📌 SINGLE UPLOAD SELECTION
  const [region, setRegion] = useState("");
  const [city, setCity] = useState("");
  const [place, setPlace] = useState("");

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
    setStatus(["🚀 Başladı..."]);
    setUploadedPaths([]);

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

      setStatus((p) => [...p, "✨ BİTTİ"]);
    } catch {
      alert("JSON hatası");
    } finally {
      setLoading(false);
    }
  };

  // 📸 SINGLE UPLOAD (ARTIK MANUAL YOK)
  const handleSingleUpload = async (file: File) => {
    if (!region || !city || !place) {
      return alert("Region / City / Place seç kanka!");
    }

    setLoading(true);
    setStatus(["📸 Upload başladı..."]);

    try {
      const compressed = await compressImage(file);

      const finalPath = await uploadToCloudAndFirebase(
        compressed,
        formatNameCustom(region),
        formatNameCustom(city),
        formatNameCustom(place),
        place
      );

      setUploadedPaths((p) => [...p, finalPath]);
      setStatus((p) => [...p, `✅ Yüklendi: ${finalPath}`]);
    } catch (err: any) {
      setStatus((p) => [...p, `❌ ${err.message}`]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white space-y-10">

      {/* 📦 JSON UPLOAD */}
      <div className="bg-slate-800 p-6 rounded-xl space-y-4">
  <h2 className="text-xl font-bold text-blue-400">
    📦 BULK JSON UPLOAD
  </h2>

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

    {/* 📥 JSON INPUT */}
    <div>
      <textarea
        value={jsonData}
        onChange={(e) => setJsonData(e.target.value)}
        className="w-full h-80 bg-slate-900 p-4 rounded font-mono text-sm"
      />
    </div>

    {/* 📌 JSON EXAMPLE */}
    <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl text-xs text-slate-300">
      <p className="text-blue-400 font-bold mb-2">
        📌 JSON FORMAT ÖRNEĞİ
      </p>

      <pre className="whitespace-pre-wrap text-[11px] leading-relaxed text-emerald-200">
{`{
  "turkey": {
    "antalya": {
      "kas": [
        "https://site.com/image1.jpg",
        "https://site.com/image2.jpg"
      ]
    },
    "istanbul": {
      "kadikoy": [
        "https://site.com/image3.jpg"
      ]
    }
  }
}`}
      </pre>

      <p className="mt-2 text-slate-400">
        👉 Region → City → Place → Image URL listesi
      </p>
    </div>

  </div>

  {/* BUTTON */}
  <button
    onClick={startBulkUpload}
    disabled={loading}
    className="bg-blue-600 px-6 py-2 rounded"
  >
    YÜKLE
  </button>
</div>

      {/* 📸 SINGLE UPLOAD */}
      <div className="bg-slate-800 p-6 rounded-xl space-y-4">
        <h2 className="text-xl font-bold text-emerald-400">
          📸 TEK RESİM UPLOAD
        </h2>

        {/* 📍 SELECT AREA */}
        <div className="grid grid-cols-3 gap-2">
          <input
            placeholder="Region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="p-2 bg-slate-900 rounded"
          />
          <input
            placeholder="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="p-2 bg-slate-900 rounded"
          />
          <input
            placeholder="Place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="p-2 bg-slate-900 rounded"
          />
        </div>

        {/* 📸 FILE */}
        <input
          type="file"
          accept="image/*"
          className="block"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleSingleUpload(file);
          }}
        />
      </div>

      {/* 📊 STATUS */}
      <div className="bg-black/40 p-4 text-xs max-h-60 overflow-y-auto">
        {status.map((s, i) => (
          <div key={i}>{s}</div>
        ))}
      </div>
    </div>
  );
}