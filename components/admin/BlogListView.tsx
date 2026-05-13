"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";

import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";

export default function BlogListView({
  user,
}: any) {
  const [blogs, setBlogs] = useState<any[]>(
    []
  );

  const [role, setRole] =
    useState<string>("none");

  const [roleLoading, setRoleLoading] =
    useState(true);

  const [selectedJson, setSelectedJson] =
    useState<string | null>(null);

  // 🔥 BLOG FETCH
  useEffect(() => {
    const q = query(
      collection(db, "blogs"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      setBlogs(data);
    });

    return () => unsub();
  }, []);

  // 🔥 ROLE FETCH
  useEffect(() => {
    const fetchRole = async () => {
      try {
        if (!user?.email) return;

        const ref = doc(
          db,
          "authorized_users",
          user.email
        );

        const snap = await getDoc(ref);

        setRole(
          snap.exists()
            ? snap.data().role
            : "none"
        );
      } catch (err) {
        console.error(err);

        setRole("none");
      } finally {
        setRoleLoading(false);
      }
    };

    fetchRole();
  }, [user]);

  // 🔥 NORMALIZE
  const normalize = (blog: any) => ({
    slug: blog.slug || "",

    title:
      typeof blog.title === "object"
        ? blog.title
        : {
            tr: blog.title || "",
            en: "",
          },

    excerpt:
      typeof blog.excerpt === "object"
        ? blog.excerpt
        : {
            tr: blog.excerpt || "",
            en: "",
          },

    content:
      typeof blog.content === "object"
        ? blog.content
        : {
            tr: blog.content || "",
            en: "",
          },

    seo: blog.seo || {
      tr: {
        title: "",
        description: "",
      },

      en: {
        title: "",
        description: "",
      },
    },

    image:
      blog.image ||
      blog.gallery?.[0] ||
      "",

    gallery: blog.gallery || [],

    date: blog.date || "",

    city: blog.city || "genel",

    authorEmail:
      blog.authorEmail || "",

    authorName:
      blog.authorName || "",

    // 🌐 SOCIALS
    socials: {
      instagram:
        blog.socials?.instagram ||
        null,

      facebook:
        blog.socials?.facebook ||
        null,

      x:
        blog.socials?.x || null,

      youtube:
        blog.socials?.youtube ||
        null,
    },
  });

  // 🔥 TS EXPORT
  const generateBlogJson = (
    blog: any
  ) => {
    const data = normalize(blog);

    return `export const generalPosts = [
${JSON.stringify(data, null, 2)}
];`;
  };

  const copyToClipboard = (
    text: string
  ) => {
    navigator.clipboard.writeText(text);

    alert("Kopyalandı 🚀");
  };

  if (roleLoading) {
    return (
      <div className="text-white text-center py-10">
        Yükleniyor...
      </div>
    );
  }

  const roleType = (
    role || ""
  ).toLowerCase();

  const filteredBlogs = blogs.filter(
    (b) =>
      roleType === "yazar"
        ? b.authorEmail === user?.email
        : true
  );

  return (
    <div className="text-white max-w-4xl mx-auto px-4 py-6">
      
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          📚 Bloglar
        </h1>

        <span className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded">
          {roleType} Paneli
        </span>
      </div>

      {/* LIST */}
      <div className="space-y-6">
        {filteredBlogs.map((blog) => {
          const b = normalize(blog);

          return (
            <div
              key={blog.id}
              className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
            >
              <div className="flex justify-between gap-4">
                
                {/* LEFT */}
                <div className="flex-1">
                  <div className="text-xs text-gray-400 mb-2 uppercase tracking-wider">
                    {b.city}
                  </div>

                  <h2 className="text-xl font-bold">
                    {b.title.tr}
                  </h2>

                  <p className="text-gray-400 text-sm mt-2 line-clamp-2">
                    {b.content.tr}
                  </p>

                  {/* 🌐 SOCIALS */}
                  {(b.socials
                    ?.instagram ||
                    b.socials
                      ?.facebook ||
                    b.socials?.x ||
                    b.socials
                      ?.youtube) && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      
                      {b.socials
                        ?.instagram && (
                        <a
                          href={
                            b.socials
                              .instagram
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-pink-500/10 text-pink-400 px-2 py-1 rounded-lg hover:bg-pink-500 hover:text-white transition"
                        >
                          Instagram
                        </a>
                      )}

                      {b.socials
                        ?.facebook && (
                        <a
                          href={
                            b.socials
                              .facebook
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition"
                        >
                          Facebook
                        </a>
                      )}

                      {b.socials?.x && (
                        <a
                          href={
                            b.socials.x
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-gray-500/10 text-gray-300 px-2 py-1 rounded-lg hover:bg-white hover:text-black transition"
                        >
                          X
                        </a>
                      )}

                      {b.socials
                        ?.youtube && (
                        <a
                          href={
                            b.socials
                              .youtube
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs bg-red-500/10 text-red-400 px-2 py-1 rounded-lg hover:bg-red-500 hover:text-white transition"
                        >
                          YouTube
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* IMAGE */}
                {b.image && (
                  <img
                    src={b.image}
                    className="w-32 h-24 object-cover rounded-lg border border-gray-700"
                  />
                )}
              </div>

              {/* FOOTER */}
              <div className="flex justify-between mt-5 pt-4 border-t border-gray-800">
                <div className="text-xs text-gray-300">
                  {b.authorName}
                </div>

                <button
                  onClick={() =>
                    setSelectedJson(
                      generateBlogJson(
                        blog
                      )
                    )
                  }
                  className="text-xs bg-gray-800 px-3 py-2 rounded hover:bg-blue-600 transition"
                >
                  JSON Export
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL */}
      {selectedJson && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 w-full max-w-2xl rounded-xl border border-gray-700">
            
            <div className="flex justify-between p-3 border-b border-gray-800">
              <span className="text-xs text-gray-300">
                TS EXPORT
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() =>
                    copyToClipboard(
                      selectedJson
                    )
                  }
                  className="text-xs bg-blue-600 px-3 py-1 rounded"
                >
                  Kopyala
                </button>

                <button
                  onClick={() =>
                    setSelectedJson(
                      null
                    )
                  }
                  className="text-xs bg-gray-700 px-3 py-1 rounded"
                >
                  Kapat
                </button>
              </div>
            </div>

            <pre className="p-4 text-green-400 text-xs overflow-auto max-h-[70vh]">
              {selectedJson}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}