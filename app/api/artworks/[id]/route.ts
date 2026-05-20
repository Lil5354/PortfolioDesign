import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const artwork = await prisma.artwork.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: { id: true, fullName: true, studentId: true, avatarUrl: true },
        },
        comments: {
          orderBy: { createdAt: 'desc' },
          include: {
            user: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
        grades: {
          include: {
            lecturer: { select: { id: true, fullName: true, avatarUrl: true } },
          },
        },
      },
    });

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    const likesCount = await prisma.like.count({ where: { artworkId: params.id } });

    const likeWhere = session
      ? { artworkId: params.id, userId: session.user.id }
      : { artworkId: params.id, ipAddress: clientIp, userId: null };
    const isLiked = await prisma.like.findFirst({ where: likeWhere }).then(Boolean);

    const { comments, grades, ...artworkData } = artwork;

    const response = {
      ...artworkData,
      likeCount: artworkData.likeCount ?? likesCount,
      commentCount: comments.length,
      isLiked,
      comments,
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
