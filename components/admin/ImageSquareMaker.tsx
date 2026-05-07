"use client";

import { useState } from "react";

export default function ImageOptimizer() {
  const [result, setResult] = useState<{
    square?: string;
    cover?: string;
  }>({});

  function loadImage(file: File) {
    const img = new Image();

    img.onload = () => {
      const square = createCanvas(img, 400, 400);
      const cover = createCanvas(img, 1200, 630);

      setResult({
        square: square,
        cover: cover,
      });
    };

    img.src = URL.createObjectURL(file);
  }

  function createCanvas(
    img: HTMLImageElement,
    width: number,
    height: number
  ) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return "";

    canvas.width = width;
    canvas.height = height;

    // arkaplan
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, width, height);

    const scale = Math.max(
      width / img.width,
      height / img.height
    );

    const newWidth = img.width * scale;
    const newHeight = img.height * scale;

    const x = (width - newWidth) / 2;
    const y = (height - newHeight) / 2;

    ctx.drawImage(img, x, y, newWidth, newHeight);

    return canvas.toDataURL("image/webp", 0.9);
  }

  function download(img: string, name: string) {
    const a = document.createElement("a");
    a.href = img;
    a.download = name;
    a.click();
  }

  return (
    <div className="flex flex-col items-center gap-6 p-10">
      <h1 className="text-2xl font-bold">
        Blog Image Optimizer (PRO)
      </h1>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) loadImage(file);
        }}
      />

      <div className="flex gap-6">
        {result.square && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={result.square}
              className="w-[200px] h-[200px] object-cover border"
            />
            <button
              onClick={() =>
                download(result.square!, "blog-400.webp")
              }
              className="bg-black text-white px-4 py-2 rounded"
            >
              400x400 indir
            </button>
          </div>
        )}

        {result.cover && (
          <div className="flex flex-col items-center gap-2">
            <img
              src={result.cover}
              className="w-[300px] h-[160px] object-cover border"
            />
            <button
              onClick={() =>
                download(result.cover!, "blog-1200.webp")
              }
              className="bg-black text-white px-4 py-2 rounded"
            >
              1200x630 indir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}