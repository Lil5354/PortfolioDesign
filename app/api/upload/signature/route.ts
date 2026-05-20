import { generateSignature } from "@/lib/cloudinary";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;

  if (!cloudName || !apiKey) {
    return NextResponse.json(
      { error: "Cloudinary not configured" },
      { status: 500 }
    );
  }

  const folder = request.nextUrl.searchParams.get("folder") || "artworks";
  const { timestamp, signature } = generateSignature(folder);

  return NextResponse.json({
    timestamp,
    signature,
    cloudName,
    apiKey,
    folder,
  });
}
