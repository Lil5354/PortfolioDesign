import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createNotification } from '@/lib/notifications';

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    const body = await request.json();
    const { senderName, senderEmail, senderCompany, purpose, content } = body;

    if (!senderName || !senderEmail || !content) {
      return NextResponse.json({ error: 'senderName, senderEmail, and content are required' }, { status: 400 });
    }

    const setting = await prisma.portfolioSetting.findUnique({
      where: { portfolioSlug: slug },
      select: { userId: true, isPortfolioPublic: true, contactEnabled: true },
    });

    if (!setting || !setting.isPortfolioPublic) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    if (!setting.contactEnabled) {
      return NextResponse.json({ error: 'Contact form is disabled for this portfolio' }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        recipientId: setting.userId,
        senderName,
        senderEmail,
        senderCompany: senderCompany || null,
        purpose: purpose || null,
        content,
      },
    });

    await createNotification({
      userId: setting.userId,
      type: 'new_message',
      referenceId: message.id,
      referenceType: 'message',
      content: `Bạn có tin nhắn mới từ ${senderName}${senderCompany ? ` (${senderCompany})` : ''}`,
      actorName: senderName,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
