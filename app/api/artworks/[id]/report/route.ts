import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { violationType, detail } = body;

    if (!violationType) {
      return NextResponse.json({ error: 'Vui lòng chọn loại vi phạm' }, { status: 400 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
    });
    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const report = await prisma.report.create({
      data: {
        artworkId: params.id,
        userId: session.user.id,
        violationType,
        detail: detail || null,
      },
    });

    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
