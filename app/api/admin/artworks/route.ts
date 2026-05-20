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
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const limit = Math.max(1, Math.min(100, parseInt(searchParams.get('limit') || '20', 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.ArtworkWhereInput = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { user: { fullName: { contains: q, mode: 'insensitive' } } },
      ];
    }

    if (tab === 'hidden') {
      where.isPublic = false;
    } else if (tab === 'highlight') {
      where.isHighlighted = true;
    } else if (tab === 'all') {
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
        take: limit,
      }),
      prisma.artwork.count({ where }),
    ]);

    return NextResponse.json({ artworks, total, page, limit });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
