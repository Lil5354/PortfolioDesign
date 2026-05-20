import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function PUT(_request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Not implemented. Install bcrypt to enable password changes.' },
      { status: 501 }
    );
  } catch (error) {
    console.error('PUT /api/users/me/password error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
