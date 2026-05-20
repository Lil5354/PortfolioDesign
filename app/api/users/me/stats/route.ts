import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    const [totalArtworks, aggregateLikes, publicArtworks] = await Promise.all([
      prisma.artwork.count({ where: { userId } }),
      prisma.artwork.aggregate({
        where: { userId },
        _sum: { likeCount: true },
      }),
      prisma.artwork.count({ where: { userId, isPublic: true } }),
    ]);

    const totalViews = 0;

    return NextResponse.json({
      totalArtworks,
      totalViews,
      totalLikes: aggregateLikes._sum.likeCount ?? 0,
      publicArtworks,
    });
  } catch (error) {
    console.error('GET /api/users/me/stats error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
