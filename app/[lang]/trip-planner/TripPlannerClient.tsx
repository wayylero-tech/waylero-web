"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useReactToPrint } from "react-to-print";
import globalPlacesData from "@/data/globalPlaces.json";
import {
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  User,
} from "firebase/auth";

import { auth } from "@/lib/firebase";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";


const Map = dynamic(() => import("@/components/Map"), { ssr: false });

const CLOUDINARY_BASE = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/c_fill,w_120,h_120,q_auto,f_auto/`;

interface Place {
  country: string;
  city: string;
  slug: string;
  name_tr: string;
  name_en: string;
  lat: number;
  lng: number;
  image?: string;

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
    saveSuccess: "Planınız kaydedildi. Seyahat rotanıza artık her zaman erişebilirsiniz.",
     savedTitle: "🎉 Gezi başarıyla kaydedildi",
  savedDesc: "Bu gezi rotasını görmek istediğin kişilerle paylaşabilir ya da aşağıdaki linki kopyalayıp doğrudan iletebilirsin.",
  copy: "📋 Kopyala",
  close: "Kapat",
  loginSaveText:
  "Bu gezi rotasını Google hesabın ile kaydedebilir, istediğin zaman uygulamada tekrar görüntüleyebilirsin.",

saveTripText:
  "Bu rotayı hesabına kaydederek istediğin zaman uygulamada yeniden görüntüleyebilirsin.",

googleLogin:
  "GOOGLE İLE GİRİŞ YAP 🔐",

saveTrip:
  "ROTAYI KAYDET 💾",

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
      saveSuccess: "Your trip has been saved. You can access your route anytime.",
        savedTitle: "🎉 Trip saved successfully",
  savedDesc: "You can share this trip with anyone you want or copy the link below and send it directly.",
  copy: "📋 Copy",
  close: "Close",
  loginSaveText:
  "You can save this travel route with your Google account and view it anytime in the app.",

saveTripText:
  "Save this route to your account and access it anytime in the app.",

googleLogin:
  "SIGN IN WITH GOOGLE 🔐",

saveTrip:
  "SAVE ROUTE 💾",

  }
};

export default function TripPlannerClient({ lang = "tr" }: { lang: "tr" | "en" }) {
  const t = translations[lang];
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const cityFromUrl = searchParams.get("city");

  const [activeStep, setActiveStep] = useState(1);
  const [selectedCity, setSelectedCity] = useState(cityFromUrl || (lang === "tr" ? "İstanbul" : "Istanbul"));
  const [isGenerating, setIsGenerating] = useState(false);
  const [itinerary, setItinerary] = useState<Place[]>([]);
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [showAllCities, setShowAllCities] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [isMapFullscreen, setIsMapFullscreen] = useState(false);
  const contentRef = useRef(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
 const [savedUrl, setSavedUrl] = useState<string | null>(null);
 const [user, setUser] = useState<User | null>(null);
  const [isTripStarted, setIsTripStarted] = useState(false);
  const [travelMode, setTravelMode] = useState("driving");

  useEffect(() => {
    if (cityFromUrl) {
      setSelectedCity(cityFromUrl);
    }
  }, [cityFromUrl]);

  useEffect(() => {
    if (isMapFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMapFullscreen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMapFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, []);

  useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    console.log("AUTH STATE:", currentUser);
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    console.log("LOGIN RESULT:", result.user);

  } catch (err: any) {
    console.log(err);
  }
};

const handleSaveTrip = async () => {
  if (!user) {
    handleGoogleLogin();
    return;
  }

  try {
    const tripData = {
      userId: user.uid,
      city: selectedCity,
      places: selectedPlaces,
      travelMode,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "trips"), tripData);

    const url = `${window.location.origin}/trip/${docRef.id}`;

    setSavedUrl(url); // 👈 popup açmak için

    console.log("SHARE URL:", url);

  } catch (err) {
    console.error("Save error:", err);
  }
};

const handleCopy = async () => {
  if (!savedUrl) return;
  await navigator.clipboard.writeText(savedUrl);
  alert("Link kopyalandı");
};

const formatCity = (city: string) => {
  if (!city) return "";
  return city
    .toLocaleLowerCase("tr-TR")
    .split(" ")
    .map(w => w.charAt(0).toLocaleUpperCase("tr-TR") + w.slice(1))
    .join(" ");
};


  const handleCityChange = (cityName: string) => {
    setSelectedCity(cityName);
    setSelectedPlaces([]);
    setActiveStep(2);
    
    const params = new URLSearchParams(searchParams.toString());
   params.set("city", cityName.toLocaleLowerCase("tr-TR"));
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleNewRoute = () => {
    setItinerary([]);
    setSelectedPlaces([]);
    setActiveStep(1);
    setShowAllCities(false);
    
    router.push(window.location.pathname, { scroll: false });
  };

  const handleShareLink = async () => {
  if (!savedUrl) return;

  if (navigator.share) {
    await navigator.share({
      title: "Gezi Rotası",
      text: "Oluşturduğum gezi planı",
      url: savedUrl,
    });
  } else {
    await navigator.clipboard.writeText(savedUrl);
    alert("Link kopyalandı");
  }
};

  const steps = [
    { id: 1, label: t.steps[0], icon: "📍" },
    { id: 2, label: t.steps[1], icon: "🚩" },
    { id: 3, label: t.steps[2], icon: "📅" },
  ];

  const cities = useMemo(() => {
    return [
      { id: "istanbul", name: lang === "tr" ? "istanbul" : "Istanbul", icon: "🕌" },
      { id: "nevsehir", name: lang === "tr" ? "Nevsehir" : "Nevsehir", icon: "🎈" },
      { id: "antalya", name: "Antalya", icon: "🎡" },
      { id: "paris", name: "Paris", icon: "🗼" },
      { id: "roma", name: lang === "tr" ? "Roma" : "Rome", icon: "🏛️" },
    ];
  }, [lang]);

  
  const countries = useMemo(() => {
    const data = globalPlacesData as Place[];
    return [...new Set(data.map((p) => p.country))];
  }, []);

  const citiesByCountry = useMemo(() => {
    if (!selectedCountry) return [];
    const data = globalPlacesData as Place[];
    return [...new Set(data.filter((p) => p.country === selectedCountry).map((p) => p.city))];
  }, [selectedCountry]);

  // ✅ DÜZELTİLEN YER 1: Filtreleme Mantığı
  const filteredPlaces = useMemo(() => {
    const data = (globalPlacesData as Place[]) || [];
    return data.filter((p) => {
      const normalize = (str: string) => 
        str?.toLocaleLowerCase('tr-TR').replace(/i̇/g, 'i').replace(/ı/g, 'i').trim();
      
      return normalize(p.city) === normalize(selectedCity);
    });
  }, [selectedCity]);

  // ✅ DÜZELTİLEN YER 2: Seçim Mantığı
  const togglePlace = (place: Place) => {
    setSelectedPlaces((prev) => {
      const exists = prev.some((item) => item.slug === place.slug && item.name_tr === place.name_tr);
      if (exists) return prev.filter((item) => !(item.slug === place.slug && item.name_tr === place.name_tr));
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


  
  return (
    <main className="min-h-screen bg-[#fdfaf7] text-gray-900 pb-20">
      {/* 🚀 EKRANIN TAM ORTASINDA ÇIKAN BETA MODAL */}
      

      <section className="bg-[#1e445e] pt-16 pb-28 px-6">
        <div className="max-w-[1400px] mx-auto text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-2 leading-tight">
            {activeStep === 3 
  ? t.heroTitle 
  : `${formatCity(selectedCity)} ${lang === 'tr' ? 'Rotası' : 'Route'}`}
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
                          onClick={() => handleCityChange(c.name)}
                          className={`flex items-center gap-4 p-3 rounded-xl border-2 transition-all ${
                            selectedCity.toLowerCase() === c.name.toLowerCase()
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
                          onClick={() => handleCityChange(city)}
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
                  <Map places={selectedPlaces} />
                </div>
              </div>
            )}

           {activeStep === 2 && (
  <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-gray-100 flex flex-col gap-6">

    {/* 🔥 HARİTA ÜSTTE SABİT */}
    <div className="w-full">
      <h3 className="text-sm font-bold mb-3 text-gray-500">{t.mapTitle}</h3>

      <div className="h-[420px] w-full rounded-2xl overflow-hidden border">
        <Map
  places={selectedPlaces}
/>
      </div>
    </div>

    {/* 🔥 SEÇİM LİSTESİ ALTTA */}
    <div className="flex flex-col">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 uppercase">
            {t.stopsTitle}
          </h3>
          <p className="text-xs text-gray-400 font-medium">
            {t.stopsSub}
          </p>
        </div>

        <div className="bg-orange-400 text-white px-4 py-2 rounded-xl text-[10px] font-black shadow-lg">
          {selectedPlaces.length} {t.selectedCount}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 max-h-[400px] overflow-y-auto pr-2">
        {filteredPlaces.map((place: Place, index: number) => {
          const isSelected = selectedPlaces.some(
            (p) => p.slug === place.slug && p.name_tr === place.name_tr
          );

          return (
            <div
              key={`${place.slug}-${index}`}
              onClick={() => togglePlace(place)}
              className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between
              ${isSelected
                ? "border-[#1e445e] bg-blue-50/30 shadow-inner"
                : "border-gray-50 bg-gray-50/50 hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-4">
                
                <div className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center transition-all
                  ${isSelected ? "ring-2 ring-[#1e445e] scale-110" : "shadow-sm"}`}
                >
                  {place.image ? (
                    <img
                      src={`${CLOUDINARY_BASE}${place.image}`}
                      alt={lang === "tr" ? place.name_tr : place.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center
                      ${isSelected ? "bg-[#1e445e] text-white" : "bg-white text-gray-300"}`}>
                      📍
                    </div>
                  )}
                </div>

                <div>
                  <h4 className="font-bold text-sm text-gray-800">
                    {lang === "tr" ? place.name_tr : place.name_en}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase">
                    {lang === "tr" ? place.name_en : place.name_tr}
                  </p>
                </div>
              </div>

              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center
                ${isSelected ? "bg-green-500 border-green-500" : "border-gray-200"}`}
              >
                {isSelected && <span className="text-white text-[10px]">✓</span>}
              </div>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleGenerate}
        disabled={isGenerating || selectedPlaces.length === 0}
        className="w-full bg-[#1e445e] text-white py-4 rounded-2xl font-black hover:bg-orange-500 transition-all"
      >
        {isGenerating ? t.generating : t.continue}
      </button>

    </div>
  </div>
)}

            {activeStep === 3 && (
              <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-10">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em]">{t.yourRoute}</h3>
                <div className="flex flex-col items-end gap-2">

  {!user ? (
    <>
      <p className="text-[11px] text-gray-400 font-medium text-right max-w-[260px] leading-relaxed">
        {t.loginSaveText}
      </p>

      <button
        onClick={handleGoogleLogin}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black transition-all shadow-xl active:scale-95"
      >
        {t.googleLogin}
      </button>
    </>
  ) : (
    <>
      <p className="text-[11px] text-gray-400 font-medium text-right max-w-[260px] leading-relaxed">
        {t.saveTripText}
      </p>

      <button
        onClick={handleSaveTrip}
        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-2xl text-[11px] font-black transition-all shadow-xl active:scale-95"
      >
        {t.saveTrip}
      </button>
    </>
  )}


</div>
                </div>

                <div ref={contentRef} className="p-10 space-y-8">
                  <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-gray-100 z-0">
                    <Map 
                      key="normal-map" 
                      places={itinerary} 
                      onFullscreen={() => setIsMapFullscreen(true)} 
                      showControls={true} // BURA EKLENDİ
                    />
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

      {isMapFullscreen && (
        <div className="fixed inset-0 z-[99999] bg-black animate-in fade-in duration-200">
          <div className="w-full h-screen relative overflow-hidden">
            {/* 👇 İŞTE BURAYA showControls={true} EKLİYORUZ 👇 */}
            <Map 
              key="fullscreen-map" 
              places={itinerary} 
              showControls={true} 
            />
          </div>

          <button
            onClick={() => setIsMapFullscreen(false)}
            className="absolute bottom-6 right-6 z-[999999] bg-white text-black px-6 py-3.5 rounded-2xl font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-1 border border-gray-100 text-xs tracking-wider uppercase"
          >
            ✕ KAPAT
          </button>
        </div>
      )}
    {savedUrl && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] px-4">
    <div className="bg-white p-6 rounded-2xl w-full max-w-md space-y-5 shadow-2xl">

      {/* Başlık */}
      <h2 className="text-xl font-bold text-gray-900">
        {t.savedTitle}
      </h2>

      {/* Açıklama */}
      <p className="text-sm text-gray-500 leading-relaxed">
        {t.savedDesc}
      </p>

      {/* Link */}
      <div className="bg-gray-50 border rounded-xl p-3 break-all text-xs text-gray-700">
        {savedUrl}
      </div>

      {/* Butonlar */}
      <div className="flex gap-2">
        <button
          onClick={handleCopy}
          className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-blue-700 transition"
        >
          {t.copy}
        </button>

        <button
          onClick={handleShareLink}
          className="flex-1 bg-green-600 text-white py-2.5 rounded-xl font-semibold text-sm hover:bg-green-700 transition"
        >
          {t.share}
        </button>
      </div>

      {/* Kapat */}
      <button
        onClick={() => setSavedUrl(null)}
        className="w-full text-xs text-gray-400 hover:text-gray-600 transition"
      >
        {t.close}
      </button>

    </div>
  </div>
)}

  </main>

  );
} 