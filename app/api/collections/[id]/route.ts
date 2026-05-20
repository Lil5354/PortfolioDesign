import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const item = await prisma.collectionItem.findUnique({
      where: { id },
      include: {
        artwork: {
          include: {
            user: {
              select: { id: true, fullName: true, studentId: true, avatarUrl: true },
            },
          },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    if (item.lecturerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json(item);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
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
    const { collectionName, curatorEssay, theme } = body;

    const existing = await prisma.collectionItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    if (existing.lecturerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const updated = await prisma.collectionItem.update({
      where: { id },
      data: {
        ...(collectionName !== undefined && { collectionName }),
        ...(curatorEssay !== undefined && { curatorEssay }),
        ...(theme !== undefined && { theme }),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;

    const existing = await prisma.collectionItem.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Collection item not found' }, { status: 404 });
    }

    if (existing.lecturerId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.collectionItem.delete({ where: { id } });

    return NextResponse.json({ message: 'Collection item deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
