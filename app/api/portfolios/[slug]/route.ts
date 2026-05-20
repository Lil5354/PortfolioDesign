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
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            bio: true,
          },
        },
      },
    });

    if (!setting || !setting.isPortfolioPublic) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const [artworkCount, featuredArtworks] = await Promise.all([
      prisma.artwork.count({
        where: { userId: setting.userId, isPublic: true },
      }),
      prisma.artwork.findMany({
        where: { userId: setting.userId, isPublic: true, isHighlighted: true },
        orderBy: { createdAt: 'desc' },
        take: 6,
        select: {
          id: true,
          title: true,
          coverImageUrl: true,
          subject: true,
          likeCount: true,
          viewCount: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      user: setting.user,
      portfolioSettings: {
        profileHeadline: setting.profileHeadline,
        socialLinks: setting.socialLinks,
        contactEnabled: setting.contactEnabled,
        showEmail: setting.showEmail,
        displayOrder: setting.displayOrder,
      },
      stats: {
        artworkCount,
      },
      featuredArtworks,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
