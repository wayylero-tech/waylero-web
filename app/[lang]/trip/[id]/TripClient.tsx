"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/Map"), {
  ssr: false,
});

export default function TripClient({ trip }: any) {
  return (
    <main className="min-h-screen bg-[#f8fafc] text-gray-900">

      {/* HERO */}
      <section className="relative">

        {/* MAP */}
        <div className="h-[420px] w-full overflow-hidden rounded-b-[32px]">
          <Map
            places={trip.places || []}
            showControls={true}
          />
        </div>

        {/* overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />

        {/* title */}
        <div className="absolute top-0 left-0 z-[1000] p-6 text-white">

          <h1 className="text-3xl md:text-4xl font-bold">
            📍 {trip.city} Rotası
          </h1>

          <p className="text-sm text-white/80 mt-1">
            {trip.places?.length || 0} durak
          </p>

        </div>

      </section>

      {/* LIST */}
      <section className="max-w-4xl mx-auto px-6 py-10 space-y-3">

        <div className="bg-white border rounded-2xl p-5">
          <h2 className="font-bold text-lg">
            Gezi Durakları
          </h2>

          <p className="text-xs text-gray-500 mt-1">
            {trip.city} şehrinde oluşturulan rota
          </p>
        </div>

        {trip.places?.map((p: any, i: number) => (
          <div
            key={p.slug + i}
            className="bg-white border rounded-2xl p-4 flex justify-between items-center hover:shadow-sm transition"
          >

            <div>
              <div className="font-semibold text-gray-900">
                {p.name_tr}
              </div>

              <div className="text-xs text-gray-400">
                {p.name_en}
              </div>
            </div>

            <div className="w-8 h-8 rounded-full bg-[#1e445e] text-white flex items-center justify-center text-xs font-bold">
              {i + 1}
            </div>

          </div>
        ))}

      </section>

    </main>
  );
}