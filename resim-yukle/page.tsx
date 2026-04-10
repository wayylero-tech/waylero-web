"use client";
import { useState } from "react";
import { db, storage } from "../lib/firebase"; 
import { doc, setDoc, arrayUnion } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function TurkishCharacterUploader() {
  const [urlInput, setUrlInput] = useState("");
  const [cityName, setCityName] = useState("konya");
  const [placeName, setPlaceName] = useState(""); // Örn: "aygır-dibi-şelalesi" veya "Aygır Dibi Şelalesi"
  const [loading, setLoading] = useState(false);

  // SADECE BOŞLUKLARI DÜZENLER, TÜRKÇE HARFLERE DOKUNMAZ
  const formatName = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-'); // Sadece boşlukları tire yapar, harfler kalır
  };

  const handleUpload = async () => {
    if (!urlInput || !placeName) return alert("Bilgileri gir kanka!");

    setLoading(true);
    
    // Senin istediğin gibi: Türkçe karakterli isimler
    const cityFolder = formatName(cityName);   // konya
    const placeFolder = formatName(placeName); // aygır-dibi-şelalesi (Türkçe karakterli!)

    try {
      // 1. Resmi çek
      const res = await fetch(urlInput);
      const blob = await res.blob();

      // 2. STORAGE: /place_photos/konya/aygır-dibi-şelalesi/timestamp.jpg
      const storagePath = `place_photos/${cityFolder}/${placeFolder}/${Date.now()}.jpg`;
      const sRef = ref(storage, storagePath);
      await uploadBytes(sRef, blob);
      const firebaseUrl = await getDownloadURL(sRef);

      // 3. FIRESTORE: /city/konya/places/aygır-dibi-şelalesi
      const docRef = doc(db, "city", cityFolder, "places", placeFolder);
      
      await setDoc(docRef, {
        imageUrls: arrayUnion(firebaseUrl),
        name: placeName, // Orijinal tam isim
        updatedAt: new Date()
      }, { merge: true });

      alert(`"${placeFolder}" klasörüne başarıyla kaydedildi! ✅`);
      setUrlInput("");
    } catch (e) {
      console.error(e);
      alert("Bir hata oluştu kanka.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 bg-slate-900 min-h-screen text-white flex flex-col items-center">
      <div className="bg-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md border-b-4 border-emerald-500">
        <h1 className="text-xl font-black mb-6">Türkçe Karakterli Kaydedici 🇹🇷</h1>
        
        <div className="space-y-4">
          <input 
            placeholder="Şehir (konya)" 
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
            className="w-full p-4 bg-slate-700 rounded-xl outline-none focus:ring-2 ring-emerald-500" 
          />
          <input 
            placeholder="Mekan (aygır-dibi-şelalesi)" 
            value={placeName}
            onChange={(e) => setPlaceName(e.target.value)}
            className="w-full p-4 bg-slate-700 rounded-xl outline-none focus:ring-2 ring-emerald-500" 
          />
          <input 
            placeholder="Wikipedia Linki" 
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="w-full p-4 bg-slate-700 rounded-xl outline-none focus:ring-2 ring-emerald-500 text-xs" 
          />
          
          <button 
            onClick={handleUpload} 
            disabled={loading}
            className={`w-full p-5 rounded-xl font-bold transition-all ${
              loading ? 'bg-slate-600' : 'bg-emerald-600 hover:bg-emerald-500'
            }`}
          >
            {loading ? "YÜKLENİYOR..." : "TÜRKÇE KARAKTERLE KAYDET"}
          </button>
        </div>
      </div>
    </div>
  );
}