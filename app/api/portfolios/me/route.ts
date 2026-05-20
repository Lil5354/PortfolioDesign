import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, fullName: true, email: true, avatarUrl: true, bio: true, studentId: true },
    });

    const setting = await prisma.portfolioSetting.findUnique({
      where: { userId },
    });

    const [artworkCount, totalViews, totalLikes, allArtworks] = await Promise.all([
      prisma.artwork.count({ where: { userId, isPublic: true } }),
      prisma.artwork.aggregate({ where: { userId, isPublic: true }, _sum: { viewCount: true } }),
      prisma.artwork.aggregate({ where: { userId, isPublic: true }, _sum: { likeCount: true } }),
      prisma.artwork.findMany({
        where: { userId, isPublic: true },
        orderBy: { createdAt: 'desc' },
        select: { id: true, title: true, coverImageUrl: true, subject: true, toolsUsed: true, likeCount: true, viewCount: true, createdAt: true, isPublic: true },
      }),
    ]);

    const featuredIds = (setting?.featuredArtworkIds || []) as string[];
    const featuredArtworks = featuredIds.length > 0
      ? allArtworks.filter(a => featuredIds.includes(a.id))
      : allArtworks.slice(0, 6);

    return NextResponse.json({
      user,
      portfolioSettings: {
        portfolioSlug: setting?.portfolioSlug || null,
        profileHeadline: setting?.profileHeadline || `${user?.fullName || 'Student'} · Design Portfolio`,
        socialLinks: setting?.socialLinks || {},
        contactEnabled: setting?.contactEnabled ?? true,
        showEmail: setting?.showEmail ?? false,
        displayOrder: setting?.displayOrder || 'newest',
        featuredArtworkIds: setting?.featuredArtworkIds || [],
      },
      stats: {
        artworkCount,
        viewCount: totalViews._sum.viewCount || 0,
        likeCount: totalLikes._sum.likeCount || 0,
      },
      featuredArtworks,
      allArtworks,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
