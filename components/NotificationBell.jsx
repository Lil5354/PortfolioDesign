import { useState, useRef, useEffect, useCallback } from "react";
import { Bell, X, Check, Heart, MessageSquare, Star, ShieldAlert, Eye, EyeOff, Users, Mail, FileText, ShoppingCart } from "lucide-react";
import { api } from "../lib/api-client";

const CERULEAN = "#1a4ba8";

const TYPE_ICONS = {
  new_like: Heart,
  new_comment: MessageSquare,
  new_message: Mail,
  grade_updated: Star,
  artwork_approved: Check,
  artwork_hidden: EyeOff,
  artwork_pending: Eye,
  new_report: ShieldAlert,
  report_resolved: Check,
  collaborator_tag: Users,
  new_order: ShoppingCart,
};

const TYPE_COLORS = {
  new_like: "#E53E3E",
  new_comment: "#1a4ba8",
  new_message: "#1a4ba8",
  grade_updated: "#D69E2E",
  artwork_approved: "#38A169",
  artwork_hidden: "#A0AEC0",
  artwork_pending: "#D69E2E",
  new_report: "#E53E3E",
  report_resolved: "#38A169",
  collaborator_tag: "#805AD5",
  new_order: "#059669",
};

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Vừa xong";
  if (mins < 60) return `${mins} phút trước`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} giờ trước`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} ngày trước`;
  return new Date(dateStr).toLocaleDateString("vi-VN");
}

export default function NotificationBell({ setPage }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const fetchUnread = useCallback(async () => {
    try {
      const data = await api.notifications.unreadCount();
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  }, []);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.notifications.list({ limit: "20" });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [fetchUnread]);

  useEffect(() => {
    if (!open) return;
    fetchNotifications();
  }, [open, fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNotificationClick = async (n) => {
    try {
      await api.notifications.markRead(n.id);
    } catch {}
    setNotifications(prev =>
      prev.map(x => x.id === n.id ? { ...x, isRead: true } : x)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
    setOpen(false);

    switch (n.type) {
      case 'new_order':
        if (n.referenceId) {
          setPage("messages");
        }
        break;
      case 'artwork':
        if (n.referenceId) {
          setPage("detail", { artworkId: n.referenceId });
        }
        break;
      case 'message':
        setPage("messages");
        break;
      case 'report':
        setPage("admin_artworks");
        break;
      default:
        if (n.type === 'artwork_pending' || n.type === 'new_report') {
          setPage("admin_artworks");
        } else if (n.referenceId) {
          setPage("detail", { artworkId: n.referenceId });
        }
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.notifications.markAllRead();
    } catch {}
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg hover:bg-[#F0F0F0] transition-colors cursor-pointer"
        title="Thông báo"
      >
        <Bell size={20} className="text-[#666666]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E53E3E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden z-50 max-h-[520px] flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0]">
            <h3 className="text-sm font-bold text-[#212121]">Thông báo</h3>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="text-xs font-semibold text-[#1a4ba8] hover:text-[#0d2e6e] cursor-pointer"
                >
                  Đã đọc tất cả
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-[#666666] hover:text-[#212121] cursor-pointer">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="overflow-y-auto flex-1">
            {loading && notifications.length === 0 ? (
              <div className="text-center py-10 text-[#666666] text-sm">Đang tải...</div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-10 text-[#666666] text-sm">Không có thông báo</div>
            ) : (
              notifications.map((n) => {
                const Icon = TYPE_ICONS[n.type] || Bell;
                const color = TYPE_COLORS[n.type] || "#666666";
                return (
                  <div
                    key={n.id}
                    onClick={() => handleNotificationClick(n)}
                    className={`flex items-start gap-3 px-5 py-3.5 border-b border-[#E0E0E0] cursor-pointer hover:bg-[#F8F8F8] transition-colors ${!n.isRead ? "bg-[#eef4ff]" : ""}`}
                  >
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: `${color}18` }}
                    >
                      <Icon size={16} color={color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-relaxed ${!n.isRead ? "font-semibold text-[#212121]" : "text-[#444444]"}`}>
                        {n.content}
                      </p>
                      <p className="text-[11px] text-[#999] mt-1">{timeAgo(n.createdAt)}</p>
                    </div>
                    {!n.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#1a4ba8] flex-shrink-0 mt-2" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
