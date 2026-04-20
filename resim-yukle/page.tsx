"use client";

import { useState } from "react";

export default function ResimYuklePage() {
  const [urlInput, setUrlInput] = useState("");
  const [cityName, setCityName] = useState("konya");
  const [placeName, setPlaceName] = useState("");
  const [loading, setLoading] = useState(false);

  const format = (text: string) =>
    text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

  const handleUpload = async () => {
    if (!urlInput || !placeName) {
      alert("Boş bırakma kanka");
      return;
    }

    setLoading(true);

    try {
      const city = format(cityName);
      const place = format(placeName);

      const res = await fetch(urlInput);
      const blob = await res.blob();

      const formData = new FormData();
      formData.append("file", blob);
      formData.append("upload_preset", "YOUR_UPLOAD_PRESET"); // 🔴 BURAYI DEĞİŞTİR
      formData.append("folder", `places/${city}/${place}`);

      const cloudRes = await fetch(
        "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload", // 🔴 BURAYI DEĞİŞTİR
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await cloudRes.json();

      console.log("✅ UPLOAD OK:", data.secure_url);
      alert("Yüklendi ✅");

      setUrlInput("");
      setPlaceName("");
    } catch (err) {
      console.log(err);
      alert("Hata oldu kanka");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-2xl w-[400px] space-y-4">

        <h1 className="text-xl font-bold">
          Cloudinary Resim Yükle ☁️
        </h1>

        <input
          className="w-full p-3 bg-slate-700 rounded"
          placeholder="Şehir"
          value={cityName}
          onChange={(e) => setCityName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-slate-700 rounded"
          placeholder="Mekan"
          value={placeName}
          onChange={(e) => setPlaceName(e.target.value)}
        />

        <input
          className="w-full p-3 bg-slate-700 rounded"
          placeholder="Image URL"
          value={urlInput}
          onChange={(e) => setUrlInput(e.target.value)}
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full p-3 bg-emerald-600 rounded font-bold"
        >
          {loading ? "Yükleniyor..." : "Yükle"}
        </button>
      </div>
    </div>
  );
}