"use client";
import { wayleroLiveVideos } from "@/videos";
import { useParams } from "next/navigation";
import YouTube from "react-youtube";

export default function VideoDetailPage() {
  const params = useParams();
  const slug = params.slug;

  const video = wayleroLiveVideos.find(v => v.slug === slug);

  if (!video) return <p>Video bulunamadı</p>;

  return (
    <main className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-4">{video.title}</h1>
      <div className="shadow-2xl rounded-[20px] overflow-hidden">
        <YouTube
          videoId={video.youtubeId}
          opts={{ width: "100%", height: "530", playerVars: { autoplay: 1 } }}
        />
      </div>
      <p className="mt-2 text-gray-500">{video.location}</p>
    </main>
  );
}