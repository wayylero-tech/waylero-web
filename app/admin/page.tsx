"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

import DashboardView from "@/components/admin/DashboardView";
import AdminSidebar from "@/components/admin/AdminSidebar";
import SettingsView from "@/components/admin/SettingsView";
import MediaView from "@/components/admin/MediaView";

import BlogListView from "@/components/admin/BlogListView";
import PendingBlogsView from "@/components/admin/PendingBlogsView";
import BlogCreateView from "@/components/admin/BlogCreateView";

import { useAdminAuth } from "@/hooks/useAdminAuth";

export default function AdminPage() {
  const router = useRouter();
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

  if (loading) return null;

  if (loading || !role) {
  return (
    <div className="text-white p-10">
      Loading...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gray-950 text-white flex p-6 gap-6 font-sans">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" />

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
          <BlogListView user={user} />
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