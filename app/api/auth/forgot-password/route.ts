import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetCode } from "@/lib/mail";

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
      return NextResponse.json({ success: true, message: "Nếu email tồn tại, mã đặt lại sẽ được gửi." });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetCode: code, resetCodeExpires: expires },
    });

    await sendPasswordResetCode(user.email, user.fullName, code).catch((err) => {
      console.error("Failed to send email:", err);
    });

    return NextResponse.json({ success: true, message: "Mã xác thực đã được gửi đến email của bạn." });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
