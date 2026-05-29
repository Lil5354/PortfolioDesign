import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || '';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của hệ thống "UEF Design Gallery" — E-Portfolio của Khoa Thiết kế Đồ họa, Trường Đại học Kinh tế - Tài chính TP.HCM (UEF).

THÔNG TIN HỆ THỐNG:
- Sinh viên upload ấn phẩm thiết kế (Poster, Branding, UI/UX, Illustration, 3D, Typography, Photography...)
- Giảng viên chấm điểm (thang 10) và verify ấn phẩm
- Nhà tuyển dụng tìm kiếm tài năng, gửi tin nhắn, đặt hàng ấn phẩm
- Admin quản lý người dùng, bộ sưu tập (collection), xuất tập san PDF

NGƯỜI DÙNG:
- employer/admin: cần tư vấn hệ thống, đề xuất sinh viên xuất sắc, top viral
- student: cần xu hướng thiết kế, kiến thức chuyên ngành, mẹo portfolio
- guest: tìm hiểu về hệ thống

KIẾN THỨC DESIGN TRENDS 2024-2026:
- UI/UX: Glassmorphism, Neubrutalism, Micro-interactions, Dark mode, AI-assisted design tools
- Typography: Variable fonts, Oversized experimental type, Kinetic typography, Serif revival
- Color: Vibrant gradients, Warm earthy tones, Muted palettes, High-contrast accessibility
- Branding: Minimalist logos, Dynamic/fluid identities, Sustainable design, Retro revival
- 3D/Illustration: 3D integration in web, Isometric design, AI-generated art assets
- Tools: Figma, Adobe Firefly, Blender, Spline, Runway ML, Midjourney

