import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./lib/AuthContext";
import { LecturerCard } from "./components/ui/LecturerCard";
import { MajorCard } from "./components/ui/MajorCard";
import { api } from "./lib/api-client";
import LayoutSettings from "./LayoutSettings.jsx";
import CatalogBuilderWizard from "./components/catalog/CatalogBuilderWizard";
import EbookViewerModal from "./components/catalog/EbookViewerModal";
import NotificationBell from "./components/NotificationBell";
import MessageDropdown from "./components/MessageDropdown";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import DraftBuilderModal from "./components/DraftBuilderModal";
import JournalSettingsModal from "./components/journal/JournalSettingsModal";
import JournalBuilderModal from "./components/journal/JournalBuilderModal";
import { TranslationProvider, useI18n } from "./lib/i18n.jsx";
import { t } from "./lib/i18n.jsx";
import { useSiteContent } from "./lib/site-content.js";

import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import HTMLFlipBook from 'react-pageflip';
import {
  Image, Eye, Heart, Globe, LayoutDashboard, Folder, MessageSquare, BarChart2,
  Settings, Trash2, Edit2, Search, X, Check, CheckCircle, ArrowDownCircle, ExternalLink,
  Maximize2, Lock, FileImage, ShieldAlert, Plus, Send, Clock, PenTool, Bookmark,
  Mail, Link, User, Briefcase, Unlock, FileDown, GripVertical, Users, LogOut, ChevronDown, MailOpen,
  MapPin, Phone, ArrowRight, Star, Monitor, BookOpen, Calendar, EyeOff, Archive, ArchiveRestore,
  GraduationCap, Rocket, Upload, Menu, ShoppingCart, Languages,
  ShieldCheck, UserPlus, FileBadge, Zap, LayoutGrid, Building2, ClipboardList, Info, Filter, ChevronRight, ChevronLeft, ThumbsUp, MessageCircle, Package, FileText, Tag, Download, FolderInput, FolderPlus, AlertTriangle, Camera, ImageIcon, Reply, RefreshCw
} from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';

import iconNam1 from './Logoicon/nam-1.png';
import iconNam2 from './Logoicon/nam-2.png';
import iconNam3 from './Logoicon/nam-3.png';
import iconNamCuoi from './Logoicon/nam-cuoi.png';
import iconTotNghiep from './Logoicon/5.png';

const getBadgeIcon = (badgeName) => {
  if (badgeName === "Designer Mầm non") return iconNam1;
  if (badgeName === "Designer Thực tập") return iconNam2;
  if (badgeName === "Designer Chuyên nghiệp") return iconNam3;
  if (badgeName === "Designer Tiền bối") return iconNamCuoi;
  if (badgeName === "Designer Tốt nghiệp") return iconTotNghiep;
  return null;
};
import ChatBot from './components/ChatBot';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function GlobalLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] w-full bg-white z-50">
      <div style={{ width: 300, height: 300 }}>
        <DotLottieReact
          src="https://lottie.host/c21c637c-1f75-4ece-8274-afbb094dcfd8/VvdZEvXog8.lottie"
          loop
          autoplay
        />
      </div>
    </div>
  );
}

const CERULEAN = "#1a4ba8";
const ACCENT_BLUE = "#1a4ba8";
const DARK_BLUE = "#0d2e6e";
const CRIMSON = "#8B1A1A";
const BLACK = "#212121";
const GRAY_BG = "#F8F8F8";
const GRAY_LIGHT = "#E0E0E0";
const MUTED = "#666666";

const artworks = [
  { id: 1, title: "Neon Cityscape Poster", student: "Nguyễn Minh Anh", likes: 142, h: 320, img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", category: "Poster", tool: "Illustrator", year: "2024", isPublic: true },
  { id: 2, title: "Brand Identity UEF", student: "Trần Bảo Long", likes: 89, h: 240, img: "https://i.pinimg.com/1200x/64/52/dc/6452dc484427b34cc0be14c3d80c948a.jpg", category: "Branding", tool: "Figma", year: "2024", isPublic: true },
  { id: 3, title: "3D Abstract Geometry", student: "Lê Thị Hương", likes: 203, h: 380, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", category: "3D Art", tool: "Blender", year: "2023", isPublic: false },
  { id: 4, title: "Vintage Travel Series", student: "Phạm Quốc Việt", likes: 56, h: 270, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", category: "Illustration", tool: "Procreate", year: "2023", isPublic: true },
  { id: 5, title: "UI Design System", student: "Hoàng Thị Mai", likes: 175, h: 300, img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80", category: "UI/UX", tool: "Figma", year: "2024", isPublic: true },
  { id: 6, title: "Cultural Festival Poster", student: "Vũ Đăng Khoa", likes: 98, h: 350, img: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&q=80", category: "Poster", tool: "Photoshop", year: "2023", isPublic: true },
  { id: 7, title: "Minimal Logo Collection", student: "Đặng Thu Hiền", likes: 130, h: 260, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", category: "Branding", tool: "Illustrator", year: "2024", isPublic: false },
  { id: 8, title: "Futuristic UI Concept", student: "Bùi Minh Khải", likes: 214, h: 290, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", category: "UI/UX", tool: "Figma", year: "2024", isPublic: true },
];

function AppHeader({ activePage, setPage, isLoggedIn, userRole, onLogout, userData }) {
  const { lang, toggleLang } = useI18n();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const langRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
      if (langRef.current && !langRef.current.contains(event.target)) {
        setIsLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (id) => activePage === id || (id === "home" && (activePage === "home" || activePage === "landing"));
  const navItems = [
    { id: "home", label: t("home") },
    { id: "gallery", label: t("gallery") },
    { id: "about", label: t("about") },
  ];
  if (isLoggedIn && userRole === "student") navItems.push({ id: "portfolio", label: t("portfolio") });

  const userName = userData?.fullName || userData?.name || t("defaultUser");
  const userEmail = userData?.email || "";
  const userAvatar = userData?.avatarUrl || userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center cursor-pointer" onClick={() => setPage("gallery")}>
        <img src="/logo-uef.png" alt="UEF" className="h-11 object-contain" />
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => {
            if (item.id === "portfolio") {
              setPage("portfolio", { portfolioSlug: userData?.portfolioSettings?.portfolioSlug });
            } else {
              setPage(item.id);
            }
          }} className={`pb-1 transition-colors ${isActive(item.id) ? "text-[#1a4ba8] border-b-2 border-[#1a4ba8]" : "text-gray-500 hover:text-[#212121]"}`}>{item.label}</button>
        ))}
      </nav>
      <button className="md:hidden flex items-center cursor-pointer text-[#666666] hover:text-[#212121]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className="flex items-center gap-3 text-sm font-medium">
        {isLoggedIn && (
          <div className="flex items-center gap-2">
            <NotificationBell setPage={setPage} />
            <MessageDropdown setPage={setPage} userData={userData} />
          </div>
        )}
        <div className="relative skiptranslate" ref={langRef}>
          <button onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E0E0E0] bg-white text-[#666666] hover:text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer"
            title={lang === 'vi' ? t("english") : t("vietnamese")}>
            <Languages size={16} />
            <span className="text-[11px] font-semibold uppercase">{lang === 'vi' ? 'VI' : 'EN'}</span>
          </button>
          {isLangOpen && (
            <div className="absolute right-0 top-full mt-2 w-40 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden py-1 z-50">
              <button onClick={() => { if (lang !== 'vi') toggleLang(); setIsLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm ${lang === 'vi' ? 'text-[#1a4ba8] font-bold bg-[#eef4ff]' : 'text-[#212121] hover:bg-[#F8F8F8]'}`}>
                {t("tiengViet")}
              </button>
              <button onClick={() => { if (lang !== 'en') toggleLang(); setIsLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm ${lang === 'en' ? 'text-[#1a4ba8] font-bold bg-[#eef4ff]' : 'text-[#212121] hover:bg-[#F8F8F8]'}`}>
                {t("tiengAnh")}
              </button>
            </div>
          )}
        </div>
        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2 cursor-pointer border border-[#E0E0E0] rounded-full p-1 pr-3 hover:bg-[#F8F8F8] transition-colors" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
              <img src={userAvatar} alt="avatar" className="w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" />
              <ChevronDown size={14} className="text-[#666666]" />
            </div>
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden py-1 z-50">
                <div className="px-4 py-3 border-b border-[#E0E0E0] bg-[#F8F8F8]">
                  <p className="text-sm font-bold text-[#212121]">{userName}</p>
                  <p className="text-xs text-[#666666]">{userEmail}</p>
                </div>
                <div className="py-1">
                  {userRole === "student" ? (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("dashboard"); setIsDropdownOpen(false); }}><LayoutDashboard size={16} className="text-[#666666]" /> {t("studentDashboard")}</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("settings"); setIsDropdownOpen(false); }}><Settings size={16} className="text-[#666666]" /> {t("accountSettings")}</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("portfolio_settings"); setIsDropdownOpen(false); }}><Briefcase size={16} className="text-[#666666]" /> {t("portfolioSettings")}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("admin"); setIsDropdownOpen(false); }}><LayoutDashboard size={16} className="text-[#666666]" /> {userRole === "lecturer" ? "Dashboard Giảng viên" : t("adminDashboard")}</div>
                      {userRole === "lecturer" && (
                        <>
                          <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("moodboards"); setIsDropdownOpen(false); }}><Bookmark size={16} className="text-[#666666]" /> Moodboard</div>
                        </>
                      )}
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("settings"); setIsDropdownOpen(false); }}><Settings size={16} className="text-[#666666]" /> {t("accountSettings")}</div>
                    </>
                  )}
                </div>
                <div className="border-t border-[#E0E0E0] py-1">
                  <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#FEF2F2] hover:text-[#8B1A1A] cursor-pointer text-[#8B1A1A] text-sm font-medium transition-colors" onClick={() => { onLogout && onLogout(); setIsDropdownOpen(false); }}><LogOut size={16} /> {t("logout")}</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => setPage("register")} className="text-gray-500 hover:text-[#212121] px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">{t("register")}</button>
            <button onClick={() => setPage("auth")} className="bg-[#1a4ba8] text-white px-5 py-1.5 rounded-lg hover:bg-[#1642a6] transition-colors">{t("login")}</button>
          </>
        )}
      </div>
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="fixed top-14 left-0 right-0 bg-white border-b border-[#E0E0E0] shadow-lg z-40 md:hidden">
          <div className="flex flex-col py-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => {
                if (item.id === "portfolio") {
                  setPage("portfolio", { portfolioSlug: userData?.portfolioSettings?.portfolioSlug });
                } else {
                  setPage(item.id);
                }
                setIsMobileMenuOpen(false);
              }} className={`px-6 py-3 text-sm font-medium text-left transition-colors ${isActive(item.id) ? "text-[#1a4ba8] bg-[#eef4ff]" : "text-gray-600 hover:bg-[#F8F8F8]"}`}>{item.label}</button>
            ))}
            {isLoggedIn && (
              <>
                {userRole === "student" ? (
                  <>
                    <div className="border-t border-[#E0E0E0] my-1" />
                    <button onClick={() => { setPage("dashboard"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><LayoutDashboard size={16} className="inline mr-2" />{t("studentDashboard")}</button>
                    <button onClick={() => { setPage("messages"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><Mail size={16} className="inline mr-2" />{t("inbox")}</button>
                    <button onClick={() => { setPage("settings"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><Settings size={16} className="inline mr-2" />{t("settings")}</button>
                  </>
                ) : (
                  <>
                    <div className="border-t border-[#E0E0E0] my-1" />
                    <button onClick={() => { setPage("admin"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><LayoutDashboard size={16} className="inline mr-2" />{userRole === "lecturer" ? "Dashboard Giảng viên" : t("admin")}</button>
                    {userRole === "lecturer" && (
                      <>
                        <button onClick={() => { setPage("moodboards"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><Bookmark size={16} className="inline mr-2" />Moodboard</button>
                        <button onClick={() => { setPage("messages"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><Mail size={16} className="inline mr-2" />{t("inbox")}</button>
                      </>
                    )}
                    <button onClick={() => { setPage("settings"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><Settings size={16} className="inline mr-2" />{t("settings")}</button>
                  </>
                )}
                <div className="border-t border-[#E0E0E0] my-1" />
                <button onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-[#8B1A1A] hover:bg-[#FEF2F2]"><LogOut size={16} className="inline mr-2" />{t("logout")}</button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <div className="border-t border-[#E0E0E0] my-1" />
                <button onClick={() => { setPage("auth"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-[#1a4ba8] hover:bg-[#eef4ff]">{t("login")}</button>
                <button onClick={() => { setPage("register"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]">{t("register")}</button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

function MasonryGrid({
  items,
  showHover = true,
  onArtworkClick,
  showBookmarkAction = false,
  isBookmarked,
  onBookmarkClick,
}) {
    const [hovered, setHovered] = useState(null);
  const cols = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push(item));
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {col.map(art => (
            <div key={art.id} onClick={() => onArtworkClick && onArtworkClick(art)} style={{ position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG }}
              onMouseEnter={() => setHovered(art.id)} onMouseLeave={() => setHovered(null)}>
              <img src={art.img} alt={art.title} style={{ width: "100%", height: art.h, objectFit: "cover", display: "block" }} />
              {showHover && hovered === art.id && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background:
                      "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "flex-end",
                    padding: "16px 14px",
                  }}
                >
                  {showBookmarkAction && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onBookmarkClick && onBookmarkClick(art);
                      }}
                      title={t("saveToCollectionFlow")}
                      style={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        width: 34,
                        height: 34,
                        borderRadius: 10,
                        border: "1px solid rgba(255,255,255,0.18)",
                        background: isBookmarked && isBookmarked(art.id) ? "rgba(26,75,168,0.92)" : "rgba(255,255,255,0.14)",
                        backdropFilter: "blur(10px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all .15s",
                      }}
                    >
                      <Bookmark
                        size={16}
                        color={isBookmarked && isBookmarked(art.id) ? "#fff" : "rgba(255,255,255,0.9)"}
                        fill={isBookmarked && isBookmarked(art.id) ? "#fff" : "none"}
                      />
                    </button>
                  )}

                  <p style={{ color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 }}>{art.title}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                    <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>{art.student}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Heart size={14} color="#ff6b6b" fill="#ff6b6b" />
                      <span style={{ color: "#fff", fontSize: 12 }}>{art.likes}</span>
                    </div>
                  </div>
                </div>
              )}
              {!art.isPublic && (
                <div style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", borderRadius: 6, padding: "4px 8px", border: `1px solid ${GRAY_LIGHT}`, display: "flex", alignItems: "center", gap: 4 }}>
                  <Lock size={10} color={BLACK} />
                  <span style={{ color: BLACK, fontSize: 11, fontWeight: 500 }}>{t("private")}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

function ProfileQuickViewModal({ person, onClose, setPage }) {
  if (!person) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: "flex" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }} onClick={onClose} />
      
      <div style={{ position: "absolute", top: 16, right: 16, bottom: 16, width: 560, background: "#fff", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}>
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `}</style>
        
        <div style={{ height: 90, background: `url('https://picsum.photos/seed/${person.id}/800/300')`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }} onMouseOver={e => e.currentTarget.style.background="rgba(0,0,0,0.7)"} onMouseOut={e => e.currentTarget.style.background="rgba(0,0,0,0.5)"}>
            <X size={16} />
          </button>
        </div>
        
        <div style={{ padding: "0 24px 20px", textAlign: "center", position: "relative" }}>
          <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#fff", padding: 4, margin: "-40px auto 12px", position: "relative", zIndex: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}>
            <img src={person.avatarUrl || "https://via.placeholder.com/150"} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" />
          </div>
          
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 }}>
            <div style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#191919", margin: 0 }}>{person.fullName}</h2>
              {(() => {
                const iconBadge = person.badges?.find(b => getBadgeIcon(b) !== null);
                const iconSrc = iconBadge ? getBadgeIcon(iconBadge) : null;
                return iconSrc ? <img src={iconSrc} alt={iconBadge} style={{ height: 20, objectFit: "contain", position: "absolute", left: "100%", marginLeft: 6 }} title={iconBadge} /> : null;
              })()}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#666", fontSize: 12, marginBottom: 10 }}>
            <MapPin size={12} />
            {person.location} <span style={{ margin: "0 4px" }}>•</span> <span style={{ color: "#2e7d32", fontWeight: 600 }}>Responds quickly</span>
          </div>
          
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 16 }}>
            {person.badges?.filter(b => getBadgeIcon(b) === null).map(b => {
              if (b === "Featured") {
                return (
                  <span key={b} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 6, background: "#0057ff", color: "#fff", height: 24, boxSizing: "border-box" }}>
                    <Star size={12} fill="#fff" color="#fff" /> {b}
                  </span>
                );
              }
              return (
                <span key={b} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 6, background: "#f5f8ff", color: "#0057ff", height: 24, boxSizing: "border-box" }}>
                  {b}
                </span>
              );
            })}
          </div>
          
          <div style={{ display: "flex", gap: 8 }}>
            <button style={{ flex: 1, padding: "8px", borderRadius: 999, background: "#0057ff", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background .2s" }} onMouseOver={e => e.currentTarget.style.background="#0047d4"} onMouseOut={e => e.currentTarget.style.background="#0057ff"} onClick={() => { onClose(); setPage("portfolio", { portfolioSlug: person.id, openContact: true }); }}>
              <Mail size={14} /> Send Inquiry
            </button>
            <button style={{ flex: 1, padding: "8px", borderRadius: 999, background: "#fff", color: "#191919", border: "1px solid #e0e0e0", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background .2s" }} onMouseOver={e => e.currentTarget.style.background="#f5f5f5"} onMouseOut={e => e.currentTarget.style.background="#fff"} onClick={() => { onClose(); setPage("portfolio", { portfolioSlug: person.id }); }}>
              <ExternalLink size={14} /> View Profile
            </button>
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: "auto", padding: "0 24px 24px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {person.artworks?.map((art, i) => (
              <div key={i} style={{ borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", cursor: "pointer", position: "relative", background: "#f0f0f0" }} className="group">
                <img src={art.coverImageUrl || art.CoverImageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                
                <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", opacity: 0, transition: "opacity .2s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 12px" }} className="hover-overlay" onMouseOver={e => e.currentTarget.style.opacity = 1} onMouseOut={e => e.currentTarget.style.opacity = 0}>
                  <p style={{ margin: "0 0 8px", color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{art.title || art.Title}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#fff" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Eye size={12} />
                      <span style={{ fontSize: 11, fontWeight: 500 }}>{(art.viewCount || art.ViewCount) >= 1000 ? ((art.viewCount || art.ViewCount)/1000).toFixed(1) + 'k' : (art.viewCount || art.ViewCount)}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Heart size={12} />
                      <span style={{ fontSize: 11, fontWeight: 500 }}>{(art.likeCount || art.LikeCount) >= 1000 ? ((art.likeCount || art.LikeCount)/1000).toFixed(1) + 'k' : (art.likeCount || art.LikeCount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function PeopleGrid({ setPage }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);

  useEffect(() => {
    fetch("/api/users/people")
      .then(res => res.json())
      .then(data => { setPeople(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: "center", color: "#666" }}>Đang tải danh sách sinh viên...</div>;

  return (
    <div style={{ padding: "0 32px 64px", background: "#f9f9f9", minHeight: "100vh" }}>
      <div style={{ background: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop')", backgroundSize: "cover", backgroundPosition: "center", borderRadius: 16, padding: "64px 32px", textAlign: "center", color: "#fff", marginBottom: 32, position: "relative", overflow: "hidden" }}>
        <h2 style={{ fontSize: 36, fontWeight: 800, marginBottom: 12, position: "relative", zIndex: 2 }}>Looking to Hire a Creator?</h2>
        <p style={{ fontSize: 18, color: "#e0e0e0", position: "relative", zIndex: 2 }}>Over 10,000 students are available for your next big project.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
        {people.map(p => (
          <div key={p.id} onClick={() => setSelectedPerson(p)} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }} onMouseOver={e => {e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)"}} onMouseOut={e => {e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"}}>
            <div style={{ display: "flex", gap: 0, background: "#f0f0f0", position: "relative", marginBottom: 32 }}>
              {p.artworks && p.artworks.length > 0 ? p.artworks.slice(0, 4).map((art, i) => (
                <div key={i} style={{ flex: 1, aspectRatio: "1/1", overflow: "hidden", borderRight: i < 3 ? "2px solid #fff" : "none" }}>
                  <img src={art.coverImageUrl || art.CoverImageUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                </div>
              )) : <div style={{ flex: 1, aspectRatio: "4/1" }} />}
              <div style={{ position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 84, height: 84, borderRadius: "50%", background: "#fff", padding: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 2 }}>
                <img src={p.avatarUrl || "https://via.placeholder.com/150"} style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} alt="" />
              </div>
            </div>
            
            <div style={{ padding: "16px 20px 24px", textAlign: "center" }}>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 4 }}>
                <div style={{ display: "inline-flex", alignItems: "center", position: "relative" }}>
                  <h3 style={{ fontSize: 16, fontWeight: 800, color: "#191919", margin: 0 }}>{p.fullName}</h3>
                  {(() => {
                    const iconBadge = p.badges?.find(b => getBadgeIcon(b) !== null);
                    const iconSrc = iconBadge ? getBadgeIcon(iconBadge) : null;
                    return iconSrc ? <img src={iconSrc} alt={iconBadge} style={{ height: 22, objectFit: "contain", position: "absolute", left: "100%", marginLeft: 6 }} title={iconBadge} /> : null;
                  })()}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 4, color: "#777", fontSize: 13, marginBottom: 16 }}>
                <MapPin size={14} />
                {p.location}
              </div>
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8 }}>
                {p.badges?.filter(b => getBadgeIcon(b) === null).map(b => {
                  if (b === "Featured") {
                    return (
                      <span key={b} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 8, background: "#f5f8ff", color: "#0057ff", height: 32, boxSizing: "border-box" }}>
                        <Star size={14} fill="#0057ff" color="#0057ff" /> {b}
                      </span>
                    );
                  }
                  return (
                    <span key={b} style={{ display: "flex", alignItems: "center", fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 8, background: "#f5f5f5", color: "#444", height: 32, boxSizing: "border-box" }}>{b}</span>
                  );
                })}
              </div>
            </div>
            
            <div style={{ display: "flex", padding: "0 0 20px", width: "85%", margin: "0 auto" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#191919" }}>{p.appreciations >= 1000 ? (p.appreciations/1000).toFixed(1) + 'K' : p.appreciations}</div>
                <div style={{ fontSize: 12, color: "#777" }}>Appreciations</div>
              </div>
              <div style={{ width: 1, background: "#e0e0e0", margin: "6px 0" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#191919" }}>{p.followersCount >= 1000 ? (p.followersCount/1000).toFixed(1) + 'K' : p.followersCount}</div>
                <div style={{ fontSize: 12, color: "#777" }}>Followers</div>
              </div>
              <div style={{ width: 1, background: "#e0e0e0", margin: "6px 0" }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: "#191919" }}>{p.projectViews >= 1000 ? (p.projectViews/1000).toFixed(1) + 'K' : p.projectViews}</div>
                <div style={{ fontSize: 12, color: "#777" }}>Project Views</div>
              </div>
            </div>

            <div style={{ padding: "0 20px 24px" }}>
              <button 
                onClick={(e) => { e.stopPropagation(); setPage("portfolio", { portfolioSlug: p.id, openContact: true }); }}
                style={{ width: "100%", padding: "10px", borderRadius: 999, border: "1px solid #ccc", background: "#fff", color: "#191919", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background .2s" }} 
                onMouseOver={e => e.currentTarget.style.background = "#f5f5f5"} 
                onMouseOut={e => e.currentTarget.style.background = "#fff"}
              >
                Message {p.fullName.split(' ')[0]}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <ProfileQuickViewModal person={selectedPerson} onClose={() => setSelectedPerson(null)} setPage={setPage} />
    </div>
  );
}

function GalleryPage({ setPage, setActiveArtworkId, onBookmarkClick, isBookmarked }) {
  const { user: authUser } = useAuth();
  const [filters, setFilters] = useState({ category: "Tất cả", year: "Tất cả", tool: "Tất cả", sort: "newest", q: "", hasBadge: false });
  const [searchTab, setSearchTab] = useState("projects");
  const [page, setPageNum] = useState(1);
  const [data, setData] = useState({ artworks: [], total: 0, totalPages: 0 });
  const [isVisualSearching, setIsVisualSearching] = useState(false);
  const [visualSearchResults, setVisualSearchResults] = useState(null);
  const [showVisualSearchPopup, setShowVisualSearchPopup] = useState(false);
  const visualSearchInputRef = useRef(null);

  const handleVisualSearch = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsVisualSearching(true);
    setVisualSearchResults(null);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/artworks/visual-search", { method: "POST", body: formData });
      const d = await res.json();
      if (res.ok) setVisualSearchResults(d.items || []);
      else alert(d || "Lỗi tìm kiếm");
    } catch (err) {
      alert("Lỗi kết nối");
    }
    setIsVisualSearching(false);
    e.target.value = "";
  };
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showYearTool, setShowYearTool] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [categoryCovers, setCategoryCovers] = useState({});
  const [toolCovers, setToolCovers] = useState({});
  const [navbarHeight, setNavbarHeight] = useState(0);

  const fetchId = useRef(0);
  const observerTarget = useRef(null);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      if (header) setNavbarHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const UEF_RED = "#DA291C";
  const UEF_BLUE = "#1a4ba8";
  const UEF_WHITE = "#FFFFFF";

  const categories = ["Tất cả", "Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const years = ["Tất cả", "2022-2023", "2023-2024", "2024-2025"];
  const toolsList = ["Tất cả", "Figma", "Illustrator", "Photoshop", "Blender", "Procreate", "After Effects", "InDesign", "Lightroom", "Cinema 4D"];

  useEffect(() => {
    fetch("/api/artworks/category-covers")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item.subject] = item.coverImageUrl; });
          setCategoryCovers(map);
        } else {
          setCategoryCovers(data);
        }
      })
      .catch(() => {});

    fetch("/api/artworks/tool-covers")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item.tool] = item.coverImageUrl; });
          setToolCovers(map);
        } else {
          setToolCovers(data);
        }
      })
      .catch(() => {});
  }, []);

  const [limit] = useState(15);

  useEffect(() => {
    const id = ++fetchId.current;
    setLoading(true);
    const params = { page: String(page), limit: String(limit), sort: filters.sort };
    if (filters.category !== "Tất cả") params.category = filters.category;
    if (filters.year !== "Tất cả") params.year = filters.year;
    if (filters.tool !== "Tất cả") params.tool = filters.tool;
    if (filters.q.trim()) params.q = filters.q.trim();
    if (filters.hasBadge) params.hasBadge = true;

    const fetchMethod = feedMode && authUser ? api.artworks.feed(params) : api.artworks.list(params);

    fetchMethod.then(res => {
      if (id === fetchId.current) { 
        setData(prev => ({
          ...res,
          artworks: page === 1 ? (res.artworks || []) : [...(prev.artworks || []), ...(res.artworks || [])]
        }));
        setLoading(false); 
      }
    }).catch(() => { if (id === fetchId.current) setLoading(false); });
  }, [filters, page, limit, feedMode, authUser]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && data.page < data.totalPages) {
          setPageNum(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, data.page, data.totalPages]);

  const setFilter = (key, val) => {
    setFilters(prev => ({ ...prev, [key]: val }));
    setPageNum(1);
  };

  const activeFilterCount = [filters.year !== "Tất cả", filters.tool !== "Tất cả"].filter(Boolean).length;

  const mapped = (data.artworks || []).map(a => ({
    id: a.id,
    title: a.title,
    student: a.user?.fullName || t("student"),
    img: a.coverImageUrl,
    likes: a.likeCount || 0,
    views: a.viewCount || 0,
    isPublic: a.isPublic,
    category: a.subject,
    isAiVerified: a.isAiVerified,
    badges: a.badges || [],
  }));

  const displayData = visualSearchResults 
    ? visualSearchResults.map(a => ({
        id: a.id,
        title: a.title,
        student: a.user?.fullName || t("student"),
        img: a.coverImageUrl,
        likes: a.likeCount || 0,
        views: a.viewCount || 0,
        isPublic: true,
        similarityScore: a.similarityScore
      }))
    : mapped;

  const paginate = (p) => setPageNum(Math.max(1, Math.min(p, data.totalPages || 1)));

  return (
    <div style={{ background: "#fff" }}>
      <div style={{ position: "sticky", top: navbarHeight, background: "#fff", zIndex: 40, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
        <div style={{ padding: "16px 32px 0", width: "100%", boxSizing: "border-box" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <button
            onClick={() => setShowYearTool(v => !v)}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderRadius: 999, border: `1px solid ${showYearTool || activeFilterCount > 0 ? UEF_BLUE : GRAY_LIGHT}`, background: showYearTool || activeFilterCount > 0 ? `${UEF_BLUE}08` : "#fff", color: UEF_BLUE, fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }}
          >
            <Filter size={18} />
            <span>{t("filter")}</span>
            {activeFilterCount > 0 && (
              <span style={{ marginLeft: 4, background: UEF_BLUE, color: "#fff", fontSize: 12, fontWeight: 700, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>{activeFilterCount}</span>
            )}
          </button>

          <div style={{ position: "relative", flex: 1, display: "flex", alignItems: "center" }}>
            <Search size={20} style={{ position: "absolute", left: 24, color: "#444", pointerEvents: "none", zIndex: 2 }} />
            <input value={filters.q} onChange={e => { setFilter("q", e.target.value); setVisualSearchResults(null); }} placeholder={t("searchArtworkStudentTags")} style={{ width: "100%", padding: "14px 120px 14px 56px", borderRadius: 999, border: searchFocused ? `1px solid ${GRAY_LIGHT}` : `1px solid transparent`, fontSize: 16, outline: "none", background: searchFocused ? "#fff" : "#f3f3f4", color: BLACK, boxSizing: "border-box", transition: "all .2s", fontWeight: 400 }} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} />
            
            <div style={{ position: "absolute", right: 12, display: "flex", alignItems: "center", gap: 12, height: "100%", top: 0 }}>
              {filters.q && (
                <button onClick={() => setFilter("q", "")} style={{ background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex", marginRight: 8 }}><X size={18} /></button>
              )}
              
              <div style={{ display: "flex", gap: 20, alignItems: "center", marginRight: 8 }}>
                <button onClick={() => setSearchTab("projects")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: searchTab === "projects" ? "#191919" : "#888" }}>Tác phẩm</button>
                <button onClick={() => setSearchTab("people")} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: searchTab === "people" ? "#191919" : "#888" }}>Sinh viên</button>
                <div style={{ width: 1, height: 16, background: "#e0e0e0" }} />
              </div>
              
              <button 
                onClick={() => setShowVisualSearchPopup(!showVisualSearchPopup)} 
                title="Tìm kiếm bằng hình ảnh (AI Visual Search)"
                style={{ background: isVisualSearching || showVisualSearchPopup ? `${UEF_BLUE}20` : "none", border: "none", cursor: "pointer", color: isVisualSearching || showVisualSearchPopup ? UEF_BLUE : "#191919", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background .2s, color .2s" }}
                onMouseOver={e => { if(!isVisualSearching && !showVisualSearchPopup) e.currentTarget.style.background = "#e4e4e6" }} 
                onMouseOut={e => { if(!isVisualSearching && !showVisualSearchPopup) e.currentTarget.style.background = "none" }}
              >
                <FolderInput size={22} strokeWidth={1.5} />
              </button>
            </div>
            <input type="file" accept="image/*" ref={visualSearchInputRef} style={{ display: "none" }} onChange={(e) => { setShowVisualSearchPopup(false); handleVisualSearch(e); }} />

            {showVisualSearchPopup && (
              <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, width: 800, maxWidth: "calc(100vw - 40px)", background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)", zIndex: 100, padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 16, fontWeight: 700, color: "#191919" }}>Search by Image</span>
                    <span style={{ background: UEF_BLUE, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: 0.5 }}>AI</span>
                  </div>
                  <button onClick={() => setShowVisualSearchPopup(false)} style={{ background: "none", border: "1px solid #e0e0e0", borderRadius: 4, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }} onMouseOver={e => e.currentTarget.style.background="#f5f5f5"} onMouseOut={e => e.currentTarget.style.background="none"}>
                    <X size={16} />
                  </button>
                </div>
                
                <div 
                  onClick={() => visualSearchInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); }}
                  onDrop={(e) => {
                    e.preventDefault(); e.stopPropagation();
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const file = e.dataTransfer.files[0];
                      const dt = new DataTransfer();
                      dt.items.add(file);
                      if (visualSearchInputRef.current) {
                        visualSearchInputRef.current.files = dt.files;
                        setShowVisualSearchPopup(false);
                        handleVisualSearch({ target: visualSearchInputRef.current });
                      }
                    }
                  }}
                  style={{ background: "#f8faff", border: "1px dashed #c0d0f0", borderRadius: 8, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background .2s" }}
                  onMouseOver={e => e.currentTarget.style.background = "#f0f4ff"}
                  onMouseOut={e => e.currentTarget.style.background = "#f8faff"}
                >
                  {isVisualSearching ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
                      <div className="w-8 h-8 border-4 border-t-[#1a4ba8] border-r-[#1a4ba8] border-b-[#e0e0e0] border-l-[#e0e0e0] rounded-full animate-spin"></div>
                      <span style={{ fontSize: 16, fontWeight: 600, color: "#191919" }}>Đang phân tích hình ảnh...</span>
                    </div>
                  ) : (
                    <>
                      <span style={{ fontSize: 16, fontWeight: 700, color: "#191919", marginBottom: 12 }}>Drag and drop an image here</span>
                      <span style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>File types supported: JPG, PNG, GIF, TIFF, WebP. Max size 10MB</span>
                      <button style={{ background: "#fff", border: "1px solid #d0d0d0", borderRadius: 999, padding: "8px 24px", fontSize: 14, fontWeight: 600, color: "#191919", cursor: "pointer" }}>
                        Choose Image
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            {authUser && (
              <button onClick={() => { setFeedMode(!feedMode); setPageNum(1); }} style={{ padding: "10px 18px", borderRadius: 999, border: `1px solid ${feedMode ? UEF_BLUE : GRAY_LIGHT}`, background: feedMode ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: feedMode ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s", marginRight: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <Users size={16} /> <span>Đang theo dõi</span>
              </button>
            )}
            <button onClick={() => setFilter("sort", "newest")} style={{ padding: "10px 18px", borderRadius: 999, border: `1px solid ${filters.sort === "newest" ? UEF_BLUE : GRAY_LIGHT}`, background: filters.sort === "newest" ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: filters.sort === "newest" ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" }}>{t("newest")}</button>
            <button onClick={() => setFilter("sort", "most_likes")} style={{ padding: "10px 18px", borderRadius: 999, border: `1px solid ${filters.sort === "most_likes" ? UEF_BLUE : GRAY_LIGHT}`, background: filters.sort === "most_likes" ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: filters.sort === "most_likes" ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" }}>{t("mostLiked")}</button>
          </div>


          </div>

        {showYearTool && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10, flexWrap: "wrap" }}>
            <select value={filters.year} onChange={e => setFilter("year", e.target.value)} style={{ padding: "4px 8px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 11, color: BLACK, background: "#fff", outline: "none", cursor: "pointer" }}>
              {years.map(y => <option key={y} value={y}>{y === "Tất cả" ? `${t("schoolYear")}: ${t("all")}` : y}</option>)}
            </select>
            <label style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer", fontSize: 11, color: BLACK, fontWeight: 500, userSelect: "none" }}>
              <input type="checkbox" checked={filters.hasBadge} onChange={e => setFilter("hasBadge", e.target.checked)} style={{ cursor: "pointer" }} />
              <span>Chỉ hiện bài có Huy hiệu</span>
            </label>
            {activeFilterCount > 0 && (
              <button onClick={() => { setFilter("year", "Tất cả"); setFilter("tool", "Tất cả"); setFilter("hasBadge", false); }} style={{ padding: "3px 8px", borderRadius: 6, border: "none", background: "transparent", color: UEF_RED, fontSize: 11, cursor: "pointer", fontWeight: 500 }}>{t("reset")}</button>
            )}
          </div>
        )}

        <div style={{ position: "relative", marginBottom: 8, display: "flex", alignItems: "center" }}>
          
          <button 
            onClick={() => { const el = document.getElementById('main-filters-scroll'); if(el) el.scrollBy({left: -400, behavior: 'smooth'}); }}
            style={{ position: "absolute", left: -18, zIndex: 10, background: "white", border: `1px solid ${GRAY_LIGHT}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          >
            <ChevronLeft size={20} color={BLACK} />
          </button>

          <div id="main-filters-scroll" className="gallery-cat-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", msOverflowStyle: "none", flex: 1, padding: "0 24px", scrollBehavior: "smooth" }}>
            <style>{`#main-filters-scroll::-webkit-scrollbar { display: none; }`}</style>
            {categories.map(cat => {
              const coverUrl = cat !== "Tất cả" ? categoryCovers[cat] : null;
              const isActive = filters.category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setFilter("category", cat)}
                  style={{
                    position: "relative",
                    padding: "0 20px",
                    height: 44,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    color: UEF_WHITE,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all .2s",
                    overflow: "hidden",
                    background: isActive ? UEF_BLUE : "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {coverUrl && !isActive && (
                    <>
                      <img src={coverUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
                    </>
                  )}
                  <span style={{ position: "relative", zIndex: 1, textShadow: coverUrl && !isActive ? "0 1px 4px rgba(0,0,0,0.9)" : "none" }}>{cat}</span>
                </button>
              );
            })}
            
            <div style={{ width: 1, background: "#ccc", margin: "0 8px", alignSelf: "stretch", flexShrink: 0, opacity: 0.5 }} />

            {toolsList.map(toolItem => {
              const coverUrl = toolItem !== "Tất cả" ? toolCovers[toolItem] : null;
              const isActive = filters.tool === toolItem;
              return (
                <button
                  key={toolItem}
                  onClick={() => setFilter("tool", toolItem)}
                  style={{
                    position: "relative",
                    padding: "0 20px",
                    height: 44,
                    borderRadius: 6,
                    border: "none",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: 14,
                    color: UEF_WHITE,
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                    transition: "all .2s",
                    overflow: "hidden",
                    background: isActive ? UEF_BLUE : "#222",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {coverUrl && !isActive && (
                    <>
                      <img src={coverUrl} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
                    </>
                  )}
                  <span style={{ position: "relative", zIndex: 1, textShadow: coverUrl && !isActive ? "0 1px 4px rgba(0,0,0,0.9)" : "none" }}>{toolItem === "Tất cả" ? "Tất cả Phần mềm" : toolItem}</span>
                </button>
              );
            })}
          </div>

          <button 
            onClick={() => { const el = document.getElementById('main-filters-scroll'); if(el) el.scrollBy({left: 400, behavior: 'smooth'}); }}
            style={{ position: "absolute", right: -18, zIndex: 10, background: "white", border: `1px solid ${GRAY_LIGHT}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
          >
            <ChevronRight size={20} color={BLACK} />
          </button>
        </div>
      </div>
      </div>

      {searchTab === "people" ? (
        <PeopleGrid setPage={setPage} />
      ) : (
      <div style={{ padding: "8px 32px 64px", width: "100%", boxSizing: "border-box" }}>
        {loading && page === 1 ? (
          <GlobalLoading />
        ) : displayData.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED, fontSize: 14 }}>{t("noArtworksFound")}</div>
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 }}>
              {displayData.map(art => (
                <div
                  key={art.id}
                  onClick={() => setPage("detail", { artworkId: art.id })}
                  style={{ cursor: "pointer", transition: "transform .15s", transform: hoveredId === art.id ? "translateY(-2px)" : "none" }}
                  onMouseEnter={() => setHoveredId(art.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: GRAY_BG, transition: "filter .2s", filter: hoveredId === art.id ? "brightness(0.85)" : "none" }}>
                    {art.img ? <img src={art.img} alt={art.title} style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }} /> : (
                      <div style={{ width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 12 }}>{t("noImage")}</div>
                    )}
                    <div style={{ position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4, zIndex: 2 }}>
                      {!art.isPublic && (
                        <div style={{ background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4 }}>
                          <Lock size={10} color="#fff" />
                          <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{t("private")}</span>
                        </div>
                      )}
                      {art.isAiVerified && (
                        <div style={{ background: "linear-gradient(to right, #1a4ba8, #0ea5e9)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                          <ShieldCheck size={10} color="#fff" />
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>AI VERIFIED</span>
                        </div>
                      )}
                      {art.similarityScore && (
                        <div style={{ background: "#4caf50", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
                          <ImageIcon size={10} color="#fff" />
                          <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>GIỐNG {art.similarityScore}%</span>
                        </div>
                      )}
                    </div>

                    {/* BADGE ON TOP RIGHT */}
                    {(art.badges && art.badges.length > 0) && (
                      <div className="group" style={{ position: "absolute", top: 0, right: 16, zIndex: 10 }}>
                        <div style={{ width: 32, height: 44, background: art.badges[0].colorCode || "#B49A65", color: art.badges[0].textColor || "#fff", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)", display: "flex", justifyContent: "center", paddingTop: 8, fontWeight: "bold", fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" }}>
                          {art.badges[0].name?.substring(0, 2).toUpperCase() || "GR"}
                        </div>
                        <div className="absolute top-full mt-1 right-0 bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}>
                          <div style={{ position: "absolute", bottom: "100%", right: 10, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "6px solid #fff" }} />
                          <div style={{ fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 4, textTransform: "uppercase" }}>FEATURED IN</div>
                          <div style={{ fontSize: 13, fontWeight: "bold", color: "#0057ff" }}>
                            {art.badges[0].name} <span style={{ color: "#aaa", fontWeight: "normal" }}>— {new Date(art.badges[0].assignedAt || art.createdAt).toLocaleDateString('en-GB')}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {onBookmarkClick && hoveredId === art.id && (
                      <button
                        onClick={(e) => { e.stopPropagation(); onBookmarkClick(art); }}
                        style={{ position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 8, border: "none", background: isBookmarked && isBookmarked(art.id) ? "rgba(26,75,168,0.9)" : "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3, transition: "all .15s" }}
                      >
                        <Bookmark size={14} color="#fff" fill={isBookmarked && isBookmarked(art.id) ? "#fff" : "none"} />
                      </button>
                    )}
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", padding: "24px 12px 10px", opacity: hoveredId === art.id ? 1 : 0, transition: "opacity .2s", pointerEvents: "none" }}>
                      <p style={{ margin: 0, color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" }}>{art.title}</p>
                    </div>
                  </div>
                  <p style={{ margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{art.student}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      <Eye size={13} color="#999" />
                      <span style={{ fontSize: 12, color: MUTED }}>{art.views}</span>
                      <Heart size={12} color="#ccc" />
                      <span style={{ fontSize: 12, color: MUTED }}>{art.likes}</span>
                    </div>
                  </div>
                </div>
              ))}
              {loading && page > 1 && Array.from({ length: 5 }).map((_, i) => (
                <div key={`skeleton-${i}`} style={{ width: "100%" }}>
                  <div style={{ width: "100%", aspectRatio: "4/3", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
                  <div style={{ marginTop: 8, height: 16, width: "80%", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
                  <div style={{ marginTop: 4, height: 12, width: "50%", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" }} />
                </div>
              ))}
            </div>
            {data.page < data.totalPages && (
              <div
                ref={observerTarget}
                style={{ height: 20 }}
              >
              </div>
            )}
          </>
        )}
      </div>
      )}
    </div>
  );
}

function PortfolioPage({ setPage, pageParams }) {
  const { user: authUser } = useAuth();
  const [isDraftBuilderOpen, setIsDraftBuilderOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactState, setContactState] = useState("idle");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPurpose, setContactPurpose] = useState(t("recruitmentInternship"));
  const [contactContent, setContactContent] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioArtworks, setPortfolioArtworks] = useState([]);
  const [portfolioSettingsData, setPortfolioSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState(t("allArtworks"));
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [modalType, setModalType] = useState(null);
  const [modalUsers, setModalUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("work");
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [portfolioMoodboards, setPortfolioMoodboards] = useState([]);
  const [publicMoodboards, setPublicMoodboards] = useState([]);
  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);

  const handleDeleteDraft = (e, draftId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this draft?")) {
      const updated = drafts.filter(d => d.id !== draftId);
      setDrafts(updated);
      localStorage.setItem('uef_drafts', JSON.stringify(updated));
    }
  };

  useEffect(() => {
    try {
      const saved = localStorage.getItem('uef_drafts');
      if (saved) setDrafts(JSON.parse(saved));
    } catch(e){}
  }, []);

  const hashSlug = (window.location.hash.match(/^#\/portfolio\/(.+)/) || [])[1] || "";
  const slug = pageParams?.portfolioSlug || hashSlug;
  const titleByYear = { "Năm 1": t("freshmanDesigner"), "Năm 2": t("internDesigner"), "Năm 3": t("professionalDesigner"), "Năm 4": t("seniorDesigner"), "Tốt nghiệp": t("graduateDesigner") };

  useEffect(() => {
    if (pageParams?.openContact) {
      setIsContactModalOpen(true);
    }
  }, [pageParams]);

  useEffect(() => {
    setIsFollowing(portfolioData?.stats?.isFollowing || false);
    setFollowersCount(portfolioData?.stats?.followers || 0);
  }, [portfolioData?.stats]);

  useEffect(() => {
    setLoading(true);
    setPortfolioSettingsData(null);
    const fetchFn = slug ? api.portfolios.get(slug) : api.portfolios.me();
    const statsFn = slug ? api.portfolios.stats(slug) : Promise.resolve({});

    Promise.all([
      fetchFn.catch(() => null),
      statsFn.catch(() => ({})),
    ]).then(([pData, pStats]) => {
      if (pData) {
        pData.stats = { ...(pData.stats || {}), ...pStats };
        if (pData.artworks) setPortfolioArtworks(pData.artworks);
        setPortfolioData(pData);
        const pSet = pData.portfolioSettings || pData.settings || {};
        setPublicMoodboards(pSet.publicMoodboards || []);
        
        const uId = pData.user?.id || pData.id;
        if (uId) {
           api.collections.getByUser(uId).then(res => {
              setPortfolioMoodboards(Array.isArray(res) ? res : []);
           }).catch(() => {});
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));

    api.portfolios.mine().then(data => {
      setPortfolioSettingsData(data);
    }).catch(() => {});
  }, [slug]);

  if (loading) return <GlobalLoading />;
  if (!portfolioData) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, minHeight: "100vh", background: "#f8f8f8" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={28} color={CRIMSON} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: BLACK, margin: 0 }}>{t("portfolioNotFound")}</h2>
        <p style={{ fontSize: 14, color: MUTED, margin: 0, maxWidth: 400, textAlign: "center" }}>User này chưa setup portfolio, hãy quay lại sau.</p>
        <button onClick={() => setPage && setPage("gallery")} style={{ background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToGallery")}</button>
      </div>
    );
  }

  const { stats, featuredArtworks, privateGrade } = portfolioData;
  const pUser = portfolioData.user || portfolioData;

  const toggleFollow = async () => {
    if (!authUser) {
      alert(t("loginWithEmailToUse") || "Vui lòng đăng nhập để sử dụng tính năng này.");
      return;
    }
    if (!slug || !pUser?.id || authUser.id === pUser.id) return;
    try {
      if (isFollowing) {
        await api.users.unfollow(pUser.id);
        setIsFollowing(false);
        setFollowersCount(prev => prev - 1);
      } else {
        await api.users.follow(pUser.id);
        setIsFollowing(true);
        setFollowersCount(prev => prev + 1);
      }
    } catch (e) {
      console.error(e);
      alert(t("pleaseTryAgain") || "Vui lòng thử lại");
    }
  };

  const openFollowModal = async (type) => {
    if (!pUser?.id) return;
    setModalType(type);
    try {
      const data = type === 'followers' 
        ? await api.users.followers(pUser.id)
        : await api.users.following(pUser.id);
      setModalUsers(data || []);
    } catch (e) {
      console.error(e);
      setModalUsers([]);
    }
  };
  const pSettings = portfolioData.portfolioSettings || portfolioData.settings || {};
  const profile = {
    fullName: pUser?.fullName || t("student"),
    profileHeadline: pSettings?.profileHeadline || "Design Student",
    bio: pUser?.bio || "",
    avatarUrl: pUser?.avatarUrl || "",
    email: pUser?.email || "",
  };
  const socialLinksRaw = typeof pSettings?.socialLinks === 'string' 
    ? (function(){ try { return JSON.parse(pSettings.socialLinks); } catch(e){ return {}; } })() 
    : (pSettings?.socialLinks || {});
  const socialLinks = [
    socialLinksRaw.behance && { label: "Behance", href: socialLinksRaw.behance, icon: "globe" },
    socialLinksRaw.linkedin && { label: "LinkedIn", href: socialLinksRaw.linkedin, icon: "link" },
    profile.email && pSettings?.showEmail && { label: t("email"), href: `mailto:${profile.email}`, icon: "mail" },
  ].filter(Boolean);

  const explicitFeaturedArtworks = (pSettings?.featuredArtworkIds || [])
    .map(id => (portfolioArtworks || []).find(a => a.id === id))
    .filter(Boolean);

  const highlightWorks = (portfolioArtworks || []).filter(a => a.isHighlighted).slice(0, 2);
  const topLikedWorks = (portfolioArtworks || []).filter(a => !a.isHighlighted).sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 2);
  const extraWorks = highlightWorks.length >= 2 ? highlightWorks : [...highlightWorks, ...topLikedWorks].slice(0, 2);
  const allFeatured = (portfolioArtworks && portfolioArtworks.length > 0)
    ? [...explicitFeaturedArtworks, ...extraWorks.filter(ex => !explicitFeaturedArtworks.some(f => f.id === ex.id))]
    : [];
    
  const featuredWorks = allFeatured.slice(0, 10).map((a, i) => {
    return {
      id: a.id,
      title: a.title,
      img: a.coverImageUrl || a.img,
      tools: a.toolsUsed || [a.tool, a.category].filter(Boolean),
      tags: a.tags || [a.category].filter(Boolean),
      student: a.user?.fullName || a.student || profile.fullName,
      views: a.viewCount || a.likes || 0,
      likes: a.likeCount || a.likes || 0,
      isPublic: a.isPublic !== false
    };
  });

  const allPortfolioWorks = (portfolioArtworks && portfolioArtworks.length > 0) 
    ? portfolioArtworks.map((a) => ({
        id: a.id,
        title: a.title,
        img: a.coverImageUrl || a.img,
        tools: a.toolsUsed || [],
        tags: a.tags || [],
        student: a.user?.fullName || a.student || profile.fullName,
        views: a.viewCount || 0,
        likes: a.likeCount || 0,
        isPublic: a.isPublic !== false
      }))
    : [];

  const handleContactSubmit = async () => {
    if (!contactName || !contactEmail || !contactContent) return;
    setContactState("loading");
    try {
      const targetSlug = slug || (portfolioSettingsData?.portfolioSlug || "");
      await api.portfolios.sendContact(targetSlug, {
        senderName: contactName,
        senderEmail: contactEmail,
        purpose: contactPurpose,
        content: contactContent,
      });
      setContactState("success");
    } catch (e) {
      alert(t("sendError") + (e?.message || t("pleaseTryAgain")));
      setContactState("idle");
    }
  };

  const closeContactModal = () => {
    setIsContactModalOpen(false);
    setTimeout(() => setContactState("idle"), 300);
  };

  const handleBannerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingBanner(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        try {
          const payload = {
             portfolioSlug: pSettings?.portfolioSlug,
             profileHeadline: pSettings?.profileHeadline,
             major: pSettings?.major,
             yearLevel: pSettings?.yearLevel,
             isPortfolioPublic: pSettings?.isPortfolioPublic,
             socialLinks: typeof pSettings?.socialLinks === 'string' ? pSettings.socialLinks : JSON.stringify(pSettings?.socialLinks || {}),
             featuredArtworkIds: pSettings?.featuredArtworkIds,
             bannerUrl: dataUrl
          };
          await api.portfolios.updateMine(payload);
          setPortfolioSettingsData(prev => ({ ...(prev || {}), bannerUrl: dataUrl }));
          if (portfolioData) {
            const upd = { ...portfolioData };
            if (upd.portfolioSettings) upd.portfolioSettings.bannerUrl = dataUrl;
            else if (upd.settings) upd.settings.bannerUrl = dataUrl;
            setPortfolioData(upd);
          }
        } catch (err) {
          alert("Lỗi upload banner: " + err.message);
        } finally {
          setIsUploadingBanner(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingAvatar(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") {
        try {
          await api.users.updateAvatar(dataUrl);
          if (portfolioData) {
            const upd = { ...portfolioData };
            if (upd.user) upd.user.avatarUrl = dataUrl;
            else upd.avatarUrl = dataUrl;
            setPortfolioData(upd);
          }
        } catch (err) {
          alert("Lỗi upload avatar: " + err.message);
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const bannerUrl = portfolioSettingsData?.bannerUrl || pSettings?.bannerUrl || "";
  const isOwner = authUser && authUser.id === pUser?.id;

  return (
    <div className="bg-[#f8f8f8] min-h-screen">
      <style>{`
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-auto-rows: 26px;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .bento-grid { grid-auto-rows: 24px; gap: 16px; }
        }
      `}</style>

      {/* BANNER SECTION */}
      <div className="w-full relative bg-[#1a4ba8]/5 group" style={{ height: "220px" }}>
        {bannerUrl ? (
          <>
            <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
            {isOwner && (
              <div 
                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10"
                onClick={() => document.getElementById("bannerUpload")?.click()}
              >
                <div className="flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-lg">
                  <Image size={20} />
                  <span>Thay đổi ảnh bìa</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a4ba8]/10 to-[#1a4ba8]/20 border-b border-[#E0E0E0]">
            {isOwner && (
               <div className="flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-[#1a4ba8]" onClick={() => document.getElementById("bannerUpload")?.click()}>
                 <ArrowDownCircle size={36} />
                 <span className="font-semibold text-lg">Thêm ảnh bìa</span>
                 <span className="text-sm">Kích thước tối ưu 3200 x 410px</span>
               </div>
            )}
          </div>
        )}
        <input type="file" id="bannerUpload" accept="image/*" style={{ display: "none" }} onChange={handleBannerUpload} />
        {isUploadingBanner && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-20">
             <div className="px-4 py-2 bg-black/80 text-white rounded-lg text-sm font-semibold">Đang tải lên...</div>
          </div>
        )}
      </div>

      <main className="w-full max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* LEFT COLUMN */}
          <div className="w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 -mt-14 relative z-20">
            <div className="flex flex-col items-start text-left">
               <div className="relative w-[110px] h-[110px] rounded-full border-[4px] border-white shadow-sm bg-[#F8F8F8] mb-3 group overflow-hidden">
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                  {isOwner && (
                    <div 
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                      onClick={() => document.getElementById("avatarUpload")?.click()}
                      title="Thay đổi ảnh đại diện"
                    >
                      <Image size={24} className="text-white" />
                    </div>
                  )}
                  {isUploadingAvatar && (
                    <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4ba8]"></div>
                    </div>
                  )}
               </div>
               <input type="file" id="avatarUpload" accept="image/*" style={{ display: "none" }} onChange={handleAvatarUpload} />
               
               <h1 className="text-[22px] font-bold text-[#212121] tracking-tight mb-1">
                  {profile.fullName}
               </h1>
               
               <p className="text-[13px] text-[#666666] font-medium mb-3">
                  {profile.profileHeadline} • {portfolioSettingsData?.portfolioSettings?.major || portfolioSettingsData?.major || pSettings?.major || t("graphicDesign")} • UEF
               </p>
               
               {profile.bio && (
                 <p className="text-[13px] text-[#444444] leading-relaxed mb-6">
                    {profile.bio}
                 </p>
               )}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-3 mb-6 w-full mt-2">
               <button
                 className="w-full px-5 py-2.5 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors"
                 onClick={() => setIsContactModalOpen(true)}
               >
                 {t("contact")}
               </button>
               {slug && authUser?.id !== pUser?.id && (
                 <button 
                   onClick={toggleFollow}
                   className={`w-full px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
                     isFollowing 
                       ? "border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] hover:bg-[#EAEAEA]"
                       : "border-[#1a4ba8] text-[#1a4ba8] bg-blue-50 hover:bg-blue-100"
                   }`}
                 >
                   {isFollowing ? "Bỏ theo dõi" : "Theo dõi"}
                 </button>
               )}
            </div>
            
            {/* Social Links */}
            {socialLinks.length > 0 && (
              <div className="flex flex-col gap-2 mb-6 w-full">
                <p className="text-xs font-semibold tracking-widest uppercase text-[#666666] mb-2">Socials</p>
                {socialLinks.map((l) => {
                  const iconMap = {
                    globe: <Globe size={16} className="text-[#666666]" />,
                    link: <Link size={16} className="text-[#666666]" />,
                    mail: <Mail size={16} className="text-[#666666]" />,
                  };
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 text-[#212121] text-sm font-medium transition-colors"
                    >
                      {iconMap[l.icon]}
                      <span>{l.label}</span>
                    </a>
                  );
                })}
              </div>
            )}

            {/* Quick Stats */}
            <div className="pt-5 border-t border-[#E0E0E0] w-full text-left">
               <p className="text-xs font-semibold tracking-widest uppercase text-[#666666] mb-4">Stats</p>
               <div className="flex flex-col gap-3">
                 {[
                   { label: t("artworks"), val: stats?.totalArtworks || 0 }, 
                   { label: t("views"), val: stats?.totalViews?.toLocaleString() || "0" }, 
                   { label: t("likes"), val: stats?.totalLikes?.toLocaleString() || "0" },
                   { label: "Người theo dõi", val: followersCount?.toLocaleString() || "0", isClickable: true },
                   { label: "Đang theo dõi", val: stats?.following?.toLocaleString() || "0", isClickable: true }
                 ].map((s) => (
                   <div key={s.label} className="flex justify-between items-center" 
                        onClick={() => {
                          if (s.label === 'Người theo dõi') openFollowModal('followers');
                          if (s.label === 'Đang theo dõi') openFollowModal('following');
                        }}
                        style={{ cursor: s.isClickable ? 'pointer' : 'default' }}>
                     <span className="text-sm text-[#666666]">{s.label}</span>
                     <span className="text-[14px] font-bold text-[#212121]">{s.val}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex-1 w-full pt-8 pb-12">
             {/* Tabs & Filters */}
             <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E0E0E0] mb-8 gap-4 sm:gap-0">
                <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
                   <button className={`pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === 'featured' ? 'border-[#212121] text-[#212121]' : 'border-transparent text-[#666666] hover:text-[#212121]'}`} onClick={() => setActiveTab('featured')}>Tác phẩm xuất sắc</button>
                   <button className={`pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === 'work' ? 'border-[#212121] text-[#212121]' : 'border-transparent text-[#666666] hover:text-[#212121]'}`} onClick={() => setActiveTab('work')}>Danh sách ấn phẩm</button>
                   <button className={`pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === 'moodboard' ? 'border-[#212121] text-[#212121]' : 'border-transparent text-[#666666] hover:text-[#212121]'}`} onClick={() => setActiveTab('moodboard')}>Moodboards</button>
                   <button className={`pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === 'timeline' ? 'border-[#212121] text-[#212121]' : 'border-transparent text-[#666666] hover:text-[#212121]'}`} onClick={() => setActiveTab('timeline')}>Timeline</button>
                   {isOwner && (
                     <button className={`pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === 'drafts' ? 'border-[#212121] text-[#212121]' : 'border-transparent text-[#666666] hover:text-[#212121]'}`} onClick={() => setActiveTab('drafts')}>Drafts</button>
                   )}
                </div>
                {activeTab === 'work' && (
                  <select 
                    className="mb-2 p-2 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold outline-none focus:border-[#1a4ba8]" 
                    value={activeCategory} 
                    onChange={e => setActiveCategory(e.target.value)}
                  >
                    <option value={t("allArtworks")}>Tất cả Category</option>
                    <option value="Poster">Poster</option>
                    <option value="Branding">Branding</option>
                    <option value="UI/UX">UI/UX</option>
                    <option value="Illustration">Illustration</option>
                  </select>
                )}
             </div>

             {/* Content Area */}
             <div className="min-h-[400px]">
               {activeTab === 'featured' && (
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 }}>
                   {featuredWorks.length > 0 ? featuredWorks.map((art) => (
                     <div
                       key={art.id}
                       onClick={() => setPage && setPage("detail", { artworkId: art.id })}
                       style={{ cursor: "pointer", transition: "transform .15s" }}
                       onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                       onMouseLeave={e => e.currentTarget.style.transform = "none"}
                     >
                       <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#EAEAEA" }}>
                         {art.img ? <img src={art.img} alt={art.title} style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }} /> : (
                           <div style={{ width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 12 }}>{t("noImage")}</div>
                         )}
                         {!art.isPublic && (
                           <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2 }}>
                             <Lock size={10} color="#fff" />
                             <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{t("private")}</span>
                           </div>
                         )}
                       </div>
                       <p style={{ margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: "#212121", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                         <span style={{ fontSize: 13, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{art.student}</span>
                         <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                           <Eye size={13} color="#999" />
                           <span style={{ fontSize: 12, color: "#666" }}>{art.views}</span>
                           <Heart size={12} color="#ccc" />
                           <span style={{ fontSize: 12, color: "#666" }}>{art.likes}</span>
                         </div>
                       </div>
                     </div>
                   )) : (
                     <div style={{ gridColumn: "1 / -1", padding: "40px 0", textAlign: "center", color: "#999", fontSize: 14 }}>
                       Chưa có đồ án nổi bật nào.
                     </div>
                   )}
                 </div>
               )}

               {activeTab === 'work' && (
                 <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 }}>
                   {(() => {
                     const filtered = allPortfolioWorks.filter(art => {
                       if (activeCategory === t("allArtworks")) return true;
                       const c = activeCategory.toLowerCase();
                       return (art.tools || []).some(t => typeof t === 'string' && t.toLowerCase().includes(c)) || 
                              (art.tags || []).some(t => typeof t === 'string' && t.toLowerCase().includes(c));
                     });

                     if (filtered.length === 0) {
                       return (
                         <div style={{ gridColumn: "1 / -1", padding: "60px 0", textAlign: "center", color: "#999", fontSize: 14 }}>
                           {t("noArtworks")}
                         </div>
                       );
                     }

                     return filtered.map((art) => (
                       <div
                         key={art.id}
                         onClick={() => setPage && setPage("detail", { artworkId: art.id })}
                         style={{ cursor: "pointer", transition: "transform .15s" }}
                         onMouseEnter={e => e.currentTarget.style.transform = "translateY(-2px)"}
                         onMouseLeave={e => e.currentTarget.style.transform = "none"}
                       >
                         <div style={{ position: "relative", borderRadius: 4, overflow: "hidden", background: "#EAEAEA" }}>
                           {art.img ? <img src={art.img} alt={art.title} style={{ width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" }} /> : (
                             <div style={{ width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 12 }}>{t("noImage")}</div>
                           )}
                           {!art.isPublic && (
                             <div style={{ position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2 }}>
                               <Lock size={10} color="#fff" />
                               <span style={{ color: "#fff", fontSize: 11, fontWeight: 600 }}>{t("private")}</span>
                             </div>
                           )}
                         </div>
                         <p style={{ margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: "#212121", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                           <span style={{ fontSize: 13, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{art.student}</span>
                           <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                             <Eye size={13} color="#999" />
                             <span style={{ fontSize: 12, color: "#666" }}>{art.views}</span>
                             <Heart size={12} color="#ccc" />
                             <span style={{ fontSize: 12, color: "#666" }}>{art.likes}</span>
                           </div>
                         </div>
                       </div>
                     ));
                   })()}
                 </div>
               )}

               {activeTab === 'moodboard' && (
                 (() => {
                   const visibleMoodboards = portfolioMoodboards.filter(col => isOwner || publicMoodboards.includes(col.name));
                   return visibleMoodboards.length > 0 ? (
                   <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 }}>
                     {visibleMoodboards.map(col => (
                       <div key={col.id} className="relative rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-[4/3] group cursor-pointer">
                         <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0 bg-[#222]">
                            {col.items.length > 0 ? col.items.slice(0,4).map((it, idx) => (
                               <div key={it.id} className={`overflow-hidden bg-[#EAEAEA] ${idx === 0 && col.items.length === 1 ? 'col-span-2 row-span-2' : ''} ${idx === 0 && col.items.length === 3 ? 'col-span-2' : ''}`}>
                                  {it.artwork?.coverImageUrl ? <img src={it.artwork.coverImageUrl} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" /> : null}
                               </div>
                            )) : (
                               <div className="col-span-2 row-span-2 flex items-center justify-center bg-[#EAEAEA] text-[#999] text-sm">Trống</div>
                            )}
                         </div>
                         <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>
                         <div className="absolute top-0 left-0 p-5 w-full flex justify-between items-start">
                            <div className="overflow-hidden mr-2">
                              <h4 className="font-bold text-white text-xl mb-1 leading-tight truncate">{col.name}</h4>
                              <p className="text-[14px] text-white/90 truncate">{portfolioData?.user?.fullName || portfolioData?.fullName || "Sinh viên"}</p>
                            </div>
                            {isOwner && (
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  e.preventDefault();
                                  const isPub = publicMoodboards.includes(col.name);
                                  const newArr = isPub ? publicMoodboards.filter(n => n !== col.name) : [...publicMoodboards, col.name];
                                  setPublicMoodboards(newArr);
                                  
                                  try {
                                    await api.portfolios.updateMine({ publicMoodboards: newArr });
                                  } catch {
                                    alert("Lỗi khi cập nhật quyền truy cập!");
                                    setPublicMoodboards(publicMoodboards); // revert
                                  }
                                }}
                                className="shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors border-none cursor-pointer"
                                title={publicMoodboards.includes(col.name) ? "Công khai" : "Riêng tư"}
                              >
                                {publicMoodboards.includes(col.name) ? <Globe size={14} /> : <Lock size={14} />}
                              </button>
                            )}
                         </div>
                       </div>
                     ))}
                   </div>
                 ) : (
                   <div className="w-full h-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm">
                      <img src="https://a5.behance.net/4da700b0d3a5edb4c1fc74d4a3b77ab4671427cc/img/profile/empty-states/no-moodboards.svg?cb=264615658" alt="No moodboard" className="w-48 opacity-70 mb-4" />
                      <h3 className="text-lg font-bold text-[#212121] mb-2">Chưa có Moodboard nào</h3>
                      <p className="text-sm text-[#666666]">Sinh viên này chưa tạo bất kỳ Moodboard nào để chia sẻ nguồn cảm hứng.</p>
                   </div>
                 )
                 })()
               )}

               {activeTab === 'drafts' && isOwner && (
                 <div className="w-full">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
                       {drafts.map(draft => {
                         const diffMs = Date.now() - new Date(draft.updatedAt).getTime();
                         const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
                         const diffDays = Math.floor(diffHrs / 24);
                         const timeStr = diffDays > 0 ? `${diffDays} days ago` : diffHrs > 0 ? `${diffHrs} hours ago` : 'just now';
                         
                         return (
                          <div key={draft.id} className="group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#222222] border border-[#E0E0E0] cursor-pointer">
                            <img src={draft.coverImageUrl} className="w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300" />
                            
                            {/* OVERLAY */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-10 backdrop-blur-[2px]">
                                <button className="w-full max-w-[160px] py-2 bg-[#1a4ba8] text-white rounded-full font-semibold text-[13px] mb-2 hover:bg-blue-700 transition shadow-lg" onClick={() => { setCurrentDraftId(draft.id); setIsDraftBuilderOpen(true); }}>Edit Project</button>
                                <button className="w-full max-w-[160px] py-2 bg-white/90 text-gray-800 rounded-full font-semibold text-[13px] mb-4 hover:bg-white transition shadow-lg" onClick={(e) => { e.stopPropagation(); handleDeleteDraft(e, draft.id); }}>Delete Project</button>
                                <p className="text-white/80 font-medium text-[12px]">Last modified {timeStr}</p>

                                <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between text-white/90 text-[12px] font-medium">
                                   <span className="truncate max-w-[100px]">{authUser?.fullName || authUser?.name || "Author"}</span>
                                   <div className="flex items-center gap-3">
                                      <span className="flex items-center gap-1"><ThumbsUp size={12} className="fill-white/80" /> 0</span>
                                      <span className="flex items-center gap-1"><Eye size={12} className="fill-white/80" /> 0</span>
                                   </div>
                                </div>
                            </div>
                          </div>
                         );
                       })}
                       
                       {/* CREATE NEW PROJECT CARD */}
                       <div 
                         className="group relative aspect-[4/3] border-2 border-dashed border-[#d1d5db] rounded-xl flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#f9fafb] to-white hover:border-[#1a4ba8] hover:shadow-xl hover:shadow-[#1a4ba8]/10 transition-all duration-300 cursor-pointer overflow-hidden p-6"
                         onClick={() => { setCurrentDraftId(null); setIsDraftBuilderOpen(true); }}
                       >
                          <div className="absolute inset-0 bg-[#1a4ba8]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          
                          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-gray-200/50 group-hover:scale-110 group-hover:shadow-blue-200/50 transition-all duration-500 relative z-10 border border-gray-100">
                             <div className="w-10 h-10 bg-gradient-to-br from-[#1a4ba8] to-[#0d2e6e] rounded-full flex items-center justify-center text-white shadow-inner transform group-hover:rotate-90 transition-transform duration-500">
                                <Plus size={22} strokeWidth={3} />
                             </div>
                          </div>
                          
                          <h3 className="text-[18px] font-extrabold text-gray-800 mb-2 group-hover:text-[#1a4ba8] transition-colors relative z-10">
                            Create a Project
                          </h3>
                          
                          <p className="text-gray-500 text-[14px] font-medium max-w-[80%] relative z-10 group-hover:text-gray-600 transition-colors">
                            Build and share your next masterpiece. Unpublished drafts are saved here.
                          </p>
                       </div>
                    </div>
                 </div>
               )}
               
               <DraftBuilderModal 
                  isOpen={isDraftBuilderOpen} 
                  initialBlocks={currentDraftId ? drafts.find(d => d.id === currentDraftId)?.blocks : []}
                  initialSettingsData={currentDraftId ? (drafts.find(d => d.id === currentDraftId)?.settingsData || { title: drafts.find(d => d.id === currentDraftId)?.title, coverImage: drafts.find(d => d.id === currentDraftId)?.coverImageUrl }) : null}
                  onClose={() => setIsDraftBuilderOpen(false)} 
                  onSave={async (blocks, settingsData, isAutoSave = false) => {
                     if (!isAutoSave) setIsDraftBuilderOpen(false);
                     
                     let autoCover = settingsData?.coverImage || "";
                     if (!autoCover && blocks && blocks.length > 0) {
                        const firstImg = blocks.find(b => b.type === 'image' && b.content);
                        if (firstImg) autoCover = firstImg.content;
                     }
                     if (!autoCover) autoCover = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400';

                     const newDraft = {
                        id: currentDraftId || Date.now(),
                        title: settingsData?.title || 'Untitled Draft',
                        coverImageUrl: autoCover,
                        blocks: blocks,
                        settingsData: settingsData,
                        updatedAt: new Date().toISOString(),
                        isDraft: true
                     };
                     
                     try {
                        // Attempt to sync with BE
                        if (currentDraftId) {
                          await api.artworks.update(currentDraftId, {
                             title: newDraft.title,
                             coverImageUrl: newDraft.coverImageUrl,
                             blocksJson: JSON.stringify(newDraft.blocks),
                             status: 'draft'
                          });
                        } else {
                          await api.artworks.create({
                             title: newDraft.title,
                             coverImageUrl: newDraft.coverImageUrl,
                             description: "Draft",
                             blocksJson: JSON.stringify(newDraft.blocks),
                             status: 'draft'
                          });
                        }
                     } catch(e) {
                        console.log("Mock BE fallback for draft");
                     }

                     const updated = currentDraftId 
                        ? drafts.map(d => d.id === currentDraftId ? newDraft : d)
                        : [newDraft, ...drafts];
                     setDrafts(updated);
                     try {
                       localStorage.setItem('uef_drafts', JSON.stringify(updated));
                     } catch(e) {
                       console.error("Local storage quota exceeded for draft.");
                     }
                     if (!isAutoSave) alert("Đã lưu bản nháp thành công!");
                  }}
                  currentUser={authUser}
                  onPublish={(blocks, settingsData, capturedImageUrl) => {
                     setIsDraftBuilderOpen(false);
                     setPage("upload", { draftId: currentDraftId, draftBlocks: blocks, draftSettings: settingsData || {}, draftCapturedImage: capturedImageUrl });
                  }} 
               />

               {activeTab === 'timeline' && (
                 <TimelineSection slug={slug || ''} isOwner={isOwner} setPage={setPage} />
               )}

             </div>

             {/* Teacher Feedback Section */}
             {privateGrade && (
                <div className="mt-10 bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-5 flex gap-4 items-start">
                  <div className="bg-[#212121] rounded-md px-2 py-1 flex items-center gap-1">
                    <Lock size={12} color="#fff" />
                    <span className="text-white text-xs font-bold">{t("privateUppercase")}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-[#212121]">{t("lecturerFeedback")}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#666666]">{t("totalScore")}</span>
                        <span className="text-xl font-bold text-[#1a4ba8]">{privateGrade.score}</span>
                        <span className="text-xs text-[#666666]">/10</span>
                      </div>
                    </div>
                    <p className="text-sm text-[#444444] leading-relaxed m-0">{privateGrade.comment}</p>
                  </div>
                </div>
             )}



          </div>
        </div>
      </main>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex justify-between items-center bg-[#F8F8F8]">
              <h3 className="font-bold text-lg text-[#212121]">{t("sendContactMessage")}</h3>
              <button onClick={closeContactModal} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            {contactState === "success" ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#e0eaff] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#1a4ba8]" />
                </div>
                <h4 className="text-xl font-bold text-[#212121] mb-2">{t("sentSuccessfully")}</h4>
                <p className="text-sm text-[#666666] mb-6">{t("messageSentTo")}{profile.fullName}.</p>
                <button onClick={closeContactModal} className="w-full py-2.5 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-semibold text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer">{t("close")}</button>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("fullNameOrOrg")}</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" placeholder={t("enterYourName")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("contactEmail")}</label>
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="email@company.com" className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("purpose")}</label>
                  <select value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white cursor-pointer">
                    <option value={t("recruitmentInternship")}>{t("recruitmentInternship")}</option>
                    <option value={t("freelanceCollaboration")}>{t("freelanceCollaboration")}</option>
                    <option value={t("other")}>{t("other")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("content")}</label>
                  <textarea value={contactContent} onChange={e => setContactContent(e.target.value)} placeholder={t("enterMessageContent")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] min-h-[100px] resize-y" />
                </div>
                <button onClick={handleContactSubmit} disabled={contactState === "loading"} className={`mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex justify-center items-center gap-2 ${contactState === "loading" ? "bg-[#666666] cursor-wait" : "bg-[#1a4ba8] hover:opacity-90 cursor-pointer"}`}>
                  {contactState === "loading" ? t("sending") : <><Send size={16} /> {t("sendMessage")}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Followers Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md h-[480px] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#212121]">
                {modalType === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}
              </h3>
              <button onClick={() => setModalType(null)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} color="#666" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-2">
              {modalUsers.length === 0 ? (
                <p className="text-center text-gray-500 py-8">Chưa có ai</p>
              ) : (
                modalUsers.map(u => (
                  <div key={u.id} 
                       className="flex items-center gap-3 p-3 hover:bg-[#F8F8F8] rounded-xl cursor-pointer transition-colors border border-transparent hover:border-[#EAEAEA]" 
                       onClick={() => { setModalType(null); setPage && setPage("portfolio", { portfolioSlug: u.id }); }}>
                    <img src={u.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.fullName || "User") + "&background=random"} 
                         className="w-12 h-12 rounded-full object-cover border border-[#E0E0E0]" />
                    <div>
                      <p className="font-semibold text-[15px] text-[#212121] leading-tight">{u.fullName}</p>
                      <p className="text-xs text-[#666666] mt-0.5">{u.major || "Thành viên"}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ isOn, onToggle, disabled = false }) {
  return (
    <div onClick={disabled ? undefined : onToggle} style={{ width: 38, height: 20, borderRadius: 10, background: disabled ? "#e5e7eb" : (isOn ? CERULEAN : GRAY_LIGHT), cursor: disabled ? "not-allowed" : "pointer", position: "relative", transition: "background .2s", flexShrink: 0, opacity: disabled ? 0.6 : 1 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: disabled ? "#f9fafb" : "#fff", position: "absolute", top: 2, left: isOn ? 20 : 2, transition: "left .2s", boxShadow: disabled ? "none" : "0 2px 4px rgba(0,0,0,0.1)" }} />
    </div>
  );
}

function DashboardSidebar({ activePage, setPage, userData }) {
  let items = [];
  if (userData?.role === "lecturer") {
    items = [
      { icon: <MessageSquare size={18} />, label: t("inbox"), page: "messages" },
      { icon: <Bookmark size={18} />, label: "Moodboard", page: "moodboards" },
      { icon: <User size={18} />, label: t("accountSettings"), page: "settings" },
    ];
  } else if (userData?.role === "admin") {
    items = [
      { icon: <User size={18} />, label: t("accountSettings"), page: "settings" },
    ];
  } else {
    items = [
      { icon: <Image size={18} />, label: t("myArtworks"), page: "dashboard" },
      { icon: <Bookmark size={18} />, label: "Moodboard", page: "moodboards" },
      { icon: <MessageSquare size={18} />, label: t("inbox"), page: "messages" },
      { icon: <User size={18} />, label: t("accountSettings"), page: "settings" },
      { icon: <Briefcase size={18} />, label: t("portfolioSettings"), page: "portfolio_settings" },
    ];
  }
  
  const roleLabel = { student: t("student"), lecturer: t("lecturer"), admin: t("admin") };
  const profileName = userData?.fullName || userData?.name || roleLabel[userData?.role] || t("student");
  const profileAvatar = userData?.avatarUrl || userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";
  const studentYear = roleLabel[userData?.role] || t("student");

  return (
    <div style={{ width: 220, background: "#fff", borderRight: `1px solid ${GRAY_LIGHT}`, padding: "28px 0", flexShrink: 0 }}>
      <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${GRAY_LIGHT}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src={profileAvatar} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", background: GRAY_BG }} />
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, margin: 0, color: BLACK }}>{profileName}</p>
            <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{studentYear}</p>
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 0" }}>
        {items.map(item => {
          const isActive = activePage === item.page;
          return (
            <div key={item.page} onClick={() => setPage(item.page)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", background: isActive ? "#eef4ff" : "transparent", borderRight: isActive ? `3px solid ${CERULEAN}` : "3px solid transparent" }}>
              <span style={{ color: isActive ? CERULEAN : MUTED, display: "flex" }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? CERULEAN : BLACK }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MoodboardSortableCard({ item, onClick, onMove, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1,
  };
  return (
    <div ref={setNodeRef} style={{ ...style, position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "grab" }} {...attributes} {...listeners}>
      <div style={{ position: "relative" }}>
        <img onClick={onClick} src={item.artwork?.coverImageUrl || "https://placehold.co/400x300/1a4ba8/ffffff?text=UEF+Design"} style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
        {item.artwork?.isAiVerified && (
          <div style={{ position: "absolute", top: 8, left: 8, background: "linear-gradient(to right, #1a4ba8, #0ea5e9)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" }}>
            <ShieldCheck size={10} color="#fff" />
            <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" }}>AI VERIFIED</span>
          </div>
        )}
      </div>
      <div style={{ padding: "12px 16px", cursor: "grab" }}>
        <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={item.artwork?.title}>{item.artwork?.title || "Artwork"}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{new Date(item.createdAt || Date.now()).toLocaleDateString()}</p>
            {item.artwork?.likeCount > 0 && (
              <span style={{ fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 }}><Heart size={12} /> {item.artwork.likeCount}</span>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onPointerDown={(e) => { e.stopPropagation(); }} onClick={onMove} style={{ background: GRAY_BG, border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", color: CERULEAN }} title="Di chuyển">
              <FolderInput size={14} />
            </button>
            <button onPointerDown={(e) => { e.stopPropagation(); }} onClick={onRemove} style={{ background: "#FEF2F2", border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", color: CRIMSON }} title="Xóa khỏi Moodboard">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function StudentMoodboardsPage({ setPage, setActiveArtworkId, userData }) {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [publicMoodboards, setPublicMoodboards] = useState([]);
  const [activeCollection, setActiveCollection] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingColId, setEditingColId] = useState(null);
  const [editColName, setEditColName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [newColName, setNewColName] = useState("");
  const [moveState, setMoveState] = useState(null);
  
  // Sorting and filtering inside collection
  const [searchArtworkQuery, setSearchArtworkQuery] = useState("");
  const [sortBy, setSortBy] = useState("custom"); // custom, newest, oldest, az, za, likes
  const [colLimit] = useState(16);
  const [colPage, setColPage] = useState(1);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && activeCollection) {
      const oldIndex = activeCollection.items.findIndex(it => it.id === active.id);
      const newIndex = activeCollection.items.findIndex(it => it.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        const newItems = arrayMove(activeCollection.items, oldIndex, newIndex);
        setActiveCollection({ ...activeCollection, items: newItems });
        setSortBy("custom");
      }
    }
  };

  const refreshCollections = async () => {
    try {
      const res = await api.collections.list();
      setCollections(Array.isArray(res) ? res : []);
    } catch {}
  };

  useEffect(() => {
    Promise.all([
      refreshCollections(),
      api.portfolios.mine().then(res => {
        setPublicMoodboards(res?.publicMoodboards || []);
      }).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const handleTogglePublic = async (colName, e) => {
    e?.stopPropagation();
    const isPublic = publicMoodboards.includes(colName);
    const newArr = isPublic ? publicMoodboards.filter(n => n !== colName) : [...publicMoodboards, colName];
    setPublicMoodboards(newArr);
    try {
      await api.portfolios.updateMine({ publicMoodboards: newArr });
    } catch {
      alert("Lỗi khi cập nhật quyền truy cập!");
      setPublicMoodboards(publicMoodboards); // revert on error
    }
  };

  const handleCreate = async () => {
    if (!newColName.trim()) return;
    try {
      await api.collections.create({ collectionName: newColName });
      setNewColName("");
      setIsCreating(false);
      await refreshCollections();
    } catch { alert("Lỗi khi tạo Moodboard"); }
  };

  const handleDeleteCollection = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("Bạn có chắc muốn xóa Moodboard này?")) return;
    try {
      await api.collections.delete(id);
      if (activeCollection?.id === id) setActiveCollection(null);
      await refreshCollections();
    } catch { alert("Lỗi khi xóa Moodboard"); }
  };

  const handleRenameCollection = async (id, e) => {
    e?.stopPropagation();
    if (!editColName.trim()) return;
    try {
      await api.collections.update(id, { name: editColName });
      setEditingColId(null);
      await refreshCollections();
      if (activeCollection?.id === id) setActiveCollection(prev => ({ ...prev, name: editColName }));
    } catch { alert("Lỗi khi đổi tên Moodboard"); }
  };

  const handleRemoveItem = async (colId, artworkId, e) => {
    e.stopPropagation();
    if (!confirm("Xóa tác phẩm khỏi Moodboard?")) return;
    try {
      await api.collections.removeItem(colId, artworkId);
      await refreshCollections();
      if (activeCollection?.id === colId) setActiveCollection(prev => ({ ...prev, items: prev.items.filter(it => it.artworkId !== artworkId) }));
    } catch { alert("Lỗi khi xóa"); }
  };

  const handleMoveItem = async (toColId) => {
    if (!moveState) return;
    try {
      await api.collections.addItem(toColId, { artworkId: moveState.artworkId });
      await api.collections.removeItem(moveState.fromColId, moveState.artworkId);
      setMoveState(null);
      await refreshCollections();
      if (activeCollection?.id === moveState.fromColId) {
        setActiveCollection(prev => ({ ...prev, items: prev.items.filter(it => it.artworkId !== moveState.artworkId) }));
      }
    } catch { alert("Lỗi khi di chuyển"); }
  };

  const filteredCollections = collections.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="moodboards" setPage={setPage} userData={userData} />
      <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        
        {loading ? <GlobalLoading /> : activeCollection ? (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button onClick={() => setActiveCollection(null)} style={{ background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 14, fontWeight: 600 }}>
                  <ChevronLeft size={20} /> Quay lại
                </button>
                {editingColId === activeCollection.id ? (
                  <div style={{ display: "flex", gap: 8 }}>
                    <input autoFocus value={editColName} onChange={e => setEditColName(e.target.value)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}` }} onKeyDown={e => e.key === 'Enter' && handleRenameCollection(activeCollection.id)} />
                    <button onClick={() => handleRenameCollection(activeCollection.id)} style={{ background: CERULEAN, color: "#fff", border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}>Lưu</button>
                    <button onClick={() => setEditingColId(null)} style={{ background: GRAY_LIGHT, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" }}>Hủy</button>
                  </div>
                ) : (
                  <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: CERULEAN, display: "flex", alignItems: "center", gap: 12 }}>
                    {activeCollection.name}
                    <button onClick={() => { setEditingColId(activeCollection.id); setEditColName(activeCollection.name); }} style={{ background: "transparent", border: "none", cursor: "pointer", color: MUTED }}><Edit2 size={16} /></button>
                  </h2>
                )}
                <span style={{ background: "#eef4ff", color: CERULEAN, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" }}>{activeCollection.items?.length || 0} tác phẩm</span>
              </div>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div style={{ position: "relative", flex: 1, marginRight: 24 }}>
                <Search size={16} style={{ position: "absolute", left: 16, top: 12, color: MUTED }} />
                <input placeholder="Tìm tác phẩm..." value={searchArtworkQuery} onChange={e => setSearchArtworkQuery(e.target.value)} style={{ width: "100%", padding: "10px 16px 10px 44px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 15 }} />
              </div>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: "10px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 15 }}>
                <option value="custom">Tùy chỉnh (Kéo thả)</option>
                <option value="newest">Mới nhất</option>
                <option value="oldest">Cũ nhất</option>
                <option value="az">Tên A-Z</option>
                <option value="za">Tên Z-A</option>
                <option value="likes">Nhiều Like nhất</option>
              </select>
            </div>

            {activeCollection.items?.length === 0 ? (
               <div style={{ textAlign: "center", padding: "60px", color: MUTED, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>
                 <p>Chưa có tác phẩm nào trong Moodboard này.</p>
               </div>
            ) : (() => {
               let filteredItems = (activeCollection.items || []).filter(item => 
                 (item.artwork?.title || "").toLowerCase().includes(searchArtworkQuery.toLowerCase())
               );

               if (sortBy !== "custom") {
                 filteredItems = [...filteredItems].sort((a, b) => {
                   if (sortBy === "newest") return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
                   if (sortBy === "oldest") return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
                   if (sortBy === "az") return (a.artwork?.title || "").localeCompare(b.artwork?.title || "");
                   if (sortBy === "za") return (b.artwork?.title || "").localeCompare(a.artwork?.title || "");
                   if (sortBy === "likes") return (b.artwork?.likeCount || 0) - (a.artwork?.likeCount || 0);
                   return 0;
                 });
               }
               
               if (filteredItems.length === 0) return <p style={{ textAlign: "center", padding: 40, color: MUTED, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>Không tìm thấy tác phẩm nào.</p>;

               const displayedItems = filteredItems.slice(0, colPage * colLimit);

               return (
                 <>
                   <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                     <SortableContext items={displayedItems.map(i => i.id)} strategy={rectSortingStrategy}>
                       <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 }}>
                          {displayedItems.map(item => (
                             <MoodboardSortableCard key={item.id} item={item} onClick={() => setPage("detail", { artworkId: item.artworkId })} onMove={(e) => { e.stopPropagation(); setMoveState({ artworkId: item.artworkId, fromColId: activeCollection.id }); }} onRemove={(e) => handleRemoveItem(activeCollection.id, item.artworkId, e)} />
                          ))}
                       </div>
                     </SortableContext>
                   </DndContext>
                   
                   {colPage * colLimit < filteredItems.length && (
                      <div
                        ref={el => {
                          if (!el) return;
                          const observer = new IntersectionObserver(entries => {
                            if (entries[0].isIntersecting) setColPage(p => p + 1);
                          }, { threshold: 0.1 });
                          observer.observe(el);
                          return () => observer.disconnect();
                        }}
                        style={{ height: 20 }}
                      >
                      </div>
                   )}
                 </>
               );
            })()}
          </div>
        ) : (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
              <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>Moodboard</h2>
              <div style={{ display: "flex", gap: 16 }}>
                <div style={{ position: "relative" }}>
                  <Search size={16} style={{ position: "absolute", left: 12, top: 10, color: MUTED }} />
                  <input placeholder="Tìm kiếm Moodboard..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ padding: "8px 12px 8px 36px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, width: 250 }} />
                </div>
                <button onClick={() => setIsCreating(true)} style={{ background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "0 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold" }}>
                  <Plus size={18} /> Tạo mới
                </button>
              </div>
            </div>

            {isCreating && (
              <div style={{ background: "#fff", padding: "16px 20px", borderRadius: 12, border: `1px solid ${CERULEAN}`, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 }}>
                <FolderPlus size={20} color={CERULEAN} />
                <input autoFocus placeholder="Tên Moodboard mới" value={newColName} onChange={e => setNewColName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} style={{ flex: 1, border: "none", outline: "none", fontSize: 16 }} />
                <button onClick={handleCreate} style={{ background: CERULEAN, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>Tạo</button>
                <button onClick={() => setIsCreating(false)} style={{ background: GRAY_LIGHT, color: BLACK, border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: "bold" }}>Hủy</button>
              </div>
            )}

            {filteredCollections.length === 0 ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", color: MUTED, background: "#fff", borderRadius: 16, border: `1px dashed ${MUTED}`, margin: "0 auto", maxWidth: 600 }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
                  <Bookmark size={40} color={CERULEAN} strokeWidth={1.5} />
                </div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: 18, color: BLACK, fontWeight: 700 }}>Chưa có Moodboard nào</h3>
                <p style={{ margin: "0 0 24px 0", fontSize: 14, textAlign: "center", maxWidth: 400 }}>Hãy khám phá các tác phẩm trên hệ thống và lưu lại những ý tưởng tuyệt vời nhất vào Moodboard của riêng bạn.</p>
                <button onClick={() => setPage("gallery")} style={{ background: CERULEAN, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 30, cursor: "pointer", fontWeight: "bold", fontSize: 15, display: "flex", alignItems: "center", gap: 8, transition: "0.2s", boxShadow: "0 4px 12px rgba(0,87,255,0.2)" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.05)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                  Khám phá Gallery
                </button>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 }}>
                {filteredCollections.map(col => {
                  const coverImage = col.items?.[0]?.artwork?.coverImageUrl || "https://placehold.co/600x400/eeeeee/cccccc?text=Trống";
                  return (
                    <div key={col.id} onClick={() => setActiveCollection(col)} style={{ background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }} onMouseEnter={e => {e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)"}} onMouseLeave={e => {e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"}}>
                      <div style={{ position: "relative", height: 200 }}>
                        <img src={coverImage} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }} />
                        
                        <div style={{ position: "absolute", top: 12, right: 12, display: "flex", gap: 8 }}>
                          <button onClick={(e) => handleTogglePublic(col.name, e)} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }} title={publicMoodboards.includes(col.name) ? "Công khai" : "Riêng tư"}>
                            {publicMoodboards.includes(col.name) ? <Globe size={14} /> : <Lock size={14} />}
                          </button>
                          <button onClick={(e) => handleDeleteCollection(col.id, e)} style={{ background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffcccc", cursor: "pointer" }} title="Xóa">
                            <Trash2 size={14} />
                          </button>
                        </div>
                          <div style={{ position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" }}>
                             <div>
                               <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" }}>{col.name}</h3>
                               <p style={{ margin: "4px 0 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)" }}>Cập nhật: {new Date(col.updatedAt || Date.now()).toLocaleDateString()}</p>
                             </div>
                             <span style={{ background: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: "bold" }}>{col.items?.length || 0} mục</span>
                          </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Move Item Modal */}
      {moveState && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000 }}>
          <div style={{ background: "#fff", borderRadius: 16, width: 400, padding: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: BLACK }}>Di chuyển tác phẩm</h3>
            <p style={{ margin: "0 0 16px 0", fontSize: 14, color: MUTED }}>Chọn Moodboard đích:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", marginBottom: 24 }}>
              {collections.filter(c => c.id !== moveState.fromColId).map(c => (
                <button key={c.id} onClick={() => handleMoveItem(c.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "transparent", cursor: "pointer", textAlign: "left", transition: "0.2s" }} onMouseEnter={e => e.currentTarget.style.background = GRAY_BG} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                  <Folder size={18} color={CERULEAN} />
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: BLACK }}>{c.name}</span>
                  <span style={{ fontSize: 12, color: MUTED }}>{c.items?.length || 0} mục</span>
                </button>
              ))}
              {collections.length <= 1 && (
                <p style={{ fontSize: 13, color: MUTED, textAlign: "center", padding: "16px 0" }}>Bạn không có Moodboard nào khác.</p>
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button onClick={() => setMoveState(null)} style={{ background: GRAY_LIGHT, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: "bold", cursor: "pointer" }}>Hủy bỏ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BadgesPage({ setPage, userData }) {
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBadge, setNewBadge] = useState({ name: "", colorCode: "#1A4BA8", textColor: "#FFFFFF" });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!userData?.id) return;
    api.badges.list(userData.id).then(res => {
      setBadges(res);
      setLoading(false);
    }).catch(e => {
      console.error(e);
      setLoading(false);
    });
  }, [userData]);

  const handleCreateBadge = async () => {
    if (!newBadge.name) return;
    setCreating(true);
    try {
      const created = await api.badges.create({ ...newBadge, lecturerId: userData.id });
      setBadges([created, ...badges]);
      setNewBadge({ name: "", colorCode: "#1A4BA8", textColor: "#FFFFFF" });
    } catch (e) {
      alert("Error creating badge: " + e.message);
    }
    setCreating(false);
  };

  const handleDeleteBadge = async (badgeId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa huy hiệu này? Huy hiệu sẽ bị gỡ khỏi tất cả các đồ án đã được cấp.")) return;
    try {
      await api.badges.delete(badgeId, userData.id);
      setBadges(badges.filter(b => b.id !== badgeId));
    } catch (e) {
      alert("Lỗi khi xóa huy hiệu: " + e.message);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="badges" setPage={setPage} />

      <div className="flex-1 overflow-y-auto p-8 bg-[#F8F8F8]">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>Quản lý Huy hiệu</h2>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Tạo và quản lý các huy hiệu dành tặng cho đồ án xuất sắc.</p>
          </div>
        </div>

        <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: `1px solid ${GRAY_LIGHT}`, marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK }}>Tạo Huy hiệu mới</h3>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK }}>Tên Huy hiệu</label>
              <input 
                type="text" 
                placeholder="VD: Top 10 Branding, Best Concept..." 
                value={newBadge.name}
                onChange={e => setNewBadge({ ...newBadge, name: e.target.value })}
                style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14 }}
              />
            </div>
            <div style={{ display: "flex", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK }}>Màu nền</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input 
                    type="color" 
                    value={newBadge.colorCode}
                    onChange={e => setNewBadge({ ...newBadge, colorCode: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }}
                  />
                  <input 
                    type="text" 
                    value={newBadge.colorCode.toUpperCase()}
                    onChange={e => setNewBadge({ ...newBadge, colorCode: e.target.value })}
                    style={{ width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK }}>Màu chữ</label>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input 
                    type="color" 
                    value={newBadge.textColor}
                    onChange={e => setNewBadge({ ...newBadge, textColor: e.target.value })}
                    style={{ width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }}
                  />
                  <input 
                    type="text" 
                    value={newBadge.textColor.toUpperCase()}
                    onChange={e => setNewBadge({ ...newBadge, textColor: e.target.value })}
                    style={{ width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" }}
                  />
                </div>
              </div>
            </div>
            <div style={{ marginTop: 22 }}>
              <button 
                onClick={handleCreateBadge} 
                disabled={creating || !newBadge.name}
                style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: (creating || !newBadge.name) ? "not-allowed" : "pointer", opacity: (creating || !newBadge.name) ? 0.6 : 1 }}
              >
                {creating ? "Đang tạo..." : "Tạo Huy hiệu"}
              </button>
            </div>
          </div>
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK }}>Huy hiệu của bạn</h3>
          {loading ? <GlobalLoading /> : (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              {badges.length === 0 ? (
                <p style={{ color: MUTED, fontSize: 14 }}>Chưa có huy hiệu nào được tạo.</p>
              ) : (
                badges.map(b => (
                  <div key={b.id} style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, background: b.colorCode, color: b.textColor || "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", paddingRight: 36 }}>
                    <Star size={14} fill={b.textColor || "#fff"} />
                    {b.name}
                    <div onClick={() => handleDeleteBadge(b.id)} style={{ position: "absolute", right: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.15)", color: b.textColor || "#fff", transition: "all .2s" }} onMouseEnter={e => e.currentTarget.style.background="rgba(0,0,0,0.3)"} onMouseLeave={e => e.currentTarget.style.background="rgba(0,0,0,0.15)"}>
                      <X size={12} strokeWidth={3} />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DashboardPage({ setPage, setEditingArtworkId, setActiveArtworkId, userData }) {
    const [artworksList, setArtworksList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [collabArtworks, setCollabArtworks] = useState([]);
  const [collabLoading, setCollabLoading] = useState(true);

  const { user: authUser } = useAuth();

  useEffect(() => {
    api.users.myArtworks().then(res => {
      setArtworksList(Array.isArray(res) ? res : (res.artworks || []));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!authUser?.id) { setCollabLoading(false); return; }
    api.artworks.list({ collaboratorId: authUser.id, limit: "50" }).then(res => {
      setCollabArtworks(res.artworks || []);
      setCollabLoading(false);
    }).catch(() => setCollabLoading(false));
  }, [authUser?.id]);

  const totalArtworks = artworksList.length;
  const totalViews = artworksList.reduce((s, a) => s + (a.viewCount || 0), 0);
  const totalLikes = artworksList.reduce((s, a) => s + (a.likeCount || 0), 0);
  const publicCount = artworksList.filter(a => a.isPublic).length;

  const stats = [
    { label: t("totalArtworks"), val: totalArtworks.toLocaleString(), icon: <Image size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: t("views"), val: totalViews.toLocaleString(), icon: <Eye size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: t("likes"), val: totalLikes.toLocaleString(), icon: <Heart size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: t("publicArtworks"), val: publicCount.toString(), icon: <Globe size={24} color={BLACK} strokeWidth={1.5} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="dashboard" setPage={setPage} userData={userData} />

      <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>{t("myArtworks")}</h2>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>{t("manageVisibility")}</p>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button onClick={() => setPage("upload")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
              <Plus size={18} color="#fff" />
              {t("uploadNewArtwork")}
            </button>
          </div>
        </div>

        {loading ? (
          <GlobalLoading />
        ) : (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
              {stats.map(s => (
                <div key={s.label} style={{ background: "#fff", borderRadius: 12, padding: "18px 20px", border: `1px solid ${GRAY_LIGHT}` }}>
                  <div style={{ marginBottom: 8 }}>{s.icon}</div>
                  <p style={{ fontSize: 24, fontWeight: 700, margin: "0 0 2px", color: BLACK }}>{s.val}</p>
                  <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
              {artworksList.slice(0, visibleCount).map(art => (
                <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                  <div style={{ position: "relative", background: GRAY_BG }}>
                    <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => setPage("detail", { artworkId: art.id })} />
                    <div style={{ position: "absolute", top: 8, left: 8 }}>
                      <span style={{ background: art.isPending ? "#fffBEB" : (art.isPublic ? "#e0eaff" : "#F8F8F8"), color: art.isPending ? "#b45309" : (art.isPublic ? CERULEAN : MUTED), fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: `1px solid ${art.isPending ? "#fcd34d" : (art.isPublic ? "#a8bce0" : GRAY_LIGHT)}` }}>{art.isPending ? t("pending") : (art.isPublic ? t("public") : t("private"))}</span>
                    </div>
                  </div>
                  <div style={{ padding: "12px 14px" }}>
                    <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                    <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                      <span style={{ background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` }}>{art.subject}</span>
                      {(art.toolsUsed || []).slice(0, 1).map(t => (
                        <span key={t} style={{ background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` }}>{t}</span>
                      ))}
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${GRAY_LIGHT}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <span style={{ fontSize: 11, color: MUTED }}>{t("public")}</span>
                        <ToggleSwitch isOn={art.isPublic} disabled={art.isPending} onToggle={() => {
                          if (!art.isPublic) {
                            if (!window.confirm("Ấn phẩm sẽ được chuyển vào trạng thái Chờ duyệt. Bạn có muốn tiếp tục?")) return;
                            if (api.artworks.update) {
                              api.artworks.update(art.id, { status: "pending_approval", isPublic: true })
                                 .then(() => {
                                    alert("Đã gửi yêu cầu duyệt ấn phẩm.");
                                    setArtworksList(prev => prev.map(a => a.id === art.id ? { ...a, isPublic: true, isPending: true } : a));
                                 })
                                 .catch(err => alert(err?.message || "Lỗi cập nhật trạng thái"));
                            } else {
                              api.artworks.toggleVisibility(art.id, true)
                                 .then(() => {
                                    alert("Đã gửi yêu cầu duyệt ấn phẩm.");
                                    setArtworksList(prev => prev.map(a => a.id === art.id ? { ...a, isPublic: true, isPending: true } : a));
                                 })
                                 .catch(err => alert(err?.message || "Lỗi cập nhật trạng thái"));
                            }
                            return;
                          }
                          api.artworks.toggleVisibility(art.id, false)
                             .then(() => {
                                setArtworksList(prev => prev.map(a => a.id === art.id ? { ...a, isPublic: false, isPending: false } : a));
                             })
                             .catch(err => alert(err?.message || "Lỗi cập nhật trạng thái"));
                        }} />
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setActiveArtworkId(art.id); setTimeout(() => setPage("edit_artwork"), 50); }} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Edit2 size={14} color={BLACK} strokeWidth={1.5} />
                        </button>
                        <button onClick={() => {
                          if (window.confirm("Cảnh báo: Việc xóa bài sẽ làm mất vĩnh viễn toàn bộ Like và Bình luận của bài viết này. Bạn có chắc chắn muốn tiếp tục?")) {
                            api.artworks.delete(art.id)
                              .then(() => setArtworksList(prev => prev.filter(a => a.id !== art.id)))
                              .catch(err => alert(err?.message || "Lỗi xóa ấn phẩm"));
                          }
                        }} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid #F5C5C5`, background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Trash2 size={14} color={CRIMSON} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {visibleCount < artworksList.length && (
              <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                <button onClick={() => setVisibleCount(v => v + 12)} style={{ padding: "10px 24px", borderRadius: 100, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: BLACK, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = GRAY_BG} onMouseLeave={e => e.currentTarget.style.background = "#fff"}>
                  <ChevronDown size={16} />
                  Tải thêm tác phẩm
                </button>
              </div>
            )}

            {collabArtworks.length > 0 && (
              <>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BLACK, marginTop: 40, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={20} color={CERULEAN} /> {t("coAuthor")} ({collabArtworks.length})
              </h3>
    <div className="masonry-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {collabArtworks.map(art => (
                  <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                    <div style={{ position: "relative", background: GRAY_BG }}>
                      <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => setPage("detail", { artworkId: art.id })} />
                      <div style={{ position: "absolute", top: 8, left: 8 }}>
                        <span style={{ background: "#F0FDF4", color: "#166534", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 3 }}>
                          <Users size={10} /> {art.user?.fullName || t("coAuthor") }
                        </span>
                      </div>
                    </div>
                    <div style={{ padding: "12px 14px" }}>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                      <div style={{ display: "flex", gap: 6 }}>
                        <span style={{ background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` }}>{art.subject}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function UploadPage({ setPage, setActiveArtworkId, pageParams }) {
  const { user: currentUser } = useAuth();
  const [showPopup, setShowPopup] = useState(false);
  const [isEbookViewerOpen, setIsEbookViewerOpen] = useState(false);
  const [isEbook, setIsEbook] = useState(false);
  const [ebookOrientation, setEbookOrientation] = useState('portrait');
  const [uploadState, setUploadState] = useState("idle");
  const [createdId, setCreatedId] = useState(null);
  const [checked1, setChecked1] = useState(false);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [projectYear, setProjectYear] = useState("Năm 3");
  const [isGroupProject, setIsGroupProject] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendInput, setFriendInput] = useState("");
  const [friendResults, setFriendResults] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notifyOnConfirm, setNotifyOnConfirm] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [error, setError] = useState("");
  const [defaultWatermarkText, setDefaultWatermarkText] = useState("UEF");
  const [blocks, setBlocks] = useState(() => {
    const initialBlocks = pageParams?.draftBlocks || [];
    return initialBlocks.map(b => {
      if (b.type === "image" && !b.data?.url && b.content) {
        return { ...b, data: { ...b.data, url: b.content } };
      }
      return b;
    });
  });

  const isFromDraft = !!pageParams?.draftBlocks;
  const [showUploadPreview, setShowUploadPreview] = useState(false);
  const [draftId, setDraftId] = useState(pageParams?.draftId || null);

  const autoSaveStateRef = React.useRef({ title, description, subject, tools, tags, friends, coverImage, additionalImages, projectYear, defaultWatermarkText, blocks, draftId });
  useEffect(() => {
    autoSaveStateRef.current = { title, description, subject, tools, tags, friends, coverImage, additionalImages, projectYear, defaultWatermarkText, blocks, draftId };
  });

  useEffect(() => {
    const timer = setInterval(async () => {
      const state = autoSaveStateRef.current;
      if (!state.title?.trim() && state.blocks.length === 0) return;
      try {
        const body = {
          title: state.title?.trim() || 'Untitled Draft',
          description: state.description?.trim() || null,
          subject: state.subject || null,
          toolsUsed: state.tools,
          tags: state.tags,
          collaborators: state.friends.map(f => f.fullName || f),
          collaboratorIds: state.friends.map(f => f.id).filter(Boolean),
          fileUrls: [state.coverImage, ...state.additionalImages].filter(Boolean),
          coverImageUrl: state.coverImage,
          watermarkText: state.defaultWatermarkText || "UEF",
          watermarkPosition: "bottom-right",
          semester: yearToSemester[state.projectYear] || "HK1",
          academicYear: yearToAcademic[state.projectYear] || "2024-2025",
          blocksJson: JSON.stringify(state.blocks),
          status: 'draft'
        };
        if (state.draftId) {
          await api.artworks.update(state.draftId, body);
        } else {
          const created = await api.artworks.create(body);
          setDraftId(created.id);
        }
        console.log("Auto-saved draft from UploadPage at", new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (pageParams?.draftBlocks) {
       setBlocks(pageParams.draftBlocks.map(b => {
          if (b.type === "image" && !b.data?.url && b.content) {
            return { ...b, data: { ...b.data, url: b.content } };
          }
          return b;
       }));
    }
    if (pageParams?.draftSettings) {
       try {
           const s = pageParams.draftSettings;
           if (s.title) setTitle(s.title);
           if (s.description) setDescription(s.description);
           if (s.category) setSubject(s.category);
           if (s.tags) {
             setTags(typeof s.tags === 'string' ? s.tags.split(',').map(t => t.trim()).filter(Boolean) : (Array.isArray(s.tags) ? s.tags : []));
           }
           if (s.tools) {
             setTools(typeof s.tools === 'string' ? s.tools.split(',').map(t => t.trim()).filter(Boolean) : (Array.isArray(s.tools) ? s.tools : []));
           }
           if (s.projectYear) setProjectYear(s.projectYear);
           if (s.coverImage) setCoverImage(s.coverImage);
           if (s.coOwners) {
             setIsGroupProject(true);
             const owners = typeof s.coOwners === 'string' ? s.coOwners.split(',') : (Array.isArray(s.coOwners) ? s.coOwners : []);
             setFriends(owners.map(f => ({ id: Date.now()+Math.random(), name: typeof f === 'string' ? f.trim() : f.name, role: 'Member' })));
           }
       } catch (err) {
           console.error("Error parsing draftSettings:", err);
       }
    }
  }, [pageParams]);

  const addBlock = (type) => {
    const newBlock = { id: Date.now().toString(), type, content: "", data: {} };
    if (type === "text") newBlock.content = "";
    if (type === "image") newBlock.data.url = "";
    if (type === "color") newBlock.data.colors = ["#000000"];
    if (type === "typography") newBlock.data.fontName = "Inter";
    setBlocks([...blocks, newBlock]);
  };

  const updateBlock = (id, newProps) => {
    setBlocks(blocks.map(b => b.id === id ? { ...b, ...newProps } : b));
  };

  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  useEffect(() => {
    fetch("/api/site-settings")
      .then(r => r.json())
      .then(data => {
        if (data.watermark_text) setDefaultWatermarkText(data.watermark_text);
      })
      .catch(() => {});
  }, []);

  const yearToSemester = { "Năm 1": "HK1", "Năm 2": "HK2", "Năm 3": "HK3", "Năm 4": "HK1", "Tốt nghiệp": "HK2" };
  const yearToAcademic = { "Năm 1": "2024-2025", "Năm 2": "2023-2024", "Năm 3": "2022-2023", "Năm 4": "2021-2022", "Tốt nghiệp": "2021-2022" };
  const allSubjects = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];

  const handleFriendSearch = (val) => {
    setFriendInput(val);
    if (val.length < 2) { setFriendResults([]); return; }
    api.users.search(val).then(setFriendResults).catch(() => {});
  };

  const addFriend = (user) => {
    if (!friends.find(f => f.id === user.id)) {
      setFriends([...friends, { id: user.id, fullName: user.fullName, email: user.email }]);
    }
    setFriendInput("");
    setFriendResults([]);
  };

  const readFileAsDataURL = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

  const handleCoverUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await readFileAsDataURL(file);
    setCoverImage(dataUrl);
  };

  const handleAdditionalUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    const max = 10 - (coverImage ? 1 : 0) - additionalImages.length;
    const toAdd = files.slice(0, max);
    const urls = await Promise.all(toAdd.map(readFileAsDataURL));
    setAdditionalImages(prev => [...prev, ...urls].slice(0, 9));
  };

  const removeAdditional = (idx) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== idx));
  };

  const allFileUrls = coverImage ? [coverImage, ...additionalImages] : [...additionalImages];

  const handleUseEbook = (pages, file, orientation = 'portrait') => {
    if (pages.length > 0) {
      setCoverImage(pages[0]);
      setAdditionalImages(pages.slice(1, 10)); // up to 9 extra images
      setIsEbook(true);
      setEbookOrientation(orientation);
    }
  };

  const handleUploadSubmit = async () => {
    if (!coverImage) { setError(t("pleaseSelectCoverImage")); return; }
    if (!title.trim()) { setError(t("pleaseEnterCourseName")); return; }
    if (!subject) { setError(t("pleaseSelectCategory")); return; }
    if (!checked1 || !checked2 || !checked3) { setError(t("pleaseConfirmCommitments")); return; }
    setError("");
    setUploadState("loading");
    
    let submitTags = tags.length > 0 ? [...tags] : [subject];
    if (isEbook && !submitTags.includes("IS_EBOOK")) {
      submitTags.push("IS_EBOOK");
    }
    if (isEbook && ebookOrientation === 'landscape' && !submitTags.includes("EBOOK_LANDSCAPE")) {
      submitTags.push("EBOOK_LANDSCAPE");
    }

    const generateWatermarkDataURL = async (imgUrl, text) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = imgUrl; });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      const wmText = text || "UEF";
      const wmSize = Math.max(Math.min(canvas.width, canvas.height) * 0.04, 14);
      ctx.font = `bold ${wmSize}px sans-serif`;
      ctx.textAlign = "right";
      ctx.textBaseline = "bottom";
      const tw = ctx.measureText(wmText).width;
      const pad = 20;
      const bx = canvas.width - pad;
      const by = canvas.height - pad;
      const bh = wmSize * 1.8;
      ctx.fillStyle = "rgba(0,0,0,0.6)";
      ctx.beginPath();
      ctx.roundRect(bx - tw - pad, by - bh, tw + pad, bh, 6);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.92)";
      ctx.fillText(wmText, bx, by - bh / 2 + wmSize * 0.35);
      return canvas.toDataURL("image/jpeg", 0.92);
    };

    try {
      const finalWatermarkText = defaultWatermarkText || "UEF";
      const watermarkedCover = await generateWatermarkDataURL(coverImage, finalWatermarkText);

      setUploadState("analyzing_ai");
      const aiResult = await api.artworks.analyzeArtworkWithAI(coverImage);
      let uploadStatus = "pending_approval";
      if (aiResult.originalityScore < 50) {
        const proceed = window.confirm(
          `CẢNH BÁO AI:\n\n` +
          `Hệ thống nhận diện tác phẩm của bạn có tỷ lệ tạo ra bởi AI rất cao (${aiResult.aiGeneratedPercentage}%).\n` +
          `Độ nguyên bản (Originality) chỉ đạt ${aiResult.originalityScore}%.\n\n` +
          `Ấn phẩm sẽ được chuyển vào trạng thái CHỜ DUYỆT để Admin và Giảng viên kiểm tra.\nBạn có chắc chắn muốn tiếp tục đăng không?`
        );
        if (!proceed) {
          setUploadState("idle");
          return;
        }
      }

      setUploadState("loading");
      
      let finalCover = coverImage;
      let finalWatermarkedCover = watermarkedCover;
      if (!finalCover && isFromDraft && blocks.length > 0) {
         const firstImageBlock = blocks.find(b => b.type === 'image' && b.content);
         if (firstImageBlock) {
             finalCover = firstImageBlock.content;
             finalWatermarkedCover = firstImageBlock.content;
         }
      }

      const newArtwork = await api.artworks.create({
        title: title.trim(),
        description: description.trim() || null,
        subject,
        toolsUsed: tools,
        semester: yearToSemester[projectYear] || "HK1",
        academicYear: yearToAcademic[projectYear] || "2024-2025",
        tags: submitTags,
        collaborators: friends.map(f => f.fullName || f),
        collaboratorIds: friends.map(f => f.id).filter(Boolean),
        fileUrls: allFileUrls,
        coverImageUrl: finalWatermarkedCover,
        originalCoverUrl: finalCover,
        watermarkText: finalWatermarkText,
        watermarkPosition: "bottom-right",
        isPublic: true,
        status: uploadStatus,
        isAiConfirmed: checked1,
        isEbook: isEbook,
        aiScore: aiResult.originalityScore,
        aiGeneratedPct: aiResult.aiGeneratedPercentage,
        isAiVerified: aiResult.isAiVerified,
        blocksJson: JSON.stringify(blocks)
      });
      setCreatedId(newArtwork.id);
      setUploadState("success");
      setTimeout(() => {
        setUploadState("idle");
        setShowPopup(false);
        setActiveArtworkId(newArtwork.id);
        setPage("dashboard");
      }, 1800);
    } catch (e) {
      setError(e?.message || t("uploadError"));
      setUploadState("idle");
    }
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh", padding: "40px 64px", position: "relative" }}>
      {showPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(0,0,0,0.35)" }}>
            {uploadState === "success" ? (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="w-16 h-16 bg-[#e0eaff] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#1a4ba8]" />
                </div>
                <h4 className="text-xl font-bold text-[#212121] mb-2">{t("uploadSuccess")}</h4>
                <p className="text-sm text-[#666666]">{t("artworkSubmitted")}</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: "#FEF2F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldAlert size={20} color={CRIMSON} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: BLACK }}>{t("academicCommitment")}</h3>
                    <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>{t("requiredBeforePosting")}</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 20, background: GRAY_BG, padding: "12px 14px", borderRadius: 8, borderLeft: `3px solid ${CRIMSON}` }}>
                  {t("commitmentDescription")}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { id: "c1", state: checked1, set: setChecked1, text: t("commitmentAi") },
                    { id: "c2", state: checked2, set: setChecked2, text: t("commitmentNoCopy") },
                    { id: "c3", state: checked3, set: setChecked3, text: t("commitmentConsequences") },
                  ].map(c => (
                    <label key={c.id} style={{ display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" }}>
                      <div onClick={() => c.set(!c.state)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${c.state ? CERULEAN : GRAY_LIGHT}`, background: c.state ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>
                        {c.state && <Check size={14} color="#fff" strokeWidth={3} />}
                      </div>
                      <span style={{ fontSize: 13, color: "#333", lineHeight: 1.5 }}>{c.text}</span>
                    </label>
                  ))}
                </div>
                {error && <p style={{ color: CRIMSON, fontSize: 12, marginTop: 12 }}>{error}</p>}
                <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
                  <button onClick={() => setShowPopup(false)} disabled={uploadState === "loading" || uploadState === "analyzing_ai"} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: (uploadState === "loading" || uploadState === "analyzing_ai") ? "not-allowed" : "pointer", color: MUTED }}>{t("cancel")}</button>
                  <button onClick={handleUploadSubmit} disabled={(!checked1 || !checked2 || !checked3) || uploadState === "loading" || uploadState === "analyzing_ai"} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: (checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai") ? CERULEAN : GRAY_LIGHT, color: (checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai") ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: (checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai") ? "pointer" : "not-allowed" }}>
                    {uploadState === "analyzing_ai" ? "Đang phân tích bản quyền AI..." : uploadState === "loading" ? t("processing") : t("confirmAndPost")}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: BLACK }}>{t("uploadNewArtwork")}</h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 32 }}>{t("shareWithCommunity")}</p>
        <div className="upload-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{isEbook ? "E-BOOK PREVIEW" : t("coverImage")}</label>
              <button onClick={() => setIsEbookViewerOpen(true)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: `1px solid ${CERULEAN}`, background: "#fff", color: CERULEAN, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                <BookOpen size={14} color={CERULEAN} />
                Tải lên E-book
              </button>
            </div>
            {isEbook ? (
              <div style={{ border: `1px solid ${GRAY_LIGHT}`, borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 400, background: "#F0F2F5", padding: "40px 0", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" }}>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <HTMLFlipBook 
                    width={ebookOrientation === 'landscape' ? 400 : 280} 
                    height={ebookOrientation === 'landscape' ? 280 : 390} 
                    size="stretch"
                    minWidth={200}
                    maxWidth={400}
                    minHeight={300}
                    maxHeight={600}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="shadow-2xl mx-auto"
                  >
                    {[coverImage, ...additionalImages].filter(Boolean).map((img, index) => (
                      <div key={index} className="demoPage bg-white overflow-hidden border border-gray-200">
                        <img src={img} alt={`Page ${index + 1}`} className="w-full h-full object-contain pointer-events-none" style={{ width: "100%", height: "100%", display: "block" }} />
                      </div>
                    ))}
                  </HTMLFlipBook>
                  <button 
                    onClick={(e) => { e.preventDefault(); setEbookOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait'); }} 
                    style={{ position: "absolute", bottom: -40, background: "#fff", border: "1px solid #ccc", padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer", zIndex: 20 }}
                  >
                    Chuyển sang Ebook {ebookOrientation === 'portrait' ? 'ngang' : 'dọc'}
                  </button>
                </div>
                <div style={{ marginTop: 30, background: "rgba(0,0,0,0.7)", color: "white", padding: "8px 20px", borderRadius: 30, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", pointerEvents: "none" }}>
                  <span style={{ display: "flex", width: 8, height: 8, position: "relative" }}>
                    <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", opacity: 0.75 }}></span>
                    <span style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8" }}></span>
                  </span>
                  Kéo mép giấy hoặc click vào góc để lật trang
                </div>
              </div>
            ) : (
              <>
                <input type="file" id="coverInput" accept="image/*" style={{ display: "none" }} onChange={handleCoverUpload} />
                <div onClick={() => document.getElementById("coverInput")?.click()} style={{ border: `2px dashed ${coverImage ? CERULEAN : GRAY_LIGHT}`, borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 400, background: GRAY_BG, cursor: "pointer" }}>
                  {coverImage ? (
                    <img src={coverImage} alt="preview" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
                  ) : (
                    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                      <FileImage size={36} color={MUTED} strokeWidth={1.5} />
                      <p style={{ color: MUTED, fontSize: 14, fontWeight: 600, margin: 0 }}>{t("clickToSelectCover")}</p>
                      <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>{t("imageFormatHint")}</p>
                    </div>
                  )}
                </div>
                {!isFromDraft && (
                <div style={{ marginTop: 16 }}>
                  <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("additionalImages")} ({additionalImages.length}/9)</label>
                  <input type="file" id="additionalInput" accept="image/*" multiple style={{ display: "none" }} onChange={handleAdditionalUpload} />
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {additionalImages.map((url, idx) => (
                      <div key={idx} style={{ width: 80, height: 64, borderRadius: 8, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, position: "relative" }}>
                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        <div onClick={() => removeAdditional(idx)} style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11 }}>×</div>
                      </div>
                    ))}
                    {additionalImages.length < 9 && (
                      <div onClick={() => document.getElementById("additionalInput")?.click()} style={{ width: 80, height: 64, borderRadius: 8, border: `2px dashed ${GRAY_LIGHT}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: GRAY_BG }}>
                        <Plus size={22} color={MUTED} />
                      </div>
                    )}
                  </div>
                </div>
                )}
              </>
            )}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("courseName")}</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Design Graphic - Flowers Garden" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, color: BLACK, outline: "none", boxSizing: "border-box", background: GRAY_BG }} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("projectType")}</label>
              <div style={{ display: "flex", gap: 6 }}>{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${projectYear === y ? CERULEAN : GRAY_LIGHT}`, background: projectYear === y ? "#eef4ff" : GRAY_BG, color: projectYear === y ? CERULEAN : MUTED, fontSize: 12, fontWeight: projectYear === y ? 600 : 400, cursor: "pointer" }}>{y}</button>))}</div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("projectCategory")}</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ key: false, label: t("individual"), desc: t("selfPerformed"), icon: <User size={16} /> }, { key: true, label: t("group"), desc: t("teamwork"), icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${isGroupProject === opt.key ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", background: isGroupProject === opt.key ? "#eef4ff" : GRAY_BG }}><span style={{ color: isGroupProject === opt.key ? CERULEAN : MUTED }}>{opt.icon}</span><div><p style={{ fontSize: 13, fontWeight: 600, color: isGroupProject === opt.key ? CERULEAN : BLACK, margin: 0 }}>{opt.label}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{opt.desc}</p></div></div>))}
              </div>
            </div>
            {isGroupProject && (<div style={{ position: "relative" }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("addTeamMembers")}</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{friends.map((f, i) => (<span key={f.id || i} style={{ background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}><User size={12} /> {f.fullName || f}<X size={12} color={CERULEAN} onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} style={{ cursor: "pointer" }} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder={t("enterNameOrEmail")} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 120, color: BLACK, flex: 1 }} /></div>{friendResults.length > 0 && (<div style={{ position: "absolute", zIndex: 50, top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 200, overflowY: "auto" }}>{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${GRAY_LIGHT}` }}><img src={u.avatarUrl || ""} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG }} /><div><p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: BLACK }}>{u.fullName}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{u.email}</p></div></div>))}</div>)}</div>)}
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("description")}</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder={t("describeYourArtwork")} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, color: BLACK, outline: "none", resize: "vertical", minHeight: 90, lineHeight: 1.6, boxSizing: "border-box", background: GRAY_BG, fontFamily: "inherit" }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("category")} *</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, background: GRAY_BG, color: BLACK }}>
<option value="">{t("selectOption")}</option>
                  {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("tools")}</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>
                  {tools.map(t => (<span key={t} style={{ background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>{t}<X size={12} color={CERULEAN} onClick={() => setTools(tools.filter(x => x !== t))} style={{ cursor: "pointer", marginLeft: 4 }} /></span>))}
                  <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} />
                </div>
              </div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("tags")}</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{tags.map(tag => (<span key={tag} style={{ background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}>{tag}<X size={12} color={CERULEAN} onClick={() => setTags(tags.filter(x => x !== tag))} style={{ cursor: "pointer" }} /></span>))}<input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder={t("addTagPlaceholder")} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} /></div></div>
          </div>
        </div>

        {/* Builder Section */}
        <div style={{ marginTop: 40, borderTop: `1px solid ${GRAY_LIGHT}`, paddingTop: 32, paddingBottom: 64 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BLACK, marginBottom: 8 }}>Nội dung chi tiết (Case Study Builder)</h3>
          <p style={{ color: MUTED, fontSize: 13, marginBottom: 24 }}>Sử dụng các khối (Blocks) dưới đây để trình bày tác phẩm của bạn thành một bài thuyết trình chuyên nghiệp như trên Behance.</p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 }}>
            {blocks.map((block, i) => (
              <div key={block.id} style={{ padding: 20, borderRadius: 12, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", position: "relative" }}>
                <div onClick={() => removeBlock(block.id)} style={{ position: "absolute", top: 12, right: 12, cursor: "pointer", color: CRIMSON, fontWeight: "bold" }}>×</div>
                
                {block.type === "text" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 14 }}>Khối Văn Bản (Text)</h4>
                    <textarea 
                      value={block.content} 
                      onChange={e => updateBlock(block.id, { content: e.target.value })}
                      placeholder="Nhập tiêu đề hoặc đoạn mô tả..." 
                      style={{ width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, minHeight: 80, boxSizing: "border-box" }} 
                    />
                  </div>
                )}
                
                {block.type === "image" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 14 }}>Khối Hình Ảnh (Image)</h4>
                    {block.data.url ? (
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <img src={block.data.url} alt="" style={{ height: 100, objectFit: "cover", borderRadius: 8 }} />
                        <button onClick={() => updateBlock(block.id, { data: { ...block.data, url: "" } })} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff" }}>Đổi ảnh</button>
                      </div>
                    ) : (
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={async (e) => {
                          if (e.target.files?.[0]) {
                            const url = await readFileAsDataURL(e.target.files[0]);
                            updateBlock(block.id, { data: { ...block.data, url } });
                          }
                        }} 
                      />
                    )}
                  </div>
                )}

                {block.type === "color" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 14 }}>Bảng Màu (Color Palette)</h4>
                    <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
                      {block.data.colors.map((c, idx) => (
                        <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <input type="color" value={c} onChange={e => {
                            const newColors = [...block.data.colors];
                            newColors[idx] = e.target.value;
                            updateBlock(block.id, { data: { ...block.data, colors: newColors } });
                          }} style={{ width: 40, height: 40, padding: 0, border: "none", cursor: "pointer", borderRadius: 4 }} />
                          <span style={{ fontSize: 10, textTransform: "uppercase" }}>{c}</span>
                        </div>
                      ))}
                      <button onClick={() => updateBlock(block.id, { data: { ...block.data, colors: [...block.data.colors, "#ffffff"] } })} style={{ width: 40, height: 40, borderRadius: "50%", border: `1px dashed ${MUTED}`, background: "transparent", cursor: "pointer" }}>+</button>
                    </div>
                  </div>
                )}

                {block.type === "typography" && (
                  <div>
                    <h4 style={{ margin: "0 0 12px 0", fontSize: 14 }}>Font Chữ (Typography)</h4>
                    <select 
                      value={block.data.fontName} 
                      onChange={e => updateBlock(block.id, { data: { ...block.data, fontName: e.target.value } })}
                      style={{ padding: "8px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, width: "100%", boxSizing: "border-box", fontSize: 14 }} 
                    >
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="Outfit">Outfit</option>
                      <option value="Playfair Display">Playfair Display</option>
                      <option value="Montserrat">Montserrat</option>
                      <option value="Lora">Lora</option>
                    </select>
                    <div style={{ marginTop: 12, padding: 16, background: GRAY_BG, borderRadius: 8, fontSize: 24, fontFamily: block.data.fontName }}>
                      Aa Bb Cc Dd Ee 01234
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          <h4 style={{ fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 }}>Thêm khối nội dung:</h4>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
             <button onClick={() => addBlock("text")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" }}>
                + Văn bản (Text)
             </button>
             <button onClick={() => addBlock("image")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" }}>
                + Hình ảnh (Image)
             </button>
             <button onClick={() => addBlock("color")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" }}>
                + Bảng màu (Color Palette)
             </button>
             <button onClick={() => addBlock("typography")} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" }}>
                + Font chữ (Typography)
             </button>
          </div>
        </div>

        <div style={{ marginTop: 24, padding: 32, background: "#f9f9f9", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: BLACK, marginBottom: 16 }}>Hoàn tất và Đăng đồ án</h3>
          <div style={{ background: "#FEFCF3", border: `1px solid #F0E6CC`, borderRadius: 10, padding: "14px 16px", marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
              <div onClick={() => setAgreedToTerms(!agreedToTerms)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreedToTerms ? CERULEAN : GRAY_LIGHT}`, background: agreedToTerms ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>{agreedToTerms && <Check size={12} color="#fff" strokeWidth={3} />}</div>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>{t("fullCommitment")}</p>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div onClick={() => setNotifyOnConfirm(!notifyOnConfirm)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${notifyOnConfirm ? CERULEAN : GRAY_LIGHT}`, background: notifyOnConfirm ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>{notifyOnConfirm && <Check size={12} color="#fff" strokeWidth={3} />}</div>
              <span style={{ fontSize: 12, color: "#666" }}>{t("notifyOnConfirmText")}</span>
            </div>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            {isFromDraft && (
              <button onClick={() => setShowUploadPreview(true)} style={{ flex: 1, padding: "13px", borderRadius: 10, border: `1px solid ${CERULEAN}`, background: "transparent", color: CERULEAN, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Preview</button>
            )}
            <button onClick={() => setShowPopup(true)} disabled={!agreedToTerms} style={{ flex: isFromDraft ? 1 : "auto", width: isFromDraft ? "auto" : "100%", padding: "13px", borderRadius: 10, border: "none", background: agreedToTerms ? CERULEAN : GRAY_LIGHT, color: agreedToTerms ? "#fff" : MUTED, fontSize: 15, fontWeight: 700, cursor: agreedToTerms ? "pointer" : "not-allowed", letterSpacing: "0.3px" }}>{t("submitArtwork")}</button>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 8 }}>{t("postSubmissionNote")}</p>
        </div>
      </div>
      {showUploadPreview && isFromDraft && (
        <div style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", fontFamily: "'Inter', sans-serif" }}>
           <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: -1, pointerEvents: "none" }} />
           {/* SINGLE FIXED TOP HEADER (100vw) */}
           <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#191919", zIndex: 1010, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #333" }}>
             
             {/* LEFT SIDE: Back, Logo, Avatar, Info */}
             <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
               <button onClick={() => setShowUploadPreview(false)} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                 <ChevronLeft size={20} />
               </button>
               
               <span style={{ fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginRight: 8 }}>Bēhance</span>
               
               <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                 <img src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "1px solid #333" }} />
                 <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                   <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: "1.2" }}>{title || "Untitled Project"}</span>
                   <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#bbb" }}>
                     <span style={{ cursor: "pointer", color: "#fff", fontWeight: 400 }}>{currentUser?.fullName || currentUser?.name || "Author"}</span>
                     <span>•</span>
                     <span style={{ color: "#0057ff", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" }}>Follow</span>
                   </div>
                 </div>
               </div>
             </div>

             {/* RIGHT SIDE: Save as Draft, Publish, X */}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
               <button onClick={() => { setShowUploadPreview(false); setShowPopup(true); }} style={{ padding: "8px 24px", borderRadius: 20, background: "#10a359", color: "#fff", border: "none", fontWeight: "bold", fontSize: 13, cursor: "pointer" }}>Submit Artwork</button>
               <button onClick={() => setShowUploadPreview(false)} style={{ background: "transparent", border: "none", color: "#888", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginLeft: 4 }} onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#888"; }}>
                 <X size={20} />
               </button>
             </div>
           </div>

           {/* FIXED RIGHT SIDEBAR (Preview Mode) */}
           <div className="hidden xl:flex flex-col items-center gap-4 fixed right-6 top-[88px] z-[10020]">
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="relative">
                    <img src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40"} className="w-9 h-9 rounded-full border-2 border-[#151515] object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#0057ff] rounded-full flex items-center justify-center text-white border-[1.5px] border-[#151515] font-bold text-[12px] leading-none pb-[1px]">+</div>
                 </div>
                 <span className="text-[11px] font-medium text-white">Follow</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md">
                    <Mail size={16} className="text-black" />
                 </div>
                 <span className="text-[11px] font-medium text-white">Message</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 cursor-pointer group">
                 <div className="w-10 h-10 rounded-full bg-[#0057ff] flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20">
                    <ThumbsUp size={18} className="text-white fill-white" />
                 </div>
                 <span className="text-[11px] font-medium text-white">Appreciate</span>
              </div>
           </div>

           {/* FLOATING BOTTOM BANNER */}
           <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#525760] rounded-xl flex items-center gap-6 z-[10020] shadow-2xl overflow-hidden pr-12 pl-4 py-3">
              <button className="absolute top-2 right-2 text-white/60 hover:text-white transition-colors">
                 <X size={16} />
              </button>
              
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-white rounded flex items-center justify-center shrink-0">
                    <Image size={24} className="text-gray-300" />
                 </div>
                 <div className="flex flex-col justify-center">
                    <span className="text-white font-semibold text-[15px] leading-tight">{title || "Untitled Project"}</span>
                    <span className="text-white/80 text-[13px] font-medium">{currentUser?.fullName || currentUser?.name || "Author"}</span>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <button className="bg-white hover:bg-gray-100 text-black font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                    <div className="w-4 h-4 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px] pb-[1px]">+</div>
                    Follow {currentUser?.fullName ? currentUser.fullName.split(' ').pop() : (currentUser?.name || "Author")}
                 </button>
                 <button className="bg-[#0057ff] hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors">
                    <ThumbsUp size={16} className="fill-white" />
                    Appreciate
                 </button>
              </div>
           </div>

           <div style={{ display: "flex", width: "100%", justifyContent: "center", position: "relative", minHeight: "100vh", paddingTop: 64 }}>
              
              {/* CỘT CHÍNH (Nội dung) */}
              <div style={{ width: "calc(100% - 200px)", maxWidth: 1400, display: "flex", flexDirection: "column", background: "#151515", margin: "0 auto", minHeight: "calc(100vh - 64px)" }}>
                 
                 {/* CÁC ẢNH HOẶC E-BOOK */}
                 <div style={{ display: "flex", flexDirection: "column", width: "100%", background: "transparent" }}>
                    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

                       <div style={{ width: "100%", position: "relative" }}>
                          <div style={{ width: "100%", background: "#ffffff", paddingBottom: (blocks.length > 0 || coverImage) ? 0 : 400 }}>
                             {coverImage && (
                                <div style={{ width: "100%", margin: "0 auto", marginBottom: 16 }}>
                                   <img src={coverImage} style={{ width: "100%", height: "auto", display: "block" }} />
                                </div>
                             )}
                             {blocks.length === 0 && !coverImage ? (
                                <div style={{ height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", background: "#ffffff" }}>
                                   Empty Project
                                </div>
                             ) : (
                                blocks.map(block => (
                                   <div key={block.id} style={{ width: block.fullWidth ? "100%" : "min(100%, 1024px)", margin: "0 auto", padding: block.fullWidth ? "0" : `0px`, marginBottom: 16 }}>
                                      {block.type === 'image' && block.content && <img src={block.content} style={{ width: "100%", height: "auto", display: "block" }} />}
                                      {block.type === 'text' && <div style={{ color: "#212121", padding: 16, fontSize: 17, fontFamily: "sans-serif", whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: block.content ? block.content.replace(/\n/g, '<br/>') : '' }}></div>}
                                      {block.type === 'grid' && <div style={{ width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" }}>Grid Preview</div>}
                                      {block.type === 'video' && <div style={{ width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" }}>Video/Audio Preview</div>}
                                   </div>
                                ))
                             )}
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* PREVIEW FOOTER (THÔNG SỐ & TÁC GIẢ) */}
                 <div style={{ width: "100%", display: "flex", flexDirection: "column" }}>
                    
                    {/* Phần Đen (Thông số & Tác giả) */}
                    <div style={{ background: "#111111", padding: "60px 40px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
                       <button style={{ width: 80, height: 80, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", marginBottom: 32, cursor: "not-allowed" }}>
                         <ThumbsUp size={36} color="#fff" />
                       </button>

                       <h1 style={{ fontSize: 32, fontWeight: "bold", margin: "0 0 16px 0", textAlign: "center" }}>{title || "Untitled Project"}</h1>
                       {description && <p style={{ fontSize: 18, color: "#aaa", textAlign: "center", maxWidth: 800 }}>{description}</p>}
                       
                       <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#888", fontSize: 14, marginBottom: 24 }}>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={16} /> 0</div>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={16} /> 0</div>
                         <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={16} /> 0</div>
                       </div>

                       <p style={{ color: "#888", fontSize: 13, margin: "0 0 40px 0" }}>Published: {new Date().toLocaleDateString()}</p>
                    </div>

                    {/* Phần Trắng (Bình luận & Owner Card) */}
                    <div style={{ display: "flex", background: "#f9f9f9", padding: "60px 40px" }}>
                       
                       {/* Cột trái (Bình luận) */}
                       <div style={{ flex: "0 0 65%", paddingRight: 60 }}>
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, display: "flex", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <img src={currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User")} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                             <div style={{ flex: 1 }}>
                               <textarea placeholder="What are your thoughts on this project?" style={{ width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontSize: 14, fontFamily: "inherit" }} disabled />
                               <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                                 <button disabled style={{ background: "#E8E8E8", color: "#666", border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "not-allowed" }}>Post a Comment</button>
                               </div>
                             </div>
                          </div>
                          <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" }}>No comments yet.</p>
                       </div>

                       {/* Cột phải (Owner Card) */}
                       <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 24 }}>
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Owner</span>
                             <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                               <img src={currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User")} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover" }} />
                               <div>
                                 <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                   <h3 style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: "#191919" }}>{currentUser?.fullName || currentUser?.name || "Author"}</h3>
                                 </div>
                                 <span style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}>
                                   <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> 
                                   Vietnam
                                 </span>
                               </div>
                             </div>
                             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                               <button style={{ background: "#0057ff", color: "#fff", border: "none", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                 <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>+</div> Follow
                               </button>
                               <button style={{ background: "#fff", color: "#0057ff", border: "1px solid #EAEAEA", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                                 <Mail size={16} /> Message
                               </button>
                             </div>
                          </div>
                          
                          <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                             <h3 style={{ margin: "0 0 16px 0", fontSize: 15, fontWeight: "bold", color: "#191919" }}>{title || "Untitled Project"}</h3>
                             <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#888", fontSize: 13 }}>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={14} /> 0</div>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={14} /> 0</div>
                               <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={14} /> 0</div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}
      <EbookViewerModal isOpen={isEbookViewerOpen} onClose={() => setIsEbookViewerOpen(false)} onUseEbook={handleUseEbook} />
    </div>
  );
}

function OrderModal({ setPage, activeArtworkId, onClose }) {
    const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
  });
  const [sendingOrder, setSendingOrder] = useState(false);

  const handleSubmit = async () => {
    if (!orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim()) {
      alert(t("fillRequiredFields"));
      return;
    }

    setSendingOrder(true);
    try {
      let targetRecipientId = null;
      let targetRecipientSlug = "uef-design-gallery"; // Fallback
      let actualTitle = t("orderedArtwork");
      let actualImage = "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80";
      try {
        if (activeArtworkId) {
          const artworkData = await api.artworks.get(activeArtworkId);
          if (artworkData?.userId) targetRecipientId = artworkData.userId;
          else if (artworkData?.user?.id) targetRecipientId = artworkData.user.id;
          else if (artworkData?.user?.portfolioSettings?.portfolioSlug) targetRecipientSlug = artworkData.user.portfolioSettings.portfolioSlug;
          
          if (artworkData?.title) actualTitle = artworkData.title;
          if (artworkData?.coverImageUrl) actualImage = artworkData.coverImageUrl;
        }
      } catch {}

      await api.messages.send({
        recipientId: targetRecipientId,
        recipientSlug: targetRecipientId ? null : targetRecipientSlug,
        senderName: orderData.name.trim(),
        senderEmail: orderData.email.trim(),
        senderCompany: orderData.company.trim() || null,
        purpose: "order",
        content: JSON.stringify({
          artworkId: activeArtworkId,
          artworkTitle: actualTitle,
          artworkImage: actualImage,
          phone: orderData.phone.trim() || null,
          company: orderData.company.trim() || null,
          description: orderData.description.trim(),
        }),
      });

      alert(t("orderSentSuccess"));
      onClose();
      setPage("messages");
    } catch (e) {
      alert(t("orderSendError") + (e?.message || t("pleaseTryAgain")));
    } finally {
      setSendingOrder(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-[#E0E0E0] flex items-center justify-between">
          <h3 className="text-lg font-bold text-[#212121]">{t("orderArtwork")}</h3>
          <button onClick={onClose} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
        </div>
        <div className="p-6">
          <div style={{ marginBottom: 20 }}>
            <p className="text-sm text-[#666666] mb-3">{t("orderDescription")}</p>
            <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 8, padding: "12px 14px" }}>
              <div style={{ display: "flex", alignItems: "start", gap: 8 }}>
                <ShieldAlert size={16} color="#D97706" style={{ flexShrink: 0, marginTop: "2px" }} />
                <p className="text-xs text-[#92400E]">
                  <strong>{t("notice")}</strong> {t("orderNotice")}
                </p>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("fullName")}</label>
                <input
                  type="text"
                  value={orderData.name}
                  onChange={e => setOrderData({ ...orderData, name: e.target.value })}
                  placeholder={t("placeholderFullName")}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("emailStar")}</label>
                <input
                  type="email"
                  value={orderData.email}
                  onChange={e => setOrderData({ ...orderData, email: e.target.value })}
                  placeholder="nguyenvana@example.com"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("phoneNumber")}</label>
                <input
                  type="tel"
                  value={orderData.phone}
                  onChange={e => setOrderData({ ...orderData, phone: e.target.value })}
                  placeholder="090xxx xxx xx"
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("company")}</label>
                <input
                  type="text"
                  value={orderData.company}
                  onChange={e => setOrderData({ ...orderData, company: e.target.value })}
                  placeholder={t("placeholderCompany")}
                  style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("requirementsDescription")}</label>
              <textarea
                value={orderData.description}
                onChange={e => setOrderData({ ...orderData, description: e.target.value })}
                placeholder={t("orderDescriptionPlaceholder")}
                rows={4}
                style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box", color: BLACK }}
              />
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-[#E0E0E0] flex gap-3">
          <button onClick={onClose} disabled={sendingOrder} style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: BLACK, opacity: sendingOrder ? 0.6 : 1 }}>
            {t("cancel")}
          </button>
          <button
            onClick={handleSubmit}
            disabled={sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim()}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: (sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim()) ? GRAY_LIGHT : "#059669",
              color: (sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim()) ? MUTED : "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: (sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim()) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {sendingOrder ? (
              <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("sending")}</>
            ) : (
              <>
                <ShoppingCart size={16} /> {t("confirmOrder")}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ setPage, activeArtworkId, onClose, userProfile }) {
  const [feedbackData, setFeedbackData] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async () => {
    if (!feedbackData.trim()) {
      alert("Vui lòng nhập nội dung nhận xét");
      return;
    }

    setSending(true);
    try {
      let targetRecipientId = null;
      let targetRecipientSlug = "uef-design-gallery";
      let actualTitle = "Tác phẩm";
      let actualImage = "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80";
      
      try {
        if (activeArtworkId) {
          const artworkData = await api.artworks.get(activeArtworkId);
          if (artworkData?.userId) targetRecipientId = artworkData.userId;
          else if (artworkData?.user?.id) targetRecipientId = artworkData.user.id;
          else if (artworkData?.user?.portfolioSettings?.portfolioSlug) targetRecipientSlug = artworkData.user.portfolioSettings.portfolioSlug;
          
          if (artworkData?.title) actualTitle = artworkData.title;
          if (artworkData?.coverImageUrl) actualImage = artworkData.coverImageUrl;
        }
      } catch {}

      await api.messages.send({
        recipientId: targetRecipientId,
        recipientSlug: targetRecipientId ? null : targetRecipientSlug,
        senderName: userProfile?.fullName || userProfile?.name || "Giảng viên",
        senderEmail: userProfile?.email || "",
        senderCompany: "UEF",
        purpose: "feedback",
        content: JSON.stringify({
          artworkId: activeArtworkId,
          artworkTitle: actualTitle,
          artworkImage: actualImage,
          description: feedbackData.trim(),
        }),
      });

      alert("Đã gửi feedback thành công!");
      onClose();
    } catch (e) {
      alert("Lỗi khi gửi feedback: " + (e?.message || "Vui lòng thử lại"));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-5 border-b border-[#E0E0E0] flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#212121]">Feedback Kín</h3>
          <button onClick={onClose} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
        </div>
        <div className="p-6">
          <p className="text-sm text-[#666666] mb-4">Nhận xét này sẽ được gửi trực tiếp vào hộp thư của sinh viên và không công khai trên hệ thống.</p>
          <div>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#666666", marginBottom: 6 }}>Nội dung nhận xét</label>
            <textarea
              value={feedbackData}
              onChange={e => setFeedbackData(e.target.value)}
              placeholder="Nhập góp ý, nhận xét về bố cục, màu sắc, ý tưởng..."
              rows={6}
              style={{ width: "100%", padding: "12px", borderRadius: 8, border: `1px solid #E0E0E0`, fontSize: 14, outline: "none", resize: "vertical", minHeight: 120, boxSizing: "border-box", color: "#212121" }}
            />
          </div>
        </div>
        <div className="p-6 border-t border-[#E0E0E0] flex gap-3">
          <button onClick={onClose} disabled={sending} style={{ flex: 1, padding: "12px", borderRadius: 8, border: `1px solid #E0E0E0`, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#212121", opacity: sending ? 0.6 : 1 }}>
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={sending || !feedbackData.trim()}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: 8,
              border: "none",
              background: (sending || !feedbackData.trim()) ? "#E0E0E0" : "#1a4ba8",
              color: (sending || !feedbackData.trim()) ? "#666666" : "#fff",
              fontSize: 14,
              fontWeight: 600,
              cursor: (sending || !feedbackData.trim()) ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            {sending ? "Đang gửi..." : <><Send size={16} /> Gửi Feedback</>}
          </button>
        </div>
      </div>
    </div>
  );
}

function DetailPage({ setPage, setActiveArtworkId, activeArtworkId, onBookmarkClick, isBookmarked }) {
    const { user: authUser } = useAuth();
  const [art, setArt] = useState({
    title: t("loading"), subject: t("loading"), coverImageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    description: "", tags: [], toolsUsed: [], likeCount: 0, commentCount: 0,
    createdAt: new Date().toISOString(), user: null, userId: null, isPublic: true,
  });
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [comments, setComments] = useState([]);
  const [animatingLike, setAnimatingLike] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFollowingAnimPlaying, setIsFollowingAnimPlaying] = useState(false);
  const [actionSuccessToast, setActionSuccessToast] = useState("");
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeComment, setGradeComment] = useState("");
  const [gradeIsVisible, setGradeIsVisible] = useState(false);
  const [existingGrade, setExistingGrade] = useState(null);
  const [savingGrade, setSavingGrade] = useState(false);
  const ebookViewerRef = useRef(null);

  const toggleEbookFullscreen = () => {
    if (!document.fullscreenElement) {
      ebookViewerRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
    } else {
      document.exitFullscreen();
    }
  };
  const [relatedArtworks, setRelatedArtworks] = useState([]);
  const [liking, setLiking] = useState(false);
  const lastLikeTimeRef = React.useRef(0);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [pinpointMode, setPinpointMode] = useState(false);
  const [pendingComment, setPendingComment] = useState(null);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [draggingCommentId, setDraggingCommentId] = useState(null);
  const [filterLecturerId, setFilterLecturerId] = useState("");
  const [showLecturerFilter, setShowLecturerFilter] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [sendingReport, setSendingReport] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  const [fullscreenImageIndex, setFullscreenImageIndex] = React.useState(0);
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2000);
  };
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloading, setDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isReadingEbook, setIsReadingEbook] = useState(false);
  const [readerOrientation, setReaderOrientation] = useState('portrait');
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
  });
  const [sendingOrder, setSendingOrder] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);

  const [categoryCovers, setCategoryCovers] = useState({});
  const [toolCovers, setToolCovers] = useState({});

  useEffect(() => {
    fetch("/api/artworks/category-covers")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item.subject] = item.coverImageUrl; });
          setCategoryCovers(map);
        } else {
          setCategoryCovers(data);
        }
      })
      .catch(() => {});

    fetch("/api/artworks/tool-covers")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          const map = {};
          data.forEach(item => { map[item.tool] = item.coverImageUrl; });
          setToolCovers(map);
        } else {
          setToolCovers(data);
        }
      })
      .catch(() => {});
  }, []);
  useEffect(() => { const h = (e) => { if (e.key === 'Escape') setShowFullscreen(false); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);

  useEffect(() => {
    const measure = () => {
      const header = document.querySelector('header');
      if (header) setNavbarHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  const currentUserId = authUser?.id;
  const currentUserRole = authUser?.role;
  const canGrade = currentUserRole === "lecturer" || currentUserRole === "admin";
  
  const [lecturerBadges, setLecturerBadges] = useState([]);
  const [assigningBadge, setAssigningBadge] = useState(false);

  useEffect(() => {
    if (canGrade && currentUserId) {
      api.badges.list(currentUserId).then(setLecturerBadges).catch(console.error);
    }
  }, [canGrade, currentUserId]);

  // Debug log
  useEffect(() => {
    console.log("👤 DetailPage - authUser:", authUser);
    console.log("👤 DetailPage - currentUserId:", currentUserId);
    console.log("👤 DetailPage - currentUserRole:", currentUserRole);
  }, [authUser, currentUserId, currentUserRole]);

  useEffect(() => {
    if (!activeArtworkId) return;
    setLoading(true);
    setActiveImageIdx(0);
      setLoadError(false);
      api.artworks.incrementView(activeArtworkId).catch(() => {});
      api.artworks.get(activeArtworkId).then(res => {
      setArt({
        ...res,
        subject: res.subject || t("artwork"),
        tags: res.tags || [],
        toolsUsed: res.toolsUsed || [],
        description: res.description || "",
      });
      setIsLiked(res.isLiked || false);
      setLikeCount(res.likeCount || 0);
      setComments(res.comments || []);
      setExistingGrade(res.grade || null);
      if (res.grade) {
        setGradeScore(String(res.grade.score));
        setGradeComment(res.grade.comment || "");
        setGradeIsVisible(res.grade.isVisibleToStudent || false);
      }
      setLoading(false);
    }).catch(() => {
      const mockArt = artworks.find(a => String(a.id) === String(activeArtworkId));
      if (mockArt) {
        setArt({
          id: mockArt.id,
          title: mockArt.title,
          coverImageUrl: mockArt.img,
          subject: t("artwork"),
          tags: [mockArt.category].filter(Boolean),
          toolsUsed: [mockArt.tool].filter(Boolean),
          description: "",
          user: { 
            fullName: mockArt.student,
            portfolioSettings: {
              portfolioSlug: mockArt.student.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 -]/g, "").replace(/\s+/g, "-")
            }
          }
        });
        setIsLiked(false);
        setLikeCount(mockArt.likes || 0);
        setComments([]);
        setExistingGrade(null);
        setLoading(false);
      } else {
        setLoadError(true);
        setLoading(false);
      }
    });
    api.artworks.related(activeArtworkId, 6).then(setRelatedArtworks).catch(() => {});
  }, [activeArtworkId]);

  const handleLike = async () => {
    if (liking) return;
    if (!authUser) return alert(t("loginWithEmailToUse"));

    const now = Date.now();
    if (now - lastLikeTimeRef.current < 2000) {
      alert("Bạn thao tác quá nhanh, vui lòng đợi một chút!");
      return;
    }
    lastLikeTimeRef.current = now;

    setLiking(true);
    setAnimatingLike(true);
    setTimeout(() => setAnimatingLike(false), 300);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount(prev => wasLiked ? Math.max(0, prev - 1) : prev + 1);
    try {
      if (wasLiked) {
        await api.artworks.unlike(activeArtworkId);
      } else {
        await api.artworks.like(activeArtworkId);
      }
    } catch {
      setIsLiked(wasLiked);
      setLikeCount(prev => wasLiked ? prev + 1 : Math.max(0, prev - 1));
    }
    setLiking(false);
  };

  const handleAssignBadge = async (badgeId) => {
    if (assigningBadge) return;
    setAssigningBadge(true);
    try {
      const res = await api.badges.assign(badgeId, activeArtworkId);
      if (res.status === "assigned") {
        const badge = lecturerBadges.find(b => b.id === badgeId);
        if (badge) {
          setArt(prev => ({ ...prev, badges: [...(prev.badges || []), badge] }));
        }
      } else {
        setArt(prev => ({ ...prev, badges: (prev.badges || []).filter(b => b.id !== badgeId) }));
      }
    } catch (e) {
      alert("Error assigning badge: " + e.message);
    }
    setAssigningBadge(false);
  };

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUserId) {
      alert(t("loginToComment"));
      return;
    }
    setSendingComment(true);
    try {
      const payload = {
        content: commentText.trim(),
        positionX: pendingComment ? pendingComment.x : null,
        positionY: pendingComment ? pendingComment.y : null,
        targetImageIndex: pendingComment ? pendingComment.index : null
      };
      const resData = await api.artworks.comments.create(activeArtworkId, payload);
      const rawComment = resData.comment || resData;
      const newComment = {
        id: rawComment.id || rawComment.Id,
        content: rawComment.content || rawComment.Content,
        positionX: rawComment.positionX ?? rawComment.PositionX,
        positionY: rawComment.positionY ?? rawComment.PositionY,
        targetImageIndex: rawComment.targetImageIndex ?? rawComment.TargetImageIndex,
        createdAt: rawComment.createdAt || rawComment.CreatedAt || new Date().toISOString(),
        user: rawComment.user || rawComment.User || { fullName: authUser?.fullName || "User", avatarUrl: authUser?.image || authUser?.avatarUrl || "" }
      };
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
      setPendingComment(null);
      setActionSuccessToast("Bình luận thành công!");
      setTimeout(() => setActionSuccessToast(""), 3000);
    } catch (e) {
      alert(t("commentError") + (e?.message || t("pleaseTryAgain")));
    }
    setSendingComment(false);
    setSendingComment(false);
  };

  const handleUpdateCommentPos = async (commentId, newX, newY) => {
    try {
      await api.artworks.comments.update(activeArtworkId, commentId, { positionX: newX, positionY: newY });
      setComments(prev => prev.map(c => {
        if ((c.id || c.Id) === commentId) {
          return { ...c, positionX: newX, positionY: newY };
        }
        return c;
      }));
    } catch (e) {
      console.error("Failed to update comment position", e);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Bạn có chắc muốn xóa nhận xét này?")) return;
    try {
      await api.artworks.comments.delete(activeArtworkId, commentId);
      setComments(prev => prev.filter(c => (c.id || c.Id) !== commentId));
      setActiveCommentId(null);
    } catch (e) {
      alert("Không thể xóa nhận xét. Lỗi: " + e?.message);
    }
  };

  const handleSaveGrade = async () => {
    if (!canGrade) return;
    const scoreStr = String(gradeScore).replace(',', '.');
    const scoreVal = parseFloat(scoreStr);
    
    if (!gradeScore || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      alert("Vui lòng nhập điểm hợp lệ từ 0 đến 10 (ví dụ: 8 hoặc 8.5)");
      return;
    }

    setSavingGrade(true);
    try {
      const result = await api.artworks.grade(activeArtworkId, {
        score: scoreVal,
        comment: gradeComment || null,
        isVisibleToStudent: gradeIsVisible
      });
      setExistingGrade(result);
      setActionSuccessToast("Cập nhật điểm thành công!");
      setTimeout(() => setActionSuccessToast(""), 3000);
    } catch (e) {
      if (String(activeArtworkId).length < 5) {
        // Fallback cho dữ liệu mẫu mock
        setExistingGrade({ 
          score: scoreVal, 
          comment: gradeComment,
          lecturer: { fullName: authUser?.fullName, email: authUser?.email }
        });
        setActionSuccessToast("Cập nhật điểm thành công (Dữ liệu mẫu)!");
        setTimeout(() => setActionSuccessToast(""), 3000);
      } else {
        alert((t("gradeError") || "Lỗi chấm điểm: ") + " " + (e?.message || t("pleaseTryAgain")));
      }
    }
    setSavingGrade(false);
  };

  const allImages = [art.coverImageUrl, ...(art.fileUrls || [])].filter(Boolean);
  const allImagesDeduped = [...new Set(allImages)];
  const activeImage = allImagesDeduped[activeImageIdx] || allImagesDeduped[0] || art.coverImageUrl;
  
  const parsedBlocks = art.blocksJson ? (typeof art.blocksJson === 'string' ? JSON.parse(art.blocksJson) : art.blocksJson) : [];

  const semesterMeta = {
    HK1: { label: "Năm 1", icon: <Rocket size={12} /> },
    HK2: { label: "Năm 2", icon: <BookOpen size={12} /> },
    HK3: { label: "Năm 3", icon: <GraduationCap size={12} /> },
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const dStr = (!dateStr.endsWith('Z') && !dateStr.includes('+')) ? dateStr + 'Z' : dateStr;
    const diff = Date.now() - new Date(dStr).getTime();
    const mins = Math.floor(diff / 60000);
if (mins < 1) return t("justNow");
      if (mins < 60) return t("minutesAgo").replace("{mins}", mins);
    const hours = Math.floor(mins / 60);
    if (hours < 24) return t("hoursAgo").replace("{hours}", hours);
    const days = Math.floor(hours / 24);
    if (days < 7) return t("daysAgo").replace("{days}", days);
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  const drawWatermarkedImage = async (imgUrl, fmt = "png") => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = imgUrl; });
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    const wmText = art.watermarkText || "UEF";
    const wmSize = Math.max(Math.min(canvas.width, canvas.height) * 0.04, 14);
    ctx.font = `bold ${wmSize}px sans-serif`;
    ctx.textAlign = "right";
    ctx.textBaseline = "bottom";
    const tw = ctx.measureText(wmText).width;
    const pad = 20;
    const bx = canvas.width - pad;
    const by = canvas.height - pad;
    const bh = wmSize * 1.8;
    ctx.fillStyle = "rgba(0,0,0,0.6)";
    ctx.beginPath();
    ctx.roundRect(bx - tw - pad, by - bh, tw + pad, bh, 6);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.fillText(wmText, bx, by - bh / 2 + wmSize * 0.35);
    const mime = fmt === "jpg" ? "image/jpeg" : "image/png";
    const blob = await new Promise(res => canvas.toBlob(b => res(b), mime, fmt === "jpg" ? 0.92 : undefined));
    return { blob, width: canvas.width, height: canvas.height };
  };

  const getPdfBlob = async ({ blob, width, height }) => {
    const imgBytes = new Uint8Array(await blob.arrayBuffer());
    const pw = 595, ph = 842;
    const scale = Math.min(pw / width, ph / height) * 0.95;
    const iw = Math.round(width * scale), ih = Math.round(height * scale);
    const pdf = [
      `%PDF-1.4\n`,
      `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n`,
      `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n`,
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${pw} ${ph}]/Contents 4 0 R/Resources<</XObject<</Im0 5 0 R>>>>>>endobj\n`,
      `4 0 obj<</Length ${40 + iw + ih}>>stream\nq ${iw} 0 0 ${ih} ${(pw - iw) / 2} ${(ph - ih) / 2} cm /Im0 Do Q\nendstream\nendobj\n`,
      `5 0 obj<</Type/XObject/Subtype/Image/Width ${width}/Height ${height}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${imgBytes.length}>>stream\n`,
    ];
    const offsets = [0];
    const enc = new TextEncoder();
    const all = [];
    for (let i = 0; i < pdf.length; i++) {
      const b = enc.encode(pdf[i]);
      all.push(b);
      offsets.push(offsets[i] + b.length);
    }
    all.push(imgBytes);
    offsets.push(offsets[offsets.length - 1] + imgBytes.length);
    const last = enc.encode(`\nendstream\nendobj\nxref\n0 7\n0000000000 65535 f \n${offsets.slice(0, 6).map((o, i) => `${String(o).padStart(10, "0")} 00000 n`).join("\n")}\ntrailer<</Size 7/Root 1 0 R>>\nstartxref\n${offsets[6]}\n%%EOF\n`);
    all.push(last);
    return new Blob(all, { type: "application/pdf" });
  };

  const handleDownload = async (fmt) => {
    setDownloading(true);
    setShowDownloadModal(false);
    try {
      const images = allImagesDeduped.length > 0 ? allImagesDeduped : [art.coverImageUrl];
      const isPdf = fmt === "pdf";
      for (let i = 0; i < images.length; i++) {
        const result = await drawWatermarkedImage(images[i], isPdf ? "jpg" : fmt);
        const baseName = `${art.title || "artwork"}${images.length > 1 ? `_${i + 1}` : ""}`;
        if (isPdf) {
          const pdfBlob = await getPdfBlob(result);
          saveAs(pdfBlob, `${baseName}.pdf`);
        } else {
          saveAs(result.blob, `${baseName}.${fmt}`);
        }
      }
    } catch (e) { console.error("Download error:", e); alert(t("downloadError")); }
    setDownloading(false);
  };

  const seasonNames = { HK1: "Mùa 1", HK2: "Mùa 2", HK3: "Mùa 3" };

  if (loadError) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, minHeight: "100vh", background: "#fff" }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ShieldAlert size={28} color={CRIMSON} />
        </div>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: BLACK, margin: 0 }}>{t("cannotLoadArtwork")}</h2>
        <p style={{ fontSize: 14, color: MUTED, margin: 0, maxWidth: 400, textAlign: "center" }}>{t("artworkNotFound")}</p>
        <button onClick={() => setPage("gallery")} style={{ background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToGallery")}</button>
      </div>
    );
  }

  if (loading) return <GlobalLoading />;

  const isAuthor = authUser?.id === art?.userId || authUser?.id === art?.user?.id || (authUser?.role === "student" && art?.user?.fullName === authUser?.fullName);
  const canSeeGrade = isAuthor || canGrade;

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: -1, pointerEvents: "none" }} />
      {actionSuccessToast && (
        <div style={{ position: "fixed", bottom: 40, right: 40, background: "#4CAF50", color: "#fff", padding: "16px 24px", borderRadius: 12, zIndex: 10000, fontWeight: "bold", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 12 }}>
          <Check size={20} />
          {actionSuccessToast}
        </div>
      )}
      {/* Nút Đóng (Close) */}
      <button onClick={() => setPage("gallery")} style={{ position: "fixed", top: 20, right: 24, zIndex: 1010, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
        <X size={24} />
      </button>

      <style>{`
        @keyframes followCheck {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>

      <div style={{ display: "flex", width: "100%", justifyContent: "center", position: "relative", minHeight: "100vh" }}>
        
        {/* Nút Prev / Next dạng cố định 2 bên */}
        <div style={{ position: "fixed", bottom: 40, left: 0, width: "calc(50vw - min(50vw - 100px, 700px))", zIndex: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none", boxShadow: "none", filter: "none", background: "transparent" }}>
          <button onClick={() => setPage("gallery")} style={{ pointerEvents: "auto", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "none", outline: "none", filter: "none" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
            <ChevronLeft size={20} />
          </button>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none", WebkitTextStroke: "0px", filter: "none", outline: "none" }}>Previous</span>
        </div>

        <div style={{ position: "fixed", bottom: 40, right: 0, width: "calc(50vw - min(50vw - 100px, 700px))", zIndex: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none", boxShadow: "none", filter: "none", background: "transparent" }}>
          <button onClick={() => setPage("gallery")} style={{ pointerEvents: "auto", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "none", outline: "none", filter: "none" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
            <ChevronRight size={20} />
          </button>
          <span style={{ fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none", WebkitTextStroke: "0px", filter: "none", outline: "none" }}>Next</span>
        </div>

        {/* CỘT CHÍNH (Nội dung) */}
        <div style={{ width: "calc(100% - 200px)", maxWidth: 1400, display: "flex", flexDirection: "column", background: "#151515", margin: "0 auto", paddingBottom: 60 }}>
          
          {/* BEHANCE HEADER */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#191919", color: "#fff", width: "100%", zIndex: 50, position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <img onClick={() => { if(art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug }); else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId }); }} src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #333" }} />
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontSize: 16, fontWeight: "bold", color: "#fff" }}>{art.title}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#bbb" }}>
                  <span onClick={() => { if(art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug }); else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId }); }} style={{ cursor: "pointer", color: "#fff", fontWeight: 500 }}>{art.user?.fullName}</span>
                  <span style={{ background: "#0057ff", color: "#fff", fontSize: 9, padding: "2px 4px", borderRadius: 4, fontWeight: "bold" }}>PRO</span>
                  <span>•</span>
                  <span onClick={() => {
                    if (!isFollowing) {
                      setIsFollowing(true);
                      setIsFollowingAnimPlaying(true);
                      setTimeout(() => setIsFollowingAnimPlaying(false), 2500);
                    } else {
                      setIsFollowing(false);
                      setIsFollowingAnimPlaying(false);
                    }
                  }} style={{ color: isFollowing ? "#bbb" : "#0057ff", fontWeight: "bold", cursor: "pointer", transition: "color 0.2s" }}>
                    {isFollowing ? "Following" : "Follow"}
                  </span>
                </div>
              </div>
            </div>

            {/* HEADER RIGHT SIDE (Badges & Actions) */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, paddingRight: (art.badges && art.badges.length > 0) ? 48 : 0 }}>
              {(() => {
                const lecturerComments = comments?.filter(c => c.positionX != null && (c.user?.id || c.user?.Id) !== art.user?.id) || [];
                const uniqueLecturers = [];
                lecturerComments.forEach(c => {
                  const u = c.user || c.User;
                  if (u && !uniqueLecturers.find(l => (l.id || l.Id) === (u.id || u.Id))) {
                    uniqueLecturers.push(u);
                  }
                });
                return (
                  <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                    {currentUserId === art.user?.id && uniqueLecturers.length > 0 && (
                      <div style={{ position: "relative" }}>
                        <button 
                          onClick={() => setShowLecturerFilter(!showLecturerFilter)}
                          style={{ padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" }}
                          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
                          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
                        >
                          <User size={14} color="#aaa" />
                          {filterLecturerId ? uniqueLecturers.find(l => (l.id || l.Id) === filterLecturerId)?.fullName || uniqueLecturers.find(l => (l.id || l.Id) === filterLecturerId)?.FullName || "Giảng viên" : "Tất cả nhận xét"}
                          <ChevronDown size={14} color="#aaa" />
                        </button>
                        {showLecturerFilter && (
                          <div style={{ position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", width: 220, zIndex: 1000, overflow: "hidden", border: "1px solid #eee", display: "flex", flexDirection: "column" }}>
                            <div 
                              onClick={() => { setFilterLecturerId(""); setShowLecturerFilter(false); }}
                              style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, background: filterLecturerId === "" ? "#f0f4ff" : "#fff", color: filterLecturerId === "" ? CERULEAN : "#333", fontWeight: filterLecturerId === "" ? 600 : 400, borderBottom: "1px solid #eee", transition: "0.2s", display: "flex", alignItems: "center", gap: 8 }}
                              onMouseEnter={e => e.currentTarget.style.background = filterLecturerId === "" ? "#f0f4ff" : "#f9f9f9"}
                              onMouseLeave={e => e.currentTarget.style.background = filterLecturerId === "" ? "#f0f4ff" : "#fff"}
                            >
                              {filterLecturerId === "" && <Check size={14} color={CERULEAN} />}
                              <span style={{ marginLeft: filterLecturerId === "" ? 0 : 22 }}>Tất cả nhận xét</span>
                            </div>
                            {uniqueLecturers.map(l => {
                              const id = l.id || l.Id;
                              const isSelected = filterLecturerId === id;
                              return (
                                <div 
                                  key={id}
                                  onClick={() => { setFilterLecturerId(id); setShowLecturerFilter(false); }}
                                  style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, background: isSelected ? "#f0f4ff" : "#fff", color: isSelected ? CERULEAN : "#333", fontWeight: isSelected ? 600 : 400, borderBottom: "1px solid #eee", transition: "0.2s", display: "flex", alignItems: "center", gap: 8 }}
                                  onMouseEnter={e => e.currentTarget.style.background = isSelected ? "#f0f4ff" : "#f9f9f9"}
                                  onMouseLeave={e => e.currentTarget.style.background = isSelected ? "#f0f4ff" : "#fff"}
                                >
                                  {isSelected && <Check size={14} color={CERULEAN} />}
                                  <span style={{ marginLeft: isSelected ? 0 : 22 }}>{l.fullName || l.FullName}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    )}
                    <button 
                      onClick={handleShare}
                      style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" }}
                      onMouseEnter={e => e.currentTarget.style.background="rgba(255,255,255,0.2)"}
                      onMouseLeave={e => e.currentTarget.style.background="rgba(255,255,255,0.1)"}
                    >
                      <Link size={14} /> Share
                    </button>
                    {(!art.tags?.includes("EBOOK") && !art.tags?.includes("EBOOK_LANDSCAPE")) && (currentUserRole === "lecturer" || currentUserRole === "admin" || currentUserId === art.user?.id) && (
                      <button 
                        onClick={() => {
                          setPinpointMode(!pinpointMode);
                          if (pinpointMode) setPendingComment(null);
                        }} 
                        style={{ background: pinpointMode ? CERULEAN : "rgba(255,255,255,0.1)", color: "#fff", border: pinpointMode ? "none" : "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" }}
                        onMouseEnter={e => { if (!pinpointMode) e.currentTarget.style.background="rgba(255,255,255,0.2)" }}
                        onMouseLeave={e => { if (!pinpointMode) e.currentTarget.style.background="rgba(255,255,255,0.1)" }}
                      >
                        {currentUserRole === "lecturer" || currentUserRole === "admin" ? (
                           <><MapPin size={14} /> {pinpointMode ? "Tắt Pinpoint Comment" : "Bật Pinpoint Comment"}</>
                        ) : (
                           <><Eye size={14} /> {pinpointMode ? "Ẩn nhận xét" : "Hiện nhận xét"}</>
                        )}
                      </button>
                    )}
                  </div>
                );
              })()}
              
              {(art.badges && art.badges.length > 0) && (
                <div className="group" style={{ position: "absolute", top: 0, right: 24, zIndex: 60, cursor: "pointer" }}>
                   <div style={{ width: 36, height: 48, background: art.badges[0].colorCode || "#B49A65", color: art.badges[0].textColor || "#fff", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)", display: "flex", justifyContent: "center", paddingTop: 10, fontWeight: "bold", fontSize: 14 }}>
                      {art.badges[0].name?.substring(0, 2).toUpperCase() || "GR"}
                   </div>
                   <div className="absolute top-full mt-2 bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none" style={{ borderRadius: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.2)", right: -10 }}>
                      <div style={{ position: "absolute", bottom: "100%", right: 22, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderBottom: "6px solid #fff" }} />
                      <div style={{ fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 4, textTransform: "uppercase" }}>FEATURED IN</div>
                      <div style={{ fontSize: 13, fontWeight: "bold", color: "#0057ff" }}>
                        {art.badges[0].name} <span style={{ color: "#aaa", fontWeight: "normal" }}>— {new Date(art.badges[0].assignedAt || art.createdAt).toLocaleDateString('en-GB')}</span>
                      </div>
                   </div>
                </div>
              )}
            </div>
          </div>
          
          {/* CÁC ẢNH HOẶC E-BOOK */}
          <div style={{ display: "flex", flexDirection: "column", width: "100%", background: (art.isEbook || art.tags?.includes("IS_EBOOK")) ? "#F0F2F5" : "transparent" }}>
            {(art.isEbook || art.tags?.includes("IS_EBOOK")) ? (
              isReadingEbook ? (
                <div ref={ebookViewerRef} style={{ width: "100%", padding: "40px 0", display: "flex", justifyContent: "center", position: "relative", background: "#F0F2F5" }}>
                  <button onClick={(e) => { e.stopPropagation(); setIsReadingEbook(false); }} style={{ position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}>
                    <X size={20} />
                  </button>
                  <HTMLFlipBook 
                    width={readerOrientation === 'landscape' ? 560 : 400} 
                    height={readerOrientation === 'landscape' ? 400 : 560} 
                    size="stretch"
                    minWidth={315}
                    maxWidth={1000}
                    minHeight={400}
                    maxHeight={1533}
                    maxShadowOpacity={0.5}
                    showCover={true}
                    mobileScrollSupport={true}
                    className="shadow-2xl mx-auto"
                  >
                    {allImagesDeduped.map((img, index) => (
                      <div key={index} className="demoPage bg-white overflow-hidden border border-gray-200">
                        <img src={img.imageUrl || img} alt={`Page ${index + 1}`} className="w-full h-full object-contain pointer-events-none" style={{ width: "100%", height: "100%", display: "block" }} />
                      </div>
                    ))}
                  </HTMLFlipBook>
                  
                  <button onClick={toggleEbookFullscreen} style={{ position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13, zIndex: 10, transition: "0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}>
                    <Maximize2 size={16} /> Toàn màn hình
                  </button>
                  <button onClick={() => setReaderOrientation(prev => prev === 'portrait' ? 'landscape' : 'portrait')} style={{ position: "absolute", top: 20, left: 180, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13, zIndex: 10, transition: "0.2s" }} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}>
                    Chuyển hướng {readerOrientation === 'portrait' ? 'Ngang' : 'Dọc'}
                  </button>
                  
                  <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", color: "white", padding: "10px 24px", borderRadius: 30, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", pointerEvents: "none", zIndex: 10 }}>
                    <span style={{ display: "flex", width: 8, height: 8, position: "relative" }}>
                      <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", opacity: 0.75 }}></span>
                      <span style={{ position: "relative", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8" }}></span>
                    </span>
                    Kéo mép giấy hoặc click vào góc để lật trang
                  </div>
                </div>
              ) : (
                <div style={{ width: "100%", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", background: "#F0F2F5", cursor: "pointer" }} onClick={() => { setIsReadingEbook(true); setReaderOrientation(art.tags?.includes("EBOOK_LANDSCAPE") ? 'landscape' : 'portrait'); }}>
                  <div style={{ position: "relative" }}>
                    <img src={art.coverImageUrl} style={{ maxWidth: "80%", maxHeight: "70vh", objectFit: "contain", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", borderRadius: 4 }} alt="Ebook Cover" />
                    <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", borderRadius: 4 }}>
                       <button style={{ background: "#1a4ba8", color: "white", padding: "16px 32px", borderRadius: 30, display: "flex", gap: 10, alignItems: "center", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", pointerEvents: "none" }}>
                         <BookOpen size={24} /> Đọc E-book
                       </button>
                    </div>
                  </div>
                </div>
              )
            ) : (
              <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
                {/* Toolbar moved to header */}
                {allImagesDeduped.map((img, i) => {
                  if (!img) return null;
                  const imageComments = comments?.filter(c => c.targetImageIndex === i && c.positionX != null) || [];
                  return (
                    <div key={i} style={{ width: "100%", position: "relative" }} onMouseEnter={e => {
                      const overlay = e.currentTarget.querySelector('.img-hover-actions');
                      if(overlay) overlay.style.opacity = 1;
                    }} onMouseLeave={e => {
                      const overlay = e.currentTarget.querySelector('.img-hover-actions');
                      if(overlay) overlay.style.opacity = 0;
                    }}>
                      <img 
                        src={img} 
                        style={{ width: "100%", display: "block", cursor: (pinpointMode && (currentUserRole === "lecturer" || currentUserRole === "admin")) ? "crosshair" : "default" }} 
                        alt="" 
                        onClick={(e) => {
                          if (!pinpointMode || (currentUserRole !== "lecturer" && currentUserRole !== "admin")) return;
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = ((e.clientX - rect.left) / rect.width) * 100;
                          const y = ((e.clientY - rect.top) / rect.height) * 100;
                          setPendingComment({ x, y, index: i });
                        }}
                      />
                      
                      {/* Markers */}
                      {pinpointMode && imageComments.map((c, idx) => {
                        const uid = c.user?.id || c.User?.Id || c.userId;
                        if (filterLecturerId && uid !== filterLecturerId && uid !== art.user?.id) return null;
                        const isMine = uid === currentUserId;
                        const cId = c.id || c.Id;
                        const isActive = activeCommentId === cId;
                        return (
                          <div 
                            key={cId || idx} 
                            style={{ position: "absolute", left: `${c.positionX ?? c.PositionX}%`, top: `${c.positionY ?? c.PositionY}%`, zIndex: isActive ? 100 : 10 }}
                          >
                            <div 
                              onPointerDown={e => {
                                e.currentTarget.setPointerCapture(e.pointerId);
                                e.currentTarget.dataset.startX = e.clientX;
                                e.currentTarget.dataset.startY = e.clientY;
                                e.currentTarget.dataset.isDragging = "false";
                                if (isMine) setDraggingCommentId(cId);
                              }}
                              onPointerMove={e => {
                                if (e.currentTarget.hasPointerCapture(e.pointerId) && isMine) {
                                  const dx = Math.abs(e.clientX - parseFloat(e.currentTarget.dataset.startX));
                                  const dy = Math.abs(e.clientY - parseFloat(e.currentTarget.dataset.startY));
                                  if (dx > 3 || dy > 3) {
                                    e.currentTarget.dataset.isDragging = "true";
                                    const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                                    const newX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                                    const newY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                                    e.currentTarget.parentElement.style.left = `${newX}%`;
                                    e.currentTarget.parentElement.style.top = `${newY}%`;
                                    e.currentTarget.parentElement.dataset.newX = newX;
                                    e.currentTarget.parentElement.dataset.newY = newY;
                                  }
                                }
                              }}
                              onPointerUp={e => {
                                e.currentTarget.releasePointerCapture(e.pointerId);
                                setDraggingCommentId(null);
                                if (e.currentTarget.dataset.isDragging === "true") {
                                  e.currentTarget.dataset.isDragging = "false";
                                  const parent = e.currentTarget.parentElement;
                                  if (parent.dataset.newX && parent.dataset.newY) {
                                    handleUpdateCommentPos(cId, parseFloat(parent.dataset.newX), parseFloat(parent.dataset.newY));
                                  }
                                } else {
                                  setActiveCommentId(isActive ? null : cId);
                                }
                              }}
                              style={{ width: 24, height: 24, background: isActive ? "#000" : CRIMSON, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", cursor: isMine ? "grab" : "pointer", userSelect: "none", touchAction: "none" }} 
                              title={!isActive ? "Nhấn để xem" : ""}
                            >
                              {idx + 1}
                            </div>
                            
                            {/* Popover content */}
                            {isActive && (
                              <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8, cursor: "default" }} onClick={e => e.stopPropagation()}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                  <img src={c.user?.avatarUrl || c.User?.AvatarUrl || "https://ui-avatars.com/api/?name=User"} style={{ width: 24, height: 24, borderRadius: "50%" }} alt="" />
                                  <span style={{ fontSize: 13, fontWeight: "bold", color: "#333" }}>{c.user?.fullName || c.User?.FullName}</span>
                                </div>
                                <div style={{ fontSize: 14, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                  {c.content || c.Content}
                                </div>
                                {isMine && (
                                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                                    <button onClick={() => handleDeleteComment(cId)} style={{ padding: "4px 8px", background: "#fee", color: "#e53e3e", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: "bold" }}>Xóa</button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Pending Marker Popover */}
                      {pendingComment && pendingComment.index === i && (
                        <div style={{ position: "absolute", left: `${pendingComment.x}%`, top: `${pendingComment.y}%`, zIndex: 100 }}>
                          <div style={{ width: 24, height: 24, background: CERULEAN, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 0 0 4px rgba(26,75,168,0.3)", animation: "pulse 1.5s infinite" }}>
                            +
                          </div>
                          <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8 }} onClick={e => e.stopPropagation()}>
                            <textarea 
                               autoFocus 
                               placeholder="Thêm nhận xét..." 
                               value={commentText} 
                               onChange={e => setCommentText(e.target.value)} 
                               style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }}
                            />
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                               <button onClick={() => {setPendingComment(null); setCommentText("");}} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Hủy</button>
                               <button onClick={handleSendComment} style={{ padding: "6px 12px", background: CERULEAN, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Gửi</button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Ảnh Hover Actions */}
                      <div className="img-hover-actions" style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 12, opacity: 0, transition: "opacity 0.2s" }}>
                        <button 
                          onClick={() => { 
                            if (onBookmarkClick) {
                              const singleImgArt = { ...art, id: `${art.id}_img_${i}`, title: `${art.title} - Hình ${i+1}`, coverImageUrl: img, images: [img] };
                              onBookmarkClick(singleImgArt);
                            }
                          }} 
                          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "#ffeb3b" : "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }} 
                          onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} 
                          onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}
                        >
                          <Bookmark size={16} fill={isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "#ffeb3b" : "none"} /> 
                          {isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "Đã lưu" : "Lưu Moodboard"}
                        </button>
                        <button onClick={() => { setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId }); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}><Briefcase size={16} /> More Like This</button>
                        <button onClick={() => setShowDownloadModal(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}><Download size={16} /> Download</button>
                        <button onClick={() => handleShare()} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }} onMouseEnter={e=>e.currentTarget.style.background="rgba(0,0,0,0.8)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(0,0,0,0.6)"}><Link size={16} /> Permalink</button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Render Blocks */}
            {parsedBlocks && parsedBlocks.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 32, padding: "40px 60px", background: "#fff" }}>
                    {parsedBlocks.map((block, i) => (
                      <div key={block.id || i} style={{ width: "100%" }}>
                        {block.type === "text" && (
                          <div style={{ fontSize: 16, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap" }}>{block.content}</div>
                        )}
                        {/* Removed duplicate ugly color block */}
                        {block.type === "typography" && block.data?.fontName && (
                          <div style={{ padding: 48, border: "1px solid #eee", borderRadius: 16, textAlign: "center", background: "#f8fafc", margin: "32px 0", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)" }}>
                            <link href={`https://fonts.googleapis.com/css2?family=${block.data.fontName.replace(/ /g, '+')}:wght@400;700&display=swap`} rel="stylesheet" />
                            <h1 style={{ fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 100, margin: "0 0 16px 0", color: "#1e293b", lineHeight: 1 }}>Aa</h1>
                            <p style={{ fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 28, fontWeight: "bold", margin: "0 0 12px 0", color: "#334155" }}>{block.data.fontName}</p>
                            <p style={{ fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 18, color: "#64748b", margin: 0, letterSpacing: 3 }}>A B C D E F G H I J K L M N O P Q R S T U V W X Y Z</p>
                            <p style={{ fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 18, color: "#64748b", margin: "12px 0 0 0", letterSpacing: 4 }}>0 1 2 3 4 5 6 7 8 9</p>
                          </div>
                        )}
                        {block.type === "image" && block.data?.url && (() => {
                          const imageIndex = 1000 + i;
                          const imageComments = comments?.filter(c => c.targetImageIndex === imageIndex && c.positionX != null) || [];
                          return (
                            <div style={{ width: "100%", position: "relative" }}>
                              <img 
                                src={block.data.url} 
                                style={{ width: "100%", borderRadius: 8, display: "block", cursor: (pinpointMode && (currentUserRole === "lecturer" || currentUserRole === "admin")) ? "crosshair" : "default" }} 
                                alt="" 
                                onClick={(e) => {
                                  if (!pinpointMode || (currentUserRole !== "lecturer" && currentUserRole !== "admin")) return;
                                  const rect = e.currentTarget.getBoundingClientRect();
                                  const x = ((e.clientX - rect.left) / rect.width) * 100;
                                  const y = ((e.clientY - rect.top) / rect.height) * 100;
                                  setPendingComment({ x, y, index: imageIndex });
                                }}
                              />
                              {pinpointMode && imageComments.map((c, idx) => {
                                const uid = c.user?.id || c.User?.Id || c.userId;
                                if (filterLecturerId && uid !== filterLecturerId && uid !== art.user?.id) return null;
                                const isMine = uid === currentUserId;
                                const cId = c.id || c.Id;
                                const isActive = activeCommentId === cId;
                                return (
                                  <div 
                                    key={cId || idx} 
                                    style={{ position: "absolute", left: `${c.positionX ?? c.PositionX}%`, top: `${c.positionY ?? c.PositionY}%`, zIndex: isActive ? 100 : 10 }}
                                  >
                                    <div 
                                      onPointerDown={e => {
                                        e.currentTarget.setPointerCapture(e.pointerId);
                                        e.currentTarget.dataset.startX = e.clientX;
                                        e.currentTarget.dataset.startY = e.clientY;
                                        e.currentTarget.dataset.isDragging = "false";
                                        if (isMine) setDraggingCommentId(cId);
                                      }}
                                      onPointerMove={e => {
                                        if (e.currentTarget.hasPointerCapture(e.pointerId) && isMine) {
                                          const dx = Math.abs(e.clientX - parseFloat(e.currentTarget.dataset.startX));
                                          const dy = Math.abs(e.clientY - parseFloat(e.currentTarget.dataset.startY));
                                          if (dx > 3 || dy > 3) {
                                            e.currentTarget.dataset.isDragging = "true";
                                            const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                                            const newX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                                            const newY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                                            e.currentTarget.parentElement.style.left = `${newX}%`;
                                            e.currentTarget.parentElement.style.top = `${newY}%`;
                                            e.currentTarget.parentElement.dataset.newX = newX;
                                            e.currentTarget.parentElement.dataset.newY = newY;
                                          }
                                        }
                                      }}
                                      onPointerUp={e => {
                                        e.currentTarget.releasePointerCapture(e.pointerId);
                                        setDraggingCommentId(null);
                                        if (e.currentTarget.dataset.isDragging === "true") {
                                          e.currentTarget.dataset.isDragging = "false";
                                          const parent = e.currentTarget.parentElement;
                                          if (parent.dataset.newX && parent.dataset.newY) {
                                            handleUpdateCommentPos(cId, parseFloat(parent.dataset.newX), parseFloat(parent.dataset.newY));
                                          }
                                        } else {
                                          setActiveCommentId(isActive ? null : cId);
                                        }
                                      }}
                                      style={{ width: 24, height: 24, background: isActive ? "#000" : CRIMSON, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", cursor: isMine ? "grab" : "pointer", userSelect: "none", touchAction: "none" }} 
                                      title={!isActive ? "Nhấn để xem" : ""}
                                    >
                                      {idx + 1}
                                    </div>
                                    
                                    {/* Popover content */}
                                    {isActive && (
                                      <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8, cursor: "default" }} onClick={e => e.stopPropagation()}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                                          <img src={c.user?.avatarUrl || c.User?.AvatarUrl || "https://ui-avatars.com/api/?name=User"} style={{ width: 24, height: 24, borderRadius: "50%" }} alt="" />
                                          <span style={{ fontSize: 13, fontWeight: "bold", color: "#333" }}>{c.user?.fullName || c.User?.FullName}</span>
                                        </div>
                                        <div style={{ fontSize: 14, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                                          {c.content || c.Content}
                                        </div>
                                        {isMine && (
                                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                                            <button onClick={() => handleDeleteComment(cId)} style={{ padding: "4px 8px", background: "#fee", color: "#e53e3e", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: "bold" }}>Xóa</button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                              {pendingComment && pendingComment.index === imageIndex && (
                                <div style={{ position: "absolute", left: `${pendingComment.x}%`, top: `${pendingComment.y}%`, zIndex: 100 }}>
                                  <div style={{ width: 24, height: 24, background: CERULEAN, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 0 0 4px rgba(26,75,168,0.3)", animation: "pulse 1.5s infinite" }}>
                                    +
                                  </div>
                                  <div style={{ position: "absolute", top: 16, left: 16, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8 }} onClick={e => e.stopPropagation()}>
                                    <textarea 
                                       autoFocus 
                                       placeholder="Thêm nhận xét..." 
                                       value={commentText} 
                                       onChange={e => setCommentText(e.target.value)} 
                                       style={{ width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }}
                                    />
                                    <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
                                       <button onClick={() => {setPendingComment(null); setCommentText("");}} style={{ padding: "6px 12px", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Hủy</button>
                                       <button onClick={handleSendComment} style={{ padding: "6px 12px", background: CERULEAN, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 }}>Gửi</button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                        {block.type === "color" && block.data?.colors && (
                          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", padding: "32px 0" }}>
                            {block.data.colors.map((c, idx) => (
                              <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                <div style={{ width: 80, height: 80, borderRadius: "50%", background: c, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}></div>
                                <span style={{ fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{c}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        {/* Removed duplicate ugly typography block */}
                      </div>
                    ))}
                  </div>
                )}

          {/* KHU VỰC THÔNG SỐ ẤN PHẨM (Nền đen) */}
          <div style={{ background: "#111111", padding: "60px 40px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" }}>
            
            <button onClick={handleLike} style={{ width: 80, height: 80, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", marginBottom: 32, transition: "transform 0.2s", transform: animatingLike ? "scale(1.2)" : "scale(1)" }} onMouseEnter={e=>{if(!animatingLike) e.currentTarget.style.transform="scale(1.05)"}} onMouseLeave={e=>{if(!animatingLike) e.currentTarget.style.transform="scale(1)"}}>
              <ThumbsUp size={36} color="#fff" fill={isLiked ? "#fff" : "none"} />
            </button>

            <h1 style={{ fontSize: 32, fontWeight: "bold", margin: "0 0 16px 0", textAlign: "center" }}>{art.title}</h1>
            
            <div style={{ display: "flex", alignItems: "center", gap: 24, color: "#888", fontSize: 14, marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><ThumbsUp size={16} /> {likeCount || 0}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><Eye size={16} /> {art.viewCount || art._count?.views || 0}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}><MessageCircle size={16} /> {comments?.length || 0}</div>
            </div>

            <p style={{ color: "#888", fontSize: 13, margin: "0 0 16px 0" }}>Published: {new Date(art.createdAt || Date.now()).toLocaleDateString()}</p>

            {art.aiScore != null && (
              <div style={{ 
                background: art.aiScore >= 80 ? "linear-gradient(to right, #1a4ba8, #0ea5e9)" : art.aiScore >= 50 ? "linear-gradient(to right, #facc15, #eab308)" : "linear-gradient(to right, #ef4444, #dc2626)", 
                borderRadius: 6, padding: "6px 14px", display: "flex", alignItems: "center", gap: 6, boxShadow: "0 2px 5px rgba(0,0,0,0.4)", marginBottom: 60 
              }}>
                <ShieldCheck size={16} color={art.aiScore >= 50 && art.aiScore < 80 ? "#111" : "#fff"} />
                <span style={{ color: art.aiScore >= 50 && art.aiScore < 80 ? "#111" : "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px" }}>
                  AI ANALYSIS (Originality: {art.aiScore}%)
                </span>
              </div>
            )}
            {art.aiScore == null && <div style={{ marginBottom: 60 }} />}

            {/* Tác giả & Related Artworks */}
            <div style={{ width: "100%", display: "flex", flexDirection: "column", borderTop: "1px solid #333", paddingTop: 40 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
                <img onClick={() => { if(art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug }); else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId }); }} src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }} />
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <h3 onClick={() => { if(art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug }); else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId }); }} style={{ margin: 0, fontSize: 16, fontWeight: "bold", color: "#fff", cursor: "pointer" }}>{art.user?.fullName}</h3>
                    <span style={{ background: "#0057ff", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>PRO</span>
                  </div>
                  <button onClick={() => setIsFollowing(!isFollowing)} style={{ background: isFollowing ? "rgba(255,255,255,0.2)" : "#0057ff", color: "#fff", border: "none", padding: "6px 20px", borderRadius: 16, fontSize: 12, fontWeight: "bold", marginTop: 8, cursor: "pointer" }}>{isFollowing ? "Following" : "Follow"}</button>
                </div>
              </div>

              {/* Related Artworks Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {relatedArtworks.slice(0,4).map(rArt => (
                  <div key={rArt.id} onClick={() => setPage("detail", { artworkId: rArt.id })} onMouseEnter={e => e.currentTarget.lastChild.style.opacity = 1} onMouseLeave={e => e.currentTarget.lastChild.style.opacity = 0} style={{ cursor: "pointer", borderRadius: 8, overflow: "hidden", background: "#222", position: "relative" }}>
                    <img src={rArt.coverImageUrl} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)", opacity: 0, transition: "opacity 0.3s ease-in-out", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 }}>
                      <span style={{ color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{rArt.title}</span>
                      <div style={{ display: "flex", gap: 12, color: "#ccc", fontSize: 12, fontWeight: "bold" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ThumbsUp size={12} /> {rArt.likes || 0}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={12} /> {rArt.comments?.length || 0}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={12} /> {rArt.viewCount || rArt._count?.views || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Nút Prev / Next nằm ở cuối trang */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 40, borderTop: "1px solid #333", paddingTop: 30 }}>
                <button onClick={() => setPage("gallery")} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                  <ChevronLeft size={20} /> Về thư viện
                </button>
                <button onClick={() => setPage("gallery")} style={{ background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", transition: "all 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}>
                  Xem tiếp <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* KHU VỰC BÌNH LUẬN & THÔNG TIN (2 cột) */}
          <div style={{ display: "flex", background: "#f9f9f9", padding: "60px 40px" }}>
            
            {/* CỘT TRÁI: Bình luận & Chấm điểm */}
            <div style={{ flex: "0 0 65%", paddingRight: 60 }}>
              
              {/* Kết quả Đánh giá */}
              {existingGrade && canSeeGrade && (
                <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderTop: `4px solid ${CRIMSON}`, borderRadius: 8, padding: 32, marginBottom: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #EAEAEA", paddingBottom: 16, marginBottom: 16 }}>
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: MUTED, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px 0" }}>Điểm số đồ án</h3>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                        <span style={{ fontSize: 42, fontWeight: 900, color: CERULEAN, lineHeight: 1 }}>{existingGrade.score}</span>
                        <span style={{ fontSize: 16, color: MUTED, fontWeight: 600 }}>/ 10</span>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <span style={{ display: "inline-block", background: "#f0f4fc", color: CERULEAN, padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 }}>Đã chấm điểm</span>
                      {existingGrade.lecturer && (
                        <div style={{ textAlign: "right" }}>
                          <p style={{ margin: "0 0 2px 0", fontSize: 13, fontWeight: 700, color: BLACK }}>{existingGrade.lecturer.fullName}</p>
                          <p style={{ margin: 0, fontSize: 12, color: MUTED }}>{existingGrade.lecturer.email}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  {existingGrade.comment && (
                    <div>
                      <h4 style={{ fontSize: 13, fontWeight: 700, color: BLACK, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 }}>Nhận xét từ Giảng viên {existingGrade.isVisibleToStudent === false && <span style={{ color: CRIMSON, fontSize: 11 }}>(Kín)</span>}</h4>
                      <p style={{ margin: 0, fontSize: 15, color: "#333", lineHeight: 1.6, fontStyle: "italic" }}>
                        "{existingGrade.comment}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Form chấm điểm (Chỉ GV) - Đưa lên đầu theo phong cách Behance comment */}
              {["lecturer", "admin"].includes(authUser?.role) && (
                <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                  <h3 style={{ fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "#191919", display: "flex", alignItems: "center", gap: 8 }}><PenTool size={18} /> {existingGrade ? t("updateGrade") : t("gradeThisArtwork")}</h3>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <input type="text" value={gradeScore} onChange={e => setGradeScore(e.target.value.replace(/[^0-9.,]/g, ''))} placeholder={t("scoreLabel")} style={{ width: 100, padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", fontSize: 14 }} />
                    <input type="text" value={gradeComment} onChange={e => setGradeComment(e.target.value)} placeholder={t("feedbackOptional")} style={{ flex: 1, padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", fontSize: 14 }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                    <input type="checkbox" id="gradeVisible" checked={gradeIsVisible} onChange={e => setGradeIsVisible(e.target.checked)} style={{ cursor: "pointer" }} />
                    <label htmlFor="gradeVisible" style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}>Cho phép sinh viên xem nhận xét này (Công khai nhận xét)</label>
                  </div>
                  <button onClick={handleSaveGrade} disabled={savingGrade} onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} style={{ background: savingGrade ? "#999" : "#191919", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: savingGrade ? "not-allowed" : "pointer", transition: "transform 0.1s" }}>
                    {savingGrade ? "Đang xử lý..." : t("submitGrade")}
                  </button>
                </div>
              )}

              {/* Bình luận Input */}
              <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, display: "flex", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <img src={authUser?.image || authUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40"} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover" }} />
                <div style={{ flex: 1 }}>
                  {pendingComment && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: "#eef4ff", padding: "8px 12px", borderRadius: 6, color: CERULEAN, fontSize: 13, fontWeight: "bold" }}>
                      <MapPin size={16} />
                      Đang nhận xét tại tọa độ trên Ảnh {pendingComment.index + 1}
                      <button onClick={() => setPendingComment(null)} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: MUTED }}>Huỷ bỏ</button>
                    </div>
                  )}
                  <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="What are your thoughts on this project?" style={{ width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontSize: 14, fontFamily: "inherit" }} />
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
                    <button onClick={handleSendComment} onMouseDown={e => e.currentTarget.style.transform = "scale(0.95)"} onMouseUp={e => e.currentTarget.style.transform = "scale(1)"} onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"} disabled={sendingComment || !commentText.trim()} style={{ background: "#E8E8E8", color: "#666", border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.2s, transform 0.1s", ...(commentText.trim() && { background: "#0057ff", color: "#fff" }) }}>{sendingComment ? "Posting..." : "Post a Comment"}</button>
                  </div>
                </div>
              </div>

              {/* Danh sách bình luận */}
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                {comments?.length === 0 && <p style={{ fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" }}>{t("noComments")}</p>}
                {comments?.map((c, idx) => {
                  let badgeNum = "";
                  if (c.positionX != null && c.targetImageIndex != null) {
                    // find index amongst same image comments to display number
                    const imageComments = comments.filter(x => x.targetImageIndex === c.targetImageIndex && x.positionX != null);
                    badgeNum = imageComments.findIndex(x => x.id === c.id) + 1;
                  }
                  
                  return (
                    <div key={c.id || Math.random()} style={{ display: "flex", gap: 16 }}>
                      <img onClick={() => { setPage("portfolio", { portfolioSlug: c.user?.portfolioSettings?.portfolioSlug || c.user?.id || c.userId }); }} src={c.user?.image || c.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40"} style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }} />
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                          <span onClick={() => { setPage("portfolio", { portfolioSlug: c.user?.portfolioSettings?.portfolioSlug || c.user?.id || c.userId }); }} style={{ fontWeight: "bold", color: "#191919", fontSize: 14, cursor: "pointer", textDecoration: "none" }} onMouseEnter={e=>e.currentTarget.style.textDecoration="underline"} onMouseLeave={e=>e.currentTarget.style.textDecoration="none"}>{c.user?.fullName}</span>
                          <span style={{ fontSize: 12, color: "#888" }}>• {new Date(c.createdAt).toLocaleDateString()}</span>
                          {badgeNum && (
                            <span style={{ background: CRIMSON, color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: "bold" }}>
                              Marker #{badgeNum} on Image {c.targetImageIndex + 1}
                            </span>
                          )}
                          {(authUser?.id === c.userId || authUser?.id === c.user?.id || authUser?.id === art.userId || authUser?.role === "admin") && (
                            <button onClick={() => {
                              if (window.confirm("Bạn có chắc chắn muốn xóa bình luận này?")) {
                                api.artworks.comments.delete(art.id, c.id)
                                  .then(() => setComments(prev => prev.filter(x => x.id !== c.id)))
                                  .catch(err => alert("Lỗi xóa bình luận: " + (err?.message || "")));
                              }
                            }} style={{ background: "transparent", border: "none", color: "#999", cursor: "pointer", padding: "2px 4px", display: "flex", alignItems: "center", transition: "color 0.2s" }} onMouseEnter={e=>e.currentTarget.style.color=CRIMSON} onMouseLeave={e=>e.currentTarget.style.color="#999"} title="Xóa bình luận">
                              <Trash2 size={12} strokeWidth={2} />
                            </button>
                          )}
                        </div>
                        <p style={{ margin: 0, color: "#444", fontSize: 14, lineHeight: 1.6 }}>{c.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CỘT PHẢI: Thông tin Tác giả, Tags, Tools */}
            <div style={{ flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 24 }}>
              
              {/* Owner Card */}
              <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Owner</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <img onClick={() => { setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId }); }} src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60"} style={{ width: 48, height: 48, borderRadius: "50%", objectFit: "cover", cursor: "pointer" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <h3 onClick={() => { setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId }); }} style={{ margin: 0, fontSize: 15, fontWeight: "bold", color: "#191919", cursor: "pointer" }}>{art.user?.fullName}</h3>
                      <span style={{ background: "#0057ff", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" }}>PRO</span>
                    </div>
                    <span style={{ fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 4, marginTop: 4 }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg> Ho Chi Minh City, VN</span>
                  </div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <button onClick={() => setIsFollowing(!isFollowing)} style={{ background: isFollowing ? "#EAEAEA" : "#0057ff", color: isFollowing ? "#333" : "#fff", border: "none", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>{isFollowing ? "Following" : <><div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 }}>+</div> Follow</>}</button>
                  <button onClick={() => setShowOrderModal(true)} style={{ background: "#fff", color: "#0057ff", border: "1px solid #EAEAEA", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Mail size={16} /> Order</button>
                  {(authUser?.role === "lecturer" || authUser?.role === "admin") && (
                    <button onClick={() => setShowFeedbackModal(true)} style={{ background: "#fff", color: "#1a4ba8", border: "1px solid #1a4ba8", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><MessageSquare size={16} /> Feedback kín</button>
                  )}
                </div>
              </div>

              {/* Tags */}
              <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Project Made For</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {art.tags?.map((tStr, i) => {
                    const tL = tStr.toLowerCase();
                    let IconComp = Tag;
                    if (tL.includes('package') || tL.includes('bao bì')) IconComp = Package;
                    else if (tL.includes('illustrator') || tL.includes('photoshop') || tL.includes('design')) IconComp = PenTool;
                    else if (tL.match(/20\d{2}/) || tL.includes('năm') || tL.includes('kỳ')) IconComp = Calendar;
                    else if (tL.includes('đồ án') || tL.includes('project')) IconComp = FileText;
                    return (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "#eef4ff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <IconComp size={14} color="#0057ff" />
                        </div>
                        <span style={{ fontSize: 14, fontWeight: "bold", color: "#191919" }}>{tStr}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Description Card */}
              <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <h3 style={{ fontSize: 16, fontWeight: "bold", margin: "0 0 12px 0", color: "#191919" }}>{art.title}</h3>

                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 }}>
                  {isDescExpanded ? art.description : (art.description?.slice(0, 100) || "") + ((art.description?.length || 0) > 100 ? "..." : "")}
                </p>
                {(art.description?.length || 0) > 100 && (
                  <button onClick={() => setIsDescExpanded(!isDescExpanded)} style={{ background: "none", border: "none", color: "#191919", fontWeight: "bold", padding: 0, cursor: "pointer", fontSize: 14, marginBottom: 24 }}>{isDescExpanded ? "Show Less" : "Read More"}</button>
                )}
                
                <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#888", fontSize: 13, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EAEAEA" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><ThumbsUp size={14} /> {likeCount || 0}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><Eye size={14} /> {art.viewCount || art._count?.views || 0}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}><MessageCircle size={14} /> {comments?.length || 0}</div>
                </div>

                <p style={{ margin: 0, fontSize: 12, color: "#888" }}>Published: {new Date(art.createdAt || Date.now()).toLocaleDateString()}</p>
              </div>

              {/* Tools & Creative Fields */}
              <div style={{ background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" }}>
                <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Tools</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
                  {art.toolsUsed?.map((tool, i) => {
                    const tLower = tool.toLowerCase();
                    let iconBg = "#333", iconColor = "#fff", short = tool.substring(0, 2);
                    let fallbackBg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
                    
                    if (tLower.includes('photoshop')) { iconBg = '#001e36'; iconColor = '#31a8ff'; short = 'Ps'; fallbackBg = "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"; }
                    else if (tLower.includes('illustrator')) { iconBg = '#330000'; iconColor = '#ff9a00'; short = 'Ai'; fallbackBg = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400"; }
                    else if (tLower.includes('indesign')) { iconBg = '#49021f'; iconColor = '#ff3366'; short = 'Id'; fallbackBg = "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400"; }
                    else if (tLower.includes('after effects')) { iconBg = '#00005b'; iconColor = '#9999ff'; short = 'Ae'; fallbackBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400"; }
                    else if (tLower.includes('lightroom')) { iconBg = '#000000'; iconColor = '#31a8ff'; short = 'Lr'; fallbackBg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400"; }
                    else if (tLower.includes('figma')) { iconBg = '#f24e1e'; iconColor = '#fff'; short = 'Fi'; fallbackBg = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400"; }

                    return (
                      <div key={i} style={{ position: "relative", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <img src={toolCovers[tool] || fallbackBg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transform: "scale(1.1)", filter: "brightness(0.8) contrast(1.1)" }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                        <div style={{ position: "relative", zIndex: 1, width: 28, height: 28, background: iconBg, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, fontWeight: "bold", fontSize: 13, border: `1px solid ${iconColor}40` }}>{short}</div>
                        <span style={{ position: "relative", zIndex: 1, color: "#fff", fontWeight: 800, fontSize: 15, textShadow: "0 1px 4px rgba(0,0,0,0.8)", letterSpacing: "0.2px" }}>{tool}</span>
                      </div>
                    );
                  })}
                </div>

                <span style={{ fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" }}>Creative Fields</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {Array.from(new Set([art.category, ...(art.tags || [])])).filter(Boolean).slice(0, 4).map((field, i) => {
                    const fallbackCategories = {
                      'graphic design': 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
                      'creative': 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400',
                      'modern': 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400',
                      'ui/ux': 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
                      'branding': 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400',
                      '3d art': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400',
                      'typography': 'https://images.unsplash.com/photo-1515595967223-f9fa59af5a3b?w=400',
                      'illustration': 'https://images.unsplash.com/photo-1578301978693-85fa9c026109?w=400',
                    };
                    const fallbackImg = fallbackCategories[field.toLowerCase()] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";

                    return (
                      <div key={i} style={{ position: "relative", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <img src={categoryCovers[field] || fallbackImg} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transform: "scale(1.1)", filter: "brightness(0.8) contrast(1.1)" }} />
                        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
                        <span style={{ position: "relative", zIndex: 1, color: "#fff", fontWeight: 900, fontSize: 15, textShadow: "0 2px 8px rgba(0,0,0,0.9)", letterSpacing: "0.5px", textAlign: "center" }}>{field}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </div>

        </div>

        {/* FIXED RIGHT SIDEBAR */}
        <div style={{ position: "fixed", right: 0, top: 80, bottom: 90, width: "calc(50vw - min(50vw - 100px, 700px))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "min(10px, 1.2vh)", zIndex: 1010, pointerEvents: "none" }}>
            
            <div style={{ position: "relative", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, pointerEvents: "auto" }} className="sidebar-item" onClick={() => {
              if (!isFollowing) {
                setIsFollowing(true);
                setIsFollowingAnimPlaying(true);
                setTimeout(() => setIsFollowingAnimPlaying(false), 2500);
              } else {
                setIsFollowing(false);
                setIsFollowingAnimPlaying(false);
              }
            }}>
              <img onClick={(e) => { e.stopPropagation(); setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId }); }} src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40"} style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid #191919", objectFit: "cover", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"} />
              
              {(!isFollowing || isFollowingAnimPlaying) && (
                <div style={{ position: "absolute", bottom: 18, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#0057ff", color: "#fff", border: "2px solid #191919", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", padding: 0, transition: "background 0.3s" }}>
                  {isFollowing ? <Check size={10} style={{ animation: "followCheck 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" }} /> : <span style={{ lineHeight: 0.8 }}>+</span>}
                </div>
              )}
              
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff", whiteSpace: "nowrap" }}>{isFollowing ? "Following" : "Follow"}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }} onClick={() => setShowOrderModal(true)}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                <Mail size={14} color="#191919" />
              </div>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>Hire</span>
            </div>

            {(authUser?.role === "lecturer" || authUser?.role === "admin") && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }} onClick={() => setShowFeedbackModal(true)}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                  <MessageSquare size={14} color="#1a4ba8" />
                </div>
                <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>Feedback</span>
              </div>
            )}

            {/* TOOLS BUTTON */}
            {(() => {
              let toolsList = art.toolsUsed || art.tools || (art.tool ? art.tool.split(',').map(t => t.trim()).filter(Boolean) : []);
              // Fallback for prototype so the user can see the design
              if (toolsList.length === 0) {
                toolsList = ["Illustrator", "Photoshop", "Stock"];
              }
              
              const getToolInfo = (toolName) => {
                const name = toolName.toLowerCase();
                let fallbackBg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
                
                if (name.includes('illustrator') || name === 'ai') return { id: 'Ai', bg: '#330000', color: '#ff9a00', name: 'Illustrator', image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400" };
                if (name.includes('photoshop') || name === 'ps') return { id: 'Ps', bg: '#001e36', color: '#31a8ff', name: 'Photoshop', image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400" };
                if (name.includes('premiere') || name === 'pr') return { id: 'Pr', bg: '#1a1a4b', color: '#9999ff', name: 'Premiere Pro', image: fallbackBg };
                if (name.includes('figma')) return { id: 'Fg', bg: '#1e1e1e', color: '#0acf83', name: 'Figma', image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" };
                if (name.includes('blender') || name === 'bl') return { id: 'Bl', bg: '#2f2f2f', color: '#ea7600', name: 'Blender', image: fallbackBg };
                if (name.includes('procreate')) return { id: 'Pr', bg: '#1a1a1a', color: '#5b5b5b', name: 'Procreate', image: fallbackBg };
                if (name.includes('stock') || name === 'st') return { id: 'St', bg: '#0f2026', color: '#00a3f5', name: 'Stock', image: fallbackBg };
                if (name.includes('after effects') || name === 'ae') return { id: 'Ae', bg: '#00005b', color: '#9999ff', name: 'After Effects', image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400" };
                if (name.includes('indesign') || name === 'id') return { id: 'Id', bg: '#49021f', color: '#ff3366', name: 'InDesign', image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400" };
                if (name.includes('lightroom') || name === 'lr') return { id: 'Lr', bg: '#000000', color: '#31a8ff', name: 'Lightroom', image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400" };
                
                return { id: toolName.substring(0, 2).toUpperCase(), bg: '#333', color: '#fff', name: toolName, image: fallbackBg };
              };
              
              const firstTool = getToolInfo(toolsList[0]);
              
              return (
                <div className="group" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative", pointerEvents: "auto" }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                    <div style={{ width: 20, height: 20, borderRadius: 4, background: firstTool.bg, color: firstTool.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 12, fontFamily: "sans-serif" }}>
                      {firstTool.id}
                    </div>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>Tools</span>
                  
                  {/* Tool Popup */}
                  <div className="absolute top-1/2 right-full -translate-y-1/2 mr-4 bg-white text-black p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ borderRadius: 8, width: 220, zIndex: 100, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" }}>
                    <div style={{ position: "absolute", top: "50%", right: -6, transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "6px solid #fff" }} />
                    <div style={{ fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 12, textTransform: "uppercase" }}>Tools</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                      {toolsList.map(t => {
                        const info = getToolInfo(t);
                        return (
                          <div key={t} style={{ position: "relative", display: "flex", alignItems: "center", gap: 12, background: "#151515", borderRadius: 6, padding: "8px 12px", overflow: "hidden" }}>
                            <img src={toolCovers?.[t] || info.image} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, filter: "brightness(0.8) contrast(1.1)" }} />
                            <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }} />
                            <div style={{ position: "relative", zIndex: 1, width: 24, height: 24, borderRadius: 4, background: info.bg, color: info.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 14, fontFamily: "sans-serif" }}>
                              {info.id}
                            </div>
                            <span style={{ position: "relative", zIndex: 1, fontSize: 14, fontWeight: "bold", color: "#fff" }}>{info.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })()}

            {canGrade && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative", pointerEvents: "auto" }} onMouseEnter={e => { e.currentTarget.querySelector('.badge-menu').style.display = 'block'; }} onMouseLeave={e => { e.currentTarget.querySelector('.badge-menu').style.display = 'none'; }}>
                <div style={{ width: 36, height: 36, borderRadius: "50%", background: CERULEAN, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                  <Star size={14} color="#fff" fill="#fff" />
                </div>
                <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff", whiteSpace: "nowrap" }}>Badge</span>
                
                {/* Dropdown Menu Huy Hiệu */}
                <div className="badge-menu" style={{ display: "none", position: "absolute", top: 0, right: "100%", marginRight: 16, background: "#fff", borderRadius: 8, padding: 12, minWidth: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 200 }}>
                  <h4 style={{ margin: "0 0 10px", fontSize: 13, color: BLACK, fontWeight: 700 }}>Huy hiệu của bạn</h4>
                  {lecturerBadges.length === 0 ? (
                    <p style={{ margin: 0, fontSize: 12, color: MUTED }}>Bạn chưa tạo huy hiệu nào.</p>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                      {lecturerBadges.map(b => {
                        const isAssigned = (art.badges || []).some(ab => ab.id === b.id);
                        return (
                          <div key={b.id} onClick={() => handleAssignBadge(b.id)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: isAssigned ? b.colorCode : GRAY_BG, color: isAssigned ? (b.textColor || "#fff") : BLACK, fontSize: 13, fontWeight: 600, cursor: assigningBadge ? "wait" : "pointer" }}>
                            <Star size={14} fill={isAssigned ? (b.textColor || "#fff") : "none"} color={isAssigned ? (b.textColor || "#fff") : BLACK} />
                            {b.name}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }} onClick={() => onBookmarkClick(art)}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                <Folder size={14} color="#191919" fill={isBookmarked && isBookmarked(art.id) ? "#191919" : "none"} />
              </div>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>{isBookmarked && isBookmarked(art.id) ? "Saved" : "Save"}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", marginTop: 4, pointerEvents: "auto" }} onClick={handleLike}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", transform: animatingLike ? "scale(1.2) rotate(-10deg)" : "scale(1)", boxShadow: isLiked ? "0 0 20px rgba(0,87,255,0.4)" : "none" }} onMouseEnter={e => {if(!animatingLike) e.currentTarget.style.transform="scale(1.1)"}} onMouseLeave={e => {if(!animatingLike) e.currentTarget.style.transform="scale(1)"}}>
                <ThumbsUp size={18} color="#fff" fill={isLiked ? "#fff" : "none"} />
              </div>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>{likeCount || 0}</span>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }} onClick={() => setShowReport(true)}>
              <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }} onMouseEnter={e => e.currentTarget.style.transform="scale(1.1)"} onMouseLeave={e => e.currentTarget.style.transform="scale(1)"}>
                <AlertTriangle size={14} color="#191919" />
              </div>
              <span style={{ fontSize: 10, fontWeight: "bold", color: "#fff" }}>Report</span>
            </div>

        </div>

      </div>

      {shareToast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 10000, background: BLACK, color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>{t("linkCopied")}</div>}

      {showFullscreen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setShowFullscreen(false)}>
          <button onClick={() => setShowFullscreen(false)} style={{ position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, zIndex: 10 }}>✕</button>
          <img src={allImagesDeduped[fullscreenImageIndex]} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
            {allImagesDeduped.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setFullscreenImageIndex(i); }} style={{ width: 8, height: 8, borderRadius: "50%", background: i === fullscreenImageIndex ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E0E0E0] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#212121]">{t("downloadArtwork")}</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5">
              <p className="text-xs text-[#666666] mb-4">{t("chooseFormatToDownload")}{allImagesDeduped.length > 1 ? ` (${allImagesDeduped.length} ${t("images")})` : ""}:</p>
              <div className="flex flex-col gap-3">
                {[
                  { key: "png", label: "PNG", desc: t("pngDescription") },
                  { key: "jpg", label: "JPG", desc: t("jpgDescription") },
                  { key: "pdf", label: "PDF", desc: t("pdfDescription") },
                ].map(opt => (
                  <button key={opt.key} onClick={() => { setDownloadFormat(opt.key); handleDownload(opt.key); }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-[#E0E0E0] hover:border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={downloading}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e0eaff] flex items-center justify-center text-[#1a4ba8] font-bold text-xs uppercase">{opt.key}</div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#212121]">{opt.label}</p>
                        <p className="text-xs text-[#666666]">{opt.desc}</p>
                      </div>
                    </div>
                    {downloading && downloadFormat === opt.key ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#1a4ba8] border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span>
                    ) : <FileDown size={16} className="text-[#1a4ba8]" />}
                  </button>
                ))}
              </div>
              {canSeeGrade && art.originalCoverUrl && (
                <div className="mt-4 pt-4 border-t border-[#E0E0E0]">
                  <button onClick={() => { saveAs(art.originalCoverUrl, `${art.title || "artwork"}_original.jpg`); setShowDownloadModal(false); }}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer text-[#1a4ba8] font-bold text-sm">
                    <Download size={16} /> Tải bản gốc (Không Watermark)
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={() => !sendingReport && setShowReport(false)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E0E0E0] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#212121]">{t("reportArtwork")}</h3>
              <button disabled={sendingReport} onClick={() => setShowReport(false)} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer disabled:opacity-50"><X size={18} /></button>
            </div>
            <div className="p-5">
              <p className="text-sm text-[#212121] mb-3 font-semibold">Vui lòng chọn lý do báo cáo:</p>
              <div className="flex flex-col gap-2 mb-5">
                {[
                  { id: "Inappropriate Content", label: "Nội dung phản cảm / Không phù hợp" },
                  { id: "Copyright Violation", label: "Vi phạm bản quyền" },
                  { id: "Spam", label: "Spam / Quảng cáo rác" },
                  { id: "Other", label: "Lý do khác" }
                ].map(reason => (
                  <label key={reason.id} className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="reportReason" 
                      className="w-4 h-4 text-[#1a4ba8]" 
                      checked={reportType === reason.id}
                      onChange={() => setReportType(reason.id)}
                      disabled={sendingReport}
                    />
                    <span className="text-sm text-[#212121]">{reason.label}</span>
                  </label>
                ))}
              </div>
              <textarea 
                placeholder="Cung cấp thêm chi tiết (Không bắt buộc)..." 
                className="w-full border border-[#E0E0E0] rounded-lg p-3 text-sm min-h-[100px] outline-none focus:border-[#1a4ba8] mb-4"
                value={reportDetail}
                onChange={e => setReportDetail(e.target.value)}
                disabled={sendingReport}
              ></textarea>
              <div className="flex justify-end gap-3">
                <button disabled={sendingReport} onClick={() => setShowReport(false)} className="px-4 py-2 rounded-lg text-sm font-semibold text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50">Hủy</button>
                <button 
                  disabled={sendingReport || !reportType} 
                  onClick={() => {
                    setSendingReport(true);
                    api.artworks.report(activeArtworkId, { violationType: reportType, detail: reportDetail })
                      .then(() => {
                        setShowReport(false);
                        setReportType("");
                        setReportDetail("");
                        alert("Gửi báo cáo thành công! Chúng tôi sẽ xem xét ấn phẩm này.");
                      })
                      .catch(err => alert("Có lỗi xảy ra: " + (err.message || "Không thể gửi báo cáo")))
                      .finally(() => setSendingReport(false));
                  }} 
                  className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#d32f2f] hover:bg-[#b71c1c] disabled:opacity-50"
                >
                  {sendingReport ? "Đang xử lý..." : "Gửi báo cáo"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showOrderModal && activeArtworkId && (
        <OrderModal setPage={setPage} activeArtworkId={activeArtworkId} onClose={() => setShowOrderModal(false)} />
      )}

      {showFeedbackModal && activeArtworkId && (
        <FeedbackModal setPage={setPage} activeArtworkId={activeArtworkId} onClose={() => setShowFeedbackModal(false)} userProfile={authUser} />
      )}

      {showFullscreen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setShowFullscreen(false)}>
          <button onClick={() => setShowFullscreen(false)} style={{ position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, zIndex: 10 }}>✕</button>
          <img src={allImagesDeduped[fullscreenImageIndex]} alt="" style={{ maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" }} onClick={(e) => e.stopPropagation()} />
          <div style={{ position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 }}>
            {allImagesDeduped.map((_, i) => (
              <div key={i} onClick={(e) => { e.stopPropagation(); setFullscreenImageIndex(i); }} style={{ width: 8, height: 8, borderRadius: "50%", background: i === fullscreenImageIndex ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" }} />
            ))}
          </div>
        </div>
      )}

      {showDownloadModal && (
        <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4" onClick={() => setShowDownloadModal(false)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-5 border-b border-[#E0E0E0] flex items-center justify-between">
              <h3 className="text-base font-bold text-[#212121]">{t("downloadArtwork")}</h3>
              <button onClick={() => setShowDownloadModal(false)} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={18} /></button>
            </div>
            <div className="p-5">
              <p className="text-xs text-[#666666] mb-4">{t("chooseFormatToDownload")}{allImagesDeduped.length > 1 ? ` (${allImagesDeduped.length} ${t("images")})` : ""}:</p>
              <div className="flex flex-col gap-3">
                {[
                  { key: "png", label: "PNG", desc: t("pngDescription") },
                  { key: "jpg", label: "JPG", desc: t("jpgDescription") },
                  { key: "pdf", label: "PDF", desc: t("pdfDescription") },
                ].map(opt => (
                  <button key={opt.key} onClick={() => { setDownloadFormat(opt.key); handleDownload(opt.key); }}
                    className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-[#E0E0E0] hover:border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={downloading}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#e0eaff] flex items-center justify-center text-[#1a4ba8] font-bold text-xs uppercase">{opt.key}</div>
                      <div className="text-left">
                        <p className="text-sm font-semibold text-[#212121]">{opt.label}</p>
                        <p className="text-xs text-[#666666]">{opt.desc}</p>
                      </div>
                    </div>
                    {downloading && downloadFormat === opt.key ? (
                      <span className="inline-block w-4 h-4 border-2 border-[#1a4ba8] border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span>
                    ) : <FileDown size={16} className="text-[#1a4ba8]" />}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}


    </div>
  );

}
function AuthPage({ setPage, onLoginSuccess }) {
    const { loginWithEmail, refreshSession } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authRole, setAuthRole] = useState("student");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [logging, setLogging] = useState(false);
  const [showUefLogin, setShowUefLogin] = useState(false);

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setLoginError(t("enterEmailAndPassword"));
      return;
    }
    setLoginError("");
    setLogging(true);
    try {
      await loginWithEmail(email, password);
      await refreshSession();
      setPage("home");
    } catch (e) {
      setLoginError(e?.message || t("loginFailed"));
    } finally {
      setLogging(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleEmailLogin();
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/signin/google";
  };

  const demoAccounts = {
    student: { email: "sv@uef.edu.vn", password: "test123" },
    lecturer: { email: "lecturer@uef.edu.vn", password: "lecturer123" },
    admin: { email: "admin@uef.edu.vn", password: "admin123" },
  };

  const autoFillLogin = (role) => {
    const account = demoAccounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setLoginError("");
    }
  };

  if (showUefLogin) {
    const UEF_BLUE = '#0072bc';
    return (
      <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", background: "#1a1a2e url(/background-login.jpg) center/cover no-repeat" }}>
        <div style={{ width: "100%", maxWidth: 448, margin: "32px 16px" }}>
          <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "32px 32px 24px" }}>

            {/* Logo row: UEF + QS Stars */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <img src="/logo-uef.png" alt="UEF" style={{ height: 72 }} />
              <img src="/qs-stars.png" alt="QS Stars" style={{ height: 40 }} />
            </div>

            {/* UEF ID heading */}
            <h4 style={{ margin: "20px 0 6px", fontWeight: 700, fontSize: 19, fontFamily: "'Public Sans', sans-serif", color: "rgba(0,114,188,0.78)", textTransform: "uppercase", textAlign: "center" }}>UEF ID</h4>

            {/* Info box */}
            <p style={{ margin: "0 0 24px", fontSize: 15, fontWeight: 400, color: "rgba(47,43,61,0.68)", background: "#e3efff", padding: "12px 16px", borderRadius: 6, textAlign: "center", lineHeight: 1.5 }}>
              Đăng nhập vào tài khoản UEF ID của bạn để truy cập
              <a href="#" onClick={(e) => { e.preventDefault(); setPage("home"); }} style={{ color: UEF_BLUE, marginLeft: 4 }}>UEF Portfolio</a>
            </p>

            {/* Email input */}
            <div style={{ marginBottom: 16 }}>
              <input
                type="text"
                value={email}
                placeholder="Tên người dùng hoặc email"
                onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                onKeyDown={handleKeyDown}
                disabled={logging}
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${loginError ? "#E53E3E" : "#d1d5db"}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#212121", background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" }}
                onFocus={(e) => { e.target.style.borderColor = UEF_BLUE; e.target.style.boxShadow = `0 0 0 1px ${UEF_BLUE}` }}
                onBlur={(e) => { if (!loginError) { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none" } }}
              />
            </div>

            {/* Password input */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ position: "relative" }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Mật khẩu"
                  onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                  onKeyDown={handleKeyDown}
                  disabled={logging}
                  style={{ width: "100%", padding: "10px 44px 10px 12px", border: `1px solid ${loginError ? "#E53E3E" : "#d1d5db"}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#212121", background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" }}
                  onFocus={(e) => { e.target.style.borderColor = UEF_BLUE; e.target.style.boxShadow = `0 0 0 1px ${UEF_BLUE}` }}
                  onBlur={(e) => { if (!loginError) { e.target.style.borderColor = "#d1d5db"; e.target.style.boxShadow = "none" } }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }}
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path clipRule="evenodd" d="M3.28033 2.21967C2.98744 1.92678 2.51256 1.92678 2.21967 2.21967C1.92678 2.51256 1.92678 2.98744 2.21967 3.28033L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L16.0352 14.9745C17.5064 13.8594 18.6595 12.3465 19.3344 10.5959C19.4814 10.2144 19.4816 9.79127 19.3347 9.40962C17.892 5.66051 14.256 3 9.99859 3C8.28207 3 6.66657 3.43249 5.2551 4.19444L3.28033 2.21967ZM7.75194 6.69128L8.84367 7.78301C9.18951 7.60223 9.58291 7.5 10.0002 7.5C11.3809 7.5 12.5002 8.61929 12.5002 10C12.5002 10.4173 12.398 10.8107 12.2172 11.1565L13.3091 12.2484C13.7454 11.6077 14.0004 10.8336 14.0004 10C14.0004 7.79086 12.2095 6 10.0004 6C9.16675 6 8.39268 6.25501 7.75194 6.69128Z" fill="currentColor" />
                      <path d="M10.7484 13.9302L13.2711 16.4529C12.2462 16.8074 11.1458 17 10.0004 17C5.74298 17 2.10698 14.3395 0.664255 10.5904C0.517392 10.2087 0.517518 9.78563 0.66461 9.40408C1.15603 8.12932 1.90108 6.98057 2.83791 6.01969L6.0702 9.25198C6.02436 9.4943 6.00037 9.74435 6.00037 10C6.00037 12.2091 7.79123 14 10.0004 14C10.256 14 10.5061 13.976 10.7484 13.9302Z" fill="currentColor" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" fill="currentColor" />
                      <path clipRule="evenodd" d="M0.664255 10.5904C0.517392 10.2087 0.517518 9.78563 0.66461 9.40408C2.10878 5.65788 5.7433 3 9.99859 3C14.256 3 17.892 5.66051 19.3347 9.40962C19.4816 9.79127 19.4814 10.2144 19.3344 10.5959C17.8902 14.3421 14.2557 17 10.0004 17C5.74298 17 2.10698 14.3395 0.664255 10.5904ZM14.0004 10C14.0004 12.2091 12.2095 14 10.0004 14C7.79123 14 6.00037 12.2091 6.00037 10C6.00037 7.79086 7.79123 6 10.0004 6C12.2095 6 14.0004 7.79086 14.0004 10Z" fillRule="evenodd" fill="currentColor" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {loginError && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 6, padding: "10px 14px", marginBottom: 16 }}>
                <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
                <p style={{ color: "#C53030", fontSize: 13, margin: 0, lineHeight: 1.4 }}>{loginError}</p>
              </div>
            )}

            {/* Remember me + Forgot password */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(47,43,61,0.78)", cursor: "pointer" }}>
                <input type="checkbox" style={{ width: 16, height: 16, borderRadius: 4, border: "1px solid #d1d5db", accentColor: UEF_BLUE }} />
                Ghi nhớ tôi
              </label>
              <button
                onClick={() => setPage("forgot_password")}
                style={{ background: "none", border: "none", fontSize: 14, color: "#009900", cursor: "pointer", padding: 0 }}
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Login button */}
            <button
              onClick={handleEmailLogin}
              disabled={logging || !email || !password}
              style={{ width: "100%", padding: "16px 4px", borderRadius: 6, border: "none", background: logging ? "#d1d5db" : UEF_BLUE, color: "#fff", fontSize: 15, fontWeight: 500, letterSpacing: "0.43px", textTransform: "uppercase", cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "rgba(47, 43, 61, 0.14) 0 2px 6px 0", marginBottom: 24, transition: "background 0.15s" }}
              onMouseEnter={(e) => { if (!logging) e.currentTarget.style.background = "#005a9e" }}
              onMouseLeave={(e) => { if (!logging) e.currentTarget.style.background = UEF_BLUE }}
            >
              {logging ? (
                <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> ĐANG ĐĂNG NHẬP...</>
              ) : "ĐĂNG NHẬP"}
            </button>

            {/* OR divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
              <span style={{ fontSize: 14, color: "rgba(47,43,61,0.68)", whiteSpace: "nowrap" }}>Hoặc đăng nhập bằng</span>
              <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
            </div>

            {/* Google login button */}
            <a
              onClick={handleGoogleLogin}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 15, color: "rgba(47,43,61,0.78)", cursor: "pointer", textDecoration: "none", marginBottom: 24 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#f9fafb" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#fff" }}
            >
              <svg width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.76 12.2727C23.76 11.4218 23.6836 10.6036 23.5418 9.81818H12.24V14.46H18.6982C18.42 15.96 17.5745 17.2309 16.3036 18.0818L18.2427 19.5873L20.1818 21.0927C22.4509 19.0036 23.76 15.9273 23.76 12.2727Z" fill="#4285F4" />
                <path d="M12.24 24C15.48 24 18.1964 22.9255 20.1818 21.0927L16.3036 18.0818C15.2291 18.8018 13.8545 19.2273 12.24 19.2273C9.11455 19.2273 6.46909 17.1164 5.52545 14.28L3.52091 15.8345L1.51636 17.3891C3.49091 21.3109 7.54909 24 12.24 24Z" fill="#34A853" />
                <path d="M5.52545 14.28C5.28545 13.56 5.14909 12.7909 5.14909 12C5.14909 11.2091 5.28545 10.44 5.52545 9.72L3.52091 8.16546L1.51636 6.61091C0.703637 8.23091 0.240001 10.0636 0.240001 12C0.240001 13.9364 0.703637 15.7691 1.51636 17.3891L5.52545 14.28Z" fill="#FBBC05" />
                <path d="M12.24 4.77273C14.0018 4.77273 15.5836 5.37818 16.8273 6.56727L20.2691 3.12545C18.1909 1.18909 15.4745 0 12.24 0C7.54909 0 3.49091 2.68909 1.51636 6.61091L5.52545 9.72C6.46909 6.88364 9.11455 4.77273 12.24 4.77273Z" fill="#EA4335" />
              </svg>
              <span>Google</span>
            </a>

            {/* Help section */}
            <div style={{ background: "#ededed", padding: "8px 16px", borderRadius: 6, textAlign: "center", fontSize: 15, color: "rgba(47,43,61,0.78)", marginBottom: 16 }}>
              Nếu bạn cần trợ giúp, truy cập <a href="https://help.uef.edu.vn/sso/#howto" target="_blank" style={{ color: UEF_BLUE }}>help.uef.edu.vn</a>
            </div>

            {/* Back to other login methods */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => setShowUefLogin(false)}
                style={{ background: "none", border: "none", color: "rgba(47,43,61,0.58)", fontSize: 14, cursor: "pointer", padding: "4px 8px" }}
              >
                ← Các phương thức đăng nhập khác
              </button>
            </div>
          </div>

          {/* Language selector */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: 16 }}>
            <div style={{ background: "#fff", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M7.99998 3H8.99998C6.99998 8 6.99998 16 8.99998 21H7.99998" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M15 3C17 8 17 16 15 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16V15C8 17 16 17 21 15V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 9.00004C8 7.00004 16 7.00004 21 9.00004" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span style={{ fontSize: 14, color: "rgba(47,43,61,0.78)" }}>Tiếng Việt</span>
              <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
                <path clipRule="evenodd" d="M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z" fillRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" }}>
      {/* Background image */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
        <img
          src="/background-login.jpg"
          alt="UEF Campus"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" }} />
      </div>


      {/* Login card */}
      <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 420, margin: "0 16px" }}>
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "40px 36px 32px" }}>
          
          {/* Logo row: UEF + QS Stars */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 }}>
            <img src="/logo-uef.png" alt="UEF" style={{ height: 80 }} />
            <img src="/qs-stars.png" alt="QS Stars" style={{ height: 44 }} />
          </div>

          {/* SSO login prompt */}
          <p style={{ fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 12 }}>{t("loginWithEmailToUse")}</p>

          {/* SSO button — Đăng nhập với UEF ID (Google) */}
          <button
            onClick={() => setShowUefLogin(true)}
            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", borderRadius: 10, border: `1px solid ${GRAY_LIGHT}`, background: "#f8f9fa", fontSize: 14, fontWeight: 500, color: "#333", cursor: "pointer", transition: "all 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#f0f1f3"; e.currentTarget.style.borderColor = "#d0d0d0"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "#f8f9fa"; e.currentTarget.style.borderColor = GRAY_LIGHT; }}
          >
            <img src="/logo-uef.png" alt="" style={{ height: 20 }} />
            <span>Đăng nhập với UEF ID</span>
          </button>

          {/* OR divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
            <span style={{ fontSize: 12, color: MUTED }}>{t("or")}</span>
            <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
          </div>

          {/* Role tabs */}
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {[{ key: "student", label: t("student") }, { key: "lecturer", label: t("lecturer") }, { key: "admin", label: t("admin") }].map((r) => (
              <button disabled={logging} key={r.key} onClick={() => { setAuthRole(r.key); autoFillLogin(r.key); }} style={{ flex: 1, padding: "7px 0", borderRadius: 8, border: `1px solid ${authRole === r.key ? CERULEAN : GRAY_LIGHT}`, background: authRole === r.key ? `${CERULEAN}12` : "transparent", color: authRole === r.key ? CERULEAN : MUTED, fontSize: 12, fontWeight: 500, cursor: logging ? "not-allowed" : "pointer", opacity: logging ? 0.6 : 1, transition: "all 0.15s" }}>{r.label}</button>
            ))}
          </div>

          {/* Email input */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, display: "flex", pointerEvents: "none", zIndex: 1 }}>
                <Mail size={16} />
              </div>
              <input
                type="email"
                value={email}
                placeholder="Tên tài khoản"
                onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
                onKeyDown={handleKeyDown}
                disabled={logging}
                style={{ width: "100%", padding: "11px 14px 11px 40px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1, transition: "border-color 0.15s" }}
                onFocus={(e) => { e.target.style.borderColor = CERULEAN; e.target.style.boxShadow = `0 0 0 1px ${CERULEAN}`; }}
                onBlur={(e) => { if (!loginError) { e.target.style.borderColor = GRAY_LIGHT; e.target.style.boxShadow = "none"; } }}
              />
            </div>
          </div>

          {/* Password input */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, display: "flex", pointerEvents: "none", zIndex: 1 }}>
                <Lock size={16} />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                placeholder="Mật khẩu"
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                onKeyDown={handleKeyDown}
                disabled={logging}
                style={{ width: "100%", padding: "11px 44px 11px 40px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1, transition: "border-color 0.15s" }}
                onFocus={(e) => { e.target.style.borderColor = CERULEAN; e.target.style.boxShadow = `0 0 0 1px ${CERULEAN}`; }}
                onBlur={(e) => { if (!loginError) { e.target.style.borderColor = GRAY_LIGHT; e.target.style.boxShadow = "none"; } }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: logging ? "not-allowed" : "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {loginError && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 12 }}>
              <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ color: "#C53030", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{loginError}</p>
            </div>
          )}

          {/* Forgot password */}
          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <span onClick={() => setPage("forgot_password")} style={{ color: CERULEAN, fontSize: 12, cursor: "pointer", fontWeight: 500 }}>{t("forgotPassword")}</span>
          </div>

          {/* Login button */}
          <button
            onClick={handleEmailLogin}
            disabled={logging || !email || !password}
            style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: logging ? GRAY_LIGHT : CERULEAN, color: logging ? MUTED : "#fff", fontSize: 15, fontWeight: 600, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }}
          >
            {logging ? (
              <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("loggingIn")}</>
            ) : t("login")}
          </button>

          {/* Demo account info */}
          <p style={{ color: "#999", fontSize: 10.5, marginTop: 14, textAlign: "center", lineHeight: 1.5 }}>
            {t("loginWithEmailToUse")}<br />
            {t("studentLabel")}: <strong>sv@uef.edu.vn</strong> / {t("passwordLabel")}: <strong>test123</strong>
          </p>
        </div>
      </div>
    </div>
  )
}

function ForgotPasswordPage({ setPage }) {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [step, setStep] = useState("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { forgotPassword, verifyResetCode, resetPassword } = useAuth();

  const handleSendCode = async () => {
    if (!email) { setError(t("invalidEmail")); return; }
    setError(""); setLoading(true);
    try {
      await forgotPassword(email);
      setStep("code");
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => { if (c <= 1) clearInterval(timer); return c - 1; }), 1000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) { setError(t("enterResetCode")); return; }
    setError(""); setLoading(true);
    try {
      await verifyResetCode(email, code);
      setStep("password");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleResetPassword = async () => {
    if (!password || password.length < 8) { setError(t("passwordMinLength")); return; }
    if (password !== confirmPw) { setError(t("passwordMismatch")); return; }
    setError(""); setLoading(true);
    try {
      await resetPassword(email, code, password);
      setSuccess(true);
      setTimeout(() => setPage("auth"), 2000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setError(""); setLoading(true);
    try {
      await forgotPassword(email);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => { if (c <= 1) clearInterval(timer); return c - 1; }), 1000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const stepTitle = step === "email" ? t("forgotPasswordTitle") : step === "code" ? t("enterResetCode") : t("resetPassword");
  const stepDesc = step === "email" ? t("forgotPasswordDesc") : step === "code" ? t("resetCodeSentDesc") : t("resetCodeSentDesc");

  if (success) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F855A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" }}>{t("resetPasswordSuccess")}</h2>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("resetPasswordSuccessDesc")}</p>
          <button onClick={() => setPage("auth")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToLogin")}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80" alt="bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span>
          </div>

          {step !== "email" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16, cursor: "pointer" }} onClick={() => { if (step === "password") { setStep("code"); } else { setPage("auth"); } }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={CERULEAN} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              <span style={{ fontSize: 12, color: CERULEAN, fontWeight: 500 }}>{t("backToLogin")}</span>
            </div>
          )}

          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" }}>{stepTitle}</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{stepDesc}</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ color: "#C53030", fontSize: 12, margin: 0 }}>{error}</p>
            </div>
          )}

          {step === "email" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("email")}</label>
                <input type="email" value={email} onChange={(e) => { setEmail(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleSendCode()} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
              </div>
              <button onClick={handleSendCode} disabled={loading || !email} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("sendResetCode")}
              </button>
              <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>
                <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("backToLogin")}</span>
              </p>
            </>
          )}

          {step === "code" && (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("enterResetCode")}</label>
                <input type="text" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="000000" maxLength={6} onKeyDown={(e) => e.key === "Enter" && handleVerifyCode()} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" }} />
              </div>
              <button onClick={handleVerifyCode} disabled={loading || code.length < 6} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("verifyCode")}
              </button>
              {cooldown > 0 ? (
                <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 }}>{t("resendCode")} ({cooldown}s)</p>
              ) : (
                <p onClick={handleResendCode} style={{ fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 }}>{t("resendCode")}</p>
              )}
            </>
          )}

          {step === "password" && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("resetNewPassword")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPw ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleResetPassword()} style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPw(!showPw)} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPw ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("resetConfirmNewPassword")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showConfirm ? "text" : "password"} value={confirmPw} onChange={(e) => { setConfirmPw(e.target.value); setError(""); }} onKeyDown={(e) => e.key === "Enter" && handleResetPassword()} style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>
              <button onClick={handleResetPassword} disabled={loading || !password || !confirmPw} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("resetPassword")}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function ResetPasswordPage({ setPage, pageParams }) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { resetPassword } = useAuth();

  const email = pageParams?.resetEmail || "";
  const code = pageParams?.resetCode || "";

  const handleReset = async () => {
    if (!password || password.length < 8) { setError(t("passwordMinLength")); return; }
    if (password !== confirmPassword) { setError(t("passwordMismatch")); return; }
    if (!email || !code) { setError("Thông tin không hợp lệ, vui lòng thử lại"); return; }
    setError(""); setLoading(true);
    try {
      await resetPassword(email, code, password);
      setSuccess(true);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F855A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" }}>{t("resetPasswordSuccess")}</h2>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("resetPasswordSuccessDesc")}</p>
          <button onClick={() => setPage("auth")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToLogin")}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80" alt="bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" }}>{t("resetPassword")}</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("resetCodeSentDesc")}</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ color: "#C53030", fontSize: 12, margin: 0 }}>{error}</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("resetNewPassword")}</label>
              <div style={{ position: "relative" }}>
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setError(""); }} style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("resetConfirmNewPassword")}</label>
              <div style={{ position: "relative" }}>
                <input type={showConfirm ? "text" : "password"} value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }} style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
            </div>
          </div>

          <button onClick={handleReset} disabled={loading || !password || !confirmPassword} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("resetPassword")}
          </button>

          <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>
            <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("backToLogin")}</span>
          </p>
        </div>
      </div>
    </div>
  );
}

function EmailVerificationPage({ setPage }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const { user, sendEmailVerification, verifyEmail, refreshSession } = useAuth();

  const email = user?.email || "";

  const handleSendCode = async () => {
    if (!email) { setError("Vui lòng đăng nhập trước"); return; }
    setError(""); setLoading(true);
    try {
      await sendEmailVerification(email);
      setSent(true);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => { if (c <= 1) clearInterval(timer); return c - 1; }), 1000);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  const handleVerify = async () => {
    if (!code || code.length < 6) { setError("Vui lòng nhập mã xác thực"); return; }
    setError(""); setLoading(true);
    try {
      await verifyEmail(email, code);
      setSuccess(true);
      refreshSession();
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  if (success) {
    return (
      <div style={{ display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG }}>
        <div style={{ maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#2F855A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" }}>{t("emailVerified")}</h2>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("emailVerifiedDesc")}</p>
          <button onClick={() => setPage("home")} style={{ padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToHome")}</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80" alt="bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
            <img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} />
            <span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" }}>{t("verifyEmail")}</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{sent ? t("resetCodeSentDesc") : t("verifyEmailDesc")}</p>

          {error && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
              <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
              <p style={{ color: "#C53030", fontSize: 12, margin: 0 }}>{error}</p>
            </div>
          )}

          {!sent ? (
            <button onClick={handleSendCode} disabled={loading || !email} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("sendVerificationCode")}
            </button>
          ) : (
            <>
              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("enterResetCode")}</label>
                <input type="text" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="000000" maxLength={6} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" }} />
              </div>
              <button onClick={handleVerify} disabled={loading || code.length < 6} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("verifyEmailButton")}
              </button>
              {cooldown > 0 ? (
                <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 }}>{t("resendCode")} ({cooldown}s)</p>
              ) : (
                <p onClick={handleSendCode} style={{ fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 }}>{t("resendCode")}</p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminOrdersPage({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.list().then(data => {
      if (data && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        // Mock data fallback
        setOrders([
          { id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
          { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }
        ]);
        setOrders([]);
      }
      setLoading(false);
    }).catch(() => {
      setOrders([]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_orders" setPage={setPage} />
        <div className="flex-1 flex flex-col items-center justify-center">
          <GlobalLoading />
          <p className="text-gray-500 font-medium mt-4 animate-pulse">Đang tải dữ liệu đơn hàng...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_orders" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8">
        <h2 className="text-2xl font-bold text-[#212121] mb-6">Quản lý Đơn hàng In ấn</h2>
        
        <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-[#F8F8F8] border-b border-[#E0E0E0]">
              <tr>
                <th className="px-5 py-4 font-bold text-[#212121]">Khách hàng</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Liên hệ</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Nội dung yêu cầu</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Ngày gửi</th>
                <th className="px-5 py-4 font-bold text-[#212121]">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E0E0E0]">
              {orders.map(order => {
                let parsed = null;
                try {
                  parsed = JSON.parse(order.content);
                } catch (e) {
                  parsed = { description: order.content };
                }
                
                return (
                <tr key={order.id} onClick={() => setSelectedOrder(order)} className="cursor-pointer border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors">
                  <td className="px-5 py-4 font-semibold text-[#212121]">{order.senderName}</td>
                  <td className="px-5 py-4 text-[#666666]">{order.senderEmail}</td>
                  <td className="px-5 py-4 text-[#666666] max-w-xs truncate">
                    {parsed.artworkTitle ? `Đặt in: ${parsed.artworkTitle} - ` : ''}
                    {parsed.description || order.content}
                  </td>
                  <td className="px-5 py-4 text-[#666666]">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.isRead ? 'bg-[#E0E0E0] text-[#666]' : 'bg-[#e0eaff] text-[#1a4ba8]'}`}>
                      {order.isRead ? 'Đã xem' : 'Mới'}
                    </span>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-8 text-center text-[#666666]">Không có đơn hàng nào.</div>
          )}
        </div>
      </div>
      {selectedOrder && (() => {
        let parsed = null;
        try {
          parsed = JSON.parse(selectedOrder.content);
        } catch (e) {
          parsed = { description: selectedOrder.content };
        }
        return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-3xl overflow-hidden flex flex-col p-6">
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="font-bold text-lg text-[#212121]">Chi tiết đơn hàng</h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[#666666] hover:text-black">
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img src={parsed.artworkImage || selectedOrder.coverImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop"} alt="Artwork" className="w-full h-auto aspect-square object-cover rounded-lg border border-gray-200" />
              </div>
              <div className="space-y-4">
                <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tài khoản người đặt (Buyer)</strong> <p className="text-sm font-medium">{selectedOrder.senderName} ({selectedOrder.senderEmail})</p></div>
                {parsed.company && <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Công ty / Tổ chức</strong> <p className="text-sm font-medium">{parsed.company}</p></div>}
                {parsed.phone && <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Số điện thoại</strong> <p className="text-sm font-medium">{parsed.phone}</p></div>}
                <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tên Ấn phẩm</strong> <p className="text-sm font-medium">{parsed.artworkTitle || '—'}</p></div>
                <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Tác giả (Student)</strong> <p className="text-sm font-medium">{selectedOrder.recipient?.fullName || '—'}</p></div>
                {parsed.artworkId && (
                  <div>
                    <strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Link liên kết</strong> 
                    <button onClick={() => setPage("detail", { artworkId: parsed.artworkId })} className="text-sm font-medium text-[#1a4ba8] hover:underline flex items-center gap-1">
                      Chuyển đến ấn phẩm <ExternalLink size={14} />
                    </button>
                  </div>
                )}
                <div><strong className="block text-xs text-gray-500 uppercase tracking-wider mb-1">Nội dung order</strong> <p className="text-sm font-medium bg-gray-50 p-3 rounded-lg border">{parsed.description || selectedOrder.content}</p></div>
              </div>
            </div>
          </div>
        </div>
        );
      })()}
    </div>
  );
}

function AdminDashboardPage({ setPage }) {
  const { user: authUser } = useAuth();
  const userRole = authUser?.role || "admin";
  const [adminStats, setAdminStats] = useState({ publishedArtworks: 0, reportedArtworks: 0, totalAccounts: 0, pendingArtworks: 0, totalInteractions: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.admin.stats(),
      api.admin.artworks({ limit: "6" }).catch(() => ({ artworks: [] })),
    ]).then(([stats, artRes]) => {
      setAdminStats(stats);
      setRecentActivity((artRes.artworks || []).slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const stats = userRole === "lecturer" ? [
    { label: "Đã duyệt", value: adminStats.publishedArtworks || 0, hint: "Tổng ấn phẩm đã duyệt", accent: "#1a4ba8" },
    { label: "Cần chấm điểm", value: adminStats.pendingArtworks || 0, hint: "Ấn phẩm đang chờ chấm", accent: "#212121" },
    { label: "Bị báo cáo", value: adminStats.reportedArtworks || 0, hint: "Cần xem xét xử lý", accent: "#8B1A1A" },
    { label: "Lượt tương tác", value: (adminStats.totalInteractions || 0).toLocaleString(), hint: "Lượt thích và bình luận", accent: "#0d2e6e" },
  ] : [
    { label: t("publishedArtworks"), value: adminStats.publishedArtworks || 0, hint: t("totalPublishedArtworks"), accent: "#1a4ba8" },
    { label: t("reportedArtworks"), value: adminStats.reportedArtworks || 0, hint: t("needsProcessing"), accent: "#8B1A1A" },
    { label: t("totalAccounts"), value: adminStats.totalAccounts || 0, hint: "SV + GV + Admin", accent: "#212121" },
    { label: t("interactions"), value: (adminStats.totalInteractions || 0).toLocaleString(), hint: t("likesAndComments"), accent: "#0d2e6e" },
  ];

  const categoryCounts = [];
  const recent = recentActivity.slice(0, 4).map(a => ({
    color: a.isPublic ? "#1a4ba8" : "#8B1A1A",
    text: `${a.user?.fullName || "User"} ${a.isPublic ? "đã duyệt tác phẩm" : "vừa đăng tải"} "${(a.title || "").slice(0, 30)}"`,
  }));

  const statusBadge = (s) => {
    if (s === "Bị báo cáo") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Đã ẩn") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "Nổi bật") return "bg-blue-50 text-[#1a4ba8] border border-[#a8bce0]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="admin" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8F8F8]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#212121]">{userRole === "lecturer" ? "Tổng quan Giảng Viên" : t("adminOverview")}</h2>
            <p className="text-sm text-[#666666] mt-1">{userRole === "lecturer" ? "Theo dõi và quản lý các hoạt động dành cho giảng viên." : t("adminDescription")}</p>
          </div>
          <button onClick={async () => {
              const doc = new jsPDF();
              doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
              doc.setFont("Roboto");
              doc.text("BAO CAO TONG QUAN HE THONG", 14, 20);
              
              autoTable(doc, {
                startY: 30,
                head: [["Chi tieu", "Gia tri", "Chu thich"]],
                body: stats.map(s => [s.label, s.value, s.hint]),
                theme: "grid",
                styles: { font: "Roboto" }
              });
              
              doc.text("HOAT DONG GAN DAY", 14, doc.lastAutoTable.finalY + 15);
              autoTable(doc, {
                startY: doc.lastAutoTable.finalY + 25,
                head: [["Hoat dong", "Loai"]],
                body: recentActivity.map(a => [
                  a.user?.fullName + (a.isPublic ? " da duoc duyet an pham " : " vua dang an pham ") + a.title,
                  a.isPublic ? "Duyet" : "Moi"
                ]),
                theme: "striped",
                styles: { font: "Roboto" }
              });
              
              doc.save("Bao_Cao_Tong_Quan.pdf");
            }} className="px-4 py-2.5 bg-[#1a4ba8] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2e6e] transition-colors flex items-center gap-2">
            <FileDown size={16} /> {t("pdfReport")}
          </button>
        </div>

        {loading ? <GlobalLoading /> : (
        <><div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {stats.map((s) => (
            <div key={s.label} className="bg-white border border-[#E0E0E0] rounded-xl p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{s.label}</p>
                  <p className="text-3xl font-extrabold text-[#212121] leading-none">{s.value}</p>
                </div>
                <div className="w-3 h-3 rounded-full" style={{ background: s.accent }} />
              </div>
              <p className="text-xs text-[#666666] mt-3">{s.hint}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
            <div className="p-5 border-b border-[#E0E0E0] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#212121]">{t("artworksToReview")}</h3>
                <p className="text-xs text-[#666666] mt-1">{t("artworksToReviewDesc")}</p>
              </div>
              <button onClick={() => setPage("admin_artworks")} className="text-sm font-semibold text-[#1a4ba8] hover:text-[#0d2e6e] transition-colors">
                {t("openProcessingPage")} →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("artworkName")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("student")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("subject")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("date")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {recentActivity.map((a) => {
                    const aStatus = a.isPublic ? "Đang hiển thị" : (a.isHighlighted ? "Nổi bật" : "Đã ẩn");
                    return (
                    <tr key={a.id} >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={a.coverImageUrl} className="w-10 h-10 rounded-md object-cover bg-[#E0E0E0] border border-[#E0E0E0]" />
                          <span className="text-sm font-semibold text-[#212121] truncate max-w-[260px]">{a.title}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.user?.fullName || ""}</td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.subject || ""}</td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${statusBadge(aStatus)}`}>{aStatus}</span>
                      </td>
                    </tr>
                  );
                })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div className="bg-white border border-[#E0E0E0] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[#212121] mb-4">{t("artworkDistributionBySubject")}</h3>
              <div className="space-y-3">
                {categoryCounts.map((c) => (
                  <div key={c.label} className="flex items-center gap-3">
                    <span className="w-24 text-xs text-[#666666]">{c.label}</span>
                    <div className="flex-1 h-2.5 bg-[#F8F8F8] rounded-full overflow-hidden border border-[#E0E0E0]">
                      <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.value / 60) * 100)}%`, background: c.color }} />
                    </div>
                    <span className="w-10 text-right text-xs font-semibold text-[#212121]">{c.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#212121]">{t("recentActivity")}</h3>
                <span className="text-xs text-[#666666]">{t("today")}</span>
              </div>
              <div className="space-y-3">
                {recent.map((r, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <span className="mt-1 w-2.5 h-2.5 rounded-full" style={{ background: r.color }} />
                    <p className="text-sm text-[#666666] leading-relaxed">{r.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white border border-[#E0E0E0] rounded-xl p-5">
              <h3 className="text-sm font-bold text-[#212121] mb-4">{t("quickActions")}</h3>
              <div className="space-y-2">
                <button onClick={() => setPage("admin_artworks")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left">
                  <ShieldAlert size={16} className="text-[#8B1A1A]" />
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">{t("handleViolations")}</p>
                    <p className="text-xs text-[#666666]">{t("hideDeleteHighlight")}</p>
                  </div>
                </button>
                <button onClick={() => setPage("admin_users")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left">
                  <Users size={16} className="text-[#1a4ba8]" />
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">{t("manageAccounts")}</p>
                    <p className="text-xs text-[#666666]">{t("permissionsAndLock")}</p>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </>)}
    </div>
  </div>
  );
}



function PendingArtworksPage({ setPage, userData }) {
  const [artworks, setArtworks] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.artworks.list({ limit: "50", isPending: "true" }).then(res => {
      setArtworks(res.artworks || []);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="pending_artworks" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8F8F8]">
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 4px", color: BLACK }}>Chấm điểm</h2>
        <p style={{ color: MUTED, fontSize: 13, marginBottom: 28 }}>Danh sách các tác phẩm sinh viên nộp đang chờ giảng viên chấm điểm và phê duyệt.</p>

        {loading ? <GlobalLoading /> : artworks.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>
            <p style={{ color: MUTED }}>Không có tác phẩm nào đang chờ duyệt.</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {artworks.map(art => (
              <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                <div style={{ position: "relative", background: GRAY_BG }}>
                  <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => setPage("detail", { artworkId: art.id })} />
                  <div style={{ position: "absolute", top: 8, left: 8 }}>
                    <span style={{ background: "#fffBEB", color: "#b45309", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: "1px solid #fcd34d" }}>Chờ duyệt</span>
                  </div>
                </div>
                <div style={{ padding: "12px 14px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{art.title}</p>
                  <p style={{ fontSize: 11, color: MUTED, margin: "0 0 8px" }}>Sinh viên: <span style={{ fontWeight: 600, color: BLACK }}>{art.user?.fullName}</span></p>
                  <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                    <span style={{ background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` }}>{art.subject}</span>
                    <span style={{ background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` }}>{art.academicYear}</span>
                  </div>
                  <button onClick={() => setPage("detail", { artworkId: art.id })} style={{ width: "100%", padding: "8px", borderRadius: 6, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    Vào chấm điểm
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MessagesPage({ setPage, userData }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [frozenOrder, setFrozenOrder] = useState(null);
  const [activeTab, setActiveTab] = useState("inbox");

  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState({});
  const { user: authUser } = useAuth();

  useEffect(() => {
    const fetchMsgs = () => {
      api.messages.list().then(data => {
        setMessages(Array.isArray(data) ? data : []);
        setLoading(false);
      }).catch(() => setLoading(false));
    };
    fetchMsgs();

    const connection = new HubConnectionBuilder()
      .withUrl("/chatHub", {
        accessTokenFactory: () => localStorage.getItem("token") || ""
      })
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.log("SignalR error", err));

    connection.on("ReceiveMessage", (message) => {
      fetchMsgs();
    });

    return () => {
      connection.stop();
    };
  }, [activeTab]);

  const toggleMessage = (id, thread) => {
    if (expandedId === id) {
      setExpandedId(null);
      setFrozenOrder(null);
    } else {
      setExpandedId(id);
      // Capture current order to prevent jumping when sending a reply
      setFrozenOrder(threadedMessages.map(t => t.id));
      if (thread && thread.isThread) {
        thread.messages.forEach(m => {
          if (!m.isRead) api.messages.markRead(m.id).catch(() => {});
        });
        setMessages(prev => prev.map(m => (thread.messages.some(tm => tm.id === m.id) ? { ...m, isRead: true } : m)));
      } else {
        api.messages.markRead(id).catch(() => {});
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
      }
    }
  };

  const handleReply = async (thread) => {
    const text = (replyText[thread.id] || "").trim();
    if (!text) return;
    
    setReplying(prev => ({ ...prev, [thread.id]: true }));
    try {
      // Find original sender to reply to
      const originalMsg = thread.messages.find(m => !m.senderName?.startsWith("To: "));
      let recipientSlug = "uef-design-gallery";
      
      if (originalMsg && originalMsg.senderEmail) {
        recipientSlug = originalMsg.senderEmail;
      } else if (thread.artworkData?.artworkId) {
        try {
          const art = await api.artworks.get(thread.artworkData.artworkId);
          if (art && art.user && art.user.email) {
            recipientSlug = art.user.email;
          }
        } catch (err) {
          console.error("Failed to fetch artwork to find recipient email:", err);
        }
      }
      
      const newMsgData = await api.messages.send({
        recipientSlug: recipientSlug,
        senderName: authUser?.fullName || authUser?.name || "Bạn",
        senderEmail: authUser?.email || "",
        senderCompany: "UEF",
        purpose: "message",
          content: text,
      });
      
      // Update local messages
      const outboxMsg = {
        ...newMsgData,
        senderName: `To: ${recipientSlug}`,
        recipientSlug: recipientSlug,
        isRead: true
      };
      setMessages(prev => [outboxMsg, ...prev]);
      setReplyText(prev => ({ ...prev, [thread.id]: "" }));
    } catch (e) {
      alert("Lỗi khi gửi phản hồi: " + (e?.message || "Vui lòng thử lại"));
    } finally {
      setReplying(prev => ({ ...prev, [thread.id]: false }));
    }
  };

  const handleArchive = async (id, thread) => {
    try {
      if (thread && thread.isThread) {
        await Promise.all(thread.messages.map(m => api.messages.archive(m.id)));
        setMessages(prev => prev.map(m => thread.messages.some(tm => tm.id === m.id) ? { ...m, isArchived: true } : m));
      } else {
        await api.messages.archive(id);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isArchived: true } : m));
      }
    } catch (e) {
      alert(t("archiveError") + (e?.message || t("pleaseTryAgain")));
    }
  };

  const handleUnarchive = async (id, thread) => {
    try {
      if (thread && thread.isThread) {
        await Promise.all(thread.messages.map(m => api.messages.unarchive(m.id)));
        setMessages(prev => prev.map(m => thread.messages.some(tm => tm.id === m.id) ? { ...m, isArchived: false } : m));
      } else {
        await api.messages.unarchive(id);
        setMessages(prev => prev.map(m => m.id === id ? { ...m, isArchived: false } : m));
      }
    } catch (e) {
      alert("Lỗi khôi phục: " + (e?.message || t("pleaseTryAgain")));
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.messages.updateStatus(id, { status });
      setMessages(prev => prev.map(m => m.id === id ? { ...m, status } : m));
    } catch (e) {
      alert("Lỗi cập nhật trạng thái: " + (e?.message || t("pleaseTryAgain")));
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    if (diff < 172800000) return t("yesterday");
    return d.toLocaleDateString("vi-VN");
  };

  const threadedMessages = React.useMemo(() => {
    const filtered = messages.filter(m => activeTab === "archived" ? m.isArchived : !m.isArchived);
    const groups = {};

    filtered.forEach(msg => {
      const isMe = msg.senderName?.startsWith("To: ");
      const otherEmail = msg.recipientSlug || msg.senderEmail || "uef-design-gallery";
      const otherAvatarUrl = msg.senderAvatarUrl;
      const otherName = isMe ? (msg.recipientSlug || msg.senderName) : msg.senderName;
      
      let groupId = "chat_" + otherEmail;
      
      let artworkData = null;
      if (msg.purpose === 'order' || msg.purpose === 'feedback') {
        try {
          artworkData = JSON.parse(msg.content);
        } catch {}
      }

      if (!groups[groupId]) {
        groups[groupId] = {
          id: groupId,
          otherEmail: otherEmail,
          otherAvatarUrl: otherAvatarUrl,
          otherName: otherName,
          artworkData: artworkData,
          messages: []
        };
      } else {
        if (!groups[groupId].otherAvatarUrl && otherAvatarUrl) groups[groupId].otherAvatarUrl = otherAvatarUrl;
        if (!groups[groupId].otherName && otherName && !otherName.startsWith("To: ")) groups[groupId].otherName = otherName;
      }
      
      groups[groupId].messages.push(msg);
    });

    Object.values(groups).forEach(g => {
      g.messages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    });

    const result = [];
    Object.values(groups).forEach(g => {
      const latestMsg = g.messages[g.messages.length - 1];
      result.push({
        isThread: true,
        id: g.id,
        otherEmail: g.otherEmail,
        otherAvatarUrl: g.otherAvatarUrl,
        otherName: g.otherName,
        artworkData: g.artworkData,
        messages: g.messages,
        latestMessage: latestMsg,
        createdAt: latestMsg.createdAt,
        isRead: g.messages.every(m => m.isRead),
        purpose: latestMsg.purpose,
      });
    });

    result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    if (frozenOrder) {
      result.sort((a, b) => {
        const idxA = frozenOrder.indexOf(a.id);
        const idxB = frozenOrder.indexOf(b.id);
        if (idxA !== -1 && idxB !== -1) return idxA - idxB;
        if (idxA === -1 && idxB !== -1) return -1;
        if (idxB === -1 && idxA !== -1) return 1;
        return 0;
      });
    }
    
    return result;
  }, [messages, activeTab]);

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="messages" setPage={setPage} userData={userData} />
      <div style={{ flex: 1, padding: "32px 40px", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>{t("inboxTitle")}</h2>
          <div style={{ display: "flex", gap: 8, background: "#fff", padding: 4, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}` }}>
            <button onClick={() => { setActiveTab("inbox"); setExpandedId(null); setFrozenOrder(null); }} style={{ padding: "6px 16px", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === "inbox" ? "#f3f4f6" : "transparent", color: activeTab === "inbox" ? BLACK : MUTED }}>Hộp thư đến</button>
            <button onClick={() => { setActiveTab("archived"); setExpandedId(null); setFrozenOrder(null); }} style={{ padding: "6px 16px", border: "none", borderRadius: 6, fontSize: 13, fontWeight: 600, cursor: "pointer", background: activeTab === "archived" ? "#f3f4f6" : "transparent", color: activeTab === "archived" ? BLACK : MUTED }}>Đã lưu trữ</button>
          </div>
        </div>
        {loading ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40 }}>{t("loading")}</p>
        ) : threadedMessages.length === 0 ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>{activeTab === "archived" ? "Chưa có tin nhắn lưu trữ" : t("noMessages")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {threadedMessages.map(thread => {
              const msg = thread.latestMessage;
              const isExpanded = expandedId === thread.id;
              
              let avatarUrl = null;
              if (thread.isThread && thread.artworkData?.artworkImage) {
                 avatarUrl = thread.artworkData.artworkImage;
              } else if (msg.purpose === 'order') {
                try {
                  const data = JSON.parse(msg.content);
                  if (data.artworkImage) avatarUrl = data.artworkImage;
                } catch {}
              }

              if (!avatarUrl && thread.otherAvatarUrl) avatarUrl = thread.otherAvatarUrl;

                // Determine the other party's name
                let displayName = thread.otherName || thread.otherEmail || "Người dùng ẩn danh";
                if (displayName.startsWith("To: ")) displayName = displayName.replace("To: ", "Gửi đến: ");

              // Subtext is latest message
              let subText = msg.purpose === 'order' ? t("orderArtwork") : (msg.content || "");
              if (thread.isThread && msg.purpose !== 'order') {
                try {
                  const data = JSON.parse(msg.content);
                  subText = data.description || subText;
                } catch {}
              }

              return (
              <div key={thread.id} style={{ display: "flex", flexDirection: "column", background: thread.isRead ? "#fff" : "#f8faff", borderRadius: 12, border: `1px solid ${thread.isRead ? "#eaeaea" : "#cce0ff"}`, overflow: "hidden", transition: "all 0.2s" }}>
                <div onClick={() => toggleMessage(thread.id, thread)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 16px", cursor: "pointer" }} onMouseOver={e => { if (!isExpanded) e.currentTarget.style.background = thread.isRead ? "#fdfdfd" : "#f0f6ff" }} onMouseOut={e => { e.currentTarget.style.background = "transparent" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: thread.isRead ? "#f0f0f0" : "linear-gradient(135deg, #1a4ba8, #3b82f6)", display: "flex", alignItems: "center", justifyContent: "center", color: thread.isRead ? "#888" : "#fff", fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" style={{ width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }} />
                  ) : (
                    (msg.senderName?.replace("To: ", "") || "?").charAt(0).toUpperCase()
                  )}
                  </div>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 6, minWidth: 0 }}>
                        <p style={{ fontSize: 15, fontWeight: thread.isRead ? 600 : 700, color: "#1a1a1a", margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {displayName}
                        </p>
                        {thread.isThread && <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>• {thread.messages.length} tin nhắn</span>}
                        {!thread.isThread && msg.senderCompany && msg.purpose !== 'order' && <span style={{ fontSize: 12, color: "#666", whiteSpace: "nowrap" }}>• {msg.senderCompany}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                        <span style={{ fontSize: 12, color: "#888", fontWeight: 500 }}>{formatDate(thread.createdAt)}</span>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {thread.purpose === 'order' ? (
                        <span style={{ fontSize: 11, color: "#059669", fontWeight: 600, whiteSpace: "nowrap" }}>[{t("order")}]</span>
                      ) : thread.purpose === 'feedback' ? (
                        <span style={{ fontSize: 11, color: "#1a4ba8", fontWeight: 600, whiteSpace: "nowrap" }}>[Feedback Kín]</span>
                      ) : (
                        thread.purpose && <span style={{ fontSize: 11, color: "#555", fontWeight: 600, whiteSpace: "nowrap" }}>[{thread.purpose}]</span>
                      )}
                      <p style={{ fontSize: 13, color: thread.isRead ? "#666" : "#333", margin: 0, fontWeight: thread.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                        {msg.senderName?.startsWith("To: ") ? "Bạn: " : ""}{subText}
                      </p>
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div style={{ padding: "0 16px 16px 70px" }}>
                    <div style={{ paddingTop: 16, borderTop: "1px dashed #eaeaea", display: "flex", flexDirection: "column", gap: 16 }}>
                      {thread.isThread ? (
                        // Thread View
                        <>
                          {thread.artworkData && (
                            <div style={{ display: "flex", gap: 12, alignItems: "center", background: "#fdfdfd", border: "1px solid #eaeaea", borderRadius: 8, padding: 12, marginBottom: 16 }}>
                              {thread.artworkData.artworkImage && (
                                <img src={thread.artworkData.artworkImage} alt={thread.artworkData.artworkTitle || "Tác phẩm"} style={{ width: 60, height: 60, objectFit: "cover", borderRadius: 4 }} />
                              )}
                              <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 14, fontWeight: 700, color: BLACK, margin: "0 0 4px" }}>{thread.artworkData.artworkTitle || "Tác phẩm"}</p>
                                <div style={{ display: "flex", gap: 8 }}>
                                  <button onClick={() => setPage("detail", { artworkId: thread.artworkId })} style={{ padding: "4px 8px", borderRadius: 4, border: "none", background: "#f0f0f0", color: "#333", fontSize: 11, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
                                    <ExternalLink size={12} /> Xem tác phẩm
                                  </button>
                                  {msg.status !== "completed" && (
                                    <button onClick={() => handleUpdateStatus(msg.id, "completed")} style={{ padding: "4px 8px", borderRadius: 4, border: "1px solid #10B981", background: "transparent", color: "#10B981", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Đánh dấu hoàn thành</button>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                          
                          {(() => {
                            const originalMsg = thread.messages.find(m => !m.senderName?.startsWith("To: ")) || msg;
                            let feedbackText = originalMsg.content;
                            try {
                              const d = JSON.parse(originalMsg.content);
                              feedbackText = d.description || originalMsg.content;
                            } catch {}
                            
                            const emailBody = `Kính gửi ${originalMsg.senderName?.replace("To: ", "") || "bạn"},

[Vui lòng nhập nội dung phản hồi của bạn tại đây...]

Trân trọng,
[Tên của bạn]

--------------------------------------------------
🔴 🟡 🔵 THÔNG TIN TRAO ĐỔI TỪ UEF DESIGN GALLERY
--------------------------------------------------
📌 Chủ đề: ${thread.artworkData?.artworkTitle ? `Phản hồi về tác phẩm "${thread.artworkData.artworkTitle}"` : (thread.purpose || "Liên hệ từ Portfolio")}
📅 Thời gian gửi: ${formatDate(originalMsg.createdAt)}

📝 NỘI DUNG GỐC:
"${feedbackText}"
--------------------------------------------------
`;
                            return (
                              <div style={{ marginTop: 8 }}>
                                {originalMsg.senderEmail && (
                                  <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 12, color: "#888" }}>Email gốc:</span>
                                    <a href={`mailto:${originalMsg.senderEmail}`} style={{ fontSize: 13, color: "#1a4ba8", textDecoration: "none", fontWeight: 500 }}>{originalMsg.senderEmail}</a>
                                  </div>
                                )}
                                <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, border: "1px solid #eee" }}>
                                  <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{feedbackText}</p>
                                </div>
                                
                                <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center", borderTop: "1px solid #eee", paddingTop: 16 }}>
                                  <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(originalMsg.senderEmail || "uef-design-gallery")}&su=${encodeURIComponent(`Reply: ${thread.purpose || t("portfolioContact")}`)}&body=${encodeURIComponent(emailBody)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                                    title="Phản hồi qua Email"
                                  >
                                    <Mail size={14} /> Phản hồi qua Email
                                  </a>
                                </div>
                              </div>
                            );
                          })()}
                        </>
                      ) : (
                        // Normal Message View
                        <>
                          {(() => {
                            let feedbackText = msg.content;
                            try {
                              const d = JSON.parse(msg.content);
                              feedbackText = d.description || msg.content;
                            } catch {}
                            
                            const emailBody = `Kính gửi ${msg.senderName?.replace("To: ", "") || "bạn"},

[Vui lòng nhập nội dung phản hồi của bạn tại đây...]

Trân trọng,
[Tên của bạn]

--------------------------------------------------
🔴 🟡 🔵 THÔNG TIN TRAO ĐỔI TỪ UEF DESIGN GALLERY
--------------------------------------------------
📌 Chủ đề: ${msg.purpose || "Liên hệ từ Portfolio"}
📅 Thời gian gửi: ${formatDate(msg.createdAt)}

📝 NỘI DUNG GỐC:
"${feedbackText}"
--------------------------------------------------
`;
                            return (
                              <div style={{ marginTop: 8 }}>
                                {msg.senderEmail && (
                                  <div style={{ marginBottom: 12, display: "flex", alignItems: "center", gap: 6 }}>
                                    <span style={{ fontSize: 12, color: "#888" }}>Email gốc:</span>
                                    <a href={`mailto:${msg.senderEmail}`} style={{ fontSize: 13, color: "#1a4ba8", textDecoration: "none", fontWeight: 500 }}>{msg.senderEmail}</a>
                                  </div>
                                )}
                                <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 8, border: "1px solid #eee" }}>
                                  <p style={{ fontSize: 13, color: "#333", margin: 0, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>{feedbackText}</p>
                                </div>
                                
                                <div style={{ display: "flex", gap: 8, marginTop: 16, alignItems: "center", borderTop: "1px solid #eee", paddingTop: 16 }}>
                                  <a
                                    href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.senderEmail || "uef-design-gallery")}&su=${encodeURIComponent(`Reply: ${msg.purpose || t("portfolioContact")}`)}&body=${encodeURIComponent(emailBody)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                                    title="Phản hồi qua Email"
                                  >
                                    <Mail size={14} /> Phản hồi qua Email
                                  </a>
                                </div>
                              </div>
                            );
                          })()}
                        </>
                      )}

                      {/* Archive Actions */}
                      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                        {activeTab === "inbox" ? (
                          <button onClick={() => handleArchive(msg.id, thread)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 12, cursor: "pointer", color: BLACK, display: "flex", alignItems: "center", gap: 6 }}>
                            <Archive size={14} /> {t("archive")}
                          </button>
                        ) : (
                          <button onClick={() => handleUnarchive(msg.id, thread)} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 12, cursor: "pointer", color: BLACK, display: "flex", alignItems: "center", gap: 6 }}>
                            <ArchiveRestore size={14} /> Khôi phục
                          </button>
                        )}
                      </div>

                    </div>
                  </div>
                )}
              </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminSidebar({ active, setPage }) {
  const { user: authUser } = useAuth();
  const userRole = authUser?.role || "admin";
  const items = [
    { icon: <LayoutDashboard size={18} />, label: "Tổng quan", page: "admin", roles: ["admin", "lecturer"] },
    { icon: <CheckCircle size={18} />, label: "Chấm điểm", page: "pending_artworks", roles: ["admin", "lecturer"] },
    { icon: <FileBadge size={18} />, label: "Quản lý huy hiệu", page: "badges", roles: ["admin"] },
    { icon: <Users size={18} />, label: "Tài khoản", page: "admin_users", roles: ["admin"] },
    { icon: <ShoppingCart size={18} />, label: "Đơn hàng", page: "admin_orders", roles: ["admin"] },
    { icon: <ShieldAlert size={18} />, label: "Cảnh cáo ấn phẩm", page: "admin_artworks", roles: ["admin", "lecturer"] },
    { icon: <Folder size={18} />, label: "Quản lý Moodboard", page: "admin_export", roles: ["admin", "lecturer"] },
    { icon: <Settings size={18} />, label: "Cài đặt Watermark", page: "admin_watermark", roles: ["admin"] },
    { icon: <Settings size={18} />, label: "Cài đặt Layout", page: "admin_layout", roles: ["admin"] },
  ].filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-[#F8F8F8] border-r border-[#E0E0E0] flex-shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-[#E0E0E0]">
        <h3 className="font-medium text-[#212121] text-[13px] uppercase tracking-wider">{userRole === "lecturer" ? "Trang Giảng Viên" : t("adminPanel")}</h3>
        <p className="text-[11px] text-[#666666] mt-1">{userRole === "lecturer" ? "Lecturer Dashboard" : t("adminSystem")}</p>
      </div>
      <div className="py-4">
        {items.map(item => (
          <div key={item.label} onClick={() => setPage(item.page)} className={`flex items-center gap-3 px-6 py-3 cursor-pointer border-r-4 ${active === item.page ? 'bg-[#e0eaff] border-[#1a4ba8] text-[#1a4ba8]' : 'border-transparent text-[#212121] hover:bg-white'}`}>
            <span className={active === item.page ? 'text-[#1a4ba8]' : 'text-[#666666]'}>{item.icon}</span>
            <span className={`text-[13px] ${active === item.page ? 'font-medium' : 'font-normal'}`}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto p-6">
      </div>
    </div>
  );
}

function EditArtworkPage({ setPage, activeArtworkId }) {
    const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [tools, setTools] = useState([]);
  const [toolInput, setToolInput] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [projectYear, setProjectYear] = useState("Năm 3");
  const [isGroupProject, setIsGroupProject] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendInput, setFriendInput] = useState("");
  const [friendResults, setFriendResults] = useState([]);
  const [friendSearching, setFriendSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [originalCover, setOriginalCover] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [defaultWatermarkText, setDefaultWatermarkText] = useState("UEF");

  const allSubjects = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const semesterToYear = { HK1: "Năm 1", HK2: "Năm 2", HK3: "Năm 3" };
  const yearToSemester = { "Năm 1": "HK1", "Năm 2": "HK2", "Năm 3": "HK3", "Năm 4": "HK1", "Tốt nghiệp": "HK2" };
  const yearToAcademic = { "Năm 1": "2024-2025", "Năm 2": "2023-2024", "Năm 3": "2022-2023", "Năm 4": "2021-2022", "Tốt nghiệp": "2021-2022" };

  useEffect(() => {
    if (!activeArtworkId) return;
    setLoading(true);
    api.artworks.get(activeArtworkId).then(res => {
      setTitle(res.title || "");
      setDescription(res.description || "");
      setSubject(res.subject || "");
      setTools(res.toolsUsed || []);
      setTags(res.tags || []);
      setOriginalCover(res.coverImageUrl || "");
      setAdditionalImages((res.fileUrls || []).filter(url => url !== res.coverImageUrl));
      if (res.semester) {
        const yr = semesterToYear[res.semester];
        if (yr) setProjectYear(yr);
      }
      const collabs = res.collaborators || [];
      if (collabs.length > 0) { setIsGroupProject(true); setFriends(collabs); }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeArtworkId]);

  const autoSaveStateRef = React.useRef({ title, description, subject, tools, tags, friends, coverImage, originalCover, additionalImages, projectYear, defaultWatermarkText });
  useEffect(() => {
    autoSaveStateRef.current = { title, description, subject, tools, tags, friends, coverImage, originalCover, additionalImages, projectYear, defaultWatermarkText };
  });

  useEffect(() => {
    const timer = setInterval(async () => {
      const state = autoSaveStateRef.current;
      if (!state.title?.trim()) return;
      try {
        const body = {
          title: state.title.trim(),
          description: state.description?.trim() || null,
          subject: state.subject || null,
          toolsUsed: state.tools,
          tags: state.tags,
          collaborators: state.friends.map(f => f.fullName || f),
          collaboratorIds: state.friends.map(f => f.id).filter(Boolean),
          fileUrls: [state.coverImage || state.originalCover, ...state.additionalImages].filter(Boolean),
          coverImageUrl: state.coverImage || state.originalCover,
          watermarkText: state.defaultWatermarkText || "UEF",
          watermarkPosition: "bottom-right",
          semester: yearToSemester[state.projectYear] || "HK1",
          academicYear: yearToAcademic[state.projectYear] || "2024-2025",
        };
        await api.artworks.update(activeArtworkId, body);
        console.log("Auto-saved at", new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 60000);
    return () => clearInterval(timer);
  }, [activeArtworkId]);

  useEffect(() => {
    fetch("/api/site-settings")
      .then(r => r.json())
      .then(data => {
        if (data.watermark_text) setDefaultWatermarkText(data.watermark_text);
      })
      .catch(() => {});
  }, []);

  const handleSave = async () => {
    if (!title.trim()) { setMessage({ type: "error", text: t("pleaseEnterCourseName") }); return; }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        subject: subject || null,
        toolsUsed: tools,
        tags,
        collaborators: friends.map(f => f.fullName || f),
        collaboratorIds: friends.map(f => f.id).filter(Boolean),
        fileUrls: [coverImage || originalCover, ...additionalImages].filter(Boolean),
        coverImageUrl: coverImage || originalCover,
        watermarkText: defaultWatermarkText || "UEF",
        watermarkPosition: "bottom-right",
        semester: yearToSemester[projectYear] || "HK1",
        academicYear: yearToAcademic[projectYear] || "2024-2025",
      };
      await api.artworks.update(activeArtworkId, body);
      setMessage({ type: "success", text: t("updated") });
      setTimeout(() => setPage("dashboard"), 1000);
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Lỗi lưu" });
    }
    setSaving(false);
  };

  const handleFriendSearch = (val) => {
    setFriendInput(val);
    if (val.length < 2) { setFriendResults([]); return; }
    setFriendSearching(true);
    api.users.search(val).then(setFriendResults).catch(() => {}).finally(() => setFriendSearching(false));
  };

  const addFriend = (user) => {
    if (!friends.find(f => f.id === user.id)) {
      setFriends([...friends, { id: user.id, fullName: user.fullName, email: user.email, avatarUrl: user.avatarUrl }]);
    }
    setFriendInput("");
    setFriendResults([]);
  };

  const readFileAsDataURL = (file) => new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.readAsDataURL(file);
  });

  const handleCoverChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverImage(await readFileAsDataURL(file));
  };

  const handleAddImage = async (e) => {
    const files = Array.from(e.target.files || []);
    const max = 9 - additionalImages.length;
    const urls = await Promise.all(files.slice(0, max).map(readFileAsDataURL));
    setAdditionalImages(prev => [...prev, ...urls].slice(0, 9));
  };

  const removeImage = (idx) => {
    setAdditionalImages(prev => prev.filter((_, i) => i !== idx));
  };

  const handleDelete = async () => {
    if (!window.confirm("Cảnh báo: Việc xóa bài sẽ làm mất vĩnh viễn toàn bộ Like và Bình luận của bài viết này. Bạn có chắc chắn muốn tiếp tục?")) return;
    try {
      await api.artworks.delete(activeArtworkId);
      setPage("dashboard");
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Lỗi xóa" });
    }
  };

  if (loading) return <GlobalLoading />;

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] px-16 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-6 cursor-pointer hover:text-[#212121] transition-colors inline-flex" onClick={() => setPage("dashboard")}>
          <ArrowDownCircle className="rotate-90" size={16} /> {t("backToMyArtworks")}
        </div>
        <h2 className="text-2xl font-bold text-[#212121] mb-1">{t("editArtwork")}</h2>
        <p className="text-sm text-[#666666] mb-8">{t("updateArtworkDetails")}</p>
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("coverImage")}</label>
            <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer">
              <img src={coverImage || originalCover} alt="cover" className="w-full h-[360px] object-cover block" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer">
                  <span className="px-5 py-2.5 rounded-lg border-2 border-white text-white text-sm font-semibold flex items-center gap-2 hover:bg-white hover:text-[#212121] transition-colors"><Image size={16} /> {t("changeCoverImage")}</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("additionalImages")} ({additionalImages.length}/9)</label>
              <input type="file" id="editAdditionalInput" accept="image/*" multiple className="hidden" onChange={handleAddImage} />
              <div className="flex gap-2 flex-wrap">
                {additionalImages.map((url, idx) => (
                  <div key={idx} className="relative w-[90px] h-[72px] rounded-lg overflow-hidden border border-[#E0E0E0] group">
                    <img src={url} alt="" className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">×</button>
                  </div>
                ))}
                {additionalImages.length < 9 && (
                  <button onClick={() => document.getElementById("editAdditionalInput")?.click()} className="w-[90px] h-[72px] rounded-lg border-2 border-dashed border-[#E0E0E0] flex items-center justify-center text-[#666666] hover:border-[#1a4ba8] hover:text-[#1a4ba8] transition-colors cursor-pointer"><Plus size={22} /></button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("courseName")}</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none focus:border-[#1a4ba8] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("projectType")}</label><div className="flex gap-1.5">{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${projectYear === y ? 'bg-[#eef4ff] border-[#1a4ba8] text-[#1a4ba8]' : 'bg-[#F8F8F8] border-[#E0E0E0] text-[#666666]'}`}>{y}</button>))}</div></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("assignmentType")}</label><div className="flex gap-3">{[{ key: false, label: t("individual"), icon: <User size={16} /> }, { key: true, label: t("group"), icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg border cursor-pointer ${isGroupProject === opt.key ? 'bg-[#eef4ff] border-[#1a4ba8]' : 'bg-[#F8F8F8] border-[#E0E0E0]'}`}><span className={isGroupProject === opt.key ? 'text-[#1a4ba8]' : 'text-[#666666]'}>{opt.icon}</span><span className={`text-sm font-semibold ${isGroupProject === opt.key ? 'text-[#1a4ba8]' : 'text-[#212121]'}`}>{opt.label}</span></div>))}</div></div>
            {isGroupProject && (<div className="relative"><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("addTeamMembers")}</label><div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">{friends.map((f, i) => (<span key={f.id || i} className="inline-flex items-center gap-1.5 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full"><User size={12} /> {f.fullName || f}  <X size={10} className="cursor-pointer" onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder={t("enterNameOrEmail")} className="border-none bg-transparent outline-none text-sm min-w-[120px] text-[#212121] flex-1" /></div>{friendResults.length > 0 && (<div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto">{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8F8F8] cursor-pointer border-b border-[#E0E0E0] last:border-b-0"><img src={u.avatarUrl || ''} alt="" className="w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" /><div><p className="text-sm font-medium text-[#212121]">{u.fullName}</p><p className="text-xs text-[#666666]">{u.email}</p></div></div>))}</div>)}</div>)}
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("description")}</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none min-h-[80px] resize-y focus:border-[#1a4ba8] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("category")}</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:bg-white transition-colors cursor-pointer">
                <option value="">{t("selectOption")}</option>
                {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("tools")}</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tools.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTools(tools.filter(x => x !== t))} /></span>))}
                <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("tags")}</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tags.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter(x => x !== t))} /></span>))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder={t("addTag")} className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-[#E0E0E0] flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-3 rounded-lg border border-[#8B1A1A] text-[#8B1A1A] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={16} /> {t("deleteArtwork")}</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 rounded-lg border-none bg-[#1a4ba8] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50"><Check size={16} /> {saving ? t("saving") : t("saveChanges")}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}



function AdminUsersPage({ setPage }) {
    const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [importFileName, setImportFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const { userRole } = useAuth();
  const importInputRef = useRef(null);

  const roleLabel = { student: "Sinh viên", lecturer: t("lecturer"), admin: t("admin") };

  const fetchUsers = () => {
    setLoading(true);
    api.admin.users().then(res => { setUsers(res.users || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleEditChange = (field, value) => {
    setEditModal(prev => ({ ...prev, user: { ...prev.user, [field]: value } }));
  };

  const handleSaveUser = async () => {
    try {
      await api.admin.updateUser(editModal.user.id, editModal.user);
      alert("Đã lưu thông tin tài khoản thành công!");
      fetchUsers();
    } catch(e) {
      alert("Lỗi khi lưu: " + (e.message || ""));
    }
    setEditModal({ isOpen: false, user: null });
  };

  const toggleLockUser = async (user) => {
    try {
      await api.admin.lockUser(user.id, !user.isActive);
      fetchUsers();
    } catch {}
    setConfirmModal({ isOpen: false, user: null });
  };

  const setRole = async (userId, role) => {
    try {
      await api.admin.setUserRole(userId, role);
      fetchUsers();
    } catch {}
  };

  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => ({
      "Họ tên": u.fullName,
      "Email": u.email,
      "Vai trò": roleLabel[u.role] || u.role,
      "Ngày tham gia": u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—",
      "Trạng thái": u.isActive ? "Hoạt động" : "Bị khóa"
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(wb, "Accounts_Report.xlsx");
  };

  const handleDeleteUser = async (user) => {
    if (confirm("Bạn có chắc chắn muốn xóa người dùng " + user.fullName + "?")) {
      try {
        await api.admin.deleteUser(user.id);
        fetchUsers();
      } catch (e) {
        alert("Lỗi khi xóa: " + (e.message || ""));
      }
    }
  };

  const handleImportFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          
          const payload = json.map(row => {
            const roleStr = (row["Vai trò"] || row["Role"] || "").toLowerCase();
            return {
              fullName: row["Họ tên"] || row["FullName"] || row["Họ và tên"] || "Imported User",
              email: row["Email"] || row["email"] || `user_${Date.now()}@uef.edu.vn`,
              role: roleStr.includes("giảng viên") ? "lecturer" : roleStr.includes("quản trị") ? "admin" : "student",
              studentId: row["MSSV"] || row["Mã sinh viên"] || row["StudentId"] || null
            };
          });

          await api.admin.importUsers(payload);
          alert("Đã import dữ liệu thành công!");
          fetchUsers();
          setImportFileName("");
        } catch (err) {
          alert("Lỗi khi xử lý file: " + (err.message || ""));
          setImportFileName("");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      alert("Lỗi import: " + (err.message || ""));
      setImportFileName("");
    }

    e.target.value = "";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="admin_users" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#212121]">{t("manageAccounts")}</h2>
            <p className="text-sm text-[#666666] mt-1">{t("userListDescription")}</p>
          </div>
          <div className="flex items-center gap-3">
            <input
              ref={importInputRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={handleImportFile}
            />
            <button onClick={handleExportExcel} className="px-4 py-2 border border-[#1a4ba8] text-[#1a4ba8] rounded-lg text-sm font-semibold hover:bg-[#e0eaff] transition-colors flex items-center gap-2">
              <ArrowDownCircle size={16} />
              Export Excel
            </button>
            <button onClick={() => importInputRef.current?.click()} className="px-4 py-2 bg-[#1a4ba8] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2e6e] transition-colors flex items-center gap-2">
              <ArrowDownCircle size={16} className="-rotate-90" />
              Import Excel
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={t("searchUser")} className="pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#1a4ba8]" />
            </div>
          </div>
        </div>
        {importFileName && (
          <div className="mb-5 bg-[#e0eaff] border border-[#a8bce0] text-[#1a4ba8] rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <span className="font-medium">{t("selectedFile")}: {importFileName}</span>
            <button onClick={() => setImportFileName("")} className="text-[#1a4ba8] hover:text-[#0d2e6e] font-semibold text-sm">{t("deselect")}</button>
          </div>
        )}

        {loading ? <div className="text-center py-16 text-[#666666] text-sm">{t("loadingList")}</div> : users.length === 0 ? <div className="text-center py-16 text-[#666666] text-sm">{t("noUsers")}</div> : (
        <div className="border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("fullNameHeader")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("email")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("role")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("joinDate")}</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase())).map(u => {
                const roleVal = roleLabel[u.role] || u.role;
                const locked = !u.isActive;
                return (
                <tr key={u.id} onClick={(e) => { if (!e.target.closest("button")) setEditModal({ isOpen: true, user: u }) }} className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl || ''} className="w-8 h-8 rounded-full object-cover bg-[#E0E0E0]" />
                      <span className="text-sm font-semibold text-[#212121]">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">{u.email}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative inline-flex w-40">
                      <select
                        value={u.role}
                        onChange={(e) => setRole(u.id, e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
                      >
                        {Object.entries(roleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <button onClick={() => locked ? toggleLockUser(u) : setConfirmModal({ isOpen: true, user: u })} className={`px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer ${locked ? 'border-[#1a4ba8] text-[#1a4ba8] hover:bg-[#1a4ba8] hover:text-white' : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white'}`} title={locked ? t("unlock") : t("lockAccount")}>
                        {locked ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="text-xs font-semibold">{locked ? t("unlock") : t("lockAccount")}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
        )}
      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} className="text-[#8B1A1A]" />
            </div>
            <h3 className="font-bold text-lg text-[#212121] mb-2">{t("lockAccountQuestion")}</h3>
            <p className="text-sm text-[#666666] mb-6">{t("lockAccountConfirm")} <strong>{confirmModal.user?.name}</strong>? {t("lockAccountWarning")}</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ isOpen: false, user: null })} className="flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">{t("cancel")}</button>
              <button onClick={() => toggleLockUser(confirmModal.user)} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">{t("confirmLock")}</button>
            </div>
          </div>
        </div>
      )}

      {editModal.isOpen && editModal.user && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b pb-3">
              <h3 className="font-bold text-xl text-[#212121]">Chi tiết & Chỉnh sửa Tài khoản</h3>
              <button onClick={() => setEditModal({ isOpen: false, user: null })} className="text-[#666666] hover:text-black">
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Cột 1: Thông tin cơ bản */}
              <div className="space-y-4">
                <h4 className="font-semibold text-[#1a4ba8] border-b pb-2">Thông tin cơ bản</h4>
                <div className="flex items-center gap-4 mb-4">
                  <img src={editModal.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(editModal.user.fullName || "User")}&background=random`} alt="Avatar" className="w-16 h-16 rounded-full object-cover border border-gray-200" />
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Họ và tên</label>
                    <input type="text" value={editModal.user.fullName || ""} onChange={e => handleEditChange("fullName", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                  <input type="email" value={editModal.user.email || ""} onChange={e => handleEditChange("email", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" disabled />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Số điện thoại</label>
                  <input type="text" value={editModal.user.phone || ""} onChange={e => handleEditChange("phone", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Địa chỉ</label>
                  <input type="text" value={editModal.user.address || ""} onChange={e => handleEditChange("address", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Giới thiệu (Bio)</label>
                  <textarea value={editModal.user.bio || ""} onChange={e => handleEditChange("bio", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" rows={2} />
                </div>
              </div>

              {/* Cột 2: Thông tin định danh theo Role */}
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h4 className="font-semibold text-[#1a4ba8]">Thông tin định danh</h4>
                  <div className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md uppercase tracking-wider">{roleLabel[editModal.user.role] || editModal.user.role}</div>
                </div>

                {editModal.user.role === 'student' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Mã số sinh viên (MSSV)</label>
                      <input type="text" value={editModal.user.studentId || ""} className="w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 cursor-not-allowed" disabled title="MSSV không thể thay đổi" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Chuyên ngành (Major)</label>
                      <input type="text" value={editModal.user.major || ""} onChange={e => handleEditChange("major", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Khóa (Cohort)</label>
                      <input type="text" value={editModal.user.cohort || ""} onChange={e => handleEditChange("cohort", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="Ví dụ: K16" />
                    </div>
                  </>
                )}

                {editModal.user.role === 'lecturer' && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Khoa công tác</label>
                      <input type="text" value={editModal.user.department || ""} onChange={e => handleEditChange("department", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Học hàm / Học vị</label>
                      <input type="text" value={editModal.user.title || ""} onChange={e => handleEditChange("title", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="ThS, TS, v.v." />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Các lớp phụ trách</label>
                      <input type="text" value={editModal.user.managedClasses ? editModal.user.managedClasses.join(", ") : ""} onChange={e => handleEditChange("managedClasses", e.target.value.split(",").map(s => s.trim()))} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" placeholder="Nhập các lớp, phân cách bằng dấu phẩy" />
                    </div>
                  </>
                )}

                {(editModal.user.role === 'employer' || editModal.user.role === 'guest') && (
                  <>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Tên Công ty / Tổ chức</label>
                      <input type="text" value={editModal.user.company || ""} onChange={e => handleEditChange("company", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Chức vụ</label>
                      <input type="text" value={editModal.user.position || ""} onChange={e => handleEditChange("position", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Lĩnh vực (Industry)</label>
                      <input type="text" value={editModal.user.industry || ""} onChange={e => handleEditChange("industry", e.target.value)} className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" />
                    </div>
                  </>
                )}
                
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4">
              <button onClick={() => setEditModal({ isOpen: false, user: null })} className="px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50">Hủy</button>
              <button onClick={handleSaveUser} className="px-5 py-2 bg-[#1a4ba8] rounded-lg text-sm font-semibold text-white hover:bg-[#0d2e6e]">Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminArtworksPage({ setPage }) {
  const [data, setData] = useState({ artworks: [], totalPages: 0, counts: { all: 0, reported: 0, pending: 0, hidden: 0, highlight: 0 } });
  const [page, setPageNum] = useState(1);
  const [limit] = useState(20);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [query, setQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState(t("all"));
  const [filterYear, setFilterYear] = useState(t("all"));
  const [filterTool, setFilterTool] = useState(t("all"));
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, mode: "delete", artId: null });
  const [galleryIdx, setGalleryIdx] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const observerTarget = useRef(null);
  const fetchId = useRef(0);

  const fetchArtworks = () => {
    const id = ++fetchId.current;
    setLoading(true);
    const params = { page, limit, tab: activeTab };
    if (query.trim()) params.q = query.trim();
    if (filterSubject !== t("all")) params.subject = filterSubject;
    if (filterYear !== t("all")) params.year = filterYear;
    
    api.admin.artworks(params).then(res => {
      if (id === fetchId.current) {
        setData(prev => ({
          ...res,
          artworks: page === 1 ? (res.artworks || []) : [...(prev.artworks || []), ...(res.artworks || [])],
          counts: res.counts || { all: 0, reported: 0, pending: 0, hidden: 0, highlight: 0 }
        }));
        setLoading(false);
      }
    }).catch(() => { if (id === fetchId.current) setLoading(false); });
  };

  useEffect(() => {
    fetchArtworks();
  }, [page, limit, activeTab, query, filterSubject, filterYear]);

  useEffect(() => {
    setPageNum(1);
    setSelectedIds([]);
  }, [activeTab, query, filterSubject, filterYear]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading && (data.page || 1) < (data.totalPages || 0)) {
          setPageNum(p => p + 1);
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => { if (observerTarget.current) observer.unobserve(observerTarget.current); };
  }, [loading, data.page, data.totalPages]);

  const filtered = data.artworks || [];
  const selected = filtered.find((a) => a.id === selectedId) ?? null;

  const handleOpenGallery = (idx) => {
    const imgs = Array.from(new Set([selected?.coverImageUrl, ...(selected?.fileUrls || [])].filter(Boolean)));
    setGalleryImages(imgs);
    setGalleryIdx(idx);
  };

  useEffect(() => {
    if (!selectedId) { setReports([]); return; }
    setReportsLoading(true);
    api.artworks.reports(selectedId).then(setReports).catch(() => setReports([])).finally(() => setReportsLoading(false));
  }, [selectedId]);

  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? filtered.map((a) => a.id) : []);
  };

  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => (checked ? Array.from(new Set([...prev, id])) : prev.filter((x) => x !== id)));
  };

  const approveArtwork = async (id) => {
    try { await api.admin.setArtworkStatus(id, true); fetchArtworks(); } catch {}
    setSelectedIds([]);
  };

  const hideArtwork = async (id) => {
    try { await api.admin.setArtworkStatus(id, false); fetchArtworks(); } catch {}
    setSelectedIds([]);
  };

  const toggleHighlight = async (id, val) => {
    try { await api.admin.toggleArtworkHighlight(id, val); fetchArtworks(); } catch {}
  };

  const removeItems = async (ids) => {
    try { await Promise.all(ids.map(id => api.admin.deleteArtwork(id))); fetchArtworks(); } catch {}
    setSelectedIds([]);
    if (ids.includes(selectedId)) {
      const next = filtered.find((a) => !ids.includes(a.id));
      setSelectedId(next?.id ?? null);
    }
  };

  const badge = (s) => {
    if (s === t("violation")) return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Bị báo cáo") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Đã ẩn") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "Nổi bật") return "bg-blue-50 text-[#1a4ba8] border border-[#a8bce0]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };

  const statusText = (s) => {
    if (s === "Đang hiển thị") return t("public");
    if (s === "Bị báo cáo") return t("report");
    return s;
  };

  const openConfirm = (mode, artId) => setConfirmModal({ isOpen: true, mode, artId });
  const closeConfirm = () => setConfirmModal({ isOpen: false, mode: "delete", artId: null });

  const confirmAction = () => {
    if (!confirmModal.artId) return;
    if (confirmModal.mode === "delete") removeItems([confirmModal.artId]);
    if (confirmModal.mode === "hide") hideArtwork(confirmModal.artId);
    closeConfirm();
  };

  const tabCount = (key) => {
    return data.counts ? (data.counts[key] || 0) : 0;
  };

  const FilterSelect = ({ value, onChange, children }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
      >
        {children}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="admin_artworks" setPage={setPage} />

      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-[#E0E0E0]">
          <div className="flex items-start justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#212121]">{t("processArtworks")}</h2>
              <p className="text-sm text-[#666666] mt-1">{t("processArtworksDesc")}</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: t("all") },
              { key: "reported", label: t("report") },
              { key: "pending", label: t("pending") },
              { key: "hidden", label: t("hidden") },
              { key: "highlight", label: t("highlighted") },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => { setActiveTab(t.key); setSelectedIds([]); }}
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${
                  activeTab === t.key ? "bg-[#212121] text-white border-[#212121]" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"
                }`}
              >
                {t.label} <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === t.key ? "bg-white/15 text-white" : "bg-[#F8F8F8] border border-[#E0E0E0] text-[#666666]"}`}>{tabCount(t.key)}</span>
              </button>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchArtworkStudentTags")} className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
            </div>
            <FilterSelect value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="Tất cả">{t("subjectAll")}</option>
              <option value="Thiết kế TH">Thiết kế TH</option>
              <option value="Đồ hoạ ứng dụng">Đồ hoạ ứng dụng</option>
              <option value="Motion Design">Motion Design</option>
              <option value="UX/UI">UX/UI</option>
            </FilterSelect>
            <FilterSelect value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="Tất cả">{t("yearAll")}</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </FilterSelect>
            <FilterSelect value={filterTool} onChange={(e) => setFilterTool(e.target.value)}>
              <option value="Tất cả">{t("toolAll")}</option>
              <option value="Illustrator">Illustrator</option>
              <option value="Photoshop">Photoshop</option>
              <option value="Figma">Figma</option>
              <option value="Blender">Blender</option>
              <option value="Procreate">Procreate</option>
            </FilterSelect>

            <div className="flex items-center gap-2 ml-auto">
              <button
                onClick={() => { selectedIds.forEach(id => hideArtwork(id)); setSelectedIds([]); }}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#212121] border-[#E0E0E0] hover:bg-[#F8F8F8]"
                }`}
              >
                {t("hideSelected")}
              </button>
              <button
                onClick={() => toggleHighlight(selectedIds)}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"
                }`}
              >
                Highlight
              </button>
              <button
                onClick={() => setSelectedIds([])}
                disabled={selectedIds.length === 0}
                className={`px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"
                }`}
              >
                {t("deselect")}
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex">
          <div className="w-[65%] border-r border-[#E0E0E0] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-[#E0E0E0]">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selectedIds.length > 0 && selectedIds.length === filtered.length}
                  onChange={(e) => toggleSelectAll(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-semibold text-[#212121]">{filtered.length} {t("artworks")}</span>
              </div>
              {selectedIds.length > 0 && (
                <span className="text-sm text-[#666666]">{t("selected")} {selectedIds.length}</span>
              )}
            </div>

            <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-10"></th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("artworkStudent")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("subject")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">{t("date")}</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-36">{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center justify-center text-[#666]">
                          <div className="w-8 h-8 border-4 border-[#1a4ba8]/20 border-t-[#1a4ba8] rounded-full animate-spin mb-4"></div>
                          <p className="font-semibold">{t("loadingData") || "Đang tải..."}</p>
                        </div>
                      </td>
                    </tr>
                  ) : filtered.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-4 py-12 text-center text-[#666666]">
                        Không tìm thấy ấn phẩm nào.
                      </td>
                    </tr>
                  ) : filtered.map((a) => (
                    <tr
                      key={a.id}
                      onClick={() => setSelectedId(a.id)}
                      className={`border-b transition-colors cursor-pointer ${
                        selectedId === a.id ? "bg-[#e0eaff]" : (a._count?.reports || 0) > 0 ? "bg-red-50" : a.isPending ? "bg-amber-50" : "bg-white"
                      } ${
                        (a._count?.reports || 0) > 0 ? "border-l-4 border-l-[#8B1A1A]" : "border-[#E0E0E0]"
                      } hover:bg-[#F8F8F8]`}
                    >
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(a.id)}
                          onChange={(e) => toggleSelect(a.id, e.target.checked)}
                          onClick={(e) => e.stopPropagation()}
                          className="w-4 h-4"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={a.coverImageUrl} className="w-10 h-10 rounded-md object-cover bg-[#E0E0E0] border border-[#E0E0E0]" />
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-[#212121] truncate">{a.title}</p>
                            <p className="text-xs text-[#666666] truncate">{a.user?.fullName || ""}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.subject}</td>
                      <td className="px-4 py-3 text-sm text-[#666666]">{a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium ${a.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                            {a.isPublic ? <Check size={12} className="text-green-600" /> : <EyeOff size={12} className="text-[#666666]" />}
                            {a.isPublic ? t("public") : t("private")}
                          </span>
                          {(a._count?.reports || 0) > 0 && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B1A1A] bg-red-50 px-2 py-0.5 rounded-full border border-[#F5C5C5]">
                              <ShieldAlert size={11} /> {(a._count?.reports || 0)}
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-12 text-[#666666]">{t("noMatchingArtworks")}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#F8F8F8]">
            {!selected && (
              <div className="bg-white border border-[#E0E0E0] rounded-xl p-8 text-center text-[#666666]">
                {t("selectArtworkToViewDetails")}
              </div>
            )}

            {selected && (
              <div className="bg-white border border-[#E0E0E0] rounded-md overflow-hidden">
                <div className="p-4 border-b border-[#E0E0E0] flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("artworkDetails")}</p>
                    <h3 className="text-base font-semibold text-[#212121] truncate">{selected.title}</h3>
                    <p className="text-[13px] text-[#666666] mt-0.5">{selected.student}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-[13px] font-medium text-[#666666] hover:text-[#212121] transition-colors">{t("close")}</button>
                </div>

                <div className="p-4">
                  <div className="rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer" onClick={() => handleOpenGallery(0)}>
                    <img src={selected.coverImageUrl} className="w-full h-44 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-[13px] font-medium transition-opacity">{t("clickToZoom")}</span>
                    </div>
                  </div>
                  {(selected.fileUrls || []).length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {Array.from(new Set([selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean))).map((url, idx) => (
                        <div key={idx} className="w-10 h-8 rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer hover:border-[#1a4ba8] transition-colors" onClick={() => handleOpenGallery(idx)}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("subject")}</p>
                      <p className="text-[13px] text-[#333]">{selected.subject}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("tools")}</p>
                      <p className="text-[13px] text-[#333]">{(selected.toolsUsed || []).join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("status")}</p>
                      <span className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] px-2 py-0.5 rounded-full ${selected.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                        {selected.isPublic ? <Check size={10} className="text-green-600" /> : <EyeOff size={10} />}
                        {selected.isPublic ? t("public") : t("private")}
                      </span>
                    </div>
                    <div>
                      <p className="text-[11px] text-[#888] uppercase tracking-wide mb-1">{t("score")}</p>
                      <p className="text-[13px] text-[#333]">{selected.score ?? t("notGraded") }</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <a href={`${window.location.origin}/#/detail/${selected.id}`} target="_blank" rel="noopener noreferrer" className="text-[13px] text-[#1a4ba8] hover:text-[#0d2e6e] font-medium flex items-center gap-1.5 transition-colors">
                      <ExternalLink size={12} /> {t("viewDetails")}: {selected.title}
                    </a>
                  </div>

                  <div className="mt-4">
                    <p className="text-[11px] text-[#888] uppercase tracking-wide mb-2 flex items-center gap-1.5">
                      <ShieldAlert size={12} /> {t("reportViolation")} {reports.length > 0 && <span className="bg-[#8B1A1A] text-white text-[9px] px-1.5 py-0.5 rounded-full">{reports.length}</span>}
                    </p>
                    {reportsLoading ? (
                      <p className="text-[13px] text-[#666666]">{t("loading")}</p>
                    ) : reports.length === 0 ? (
                      <p className="text-[12px] text-[#666666] bg-[#F8F8F8] rounded-md p-2 border border-[#E0E0E0]">{t("noReportsForArtwork")}</p>
                    ) : (
                      <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
                        {reports.map(r => (
                          <div key={r.id} className="bg-[#F8F8F8] rounded-md p-2.5 border border-[#E0E0E0]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-[11px] font-medium text-[#8B1A1A] bg-red-50 px-1.5 py-0.5 rounded border border-[#F5C5C5]">{r.violationType}</span>
                              <span className={`text-[9px] font-medium px-1.5 py-0.5 rounded-full ${r.status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : r.status === "resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                                {r.status === "pending" ? t("pending") : r.status === "resolved" ? t("processed") : t("dismissed")}
                              </span>
                            </div>
                            {r.detail && <p className="text-[12px] text-[#212121] mb-1.5">{r.detail}</p>}
                            <div className="flex items-center justify-between">
                              <p className="text-[9px] text-[#666666]">
                                {t("by")} {r.user?.fullName || r.user?.email || t("user") } · {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                              {r.status === "pending" && (
                                <div className="flex gap-1">
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "resolved").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "resolved" } : x)))} className="text-[9px] font-medium text-green-700 bg-green-50 px-1.5 py-0.5 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">{t("resolve")}</button>
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "dismissed").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "dismissed" } : x)))} className="text-[9px] font-medium text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">{t("dismiss")}</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {!selected.isPublic ? (
                      <button onClick={() => approveArtwork(selected.id)} className="py-2 rounded-md border border-[#1a4ba8] bg-white text-[#1a4ba8] text-[13px] font-medium hover:bg-[#eef4ff] transition-colors">
                        <Check size={12} className="inline mr-1" /> {t("approveArtwork")}
                      </button>
                    ) : (
                      <button onClick={() => hideArtwork(selected.id)} className="py-2 rounded-md border border-[#E0E0E0] bg-white text-[13px] font-medium text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors">
                        {t("hideArtwork")}
                      </button>
                    )}
                    <button onClick={() => openConfirm("delete", selected.id)} className="py-2 rounded-md border border-[#F5C5C5] bg-red-50 text-[13px] font-medium text-[#8B1A1A] hover:bg-red-100 transition-colors">
                      {t("deletePermanently")}
                    </button>
                  </div>

                  <button onClick={() => toggleHighlight(selected.id, !selected.isHighlighted)} className={`mt-2 w-full py-2 rounded-md text-[13px] font-medium border transition-colors ${
                    selected.isHighlighted ? "bg-[#212121] text-white border-[#212121]" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"
                  }`}>
                    {selected.isHighlighted ? t("removeHighlight") : t("highlightArtwork")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col p-6 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldAlert size={28} className="text-[#8B1A1A]" />
            </div>
            <h3 className="font-bold text-lg text-[#212121] mb-2">{confirmModal.mode === "hide" ? t("hideArtworkQuestion") : t("deleteArtworkQuestion")}</h3>
            <p className="text-sm text-[#666666] mb-6">
              {confirmModal.mode === "hide"
                ? t("hideArtworkWarning")
                : t("deleteArtworkWarning")}
            </p>
            <div className="flex gap-3">
              <button onClick={closeConfirm} className="flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">{t("cancel")}</button>
              <button onClick={confirmAction} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">{t("confirm")}</button>
            </div>
          </div>
        </div>
      )}

      {galleryIdx !== null && galleryImages.length > 0 && (
        <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center" onClick={() => setGalleryIdx(null)}>
          <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(prev => Math.max(0, prev - 1)); }} className="absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none">&lsaquo;</button>
          <img src={galleryImages[galleryIdx]} alt="" className="max-w-[90vw] max-h-[90vh] object-contain" onClick={(e) => e.stopPropagation()} />
          <button onClick={(e) => { e.stopPropagation(); setGalleryIdx(prev => Math.min(galleryImages.length - 1, prev + 1)); }} className="absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none">&rsaquo;</button>
          <button onClick={() => setGalleryIdx(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer"><X size={20} /></button>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm">{galleryIdx + 1} / {galleryImages.length}</div>
        </div>
      )}
    </div>
  );
}

function AdminExportPage({ setPage, collections, onOpenExportConfig, onQuickCreateCollection, onOpenCatalogBuilder }) {
    return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_export" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8 pb-6 border-b border-[#E0E0E0]">
          <div>
            <h2 className="text-2xl font-bold text-[#212121]">{t("exportPdfConfig")}</h2>
            <p className="text-sm text-[#666666] mt-1">
              {t("exportPdfConfigDesc")}
            </p>
          </div>
          <button
            onClick={() => onQuickCreateCollection && onQuickCreateCollection()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1a4ba8] text-white rounded-xl font-bold hover:bg-[#0d2e6e] transition-colors shadow-sm cursor-pointer w-full lg:w-auto"
          >
            <Plus size={18} />
            {t("createNewCollection")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {collections.length === 0 && (
            <div className="col-span-full py-24 px-6 text-center border border-indigo-100/60 rounded-3xl bg-gradient-to-br from-[#f8fafe] via-white to-[#f0f4ff] shadow-sm relative overflow-hidden group">
              {/* Background decorative blobs */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 translate-x-1/2 translate-y-1/2"></div>
              
              <div className="relative z-10">
                <div className="w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative">
                  <div className="absolute inset-0 rounded-full border border-[#1a4ba8]/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                  <div className="w-16 h-16 bg-[#f0f4ff] rounded-full flex items-center justify-center">
                    <FolderPlus className="text-[#1a4ba8]" size={32} strokeWidth={1.5} />
                  </div>
                </div>
                
                <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1a4ba8] to-[#0d2e6e] tracking-tight mb-3">
                  Chưa có Moodboard nào
                </h3>
                <p className="text-[#666666] text-base mb-8 max-w-md mx-auto leading-relaxed">
                  Hãy tạo Moodboard mới để lưu trữ, phân loại và xuất bản các ấn phẩm đồ án xuất sắc nhất.
                </p>
                
                <button
                  onClick={() => onQuickCreateCollection && onQuickCreateCollection()}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a4ba8] text-white rounded-full font-bold hover:bg-[#0d2e6e] shadow-[0_8px_20px_-6px_rgba(26,75,168,0.4)] hover:shadow-[0_14px_25px_-6px_rgba(26,75,168,0.5)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
                >
                  <Plus size={20} strokeWidth={2.5} />
                  {t("createNewCollection", "Tạo Moodboard Mới")}
                </button>
              </div>
            </div>
          )}
          {collections.map((c) => {
            const coverImage = c.items?.[0]?.artwork?.coverImageUrl || c.items?.[0]?.coverImageUrl || c.items?.[0]?.artwork?.img || c.items?.[0]?.img || null;
            return (
              <div
                key={c.id}
                onClick={() => onOpenExportConfig && onOpenExportConfig(c.id)}
                className="group relative bg-white rounded-[16px] overflow-hidden border border-[#E0E0E0] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
              >
                <div className="relative h-[200px] w-full bg-[#8f8f8f]">
                  {coverImage && <img src={coverImage} className="w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                  
                  <div className="absolute top-3 right-3 flex gap-2">
                    <div className="bg-white/20 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors" title={t("openConfig")}>
                      <FileDown size={14} />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none">
                    <div>
                      <h3 className="text-lg font-bold text-white drop-shadow-md m-0 truncate pr-4">{c.name}</h3>
                      <p className="text-[13px] text-white/80 mt-1 mb-0">Cập nhật: {new Date(c.updatedAt || Date.now()).toLocaleDateString()}</p>
                    </div>
                    <span className="bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-bold whitespace-nowrap">
                      {c.items?.length || 0} mục
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortableArtworkCard({ item, id, onClick, deleteMode, isSelected, onToggleSelect, isHidden, onToggleHide }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isHidden ? 0.4 : (isDragging ? 0.8 : 1),
  };

  const badgeColors = {
    "Vàng": "#ecc94b",
    "Bạc": "#a0aec0",
    "Đồng": "#ed8936",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group relative bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${isSelected ? "border-[#1a4ba8] shadow-md ring-2 ring-[#1a4ba8]/20" : "border-[#E0E0E0] hover:shadow-md hover:border-[#1a4ba8]"}`}
      onClick={onClick}
    >
      <div className="aspect-[4/3] bg-[#F8F8F8] overflow-hidden relative">
        <img
          src={item.artwork?.coverImageUrl || item.artwork?.img || ""}
          alt={item.artwork?.title || ""}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          draggable={false}
        />
        {item.category && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider">
            {item.category}
          </div>
        )}
        {item.award && item.award !== "Không có" && (
          <div className="absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm" style={{ backgroundColor: badgeColors[item.award] || "#fff", color: item.award==="Vàng" ? "#744210" : (item.award==="Bạc" ? "#2d3748" : "#7b341e") }} title={`Giải ${item.award}`}>
            ★
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-[#212121] truncate">{item.artwork?.title || "Untitled"}</p>
        <p className="text-xs text-[#666666] truncate">{item.artwork?.user?.fullName || item.artwork?.student || ""}</p>
      </div>

      {deleteMode ? (
        <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            className="w-5 h-5 accent-[#8B1A1A] cursor-pointer shadow-sm"
          />
        </div>
      ) : (
        <>
          <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1 cursor-grab" {...attributes} {...listeners}>
            <GripVertical size={16} />
          </div>
          <div className="absolute top-2 right-9 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1" onClick={(e) => { e.stopPropagation(); onToggleHide(); }}>
            {isHidden ? <EyeOff size={16} /> : <Eye size={16} />}
          </div>
        </>
      )}
    </div>
  );
}

function CollectionExportConfigPage({ setPage, collection, onUpdateCollection, onOpenCatalogBuilder }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [detailArtwork, setDetailArtwork] = useState(null);
  const [saved, setSaved] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  if (!collection) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_export" setPage={setPage} />
        <div className="flex-1 p-8">
          <p className="text-sm text-[#666666]">{t("collectionNotFound")}</p>
          <button onClick={() => setPage("admin_export")} className="mt-4 px-4 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold hover:bg-[#F8F8F8]">
            {t("goBack")}
          </button>
        </div>
      </div>
    );
  }

  const detailedItems = collection.items.filter((it) => it.artwork);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = detailedItems.findIndex(it => it.artworkId === active.id);
      const newIndex = detailedItems.findIndex(it => it.artworkId === over.id);
      const next = arrayMove(collection.items, oldIndex, newIndex);
      onUpdateCollection && onUpdateCollection({ items: next });
    }
  };

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDelete([]);
  };

  const toggleSelectDelete = (artworkId) => {
    setSelectedForDelete((prev) =>
      prev.includes(artworkId) ? prev.filter((x) => x !== artworkId) : [...prev, artworkId]
    );
  };

  const executeDelete = () => {
    if (selectedForDelete.length === 0) return;
    const next = collection.items.filter((it) => !selectedForDelete.includes(it.artworkId));
    onUpdateCollection && onUpdateCollection({ items: next });
    setSelectedForDelete([]);
    setDeleteMode(false);
    setDetailArtwork(null);
  };

  const toggleHide = (artworkId) => {
    const next = collection.items.map(it => it.artworkId === artworkId ? { ...it, isHidden: !it.isHidden } : it);
    onUpdateCollection && onUpdateCollection({ items: next });
  };

  const updateDetailArtwork = (updates) => {
    if (!detailArtwork) return;
    const updated = { ...detailArtwork, ...updates };
    setDetailArtwork(updated);
    const nextItems = collection.items.map(it => it.artworkId === detailArtwork.artworkId ? updated : it);
    onUpdateCollection && onUpdateCollection({ items: nextItems });
  };

  const activeCount = detailedItems.filter(it => !it.isHidden).length;

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_export" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8 flex flex-col">
        <div className="flex items-start justify-between gap-6 mb-8 pb-6 border-b border-[#E0E0E0] flex-shrink-0">
          <div className="min-w-0 flex-1 max-w-xl">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Quản lý Moodboard</p>
            <input
              value={collection.name}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ name: e.target.value })}
              className="w-full text-2xl font-bold text-[#212121] bg-transparent border-none outline-none placeholder:text-[#ccc]"
              placeholder={t("collectionNamePlaceholder")}
            />
            <textarea
              value={collection.curatorEssay || ""}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ curatorEssay: e.target.value })}
              className="w-full mt-2 text-sm text-[#666666] bg-transparent border-none outline-none resize-none placeholder:text-[#ccc]"
              rows={2}
              placeholder={t("collectionDescPlaceholder")}
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setPage("admin_export")} className="px-4 py-2.5 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
              {t("goBack")}
            </button>
            <button onClick={() => { onOpenCatalogBuilder && onOpenCatalogBuilder(collection); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer bg-[#1a4ba8] text-white hover:bg-[#0d2e6e]`}>
              <Settings size={16} /> Thiết lập Xuất Tập San
            </button>
          </div>
        </div>

        <div className="flex gap-8 flex-1 min-h-0">
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex items-center justify-between mb-4 flex-shrink-0">
              <p className="text-sm font-semibold text-[#212121]">
                {detailedItems.length} ấn phẩm ({activeCount} hiển thị)
              </p>
              <div className="flex items-center gap-2">
                {deleteMode && (
                  <>
                    <span className="text-sm text-[#666666]">{t("selected")} {selectedForDelete.length}</span>
                    <button onClick={executeDelete} disabled={selectedForDelete.length === 0} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedForDelete.length > 0 ? "bg-[#8B1A1A] text-white" : "bg-[#E0E0E0] text-[#999]"}`}>
                      {t("delete")}
                    </button>
                  </>
                )}
                <button onClick={toggleDeleteMode} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${deleteMode ? "bg-[#8B1A1A] text-white border-[#8B1A1A]" : "bg-white text-[#666] border-[#E0E0E0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"}`}>
                  <Trash2 size={14} /> {deleteMode ? t("exitDeleteMode") : t("deleteArtwork")}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 pb-10">
              {detailedItems.length === 0 ? (
                <div className="text-sm text-[#666666] border border-dashed border-[#E0E0E0] rounded-xl p-8 text-center">
                  {t("noArtworksInCollectionMsg")}
                </div>
              ) : (
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={detailedItems.map(it => it.artworkId)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-3 xl:grid-cols-4 gap-4">
                      {detailedItems.map((it) => (
                        <SortableArtworkCard
                          key={it.artworkId}
                          id={it.artworkId}
                          item={it}
                          deleteMode={deleteMode}
                          isSelected={detailArtwork?.artworkId === it.artworkId || selectedForDelete.includes(it.artworkId)}
                          isHidden={it.isHidden}
                          onToggleHide={() => toggleHide(it.artworkId)}
                          onToggleSelect={() => deleteMode ? toggleSelectDelete(it.artworkId) : setDetailArtwork(it)}
                          onClick={() => !deleteMode && setDetailArtwork(it)}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              )}
            </div>
          </div>

          {detailArtwork && (
            <div className="w-80 flex-shrink-0 flex flex-col bg-[#F8F8F8] border border-[#E0E0E0] rounded-2xl overflow-hidden self-start">
              <div className="px-5 py-4 border-b border-[#E0E0E0] flex items-center justify-between bg-white">
                <h3 className="font-bold text-[#212121] text-sm truncate pr-4">{detailArtwork.artwork?.title}</h3>
                <button onClick={() => setDetailArtwork(null)} className="text-[#666] hover:text-[#212121]"><X size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-5 flex-1 overflow-y-auto">
                <div className="aspect-[4/3] bg-white rounded-lg overflow-hidden border border-[#E0E0E0]">
                  <img src={detailArtwork.artwork?.coverImageUrl || detailArtwork.artwork?.img} alt="" className="w-full h-full object-cover" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Chuyên đề (Category)</label>
                  <input
                    type="text"
                    value={detailArtwork.category || detailArtwork.artwork?.category || ""}
                    onChange={(e) => updateDetailArtwork({ category: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]"
                    placeholder="VD: Brand Identity, Typography..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Giải thưởng (Award)</label>
                  <select
                    value={detailArtwork.award || "Không có"}
                    onChange={(e) => updateDetailArtwork({ award: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]"
                  >
                    <option value="Không có">Không có</option>
                    <option value="Vàng">Vàng</option>
                    <option value="Bạc">Bạc</option>
                    <option value="Đồng">Đồng</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Ghi chú của Giảng viên</label>
                  <textarea
                    value={detailArtwork.note || ""}
                    onChange={(e) => updateDetailArtwork({ note: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] resize-none"
                    placeholder="Nhận xét ngắn gọn về tác phẩm..."
                  />
                </div>
                
                <div className="mt-2 text-[11px] text-[#888]">
                  Mọi thay đổi trên panel này sẽ được lưu tự động vào Moodboard.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminWatermarkPage({ setPage }) {
  const [watermarkText, setWatermarkText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetch("/api/site-settings")
      .then(r => r.json())
      .then(data => {
        setWatermarkText(data.watermark_text || "UEF");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/site-settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "watermark_text", value: watermarkText.trim() || "UEF" }),
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage({ type: "success", text: t("watermarkSaved") });
    } catch {
      setMessage({ type: "error", text: t("watermarkSaveFailed") });
    }
    setSaving(false);
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%" }}><p style={{ color: MUTED }}>{t("loading")}</p></div>;
  }

  return (
    <div style={{ display: "flex", height: "100%" }}>
      <AdminSidebar active="admin_watermark" setPage={setPage} />
      <div style={{ flex: 1, padding: 32, overflowY: "auto" }}>
        <div style={{ maxWidth: 600 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "#e0eaff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: CERULEAN, fontSize: 18, fontWeight: 700 }}>W</span>
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: BLACK, margin: 0 }}>{t("watermarkSettings")}</h2>
              <p style={{ fontSize: 13, color: MUTED, margin: "2px 0 0" }}>{t("watermarkSettingsDesc")}</p>
            </div>
          </div>

          <div style={{ background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}`, padding: 24, marginTop: 20 }}>
            <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 6 }}>
              {t("watermarkText")}
            </label>
            <input
              type="text"
              value={watermarkText}
              onChange={e => setWatermarkText(e.target.value)}
              placeholder={t("watermarkTextPlaceholder")}
              style={{ width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box" }}
            />
            <p style={{ fontSize: 12, color: MUTED, margin: "8px 0 0", lineHeight: 1.5 }}>
              {t("watermarkTextHint")}
            </p>
          </div>

          <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={handleSave}
              disabled={saving}
              style={{ padding: "10px 28px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? t("saving") : t("saveSettings")}
            </button>
            {message.text && (
              <span style={{ fontSize: 13, color: message.type === "success" ? "#166534" : CRIMSON, fontWeight: 500 }}>
                {message.text}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RegisterPage({ setPage }) {
  const [form, setForm] = useState({ lastName: "", firstName: "", email: "", password: "", confirmPassword: "" });
  const [showPasswords, setShowPasswords] = useState({ password: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("form");
  const [code, setCode] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const updateField = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.lastName || !form.firstName) { setError(t("enterFullName")); return; }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError(t("invalidEmail")); return; }
    if (form.password.length < 8) { setError(t("passwordMinLength")); return; }
    if (form.password !== form.confirmPassword) { setError(t("passwordMismatch")); return; }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          fullName: `${form.lastName} ${form.firstName}`.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("verify");
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => { if (c <= 1) clearInterval(timer); return c - 1; }), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!code || code.length < 6) { setError("Vui lòng nhập mã xác thực"); return; }
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("success");
      setTimeout(() => setPage("auth"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setError(""); setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => { if (c <= 1) clearInterval(timer); return c - 1; }), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", background: "#1a1a2e url(/background-login.jpg) center/cover no-repeat" }}>
      <div style={{ width: "100%", maxWidth: 448, margin: "32px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "32px 32px 24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
            <img src="/logo-uef.png" alt="UEF" style={{ height: 72 }} />
            <img src="/qs-stars.png" alt="QS Stars" style={{ height: 40 }} />
          </div>
          <h4 style={{ margin: "20px 0 6px", fontWeight: 700, fontSize: 19, fontFamily: "'Public Sans', sans-serif", color: "rgba(0,114,188,0.78)", textTransform: "uppercase", textAlign: "center" }}>UEF PORTFOLIO</h4>
          <p style={{ margin: "0 0 24px", fontSize: 15, fontWeight: 400, color: "rgba(47,43,61,0.68)", background: "#e3efff", padding: "12px 16px", borderRadius: 6, textAlign: "center", lineHeight: 1.5 }}>
            Tạo tài khoản để bắt đầu trưng bày tác phẩm của bạn trên UEF Portfolio
          </p>

          {step === "form" && (
            <>
              <form onSubmit={handleSubmit}>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("lastName")}</label>
                      <input type="text" value={form.lastName} onChange={updateField("lastName")} required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("firstName")}</label>
                      <input type="text" value={form.firstName} onChange={updateField("firstName")} required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("email")}</label>
                    <input type="email" value={form.email} onChange={updateField("email")} required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("password")}</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPasswords.password ? "text" : "password"} value={form.password} onChange={updateField("password")} required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                      <button type="button" onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("confirmPassword")}</label>
                    <div style={{ position: "relative" }}>
                      <input type={showPasswords.confirm ? "text" : "password"} value={form.confirmPassword} onChange={updateField("confirmPassword")} required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                      <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                    </div>
                  </div>
                </div>
                {error && <p style={{ color: "#E53E3E", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</p>}
                <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer" }}>
                  {loading ? t("processing") : t("register")}
                </button>
              </form>
              <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>{t("alreadyHaveAccount")} <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("login")}</span></p>
            </>
          )}

          {step === "verify" && (
            <>
              <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" }}>{t("verifyEmail")}</h1>
              <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("resetCodeSentDesc")}</p>

              {error && (
                <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 }}>
                  <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
                  <p style={{ color: "#C53030", fontSize: 12, margin: 0 }}>{error}</p>
                </div>
              )}

              <div style={{ marginBottom: 16 }}>
                <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("enterResetCode")}</label>
                <input type="text" value={code} onChange={(e) => { setCode(e.target.value.replace(/\D/g, "").slice(0, 6)); setError(""); }} placeholder="000000" maxLength={6} style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" }} />
              </div>
              <button onClick={handleVerifyCode} disabled={loading || code.length < 6} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                {loading ? <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("processing")}</> : t("verifyEmailButton")}
              </button>
              {cooldown > 0 ? (
                <p style={{ fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 }}>{t("resendCode")} ({cooldown}s)</p>
              ) : (
                <p onClick={handleResendCode} style={{ fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 }}>{t("resendCode")}</p>
              )}
              <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>
                <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("backToLogin")}</span>
              </p>
            </>
          )}

          {step === "success" && (
            <div style={{ padding: 20, background: "#F0FFF0", borderRadius: 8, textAlign: "center" }}>
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2F855A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <p style={{ color: "#2F855A", fontWeight: 600, fontSize: 14 }}>{t("registerSuccess")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function LandingPage({ setPage, isLoggedIn, setActiveArtworkId }) {
  const { user } = useAuth();
  const userRole = user?.role;
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  const { getContentBySection, getContentItems, getSetting } = useSiteContent();
  const hero = getContentBySection('home', 'hero');
  const stats = getContentItems('home', 'stats');
  const features = getContentItems('home', 'features');
  const steps = getContentItems('home', 'steps');
  const testimonials = getContentItems('home', 'testimonials');
  const cta = getContentBySection('home', 'cta');
  const footerInfo = getContentBySection('footer', 'footerInfo');
  const footerLinks = getContentItems('footer', 'footerLinks');

  const dynamicCats = getSetting('homeCategories');
  const categories = dynamicCats 
    ? dynamicCats.split(',').map(c => ({ key: c.trim(), label: c.trim().toLowerCase() }))
    : [
        { key: "3D Art", label: "3d art" },
        { key: "Branding", label: "branding" },
        { key: "Poster", label: "poster" },
        { key: "Packaging", label: "packaging" },
      ];

  useEffect(() => {
    api.artworks.list({ limit: "16", sort: "newest" }).then(res => {
      setFeaturedArtworks(res.artworks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = activeCategory
    ? featuredArtworks.filter(a => a.subject === activeCategory)
    : featuredArtworks;

  const gridArtworks = (() => {
    if (filtered.length >= 6) return filtered.slice(0, 6);
    const usedIds = new Set(filtered.map(a => a.id));
    const extras = featuredArtworks.filter(a => !usedIds.has(a.id));
    return [...filtered, ...extras].slice(0, 6);
  })();

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121]">

      {/* Hero Section */}
      <section className="px-6 py-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8">
        <div className="flex-1">
          <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[#1a4ba8]"></span> {hero?.preTitle || t("facultyName")}
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            {hero?.title1 || t("heroTitle1")}<br />
            <span className="text-[#1a4ba8]">{hero?.title2 || t("heroTitle2")}</span> {hero?.title3 || t("heroTitle3")}<br />
            {hero?.title4 || t("heroTitle4")}
          </h2>
          <div className="space-y-1 mb-4 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-3 mb-3">
            {(!isLoggedIn || userRole === "student") && (
              <button onClick={() => setPage(isLoggedIn ? "dashboard" : (hero?.primaryCtaLink || "gallery"))} className="bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors">
                {hero?.primaryCta || t("exploreGallery")} <ArrowRight size={18} />
              </button>
            )}
            {isLoggedIn && userRole !== "student" && (
              <button onClick={() => setPage("admin")} className="bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors">
                {userRole === "lecturer" ? "Trang quản lý Giảng viên" : "Trang quản lý Admin"} <ArrowRight size={18} />
              </button>
            )}
            {!isLoggedIn && (
              <button onClick={() => setPage(hero?.secondaryCtaLink || "auth")} className="bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                {hero?.secondaryCta || t("studentLogin")}
              </button>
            )}
          </div>
          {isLoggedIn ? <div className="mb-16"></div> : <p className="text-xs text-gray-500 mb-16">{hero?.note || t("loginNote")}</p>}
          
          <div className="flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold mb-1">{s.content?.value}</p>
                <p className="text-xs text-gray-500">{s.content?.label}</p>
              </div>
            ))}
            {stats.length === 0 && (
              <>
                <div>
                  <p className="text-3xl font-bold mb-1">500+</p>
                  <p className="text-xs text-gray-500">{t("displayedArtworks")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">120+</p>
                  <p className="text-xs text-gray-500">{t("participatingLecturers")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">18</p>
                  <p className="text-xs text-gray-500">{t("subject")}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold mb-1">{t("fourCourses")}</p>
                  <p className="text-xs text-gray-500">{t("creativeJourney")}</p>
                </div>
              </>
            )}
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-3 gap-3">
            {[0, 1, 2, 3, 4, 5].map(i => {
              const art = gridArtworks[i];
              const slot = i < 2 ? 0 : i < 4 ? 1 : 2;
              const isTall = (i % 2 === 0 && i < 2) || (i % 2 !== 0 && i >= 4);
              const aspectClass = "aspect-[4/5]";
              
              const colIndex = i % 3;
              const animClass = colIndex === 1 
                ? "animate-[slideDownEntrance_1.2s_ease-out_both]" 
                : "animate-[slideUpEntrance_1.2s_ease-out_both]";

              return (
                <div key={i} className={`col-span-1 space-y-3 ${animClass}`}>
                  <div className={`bg-gray-100 rounded-xl overflow-hidden ${aspectClass} ${art ? 'cursor-pointer' : ''}`} onClick={() => { if (art) { setPage("detail", { artworkId: art.id }); } }}>
                    {art ? (
                      <img src={art.coverImageUrl} alt={art.title} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300"><Image size={32} /></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="absolute -bottom-6 -right-6 flex gap-2">
            {categories.map(cat => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(activeCategory === cat.key ? null : cat.key)}
                className={`text-[10px] px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                  activeCategory === cat.key
                    ? "bg-[#1a4ba8] text-white"
                    : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-[#1a4ba8]/10 hover:text-[#1a4ba8]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-14 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center animate-[fadeUp_0.5s_ease-out]">
            <p className="text-[#DA291C] font-semibold text-xs tracking-[0.15em] uppercase mb-3 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#DA291C]"></span> {hero?.featuresPreTitle || t("coreFeatures")}
              <span className="w-6 h-px bg-[#DA291C]"></span>
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#212121] leading-tight">
              {hero?.featuresTitle1 ? (
                <>
                  <span className="text-[#1a4ba8]">{hero.featuresTitle1}</span> {hero.featuresTitle2}{' '}
                  <span className="text-[#DA291C]">{hero.featuresTitle3}</span>
                </>
              ) : (
                <>
                  <span className="text-[#1a4ba8]">Mọi thứ</span> bạn cần trong{' '}
                  <span className="text-[#DA291C]">một nền tảng</span>
                </>
              )}
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-[15px]">{hero?.featuresDesc || "Hệ thống E-Portfolio toàn diện cho sinh viên Thiết kế Đồ họa UEF"}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.length > 0 ? features.map((item, idx) => {
              const c = item.content;
              const icons = [Image, User, Star, Monitor, Heart, Users];
              const colorCycle = ['bg-[#1a4ba8]', 'bg-[#DA291C]', 'bg-gray-300'];
              const iconBg = ['bg-[#1a4ba8]/10', 'bg-[#DA291C]/10', 'bg-gray-200'];
              const iconColors = ['text-[#1a4ba8]', 'text-[#DA291C]', 'text-[#555]'];
              const ci = idx % 3;
              const IconComp = icons[idx] || Image;
              return (
                <div key={item.id || idx} className="group bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_${0.6 + idx * 0.1}s_ease-out]">
                  <div className={`h-1.5 ${colorCycle[ci]} w-full`}></div>
                  <div className="p-5">
                    <div className={`w-12 h-12 rounded-xl ${iconBg[ci]} ${iconColors[ci]} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 ${ci === 0 ? 'group-hover:bg-[#1a4ba8] group-hover:text-white' : ci === 1 ? 'group-hover:bg-[#DA291C] group-hover:text-white' : 'group-hover:bg-[#212121] group-hover:text-white'}`}>
                      <IconComp size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{c.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{c.description}</p>
                    {c.tag && (
                      <div className="flex items-center gap-2 text-xs font-semibold" style={{ color: ci === 0 ? '#1a4ba8' : ci === 1 ? '#DA291C' : '#555' }}>
                        <span className={`w-5 h-[2px] ${ci === 0 ? 'bg-[#1a4ba8]' : ci === 1 ? 'bg-[#DA291C]' : 'bg-gray-300'}`}></span> {c.tag}
                      </div>
                    )}
                  </div>
                </div>
              );
            }) : (
              <>
                <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.6s_ease-out]">
                  <div className="h-1.5 bg-[#1a4ba8] w-full"></div>
                  <div className="p-5">
                    <div className="w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300">
                      <Image size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("exhibitGallery")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{t("exhibitGalleryDesc")}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#1a4ba8]">
                      <span className="w-5 h-[2px] bg-[#1a4ba8]"></span> gallery
                    </div>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.7s_ease-out]">
                  <div className="h-1.5 bg-[#DA291C] w-full"></div>
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300">
                      <User size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("personalPortfolio")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-5">{t("portfolioFeatureDesc")}</p>
                    <div className="flex items-center gap-2 text-xs font-semibold text-[#DA291C]">
                      <span className="w-5 h-[2px] bg-[#DA291C]"></span> {t("personalPortfolioLabel")}
                    </div>
                  </div>
                </div>
                <div className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.8s_ease-out]">
                  <div className="h-1.5 bg-gray-300 w-full"></div>
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300">
                      <Star size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("scoresAndFeedback")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t("gradingFeatureDesc")}</p>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.9s_ease-out]">
                  <div className="h-1.5 bg-[#1a4ba8] w-full"></div>
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300">
                      <Monitor size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("multiDevice")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t("responsiveDesc")}</p>
                  </div>
                </div>
                <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.0s_ease-out]">
                  <div className="h-1.5 bg-[#DA291C] w-full"></div>
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300">
                      <Heart size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("highlightAndInteract")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t("interactionDesc")}</p>
                  </div>
                </div>
                <div className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.1s_ease-out]">
                  <div className="h-1.5 bg-gray-300 w-full"></div>
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300">
                      <Users size={22} />
                    </div>
                    <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("recruitmentConnection")}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{t("recruitmentDesc")}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Latest Artworks */}
      <section className="px-6 py-10">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8">
          <div className="flex justify-between items-end mb-8">
            <div>
              <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-[#1a4ba8]"></span> {hero?.galleryPreTitle || t("featuredProducts")}
              </p>
              <h2 className="text-3xl font-extrabold">{hero?.galleryTitle || t("exploreNewestArtworks")}</h2>
            </div>
            <button onClick={() => setPage("gallery")} className="text-sm font-semibold border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              {t("viewFullGallery")} &rsaquo;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {featuredArtworks.slice(0, 10).map((work, idx) => (
              <div key={work.id} className="group cursor-pointer" onClick={() => setPage("detail", { artworkId: work.id })}>
                <div className="rounded-lg overflow-hidden mb-3 relative aspect-[4/3] bg-gray-100">
                  <img src={work.coverImageUrl} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-[#1a4ba8] text-white text-[10px] font-bold px-2 py-1 rounded">{t("featured")}</div>
                  )}
                </div>
                <h4 className="font-bold text-[15px] mb-1">{work.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{work.user?.fullName || getSetting("fallbackAuthorName") || "Sinh viên UEF"}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {work.likeCount || 0}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quotes Ticker */}
      {testimonials.length > 0 && (
        <div className="bg-[#0d2e6e] py-6 overflow-hidden border-y border-white/10 shadow-inner">
          <div className="flex gap-8 whitespace-nowrap animate-[ticker_48s_linear_infinite] w-max">
            {[...Array(2)].map((_, repIdx) => (
              <React.Fragment key={repIdx}>
                {testimonials.map((item, idx) => {
                  const c = item.content;
                  const initials = c.name ? c.name.split(' ').map(n => n[0]).join('').slice(-2).toUpperCase() : '👤';
                  return (
                    <div key={item.id || idx} className="inline-flex items-center gap-6 px-8 text-white/90 border-r border-white/20 mx-4">
                      {c.imageUrl ? (
                        <img src={c.imageUrl} alt={c.name} className="w-24 h-24 rounded-md object-cover shadow-lg shrink-0 ring-2 ring-[#c9a227]/30" />
                      ) : (
                        <div className="w-24 h-24 rounded-md bg-gradient-to-br from-[#1a4ba8] to-[#DA291C] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg">
                          {initials}
                        </div>
                      )}
                      <div className="flex flex-col whitespace-normal text-left max-w-md">
                        <span className="text-[11px] font-bold text-[#c9a227] tracking-wide uppercase">
                          {c.type} {c.role ? `— ${c.role}` : ''}
                        </span>
                        <span className="text-[14px] font-bold text-white mt-1 mb-1">{c.name}</span>
                        {c.quote && (
                          <span className="text-[12px] text-white/80 leading-relaxed italic">
                            "{c.quote}"
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      )}

      {/* Steps Section */}
      <section className="px-6 py-10 bg-gray-50/50">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-8">
          <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2 justify-center">
            <span className="w-6 h-px bg-[#1a4ba8]"></span> {hero?.stepsPreTitle || t("guide")}
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-10">{hero?.stepsTitle || t("startInThreeSteps")}</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            {steps.length > 0 ? steps.map((item, idx) => {
              const c = item.content;
              return (
                <div key={item.id || idx} className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">{c.step || idx + 1}</div>
                  <h3 className="font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
              );
            }) : (
              <>
                <div className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">1</div>
                  <h3 className="font-bold mb-2">{t("login")}</h3>
                  <p className="text-sm text-gray-500">{t("step1Desc")}</p>
                </div>
                <div className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">2</div>
                  <h3 className="font-bold mb-2">{t("uploadArtworkStep")}</h3>
                  <p className="text-sm text-gray-500">{t("step2Desc")}</p>
                </div>
                <div className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">3</div>
                  <h3 className="font-bold mb-2">{t("sharePortfolio")}</h3>
                  <p className="text-sm text-gray-500">{t("step3Desc")}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-gradient-to-r from-[#1a4ba8] to-[#0d2e6e] text-white px-6 py-14 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div>
            <h2 className="text-3xl font-extrabold mb-3">{cta?.title || t("readyToShowcase")}</h2>
            <p className="text-white/70">{cta?.subtitle || t("forStudents")}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPage(cta?.primaryCtaLink || "auth")} className="bg-white text-[#1a4ba8] hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg">{cta?.primaryCta || t("loginNow")}</button>
            <button onClick={() => setPage(cta?.secondaryCtaLink || "gallery")} className="border-2 border-white/40 hover:border-white text-white px-8 py-3 rounded-lg font-bold transition-colors">{cta?.secondaryCta || t("viewGallery")}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white text-[#212121] py-10 px-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-uef.png" alt="UEF" className="h-9 object-contain" />
              <div>
                <p className="font-bold text-[#212121]">{getSetting('siteName') || footerInfo?.brand || 'Design Gallery'}</p>
                <p className="text-xs text-[#666]">{footerInfo?.subtitle || 'Khoa Thiết kế Đồ họa'}</p>
              </div>
            </div>
            <p className="text-sm text-[#666] leading-relaxed mb-4">{getSetting('siteDescription') || footerInfo?.description || 'Nền tảng E-Portfolio kết nối sinh viên Thiết kế Đồ họa UEF với giảng viên và nhà tuyển dụng.'}</p>
            <div className="flex gap-3">
              <a href={footerInfo?.emailUrl || "mailto:khoathietke@uef.edu.vn"} className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><Mail size={15} /></a>
              <a href={footerInfo?.facebookUrl || "https://facebook.com/uef.edu.vn"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><Globe size={15} /></a>
              <a href={footerInfo?.youtubeUrl || "https://youtube.com/@uefmedia"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center hover:bg-[#DA291C] hover:text-white transition-all"><Eye size={15} /></a>
              <a href={footerInfo?.websiteUrl || "https://uef.edu.vn"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><ExternalLink size={15} /></a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">{t("contact")}</h4>
            <ul className="space-y-3 text-sm text-[#666]">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#DA291C] shrink-0 mt-0.5" />
                <span>{footerInfo?.address || '141 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#DA291C] shrink-0" />
                <span>{footerInfo?.phone || '(028) 5422 5555'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#DA291C] shrink-0" />
                <a href={`mailto:${footerInfo?.email || 'khoathietke@uef.edu.vn'}`} className="hover:text-[#1a4ba8] transition-colors">{footerInfo?.email || 'khoathietke@uef.edu.vn'}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe size={15} className="text-[#DA291C] shrink-0" />
                <a href={footerInfo?.websiteUrl || "https://uef.edu.vn"} target="_blank" rel="noreferrer" className="hover:text-[#1a4ba8] transition-colors">{footerInfo?.websiteLabel || 'uef.edu.vn'}</a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">{footerInfo?.linksTitle || "Liên kết"}</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.length > 0 ? footerLinks.map((item, idx) => {
                const c = item.content;
                return (
                  <li key={item.id || idx}>
                    <button onClick={() => setPage(c.link)} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{c.label}</button>
                  </li>
                );
              }) : (
                <>
                  <li><button onClick={() => setPage("gallery")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">Gallery</button></li>
                  <li><button onClick={() => setPage("about")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{t("aboutFaculty")}</button></li>
                  <li><button onClick={() => setPage("auth")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{t("login")}</button></li>
                  <li><a href="https://uef.edu.vn" target="_blank" rel="noreferrer" className="text-[#666] hover:text-[#1a4ba8] transition-colors">Trường UEF</a></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">{t("socialMedia")}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://facebook.com/uef.edu.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center"><Globe size={13} /></div> Facebook</a></li>
              <li><a href="https://youtube.com/@uefmedia" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#DA291C] transition-colors"><div className="w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center"><Eye size={13} /></div> Youtube</a></li>
              <li><a href="https://uef.edu.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center"><ExternalLink size={13} /></div> Website</a></li>
              <li><a href="mailto:khoathietke@uef.edu.vn" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center"><Mail size={13} /></div> Email</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-sm text-[#999] flex flex-col md:flex-row justify-between items-center gap-3">
          <p>{getSetting('footerCopyright') || footerInfo?.copyright || t("footerCopyright")}</p>
          <p>{footerInfo?.footerBrand || t("footerBrand")}</p>
        </div>
      </footer>
    </div>
  );
}

const lecturers = [
  { name: "TS. Nguyễn Văn Tài", title: "Trưởng Khoa · Branding & Identity", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", email: "nvtai@uef.edu.vn" },
  { name: "ThS. Lê Minh Phương", title: "Typography & Editorial Design", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80", email: "lmphuong@uef.edu.vn" },
  { name: "TS. Trần Quang Khải", title: "3D Art & Motion Graphics", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", email: "tqkhai@uef.edu.vn" },
  { name: "ThS. Vũ Thu Hà", title: "UX/UI Design & Interaction", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80", email: "vtha@uef.edu.vn" },
];


const lecturersList = [
  { name: "PGS. TS. Nguyễn Minh Khoa", title: "Trưởng Khoa Thiết kế Đồ họa", bio: "Chuyên ngành: Visual Communication, Brand Identity & Design Strategy. Hơn 20 năm kinh nghiệm giảng dạy và thực chiến.", skills: ["Typography", "Brand Identity", "Visual Communication"], img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  { name: "ThS. Trần Thị Lan Anh", title: "Giảng viên chính", bio: "Chuyên ngành: UI/UX Design, Digital Product Design & Figma. Cố vấn thiết kế cho nhiều startup công nghệ.", skills: ["UI/UX", "Figma", "Product Design"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  { name: "ThS. Lê Quốc Bảo", title: "Giảng viên", bio: "Chuyên ngành: Motion Graphics, After Effects & 3D Animation. Freelance director với hơn 50 dự án thương mại lớn.", skills: ["Motion Graphics", "After Effects", "3D"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "ThS. Phạm Hồng Nhung", title: "Giảng viên", bio: "Chuyên ngành: Typography, Editorial Design & Packaging. Từng đoạt 2 giải thưởng thiết kế bao bì quốc tế.", skills: ["Typography", "Editorial", "Packaging"], img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "TS. Nguyễn Đình Trọng", title: "Giảng viên cao cấp", bio: "Chuyên ngành: Illustration, Concept Art & Character Design. Cộng tác viên cho studio game và phim hoạt hình.", skills: ["Illustration", "Concept Art", "Character"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "ThS. Vũ Thanh Tuyền", title: "Giảng viên", bio: "Chuyên ngành: Photography, Photo Editing & Visual Storytelling. Nhiếp ảnh gia thương mại với studio tự do.", skills: ["Photography", "Photoshop", "Lightroom"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
];

const ABOUT_TABS = [
  { label: "Chương trình đào tạo", id: "chuong-trinh-dao-tao" },
  { label: "Đội ngũ giảng viên", id: "doi-ngu-giang-vien" },
  { label: "Cơ sở vật chất", id: "co-so-vat-chat" },
  { label: "Liên hệ", id: "lien-he" },
];

const studentFeatures = [
  { icon: Upload, title: "Đăng tải ấn phẩm", desc: "Upload ảnh/PDF tác phẩm thiết kế kèm thông tin môn học, công cụ và mô tả chi tiết." },
  { icon: Briefcase, title: "Portfolio cá nhân", desc: "Tạo hồ sơ năng lực trực tuyến chuyên nghiệp, dễ dàng chia sẻ với nhà tuyển dụng." },
  { icon: MessageSquare, title: "Kết nối & Phản hồi", desc: "Nhận nhận xét từ giảng viên, kết nối với nhà tuyển dụng qua hệ thống tin nhắn." },
  { icon: BarChart2, title: "Theo dõi tiến độ", desc: "Dashboard cá nhân quản lý bài đăng, lượt tương tác và điểm đánh giá." },
  { icon: BookOpen, title: "Học tập & Phát triển", desc: "Tham khảo tác phẩm của bạn học, học hỏi kỹ thuật thiết kế đa dạng." },
  { icon: Star, title: "Cơ hội nghề nghiệp", desc: "Tiếp cận nhà tuyển dụng tiềm năng thông qua Moodboard ấn phẩm tốt nghiệp." },
];

const employerFeatures = [
  { icon: Search, title: "Tìm kiếm tài năng", desc: "Duyệt portfolio sinh viên theo kỹ năng, công cụ, môn học và năm tốt nghiệp." },
  { icon: Eye, title: "Đánh giá năng lực", desc: "Xem điểm đánh giá từ giảng viên, nhận xét chuyên môn trên từng tác phẩm." },
  { icon: Send, title: "Liên hệ trực tiếp", desc: "Gửi tin nhắn tuyển dụng qua hệ thống — kết nối nhanh chóng với ứng viên tiềm năng." },
  { icon: Heart, title: "Lưu & Theo dõi", desc: "Đánh dấu ứng viên triển vọng, theo dõi cập nhật tác phẩm mới nhất." },
  { icon: FileDown, title: "Xuất báo cáo", desc: "Tổng hợp Moodboard ứng viên nổi bật, xuất PDF phục vụ tuyển dụng." },
  { icon: Globe, title: "Tiếp cận rộng", desc: "Hơn 500 ấn phẩm đồ án từ sinh viên ngành Thiết kế Đồ họa UEF." },
];

const schoolFeatures = [
  { icon: LayoutDashboard, title: "Quản lý đào tạo", desc: "Theo dõi toàn bộ đồ án sinh viên theo môn học, semester và năm học." },
  { icon: Check, title: "Đánh giá chất lượng", desc: "Giảng viên chấm điểm, nhận xét trực tiếp; thống kê điểm số theo lớp và môn." },
  { icon: Folder, title: "Moodboard triển lãm", desc: "Tạo tuyển tập ấn phẩm xuất sắc, sắp xếp kéo thả và xuất tập san PDF." },
  { icon: Bookmark, title: "Lưu trữ học thuật", desc: "Lưu giữ toàn bộ đồ án qua các năm phục vụ kiểm định và đối sánh." },
  { icon: Users, title: "Quản lý người dùng", desc: "Quản lý tài khoản sinh viên, giảng viên; phân quyền và khóa/mở tài khoản." },
  { icon: ShieldAlert, title: "Kiểm duyệt nội dung", desc: "Giám sát nội dung đăng tải, xử lý báo cáo vi phạm và cảnh cáo." },
];

const facilitiesList = [
  {
    title: "Studio Thiết kế",
    desc: "Không gian làm việc nhóm với bảng vẽ, bàn cắt, khu in ấn thử nghiệm và hệ thống trình chiếu cho critique.",
    icon: PenTool,
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80",
  },
  {
    title: "Phòng máy chuyên dụng",
    desc: "Máy cấu hình cao cho Adobe CC, 3D và motion; màn hình chuẩn màu phục vụ thiết kế và hậu kỳ.",
    icon: Monitor,
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80",
  },
  {
    title: "Thiết bị ghi hình",
    desc: "Bộ kit quay/chụp, đèn studio và phụ kiện giúp sinh viên hoàn thiện sản phẩm ảnh, video và content marketing.",
    icon: FileImage,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80",
  },
];

const softwareStack = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe After Effects",
  "Figma",
  "Blender",
  "Procreate",
];

function AboutPage({ setPage, isLoggedIn }) {
  const [activeTab, setActiveTab] = useState("student");
  const [openFaq, setOpenFaq] = useState(null);
  const { getContentBySection, getContentItems, getSetting } = useSiteContent();
  const aboutHero = getContentBySection('about', 'aboutHero');
  const aboutValues = getContentItems('about', 'aboutValues');
  const aboutProcess = getContentItems('about', 'aboutProcess');
  const aboutCta = getContentBySection('about', 'aboutCta');
  const footerInfo = getContentBySection('footer', 'footerInfo');
  const footerLinks = getContentItems('footer', 'footerLinks');

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const images = [
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400&q=80",
    "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&q=80",
    "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400&q=80",
    "https://images.unsplash.com/photo-1636955816868-fcb881e57954?w=400&q=80",
    "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&q=80",
    "https://images.unsplash.com/photo-1523437113738-bbd3cc89fb19?w=600&q=80",
    "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80",
    "https://images.unsplash.com/photo-1542744094-24638eff58bb?w=400&q=80",
    "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&q=80"
  ];

  return (
    <div className="bg-white min-h-screen text-[#212121] overflow-x-hidden font-sans">
      
      {/* HERO SECTION */}
      <section className="relative min-h-[70vh] pt-16 pb-10 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden bg-[#f9fafc]">
        <div className="absolute inset-0 z-0">
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-15"></div>
          <div className="absolute top-40 left-1/4 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-15"></div>
          <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-[#d6e8ff] rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>
        </div>
        
        <div className="relative z-10 lg:pl-10 xl:pl-24 lg:pr-8">
          <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-blue-50 border border-red-100 text-[#0d2e6e] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-[fadeUp_0.5s_ease-out] shadow-sm">
            <span className="w-2 h-2 bg-gradient-to-r from-red-500 to-blue-600 rounded-full animate-pulse"></span>
            Khoa Thiết Kế Đồ Họa UEF
          </div>
          
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[#0a0c0f] mb-6 tracking-tight animate-[fadeUp_0.7s_ease-out]">
            {aboutHero?.title ? (
              aboutHero.title.split('\n').map((line, i) => (
                <React.Fragment key={i}>{i > 0 && <br/>}{line}</React.Fragment>
              ))
            ) : (
              <>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0a0c0f] to-[#1a4ba8]">{t("aboutHeroExplore")}</span><br/>
                <span className="relative inline-block mt-2">
                  <span className="absolute -bottom-2 left-0 w-full h-4 bg-red-100 -z-10 transform skew-x-[-12deg]"></span>
                  <span className="text-red-600">{t("aboutHeroExcellentProjects")}</span>
                </span><br/>
                {t("aboutHeroFromUefStudents")}
              </>
            )}
          </h1>
          <p className="text-[#555] text-lg leading-relaxed max-w-[540px] mb-8 font-medium border-l-[3px] border-red-500 pl-5 py-2 bg-gradient-to-r from-red-50/40 to-transparent animate-[fadeUp_0.9s_ease-out]">
            {aboutHero?.description || <>{t("aboutHeroDesc1")} <strong className="text-red-600">{t("aboutHeroDesc2")}</strong></>}
          </p>
          <div className="flex flex-wrap gap-4 mb-4 animate-[fadeUp_1.1s_ease-out]">
            <a href={isLoggedIn ? undefined : "#audience"} onClick={(e) => { if (isLoggedIn) { e.preventDefault(); setPage("dashboard"); } }} className="group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1a4ba8] to-blue-700 text-white rounded-full font-bold text-[15px] hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer">
              {t("aboutExploreNow")} <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </a>
            {!isLoggedIn && (
              <button onClick={() => setPage("auth")} className="inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-[#0a0c0f] rounded-full font-bold text-[15px] hover:border-red-500 hover:text-red-600 transition-colors">
                Đăng nhập
              </button>
            )}
          </div>
          <div className="flex gap-6 pt-5 mt-6 border-t border-[#e2e6ec] animate-[fadeUp_1.3s_ease-out]">
            {aboutHero?.stats ? (() => {
              try {
                const statsArr = JSON.parse(aboutHero.stats);
                return statsArr.slice(0, 4).map((s, i) => (
                  <div key={i}>
                    <div className="text-[28px] font-black text-[#0d2e6e] leading-none">{s.value}</div>
                    <div className="text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider">{s.label}</div>
                  </div>
                ));
              } catch { return null; }
            })() : (
              <>
                <div>
                  <div className="text-[28px] font-black text-[#0d2e6e] leading-none">500+</div>
                  <div className="text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider">{t("aboutArtworksOnDisplay")}</div>
                </div>
                <div>
                  <div className="text-[28px] font-black text-[#0d2e6e] leading-none">120+</div>
                  <div className="text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider">{t("aboutLecturersParticipating")}</div>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="hidden lg:flex relative z-10 h-full items-center justify-center pointer-events-none">
          <div className="grid grid-cols-3 grid-rows-4 gap-2.5 w-full max-w-[500px] aspect-[3/4] p-8 pb-4 origin-center animate-[mosaicFloat_9s_ease-in-out_infinite] pointer-events-auto">
            <div className="row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[0]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Branding</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[1]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[2]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">UI/UX</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[3]} className="w-full h-full object-cover" /></div>
            <div className="row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[4]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Illustration</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[5]} className="w-full h-full object-cover" /></div>
            <div className="col-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[6]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Poster</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[7]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[8]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md"><img src={images[9]} className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#0d2e6e] py-2 overflow-hidden border-y border-white/10 shadow-inner">
        <div className="flex gap-0 whitespace-nowrap animate-[ticker_32s_linear_infinite] w-max">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>{t("aboutTicker1")}</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>{t("aboutTicker2")}</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>{t("aboutTicker3")}</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>{t("aboutTicker4")}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* GALLERY STRIP */}
      <div className="bg-white py-10 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] animate-[fadeUp_0.5s_ease-out]">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> {t("aboutFeaturedArtworks")}
          </div>
        </div>
        <div className="flex gap-4 w-max animate-[stripScroll_35s_linear_infinite] hover:[animation-play-state:paused] px-4">
          {[...images, ...images].map((img, i) => (
            <div key={i} className="w-[240px] h-[160px] rounded-xl overflow-hidden shrink-0 group relative shadow-md">
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>
              <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>

      {/* AUDIENCE SECTION (Core Platform) */}
      <section id="audience" className="bg-gradient-to-b from-[#f5f6f8] to-white py-14 px-6 lg:px-12 border-t border-[#e2e6ec]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-3">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> {t("aboutCoreEcosystem")}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a0c0f] leading-[1.1] mb-6 tracking-tight">{t("aboutSeamlessExperience1")}<br/>{t("aboutSeamlessExperience2")}</h2>
          <p className="text-[#666] text-base leading-relaxed max-w-[600px] mb-6">
            {t("aboutAudienceDesc")}
          </p>

          <div className="flex gap-2 border-b-2 border-[#e2e6ec] mb-8 overflow-x-auto pb-1">
            <button onClick={() => setActiveTab("student")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'student' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <GraduationCap size={18} /> {t("student")}
            </button>
            <button onClick={() => setActiveTab("lecturer")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'lecturer' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <ClipboardList size={18} /> {t("lecturer")}
            </button>
            <button onClick={() => setActiveTab("recruiter")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'recruiter' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <Building2 size={18} /> Nhà tuyển dụng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            {activeTab === "student" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">{t("aboutStudentTitle")}</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    {t("aboutStudentDesc")}
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><LayoutGrid size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutStudentPoint1Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutStudentPoint1Desc")}</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Link size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutStudentPoint2Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutStudentPoint2Desc")}</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Zap size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutStudentPoint3Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutStudentPoint3Desc")}</span>
                      </div>
                    </li>
                  </ul>
                  <button onClick={() => setPage("auth")} className="px-7 py-3.5 bg-[#0a0c0f] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a4ba8] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">{t("aboutStudentCreateNow")}</button>
                </div>
                <div className="animate-[fadeUp_0.7s_ease-out]">
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3">
                    <div className="rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group">
                      <img src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80" alt="Student Dashboard" className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="font-bold text-lg">{t("aboutStudentDash1")}</div>
                        <div className="text-sm opacity-80">{t("aboutStudentDash2")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "lecturer" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">{t("aboutLecturerTitle")}</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    {t("aboutLecturerDesc")}
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#fef2f2] text-[#c0392b] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><FileBadge size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutLecturerPoint1Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutLecturerPoint1Desc")}</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><ShieldCheck size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutLecturerPoint2Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutLecturerPoint2Desc")}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="animate-[fadeUp_0.7s_ease-out]">
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3">
                    <div className="rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group">
                      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" alt="Lecturer Dashboard" className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="font-bold text-lg">{t("aboutLecturerDash1")}</div>
                        <div className="text-sm opacity-80">{t("aboutLecturerDash2")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "recruiter" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">{t("aboutRecruiterTitle")}</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    {t("aboutRecruiterDesc")}
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#fdfaf1] text-[#c9a227] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Filter size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutRecruiterPoint1Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutRecruiterPoint1Desc")}</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><UserPlus size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">{t("aboutRecruiterPoint2Title")}</strong>
                        <span className="text-[#666] text-sm leading-relaxed">{t("aboutRecruiterPoint2Desc")}</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="animate-[fadeUp_0.7s_ease-out]">
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3">
                    <div className="rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group">
                      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Recruiter View" className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="font-bold text-lg">{t("aboutRecruiterDash1")}</div>
                        <div className="text-sm opacity-80">{t("aboutRecruiterDash2")}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION */}
      <section className="bg-white py-16 px-6 lg:px-12 text-[#212121] relative overflow-hidden">
        {/* Subtle decorative glows — ĐỎ + XANH DƯƠNG */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a4ba8] rounded-full blur-[150px] opacity-[0.06] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DA291C] rounded-full blur-[150px] opacity-[0.05] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-[700px] mb-12 text-center mx-auto animate-[fadeUp_0.5s_ease-out]">
<div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-3">
              <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> {t("aboutValuesPreTitle")}
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-[#212121]">
              <span className="text-[#1a4ba8]">Thiết kế</span> vì sự phát triển<br/>
              <span className="text-[#DA291C]">toàn diện</span> của sinh viên
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* XANH DƯƠNG — Pillar 1 */}
            <div className="bg-white border border-[#1a4ba8]/20 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(26,75,168,0.12)] transition-all border-t-[4px] border-t-[#1a4ba8] group hover:-translate-y-2 duration-300 animate-[fadeUp_0.7s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <LayoutGrid size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-[#212121]">Portfolio Driven</h3>
              <p className="text-[15px] text-[#555] leading-relaxed">{t("aboutValue1Desc")}</p>
            </div>
            {/* ĐỎ — Pillar 2 */}
            <div className="bg-white border border-[#DA291C]/20 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(218,41,28,0.12)] transition-all border-t-[4px] border-t-[#DA291C] group hover:-translate-y-2 duration-300 animate-[fadeUp_0.9s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-[#212121]">Academic Integrity</h3>
              <p className="text-[15px] text-[#555] leading-relaxed">{t("aboutValue2Desc")}</p>
            </div>
            {/* TRẮNG (với chữ đen) — Pillar 3 */}
            <div className="bg-gray-50 border border-gray-200 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-all border-t-[4px] border-t-gray-300 group hover:-translate-y-2 duration-300 animate-[fadeUp_1.1s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-gray-200 text-[#555] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-[#212121]">Industry Ready</h3>
              <p className="text-[15px] text-[#555] leading-relaxed">{t("aboutValue3Desc")}</p>
            </div>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-evenly gap-6 text-center animate-[fadeUp_1.3s_ease-out] shadow-sm">
             <div>
                <div className="font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight">350+</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#1a4ba8]">{t("aboutStats1Title")}</div>
             </div>
             <div className="w-full md:w-px h-px md:h-20 bg-gray-200"></div>
             <div>
                <div className="font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight">98%</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]">{t("aboutStats2Title")}</div>
             </div>
             <div className="w-full md:w-px h-px md:h-20 bg-gray-200"></div>
             <div>
                <div className="font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight">45+</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#555]">{t("aboutStats3Title")}</div>
             </div>
          </div>
        </div>
      </section>

      {/* PROCESS FLOW */}
      <section className="py-14 px-6 lg:px-12 bg-[#f9fafc] border-b border-[#e2e6ec] overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
<div className="text-center mb-10 animate-[fadeUp_0.5s_ease-out]">
             <h2 className="text-4xl font-black text-[#0a0c0f] mb-4">{t("aboutProcessTitle")}</h2>
             <p className="text-[#666] max-w-2xl mx-auto text-base">{t("aboutProcessDesc")}</p>
           </div>
           
           <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-6">
             {/* Decorative connecting line for desktop */}
             <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-[#d6e8ff] via-[#1a4ba8] to-[#d6e8ff] -translate-y-1/2 z-0 opacity-40"></div>
             
             <div className="relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.7s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#1a4ba8] to-[#0d2e6e] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#1a4ba8]/20 ring-4 ring-white">1</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">{t("aboutStep1Title")}</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">{t("aboutStep1Desc")}</p>
             </div>
             
             <ArrowRight className="text-[#1a4ba8] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_0.8s_ease-out]" size={32} />
             
             <div className="relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.9s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#c0392b] to-[#8a1919] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c0392b]/20 ring-4 ring-white">2</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">{t("aboutStep2Title")}</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">{t("aboutStep2Desc")}</p>
             </div>
             
             <ArrowRight className="text-[#c0392b] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_1.0s_ease-out]" size={32} />
             
             <div className="relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_1.1s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#c9a227] to-[#967615] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c9a227]/20 ring-4 ring-white">3</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">{t("aboutStep3Title")}</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">{t("aboutStep3Desc")}</p>
             </div>
           </div>
        </div>
      </section>

      {/* COMPARE SECTION */}
      <section id="compare" className="py-14 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10 animate-[fadeUp_0.5s_ease-out]">
            <h2 className="text-4xl font-black text-[#0a0c0f] mb-4">{t("aboutCompareTitle")}</h2>
            <p className="text-[#666] text-base">{t("aboutCompareDesc")}</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#e2e6ec] shadow-xl shadow-black/5 animate-[fadeUp_0.7s_ease-out]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="bg-[#f9fafc] p-6 font-extrabold text-[#0a0c0f] border-b border-[#e2e6ec] text-[15px] uppercase tracking-wider w-[40%]">{t("aboutCompareCol1")}</th>
                  <th className="bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Behance / Dribbble</th>
                  <th className="bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Google Drive</th>
                  <th className="bg-gradient-to-r from-[#0d2e6e] to-[#1a4ba8] p-6 font-extrabold text-white border-b border-[#0d2e6e] text-[15px] text-center shadow-inner">UEF Gallery</th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">{t("aboutCompareF1")}</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">{t("aboutCompareF2")}</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">{t("aboutCompareF3")}</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 font-bold text-[#0a0c0f]">{t("aboutCompareF4")}</td>
                  <td className="p-5 text-center text-[#38a169]/80"><Check size={20} className="mx-auto" /></td>
                  <td className="p-5 text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-14 px-6 lg:px-12 bg-[#f9fafc] border-t border-[#e2e6ec]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
           <div className="animate-[fadeUp_0.5s_ease-out]">
             <h3 className="font-black text-4xl mb-5 tracking-tight text-[#0a0c0f]">{t("aboutFaqTitle")}</h3>
             <p className="text-[#666] text-base leading-relaxed mb-10">{t("aboutFaqDesc")}</p>
             <div className="bg-white border border-[#e2e6ec] shadow-md rounded-2xl p-6 flex items-start gap-5 hover:border-[#1a4ba8]/30 transition-colors">
                <div className="w-12 h-12 bg-[#f0f4ff] text-[#1a4ba8] rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <strong className="text-base block mb-1 font-extrabold text-[#0a0c0f]">{t("aboutFaqTechSupport")}</strong>
                  <span className="text-sm text-[#666] block mb-3">{t("aboutFaqTechSupportDesc")}</span>
                  <a href="mailto:khoathietke@uef.edu.vn" className="text-[#1a4ba8] font-bold hover:underline">khoathietke@uef.edu.vn</a>
                </div>
             </div>
           </div>
           
           <div className="space-y-4 animate-[fadeUp_0.7s_ease-out]">
             {[
               { q: t("aboutFaq1Q"), a: t("aboutFaq1A") },
               { q: t("aboutFaq2Q"), a: t("aboutFaq2A") },
               { q: t("aboutFaq3Q"), a: t("aboutFaq3A") },
               { q: t("aboutFaq4Q"), a: t("aboutFaq4A") }
             ].map((faq, i) => (
               <div key={i} className="border border-[#e2e6ec] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                 <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-6 text-left bg-white transition-colors">
                   <strong className={`text-base font-extrabold transition-colors ${openFaq === i ? 'text-[#1a4ba8]' : 'text-[#0a0c0f]'}`}>{faq.q}</strong>
                   <ChevronDown size={20} className={`text-[#8b96a8] transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-[#1a4ba8]' : ''}`} />
                 </button>
                 <div className={`overflow-hidden transition-all duration-300 ${openFaq === i ? 'max-h-[200px] opacity-100' : 'max-h-0 opacity-0'}`}>
                   <div className="p-6 pt-0 text-[15px] text-[#666] leading-relaxed border-t border-[#e2e6ec]/50 mt-2">
                     {faq.a}
                   </div>
                 </div>
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 px-6 lg:px-12 bg-gradient-to-br from-[#0d2e6e] via-[#153b86] to-[#091a45] text-center text-white relative overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#60afff]/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>
        
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full pointer-events-none border-dashed"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto animate-[fadeUp_0.8s_ease-out]">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">{t("aboutCtaTitle1")}<br/>{t("aboutCtaTitle2")}</h2>
          <p className="text-white/80 mb-12 text-lg max-w-xl mx-auto">{t("aboutCtaDesc")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {!isLoggedIn && (
              <button onClick={() => setPage("auth")} className="px-10 py-4 bg-white text-[#0d2e6e] font-black rounded-2xl text-[16px] hover:bg-[#f0f4ff] hover:-translate-y-1 transition-all shadow-xl shadow-black/30 duration-300">
                Bắt đầu ngay miễn phí
              </button>
            )}
            <button onClick={() => setPage(isLoggedIn ? "dashboard" : "gallery")} className="px-10 py-4 bg-transparent text-white font-bold rounded-2xl text-[16px] border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-300">
              Khám phá Gallery
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-white text-[#212121] py-10 px-6 lg:px-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src="/logo-uef.png" alt="UEF" className="h-9 object-contain" />
              <div>
                <p className="font-bold text-[#212121]">{getSetting('siteName') || footerInfo?.brand || 'Design Gallery'}</p>
                <p className="text-xs text-[#666]">{footerInfo?.subtitle || 'Khoa Thiết kế Đồ họa'}</p>
              </div>
            </div>
            <p className="text-sm text-[#666] leading-relaxed mb-4">{getSetting('siteDescription') || footerInfo?.description || 'Nền tảng E-Portfolio kết nối sinh viên Thiết kế Đồ họa UEF với giảng viên và nhà tuyển dụng.'}</p>
            <div className="flex gap-3">
              <a href={footerInfo?.emailUrl || "mailto:khoathietke@uef.edu.vn"} className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><Mail size={15} /></a>
              <a href={footerInfo?.facebookUrl || "https://facebook.com/uef.edu.vn"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><Globe size={15} /></a>
              <a href={footerInfo?.youtubeUrl || "https://youtube.com/@uefmedia"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center hover:bg-[#DA291C] hover:text-white transition-all"><Eye size={15} /></a>
              <a href={footerInfo?.websiteUrl || "https://uef.edu.vn"} target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all"><ExternalLink size={15} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">{t("contact")}</h4>
            <ul className="space-y-3 text-sm text-[#666]">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="text-[#DA291C] shrink-0 mt-0.5" />
                <span>{footerInfo?.address || '141 Điện Biên Phủ, Phường 15, Quận Bình Thạnh, TP.HCM'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#DA291C] shrink-0" />
                <span>{footerInfo?.phone || '(028) 5422 5555'}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#DA291C] shrink-0" />
                <a href={`mailto:${footerInfo?.email || 'khoathietke@uef.edu.vn'}`} className="hover:text-[#1a4ba8] transition-colors">{footerInfo?.email || 'khoathietke@uef.edu.vn'}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Globe size={15} className="text-[#DA291C] shrink-0" />
                <a href={footerInfo?.websiteUrl || "https://uef.edu.vn"} target="_blank" rel="noreferrer" className="hover:text-[#1a4ba8] transition-colors">{footerInfo?.websiteLabel || 'uef.edu.vn'}</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">Liên kết</h4>
            <ul className="space-y-3 text-sm">
              {footerLinks.length > 0 ? footerLinks.map((item, idx) => {
                const c = item.content;
                return (
                  <li key={item.id || idx}>
                    <button onClick={() => setPage(c.link)} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{c.label}</button>
                  </li>
                );
              }) : (
                <>
                  <li><button onClick={() => setPage("gallery")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">Gallery</button></li>
                  <li><button onClick={() => setPage("about")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{t("aboutFaculty")}</button></li>
                  <li><button onClick={() => setPage("auth")} className="text-[#666] hover:text-[#1a4ba8] transition-colors">{t("login")}</button></li>
                  <li><a href="https://uef.edu.vn" target="_blank" rel="noreferrer" className="text-[#666] hover:text-[#1a4ba8] transition-colors">Trường UEF</a></li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5">{t("socialMedia")}</h4>
            <ul className="space-y-3 text-sm">
              <li><a href="https://facebook.com/uef.edu.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center"><Globe size={13} /></div> Facebook</a></li>
              <li><a href="https://youtube.com/@uefmedia" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#DA291C] transition-colors"><div className="w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center"><Eye size={13} /></div> Youtube</a></li>
              <li><a href="https://uef.edu.vn" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center"><ExternalLink size={13} /></div> Website</a></li>
              <li><a href="mailto:khoathietke@uef.edu.vn" className="flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors"><div className="w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center"><Mail size={13} /></div> Email</a></li>
            </ul>
          </div>

        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-sm text-[#999] flex flex-col md:flex-row justify-between items-center gap-4">
          <p>{footerInfo?.copyright || getSetting('footerCopyright') || '© 2026 UEF Design Gallery. Tất cả bản quyền được bảo hộ.'}</p>
          <p>{footerInfo?.footerBrand || t("aboutFooterDev")} <Heart size={14} className="inline text-[#DA291C] mx-1" /></p>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Modal: Lưu vào Moodboard (Pinterest/Spotify-like)
// - Checkbox chọn nhiều Moodboard
// - Tạo Moodboard mới nhanh
// - Textarea "Ghi chú của giám tuyển" -> COLLECTION_ITEMS.note (mô phỏng bằng state)
// ──────────────────────────────────────────────────────────────────────────────
function SaveToCollectionModal({
  open,
  artwork,
  collections,
  onClose,
  onSave,
  onCreateCollection,
}) {
    const [selectedIds, setSelectedIds] = useState([]);
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    if (!open || !artwork) return;
    const pre = collections
      .filter((c) => c.items.some((it) => it.artworkId === artwork.id))
      .map((c) => c.id);
    const firstNote =
      collections
        .flatMap((c) => c.items.map((it) => ({ ...it, collectionId: c.id })))
        .find((it) => it.artworkId === artwork.id)?.note || "";
    setSelectedIds(pre);
    setNote(firstNote);
    setCreating(false);
    setNewName("");
  }, [open, artwork, collections]);

  if (!open || !artwork) return null;

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const submitCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = onCreateCollection ? onCreateCollection(name) : null;
    if (id) setSelectedIds((prev) => [...prev, id]);
    setCreating(false);
    setNewName("");
  };

  return (
    <div className="fixed inset-0 z-[10000] bg-black/50 flex items-end sm:items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#E0E0E0] bg-[#F8F8F8] flex items-start justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-11 h-11 rounded-xl overflow-hidden border border-[#E0E0E0] bg-white flex-shrink-0">
              <img src={artwork.coverImageUrl || artwork.img} alt={artwork.title} className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">{t("saveToCollectionFlow")}</p>
              <p className="text-sm font-bold text-[#212121] truncate">{artwork.title}</p>
              <p className="text-xs text-[#666666] truncate">{artwork.student || artwork.user?.fullName || ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-[#E0E0E0] bg-white hover:bg-[#F8F8F8] transition-colors flex items-center justify-center text-[#666666]"
            title={t("close")}
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5">
          {/* collections */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("selectCollection")}</p>
            <div className="max-h-44 overflow-auto pr-1 space-y-2">
              {collections.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[#E0E0E0] hover:border-[#a8bce0] hover:bg-[#eef4ff] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">{c.name}</p>
                    <p className="text-[11px] text-[#666666]">{c.items.length} {t("artworks")}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="w-4 h-4 accent-[#1a4ba8]"
                  />
                </label>
              ))}
            </div>

            {/* quick create */}
            <div className="mt-3">
              {!creating ? (
                <button
                  onClick={() => setCreating(true)}
                  className="text-sm font-semibold text-[#1a4ba8] hover:opacity-80 transition-opacity inline-flex items-center gap-2"
                >
                  <Plus size={16} /> {t("createNewCollection")}
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitCreate()}
                    placeholder={t("collectionNamePlaceholder")}
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]"
                  />
                  <button
                    onClick={submitCreate}
                    className="px-3 py-2 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors"
                  >
                    {t("create")}
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewName("");
                    }}
                    className="px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors"
                  >
                    {t("cancel")}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* curator note */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">
              {t("curatorNote")}
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("curatorNotePlaceholder")}
              className="w-full min-h-[110px] px-4 py-3 rounded-2xl border border-[#E0E0E0] text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] resize-y"
            />
          </div>
        </div>

        {/* footer */}
        <div className="px-5 sm:px-6 py-4 border-t border-[#E0E0E0] bg-white flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors"
          >
            {t("close")}
          </button>
          <button
            onClick={() => onSave && onSave({ artworkId: artwork.id, selectedCollectionIds: selectedIds, note })}
            className="px-4 py-2.5 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors"
          >
            {t("saveChanges")}
          </button>
        </div>
      </div>
    </div>
  );
}

function PortfolioSettingsPage({ setPage, userData }) {
    const [settings, setSettings] = useState({ portfolioSlug: "", profileHeadline: "", major: "", yearLevel: "Năm 3", isPortfolioPublic: true, socialLinks: {}, featuredArtworkIds: [] });
  const [myArtworks, setMyArtworks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      api.portfolios.mine().catch(() => ({})),
      api.users.myArtworks().catch(() => []),
    ]).then(([data, arts]) => {
      const p = data.portfolioSettings || data;
      setSettings({
        portfolioSlug: p.portfolioSlug || "",
        profileHeadline: p.profileHeadline || "",
        major: p.major || "",
        yearLevel: p.yearLevel || "Năm 3",
        isPortfolioPublic: p.isPortfolioPublic !== false,
        socialLinks: (typeof p.socialLinks === 'string' ? (function(){ try{ return JSON.parse(p.socialLinks); }catch{ return {}; } })() : (p.socialLinks || {})),
        featuredArtworkIds: p.featuredArtworkIds || [],
      });
      setMyArtworks(Array.isArray(arts) ? arts : (arts.artworks || []));
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const toggleFeatured = (id) => {
    setSettings(prev => {
      const ids = prev.featuredArtworkIds || [];
      if (ids.includes(id)) return { ...prev, featuredArtworkIds: ids.filter(x => x !== id) };
      if (ids.length >= 4) return prev;
      return { ...prev, featuredArtworkIds: [...ids, id] };
    });
  };

  const save = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const data = await api.portfolios.updateMine({
        portfolioSlug: settings.portfolioSlug,
        profileHeadline: settings.profileHeadline,
        major: settings.major,
        yearLevel: settings.yearLevel,
        isPortfolioPublic: settings.isPortfolioPublic,
        socialLinks: JSON.stringify(settings.socialLinks),
        featuredArtworkIds: settings.featuredArtworkIds,
      });
      setMessage({ type: "success", text: t("portfolioSettingsSaved") });
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối" });
    } finally {
      setSaving(false);
    }
  };

  const [timelineEntries, setTimelineEntries] = useState([]);
  const [timelineForm, setTimelineForm] = useState({ month: '', year: '', title: '', description: '', tags: '', linkUrl: '', linkLabel: '', imageUrl: '' });
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [savingTimeline, setSavingTimeline] = useState(false);

  useEffect(() => {
    api.timeline.list().then(setTimelineEntries).catch(() => {});
  }, [loaded]);

  const openAddTimeline = () => {
    setEditingTimelineId(null);
    setTimelineForm({ month: '', year: '', title: '', description: '', tags: '', linkUrl: '', linkLabel: '', imageUrl: '' });
    setShowTimelineForm(true);
  };

  const openEditTimeline = (entry) => {
    setEditingTimelineId(entry.id);
    setTimelineForm({
      month: entry.month || '',
      year: entry.year || '',
      title: entry.title || '',
      description: entry.description || '',
      tags: entry.tags ? entry.tags.join(', ') : '',
      linkUrl: entry.linkUrl || '',
      linkLabel: entry.linkLabel || '',
      imageUrl: entry.imageUrl || '',
    });
    setShowTimelineForm(true);
  };

  const saveTimelineEntry = async () => {
    if (!timelineForm.month || !timelineForm.year || !timelineForm.title) return;
    setSavingTimeline(true);
    try {
      const body = { ...timelineForm, tags: timelineForm.tags.split(',').map(t => t.trim()).filter(Boolean) };
      if (editingTimelineId) {
        const updated = await api.timeline.update(editingTimelineId, body);
        setTimelineEntries(prev => prev.map(e => e.id === editingTimelineId ? updated : e));
      } else {
        const created = await api.timeline.create(body);
        setTimelineEntries(prev => [...prev, created]);
      }
      setShowTimelineForm(false);
    } catch (e) {
      alert(t("errorGeneric") + e.message);
    } finally {
      setSavingTimeline(false);
    }
  };

  const deleteTimelineEntry = async (id) => {
    if (!confirm(t('confirmDeleteTimeline'))) return;
    try {
      await api.timeline.delete(id);
      setTimelineEntries(prev => prev.filter(e => e.id !== id));
    } catch (e) {
      alert(t("errorGeneric") + e.message);
    }
  };

  const monthOptions = ['Tháng 1','Tháng 2','Tháng 3','Tháng 4','Tháng 5','Tháng 6','Tháng 7','Tháng 8','Tháng 9','Tháng 10','Tháng 11','Tháng 12'];
  const yearOptions = ['2023','2024','2025','2026','2027'];

  if (!loaded) return <div className="flex h-screen items-center justify-center text-[#666666]">{t("loading")}</div>;

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <DashboardSidebar activePage="portfolio_settings" setPage={setPage} userData={userData} />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#212121] mb-2">{t("portfolioSettings")}</h2>
          <p className="text-[#666666] text-sm mb-8">{t("portfolioSettingsDesc")}</p>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{message.text}</div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">{t("basicInfo")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("portfolioSlug")}</label>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-[#F8F8F8] border border-r-0 border-[#E0E0E0] rounded-l-lg text-[#666666] text-sm">portfoliohub.uef.edu.vn/</span>
                  <input type="text" value={settings.portfolioSlug} onChange={(e) => setSettings({ ...settings, portfolioSlug: e.target.value })} className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-r-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("profileHeadline")}</label>
                <input type="text" value={settings.profileHeadline} onChange={(e) => setSettings({ ...settings, profileHeadline: e.target.value })} placeholder="Graphic Designer & Visual Artist" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("major")}</label>
                <select value={settings.major || ""} onChange={(e) => setSettings({ ...settings, major: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] bg-white">
                  <option value="">{t("selectMajor")}</option>
                  <option value={t("graphicDesign")}>Thiết kế Đồ họa</option>
                  <option value="Thiết kế Truyền thông">Thiết kế Truyền thông</option>
                  <option value="Thiết kế Kỹ thuật số & UI/UX">Thiết kế Kỹ thuật số & UI/UX</option>
                  <option value="Motion Graphics & Video">Motion Graphics & Video</option>
                  <option value="Minh họa & Nghệ thuật 3D">Minh họa & Nghệ thuật 3D</option>
                  <option value="Thiết kế Bao bì">Thiết kế Bao bì</option>
                  <option value="Thiết kế Nhận diện Thương hiệu">Thiết kế Nhận diện Thương hiệu</option>
                  <option value="Nhiếp ảnh & Xử lý Hình ảnh">Nhiếp ảnh & Xử lý Hình ảnh</option>
                  <option value="Thiết kế Quảng cáo">Thiết kế Quảng cáo</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("schoolYear")}</label>
                <select value={settings.yearLevel} onChange={(e) => setSettings({ ...settings, yearLevel: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] bg-white">
                  <option value="Năm 1">Năm 1</option>
                  <option value="Năm 2">Năm 2</option>
                  <option value="Năm 3">Năm 3</option>
                  <option value="Năm 4">Năm 4</option>
                  <option value="Tốt nghiệp">Tốt nghiệp</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">{t("socialMedia")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Behance</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input type="text" value={settings.socialLinks.behance || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, behance: e.target.value } })} placeholder="https://behance.net/" className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">LinkedIn</label>
                <div className="relative">
                  <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input type="text" value={settings.socialLinks.linkedin || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/" className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-1">{t("featuredArtworks")}</h3>
            <p className="text-sm text-[#666666] mb-4">{t("maxFourFeatured")}</p>
            {(settings.featuredArtworkIds || []).length > 0 && (
              <div className="flex gap-3 mb-4 flex-wrap">
                {myArtworks.filter(a => (settings.featuredArtworkIds || []).includes(a.id)).map(a => (
                  <div key={a.id} className="relative w-24 h-20 rounded-lg overflow-hidden border border-[#E0E0E0]">
                    <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover" />
                    <button onClick={() => toggleFeatured(a.id)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center cursor-pointer">×</button>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => document.getElementById('featPicker')?.classList.remove('hidden')} className="px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
              {settings.featuredArtworkIds?.length ? t("changeArtwork") : t("selectFeaturedArtwork")} ({(settings.featuredArtworkIds || []).length}/4)
            </button>
          </div>

          <div id="featPicker" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden'); }}>
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#212121]">{t("selectFeaturedArtworks")}</h3>
                <button onClick={() => document.getElementById('featPicker')?.classList.add('hidden')} className="text-[#666666] hover:text-[#212121] cursor-pointer"><X size={20} /></button>
              </div>
              <p className="text-sm text-[#666666] mb-4">{t("selectMaxFour")} ({(settings.featuredArtworkIds || []).length}/4)</p>
              {myArtworks.length === 0 ? (
                <div className="text-center py-10 text-[#666666] text-sm">{t("noPublicArtworks")} <a href="/#/upload" className="text-[#1a4ba8] hover:underline font-semibold">{t("uploadNewArtwork")}</a></div>
              ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {myArtworks.slice(0, 20).map(a => {
                  const selected = (settings.featuredArtworkIds || []).includes(a.id);
                  return (
                    <div key={a.id} onClick={() => toggleFeatured(a.id)} className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] ${selected ? 'border-[#1a4ba8] ring-2 ring-[#1a4ba8] ring-offset-1' : 'border-[#E0E0E0] hover:border-[#999]'}`}>
                      <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover" />
                      {selected && <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1a4ba8] text-white flex items-center justify-center text-xs font-bold"><Check size={14} /></div>}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-semibold truncate">{a.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
              <button onClick={() => document.getElementById('featPicker')?.classList.add('hidden')} className="mt-4 w-full py-2.5 rounded-lg bg-[#1a4ba8] text-white font-semibold cursor-pointer">{t("confirm")}</button>
            </div>
          </div>

          {/* TIMELINE ACHIEVEMENTS */}
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#212121]">{t("timelineAchievements")}</h3>
              <button onClick={openAddTimeline} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a4ba8] text-white text-sm font-semibold hover:bg-opacity-90 transition-opacity cursor-pointer"><Plus size={15} />{t("add")}</button>
            </div>
            <p className="text-sm text-[#666666] mb-4">{t("manageTimeline")}</p>

            {timelineEntries.length === 0 ? (
              <div className="text-center py-8 text-sm text-[#666666]">{t("noTimelineEntries")}</div>
            ) : (
              <div className="space-y-2">
                {timelineEntries.map(entry => (
                  <div key={entry.id} className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0]">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-200">
                        {entry.imageUrl ? <img src={entry.imageUrl} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-xs text-[#999]"><Clock size={16} /></div>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#212121] truncate">{entry.title}</p>
                        <p className="text-xs text-[#666666]">{entry.month} {entry.year}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button onClick={() => openEditTimeline(entry)} className="p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer text-[#666666] hover:text-[#212121]"><Edit2 size={15} /></button>
                      <button onClick={() => deleteTimelineEntry(entry.id)} className="p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer text-[#666666] hover:text-red-600"><Trash2 size={15} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* TIMELINE FORM MODAL */}
          {showTimelineForm && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowTimelineForm(false); }}>
              <div className="bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-lg text-[#212121]">{editingTimelineId ? t("editTimelineEntry") : t("addTimelineEntry")}</h3>
                  <button onClick={() => setShowTimelineForm(false)} className="text-[#666666] hover:text-[#212121] cursor-pointer"><X size={20} /></button>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("month")}</label>
                      <select value={timelineForm.month} onChange={e => setTimelineForm({...timelineForm, month: e.target.value})} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white">
                        <option value="">{t("selectMonth")}</option>
                        {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("year")}</label>
                      <select value={timelineForm.year} onChange={e => setTimelineForm({...timelineForm, year: e.target.value})} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white">
                        <option value="">{t("selectYear")}</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("title")}</label>
                    <input type="text" value={timelineForm.title} onChange={e => setTimelineForm({...timelineForm, title: e.target.value})} placeholder={t("timelineTitlePlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("description")}</label>
                    <textarea value={timelineForm.description} onChange={e => setTimelineForm({...timelineForm, description: e.target.value})} rows={3} placeholder={t("timelineDescPlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("tagsCommaSeparated")}</label>
                    <input type="text" value={timelineForm.tags} onChange={e => setTimelineForm({...timelineForm, tags: e.target.value})} placeholder={t("tagsPlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("linkPaperCert")}</label>
                    <div className="flex gap-2">
                      <input type="text" value={timelineForm.linkUrl} onChange={e => setTimelineForm({...timelineForm, linkUrl: e.target.value})} placeholder="https://..." className="flex-1 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                      <input type="text" value={timelineForm.linkLabel} onChange={e => setTimelineForm({...timelineForm, linkLabel: e.target.value})} placeholder={t("linkLabelPlaceholder")} className="w-1/3 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("bgImageUrl")}</label>
                    <input type="text" value={timelineForm.imageUrl} onChange={e => setTimelineForm({...timelineForm, imageUrl: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveTimelineEntry} disabled={savingTimeline || !timelineForm.title || !timelineForm.month || !timelineForm.year} className="flex-1 py-2.5 rounded-lg bg-[#1a4ba8] text-white text-sm font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">{savingTimeline ? t("savingDots") : editingTimelineId ? t("update") : t("addNew")}</button>
                  <button onClick={() => setShowTimelineForm(false)} className="px-6 py-2.5 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer">{t("cancel")}</button>
                </div>
              </div>
            </div>
          )}

          {/* TIMELINE PREVIEW */}
          {timelineEntries.length > 0 && (
            <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6 overflow-hidden">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#212121]">{t("previewTimeline")}</h3>
                <a href={`${window.location.origin}/#/portfolio${settings.portfolioSlug ? '/' + settings.portfolioSlug : ''}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#1a4ba8] font-semibold hover:underline">{t("viewOnPortfolio")} →</a>
              </div>
              <div className="relative">
                <div className="relative overflow-hidden rounded-xl" style={{ minHeight: 260, backgroundImage: `url(${timelineEntries[0]?.imageUrl || ''})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                  <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.6)' }} />
                  <div className="relative z-10 p-5 flex items-center" style={{ minHeight: 260 }}>
                    <div className="w-full" style={{ background: BLACK, color: '#fff', padding: '20px 24px', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}>
                      <div className="mb-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold" style={{ background: '#dbeafe', color: '#1e40af' }}>{timelineEntries[0]?.month} {timelineEntries[0]?.year}</span>
                      </div>
                      <h4 className="text-base font-bold mb-1.5">{timelineEntries[0]?.title}</h4>
                      <p className="text-xs leading-relaxed" style={{ color: '#9ca3af' }}>{timelineEntries[0]?.description}</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 mt-3">
                  {timelineEntries.slice(0, 6).map((e, i) => (
                    <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#1a4ba8]' : 'bg-[#E0E0E0]'}`} />
                  ))}
                  {timelineEntries.length > 6 && <span className="text-[10px] text-[#666666]">+{timelineEntries.length - 6}</span>}
                </div>
                <p className="text-center text-[10px] text-[#999] mt-2 flex items-center justify-center gap-1">
                  <Calendar size={11} />{timelineEntries.length} {t("achievementMilestones")}
                </p>
              </div>
            </div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#212121] mb-1">{t("portfolioStatus")}</h3>
              <p className="text-sm text-[#666666]">{t("portfolioVisibilityDesc")}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.isPortfolioPublic} onChange={(e) => setSettings({ ...settings, isPortfolioPublic: e.target.checked })} />
              <div className="w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a4ba8]"></div>
            </label>
          </div>

            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving} className="px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">{saving ? t("saving") : t("saveSettings")}</button>
              <a href={`${window.location.origin}/#/portfolio${settings.portfolioSlug ? '/' + settings.portfolioSlug : ''}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-[#1a4ba8] text-[#1a4ba8] rounded-lg font-bold hover:bg-[#eef4ff] transition-colors">
                <ExternalLink size={16} className="inline mr-1.5" />{t("viewPortfolio")}
              </a>
            </div>
        </div>
      </div>
    </div>
  )
}

function SettingsPage({ setPage, userData }) {
    const { refreshSession } = useAuth();
  const [profile, setProfile] = useState({ fullName: "", studentId: "", email: "", avatarUrl: "" });
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const [passwords, setPasswords] = useState({ current: "", newPass: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [changingPass, setChangingPass] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        if (data && data.id) {
          setProfile({
            fullName: data.fullName || "",
            studentId: data.studentId || "",
            email: data.email || "",
            avatarUrl: data.avatarUrl || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const saveProfile = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    const body = { fullName: profile.fullName };
    if (pendingAvatar !== null) body.avatarUrl = pendingAvatar || "";
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: t("profileUpdated") });
        setPendingAvatar(null);
        setProfile(p => ({ ...p, avatarUrl: data.user?.avatarUrl || p.avatarUrl }));
        refreshSession();
        setTimeout(() => refreshSession(), 300);
      } else if (res.status === 401) {
        setMessage({ type: "error", text: t("sessionExpired") });
      } else {
        setMessage({ type: "error", text: data.error || t("updateError") });
      }
    } catch {
      setMessage({ type: "error", text: t("connectionError") });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setMessage({ type: "error", text: t("fillAllInfo") });
      return;
    }
    if (passwords.newPass.length < 8) {
      setMessage({ type: "error", text: t("passwordMinLength") });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setMessage({ type: "error", text: t("passwordMismatch") });
      return;
    }
    setChangingPass(true);
    setMessage({ type: "", text: "" });
    try {
      const res = await fetch("/api/users/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: t("passwordChanged") });
        setPasswords({ current: "", newPass: "", confirm: "" });
      } else {
        setMessage({ type: "error", text: data.error || t("passwordChangeFailed") });
      }
    } catch {
      setMessage({ type: "error", text: t("connectionError") });
    } finally {
      setChangingPass(false);
    }
  };

  if (!loaded) {
    return <div className="flex h-screen items-center justify-center text-[#666666]">{t("loadingInfo")}</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <DashboardSidebar activePage="settings" setPage={setPage} userData={userData} />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#212121] mb-2">{t("accountSettings")}</h2>
          <p className="text-[#666666] text-sm mb-8">Quản lý thông tin cá nhân và bảo mật tài khoản.</p>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">{t("avatar")}</h3>
            <div className="flex items-center gap-6">
              <img src={pendingAvatar || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"} className="w-20 h-20 rounded-full object-cover border-2 border-[#E0E0E0]" />
              <div>
                <div className="flex gap-3 mb-2">
                  <input type="file" id="avatarInput" accept="image/*" style={{ display: "none" }} onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result;
                      if (typeof dataUrl === "string") setPendingAvatar(dataUrl);
                    };
                    reader.readAsDataURL(file);
                  }} />
                  <button onClick={() => document.getElementById("avatarInput")?.click()} className="px-4 py-2 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer">Tải ảnh mới</button>
                  <button onClick={() => setPendingAvatar("")} className="px-4 py-2 bg-white border border-[#8B1A1A] text-[#8B1A1A] rounded-lg text-sm font-medium hover:bg-[#8B1A1A] hover:text-white transition-colors cursor-pointer">Xóa ảnh</button>
                </div>
                <p className="text-xs text-[#666666]">Định dạng JPG, PNG hoặc GIF. Tối đa 5MB.</p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">{t("personalInfo")}</h3>
            <div className="space-y-4">
              <div className={userData?.role !== "lecturer" && userData?.role !== "admin" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4"}>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("fullNameLabel")}</label>
                  <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
                {userData?.role !== "lecturer" && userData?.role !== "admin" && (
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("studentId")}</label>
                  <input type="text" value={profile.studentId} disabled className="w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" />
                </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("emailAddress")}</label>
                <input type="email" value={profile.email} disabled className="w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8">
            <h3 className="font-bold text-[#212121] mb-4">{t("changePassword")}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("currentPassword")}</label>
                <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("newPassword")}</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("resetConfirmNewPassword")}</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}  className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" />
                </div>
              </div>
              <button onClick={changePassword} disabled={changingPass} className="px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
                {changingPass ? "Đang xử lý..." : t("changePassword")}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={saveProfile} disabled={saving} className="px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {saving ? t("saving") : t("saveChanges")}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function PortalPage({ setPage }) {
    return (
    <div className="min-h-screen bg-[#F8F8F8] p-10 flex flex-col items-center">
      <div className="max-w-6xl w-full mt-10">
        <h1 className="text-4xl font-bold text-[#212121] text-center mb-16 tracking-tight">Hệ thống Prototype Portfolio UEF</h1>

        <div className="grid grid-cols-3 gap-8">
          {/* Column 1 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#212121] mb-2 flex items-center gap-2">
              <Globe size={20} className="text-[#1a4ba8]" /> Public Views
            </h2>
            <div onClick={() => setPage("landing")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Chủ (Landing Page)</h3>
              </div>
              <p className="text-[#666666] text-xs">Trang đón khách giới thiệu nền tảng</p>
            </div>
            <div onClick={() => setPage("auth")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Đăng nhập</h3>
              </div>
              <p className="text-[#666666] text-xs">Màn hình đăng nhập sinh viên / giảng viên</p>
            </div>
            <div onClick={() => setPage("gallery")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Gallery Tổng hợp</h3>
              </div>
              <p className="text-[#666666] text-xs">Hiển thị toàn bộ tác phẩm trên hệ thống</p>
            </div>
            <div onClick={() => setPage("about")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Giới thiệu (About)</h3>
              </div>
              <p className="text-[#666666] text-xs">Trang thông tin về Khoa và giảng viên</p>
            </div>
            <div onClick={() => setPage("portfolio")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <User size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Portfolio Cá nhân</h3>
              </div>
              <p className="text-[#666666] text-xs">Hồ sơ cá nhân và các tác phẩm của sinh viên</p>
            </div>
            <div onClick={() => setPage("detail")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Image size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Chi tiết Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Xem chi tiết, bình luận và thả tim tác phẩm</p>
            </div>
            <div onClick={() => setPage("about")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Giới thiệu Khoa</h3>
              </div>
              <p className="text-[#666666] text-xs">Thông tin đội ngũ giảng viên và liên hệ</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#212121] mb-2 flex items-center gap-2">
              <PenTool size={20} className="text-[#1a4ba8]" /> Student Dashboard
            </h2>
            <div onClick={() => setPage("dashboard")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Folder size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">{t("studentDashboard")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Quản lý các ấn phẩm đã tải lên của sinh viên</p>
            </div>
            <div onClick={() => setPage("upload")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Plus size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Form Upload Tác phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện đăng tải tác phẩm mới</p>
            </div>
            <div onClick={() => setPage("edit_artwork")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Edit2 size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Form Chỉnh sửa Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện cập nhật thông tin tác phẩm</p>
            </div>
            <div onClick={() => setPage("settings")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Settings size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">{t("accountSettings")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Tùy chỉnh thông tin cá nhân và bảo mật</p>
            </div>
            <div onClick={() => setPage("portfolio_settings")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">{t("portfolioSettings")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Trạng thái công khai và link mạng xã hội</p>
            </div>
            <div onClick={() => setPage("messages")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">{t("inboxTitle")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Quản lý tin nhắn liên hệ từ nhà tuyển dụng</p>
            </div>
          </div>

          {/* Column 3 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#212121] mb-2 flex items-center gap-2">
              <ShieldAlert size={20} className="text-[#8B1A1A]" /> Admin & Lecturer
            </h2>
            <div onClick={() => setPage("admin")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Admin Dashboard</h3>
              </div>
              <p className="text-[#666666] text-xs">Màn hình tổng quan của hệ thống quản trị</p>
            </div>
            <div onClick={() => setPage("admin_users")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý Tài khoản (Users)</h3>
              </div>
              <p className="text-[#666666] text-xs">Phân quyền, khóa/mở khóa tài khoản sinh viên</p>
            </div>
            <div onClick={() => setPage("admin_artworks")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Trash2 size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý & Cảnh cáo Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Kiểm duyệt post-moderation và xử lý vi phạm</p>
            </div>
            <div onClick={() => setPage("admin_export")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FileDown size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý Moodboard & Xuất PDF</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện kéo thả sắp xếp ấn phẩm để xuất tập san</p>
            </div>
            <div onClick={() => setPage("admin_layout")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Settings size={20} className="text-[#1a4ba8]" />
                <h3 className="text-[#212121] font-medium text-base">Layout Settings</h3>
              </div>
              <p className="text-[#666666] text-xs">Tùy chỉnh nội dung trang chủ, giới thiệu & footer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function AccessDenied({ setPage }) {
    return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 40 }}>
      <ShieldAlert size={64} color={CRIMSON} strokeWidth={1.2} />
      <h2 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: 0 }}>{t("accessDenied")}</h2>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
        Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản có quyền phù hợp.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={() => setPage("home")} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("backToHome")}</button>
        <button onClick={() => setPage("auth")} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: BLACK, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{t("login")}</button>
      </div>
    </div>
  );
}

function TimelineSection({ entries: propEntries, slug, isOwner, setPage }) {
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  const monthColors = { "Tháng 1": ["#dbeafe","#1e40af"], "Tháng 2": ["#fef3c7","#92400e"], "Tháng 3": ["#dcfce7","#166534"], "Tháng 4": ["#fce7f3","#9d174d"], "Tháng 5": ["#ccfbf1","#0f766e"], "Tháng 6": ["#f3e8ff","#6b21a8"], "Tháng 7": ["#e0f2fe","#0369a1"], "Tháng 8": ["#fef9c3","#a16207"], "Tháng 9": ["#dbeafe","#1e40af"], "Tháng 10": ["#ffedd5","#9a3412"], "Tháng 11": ["#fce7f3","#9d174d"], "Tháng 12": ["#e0e7ff","#4338ca"] };

  useEffect(() => {
    if (propEntries) { setFetchedEntries(propEntries); setFetchDone(true); return; }
    const fetchFn = isOwner 
      ? api.timeline.list()
      : (slug ? api.portfolios.timeline(slug) : api.timeline.list());
    fetchFn.then(data => {
      if (data.error) throw new Error(data.error);
      setFetchedEntries(Array.isArray(data) ? data : []);
      setFetchDone(true);
    }).catch(() => { setFetchedEntries([]); setFetchDone(true); });
  }, [slug]);

  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);
  const stripRef = useRef(null);
  const cardsRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const autoCenterTimer = useRef(null);
  const cardDragStart = useRef(0);

  const rawEntries = fetchedEntries || [];
  
  const timelineData = rawEntries.map(e => ({
    id: e.id,
    year: e.year || '',
    monthLabel: e.month ? 'T' + e.month.replace('Tháng ', '') : '',
    month: e.month || '',
    title: e.title || '',
    description: e.description || '',
    tags: e.tags || [],
    link: e.linkUrl || '#',
    linkLabel: e.linkLabel || 'Xem chi tiết →',
    img: e.imageUrl || '',
    monthColor: monthColors[e.month] ? monthColors[e.month][0] : '#dbeafe',
    monthText: monthColors[e.month] ? monthColors[e.month][1] : '#1e40af',
  }));

  function goTo(newIdx) {
    if (isTransitioning.current || newIdx === activeIndex) return;
    if (newIdx < 0 || newIdx >= timelineData.length) return;
    isTransitioning.current = true;
    setActiveIndex(newIdx);
    setTimeout(() => { isTransitioning.current = false; }, 520);
  }

  function goNext() { goTo(Math.min(activeIndex + 1, timelineData.length - 1)); }
  function goPrev() { goTo(Math.max(activeIndex - 1, 0)); }

  function centerActiveDot() {
    requestAnimationFrame(() => {
      const strip = stripRef.current;
      const dots = strip?.querySelectorAll('[data-dot-idx]');
      if (!dots || !dots[activeIndex]) return;
      const containerRect = strip.getBoundingClientRect();
      const dotRect = dots[activeIndex].getBoundingClientRect();
      const offset = (dotRect.left + dotRect.right) / 2 - (containerRect.left + containerRect.right) / 2;
      strip.scrollLeft += offset;
    });
  }

  function snapToNearest() {
    if (autoCenterTimer.current) clearTimeout(autoCenterTimer.current);
    autoCenterTimer.current = setTimeout(() => {
      const strip = stripRef.current;
      if (!strip) return;
      const dots = strip.querySelectorAll('[data-dot-idx]');
      const containerRect = strip.getBoundingClientRect();
      const center = (containerRect.left + containerRect.right) / 2;
      let nearestIdx = activeIndex;
      let minDist = Infinity;
      dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const dotCenter = (rect.left + rect.right) / 2;
        const dist = Math.abs(dotCenter - center);
        if (dist < minDist) { minDist = dist; nearestIdx = parseInt(dot.dataset.dotIdx); }
      });
      if (nearestIdx !== activeIndex) goTo(nearestIdx);
      else centerActiveDot();
    }, 150);
  }

  useEffect(() => {
    centerActiveDot();
  }, [activeIndex]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const onMouseDown = (e) => {
      isDragging.current = true;
      dragStartX.current = e.pageX;
      dragStartScroll.current = strip.scrollLeft;
    };
    const onMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.pageX - dragStartX.current;
      strip.scrollLeft = dragStartScroll.current - dx;
    };
    const onMouseUp = () => {
      if (!isDragging.current) return;
      isDragging.current = false;
      snapToNearest();
    };
    const onTouchStart = (e) => {
      isDragging.current = true;
      dragStartX.current = e.touches[0].pageX;
      dragStartScroll.current = strip.scrollLeft;
    };
    const onTouchMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.touches[0].pageX - dragStartX.current;
      strip.scrollLeft = dragStartScroll.current - dx;
    };
    const onTouchEnd = () => {
      isDragging.current = false;
      snapToNearest();
    };
    const onScroll = () => {
      if (isDragging.current) return;
      if (autoCenterTimer.current) clearTimeout(autoCenterTimer.current);
      autoCenterTimer.current = setTimeout(snapToNearest, 300);
    };

    strip.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    strip.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    strip.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      strip.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      strip.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      strip.removeEventListener('scroll', onScroll);
    };
  }, [activeIndex]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex]);

  function getCardClass(i) {
    if (i === activeIndex) return { transform: 'scale(1) translateY(0)', opacity: 1, pointerEvents: 'auto', zIndex: 10 };
    if (i < activeIndex) return { transform: 'scale(0.3) translateY(20px)', opacity: 0, pointerEvents: 'none', zIndex: 1 };
    return { transform: 'scale(0.3) translateY(-20px)', opacity: 0, pointerEvents: 'none', zIndex: 1 };
  }

  if (!fetchDone) return null;

  if (timelineData.length === 0) {
    if (isOwner) {
      return (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm min-h-[300px]">
          <div className="w-16 h-16 bg-[#E8EFFF] rounded-full flex items-center justify-center mb-4">
            <Plus size={24} className="text-[#1a4ba8]" />
          </div>
          <h3 className="text-lg font-bold text-[#212121] mb-2">Chưa có Timeline nào</h3>
          <p className="text-sm text-[#666666] mb-6">Bạn chưa thêm bất kỳ cột mốc nào. Hãy thêm để làm nổi bật hồ sơ của bạn.</p>
          <button onClick={() => setPage && setPage('portfolio_settings')} className="px-6 py-2.5 bg-[#1a4ba8] text-white rounded-full text-[15px] font-semibold hover:bg-[#153e8a] transition-colors cursor-pointer">
            Thêm Timeline
          </button>
        </div>
      );
    } else {
      return (
        <div className="w-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm min-h-[300px]">
          <h3 className="text-lg font-bold text-[#212121] mb-2">Chưa có Timeline nào</h3>
          <p className="text-sm text-[#666666]">Người dùng này chưa thiết lập timeline chia sẻ hành trình học tập.</p>
        </div>
      );
    }
  }

  return (
    <section className="pt-4 pb-6 w-full">
      <div className="flex items-end justify-between gap-6 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#212121] tracking-tight">{t("achievementJourney")}</h2>
        </div>
      </div>

      <div className="relative">
        <div className="relative flex flex-col md:flex-row mb-6 overflow-hidden bg-white" style={{ borderRadius: 4, border: `1px solid ${GRAY_LIGHT}`, minHeight: 340 }}>
          {/* Left: Content Area */}
          <div ref={cardsRef} className="relative w-full md:w-1/2 z-10 flex items-center justify-center" style={{ minHeight: 340 }}>
            {timelineData.map((item, i) => {
              const cardStyle = getCardClass(i);
              return (
                <div key={item.id} className="absolute inset-0 flex items-center justify-center p-8"
                  style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)', ...cardStyle }}>
                  <div className="w-full max-w-[420px]">
                    <div className="mb-5">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: item.monthColor, color: item.monthText }}>
                        {item.month} {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-3xl font-bold mb-3 leading-snug" style={{ color: BLACK }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed mb-5" style={{ color: MUTED }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {item.tags.map(t => (
                        <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, color: '#4b5563' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <a href={item.link} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold transition-colors"
                      style={{ color: CERULEAN }}
                      onMouseEnter={e => e.currentTarget.style.color = '#065d75'}
                      onMouseLeave={e => e.currentTarget.style.color = CERULEAN}>
                      {item.linkLabel}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Right: Image Area */}
          <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full">
            <div className="absolute inset-0" style={{ backgroundImage: `url(${timelineData[activeIndex].img})`, backgroundSize: 'cover', backgroundPosition: 'center', transition: 'background-image 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
          </div>
        </div>

        <div className="flex justify-center items-center gap-4 mb-6">
          <button onClick={goPrev}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: '#fff', border: `1px solid ${GRAY_LIGHT}`, color: MUTED }}
            onMouseEnter={e => e.currentTarget.style.background = GRAY_BG}
            onMouseLeave={e => e.currentTarget.style.background = '#fff'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span className="text-sm" style={{ color: MUTED }}>
            <span className="font-semibold" style={{ color: BLACK }}>{activeIndex + 1}</span>
            <span className="mx-1">/</span>
            <span>{timelineData.length}</span>
          </span>
          <button onClick={goNext}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer"
            style={{ background: CERULEAN, border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(26,75,168,0.3)' }}
            onMouseEnter={e => e.currentTarget.style.background = '#065d75'}
            onMouseLeave={e => e.currentTarget.style.background = CERULEAN}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        <div className="relative px-4">
          <div className="absolute h-[2px] left-0 right-0 top-1/2 -translate-y-1/2 z-0" style={{ background: GRAY_LIGHT }}></div>
          <div ref={stripRef} className="overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing relative z-10">
            <div className="flex items-center justify-center gap-16 md:gap-24 py-3 px-8 min-w-max">
              {timelineData.map((item, i) => (
                <div key={item.id} data-dot-idx={i}
                  className="shrink-0 flex flex-col items-center gap-2 cursor-pointer select-none"
                  onClick={() => { if (!isTransitioning.current && i !== activeIndex) goTo(i); }}>
                  <span className="text-xs font-medium transition-colors" style={{ color: i === activeIndex ? CERULEAN : MUTED, fontWeight: i === activeIndex ? 700 : 500 }}>
                    {item.monthLabel}
                  </span>
                  <div className="w-3 h-3 rounded-full transition-all duration-[400ms]" style={{
                    background: i === activeIndex ? CERULEAN : GRAY_LIGHT,
                    transform: i === activeIndex ? 'scale(1.6)' : 'scale(1)',
                    boxShadow: i === activeIndex ? `0 0 0 4px rgba(26,75,168,0.2)` : 'none',
                  }}></div>
                  <span className="text-xs transition-colors" style={{ color: i === activeIndex ? CERULEAN : '#999', fontWeight: i === activeIndex ? 700 : 400 }}>
                    {item.year}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center text-xs mt-4 flex items-center justify-center gap-1.5" style={{ color: '#aaa' }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          Kéo timeline hoặc dùng nút để xem chi tiết
        </p>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}

export default function App() {
    const { user: authUser, loading, logout, refreshSession } = useAuth();

  const getHashState = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return { page: "gallery", id: null };
    const parts = hash.split('/');
    return { page: parts[0] || "gallery", id: parts.length > 1 ? parts.slice(1).join('/') : null };
  }, []);

  const [page, setPageState] = useState(() => getHashState().page);
  const [activeArtworkId, setActiveArtworkIdState] = useState(() => {
    const h = getHashState();
    return h.page === "detail" && h.id ? h.id : (artworks[2]?.id ?? 1);
  });
  const [pageParams, setPageParams] = useState(() => {
    const h = getHashState();
    if (h.page === "portfolio" && h.id) return { portfolioSlug: h.id };
    return {};
  });

  const setActiveArtworkId = useCallback((id) => {
    setActiveArtworkIdState(id);
  }, []);

  const setPage = useCallback((newPage, params) => {
    setPageState(newPage);
    if (newPage === "detail" && params?.artworkId) {
      setActiveArtworkIdState(params.artworkId);
    } else if (newPage !== "detail") {
      setActiveArtworkIdState(null);
    }
    setPageParams(params || {});

    let path;
    if (newPage === "detail" && params?.artworkId) {
      path = `#/detail/${params.artworkId}`;
    } else if (newPage === "portfolio" && params?.portfolioSlug) {
      path = `#/portfolio/${params.portfolioSlug}`;
    } else {
      path = newPage === "gallery" ? "#/" : `#/${newPage}`;
    }
    window.history.pushState({ page: newPage, id: params?.artworkId || null }, "", path);
  }, []);

  // Handle browser back/forward
  useEffect(() => {
    const onPop = () => {
      const h = getHashState();
      setPageState(h.page);
      if (h.page === "detail" && h.id) {
        setActiveArtworkIdState(h.id);
        setPageParams({ artworkId: h.id });
      } else if (h.page === "portfolio" && h.id) {
        setPageParams({ portfolioSlug: h.id });
      } else {
        setActiveArtworkIdState(null);
        setPageParams({});
      }
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [getHashState]);

  const isLoggedIn = !!authUser;
  const userRole = authUser?.role || "student";
  const userData = authUser ? {
    name: authUser.fullName || authUser.name || "",
    fullName: authUser.fullName || authUser.name || "",
    email: authUser.email || "",
    image: authUser.avatarUrl || authUser.image || "",
    avatarUrl: authUser.avatarUrl || authUser.image || "",
    id: authUser.id || "",
    role: authUser.role || "student",
    portfolioSettings: authUser.portfolioSettings || null,
  } : null;

  // Xử lý OAuth callback - force refresh session sau khi redirect từ Google
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state') || 
                          window.location.pathname.includes('callback') ||
                          window.location.hash.includes('access_token');
    
    if (hasOAuthParams) {
      console.log("🔄 OAuth callback detected in App, forcing refresh...");
      // Retry multiple times để đảm bảo session được set
      const retryRefresh = () => {
        refreshSession();
        setTimeout(() => refreshSession(), 1000);
        setTimeout(() => refreshSession(), 2000);
        setTimeout(() => refreshSession(), 3000);
      };
      retryRefresh();
      
      // Clean URL sau khi xử lý xong
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3500);
    }
  }, [refreshSession]);

  // ────────────────────────────────────────────────────────────────────────────
  // Mock DB (để demo nghiệp vụ giảng viên)
  // collections ~ COLLECTIONS
  // collection.items[].note ~ COLLECTION_ITEMS.note
  // ────────────────────────────────────────────────────────────────────────────
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [catalogCollection, setCatalogCollection] = useState(null);

  // New Journal Builder states
  const [journalCollection, setJournalCollection] = useState(null);
  const [showJournalSettings, setShowJournalSettings] = useState(false);
  const [showJournalBuilder, setShowJournalBuilder] = useState(false);
  const [journalOrientation, setJournalOrientation] = useState('portrait');
  const [journalDraft, setJournalDraft] = useState(null);

  const handleOpenJournalFlow = (c) => {
    setJournalCollection(c);
    const savedDrafts = JSON.parse(localStorage.getItem('uef_journal_drafts') || '{}');
    const draft = savedDrafts[c.id];
    if (draft) {
      if (window.confirm("Bạn có một bản nháp thiết kế tập san chưa hoàn thành cho Moodboard này. Bạn có muốn tiếp tục chỉnh sửa bản nháp đó không?\n\nChọn OK để tiếp tục.\nChọn Cancel để bắt đầu thiết kế mới.")) {
        setJournalOrientation(draft.orientation || 'portrait');
        setJournalDraft(draft);
        setShowJournalBuilder(true);
      } else {
        setJournalDraft(null);
        setShowJournalSettings(true);
      }
    } else {
      setJournalDraft(null);
      setShowJournalSettings(true);
    }
  };

  const handleSaveJournalDraft = (draftData) => {
    if (!journalCollection) return;
    const savedDrafts = JSON.parse(localStorage.getItem('uef_journal_drafts') || '{}');
    savedDrafts[journalCollection.id] = draftData;
    localStorage.setItem('uef_journal_drafts', JSON.stringify(savedDrafts));
  };

  useEffect(() => {
    api.collections.list().then(data => {
      let result = Array.isArray(data) ? data : [];
      // Removed mock data fallback. Just use the actual result from backend.
      setCollections(result);
      setCollectionsLoading(false);
    }).catch(() => {
      setCollectionsLoading(false);
    });
  }, []);

  // Bookmark flow state
  const [saveModal, setSaveModal] = useState({ open: false, artwork: null });
  const [optimisticSavedIds, setOptimisticSavedIds] = useState([]);

  // Toast
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const isSavedReal = (artworkId) =>
    collections.some((c) => c.items.some((it) => it.artworkId === artworkId));
  const isBookmarked = (artworkId) =>
    optimisticSavedIds.includes(artworkId) || isSavedReal(artworkId);

  const openSaveFlow = (art) => {
    if (!art) return;
    setOptimisticSavedIds((prev) => (prev.includes(art.id) ? prev : [...prev, art.id]));
    setSaveModal({ open: true, artwork: art });
    setToast({
      title: "Đã lưu tạm",
      message: "Chọn Moodboard và thêm ghi chú giám tuyển để lưu chính thức.",
    });
  };

  const closeSaveFlow = () => {
    const artId = saveModal.artwork?.id;
    setSaveModal({ open: false, artwork: null });
    if (artId && !isSavedReal(artId)) {
      setOptimisticSavedIds((prev) => prev.filter((x) => x !== artId));
    }
  };

  const createCollection = async (name) => {
    setCollections((prev) => [...prev, { id: name, name, curatorEssay: "", theme: "Classic", items: [] }]);
    setToast({ title: t("collectionCreated"), message: name });
    api.collections.create({ collectionName: name }).catch(() => {});
    return name;
  };

  const saveToCollections = async ({ artworkId, selectedCollectionIds, note }) => {
    const prevCollections = [...collections];
    const savedArtworkObj = saveModal.artwork;
    setCollections((prev) =>
      prev.map((c) => {
        const has = c.items.some((it) => it.artworkId === artworkId);
        const shouldHave = selectedCollectionIds.includes(c.id);
        if (shouldHave) {
          const nextItems = has
            ? c.items.map((it) => (it.artworkId === artworkId ? { ...it, note } : it))
            : [...c.items, { artworkId, note, artwork: savedArtworkObj }];
          return { ...c, items: nextItems };
        }
        if (!shouldHave && has) {
          return { ...c, items: c.items.filter((it) => it.artworkId !== artworkId) };
        }
        return c;
      })
    );
    setOptimisticSavedIds((prev) => prev.filter((x) => x !== artworkId));
    setSaveModal({ open: false, artwork: null });
    setToast({ title: t("savedToCollection"), message: t("curatorNoteUpdated") });

    try {
      const ops = [];
      for (const c of prevCollections) {
        const has = c.items.some((it) => it.artworkId === artworkId);
        const shouldHave = selectedCollectionIds.includes(c.id);
        if (shouldHave && !has) {
          ops.push(api.collections.addItem(c.id, { artworkId, note: note || undefined }));
        } else if (shouldHave && has && note !== undefined) {
          const existingNote = c.items.find((it) => it.artworkId === artworkId)?.note;
          if (existingNote !== note) {
            ops.push(api.collections.updateItemNote(c.id, artworkId, note));
          }
        } else if (!shouldHave && has) {
          ops.push(api.collections.removeItem(c.id, artworkId));
        }
      }
      await Promise.all(ops);
    } catch (e) {
      console.error("Save to collection API error:", e);
    }
  };

  const openExportConfig = (collectionId) => {
    setActiveCollectionId(collectionId);
    setPage("collection_export_config");
  };

  const activeCollection = collections.find((c) => c.id === activeCollectionId) || null;
  const updateActiveCollection = (patch) => {
    if (!activeCollectionId) return;
    setCollections((prev) =>
      prev.map((c) => (c.id === activeCollectionId ? { ...c, ...patch } : c))
    );
    if (patch.name || patch.curatorEssay !== undefined || patch.theme) {
      api.collections.update(activeCollectionId, patch).catch(() => {});
    }
  };

  const handleLogin = async () => {
    const callbackUrl = window.location.origin + "/";
    window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`;
  };
  
  const handleLogout = () => {
    logout();
    setPage("home");
  };

  return (
    <div className="font-sans min-h-screen bg-[#F8F8F8] text-[#212121]">
      {page !== "auth" && page !== "register" && page !== "portal" && page !== "forgot_password" && page !== "reset_password" && page !== "verify_email" && (
        <AppHeader activePage={page} setPage={setPage} isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} userData={userData} />
      )}
      {page === "portal" && <PortalPage setPage={setPage} />}
      {page === "home" && <LandingPage setPage={setPage} isLoggedIn={isLoggedIn} setActiveArtworkId={setActiveArtworkId} />}
      {page === "landing" && <LandingPage setPage={setPage} isLoggedIn={isLoggedIn} setActiveArtworkId={setActiveArtworkId} />}
      {page === "gallery" && (
        <GalleryPage
          setPage={setPage}
          setActiveArtworkId={setActiveArtworkId}
          onBookmarkClick={openSaveFlow}
          isBookmarked={isBookmarked}
        />
      )}
      {page === "portfolio" && <PortfolioPage setPage={setPage} pageParams={pageParams} />}
      {page === "dashboard" && (
        userRole === "student" ? (
          <DashboardPage setPage={setPage} setActiveArtworkId={setActiveArtworkId} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "moodboards" && (
        (userRole === "student" || userRole === "lecturer") ? (
          <StudentMoodboardsPage setPage={setPage} setActiveArtworkId={setActiveArtworkId} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "badges" && (
        userRole === "admin" ? (
          <BadgesPage setPage={setPage} userData={userData} />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "upload" && (
        isLoggedIn ? (userRole === "student" ? (
          <UploadPage setPage={setPage} setActiveArtworkId={setActiveArtworkId} pageParams={pageParams} />
        ) : <AccessDenied setPage={setPage} />) : <AccessDenied setPage={setPage} />
      )}
      {page === "detail" && (
        <DetailPage
          setPage={setPage}
          setActiveArtworkId={setActiveArtworkId}
          activeArtworkId={activeArtworkId}
          onBookmarkClick={openSaveFlow}
          isBookmarked={isBookmarked}
        />
      )}
      {page === "auth" && <AuthPage setPage={setPage} onLoginSuccess={handleLogin} />}
      {page === "register" && <RegisterPage setPage={setPage} />}
      {page === "forgot_password" && <ForgotPasswordPage setPage={setPage} />}
      {page === "reset_password" && <ResetPasswordPage setPage={setPage} pageParams={pageParams} />}
      {page === "verify_email" && <EmailVerificationPage setPage={setPage} />}
      {page === "settings" && (
        isLoggedIn ? <SettingsPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "portfolio_settings" && (
        isLoggedIn ? (userRole === "student" ? <PortfolioSettingsPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />) : <AccessDenied setPage={setPage} />
      )}
      {page === "admin" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminDashboardPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "about" && <AboutPage setPage={setPage} isLoggedIn={isLoggedIn} />}
      {page === "messages" && (
        isLoggedIn ? <MessagesPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "pending_artworks" && (
        isLoggedIn && (userRole === "lecturer" || userRole === "admin") ? <PendingArtworksPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "edit_artwork" && (
        isLoggedIn ? <EditArtworkPage setPage={setPage} activeArtworkId={activeArtworkId} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_orders" && (
        userRole === "admin" ? <AdminOrdersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_users" && (
        userRole === "admin" ? <AdminUsersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_artworks" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminArtworksPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_export" && (
        (userRole === "admin" || userRole === "lecturer") ? (
          <AdminExportPage
            setPage={setPage}
            collections={collections}
            onOpenExportConfig={openExportConfig}
            onQuickCreateCollection={() => {
              const id = createCollection(`Moodboard mới`);
              if (id !== null) setCurrentExportCollection(id);
            }}
          />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_watermark" && (
        userRole === "admin" ? <AdminWatermarkPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_layout" && (
        userRole === "admin" ? (
          <div className="flex h-screen bg-[#F8F8F8] overflow-hidden">
            <AdminSidebar active="admin_layout" setPage={setPage} />
            <div className="flex-1 overflow-y-auto">
              <LayoutSettings setPage={setPage} />
            </div>
          </div>
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "collection_export_config" && (
        (userRole === "admin" || userRole === "lecturer") ? (
          <CollectionExportConfigPage
            setPage={setPage}
            collection={activeCollection}
            onUpdateCollection={updateActiveCollection}
            onOpenCatalogBuilder={(c) => handleOpenJournalFlow(c)}
          />
        ) : <AccessDenied setPage={setPage} />
      )}

      {/* Global: Save flow modal + toast */}
      <SaveToCollectionModal
        open={saveModal.open}
        artwork={saveModal.artwork}
        collections={collections}
        onClose={closeSaveFlow}
        onSave={saveToCollections}
        onCreateCollection={createCollection}
      />
      {toast && (
        <div className="fixed bottom-5 right-5 z-[80]">
          <div className="bg-[#212121] text-white rounded-2xl shadow-lg px-4 py-3 w-[320px] border border-white/10">
            <p className="text-sm font-bold">{toast.title}</p>
            {toast.message && <p className="text-xs text-white/80 mt-1 leading-relaxed">{toast.message}</p>}
          </div>
        </div>
      )}
      {catalogCollection && (
        <CatalogBuilderWizard
          collection={catalogCollection}
          onClose={() => setCatalogCollection(null)}
        />
      )}

      <JournalSettingsModal
        isOpen={showJournalSettings}
        onClose={() => setShowJournalSettings(false)}
        onContinue={(orientation) => {
          setJournalOrientation(orientation);
          setShowJournalSettings(false);
          setShowJournalBuilder(true);
        }}
      />
      
      <JournalBuilderModal
        isOpen={showJournalBuilder}
        onClose={() => setShowJournalBuilder(false)}
        collection={journalCollection}
        orientation={journalOrientation}
        initialDraft={journalDraft}
        onSaveDraft={handleSaveJournalDraft}
      />

      {/* ChatBot */}
      <ChatBot userRole={userRole} />
    </div>
  );
}







