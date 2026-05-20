import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";
import { prisma } from "@/lib/prisma";

export async function PUT(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const sessionToken = cookieStore.get("next-auth.session-token")?.value;
    if (!sessionToken) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const token = await getToken({
      req: { headers: { cookie: `next-auth.session-token=${sessionToken}` } } as any,
      secret: process.env.AUTH_SECRET,
    });
    if (!token?.id) return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });

    const body = await request.json();
    const data: Record<string, string> = {};
    if (body.fullName !== undefined) data.fullName = body.fullName;
    if (body.avatarUrl !== undefined) data.avatarUrl = body.avatarUrl;
    if (Object.keys(data).length === 0) return NextResponse.json({ error: "Không có dữ liệu" }, { status: 400 });
    const updated = await prisma.user.update({
      where: { id: token.id },
      data,
      select: { id: true, email: true, fullName: true, avatarUrl: true },
    });
    return NextResponse.json({ success: true, user: updated });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
