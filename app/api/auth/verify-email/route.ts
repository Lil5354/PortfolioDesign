import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return NextResponse.json({ error: "Vui lòng cung cấp email và mã xác thực" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: "Email không tồn tại" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Email đã được xác thực" });
    }

    if (!user.verificationCode || !user.verificationCodeExpires) {
      return NextResponse.json({ error: "Chưa có mã xác thực nào được gửi" }, { status: 400 });
    }

    if (user.verificationCode !== code) {
      return NextResponse.json({ error: "Mã xác thực không chính xác" }, { status: 400 });
    }

    if (new Date() > user.verificationCodeExpires) {
      return NextResponse.json({ error: "Mã xác thực đã hết hạn" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: new Date(),
        verificationCode: null,
        verificationCodeExpires: null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, message: "Xác thực email thành công" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
