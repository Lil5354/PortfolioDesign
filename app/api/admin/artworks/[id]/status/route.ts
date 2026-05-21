import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== 'boolean') {
      return NextResponse.json({ error: 'isPublic must be a boolean' }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { id: true, title: true, userId: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const updated = await prisma.artwork.update({
      where: { id: params.id },
      data: {
        isPublic,
        ...(isPublic ? { isPending: false } : {}),
      },
    });

    if (isPublic) {
      await createNotification({
        userId: artwork.userId,
        type: 'artwork_approved',
        referenceId: params.id,
        referenceType: 'artwork',
        content: `Ấn phẩm "${artwork.title}" của bạn đã được phê duyệt và hiển thị công khai`,
        actorId: session.user.id,
        actorName: session.user.name || undefined,
      });
    } else {
      await createNotification({
        userId: artwork.userId,
        type: 'artwork_hidden',
        referenceId: params.id,
        referenceType: 'artwork',
        content: `Ấn phẩm "${artwork.title}" của bạn đã bị ẩn`,
        actorId: session.user.id,
        actorName: session.user.name || undefined,
      });
    }

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
