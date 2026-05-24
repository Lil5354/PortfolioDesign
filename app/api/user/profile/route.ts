import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function validateAvatarUrl(url: string): Promise<string | null> {
  try {
    if (url.startsWith('data:')) {
      return null;
    }
    
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return null;
    }
    
    const dangerousPatterns = [
      /\/\/(54KB|base64|data:image|data:application)/i,
      /base64/gi,
      /^data:/i,
    ];
    for (const pattern of dangerousPatterns) {
      if (pattern.test(url)) {
        return null;
      }
    }
    
    return url;
  } catch {
    return null;
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại." }, { status: 401 });
    }

    const body = await request.json();
    const data: Record<string, string> = {};
    if (body.fullName !== undefined) data.fullName = body.fullName;
    
    if (body.avatarUrl !== undefined) {
      const validatedUrl = await validateAvatarUrl(body.avatarUrl);
      if (!validatedUrl) {
        return NextResponse.json({ error: "Invalid avatar URL: only HTTPS URLs allowed, base64 not accepted" }, { status: 400 });
      }
      data.avatarUrl = validatedUrl;
    }
    
    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Không có dữ liệu" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data,
      select: { id: true, email: true, fullName: true, avatarUrl: true },
    });
    
    return NextResponse.json({ success: true, user: updated });
  } catch (e) {
    console.error('PUT /api/user/profile error:', e);
    return NextResponse.json({ error: "Lỗi khi cập nhật thông tin" }, { status: 500 });
  }
}
