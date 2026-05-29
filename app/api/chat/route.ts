import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// AI Providers — chỉ cần config 1 trong 2:
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || '';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const AI_PROVIDER = process.env.AI_PROVIDER || 'openai'; // 'openai' | 'gemini'
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || 'http://localhost:5678/webhook/uef-chatbot';
const N8N_API_KEY = process.env.N8N_API_KEY || '';

const SYSTEM_PROMPT = `Bạn là trợ lý AI của hệ thống "UEF Design Gallery" — E-Portfolio của Khoa Thiết kế Đồ họa, Trường Đại học Kinh tế - Tài chính TP.HCM (UEF).

THÔNG TIN HỆ THỐNG:
- Sinh viên upload ấn phẩm thiết kế (Poster, Branding, UI/UX, Illustration, 3D, Typography, Photography...)
- Giảng viên chấm điểm (thang 10) và verify ấn phẩm
- Nhà tuyển dụng tìm kiếm tài năng, gửi tin nhắn, đặt hàng ấn phẩm
- Admin quản lý người dùng, bộ sưu tập (collection), xuất tập san PDF

NGƯỜI DÙNG:
- employer/admin → cần tư vấn hệ thống, đề xuất sinh viên xuất sắc, top viral
- student → cần xu hướng thiết kế, kiến thức chuyên ngành, mẹo portfolio
- guest → tìm hiểu về hệ thống

KIẾN THỨC DESIGN TRENDS 2024-2026:
- UI/UX: Glassmorphism, Neubrutalism, Micro-interactions, Dark mode, AI-assisted design tools, Responsive typography
- Typography: Variable fonts, Oversized experimental type, Kinetic typography, Serif revival
- Color: Vibrant gradients, Warm earthy tones, Muted palettes, High-contrast accessibility
- Branding: Minimalist logos, Dynamic/fluid identities, Sustainable design, Retro revival
- 3D/Illustration: 3D integration in web, Isometric design, AI-generated art assets, 2.5D parallax
- Tools: Figma (AI features), Adobe Firefly, Blender, Spline, Runway ML, Midjourney

QUY TẮC TRẢ LỜI:
- Trả lời bằng tiếng Việt, giọng thân thiện, chuyên nghiệp
- Dùng emoji phù hợp để tăng sinh động
- Với câu hỏi chào hỏi (xin chào, hello, hi): chào lại + giới thiệu ngắn gọn + hỏi bạn cần gì
- Với câu hỏi về xu hướng TK: đưa 3-5 xu hướng kèm ví dụ cụ thể, tool gợi ý
- Với câu hỏi feedback portfolio: gợi ý cụ thể về bố cục, màu sắc, typography, target audience
- Với câu hỏi về kỹ năng: chia sẻ tips học tập, tài nguyên, lộ trình
- KHÔNG nói "tôi là AI" quá máy móc, hãy tự nhiên như 1 người bạn
- Trả lời ngắn gọn, súc tích (2-4 đoạn), không quá dài dòng
- Khi không biết: thành thật nói không biết và gợi ý hỏi điều khác`;

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

