import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const artworks = await prisma.artwork.findMany({
      where: { isPublic: true },
      select: { subject: true, coverImageUrl: true },
      orderBy: { createdAt: 'desc' },
    });

    const map: Record<string, string> = {};
    for (const a of artworks) {
      if (a.subject && a.coverImageUrl && !map[a.subject]) {
        map[a.subject] = a.coverImageUrl;
      }
    }

    return NextResponse.json(map);
  } catch {
    return NextResponse.json({});
  }
}
