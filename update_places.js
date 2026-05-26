const fs = require("fs");
const path = require("path");

const globalPlaces = JSON.parse(
  fs.readFileSync("./data/globalPlaces.json", "utf8")
);

const imagesDir = "./data/ulkedataimages";

const clean = (str) =>
  String(str || "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

const updatedPlaces = globalPlaces.map((place) => {
  let image = null;

  try {
    // ülke dosyası
    const countryFile = path.join(
      imagesDir,
      `${place.country.toLowerCase()}.json`
    );

    if (!fs.existsSync(countryFile)) {
      console.log(`❌ Ülke dosyası yok: ${countryFile}`);
      return { ...place, image: null };
    }

    const countryData = JSON.parse(
      fs.readFileSync(countryFile, "utf8")
    );

    // şehir bul
    const cityKey = Object.keys(countryData).find(
      (k) => clean(k) === clean(place.city)
    );

    if (!cityKey) {
      console.log(
        `❌ Şehir bulunamadı: ${place.city}`
      );
      return { ...place, image: null };
    }

    const cityData = countryData[cityKey];

    // slug ara
    const slugKey = Object.keys(cityData).find((k) =>
      clean(k).includes(clean(place.slug))
    );

    if (!slugKey) {
      console.log(
        `❌ Slug bulunamadı: ${place.slug}`
      );
      return { ...place, image: null };
    }

    // ilk görseli al
    const images = cityData[slugKey];

    if (Array.isArray(images) && images.length > 0) {
      image = images[0];

      console.log(
        `✅ ${place.slug} -> ${image}`
      );
    }
  } catch (err) {
    console.log(
      `❌ Hata: ${place.slug}`,
      err.message
    );
  }

  return {
    ...place,
    image,
  };
});

fs.writeFileSync(
  "./data/globalPlacesWithImages.json",
  JSON.stringify(updatedPlaces, null, 2),
  "utf8"
);

console.log("✅ Tamamlandı");