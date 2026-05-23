import { NextRequest, NextResponse } from "next/server";
import { auth } from '@/lib/auth';
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Phiên đăng nhập hết hạn" }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, string> = {};
    if (body.fullName !== undefined) data.fullName = body.fullName;
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "Không có dữ liệu" }, { status: 400 });

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, email: true, fullName: true, avatarUrl: true },
    });
    return NextResponse.json({ success: true, user: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
