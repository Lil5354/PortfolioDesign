import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { isPortfolioPublic } = body;

    if (typeof isPortfolioPublic !== 'boolean') {
      return NextResponse.json({ error: 'isPortfolioPublic must be a boolean' }, { status: 400 });
    }

    const settings = await prisma.portfolioSetting.upsert({
      where: { userId: session.user.id },
      update: { isPortfolioPublic },
      create: { userId: session.user.id, isPortfolioPublic },
    });

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
