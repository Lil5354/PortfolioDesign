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

    const entries = await prisma.timelineEntry.findMany({
      where: { userId: setting.userId },
      orderBy: { sortOrder: 'asc' },
    });

    return NextResponse.json(entries);
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
