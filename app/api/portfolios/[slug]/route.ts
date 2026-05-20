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

    const artworkCount = await prisma.artwork.count({
      where: { userId: setting.userId, isPublic: true },
    });

    const featuredIds = (setting.featuredArtworkIds || []) as string[];
    const featuredArtworks = featuredIds.length > 0
      ? await prisma.artwork.findMany({
          where: { id: { in: featuredIds }, userId: setting.userId },
          select: {
            id: true, title: true, coverImageUrl: true, subject: true,
            toolsUsed: true, likeCount: true, viewCount: true, createdAt: true,
          },
        })
      : [];

    return NextResponse.json({
      user: setting.user,
      portfolioSettings: {
        profileHeadline: setting.profileHeadline,
        socialLinks: setting.socialLinks,
        contactEnabled: setting.contactEnabled,
        showEmail: setting.showEmail,
        displayOrder: setting.displayOrder,
        featuredArtworkIds: setting.featuredArtworkIds,
      },
      stats: { artworkCount },
      featuredArtworks,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
