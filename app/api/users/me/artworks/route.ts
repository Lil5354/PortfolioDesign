import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const artworks = await prisma.artwork.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(artworks);
  } catch (error) {
    console.error('GET /api/users/me/artworks error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
