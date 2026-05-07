"use client";

import { auth } from "@/lib/firebase";

export default function AdminSidebar({
  user,
  role,
  activeView,
  setActiveView,
}: any) {

  // 🔥 ROLE CLEAN FIX (EN ÖNEMLİ KISIM)
  const cleanRole = (role || "").trim().toLowerCase();

  const menuItems = (() => {
    // 🧑 YAZAR
    if (cleanRole === "yazar") {
      return [
        { id: "blog-list", label: "Bloglarım", icon: "📝" },
        { id: "blog-create", label: "Blog Yazısı Yaz", icon: "✍️" },
      ];
    }

    // ✍️ EDITOR
    if (cleanRole === "editör") {
      return [
        { id: "blog-list", label: "Blog Yazıları", icon: "📝" },
        { id: "pending-blogs", label: "Onay Bekleyen Bloglar", icon: "⏳" },
        { id: "blog-create", label: "Blog Yazısı Yaz", icon: "✍️" },
        { id: "upload", label: "Resim Yükle", icon: "🖼️" },
      ];
    }

    // 👑 ADMIN + SUPER ADMIN
    return [
      { id: "blog-list", label: "Blog Yazıları", icon: "📝" },
      { id: "pending-blogs", label: "Onay Bekleyen Bloglar", icon: "⏳" },
      { id: "blog-create", label: "Blog Yazısı Yaz", icon: "✍️" },
      { id: "upload", label: "Resim Yükle", icon: "🖼️" },
      { id: "image-square", label: "400x400 Resim Düzenle", icon: "🟦" },
      { id: "settings", label: "Ayarlar & Yetki", icon: "⚙️" },
    ];
  })();

  return (
    <aside className="w-80 flex flex-col gap-6 shrink-0">

      {/* PROFİL */}
      <div className="bg-gray-900 border border-gray-800 p-6 rounded-3xl flex flex-col items-center text-center shadow-2xl">
        <div className="w-24 h-24 rounded-full border-4 border-blue-600 p-1 mb-4">
          <img
            src={
              user?.photoURL ||
              `https://ui-avatars.com/api/?name=${user?.displayName}`
            }
            className="w-full h-full rounded-full object-cover"
            alt="Profil"
          />
        </div>

        <h2 className="text-xl font-bold">
          {user?.displayName || "Kullanıcı"}
        </h2>

        <p className="text-blue-500 text-sm font-semibold uppercase tracking-widest mt-1">
          {role}
        </p>

        {/* 🔥 DEBUG (GEÇİCİ KALSIN) */}
        <p className="text-red-400 text-xs mt-2">
          ROLE DEBUG: [{role}]
        </p>

        <div className="w-full h-[1px] bg-gray-800 my-4"></div>

        <p className="text-gray-500 text-xs truncate w-full px-2">
          {user?.email}
        </p>
      </div>

      {/* MENU */}
      <nav className="bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden shadow-xl">

        {menuItems.map((v: any) => (
          <button
            key={v.id}
            onClick={() => setActiveView(v.id)}
            className={`w-full p-4 text-left flex items-center gap-3 transition ${
              activeView === v.id ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <span>{v.icon}</span>
            {v.label}
          </button>
        ))}

        {/* ÇIKIŞ */}
        <button
          onClick={() => auth.signOut()}
          className="w-full p-4 text-left flex items-center gap-3 text-red-500 hover:bg-red-900/10 transition border-t border-gray-800"
        >
          <span>🚪</span>
          Çıkış Yap
        </button>
      </nav>
    </aside>
  );
}