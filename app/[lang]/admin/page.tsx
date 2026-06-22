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

// 🔥 Koleksiyon adı entry_fees olarak güncellendi kanka
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  
  // ✅ Next.js 15 Güvenli Param Çözümü
  const resolvedParams = use(params);
  const lang = resolvedParams?.lang || "tr";

  const [activeView, setActiveView] = useState("blog-list");

  // 🎯 INPUT VE SELECT DEĞERLERİNİ GÜVENLE YÖNETMEK İÇİN STATE'LER
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

  // 🛡️ Giriş Ücreti Güncelleme Tetikleyicisi (entry_fees koleksiyonu)
  const handleUpdateEntryFee = async ({ slug, entryFee }: { slug: string, entryFee: { tr: string, en: string } }) => {
    if (!slug) {
      alert("Kanka yer adını (slug) yazmayı unuttun!");
      return;
    }

    const docId = slug.trim().toLowerCase();

    try {
      // 🚀 setDoc kullanarak döküman yoksa sıfırdan oluşturuyor, varsa güncelliyor
      const feeRef = doc(db, "entry_fees", docId);
      
      await setDoc(feeRef, {
        slug: docId,
        tr: entryFee.tr || "",
        en: entryFee.en || "",
        updatedAt: new Date().toISOString()
      }, { merge: true }); // merge: true sayesinde diğer alanlar varsa ezilmez

      alert("Giriş ücreti bilgisi entry_fees koleksiyonuna başarıyla kaydedildi kanka!");
      
      // Form alanlarını temizle
      const slugInput = document.getElementById("targetPlaceSlug") as HTMLInputElement;
      const feeTrInput = document.getElementById("entryFeeTr") as HTMLTextAreaElement;
      const feeEnInput = document.getElementById("entryFeeEn") as HTMLTextAreaElement;
      if (slugInput) slugInput.value = "";
      if (feeTrInput) feeTrInput.value = "";
      if (feeEnInput) feeEnInput.value = "";

    } catch (error) {
      console.error("Veritabanı güncellenirken hata oluştu:", error);
      alert("Hata çıktı kanka, konsola bir baksana.");
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white font-sans uppercase tracking-widest text-xs">
      Waylero Authenticating...
    </div>
  );

  // Rol kontrolü başarısızsa boş döner (En sağlam kalkanımız)
  if (!role) return null;

  // 🛡️ Yetki Ekleme Tetikleyicisi (Frontend Güvenlik Ara Katmanı)
  const onAddAuthSubmit = async () => {
    if (!isSuperAdmin) {
      alert("Hop! Yetki ekleme işlemini sadece Süper Admin yapabilir.");
      return;
    }
    await handleAddAuth(); 
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

        {/* 🎯 Sadece Süper Admin ise SettingsView yüklenir */}
        {activeView === "settings" && isSuperAdmin && (
          <SettingsView
            role={role}
            authUsers={authUsers}
            SUPER_ADMIN_EMAIL={SUPER_ADMIN_EMAIL}
            handleDeleteAuth={handleDeleteAuth}
            newAdminEmail={newAdminEmail}
            setNewAdminEmail={setNewAdminEmail}
            selectedRole={selectedRole}
            setSelectedRole={setSelectedRole}
            handleAddAuth={onAddAuthSubmit} 
            handleUpdateEntryFee={handleUpdateEntryFee} 
          />
        )}

      </main>
    </div>
  );
}