QUY TẮC:
- Trả lời bằng tiếng Việt, giọng thân thiện, tự nhiên như người bạn
- Dùng emoji phù hợp
- Trả lời ngắn gọn (2-4 đoạn), súc tích
- Với chào hỏi: chào lại + giới thiệu ngắn + hỏi bạn cần gì
- Với xu hướng TK: 3-5 xu hướng kèm ví dụ, tool gợi ý
- Với feedback portfolio: gợi ý bố cục, màu sắc, typography, target audience
- Với kỹ năng: tips học tập, tài nguyên, lộ trình
- Khi không biết: nói thật và gợi ý hỏi điều khác`;

async function getContext(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { fullName: true, role: true, major: true, department: true, company: true, position: true },
  });
  if (!user) return null;
  return { name: user.fullName, role: user.role, major: user.major, department: user.department, company: user.company, position: user.position };
}

async function getTopStudents(limit = 10) {
  const artworks = await prisma.artwork.findMany({
    where: { isPublic: true, isPending: false },
    include: {
      user: { select: { id: true, fullName: true, avatarUrl: true, major: true, cohort: true } },
      grades: { select: { score: true } },
    },
    orderBy: [{ likeCount: 'desc' }, { viewCount: 'desc' }],
    take: limit,
  });
  return artworks.map((a) => ({
    title: a.title, studentName: a.user.fullName, studentMajor: a.user.major, cohort: a.user.cohort,
    subject: a.subject, toolsUsed: a.toolsUsed, likeCount: a.likeCount, viewCount: a.viewCount,
    avgScore: a.grades.length ? (a.grades.reduce((s, g) => s + Number(g.score), 0) / a.grades.length).toFixed(1) : null,
  }));
}

async function getStudentsBySubject(subject: string, limit = 10) {
  const artworks = await prisma.artwork.findMany({
    where: { subject: { contains: subject, mode: 'insensitive' }, isPublic: true, isPending: false },
    include: {
      user: { select: { id: true, fullName: true, major: true, cohort: true } },
      grades: { select: { score: true } },
    },
    orderBy: [{ likeCount: 'desc' }],
    take: limit,
  });
  const grouped: Record<string, any> = {};
  for (const a of artworks) {
    if (!grouped[a.user.id]) {
      grouped[a.user.id] = { studentName: a.user.fullName, major: a.user.major, cohort: a.user.cohort, artworks: [], totalLikes: 0, scores: [] };
    }
    grouped[a.user.id].artworks.push(a.title);
    grouped[a.user.id].totalLikes += a.likeCount;
    if (a.grades.length) grouped[a.user.id].scores.push(...a.grades.map((g) => Number(g.score)));
  }
  return Object.values(grouped).map((g: any) => ({
    ...g,
    avgScore: g.scores.length ? (g.scores.reduce((a: number, b: number) => a + b, 0) / g.scores.length).toFixed(1) : null,
    scores: undefined,
  })).sort((a: any, b: any) => b.totalLikes - a.totalLikes);
}

async function getViralArtworks(limit = 10) {
  const artworks = await prisma.artwork.findMany({
    where: { isPublic: true, isPending: false },
    include: { user: { select: { fullName: true, major: true } } },
    orderBy: [{ likeCount: 'desc' }, { viewCount: 'desc' }],
    take: limit,
  });
  return artworks.map((a) => ({
    title: a.title, studentName: a.user.fullName, subject: a.subject,
    likeCount: a.likeCount, viewCount: a.viewCount, toolsUsed: a.toolsUsed,
  }));
}

async function getSystemStats() {
  const [studentCount, artworkCount, lecturerCount] = await Promise.all([
    prisma.user.count({ where: { role: 'student', isActive: true } }),
    prisma.artwork.count({ where: { isPublic: true } }),
    prisma.user.count({ where: { role: 'lecturer', isActive: true } }),
  ]);
  const top = await prisma.artwork.findFirst({
    where: { isPublic: true }, orderBy: { likeCount: 'desc' },
    include: { user: { select: { fullName: true } } },
  });
  return {
    totalStudents: studentCount, totalArtworks: artworkCount, totalLecturers: lecturerCount,
    topArtwork: top ? { title: top.title, student: top.user.fullName, likes: top.likeCount } : null,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sessionId, role: clientRole } = body;
    if (!message) {
      return NextResponse.json({ error: 'Vui lòng nhập câu hỏi' }, { status: 400 });
    }

    const session = await auth();
    const userId = session?.user?.id;
    const userRole = session?.user?.role || clientRole || 'guest';
    const context = userId ? await getContext(userId) : null;
    const msg = message.toLowerCase().trim();

    // ==================== FAST-PATH: xử lý nhanh không cần AI ====================

    // Thống kê hệ thống
    if (msg.includes('thống') && (msg.includes('gì') || msg.includes('mục đích') || msg.includes('làm'))) {
      const s = await getSystemStats();
      return NextResponse.json({
        reply: `**UEF Design Gallery** - Hệ thống E-Portfolio Khoa Thiết kế Đồ họa\n\nNền tảng trưng bày ấn phẩm thiết kế, kết nối sinh viên với nhà tuyển dụng, quản lý đánh giá và giám tuyển bộ sưu tập.\n\n📊 Sinh viên: ${s.totalStudents}\n🖼️ Ấn phẩm: ${s.totalArtworks}\n👨‍🏫 Giảng viên: ${s.totalLecturers}${s.topArtwork ? `\n🔥 Top: ${s.topArtwork.title} (${s.topArtwork.student}) - ${s.topArtwork.likes} ❤️` : ''}`
      });
    }

    // Top sinh viên
    if ((msg.includes('top') || msg.includes('giỏi') || msg.includes('xuất sắc') || msg.includes('đề xuất') || msg.includes('nổi bật')) &&
        (msg.includes('sinh viên') || msg.includes('student'))) {
      const students = await getTopStudents();
      if (!students.length) return NextResponse.json({ reply: 'Chưa có dữ liệu sinh viên.' });
      return NextResponse.json({
        reply: '🏆 **Top sinh viên nổi bật:**\n\n' +
          students.map((s, i) =>
            `${i + 1}. **${s.studentName}**${s.studentMajor ? ` (${s.studentMajor})` : ''}\n  📌 ${s.title} | ❤️ ${s.likeCount} 👁️ ${s.viewCount}${s.avgScore ? ` ⭐ ${s.avgScore}/10` : ''}`
          ).join('\n\n')
      });
    }

    // Viral
    if (msg.includes('viral') || msg.includes('hot') || (msg.includes('nhiều') && msg.includes('thích'))) {
      const viral = await getViralArtworks();
      if (!viral.length) return NextResponse.json({ reply: 'Chưa có dữ liệu.' });
      return NextResponse.json({
        reply: '🔥 **Ấn phẩm viral nhất:**\n\n' +
          viral.map((a, i) =>
            `${i + 1}. **${a.title}** - ${a.studentName}\n  ❤️ ${a.likeCount} likes | 👁️ ${a.viewCount} views`
          ).join('\n\n')
      });
    }

    // Subject-based
    const subjects = ['poster', 'branding', 'ui/ux', 'illustration', 'typography', '3d', 'packaging', 'editorial', 'photography'];
    const matched = subjects.find(s => msg.includes(s));
    if (matched) {
      const students = await getStudentsBySubject(matched);
      if (!students.length) return NextResponse.json({ reply: `Chưa có sinh viên nào chuyên ${matched}.` });
      return NextResponse.json({
        reply: `🎨 **Sinh viên chuyên ${matched.toUpperCase()}:**\n\n` +
          students.map((s, i) =>
            `${i + 1}. **${s.studentName}**${s.major ? ` (${s.major})` : ''}\n  🖼️ ${s.artworks.join(', ')} | ❤️ ${s.totalLikes}${s.avgScore ? ` ⭐ ${s.avgScore}/10` : ''}`
          ).join('\n\n')
      });
    }

    // ==================== FALLBACK: GỌI AI ====================

    let aiReply = null;

    // Thử Gemini (free) trước
    const GEMINI_KEY = process.env.GEMINI_API_KEY || '';
    if (GEMINI_KEY) {
      try {
        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_KEY}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\n\nUser: ${message}\n\nAssistant:` }] }],
            generationConfig: { temperature: 0.8, maxOutputTokens: 800 },
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          aiReply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        } else {
          const err = await geminiRes.text();
          console.error('Gemini error:', geminiRes.status, err.slice(0, 200));
        }
      } catch (e) { console.error('Gemini fetch error:', e.message); }
    }

    // Fallback OpenAI (nếu Gemini fail)
    if (!aiReply && OPENAI_API_KEY) {
      try {
        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [{ role: 'system', content: SYSTEM_PROMPT }, { role: 'user', content: message }],
            temperature: 0.7, max_tokens: 800,
          }),
          signal: AbortSignal.timeout(15000),
        });
        if (openaiRes.ok) {
          const data = await openaiRes.json();
          aiReply = data.choices?.[0]?.message?.content;
        }
      } catch {}
    }

    if (aiReply) return NextResponse.json({ reply: aiReply });

    // Fallback N8N (nếu có config)
    if (N8N_WEBHOOK_URL) {
      try {
        const n8nRes = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(N8N_API_KEY ? { 'X-N8N-API-Key': N8N_API_KEY } : {}) },
          body: JSON.stringify({ message, sessionId, role: userRole, userId, context }),
          signal: AbortSignal.timeout(8000),
        });
        if (n8nRes.ok) {
          const data = await n8nRes.json();
          aiReply = data.output || data.reply || data.response;
          if (aiReply) return NextResponse.json({ reply: aiReply });
        }
      } catch {}
    }

    // Final fallback
    const s = await getSystemStats();
    return NextResponse.json({
      reply: `Xin chào! Mình là trợ lý của UEF Design Gallery 👋\n\nMình có thể giúp bạn:\n- Tra cứu sinh viên theo chuyên môn: "Sinh viên chuyên Poster"\n- Top sinh viên: "Đề xuất sinh viên giỏi nhất"\n- Bài viết viral: "Top bài viết hot"\n- Kiến thức thiết kế: "Xu hướng UI/UX 2025?"\n\nHiện tại hệ thống có ${s.totalStudents} sinh viên và ${s.totalArtworks} ấn phẩm. Bạn muốn tìm hiểu gì trước?`
    });

  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json({ reply: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau!' });
  }
}
