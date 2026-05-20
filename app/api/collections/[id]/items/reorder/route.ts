import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function PUT(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ message: 'Reorder is not supported yet' });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
