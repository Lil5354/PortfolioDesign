import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { Prisma } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const tab = searchParams.get('tab') || 'all';
    const q = searchParams.get('q') || '';
    const subject = searchParams.get('subject') || '';
    const year = searchParams.get('year') || '';
    const tool = searchParams.get('tool') || '';
    const skip = 0;

    const where: Prisma.ArtworkWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (tab === 'hidden') {
      where.isPublic = false;
      where.isPending = false;
    } else if (tab === 'pending') {
      where.isPending = true;
    } else if (tab === 'highlight') {
      where.isHighlighted = true;
    } else if (tab === 'reported') {
      where.reports = { some: { status: 'pending' } };
    }

    if (subject) {
      where.subject = { contains: subject, mode: 'insensitive' };
    }

    if (year) {
      where.academicYear = { contains: year, mode: 'insensitive' };
    }

    if (tool) {
      where.toolsUsed = { has: tool };
    }

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        include: {
          user: {
            select: { id: true, email: true, fullName: true, studentId: true, role: true, avatarUrl: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: 200,
      }),
      prisma.artwork.count({ where }),
    ]);

    const artworkIds = artworks.map(a => a.id);
    const pendingGroups = await prisma.report.groupBy({
      by: ['artworkId'],
      where: { artworkId: { in: artworkIds }, status: 'pending' },
      _count: { artworkId: true },
    });
    const pendingMap: Record<string, number> = {};
    for (const g of pendingGroups) {
      pendingMap[g.artworkId] = g._count.artworkId;
    }

    const artworksWithPending = artworks.map(a => ({
      ...a,
      _count: { reports: pendingMap[a.id] || 0 },
    }));

    artworksWithPending.sort((a, b) => {
      const aP = a._count.reports;
      const bP = b._count.reports;
      if (bP !== aP) return bP - aP;
      if (b.isPending !== a.isPending) return b.isPending ? 1 : -1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return NextResponse.json({ artworks: artworksWithPending, total, page: 1, limit: 200 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
