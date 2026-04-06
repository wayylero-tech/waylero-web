// app/aktiviteler/ActivitiesClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

type Event = {
  id: string;
  name: string;
  image: string;
  date: string;
  venue: string;
  category: string;
  url: string;
};

type Props = {
  initialCity?: string;
};

export default function ActivitiesClient({ initialCity = '' }: Props) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCityName, setSelectedCityName] = useState('TÜRKİYE GENELİ');

  const searchParams = useSearchParams();
  const router = useRouter();

  const cityMap: { [key: string]: number } = {
    ADANA: 1,
    ADIYAMAN: 2,
    AFYON: 3,
    AFYONKARAHİSAR: 85,
    // ... diğer şehirler
    ZONGULDAK: 81,
  };

  const fetchEvents = async (citySlug: string = '') => {
    try {
      setLoading(true);
      const decodedSlug = decodeURIComponent(citySlug).trim();
      const seoSlug = decodedSlug.toLocaleLowerCase('tr-TR').replace(/\s+/g, '-');
      const cityNameFormatted = decodedSlug.replace(/-/g, ' ').toLocaleUpperCase('tr-TR').trim();

      if (citySlug && citySlug !== seoSlug) {
        router.replace(`/aktiviteler?city=${seoSlug}`, { scroll: false });
      }

      const cityId = cityMap[cityNameFormatted];
      setSelectedCityName(citySlug ? cityNameFormatted : 'TÜRKİYE GENELİ');

      const params = new URLSearchParams();
      if (cityId) {
        params.append('city_ids', cityId.toString());
      } else if (citySlug) {
        params.append('q', decodedSlug);
      }

      const res = await fetch(`/api/events?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();
      const rawItems = data.items || (Array.isArray(data) ? data : []);

      const formatted = rawItems.map((item: any) => ({
        id: item.id,
        name: item.name || item.adi,
        image:
          item.poster_url ||
          item.afis ||
          'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000',
        date: item.start_date || item.baslangic,
        venue: item.venue?.name || item.mekan?.ad || 'Mekan Belirtilmemiş',
        category: item.category?.name || 'Etkinlik',
        url: item.ticket_url || item.url,
      }));

      setEvents(formatted);
    } catch (err) {
      console.error('Waylero Filtreleme Hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const cityParamRaw = searchParams.get('city') || initialCity;
    fetchEvents(cityParamRaw);
  }, [searchParams.get('city')]);

  return (
    <main className="min-h-screen p-4 md:p-12 max-w-[1400px] mx-auto">
      <header className="flex flex-col items-center mb-20">
        <div className="inline-block px-4 py-1 border border-white/10 rounded-full mb-6 bg-white/5">
          <span className="text-[10px] font-bold tracking-[0.3em] text-yellow-500 uppercase">
            Live Experiences
          </span>
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-center mb-6">{selectedCityName}</h1>
        <p className="text-yellow-500 text-xs md:text-sm font-light tracking-[0.25em] uppercase text-center opacity-70">
          Waylero ile {selectedCityName.toLowerCase()}’deki konserleri ve etkinlikleri keşfet
        </p>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-black tracking-[0.3em] text-sm animate-pulse text-gray-500">
            WAYLERO YÜKLENİYOR
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {events.length > 0 ? (
            events.map((event) => (
              <div
                key={event.id}
                className="group relative bg-[#121212] rounded-[2.5rem] overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-500 hover:-translate-y-2 shadow-2xl flex flex-col"
              >
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-transparent to-transparent z-10 opacity-60"></div>
                  <img
                    src={event.image}
                    alt={event.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-6 left-6 z-20">
                    <span className="bg-black/60 backdrop-blur-md border border-white/10 px-4 py-1.5 rounded-full text-[9px] font-black tracking-widest uppercase text-yellow-500">
                      {event.category}
                    </span>
                  </div>
                  <div className="absolute bottom-6 left-6 z-20">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-white">{new Date(event.date).getDate()}</span>
                      <span className="text-xs font-bold text-gray-300 uppercase">
                        {new Date(event.date).toLocaleDateString('tr-TR', { month: 'short' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-8 pt-2 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold mb-3 line-clamp-2 min-h-[3.5rem] tracking-tight group-hover:text-yellow-400 transition-colors">
                    {event.name}
                  </h2>
                  <div className="flex items-center gap-2 text-gray-500 mb-8">
                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                    <span className="text-xs font-semibold italic truncate">{event.venue}</span>
                  </div>
                  <div className="mt-auto">
                    <a
                      href={event.url}
                      target="_blank"
                      className="inline-flex items-center justify-center w-full py-5 bg-white text-black rounded-2xl font-black text-xs tracking-[0.2em] uppercase hover:bg-yellow-400 transition-all active:scale-95"
                    >
                      BİLETİ AL →
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-32 rounded-[3rem] border border-dashed border-white/10">
              <p className="text-gray-600 font-bold tracking-widest uppercase">
                Bu şehirde sessizlik hakim...
              </p>
            </div>
          )}
        </div>
      )}
      <footer className="mt-16 text-center text-white text-sm md:text-base font-medium opacity-90">
        Etkinlik verileri{' '}
        <a
          href="https://etkinlik.io"
          className="text-yellow-500 underline transition-shadow duration-300 hover:shadow-[0_0_15px_rgba(255,221,0,0.8)]"
          target="_blank"
          rel="noopener noreferrer"
        >
          etkinlik.io
        </a>{' '}
        tarafından sağlanmaktadır.
      </footer>
    </main>
  );
}