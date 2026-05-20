import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { isHighlighted } = body;

    if (typeof isHighlighted !== 'boolean') {
      return NextResponse.json({ error: 'isHighlighted must be a boolean' }, { status: 400 });
    }

    const artwork = await prisma.artwork.update({
      where: { id: params.id },
      data: { isHighlighted },
    });

    return NextResponse.json(artwork);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
