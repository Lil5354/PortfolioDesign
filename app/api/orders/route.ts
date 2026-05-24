import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.message.findMany({
        where: { purpose: 'order' },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          recipient: {
            select: {
              fullName: true,
              email: true,
            },
          },
          sender: true,
        },
      }),
      prisma.message.count({ where: { purpose: 'order' } }),
    ]);

    return NextResponse.json({
      orders: orders.map(order => ({
        id: order.id,
        recipientId: order.recipientId,
        senderName: order.senderName,
        senderEmail: order.senderEmail,
        senderCompany: order.senderCompany ?? null,
        purpose: order.purpose,
        content: order.content,
        isRead: order.isRead,
        createdAt: order.createdAt,
        recipient: order.recipient,
        sender: order.sender,
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
