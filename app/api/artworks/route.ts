import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { createNotification } from '@/lib/notifications';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tool = searchParams.get('tool');
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') || 'newest';
    const userId = searchParams.get('userId');
    const collaboratorId = searchParams.get('collaboratorId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: Record<string, unknown> = {};

    if (collaboratorId) {
      where.collaboratorIds = { has: collaboratorId };
    } else {
      where.isPublic = true;
    }

    if (category) {
      where.subject = category;
    }

    if (tool) {
      where.toolsUsed = { has: tool };
    }

    if (year) {
      where.academicYear = year;
    }

    if (userId) {
      where.userId = userId;
    }

    const secondarySort: Record<string, string> =
      sort === 'most_likes' ? { likeCount: 'desc' } : { createdAt: 'desc' };
    const orderBy = [{ isHighlighted: 'desc' }, secondarySort];

    const [artworks, total] = await Promise.all([
      prisma.artwork.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: {
            select: { id: true, fullName: true, studentId: true, avatarUrl: true },
          },
        },
      }),
      prisma.artwork.count({ where }),
    ]);

    return NextResponse.json({
      artworks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('GET /api/artworks error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined,
    });
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      description,
      toolsUsed,
      subject,
      semester,
      academicYear,
      tags,
      collaborators,
      collaboratorIds,
      coverImageUrl,
      watermarkImageUrl,
      fileUrls,
      watermarkText,
      watermarkPosition,
      isPublic,
      isHighlighted,
      isAiConfirmed,
    } = body;

    if (!title || !coverImageUrl) {
      return NextResponse.json({ error: 'Title and coverImageUrl are required' }, { status: 400 });
    }

    const artwork = await prisma.artwork.create({
      data: {
        userId: session.user.id,
        title,
        description: description || null,
        toolsUsed: toolsUsed || [],
        subject: subject || null,
        semester: semester || null,
        academicYear: academicYear || null,
        tags: tags || [],
        collaborators: collaborators || [],
        collaboratorIds: collaboratorIds || [],
        coverImageUrl,
        watermarkImageUrl: watermarkImageUrl || null,
        fileUrls: fileUrls || [],
        watermarkText: watermarkText || null,
        watermarkPosition: watermarkPosition || null,
        isPublic: false,
        isPending: true,
        isHighlighted: isHighlighted || false,
        isAiConfirmed: isAiConfirmed || false,
      },
    });

    if (collaboratorIds && collaboratorIds.length > 0) {
      const collabUsers = await prisma.user.findMany({
        where: { id: { in: collaboratorIds } },
        select: { id: true },
      });
      const actorName = session.user.name || 'Ai đó';
      for (const cu of collabUsers) {
        await createNotification({
          userId: cu.id,
          type: 'collaborator_tag',
          referenceId: artwork.id,
          referenceType: 'artwork',
          content: `${actorName} đã thêm bạn làm đồng tác giả của ấn phẩm "${artwork.title}"`,
          actorId: session.user.id,
          actorName,
        });
      }
    }

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
