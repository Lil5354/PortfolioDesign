import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

interface Params {
  params: { id: string };
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0].trim();
  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp;
  return '127.0.0.1';
}

export async function POST(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const ip = getClientIp(request);

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { id: true, title: true, userId: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const where = session
      ? { artworkId: params.id, userId: session.user.id }
      : { artworkId: params.id, ipAddress: ip, userId: null };

    const existingLike = await prisma.like.findFirst({ where });

    if (existingLike) {
      return NextResponse.json(existingLike);
    }

    const like = await prisma.like.create({
      data: {
        artworkId: params.id,
        userId: session?.user?.id || null,
        ipAddress: session ? null : ip,
        reactionType: 'like',
      },
    });

    await prisma.artwork.update({
      where: { id: params.id },
      data: { likeCount: { increment: 1 } },
    });

    if (session && session.user.id !== artwork.userId) {
      await createNotification({
        userId: artwork.userId,
        type: 'new_like',
        referenceId: params.id,
        referenceType: 'artwork',
        content: `${session.user.name || 'Ai đó'} đã thích ấn phẩm "${artwork.title}" của bạn`,
        actorId: session.user.id,
        actorName: session.user.name || undefined,
      });
    }

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const ip = getClientIp(request);

    const where = session
      ? { artworkId: params.id, userId: session.user.id }
      : { artworkId: params.id, ipAddress: ip, userId: null };

    const existingLike = await prisma.like.findFirst({ where });

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
