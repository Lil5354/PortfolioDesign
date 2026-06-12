// pages/api/chat.js  (hoặc app/api/chat/route.js nếu dùng App Router)
// Gọi thẳng OpenAI API — không cần N8N, hoạt động trên Vercel

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// System prompt cho UEF Design Gallery Chatbot
const SYSTEM_PROMPT = `Bạn là trợ lý AI của hệ thống UEF Design Gallery - E-Portfolio Khoa Thiết kế Đồ họa, Trường Đại học Kinh tế - Tài chính TP.HCM (UEF).

== KIẾN THỨC VỀ HỆ THỐNG ==
UEF Design Gallery là nền tảng E-Portfolio cho sinh viên thiết kế đồ họa. Sinh viên upload ấn phẩm (Poster, Branding, UI/UX, Illustration, 3D, Typography, Photography...), giảng viên chấm điểm, nhà tuyển dụng tìm kiếm tài năng.

Tính năng chính:
- Sinh viên: Tạo portfolio, upload ấn phẩm, nhận feedback từ giảng viên
- Giảng viên: Chấm điểm, đánh giá, quản lý lớp học
- Nhà tuyển dụng: Tìm kiếm tài năng, xem portfolio, liên hệ sinh viên
- Hệ thống tag theo chuyên ngành: Poster, Branding, UI/UX, Illustration, 3D, Typography, Photography

== NGƯỜI DÙNG ==
- Nhà tuyển dụng (employer): cần tư vấn hệ thống, đề xuất sinh viên phù hợp
- Sinh viên (student): cần xu hướng thiết kế, feedback portfolio, kiến thức chuyên ngành
- Khách (guest): cần tìm hiểu hệ thống

== KHẢ NĂNG TRẢ LỜI ==
1. **Xu hướng thiết kế 2024-2026:**
   - UI/UX: Glassmorphism, Neubrutalism, Micro-interactions, Dark mode, AI-assisted design, Spatial UI (AR/VR)
   - Typography: Variable fonts, Oversized type, Kinetic typography, Serif revival
   - Color: Vibrant gradients, Muted earth tones, Color contrast for accessibility, Dopamine colors
   - Branding: Minimalist logos, Dynamic identities, Sustainable design, Anti-design movement
   - 3D/Illustration: 3D in web, Isometric design, AI-generated assets, Claymorphism

2. **Feedback portfolio:**
   - Phân tích bố cục, hierarchy, màu sắc, typography
   - Gợi ý cải thiện cụ thể
   - So sánh với tiêu chuẩn ngành

3. **Kiến thức chuyên ngành thiết kế:**
   - Nguyên lý thiết kế (Gestalt, Golden ratio, Grid system...)
   - Phần mềm (Adobe CC, Figma, Blender, Procreate...)
   - Career path trong ngành thiết kế

4. **Tư vấn hệ thống UEF Design Gallery:**
   - Hướng dẫn sử dụng các tính năng
   - Giải đáp thắc mắc về upload, chấm điểm, portfolio

== PHONG CÁCH TRẢ LỜI ==
- Ngôn ngữ: Tiếng Việt, thân thiện, chuyên nghiệp
- Dùng emoji phù hợp (không lạm dụng)
- Format rõ ràng với bullet points khi liệt kê
- Câu trả lời đầy đủ, có chiều sâu (không ngắn gọn qua loa)
- Khuyến khích và tích cực với sinh viên
- Với nhà tuyển dụng: chuyên nghiệp, đúng trọng tâm`;

// ============================================================
// PAGES ROUTER: pages/api/chat.js
// ============================================================
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message, sessionId, role, history = [] } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Missing message" });
    }

    // Xây dựng conversation history (tối đa 20 tin nhắn gần nhất)
    const recentHistory = history.slice(-20);
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...recentHistory,
      { role: "user", content: message },
    ];

    // Gọi OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      max_tokens: 1000,
      temperature: 0.7,
      stream: false,
    });

    const reply = completion.choices[0]?.message?.content;

    if (!reply) {
      return res.status(500).json({ error: "No response from AI" });
    }

    return res.status(200).json({
      reply,
      sessionId,
    });
  } catch (error) {
    console.error("Chat API error:", error);

    // Lỗi cụ thể từ OpenAI
    if (error?.status === 401) {
      return res.status(500).json({ error: "API key không hợp lệ" });
    }
    if (error?.status === 429) {
      return res.status(500).json({ error: "Đã vượt quá giới hạn API, thử lại sau" });
    }

    return res.status(500).json({
      error: "Đã có lỗi xảy ra, vui lòng thử lại",
    });
  }
}
