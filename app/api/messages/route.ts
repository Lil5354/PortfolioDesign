import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: { recipientId: session.user.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('GET /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientSlug, senderName, senderEmail, senderCompany, purpose, content } = body;

    if (!recipientSlug || !senderName || !senderEmail || !content) {
      return NextResponse.json(
        { error: 'recipientSlug, senderName, senderEmail, and content are required' },
        { status: 400 }
      );
    }

    const portfolio = await prisma.portfolioSetting.findUnique({
      where: { portfolioSlug: recipientSlug },
      select: { userId: true },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'Recipient not found' }, { status: 404 });
    }

    const message = await prisma.message.create({
      data: {
        recipientId: portfolio.userId,
        senderName,
        senderEmail,
        senderCompany: senderCompany ?? null,
        purpose: purpose ?? null,
        content,
      },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
