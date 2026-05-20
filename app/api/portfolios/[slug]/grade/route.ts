import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    const setting = await prisma.portfolioSetting.findUnique({
      where: { portfolioSlug: slug },
      select: { userId: true, isPortfolioPublic: true },
    });

    if (!setting || !setting.isPortfolioPublic) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    const latestGrade = await prisma.grade.findFirst({
      where: {
        artwork: { userId: setting.userId },
        isVisibleToStudent: true,
      },
      orderBy: { createdAt: 'desc' },
      include: {
        artwork: {
          select: { id: true, title: true },
        },
        lecturer: {
          select: { id: true, fullName: true },
        },
      },
    });

    return NextResponse.json(latestGrade ? { grade: latestGrade } : { grade: null });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
