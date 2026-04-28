"use client";

import { useState, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import { useReactToPrint } from "react-to-print";
import globalPlacesData from "@/app/data/globalPlaces.json";

const Map = dynamic(() => import("@/components/Map"), { ssr: false });

interface Place {
  country: string;
  city: string;
  slug: string;
  name_tr: string;
  name_en: string;
  lat: number;
  lng: number;
}

// 🌍 Dil Sözlüğü
const translations = {
  tr: {
    heroTitle: "Senin Rotan",
    heroSub: "Kişiselleştirilmiş Gezi Planı",
    steps: ["Destinasyon", "Mekanlar", "Program"],
    changeCity: "Şehir Değiştir",
    otherCities: "Diğer Şehirler",
    selectCountry: "Ülke Seç",
    selectCity: "Şehir Seç",
    back: "← Geri",
    mapTitle: "Şehri Haritada Keşfet",
    stopsTitle: "Durakları Belirle",
    stopsSub: "Gitmek istediğin yerlerin üzerine tıkla kanka.",
    selectedCount: "YER SEÇİLDİ",
    alertSelection: "Kanka en az bir yer seçmelisin!",
    generating: "🌀 HESAPLANIYOR...",
    continue: "PLANLAMAYA DEVAM ET →",
    yourRoute: "Senin Rotan",
    share: "PAYLAŞ 🔗",
    print: "YAZDIR 🖨️",
    stop: "Durak",
    newRoute: "↺ YENİ ROTA OLUŞTUR",
    copySuccess: "Link kopyalandı kanka!",
    shareTitle: "Waylero Gezi Rotası",
    shareText: "Harika bir gezi rotası oluşturdum, göz at!",
    devAlert: "Geliştirme Aşamasında",
    devMessage: "Bu araç şu an beta aşamasındadır. Yakında yapay zeka ile tam rota optimizasyonu ve yeni şehirler eklenecek!",
    devButton: "ANLAYIŞINIZ İÇİN TEŞEKKÜR EDERİZ",
  },
  en: {
    heroTitle: "Your Itinerary",
    heroSub: "Personalized Travel Plan",
    steps: ["Destination", "Places", "Program"],
    changeCity: "Change City",
    otherCities: "Other Cities",
    selectCountry: "Select Country",
    selectCity: "Select City",
    back: "← Back",
    mapTitle: "Explore City on Map",
    stopsTitle: "Identify Stops",
    stopsSub: "Click on the places you want to visit, buddy.",
    selectedCount: "PLACES SELECTED",
    alertSelection: "Buddy, you must select at least one place!",
    generating: "🌀 CALCULATING...",
    continue: "CONTINUE PLANNING →",
    yourRoute: "Your Route",
    share: "SHARE 🔗",
    print: "PRINT 🖨️",
    stop: "Stop",
    newRoute: "↺ CREATE NEW ROUTE",
    copySuccess: "Link copied!",
    shareTitle: "Waylero Travel Route",
    shareText: "I created an amazing travel route, check it out!",
    devAlert: "Under Development",
    devMessage: "This tool is currently in beta. Full AI route optimization and more cities are coming soon!",
    
    devButton: "THANK YOU FOR YOUR UNDERSTANDING",
  }
};

export default function TripPlannerClient({ lang = "tr" }: { lang?: string }) {
  const t = translations[lang === "en" ? "en" : "tr"];
  
  const [activeStep, setActiveStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState("İstanbul");
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  const handleNewRoute = () => {
    setItinerary([]);
    setSelectedPlaces([]);
    setActiveStep(1);
  };

  const handleShare = async () => {
    const shareData = {
      title: t.shareTitle,
      text: t.shareText,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert(t.copySuccess);
      }
    } catch (err) {
      console.error("Paylaşım başarısız", err);
    }
  };

  const steps = [
    { id: 1, label: t.steps[0], icon: "📍" },
    { id: 2, label: t.steps[1], icon: "🚩" },
    { id: 3, label: t.steps[2], icon: "📅" },
  ];

  const cities = [
    { id: "istanbul", name: "İstanbul", icon: "🕌" },
    { id: "nevsehir", name: "Nevşehir", icon: "🎈" },
    { id: "antalya", name: "Antalya", icon: "🎡" },
    { id: "paris", name: "Paris", icon: "🗼" },
    { id: "roma", name: "Roma", icon: "🏛️" },
  ];

  const countries = useMemo(() => {
    const data = globalPlacesData as Place[];
    return [...new Set(data.map((p) => p.country))];
  }, []);

  const citiesByCountry = useMemo(() => {
    if (!selectedCountry) return [];
    const data = globalPlacesData as Place[];
    return [...new Set(data.filter((p) => p.country === selectedCountry).map((p) => p.city))];
  }, [selectedCountry]);

  const filteredPlaces = useMemo(() => {
    const data = (Array.isArray(globalPlacesData) ? globalPlacesData : []) as Place[];
    return data.filter((p) => p.city.toLowerCase() === selectedCity.toLowerCase());
  }, [selectedCity]);

  const togglePlace = (place: Place) => {
    setSelectedPlaces((prev) => {
      const exists = prev.some((item) => item.slug === place.slug);
      if (exists) return prev.filter((item) => item.slug !== place.slug);
      return [...prev, place];
    });
  };

  const handleGenerate = () => {
    if (selectedPlaces.length === 0) {
      alert(t.alertSelection);
      return;
    }
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setItinerary(selectedPlaces);
      setActiveStep(3);
    }, 1200);
  };

  const [showBetaAlert, setShowBetaAlert] = useState(true);

  return (
    
    <main className="min-h-screen bg-[#fdfaf7] text-gray-900 pb-20">
      {/* 🚀 EKRANIN TAM ORTASINDA ÇIKAN BETA MODAL */}
{showBetaAlert && (
  <div className="fixed inset-0 z-[9999] flex items-center justify-center px-6">
    {/* Arkadaki Karartma Katmanı (Overlay) */}
    <div 
      className="absolute inset-0 bg-[#1e445e]/60 backdrop-blur-sm animate-in fade-in duration-300"
      onClick={() => setShowBetaAlert(false)} 
    />
    
    {/* Modal İçeriği */}
    <div className="relative bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl border border-orange-100 animate-in zoom-in-95 duration-300">
      
      {/* Kapatma Butonu */}
      <button 
        onClick={() => setShowBetaAlert(false)}
        className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="text-center">
        {/* İkon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-orange-50 rounded-full mb-6">
          <span className="text-4xl animate-bounce">🚀</span>
        </div>

        {/* Başlık ve Metin */}
        <h3 className="text-2xl font-serif font-bold text-[#1e445e] mb-3 uppercase">
          {t.devAlert}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-8">
          {t.devMessage}
        </p>

        {/* Buton */}
        <button 
  onClick={() => setShowBetaAlert(false)}
  className="w-full bg-[#1e445e] text-white py-4 rounded-2xl font-bold text-[11px] uppercase tracking-widest hover:bg-orange-500 transition-all shadow-xl active:scale-95"
>
  {t.devButton}
</button>

        {/* Alt Progress Detayı */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <span className="text-[10px] font-black text-orange-400 uppercase tracking-tight">Beta v0.1</span>
          <div className="w-12 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 w-2/3"></div>
          </div>
        </div>
      </div>

    </div>
  </div>
)}
      <section className="bg-[#1e445e] pt-16 pb-28 px-6">
        <div className="max-w-[1400px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">
            {activeStep === 3 ? t.heroTitle : `${selectedCity} ${lang === 'tr' ? 'Rotası' : 'Route'}`}
          </h1>
          <p className="text-blue-100/60 text-sm font-medium uppercase tracking-widest">{t.heroSub}</p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-6 -mt-10 relative z-30">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2 flex items-center justify-between overflow-x-auto no-scrollbar">
          {steps.map((step) => (
            <div key={step.id} className={`flex items-center gap-3 px-6 py-3 min-w-max rounded-xl ${activeStep === step.id ? "bg-gray-50" : ""}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${activeStep === step.id ? "bg-[#1e445e] text-white shadow-lg" : "bg-gray-100 text-gray-400"}`}>
                {step.icon}
              </div>
              <span className={`text-xs font-bold uppercase tracking-tighter ${activeStep === step.id ? "text-gray-900" : "text-gray-400"}`}>
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {(activeStep === 1 || activeStep === 2) && (
            <div className="lg:col-span-3 space-y-4">
              <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
                {!showAllCities ? (
                  <>
                    <h2 className="text-sm font-black text-gray-400 uppercase mb-6 tracking-widest">{t.changeCity}</h2>
                    <div className="grid grid-cols-1 gap-2">
                      {cities.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            setSelectedCity(c.name);
                            setSelectedPlaces([]);
                            setActiveStep(2);
                          }}
                          className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                            selectedCity === c.name
                              ? "bg-[#1e445e] border-[#1e445e] text-white shadow-md scale-[1.02]"
                              : "bg-white border-transparent text-gray-500 hover:bg-orange-50 hover:border-orange-100"
                          }`}
                        >
                          <span className="text-xl">{c.icon}</span>
                          <span className="text-xs font-bold">{c.name}</span>
                        </button>
                      ))}
                      <button
                        onClick={() => setShowAllCities(true)}
                        className="flex items-center gap-4 p-3 rounded-xl border-2 bg-white text-gray-500 hover:bg-blue-50 hover:border-blue-200"
                      >
                        <span className="text-xl">🌍</span>
                        <span className="text-xs font-bold">{t.otherCities}</span>
                      </button>
                    </div>
                  </>
                ) : !selectedCountry ? (
                  <>
                    <h2 className="text-sm font-black text-gray-400 uppercase mb-6">{t.selectCountry}</h2>
                    <div className="grid gap-2">
                      {countries.map((country) => (
                        <button
                          key={country}
                          onClick={() => setSelectedCountry(country)}
                          className="p-3 border rounded-xl text-xs font-bold hover:bg-orange-50"
                        >
                          {country.toUpperCase()}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setShowAllCities(false)} className="mt-4 text-xs text-gray-400">{t.back}</button>
                  </>
                ) : (
                  <>
                    <h2 className="text-sm font-black text-gray-400 uppercase mb-6">{t.selectCity}</h2>
                    <div className="grid gap-2">
                      {citiesByCountry.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setSelectedPlaces([]);
                            setActiveStep(2);
                            setShowAllCities(false);
                            setSelectedCountry(null);
                          }}
                          className="p-3 border rounded-xl text-xs font-bold hover:bg-blue-50"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setSelectedCountry(null)} className="mt-4 text-xs text-gray-400">{t.back}</button>
                  </>
                )}
              </div>
            </div>
          )}

          <div className={`${activeStep === 3 ? "lg:col-span-12" : "lg:col-span-9"} space-y-6 transition-all`}>
            {activeStep === 1 && (
              <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold mb-4 text-gray-500">{t.mapTitle}</h3>
                <div className="h-[500px] w-full rounded-2xl overflow-hidden">
                  <Map places={filteredPlaces} />
                </div>
              </div>
            )}

            {activeStep === 2 && (
              <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-gray-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                    <h3 className="text-2xl font-serif font-bold text-gray-900 uppercase">{t.stopsTitle}</h3>
                    <p className="text-xs text-gray-400 font-medium">{t.stopsSub}</p>
                  </div>
                  <div className="bg-orange-400 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg shadow-orange-200">
                    {selectedPlaces.length} {t.selectedCount}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {filteredPlaces.map((place: Place) => {
                    const isSelected = selectedPlaces.some((p) => p.slug === place.slug);
                    return (
                      <div key={place.slug} onClick={() => togglePlace(place)} className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${isSelected ? "border-[#1e445e] bg-blue-50/30 shadow-inner" : "border-gray-50 bg-gray-50/50 hover:border-orange-200"}`}>
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isSelected ? "bg-[#1e445e] text-white rotate-6 scale-110" : "bg-white text-gray-300 shadow-sm"}`}>📍</div>
                          <div>
                            <h4 className="font-bold text-sm text-gray-800 leading-none mb-1.5">
                              {lang === "tr" ? place.name_tr : place.name_en}
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold tracking-widest uppercase">
                              {lang === "tr" ? place.name_en : place.name_tr}
                            </p>
                          </div>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? "bg-green-500 border-green-500 scale-110" : "border-gray-200"}`}>
                          {isSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || selectedPlaces.length === 0}
                  className="w-full bg-[#1e445e] text-white py-4 rounded-2xl font-black hover:bg-orange-500 transition-all shadow-xl active:scale-95 disabled:opacity-30"
                >
                  {isGenerating ? t.generating : t.continue}
                </button>
              </div>
            )}

            {activeStep === 3 && (
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t.yourRoute}</h3>
                  <div className="flex gap-2">
                    <button onClick={handleShare} className="bg-gray-100 text-gray-600 px-6 py-3 rounded-2xl text-[11px] font-black hover:bg-gray-200 transition-all active:scale-95">{t.share}</button>
                    <button onClick={() => reactToPrintFn()} className="bg-blue-600 text-white px-6 py-3 rounded-2xl text-[11px] font-black hover:bg-blue-700 transition-all shadow-xl active:scale-95">{t.print}</button>
                  </div>
                </div>

                <div ref={contentRef} className="p-10 space-y-8">
                  <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <Map places={itinerary} />
                  </div>

                  {itinerary.map((item, index) => (
                    <div key={index} className="flex gap-8 items-start relative pb-8 last:pb-0 border-l-2 border-dashed border-gray-100 ml-6 pl-12">
                      <div className="absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-[#1e445e] border-4 border-white shadow-md z-10"></div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex-1 hover:shadow-xl hover:border-orange-100 transition-all">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest">
                            {t.stop} #{index + 1}
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900 text-xl tracking-tight">
                          {lang === "tr" ? item.name_tr : item.name_en}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-8 border-t border-gray-50 flex justify-center">
                  <button onClick={handleNewRoute} className="flex items-center gap-2 text-gray-400 hover:text-orange-500 font-black text-xs uppercase tracking-widest transition-all">
                    <span>↺</span> {t.newRoute}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}