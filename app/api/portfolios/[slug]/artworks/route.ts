import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const setting = await prisma.portfolioSetting.findUnique({
      where: { portfolioSlug: slug },
      select: { userId: true, isPortfolioPublic: true },
    });

    if (!setting || !setting.isPortfolioPublic) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const where: Record<string, unknown> = {
      userId: setting.userId,
      isPublic: true,
    };

    if (tab && tab !== 'all') {
      where.subject = tab;
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          title: true,
          description: true,
          coverImageUrl: true,
          subject: true,
          tags: true,
          likeCount: true,
          viewCount: true,
          createdAt: true,
        },
      }),
      prisma.artwork.count({ where }),
    ]);

    return NextResponse.json({
      artworks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
