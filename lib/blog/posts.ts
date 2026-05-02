import { generalPosts } from "@/app/data/blog/muzekart/posts";
import { antikkentPosts } from "@/app/data/blog/antikkent/posts";
import { trekkingPosts } from "@/app/data/blog/likya/posts";
import { ihlaraRehberPost } from "@/app/data/blog/aksaray/posts";


export const allPosts = [
  ...generalPosts,
  ...antikkentPosts,
  ...trekkingPosts,
  ...ihlaraRehberPost,
];