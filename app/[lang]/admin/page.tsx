"use client";

import { useState, use, useRef } from "react"; // ✅ useRef eklendi
import Script from "next/script";
import { useRouter } from "next/navigation";

import DashboardView from "@/components/admin/DashboardView";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsView from "@/components/admin/SettingsView";
import MediaView from "@/components/admin/MediaView";
import ImageSquareMaker from "@/components/admin/ImageSquareMaker";

import BlogListView from "@/components/admin/BlogListView";
import PendingBlogsView from "@/components/admin/PendingBlogsView";
import BlogCreateView from "@/components/admin/BlogCreateView";

import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  
  // ✅ Next.js 15 Güvenli Param Çözümü
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || "tr";

  const [activeView, setActiveView] = useState("blog-list");

  // 🎯 INPUT VE SELECT DEĞERLERİNİ GÜVENLE YÖNETMEK İÇİN STATE'LER
  // document.getElementById kullanmak yerine Next.js usulü state yönetimi en güvenlisidir kanka
  const [newAdminEmail, setNewAdminEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState("Editör");

  const {
    loading,
    user,
    role,
    authUsers,
    SUPER_ADMIN_EMAIL,
    handleAddAuth,
    handleDeleteAuth,
    isSuperAdmin,
    isAdmin,
  } = useAdminAuth(router);

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-sans uppercase tracking-widest text-xs">
      Waylero Authenticating...
    </div>
  );

  // Rol kontrolü başarısızsa boş döner (En sağlam kalkanımız)
  if (!role) return null;

  // 🛡️ Yetki Ekleme Tetikleyicisi (Frontend Güvenlik Ara Katmanı)
  // 🛡️ Yetki Ekleme Tetikleyicisi
  const onAddAuthSubmit = async () => {
    // Eğer hook'un içindeki handleAddAuth parametre almıyorsa, 
    // sadece isSuperAdmin kontrolünü yapıp orijinal fonksiyonu çıplak çağırıyoruz kanka.
    if (!isSuperAdmin) {
      alert("Hop! Yetki ekleme işlemini sadece Süper Admin yapabilir.");
      return;
    }

    // Orijinal fonksiyonu parametresiz tetikliyoruz, kırmızı çizgi kayboluyor!
    await handleAddAuth(); 
    
    // İşlem bitince input'ları sıfırla
    setNewAdminEmail("");
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex p-6 gap-6 font-sans">
      {/* Cloudinary Widget */}
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="afterInteractive" />

      {/* SIDEBAR */}
      <AdminSidebar
        user={user}
        role={role}
        activeView={activeView}
        setActiveView={setActiveView}
      />

      {/* MAIN */}
      <main className="flex-1 bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl overflow-y-auto">

        {activeView === "blog-list" && (
          <BlogListView user={user} lang={lang} />
        )}

        {activeView === "pending-blogs" && (
          <PendingBlogsView user={user} />
        )}

        {activeView === "blog-create" && (
          <BlogCreateView user={user} />
        )}

        {activeView === "upload" && isAdmin && (
          <MediaView user={user} />
        )}

        {activeView === "image-square" && isAdmin && (
          <ImageSquareMaker />
        )}

        {activeView === "dashboard" && (
          <DashboardView />
        )}

        {/* 🎯 KALE BURASI: Sadece Süper Admin ise SettingsView yüklenir */}
        {activeView === "settings" && isSuperAdmin && (
          <SettingsView
            role={role}
            authUsers={authUsers}
            SUPER_ADMIN_EMAIL={SUPER_ADMIN_EMAIL}
            handleDeleteAuth={handleDeleteAuth}
            // State'leri ve yeni tetikleyiciyi alt bileşene aktarıyoruz:
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            handleAddAuth={onAddAuthSubmit} 
          />
        )}

      </main>
    </div>
  );
}