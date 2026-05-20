import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string; artworkId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, artworkId } = params;

    const item = await prisma.collectionItem.findFirst({
      where: {
        collectionName: id,
        artworkId,
        lecturerId: session.user.id,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    await prisma.collectionItem.delete({ where: { id: item.id } });

    return NextResponse.json({ message: 'Artwork removed from collection' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; artworkId: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, artworkId } = params;
    const body = await request.json();
    const { note } = body;

    const item = await prisma.collectionItem.findFirst({
      where: {
        collectionName: id,
        artworkId,
        lecturerId: session.user.id,
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    const updated = await prisma.collectionItem.update({
      where: { id: item.id },
      data: {
        ...(note !== undefined && { note }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
