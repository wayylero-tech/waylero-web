"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

type Props = {
  city: string;
  placeSlug: string;
};

export default function LikeBar({ city, placeSlug }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const ref = collection(db, "city", city, "places", placeSlug, "likes");

    const unsub = onSnapshot(ref, (snap) => {
      setCount(snap.size);
    });

    return () => unsub();
  }, [city, placeSlug]);

  return (
    <div className="flex items-center gap-2">
      ❤️ <span>{count}</span>
    </div>
  );
}