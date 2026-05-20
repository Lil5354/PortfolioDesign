import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, fullName: true, studentId: true, avatarUrl: true },
        },
        likes: {
          select: { id: true, userId: true, reactionType: true },
        },
        comments: {
          select: { id: true },
        },
        grades: {
          select: { id: true, score: true, comment: true, lecturerId: true, isVisibleToStudent: true, createdAt: true },
        },
      },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const { likes, comments, grades, ...artworkData } = artwork;

    const response = {
      ...artworkData,
      likeCount: artworkData.likeCount ?? likes.length,
      commentCount: artworkData.commentCount ?? comments.length,
      grade: grades.length > 0 ? grades[0] : null,
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const existing = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const allowedFields = [
      'title', 'description', 'toolsUsed', 'subject', 'semester', 'academicYear',
      'tags', 'collaborators', 'coverImageUrl', 'watermarkImageUrl', 'fileUrls',
      'watermarkText', 'watermarkPosition', 'isPublic', 'isHighlighted', 'isAiConfirmed',
    ];

    const data: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        data[field] = body[field];
      }
    }

    const artwork = await prisma.artwork.update({
      where: { id: params.id },
      data,
    });

    return NextResponse.json(artwork);
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

    const existing = await prisma.artwork.findUnique({
      where: { id: params.id },
      select: { userId: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    if (existing.userId !== session.user.id && session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.artwork.delete({ where: { id: params.id } });

    return NextResponse.json({ message: 'Artwork deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
