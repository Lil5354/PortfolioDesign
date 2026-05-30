import React, { useState, useRef, useEffect } from "react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { MessageCircle, X, Send, User } from "lucide-react";

const BOT_AVATAR = "https://i.pinimg.com/736x/85/dc/43/85dc43d8e58816ec1c132a3f9683ab20.jpg";
const USER_AVATAR = "https://i.pinimg.com/736x/85/dc/43/85dc43d8e58816ec1c132a3f9683ab20.jpg";

function renderMessage(text) {
  const lines = text.split('\n');
  return lines.map((line, i) => {
    let trimmed = line.trim();
    if (!trimmed) return <br key={i} />;

    let processed = trimmed
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.+?)__/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    let prefix = null;
    let content = processed;

    const bulletMatch = processed.match(/^[•●▪▶]\s*/);
    if (bulletMatch) {
      prefix = '•';
      content = processed.slice(bulletMatch[0].length);
    }

    const numMatch = processed.match(/^(\d+)\.\s*/);
    if (numMatch) {
      prefix = numMatch[1];
      content = processed.slice(numMatch[0].length);
    }

    if (prefix === '•') {
      return (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span className="text-gray-400 shrink-0 mt-0.5">•</span>
          <span className="text-gray-800 text-sm" dangerouslySetInnerHTML={{ __html: content.trim() }} />
        </div>
      );
    }
    if (numMatch) {
      return (
        <div key={i} className="flex gap-2 leading-relaxed">
          <span className="text-gray-400 shrink-0 mt-0.5 text-xs font-medium min-w-[18px]">{prefix}.</span>
          <span className="text-gray-800 text-sm" dangerouslySetInnerHTML={{ __html: content.trim() }} />
        </div>
      );
    }

    return (
      <div key={i} className="leading-relaxed">
        <span className="text-gray-800 text-sm" dangerouslySetInnerHTML={{ __html: content }} />
      </div>
    );
  });
}

let messageIdCounter = 0;
const nextId = () => ++messageIdCounter;

const QUICK_ACTIONS = {
  recruiter: [
    "Hệ thống này dùng để làm gì?",
    "Đề xuất sinh viên giỏi nhất",
    "Top bài viết viral nhất",
    "Sinh viên chuyên Poster",
  ],
  student: [
    "Xu hướng thiết kế 2025-2026?",
    "Cách cải thiện portfolio",
    "Mẹo thiết kế typography",
    "Nguyên tắc color theory",
  ],
};

const WELCOME = {
  recruiter: `Xin chào! Tôi là trợ lý AI của UEF Design Gallery.

Tôi có thể giúp bạn:
• Tìm hiểu về hệ thống E-Portfolio
• Đề xuất sinh viên xuất sắc theo chuyên môn
• Xem top artwork viral, điểm đánh giá cao
• Gợi ý sinh viên phù hợp với nhu cầu tuyển dụng

Bạn muốn tìm hiểu về điều gì?`,
  student: `Chào bạn! Tôi là trợ lý AI của UEF Design Gallery.

Tôi có thể giúp bạn:
• Cập nhật xu hướng thiết kế mới nhất
• Kiến thức chuyên ngành (typography, color, layout...)
• Mẹo cải thiện portfolio và artwork
• Định hướng phát triển kỹ năng

Bạn muốn khám phá điều gì?`,
};

function TypingIndicator() {
  return (
    <div className="flex items-start gap-2.5 max-w-[88%]">
      <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 border-white shadow-sm">
        <img src={BOT_AVATAR} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1.5">
          <span className="w-2 h-2 bg-[#077E9E] rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
          <span className="w-2 h-2 bg-[#077E9E] rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
          <span className="w-2 h-2 bg-[#077E9E] rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ msg }) {
  const isUser = msg.role === "user";
  return (
    <div className={`flex items-start gap-2.5 ${isUser ? "flex-row-reverse" : ""} ${isUser ? "ml-auto" : "mr-auto"} animate-fade-in`}>
      {/* Avatar */}
      {isUser ? (
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden bg-[#077E9E] flex items-center justify-center">
          <User size={14} className="text-white" />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-full shrink-0 overflow-hidden border-2 border-white shadow-sm">
          <img src={BOT_AVATAR} alt="" className="w-full h-full object-cover" />
        </div>
      )}

      {/* Bubble */}
      <div className={
        isUser
          ? "bg-[#077E9E] text-white rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%] shadow-sm"
          : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[85%] shadow-sm"
      }>
        {renderMessage(msg.content)}
      </div>
    </div>
  );
}

export default function ChatBot({ userRole = "employer" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const isRecruiter = userRole === "employer" || userRole === "admin";
  const quickActions = QUICK_ACTIONS[isRecruiter ? "recruiter" : "student"];
  const welcomeMsg = WELCOME[isRecruiter ? "recruiter" : "student"];

  useEffect(() => {
    setSessionId(`session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ id: nextId(), role: "assistant", content: welcomeMsg }]);
    }
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMsg = text.trim();
    if (!userMsg || isLoading) return;

    setMessages((prev) => [...prev, { id: nextId(), role: "user", content: userMsg }]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.role === "user" || m.role === "assistant")
        .slice(-20)
        .map((m) => ({ role: m.role, content: m.content }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ message: userMsg, sessionId, role: userRole, history }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Lỗi kết nối");

      setMessages((prev) => [...prev, { id: nextId(), role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { id: nextId(), role: "assistant", content: `Xin lỗi, đã có lỗi xảy ra: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[90] w-[380px] h-[560px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#077E9E] to-[#055F78] px-4 py-3 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full shrink-0 overflow-hidden border-2 border-white/40 shadow-md">
              <img src={BOT_AVATAR} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold text-sm">UEF Design Assistant</h3>
              <p className="text-white/70 text-xs truncate">
                {isLoading ? "Đang suy nghĩ..." : "Online • Trợ lý AI"}
              </p>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F5F7FA]">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
            {isLoading && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick actions */}
          {messages.length <= 2 && !isLoading && (
            <div className="px-4 py-2 border-t border-gray-100 bg-white">
              <p className="text-xs text-gray-400 mb-2">Gợi ý nhanh:</p>
              <div className="flex flex-wrap gap-1.5">
                {quickActions.map((action) => (
                  <button
                    key={action}
                    onClick={() => sendMessage(action)}
                    className="text-xs bg-gray-50 hover:bg-[#077E9E]/10 hover:text-[#077E9E] hover:border-[#077E9E]/30 text-gray-500 px-3 py-1.5 rounded-full transition-all border border-gray-200"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={(e) => { e.preventDefault(); sendMessage(input); }} className="p-3 border-t border-gray-200 bg-white shrink-0">
            <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-1 border border-gray-200 focus-within:border-[#077E9E] focus-within:ring-1 focus-within:ring-[#077E9E]/20 transition-all">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                disabled={isLoading}
                className="flex-1 py-2 text-sm bg-transparent outline-none disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 rounded-lg bg-[#077E9E] text-white flex items-center justify-center hover:bg-[#066a85] transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={14} />
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[90] w-14 h-14 rounded-full bg-gradient-to-r from-[#077E9E] to-[#055F78] text-white shadow-lg hover:scale-105 transition-all flex items-center justify-center"
        style={{ boxShadow: "0 4px 20px rgba(7,126,158,0.4)" }}
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <div className="relative">
            <MessageCircle size={24} />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse-subtle" />
          </div>
        )}
      </button>
    </>
  );
}
