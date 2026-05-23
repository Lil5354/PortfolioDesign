import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

interface Params {
  params: { id: string };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth();
    const forwarded = request.headers.get('x-forwarded-for');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : '127.0.0.1';

    const [artwork, comments, grades, likesCount, isLiked] = await Promise.all([
      prisma.artwork.findUnique({
        where: { id: params.id },
        include: {
          user: {
            select: {
              id: true, fullName: true, studentId: true, avatarUrl: true,
              portfolioSettings: { select: { portfolioSlug: true } },
            },
          },
        },
      }),
      prisma.comment.findMany({
        where: { artworkId: params.id },
        orderBy: { createdAt: 'desc' },
        take: 50,
        include: { user: { select: { id: true, fullName: true, avatarUrl: true } } },
      }),
      prisma.grade.findMany({
        where: { artworkId: params.id },
        take: 3,
        include: { lecturer: { select: { id: true, fullName: true, avatarUrl: true } } },
      }),
      prisma.like.count({ where: { artworkId: params.id } }),
      (session
        ? prisma.like.findFirst({ where: { artworkId: params.id, userId: session.user.id } }).then(Boolean)
        : prisma.like.findFirst({ where: { artworkId: params.id, ipAddress: clientIp, userId: null } }).then(Boolean)),
    ]);

    if (!artwork) {
      return NextResponse.json({ error: 'Artwork not found' }, { status: 404 });
    }

    return NextResponse.json({
      ...artwork,
      likeCount: artwork.likeCount ?? likesCount,
      commentCount: comments.length,
      isLiked,
      comments,
      grade: grades.length > 0 ? grades[0] : null,
    });
  } catch (error) {
    console.error("GET /api/artworks/[id] error:", error);
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
      select: { userId: true, collaboratorIds: true, title: true },
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
      'tags', 'collaborators', 'collaboratorIds', 'coverImageUrl', 'watermarkImageUrl', 'fileUrls',
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

    const newCollabIds = body.collaboratorIds || [];
    const oldCollabIds = existing.collaboratorIds || [];
    const addedIds = newCollabIds.filter((id: string) => !oldCollabIds.includes(id));

    if (addedIds.length > 0) {
      const collabUsers = await prisma.user.findMany({
        where: { id: { in: addedIds } },
        select: { id: true },
      });
      const actorName = session.user.name || 'Ai đó';
      for (const cu of collabUsers) {
        await createNotification({
          userId: cu.id,
          type: 'collaborator_tag',
          referenceId: params.id,
          referenceType: 'artwork',
          content: `${actorName} đã thêm bạn làm đồng tác giả của ấn phẩm "${artwork.title}"`,
          actorId: session.user.id,
          actorName,
        });
      }
    }

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
