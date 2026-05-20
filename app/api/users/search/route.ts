import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') || '';
    if (q.length < 1) return NextResponse.json([]);
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { fullName: { contains: q, mode: 'insensitive' } },
          { email: { contains: q, mode: 'insensitive' } },
        ],
        isActive: true,
      },
      select: { id: true, fullName: true, email: true, avatarUrl: true },
      take: 10,
    });
    return NextResponse.json(users);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
