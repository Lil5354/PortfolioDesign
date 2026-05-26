import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmailVerificationCode } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email không hợp lệ" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user) {
      return NextResponse.json({ error: "Email không tồn tại trong hệ thống" }, { status: 404 });
    }

    if (user.emailVerified) {
      return NextResponse.json({ success: true, message: "Email đã được xác thực trước đó" });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationCode: code, verificationCodeExpires: expires },
    });

    try {
      await sendEmailVerificationCode(user.email, user.fullName, code);
    } catch (err) {
      console.error("Failed to send verification email:", err);
      return NextResponse.json({ error: "Không thể gửi email xác thực. Vui lòng thử lại sau." }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Mã xác thực đã được gửi đến email của bạn." });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
