import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function POST(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { id: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const existingLike = await prisma.like.findFirst({
      where: { artworkId: params.id, userId: session.user.id },
    });

    if (existingLike) {
      return NextResponse.json(existingLike);
    }

    const like = await prisma.like.create({
      data: {
        artworkId: params.id,
        userId: session.user.id,
        reactionType: 'like',
      },
    });

    await prisma.artwork.update({
      where: { id: params.id },
      data: { likeCount: { increment: 1 } },
    });

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existingLike = await prisma.like.findFirst({
      where: { artworkId: params.id, userId: session.user.id },
    });

    if (!existingLike) {
      return NextResponse.json({ error: 'Like not found' }, { status: 404 });
    }

    await prisma.like.delete({ where: { id: existingLike.id } });

    await prisma.artwork.update({
      where: { id: params.id },
      data: { likeCount: { decrement: 1 } },
    });

    return NextResponse.json({ message: 'Like removed successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
