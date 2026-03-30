import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 🔥 ADIM 1: Sadece TR ve EN Katmanı (DE Silindi)
  async rewrites() {
    return [
      {
        // Örn: waylero.com/en/kesfet/istanbul -> Arka planda: /kesfet/istanbul?lang=en
        source: '/en/:path*',
        destination: '/:path*?lang=en',
      },
    ];
  },

  // 🔥 ADIM 2: Burayı boşaltıyoruz ki "1000 limit" hatası vermesin.
  // Yönlendirme işini artık Middleware (aşağıda) halledecek.
  async redirects() {
    return [];
  },
};

export default nextConfig;