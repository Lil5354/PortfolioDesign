import React, { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./lib/AuthContext";
import { LecturerCard } from "./components/ui/LecturerCard";
import { MajorCard } from "./components/ui/MajorCard";
import { api } from "./lib/api-client";
import CatalogBuilderWizard from "./components/catalog/CatalogBuilderWizard";
import NotificationBell from "./components/NotificationBell";
import { TranslationProvider, useI18n } from "./lib/i18n.jsx";
import { t } from "./lib/i18n.jsx";

import { saveAs } from "file-saver";
import {
  Image, Eye, Heart, Globe, LayoutDashboard, Folder, MessageSquare, BarChart2,
  Settings, Trash2, Edit2, Search, X, Check, ArrowDownCircle, ExternalLink,
  Maximize2, Lock, FileImage, ShieldAlert, Plus, Send, Clock, PenTool, Bookmark,
  Mail, Link, User, Briefcase, Unlock, FileDown, GripVertical, Users, LogOut, ChevronDown, MailOpen,
  MapPin, Phone, ArrowRight, Star, Monitor, BookOpen, Calendar, EyeOff, Archive,
  GraduationCap, Rocket, Upload, Menu, ShoppingCart, Languages,
  ShieldCheck, UserPlus, FileBadge, Zap, LayoutGrid, Building2, ClipboardList, Info, Filter
} from "lucide-react";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
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

const CERULEAN = "#077E9E";
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

  const userName = userData?.name || t("defaultUser");
  const userEmail = userData?.email || "";
  const userAvatar = userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
        <img src="/logo-uef.png" alt="UEF" className="h-9 object-contain" />
        <div>
          <h1 className="font-bold text-sm leading-tight">Design Gallery</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">{t("facultyName")}</p>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => setPage(item.id)} className={`pb-1 transition-colors ${isActive(item.id) ? "text-[#077E9E] border-b-2 border-[#077E9E]" : "text-gray-500 hover:text-[#212121]"}`}>{item.label}</button>
        ))}
      </nav>
      <button className="md:hidden flex items-center cursor-pointer text-[#666666] hover:text-[#212121]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
        {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
      </button>
      <div className="flex items-center gap-3 text-sm font-medium">
        {isLoggedIn && <NotificationBell setPage={setPage} />}
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
                className={`w-full text-left px-4 py-2 text-sm ${lang === 'vi' ? 'text-[#077E9E] font-bold bg-[#F0F8FB]' : 'text-[#212121] hover:bg-[#F8F8F8]'}`}>
                {t("tiengViet")}
              </button>
              <button onClick={() => { if (lang !== 'en') toggleLang(); setIsLangOpen(false); }}
                className={`w-full text-left px-4 py-2 text-sm ${lang === 'en' ? 'text-[#077E9E] font-bold bg-[#F0F8FB]' : 'text-[#212121] hover:bg-[#F8F8F8]'}`}>
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
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("messages"); setIsDropdownOpen(false); }}><Mail size={16} className="text-[#666666]" /> {t("inbox")}</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("admin"); setIsDropdownOpen(false); }}><LayoutDashboard size={16} className="text-[#666666]" /> {t("adminDashboard")}</div>
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
            <button onClick={() => setPage("auth")} className="bg-[#077E9E] text-white px-5 py-1.5 rounded-lg hover:bg-[#066a85] transition-colors">{t("login")}</button>
          </>
        )}
      </div>
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className="fixed top-14 left-0 right-0 bg-white border-b border-[#E0E0E0] shadow-lg z-40 md:hidden">
          <div className="flex flex-col py-2">
            {navItems.map((item) => (
              <button key={item.id} onClick={() => { setPage(item.id); setIsMobileMenuOpen(false); }} className={`px-6 py-3 text-sm font-medium text-left transition-colors ${isActive(item.id) ? "text-[#077E9E] bg-[#F0F8FB]" : "text-gray-600 hover:bg-[#F8F8F8]"}`}>{item.label}</button>
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
                    <button onClick={() => { setPage("admin"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]"><LayoutDashboard size={16} className="inline mr-2" />{t("admin")}</button>
                  </>
                )}
                <div className="border-t border-[#E0E0E0] my-1" />
                <button onClick={() => { onLogout && onLogout(); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-[#8B1A1A] hover:bg-[#FEF2F2]"><LogOut size={16} className="inline mr-2" />{t("logout")}</button>
              </>
            )}
            {!isLoggedIn && (
              <>
                <div className="border-t border-[#E0E0E0] my-1" />
                <button onClick={() => { setPage("auth"); setIsMobileMenuOpen(false); }} className="px-6 py-3 text-sm font-medium text-left text-[#077E9E] hover:bg-[#F0F8FB]">{t("login")}</button>
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
                        background: isBookmarked && isBookmarked(art.id) ? "rgba(7,126,158,0.92)" : "rgba(255,255,255,0.14)",
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

function GalleryPage({ setPage, setActiveArtworkId, onBookmarkClick, isBookmarked }) {
    const [category, setCategory] = useState("Tất cả");
  const [year, setYear] = useState("Tất cả");
  const [tool, setTool] = useState("Tất cả");
  const [sort, setSort] = useState("newest");
  const [page, setPageNum] = useState(1);
  const [data, setData] = useState({ artworks: [], total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const limit = 20;

  const categories = ["Tất cả", "Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const years = ["Tất cả", "2022-2023", "2023-2024", "2024-2025"];
  const tools = ["Tất cả", "Figma", "Illustrator", "Photoshop", "Blender", "Procreate", "After Effects", "InDesign", "Lightroom", "Cinema 4D"];

  useEffect(() => {
    setLoading(true);
    setPageNum(1);
  }, [category, year, tool, sort]);

  useEffect(() => {
    setLoading(true);
    const params = { page: String(page), limit: String(limit), sort };
    if (category !== "Tất cả") params.category = category;
    if (year !== "Tất cả") params.year = year;
    if (tool !== "Tất cả") params.tool = tool;
    api.artworks.list(params).then(res => {
      setData(res);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [category, year, tool, sort, page]);

  const mapped = (data.artworks || []).map((a, i) => ({
    id: a.id,
    title: a.title,
    student: a.user?.fullName || t("student"),
    img: a.coverImageUrl,
    likes: a.likeCount || 0,
    h: [240, 300, 350, 270, 320, 380][i % 6],
    isPublic: a.isPublic,
    category: a.subject,
  }));

  const paginate = (p) => setPageNum(Math.max(1, Math.min(p, data.totalPages || 1)));

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "32px 48px 0" }}>
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: BLACK, letterSpacing: "-1px" }}>{t("artworkLibrary")}</h1>
          <p style={{ color: MUTED, fontSize: 15, marginTop: 6 }}>{t("gallerySubtitle")}</p>
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{t("category")}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => { setCategory(c); }} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: category === c ? "none" : `1px solid ${GRAY_LIGHT}`, background: category === c ? BLACK : "#fff", color: category === c ? "#fff" : BLACK, transition: "all .15s" }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{t("schoolYear")}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {years.map(y => (
                <button key={y} onClick={() => setYear(y)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: year === y ? "none" : `1px solid ${GRAY_LIGHT}`, background: year === y ? BLACK : "#fff", color: year === y ? "#fff" : BLACK, transition: "all .15s" }}>{y}</button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>{t("tools")}</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tools.map(t => (
                <button key={t} onClick={() => setTool(t)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: tool === t ? "none" : `1px solid ${GRAY_LIGHT}`, background: tool === t ? BLACK : "#fff", color: tool === t ? "#fff" : BLACK, transition: "all .15s" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: MUTED }}>{data.total} {t("artworksFound")}</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setSort("newest")} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${sort === "newest" ? CERULEAN : GRAY_LIGHT}`, background: sort === "newest" ? `${CERULEAN}12` : "#fff", fontSize: 12, cursor: "pointer", color: sort === "newest" ? CERULEAN : BLACK, fontWeight: sort === "newest" ? 600 : 400 }}>{t("newest")}</button>
            <button onClick={() => setSort("most_likes")} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${sort === "most_likes" ? CERULEAN : GRAY_LIGHT}`, background: sort === "most_likes" ? `${CERULEAN}12` : "#fff", fontSize: 12, cursor: "pointer", color: sort === "most_likes" ? CERULEAN : BLACK, fontWeight: sort === "most_likes" ? 600 : 400 }}>{t("mostLiked")}</button>
          </div>
        </div>
      </div>
      <div style={{ padding: "0 48px 64px" }}>
        {loading ? (
          <GlobalLoading />
        ) : mapped.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: MUTED, fontSize: 14 }}>{t("noArtworksFound")}</div>
        ) : (
          <>
            <MasonryGrid
              items={mapped}
              onArtworkClick={(art) => {
                setActiveArtworkId && setActiveArtworkId(art.id);
                setPage("detail");
              }}
              showBookmarkAction={true}
              isBookmarked={isBookmarked}
              onBookmarkClick={onBookmarkClick}
            />
            {data.totalPages > 1 && (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, marginTop: 40 }}>
                <button onClick={() => paginate(page - 1)} disabled={page <= 1} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: page <= 1 ? GRAY_BG : "#fff", color: page <= 1 ? MUTED : BLACK, fontSize: 13, cursor: page <= 1 ? "not-allowed" : "pointer" }}>{t("previous")}</button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => paginate(p)} style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: p === page ? CERULEAN : GRAY_BG, color: p === page ? "#fff" : MUTED, fontSize: 13, fontWeight: p === page ? 600 : 400, cursor: "pointer" }}>{p}</button>
                ))}
                <button onClick={() => paginate(page + 1)} disabled={page >= data.totalPages} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: page >= data.totalPages ? GRAY_BG : "#fff", color: page >= data.totalPages ? MUTED : BLACK, fontSize: 13, cursor: page >= data.totalPages ? "not-allowed" : "pointer" }}>{t("next")}</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function PortfolioPage({ setPage, pageParams }) {
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

  const hashSlug = (window.location.hash.match(/^#\/portfolio\/(.+)/) || [])[1] || "";
  const slug = pageParams?.portfolioSlug || hashSlug;
  const titleByYear = { "Năm 1": t("freshmanDesigner"), "Năm 2": t("internDesigner"), "Năm 3": t("professionalDesigner"), "Năm 4": t("seniorDesigner"), "Tốt nghiệp": t("graduateDesigner") };

  useEffect(() => {
    setLoading(true);
    setPortfolioSettingsData(null);
    const fetchFn = slug ? api.portfolios.get(slug) : api.portfolios.me();
    const artworksFn = slug ? api.portfolios.artworks(slug, { limit: "50" }) : Promise.resolve({ artworks: [] });
    const statsFn = slug ? api.portfolios.stats(slug) : Promise.resolve({});

    Promise.all([
      fetchFn.catch(() => null),
      artworksFn.catch(() => ({ artworks: [] })),
      statsFn.catch(() => ({})),
    ]).then(([pData, artRes, pStats]) => {
      if (pData) {
        pData.stats = { ...(pData.stats || {}), ...pStats };
        if (pData.allArtworks) setPortfolioArtworks(pData.allArtworks);
        setPortfolioData(pData);
      }
      if (artRes?.artworks) setPortfolioArtworks(artRes.artworks);
      setLoading(false);
    }).catch(() => setLoading(false));

    api.portfolios.mine().then(data => {
      setPortfolioSettingsData(data);
    }).catch(() => {});
  }, [slug]);

  if (loading) return <GlobalLoading />;
  if (!portfolioData) return <div className="flex min-h-screen items-center justify-center text-[#666666]">{t("portfolioNotFound")}</div>;

  const { user, portfolioSettings, stats, featuredArtworks, privateGrade } = portfolioData;
  const profile = {
    fullName: user?.fullName || t("student"),
    profileHeadline: portfolioSettings?.profileHeadline || "Design Student",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    email: user?.email || "",
  };
  const socialLinksRaw = portfolioSettings?.socialLinks || {};
  const socialLinks = [
    socialLinksRaw.behance && { label: "Behance", href: socialLinksRaw.behance, icon: "globe" },
    socialLinksRaw.linkedin && { label: "LinkedIn", href: socialLinksRaw.linkedin, icon: "link" },
    profile.email && portfolioSettings?.showEmail && { label: t("email"), href: `mailto:${profile.email}`, icon: "mail" },
  ].filter(Boolean);

  const highlightWorks = (portfolioArtworks || []).filter(a => a.isHighlighted).slice(0, 2);
  const topLikedWorks = (portfolioArtworks || []).filter(a => !a.isHighlighted).sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 2);
  const extraWorks = highlightWorks.length >= 2 ? highlightWorks : [...highlightWorks, ...topLikedWorks].slice(0, 2);
  const allFeatured = [...(featuredArtworks || []), ...extraWorks.filter(ex => !(featuredArtworks || []).some(f => f.id === ex.id))];
  const featuredWorks = allFeatured.slice(0, 6).map((a, i) => {
    const layouts = ["col-span-12 lg:col-span-7", "col-span-12 sm:col-span-6 lg:col-span-5", "col-span-12 sm:col-span-6 lg:col-span-5", "col-span-12 sm:col-span-4", "col-span-12 sm:col-span-4", "col-span-12 sm:col-span-4"];
    return { id: a.id, title: a.title, img: a.coverImageUrl, tools: a.toolsUsed || [], colClass: layouts[i % layouts.length], rowSpan: [10, 5, 5, 5, 5, 5][i % 6] };
  });

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

  return (
    <div className="bg-white min-h-screen">
      <style>{`
        /* Portfolio public — phác thảo UI mới (Hero + Featured Bento) */
        .portfolio-hero-grid {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          gap: 28px;
        }
        @media (max-width: 1024px) {
          .portfolio-hero-grid { grid-template-columns: 1fr; }
        }
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-auto-rows: 26px;
          gap: 14px;
        }
        @media (max-width: 640px) {
          .bento-grid { grid-auto-rows: 24px; }
        }
      `}</style>

      {/* HERO SECTION (Flow #1 — UI tĩnh) */}
      <section className="relative overflow-hidden border-b border-[#E0E0E0]">
        {/* background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#077E9E]/10 via-white to-white" />
        <div className="absolute -top-24 -right-24 w-[520px] h-[520px] rounded-full bg-[#077E9E]/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-28 w-[520px] h-[520px] rounded-full bg-black/5 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pt-14 pb-10">
          <div className="portfolio-hero-grid items-start">
            {/* left */}
            <div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-sm bg-[#F8F8F8]">
                  <img src={profile.avatarUrl} alt={profile.fullName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-1">
                    {t("publicPortfolio")}
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#212121] leading-[1.05]">
                    {profile.fullName}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#666666] font-medium mb-2">
                {titleByYear[portfolioSettingsData?.portfolioSettings?.yearLevel || portfolioSettingsData?.yearLevel || portfolioSettings?.yearLevel || "Năm 3"]} • {portfolioSettingsData?.portfolioSettings?.major || portfolioSettingsData?.major || portfolioSettings?.major || t("graphicDesign")} • UEF
              </p>
              <p className="text-sm sm:text-[15px] text-[#444444] leading-relaxed max-w-2xl">
                {profile.bio}
              </p>

              {/* social links */}
              <div className="flex flex-wrap gap-2.5 mt-6">
                {socialLinks.map((l) => {
                  const iconMap = {
                    globe: <Globe size={16} className="text-[#077E9E]" />,
                    link: <Link size={16} className="text-[#077E9E]" />,
                    mail: <Mail size={16} className="text-[#077E9E]" />,
                  };
                  return (
                    <a
                      key={l.label}
                      href={l.href}
                      target={l.href.startsWith("http") ? "_blank" : undefined}
                      rel={l.href.startsWith("http") ? "noreferrer" : undefined}
                      className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-[#E0E0E0] bg-white text-[#212121] text-sm font-semibold hover:border-[#077E9E] hover:shadow-sm transition-all"
                    >
                      {iconMap[l.icon]}
                      <span>{l.label}</span>
                      {l.href.startsWith("http") && <ExternalLink size={14} className="text-[#666666]" />}
                    </a>
                  );
                })}
              </div>

              {/* CTA */}
              <div className="flex flex-wrap gap-3 mt-8">
                <button
                  className="px-5 py-2.5 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors"
                  onClick={() => setIsContactModalOpen(true)}
                >
                  {t("contact")}
                </button>
                <button className="px-5 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-[#212121] text-sm font-semibold hover:bg-[#F8F8F8] transition-colors">
                  {t("share")}
                </button>
              </div>

              {/* quick stats (giữ tinh thần thiết kế cũ) */}
              <div className="mt-10 flex flex-wrap gap-8 border-t border-[#E0E0E0] pt-6">
                {[{ label: t("artworks"), val: stats?.artworkCount || 0 }, { label: t("views"), val: stats?.viewCount?.toLocaleString() || "0" }, { label: t("likes"), val: stats?.likeCount?.toLocaleString() || "0" }].map((s) => (
                  <div key={s.label} className="flex items-end gap-2">
                    <span className="text-2xl font-extrabold text-[#212121] tracking-tight">{s.val}</span>
                    <span className="text-sm text-[#666666] pb-0.5">{s.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* right (teaser bento nhỏ để tăng “wow”) */}
            <div className="bg-white/70 backdrop-blur-sm border border-[#E0E0E0] rounded-2xl p-4 shadow-sm">
              <p className="text-xs font-semibold tracking-widest uppercase text-[#666666] mb-3">
                Featured snapshot
              </p>
              <div className="grid grid-cols-2 gap-3">
                {featuredWorks.slice(0, 4).map((w) => (
                  <div key={w.id} className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] aspect-[4/3]">
                    <img src={w.img} alt={w.title} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <p className="text-[11px] text-[#666666] mt-3 leading-relaxed">
                * Demo UI — sau này “Featured” sẽ được chọn tự động theo highlight của giảng viên / lượt view / pin.
              </p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 pb-20">
        {/* FEATURED CASE STUDIES (Flow #3 — UI tĩnh) */}
        <section className="pt-12">
          <div className="flex items-end justify-between gap-6 mb-6">
            <div>
              <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-2">Featured Case Studies</p>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121] tracking-tight">{t("featuredProjects")}</h2>
              <p className="text-sm text-[#666666] mt-2 max-w-2xl">
                {t("bentoDescription")}
              </p>
            </div>
            <button className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#212121] hover:bg-[#F8F8F8] transition-colors">
              {t("viewAll")}
            </button>
          </div>

          <div className="bento-grid">
            {featuredWorks.map((w) => (
              <div
                key={w.id}
                onClick={() => setPage && setPage("detail", { artworkId: w.id })}
                className={`group relative overflow-hidden rounded-2xl border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer ${w.colClass}`}
                style={{ gridRow: `span ${w.rowSpan}` }}
              >
                <img
                  src={w.img}
                  alt={w.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-x-0 bottom-0 p-5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  <p className="text-white text-[15px] font-bold leading-snug mb-3">{w.title}</p>
                  <div className="flex flex-wrap gap-2">
                    {w.tools.map((t) => (
                      <span
                        key={t}
                        className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/10 border border-white/20 text-white"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {privateGrade && (
        <div className="mt-10" style={{ background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, borderRadius: 10, padding: "14px 18px", marginBottom: 28, display: "flex", gap: 14, alignItems: "flex-start" }}>
          <div style={{ background: BLACK, borderRadius: 6, padding: "4px 8px", display: "flex", alignItems: "center", gap: 4 }}>
            <Lock size={12} color="#fff" />
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>{t("privateUppercase")}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: BLACK }}>{t("lecturerFeedback")}</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: MUTED }}>{t("totalScore")}</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: CERULEAN }}>{privateGrade.score}</span>
                <span style={{ fontSize: 13, color: MUTED }}>/10</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.6, marginBottom: 0 }}>{privateGrade.comment}</p>
          </div>
        </div>
        )}

        <TimelineSection slug={slug || ''} />

        <div style={{ borderBottom: `1px solid ${GRAY_LIGHT}`, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 0 }}>
{[t("allArtworks"), "Poster", "Branding", "UI/UX"].map((tab, i) => (
                <button key={tab} style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? BLACK : MUTED, borderBottom: i === 0 ? `2px solid ${BLACK}` : "2px solid transparent", marginBottom: -1 }}>{tab}</button>
            ))}
          </div>
        </div>
        <MasonryGrid items={artworks.slice(0, 6)} onArtworkClick={(art) => { setPage("detail", { artworkId: art.id }); }} />
        <div style={{ height: 64 }} />
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
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#077E9E]" />
                </div>
                <h4 className="text-xl font-bold text-[#212121] mb-2">{t("sentSuccessfully")}</h4>
                <p className="text-sm text-[#666666] mb-6">{t("messageSentTo")}{profile.fullName}.</p>
                <button onClick={closeContactModal} className="w-full py-2.5 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-semibold text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer">{t("close")}</button>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("fullNameOrOrg")}</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" placeholder={t("enterYourName")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("contactEmail")}</label>
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="email@company.com" className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("purpose")}</label>
                  <select value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] bg-white cursor-pointer">
                    <option value={t("recruitmentInternship")}>{t("recruitmentInternship")}</option>
                    <option value={t("freelanceCollaboration")}>{t("freelanceCollaboration")}</option>
                    <option value={t("other")}>{t("other")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">{t("content")}</label>
                  <textarea value={contactContent} onChange={e => setContactContent(e.target.value)} placeholder={t("enterMessageContent")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] min-h-[100px] resize-y" />
                </div>
                <button onClick={handleContactSubmit} disabled={contactState === "loading"} className={`mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex justify-center items-center gap-2 ${contactState === "loading" ? "bg-[#666666] cursor-wait" : "bg-[#077E9E] hover:opacity-90 cursor-pointer"}`}>
                  {contactState === "loading" ? t("sending") : <><Send size={16} /> {t("sendMessage")}</>}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function ToggleSwitch({ isOn, onToggle }) {
  return (
    <div onClick={onToggle} style={{ width: 38, height: 20, borderRadius: 10, background: isOn ? CERULEAN : GRAY_LIGHT, cursor: "pointer", position: "relative", transition: "background .2s", flexShrink: 0 }}>
      <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#fff", position: "absolute", top: 2, left: isOn ? 20 : 2, transition: "left .2s", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }} />
    </div>
  );
}

function DashboardSidebar({ activePage, setPage, userData }) {
    const items = [
    { icon: <Image size={18} />, label: t("myArtworks"), page: "dashboard" },
    { icon: <MessageSquare size={18} />, label: t("inbox"), page: "messages" },
    { icon: <User size={18} />, label: t("accountSettings"), page: "settings" },
    { icon: <Briefcase size={18} />, label: t("portfolioSettings"), page: "portfolio_settings" },
  ];
  const profileName = userData?.name || t("student");
  const profileAvatar = userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";
  const studentYear = t("student");

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
            <div key={item.page} onClick={() => setPage(item.page)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", background: isActive ? "#F0F8FB" : "transparent", borderRight: isActive ? `3px solid ${CERULEAN}` : "3px solid transparent" }}>
              <span style={{ color: isActive ? CERULEAN : MUTED, display: "flex" }}>{item.icon}</span>
              <span style={{ fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? CERULEAN : BLACK }}>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DashboardPage({ setPage, setEditingArtworkId, setActiveArtworkId, userData }) {
    const [artworksList, setArtworksList] = useState([]);
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
          <button onClick={() => setPage("upload")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={18} color="#fff" />
            {t("uploadNewArtwork")}
          </button>
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
              {artworksList.map(art => (
                <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                  <div style={{ position: "relative", background: GRAY_BG }}>
                    <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => { setActiveArtworkId(art.id); setPage("detail"); }} />
                    <div style={{ position: "absolute", top: 8, left: 8 }}>
                      <span style={{ background: art.isPublic ? "#E8F4F8" : "#F8F8F8", color: art.isPublic ? CERULEAN : MUTED, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: `1px solid ${art.isPublic ? "#B3D9E8" : GRAY_LIGHT}` }}>{art.isPublic ? t("public") : t("private")}</span>
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
                        <ToggleSwitch isOn={art.isPublic} onToggle={() => {}} />
                      </div>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => { setActiveArtworkId(art.id); setTimeout(() => setPage("edit_artwork"), 50); }} style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Edit2 size={14} color={BLACK} strokeWidth={1.5} />
                        </button>
                        <button style={{ width: 30, height: 30, borderRadius: 6, border: `1px solid #F5C5C5`, background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Trash2 size={14} color={CRIMSON} strokeWidth={1.5} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {collabArtworks.length > 0 && (
              <>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: BLACK, marginTop: 40, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Users size={20} color={CERULEAN} /> {t("coAuthor")} ({collabArtworks.length})
              </h3>
    <div className="masonry-3" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {collabArtworks.map(art => (
                  <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                    <div style={{ position: "relative", background: GRAY_BG }}>
                      <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => { setActiveArtworkId(art.id); setPage("detail"); }} />
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

function UploadPage({ setPage, setActiveArtworkId }) {
    const [showPopup, setShowPopup] = useState(false);
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

  const handleUploadSubmit = async () => {
    if (!coverImage) { setError(t("pleaseSelectCoverImage")); return; }
    if (!title.trim()) { setError(t("pleaseEnterCourseName")); return; }
    if (!subject) { setError(t("pleaseSelectCategory")); return; }
    if (!checked1 || !checked2 || !checked3) { setError(t("pleaseConfirmCommitments")); return; }
    setError("");
    setUploadState("loading");
    try {
      const newArtwork = await api.artworks.create({
        title: title.trim(),
        description: description.trim() || null,
        subject,
        toolsUsed: tools,
        semester: yearToSemester[projectYear] || "HK1",
        academicYear: yearToAcademic[projectYear] || "2024-2025",
        tags: tags.length > 0 ? tags : [subject],
        collaborators: friends.map(f => f.fullName || f),
        collaboratorIds: friends.map(f => f.id).filter(Boolean),
        fileUrls: allFileUrls,
        coverImageUrl: coverImage,
        watermarkText: "UEF",
        watermarkPosition: "bottom-right",
        isPublic: false,
        isAiConfirmed: checked1,
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
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#077E9E]" />
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
                  <button onClick={() => setShowPopup(false)} disabled={uploadState === "loading"} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: uploadState === "loading" ? "not-allowed" : "pointer", color: MUTED }}>{t("cancel")}</button>
                  <button onClick={handleUploadSubmit} disabled={(!checked1 || !checked2 || !checked3) || uploadState === "loading"} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: (checked1 && checked2 && checked3 && !uploadState) ? CERULEAN : GRAY_LIGHT, color: (checked1 && checked2 && checked3 && !uploadState) ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: (checked1 && checked2 && checked3 && !uploadState) ? "pointer" : "not-allowed" }}>
                    {uploadState === "loading" ? t("processing") : t("confirmAndPost")}
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>{t("coverImage")}</label>
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
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("courseName")}</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Design Graphic - Flowers Garden" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, color: BLACK, outline: "none", boxSizing: "border-box", background: GRAY_BG }} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("projectType")}</label>
              <div style={{ display: "flex", gap: 6 }}>{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${projectYear === y ? CERULEAN : GRAY_LIGHT}`, background: projectYear === y ? "#F0F8FB" : GRAY_BG, color: projectYear === y ? CERULEAN : MUTED, fontSize: 12, fontWeight: projectYear === y ? 600 : 400, cursor: "pointer" }}>{y}</button>))}</div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("projectCategory")}</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ key: false, label: t("individual"), desc: t("selfPerformed"), icon: <User size={16} /> }, { key: true, label: t("group"), desc: t("teamwork"), icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${isGroupProject === opt.key ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", background: isGroupProject === opt.key ? "#F0F8FB" : GRAY_BG }}><span style={{ color: isGroupProject === opt.key ? CERULEAN : MUTED }}>{opt.icon}</span><div><p style={{ fontSize: 13, fontWeight: 600, color: isGroupProject === opt.key ? CERULEAN : BLACK, margin: 0 }}>{opt.label}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{opt.desc}</p></div></div>))}
              </div>
            </div>
            {isGroupProject && (<div style={{ position: "relative" }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("addTeamMembers")}</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{friends.map((f, i) => (<span key={f.id || i} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}><User size={12} /> {f.fullName || f}<X size={12} color={CERULEAN} onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} style={{ cursor: "pointer" }} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder={t("enterNameOrEmail")} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 120, color: BLACK, flex: 1 }} /></div>{friendResults.length > 0 && (<div style={{ position: "absolute", zIndex: 50, top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 200, overflowY: "auto" }}>{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${GRAY_LIGHT}` }}><img src={u.avatarUrl || ""} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG }} /><div><p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: BLACK }}>{u.fullName}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{u.email}</p></div></div>))}</div>)}</div>)}
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
                  {tools.map(t => (<span key={t} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>{t}<X size={12} color={CERULEAN} onClick={() => setTools(tools.filter(x => x !== t))} style={{ cursor: "pointer", marginLeft: 4 }} /></span>))}
                  <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} />
                </div>
              </div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>{t("tags")}</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{tags.map(tag => (<span key={tag} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}>{tag}<X size={12} color={CERULEAN} onClick={() => setTags(tags.filter(x => x !== tag))} style={{ cursor: "pointer" }} /></span>))}<input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder={t("addTagPlaceholder")} style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} /></div></div>
            <div style={{ background: "#FEFCF3", border: `1px solid #F0E6CC`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <div onClick={() => setAgreedToTerms(!agreedToTerms)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreedToTerms ? CERULEAN : GRAY_LIGHT}`, background: agreedToTerms ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>{agreedToTerms && <Check size={12} color="#fff" strokeWidth={3} />}</div>
                <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>{t("fullCommitment")}</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div onClick={() => setNotifyOnConfirm(!notifyOnConfirm)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${notifyOnConfirm ? CERULEAN : GRAY_LIGHT}`, background: notifyOnConfirm ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>{notifyOnConfirm && <Check size={12} color="#fff" strokeWidth={3} />}</div>
                <span style={{ fontSize: 12, color: "#666" }}>{t("notifyOnConfirmText")}</span>
              </div>
            </div>
            <div style={{ paddingTop: 4 }}>
              <button onClick={() => setShowPopup(true)} disabled={!agreedToTerms} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: agreedToTerms ? CERULEAN : GRAY_LIGHT, color: agreedToTerms ? "#fff" : MUTED, fontSize: 15, fontWeight: 700, cursor: agreedToTerms ? "pointer" : "not-allowed", letterSpacing: "0.3px" }}>{t("submitArtwork")}</button>
              <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 8 }}>{t("postSubmissionNote")}</p>
            </div>
          </div>
        </div>
      </div>
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
      let recipientSlug = "uef-design-gallery";
      try {
        const artworkData = await api.artworks.get(activeArtworkId);
        const ownerSlug = artworkData?.user?.portfolioSettings?.portfolioSlug;
        if (ownerSlug) recipientSlug = ownerSlug;
      } catch {}

      await api.messages.send({
        recipientSlug,
        senderName: orderData.name.trim(),
        senderEmail: orderData.email.trim(),
        senderCompany: orderData.company.trim() || null,
        purpose: "order",
        content: JSON.stringify({
          artworkId: activeArtworkId,
          artworkTitle: t("orderedArtwork"),
          artworkImage: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
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
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
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
  const [commentText, setCommentText] = useState("");
  const [sendingComment, setSendingComment] = useState(false);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeComment, setGradeComment] = useState("");
  const [existingGrade, setExistingGrade] = useState(null);
  const [savingGrade, setSavingGrade] = useState(false);
  const [relatedArtworks, setRelatedArtworks] = useState([]);
  const [liking, setLiking] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("");
  const [reportDetail, setReportDetail] = useState("");
  const [sendingReport, setSendingReport] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [shareToast, setShareToast] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloading, setDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: "",
  });
  const [sendingOrder, setSendingOrder] = useState(false);
  useEffect(() => { const h = (e) => { if (e.key === 'Escape') setShowFullscreen(false); }; window.addEventListener('keydown', h); return () => window.removeEventListener('keydown', h); }, []);

  const currentUserId = authUser?.id;
  const currentUserRole = authUser?.role;
  const canGrade = currentUserRole === "lecturer" || currentUserRole === "admin";

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
      }
      setLoading(false);
    }).catch(() => { setLoadError(true); setLoading(false); });
    api.artworks.related(activeArtworkId, 6).then(setRelatedArtworks).catch(() => {});
  }, [activeArtworkId]);

  const handleLike = async () => {
    if (liking) return;
    setLiking(true);
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

  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUserId) {
      alert(t("loginToComment"));
      return;
    }
    setSendingComment(true);
    try {
      const newComment = await api.artworks.comments.create(activeArtworkId, commentText.trim());
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch (e) {
      alert(t("commentError") + (e?.message || t("pleaseTryAgain")));
    }
    setSendingComment(false);
  };

  const handleSaveGrade = async () => {
    if (!gradeScore || !canGrade) return;
    setSavingGrade(true);
    try {
      const result = await api.artworks.grade(activeArtworkId, {
        score: parseFloat(gradeScore),
        comment: gradeComment || null,
      });
      setExistingGrade(result);
    } catch (e) {
      alert(t("gradeError") + (e?.message || t("pleaseTryAgain")));
    }
    setSavingGrade(false);
  };

  const allImages = [art.coverImageUrl, ...(art.fileUrls || [])].filter(Boolean);
  const allImagesDeduped = [...new Set(allImages)];
  const activeImage = allImagesDeduped[activeImageIdx] || allImagesDeduped[0] || art.coverImageUrl;

  const semesterMeta = {
    HK1: { label: "Năm 1", icon: <Rocket size={12} /> },
    HK2: { label: "Năm 2", icon: <BookOpen size={12} /> },
    HK3: { label: "Năm 3", icon: <GraduationCap size={12} /> },
  };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
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

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "20px 48px", borderBottom: `1px solid ${GRAY_LIGHT}`, display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: MUTED, cursor: "pointer" }} onClick={() => setPage("gallery")}>Gallery</span>
        <span style={{ fontSize: 13, color: MUTED }}>/</span>
        <span style={{ fontSize: 13, color: MUTED }}>{art.subject || t("artwork") }</span>
        <span style={{ fontSize: 13, color: MUTED }}>/</span>
        <span style={{ fontSize: 13, color: BLACK, fontWeight: 500 }}>{art.title}</span>
      </div>

      <div className="detail-grid" style={{ display: "grid", gridTemplateColumns: "65fr 35fr", minHeight: "calc(100vh - 105px)" }}>
        <div className="detail-image-panel" style={{ background: GRAY_BG, display: "flex", flexDirection: "row", alignItems: "stretch", position: "relative", padding: 0 }}>
          {allImagesDeduped.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 12px", overflowY: "auto", flexShrink: 0, zIndex: 3, justifyContent: "center" }}>
              {allImagesDeduped.map((url, idx) => (
                <div key={idx} onClick={() => setActiveImageIdx(idx)} style={{ width: 56, height: 48, borderRadius: 6, overflow: "hidden", border: `2px solid ${idx === activeImageIdx ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", opacity: idx === activeImageIdx ? 1 : 0.55, transition: "all .15s", flexShrink: 0 }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", padding: 0, overflow: "hidden" }}>
            <span style={{ position: "relative", display: "inline-block", maxWidth: "100%", maxHeight: "100%" }}>
              <img src={activeImage} alt={art.title} style={{ maxWidth: "100%", maxHeight: "100%", width: "auto", height: "auto", display: "block" }} />
              <span style={{ position: "absolute", bottom: 12, right: 12, pointerEvents: "none", zIndex: 2 }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13, fontWeight: 900, userSelect: "none", letterSpacing: 3, textTransform: "uppercase", background: "rgba(0,0,0,0.55)", padding: "4px 12px", borderRadius: 4, backdropFilter: "blur(2px)" }}>{art.watermarkText || "UEF"}</span>
              </span>
            </span>
            <div style={{ position: "absolute", bottom: 20, right: 24, display: "flex", gap: 8, zIndex: 3 }}>
              <button onClick={() => setShowFullscreen(true)} title={t("zoomIn")} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Maximize2 size={16} /></button>
              <button onClick={() => setShowDownloadModal(true)} title={t("download")} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><FileDown size={16} /></button>
              <button onClick={async () => { try { await navigator.clipboard.writeText(window.location.href); setShareToast(true); setTimeout(() => setShareToast(false), 2000); } catch { prompt(t("copyLinkPrompt"), window.location.href); } }} title={t("copyLink")} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}><Link size={16} /></button>
            </div>
          </div>
          {shareToast && <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 100, background: BLACK, color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>{t("linkCopied")}</div>}
          {showDownloadModal && (
            <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDownloadModal(false)}>
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
                        className="flex items-center justify-between w-full px-4 py-3 rounded-lg border border-[#E0E0E0] hover:border-[#077E9E] hover:bg-[#F0F8FB] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={downloading}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#E8F4F8] flex items-center justify-center text-[#077E9E] font-bold text-xs uppercase">{opt.key}</div>
                          <div className="text-left">
                            <p className="text-sm font-semibold text-[#212121]">{opt.label}</p>
                            <p className="text-xs text-[#666666]">{opt.desc}</p>
                          </div>
                        </div>
                        {downloading && downloadFormat === opt.key ? (
                          <span className="inline-block w-4 h-4 border-2 border-[#077E9E] border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span>
                        ) : <FileDown size={16} className="text-[#077E9E]" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="detail-info-panel" style={{ borderLeft: `1px solid ${GRAY_LIGHT}`, padding: "32px 28px", overflow: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ background: "#F0F8FB", color: CERULEAN, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10 }}>{art.subject}</span>
              <span style={{ fontSize: 12, color: MUTED }}>{new Date(art.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: BLACK, lineHeight: 1.3 }}>{art.title}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {art.semester && <span style={{ background: "#FEF3E2", color: "#92400E", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}>{(semesterMeta[art.semester]?.icon) || <BookOpen size={12} />} {semesterMeta[art.semester]?.label || art.semester}</span>}
              {art.academicYear && <span style={{ background: "#E8F0FE", color: "#1E40AF", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {art.academicYear}</span>}
              {(art.collaborators || []).length > 0 && <span style={{ background: "#F0FDF4", color: "#166534", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {(art.collaborators || []).length} {t("members")}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"}
                alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert(t("portfolioNotSetup"));
                }}
              />
              <span
                style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert(t("portfolioNotSetup"));
                }}
              >{art.user?.fullName}</span>
              <span style={{ fontSize: 12, color: MUTED }}>·</span>
              <span
                style={{ fontSize: 12, color: CERULEAN, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert(t("portfolioNotSetup"));
                }}
              >{t("viewPortfolio")}</span>
            </div>
          </div>

          {art.subject && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{t("category")}</span>
            <div style={{ marginTop: 4 }}>
              <span style={{ background: "#F0F8FB", color: CERULEAN, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8, border: `1px solid #B3D9E8` }}>{art.subject}</span>
            </div>
          </div>}

          {(art.toolsUsed || []).length > 0 && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{t("toolsUsed")}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {art.toolsUsed.map(tool => (
                <span key={tool} style={{ background: "#F0F0F0", color: "#333", fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}` }}>{tool}</span>
              ))}
            </div>
          </div>}

          {(art.collaborators || []).length > 0 && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>{t("coAuthor")}</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {(art.collaborators || []).map(c => (
                <span key={c} style={{ background: "#F0FDF4", color: "#166534", fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid #BBF7D0`, display: "flex", alignItems: "center", gap: 4 }}>
                  <Users size={12} /> @{typeof c === 'object' ? c.fullName || c.email : c}
                </span>
              ))}
            </div>
          </div>}

          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
            {(art.tags || []).map(tag => (
              <span key={tag} style={{ background: GRAY_BG, fontSize: 11, padding: "4px 10px", borderRadius: 12, color: "#555", cursor: "pointer", border: `1px solid ${GRAY_LIGHT}` }}>{tag}</span>
            ))}
          </div>

          <p style={{ fontSize: 13, color: "#444", lineHeight: 1.75, marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
            {art.description || t("noDescription") }
          </p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, paddingBottom: 20, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
            <div style={{ display: "flex", gap: 14 }}>
              <button onClick={handleLike} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${isLiked ? "#F5C5C5" : GRAY_LIGHT}`, background: isLiked ? "#FEF2F2" : "#fff", cursor: "pointer", transition: "all .15s" }}>
                <Heart size={16} fill={isLiked ? "#E53E3E" : "none"} color={isLiked ? "#E53E3E" : MUTED} />
                <span style={{ fontSize: 13, color: isLiked ? "#E53E3E" : MUTED, fontWeight: isLiked ? 600 : 400 }}>{likeCount}</span>
              </button>
              <button style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer" }}>
                <MessageSquare size={16} color={MUTED} />
                <span style={{ fontSize: 13, color: MUTED }}>{comments.length}</span>
              </button>
            </div>
             <div style={{ display: "flex", gap: 8 }}>
               <button
                 onClick={() => onBookmarkClick && onBookmarkClick(art)}
                 style={{
                   padding: "8px 14px",
                   borderRadius: 8,
                   border: `1px solid ${isBookmarked && isBookmarked(art.id) ? "#B3D9E8" : GRAY_LIGHT}`,
                   background: isBookmarked && isBookmarked(art.id) ? "#F0F8FB" : "#fff",
                   fontSize: 13,
                   cursor: "pointer",
                   color: isBookmarked && isBookmarked(art.id) ? CERULEAN : BLACK,
                   display: "flex",
                   alignItems: "center",
                   gap: 6,
                   fontWeight: isBookmarked && isBookmarked(art.id) ? 600 : 400,
                 }}
               >
                 <Bookmark
                   size={16}
                   fill={isBookmarked && isBookmarked(art.id) ? CERULEAN : "none"}
                   color={isBookmarked && isBookmarked(art.id) ? CERULEAN : MUTED}
                 />
                 {isBookmarked && isBookmarked(art.id) ? t("saved") : t("save")}
               </button>
               <button onClick={() => setShowReport(true)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <ShieldAlert size={16} /> {t("report")}
                </button>
                <button onClick={() => setShowOrderModal(true)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid #10B981`, background: "#ECFDF5", color: "#059669", fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <ShoppingCart size={16} /> {t("order")}
               </button>
             </div>
          </div>

          {canGrade && (
            <div style={{ background: GRAY_BG, borderRadius: 12, padding: "20px", border: `1px solid ${GRAY_LIGHT}`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <div style={{ width: 28, height: 28, background: "#E8F4F8", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Check size={16} color={CERULEAN} strokeWidth={2} />
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: 0, color: BLACK }}>
                    {existingGrade ? t("graded") : t("lecturerReview")}
                  </p>
                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
                    {existingGrade ? `${t("score")}: ${existingGrade.score}/10` : t("enterScoreAndComment")}
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t("scoreRange")}</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={gradeScore} onChange={e => setGradeScore(e.target.value)} type="number" min="0" max="10" step="0.5" placeholder="8.5" style={{ width: 80, padding: "9px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, color: CERULEAN, background: "#fff", outline: "none", textAlign: "center" }} />
                  <div>
                    <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{t("enterScoreRange")}</p>
                    {gradeScore && <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <div key={n} style={{ width: 14, height: 5, borderRadius: 2, background: parseFloat(gradeScore) >= n ? CERULEAN : GRAY_LIGHT }} />)}
                    </div>}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{t("critiqueAndFeedback")}</label>
                <textarea value={gradeComment} onChange={e => setGradeComment(e.target.value)} placeholder={t("gradeCommentPlaceholder")} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, lineHeight: 1.6, resize: "vertical", minHeight: 100, background: "#fff", outline: "none", fontFamily: "inherit", color: BLACK, boxSizing: "border-box" }} />
              </div>
              <button onClick={handleSaveGrade} disabled={!gradeScore || savingGrade} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: gradeScore && !savingGrade ? CERULEAN : GRAY_LIGHT, color: gradeScore && !savingGrade ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: gradeScore && !savingGrade ? "pointer" : "not-allowed" }}>
                {savingGrade ? t("saving") : existingGrade ? t("updateGrade") : t("saveGrade")}
              </button>
            </div>
          )}

          {existingGrade && !canGrade && (
            <div style={{ background: "#F0FFF0", borderRadius: 12, padding: "20px", border: `1px solid #C6F6C6`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: CERULEAN }}>{existingGrade.score}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: BLACK }}>{t("gradeScore")}</p>
                  {existingGrade.comment && <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.5 }}>{existingGrade.comment}</p>}
                  {existingGrade.lecturer && <p style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>{t("by")}: {existingGrade.lecturer.fullName}</p>}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: BLACK, marginBottom: 16 }}>{t("comments")} ({comments.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div style={{ border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, padding: 12, background: GRAY_BG }}>
                {currentUserId ? (
                  <>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder={t("leaveCommentPlaceholder")} style={{ width: "100%", border: "none", background: "transparent", outline: "none", resize: "none", minHeight: 60, fontSize: 13, color: BLACK, fontFamily: "inherit" }} />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <button onClick={handleSendComment} disabled={!commentText.trim() || sendingComment} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: commentText.trim() && !sendingComment ? CERULEAN : GRAY_LIGHT, color: commentText.trim() && !sendingComment ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: commentText.trim() && !sendingComment ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                        <Send size={14} /> {sendingComment ? t("sending") : t("sendComment")}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ fontSize: 13, color: MUTED, margin: "0 0 10px" }}>{t("pleaseLoginToComment1")} <strong style={{ color: CERULEAN, cursor: "pointer" }} onClick={() => setPage("auth")}>{t("login")}</strong> {t("pleaseLoginToComment2")}</p>
                  </div>
                )}
              </div>
              {comments.length === 0 && (
                <p style={{ fontSize: 13, color: MUTED, textAlign: "center", padding: "20px 0" }}>{t("noComments")}</p>
              )}
              {comments.map(cmt => (
                <div key={cmt.id} style={{ display: "flex", gap: 12 }}>
                  <img src={cmt.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: BLACK }}>
                        {cmt.user?.fullName}
                        {cmt.user?.id === art.userId && <span style={{ fontSize: 11, color: CERULEAN, fontWeight: 400, marginLeft: 4 }}>{t("author")}</span>}
                      </p>
                      <span style={{ fontSize: 11, color: MUTED }}>{timeAgo(cmt.createdAt)}</span>
                    </div>
                    <p style={{ fontSize: 13, color: BLACK, margin: 0, lineHeight: 1.5 }}>{cmt.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {showFullscreen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.92)' }} onClick={() => setShowFullscreen(false)}>
          <button onClick={() => setShowFullscreen(false)} style={{ position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, zIndex: 10 }}>✕</button>
          <div style={{ position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", color: "rgba(255,255,255,0.5)", fontSize: 12, zIndex: 10 }}>{t("pressEscToClose")}</div>
          <div className="flex items-center justify-center p-8 w-full h-full" onClick={e => e.stopPropagation()}>
            {allImagesDeduped.length > 1 && (
              <button onClick={() => setActiveImageIdx(prev => prev > 0 ? prev - 1 : allImagesDeduped.length - 1)} style={{ position: "absolute", left: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, zIndex: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
              </button>
            )}
            <img src={activeImage} alt={art.title} style={{ maxWidth: "90vw", maxHeight: "90vh", objectFit: "contain", borderRadius: 4 }} />
            {allImagesDeduped.length > 1 && (
              <button onClick={() => setActiveImageIdx(prev => prev < allImagesDeduped.length - 1 ? prev + 1 : 0)} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 20, zIndex: 10 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
              </button>
            )}
          </div>
        </div>
      )}

      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E0E0E0] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#212121]">{t("reportArtwork")}</h3>
              <button onClick={() => setShowReport(false)} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-[#666666] mb-3">{t("violationType")}</label>
              <div className="flex flex-wrap gap-2 mb-5">
                {[t("plagiarism"), t("inappropriateContent"), t("falseInformation"), t("copyrightInfringement"), t("spam"), t("other")].map(type => (
                  <button key={type} onClick={() => setReportType(type)} className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${reportType === type ? "bg-[#077E9E] text-white border-[#077E9E]" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8]"}`}>{type}</button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-[#666666] mb-2">{t("violationDetails")}</label>
              <textarea value={reportDetail} onChange={e => setReportDetail(e.target.value)} placeholder={t("describeViolation")} className="w-full p-3 rounded-lg border border-[#E0E0E0] text-sm outline-none focus:border-[#077E9E] resize-vertical min-h-[120px] font-inherit text-[#212121] box-border" style={{ fontFamily: "inherit" }} />
              <button onClick={async () => {
                if (!reportType) return;
                setSendingReport(true);
                try {
                  await api.artworks.report(activeArtworkId, { violationType: reportType, detail: reportDetail });
                  setShowReport(false);
                  setReportType("");
                  setReportDetail("");
                  alert(t("reportSubmitted"));
                } catch (e) {
                  alert(t("reportError") + (e?.message || t("pleaseTryAgain")));
                }
                setSendingReport(false);
              }} disabled={!reportType || sendingReport} className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer ${!reportType || sendingReport ? "bg-[#E0E0E0] text-[#999]" : "bg-[#8B1A1A] text-white hover:bg-opacity-90"}`}>
                {sendingReport ? t("sending") : t("submitReport")}
              </button>
            </div>
          </div>
        </div>
      )}

      {relatedArtworks.length > 0 && (
        <div style={{ padding: "40px 48px 64px", borderTop: `1px solid ${GRAY_LIGHT}` }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BLACK, marginBottom: 24 }}>{t("exploreMore")}</h3>
          <MasonryGrid
            items={relatedArtworks.map((a, i) => ({
              id: a.id, title: a.title, student: a.user?.fullName || "", img: a.coverImageUrl,
              likes: a.likeCount || 0, h: [240, 300, 350, 270, 320][i % 5], isPublic: a.isPublic, category: a.subject,
            }))}
            showHover={true}
            onArtworkClick={(art) => { setPage("detail"); setTimeout(() => setActiveArtworkId(art.id), 50); }}
          />
        </div>
      )}
      {showOrderModal && activeArtworkId && (
        <OrderModal setPage={setPage} activeArtworkId={activeArtworkId} onClose={() => setShowOrderModal(false)} />
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
    fetch("/api/auth/csrf").then(r => r.json()).then(data => {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "/api/auth/signin/google";
      const cbInput = document.createElement("input");
      cbInput.name = "callbackUrl";
      cbInput.value = window.location.origin + "/";
      form.appendChild(cbInput);
      const csrfInput = document.createElement("input");
      csrfInput.name = "csrfToken";
      csrfInput.value = data.csrfToken;
      form.appendChild(csrfInput);
      document.body.appendChild(form);
      form.submit();
    });
  };

  const demoAccounts = {
    student: { email: "sv@uef.edu.vn", password: "test123" },
    lecturer: { email: "tainv@uef.edu.vn", password: "test123" },
    admin: { email: "admin@uef.edu.vn", password: "test123" },
  };

  const autoFillLogin = (role) => {
    const account = demoAccounts[role];
    if (account) {
      setEmail(account.email);
      setPassword(account.password);
      setLoginError("");
    }
  };

  return (
    <div className="auth-page" style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div className="auth-image-panel" style={{ flex: 1, position: "relative" }}>
        <img src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/hoc-phi-uef-.jpg" alt="auth-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: BLACK, marginBottom: 8 }}>{t("login")}</h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>{t("welcomeBack")}</p>

        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[{ key: "student", label: t("student") }, { key: "lecturer", label: t("lecturer") }, { key: "admin", label: t("admin") }].map((r) => (
            <button disabled={logging} key={r.key} onClick={() => { setAuthRole(r.key); autoFillLogin(r.key); }} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: `1px solid ${authRole === r.key ? CERULEAN : GRAY_LIGHT}`, background: authRole === r.key ? `${CERULEAN}12` : "transparent", color: authRole === r.key ? CERULEAN : MUTED, fontSize: 12, fontWeight: 500, cursor: logging ? "not-allowed" : "pointer", opacity: logging ? 0.6 : 1 }}>{r.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("email")}</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLoginError(""); }}
              onKeyDown={handleKeyDown}
              disabled={logging}
              placeholder="sv@uef.edu.vn"
              style={{ width: "100%", padding: "12px 14px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: GRAY_BG, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1 }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>{t("password")}</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setLoginError(""); }}
                onKeyDown={handleKeyDown}
                disabled={logging}
                placeholder="••••••••"
                style={{ width: "100%", padding: "12px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: GRAY_BG, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1 }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
                style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: logging ? "not-allowed" : "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        {loginError && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginTop: 12 }}>
            <ShieldAlert size={16} color="#E53E3E" style={{ flexShrink: 0 }} />
            <p style={{ color: "#C53030", fontSize: 12, margin: 0, lineHeight: 1.4 }}>{loginError}</p>
          </div>
        )}

        <button
          onClick={handleEmailLogin}
          disabled={logging || !email || !password}
          style={{ width: "100%", padding: "14px", borderRadius: 8, border: "none", background: logging ? GRAY_LIGHT : CERULEAN, color: logging ? MUTED : "#fff", fontSize: 15, fontWeight: 600, marginTop: 16, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          {logging ? (
            <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> {t("loggingIn")}</>
          ) : t("login")}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
          <span style={{ fontSize: 12, color: MUTED }}>{t("or")}</span>
          <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={logging}
          style={{ width: "100%", padding: "14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 15, fontWeight: 600, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: logging ? 0.5 : 1 }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {t("loginWithGoogle")}
        </button>

          <p style={{ color: "#666", fontSize: 11, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
          {t("loginWithEmailToUse")}<br />
          {t("studentLabel")}: <strong>sv@uef.edu.vn</strong> / {t("passwordLabel")}: <strong>test123</strong>
        </p>
      </div>
    </div>
  )
}




function AdminOrdersPage({ setPage }) {
  const [orders, setOrders] = useState([]);
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
      }
      setLoading(false);
    }).catch(() => {
      setOrders([
        { id: '1', senderName: 'Nguyễn Văn A', senderEmail: 'nva@example.com', purpose: 'order', content: 'Yêu cầu in 50 cuốn Portfolio chất lượng cao, bìa cứng.', createdAt: new Date().toISOString(), isRead: false },
        { id: '2', senderName: 'Trần Thị B', senderEmail: 'ttb@example.com', purpose: 'order', content: 'Cần in tập san đồ họa K16 số lượng 200 bản.', createdAt: new Date(Date.now() - 86400000).toISOString(), isRead: true }
      ]);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_orders" setPage={setPage} />
        <div className="flex-1 flex items-center justify-center">
          <DotLottieReact src="https://lottie.host/80c6c06a-a1cc-4cb5-8bd3-61fc0f7e1b52/B1K4M1j97w.lottie" loop autoplay style={{ width: 150, height: 150 }} />
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
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-[#F8F8F8] transition-colors cursor-pointer">
                  <td className="px-5 py-4 font-semibold text-[#212121]">{order.senderName}</td>
                  <td className="px-5 py-4 text-[#666666]">{order.senderEmail}</td>
                  <td className="px-5 py-4 text-[#666666] max-w-xs truncate">{order.content}</td>
                  <td className="px-5 py-4 text-[#666666]">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${order.isRead ? 'bg-[#E0E0E0] text-[#666]' : 'bg-[#E8F4F8] text-[#077E9E]'}`}>
                      {order.isRead ? 'Đã xem' : 'Mới'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="p-8 text-center text-[#666666]">Không có đơn hàng nào.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function AdminDashboardPage({ setPage }) {
    const [adminStats, setAdminStats] = useState({ publishedArtworks: 0, reportedArtworks: 0, totalAccounts: 0, totalInteractions: 0 });
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

  const stats = [
    { label: t("publishedArtworks"), value: adminStats.publishedArtworks || 0, hint: t("totalPublishedArtworks"), accent: "#077E9E" },
    { label: t("reportedArtworks"), value: adminStats.reportedArtworks || 0, hint: t("needsProcessing"), accent: "#8B1A1A" },
    { label: t("totalAccounts"), value: adminStats.totalAccounts || 0, hint: "SV + GV + Admin", accent: "#212121" },
    { label: t("interactions"), value: (adminStats.totalInteractions || 0).toLocaleString(), hint: t("likesAndComments"), accent: "#055F78" },
  ];

  const categoryCounts = [];
  const recent = recentActivity.slice(0, 4).map(a => ({
    color: a.isPublic ? "#077E9E" : "#8B1A1A",
    text: `${a.user?.fullName || "User"} ${a.isPublic ? t("approvedArtwork") : t("justPosted")} "${(a.title || "").slice(0, 30)}"`,
  }));

  const statusBadge = (s) => {
    if (s === "Bị báo cáo") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Đã ẩn") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "Nổi bật") return "bg-blue-50 text-[#077E9E] border border-[#B3D9E8]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white relative">
      <AdminSidebar active="admin" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8 bg-[#F8F8F8]">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-[#212121]">{t("adminOverview")}</h2>
            <p className="text-sm text-[#666666] mt-1">{t("adminDescription")}</p>
          </div>
          <button onClick={() => setPage("admin_export")} className="px-4 py-2.5 bg-[#077E9E] text-white rounded-lg text-sm font-semibold hover:bg-[#055F78] transition-colors flex items-center gap-2">
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
              <button onClick={() => setPage("admin_artworks")} className="text-sm font-semibold text-[#077E9E] hover:text-[#055F78] transition-colors">
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
                    <tr key={a.id} className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors">
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
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(aStatus)}`}>{aStatus}</span>
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
                  <Users size={16} className="text-[#077E9E]" />
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



function MessagesPage({ setPage, userData }) {
    const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    api.messages.list().then(data => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleMessage = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      api.messages.markRead(id).catch(() => {});
      setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.messages.archive(id);
      setMessages(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert(t("archiveError") + (e?.message || t("pleaseTryAgain")));
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

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="messages" setPage={setPage} userData={userData} />
      <div style={{ flex: 1, padding: "32px 40px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px", color: BLACK }}>{t("inboxTitle")}</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40 }}>{t("loading")}</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>{t("noMessages")}</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {messages.map(msg => (
              <div key={msg.id} style={{ display: "flex", flexDirection: "column", background: msg.isRead ? "#fff" : "#F0F8FB", borderRadius: 12, border: `1px solid ${msg.isRead ? GRAY_LIGHT : "#B3D9E8"}`, overflow: "hidden" }}>
                <div onClick={() => toggleMessage(msg.id)} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: msg.isRead ? GRAY_BG : CERULEAN, display: "flex", alignItems: "center", justifyContent: "center", color: msg.isRead ? MUTED : "#fff", fontWeight: 700, fontSize: 16 }}>
                    {msg.senderName?.charAt(0) || "?"}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
                      <p style={{ fontSize: 15, fontWeight: msg.isRead ? 600 : 700, color: BLACK, margin: "0 0 4px" }}>{msg.senderName}</p>
                      {msg.senderCompany && <span style={{ fontSize: 13, color: MUTED }}>• {msg.senderCompany}</span>}
                    </div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      {msg.purpose === 'order' && (
                        <span style={{ background: "#ECFDF5", border: `1px solid #10B981`, fontSize: 11, padding: "2px 8px", borderRadius: 12, color: "#059669", whiteSpace: "nowrap" }}>{t("order")}</span>
                      )}
                      {msg.purpose && msg.purpose !== 'order' && <span style={{ background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, fontSize: 11, padding: "2px 8px", borderRadius: 12, color: MUTED, whiteSpace: "nowrap" }}>{msg.purpose}</span>}
                      {msg.purpose === 'order' && (
                        <p style={{ fontSize: 13, color: msg.isRead ? MUTED : BLACK, margin: 0, fontWeight: msg.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{t("orderArtwork")}</p>
                      )}
                      {msg.purpose !== 'order' && msg.content && (
                        <p style={{ fontSize: 13, color: msg.isRead ? MUTED : BLACK, margin: 0, fontWeight: msg.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{msg.content?.substring(0, 100) || ""}</p>
                      )}
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <span style={{ fontSize: 12, color: MUTED, whiteSpace: "nowrap" }}>{formatDate(msg.createdAt)}</span>
                    {msg.isRead ? <MailOpen size={14} color={MUTED} /> : <Mail size={14} color={CERULEAN} />}
                  </div>
                </div>
                {expandedId === msg.id && (
                  <div style={{ padding: "0 20px 20px 80px" }}>
                    <div style={{ padding: "16px", background: GRAY_BG, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}` }}>
                      {msg.purpose === 'order' ? (
                        <div style={{ display: "flex", gap: 16, alignItems: "start" }}>
                          {(() => {
                            try {
                              const data = JSON.parse(msg.content);
                              return (
                                <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                                  <div style={{ flex: "0 0 120px", borderRadius: 8, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                                    <img src={data.artworkImage} alt={data.artworkTitle} style={{ width: "100%", height: 120, objectFit: "cover" }} />
                                  </div>
                                  <div>
                                    <p style={{ fontSize: 14, fontWeight: 600, color: BLACK, margin: "0 0 8px" }}>{data.artworkTitle}</p>
                                    <p style={{ fontSize: 13, color: "#444", margin: "0 0 8px", lineHeight: 1.5 }}>{data.description || t("noDescription")}</p>
                                    <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                                      {data.phone && (
                                        <a href={`tel:${data.phone}`} style={{ fontSize: 13, color: CERULEAN, textDecoration: "underline" }}>📞 {data.phone}</a>
                                      )}
                                      {data.company && <p style={{ fontSize: 13, color: "#666" }}>🏢 {data.company}</p>}
                                    </div>
                                  </div>
                                </div>
                              );
                            } catch {
                              return <p style={{ fontSize: 14, color: BLACK, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>;
                            }
                          })()}
                        </div>
                      ) : (
                        <p style={{ fontSize: 14, color: BLACK, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      {msg.purpose === 'order' ? (
                        <button onClick={() => {
                          const data = JSON.parse(msg.content);
                          if (data.artworkId) {
                            setPage("detail", { artworkId: data.artworkId });
                          } else {
                            setPage("messages");
                          }
                        }} style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}>
                          <Mail size={14} /> {t("viewArtwork")}
                        </button>
                      ) : (
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.senderEmail)}&su=${encodeURIComponent(`Reply: ${msg.purpose || t("portfolioContact")}`)}&body=${encodeURIComponent(
                            `--- Original message from ${msg.senderName} (${msg.senderEmail}) ---\n${msg.purpose ? `Purpose: ${msg.purpose}\n` : ""}${msg.content}\n\n--- My reply ---\n`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                        >
                          <Mail size={14} /> {t("replyViaEmail")}
                        </a>
                      )}
                      <button onClick={() => handleArchive(msg.id)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: "pointer", color: BLACK, display: "flex", alignItems: "center", gap: 6 }}>
                        <Archive size={14} /> {t("archive")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function AdminSidebar({ active, setPage }) {
    const items = [
    { icon: <LayoutDashboard size={18} />, label: t("overview"), page: "admin" },
    { icon: <Users size={18} />, label: t("accounts"), page: "admin_users" },
    { icon: <ShoppingCart size={18} />, label: t("orders"), page: "admin_orders" },
    { icon: <ShieldAlert size={18} />, label: t("artworkWarnings"), page: "admin_artworks" },
    { icon: <Folder size={18} />, label: t("collectionManagement"), page: "admin_export" },
  ];

  return (
    <div className="w-64 bg-[#F8F8F8] border-r border-[#E0E0E0] flex-shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-[#E0E0E0]">
        <h3 className="font-bold text-[#212121] text-sm uppercase tracking-wider">{t("adminPanel")}</h3>
        <p className="text-xs text-[#666666] mt-1">{t("adminSystem")}</p>
      </div>
      <div className="py-4">
        {items.map(item => (
          <div key={item.label} onClick={() => setPage(item.page)} className={`flex items-center gap-3 px-6 py-3 cursor-pointer border-r-4 ${active === item.page ? 'bg-[#E8F4F8] border-[#077E9E] text-[#077E9E]' : 'border-transparent text-[#212121] hover:bg-white'}`}>
            <span className={active === item.page ? 'text-[#077E9E]' : 'text-[#666666]'}>{item.icon}</span>
            <span className={`text-sm ${active === item.page ? 'font-semibold' : 'font-medium'}`}>{item.label}</span>
          </div>
        ))}
      </div>
      <div className="mt-auto p-6">
        <button onClick={() => setPage("portal")} className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-medium hover:bg-white transition-colors text-[#212121]">
          <Globe size={16} /> {t("backToPortal")}
        </button>
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
        watermarkText: "UEF",
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
    if (!confirm(t("confirmDeleteArtwork"))) return;
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
                  <button onClick={() => document.getElementById("editAdditionalInput")?.click()} className="w-[90px] h-[72px] rounded-lg border-2 border-dashed border-[#E0E0E0] flex items-center justify-center text-[#666666] hover:border-[#077E9E] hover:text-[#077E9E] transition-colors cursor-pointer"><Plus size={22} /></button>
                )}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("courseName")}</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none focus:border-[#077E9E] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("projectType")}</label><div className="flex gap-1.5">{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${projectYear === y ? 'bg-[#F0F8FB] border-[#077E9E] text-[#077E9E]' : 'bg-[#F8F8F8] border-[#E0E0E0] text-[#666666]'}`}>{y}</button>))}</div></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("assignmentType")}</label><div className="flex gap-3">{[{ key: false, label: t("individual"), icon: <User size={16} /> }, { key: true, label: t("group"), icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg border cursor-pointer ${isGroupProject === opt.key ? 'bg-[#F0F8FB] border-[#077E9E]' : 'bg-[#F8F8F8] border-[#E0E0E0]'}`}><span className={isGroupProject === opt.key ? 'text-[#077E9E]' : 'text-[#666666]'}>{opt.icon}</span><span className={`text-sm font-semibold ${isGroupProject === opt.key ? 'text-[#077E9E]' : 'text-[#212121]'}`}>{opt.label}</span></div>))}</div></div>
            {isGroupProject && (<div className="relative"><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("addTeamMembers")}</label><div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">{friends.map((f, i) => (<span key={f.id || i} className="inline-flex items-center gap-1.5 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full"><User size={12} /> {f.fullName || f}  <X size={10} className="cursor-pointer" onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder={t("enterNameOrEmail")} className="border-none bg-transparent outline-none text-sm min-w-[120px] text-[#212121] flex-1" /></div>{friendResults.length > 0 && (<div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto">{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8F8F8] cursor-pointer border-b border-[#E0E0E0] last:border-b-0"><img src={u.avatarUrl || ''} alt="" className="w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" /><div><p className="text-sm font-medium text-[#212121]">{u.fullName}</p><p className="text-xs text-[#666666]">{u.email}</p></div></div>))}</div>)}</div>)}
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("description")}</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none min-h-[80px] resize-y focus:border-[#077E9E] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("category")}</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-sm text-[#212121] outline-none focus:border-[#077E9E] focus:bg-white transition-colors cursor-pointer">
                <option value="">{t("selectOption")}</option>
                {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("tools")}</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tools.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTools(tools.filter(x => x !== t))} /></span>))}
                <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("tags")}</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tags.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter(x => x !== t))} /></span>))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder={t("addTag")} className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-[#E0E0E0] flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-3 rounded-lg border border-[#8B1A1A] text-[#8B1A1A] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={16} /> {t("deleteArtwork")}</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 rounded-lg border-none bg-[#077E9E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50"><Check size={16} /> {saving ? t("saving") : t("saveChanges")}</button>
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
  const [importFileName, setImportFileName] = useState("");
  const importInputRef = useRef(null);

  const roleLabel = { student: "Sinh viên", lecturer: t("lecturer"), admin: t("admin") };

  const fetchUsers = () => {
    setLoading(true);
    api.admin.users().then(res => { setUsers(res.users || []); setLoading(false); }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchUsers(); }, []);

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

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportFileName(file.name);
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
            <button onClick={() => importInputRef.current?.click()} className="px-4 py-2 bg-[#077E9E] text-white rounded-lg text-sm font-semibold hover:bg-[#055F78] transition-colors flex items-center gap-2">
              <ArrowDownCircle size={16} className="-rotate-90" />
              Import Excel
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" size={16} />
              <input placeholder={t("searchUser")} className="pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#077E9E]" />
            </div>
          </div>
        </div>
        {importFileName && (
          <div className="mb-5 bg-[#E8F4F8] border border-[#B3D9E8] text-[#077E9E] rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <span className="font-medium">{t("selectedFile")}: {importFileName}</span>
            <button onClick={() => setImportFileName("")} className="text-[#077E9E] hover:text-[#055F78] font-semibold text-sm">{t("deselect")}</button>
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
              {users.map(u => {
                const roleVal = roleLabel[u.role] || u.role;
                const locked = !u.isActive;
                return (
                <tr key={u.id} className="border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={u.avatarUrl || ''} className="w-8 h-8 rounded-full object-cover bg-[#E0E0E0]" />
                      <span className="text-sm font-semibold text-[#212121]">{u.fullName}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">{u.email}</td>
                  <td className="px-4 py-3">
                    <div className="relative inline-flex w-40">
                      <select
                        value={u.role}
                        onChange={(e) => setRole(u.id, e.target.value)}
                        className="w-full appearance-none px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
                      >
                        {Object.entries(roleLabel).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                      </select>
                      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-[#666666]">{u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "—"}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex items-center justify-center">
                      <button onClick={() => locked ? toggleLockUser(u) : setConfirmModal({ isOpen: true, user: u })} className={`px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer ${locked ? 'border-[#077E9E] text-[#077E9E] hover:bg-[#077E9E] hover:text-white' : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white'}`} title={locked ? t("unlock") : t("lockAccount")}>
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
              <button onClick={() => toggleLockUser(confirmModal.user?.id)} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">{t("confirmLock")}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function AdminArtworksPage({ setPage }) {
    const [items, setItems] = useState([]);
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

  const handleOpenGallery = (idx) => {
    const imgs = [selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean);
    setGalleryImages(imgs);
    setGalleryIdx(idx);
  };
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(false);

  const fetchArtworks = (params = {}) => {
    setLoading(true);
    api.admin.artworks({ limit: 200, ...params }).then(res => {
      const raw = res.artworks || [];
      setItems(raw);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { fetchArtworks({}); }, []);

  useEffect(() => {
    const params = {};
    if (query.trim()) params.q = query.trim();
    fetchArtworks(params);
  }, [query]);

  useEffect(() => {
    if (!selectedId) { setReports([]); return; }
    setReportsLoading(true);
    api.artworks.reports(selectedId).then(setReports).catch(() => setReports([])).finally(() => setReportsLoading(false));
  }, [selectedId]);

  const tabMap = { all: "all", reported: "reported", pending: "pending", hidden: "hidden", highlight: "highlight" };
  const filtered = items.filter(a => {
    if (activeTab === "hidden") return !a.isPublic && !a.isPending;
    if (activeTab === "pending") return a.isPending;
    if (activeTab === "highlight") return a.isHighlighted;
    if (activeTab === "reported") return (a._count?.reports || 0) > 0;
    return true;
  }).filter(a => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (a.title || '').toLowerCase().includes(q) || (a.user?.fullName || '').toLowerCase().includes(q);
}).filter(a => filterSubject === t("all") ? true : a.subject === filterSubject)
      .filter(a => filterYear === t("all") ? true : a.academicYear === filterYear);

  const selected = items.find((a) => a.id === selectedId) ?? null;

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
    if (s === "Nổi bật") return "bg-blue-50 text-[#077E9E] border border-[#B3D9E8]";
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
    return items.filter(a => {
      if (key === "hidden") return !a.isPublic && !a.isPending;
      if (key === "pending") return a.isPending;
      if (key === "highlight") return a.isHighlighted;
      if (key === "reported") return (a._count?.reports || 0) > 0;
      return true;
    }).length;
  };

  const FilterSelect = ({ value, onChange, children }) => (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="appearance-none px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
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
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("searchArtworkStudentTags")} className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
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
                  selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-[#E8F4F8] text-[#077E9E] border-[#B3D9E8] hover:bg-[#D9EEF6]"
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
                          <div className="w-8 h-8 border-4 border-[#077E9E]/20 border-t-[#077E9E] rounded-full animate-spin mb-4"></div>
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
                        selectedId === a.id ? "bg-[#E8F4F8]" : (a._count?.reports || 0) > 0 ? "bg-red-50" : a.isPending ? "bg-amber-50" : "bg-white"
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
              <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#E0E0E0] flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("artworkDetails")}</p>
                    <h3 className="text-lg font-bold text-[#212121] truncate">{selected.title}</h3>
                    <p className="text-sm text-[#666666] mt-1">{selected.student}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-sm font-semibold text-[#666666] hover:text-[#212121] transition-colors">{t("close")}</button>
                </div>

                <div className="p-5">
                  <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer" onClick={() => handleOpenGallery(0)}>
                    <img src={selected.coverImageUrl} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold transition-opacity">{t("clickToZoom")}</span>
                    </div>
                  </div>
                  {(selected.fileUrls || []).length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean).map((url, idx) => (
                        <div key={idx} className="w-14 h-12 rounded-lg overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer hover:border-[#077E9E] transition-colors" onClick={() => handleOpenGallery(idx)}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("subject")}</p>
                      <p className="text-sm font-semibold text-[#212121]">{selected.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("tools")}</p>
                      <p className="text-sm font-semibold text-[#212121]">{(selected.toolsUsed || []).join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("status")}</p>
                      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium ${selected.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                        {selected.isPublic ? <Check size={12} className="text-green-600" /> : <EyeOff size={12} />}
                        {selected.isPublic ? t("public") : t("private")}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">{t("score")}</p>
                      <p className="text-sm font-semibold text-[#212121]">{selected.score ?? t("notGraded") }</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a href={`${window.location.origin}/#/detail/${selected.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#077E9E] hover:text-[#055F78] font-semibold flex items-center gap-1.5 transition-colors">
                      <ExternalLink size={14} /> {t("viewDetails")}: {selected.title}
                    </a>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldAlert size={14} /> {t("reportViolation")} {reports.length > 0 && <span className="bg-[#8B1A1A] text-white text-[10px] px-2 py-0.5 rounded-full">{reports.length}</span>}
                    </p>
                    {reportsLoading ? (
                      <p className="text-sm text-[#666666]">{t("loading")}</p>
                    ) : reports.length === 0 ? (
                      <p className="text-sm text-[#666666] bg-[#F8F8F8] rounded-lg p-3 border border-[#E0E0E0]">{t("noReportsForArtwork")}</p>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto">
                        {reports.map(r => (
                          <div key={r.id} className="bg-[#F8F8F8] rounded-lg p-3 border border-[#E0E0E0]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-[#8B1A1A] bg-red-50 px-2 py-0.5 rounded border border-[#F5C5C5]">{r.violationType}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : r.status === "resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                                {r.status === "pending" ? t("pending") : r.status === "resolved" ? t("processed") : t("dismissed")}
                              </span>
                            </div>
                            {r.detail && <p className="text-sm text-[#212121] mb-2">{r.detail}</p>}
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-[#666666]">
                                {t("by")} {r.user?.fullName || r.user?.email || t("user") } · {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                              {r.status === "pending" && (
                                <div className="flex gap-1">
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "resolved").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "resolved" } : x)))} className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">{t("resolve")}</button>
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "dismissed").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "dismissed" } : x)))} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">{t("dismiss")}</button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {!selected.isPublic ? (
                      <button onClick={() => approveArtwork(selected.id)} className="py-2.5 rounded-lg border border-[#077E9E] bg-white text-[#077E9E] text-sm font-semibold hover:bg-[#F0F8FB] transition-colors">
                        <Check size={14} className="inline mr-1" /> {t("approveArtwork")}
                      </button>
                    ) : (
                      <button onClick={() => hideArtwork(selected.id)} className="py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors">
                        {t("hideArtwork")}
                      </button>
                    )}
                    <button onClick={() => openConfirm("delete", selected.id)} className="py-2.5 rounded-lg border border-[#F5C5C5] bg-red-50 text-sm font-bold text-[#8B1A1A] hover:bg-red-100 transition-colors">
                      {t("deletePermanently")}
                    </button>
                  </div>

                  <button onClick={() => toggleHighlight(selected.id, !selected.isHighlighted)} className={`mt-3 w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    selected.isHighlighted ? "bg-[#212121] text-white border-[#212121]" : "bg-[#E8F4F8] text-[#077E9E] border-[#B3D9E8] hover:bg-[#D9EEF6]"
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
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#077E9E] text-white rounded-xl font-bold hover:bg-[#055F78] transition-colors shadow-sm cursor-pointer w-full lg:w-auto"
          >
            <Plus size={18} />
            {t("createNewCollection")}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {collections.map((c) => {
            const thumbs = c.items.slice(0, 3).map((it) => it.artwork?.coverImageUrl).filter(Boolean);
            return (
              <div
                key={c.id}
                onClick={() => onOpenExportConfig && onOpenExportConfig(c.id)}
                className="bg-white border border-[#E0E0E0] rounded-2xl p-5 hover:shadow-lg hover:border-[#077E9E] transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1">{t("collection")}</p>
                    <h3 className="text-lg font-bold text-[#212121] truncate">{c.name}</h3>
                    <p className="text-sm text-[#666666] mt-1">{c.items.length} {t("artworks")} · {t("theme")}: <span className="font-semibold text-[#212121]">{c.theme}</span></p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-[#E8F4F8] border border-[#B3D9E8] flex items-center justify-center text-[#077E9E] flex-shrink-0">
                    <FileDown size={18} />
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {thumbs.length > 0 ? (
                    thumbs.map((src, idx) => (
                      <div key={idx} className="aspect-[4/3] rounded-xl overflow-hidden bg-[#F8F8F8] border border-[#E0E0E0]">
                        <img src={src} className="w-full h-full object-cover" />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-3 border border-dashed border-[#E0E0E0] rounded-xl p-4 text-sm text-[#666666]">
                      {t("noArtworksInCollectionGuide")}
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-[11px] text-[#666666]">
                    {t("curatorNotePriority")}
                  </span>
                  <span className="text-sm font-bold text-[#077E9E]">{t("openConfig")} →</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenCatalogBuilder && onOpenCatalogBuilder(c); }}
                  className="mt-3 w-full py-2 rounded-lg bg-[#212121] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileDown size={14} /> {t("createPdfJournal")}
                </button>
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
      className={`group relative bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${isSelected ? "border-[#077E9E] shadow-md ring-2 ring-[#077E9E]/20" : "border-[#E0E0E0] hover:shadow-md hover:border-[#077E9E]"}`}
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
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Quản lý Bộ sưu tập</p>
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
            <button onClick={() => { onOpenCatalogBuilder && onOpenCatalogBuilder(collection); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer bg-[#077E9E] text-white hover:bg-[#055F78]`}>
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
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]"
                    placeholder="VD: Brand Identity, Typography..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider">Giải thưởng (Award)</label>
                  <select
                    value={detailArtwork.award || "Không có"}
                    onChange={(e) => updateDetailArtwork({ award: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]"
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
                    className="w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] resize-none"
                    placeholder="Nhận xét ngắn gọn về tác phẩm..."
                  />
                </div>
                
                <div className="mt-2 text-[11px] text-[#888]">
                  Mọi thay đổi trên panel này sẽ được lưu tự động vào bộ sưu tập.
                </div>
              </div>
            </div>
          )}
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
  const [success, setSuccess] = useState(false);

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
      setSuccess(true);
      setTimeout(() => setPage("auth"), 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80" alt="register-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(7,126,158,0.6) 0%, rgba(0,0,0,0.55) 100%)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
        <div style={{ position: "absolute", bottom: 48, left: 48, right: 48 }}>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 300, lineHeight: 1.55, letterSpacing: "-0.3px", margin: "0 0 14px" }}>{t("creativityQuote")}<br /><span style={{ fontSize: 16, opacity: 0.8 }}>{t("joinUefCreative")}</span></p>
        </div>
      </div>
      <div className="auth-form-panel" style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}><img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} /><span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span></div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px", letterSpacing: "-0.6px" }}>{t("createNewAccount")}</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>{t("registerDescription")}</p>

          {success ? (
            <div style={{ padding: 20, background: "#F0FFF0", borderRadius: 8, textAlign: "center" }}>
              <p style={{ color: "#2F855A", fontWeight: 600, fontSize: 14 }}>{t("registerSuccess")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("lastName")}</label>
                    <input type="text" value={form.lastName} onChange={updateField("lastName")} placeholder={t("lastNamePlaceholder")} required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("firstName")}</label>
                    <input type="text" value={form.firstName} onChange={updateField("firstName")} placeholder={t("firstNamePlaceholder")} required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("email")}</label>
                  <input type="email" value={form.email} onChange={updateField("email")} placeholder="example@gmail.com" required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("password")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.password ? "text" : "password"} value={form.password} onChange={updateField("password")} placeholder={t("passwordPlaceholder")} required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>{t("confirmPassword")}</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.confirm ? "text" : "password"} value={form.confirmPassword} onChange={updateField("confirmPassword")} placeholder="••••••••" required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>

              {error && <p style={{ color: "#E53E3E", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? t("processing") : t("register")}
              </button>
            </form>
          )}

          <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>{t("alreadyHaveAccount")} <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>{t("login")}</span></p>
        </div>
      </div>
    </div>
  );
}

function LandingPage({ setPage, isLoggedIn }) {
    const artworks = [
    { id: 1, img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", title: "Kỷ niệm UEF", student: "Nguyễn Lê Minh Anh", likes: 142 },
    { id: 2, img: "https://i.pinimg.com/1200x/64/52/dc/6452dc484427b34cc0be14c3d80c948a.jpg", title: "Poster Design", student: "Trần Bảo Long", likes: 89 },
    { id: 3, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", title: "Typography", student: "Lê Thị Hương", likes: 203 },
    { id: 4, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", title: "Packaging", student: "Phạm Quốc Việt", likes: 56 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121]">

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[#077E9E]"></span> {t("facultyName")}
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            {t("heroTitle1")}<br />
            <span className="text-[#077E9E]">{t("heroTitle2")}</span> {t("heroTitle3")}<br />
            {t("heroTitle4")}
          </h2>
          <div className="space-y-1 mb-10 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => setPage("gallery")} className="bg-[#077E9E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#066a85] transition-colors">
              {t("exploreGallery")} <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage("auth")} className="bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {t("studentLogin")}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-16">{t("loginNote")}</p>
          
          <div className="flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
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
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-3">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={artworks[0].img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src={artworks[2].img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-1 space-y-3 pt-8">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src={artworks[1].img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={artworks[3].img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-1 space-y-3">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
                <img src="https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&q=80" alt="Artwork" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80" alt="Artwork" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -right-6 flex gap-2">
            <span className="bg-[#077E9E] text-white text-[10px] px-3 py-1.5 rounded-full font-medium">3d art</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">branding</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">poster</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">packaging</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
            <span className="w-6 h-px bg-[#077E9E]"></span> {t("coreFeatures")}
          </p>
          <h2 className="text-3xl font-extrabold mb-12">{t("everythingInOnePlatform")}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-[#077E9E] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E8F4F8] text-[#077E9E] rounded-lg flex items-center justify-center mb-6">
                <Image size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("exhibitGallery")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{t("exhibitGalleryDesc")}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <Image size={14} /> gallery
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <User size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("personalPortfolio")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">{t("personalPortfolioDesc")}</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <User size={14} /> {t("personalPortfolioLabel")}
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Star size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("scoresAndFeedback")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t("scoresAndFeedbackDesc")}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Monitor size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("multiDevice")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t("multiDeviceDesc")}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("highlightAndInteract")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t("highlightAndInteractDesc")}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("recruitmentConnection")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t("recruitmentConnectionDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Artworks */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-[#077E9E]"></span> {t("featuredProducts")}
              </p>
              <h2 className="text-3xl font-extrabold">{t("exploreNewestArtworks")}</h2>
            </div>
            <button onClick={() => setPage("gallery")} className="text-sm font-semibold border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              {t("viewFullGallery")} &rsaquo;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map((work, idx) => (
              <div key={work.id} className="group cursor-pointer">
                <div className={`rounded-xl overflow-hidden mb-4 relative ${idx % 2 === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-[#077E9E] text-white text-[10px] font-bold px-2 py-1 rounded">{t("featured")}</div>
                  )}
                </div>
                <h4 className="font-bold text-[15px] mb-1">{work.title}</h4>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{work.student}</span>
                  <span className="flex items-center gap-1"><Heart size={12} /> {work.likes}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="px-8 py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2 justify-center">
            <span className="w-6 h-px bg-[#077E9E]"></span> {t("guide")}
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-16">{t("startInThreeSteps")}</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">1</div>
              <h3 className="font-bold mb-2">{t("login")}</h3>
              <p className="text-sm text-gray-500">{t("step1Desc")}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">2</div>
              <h3 className="font-bold mb-2">{t("uploadArtworkStep")}</h3>
              <p className="text-sm text-gray-500">{t("step2Desc")}</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">3</div>
              <h3 className="font-bold mb-2">{t("sharePortfolio")}</h3>
              <p className="text-sm text-gray-500">{t("step3Desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#1A1A1A] text-white px-8 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-3">{t("readyToShowcase")}</h2>
            <p className="text-gray-400">{t("forStudents")}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPage("auth")} className="bg-[#077E9E] hover:bg-[#066a85] text-white px-8 py-3 rounded-lg font-bold transition-colors">{t("loginNow")}</button>
            <button onClick={() => setPage("gallery")} className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-colors">{t("viewGallery")}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-10 px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 text-white font-serif font-bold w-8 h-8 flex items-center justify-center rounded">UEF</div>
            <div>
              <p className="font-bold text-white">{t("footerTitle")}</p>
              <p className="text-xs mt-1">{t("footerCopyright")}</p>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setPage("gallery")} className="hover:text-white">Gallery</button>
            <button onClick={() => setPage("about")} className="hover:text-white">{t("aboutFaculty")}</button>
            <a href="#" className="hover:text-white">{t("contact")}</a>
            <a href="#" className="hover:text-white">{t("policy")}</a>
          </div>
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
  { icon: Star, title: "Cơ hội nghề nghiệp", desc: "Tiếp cận nhà tuyển dụng tiềm năng thông qua bộ sưu tập ấn phẩm tốt nghiệp." },
];

const employerFeatures = [
  { icon: Search, title: "Tìm kiếm tài năng", desc: "Duyệt portfolio sinh viên theo kỹ năng, công cụ, môn học và năm tốt nghiệp." },
  { icon: Eye, title: "Đánh giá năng lực", desc: "Xem điểm đánh giá từ giảng viên, nhận xét chuyên môn trên từng tác phẩm." },
  { icon: Send, title: "Liên hệ trực tiếp", desc: "Gửi tin nhắn tuyển dụng qua hệ thống — kết nối nhanh chóng với ứng viên tiềm năng." },
  { icon: Heart, title: "Lưu & Theo dõi", desc: "Đánh dấu ứng viên triển vọng, theo dõi cập nhật tác phẩm mới nhất." },
  { icon: FileDown, title: "Xuất báo cáo", desc: "Tổng hợp bộ sưu tập ứng viên nổi bật, xuất PDF phục vụ tuyển dụng." },
  { icon: Globe, title: "Tiếp cận rộng", desc: "Hơn 500 ấn phẩm đồ án từ sinh viên ngành Thiết kế Đồ họa UEF." },
];

const schoolFeatures = [
  { icon: LayoutDashboard, title: "Quản lý đào tạo", desc: "Theo dõi toàn bộ đồ án sinh viên theo môn học, semester và năm học." },
  { icon: Check, title: "Đánh giá chất lượng", desc: "Giảng viên chấm điểm, nhận xét trực tiếp; thống kê điểm số theo lớp và môn." },
  { icon: Folder, title: "Bộ sưu tập triển lãm", desc: "Tạo tuyển tập ấn phẩm xuất sắc, sắp xếp kéo thả và xuất tập san PDF." },
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

function AboutPage({ setPage }) {
  const [activeTab, setActiveTab] = useState("student");
  const [openFaq, setOpenFaq] = useState(null);

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
      <section className="relative min-h-[90vh] pt-24 pb-16 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden bg-[#f9fafc]">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_80%_at_100%_50%,rgba(214,232,255,0.6)_0%,transparent_70%),radial-gradient(ellipse_35%_40%_at_5%_90%,rgba(155,28,28,0.06)_0%,transparent_60%)]"></div>
        
        <div className="relative z-10 lg:pr-12">
          <div className="inline-flex items-center gap-2 bg-[#d6e8ff] text-[#0d2e6e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8 animate-[fadeUp_0.5s_ease-out]">
            <span className="w-1.5 h-1.5 bg-[#1e6fd9] rounded-full animate-ping"></span>
            Khoa Thiết kế Đồ họa — UEF
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[#0a0c0f] mb-4 tracking-tight animate-[fadeUp_0.7s_ease-out]">
            Khám phá<br/>
            <span className="text-[#1a4ba8]">Dự án xuất sắc</span><br/>
            từ sinh viên UEF
          </h1>
          <p className="text-[#666] text-base leading-relaxed max-w-[460px] mb-10 animate-[fadeUp_0.9s_ease-out]">
            Nền tảng E-Portfolio tích hợp đánh giá học thuật — nơi sinh viên trưng bày tác phẩm, giảng viên chấm điểm chuyên nghiệp, và nhà tuyển dụng tìm kiếm nhân tài <strong className="text-[#1a4ba8]">đã được kiểm định.</strong>
          </p>
          <div className="flex flex-wrap gap-3 mb-4 animate-[fadeUp_1.1s_ease-out]">
            <a href="#audience" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0d2e6e] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a4ba8] hover:-translate-y-1 transition-all shadow-lg shadow-[#0d2e6e]/20 hover:shadow-[#1a4ba8]/40 duration-300">
              Khám phá ngay <ArrowRight size={16} />
            </a>
            <button onClick={() => setPage("auth")} className="inline-flex items-center px-7 py-3.5 bg-transparent border-2 border-[#e2e6ec] text-[#0a0c0f] rounded-xl font-bold text-[15px] hover:border-[#1a4ba8] hover:text-[#1a4ba8] transition-colors">
              Đăng nhập
            </button>
          </div>
          <div className="flex gap-8 pt-7 mt-10 border-t border-[#e2e6ec] animate-[fadeUp_1.3s_ease-out]">
            <div>
              <div className="text-[28px] font-black text-[#0d2e6e] leading-none">500+</div>
              <div className="text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider">Tác phẩm trưng bày</div>
            </div>
            <div>
              <div className="text-[28px] font-black text-[#0d2e6e] leading-none">120+</div>
              <div className="text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider">Giảng viên tham gia</div>
            </div>
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
      <div className="bg-[#0d2e6e] py-4 overflow-hidden border-y border-white/10 shadow-inner">
        <div className="flex gap-0 whitespace-nowrap animate-[ticker_32s_linear_infinite] w-max">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>UEF Design Gallery — Nền tảng E-Portfolio</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>Được kiểm định bởi giảng viên Khoa Thiết kế Đồ họa</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>Kết nối trực tiếp Doanh nghiệp và Sinh viên</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20"><span className="w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]"></span>gallery.uef.edu.vn</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* GALLERY STRIP */}
      <div className="bg-white py-16 overflow-hidden relative">
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
        
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] animate-[fadeUp_0.5s_ease-out]">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> Tác phẩm nổi bật
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
      <section id="audience" className="bg-gradient-to-b from-[#f5f6f8] to-white py-24 px-6 lg:px-12 border-t border-[#e2e6ec]">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-5">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> Hệ sinh thái cốt lõi
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-[#0a0c0f] leading-[1.1] mb-6 tracking-tight">Trải nghiệm đồng bộ<br/>cho mọi đối tượng</h2>
          <p className="text-[#666] text-base leading-relaxed max-w-[600px] mb-12">
            Được xây dựng cho ba nhóm người dùng cốt lõi với trải nghiệm riêng biệt, tích hợp mượt mà trong cùng một hệ sinh thái thiết kế tại UEF.
          </p>

          <div className="flex gap-2 border-b-2 border-[#e2e6ec] mb-12 overflow-x-auto pb-1">
            <button onClick={() => setActiveTab("student")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'student' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <GraduationCap size={18} /> Sinh viên
            </button>
            <button onClick={() => setActiveTab("lecturer")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'lecturer' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <ClipboardList size={18} /> Giảng viên
            </button>
            <button onClick={() => setActiveTab("recruiter")} className={`flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === 'recruiter' ? 'bg-[#0d2e6e] text-white shadow-md transform -translate-y-1' : 'text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100'}`}>
              <Building2 size={18} /> Nhà tuyển dụng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {activeTab === "student" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">Xây dựng hồ sơ chuyên nghiệp từ năm nhất</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Mỗi bài tập học thuật là một viên gạch tạo nên danh tiếng nghề nghiệp. UEF Design Gallery biến tác phẩm từ "bài nộp một lần" thành tài sản số lâu dài mang thương hiệu UEF.
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><LayoutGrid size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Portfolio Masonry chuẩn thẩm mỹ</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Trưng bày tác phẩm đa phương tiện, hỗ trợ Pantone/CMYK và quy trình sáng tác.</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Link size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Cá nhân hóa liên kết định danh</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Sở hữu đường dẫn gallery.uef.edu.vn/portfolio/ten-cua-ban chuyên nghiệp.</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Zap size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Tự động kết xuất Tập San PDF</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Tạo cuốn Portfolio PDF chuẩn in ấn chỉ với 1 cú click chuột để gửi nhà tuyển dụng.</span>
                      </div>
                    </li>
                  </ul>
                  <button onClick={() => setPage("auth")} className="px-7 py-3.5 bg-[#0a0c0f] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a4ba8] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5">Tạo Portfolio Ngay</button>
                </div>
                <div className="animate-[fadeUp_0.7s_ease-out]">
                  <div className="bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3">
                    <div className="rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group">
                      <img src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80" alt="Student Dashboard" className="w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute bottom-5 left-5 text-white">
                        <div className="font-bold text-lg">Giao diện sinh viên</div>
                        <div className="text-sm opacity-80">Quản lý Portfolio & Đồ án</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "lecturer" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">Số hóa toàn diện quy trình đánh giá</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Chấm điểm, nhận xét và cấp chứng nhận điện tử trực tiếp trên nền tảng. Loại bỏ hoàn toàn giấy tờ, đảm bảo minh bạch và lưu trữ vĩnh viễn.
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#fef2f2] text-[#c0392b] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><FileBadge size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Đánh giá & Cấp Verification Badge</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Xác thực tác phẩm chất lượng bằng huy hiệu "Đã kiểm định", gia tăng uy tín cho sinh viên.</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><ShieldCheck size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Bảo vệ bản quyền trí tuệ</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Hệ thống Watermark thông minh và kiểm soát truy cập riêng tư.</span>
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
                        <div className="font-bold text-lg">Giao diện Giảng viên</div>
                        <div className="text-sm opacity-80">Công cụ chấm điểm & Đánh giá</div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "recruiter" && (
              <>
                <div className="animate-[fadeUp_0.5s_ease-out]">
                  <h3 className="text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight">Nguồn ứng viên thiết kế chất lượng cao</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Tiếp cận trực tiếp với mạng lưới sinh viên đồ họa UEF. Tìm kiếm theo năng lực thực tế qua tác phẩm, không chỉ qua CV văn bản đơn thuần.
                  </p>
                  <ul className="space-y-6 mb-8">
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#fdfaf1] text-[#c9a227] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><Filter size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Lọc ứng viên theo Skill-tag</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Tìm kiếm chính xác 3D Modeling, UI/UX, hoặc Branding trong vài giây.</span>
                      </div>
                    </li>
                    <li className="flex gap-4 group">
                      <div className="w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm"><UserPlus size={22} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-[15px] block mb-1">Kết nối & Tuyển dụng trực tiếp</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Gửi lời mời phỏng vấn hoặc đề xuất dự án ngay trên nền tảng.</span>
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
                        <div className="font-bold text-lg">Giao diện Doanh nghiệp</div>
                        <div className="text-sm opacity-80">Khám phá nhân tài đồ họa</div>
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
      <section className="bg-[#0a0c0f] py-28 px-6 lg:px-12 text-white relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a4ba8] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#c0392b] rounded-full blur-[150px] opacity-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="max-w-[700px] mb-20 text-center mx-auto animate-[fadeUp_0.5s_ease-out]">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-white/60 mb-5">
              <span className="w-7 h-[2px] bg-white/40"></span> Giá trị cốt lõi
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight">Thiết kế vì sự phát triển<br/>toàn diện của sinh viên</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[4px] border-t-[#60afff] group hover:shadow-[0_0_30px_rgba(96,175,255,0.15)] hover:-translate-y-2 duration-300 animate-[fadeUp_0.7s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-[#60afff]/10 text-[#60afff] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <LayoutGrid size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-white">Portfolio Driven</h3>
              <p className="text-[15px] text-white/60 leading-relaxed">Thiết kế xoay quanh tác phẩm. Giao diện tối giản, tôn vinh hình ảnh để nhường chỗ cho sự sáng tạo của người dùng lên ngôi.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[4px] border-t-[#ff7b6e] group hover:shadow-[0_0_30px_rgba(255,123,110,0.15)] hover:-translate-y-2 duration-300 animate-[fadeUp_0.9s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-[#ff7b6e]/10 text-[#ff7b6e] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-white">Academic Integrity</h3>
              <p className="text-[15px] text-white/60 leading-relaxed">Đề cao tính học thuật, bảo vệ bản quyền tác giả và xây dựng quy trình đánh giá minh bạch từ đội ngũ giảng viên chuyên môn.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-10 rounded-3xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[4px] border-t-[#f5d87e] group hover:shadow-[0_0_30px_rgba(245,216,126,0.15)] hover:-translate-y-2 duration-300 animate-[fadeUp_1.1s_ease-out]">
              <div className="w-14 h-14 rounded-2xl bg-[#f5d87e]/10 text-[#f5d87e] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h3 className="font-extrabold text-2xl mb-4 text-white">Industry Ready</h3>
              <p className="text-[15px] text-white/60 leading-relaxed">Cầu nối trực tiếp mang sinh viên đến với các cơ hội nghề nghiệp thực tế ngay từ khi còn ngồi trên ghế nhà trường.</p>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-evenly gap-10 text-center animate-[fadeUp_1.3s_ease-out]">
             <div>
                <div className="font-black text-5xl md:text-6xl text-white mb-2 tracking-tight">350+</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#60afff]">Dự án Kiểm định</div>
             </div>
             <div className="w-full md:w-px h-px md:h-20 bg-white/10"></div>
             <div>
                <div className="font-black text-5xl md:text-6xl text-white mb-2 tracking-tight">98%</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7b6e]">Hài lòng về UI/UX</div>
             </div>
             <div className="w-full md:w-px h-px md:h-20 bg-white/10"></div>
             <div>
                <div className="font-black text-5xl md:text-6xl text-white mb-2 tracking-tight">45+</div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#f5d87e]">Doanh nghiệp Đối tác</div>
             </div>
          </div>
        </div>
      </section>

      {/* PROCESS FLOW */}
      <section className="py-24 px-6 lg:px-12 bg-[#f9fafc] border-b border-[#e2e6ec] overflow-hidden relative">
        <div className="max-w-7xl mx-auto">
           <div className="text-center mb-16 animate-[fadeUp_0.5s_ease-out]">
             <h2 className="text-4xl font-black text-[#0a0c0f] mb-4">Quy trình vận hành khép kín</h2>
             <p className="text-[#666] max-w-2xl mx-auto text-base">Hệ sinh thái liên kết chặt chẽ giữa 3 đối tượng, tạo nên vòng lặp giá trị bền vững cho ngành Thiết kế.</p>
           </div>
           
           <div className="relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10">
             {/* Decorative connecting line for desktop */}
             <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-[#d6e8ff] via-[#1a4ba8] to-[#d6e8ff] -translate-y-1/2 z-0 opacity-40"></div>
             
             <div className="relative z-10 bg-white p-8 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.7s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#1a4ba8] to-[#0d2e6e] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#1a4ba8]/20 ring-4 ring-white">1</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">Sinh viên Upload</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">Đăng tải tác phẩm với đầy đủ hình ảnh, mô tả, thông số thiết kế.</p>
             </div>
             
             <ArrowRight className="text-[#1a4ba8] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_0.8s_ease-out]" size={32} />
             
             <div className="relative z-10 bg-white p-8 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.9s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#c0392b] to-[#8a1919] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c0392b]/20 ring-4 ring-white">2</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">Giảng viên Chấm điểm</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">Duyệt, đánh giá và cấp huy hiệu xác thực chất lượng học thuật.</p>
             </div>
             
             <ArrowRight className="text-[#c0392b] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_1.0s_ease-out]" size={32} />
             
             <div className="relative z-10 bg-white p-8 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_1.1s_ease-out]">
               <div className="w-16 h-16 bg-gradient-to-br from-[#c9a227] to-[#967615] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c9a227]/20 ring-4 ring-white">3</div>
               <h4 className="font-extrabold text-[#0a0c0f] text-lg mb-3">Xuất bản & Kết nối</h4>
               <p className="text-[14px] text-[#666] leading-relaxed">Hiển thị công khai, nhà tuyển dụng trực tiếp tiếp cận và tuyển dụng.</p>
             </div>
           </div>
        </div>
      </section>

      {/* COMPARE SECTION */}
      <section id="compare" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-[fadeUp_0.5s_ease-out]">
            <h2 className="text-4xl font-black text-[#0a0c0f] mb-4">Tại sao chọn UEF Design Gallery?</h2>
            <p className="text-[#666] text-base">So sánh giá trị mang lại so với các nền tảng lưu trữ truyền thống.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-[#e2e6ec] shadow-xl shadow-black/5 animate-[fadeUp_0.7s_ease-out]">
            <table className="w-full text-left border-collapse min-w-[700px]">
              <thead>
                <tr>
                  <th className="bg-[#f9fafc] p-6 font-extrabold text-[#0a0c0f] border-b border-[#e2e6ec] text-[15px] uppercase tracking-wider w-[40%]">Tính năng nổi bật</th>
                  <th className="bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Behance / Dribbble</th>
                  <th className="bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Google Drive</th>
                  <th className="bg-gradient-to-r from-[#0d2e6e] to-[#1a4ba8] p-6 font-extrabold text-white border-b border-[#0d2e6e] text-[15px] text-center shadow-inner">UEF Gallery</th>
                </tr>
              </thead>
              <tbody className="text-[15px]">
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">Môi trường học thuật chuyên biệt</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">Xác thực từ Giảng viên (Verified Badge)</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]">Tự động kết xuất PDF Layout chuẩn in</td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70"><X size={20} className="mx-auto" /></td>
                  <td className="p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black"><Check size={24} className="mx-auto" /></td>
                </tr>
                <tr className="hover:bg-[#f4f7fb] transition-colors">
                  <td className="p-5 font-bold text-[#0a0c0f]">Tìm kiếm & Bộ lọc nâng cao cho Doanh nghiệp</td>
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
      <section id="faq" className="py-24 px-6 lg:px-12 bg-[#f9fafc] border-t border-[#e2e6ec]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
           <div className="animate-[fadeUp_0.5s_ease-out]">
             <h3 className="font-black text-4xl mb-5 tracking-tight text-[#0a0c0f]">Câu hỏi thường gặp</h3>
             <p className="text-[#666] text-base leading-relaxed mb-10">Tất cả những thông tin bạn cần biết về cách vận hành của nền tảng UEF Design Gallery.</p>
             <div className="bg-white border border-[#e2e6ec] shadow-md rounded-2xl p-6 flex items-start gap-5 hover:border-[#1a4ba8]/30 transition-colors">
                <div className="w-12 h-12 bg-[#f0f4ff] text-[#1a4ba8] rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <strong className="text-base block mb-1 font-extrabold text-[#0a0c0f]">Hỗ trợ kỹ thuật</strong>
                  <span className="text-sm text-[#666] block mb-3">Chúng tôi luôn ở đây để giúp bạn.</span>
                  <a href="mailto:khoathietke@uef.edu.vn" className="text-[#1a4ba8] font-bold hover:underline">khoathietke@uef.edu.vn</a>
                </div>
             </div>
           </div>
           
           <div className="space-y-4 animate-[fadeUp_0.7s_ease-out]">
             {[
               { q: "Sinh viên ngành khác có được sử dụng nền tảng không?", a: "Hiện tại, nền tảng UEF Design Gallery được thiết kế chuyên biệt và cấp quyền ưu tiên cho sinh viên thuộc Khoa Thiết kế Đồ họa (Graphic Design) của UEF để đảm bảo tính chuyên môn cao nhất." },
               { q: "Làm sao để tác phẩm được gán nhãn Verified (Đã kiểm định)?", a: "Sau khi bạn đăng tải, giảng viên phụ trách môn học hoặc đồ án đó sẽ nhận được thông báo để vào xem xét và đánh giá. Nếu đồ án đạt chất lượng theo tiêu chuẩn của Khoa, giảng viên sẽ phê duyệt và hệ thống tự động cấp huy hiệu Verified." },
               { q: "Tính năng xuất PDF hoạt động như thế nào?", a: "Tại tính năng Bộ sưu tập (Tập san), bạn có thể gom nhóm các tác phẩm yêu thích. Sau đó bấm 'Xuất PDF', chọn layout có sẵn (Modern, Classic, Minimal), tùy chỉnh màu sắc và font chữ. Hệ thống sẽ tự động thiết kế dàn trang và cho phép bạn tải về dưới dạng PDF chuẩn in ấn." },
               { q: "Doanh nghiệp làm sao để liên hệ với sinh viên?", a: "Tài khoản Doanh nghiệp có thể tìm kiếm sinh viên theo bộ lọc kỹ năng (UI/UX, 3D, Branding...). Khi thấy ấn tượng với tác phẩm nào, nhà tuyển dụng có thể gửi thông báo lời mời phỏng vấn trực tiếp tới sinh viên ngay trên nền tảng." }
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
      <section className="py-32 px-6 lg:px-12 bg-gradient-to-br from-[#0d2e6e] via-[#153b86] to-[#091a45] text-center text-white relative overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#60afff]/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000"></div>
        
        {/* Decorative rings */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/10 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full pointer-events-none border-dashed"></div>
        
        <div className="relative z-10 max-w-3xl mx-auto animate-[fadeUp_0.8s_ease-out]">
          <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight">Sẵn sàng xây dựng dấu ấn<br/>nghề nghiệp của bạn?</h2>
          <p className="text-white/80 mb-12 text-lg max-w-xl mx-auto">Gia nhập cùng hàng trăm sinh viên thiết kế xuất sắc khác và lọt vào "mắt xanh" của các nhà tuyển dụng hàng đầu.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPage("auth")} className="px-10 py-4 bg-white text-[#0d2e6e] font-black rounded-2xl text-[16px] hover:bg-[#f0f4ff] hover:-translate-y-1 transition-all shadow-xl shadow-black/30 duration-300">
              Bắt đầu ngay miễn phí
            </button>
            <button onClick={() => setPage("gallery")} className="px-10 py-4 bg-transparent text-white font-bold rounded-2xl text-[16px] border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-300">
              Khám phá Gallery
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#05070a] text-white/50 py-16 px-6 lg:px-12 text-[15px]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
          <div className="flex items-center gap-5">
            <div className="bg-[#1a4ba8] text-white font-black w-12 h-12 flex items-center justify-center rounded-xl text-sm shadow-[0_0_20px_rgba(26,75,168,0.3)]">UEF</div>
            <div>
              <p className="font-black text-white text-lg tracking-tight mb-1">Khoa Thiết kế Đồ họa</p>
              <p className="text-sm opacity-80">Trường Đại học Kinh tế - Tài chính TP.HCM</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-8 font-bold text-sm uppercase tracking-wider">
            <button onClick={() => setPage("gallery")} className="hover:text-white transition-colors hover:-translate-y-0.5 duration-300">Gallery</button>
            <a href="#about" className="hover:text-white transition-colors hover:-translate-y-0.5 duration-300">Giới thiệu</a>
            <a href="#audience" className="hover:text-white transition-colors hover:-translate-y-0.5 duration-300">Nền tảng</a>
            <a href="#faq" className="hover:text-white transition-colors hover:-translate-y-0.5 duration-300">FAQ</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/10 text-center md:text-left text-sm flex flex-col md:flex-row justify-between items-center gap-4">
           <p>© 2026 UEF Design Gallery. Tất cả bản quyền được bảo hộ.</p>
           <p>Phát triển bởi sinh viên UEF với <Heart size={14} className="inline text-red-500 mx-1" /></p>
        </div>
      </footer>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Modal: Lưu vào Bộ sưu tập (Pinterest/Spotify-like)
// - Checkbox chọn nhiều bộ sưu tập
// - Tạo bộ sưu tập mới nhanh
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
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-end sm:items-center justify-center p-3 sm:p-6">
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
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[#E0E0E0] hover:border-[#B3D9E8] hover:bg-[#F0F8FB] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">{c.name}</p>
                    <p className="text-[11px] text-[#666666]">{c.items.length} {t("artworks")}</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(c.id)}
                    onChange={() => toggle(c.id)}
                    className="w-4 h-4 accent-[#077E9E]"
                  />
                </label>
              ))}
            </div>

            {/* quick create */}
            <div className="mt-3">
              {!creating ? (
                <button
                  onClick={() => setCreating(true)}
                  className="text-sm font-semibold text-[#077E9E] hover:opacity-80 transition-opacity inline-flex items-center gap-2"
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
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]"
                  />
                  <button
                    onClick={submitCreate}
                    className="px-3 py-2 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors"
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
              className="w-full min-h-[110px] px-4 py-3 rounded-2xl border border-[#E0E0E0] text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] resize-y"
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
            className="px-4 py-2.5 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors"
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
        socialLinks: p.socialLinks || {},
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
        socialLinks: settings.socialLinks,
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
                  <input type="text" value={settings.portfolioSlug} onChange={(e) => setSettings({ ...settings, portfolioSlug: e.target.value })} className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-r-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("profileHeadline")}</label>
                <input type="text" value={settings.profileHeadline} onChange={(e) => setSettings({ ...settings, profileHeadline: e.target.value })} placeholder="Graphic Designer & Visual Artist" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">{t("major")}</label>
                <select value={settings.major || ""} onChange={(e) => setSettings({ ...settings, major: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] bg-white">
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
                <select value={settings.yearLevel} onChange={(e) => setSettings({ ...settings, yearLevel: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] bg-white">
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
                  <input type="text" value={settings.socialLinks.behance || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, behance: e.target.value } })} placeholder="https://behance.net/" className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">LinkedIn</label>
                <div className="relative">
                  <Link size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
                  <input type="text" value={settings.socialLinks.linkedin || ""} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} placeholder="https://linkedin.com/in/" className="w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
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
                <div className="text-center py-10 text-[#666666] text-sm">{t("noPublicArtworks")} <a href="/#/upload" className="text-[#077E9E] hover:underline font-semibold">{t("uploadNewArtwork")}</a></div>
              ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {myArtworks.slice(0, 20).map(a => {
                  const selected = (settings.featuredArtworkIds || []).includes(a.id);
                  return (
                    <div key={a.id} onClick={() => toggleFeatured(a.id)} className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] ${selected ? 'border-[#077E9E] ring-2 ring-[#077E9E] ring-offset-1' : 'border-[#E0E0E0] hover:border-[#999]'}`}>
                      <img src={a.coverImageUrl} alt={a.title} className="w-full h-full object-cover" />
                      {selected && <div className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#077E9E] text-white flex items-center justify-center text-xs font-bold"><Check size={14} /></div>}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                        <p className="text-white text-xs font-semibold truncate">{a.title}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              )}
              <button onClick={() => document.getElementById('featPicker')?.classList.add('hidden')} className="mt-4 w-full py-2.5 rounded-lg bg-[#077E9E] text-white font-semibold cursor-pointer">{t("confirm")}</button>
            </div>
          </div>

          {/* TIMELINE ACHIEVEMENTS */}
          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-[#212121]">{t("timelineAchievements")}</h3>
              <button onClick={openAddTimeline} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#077E9E] text-white text-sm font-semibold hover:bg-opacity-90 transition-opacity cursor-pointer"><Plus size={15} />{t("add")}</button>
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
                      <select value={timelineForm.month} onChange={e => setTimelineForm({...timelineForm, month: e.target.value})} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] bg-white">
                        <option value="">{t("selectMonth")}</option>
                        {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
                      </select>
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("year")}</label>
                      <select value={timelineForm.year} onChange={e => setTimelineForm({...timelineForm, year: e.target.value})} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] bg-white">
                        <option value="">{t("selectYear")}</option>
                        {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("title")}</label>
                    <input type="text" value={timelineForm.title} onChange={e => setTimelineForm({...timelineForm, title: e.target.value})} placeholder={t("timelineTitlePlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("description")}</label>
                    <textarea value={timelineForm.description} onChange={e => setTimelineForm({...timelineForm, description: e.target.value})} rows={3} placeholder={t("timelineDescPlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] resize-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("tagsCommaSeparated")}</label>
                    <input type="text" value={timelineForm.tags} onChange={e => setTimelineForm({...timelineForm, tags: e.target.value})} placeholder={t("tagsPlaceholder")} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("linkPaperCert")}</label>
                    <div className="flex gap-2">
                      <input type="text" value={timelineForm.linkUrl} onChange={e => setTimelineForm({...timelineForm, linkUrl: e.target.value})} placeholder="https://..." className="flex-1 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                      <input type="text" value={timelineForm.linkLabel} onChange={e => setTimelineForm({...timelineForm, linkLabel: e.target.value})} placeholder={t("linkLabelPlaceholder")} className="w-1/3 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[#212121] mb-1.5">{t("bgImageUrl")}</label>
                    <input type="text" value={timelineForm.imageUrl} onChange={e => setTimelineForm({...timelineForm, imageUrl: e.target.value})} placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button onClick={saveTimelineEntry} disabled={savingTimeline || !timelineForm.title || !timelineForm.month || !timelineForm.year} className="flex-1 py-2.5 rounded-lg bg-[#077E9E] text-white text-sm font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">{savingTimeline ? t("savingDots") : editingTimelineId ? t("update") : t("addNew")}</button>
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
                <a href={`${window.location.origin}/#/portfolio${settings.portfolioSlug ? '/' + settings.portfolioSlug : ''}`} target="_blank" rel="noopener noreferrer" className="text-xs text-[#077E9E] font-semibold hover:underline">{t("viewOnPortfolio")} →</a>
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
                    <div key={e.id} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-[#077E9E]' : 'bg-[#E0E0E0]'}`} />
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
              <div className="w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#077E9E]"></div>
            </label>
          </div>

            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">{saving ? t("saving") : t("saveSettings")}</button>
              <a href={`${window.location.origin}/#/portfolio${settings.portfolioSlug ? '/' + settings.portfolioSlug : ''}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-[#077E9E] text-[#077E9E] rounded-lg font-bold hover:bg-[#F0F8FB] transition-colors">
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
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .then((session) => {
        if (session?.user) {
          setProfile({
            fullName: session.user.name || session.user.fullName || "",
            studentId: session.user.studentId || "",
            email: session.user.email || "",
            avatarUrl: session.user.image || session.user.avatarUrl || "",
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
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok && data.success) {
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
      const res = await fetch("/api/user/change-password", {
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("fullNameLabel")}</label>
                  <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("studentId")}</label>
                  <input type="text" value={profile.studentId} disabled className="w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" />
                </div>
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
                <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("newPassword")}</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">{t("confirmNewPassword")}</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
              </div>
              <button onClick={changePassword} disabled={changingPass} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
                {changingPass ? "Đang xử lý..." : t("changePassword")}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={saveProfile} disabled={saving} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
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
              <Globe size={20} className="text-[#077E9E]" /> Public Views
            </h2>
            <div onClick={() => setPage("landing")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Chủ (Landing Page)</h3>
              </div>
              <p className="text-[#666666] text-xs">Trang đón khách giới thiệu nền tảng</p>
            </div>
            <div onClick={() => setPage("auth")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Lock size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Đăng nhập</h3>
              </div>
              <p className="text-[#666666] text-xs">Màn hình đăng nhập sinh viên / giảng viên</p>
            </div>
            <div onClick={() => setPage("gallery")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Gallery Tổng hợp</h3>
              </div>
              <p className="text-[#666666] text-xs">Hiển thị toàn bộ tác phẩm trên hệ thống</p>
            </div>
            <div onClick={() => setPage("about")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Globe size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Giới thiệu (About)</h3>
              </div>
              <p className="text-[#666666] text-xs">Trang thông tin về Khoa và giảng viên</p>
            </div>
            <div onClick={() => setPage("portfolio")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <User size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Portfolio Cá nhân</h3>
              </div>
              <p className="text-[#666666] text-xs">Hồ sơ cá nhân và các tác phẩm của sinh viên</p>
            </div>
            <div onClick={() => setPage("detail")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Image size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Chi tiết Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Xem chi tiết, bình luận và thả tim tác phẩm</p>
            </div>
            <div onClick={() => setPage("about")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Trang Giới thiệu Khoa</h3>
              </div>
              <p className="text-[#666666] text-xs">Thông tin đội ngũ giảng viên và liên hệ</p>
            </div>
          </div>

          {/* Column 2 */}
          <div className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-[#212121] mb-2 flex items-center gap-2">
              <PenTool size={20} className="text-[#077E9E]" /> Student Dashboard
            </h2>
            <div onClick={() => setPage("dashboard")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Folder size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">{t("studentDashboard")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Quản lý các ấn phẩm đã tải lên của sinh viên</p>
            </div>
            <div onClick={() => setPage("upload")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Plus size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Form Upload Tác phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện đăng tải tác phẩm mới</p>
            </div>
            <div onClick={() => setPage("edit_artwork")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Edit2 size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Form Chỉnh sửa Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện cập nhật thông tin tác phẩm</p>
            </div>
            <div onClick={() => setPage("settings")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Settings size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">{t("accountSettings")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Tùy chỉnh thông tin cá nhân và bảo mật</p>
            </div>
            <div onClick={() => setPage("portfolio_settings")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">{t("portfolioSettings")}</h3>
              </div>
              <p className="text-[#666666] text-xs">Trạng thái công khai và link mạng xã hội</p>
            </div>
            <div onClick={() => setPage("messages")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={20} className="text-[#077E9E]" />
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
            <div onClick={() => setPage("admin")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <LayoutDashboard size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Admin Dashboard</h3>
              </div>
              <p className="text-[#666666] text-xs">Màn hình tổng quan của hệ thống quản trị</p>
            </div>
            <div onClick={() => setPage("admin_users")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý Tài khoản (Users)</h3>
              </div>
              <p className="text-[#666666] text-xs">Phân quyền, khóa/mở khóa tài khoản sinh viên</p>
            </div>
            <div onClick={() => setPage("admin_artworks")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Trash2 size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý & Cảnh cáo Ấn phẩm</h3>
              </div>
              <p className="text-[#666666] text-xs">Kiểm duyệt post-moderation và xử lý vi phạm</p>
            </div>
            <div onClick={() => setPage("admin_export")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <FileDown size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Quản lý Bộ sưu tập & Xuất PDF</h3>
              </div>
              <p className="text-[#666666] text-xs">Giao diện kéo thả sắp xếp ấn phẩm để xuất tập san</p>
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

function TimelineSection({ entries: propEntries, slug }) {
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);

  const mockData = [
    { id: 'mock-1', year: "2023", monthLabel: "T9", month: "Tháng 9", title: "Đồ án nhập môn lập trình", description: "Hoàn thành đồ án Quản lý Thư viện bằng C++ với kiến trúc OOP. Đạt 9.5/10.", tags: ["C++", "OOP", "Xuất sắc"], linkUrl: "#", linkLabel: "Xem đồ án →", monthColor: "#dbeafe", monthText: "#1e40af", imageUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&q=80" },
    { id: 'mock-2', year: "2024", monthLabel: "T3", month: "Tháng 3", title: "Giải Nhất NCKH cấp Trường", description: "Nghiên cứu ứng dụng AI trong phân tích cảm xúc văn bản tiếng Việt. Đạt giải Nhất.", tags: ["Nghiên cứu", "AI/NLP", "Giải Nhất"], linkUrl: "#", linkLabel: "Xem báo cáo →", monthColor: "#dcfce7", monthText: "#166534", imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80" },
    { id: 'mock-3', year: "2024", monthLabel: "T8", month: "Tháng 8", title: "Công bố bài báo IEEE", description: "Đồng tác giả bài báo đăng trên hội nghị IEEE RIVF 2024.", tags: ["IEEE", "Công bố QT", "NLP"], linkUrl: "#", linkLabel: "Xem bài báo →", monthColor: "#f3e8ff", monthText: "#6b21a8", imageUrl: "https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800&q=80" },
    { id: 'mock-4', year: "2025", monthLabel: "T2", month: "Tháng 2", title: "Thực tập tại FPT Software", description: "Tham gia team Frontend. Đánh giá: Xuất sắc (9.0/10).", tags: ["Thực tập", "React", "FPT"], linkUrl: "#", linkLabel: "Xem chứng nhận →", monthColor: "#fef3c7", monthText: "#92400e", imageUrl: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800&q=80" },
    { id: 'mock-5', year: "2025", monthLabel: "T6", month: "Tháng 6", title: "Học bổng Toàn phần kỳ 6", description: "Đạt học bổng toàn phần nhờ GPA 3.8/4.0.", tags: ["Học bổng", "GPA 3.8", "Toàn phần"], linkUrl: "#", linkLabel: "Xem quyết định →", monthColor: "#fce7f3", monthText: "#9d174d", imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c7f1?w=800&q=80" },
    { id: 'mock-6', year: "2026", monthLabel: "T5", month: "Tháng 5", title: "Tốt nghiệp Thủ khoa", description: "Tốt nghiệp Xuất sắc. Điểm bảo vệ: 9.8/10.", tags: ["Thủ khoa", "Xuất sắc", "Đồ án"], linkUrl: "#", linkLabel: "Xem đồ án →", monthColor: "#ccfbf1", monthText: "#0f766e", imageUrl: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=800&q=80" },
  ];

  const monthColors = { "Tháng 1": ["#dbeafe","#1e40af"], "Tháng 2": ["#fef3c7","#92400e"], "Tháng 3": ["#dcfce7","#166534"], "Tháng 4": ["#fce7f3","#9d174d"], "Tháng 5": ["#ccfbf1","#0f766e"], "Tháng 6": ["#f3e8ff","#6b21a8"], "Tháng 7": ["#e0f2fe","#0369a1"], "Tháng 8": ["#fef9c3","#a16207"], "Tháng 9": ["#dbeafe","#1e40af"], "Tháng 10": ["#ffedd5","#9a3412"], "Tháng 11": ["#fce7f3","#9d174d"], "Tháng 12": ["#e0e7ff","#4338ca"] };

  useEffect(() => {
    if (propEntries) { setFetchedEntries(propEntries); setFetchDone(true); return; }
    const fetchFn = slug
      ? fetch(`/api/portfolios/${slug}/timeline`).then(r => r.json())
      : api.timeline.list();
    fetchFn.then(data => {
      if (data.error) throw new Error(data.error);
      setFetchedEntries(Array.isArray(data) && data.length > 0 ? data : mockData);
      setFetchDone(true);
    }).catch(() => { setFetchedEntries(mockData); setFetchDone(true); });
  }, [slug]);

  const rawEntries = fetchedEntries || mockData;
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

  const [activeIndex, setActiveIndex] = useState(0);
  const isTransitioning = useRef(false);
  const stripRef = useRef(null);
  const cardsRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartScroll = useRef(0);
  const autoCenterTimer = useRef(null);
  const cardDragStart = useRef(0);

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

  return (
    <section className="pt-12 pb-6">
      <div className="flex items-end justify-between gap-6 mb-8">
        <div>
          <p className="text-cerulean font-semibold text-xs tracking-widest uppercase mb-2">Academic Journey</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">{t("achievementJourney")}</h2>
          <p className="text-sm text-muted mt-2 max-w-lg">
            Những cột mốc đáng nhớ trên chặng đường học tập và nghiên cứu.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="relative flex flex-col md:flex-row mb-6 overflow-hidden bg-white" style={{ borderRadius: 24, border: `1px solid ${GRAY_LIGHT}`, minHeight: 400 }}>
          {/* Left: Content Area */}
          <div ref={cardsRef} className="relative w-full md:w-1/2 z-10 flex items-center justify-center" style={{ minHeight: 400 }}>
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
            style={{ background: CERULEAN, border: 'none', color: '#fff', boxShadow: '0 4px 12px rgba(7,126,158,0.3)' }}
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
                    boxShadow: i === activeIndex ? `0 0 0 4px rgba(7,126,158,0.2)` : 'none',
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
    if (!hash) return { page: "home", id: null };
    const parts = hash.split('/');
    return { page: parts[0] || "home", id: parts.length > 1 ? parts.slice(1).join('/') : null };
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
      path = newPage === "home" ? "#/" : `#/${newPage}`;
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
    name: authUser.name || "",
    email: authUser.email || "",
    image: authUser.image || "",
    id: authUser.id || "",
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
      message: "Chọn bộ sưu tập và thêm ghi chú giám tuyển để lưu chính thức.",
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
    <div className="font-sans min-h-screen bg-[#F8F8F8] text-[#212121] overflow-x-hidden">
      {page !== "auth" && page !== "register" && page !== "portal" && (
        <AppHeader activePage={page} setPage={setPage} isLoggedIn={isLoggedIn} userRole={userRole} onLogout={handleLogout} userData={userData} />
      )}
      {page === "portal" && <PortalPage setPage={setPage} />}
      {page === "home" && <LandingPage setPage={setPage} isLoggedIn={isLoggedIn} />}
      {page === "landing" && <LandingPage setPage={setPage} isLoggedIn={isLoggedIn} />}
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
      {page === "upload" && (
        isLoggedIn ? (userRole === "student" ? (
          <UploadPage setPage={setPage} setActiveArtworkId={setActiveArtworkId} />
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
      {page === "settings" && (
        isLoggedIn ? <SettingsPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "portfolio_settings" && (
        isLoggedIn ? (userRole === "student" ? <PortfolioSettingsPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />) : <AccessDenied setPage={setPage} />
      )}
      {page === "admin" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminDashboardPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "about" && <AboutPage setPage={setPage} />}
      {page === "messages" && (
        isLoggedIn ? <MessagesPage setPage={setPage} userData={userData} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "edit_artwork" && (
        isLoggedIn ? <EditArtworkPage setPage={setPage} activeArtworkId={activeArtworkId} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_orders" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminOrdersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
      )}
      {page === "admin_users" && (
        (userRole === "admin" || userRole === "lecturer") ? <AdminUsersPage setPage={setPage} /> : <AccessDenied setPage={setPage} />
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
              const id = createCollection(`Bộ sưu tập mới`);
              openExportConfig(id);
            }}
            onOpenCatalogBuilder={(c) => setCatalogCollection(c)}
          />
        ) : <AccessDenied setPage={setPage} />
      )}
      {page === "collection_export_config" && (
        (userRole === "admin" || userRole === "lecturer") ? (
          <CollectionExportConfigPage
            setPage={setPage}
            collection={activeCollection}
            onUpdateCollection={updateActiveCollection}
            onOpenCatalogBuilder={(c) => setCatalogCollection(c)}
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
    </div>
  );
}







