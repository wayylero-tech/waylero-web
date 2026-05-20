"use client";

import { useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  doc,
  setDoc,
  increment,
} from "firebase/firestore";

interface Props {
  slug: string;
}

export default function BlogViewCounter({ slug }: Props) {
  useEffect(() => {
    const updateViews = async () => {
      try {
        // ✅ 12 saatlik koruma
        const storageKey = `viewed-${slug}`;

        const existing = localStorage.getItem(storageKey);

        // Şu anki zaman
        const now = Date.now();

        // 12 saat (milisaniye)
        const TWELVE_HOURS = 12 * 60 * 60 * 1000;

        // Eğer daha önce görüntülenmişse
        if (existing) {
          const lastViewed = parseInt(existing);

          // 12 saat dolmadıysa çık
          if (now - lastViewed < TWELVE_HOURS) {
            return;
          }
        }

        // Firestore ref
        const ref = doc(db, "blogViews", slug);

        // View artır
        await setDoc(
          ref,
          {
            views: increment(1),
          },
          { merge: true }
        );

        // Yeni zamanı kaydet
        localStorage.setItem(storageKey, now.toString());

      } catch (error) {
        console.error("View counter error:", error);
      }
    };

    updateViews();
  }, [slug]);

  return null;
}