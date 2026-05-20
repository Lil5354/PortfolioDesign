"use client";

import type { WatermarkPosition } from "@/lib/cloudinary";

interface WatermarkPreviewProps {
  imageUrl: string;
  text: string;
  position: WatermarkPosition;
  fontSize?: number;
  opacity?: number;
  cloudName: string;
}

function getPreviewStyle(position: WatermarkPosition) {
  const map: Record<string, { top?: string; left?: string; right?: string; bottom?: string; transform: string }> = {
    north_west: { top: "5%", left: "5%", transform: "translate(0,0)" },
    north: { top: "5%", left: "50%", transform: "translate(-50%,0)" },
    north_east: { top: "5%", right: "5%", transform: "translate(0,0)" },
    west: { top: "50%", left: "5%", transform: "translate(0,-50%)" },
    center: { top: "50%", left: "50%", transform: "translate(-50%,-50%)" },
    east: { top: "50%", right: "5%", transform: "translate(0,-50%)" },
    south_west: { bottom: "5%", left: "5%", transform: "translate(0,0)" },
    south: { bottom: "5%", left: "50%", transform: "translate(-50%,0)" },
    south_east: { bottom: "5%", right: "5%", transform: "translate(0,0)" },
  };
  return map[position] ?? map.south_east;
}

export default function WatermarkPreview({
  imageUrl,
  text,
  position,
  fontSize = 48,
  opacity = 60,
  cloudName,
}: WatermarkPreviewProps) {
  const style = getPreviewStyle(position);
  const watermarkUrl = `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_${fontSize}_bold:${encodeURIComponent(text)},co_white,o_${opacity},g_${position}/fl_layer_apply/${getPublicId(imageUrl)}`;

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden border border-gray-200">
      <img
        src={imageUrl}
        alt="Preview"
        className="w-full h-auto"
        onError={(e) => {
          (e.target as HTMLImageElement).src = imageUrl;
        }}
      />
      {text && (
        <div
          className="absolute pointer-events-none"
          style={{
            ...style,
            color: "white",
            fontSize: `${Math.max(fontSize / 6, 12)}px`,
            fontWeight: "bold",
            textShadow: "0 2px 4px rgba(0,0,0,0.5)",
            opacity: opacity / 100,
            maxWidth: "80%",
            wordBreak: "break-word",
            lineHeight: 1.2,
          }}
        >
          {text}
        </div>
      )}
      <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
        Xem trước watermark
      </div>
    </div>
  );
}

function getPublicId(url: string): string {
  const parts = url.split("/upload/");
  if (parts.length < 2) return url;
  return parts[1].replace(/\.[^.]+$/, "");
}
