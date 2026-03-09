"use client";

import Link from "next/link";
import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { uygulamaPosts } from "@/app/data/blog/uygulama/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { konyaPosts } from "../data/blog/konya/posts";
import { istanbulPosts } from "../data/blog/istanbul/posts";
import { konyaPosts2 } from "../data/blog/konya/posts2";
import { konyaRehberPost } from "../data/blog/konya/posts3";
import { selalelerRehberPost } from "../data/blog/selale/posts";
import { magaralarRehberPost } from "../data/blog/magaralar/posts";
import { turkeyPost } from "../data/blog/turkey/posts";
import { kanyonlarRehberPosts } from "../data/blog/kanyonlar/posts";
import { mersinRehberPosts } from "../data/blog/mersin/posts";
import { turkiyeEnCokZiyaretEdilen10YerPost } from "../data/blog/ziyaretedilenonyer/posts";


const posts = [
  ...generalPosts,
  ...uygulamaPosts,
  ...antikkentPosts,
  ...konyaPosts,
  ...istanbulPosts,
  ...konyaPosts2,
  ...konyaRehberPost,
  ...selalelerRehberPost,
  ...magaralarRehberPost,
  ...turkeyPost,
  ...kanyonlarRehberPosts,
  ...mersinRehberPosts,
  ...turkiyeEnCokZiyaretEdilen10YerPost,
];

export default function HomeBlogSlider() {
  return (
    <section className="mb-16">
      <h2 className="text-xl font-bold mb-4">Seyehat Rehberi ✍️</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {posts.map((post, i) => {
          const href = `/blog/${post.city}/${post.slug}`;

          return (
            <Link
              key={`${post.slug}-${i}`}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-72 rounded-2xl overflow-hidden bg-white shadow cursor-pointer hover:shadow-md transition"
            >
              {/* GÖRSEL */}
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${post.image})` }}
              />

              {/* METİN */}
              <div className="p-3">
                <h3 className="font-semibold text-sm line-clamp-2">{post.title}</h3>
                <p className="text-xs text-gray-600 mt-1 line-clamp-3">{post.excerpt}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
