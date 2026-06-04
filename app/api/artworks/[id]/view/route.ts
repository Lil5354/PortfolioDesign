import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface Params {
  params: { id: string };
}

export async function PATCH(_request: NextRequest, { params }: Params) {
  try {
    const artwork = await prisma.artwork.update({
      where: { id: params.id },
      data: { viewCount: { increment: 1 } },
    });
    return NextResponse.json({ viewCount: artwork.viewCount });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
