//Bu bileşen sol taraftaki şehir listesini, ülke seçimini ve "Diğer Şehirler" mantığını tamamen izole edecek.
"use client";

interface CitySelectorProps {
  lang: "tr" | "en";
  t: any;
  cities: Array<{ id: string; name: string; icon: string }>;
  countries: string[];
  citiesByCountry: string[];
  selectedCity: string;
  selectedCountry: string | null;
  showAllCities: boolean;
  setShowAllCities: (val: boolean) => void;
  setSelectedCountry: (val: string | null) => void;
  handleCityChange: (cityName: string) => void;
}

export default function CitySelector({
  lang,
  t,
  cities,
  countries,
  citiesByCountry,
  selectedCity,
  selectedCountry,
  showAllCities,
  setShowAllCities,
  setSelectedCountry,
  handleCityChange,
}: CitySelectorProps) {
  return (
    <div className="bg-white rounded-[1.5rem] p-6 shadow-sm border border-gray-100">
      {!showAllCities ? (
        <>
          <h2 className="text-sm font-black text-gray-400 uppercase mb-6 tracking-widest">
            {t.changeCity}
          </h2>
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
          <h2 className="text-sm font-black text-gray-400 uppercase mb-6">
            {t.selectCountry}
          </h2>
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
          <button
            onClick={() => setShowAllCities(false)}
            className="mt-4 text-xs text-gray-400"
          >
            {t.back}
          </button>
        </>
      ) : (
        <>
          <h2 className="text-sm font-black text-gray-400 uppercase mb-6">
            {t.selectCity}
          </h2>
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
          <button
            onClick={() => setSelectedCountry(null)}
            className="mt-4 text-xs text-gray-400"
          >
            {t.back}
          </button>
        </>
      )}
    </div>
  );
}