import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmailVerificationCode } from "@/lib/mail";

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function POST(request: NextRequest) {
  try {
    const { email, fullName, password } = await request.json();

    const errors: string[] = [];
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email không hợp lệ");
    }
    if (!fullName || fullName.trim().length < 2) {
      errors.push("Họ tên phải có ít nhất 2 ký tự");
    }
    if (!password || password.length < 8) {
      errors.push("Mật khẩu phải có ít nhất 8 ký tự");
    } else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      errors.push("Mật khẩu phải bao gồm cả chữ và số");
    }

    if (errors.length > 0) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email đã được đăng ký" }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: fullName.trim(),
        role: "student",
        isActive: false,
        verificationCode: code,
        verificationCodeExpires: expires,
      },
    });

    await sendEmailVerificationCode(user.email, user.fullName, code).catch((err) => {
      console.error("Failed to send verification email:", err);
    });

    return NextResponse.json(
      { success: true, message: "Mã xác thực đã được gửi đến email của bạn." },
      { status: 201 }
    );
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
