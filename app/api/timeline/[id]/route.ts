import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.timelineEntry.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const body = await request.json();
    const { month, year, title, description, tags, linkUrl, linkLabel, imageUrl } = body;

    const data: Record<string, unknown> = {};
    if (month !== undefined) data.month = month;
    if (year !== undefined) data.year = year;
    if (title !== undefined) data.title = title;
    if (description !== undefined) data.description = description;
    if (tags !== undefined) data.tags = tags;
    if (linkUrl !== undefined) data.linkUrl = linkUrl;
    if (linkLabel !== undefined) data.linkLabel = linkLabel;
    if (imageUrl !== undefined) data.imageUrl = imageUrl;

    const updated = await prisma.timelineEntry.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.timelineEntry.findUnique({
      where: { id: params.id },
    });

    if (!existing || existing.userId !== session.user.id) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    await prisma.timelineEntry.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
