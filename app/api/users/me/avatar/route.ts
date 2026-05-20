import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarUrl } = body;

    if (!avatarUrl || typeof avatarUrl !== 'string') {
      return NextResponse.json({ error: 'avatarUrl is required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl },
      select: { id: true, avatarUrl: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('POST /api/users/me/avatar error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: null },
      select: { id: true, avatarUrl: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('DELETE /api/users/me/avatar error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
