import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tool = searchParams.get('tool');
    const year = searchParams.get('year');
    const sort = searchParams.get('sort') || 'newest';
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '12', 10);

    const where: Record<string, unknown> = { isPublic: true };

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
    const {
      title,
      description,
      toolsUsed,
      subject,
      semester,
      academicYear,
      tags,
      collaborators,
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
        coverImageUrl,
        watermarkImageUrl: watermarkImageUrl || null,
        fileUrls: fileUrls || [],
        watermarkText: watermarkText || null,
        watermarkPosition: watermarkPosition || null,
        isPublic: isPublic !== undefined ? isPublic : true,
        isHighlighted: isHighlighted || false,
        isAiConfirmed: isAiConfirmed || false,
      },
    });

    return NextResponse.json(artwork, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
