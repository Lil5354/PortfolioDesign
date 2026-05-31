import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sections = await prisma.siteSection.findMany({
      orderBy: { sortOrder: 'asc' },
      include: {
        items: { orderBy: { sortOrder: 'asc' }, where: { isActive: true } },
      },
    });
    return NextResponse.json(sections);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const body = await request.json();
    const section = await prisma.siteSection.create({
      data: {
        page: body.page,
        section: body.section,
        label: body.label,
        sortOrder: body.sortOrder || 0,
        isActive: body.isActive !== false,
      },
    });
    return NextResponse.json(section, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
