"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  onSnapshot,
  query,
  doc,
  deleteDoc,
} from "firebase/firestore";

import BlogEditModal from "./BlogEditModal";

export default function PendingBlogsView({ user, role }: any) {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedBlog, setSelectedBlog] = useState<any | null>(
    null
  );

  useEffect(() => {
    const q = query(collection(db, "pending_blogs"));

    const unsub = onSnapshot(q, (snap) => {
      setBlogs(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );

      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleReject = async (id: string) => {
    if (
      confirm(
        "Bu taslağı silmek istediğine emin misin?"
      )
    ) {
      await deleteDoc(doc(db, "pending_blogs", id));
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-gray-400">
        Taslaklar yükleniyor...
      </div>
    );
  }

  return (
    <div className="text-white p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        ⏳ Onay Bekleyen Taslaklar

        <span className="text-sm font-normal bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full">
          {blogs.length}
        </span>
      </h1>

      <div className="grid gap-4">
        {blogs.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 p-10 rounded-2xl text-center text-gray-500">
            Bekleyen taslak bulunamadı.
          </div>
        ) : (
          blogs.map((item) => {
            // 🔥 İlk görsel
            const previewImage =
              item.gallery?.[0] || item.image;

            return (
              <div
                key={item.id}
                className="bg-gray-900 border border-gray-800 p-4 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 hover:border-gray-700 transition-colors"
              >
                {/* LEFT */}
                <div className="flex items-center gap-4 w-full">
                  {/* IMAGE */}
                  <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-800 flex-shrink-0 border border-gray-700">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Önizleme"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-600">
                        Resim Yok
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="overflow-hidden w-full">
                    <h2 className="font-bold text-lg truncate">
                      {item.title}
                    </h2>

                    <p className="text-xs text-gray-500 truncate">
                      Yazar: {item.authorEmail}
                    </p>

                    <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-wider font-semibold">
                      {item.city ||
                        "Şehir Belirtilmedi"}
                    </p>

                    {/* SOCIALS */}
                    {(item.socials?.instagram ||
                      item.socials?.facebook ||
                      item.socials?.x ||
                      item.socials?.youtube) && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {item.socials?.instagram && (
                          <a
                            href={
                              item.socials.instagram
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-pink-500/10 text-pink-400 px-2 py-1 rounded-lg hover:bg-pink-500 hover:text-white transition"
                          >
                            Instagram
                          </a>
                        )}

                        {item.socials?.facebook && (
                          <a
                            href={
                              item.socials.facebook
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-blue-500/10 text-blue-400 px-2 py-1 rounded-lg hover:bg-blue-500 hover:text-white transition"
                          >
                            Facebook
                          </a>
                        )}

                        {item.socials?.x && (
                          <a
                            href={item.socials.x}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs bg-gray-500/10 text-gray-300 px-2 py-1 rounded-lg hover:bg-white hover:text-black transition"
                          >
                            X
                          </a>
                        )}

                        {item.socials?.youtube && (
                          <a
                            href={
                              item.socials.youtube
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
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() =>
                      setSelectedBlog(item)
                    }
                    className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition shadow-lg shadow-blue-900/20"
                  >
                    Düzenle ve Onayla
                  </button>

                  <button
                    onClick={() =>
                      handleReject(item.id)
                    }
                    className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white px-4 py-2.5 rounded-xl text-sm transition"
                  >
                    Reddet
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL */}
      {selectedBlog && (
        <BlogEditModal
          blog={selectedBlog}
          onClose={() =>
            setSelectedBlog(null)
          }
        />
      )}
    </div>
  );
}