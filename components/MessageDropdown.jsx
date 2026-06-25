import { useState, useRef, useEffect, useCallback } from "react";
import { Mail, X } from "lucide-react";
import { api } from "../lib/api-client";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const CERULEAN = "#1a4ba8";

export default function MessageDropdown({ setPage, userData }) {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const data = await api.messages.list();
      if (Array.isArray(data)) {
        setMessages(data);
        setUnreadCount(data.filter((m) => !m.isRead && !m.isMe).length);
      } else {
        setMessages([]);
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    
    // Setup SignalR connection
    const connection = new HubConnectionBuilder()
      .withUrl("https://localhost:7164/chatHub", {
        accessTokenFactory: () => localStorage.getItem("token") || ""
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.error("SignalR Connection Error: ", err));

    connection.on("ReceiveMessage", (message) => {
      // Re-fetch messages when receiving a new one
      fetchMessages();
      // Only show popup/badge if it's not sent by me
      if (userData && message.senderEmail !== userData.email) {
        // We could show a toast here if we wanted
      }
    });

    return () => {
      connection.stop();
    };
  }, [fetchMessages]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Group into threads for display
  const threadedMessages = [];
  messages.forEach(msg => {
    let groupId = "msg_" + msg.id;
    let artworkData = null;
    if (msg.purpose === "feedback" || msg.purpose === "order") {
      try {
        const d = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
        artworkData = d;
        if (d && d.artworkId) {
          groupId = "artwork_" + d.artworkId;
        }
      } catch(e){}
    }
    const existing = threadedMessages.find(t => t.id === groupId);
    if (!existing) {
      threadedMessages.push({
        id: groupId,
        messages: [msg],
        isRead: msg.isMe || msg.isRead,
        artworkData: artworkData
      });
    } else {
      existing.messages.push(msg);
      if (!msg.isMe && !msg.isRead) existing.isRead = false;
    }
  });

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="relative p-2 rounded-full text-gray-500 hover:text-[#212121] hover:bg-gray-100 transition-colors cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Mail size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white border-2 border-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-[100] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-gray-800 text-sm">Hộp thư</h3>
            <button className="text-[#1a4ba8] text-xs font-medium hover:underline cursor-pointer" onClick={() => { setPage("messages"); setIsOpen(false); }}>Xem tất cả</button>
          </div>
          
          <div className="max-h-[360px] overflow-y-auto">
            {threadedMessages.length === 0 ? (
              <div className="px-4 py-8 text-center text-gray-500">
                <Mail size={32} className="mx-auto mb-2 opacity-20" />
                <p className="text-sm">Không có tin nhắn nào</p>
              </div>
            ) : (
              threadedMessages.slice(0, 5).map((thread) => {
                const latestMsg = thread.messages[0];
                return (
                  <div 
                    key={thread.id} 
                    className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${!thread.isRead ? "bg-[#eef4ff]/50" : "hover:bg-gray-50"}`}
                    onClick={() => { setPage("messages"); setIsOpen(false); }}
                  >
                    <div className="w-10 h-10 rounded-full bg-[#1a4ba8]/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#1a4ba8] font-bold text-sm">
                        {latestMsg.senderName?.charAt(0)?.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-0.5">
                        <p className={`text-sm truncate pr-2 ${!thread.isRead ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                          {latestMsg.senderName}
                        </p>
                        <span className="text-[10px] text-gray-400 whitespace-nowrap">
                          {new Date(latestMsg.createdAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <p className={`text-xs truncate ${!thread.isRead ? "font-semibold text-gray-800" : "text-gray-500"}`}>
                        {thread.artworkData ? thread.artworkData.description : latestMsg.content}
                      </p>
                    </div>
                    {!thread.isRead && (
                      <div className="w-2 h-2 rounded-full bg-[#1a4ba8] mt-2 flex-shrink-0" />
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
