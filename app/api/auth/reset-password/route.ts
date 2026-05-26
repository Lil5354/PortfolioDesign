import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const { email, code, password } = await request.json();

    if (!email || !code || !password) {
      return NextResponse.json({ error: "Vui lòng cung cấp đầy đủ thông tin" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Mật khẩu phải có ít nhất 8 ký tự" }, { status: 400 });
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json({ error: "Mật khẩu phải bao gồm cả chữ và số" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: "Email không tồn tại" }, { status: 404 });
    }

    if (!user.resetCode || user.resetCode !== code) {
      return NextResponse.json({ error: "Mã xác thực không chính xác" }, { status: 400 });
    }

    if (!user.resetCodeExpires || new Date() > user.resetCodeExpires) {
      return NextResponse.json({ error: "Mã xác thực đã hết hạn" }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        resetCode: null,
        resetCodeExpires: null,
      },
    });

    return NextResponse.json({ success: true, message: "Mật khẩu đã được đặt lại thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
