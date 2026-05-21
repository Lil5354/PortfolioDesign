import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signIn } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      return NextResponse.json({ error: 'Email không tồn tại trong hệ thống' }, { status: 401 });
    }

    if (!user.isActive) {
      return NextResponse.json({ error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' }, { status: 403 });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Mật khẩu không chính xác' }, { status: 401 });
    }

    const result = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      return NextResponse.json({ error: 'Đăng nhập thất bại, vui lòng thử lại' }, { status: 401 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.fullName,
        email: user.email,
        image: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'Lỗi máy chủ, vui lòng thử lại sau' }, { status: 500 });
  }
}
