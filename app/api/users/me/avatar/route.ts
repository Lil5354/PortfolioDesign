import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function validateAvatarUrl(url: string): Promise<string | null> {
  try {
    // Reject data URIs (base64 images)
    if (url.startsWith('data:')) {
      return null;
    }
    
    const urlObj = new URL(url);
    
    // Only allow HTTPS and HTTP URLs
    if (urlObj.protocol !== 'https:' && urlObj.protocol !== 'http:') {
      return null;
    }
    
    // Reject known abusive patterns
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

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { avatarUrl } = body;

    if (!avatarUrl || typeof avatarUrl !== 'string') {
      return NextResponse.json({ error: 'avatarUrl is required' }, { status: 400 });
    }

    const validatedUrl = await validateAvatarUrl(avatarUrl);
    if (!validatedUrl) {
      return NextResponse.json({ error: 'Invalid avatar URL: only HTTPS URLs allowed, base64 not accepted' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: validatedUrl },
      select: { id: true, avatarUrl: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('POST /api/users/me/avatar error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatarUrl: null },
      select: { id: true, avatarUrl: true },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('DELETE /api/users/me/avatar error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
