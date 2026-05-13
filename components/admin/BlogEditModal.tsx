"use client";

import { useState } from "react";
import { db } from "@/lib/firebase";

import {
  doc,
  deleteDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

export default function BlogEditModal({
  blog,
  onClose,
}: any) {
  const [loading, setLoading] = useState(false);

  // FORM STATES
  const [slug, setSlug] = useState(
    blog.slug ||
      (typeof blog.title === "string"
        ? blog.title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
        : "")
  );

  const [city, setCity] = useState(
    blog.city || "genel"
  );

  // TITLES
  const [titleTr, setTitleTr] = useState(
    typeof blog.title === "object"
      ? blog.title.tr || ""
      : blog.title || ""
  );

  const [titleEn, setTitleEn] = useState(
    typeof blog.title === "object"
      ? blog.title.en || ""
      : ""
  );

  // CONTENTS
  const [contentTr, setContentTr] =
    useState(
      typeof blog.content === "object"
        ? blog.content.tr || ""
        : blog.content || ""
    );

  const [contentEn, setContentEn] =
    useState(
      typeof blog.content === "object"
        ? blog.content.en || ""
        : ""
    );

  // EXCERPTS
  const [excerptTr, setExcerptTr] =
    useState(
      typeof blog.excerpt === "object"
        ? blog.excerpt.tr || ""
        : ""
    );

  const [excerptEn, setExcerptEn] =
    useState(
      typeof blog.excerpt === "object"
        ? blog.excerpt.en || ""
        : ""
    );

  // 🌐 SOCIALS
  const [instagram, setInstagram] =
    useState(blog.socials?.instagram || "");

  const [facebook, setFacebook] =
    useState(blog.socials?.facebook || "");

  const [xAccount, setXAccount] =
    useState(blog.socials?.x || "");

  const [youtube, setYoutube] =
    useState(blog.socials?.youtube || "");

  const handleFinalApprove = async () => {
    if (!slug) {
      return alert("Slug gerekli!");
    }

    setLoading(true);

    try {
      await setDoc(doc(db, "blogs", slug), {
        slug,

        title: {
          tr: titleTr,
          en: titleEn,
        },

        excerpt: {
          tr: excerptTr,
          en: excerptEn,
        },

        image: blog.gallery?.[0] || "",

        gallery: blog.gallery || [],

        date: new Date()
          .toISOString()
          .split("T")[0],

        city: city.toLowerCase(),

        seo: {
          title: {
            tr: titleTr,
            en: titleEn,
          },

          description: {
            tr: excerptTr,
            en: excerptEn,
          },
        },

        content: {
          tr: contentTr,
          en: contentEn,
        },

        // 🌐 SOCIALS
        socials: {
          instagram:
            instagram.trim() || null,

          facebook:
            facebook.trim() || null,

          x:
            xAccount.trim() || null,

          youtube:
            youtube.trim() || null,
        },

        authorEmail:
          blog.authorEmail || "",

        authorName:
          blog.authorName || "Admin",

        createdAt: serverTimestamp(),
      });

      // 🗑️ PENDING DELETE
      if (blog.id) {
        await deleteDoc(
          doc(db, "pending_blogs", blog.id)
        );
      }

      alert(
        "Blog başarıyla kaydedildi 🚀"
      );

      onClose();
    } catch (err) {
      console.error(err);

      alert("Hata oluştu!");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl p-6 space-y-6">
        
        {/* HEADER */}
        <div className="flex justify-between items-center border-b border-gray-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-yellow-500">
              🚀 Blogu Yayına Hazırla
            </h2>

            <p className="text-xs text-gray-400 mt-1">
              Blog artık object
              formatında kaydolacak.
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white bg-gray-800 p-2 rounded-lg"
          >
            ✕
          </button>
        </div>

        {/* SLUG + CITY */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-gray-400 block mb-2">
              Slug
            </label>

            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value)
              }
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-2">
              Şehir
            </label>

            <input
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
        </div>

        {/* TITLES */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-blue-400 block mb-2">
              Başlık TR
            </label>

            <input
              value={titleTr}
              onChange={(e) =>
                setTitleTr(e.target.value)
              }
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label className="text-xs text-pink-400 block mb-2">
              Başlık EN
            </label>

            <input
              value={titleEn}
              onChange={(e) =>
                setTitleEn(e.target.value)
              }
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
        </div>

        {/* CONTENT TR */}
        <div>
          <label className="text-xs text-blue-400 block mb-2">
            İçerik TR
          </label>

          <textarea
            value={contentTr}
            onChange={(e) =>
              setContentTr(e.target.value)
            }
            className="w-full h-48 bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono"
          />
        </div>

        {/* CONTENT EN */}
        <div>
          <label className="text-xs text-pink-400 block mb-2">
            İçerik EN
          </label>

          <textarea
            value={contentEn}
            onChange={(e) =>
              setContentEn(e.target.value)
            }
            className="w-full h-48 bg-gray-800 p-3 rounded-lg border border-gray-700 font-mono"
          />
        </div>

        {/* EXCERPTS */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-blue-400 block mb-2">
              SEO Açıklama TR
            </label>

            <textarea
              value={excerptTr}
              onChange={(e) =>
                setExcerptTr(
                  e.target.value
                )
              }
              className="w-full h-24 bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>

          <div>
            <label className="text-xs text-pink-400 block mb-2">
              SEO Açıklama EN
            </label>

            <textarea
              value={excerptEn}
              onChange={(e) =>
                setExcerptEn(
                  e.target.value
                )
              }
              className="w-full h-24 bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
        </div>

        {/* SOCIALS */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-white">
            🌐 Sosyal Medya
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <input
              type="url"
              value={instagram}
              onChange={(e) =>
                setInstagram(
                  e.target.value
                )
              }
              placeholder="Instagram URL"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />

            <input
              type="url"
              value={facebook}
              onChange={(e) =>
                setFacebook(
                  e.target.value
                )
              }
              placeholder="Facebook URL"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />

            <input
              type="url"
              value={xAccount}
              onChange={(e) =>
                setXAccount(
                  e.target.value
                )
              }
              placeholder="X / Twitter URL"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />

            <input
              type="url"
              value={youtube}
              onChange={(e) =>
                setYoutube(
                  e.target.value
                )
              }
              placeholder="YouTube URL"
              className="w-full bg-gray-800 p-3 rounded-lg border border-gray-700"
            />
          </div>
        </div>

        {/* BUTTON */}
        <button
          disabled={loading}
          onClick={handleFinalApprove}
          className="w-full bg-green-600 hover:bg-green-700 py-4 rounded-xl font-bold text-lg"
        >
          {loading
            ? "Kaydediliyor..."
            : "✅ Firebase'e Kaydet"}
        </button>
      </div>
    </div>
  );
}