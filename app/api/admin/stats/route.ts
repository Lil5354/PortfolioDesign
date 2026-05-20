import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [publishedArtworks, totalAccounts, totalInteractions] = await Promise.all([
      prisma.artwork.count({ where: { isPublic: true } }),
      prisma.user.count(),
      prisma.like.count(),
    ]);

    return NextResponse.json({
      publishedArtworks,
      reportedArtworks: 0,
      totalAccounts,
      totalInteractions,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
