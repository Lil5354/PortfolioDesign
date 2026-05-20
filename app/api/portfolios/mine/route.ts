import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let settings = await prisma.portfolioSetting.findUnique({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            avatarUrl: true,
            bio: true,
            role: true,
          },
        },
      },
    });

    if (!settings) {
      settings = await prisma.portfolioSetting.create({
        data: { userId: session.user.id },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
              bio: true,
              role: true,
            },
          },
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { portfolioSlug, profileHeadline, socialLinks, isPortfolioPublic, showEmail, contactEnabled, displayOrder } = body;

    const data: Record<string, unknown> = {};
    if (portfolioSlug !== undefined) data.portfolioSlug = portfolioSlug;
    if (profileHeadline !== undefined) data.profileHeadline = profileHeadline;
    if (socialLinks !== undefined) data.socialLinks = socialLinks;
    if (isPortfolioPublic !== undefined) data.isPortfolioPublic = isPortfolioPublic;
    if (showEmail !== undefined) data.showEmail = showEmail;
    if (contactEnabled !== undefined) data.contactEnabled = contactEnabled;
    if (displayOrder !== undefined) data.displayOrder = displayOrder;

    if (portfolioSlug) {
      const existing = await prisma.portfolioSetting.findUnique({
        where: { portfolioSlug },
      });
      if (existing && existing.userId !== session.user.id) {
        return NextResponse.json({ error: 'Portfolio slug is already taken' }, { status: 400 });
      }
    }

    const settings = await prisma.portfolioSetting.upsert({
      where: { userId: session.user.id },
      update: data,
      create: { userId: session.user.id, ...data },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
