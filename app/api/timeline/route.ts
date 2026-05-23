import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const entries = await prisma.timelineEntry.findMany({
      where: { userId: session.user.id },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { month, year, title, description, tags, linkUrl, linkLabel, imageUrl } = body;

    if (!month || !year || !title) {
      return NextResponse.json({ error: 'month, year and title are required' }, { status: 400 });
    }

    const maxOrder = await prisma.timelineEntry.aggregate({
      where: { userId: session.user.id },
      _max: { sortOrder: true },
    });

    const entry = await prisma.timelineEntry.create({
      data: {
        userId: session.user.id,
        month,
        year,
        title,
        description: description || '',
        tags: tags || [],
        linkUrl: linkUrl || '',
        linkLabel: linkLabel || '',
        imageUrl: imageUrl || '',
        sortOrder: (maxOrder._max.sortOrder ?? -1) + 1,
      },
    });

    return NextResponse.json(entry, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
