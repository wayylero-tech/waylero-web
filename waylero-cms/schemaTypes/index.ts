import blockContent from "./blockContent";
import category from "./category";
import post from "./post";
import author from "./author";
import place from "./place";

import region from "./region";
import city from "./city";

// Yeni eklenen blogPost şeması
import blogPost from "./blogPost";

export const schemaTypes = [
  post,
  blogPost, // ← buraya ekledik
  author,
  category,
  blockContent,
  region,
  city,
  place,
];
