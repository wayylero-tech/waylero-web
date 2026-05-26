export default function SettingsView({
  role,
  authUsers,
  handleAddAuth,
  handleDeleteAuth,
  SUPER_ADMIN_EMAIL,
}: any) {
  return (
    <div className="animate-in slide-in-from-right duration-300 space-y-10">
      
      {/* DIŞ BAĞLANTILAR */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Kontrol Kulesi</h2>
        {/* 🚀 Grid yapısı 6 element için optimize edildi kanka */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"> 
          
          <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="bg-black border border-gray-800 p-4 rounded-2xl flex items-center justify-between hover:border-white transition">
            <span>Vercel</span> <span>↗</span>
          </a>

          <a href="https://dash.cloudflare.com/2208035be4df1e6f6c196fa24a04b221/home/overview" target="_blank" rel="noopener noreferrer" className="bg-orange-900/10 border border-orange-900/30 p-4 rounded-2xl flex items-center justify-between hover:border-orange-500 transition">
            <span className="text-orange-500">Cloudflare</span> <span>↗</span>
          </a>

          {/* ✨ Cloudinary Upload Presets Bağlantısı */}
          <a href="https://console.cloudinary.com/app/c-02ea77eee651bf6e22cbd14acfbf53/settings/upload/presets" target="_blank" rel="noopener noreferrer" className="bg-sky-900/10 border border-sky-900/30 p-4 rounded-2xl flex items-center justify-between hover:border-sky-400 transition">
            <span className="text-sky-400 font-medium">Cloudinary</span> <span>↗</span>
          </a>

          <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer" className="bg-yellow-900/10 border border-yellow-900/30 p-4 rounded-2xl flex items-center justify-between hover:border-yellow-500 transition">
            <span className="text-yellow-500">Firebase</span> <span>↗</span>
          </a>

          <a href="https://app.travelpayouts.com/dashboard?source=521133" target="_blank" rel="noopener noreferrer" className="bg-blue-900/10 border border-blue-900/30 p-4 rounded-2xl flex items-center justify-between hover:border-blue-500 transition">
            <span className="text-blue-400 font-medium">Travelpayouts</span> <span>↗</span>
          </a>

          {/* 🎯 YENİ: HeiGIT OpenRouteService API Key Yönetim Bağlantısı */}
          <a href="https://account.heigit.org/manage/key" target="_blank" rel="noopener noreferrer" className="bg-emerald-900/10 border border-emerald-900/30 p-4 rounded-2xl flex items-center justify-between hover:border-emerald-400 transition">
            <span className="text-emerald-400 font-medium">ORS Dashboard</span> <span>↗</span>
          </a>
        </div>
      </section>

      {/* YETKİ EKLEME */}
      <section className="bg-gray-950 border border-gray-800 p-6 rounded-3xl">
        <h3 className="text-lg font-bold mb-4">🔐 Yeni Yetkili Tanımla</h3>

        <div className="flex flex-col md:flex-row gap-3">
          <input
            id="newAdminEmail"
            type="email"
            placeholder="kanka@gmail.com"
            className="flex-1 bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 outline-none focus:border-blue-600 transition"
          />

          <select
            id="roleSelect"
            className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 cursor-pointer"
          >
            <option value="Editör">Editör</option>
            <option value="Yazar">Yazar</option>
            <option value="Admin">Admin</option>
          </select>

          <button
            onClick={handleAddAuth}
            className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl font-bold transition"
          >
            Yetki Ver
          </button>
        </div>
      </section>

      {/* YETKİLİ LİSTESİ */}
      <section className="space-y-3">
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          Aktif Yetkililer
        </h3>

        <div className="flex items-center justify-between p-4 bg-blue-900/10 border border-blue-600/30 rounded-2xl">
          <span className="text-sm font-medium">
            {SUPER_ADMIN_EMAIL} (Sen)
          </span>
          <span className="text-[10px] bg-blue-600 text-white px-3 py-1 rounded-full font-black uppercase">
            SÜPER ADMİN
          </span>
        </div>

        {authUsers.map((item: any) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-4 bg-gray-950 border border-gray-800 rounded-2xl group hover:border-gray-700"
          >
            <span className="text-sm">{item.email}</span>

            <div className="flex items-center gap-4">
              <span className="text-[10px] bg-gray-800 text-gray-400 px-3 py-1 rounded-full font-bold uppercase">
                {item.role}
              </span>

              {role === "Süper Admin" && (
                <button
                  onClick={() => handleDeleteAuth(item.id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition hover:scale-110"
                >
                  🗑️
                </button>
              )}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}