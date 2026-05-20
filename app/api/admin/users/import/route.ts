import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import type { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user.role !== 'admin' && session.user.role !== 'lecturer')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const { users } = body;

    if (!Array.isArray(users) || users.length === 0) {
      return NextResponse.json({ error: 'users must be a non-empty array' }, { status: 400 });
    }

    const data = users.map((u: { email: string; fullName: string; studentId?: string; role?: string }) => ({
      email: u.email,
      fullName: u.fullName,
      studentId: u.studentId || null,
      role: (u.role || 'student') as Role,
      passwordHash: '',
    }));

    const result = await prisma.user.createMany({
      data,
      skipDuplicates: true,
    });

    return NextResponse.json({ count: result.count });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
