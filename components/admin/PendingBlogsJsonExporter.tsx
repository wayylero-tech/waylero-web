"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
} from "firebase/firestore";

export default function PendingBlogsJsonExporter() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "pending_blogs"));

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setBlogs(data);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // slugify helper
  const slugify = (text: string = "") => {
    return text
      .toLowerCase()
      .replace(/ç/g, "c")
      .replace(/ğ/g, "g")
      .replace(/ı/g, "i")
      .replace(/ö/g, "o")
      .replace(/ş/g, "s")
      .replace(/ü/g, "u")
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
  };

  // Firebase blog -> istediğin format
  const convertBlog = (item: any) => {
    const slug =
      item.slug ||
      slugify(item.title?.tr || item.title || "blog-yazisi");

    return {
      slug,

      title: {
        tr: item.title?.tr || item.title || "",
        en: item.title?.en || item.titleEn || "",
      },

      excerpt: {
        tr:
          item.excerpt?.tr ||
          item.description?.tr ||
          item.description ||
          "",
        en:
          item.excerpt?.en ||
          item.description?.en ||
          item.descriptionEn ||
          "",
      },

      image:
        item.image ||
        item.gallery?.[0] ||
        "/assets/blog/default.png",

      gallery: Array.isArray(item.gallery)
        ? item.gallery
        : item.image
        ? [item.image]
        : [],

      date:
        item.date ||
        new Date().toISOString().split("T")[0],

      city: item.city || "genel",

      seo: {
        tr: {
          title:
            item.seo?.tr?.title ||
            item.metaTitleTr ||
            item.title?.tr ||
            item.title ||
            "",

          description:
            item.seo?.tr?.description ||
            item.metaDescriptionTr ||
            item.excerpt?.tr ||
            item.description ||
            "",
        },

        en: {
          title:
            item.seo?.en?.title ||
            item.metaTitleEn ||
            item.title?.en ||
            "",

          description:
            item.seo?.en?.description ||
            item.metaDescriptionEn ||
            item.excerpt?.en ||
            item.descriptionEn ||
            "",
        },
      },

      content: {
        tr:
          item.content?.tr ||
          item.content ||
          "",

        en:
          item.content?.en ||
          item.contentEn ||
          "",
      },
    };
  };

  const exportJson = () => {
    const converted = blogs.map(convertBlog);

    const finalCode = `export const pendingBlogs = ${JSON.stringify(
      converted,
      null,
      2
    )};`;

    navigator.clipboard.writeText(finalCode);

    alert("JSON kopyalandı 🚀");
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Bloglar yükleniyor...
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          Firebase Blog JSON Export
        </h1>

        <button
          onClick={exportJson}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded-xl font-bold transition"
        >
          JSON Kopyala
        </button>
      </div>

      <div className="space-y-4">
        {blogs.map((item) => (
          <div
            key={item.id}
            className="bg-gray-900 border border-gray-800 rounded-2xl p-4"
          >
            <div className="flex items-center gap-4">
              <img
                src={
                  item.image ||
                  item.gallery?.[0] ||
                  "/placeholder.jpg"
                }
                alt=""
                className="w-20 h-20 object-cover rounded-xl"
              />

              <div>
                <h2 className="font-bold text-lg">
                  {item.title?.tr || item.title}
                </h2>

                <p className="text-sm text-gray-400">
                  {item.city || "Şehir Yok"}
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  slug:{" "}
                  {slugify(
                    item.title?.tr || item.title
                  )}
                </p>
              </div>
            </div>

            <details className="mt-4">
              <summary className="cursor-pointer text-blue-400 text-sm">
                JSON Önizleme
              </summary>

              <pre className="mt-3 bg-black/40 p-4 rounded-xl text-xs overflow-auto whitespace-pre-wrap">
                {JSON.stringify(convertBlog(item), null, 2)}
              </pre>
            </details>
          </div>
        ))}
      </div>
    </div>
  );
}