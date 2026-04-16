import { v2 as cloudinary } from "cloudinary";
import europa from "../app/data/images/europa.json" assert { type: "json" };

// istersen diğer jsonları da ekle:
// import europa from "...";
// import turkey from "...";

cloudinary.config({
  cloud_name: "dewd42ppf",
  api_key: "458144584976757",
  api_secret: "MxI16J2hVw4ClgC46ziusYescs8",
});

const uploadJSON = async (data, regionName) => {
  for (const city in data) {
    for (const place in data[city]) {
      const images = data[city][place];

      for (const url of images) {
        try {
          const res = await cloudinary.uploader.upload(url, {
            folder: `places/${regionName}/${city}/${place}`,
          });

          console.log("✅ yüklendi:", res.public_id);
        } catch (err) {
          console.log("❌ hata:", url);
        }
      }
    }
  }
};

const start = async () => {
 // await uploadJSON(asia, "asia");
  await uploadJSON(europa, "europa");
  //await uploadJSON(turkey, "turkey");

  console.log("🎉 HEPSİ BİTTİ");
};

start();