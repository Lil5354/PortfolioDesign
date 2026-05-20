import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '4', 10);

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { subject: true, toolsUsed: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const related = await prisma.artwork.findMany({
      where: {
        id: { not: params.id },
        isPublic: true,
        OR: [
          artwork.subject ? { subject: artwork.subject } : {},
          artwork.toolsUsed.length > 0 ? { toolsUsed: { hasSome: artwork.toolsUsed } } : {},
        ].filter((cond) => Object.keys(cond).length > 0),
      },
      take: limit * 3,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { id: true, fullName: true, studentId: true, avatarUrl: true },
        },
      },
    });

    const shuffled = related.sort(() => Math.random() - 0.5).slice(0, limit);

    return NextResponse.json(shuffled);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
