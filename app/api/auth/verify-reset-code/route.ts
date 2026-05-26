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

    if (!user.resetCode || !user.resetCodeExpires) {
      return NextResponse.json({ error: "Chưa có mã xác thực nào được gửi" }, { status: 400 });
    }

    if (user.resetCode !== code) {
      return NextResponse.json({ error: "Mã xác thực không chính xác" }, { status: 400 });
    }

    if (new Date() > user.resetCodeExpires) {
      return NextResponse.json({ error: "Mã xác thực đã hết hạn" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Mã xác thực hợp lệ" });
  } catch {
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
