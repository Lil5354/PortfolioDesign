import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden: you can only update your own artwork visibility' }, { status: 403 });
    }

    const body = await request.json();

    if (typeof body.isPublic !== 'boolean') {
      return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
    }

    const artwork = await prisma.artwork.update({
      where: { id: params.id },
      data: { isPublic: body.isPublic },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
