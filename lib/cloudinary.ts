import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export type WatermarkPosition =
  | "north_west"
  | "north"
  | "north_east"
  | "west"
  | "center"
  | "east"
  | "south_west"
  | "south"
  | "south_east";

export const WATERMARK_POSITIONS: {
  label: string;
  value: WatermarkPosition;
}[] = [
  { label: "Góc trên trái", value: "north_west" },
  { label: "Trên giữa", value: "north" },
  { label: "Góc trên phải", value: "north_east" },
  { label: "Giữa trái", value: "west" },
  { label: "Trung tâm", value: "center" },
  { label: "Giữa phải", value: "east" },
  { label: "Góc dưới trái", value: "south_west" },
  { label: "Dưới giữa", value: "south" },
  { label: "Góc dưới phải", value: "south_east" },
];

export function buildWatermarkUrl(
  publicId: string,
  text: string,
  position: WatermarkPosition,
  options?: { fontSize?: number; opacity?: number; color?: string }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const fontSize = options?.fontSize ?? 48;
  const opacity = options?.opacity ?? 60;
  const color = options?.color ?? "white";

  const encodedText = encodeURIComponent(text);

  return `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_${fontSize}_bold:${encodedText},co_${color},o_${opacity},g_${position}/fl_layer_apply/${publicId}`;
}

export function buildWatermarkPreviewUrl(
  imageUrl: string,
  text: string,
  position: WatermarkPosition,
  options?: { fontSize?: number; opacity?: number; color?: string }
): string {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const fontSize = options?.fontSize ?? 48;
  const opacity = options?.opacity ?? 60;
  const color = options?.color ?? "white";

  const encodedText = encodeURIComponent(text);

  return `https://res.cloudinary.com/${cloudName}/image/upload/l_text:Arial_${fontSize}_bold:${encodedText},co_${color},o_${opacity},g_${position}/fl_layer_apply/${imageUrl}`;
}

export function generateSignature(
  folder?: string,
  publicId?: string
): { timestamp: number; signature: string } {
  const timestamp = Math.round(Date.now() / 1000);
  const params: Record<string, string | number> = {
    timestamp,
    source: "uw",
    folder: folder || "artworks",
  };
  if (publicId) {
    params.public_id = publicId;
  }

  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET!
  );

  return { timestamp, signature };
}
