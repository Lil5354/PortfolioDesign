import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

interface Params {
  params: { id: string };
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'lecturer' && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: only lecturers and admins can grade' }, { status: 403 });
    }

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { id: true, title: true, userId: true },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const body = await request.json();
    const { score, comment } = body;

    if (score === undefined || score === null) {
      return NextResponse.json({ error: 'Score is required' }, { status: 400 });
    }

    const existing = await prisma.grade.findFirst({
      where: { artworkId: params.id, lecturerId: session.user.id },
    });

    const grade = existing
      ? await prisma.grade.update({
          where: { id: existing.id },
          data: { score, comment: comment || null },
        })
      : await prisma.grade.create({
          data: {
            artworkId: params.id,
            lecturerId: session.user.id,
            score,
            comment: comment || null,
          },
        });

    await createNotification({
      userId: artwork.userId,
      type: 'grade_updated',
      referenceId: params.id,
      referenceType: 'artwork',
      content: `${session.user.name || 'Giảng viên'} đã chấm điểm ấn phẩm "${artwork.title}" với điểm ${score}/10`,
      actorId: session.user.id,
      actorName: session.user.name || undefined,
    });

    return NextResponse.json(grade);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