async function getTopViral(limit = 10) {
  const artworks = await prisma.artwork.findMany({
    where: { isPublic: true, isPending: false },
    include: { user: { select: { fullName: true, major: true } } },
    orderBy: [{ likeCount: 'desc' }, { viewCount: 'desc' }],
    take: limit,
  });
  return artworks.map((a) => ({
    title: a.title, studentName: a.user.fullName, subject: a.subject, likeCount: a.likeCount, viewCount: a.viewCount, toolsUsed: a.toolsUsed,
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

async function getSystemInfo() {
  const [studentCount, artworkCount, lecturerCount] = await Promise.all([
    prisma.user.count({ where: { role: 'student', isActive: true } }),
    prisma.artwork.count({ where: { isPublic: true } }),
    prisma.user.count({ where: { role: 'lecturer', isActive: true } }),
  ]);
  const topArtwork = await prisma.artwork.findFirst({
    where: { isPublic: true }, orderBy: { likeCount: 'desc' },
    include: { user: { select: { fullName: true } } },
  });
  return {
    systemName: 'UEF Design Gallery - Hệ thống E-Portfolio Khoa Thiết kế Đồ họa',
    totalStudents: studentCount, totalPublicArtworks: artworkCount, totalLecturers: lecturerCount,
    topArtwork: topArtwork ? { title: topArtwork.title, student: topArtwork.user.fullName, likes: topArtwork.likeCount } : null,
    description: 'Nền tảng trưng bày ấn phẩm thiết kế, kết nối sinh viên với nhà tuyển dụng, quản lý đánh giá và giám tuyển bộ sưu tập.',
  };
}

async function queryByTimeline(limit = 20) {
  const entries = await prisma.timelineEntry.findMany({
    where: { user: { role: 'student' } },
    include: { user: { select: { fullName: true, major: true } } },
    orderBy: [{ year: 'desc' }, { sortOrder: 'asc' }],
    take: limit,
  });
  return entries.map((e) => ({
    studentName: e.user.fullName, title: e.title, description: e.description,
    month: e.month, year: e.year, tags: e.tags, linkUrl: e.linkUrl,
  }));
}

async function callAI(messages: { role: string; content: string }[], userRole: string) {
  const systemMsg = { role: 'system', content: SYSTEM_PROMPT.replace('employer/admin', userRole) };

  // Try OpenAI first
  if (AI_PROVIDER === 'openai' && OPENAI_API_KEY) {
    try {
      const res = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [systemMsg, ...messages],
          temperature: 0.7,
          max_tokens: 800,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = await res.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) return reply;
      }
    } catch {}
  }

  // Fallback: Google Gemini (free)
  if (GEMINI_API_KEY) {
    try {
      const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${SYSTEM_PROMPT.replace('employer/admin', userRole)}\n\nUser: ${messages.map(m => m.content).join('\n')}\n\nAssistant:` }]
          }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 600 },
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (geminiRes.ok) {
        const geminiData = await geminiRes.json();
        const reply = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) return reply;
      }
    } catch {}
  }

  return null;
}

async function callN8N(message: string, sessionId: string, userRole: string, userId: string | undefined, context: any) {
  const res = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(N8N_API_KEY ? { 'X-N8N-API-Key': N8N_API_KEY } : {}) },
    body: JSON.stringify({ message, sessionId, role: userRole, user: context, userId }),
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  const data = await res.json();
  return data.output || data.reply || data.response || null;
}

const FALLBACK_TEMPLATES = [
  (info: any) => `Xin chào! 👋 Mình là trợ lý của **${info.systemName}**.

Mình có thể giúp bạn:
• 🔍 Tra cứu sinh viên theo chuyên môn: "Sinh viên chuyên Poster"
• 🏆 Top sinh viên xuất sắc: "Đề xuất sinh viên giỏi nhất"
• 🔥 Bài viết viral: "Top bài viết viral"
• 📊 Thông tin hệ thống: "Hệ thống này là gì?"
• ✨ Kiến thức thiết kế: "Xu hướng UI/UX 2025?"

Bạn muốn tìm hiểu về điều gì trước?`,

  (info: any) => `Chào bạn! 😊 Mình là trợ lý AI của **UEF Design Gallery**.

📌 **Hệ thống hiện có:**
• 👨‍🎓 **${info.totalStudents}** sinh viên
• 🖼️ **${info.totalPublicArtworks}** ấn phẩm công khai
• 👨‍🏫 **${info.totalLecturers}** giảng viên

Bạn muốn mình giúp gì? Tìm sinh viên, xem xu hướng thiết kế, hay tìm hiểu về hệ thống?`,

  (info: any) => `Mình là trợ lý ảo của **UEF Design Gallery** 🎨

Tớ có thể gợi ý cho bạn:
✅ Sinh viên siêu giỏi theo từng mảng (Poster, Branding, UI/UX...)
✅ Các ấn phẩm đang "hot" nhất
✅ Xu hướng thiết kế mới nhất 2024-2026
✅ Feedback portfolio & tips cải thiện

Bạn cần tớ tư vấn gì trước nè? 👇`,
];

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    const body = await request.json();
    const { message, sessionId, role: clientRole } = body;
    if (!message) return NextResponse.json({ error: 'Message is required' }, { status: 400 });

    const userId = session?.user?.id;
    const userRole = session?.user?.role || clientRole || 'guest';
    const context = userId ? await getContext(userId) : null;
    const msg = message.toLowerCase().trim();

    // ==================== FAST-PATH HANDLERS ====================

    // Greetings
    const greetingWords = ['xin chào', 'chào', 'hello', 'hi', 'hey', 'helo', 'chao'];
    if (greetingWords.some(w => msg === w || msg.startsWith(w))) {
      const info = await getSystemInfo();
      const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
      return NextResponse.json({ reply: template(info) });
    }

    // System info
    if ((msg.includes('hệ thống') || msg.includes('hệ thống này') || msg.includes('giới thiệu')) &&
        (msg.includes('gì') || msg.includes('mục đích') || msg.includes('làm gì'))) {
      const info = await getSystemInfo();
      return NextResponse.json({
        reply: `**${info.systemName}**\n\n${info.description}\n\n` +
          `📊 **Thống kê hiện tại:**\n` +
          `• 👨‍🎓 Sinh viên: **${info.totalStudents}**\n` +
          `• 🖼️ Ấn phẩm: **${info.totalPublicArtworks}**\n` +
          `• 👨‍🏫 Giảng viên: **${info.totalLecturers}**\n` +
          `• 🔥 Top: **${info.topArtwork?.title}** (${info.topArtwork?.student}) - ${info.topArtwork?.likes} ❤️\n\n` +
          `Hệ thống giúp sinh viên trưng bày portfolio, nhà tuyển dụng tìm kiếm tài năng trẻ, và giảng viên quản lý đánh giá. Bạn muốn tìm hiểu thêm về điều gì?`,
      });
    }

    // Top students
    if ((msg.includes('đề xuất') || msg.includes('top') || msg.includes('giỏi') || msg.includes('xuất sắc') || msg.includes('nổi bật')) &&
        (msg.includes('sinh viên') || msg.includes('student') || msg.includes('người'))) {
      const topStudents = await getTopStudents();
      if (!topStudents.length) return NextResponse.json({ reply: 'Hiện chưa có dữ liệu sinh viên nào. Hãy quay lại sau nhé! 📭' });
      const reply = `🏆 **Top sinh viên xuất sắc nhất:**\n\n` +
        topStudents.map((s, i) =>
          `**${i + 1}. ${s.studentName}**${s.studentMajor ? ` (${s.studentMajor})` : ''}\n` +
          `   📌 *${s.title}* | ${s.toolsUsed.join(', ')}\n` +
          `   ❤️ ${s.likeCount} likes | 👁️ ${s.viewCount} views${s.avgScore ? ` | ⭐ ${s.avgScore}/10` : ''}`
        ).join('\n\n') +
        `\n\nBạn muốn xem chi tiết sinh viên nào không? Hoặc lọc theo chuyên môn (Poster, Branding...)?`;
      return NextResponse.json({ reply });
    }

    // Viral posts
    if (msg.includes('viral') || msg.includes('hot') || msg.includes('nhiều like') || msg.includes('nhiều nhất')) {
      const viral = await getTopViral();
      if (!viral.length) return NextResponse.json({ reply: 'Chưa có bài viết nào. Hãy quay lại sau! 📭' });
      const reply = `🔥 **Top ấn phẩm viral nhất:**\n\n` +
        viral.map((a, i) =>
          `**${i + 1}. ${a.title}** — ${a.studentName}\n` +
          `   ❤️ ${a.likeCount} likes | 👁️ ${a.viewCount} views | 🛠️ ${a.toolsUsed.join(', ')}`
        ).join('\n\n') +
        `\n\nBạn muốn xem ấn phẩm nào chi tiết hơn không? 👀`;
      return NextResponse.json({ reply });
    }

    // Subject-based
    const subjectKeywords = ['poster', 'branding', 'ui/ux', 'illustration', 'typography', '3d', 'packaging', 'editorial', 'photography'];
    const matchedSubject = subjectKeywords.find((s) => msg.includes(s));
    if (matchedSubject) {
      const students = await getStudentsBySubject(matchedSubject);
      if (!students.length) return NextResponse.json({ reply: `Hiện chưa có sinh viên nào trong mảng **${matchedSubject}**. 😅` });
      const reply = `🎨 **Sinh viên chuyên ${matchedSubject.toUpperCase()}:**\n\n` +
        students.map((s, i) =>
          `**${i + 1}. ${s.studentName}**${s.major ? ` (${s.major})` : ''}\n` +
          `   🖼️ ${s.artworks.join(', ')}\n` +
          `   ❤️ Tổng ${s.totalLikes} likes${s.avgScore ? ` | ⭐ ${s.avgScore}/10` : ''}`
        ).join('\n\n') +
        `\n\nBạn muốn tìm hiểu thêm về bạn nào không? 👤`;
      return NextResponse.json({ reply });
    }

    // Timeline
    if (msg.includes('timeline') || msg.includes('thành tích') || msg.includes('mốc') || msg.includes('sự kiện')) {
      const entries = await queryByTimeline();
      if (!entries.length) return NextResponse.json({ reply: 'Chưa có dữ liệu timeline nào. 📭' });
      const reply = `📅 **Timeline thành tích sinh viên:**\n\n` +
        entries.map((e, i) =>
          `${e.month && e.year ? `📆 **${e.month}/${e.year}** ` : ''}` +
          `**${e.studentName}** - ${e.title}\n` +
          `${e.description ? `   ${e.description}\n` : ''}${e.tags?.length ? `   🏷️ ${e.tags.join(', ')}\n` : ''}`
        ).join('\n') +
        `\n\nBạn muốn xem timeline của sinh viên cụ thể nào không?`;
      return NextResponse.json({ reply });
    }

    // ==================== FALLBACK: AI (OpenAI / Gemini) ====================
    if (OPENAI_API_KEY || GEMINI_API_KEY) {
      const aiReply = await callAI([{ role: 'user', content: message }], userRole);
      if (aiReply) return NextResponse.json({ reply: aiReply });
    }

    // ==================== FALLBACK: N8N ====================
    if (N8N_WEBHOOK_URL) {
      const n8nReply = await callN8N(message, sessionId || `sess_${Date.now()}`, userRole, userId, context);
      if (n8nReply) return NextResponse.json({ reply: n8nReply });
    }

    // ==================== FINAL FALLBACK ====================
    const info = await getSystemInfo();
    const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
    return NextResponse.json({ reply: template(info) });

  } catch (error) {
    console.error('Chat API error:', error);
    const info = await getSystemInfo();
    const template = FALLBACK_TEMPLATES[Math.floor(Math.random() * FALLBACK_TEMPLATES.length)];
    return NextResponse.json({ reply: template(info) });
  }
}
