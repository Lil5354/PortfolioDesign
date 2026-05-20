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

const cloudName = () => process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "";

export function buildWatermarkUrl(
  publicId: string,
  text: string,
  position: WatermarkPosition,
  options?: { fontSize?: number; opacity?: number; color?: string }
): string {
  const fontSize = options?.fontSize ?? 48;
  const opacity = options?.opacity ?? 60;
  const color = options?.color ?? "white";
  const encodedText = encodeURIComponent(text);
  return `https://res.cloudinary.com/${cloudName()}/image/upload/l_text:Arial_${fontSize}_bold:${encodedText},co_${color},o_${opacity},g_${position}/fl_layer_apply/${publicId}`;
}

export function buildWatermarkPreviewUrl(
  imageUrl: string,
  text: string,
  position: WatermarkPosition,
  options?: { fontSize?: number; opacity?: number; color?: string }
): string {
  const fontSize = options?.fontSize ?? 48;
  const opacity = options?.opacity ?? 60;
  const color = options?.color ?? "white";
  const encodedText = encodeURIComponent(text);
  return `https://res.cloudinary.com/${cloudName()}/image/upload/l_text:Arial_${fontSize}_bold:${encodedText},co_${color},o_${opacity},g_${position}/fl_layer_apply/${imageUrl}`;
}
