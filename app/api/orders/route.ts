import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    const where = {
      purpose: 'order',
      ...(status === 'read' ? { isRead: true } : {}),
      ...(status === 'unread' ? { isRead: false } : {}),
    };

    const [orders, total] = await Promise.all([
      prisma.message.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
        include: {
          recipient: {
            select: { id: true, fullName: true, email: true, avatarUrl: true },
          },
        },
      }),
      prisma.message.count({ where }),
    ]);

    const parsed = orders.map(order => {
      let parsedContent = {};
      try {
        parsedContent = JSON.parse(order.content);
      } catch {}
      return {
        ...order,
        orderData: parsedContent,
      };
    });

    return NextResponse.json({ orders: parsed, total });
  } catch (error) {
    console.error('GET /api/orders error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
