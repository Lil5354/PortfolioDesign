import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    
    // Nếu không có session, trả về mảng rỗng thay vì lỗi 401
    if (!session) {
      return NextResponse.json([]);
    }

    const items = await prisma.collectionItem.findMany({
      where: { lecturerId: session.user.id },
      include: {
        artwork: {
          select: {
            id: true,
            title: true,
            coverImageUrl: true,
            subject: true,
            likeCount: true,
            createdAt: true,
            user: {
              select: { id: true, fullName: true, avatarUrl: true },
            },
          },
        },
      },
      orderBy: { addedAt: 'desc' },
    });

    const groupedMap = new Map<string, { id: string; name: string; curatorEssay: string | null; theme: string | null; items: { artworkId: string; note: string | null; addedAt: Date; artwork: typeof items[0]['artwork'] }[] }>();

    for (const item of items) {
      const name = item.collectionName || 'Unnamed Collection';
      const key = `${item.lecturerId}::${name}`;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: name,
          name,
          curatorEssay: item.curatorEssay,
          theme: item.theme,
          items: [],
        });
      }
      groupedMap.get(key)!.items.push({
        artworkId: item.artworkId,
        note: item.note,
        addedAt: item.addedAt,
        artwork: item.artwork,
      });
    }

    const collections = Array.from(groupedMap.values());

    return NextResponse.json(collections);
  } catch (error) {
    console.error('GET /api/collections error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { collectionName, curatorEssay, theme } = body;

    if (!collectionName) {
      return NextResponse.json({ error: 'collectionName is required' }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Collection concept created. Use POST /api/collections/[name]/items to add artworks.',
      collectionName,
      curatorEssay: curatorEssay || null,
      theme: theme || null,
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
