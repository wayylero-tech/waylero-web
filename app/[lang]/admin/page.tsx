"use client";

import { useState, use } from "react"; // ✅ 'use' hook'unu ekledik
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

// ✅ Props tipine 'params' eklendi (Next.js 15 standartı)
export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const router = useRouter();
  
  // ✅ URL'deki dili buradan okuyoruz (headers/cookies kullanmadan)
  const resolvedParams = use(params);
  const lang = resolvedParams.lang;

  const [activeView, setActiveView] = useState("blog-list");

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

  // Rol kontrolü başarısızsa boş döner (Güvenlik için)
  if (!role) return null;

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

{/* YENİ EKLENDİ */}
{activeView === "image-square" && isAdmin && (
  <ImageSquareMaker />
)}

{activeView === "dashboard" && (
  <DashboardView />
)}

{activeView === "settings" && isSuperAdmin && (
  <SettingsView
    role={role}
    authUsers={authUsers}
    handleAddAuth={handleAddAuth}
    handleDeleteAuth={handleDeleteAuth}
    SUPER_ADMIN_EMAIL={SUPER_ADMIN_EMAIL}
  />
)}

      </main>
    </div>
  );
}