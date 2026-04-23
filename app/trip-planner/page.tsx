"use client";

import { useState } from "react";

export default function TripPlannerPage() {
  const [city, setCity] = useState("");
  const [days, setDays] = useState(3);
  const [people, setPeople] = useState(1);

  return (
    <main className="min-h-screen bg-white">

      {/* HERO - aynı gradient sistem */}
      <section className="pt-20 pb-32 bg-[linear-gradient(110deg,#fdfaf7_50%,#e6f4f9_50%)]">
        <div className="container mx-auto px-6 text-center">

          <div className="inline-block px-4 py-1.5 bg-orange-50 text-orange-700 text-xs font-bold uppercase tracking-widest rounded-full mb-6 border border-orange-100">
            PLAN YOUR TRIP
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6">
            Gezi Planını Oluştur
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Gideceğin şehri seç, kaç gün kalacağını belirle ve sana özel seyahat planını oluştur.
          </p>
        </div>
      </section>

      {/* FORM SECTION */}
<section className="container mx-auto px-6 -mt-16 pb-24 relative">

  {/* BLUR OVERLAY */}
  <div className="absolute inset-0 z-10 flex items-center justify-center">
    
    <div className="bg-white/80 backdrop-blur-xl border border-gray-100 shadow-xl rounded-[2.5rem] px-10 py-8 text-center max-w-md">
      
      <div className="text-4xl mb-4">🚧</div>

      <h3 className="text-xl font-black text-gray-900 mb-3">
        Bu bölüm hazırlanmaktadır
      </h3>

      <p className="text-gray-600 text-sm leading-relaxed">
        Size daha iyi bir seyahat planlama deneyimi sunabilmek için bu sayfa üzerinde çalışıyoruz.  
        Çok yakında aktif olacak.
      </p>

    </div>
  </div>

  {/* FORM (blur arkasında kalacak) */}
  <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 p-10 border border-gray-100 blur-[2px] pointer-events-none select-none">

    <h2 className="text-2xl font-serif font-bold text-gray-800 mb-8">
      Plan Detayları
    </h2>

    <div className="space-y-6">

      <div>
        <label className="text-sm font-bold text-gray-500">Şehir</label>
        <input className="w-full mt-2 p-4 border border-gray-200 rounded-2xl" />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-500">Kaç Gün</label>
        <input type="number" className="w-full mt-2 p-4 border border-gray-200 rounded-2xl" />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-500">Kaç Kişi</label>
        <input type="number" className="w-full mt-2 p-4 border border-gray-200 rounded-2xl" />
      </div>

      <button className="w-full bg-orange-500 text-white py-4 rounded-2xl font-bold">
        Plan Oluştur
      </button>

    </div>
  </div>

  {/* ALT BİLGİ */}
  <div className="mt-16 p-8 rounded-[2rem] bg-gray-50 border border-gray-100 text-center">
    <p className="text-gray-500 text-sm italic">
      Şu an sadece demo görünümündedir. Yakında aktif olacaktır.
    </p>
  </div>

</section>
    </main>
  );
}