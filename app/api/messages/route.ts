import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { createNotification, notifyAdminsAndLecturers } from '@/lib/notifications';

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
    const { recipientSlug, senderName, senderEmail, senderCompany, purpose, content, artworkId, artworkTitle, artworkImage, phone } = body;

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

    let messageContent = content;
    if (purpose === 'order') {
      messageContent = JSON.stringify({
        artworkId,
        artworkTitle,
        artworkImage,
        phone,
        company: senderCompany,
        description: content,
      });
    }

    const message = await prisma.message.create({
      data: {
        recipientId: portfolio.userId,
        senderName,
        senderEmail,
        senderCompany: senderCompany ?? null,
        purpose: purpose ?? null,
        content: messageContent,
      },
    });

    // Create notification for the student (recipient)
    const recipientUser = await prisma.user.findUnique({
      where: { id: portfolio.userId },
      select: { fullName: true },
    });

    let studentNotifContent = '';
    if (purpose === 'order') {
      studentNotifContent = `📦 Đơn đặt hàng mới từ ${senderName} cho ấn phẩm "${artworkTitle || ''}". Hãy kiểm tra hộp thư để xem thông tin khách hàng và liên hệ lại.`;
    } else {
      studentNotifContent = `Tin nhắn mới từ ${senderName}: ${content.substring(0, 100)}`;
    }

    await createNotification({
      userId: portfolio.userId,
      type: purpose === 'order' ? 'new_order' : 'new_message',
      referenceId: artworkId || message.id,
      referenceType: purpose === 'order' ? 'artwork' : 'message',
      content: studentNotifContent,
      actorName: senderName,
    });

    // Notify admins
    let adminNotifContent = '';
    if (purpose === 'order') {
      adminNotifContent = `📦 Đơn đặt hàng mới: ${senderName} muốn đặt ấn phẩm "${artworkTitle || ''}" của ${recipientUser?.fullName || 'sinh viên'}.`;
    } else {
      adminNotifContent = `Tin nhắn mới từ ${senderName} gửi đến ${recipientUser?.fullName || 'sinh viên'}.`;
    }

    await notifyAdminsAndLecturers({
      type: purpose === 'order' ? 'new_order' : 'new_message',
      referenceId: artworkId || message.id,
      referenceType: purpose === 'order' ? 'artwork' : 'message',
      content: adminNotifContent,
      actorName: senderName,
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
