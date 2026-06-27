import { useState, useRef, useEffect, useCallback } from "react";
import { Mail, X, Send, Paperclip } from "lucide-react";
import { api } from "../lib/api-client";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const CERULEAN = "#1a4ba8";

export default function MessageDropdown({ setPage, userData }) {
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeChatId, setActiveChatId] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [replying, setReplying] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [attachArtworks, setAttachArtworks] = useState([]);
  const [attachSearch, setAttachSearch] = useState("");
  const [selectedAttachment, setSelectedAttachment] = useState(null);
  
  const dropdownRef = useRef(null);
  const popupRef = useRef(null);

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
      .withUrl("/chatHub", {
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
      // If clicking inside the dropdown, don't close
      if (dropdownRef.current && dropdownRef.current.contains(event.target)) return;
      // If clicking inside the chat popup, don't close the dropdown (if it was open)
      if (popupRef.current && popupRef.current.contains(event.target)) return;
      
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (showAttachMenu && attachArtworks.length === 0) {
      api.artworks.list().then(data => {
        setAttachArtworks(Array.isArray(data) ? data : (data.artworks || data.items || []));
      }).catch(()=>{});
    }
  }, [showAttachMenu]);

  // Group into threads for display
  const threadedMessages = [];
  messages.forEach(msg => {
    const isMe = msg.senderName?.startsWith("To: ");
    const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
    const otherAvatarUrl = msg.senderAvatarUrl;
    
    let groupId = "chat_" + otherEmail;
    let artworkData = null;
    
    if (msg.purpose === "feedback" || msg.purpose === "order") {
      try {
        const d = typeof msg.content === "string" ? JSON.parse(msg.content) : msg.content;
        artworkData = d;
      } catch(e){}
    }
    
    const existing = threadedMessages.find(t => t.id === groupId);
    if (!existing) {
      threadedMessages.push({
        id: groupId,
        messages: [msg],
        isRead: isMe || msg.isRead,
        artworkData: artworkData,
        purpose: msg.purpose,
        otherEmail: otherEmail,
        otherAvatarUrl: otherAvatarUrl
      });
    } else {
      existing.messages.push(msg);
      if (!isMe && !msg.isRead) existing.isRead = false;
      if (!existing.otherAvatarUrl && otherAvatarUrl) existing.otherAvatarUrl = otherAvatarUrl;
    }
  });

  const activeChat = threadedMessages.find(t => t.id === activeChatId);

  const handleReply = async () => {
    if ((!replyText.trim() && !selectedAttachment) || replying || !activeChat) return;
    setReplying(true);
    try {
      const originalMsg = activeChat.messages.find(m => !m.senderName?.startsWith("To: "));
      let recipientSlug = "uef-design-gallery";
      
      if (originalMsg && originalMsg.senderEmail) {
        recipientSlug = originalMsg.senderEmail;
      } else if (activeChat.artworkData?.artworkId) {
        try {
          const art = await api.artworks.get(activeChat.artworkData.artworkId);
          if (art && art.user && art.user.email) {
            recipientSlug = art.user.email;
          }
        } catch (err) {}
      }
      
      const newMsgData = await api.messages.send({
        recipientSlug: recipientSlug,
        senderName: userData?.fullName || userData?.name || userData?.email || "Bạn",
        senderEmail: userData?.email || "",
        senderCompany: "UEF",
        content: selectedAttachment
                   ? JSON.stringify({ 
                       description: replyText, 
                       artworkId: selectedAttachment.id,
                       artworkTitle: selectedAttachment.title,
                       artworkImage: selectedAttachment.coverImageUrl || selectedAttachment.coverUrl,
                       attachedArtwork: {
                           artworkId: selectedAttachment.id,
                           title: selectedAttachment.title,
                           coverUrl: selectedAttachment.coverImageUrl || selectedAttachment.coverUrl
                       }
                     })
                   : replyText,
          purpose: selectedAttachment ? "feedback" : "message"
      });
      
      const outboxMsg = {
        ...newMsgData,
        senderName: `To: ${recipientSlug}`,
        recipientSlug: recipientSlug,
        isRead: true
      };
      
      setMessages(prev => [outboxMsg, ...prev]);
      setReplyText("");
      setSelectedAttachment(null);
      setShowAttachMenu(false);
    } catch (e) {
      alert("Lỗi khi gửi phản hồi: " + (e?.message || "Vui lòng thử lại"));
    } finally {
      setReplying(false);
    }
  };

  const openThread = (thread) => {
    // Mark as read
    thread.messages.forEach(m => {
      if (!m.isRead) api.messages.markRead(m.id).catch(() => {});
    });
    setMessages(prev => prev.map(m => (thread.messages.some(tm => tm.id === m.id) ? { ...m, isRead: true } : m)));
    
    setActiveChatId(thread.id);
    setIsOpen(false);
  };

  return (
    <>
      <div className="relative" ref={dropdownRef}>
        <button 
          className="relative p-2 rounded-lg hover:bg-[#F0F0F0] transition-colors cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
          title="Hộp thư"
        >
          <Mail size={20} className="text-[#666666]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#E53E3E] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
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
                  // Use the other person's name for display if available
                  const displayMsg = thread.messages.find(m => m.senderEmail !== userData?.email && !m.senderName?.startsWith("To: ")) || latestMsg;
                  let senderNameDisplay = displayMsg.senderName;
                  if (senderNameDisplay?.startsWith("To: ")) senderNameDisplay = senderNameDisplay.replace("To: ", "");
                  
                  return (
                    <div 
                      key={thread.id} 
                      className={`flex items-start gap-3 px-4 py-3 border-b border-gray-50 cursor-pointer transition-colors ${!thread.isRead ? "bg-[#eef4ff]/50" : "hover:bg-gray-50"}`}
                      onClick={() => openThread(thread)}
                    >
                      <div className="w-10 h-10 rounded-full bg-[#1a4ba8]/10 flex items-center justify-center flex-shrink-0 mt-0.5 overflow-hidden">
                        {thread.otherAvatarUrl ? (
                          <img src={thread.otherAvatarUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[#1a4ba8] font-bold text-sm">
                            {senderNameDisplay?.charAt(0)?.toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <p className={`text-sm truncate pr-2 ${!thread.isRead ? "font-bold text-gray-900" : "font-medium text-gray-800"}`}>
                            {senderNameDisplay}
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

      {/* Floating Chat Popup */}
      {activeChat && (() => {
        const displayMsg = activeChat.messages.find(m => m.senderEmail !== userData?.email && !m.senderName?.startsWith("To: ")) || activeChat.messages[activeChat.messages.length - 1];
        let senderNameDisplay = displayMsg?.senderName;
        if (senderNameDisplay?.startsWith("To: ")) senderNameDisplay = senderNameDisplay.replace("To: ", "");
        
        return (
        <div ref={popupRef} className="fixed bottom-4 right-4 sm:right-24 w-[340px] bg-white rounded-t-xl rounded-b-md shadow-2xl border border-gray-200 z-[999] flex flex-col" style={{ height: "450px" }}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#1a4ba8] text-white rounded-t-xl cursor-pointer" onClick={() => setActiveChatId(null)}>
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {activeChat.otherAvatarUrl ? (
                  <img src={activeChat.otherAvatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="font-bold text-sm">
                    {senderNameDisplay?.charAt(0)?.toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <h3 className="font-semibold text-sm truncate">{senderNameDisplay}</h3>
                <span className="text-[10px] text-white/70 truncate">{activeChat.artworkData?.artworkTitle || "Trực tuyến"}</span>
              </div>
            </div>
            <button className="text-white hover:bg-white/20 p-1 rounded-full cursor-pointer transition-colors flex-shrink-0" onClick={(e) => { e.stopPropagation(); setActiveChatId(null); }}>
              <X size={16} />
            </button>
          </div>
          
          {/* Email Recommend */}
          <div className="px-3 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
            <span className="text-[11px] text-blue-800 truncate pr-2">Cần gửi file đính kèm?</span>
            <a
               href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(activeChat.messages.find(m => m.senderEmail !== userData?.email && !m.senderName?.startsWith("To: "))?.senderEmail || "uef-design-gallery")}&su=${encodeURIComponent(`Reply: ${activeChat.artworkData?.artworkTitle || activeChat.purpose || "Liên hệ Portfolio"}`)}`}
               target="_blank"
               rel="noopener noreferrer"
               className="text-[11px] font-semibold text-white bg-blue-600 px-2 py-1 rounded hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
            >
              Qua Email
            </a>
          </div>
          
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-3 bg-gray-50">
             {activeChat.messages.map((m, i) => {
                const isMe = m.senderEmail === userData?.email || m.senderName?.startsWith("To: ");
                let mText = m.content;
                let attachment = null;
                try {
                  const d = JSON.parse(m.content);
                  mText = d.description || m.content;
                  if (d.attachedArtwork) {
                    attachment = d.attachedArtwork;
                  } else if (d.artworkId) {
                    attachment = d;
                  }
                } catch {}

                return (
                  <div key={m.id || i} className={`flex flex-col gap-1.5 ${isMe ? "items-end" : "items-start"}`}>
                    {attachment && (
                      <div 
                        onClick={() => { setPage('detail', { artworkId: attachment.artworkId }); setIsOpen(false); }}
                        className="w-[220px] rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="aspect-[4/3] bg-gray-100 relative">
                           {attachment.artworkImage && attachment.artworkImage !== "null" && attachment.artworkImage !== "undefined" ? (
                             <img src={attachment.artworkImage} className="w-full h-full object-cover" />
                           ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Không có ảnh</div>
                           )}
                           <div className="absolute top-2 left-2 bg-black/50 backdrop-blur text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">
                             {activeChat.purpose === "order" ? "ĐẶT HÀNG" : "PHẢN HỒI"}
                           </div>
                        </div>
                        <div className="p-2.5">
                          <p className="text-xs font-bold text-gray-800 line-clamp-1">{attachment.artworkTitle || "Tác phẩm"}</p>
                        </div>
                      </div>
                    )}
                    
                    <div className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm ${isMe ? "bg-[#1a4ba8] text-white rounded-br-sm" : "bg-white border border-gray-200 text-gray-800 rounded-bl-sm shadow-sm"}`}>
                      <p className="whitespace-pre-wrap break-words">{mText}</p>
                    </div>
                  </div>
                );
             })}
          </div>

          {/* Reply Area */}
          <div className="relative">
            {showAttachMenu && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg flex flex-col z-[1000] overflow-hidden" style={{ maxHeight: '200px' }}>
                <div className="p-2 border-b border-gray-100">
                  <input 
                    type="text" 
                    placeholder="Tìm tác phẩm..." 
                    value={attachSearch}
                    onChange={(e) => setAttachSearch(e.target.value)}
                    className="w-full px-3 py-1.5 bg-gray-50 text-xs rounded border-none outline-none focus:ring-1 focus:ring-[#1a4ba8]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-1">
                  {attachArtworks.filter(a => a.title.toLowerCase().includes(attachSearch.toLowerCase())).length === 0 ? (
                    <div className="text-center p-3 text-xs text-gray-500">Không tìm thấy tác phẩm</div>
                  ) : (
                    attachArtworks.filter(a => a.title.toLowerCase().includes(attachSearch.toLowerCase())).map(art => (
                      <div 
                        key={art.id} 
                        onClick={() => { setSelectedAttachment(art); setShowAttachMenu(false); }}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 cursor-pointer rounded"
                      >
                        {art.coverImageUrl && <img src={art.coverImageUrl} className="w-8 h-8 object-cover rounded flex-shrink-0" />}
                        <span className="text-xs truncate flex-1">{art.title}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
            
            {selectedAttachment && (
              <div className="px-3 py-2 bg-blue-50/50 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-[10px] bg-[#1a4ba8] text-white px-1.5 py-0.5 rounded font-bold">Đính kèm</span>
                  {selectedAttachment.coverImageUrl && <img src={selectedAttachment.coverImageUrl} className="w-5 h-5 object-cover rounded flex-shrink-0" />}
                  <span className="text-xs font-medium truncate">{selectedAttachment.title}</span>
                </div>
                <button onClick={() => setSelectedAttachment(null)} className="text-gray-500 hover:text-red-500 p-1">
                  <X size={14} />
                </button>
              </div>
            )}
            
            <div className="p-3 bg-white border-t border-gray-200 flex items-center gap-2">
              <button 
                onClick={() => setShowAttachMenu(!showAttachMenu)}
                className={`p-2 rounded-full transition-colors flex-shrink-0 ${showAttachMenu || selectedAttachment ? "text-[#1a4ba8] bg-blue-50" : "text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                title="Đính kèm ấn phẩm"
              >
                <Paperclip size={18} />
              </button>
              <input 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập tin nhắn..."
                onKeyDown={(e) => { if (e.key === 'Enter') handleReply(); }}
                className="flex-1 bg-gray-100 border-none rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1a4ba8]/30 min-w-0"
              />
              <button 
                disabled={replying || (!replyText.trim() && !selectedAttachment)}
                onClick={handleReply}
                className="w-9 h-9 rounded-full bg-[#1a4ba8] text-white flex items-center justify-center disabled:opacity-50 cursor-pointer flex-shrink-0"
              >
                <Send size={15} className={replying ? "opacity-50" : ""} style={{ marginLeft: "2px" }} />
              </button>
            </div>
          </div>
        </div>
        );
      })()}
    </>
  );
}
