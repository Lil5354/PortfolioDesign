import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const body = await request.json();
    const { collectionName, artworkId, note } = body;

    const name = collectionName || id;

    if (!artworkId) {
      return NextResponse.json({ error: 'artworkId is required' }, { status: 400 });
    }

    if (!name) {
      return NextResponse.json({ error: 'collectionName is required' }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: artworkId },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const existing = await prisma.collectionItem.findFirst({
      where: {
        lecturerId: session.user.id,
        artworkId,
        collectionName: name,
      },
    });

    if (existing) {
      return NextResponse.json({ error: 'Artwork already in this collection' }, { status: 400 });
    }

    const item = await prisma.collectionItem.create({
      data: {
        lecturerId: session.user.id,
        artworkId,
        collectionName: name,
        note: note || null,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
