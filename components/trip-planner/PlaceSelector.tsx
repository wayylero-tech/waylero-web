//Adım 2'deki mekan listesini, Cloudinary görsellerini ve seçim kutucuklarını barındıran yer.
"use client";

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

interface PlaceSelectorProps {
  lang: "tr" | "en";
  t: any;
  filteredPlaces: Place[];
  selectedPlaces: Place[];
  togglePlace: (place: Place) => void;
  handleGenerate: () => void;
  isGenerating: boolean;
  cloudinaryBase: string;
}

export default function PlaceSelector({
  lang,
  t,
  filteredPlaces,
  selectedPlaces,
  togglePlace,
  handleGenerate,
  isGenerating,
  cloudinaryBase,
}: PlaceSelectorProps) {
  return (
    <div className="flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="text-2xl font-serif font-bold text-gray-900 uppercase">
            {t.stopsTitle}
          </h3>
          <p className="text-xs text-gray-400 font-medium">{t.stopsSub}</p>
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
              className={`group p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                isSelected
                  ? "border-[#1e445e] bg-blue-50/30 shadow-inner"
                  : "border-gray-50 bg-gray-50/50 hover:border-orange-200"
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl overflow-hidden flex items-center justify-center transition-all ${
                    isSelected ? "ring-2 ring-[#1e445e] scale-110" : "shadow-sm"
                  }`}
                >
                  {place.image ? (
                    <img
                      src={`${cloudinaryBase}${place.image}`}
                      alt={lang === "tr" ? place.name_tr : place.name_en}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${
                        isSelected ? "bg-[#1e445e] text-white" : "bg-white text-gray-300"
                      }`}
                    >
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

              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected ? "bg-green-500 border-green-500" : "border-gray-200"
                }`}
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
  );
}