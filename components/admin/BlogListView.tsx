"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, doc, getDoc } from "firebase/firestore";

export default function BlogListView({ user }: any) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [role, setRole] = useState<string>("none");
  const [roleLoading, setRoleLoading] = useState(true);

  // 📌 BLOGS REALTIME FETCH
  useEffect(() => {
    const q = query(collection(db, "blogs"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snap) => {
      setBlogs(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    });

    return () => unsub();
  }, []);

  // 🔐 ROLE FIRESTORE'DAN ÇEK
  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!user?.email) return;

        const ref = doc(db, "authorized_users", user.email);
        const snap = await getDoc(ref);

        if (snap.exists()) {
          setRole(snap.data().role);
        } else {
          setRole("none");
        }
      } catch (err) {
        console.error("ROLE FETCH ERROR:", err);
        setRole("none");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // ⏳ ROLE GELENE KADAR
  if (roleLoading) {
    return (
      <div className="text-white text-center py-10 font-medium">
        Veriler yükleniyor...
      </div>
    );
  }

  // 🔥 ROLE BAZLI FİLTRE
  const roleType = (role || "").toLowerCase();
  const filteredBlogs = blogs.filter((b) => {
    if (roleType === "yazar") {
      return b.authorEmail === user?.email;
    }
    return true; // admin her şeyi görür
  });

  return (
    <div className="text-white max-w-4xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          📚 Blog Yazıları
        </h1>
        <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full border border-blue-500/30 uppercase">
          {roleType} Paneli
        </span>
      </div>

      {filteredBlogs.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 p-10 rounded-2xl text-center text-gray-400">
          Henüz yayında olan bir blog yazısı bulunamadı.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredBlogs.map((blog) => {
            // Kapak resmi kontrolü: Yeni yapıda blog.image veya blog.gallery[0]
            const cover = blog.image || blog.gallery?.[0];

            return (
              <div
                key={blog.id}
                className="bg-gray-900/70 border border-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:border-gray-600 transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row">
                  
                  {/* TEXT CONTENT */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex gap-2 mb-2">
                        {blog.city && (
                           <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase tracking-widest">
                             {blog.city}
                           </span>
                        )}
                      </div>

                      <h2 className="text-xl font-bold hover:text-blue-400 transition cursor-default">
                        {/* OBJEYSE .TR DEĞİLSE DÜZ METİN BASARAK HATAYI ÖNLERİZ */}
                        {typeof blog.title === 'object' ? blog.title.tr : blog.title}
                      </h2>

                      <p className="mt-3 text-gray-400 line-clamp-3 leading-relaxed text-sm">
                        {/* İÇERİK İÇİN DE AYNI KONTROL */}
                        {typeof blog.content === 'object' ? blog.content.tr : blog.content}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 mt-6 pt-4 border-t border-gray-800/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-[10px] font-bold">
                         {blog.authorName?.substring(0,2).toUpperCase() || "WY"}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-gray-200">{blog.authorName || "Anonim Yazar"}</span>
                        <span className="text-[10px] text-gray-500">{blog.authorEmail}</span>
                      </div>
                      <span className="ml-auto text-[10px] text-gray-600 font-mono">
                        {blog.date || "Tarih Belirtilmedi"}
                      </span>
                    </div>
                  </div>

                  {/* IMAGE SECTION */}
                  {cover && (
                    <div className="md:w-72 w-full h-52 md:h-auto overflow-hidden">
                      <img
                        src={cover}
                        alt="Blog Cover"
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  {/* JSON EXPORT PANEL */}
<div className="border-t border-gray-800 bg-black/30 p-4">
  <div className="flex items-center justify-between mb-3">
    <h3 className="text-xs uppercase tracking-widest text-gray-500 font-bold">
      JSON Export
    </h3>

    <button
      onClick={() => {
        const blogJson = {
          slug: blog.slug || "",

          title: {
            tr:
              typeof blog.title === "object"
                ? blog.title.tr
                : blog.title || "",

            en:
              typeof blog.title === "object"
                ? blog.title.en
                : "",
          },

          excerpt: {
            tr:
              typeof blog.excerpt === "object"
                ? blog.excerpt.tr
                : blog.excerpt || "",

            en:
              typeof blog.excerpt === "object"
                ? blog.excerpt.en
                : "",
          },

          image:
            blog.image ||
            blog.gallery?.[0] ||
            "",

          gallery: Array.isArray(blog.gallery)
            ? blog.gallery
            : [],

          date:
            blog.date ||
            new Date()
              .toISOString()
              .split("T")[0],

          city: blog.city || "",

          seo: {
            tr: {
              title:
                blog.seo?.tr?.title || "",

              description:
                blog.seo?.tr?.description || "",
            },

            en: {
              title:
                blog.seo?.en?.title || "",

              description:
                blog.seo?.en?.description || "",
            },
          },

          content: {
            tr:
              typeof blog.content === "object"
                ? blog.content.tr
                : blog.content || "",

            en:
              typeof blog.content === "object"
                ? blog.content.en
                : "",
          },
        };

        navigator.clipboard.writeText(
          JSON.stringify(blogJson, null, 2)
        );

        alert("JSON kopyalandı 🚀");
      }}
      className="text-xs bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition"
    >
      JSON Kopyala
    </button>
  </div>

  <textarea
    readOnly
    value={JSON.stringify(
      {
        slug: blog.slug || "",

        title: {
          tr:
            typeof blog.title === "object"
              ? blog.title.tr
              : blog.title || "",

          en:
            typeof blog.title === "object"
              ? blog.title.en
              : "",
        },

        excerpt: {
          tr:
            typeof blog.excerpt === "object"
              ? blog.excerpt.tr
              : blog.excerpt || "",

          en:
            typeof blog.excerpt === "object"
              ? blog.excerpt.en
              : "",
        },

        image:
          blog.image ||
          blog.gallery?.[0] ||
          "",

        gallery: Array.isArray(blog.gallery)
          ? blog.gallery
          : [],

        date:
          blog.date ||
          new Date()
            .toISOString()
            .split("T")[0],

        city: blog.city || "",

        seo: {
          tr: {
            title:
              blog.seo?.tr?.title || "",

            description:
              blog.seo?.tr?.description || "",
          },

          en: {
            title:
              blog.seo?.en?.title || "",

            description:
              blog.seo?.en?.description || "",
          },
        },

        content: {
          tr:
            typeof blog.content === "object"
              ? blog.content.tr
              : blog.content || "",

          en:
            typeof blog.content === "object"
              ? blog.content.en
              : "",
        },
      },
      null,
      2
    )}
    className="w-full min-h-[350px] bg-gray-950 border border-gray-800 rounded-xl p-4 text-xs font-mono text-green-400 resize-y outline-none"
  />
</div>

                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}