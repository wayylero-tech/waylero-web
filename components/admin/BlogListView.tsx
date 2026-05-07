"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";

export default function BlogListView({ user }: any) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [role, setRole] = useState<string>("none");
  const [roleLoading, setRoleLoading] = useState(true);
  
  // Modal State'leri
  const [selectedJson, setSelectedJson] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setBlogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!user?.email) return;
        const ref = doc(db, "authorized_users", user.email);
        const snap = await getDoc(ref);
        setRole(snap.exists() ? snap.data().role : "none");
      } catch (err) {
        console.error("ROLE FETCH ERROR:", err);
        setRole("none");
      } finally {
        setRoleLoading(false);
      }
    };
    fetchRole();
  }, [user]);

  // JSON Oluşturma Fonksiyonu
  const generateBlogJson = (blog: any) => {
  const data = {
    slug: blog.slug || "",

    title: {
      tr: typeof blog.title === "object" ? blog.title.tr : blog.title || "",
      en: typeof blog.title === "object" ? blog.title.en : "",
    },

    excerpt: {
      tr: typeof blog.excerpt === "object" ? blog.excerpt.tr : "",
      en: typeof blog.excerpt === "object" ? blog.excerpt.en : "",
    },

    image: blog.image || blog.gallery?.[0] || "",

    gallery: blog.gallery || [],

    date: blog.date || "",

    city: blog.city || "genel",

    seo: blog.seo || {
      tr: { title: "", description: "" },
      en: { title: "", description: "" },
    },

    content: {
      tr: typeof blog.content === "object" ? blog.content.tr : blog.content || "",
      en: typeof blog.content === "object" ? blog.content.en : "",
    },

    authorEmail: blog.authorEmail || "",
    authorName: blog.authorName || "",
  };

  // 🔥 BURASI KRİTİK: TS export formatına çeviriyoruz
  return `export const generalPosts = [
${JSON.stringify(data, null, 2)}
];`;
};


  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("JSON kopyalandı! 🚀");
  };

  if (roleLoading) return <div className="text-white text-center py-10">Veriler yükleniyor...</div>;

  const roleType = (role || "").toLowerCase();
  const filteredBlogs = blogs.filter((b) => roleType === "yazar" ? b.authorEmail === user?.email : true);

  return (
    <div className="text-white max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">📚 Blog Yazıları</h1>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
          {roleType} Paneli
        </span>
      </div>

      <div className="space-y-6">
        {filteredBlogs.map((blog) => (
          <div key={blog.id} className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:border-gray-600 transition-all">
            <div className="flex flex-col md:flex-row">
              <div className="p-6 flex-1">
                <div className="flex gap-2 mb-2">
                  {blog.city && <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase">{blog.city}</span>}
                </div>
                <h2 className="text-xl font-bold">
                  {typeof blog.title === 'object' ? blog.title.tr : blog.title}
                </h2>
                <p className="mt-3 text-gray-400 line-clamp-2 text-sm">
                  {typeof blog.content === 'object' ? blog.content.tr : blog.content}
                </p>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-800/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold">
                        {blog.authorName?.substring(0,2).toUpperCase() || "WY"}
                      </div>
                      <span className="text-xs font-semibold text-gray-200">{blog.authorName}</span>
                   </div>
                   
                   {/* JSON AÇ BUTONU */}
                   <button 
                    onClick={() => setSelectedJson(generateBlogJson(blog))}
                    className="text-xs bg-gray-800 hover:bg-blue-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-colors border border-gray-700"
                   >
                     JSON Formatı
                   </button>
                </div>
              </div>

              {blog.image || blog.gallery?.[0] ? (
                <div className="md:w-48 w-full h-48 md:h-auto overflow-hidden">
                  <img src={blog.image || blog.gallery[0]} alt="Cover" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      {/* 🚀 MODAL (JSON GÖSTERİCİ) */}
      {selectedJson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-gray-900 border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
            <div className="p-4 border-b border-gray-800 flex justify-between items-center">
              <h3 className="text-sm font-bold text-gray-300 uppercase tracking-widest">JSON Export Verisi</h3>
              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(selectedJson)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-md transition"
                >
                  Kopyala
                </button>
                <button 
                  onClick={() => setSelectedJson(null)}
                  className="bg-gray-800 hover:bg-red-900 text-gray-400 hover:text-white text-xs px-3 py-1.5 rounded-md transition"
                >
                  Kapat
                </button>
              </div>
            </div>
            <div className="p-4 overflow-auto">
              <pre className="text-[13px] font-mono text-green-400 bg-black/50 p-4 rounded-xl leading-relaxed">
                {selectedJson}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}