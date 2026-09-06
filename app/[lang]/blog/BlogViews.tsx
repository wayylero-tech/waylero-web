"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { blogDb } from "@/lib/firebase-blog";

interface BlogViewsProps {
  slug: string;
  lang: "tr" | "en";
}

export default function BlogViews({
  slug,
  lang,
}: BlogViewsProps) {
  const [views, setViews] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const CACHE_KEY = "blogViewsCache";
    const CACHE_TIME_KEY = "blogViewsCacheTime";
    const ONE_HOUR = 60 * 60 * 1000;

    const loadViews = async () => {
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        const cacheTime =
          localStorage.getItem(CACHE_TIME_KEY);

        const now = Date.now();

        let result: Record<string, number>;

        if (
          cached &&
          cacheTime &&
          now - Number(cacheTime) < ONE_HOUR
        ) {
          result = JSON.parse(cached);
        } else {
          const snap = await getDocs(
            collection(blogDb, "blogViews")
          );

          result = {};

          snap.forEach((doc) => {
            const data = doc.data();

            result[doc.id] =
              typeof data.views === "number"
                ? data.views
                : 0;
          });

          localStorage.setItem(
            CACHE_KEY,
            JSON.stringify(result)
          );

          localStorage.setItem(
            CACHE_TIME_KEY,
            now.toString()
          );
        }

        if (!cancelled) {
          setViews(result[slug] ?? 0);
        }
      } catch (error) {
        console.error(
          "Blog görüntülenmeleri alınamadı:",
          error
        );

        if (!cancelled) {
          setViews(0);
        }
      }
    };

    const scheduleLoad = () => {
      if ("requestIdleCallback" in window) {
        (
          window as Window & {
            requestIdleCallback: (
              callback: () => void,
              options?: { timeout: number }
            ) => number;
          }
        ).requestIdleCallback(
          () => loadViews(),
          { timeout: 2500 }
        );
      } else {
        setTimeout(loadViews, 1200);
      }
    };

    scheduleLoad();

    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (views === null) {
    return (
      <span>
        👁{" "}
        {lang === "en"
          ? "Loading..."
          : "Yükleniyor..."}
      </span>
    );
  }

  return (
    <span>
      👁{" "}
      {views > 0
        ? lang === "en"
          ? `Viewed ${views} times`
          : `${views} kez görüntülendi`
        : lang === "en"
          ? "Not viewed yet"
          : "Henüz görüntülenmedi"}
    </span>
  );
}