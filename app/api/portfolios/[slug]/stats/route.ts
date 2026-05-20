import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const setting = await prisma.portfolioSetting.findUnique({
      where: { portfolioSlug: slug },
      select: { userId: true, isPortfolioPublic: true },
    });

    if (!setting || !setting.isPortfolioPublic) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const [viewCountResult, likeCountResult, artworkCount] = await Promise.all([
      prisma.artwork.aggregate({
        where: { userId: setting.userId, isPublic: true },
        _sum: { viewCount: true },
      }),
      prisma.artwork.aggregate({
        where: { userId: setting.userId, isPublic: true },
        _sum: { likeCount: true },
      }),
      prisma.artwork.count({
        where: { userId: setting.userId, isPublic: true },
      }),
    ]);

    return NextResponse.json({
      viewCount: viewCountResult._sum.viewCount || 0,
      likeCount: likeCountResult._sum.likeCount || 0,
      artworkCount,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
