"use client";

import { useState } from "react";

interface PreferenceModalProps {
  lang: "tr" | "en";
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (preferences: { wantsHotels: boolean; wantsTours: boolean; wantsEvents: boolean }) => void;
}

export default function PreferenceModal({ lang, isOpen, onClose, onSubmit }: PreferenceModalProps) {
  const [wantsHotels, setWantsHotels] = useState(true);
  const [wantsTours, setWantsTours] = useState(true);
  const [wantsEvents, setWantsEvents] = useState(true);

  if (!isOpen) return null;

  // 🌍 Yerel Dil Sözlüğü
  const m = {
    tr: {
      title: "Seyahat Tercihlerin Neler Kanka? 🚀",
      desc: "Rotanı yapay zeka ile canlandırmadan önce, planına neleri dahil etmek istersin? Seçimlerine göre en iyi deneyimi hazırlayacağız.",
      hotels: "Otel & Konaklama Önerileri",
      hotelsDesc: "Şehirdeki en popüler ve bütçene uygun otel rehber linkleri.",
      tours: "Rehberli Turlar & Deneyimler",
      toursDesc: "GetYourGuide turları ve kaçırılmaması gereken şehir aktiviteleri.",
      events: "Konser, Festival & Etkinlikler",
      eventsDesc: "Seyahat tarihlerindeki güncel canlı etkinlikleri haritaya ekle.",
      btn: "PLANIMI OLUŞTUR 🎯",
    },
    en: {
      title: "What Are Your Travel Preferences? 🚀",
      desc: "Before AI optimizes your route, what would you like to include? We will customize the best experience based on your choices.",
      hotels: "Hotel & Accommodation Suggestions",
      hotelsDesc: "Most popular and budget-friendly hotel guide links.",
      tours: "Guided Tours & Experiences",
      toursDesc: "GetYourGuide tours and must-do city activities.",
      events: "Concerts & Live Events",
      eventsDesc: "Add real-time events to your map dynamic steps.",
      btn: "GENERATE MY PLAN 🎯",
    },
  }[lang];

  const handleSubmit = () => {
    onSubmit({ wantsHotels, wantsTours, wantsEvents });
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[99999] px-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl border border-gray-100 flex flex-col gap-6 relative animate-in zoom-in-95 duration-200">
        
        {/* Kapatma Butonu */}
        <button 
          onClick={onClose} 
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 font-bold"
        >
          ✕
        </button>

        {/* Başlık ve Açıklama */}
        <div className="text-center sm:text-left">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2 leading-tight">
            {m.title}
          </h2>
          <p className="text-xs text-gray-500 leading-relaxed">
            {m.desc}
          </p>
        </div>

        <hr className="border-gray-100" />

        {/* Seçenek Listesi */}
        <div className="flex flex-col gap-4">
          
          {/* Otel Seçeneği */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${wantsHotels ? "border-[#1e445e] bg-blue-50/20" : "border-gray-100 bg-gray-50/50"}`}>
            <input 
              type="checkbox" 
              checked={wantsHotels} 
              onChange={(e) => setWantsHotels(e.target.checked)}
              className="mt-1 accent-[#1e445e] w-4 h-4"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-800">{m.hotels} 🏨</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{m.hotelsDesc}</p>
            </div>
          </label>

          {/* Tur Seçeneği */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${wantsTours ? "border-[#1e445e] bg-blue-50/20" : "border-gray-100 bg-gray-50/50"}`}>
            <input 
              type="checkbox" 
              checked={wantsTours} 
              onChange={(e) => setWantsTours(e.target.checked)}
              className="mt-1 accent-[#1e445e] w-4 h-4"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-800">{m.tours} 🗺️</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{m.toursDesc}</p>
            </div>
          </label>

          {/* Etkinlik Seçeneği */}
          <label className={`flex items-start gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${wantsEvents ? "border-[#1e445e] bg-blue-50/20" : "border-gray-100 bg-gray-50/50"}`}>
            <input 
              type="checkbox" 
              checked={wantsEvents} 
              onChange={(e) => setWantsEvents(e.target.checked)}
              className="mt-1 accent-[#1e445e] w-4 h-4"
            />
            <div>
              <h4 className="font-bold text-sm text-gray-800">{m.events} 🎸</h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{m.eventsDesc}</p>
            </div>
          </label>

        </div>

        {/* Onaylama Butonu */}
        <button
          onClick={handleSubmit}
          className="w-full bg-[#1e445e] text-white py-4 rounded-2xl font-black hover:bg-orange-500 transition-all shadow-lg shadow-blue-900/10"
        >
          {m.btn}
        </button>

      </div>
    </div>
  );
}