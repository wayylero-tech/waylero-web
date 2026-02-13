"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HomeSearch() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/kesfet?q=${encodeURIComponent(search.trim())}`);
    }
  };

  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Şehir veya yer ara..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyDown={handleSearch}
        className="w-full rounded-2xl px-4 py-3 bg-white shadow-sm focus:outline-none"
      />
    </div>
  );
}
