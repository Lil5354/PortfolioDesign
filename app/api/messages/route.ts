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
    const session = await auth();
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

    const authorUser = await prisma.user.findUnique({
      where: { id: portfolio.userId },
      select: { id: true, fullName: true },
    });

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

    if (purpose === 'order') {
      // 1. Notification for the buyer (sender) - confirmation
      if (session?.user?.id) {
        await createNotification({
          userId: session.user.id,
          type: 'new_order',
          referenceId: artworkId || message.id,
          referenceType: 'artwork',
          content: `Yêu cầu đặt ấn phẩm "${artworkTitle || ''}" đã được gửi đến tác giả ${authorUser?.fullName || 'sinh viên'}. Vui lòng chờ phản hồi qua email hoặc số điện thoại bạn đã cung cấp.`,
          actorName: senderName,
        });
      }

      // 2. Notification for the author (recipient)
      await createNotification({
        userId: portfolio.userId,
        type: 'new_order',
        referenceId: artworkId || message.id,
        referenceType: 'message',
        content: `Đơn đặt hàng ấn phẩm "${artworkTitle || ''}" từ ${senderName}${senderCompany ? ` (${senderCompany})` : ''}. Vui lòng kiểm tra hộp thư và liên hệ với khách hàng qua email: ${senderEmail}${phone ? `, SĐT: ${phone}` : ''}.`,
        actorName: senderName,
      });

      // 3. Notification for admins
      await notifyAdminsAndLecturers({
        type: 'new_order',
        referenceId: artworkId || message.id,
        referenceType: 'artwork',
        content: `Đơn đặt hàng mới: ${senderName} đã đặt ấn phẩm "${artworkTitle || ''}" của ${authorUser?.fullName || 'sinh viên'} (${senderEmail}).`,
        actorName: senderName,
      });
    } else {
      // Regular message notifications
      await createNotification({
        userId: portfolio.userId,
        type: 'new_message',
        referenceId: message.id,
        referenceType: 'message',
        content: `Tin nhắn mới từ ${senderName}: ${content.substring(0, 100)}`,
        actorName: senderName,
      });

      await notifyAdminsAndLecturers({
        type: 'new_message',
        referenceId: message.id,
        referenceType: 'message',
        content: `Tin nhắn mới từ ${senderName} gửi đến ${authorUser?.fullName || 'sinh viên'}.`,
        actorName: senderName,
      });
    }

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('POST /api/messages error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
