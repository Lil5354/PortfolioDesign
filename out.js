"use strict";
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
window.MOCK_PROJECTS = [
  {
    id: "mock-1",
    title: "[Draft] Brand Identity Concept",
    subject: "Graphic Design",
    description: "This is a draft version. It only has a cover image and no case study yet.",
    coverImageUrl: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80",
    likeCount: 45,
    viewCount: 156,
    settingsData: JSON.stringify({ projectStatus: "Draft", aiUsage: "none", role: "Designer" }),
    blocksJson: JSON.stringify([]),
    user: { name: "Mock Student", id: "student-1", portfolioSettings: { portfolioSlug: "student-1" } },
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-2",
    title: "[Submitted] Packaging Design",
    subject: "Graphic Design",
    description: "Submitted for grading. Waiting for instructor feedback.",
    coverImageUrl: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80",
    likeCount: 120,
    viewCount: 432,
    settingsData: JSON.stringify({ projectStatus: "Submitted", aiUsage: "brainstorm", role: "Lead Designer" }),
    blocksJson: JSON.stringify([
      { id: "1", type: "text", content: "<h2 style='text-align:center;'>1. Research & Ideation</h2><p>Here is some early research.</p>" },
      { id: "2", type: "image", content: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&q=80", caption: "Initial sketch" }
    ]),
    user: { name: "Mock Student", id: "student-1", portfolioSettings: { portfolioSlug: "student-1" } },
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-4",
    title: "[Approved] UX/UI Mobile App",
    subject: "UI/UX",
    description: "This project has been graded and approved by the instructor. It has the Academic Verified badge.",
    coverImageUrl: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80",
    likeCount: 310,
    viewCount: 1205,
    settingsData: JSON.stringify({ projectStatus: "Approved", aiUsage: "generation", aiPrompt: "Generate abstract mobile UI patterns", role: "UI Designer" }),
    blocksJson: JSON.stringify([
      { id: "1", type: "text", content: "<h2 style='text-align:center;'>Final Design</h2><p>Approved outcome.</p>" },
      { id: "2", type: "image", content: "https://images.unsplash.com/photo-1618761714954-0b8cd0026356?w=800&q=80" }
    ]),
    user: { name: "Mock Student", id: "student-1", portfolioSettings: { portfolioSlug: "student-1" } },
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  },
  {
    id: "mock-5",
    title: "[Published] 3D Product Render",
    subject: "3D Animation",
    description: "Published to the public portfolio.",
    coverImageUrl: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?w=800&q=80",
    likeCount: 85,
    viewCount: 300,
    settingsData: JSON.stringify({ projectStatus: "Published", aiUsage: "editing", role: "3D Artist" }),
    blocksJson: JSON.stringify([
      { id: "1", type: "video", content: "https://www.w3schools.com/html/mov_bbb.mp4" }
    ]),
    user: { name: "Mock Student", id: "student-1", portfolioSettings: { portfolioSlug: "student-1" } },
    createdAt: (/* @__PURE__ */ new Date()).toISOString()
  }
];
import HTMLFlipBook from "react-pageflip";
import {
  Image,
  Eye,
  Heart,
  Globe,
  LayoutDashboard,
  Folder,
  MessageSquare,
  BarChart2,
  Settings,
  Trash2,
  Edit2,
  Search,
  X,
  Check,
  CheckCircle,
  ArrowDownCircle,
  ExternalLink,
  Maximize2,
  Lock,
  FileImage,
  ShieldAlert,
  Plus,
  Send,
  Clock,
  PenTool,
  Bookmark,
  Mail,
  Link,
  User,
  Briefcase,
  Unlock,
  FileDown,
  GripVertical,
  Users,
  LogOut,
  ChevronDown,
  MailOpen,
  MapPin,
  Phone,
  ArrowRight,
  Star,
  Monitor,
  BookOpen,
  Calendar,
  EyeOff,
  Archive,
  ArchiveRestore,
  GraduationCap,
  Rocket,
  Upload,
  Menu,
  ShoppingCart,
  Languages,
  ShieldCheck,
  UserPlus,
  FileBadge,
  Zap,
  LayoutGrid,
  Building2,
  ClipboardList,
  Info,
  Filter,
  ChevronRight,
  ChevronLeft,
  ThumbsUp,
  MessageCircle,
  Package,
  FileText,
  Tag,
  Download,
  FolderInput,
  FolderPlus,
  AlertTriangle,
  Camera,
  ImageIcon,
  Reply,
  RefreshCw,
  Save,
  Edit3
} from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
export function ProjectStatusIcon({ status }) {
  if (!status || status === "Draft") {
    return /* @__PURE__ */ React.createElement("div", { title: "Nh\xE1p", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#666", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(Edit3, { size: 16 }));
  }
  if (status === "Revision") {
    return /* @__PURE__ */ React.createElement("div", { title: "Xin g\xF3p \xFD", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#f59e0b", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(Clock, { size: 16 }));
  }
  if (status === "Final" || status === "pending_approval") {
    return /* @__PURE__ */ React.createElement("div", { title: "B\u1EA3n cu\u1ED1i", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#3b82f6", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(Rocket, { size: 16 }));
  }
  if (status === "Reopen") {
    return /* @__PURE__ */ React.createElement("div", { title: "Y\xEAu c\u1EA7u l\xE0m l\u1EA1i", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#ef4444", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(RefreshCw, { size: 16 }));
  }
  if (status === "Approved") {
    return /* @__PURE__ */ React.createElement("div", { title: "\u0110\xE3 duy\u1EC7t", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#10b981", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(CheckCircle, { size: 16 }));
  }
  if (status === "Published") {
    return /* @__PURE__ */ React.createElement("div", { title: "Public", style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", color: "#8b5cf6", padding: "6px", borderRadius: "50%", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", zIndex: 10 } }, /* @__PURE__ */ React.createElement(Globe, { size: 16 }));
  }
  return null;
}
import iconNam1 from "./Logoicon/nam-1.png";
import iconNam2 from "./Logoicon/nam-2.png";
import iconNam3 from "./Logoicon/nam-3.png";
import iconNamCuoi from "./Logoicon/nam-cuoi.png";
import iconTotNghiep from "./Logoicon/5.png";
const getBadgeShortName = (name) => {
  if (!name) return "GR";
  if (/^20\d{2}/.test(name)) {
    return /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, lineHeight: 1, textAlign: "center" } }, name.substring(2, 4));
  }
  return name.substring(0, 2).toUpperCase();
};
let globalAccountBadgesCache = [];
let accountBadgesListeners = [];
const fetchGlobalBadges = async () => {
  try {
    const res = await fetch("/api/accountbadges");
    const data = await res.json();
    globalAccountBadgesCache = data || [];
    accountBadgesListeners.forEach((l) => l(globalAccountBadgesCache));
  } catch (e) {
    console.error("Error fetching badges:", e);
  }
};
const updateGlobalBadges = (newBadges) => {
  globalAccountBadgesCache = newBadges;
  accountBadgesListeners.forEach((l) => l(globalAccountBadgesCache));
};
function useAccountBadgesGlobal() {
  const [badges, setBadges] = useState(globalAccountBadgesCache);
  useEffect(() => {
    const listener = (newBadges) => setBadges(newBadges);
    accountBadgesListeners.push(listener);
    if (globalAccountBadgesCache.length === 0) fetchGlobalBadges();
    return () => {
      accountBadgesListeners = accountBadgesListeners.filter((l) => l !== listener);
    };
  }, []);
  return badges;
}
const getBadgeIcon = (badgeName) => {
  const dynamicBadge = globalAccountBadgesCache.find((b) => b.name === badgeName);
  if (dynamicBadge && dynamicBadge.iconUrl) return dynamicBadge.iconUrl;
  if (badgeName === "Designer M\u1EA7m non") return iconNam1;
  if (badgeName === "Designer Th\u1EF1c t\u1EADp") return iconNam2;
  if (badgeName === "Designer Chuy\xEAn nghi\u1EC7p") return iconNam3;
  if (badgeName === "Designer Ti\u1EC1n b\u1ED1i") return iconNamCuoi;
  if (badgeName === "Designer T\u1ED1t nghi\u1EC7p") return iconTotNghiep;
  return null;
};
const getBadgeColor = (badgeName) => {
  const dynamicBadge = globalAccountBadgesCache.find((b) => b.name === badgeName);
  if (dynamicBadge) return { text: dynamicBadge.textColor || "#ffffff", bg: dynamicBadge.bgColor || "#1A4BA8" };
  if (badgeName === "Designer M\u1EA7m non") return { text: "#84cc16", bg: "#ffffff" };
  if (badgeName === "Designer Th\u1EF1c t\u1EADp") return { text: "#22c55e", bg: "#ffffff" };
  if (badgeName === "Designer Chuy\xEAn nghi\u1EC7p") return { text: "#166534", bg: "#ffffff" };
  if (badgeName === "Designer Ti\u1EC1n b\u1ED1i") return { text: "#f59e0b", bg: "#ffffff" };
  if (badgeName === "Designer T\u1ED1t nghi\u1EC7p") return { text: "#000000", bg: "#ffffff" };
  return { text: "#444444", bg: "#ffffff" };
};
import ChatBot from "./components/ChatBot";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
export function GlobalLoading() {
  return /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center min-h-[60vh] w-full bg-white z-50" }, /* @__PURE__ */ React.createElement("div", { style: { width: 300, height: 300 } }, /* @__PURE__ */ React.createElement(
    DotLottieReact,
    {
      src: "https://lottie.host/c21c637c-1f75-4ece-8274-afbb094dcfd8/VvdZEvXog8.lottie",
      loop: true,
      autoplay: true
    }
  )));
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
  { id: 1, title: "Neon Cityscape Poster", student: "Nguy\u1EC5n Minh Anh", likes: 142, h: 320, img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", category: "Poster", tool: "Illustrator", year: "2024", isPublic: true },
  { id: 2, title: "Brand Identity UEF", student: "Tr\u1EA7n B\u1EA3o Long", likes: 89, h: 240, img: "https://i.pinimg.com/1200x/64/52/dc/6452dc484427b34cc0be14c3d80c948a.jpg", category: "Branding", tool: "Figma", year: "2024", isPublic: true },
  { id: 3, title: "3D Abstract Geometry", student: "L\xEA Th\u1ECB H\u01B0\u01A1ng", likes: 203, h: 380, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", category: "3D Art", tool: "Blender", year: "2023", isPublic: false },
  { id: 4, title: "Vintage Travel Series", student: "Ph\u1EA1m Qu\u1ED1c Vi\u1EC7t", likes: 56, h: 270, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", category: "Illustration", tool: "Procreate", year: "2023", isPublic: true },
  { id: 5, title: "UI Design System", student: "Ho\xE0ng Th\u1ECB Mai", likes: 175, h: 300, img: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&q=80", category: "UI/UX", tool: "Figma", year: "2024", isPublic: true },
  { id: 6, title: "Cultural Festival Poster", student: "V\u0169 \u0110\u0103ng Khoa", likes: 98, h: 350, img: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=800&q=80", category: "Poster", tool: "Photoshop", year: "2023", isPublic: true },
  { id: 7, title: "Minimal Logo Collection", student: "\u0110\u1EB7ng Thu Hi\u1EC1n", likes: 130, h: 260, img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", category: "Branding", tool: "Illustrator", year: "2024", isPublic: false },
  { id: 8, title: "Futuristic UI Concept", student: "B\xF9i Minh Kh\u1EA3i", likes: 214, h: 290, img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", category: "UI/UX", tool: "Figma", year: "2024", isPublic: true }
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
  const isActive = (id) => activePage === id || id === "home" && (activePage === "home" || activePage === "landing");
  const navItems = [
    { id: "home", label: t("home") },
    { id: "gallery", label: t("gallery") },
    { id: "about", label: t("about") }
  ];
  if (isLoggedIn && (userRole === "student" || userRole === "guest")) navItems.push({ id: "portfolio", label: t("portfolio") });
  const userName = userData?.fullName || userData?.name || t("defaultUser");
  const userEmail = userData?.email || "";
  const userAvatar = userData?.avatarUrl || userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";
  return /* @__PURE__ */ React.createElement("header", { className: "flex items-center justify-between px-8 py-3 border-b border-gray-100 bg-white sticky top-0 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center cursor-pointer", onClick: () => setPage("gallery") }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", className: "h-11 object-contain" })), /* @__PURE__ */ React.createElement("nav", { className: "hidden md:flex items-center gap-6 text-sm font-medium" }, navItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, onClick: () => {
    if (item.id === "portfolio") {
      setPage("portfolio", { portfolioSlug: userData?.portfolioSettings?.portfolioSlug });
    } else {
      setPage(item.id);
    }
  }, className: `pb-1 transition-colors ${isActive(item.id) ? "text-[#1a4ba8] border-b-2 border-[#1a4ba8]" : "text-gray-500 hover:text-[#212121]"}` }, item.label))), /* @__PURE__ */ React.createElement("button", { className: "md:hidden flex items-center cursor-pointer text-[#666666] hover:text-[#212121]", onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen) }, isMobileMenuOpen ? /* @__PURE__ */ React.createElement(X, { size: 22 }) : /* @__PURE__ */ React.createElement(Menu, { size: 22 })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 text-sm font-medium" }, isLoggedIn && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement(NotificationBell, { setPage }), /* @__PURE__ */ React.createElement(MessageDropdown, { setPage, userData })), /* @__PURE__ */ React.createElement("div", { className: "relative skiptranslate", ref: langRef }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setIsLangOpen(!isLangOpen),
      className: "flex items-center gap-1 px-2 py-1.5 rounded-lg border border-[#E0E0E0] bg-white text-[#666666] hover:text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer",
      title: lang === "vi" ? t("english") : t("vietnamese")
    },
    /* @__PURE__ */ React.createElement(Languages, { size: 16 }),
    /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-semibold uppercase" }, lang === "vi" ? "VI" : "EN")
  ), isLangOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-2 w-40 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden py-1 z-50" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (lang !== "vi") toggleLang();
        setIsLangOpen(false);
      },
      className: `w-full text-left px-4 py-2 text-sm ${lang === "vi" ? "text-[#1a4ba8] font-bold bg-[#eef4ff]" : "text-[#212121] hover:bg-[#F8F8F8]"}`
    },
    t("tiengViet")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        if (lang !== "en") toggleLang();
        setIsLangOpen(false);
      },
      className: `w-full text-left px-4 py-2 text-sm ${lang === "en" ? "text-[#1a4ba8] font-bold bg-[#eef4ff]" : "text-[#212121] hover:bg-[#F8F8F8]"}`
    },
    t("tiengAnh")
  ))), isLoggedIn ? /* @__PURE__ */ React.createElement("div", { className: "relative", ref: dropdownRef }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 cursor-pointer border border-[#E0E0E0] rounded-full p-1 pr-3 hover:bg-[#F8F8F8] transition-colors", onClick: () => setIsDropdownOpen(!isDropdownOpen) }, /* @__PURE__ */ React.createElement("img", { src: userAvatar, alt: "avatar", className: "w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" }), /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, className: "text-[#666666]" })), isDropdownOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute right-0 top-full mt-2 w-56 bg-white border border-[#E0E0E0] rounded-xl shadow-lg overflow-hidden py-1 z-50" }, /* @__PURE__ */ React.createElement("div", { className: "px-4 py-3 border-b border-[#E0E0E0] bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-[#212121]" }, userName), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, userEmail)), /* @__PURE__ */ React.createElement("div", { className: "py-1" }, userRole === "student" || userRole === "guest" ? /* @__PURE__ */ React.createElement(React.Fragment, null, (userRole === "student" || userRole === "guest") && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("dashboard");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 16, className: "text-[#666666]" }), " ", t("studentDashboard")), userData.badges && userData.badges.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-1.5 px-4 py-2" }, Array.from(new Map(userData.badges.map((b) => [b.name || b.iconUrl, b])).values()).map((badge, idx) => /* @__PURE__ */ React.createElement("img", { key: idx, src: getBadgeIcon(badge.name), alt: badge.name, className: "w-5 h-5", title: badge.name }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("settings");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(Settings, { size: 16, className: "text-[#666666]" }), " ", t("accountSettings")), userRole === "student" && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("portfolio_settings");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(Briefcase, { size: 16, className: "text-[#666666]" }), " ", t("portfolioSettings"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("admin");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 16, className: "text-[#666666]" }), " ", userRole === "lecturer" ? "Dashboard Gi\u1EA3ng vi\xEAn" : t("adminDashboard")), userRole === "lecturer" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("moodboards");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(Bookmark, { size: 16, className: "text-[#666666]" }), " Moodboard")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm", onClick: () => {
    setPage("settings");
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(Settings, { size: 16, className: "text-[#666666]" }), " ", t("accountSettings")))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-[#E0E0E0] py-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 px-4 py-2 hover:bg-[#FEF2F2] hover:text-[#8B1A1A] cursor-pointer text-[#8B1A1A] text-sm font-medium transition-colors", onClick: () => {
    onLogout && onLogout();
    setIsDropdownOpen(false);
  } }, /* @__PURE__ */ React.createElement(LogOut, { size: 16 }), " ", t("logout"))))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("register"), className: "text-gray-500 hover:text-[#212121] px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors" }, t("register")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "bg-[#1a4ba8] text-white px-5 py-1.5 rounded-lg hover:bg-[#1642a6] transition-colors" }, t("login")))), isMobileMenuOpen && /* @__PURE__ */ React.createElement("div", { ref: mobileMenuRef, className: "fixed top-14 left-0 right-0 bg-white border-b border-[#E0E0E0] shadow-lg z-40 md:hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col py-2" }, navItems.map((item) => /* @__PURE__ */ React.createElement("button", { key: item.id, onClick: () => {
    if (item.id === "portfolio") {
      setPage("portfolio", { portfolioSlug: userData?.portfolioSettings?.portfolioSlug });
    } else {
      setPage(item.id);
    }
    setIsMobileMenuOpen(false);
  }, className: `px-6 py-3 text-sm font-medium text-left transition-colors ${isActive(item.id) ? "text-[#1a4ba8] bg-[#eef4ff]" : "text-gray-600 hover:bg-[#F8F8F8]"}` }, item.label)), isLoggedIn && /* @__PURE__ */ React.createElement(React.Fragment, null, userRole === "student" || userRole === "guest" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "border-t border-[#E0E0E0] my-1" }), (userRole === "student" || userRole === "guest") && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("dashboard");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 16, className: "inline mr-2" }), t("studentDashboard")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("messages");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(Mail, { size: 16, className: "inline mr-2" }), t("inbox")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("settings");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(Settings, { size: 16, className: "inline mr-2" }), t("settings"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "border-t border-[#E0E0E0] my-1" }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("admin");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 16, className: "inline mr-2" }), userRole === "lecturer" ? "Dashboard Gi\u1EA3ng vi\xEAn" : t("admin")), userRole === "lecturer" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("moodboards");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(Bookmark, { size: 16, className: "inline mr-2" }), "Moodboard"), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("messages");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(Mail, { size: 16, className: "inline mr-2" }), t("inbox"))), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("settings");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(Settings, { size: 16, className: "inline mr-2" }), t("settings"))), /* @__PURE__ */ React.createElement("div", { className: "border-t border-[#E0E0E0] my-1" }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    onLogout && onLogout();
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-[#8B1A1A] hover:bg-[#FEF2F2]" }, /* @__PURE__ */ React.createElement(LogOut, { size: 16, className: "inline mr-2" }), t("logout"))), !isLoggedIn && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "border-t border-[#E0E0E0] my-1" }), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("auth");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-[#1a4ba8] hover:bg-[#eef4ff]" }, t("login")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setPage("register");
    setIsMobileMenuOpen(false);
  }, className: "px-6 py-3 text-sm font-medium text-left text-gray-600 hover:bg-[#F8F8F8]" }, t("register"))))));
}
function MasonryGrid({
  items,
  showHover = true,
  onArtworkClick,
  showBookmarkAction = false,
  isBookmarked,
  onBookmarkClick
}) {
  const [hovered, setHovered] = useState(null);
  const cols = [[], [], []];
  items.forEach((item, i) => cols[i % 3].push(item));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, cols.map((col, ci) => /* @__PURE__ */ React.createElement("div", { key: ci, style: { display: "flex", flexDirection: "column", gap: 16 } }, col.map((art) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: art.id,
      onClick: () => onArtworkClick && onArtworkClick(art),
      style: { position: "relative", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG },
      onMouseEnter: () => setHovered(art.id),
      onMouseLeave: () => setHovered(null)
    },
    /* @__PURE__ */ React.createElement("img", { src: art.img, alt: art.title, style: { width: "100%", height: art.h, objectFit: "cover", display: "block" } }),
    showHover && hovered === art.id && /* @__PURE__ */ React.createElement(
      "div",
      {
        style: {
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.18) 55%, transparent 100%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "16px 14px"
        }
      },
      showBookmarkAction && /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            onBookmarkClick && onBookmarkClick(art);
          },
          title: t("saveToCollectionFlow"),
          style: {
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
            transition: "all .15s"
          }
        },
        /* @__PURE__ */ React.createElement(
          Bookmark,
          {
            size: 16,
            color: isBookmarked && isBookmarked(art.id) ? "#fff" : "rgba(255,255,255,0.9)",
            fill: isBookmarked && isBookmarked(art.id) ? "#fff" : "none"
          }
        )
      ),
      /* @__PURE__ */ React.createElement("p", { style: { color: "#fff", fontWeight: 600, fontSize: 14, margin: 0 } }, art.title),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "rgba(255,255,255,0.75)", fontSize: 12 } }, art.student), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Heart, { size: 14, color: "#ff6b6b", fill: "#ff6b6b" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 12 } }, art.likes)))
    ),
    !art.isPublic && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8, background: "rgba(255,255,255,0.9)", borderRadius: 6, padding: "4px 8px", border: `1px solid ${GRAY_LIGHT}`, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Lock, { size: 10, color: BLACK }), /* @__PURE__ */ React.createElement("span", { style: { color: BLACK, fontSize: 11, fontWeight: 500 } }, t("private")))
  )))));
}
function ProfileQuickViewModal({ person, onClose, setPage }) {
  if (!person) return null;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1e3, display: "flex" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)" }, onClick: onClose }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, right: 16, bottom: 16, width: 560, background: "#fff", borderRadius: 8, overflow: "hidden", display: "flex", flexDirection: "column", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", animation: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)" } }, /* @__PURE__ */ React.createElement("style", null, `
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
          }
        `), /* @__PURE__ */ React.createElement("div", { style: { height: 90, background: `url('https://picsum.photos/seed/${person.id}/800/300')`, backgroundSize: "cover", backgroundPosition: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, style: { position: "absolute", top: 16, right: 16, width: 32, height: 32, borderRadius: "50%", background: "rgba(0,0,0,0.5)", border: "none", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }, onMouseOver: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.7)", onMouseOut: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.5)" }, /* @__PURE__ */ React.createElement(X, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 24px 20px", textAlign: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "#fff", padding: 4, margin: "-40px auto 12px", position: "relative", zIndex: 2, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("img", { src: person.avatarUrl || "https://via.placeholder.com/150", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }, alt: "" })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 18, fontWeight: 800, color: "#191919", margin: 0 } }, person.fullName), (() => {
    const iconBadge = person.badges?.find((b) => getBadgeIcon(b) !== null);
    const iconSrc = iconBadge ? getBadgeIcon(iconBadge) : null;
    return iconSrc ? /* @__PURE__ */ React.createElement("img", { src: iconSrc, alt: iconBadge, style: { height: 20, objectFit: "contain", position: "absolute", left: "100%", marginLeft: 6 }, title: iconBadge }) : null;
  })())), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: "#666", fontSize: 12, marginBottom: 10 } }, /* @__PURE__ */ React.createElement(MapPin, { size: 12 }), person.location, " ", /* @__PURE__ */ React.createElement("span", { style: { margin: "0 4px" } }, "\u2022"), " ", /* @__PURE__ */ React.createElement("span", { style: { color: "#2e7d32", fontWeight: 600 } }, "Responds quickly")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 6, marginBottom: 16 } }, person.badges?.filter((b) => getBadgeIcon(b) === null).map((b) => {
    if (b === "Featured") {
      return /* @__PURE__ */ React.createElement("span", { key: b, style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 6, background: "#0057ff", color: "#fff", height: 24, boxSizing: "border-box" } }, /* @__PURE__ */ React.createElement(Star, { size: 12, fill: "#fff", color: "#fff" }), " ", b);
    }
    return /* @__PURE__ */ React.createElement("span", { key: b, style: { display: "flex", alignItems: "center", gap: 4, fontSize: 11, fontWeight: 700, padding: "0 10px", borderRadius: 6, background: "#f5f8ff", color: "#0057ff", height: 24, boxSizing: "border-box" } }, b);
  })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { style: { flex: 1, padding: "8px", borderRadius: 999, background: "#0057ff", color: "#fff", border: "none", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background .2s" }, onMouseOver: (e) => e.currentTarget.style.background = "#0047d4", onMouseOut: (e) => e.currentTarget.style.background = "#0057ff", onClick: () => {
    onClose();
    setPage("portfolio", { portfolioSlug: person.id, openContact: true });
  } }, /* @__PURE__ */ React.createElement(Mail, { size: 14 }), " Send Inquiry"), /* @__PURE__ */ React.createElement("button", { style: { flex: 1, padding: "8px", borderRadius: 999, background: "#fff", color: "#191919", border: "1px solid #e0e0e0", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "background .2s" }, onMouseOver: (e) => e.currentTarget.style.background = "#f5f5f5", onMouseOut: (e) => e.currentTarget.style.background = "#fff", onClick: () => {
    onClose();
    setPage("portfolio", { portfolioSlug: person.id });
  } }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 14 }), " View Profile"))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflowY: "auto", padding: "0 24px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, person.artworks?.map((art, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: () => setPage("detail", { artworkId: art.id || art.Id }), style: { borderRadius: 8, overflow: "hidden", aspectRatio: "4/3", cursor: "pointer", position: "relative", background: "#f0f0f0" }, className: "group" }, /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl || art.CoverImageUrl, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", opacity: 0, transition: "opacity .2s", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "16px 12px" }, className: "hover-overlay", onMouseOver: (e) => e.currentTarget.style.opacity = 1, onMouseOut: (e) => e.currentTarget.style.opacity = 0 }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 8px", color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" } }, art.title || art.Title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, color: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Eye, { size: 12 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 500 } }, (art.viewCount || art.ViewCount) >= 1e3 ? ((art.viewCount || art.ViewCount) / 1e3).toFixed(1) + "k" : art.viewCount || art.ViewCount)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Heart, { size: 12 }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: 500 } }, (art.likeCount || art.LikeCount) >= 1e3 ? ((art.likeCount || art.LikeCount) / 1e3).toFixed(1) + "k" : art.likeCount || art.LikeCount))))))))));
}
function PeopleGrid({ setPage, searchQuery }) {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPerson, setSelectedPerson] = useState(null);
  useEffect(() => {
    fetch("/api/users/people").then((res) => res.json()).then((data) => {
      setPeople(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const mostLikedArtwork = React.useMemo(() => {
    let max = -1;
    let img = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop";
    people.forEach((p) => {
      p.artworks?.forEach((art) => {
        if (art.likeCount > max && art.coverImageUrl) {
          max = art.likeCount;
          img = art.coverImageUrl;
        }
      });
    });
    if (img.includes("behance.net") && img.includes("/404/")) {
      img = img.replace("/404/", "/original/");
    }
    return img;
  }, [people]);
  const filteredPeople = React.useMemo(() => {
    if (!searchQuery || !searchQuery.trim()) return people;
    const q = searchQuery.toLowerCase().trim();
    return people.filter((p) => p.fullName?.toLowerCase().includes(q));
  }, [people, searchQuery]);
  if (loading) return /* @__PURE__ */ React.createElement("div", { style: { padding: 40, textAlign: "center", color: "#666" } }, "\u0110ang t\u1EA3i danh s\xE1ch sinh vi\xEAn...");
  return /* @__PURE__ */ React.createElement("div", { style: { padding: "0 32px 64px", background: "#f9f9f9", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url('${mostLikedArtwork}')`, backgroundSize: "cover", backgroundPosition: "center", borderRadius: 16, padding: "64px 32px", textAlign: "center", color: "#fff", marginBottom: 32, position: "relative", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 36, fontWeight: 800, marginBottom: 12, position: "relative", zIndex: 2 } }, "Looking to Hire a Creator?"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 18, color: "#e0e0e0", position: "relative", zIndex: 2 } }, "Over 10,000 students are available for your next big project.")), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 } }, filteredPeople.map((p) => /* @__PURE__ */ React.createElement("div", { key: p.id, onClick: () => setSelectedPerson(p), style: { background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e0e0e0", transition: "transform 0.2s, box-shadow 0.2s", cursor: "pointer" }, onMouseOver: (e) => {
    e.currentTarget.style.transform = "translateY(-4px)";
    e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.1)";
  }, onMouseOut: (e) => {
    e.currentTarget.style.transform = "none";
    e.currentTarget.style.boxShadow = "none";
  } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 0, background: "#f0f0f0", position: "relative", marginBottom: 32 } }, Array.from({ length: 4 }).map((_, i) => {
    const art = p.artworks?.[i];
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { flex: 1, aspectRatio: "1/1", overflow: "hidden", borderRight: i < 3 ? "2px solid #fff" : "none", background: "#f0f0f0" } }, art ? /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl || art.CoverImageUrl, style: { width: "100%", height: "100%", objectFit: "cover" }, alt: "" }) : null);
  }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: -40, left: "50%", transform: "translateX(-50%)", width: 84, height: 84, borderRadius: "50%", background: "#fff", padding: 4, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", zIndex: 2 } }, /* @__PURE__ */ React.createElement("img", { src: p.avatarUrl || "https://via.placeholder.com/150", style: { width: "100%", height: "100%", borderRadius: "50%", objectFit: "cover" }, alt: "" }))), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 20px 24px", textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", marginBottom: 4 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "inline-flex", alignItems: "center", position: "relative" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 800, color: "#191919", margin: 0 } }, p.fullName))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 4, color: "#777", fontSize: 13, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(MapPin, { size: 14 }), p.location), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", gap: 8, minHeight: 32 } }, p.badges?.filter((b) => b !== "Designer T\u1ED1t nghi\u1EC7p").map((b) => {
    const iconSrc = getBadgeIcon(b);
    const colors = getBadgeColor(b);
    if (!iconSrc) return null;
    return /* @__PURE__ */ React.createElement("div", { key: b, className: "group relative flex items-center justify-center cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: iconSrc, alt: b, style: { height: 24, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.05))" } }), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10",
        style: { background: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: colors.text, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: `1px solid ${colors.text}40` }
      },
      b
    ));
  }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", padding: "0 0 20px", width: "85%", margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: "#191919" } }, p.appreciations >= 1e3 ? (p.appreciations / 1e3).toFixed(1) + "K" : p.appreciations), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#777" } }, "L\u01B0\u1EE3t th\xEDch")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "#e0e0e0", margin: "6px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: "#191919" } }, p.followersCount >= 1e3 ? (p.followersCount / 1e3).toFixed(1) + "K" : p.followersCount), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#777" } }, "Ng\u01B0\u1EDDi theo d\xF5i")), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "#e0e0e0", margin: "6px 0" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, fontWeight: 800, color: "#191919" } }, p.projectViews >= 1e3 ? (p.projectViews / 1e3).toFixed(1) + "K" : p.projectViews), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 12, color: "#777" } }, "L\u01B0\u1EE3t xem"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 24px" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: (e) => {
        e.stopPropagation();
        setPage("portfolio", { portfolioSlug: p.id, openContact: true });
      },
      style: { width: "100%", padding: "10px", borderRadius: 999, border: "1px solid #ccc", background: "#fff", color: "#191919", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "background .2s" },
      onMouseOver: (e) => e.currentTarget.style.background = "#f5f5f5",
      onMouseOut: (e) => e.currentTarget.style.background = "#fff"
    },
    "Message ",
    p.fullName.split(" ")[0]
  ))))), /* @__PURE__ */ React.createElement(ProfileQuickViewModal, { person: selectedPerson, onClose: () => setSelectedPerson(null), setPage }));
}
function GalleryPage({ setPage, setActiveArtworkId, onBookmarkClick, isBookmarked }) {
  const { user: authUser } = useAuth();
  const [filters, setFilters] = useState({ category: "T\u1EA5t c\u1EA3", year: "T\u1EA5t c\u1EA3", tool: "T\u1EA5t c\u1EA3", sort: "newest", q: "", hasBadge: false });
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
      else alert(d || "L\u1ED7i t\xECm ki\u1EBFm");
    } catch (err) {
      alert("L\u1ED7i k\u1EBFt n\u1ED1i");
    }
    setIsVisualSearching(false);
    e.target.value = "";
  };
  const [loading, setLoading] = useState(true);
  const [feedMode, setFeedMode] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [showYearTool, setShowYearTool] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [categoryCovers, setCategoryCovers] = useState({});
  const [toolCovers, setToolCovers] = useState({});
  const [navbarHeight, setNavbarHeight] = useState(0);
  const fetchId = useRef(0);
  const observerTarget = useRef(null);
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setNavbarHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  const UEF_RED = "#DA291C";
  const UEF_BLUE = "#1a4ba8";
  const UEF_WHITE = "#FFFFFF";
  const categories = ["T\u1EA5t c\u1EA3", "Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const years = ["T\u1EA5t c\u1EA3", "2022-2023", "2023-2024", "2024-2025"];
  const toolsList = ["T\u1EA5t c\u1EA3", "Figma", "Illustrator", "Photoshop", "Blender", "Procreate", "After Effects", "InDesign", "Lightroom", "Cinema 4D"];
  useEffect(() => {
    fetch("/api/artworks/category-covers").then((r) => r.json()).then((data2) => {
      if (Array.isArray(data2)) {
        const map = {};
        data2.forEach((item) => {
          map[item.subject] = item.coverImageUrl;
        });
        setCategoryCovers(map);
      } else {
        setCategoryCovers(data2);
      }
    }).catch(() => {
    });
    fetch("/api/artworks/tool-covers").then((r) => r.json()).then((data2) => {
      if (Array.isArray(data2)) {
        const map = {};
        data2.forEach((item) => {
          map[item.tool] = item.coverImageUrl;
        });
        setToolCovers(map);
      } else {
        setToolCovers(data2);
      }
    }).catch(() => {
    });
  }, []);
  const [limit] = useState(15);
  useEffect(() => {
    const id = ++fetchId.current;
    setLoading(true);
    const params = { page: String(page), limit: String(limit), sort: filters.sort };
    if (filters.category !== "T\u1EA5t c\u1EA3") params.category = filters.category;
    if (filters.year !== "T\u1EA5t c\u1EA3") params.year = filters.year;
    if (filters.tool !== "T\u1EA5t c\u1EA3") params.tool = filters.tool;
    if (filters.q.trim()) params.q = filters.q.trim();
    if (filters.hasBadge) params.hasBadge = true;
    const fetchMethod = feedMode && authUser ? api.artworks.feed(params) : api.artworks.list(params);
    fetchMethod.then((res) => {
      if (id === fetchId.current) {
        setData((prev) => ({
          ...res,
          artworks: page === 1 ? res.artworks || [] : [...prev.artworks || [], ...res.artworks || []]
        }));
        setLoading(false);
      }
    }).catch(() => {
      if (id === fetchId.current) setLoading(false);
    });
  }, [filters, page, limit, feedMode, authUser]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && data.page < data.totalPages) {
          setPageNum((p) => p + 1);
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
    setFilters((prev) => ({ ...prev, [key]: val }));
    setPageNum(1);
  };
  const activeFilterCount = [filters.year !== "T\u1EA5t c\u1EA3", filters.tool !== "T\u1EA5t c\u1EA3"].filter(Boolean).length;
  const mapped = (data.artworks || []).map((a) => ({
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
    createdAt: a.createdAt
  }));
  const displayData = visualSearchResults ? visualSearchResults.map((a) => ({
    id: a.id,
    title: a.title,
    student: a.user?.fullName || t("student"),
    img: a.coverImageUrl,
    likes: a.likeCount || 0,
    views: a.viewCount || 0,
    isPublic: true,
    similarityScore: a.similarityScore,
    badges: a.badges || [],
    createdAt: a.createdAt
  })) : mapped;
  const paginate = (p) => setPageNum(Math.max(1, Math.min(p, data.totalPages || 1)));
  const getDisplayBadge = (art) => {
    if (!art.badges || art.badges.length === 0) return null;
    if (filters.category && filters.category !== "T\u1EA5t c\u1EA3") {
      const match = art.badges.find((b) => b.name?.toLowerCase() === filters.category.toLowerCase());
      if (match) return match;
    }
    if (filters.year && filters.year !== "T\u1EA5t c\u1EA3") {
      const yearTag = filters.year.split("-")[1]?.slice(2) || filters.year;
      const match = art.badges.find((b) => b.name?.toLowerCase() === yearTag.toLowerCase());
      if (match) return match;
    }
    if (filters.tool && filters.tool !== "T\u1EA5t c\u1EA3") {
      const match = art.badges.find((b) => b.name?.toLowerCase() === filters.tool.toLowerCase());
      if (match) return match;
    }
    return art.badges[0];
  };
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "sticky", top: navbarHeight, background: "#fff", zIndex: 40, borderBottom: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 32px 0", width: "100%", boxSizing: "border-box" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowYearTool((v) => !v),
      style: { display: "flex", alignItems: "center", gap: 8, padding: "14px 20px", borderRadius: 999, border: `1px solid ${showYearTool || activeFilterCount > 0 ? UEF_BLUE : GRAY_LIGHT}`, background: showYearTool || activeFilterCount > 0 ? `${UEF_BLUE}08` : "#fff", color: UEF_BLUE, fontSize: 15, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap", transition: "all .15s", flexShrink: 0 }
    },
    /* @__PURE__ */ React.createElement(Filter, { size: 18 }),
    /* @__PURE__ */ React.createElement("span", null, t("filter")),
    activeFilterCount > 0 && /* @__PURE__ */ React.createElement("span", { style: { marginLeft: 4, background: UEF_BLUE, color: "#fff", fontSize: 12, fontWeight: 700, width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" } }, activeFilterCount)
  ), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement(Search, { size: 20, style: { position: "absolute", left: 24, color: "#444", pointerEvents: "none", zIndex: 2 } }), /* @__PURE__ */ React.createElement("input", { value: filters.q, onChange: (e) => {
    setFilter("q", e.target.value);
    setVisualSearchResults(null);
  }, placeholder: t("searchArtworkStudentTags"), style: { width: "100%", padding: "14px 120px 14px 56px", borderRadius: 999, border: searchFocused ? `1px solid ${GRAY_LIGHT}` : `1px solid transparent`, fontSize: 16, outline: "none", background: searchFocused ? "#fff" : "#f3f3f4", color: BLACK, boxSizing: "border-box", transition: "all .2s", fontWeight: 400 }, onFocus: () => setSearchFocused(true), onBlur: () => setSearchFocused(false) }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", right: 12, display: "flex", alignItems: "center", gap: 12, height: "100%", top: 0 } }, filters.q && /* @__PURE__ */ React.createElement("button", { onClick: () => setFilter("q", ""), style: { background: "none", border: "none", cursor: "pointer", color: MUTED, padding: 4, display: "flex", marginRight: 8 } }, /* @__PURE__ */ React.createElement(X, { size: 18 })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 20, alignItems: "center", marginRight: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setSearchTab("projects"), style: { background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: searchTab === "projects" ? "#191919" : "#888" } }, "T\xE1c ph\u1EA9m"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSearchTab("people"), style: { background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500, color: searchTab === "people" ? "#191919" : "#888" } }, "Sinh vi\xEAn"), /* @__PURE__ */ React.createElement("div", { style: { width: 1, height: 16, background: "#e0e0e0" } })), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowVisualSearchPopup(!showVisualSearchPopup),
      title: "T\xECm ki\u1EBFm b\u1EB1ng h\xECnh \u1EA3nh (AI Visual Search)",
      style: { background: isVisualSearching || showVisualSearchPopup ? `${UEF_BLUE}20` : "none", border: "none", cursor: "pointer", color: isVisualSearching || showVisualSearchPopup ? UEF_BLUE : "#191919", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "background .2s, color .2s" },
      onMouseOver: (e) => {
        if (!isVisualSearching && !showVisualSearchPopup) e.currentTarget.style.background = "#e4e4e6";
      },
      onMouseOut: (e) => {
        if (!isVisualSearching && !showVisualSearchPopup) e.currentTarget.style.background = "none";
      }
    },
    /* @__PURE__ */ React.createElement(FolderInput, { size: 22, strokeWidth: 1.5 })
  )), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", ref: visualSearchInputRef, style: { display: "none" }, onChange: (e) => {
    setShowVisualSearchPopup(false);
    handleVisualSearch(e);
  } }), showVisualSearchPopup && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", right: 0, marginTop: 8, width: 800, maxWidth: "calc(100vw - 40px)", background: "#fff", borderRadius: 12, boxShadow: "0 4px 20px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)", zIndex: 100, padding: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: "#191919" } }, "Search by Image"), /* @__PURE__ */ React.createElement("span", { style: { background: UEF_BLUE, color: "#fff", fontSize: 10, fontWeight: 800, padding: "2px 6px", borderRadius: 4, letterSpacing: 0.5 } }, "AI")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowVisualSearchPopup(false), style: { background: "none", border: "1px solid #e0e0e0", borderRadius: 4, cursor: "pointer", width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center", color: "#666" }, onMouseOver: (e) => e.currentTarget.style.background = "#f5f5f5", onMouseOut: (e) => e.currentTarget.style.background = "none" }, /* @__PURE__ */ React.createElement(X, { size: 16 }))), /* @__PURE__ */ React.createElement(
    "div",
    {
      onClick: () => visualSearchInputRef.current?.click(),
      onDragOver: (e) => {
        e.preventDefault();
        e.stopPropagation();
      },
      onDrop: (e) => {
        e.preventDefault();
        e.stopPropagation();
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
      },
      style: { background: "#f8faff", border: "1px dashed #c0d0f0", borderRadius: 8, padding: "60px 20px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "background .2s" },
      onMouseOver: (e) => e.currentTarget.style.background = "#f0f4ff",
      onMouseOut: (e) => e.currentTarget.style.background = "#f8faff"
    },
    isVisualSearching ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-4 border-t-[#1a4ba8] border-r-[#1a4ba8] border-b-[#e0e0e0] border-l-[#e0e0e0] rounded-full animate-spin" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 600, color: "#191919" } }, "\u0110ang ph\xE2n t\xEDch h\xECnh \u1EA3nh...")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: 700, color: "#191919", marginBottom: 12 } }, "Drag and drop an image here"), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#666", marginBottom: 24 } }, "File types supported: JPG, PNG, GIF, TIFF, WebP. Max size 10MB"), /* @__PURE__ */ React.createElement("button", { style: { background: "#fff", border: "1px solid #d0d0d0", borderRadius: 999, padding: "8px 24px", fontSize: 14, fontWeight: 600, color: "#191919", cursor: "pointer" } }, "Choose Image"))
  ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexShrink: 0 } }, authUser && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFeedMode(!feedMode);
    setPageNum(1);
  }, style: { padding: "10px 18px", borderRadius: 999, border: `1px solid ${feedMode ? UEF_BLUE : GRAY_LIGHT}`, background: feedMode ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: feedMode ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s", marginRight: 8, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Users, { size: 16 }), " ", /* @__PURE__ */ React.createElement("span", null, "\u0110ang theo d\xF5i")), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilter("sort", "newest"), style: { padding: "10px 18px", borderRadius: 999, border: `1px solid ${filters.sort === "newest" ? UEF_BLUE : GRAY_LIGHT}`, background: filters.sort === "newest" ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: filters.sort === "newest" ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" } }, t("newest")), /* @__PURE__ */ React.createElement("button", { onClick: () => setFilter("sort", "most_likes"), style: { padding: "10px 18px", borderRadius: 999, border: `1px solid ${filters.sort === "most_likes" ? UEF_BLUE : GRAY_LIGHT}`, background: filters.sort === "most_likes" ? UEF_BLUE : "#fff", fontSize: 14, cursor: "pointer", color: filters.sort === "most_likes" ? "#fff" : BLACK, fontWeight: 600, whiteSpace: "nowrap", transition: "all .15s" } }, t("mostLiked")))), showYearTool && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", msOverflowStyle: "none" } }, years.map((y) => {
    const isActive = filters.year === y;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: y,
        onClick: () => setFilter("year", y),
        style: {
          padding: "6px 16px",
          borderRadius: 20,
          border: `1px solid ${isActive ? UEF_BLUE : GRAY_LIGHT}`,
          background: isActive ? UEF_BLUE : "#fff",
          color: isActive ? "#fff" : MUTED,
          fontSize: 12,
          fontWeight: isActive ? 600 : 500,
          cursor: "pointer",
          whiteSpace: "nowrap",
          transition: "all .2s"
        }
      },
      y === "T\u1EA5t c\u1EA3" ? `${t("schoolYear")}: ${t("all")}` : y
    );
  })), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setFilter("hasBadge", !filters.hasBadge),
      style: {
        padding: "6px 16px",
        borderRadius: 20,
        border: `1px solid ${filters.hasBadge ? UEF_BLUE : GRAY_LIGHT}`,
        background: filters.hasBadge ? `${UEF_BLUE}15` : "#fff",
        color: filters.hasBadge ? UEF_BLUE : MUTED,
        fontSize: 12,
        fontWeight: filters.hasBadge ? 600 : 500,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "all .2s",
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    },
    filters.hasBadge && /* @__PURE__ */ React.createElement(Check, { size: 14 }),
    "Ch\u1EC9 hi\u1EC7n b\xE0i c\xF3 Huy hi\u1EC7u"
  ), activeFilterCount > 0 && /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setFilter("year", "T\u1EA5t c\u1EA3");
    setFilter("tool", "T\u1EA5t c\u1EA3");
    setFilter("hasBadge", false);
  }, style: { padding: "8px 16px", borderRadius: 999, border: `1px solid ${UEF_RED}40`, background: `${UEF_RED}08`, color: UEF_RED, fontSize: 13, cursor: "pointer", fontWeight: 600, transition: "all .2s" }, className: "hover:bg-[#ffebee]" }, t("reset"))), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", marginBottom: 8, display: "flex", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        const el = document.getElementById("main-filters-scroll");
        if (el) el.scrollBy({ left: -400, behavior: "smooth" });
      },
      style: { position: "absolute", left: -18, zIndex: 10, background: "white", border: `1px solid ${GRAY_LIGHT}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
    },
    /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20, color: BLACK })
  ), /* @__PURE__ */ React.createElement("div", { id: "main-filters-scroll", className: "gallery-cat-scroll", style: { display: "flex", gap: 12, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", msOverflowStyle: "none", flex: 1, padding: "0 24px", scrollBehavior: "smooth" } }, /* @__PURE__ */ React.createElement("style", null, `#main-filters-scroll::-webkit-scrollbar { display: none; }`), categories.map((cat) => {
    const coverUrl = cat !== "T\u1EA5t c\u1EA3" ? categoryCovers[cat] : null;
    const isActive = filters.category === cat;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: cat,
        onClick: () => setFilter("category", cat),
        style: {
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
          justifyContent: "center"
        }
      },
      coverUrl && !isActive && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { src: coverUrl, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" } })),
      /* @__PURE__ */ React.createElement("span", { style: { position: "relative", zIndex: 1, textShadow: coverUrl && !isActive ? "0 1px 4px rgba(0,0,0,0.9)" : "none" } }, cat)
    );
  }), /* @__PURE__ */ React.createElement("div", { style: { width: 1, background: "#ccc", margin: "0 8px", alignSelf: "stretch", flexShrink: 0, opacity: 0.5 } }), toolsList.map((toolItem) => {
    const coverUrl = toolItem !== "T\u1EA5t c\u1EA3" ? toolCovers[toolItem] : null;
    const isActive = filters.tool === toolItem;
    return /* @__PURE__ */ React.createElement(
      "button",
      {
        key: toolItem,
        onClick: () => setFilter("tool", toolItem),
        style: {
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
          justifyContent: "center"
        }
      },
      coverUrl && !isActive && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { src: coverUrl, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.7 } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" } })),
      /* @__PURE__ */ React.createElement("span", { style: { position: "relative", zIndex: 1, textShadow: coverUrl && !isActive ? "0 1px 4px rgba(0,0,0,0.9)" : "none" } }, toolItem === "T\u1EA5t c\u1EA3" ? "T\u1EA5t c\u1EA3 Ph\u1EA7n m\u1EC1m" : toolItem)
    );
  })), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        const el = document.getElementById("main-filters-scroll");
        if (el) el.scrollBy({ left: 400, behavior: "smooth" });
      },
      style: { position: "absolute", right: -18, zIndex: 10, background: "white", border: `1px solid ${GRAY_LIGHT}`, borderRadius: "50%", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }
    },
    /* @__PURE__ */ React.createElement(ChevronRight, { size: 20, color: BLACK })
  )))), searchTab === "people" ? /* @__PURE__ */ React.createElement(PeopleGrid, { setPage, searchQuery: filters.q }) : /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 32px 64px", width: "100%", boxSizing: "border-box" } }, loading && page === 1 ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : displayData.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "60px 0", color: MUTED, fontSize: 14 } }, t("noArtworksFound")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 20 } }, displayData.map((art) => {
    const displayBadge = getDisplayBadge(art);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: art.id,
        onClick: () => setPage("detail", { artworkId: art.id }),
        style: { cursor: "pointer", transition: "transform .15s", transform: hoveredId === art.id ? "translateY(-2px)" : "none", minWidth: 0 },
        onMouseEnter: () => setHoveredId(art.id),
        onMouseLeave: () => setHoveredId(null)
      },
      /* @__PURE__ */ React.createElement("div", { style: { position: "relative", borderRadius: 4, overflow: "hidden", background: GRAY_BG, transition: "filter .2s", filter: hoveredId === art.id ? "brightness(0.85)" : "none" } }, art.img ? /* @__PURE__ */ React.createElement("img", { src: art.img, alt: art.title, style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: MUTED, fontSize: 12 } }, t("noImage")), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8, display: "flex", flexDirection: "column", gap: 4, zIndex: 2 } }, !art.isPublic && /* @__PURE__ */ React.createElement("div", { style: { background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Lock, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 11, fontWeight: 600 } }, t("private"))), art.isAiVerified && /* @__PURE__ */ React.createElement("div", { style: { background: "linear-gradient(to right, #1a4ba8, #0ea5e9)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" } }, "AI VERIFIED")), art.similarityScore && /* @__PURE__ */ React.createElement("div", { style: { background: "#4caf50", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement(ImageIcon, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" } }, "GI\u1ED0NG ", art.similarityScore, "%"))), displayBadge && /* @__PURE__ */ React.createElement("div", { className: "group", style: { position: "absolute", top: 0, left: 16, zIndex: 10 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 32, height: 44, background: displayBadge.colorCode || "#B49A65", color: displayBadge.textColor || "#fff", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)", display: "flex", justifyContent: "center", paddingTop: 8, fontWeight: "bold", fontSize: 13, cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.3)" } }, getBadgeShortName(displayBadge.name)), /* @__PURE__ */ React.createElement("div", { className: "absolute top-full mt-1 left-0 bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none", style: { borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", border: "1px solid #E0E0E0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 4, textTransform: "uppercase" } }, "FEATURED IN ", art.subject?.toUpperCase() || art.category?.toUpperCase() || "ARTWORK"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", color: displayBadge.textColor || "#0057ff" } }, displayBadge.name, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "#888", fontWeight: "normal", fontSize: 12, marginLeft: 4 } }, "\u2014 ", new Date(displayBadge.assignedAt || art.createdAt).toLocaleDateString("en-GB"))))), onBookmarkClick && hoveredId === art.id && /* @__PURE__ */ React.createElement(
        "button",
        {
          onClick: (e) => {
            e.stopPropagation();
            onBookmarkClick(art);
          },
          style: { position: "absolute", top: 8, right: 8, width: 32, height: 32, borderRadius: 8, border: "none", background: isBookmarked && isBookmarked(art.id) ? "rgba(26,75,168,0.9)" : "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", zIndex: 3, transition: "all .15s" }
        },
        /* @__PURE__ */ React.createElement(Bookmark, { size: 14, color: "#fff", fill: isBookmarked && isBookmarked(art.id) ? "#fff" : "none" })
      ), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)", padding: "24px 12px 10px", opacity: hoveredId === art.id ? 1 : 0, transition: "opacity .2s", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, color: "#fff", fontWeight: 600, fontSize: 13, lineHeight: 1.3, textShadow: "0 1px 3px rgba(0,0,0,0.4)" } }, art.title))),
      /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, art.title),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: MUTED, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 } }, art.student), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Eye, { size: 13, color: "#999" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED } }, art.views), /* @__PURE__ */ React.createElement(Heart, { size: 12, color: "#ccc" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED } }, art.likes)))
    );
  }), loading && page > 1 && Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ React.createElement("div", { key: `skeleton-${i}`, style: { width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", aspectRatio: "4/3", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 8, height: 16, width: "80%", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" } }), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 4, height: 12, width: "50%", background: "#e0e0e0", borderRadius: 4, animation: "pulse 1.5s infinite" } })))), data.page < data.totalPages && /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: observerTarget,
      style: { height: 20 }
    }
  ))));
}
function PortfolioPage({ setPage, pageParams, onBookmarkClick, isBookmarked }) {
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
  const [selectedMoodboard, setSelectedMoodboard] = useState(null);
  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  const [userBadges, setUserBadges] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categories = [t("allArtworks"), "Poster", "Branding", "UI/UX", "Illustration"];
  const handleDeleteDraft = (e, draftId) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this draft?")) {
      const updated = drafts.filter((d) => d.id !== draftId);
      setDrafts(updated);
      localStorage.setItem("uef_drafts", JSON.stringify(updated));
    }
  };
  useEffect(() => {
    try {
      const saved = localStorage.getItem("uef_drafts");
      if (saved) setDrafts(JSON.parse(saved));
    } catch (e) {
    }
  }, []);
  const hashSlug = (window.location.hash.match(/^#\/portfolio\/(.+)/) || [])[1] || "";
  const slug = pageParams?.portfolioSlug || hashSlug;
  const titleByYear = { "N\u0103m 1": t("freshmanDesigner"), "N\u0103m 2": t("internDesigner"), "N\u0103m 3": t("professionalDesigner"), "N\u0103m 4": t("seniorDesigner"), "T\u1ED1t nghi\u1EC7p": t("graduateDesigner") };
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
      statsFn.catch(() => ({}))
    ]).then(([pData, pStats]) => {
      if (pData) {
        pData.stats = { ...pData.stats || {}, ...pStats };
        if (pData.artworks) {
          const mergedArtworks = [...window.MOCK_PROJECTS || [], ...pData.artworks];
          setPortfolioArtworks(mergedArtworks);
        }
        setPortfolioData(pData);
        const pSet = pData.portfolioSettings || pData.settings || {};
        let pm = pSet.publicMoodboards;
        if (typeof pm === "string") {
          try {
            pm = JSON.parse(pm);
          } catch (e) {
            pm = [];
          }
        }
        setPublicMoodboards(Array.isArray(pm) ? pm : []);
        const uId = pData.user?.id || pData.id;
        if (uId) {
          api.collections.getByUser(uId).then((res) => {
            setPortfolioMoodboards(Array.isArray(res) ? res : []);
          }).catch(() => {
          });
          fetch(`http://127.0.0.1:5000/api/accountbadges/user/${uId}`).then((res) => res.json()).then((data) => {
            if (Array.isArray(data)) setUserBadges(data);
          }).catch(() => {
          });
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
    api.portfolios.mine().then((data) => {
      setPortfolioSettingsData(data);
    }).catch(() => {
    });
  }, [slug]);
  if (loading) return /* @__PURE__ */ React.createElement(GlobalLoading, null);
  if (!portfolioData) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, minHeight: "100vh", background: "#f8f8f8" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 28, color: CRIMSON })), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 18, fontWeight: 700, color: BLACK, margin: 0 } }, t("portfolioNotFound")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: MUTED, margin: 0, maxWidth: 400, textAlign: "center" } }, "User n\xE0y ch\u01B0a setup portfolio, h\xE3y quay l\u1EA1i sau."), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage && setPage("gallery"), style: { background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToGallery")));
  }
  const { stats, featuredArtworks, privateGrade } = portfolioData;
  const pUser = portfolioData.user || portfolioData;
  const toggleFollow = async () => {
    if (!authUser) {
      alert(t("loginWithEmailToUse") || "Vui l\xF2ng \u0111\u0103ng nh\u1EADp \u0111\u1EC3 s\u1EED d\u1EE5ng t\xEDnh n\u0103ng n\xE0y.");
      return;
    }
    if (!slug || !pUser?.id || authUser.id === pUser.id) return;
    try {
      if (isFollowing) {
        await api.users.unfollow(pUser.id);
        setIsFollowing(false);
        setFollowersCount((prev) => prev - 1);
      } else {
        await api.users.follow(pUser.id);
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    } catch (e) {
      console.error(e);
      alert(t("pleaseTryAgain") || "Vui l\xF2ng th\u1EED l\u1EA1i");
    }
  };
  const openFollowModal = async (type) => {
    if (!pUser?.id) return;
    setModalType(type);
    try {
      const data = type === "followers" ? await api.users.followers(pUser.id) : await api.users.following(pUser.id);
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
    email: pUser?.email || ""
  };
  const socialLinksRaw = typeof pSettings?.socialLinks === "string" ? function() {
    try {
      return JSON.parse(pSettings.socialLinks);
    } catch (e) {
      return {};
    }
  }() : pSettings?.socialLinks || {};
  const socialLinks = [
    socialLinksRaw.behance && { label: "Behance", href: socialLinksRaw.behance, icon: "globe" },
    socialLinksRaw.linkedin && { label: "LinkedIn", href: socialLinksRaw.linkedin, icon: "link" },
    profile.email && pSettings?.showEmail && { label: t("email"), href: `mailto:${profile.email}`, icon: "mail" }
  ].filter(Boolean);
  const rawFeaturedIds = pSettings?.featuredArtworkIds;
  const safeFeaturedIds = Array.isArray(rawFeaturedIds) ? rawFeaturedIds : typeof rawFeaturedIds === "string" ? function() {
    try {
      return JSON.parse(rawFeaturedIds);
    } catch (e) {
      return [];
    }
  }() : [];
  const explicitFeaturedArtworks = safeFeaturedIds.map((id) => (portfolioArtworks || []).find((a) => a.id === id)).filter(Boolean);
  const highlightWorks = (portfolioArtworks || []).filter((a) => a.isHighlighted).slice(0, 2);
  const topLikedWorks = (portfolioArtworks || []).filter((a) => !a.isHighlighted).sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 2);
  const extraWorks = highlightWorks.length >= 2 ? highlightWorks : [...highlightWorks, ...topLikedWorks].slice(0, 2);
  const allFeatured = portfolioArtworks && portfolioArtworks.length > 0 ? [...explicitFeaturedArtworks, ...extraWorks.filter((ex) => !explicitFeaturedArtworks.some((f) => f.id === ex.id))] : [];
  const featuredWorks = allFeatured.slice(0, 10).map((a, i) => {
    let settings = {};
    if (a.settingsData) {
      try {
        settings = typeof a.settingsData === "string" ? JSON.parse(a.settingsData) : a.settingsData;
      } catch (e) {
      }
    }
    return {
      id: a.id,
      title: a.title,
      img: a.coverImageUrl || a.img,
      tools: a.toolsUsed || [a.tool, a.category].filter(Boolean),
      tags: a.tags || [a.category].filter(Boolean),
      student: a.user?.fullName || a.student || profile.fullName,
      views: a.viewCount || a.likes || 0,
      likes: a.likeCount || a.likes || 0,
      isPublic: a.isPublic !== false,
      projectStatus: settings?.projectStatus || "Draft"
    };
  });
  const allPortfolioWorks = portfolioArtworks && portfolioArtworks.length > 0 ? portfolioArtworks.map((a) => {
    let settings = {};
    if (a.settingsData) {
      try {
        settings = typeof a.settingsData === "string" ? JSON.parse(a.settingsData) : a.settingsData;
      } catch (e) {
      }
    }
    return {
      id: a.id,
      title: a.title,
      img: a.coverImageUrl || a.img,
      tools: a.toolsUsed || [],
      tags: a.tags || [],
      student: a.user?.fullName || a.student || profile.fullName,
      views: a.viewCount || 0,
      likes: a.likeCount || 0,
      isPublic: a.isPublic !== false,
      projectStatus: settings?.projectStatus || "Draft"
    };
  }) : [];
  const handleContactSubmit = async () => {
    if (!contactName || !contactEmail || !contactContent) return;
    setContactState("loading");
    try {
      const targetSlug = slug || (portfolioSettingsData?.portfolioSlug || "");
      await api.portfolios.sendContact(targetSlug, {
        senderName: contactName,
        senderEmail: contactEmail,
        purpose: contactPurpose,
        content: contactContent
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
            socialLinks: typeof pSettings?.socialLinks === "string" ? pSettings.socialLinks : JSON.stringify(pSettings?.socialLinks || {}),
            featuredArtworkIds: pSettings?.featuredArtworkIds,
            bannerUrl: dataUrl
          };
          await api.portfolios.updateMine(payload);
          setPortfolioSettingsData((prev) => ({ ...prev || {}, bannerUrl: dataUrl }));
          if (portfolioData) {
            const upd = { ...portfolioData };
            if (upd.portfolioSettings) upd.portfolioSettings.bannerUrl = dataUrl;
            else if (upd.settings) upd.settings.bannerUrl = dataUrl;
            setPortfolioData(upd);
          }
        } catch (err) {
          alert("L\u1ED7i upload banner: " + err.message);
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
          alert("L\u1ED7i upload avatar: " + err.message);
        } finally {
          setIsUploadingAvatar(false);
        }
      }
    };
    reader.readAsDataURL(file);
  };
  const bannerUrl = portfolioSettingsData?.bannerUrl || pSettings?.bannerUrl || "";
  const isOwner = authUser && authUser.id === pUser?.id;
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen relative bg-fixed bg-cover bg-center", style: { backgroundImage: "url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop')" } }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-[#f8f8f8]/85 backdrop-blur-sm z-0 pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 pb-20" }, /* @__PURE__ */ React.createElement("style", null, `
        .bento-grid {
          display: grid;
          grid-template-columns: repeat(12, minmax(0, 1fr));
          grid-auto-rows: 26px;
          gap: 20px;
        }
        @media (max-width: 640px) {
          .bento-grid { grid-auto-rows: 24px; gap: 16px; }
        }
      `), /* @__PURE__ */ React.createElement("div", { className: "w-full relative bg-[#1a4ba8]/5 group", style: { height: "220px" } }, bannerUrl ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("img", { src: bannerUrl, alt: "Banner", className: "w-full h-full object-cover" }), isOwner && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer z-10",
      onClick: () => document.getElementById("bannerUpload")?.click()
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-white font-medium bg-black/50 px-4 py-2 rounded-lg" }, /* @__PURE__ */ React.createElement(Image, { size: 20 }), /* @__PURE__ */ React.createElement("span", null, "Thay \u0111\u1ED5i \u1EA3nh b\xECa"))
  )) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-[#1a4ba8]/10 to-[#1a4ba8]/20 border-b border-[#E0E0E0]" }, isOwner && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-2 cursor-pointer opacity-70 hover:opacity-100 transition-opacity text-[#1a4ba8]", onClick: () => document.getElementById("bannerUpload")?.click() }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { size: 36 }), /* @__PURE__ */ React.createElement("span", { className: "font-semibold text-lg" }, "Th\xEAm \u1EA3nh b\xECa"), /* @__PURE__ */ React.createElement("span", { className: "text-sm" }, "K\xEDch th\u01B0\u1EDBc t\u1ED1i \u01B0u 3200 x 410px"))), /* @__PURE__ */ React.createElement("input", { type: "file", id: "bannerUpload", accept: "image/*", style: { display: "none" }, onChange: handleBannerUpload }), isUploadingBanner && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-white/50 flex items-center justify-center z-20" }, /* @__PURE__ */ React.createElement("div", { className: "px-4 py-2 bg-black/80 text-white rounded-lg text-sm font-semibold" }, "\u0110ang t\u1EA3i l\xEAn..."))), /* @__PURE__ */ React.createElement("main", { className: "w-full max-w-[1366px] mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col lg:flex-row gap-8 lg:gap-12" }, /* @__PURE__ */ React.createElement("div", { className: "w-full lg:w-[280px] xl:w-[320px] flex-shrink-0 -mt-14 relative z-20" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-start text-left" }, /* @__PURE__ */ React.createElement("div", { className: "relative w-[110px] h-[110px] rounded-full border-[4px] border-white shadow-sm bg-[#F8F8F8] mb-3 group overflow-hidden" }, /* @__PURE__ */ React.createElement("img", { src: profile.avatarUrl, alt: profile.fullName, className: "w-full h-full object-cover" }), isOwner && /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer",
      onClick: () => document.getElementById("avatarUpload")?.click(),
      title: "Thay \u0111\u1ED5i \u1EA3nh \u0111\u1EA1i di\u1EC7n"
    },
    /* @__PURE__ */ React.createElement(Image, { size: 24, className: "text-white" })
  ), isUploadingAvatar && /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-white/70 flex items-center justify-center" }, /* @__PURE__ */ React.createElement("div", { className: "animate-spin rounded-full h-6 w-6 border-b-2 border-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("input", { type: "file", id: "avatarUpload", accept: "image/*", style: { display: "none" }, onChange: handleAvatarUpload }), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-2 mb-1" }, /* @__PURE__ */ React.createElement("h1", { className: "text-[22px] font-bold text-[#212121] tracking-tight" }, profile.fullName), Array.from(new Set(userBadges.map((b) => b.name))).filter((b) => b && b !== "Designer T\u1ED1t nghi\u1EC7p").map((b, idx) => {
    const iconSrc = getBadgeIcon(b);
    const colors = getBadgeColor(b);
    if (!iconSrc) return null;
    return /* @__PURE__ */ React.createElement("div", { key: idx, className: "group relative flex items-center justify-center cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: iconSrc, alt: b, style: { height: 24, objectFit: "contain", filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.05))" } }), /* @__PURE__ */ React.createElement(
      "div",
      {
        className: "absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10",
        style: { background: "#fff", padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 700, color: colors.text, boxShadow: "0 4px 12px rgba(0,0,0,0.1)", border: `1px solid ${colors.text}40` }
      },
      b
    ));
  })), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-[#666666] font-medium mb-3" }, profile.profileHeadline, " \u2022 ", portfolioSettingsData?.portfolioSettings?.major || portfolioSettingsData?.major || pSettings?.major || t("graphicDesign"), " \u2022 UEF"), profile.bio && /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-[#444444] leading-relaxed mb-6" }, profile.bio)), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3 mb-6 w-full mt-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      className: "w-full px-5 py-2.5 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors",
      onClick: () => setIsContactModalOpen(true)
    },
    t("contact")
  ), slug && authUser?.id !== pUser?.id && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: toggleFollow,
      className: `w-full px-5 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${isFollowing ? "border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] hover:bg-[#EAEAEA]" : "border-[#1a4ba8] text-[#1a4ba8] bg-blue-50 hover:bg-blue-100"}`
    },
    isFollowing ? "B\u1ECF theo d\xF5i" : "Theo d\xF5i"
  )), socialLinks.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 mb-6 w-full" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold tracking-widest uppercase text-[#666666] mb-2" }, "Socials"), socialLinks.map((l) => {
    const iconMap = {
      globe: /* @__PURE__ */ React.createElement(Globe, { size: 16, className: "text-[#666666]" }),
      link: /* @__PURE__ */ React.createElement(Link, { size: 16, className: "text-[#666666]" }),
      mail: /* @__PURE__ */ React.createElement(Mail, { size: 16, className: "text-[#666666]" })
    };
    return /* @__PURE__ */ React.createElement(
      "a",
      {
        key: l.label,
        href: l.href,
        target: l.href.startsWith("http") ? "_blank" : void 0,
        rel: l.href.startsWith("http") ? "noreferrer" : void 0,
        className: "flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-black/5 text-[#212121] text-sm font-medium transition-colors"
      },
      iconMap[l.icon],
      /* @__PURE__ */ React.createElement("span", null, l.label)
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "pt-5 border-t border-[#E0E0E0] w-full text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold tracking-widest uppercase text-[#666666] mb-4" }, "Stats"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, [
    { label: t("artworks"), val: stats?.totalArtworks || 0 },
    { label: t("views"), val: stats?.totalViews?.toLocaleString() || "0" },
    { label: t("likes"), val: stats?.totalLikes?.toLocaleString() || "0" },
    { label: "Ng\u01B0\u1EDDi theo d\xF5i", val: followersCount?.toLocaleString() || "0", isClickable: true },
    { label: "\u0110ang theo d\xF5i", val: stats?.following?.toLocaleString() || "0", isClickable: true }
  ].map((s) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: s.label,
      className: "flex justify-between items-center",
      onClick: () => {
        if (s.label === "Ng\u01B0\u1EDDi theo d\xF5i") openFollowModal("followers");
        if (s.label === "\u0110ang theo d\xF5i") openFollowModal("following");
      },
      style: { cursor: s.isClickable ? "pointer" : "default" }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#666666]" }, s.label),
    /* @__PURE__ */ React.createElement("span", { className: "text-[14px] font-bold text-[#212121]" }, s.val)
  ))))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 w-full pt-8 pb-12" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#E0E0E0] mb-8 gap-4 sm:gap-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-6 overflow-x-auto scrollbar-hide" }, /* @__PURE__ */ React.createElement("button", { className: `pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === "featured" ? "border-[#212121] text-[#212121]" : "border-transparent text-[#666666] hover:text-[#212121]"}`, onClick: () => setActiveTab("featured") }, "T\xE1c ph\u1EA9m xu\u1EA5t s\u1EAFc"), /* @__PURE__ */ React.createElement("button", { className: `pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === "work" ? "border-[#212121] text-[#212121]" : "border-transparent text-[#666666] hover:text-[#212121]"}`, onClick: () => setActiveTab("work") }, "Danh s\xE1ch \u1EA5n ph\u1EA9m"), /* @__PURE__ */ React.createElement("button", { className: `pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === "moodboard" ? "border-[#212121] text-[#212121]" : "border-transparent text-[#666666] hover:text-[#212121]"}`, onClick: () => setActiveTab("moodboard") }, "Moodboards"), /* @__PURE__ */ React.createElement("button", { className: `pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === "timeline" ? "border-[#212121] text-[#212121]" : "border-transparent text-[#666666] hover:text-[#212121]"}`, onClick: () => setActiveTab("timeline") }, "Timeline"), isOwner && /* @__PURE__ */ React.createElement("button", { className: `pb-3 border-b-2 font-semibold text-[15px] whitespace-nowrap ${activeTab === "drafts" ? "border-[#212121] text-[#212121]" : "border-transparent text-[#666666] hover:text-[#212121]"}`, onClick: () => setActiveTab("drafts") }, "Drafts")), activeTab === "work" && /* @__PURE__ */ React.createElement("div", { className: "relative z-10 w-[180px] mb-2" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "flex items-center justify-between w-full px-4 py-2 bg-white border border-[#E0E0E0] rounded-xl cursor-pointer hover:border-[#1a4ba8] transition-colors",
      onClick: () => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-[#212121]" }, activeCategory),
    /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, className: `text-[#666] transition-transform duration-200 ${isCategoryDropdownOpen ? "rotate-180" : ""}` })
  ), isCategoryDropdownOpen && /* @__PURE__ */ React.createElement("div", { className: "absolute top-full left-0 w-full mt-2 bg-white border border-[#E0E0E0] rounded-xl shadow-lg py-2 overflow-hidden z-20" }, categories.map((cat) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: cat,
      className: `px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${activeCategory === cat ? "bg-[#1a4ba8]/10 text-[#1a4ba8] font-semibold" : "text-[#666666] hover:bg-[#F8F9FA] hover:text-[#212121]"}`,
      onClick: () => {
        setActiveCategory(cat);
        setIsCategoryDropdownOpen(false);
      }
    },
    cat
  ))))), /* @__PURE__ */ React.createElement("div", { className: "min-h-[400px]" }, activeTab === "featured" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 } }, featuredWorks.length > 0 ? featuredWorks.map((art) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: art.id,
      onClick: () => setPage && setPage("detail", { artworkId: art.id }),
      style: { cursor: "pointer", transition: "transform .15s", minWidth: 0 },
      onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
      onMouseLeave: (e) => e.currentTarget.style.transform = "none"
    },
    /* @__PURE__ */ React.createElement("div", { style: { position: "relative", borderRadius: 4, overflow: "hidden", background: "#EAEAEA" } }, art.img ? /* @__PURE__ */ React.createElement("img", { src: art.img, alt: art.title, style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 12 } }, t("noImage")), !art.isPublic && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2 } }, /* @__PURE__ */ React.createElement(Lock, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 11, fontWeight: 600 } }, t("private"))), art.projectStatus === "Approved" && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8, background: "linear-gradient(90deg, #1a4ba8, #2b64ff)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }, title: "Academic Verified" }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.2px", textTransform: "uppercase" } }, "Verified"))),
    /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: "#212121", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, art.title),
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 } }, art.student), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Eye, { size: 13, color: "#999" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#666" } }, art.views), /* @__PURE__ */ React.createElement(Heart, { size: 12, color: "#ccc" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#666" } }, art.likes)))
  )) : /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1", padding: "40px 0", textAlign: "center", color: "#999", fontSize: 14 } }, "Ch\u01B0a c\xF3 \u0111\u1ED3 \xE1n n\u1ED5i b\u1EADt n\xE0o.")), activeTab === "work" && /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 20 } }, (() => {
    const filtered = allPortfolioWorks.filter((art) => {
      if (activeCategory === t("allArtworks")) return true;
      const c = activeCategory.toLowerCase();
      return (art.tools || []).some((t2) => typeof t2 === "string" && t2.toLowerCase().includes(c)) || (art.tags || []).some((t2) => typeof t2 === "string" && t2.toLowerCase().includes(c));
    });
    if (filtered.length === 0) {
      return /* @__PURE__ */ React.createElement("div", { style: { gridColumn: "1 / -1", padding: "60px 0", textAlign: "center", color: "#999", fontSize: 14 } }, t("noArtworks"));
    }
    return filtered.map((art) => /* @__PURE__ */ React.createElement(
      "div",
      {
        key: art.id,
        onClick: () => setPage && setPage("detail", { artworkId: art.id }),
        style: { cursor: "pointer", transition: "transform .15s" },
        onMouseEnter: (e) => e.currentTarget.style.transform = "translateY(-2px)",
        onMouseLeave: (e) => e.currentTarget.style.transform = "none"
      },
      /* @__PURE__ */ React.createElement("div", { style: { position: "relative", borderRadius: 4, overflow: "hidden", background: "#EAEAEA" } }, art.img ? /* @__PURE__ */ React.createElement("img", { src: art.img, alt: art.title, style: { width: "100%", height: "auto", aspectRatio: "4/3", objectFit: "cover", display: "block" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 12 } }, t("noImage")), !art.isPublic && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8, background: "rgba(0,0,0,0.65)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2 } }, /* @__PURE__ */ React.createElement(Lock, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 11, fontWeight: 600 } }, t("private"))), art.projectStatus === "Approved" && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, right: 8, background: "linear-gradient(90deg, #1a4ba8, #2b64ff)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, zIndex: 2, boxShadow: "0 2px 4px rgba(0,0,0,0.2)" }, title: "Academic Verified" }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.2px", textTransform: "uppercase" } }, "Verified"))),
      /* @__PURE__ */ React.createElement("p", { style: { margin: "8px 0 2px", fontSize: 14, fontWeight: 600, color: "#212121", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, art.title),
      /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#666", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 } }, art.student), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4, flexShrink: 0 } }, /* @__PURE__ */ React.createElement(Eye, { size: 13, color: "#999" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#666" } }, art.views), /* @__PURE__ */ React.createElement(Heart, { size: 12, color: "#ccc" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#666" } }, art.likes)))
    ));
  })()), activeTab === "moodboard" && (() => {
    const visibleMoodboards = portfolioMoodboards.filter((col) => isOwner || publicMoodboards.includes(col.name));
    return visibleMoodboards.length > 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 24 } }, visibleMoodboards.map((col) => /* @__PURE__ */ React.createElement("div", { key: col.id, onClick: () => setSelectedMoodboard(col), className: "relative rounded-sm overflow-hidden shadow-sm hover:shadow-md transition-shadow aspect-[4/3] group cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 grid grid-cols-2 grid-rows-2 gap-0 bg-[#222]" }, col.items.length > 0 ? col.items.slice(0, 4).map((it, idx) => /* @__PURE__ */ React.createElement("div", { key: it.id, className: `overflow-hidden bg-[#EAEAEA] ${idx === 0 && col.items.length === 1 ? "col-span-2 row-span-2" : ""} ${idx === 0 && col.items.length === 3 ? "col-span-2" : ""}` }, it.artwork?.coverImageUrl ? /* @__PURE__ */ React.createElement("img", { src: it.artwork.coverImageUrl, className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" }) : null)) : /* @__PURE__ */ React.createElement("div", { className: "col-span-2 row-span-2 flex items-center justify-center bg-[#EAEAEA] text-[#999] text-sm" }, "Tr\u1ED1ng")), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent opacity-90 group-hover:opacity-100 transition-opacity" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 p-5 w-full flex justify-between items-start" }, /* @__PURE__ */ React.createElement("div", { className: "overflow-hidden mr-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-white text-xl mb-1 leading-tight truncate" }, col.name), /* @__PURE__ */ React.createElement("p", { className: "text-[14px] text-white/90 truncate" }, portfolioData?.user?.fullName || portfolioData?.fullName || "Sinh vi\xEAn")), isOwner && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: async (e) => {
          e.stopPropagation();
          e.preventDefault();
          const isPub = publicMoodboards.includes(col.name);
          const newArr = isPub ? publicMoodboards.filter((n) => n !== col.name) : [...publicMoodboards, col.name];
          setPublicMoodboards(newArr);
          try {
            await api.portfolios.updateMine({ publicMoodboards: newArr });
          } catch {
            alert("L\u1ED7i khi c\u1EADp nh\u1EADt quy\u1EC1n truy c\u1EADp!");
            setPublicMoodboards(publicMoodboards);
          }
        },
        className: "shrink-0 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/40 transition-colors border-none cursor-pointer",
        title: publicMoodboards.includes(col.name) ? "C\xF4ng khai" : "Ri\xEAng t\u01B0"
      },
      publicMoodboards.includes(col.name) ? /* @__PURE__ */ React.createElement(Globe, { size: 14 }) : /* @__PURE__ */ React.createElement(Lock, { size: 14 })
    ))))) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm" }, /* @__PURE__ */ React.createElement("img", { src: "https://a5.behance.net/4da700b0d3a5edb4c1fc74d4a3b77ab4671427cc/img/profile/empty-states/no-moodboards.svg?cb=264615658", alt: "No moodboard", className: "w-48 opacity-70 mb-4" }), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#212121] mb-2" }, "Ch\u01B0a c\xF3 Moodboard n\xE0o"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666]" }, "Sinh vi\xEAn n\xE0y ch\u01B0a t\u1EA1o b\u1EA5t k\u1EF3 Moodboard n\xE0o \u0111\u1EC3 chia s\u1EBB ngu\u1ED3n c\u1EA3m h\u1EE9ng."));
  })(), activeTab === "drafts" && isOwner && /* @__PURE__ */ React.createElement("div", { className: "w-full" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6" }, drafts.map((draft) => {
    const diffMs = Date.now() - new Date(draft.updatedAt).getTime();
    const diffHrs = Math.floor(diffMs / (1e3 * 60 * 60));
    const diffDays = Math.floor(diffHrs / 24);
    const timeStr = diffDays > 0 ? `${diffDays} days ago` : diffHrs > 0 ? `${diffHrs} hours ago` : "just now";
    return /* @__PURE__ */ React.createElement("div", { key: draft.id, className: "group relative aspect-[4/3] rounded-sm overflow-hidden bg-[#222222] border border-[#E0E0E0] cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: draft.coverImageUrl, className: "w-full h-full object-cover group-hover:opacity-40 transition-opacity duration-300" }), /* @__PURE__ */ React.createElement(ProjectStatusIcon, { status: draft.settingsData?.projectStatus || draft.status || "Draft" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-6 z-10 backdrop-blur-[2px]" }, /* @__PURE__ */ React.createElement("button", { className: "w-full max-w-[160px] py-2 bg-[#1a4ba8] text-white rounded-full font-semibold text-[13px] mb-2 hover:bg-blue-700 transition shadow-lg", onClick: () => {
      setCurrentDraftId(draft.id);
      setIsDraftBuilderOpen(true);
    } }, "Edit Project"), /* @__PURE__ */ React.createElement("button", { className: "w-full max-w-[160px] py-2 bg-white/90 text-gray-800 rounded-full font-semibold text-[13px] mb-4 hover:bg-white transition shadow-lg", onClick: (e) => {
      e.stopPropagation();
      handleDeleteDraft(e, draft.id);
    } }, "Delete Project"), /* @__PURE__ */ React.createElement("p", { className: "text-white/80 font-medium text-[12px]" }, "Last modified ", timeStr), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-5 right-5 flex items-center justify-between text-white/90 text-[12px] font-medium" }, /* @__PURE__ */ React.createElement("span", { className: "truncate max-w-[100px]" }, authUser?.fullName || authUser?.name || "Author"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 12, className: "fill-white/80" }), " 0"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Eye, { size: 12, className: "fill-white/80" }), " 0")))));
  }), /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "group relative aspect-[4/3] border-2 border-dashed border-[#d1d5db] rounded-xl flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#f9fafb] to-white hover:border-[#1a4ba8] hover:shadow-xl hover:shadow-[#1a4ba8]/10 transition-all duration-300 cursor-pointer overflow-hidden p-6",
      onClick: () => {
        setCurrentDraftId(null);
        setIsDraftBuilderOpen(true);
      }
    },
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-[#1a4ba8]/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300" }),
    /* @__PURE__ */ React.createElement("div", { className: "w-20 h-20 bg-white rounded-full flex items-center justify-center mb-5 shadow-lg shadow-gray-200/50 group-hover:scale-110 group-hover:shadow-blue-200/50 transition-all duration-500 relative z-10 border border-gray-100" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-gradient-to-br from-[#1a4ba8] to-[#0d2e6e] rounded-full flex items-center justify-center text-white shadow-inner transform group-hover:rotate-90 transition-transform duration-500" }, /* @__PURE__ */ React.createElement(Plus, { size: 22, strokeWidth: 3 }))),
    /* @__PURE__ */ React.createElement("h3", { className: "text-[18px] font-extrabold text-gray-800 mb-2 group-hover:text-[#1a4ba8] transition-colors relative z-10" }, "Create a Project"),
    /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 text-[14px] font-medium max-w-[80%] relative z-10 group-hover:text-gray-600 transition-colors" }, "Build and share your next masterpiece. Unpublished drafts are saved here.")
  ))), /* @__PURE__ */ React.createElement(
    DraftBuilderModal,
    {
      isOpen: isDraftBuilderOpen,
      initialBlocks: currentDraftId ? drafts.find((d) => d.id === currentDraftId)?.blocks : [],
      initialSettingsData: currentDraftId ? drafts.find((d) => d.id === currentDraftId)?.settingsData || { title: drafts.find((d) => d.id === currentDraftId)?.title, coverImage: drafts.find((d) => d.id === currentDraftId)?.coverImageUrl } : null,
      onClose: () => setIsDraftBuilderOpen(false),
      onSave: async (blocks, settingsData, isAutoSave = false) => {
        if (!isAutoSave) setIsDraftBuilderOpen(false);
        let autoCover = settingsData?.coverImage || "";
        if (!autoCover && blocks && blocks.length > 0) {
          const firstImg = blocks.find((b) => b.type === "image" && b.content);
          if (firstImg) autoCover = firstImg.content;
        }
        if (!autoCover) autoCover = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
        const newDraft = {
          id: currentDraftId || Date.now(),
          title: settingsData?.title || "Untitled Draft",
          coverImageUrl: autoCover,
          blocks,
          settingsData,
          updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
          isDraft: true
        };
        try {
          if (currentDraftId) {
            await api.artworks.update(currentDraftId, {
              title: newDraft.title,
              coverImageUrl: newDraft.coverImageUrl,
              blocksJson: JSON.stringify(newDraft.blocks),
              settingsData: typeof newDraft.settingsData === "string" ? newDraft.settingsData : JSON.stringify(newDraft.settingsData),
              status: "draft"
            });
          } else {
            await api.artworks.create({
              title: newDraft.title,
              coverImageUrl: newDraft.coverImageUrl,
              description: "Draft",
              blocksJson: JSON.stringify(newDraft.blocks),
              settingsData: typeof newDraft.settingsData === "string" ? newDraft.settingsData : JSON.stringify(newDraft.settingsData),
              status: "draft"
            });
          }
        } catch (e) {
          console.log("Mock BE fallback for draft");
        }
        const updated = currentDraftId ? drafts.map((d) => d.id === currentDraftId ? newDraft : d) : [newDraft, ...drafts];
        setDrafts(updated);
        try {
          localStorage.setItem("uef_drafts", JSON.stringify(updated));
        } catch (e) {
          console.error("Local storage quota exceeded for draft.");
        }
        if (!isAutoSave) alert("\u0110\xE3 l\u01B0u b\u1EA3n nh\xE1p th\xE0nh c\xF4ng!");
      },
      currentUser: authUser,
      onPublish: (blocks, settingsData, capturedImageUrl) => {
        setIsDraftBuilderOpen(false);
        setPage("upload", { draftId: currentDraftId, draftBlocks: blocks, draftSettings: settingsData || {}, draftCapturedImage: capturedImageUrl });
      }
    }
  ), activeTab === "timeline" && /* @__PURE__ */ React.createElement(TimelineSection, { entries: portfolioData?.timelineEntries, slug: slug || "", isOwner, setPage })), privateGrade && /* @__PURE__ */ React.createElement("div", { className: "mt-10 bg-[#F8F8F8] border border-[#E0E0E0] rounded-xl p-5 flex gap-4 items-start" }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#212121] rounded-md px-2 py-1 flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Lock, { size: 12, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { className: "text-white text-xs font-bold" }, t("privateUppercase"))), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-[#212121]" }, t("lecturerFeedback")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#666666]" }, t("totalScore")), /* @__PURE__ */ React.createElement("span", { className: "text-xl font-bold text-[#1a4ba8]" }, privateGrade.score), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#666666]" }, "/10"))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#444444] leading-relaxed m-0" }, privateGrade.comment)))))), isContactModalOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 border-b border-[#E0E0E0] flex justify-between items-center bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#212121]" }, t("sendContactMessage")), /* @__PURE__ */ React.createElement("button", { onClick: closeContactModal, className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), contactState === "success" ? /* @__PURE__ */ React.createElement("div", { className: "p-8 flex flex-col items-center justify-center text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#e0eaff] rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(Check, { size: 32, className: "text-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("h4", { className: "text-xl font-bold text-[#212121] mb-2" }, t("sentSuccessfully")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-6" }, t("messageSentTo"), profile.fullName, "."), /* @__PURE__ */ React.createElement("button", { onClick: closeContactModal, className: "w-full py-2.5 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-semibold text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer" }, t("close"))) : /* @__PURE__ */ React.createElement("div", { className: "p-6 flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5" }, t("fullNameOrOrg")), /* @__PURE__ */ React.createElement("input", { value: contactName, onChange: (e) => setContactName(e.target.value), type: "text", placeholder: t("enterYourName"), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5" }, t("contactEmail")), /* @__PURE__ */ React.createElement("input", { value: contactEmail, onChange: (e) => setContactEmail(e.target.value), type: "email", placeholder: "email@company.com", className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5" }, t("purpose")), /* @__PURE__ */ React.createElement("select", { value: contactPurpose, onChange: (e) => setContactPurpose(e.target.value), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white cursor-pointer" }, /* @__PURE__ */ React.createElement("option", { value: t("recruitmentInternship") }, t("recruitmentInternship")), /* @__PURE__ */ React.createElement("option", { value: t("freelanceCollaboration") }, t("freelanceCollaboration")), /* @__PURE__ */ React.createElement("option", { value: t("other") }, t("other")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5" }, t("content")), /* @__PURE__ */ React.createElement("textarea", { value: contactContent, onChange: (e) => setContactContent(e.target.value), placeholder: t("enterMessageContent"), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] min-h-[100px] resize-y" })), /* @__PURE__ */ React.createElement("button", { onClick: handleContactSubmit, disabled: contactState === "loading", className: `mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex justify-center items-center gap-2 ${contactState === "loading" ? "bg-[#666666] cursor-wait" : "bg-[#1a4ba8] hover:opacity-90 cursor-pointer"}` }, contactState === "loading" ? t("sending") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { size: 16 }), " ", t("sendMessage")))))), modalType && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl p-6 w-full max-w-md h-[480px] flex flex-col shadow-2xl" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-[#212121]" }, modalType === "followers" ? "Ng\u01B0\u1EDDi theo d\xF5i" : "\u0110ang theo d\xF5i"), /* @__PURE__ */ React.createElement("button", { onClick: () => setModalType(null), className: "p-2 hover:bg-gray-100 rounded-full" }, /* @__PURE__ */ React.createElement(X, { size: 20, color: "#666" }))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto pr-1 flex flex-col gap-2" }, modalUsers.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-center text-gray-500 py-8" }, "Ch\u01B0a c\xF3 ai") : modalUsers.map((u) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: u.id,
      className: "flex items-center gap-3 p-3 hover:bg-[#F8F8F8] rounded-xl cursor-pointer transition-colors border border-transparent hover:border-[#EAEAEA]",
      onClick: () => {
        setModalType(null);
        setPage && setPage("portfolio", { portfolioSlug: u.id });
      }
    },
    /* @__PURE__ */ React.createElement(
      "img",
      {
        src: u.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.fullName || "User") + "&background=random",
        className: "w-12 h-12 rounded-full object-cover border border-[#E0E0E0]"
      }
    ),
    /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-[15px] text-[#212121] leading-tight" }, u.fullName), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mt-0.5" }, u.major || "Th\xE0nh vi\xEAn"))
  ))))), selectedMoodboard && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/80 z-[9999] flex flex-col pt-10 px-4 md:px-12 pb-12 overflow-y-auto", onClick: () => setSelectedMoodboard(null) }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl w-full mx-auto relative bg-white rounded-xl shadow-2xl flex flex-col", style: { minHeight: "80vh" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center p-6 border-b border-[#EAEAEA]" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121]" }, selectedMoodboard.name), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] mt-1" }, selectedMoodboard.items.length, " t\xE1c ph\u1EA9m")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, authUser && !isOwner && selectedMoodboard.items.length > 0 && /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: async () => {
        try {
          const itemIds = selectedMoodboard.items.map((it) => it.artworkId);
          await api.collections.saveMultiple(itemIds, [selectedMoodboard.name + " (Copy)"]);
          alert("\u0110\xE3 sao ch\xE9p to\xE0n b\u1ED9 Moodboard v\xE0o t\xE0i kho\u1EA3n c\u1EE7a b\u1EA1n!");
        } catch (e) {
          alert("L\u1ED7i khi sao ch\xE9p: " + e.message);
        }
      },
      className: "flex items-center gap-2 px-4 py-2 bg-[#1a4ba8] text-white rounded-full hover:bg-blue-700 transition-colors font-medium"
    },
    /* @__PURE__ */ React.createElement(Save, { size: 16 }),
    " L\u01B0u to\xE0n b\u1ED9 Moodboard"
  ), /* @__PURE__ */ React.createElement("button", { className: "w-10 h-10 flex items-center justify-center rounded-full hover:bg-[#F5F5F5] transition", onClick: () => setSelectedMoodboard(null) }, /* @__PURE__ */ React.createElement(X, { size: 24, color: "#333" })))), /* @__PURE__ */ React.createElement("div", { className: "p-6 flex-1 overflow-y-auto bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 } }, selectedMoodboard.items.map((it) => {
    const art = it.artwork;
    if (!art) return null;
    return /* @__PURE__ */ React.createElement("div", { key: art.id, className: "relative group rounded-md overflow-hidden bg-[#EAEAEA] aspect-[4/3] shadow-sm hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl, className: "w-full h-full object-cover cursor-pointer", onClick: () => {
      setSelectedMoodboard(null);
      setPage && setPage("detail", { artworkId: art.id });
    } }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col justify-between p-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-end" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "pointer-events-auto bg-black/60 hover:bg-black/80 text-white rounded-full w-9 h-9 flex items-center justify-center backdrop-blur-md transition-colors",
        onClick: (e) => {
          e.stopPropagation();
          onBookmarkClick && onBookmarkClick(art);
        },
        title: "L\u01B0u v\xE0o Moodboard c\u1EE7a b\u1EA1n"
      },
      /* @__PURE__ */ React.createElement(Bookmark, { size: 18, fill: isBookmarked && isBookmarked(art.id) ? "white" : "none" })
    )), /* @__PURE__ */ React.createElement("div", { className: "pointer-events-auto bg-black/60 text-white p-2 rounded backdrop-blur-sm cursor-pointer", onClick: () => {
      setSelectedMoodboard(null);
      setPage && setPage("detail", { artworkId: art.id });
    } }, /* @__PURE__ */ React.createElement("p", { className: "font-semibold text-sm truncate" }, art.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs opacity-80 truncate" }, art.authorFullName))));
  })), selectedMoodboard.items.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "h-full flex flex-col items-center justify-center py-20 text-[#999]" }, /* @__PURE__ */ React.createElement(FolderInput, { size: 48, className: "mb-4 opacity-50" }), /* @__PURE__ */ React.createElement("p", null, "Moodboard n\xE0y ch\u01B0a c\xF3 t\xE1c ph\u1EA9m n\xE0o.")))))));
}
function ToggleSwitch({ isOn, onToggle, disabled = false }) {
  return /* @__PURE__ */ React.createElement("div", { onClick: disabled ? void 0 : onToggle, style: { width: 38, height: 20, borderRadius: 10, background: disabled ? "#e5e7eb" : isOn ? CERULEAN : GRAY_LIGHT, cursor: disabled ? "not-allowed" : "pointer", position: "relative", transition: "background .2s", flexShrink: 0, opacity: disabled ? 0.6 : 1 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: 16, borderRadius: "50%", background: disabled ? "#f9fafb" : "#fff", position: "absolute", top: 2, left: isOn ? 20 : 2, transition: "left .2s", boxShadow: disabled ? "none" : "0 2px 4px rgba(0,0,0,0.1)" } }));
}
function DashboardSidebar({ activePage, setPage, userData }) {
  let items = [];
  if (userData?.role === "student") {
    items = [
      { icon: /* @__PURE__ */ React.createElement(Image, { size: 18 }), label: t("myArtworks"), page: "dashboard" },
      { icon: /* @__PURE__ */ React.createElement(Bookmark, { size: 18 }), label: "Moodboard", page: "moodboards" },
      { icon: /* @__PURE__ */ React.createElement(MessageSquare, { size: 18 }), label: t("inbox"), page: "messages" },
      { icon: /* @__PURE__ */ React.createElement(User, { size: 18 }), label: t("accountSettings"), page: "settings" },
      { icon: /* @__PURE__ */ React.createElement(Briefcase, { size: 18 }), label: t("portfolioSettings"), page: "portfolio_settings" }
    ];
  } else if (userData?.role === "lecturer") {
    items = [
      { icon: /* @__PURE__ */ React.createElement(MessageSquare, { size: 18 }), label: t("inbox"), page: "messages" },
      { icon: /* @__PURE__ */ React.createElement(Bookmark, { size: 18 }), label: "Moodboard", page: "moodboards" },
      { icon: /* @__PURE__ */ React.createElement(User, { size: 18 }), label: t("accountSettings"), page: "settings" }
    ];
  } else if (userData?.role === "admin") {
    items = [
      { icon: /* @__PURE__ */ React.createElement(User, { size: 18 }), label: t("accountSettings"), page: "settings" }
    ];
  } else {
    items = [
      { icon: /* @__PURE__ */ React.createElement(MessageSquare, { size: 18 }), label: t("inbox"), page: "messages" },
      { icon: /* @__PURE__ */ React.createElement(Bookmark, { size: 18 }), label: "Moodboard", page: "moodboards" },
      { icon: /* @__PURE__ */ React.createElement(User, { size: 18 }), label: t("accountSettings"), page: "settings" }
    ];
  }
  const roleLabel = { student: t("student"), lecturer: t("lecturer"), admin: t("admin") };
  const profileName = userData?.fullName || userData?.name || roleLabel[userData?.role] || t("student");
  const profileAvatar = userData?.avatarUrl || userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";
  const studentYear = roleLabel[userData?.role] || t("student");
  return /* @__PURE__ */ React.createElement("div", { style: { width: 220, background: "#fff", borderRight: `1px solid ${GRAY_LIGHT}`, padding: "28px 0", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 20px", borderBottom: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("img", { src: profileAvatar, alt: "", style: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", background: GRAY_BG } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600, margin: 0, color: BLACK } }, profileName), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, margin: 0 } }, studentYear)))), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px 0" } }, items.map((item) => {
    const isActive = activePage === item.page;
    return /* @__PURE__ */ React.createElement("div", { key: item.page, onClick: () => setPage(item.page), style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 20px", cursor: "pointer", background: isActive ? "#eef4ff" : "transparent", borderRight: isActive ? `3px solid ${CERULEAN}` : "3px solid transparent" } }, /* @__PURE__ */ React.createElement("span", { style: { color: isActive ? CERULEAN : MUTED, display: "flex" } }, item.icon), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: isActive ? 600 : 400, color: isActive ? CERULEAN : BLACK } }, item.label));
  })));
}
function MoodboardSortableCard({ item, onClick, onMove, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.8 : 1
  };
  return /* @__PURE__ */ React.createElement("div", { ref: setNodeRef, style: { ...style, position: "relative", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "grab" }, ...attributes, ...listeners }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { onClick, src: item.artwork?.coverImageUrl || "https://placehold.co/400x300/1a4ba8/ffffff?text=UEF+Design", style: { width: "100%", height: 180, objectFit: "cover", display: "block" } }), item.artwork?.isAiVerified && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8, background: "linear-gradient(to right, #1a4ba8, #0ea5e9)", borderRadius: 4, padding: "3px 7px", display: "flex", alignItems: "center", gap: 4, boxShadow: "0 2px 5px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 10, color: "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.5px" } }, "AI VERIFIED"))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", cursor: "grab" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 14, fontWeight: 600, color: BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, title: item.artwork?.title }, item.artwork?.title || "Artwork"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 12, color: MUTED } }, new Date(item.createdAt || Date.now()).toLocaleDateString()), item.artwork?.likeCount > 0 && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED, display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Heart, { size: 12 }), " ", item.artwork.likeCount)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onPointerDown: (e) => {
    e.stopPropagation();
  }, onClick: onMove, style: { background: GRAY_BG, border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", color: CERULEAN }, title: "Di chuy\u1EC3n" }, /* @__PURE__ */ React.createElement(FolderInput, { size: 14 })), /* @__PURE__ */ React.createElement("button", { onPointerDown: (e) => {
    e.stopPropagation();
  }, onClick: onRemove, style: { background: "#FEF2F2", border: "none", borderRadius: 4, padding: "4px", cursor: "pointer", color: CRIMSON }, title: "X\xF3a kh\u1ECFi Moodboard" }, /* @__PURE__ */ React.createElement(Trash2, { size: 14 }))))));
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
  const [searchArtworkQuery, setSearchArtworkQuery] = useState("");
  const [sortBy, setSortBy] = useState("custom");
  const [colLimit] = useState(16);
  const [colPage, setColPage] = useState(1);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id && activeCollection) {
      const oldIndex = activeCollection.items.findIndex((it) => it.id === active.id);
      const newIndex = activeCollection.items.findIndex((it) => it.id === over.id);
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
    } catch {
    }
  };
  useEffect(() => {
    Promise.all([
      refreshCollections(),
      api.portfolios.mine().then((res) => {
        setPublicMoodboards(res?.publicMoodboards || []);
      }).catch(() => {
      })
    ]).finally(() => setLoading(false));
  }, []);
  const handleTogglePublic = async (colName, e) => {
    e?.stopPropagation();
    const isPublic = publicMoodboards.includes(colName);
    const newArr = isPublic ? publicMoodboards.filter((n) => n !== colName) : [...publicMoodboards, colName];
    setPublicMoodboards(newArr);
    try {
      await api.portfolios.updateMine({ publicMoodboards: newArr });
    } catch {
      alert("L\u1ED7i khi c\u1EADp nh\u1EADt quy\u1EC1n truy c\u1EADp!");
      setPublicMoodboards(publicMoodboards);
    }
  };
  const handleCreate = async () => {
    if (!newColName.trim()) return;
    try {
      await api.collections.create({ collectionName: newColName });
      setNewColName("");
      setIsCreating(false);
      await refreshCollections();
    } catch {
      alert("L\u1ED7i khi t\u1EA1o Moodboard");
    }
  };
  const handleDeleteCollection = async (id, e) => {
    e?.stopPropagation();
    if (!confirm("B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a Moodboard n\xE0y?")) return;
    try {
      await api.collections.delete(id);
      if (activeCollection?.id === id) setActiveCollection(null);
      await refreshCollections();
    } catch {
      alert("L\u1ED7i khi x\xF3a Moodboard");
    }
  };
  const handleRenameCollection = async (id, e) => {
    e?.stopPropagation();
    if (!editColName.trim()) return;
    try {
      await api.collections.update(id, { name: editColName });
      setEditingColId(null);
      await refreshCollections();
      if (activeCollection?.id === id) setActiveCollection((prev) => ({ ...prev, name: editColName }));
    } catch {
      alert("L\u1ED7i khi \u0111\u1ED5i t\xEAn Moodboard");
    }
  };
  const handleRemoveItem = async (colId, artworkId, e) => {
    e.stopPropagation();
    if (!confirm("X\xF3a t\xE1c ph\u1EA9m kh\u1ECFi Moodboard?")) return;
    try {
      await api.collections.removeItem(colId, artworkId);
      await refreshCollections();
      if (activeCollection?.id === colId) setActiveCollection((prev) => ({ ...prev, items: prev.items.filter((it) => it.artworkId !== artworkId) }));
    } catch {
      alert("L\u1ED7i khi x\xF3a");
    }
  };
  const handleMoveItem = async (toColId) => {
    if (!moveState) return;
    try {
      await api.collections.addItem(toColId, { artworkId: moveState.artworkId });
      await api.collections.removeItem(moveState.fromColId, moveState.artworkId);
      setMoveState(null);
      await refreshCollections();
      if (activeCollection?.id === moveState.fromColId) {
        setActiveCollection((prev) => ({ ...prev, items: prev.items.filter((it) => it.artworkId !== moveState.artworkId) }));
      }
    } catch {
      alert("L\u1ED7i khi di chuy\u1EC3n");
    }
  };
  const filteredCollections = collections.filter((c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG } }, /* @__PURE__ */ React.createElement(DashboardSidebar, { activePage: "moodboards", setPage, userData }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "32px 40px", overflow: "auto" } }, loading ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : activeCollection ? /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveCollection(null), style: { background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, color: MUTED, fontSize: 14, fontWeight: 600 } }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20 }), " Quay l\u1EA1i"), editingColId === activeCollection.id ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("input", { autoFocus: true, value: editColName, onChange: (e) => setEditColName(e.target.value), style: { padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}` }, onKeyDown: (e) => e.key === "Enter" && handleRenameCollection(activeCollection.id) }), /* @__PURE__ */ React.createElement("button", { onClick: () => handleRenameCollection(activeCollection.id), style: { background: CERULEAN, color: "#fff", border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" } }, "L\u01B0u"), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditingColId(null), style: { background: GRAY_LIGHT, border: "none", borderRadius: 6, padding: "0 12px", cursor: "pointer" } }, "H\u1EE7y")) : /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, margin: 0, color: CERULEAN, display: "flex", alignItems: "center", gap: 12 } }, activeCollection.name, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setEditingColId(activeCollection.id);
    setEditColName(activeCollection.name);
  }, style: { background: "transparent", border: "none", cursor: "pointer", color: MUTED } }, /* @__PURE__ */ React.createElement(Edit2, { size: 16 }))), /* @__PURE__ */ React.createElement("span", { style: { background: "#eef4ff", color: CERULEAN, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: "bold" } }, activeCollection.items?.length || 0, " t\xE1c ph\u1EA9m"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1, marginRight: 24 } }, /* @__PURE__ */ React.createElement(Search, { size: 16, style: { position: "absolute", left: 16, top: 12, color: MUTED } }), /* @__PURE__ */ React.createElement("input", { placeholder: "T\xECm t\xE1c ph\u1EA9m...", value: searchArtworkQuery, onChange: (e) => setSearchArtworkQuery(e.target.value), style: { width: "100%", padding: "10px 16px 10px 44px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 15 } })), /* @__PURE__ */ React.createElement("select", { value: sortBy, onChange: (e) => setSortBy(e.target.value), style: { padding: "10px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 15 } }, /* @__PURE__ */ React.createElement("option", { value: "custom" }, "T\xF9y ch\u1EC9nh (K\xE9o th\u1EA3)"), /* @__PURE__ */ React.createElement("option", { value: "newest" }, "M\u1EDBi nh\u1EA5t"), /* @__PURE__ */ React.createElement("option", { value: "oldest" }, "C\u0169 nh\u1EA5t"), /* @__PURE__ */ React.createElement("option", { value: "az" }, "T\xEAn A-Z"), /* @__PURE__ */ React.createElement("option", { value: "za" }, "T\xEAn Z-A"), /* @__PURE__ */ React.createElement("option", { value: "likes" }, "Nhi\u1EC1u Like nh\u1EA5t"))), activeCollection.items?.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", padding: "60px", color: MUTED, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("p", null, "Ch\u01B0a c\xF3 t\xE1c ph\u1EA9m n\xE0o trong Moodboard n\xE0y.")) : (() => {
    let filteredItems = (activeCollection.items || []).filter(
      (item) => (item.artwork?.title || "").toLowerCase().includes(searchArtworkQuery.toLowerCase())
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
    if (filteredItems.length === 0) return /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", padding: 40, color: MUTED, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` } }, "Kh\xF4ng t\xECm th\u1EA5y t\xE1c ph\u1EA9m n\xE0o.");
    const displayedItems = filteredItems.slice(0, colPage * colLimit);
    return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd }, /* @__PURE__ */ React.createElement(SortableContext, { items: displayedItems.map((i) => i.id), strategy: rectSortingStrategy }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 20 } }, displayedItems.map((item) => /* @__PURE__ */ React.createElement(MoodboardSortableCard, { key: item.id, item, onClick: () => setPage("detail", { artworkId: item.artworkId }), onMove: (e) => {
      e.stopPropagation();
      setMoveState({ artworkId: item.artworkId, fromColId: activeCollection.id });
    }, onRemove: (e) => handleRemoveItem(activeCollection.id, item.artworkId, e), style: { minWidth: 0 } }))))), colPage * colLimit < filteredItems.length && /* @__PURE__ */ React.createElement(
      "div",
      {
        ref: (el) => {
          if (!el) return;
          const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) setColPage((p) => p + 1);
          }, { threshold: 0.1 });
          observer.observe(el);
          return () => observer.disconnect();
        },
        style: { height: 20 }
      }
    ));
  })()) : /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, margin: 0, color: BLACK } }, "Moodboard"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(Search, { size: 16, style: { position: "absolute", left: 12, top: 10, color: MUTED } }), /* @__PURE__ */ React.createElement("input", { placeholder: "T\xECm ki\u1EBFm Moodboard...", value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), style: { padding: "8px 12px 8px 36px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, width: 250 } })), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsCreating(true), style: { background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "0 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold" } }, /* @__PURE__ */ React.createElement(Plus, { size: 18 }), " T\u1EA1o m\u1EDBi"))), isCreating && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: "16px 20px", borderRadius: 12, border: `1px solid ${CERULEAN}`, marginBottom: 24, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(FolderPlus, { size: 20, color: CERULEAN }), /* @__PURE__ */ React.createElement("input", { autoFocus: true, placeholder: "T\xEAn Moodboard m\u1EDBi", value: newColName, onChange: (e) => setNewColName(e.target.value), onKeyDown: (e) => e.key === "Enter" && handleCreate(), style: { flex: 1, border: "none", outline: "none", fontSize: 16 } }), /* @__PURE__ */ React.createElement("button", { onClick: handleCreate, style: { background: CERULEAN, color: "#fff", border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: "bold" } }, "T\u1EA1o"), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsCreating(false), style: { background: GRAY_LIGHT, color: BLACK, border: "none", borderRadius: 6, padding: "8px 16px", cursor: "pointer", fontWeight: "bold" } }, "H\u1EE7y")), filteredCollections.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", color: MUTED, background: "#fff", borderRadius: 16, border: `1px dashed ${MUTED}`, margin: "0 auto", maxWidth: 600 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: "#f0f4ff", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement(Bookmark, { size: 40, color: CERULEAN, strokeWidth: 1.5 })), /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 8px 0", fontSize: 18, color: BLACK, fontWeight: 700 } }, "Ch\u01B0a c\xF3 Moodboard n\xE0o"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 24px 0", fontSize: 14, textAlign: "center", maxWidth: 400 } }, "H\xE3y kh\xE1m ph\xE1 c\xE1c t\xE1c ph\u1EA9m tr\xEAn h\u1EC7 th\u1ED1ng v\xE0 l\u01B0u l\u1EA1i nh\u1EEFng \xFD t\u01B0\u1EDFng tuy\u1EC7t v\u1EDDi nh\u1EA5t v\xE0o Moodboard c\u1EE7a ri\xEAng b\u1EA1n."), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { background: CERULEAN, color: "#fff", border: "none", padding: "12px 28px", borderRadius: 30, cursor: "pointer", fontWeight: "bold", fontSize: 15, display: "flex", alignItems: "center", gap: 8, transition: "0.2s", boxShadow: "0 4px 12px rgba(0,87,255,0.2)" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.05)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, "Kh\xE1m ph\xE1 Gallery")) : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24 } }, filteredCollections.map((col) => {
    const coverImage = col.items?.[0]?.artwork?.coverImageUrl || "https://placehold.co/600x400/eeeeee/cccccc?text=Tr\u1ED1ng";
    return /* @__PURE__ */ React.createElement("div", { key: col.id, onClick: () => setActiveCollection(col), style: { background: "#fff", borderRadius: 16, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", position: "relative" }, onMouseEnter: (e) => {
      e.currentTarget.style.transform = "translateY(-6px)";
      e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.08)";
    }, onMouseLeave: (e) => {
      e.currentTarget.style.transform = "none";
      e.currentTarget.style.boxShadow = "none";
    } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", height: 200 } }, /* @__PURE__ */ React.createElement("img", { src: coverImage, style: { width: "100%", height: "100%", objectFit: "cover", display: "block" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 12, right: 12, display: "flex", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => handleTogglePublic(col.name, e), style: { background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", cursor: "pointer" }, title: publicMoodboards.includes(col.name) ? "C\xF4ng khai" : "Ri\xEAng t\u01B0" }, publicMoodboards.includes(col.name) ? /* @__PURE__ */ React.createElement(Globe, { size: 14 }) : /* @__PURE__ */ React.createElement(Lock, { size: 14 })), /* @__PURE__ */ React.createElement("button", { onClick: (e) => handleDeleteCollection(col.id, e), style: { background: "rgba(255,255,255,0.2)", backdropFilter: "blur(4px)", border: "none", borderRadius: "50%", width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", color: "#ffcccc", cursor: "pointer" }, title: "X\xF3a" }, /* @__PURE__ */ React.createElement(Trash2, { size: 14 }))), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 16, left: 16, right: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-end", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 18, fontWeight: 700, color: "#fff", textShadow: "0 2px 4px rgba(0,0,0,0.5)" } }, col.name), /* @__PURE__ */ React.createElement("p", { style: { margin: "4px 0 0 0", fontSize: 13, color: "rgba(255,255,255,0.8)" } }, "C\u1EADp nh\u1EADt: ", new Date(col.updatedAt || Date.now()).toLocaleDateString())), /* @__PURE__ */ React.createElement("span", { style: { background: "rgba(255,255,255,0.3)", backdropFilter: "blur(4px)", padding: "4px 10px", borderRadius: 20, color: "#fff", fontSize: 12, fontWeight: "bold" } }, col.items?.length || 0, " m\u1EE5c"))));
  })))), moveState && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1e4 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, width: 400, padding: 24, boxShadow: "0 24px 48px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 16px 0", fontSize: 18, fontWeight: 700, color: BLACK } }, "Di chuy\u1EC3n t\xE1c ph\u1EA9m"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 16px 0", fontSize: 14, color: MUTED } }, "Ch\u1ECDn Moodboard \u0111\xEDch:"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, maxHeight: 300, overflowY: "auto", marginBottom: 24 } }, collections.filter((c) => c.id !== moveState.fromColId).map((c) => /* @__PURE__ */ React.createElement("button", { key: c.id, onClick: () => handleMoveItem(c.id), style: { display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "transparent", cursor: "pointer", textAlign: "left", transition: "0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = GRAY_BG, onMouseLeave: (e) => e.currentTarget.style.background = "transparent" }, /* @__PURE__ */ React.createElement(Folder, { size: 18, color: CERULEAN }), /* @__PURE__ */ React.createElement("span", { style: { flex: 1, fontSize: 14, fontWeight: 600, color: BLACK } }, c.name), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED } }, c.items?.length || 0, " m\u1EE5c"))), collections.length <= 1 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, textAlign: "center", padding: "16px 0" } }, "B\u1EA1n kh\xF4ng c\xF3 Moodboard n\xE0o kh\xE1c.")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setMoveState(null), style: { background: GRAY_LIGHT, border: "none", borderRadius: 8, padding: "10px 20px", fontWeight: "bold", cursor: "pointer" } }, "H\u1EE7y b\u1ECF")))));
}
function BadgesPage({ setPage, userData }) {
  const [activeTab, setActiveTab] = useState("artwork");
  const [badges, setBadges] = useState([]);
  const [accountBadges, setAccountBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newBadge, setNewBadge] = useState({ name: "", colorCode: "#1A4BA8", textColor: "#FFFFFF" });
  const [newAccountBadge, setNewAccountBadge] = useState({ name: "", iconUrl: "", tooltip: "", bgColor: "#1A4BA8", textColor: "#FFFFFF", type: "Custom", condition: "" });
  const [editingAccountBadge, setEditingAccountBadge] = useState(null);
  const [updatingAccountBadge, setUpdatingAccountBadge] = useState(false);
  const [editingArtworkBadge, setEditingArtworkBadge] = useState(null);
  const [updatingArtworkBadge, setUpdatingArtworkBadge] = useState(false);
  const [creating, setCreating] = useState(false);
  useEffect(() => {
    if (!userData?.id) return;
    setLoading(true);
    Promise.all([
      api.badges.list(userData.id),
      fetch("/api/accountbadges").then((r) => r.json())
    ]).then(([artB, accB]) => {
      setBadges(artB);
      setAccountBadges(accB || []);
      setLoading(false);
    }).catch((e) => {
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
    if (!window.confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a huy hi\u1EC7u n\xE0y? Huy hi\u1EC7u s\u1EBD b\u1ECB g\u1EE1 kh\u1ECFi t\u1EA5t c\u1EA3 c\xE1c \u0111\u1ED3 \xE1n \u0111\xE3 \u0111\u01B0\u1EE3c c\u1EA5p.")) return;
    try {
      await api.badges.delete(badgeId, userData.id);
      setBadges(badges.filter((b) => b.id !== badgeId));
    } catch (e) {
      alert("L\u1ED7i khi x\xF3a huy hi\u1EC7u: " + e.message);
    }
  };
  const handleCreateAccountBadge = async () => {
    if (!newAccountBadge.name) return;
    setCreating(true);
    try {
      const res = await fetch("/api/accountbadges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAccountBadge)
      });
      if (!res.ok) throw new Error("Failed to create account badge");
      const created = await res.json();
      const newList = [created, ...accountBadges];
      setAccountBadges(newList);
      updateGlobalBadges(newList);
      setNewAccountBadge({ name: "", iconUrl: "", tooltip: "", bgColor: "#1A4BA8", textColor: "#FFFFFF", type: "Custom", condition: "" });
    } catch (e) {
      alert("L\u1ED7i t\u1EA1o huy hi\u1EC7u t\xE0i kho\u1EA3n: " + e.message);
    }
    setCreating(false);
  };
  const handleDeleteAccountBadge = async (badgeId) => {
    if (!window.confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn x\xF3a huy hi\u1EC7u t\xE0i kho\u1EA3n n\xE0y? Huy hi\u1EC7u s\u1EBD b\u1ECB g\u1EE1 kh\u1ECFi c\xE1c t\xE0i kho\u1EA3n \u0111ang s\u1EDF h\u1EEFu.")) return;
    try {
      await fetch(`/api/accountbadges/${badgeId}`, { method: "DELETE" });
      const newList = accountBadges.filter((b) => b.id !== badgeId);
      setAccountBadges(newList);
      updateGlobalBadges(newList);
    } catch (e) {
      alert("L\u1ED7i x\xF3a huy hi\u1EC7u: " + e.message);
    }
  };
  const handleUpdateArtworkBadge = async () => {
    if (!editingArtworkBadge?.name) return;
    setUpdatingArtworkBadge(true);
    try {
      const res = await fetch(`/api/badges/${editingArtworkBadge.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingArtworkBadge)
      });
      if (!res.ok) throw new Error("C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");
      const updated = await res.json();
      setBadges(badges.map((b) => b.id === updated.id ? updated : b));
      setEditingArtworkBadge(null);
    } catch (e) {
      alert("L\u1ED7i c\u1EADp nh\u1EADt huy hi\u1EC7u: " + e.message);
    } finally {
      setUpdatingArtworkBadge(false);
    }
  };
  const handleUpdateAccountBadge = async () => {
    if (!editingAccountBadge?.name) return;
    setUpdatingAccountBadge(true);
    try {
      const res = await fetch(`/api/accountbadges/${editingAccountBadge.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingAccountBadge)
      });
      if (!res.ok) throw new Error("C\u1EADp nh\u1EADt th\u1EA5t b\u1EA1i");
      const updated = await res.json();
      const newList = accountBadges.map((b) => b.id === updated.id ? updated : b);
      setAccountBadges(newList);
      updateGlobalBadges(newList);
      setEditingAccountBadge(null);
    } catch (e) {
      alert("L\u1ED7i c\u1EADp nh\u1EADt huy hi\u1EC7u: " + e.message);
    }
    setUpdatingAccountBadge(false);
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white relative" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "badges", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8 bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, margin: 0, color: BLACK } }, "Qu\u1EA3n l\xFD Huy hi\u1EC7u"), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 13, marginTop: 4 } }, "T\u1EA1o v\xE0 qu\u1EA3n l\xFD c\xE1c huy hi\u1EC7u d\xE0nh t\u1EB7ng cho \u0111\u1ED3 \xE1n xu\u1EA5t s\u1EAFc v\xE0 t\xE0i kho\u1EA3n."))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 24, borderBottom: `1px solid ${GRAY_LIGHT}`, paddingBottom: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("artwork"), style: { padding: "8px 16px", borderRadius: 8, border: "none", background: activeTab === "artwork" ? CERULEAN : "transparent", color: activeTab === "artwork" ? "#fff" : MUTED, fontWeight: 600, fontSize: 14, cursor: "pointer" } }, "Huy hi\u1EC7u \u1EA4n ph\u1EA9m"), /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("account"), style: { padding: "8px 16px", borderRadius: 8, border: "none", background: activeTab === "account" ? CERULEAN : "transparent", color: activeTab === "account" ? "#fff" : MUTED, fontWeight: 600, fontSize: 14, cursor: "pointer" } }, "Huy hi\u1EC7u T\xE0i kho\u1EA3n")), activeTab === "artwork" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: 24, border: `1px solid ${GRAY_LIGHT}`, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK } }, "T\u1EA1o Huy hi\u1EC7u m\u1EDBi"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "T\xEAn Huy hi\u1EC7u"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      placeholder: "VD: Top 10 Branding, Best Concept...",
      value: newBadge.name,
      onChange: (e) => setNewBadge({ ...newBadge, name: e.target.value }),
      style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14 }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "M\xE0u n\u1EC1n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: newBadge.colorCode,
      onChange: (e) => setNewBadge({ ...newBadge, colorCode: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: newBadge.colorCode.toUpperCase(),
      onChange: (e) => setNewBadge({ ...newBadge, colorCode: e.target.value }),
      style: { width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" }
    }
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "M\xE0u ch\u1EEF"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: newBadge.textColor,
      onChange: (e) => setNewBadge({ ...newBadge, textColor: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" }
    }
  ), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: newBadge.textColor.toUpperCase(),
      onChange: (e) => setNewBadge({ ...newBadge, textColor: e.target.value }),
      style: { width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" }
    }
  )))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleCreateBadge,
      disabled: creating || !newBadge.name,
      style: { padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: creating || !newBadge.name ? "not-allowed" : "pointer", opacity: creating || !newBadge.name ? 0.6 : 1 }
    },
    creating ? "\u0110ang t\u1EA1o..." : "T\u1EA1o Huy hi\u1EC7u"
  )))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK } }, "Huy hi\u1EC7u c\u1EE7a b\u1EA1n"), loading ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 16 } }, badges.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 14 } }, "Ch\u01B0a c\xF3 huy hi\u1EC7u n\xE0o \u0111\u01B0\u1EE3c t\u1EA1o.") : badges.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, onClick: () => setEditingArtworkBadge(b), style: { position: "relative", display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 100, background: b.colorCode, color: b.textColor || "#fff", fontSize: 13, fontWeight: 600, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", paddingRight: 36, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Star, { size: 14, fill: b.textColor || "#fff" }), b.name, /* @__PURE__ */ React.createElement("div", { onClick: (e) => {
    e.stopPropagation();
    handleDeleteBadge(b.id);
  }, style: { position: "absolute", right: 6, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, borderRadius: "50%", background: "rgba(0,0,0,0.15)", color: b.textColor || "#fff", transition: "all .2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.3)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.15)" }, /* @__PURE__ */ React.createElement(X, { size: 12, strokeWidth: 3 })))))), editingArtworkBadge && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 500, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 20, fontWeight: 700, color: BLACK } }, "Ch\u1EC9nh s\u1EEDa Huy hi\u1EC7u \u1EA4n ph\u1EA9m"), /* @__PURE__ */ React.createElement("div", { onClick: () => setEditingArtworkBadge(null), style: { cursor: "pointer", padding: 4, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(X, { size: 20, color: MUTED }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "T\xEAn huy hi\u1EC7u"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: editingArtworkBadge.name,
      onChange: (e) => setEditingArtworkBadge({ ...editingArtworkBadge, name: e.target.value }),
      style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "M\xE0u n\u1EC1n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: editingArtworkBadge.colorCode,
      onChange: (e) => setEditingArtworkBadge({ ...editingArtworkBadge, colorCode: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }
    }
  ), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingArtworkBadge.colorCode, readOnly: true, style: { width: 80, padding: "8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13, textAlign: "center", background: "#f8fafc" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "M\xE0u ch\u1EEF"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: editingArtworkBadge.textColor || "#ffffff",
      onChange: (e) => setEditingArtworkBadge({ ...editingArtworkBadge, textColor: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }
    }
  ), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingArtworkBadge.textColor || "#ffffff", readOnly: true, style: { width: 80, padding: "8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13, textAlign: "center", background: "#f8fafc" } }))))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleUpdateArtworkBadge,
      disabled: updatingArtworkBadge,
      style: { background: "#1A4BA8", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 24, width: "100%" }
    },
    updatingArtworkBadge ? "\u0110ang l\u01B0u..." : "L\u01B0u thay \u0111\u1ED5i"
  )))), activeTab === "account" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, padding: 24, border: `1px solid ${GRAY_LIGHT}`, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK } }, "T\u1EA1o Huy hi\u1EC7u T\xE0i kho\u1EA3n m\u1EDBi"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, flexWrap: "wrap", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 200px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "T\xEAn hi\u1EC3n th\u1ECB"), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "VD: Sinh vi\xEAn 5 t\u1ED1t...", value: newAccountBadge.name, onChange: (e) => setNewAccountBadge({ ...newAccountBadge, name: e.target.value }), style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14 } })), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 200px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "T\u1EA3i l\xEAn Icon (T\xF9y ch\u1ECDn)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, alignItems: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", flex: 1 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      onChange: async (e) => {
        const file = e.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (event) => setNewAccountBadge({ ...newAccountBadge, iconUrl: event.target.result });
          reader.readAsDataURL(file);
        }
      },
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "8px 14px", borderRadius: 8, border: "1px dashed #1a4ba8", background: "#f0f4ff", color: "#1a4ba8", fontSize: 14, textAlign: "center", fontWeight: 500, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(Upload, { size: 16, style: { display: "inline-block", marginRight: 6, verticalAlign: "text-bottom" } }), "Nh\u1EA5n \u0111\u1EC3 t\u1EA3i \u1EA3nh l\xEAn")), newAccountBadge.iconUrl && /* @__PURE__ */ React.createElement("img", { src: newAccountBadge.iconUrl, style: { width: 40, height: 40, objectFit: "contain", border: "1px solid #ddd", borderRadius: 4 }, alt: "Preview" }))), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 200px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "Ch\xFA th\xEDch (Tooltip)"), /* @__PURE__ */ React.createElement("input", { type: "text", placeholder: "Gi\u1EA3i th\xEDch huy hi\u1EC7u...", value: newAccountBadge.tooltip, onChange: (e) => setNewAccountBadge({ ...newAccountBadge, tooltip: e.target.value }), style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14 } }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, marginTop: 16, flexWrap: "wrap", alignItems: "flex-end" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 150px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "M\xE0u n\u1EC1n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: newAccountBadge.bgColor, onChange: (e) => setNewAccountBadge({ ...newAccountBadge, bgColor: e.target.value }), style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" } }), /* @__PURE__ */ React.createElement("input", { type: "text", value: newAccountBadge.bgColor.toUpperCase(), onChange: (e) => setNewAccountBadge({ ...newAccountBadge, bgColor: e.target.value }), style: { width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" } }))), /* @__PURE__ */ React.createElement("div", { style: { flex: "1 1 150px" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, marginBottom: 6, color: BLACK } }, "M\xE0u ch\u1EEF"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: newAccountBadge.textColor, onChange: (e) => setNewAccountBadge({ ...newAccountBadge, textColor: e.target.value }), style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer" } }), /* @__PURE__ */ React.createElement("input", { type: "text", value: newAccountBadge.textColor.toUpperCase(), onChange: (e) => setNewAccountBadge({ ...newAccountBadge, textColor: e.target.value }), style: { width: 90, padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, textTransform: "uppercase" } })))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 22 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleCreateAccountBadge, disabled: creating || !newAccountBadge.name, style: { padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: creating || !newAccountBadge.name ? "not-allowed" : "pointer", opacity: creating || !newAccountBadge.name ? 0.6 : 1 } }, creating ? "\u0110ang t\u1EA1o..." : "T\u1EA1o Huy hi\u1EC7u T\xE0i kho\u1EA3n"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: 600, margin: "0 0 16px", color: BLACK } }, "Danh s\xE1ch Huy hi\u1EC7u T\xE0i kho\u1EA3n"), loading ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : /* @__PURE__ */ React.createElement("div", null, accountBadges.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 14 } }, "Ch\u01B0a c\xF3 huy hi\u1EC7u t\xE0i kho\u1EA3n n\xE0o \u0111\u01B0\u1EE3c t\u1EA1o.") : /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 20 } }, accountBadges.map((b) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: b.id,
      onClick: () => setEditingAccountBadge(b),
      style: {
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: 16,
        padding: 20,
        display: "flex",
        alignItems: "center",
        gap: 16,
        cursor: "pointer",
        transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.03)"
      },
      onMouseEnter: (e) => {
        e.currentTarget.style.boxShadow = "0 10px 25px rgba(0,0,0,0.08)";
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = "#cbd5e1";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.03)";
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }
    },
    /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, b.iconUrl || getBadgeIcon(b.name) ? /* @__PURE__ */ React.createElement("img", { src: b.iconUrl || getBadgeIcon(b.name), alt: "icon", style: { width: 72, height: 72, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: 72, height: 72, borderRadius: "50%", background: b.bgColor || "#1A4BA8", display: "flex", alignItems: "center", justifyContent: "center", color: b.textColor || "#fff" } }, /* @__PURE__ */ React.createElement(Image, { size: 32 }))),
    /* @__PURE__ */ React.createElement("div", { style: { flex: 1, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { fontWeight: 700, fontSize: 15, color: BLACK, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, b.name), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, color: MUTED, marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, b.tooltip || "Kh\xF4ng c\xF3 ch\xFA th\xEDch"), b.type === "Default" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 11, fontWeight: 600, background: "#f1f5f9", color: "#64748b", display: "inline-block", padding: "3px 8px", borderRadius: 6, marginTop: 6 } }, "M\u1EB7c \u0111\u1ECBnh (", b.condition, ")")),
    b.type !== "Default" && /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: (e) => {
          e.stopPropagation();
          handleDeleteAccountBadge(b.id);
        },
        style: { padding: 8, borderRadius: "50%", background: "#fee2e2", color: "#ef4444", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" },
        onMouseEnter: (e) => e.currentTarget.style.background = "#fecaca",
        onMouseLeave: (e) => e.currentTarget.style.background = "#fee2e2",
        title: "X\xF3a huy hi\u1EC7u"
      },
      /* @__PURE__ */ React.createElement(Trash2, { size: 16 })
    )
  ))))), editingAccountBadge && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 1e3, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", padding: 32, borderRadius: 20, width: "100%", maxWidth: 500, boxShadow: "0 20px 50px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 20, fontWeight: 700, color: BLACK } }, "Ch\u1EC9nh s\u1EEDa Huy hi\u1EC7u"), /* @__PURE__ */ React.createElement("div", { onClick: () => setEditingAccountBadge(null), style: { cursor: "pointer", padding: 4, borderRadius: "50%", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(X, { size: 20, color: MUTED }))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "T\xEAn hi\u1EC3n th\u1ECB"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: editingAccountBadge.name,
      onChange: (e) => setEditingAccountBadge({ ...editingAccountBadge, name: e.target.value }),
      disabled: editingAccountBadge.type === "Default",
      style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none", background: editingAccountBadge.type === "Default" ? "#f8fafc" : "#fff" }
    }
  ), editingAccountBadge.type === "Default" && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, marginTop: 4 } }, "Kh\xF4ng th\u1EC3 \u0111\u1ED5i t\xEAn huy hi\u1EC7u m\u1EB7c \u0111\u1ECBnh."))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "Upload Icon"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center" } }, editingAccountBadge.iconUrl || getBadgeIcon(editingAccountBadge.name) ? /* @__PURE__ */ React.createElement("img", { src: editingAccountBadge.iconUrl || getBadgeIcon(editingAccountBadge.name), alt: "icon", style: { width: 80, height: 80, objectFit: "contain", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))" } }) : /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: editingAccountBadge.bgColor || "#1A4BA8", display: "flex", alignItems: "center", justifyContent: "center", color: editingAccountBadge.textColor || "#fff" } }, /* @__PURE__ */ React.createElement(Image, { size: 32 }))), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/png, image/jpeg, image/gif, image/svg+xml",
      onChange: (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
          setEditingAccountBadge({ ...editingAccountBadge, iconUrl: reader.result });
        };
        reader.readAsDataURL(file);
      },
      style: { position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0, cursor: "pointer" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", border: "1px dashed #1a4ba8", borderRadius: 8, background: "#f0f4ff", textAlign: "center", color: "#1a4ba8", fontSize: 13, fontWeight: 500, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(Upload, { size: 18, style: { display: "inline-block", marginBottom: 4 } }), /* @__PURE__ */ React.createElement("br", null), "Nh\u1EA5n \u0111\u1EC3 t\u1EA3i \u1EA3nh l\xEAn")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "Ch\xFA th\xEDch (Tooltip)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: editingAccountBadge.tooltip,
      onChange: (e) => setEditingAccountBadge({ ...editingAccountBadge, tooltip: e.target.value }),
      style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: "1px solid #ddd", fontSize: 14, outline: "none" }
    }
  )), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 24 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "M\xE0u n\u1EC1n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: editingAccountBadge.bgColor,
      onChange: (e) => setEditingAccountBadge({ ...editingAccountBadge, bgColor: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }
    }
  ), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingAccountBadge.bgColor, readOnly: true, style: { width: 80, padding: "8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13, textAlign: "center", background: "#f8fafc" } }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 8 } }, "M\xE0u ch\u1EEF icon"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "color",
      value: editingAccountBadge.textColor,
      onChange: (e) => setEditingAccountBadge({ ...editingAccountBadge, textColor: e.target.value }),
      style: { width: 40, height: 40, padding: 0, border: "none", borderRadius: 8, cursor: "pointer", background: "none" }
    }
  ), /* @__PURE__ */ React.createElement("input", { type: "text", value: editingAccountBadge.textColor, readOnly: true, style: { width: 80, padding: "8px", borderRadius: 6, border: "1px solid #ddd", fontSize: 13, textAlign: "center", background: "#f8fafc" } })))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleUpdateAccountBadge,
      disabled: updatingAccountBadge,
      style: { background: "#1A4BA8", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 14, cursor: "pointer", marginTop: 8 }
    },
    updatingAccountBadge ? "\u0110ang l\u01B0u..." : "L\u01B0u thay \u0111\u1ED5i"
  )))))));
}
function DashboardPage({ setPage, setEditingArtworkId, setActiveArtworkId, userData }) {
  const [artworksList, setArtworksList] = useState([]);
  const [visibleCount, setVisibleCount] = useState(12);
  const [loading, setLoading] = useState(true);
  const [collabArtworks, setCollabArtworks] = useState([]);
  const [collabLoading, setCollabLoading] = useState(true);
  const { user: authUser } = useAuth();
  useEffect(() => {
    api.users.myArtworks().then((res) => {
      setArtworksList(Array.isArray(res) ? res : res.artworks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  useEffect(() => {
    if (!authUser?.id) {
      setCollabLoading(false);
      return;
    }
    api.artworks.list({ collaboratorId: authUser.id, limit: "50" }).then((res) => {
      setCollabArtworks(res.artworks || []);
      setCollabLoading(false);
    }).catch(() => setCollabLoading(false));
  }, [authUser?.id]);
  const totalArtworks = artworksList.length;
  const totalViews = artworksList.reduce((s, a) => s + (a.viewCount || 0), 0);
  const totalLikes = artworksList.reduce((s, a) => s + (a.likeCount || 0), 0);
  const publicCount = artworksList.filter((a) => a.isPublic).length;
  const stats = [
    { label: t("totalArtworks"), val: totalArtworks.toLocaleString(), icon: /* @__PURE__ */ React.createElement(Image, { size: 24, color: BLACK, strokeWidth: 1.5 }) },
    { label: t("views"), val: totalViews.toLocaleString(), icon: /* @__PURE__ */ React.createElement(Eye, { size: 24, color: BLACK, strokeWidth: 1.5 }) },
    { label: t("likes"), val: totalLikes.toLocaleString(), icon: /* @__PURE__ */ React.createElement(Heart, { size: 24, color: BLACK, strokeWidth: 1.5 }) },
    { label: t("publicArtworks"), val: publicCount.toString(), icon: /* @__PURE__ */ React.createElement(Globe, { size: 24, color: BLACK, strokeWidth: 1.5 }) }
  ];
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG } }, /* @__PURE__ */ React.createElement(DashboardSidebar, { activePage: "dashboard", setPage, userData }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "32px 40px", overflow: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, margin: 0, color: BLACK } }, t("myArtworks")), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 13, marginTop: 4 } }, t("manageVisibility"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("upload"), style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(Plus, { size: 18, color: "#fff" }), t("uploadNewArtwork")))), loading ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 } }, stats.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, style: { background: "#fff", borderRadius: 12, padding: "18px 20px", border: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 8 } }, s.icon), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 24, fontWeight: 700, margin: "0 0 2px", color: BLACK } }, s.val), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, margin: 0 } }, s.label)))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, artworksList.slice(0, visibleCount).map((art) => /* @__PURE__ */ React.createElement("div", { key: art.id, style: { background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", background: GRAY_BG } }, /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl, alt: art.title, style: { width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }, onClick: () => setPage("detail", { artworkId: art.id }) }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { background: art.isPending ? "#fffBEB" : art.isPublic ? "#e0eaff" : "#F8F8F8", color: art.isPending ? "#b45309" : art.isPublic ? CERULEAN : MUTED, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: `1px solid ${art.isPending ? "#fcd34d" : art.isPublic ? "#a8bce0" : GRAY_LIGHT}` } }, art.isPending ? t("pending") : art.isPublic ? t("public") : t("private")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, art.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` } }, art.subject), (art.toolsUsed || []).slice(0, 1).map((t2) => /* @__PURE__ */ React.createElement("span", { key: t2, style: { background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` } }, t2))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 10, borderTop: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, color: MUTED } }, t("public")), /* @__PURE__ */ React.createElement(ToggleSwitch, { isOn: art.isPublic, disabled: art.isPending, onToggle: () => {
    if (!art.isPublic) {
      if (!window.confirm("\u1EA4n ph\u1EA9m s\u1EBD \u0111\u01B0\u1EE3c chuy\u1EC3n v\xE0o tr\u1EA1ng th\xE1i Ch\u1EDD duy\u1EC7t. B\u1EA1n c\xF3 mu\u1ED1n ti\u1EBFp t\u1EE5c?")) return;
      if (api.artworks.update) {
        api.artworks.update(art.id, { status: "pending_approval", isPublic: true }).then(() => {
          alert("\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u duy\u1EC7t \u1EA5n ph\u1EA9m.");
          setArtworksList((prev) => prev.map((a) => a.id === art.id ? { ...a, isPublic: true, isPending: true } : a));
        }).catch((err) => alert(err?.message || "L\u1ED7i c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i"));
      } else {
        api.artworks.toggleVisibility(art.id, true).then(() => {
          alert("\u0110\xE3 g\u1EEDi y\xEAu c\u1EA7u duy\u1EC7t \u1EA5n ph\u1EA9m.");
          setArtworksList((prev) => prev.map((a) => a.id === art.id ? { ...a, isPublic: true, isPending: true } : a));
        }).catch((err) => alert(err?.message || "L\u1ED7i c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i"));
      }
      return;
    }
    api.artworks.toggleVisibility(art.id, false).then(() => {
      setArtworksList((prev) => prev.map((a) => a.id === art.id ? { ...a, isPublic: false, isPending: false } : a));
    }).catch((err) => alert(err?.message || "L\u1ED7i c\u1EADp nh\u1EADt tr\u1EA1ng th\xE1i"));
  } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setActiveArtworkId(art.id);
    setTimeout(() => setPage("edit_artwork"), 50);
  }, style: { width: 30, height: 30, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Edit2, { size: 14, color: BLACK, strokeWidth: 1.5 })), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    if (window.confirm("C\u1EA3nh b\xE1o: Vi\u1EC7c x\xF3a b\xE0i s\u1EBD l\xE0m m\u1EA5t v\u0129nh vi\u1EC5n to\xE0n b\u1ED9 Like v\xE0 B\xECnh lu\u1EADn c\u1EE7a b\xE0i vi\u1EBFt n\xE0y. B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c?")) {
      api.artworks.delete(art.id).then(() => setArtworksList((prev) => prev.filter((a) => a.id !== art.id))).catch((err) => alert(err?.message || "L\u1ED7i x\xF3a \u1EA5n ph\u1EA9m"));
    }
  }, style: { width: 30, height: 30, borderRadius: 6, border: `1px solid #F5C5C5`, background: "#FEF2F2", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(Trash2, { size: 14, color: CRIMSON, strokeWidth: 1.5 })))))))), visibleCount < artworksList.length && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginTop: 24 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setVisibleCount((v) => v + 12), style: { padding: "10px 24px", borderRadius: 100, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: BLACK, fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "all 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = GRAY_BG, onMouseLeave: (e) => e.currentTarget.style.background = "#fff" }, /* @__PURE__ */ React.createElement(ChevronDown, { size: 16 }), "T\u1EA3i th\xEAm t\xE1c ph\u1EA9m")), collabArtworks.length > 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 18, fontWeight: 700, color: BLACK, marginTop: 40, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Users, { size: 20, color: CERULEAN }), " ", t("coAuthor"), " (", collabArtworks.length, ")"), /* @__PURE__ */ React.createElement("div", { className: "masonry-3", style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 } }, collabArtworks.map((art) => /* @__PURE__ */ React.createElement("div", { key: art.id, style: { background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", background: GRAY_BG } }, /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl, alt: art.title, style: { width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }, onClick: () => setPage("detail", { artworkId: art.id }) }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 8, left: 8 } }, /* @__PURE__ */ React.createElement("span", { style: { background: "#F0FDF4", color: "#166534", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 3 } }, /* @__PURE__ */ React.createElement(Users, { size: 10 }), " ", art.user?.fullName || t("coAuthor")))), /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600, margin: "0 0 4px", color: BLACK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" } }, art.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, /* @__PURE__ */ React.createElement("span", { style: { background: GRAY_BG, fontSize: 10, padding: "2px 7px", borderRadius: 6, color: MUTED, border: `1px solid ${GRAY_LIGHT}` } }, art.subject))))))))));
}
function UploadPage({ setPage, setActiveArtworkId, pageParams }) {
  const { user: currentUser } = useAuth();
  if (currentUser?.role !== "student") {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f9fafb" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 24, fontWeight: "bold", color: "#ef4444" } }, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp trang n\xE0y."));
  }
  const [showPopup, setShowPopup] = useState(false);
  const [submissionType, setSubmissionType] = useState("Final");
  const [isEbookViewerOpen, setIsEbookViewerOpen] = useState(false);
  const [isEbook, setIsEbook] = useState(false);
  const [ebookOrientation, setEbookOrientation] = useState("portrait");
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
  const [projectYear, setProjectYear] = useState("N\u0103m 3");
  const [isGroupProject, setIsGroupProject] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendInput, setFriendInput] = useState("");
  const [friendResults, setFriendResults] = useState([]);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [notifyOnConfirm, setNotifyOnConfirm] = useState(true);
  const [coverImage, setCoverImage] = useState(null);
  const [additionalImages, setAdditionalImages] = useState([]);
  const [error, setError] = useState("");
  const [defaultWatermarkText, setDefaultWatermarkText] = useState(() => "UEF");
  const [blocks, setBlocks] = useState(() => {
    const initialBlocks = pageParams?.draftBlocks || [];
    return initialBlocks.map((b) => {
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
          title: state.title?.trim() || "Untitled Draft",
          description: state.description?.trim() || null,
          subject: state.subject || null,
          toolsUsed: state.tools,
          tags: state.tags,
          collaborators: state.friends.map((f) => f.fullName || f),
          collaboratorIds: state.friends.map((f) => f.id).filter(Boolean),
          fileUrls: [state.coverImage, ...state.additionalImages].filter(Boolean),
          coverImageUrl: state.coverImage,
          watermarkText: state.defaultWatermarkText || "UEF",
          watermarkPosition: "bottom-right",
          semester: yearToSemester[state.projectYear] || "HK1",
          academicYear: yearToAcademic[state.projectYear] || "2024-2025",
          blocksJson: JSON.stringify(state.blocks),
          status: "draft"
        };
        if (state.draftId) {
          await api.artworks.update(state.draftId, body);
        } else {
          const created = await api.artworks.create(body);
          setDraftId(created.id);
        }
        console.log("Auto-saved draft from UploadPage at", (/* @__PURE__ */ new Date()).toLocaleTimeString());
      } catch (e) {
        console.error("Auto-save failed", e);
      }
    }, 6e4);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    if (pageParams?.draftBlocks) {
      setBlocks(pageParams.draftBlocks.map((b) => {
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
          setTags(typeof s.tags === "string" ? s.tags.split(",").map((t2) => t2.trim()).filter(Boolean) : Array.isArray(s.tags) ? s.tags : []);
        }
        if (s.tools) {
          setTools(typeof s.tools === "string" ? s.tools.split(",").map((t2) => t2.trim()).filter(Boolean) : Array.isArray(s.tools) ? s.tools : []);
        }
        if (s.projectYear) setProjectYear(s.projectYear);
        if (s.coverImage) setCoverImage(s.coverImage);
        if (s.coOwners) {
          setIsGroupProject(true);
          const owners = typeof s.coOwners === "string" ? s.coOwners.split(",") : Array.isArray(s.coOwners) ? s.coOwners : [];
          setFriends(owners.map((f) => ({ id: Date.now() + Math.random(), name: typeof f === "string" ? f.trim() : f.name, role: "Member" })));
        }
      } catch (err) {
        console.error("Error parsing draftSettings:", err);
      }
    }
    fetch("/api/site-settings?_t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((data) => {
      if (data.watermark_text) setDefaultWatermarkText(data.watermark_text);
    }).catch(() => {
    });
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
    setBlocks(blocks.map((b) => b.id === id ? { ...b, ...newProps } : b));
  };
  const removeBlock = (id) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };
  useEffect(() => {
    fetch("/api/site-settings?_t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((data) => {
      if (data.watermark_text) setDefaultWatermarkText(data.watermark_text);
    }).catch(() => {
    });
  }, []);
  const yearToSemester = { "N\u0103m 1": "HK1", "N\u0103m 2": "HK2", "N\u0103m 3": "HK3", "N\u0103m 4": "HK1", "T\u1ED1t nghi\u1EC7p": "HK2" };
  const yearToAcademic = { "N\u0103m 1": "2024-2025", "N\u0103m 2": "2023-2024", "N\u0103m 3": "2022-2023", "N\u0103m 4": "2021-2022", "T\u1ED1t nghi\u1EC7p": "2021-2022" };
  const allSubjects = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const handleFriendSearch = (val) => {
    setFriendInput(val);
    if (val.length < 2) {
      setFriendResults([]);
      return;
    }
    api.users.search(val).then(setFriendResults).catch(() => {
    });
  };
  const addFriend = (user) => {
    if (!friends.find((f) => f.id === user.id)) {
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
    setAdditionalImages((prev) => [...prev, ...urls].slice(0, 9));
  };
  const removeAdditional = (idx) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const allFileUrls = coverImage ? [coverImage, ...additionalImages] : [...additionalImages];
  const handleUseEbook = (pages, file, orientation = "portrait") => {
    if (pages.length > 0) {
      setCoverImage(pages[0]);
      setAdditionalImages(pages.slice(1, 10));
      setIsEbook(true);
      setEbookOrientation(orientation);
    }
  };
  const handleUploadSubmit = async () => {
    if (!coverImage) {
      setError(t("pleaseSelectCoverImage"));
      return;
    }
    if (!title.trim()) {
      setError(t("pleaseEnterCourseName"));
      return;
    }
    if (!subject) {
      setError(t("pleaseSelectCategory"));
      return;
    }
    if (!checked1 || !checked2 || !checked3) {
      setError(t("pleaseConfirmCommitments"));
      return;
    }
    setError("");
    setUploadState("loading");
    let submitTags = tags.length > 0 ? [...tags] : [subject];
    if (isEbook && !submitTags.includes("IS_EBOOK")) {
      submitTags.push("IS_EBOOK");
    }
    if (isEbook && ebookOrientation === "landscape" && !submitTags.includes("EBOOK_LANDSCAPE")) {
      submitTags.push("EBOOK_LANDSCAPE");
    }
    const generateWatermarkDataURL = async (imgUrl, text) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      await new Promise((res, rej) => {
        img.onload = res;
        img.onerror = rej;
        img.src = imgUrl;
      });
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
      let finalWatermarkText = defaultWatermarkText || "UEF";
      try {
        const settingsRes = await fetch("/api/site-settings?_t=" + Date.now(), { cache: "no-store" });
        const settingsData = await settingsRes.json();
        if (settingsData.watermark_text !== void 0) {
          finalWatermarkText = settingsData.watermark_text || "UEF";
        }
      } catch (e) {
      }
      const watermarkedCover = await generateWatermarkDataURL(coverImage, finalWatermarkText);
      setUploadState("analyzing_ai");
      const aiResult = await api.artworks.analyzeArtworkWithAI(coverImage);
      let uploadStatus = submissionType === "Final" ? "pending_approval" : "revision";
      if (aiResult.originalityScore < 50) {
        const proceed = window.confirm(
          `C\u1EA2NH B\xC1O AI:

H\u1EC7 th\u1ED1ng nh\u1EADn di\u1EC7n t\xE1c ph\u1EA9m c\u1EE7a b\u1EA1n c\xF3 t\u1EF7 l\u1EC7 t\u1EA1o ra b\u1EDFi AI r\u1EA5t cao (${aiResult.aiGeneratedPercentage}%).
\u0110\u1ED9 nguy\xEAn b\u1EA3n (Originality) ch\u1EC9 \u0111\u1EA1t ${aiResult.originalityScore}%.

\u1EA4n ph\u1EA9m s\u1EBD \u0111\u01B0\u1EE3c chuy\u1EC3n v\xE0o tr\u1EA1ng th\xE1i CH\u1EDC DUY\u1EC6T \u0111\u1EC3 Admin v\xE0 Gi\u1EA3ng vi\xEAn ki\u1EC3m tra.
B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n ti\u1EBFp t\u1EE5c \u0111\u0103ng kh\xF4ng?`
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
        const firstImageBlock = blocks.find((b) => b.type === "image" && b.content);
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
        collaborators: friends.map((f) => f.fullName || f),
        collaboratorIds: friends.map((f) => f.id).filter(Boolean),
        fileUrls: allFileUrls,
        coverImageUrl: finalWatermarkedCover,
        originalCoverUrl: finalCover,
        watermarkText: finalWatermarkText,
        watermarkPosition: "bottom-right",
        isPublic: true,
        status: uploadStatus,
        isAiConfirmed: checked1,
        isEbook,
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
  return /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", minHeight: "100vh", padding: "40px 64px", position: "relative" } }, showPopup && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, padding: "36px 40px", width: 480, boxShadow: "0 24px 64px rgba(0,0,0,0.35)" } }, uploadState === "success" ? /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center text-center py-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#e0eaff] rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(Check, { size: 32, className: "text-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("h4", { className: "text-xl font-bold text-[#212121] mb-2" }, t("uploadSuccess")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666]" }, t("artworkSubmitted"))) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 40, height: 40, background: "#FEF2F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 20, color: CRIMSON, strokeWidth: 1.5 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 17, fontWeight: 700, margin: 0, color: BLACK } }, t("academicCommitment")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, margin: 0 } }, t("requiredBeforePosting")))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 20, background: GRAY_BG, padding: "12px 14px", borderRadius: 8, borderLeft: `3px solid ${CRIMSON}` } }, t("commitmentDescription")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, [
    { id: "c1", state: checked1, set: setChecked1, text: t("commitmentAi") },
    { id: "c2", state: checked2, set: setChecked2, text: t("commitmentNoCopy") },
    { id: "c3", state: checked3, set: setChecked3, text: t("commitmentConsequences") }
  ].map((c) => /* @__PURE__ */ React.createElement("label", { key: c.id, style: { display: "flex", gap: 10, cursor: "pointer", alignItems: "flex-start" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => c.set(!c.state), style: { width: 18, height: 18, borderRadius: 4, border: `2px solid ${c.state ? CERULEAN : GRAY_LIGHT}`, background: c.state ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" } }, c.state && /* @__PURE__ */ React.createElement(Check, { size: 14, color: "#fff", strokeWidth: 3 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#333", lineHeight: 1.5 } }, c.text)))), error && /* @__PURE__ */ React.createElement("p", { style: { color: CRIMSON, fontSize: 12, marginTop: 12 } }, error), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 24 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPopup(false), disabled: uploadState === "loading" || uploadState === "analyzing_ai", style: { flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: uploadState === "loading" || uploadState === "analyzing_ai" ? "not-allowed" : "pointer", color: MUTED } }, t("cancel")), /* @__PURE__ */ React.createElement("button", { onClick: handleUploadSubmit, disabled: !checked1 || !checked2 || !checked3 || uploadState === "loading" || uploadState === "analyzing_ai", style: { flex: 2, padding: "10px", borderRadius: 8, border: "none", background: checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai" ? CERULEAN : GRAY_LIGHT, color: checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai" ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: checked1 && checked2 && checked3 && uploadState !== "loading" && uploadState !== "analyzing_ai" ? "pointer" : "not-allowed" } }, uploadState === "analyzing_ai" ? "\u0110ang ph\xE2n t\xEDch b\u1EA3n quy\u1EC1n AI..." : uploadState === "loading" ? t("processing") : t("confirmAndPost")))))), /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 1100, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 24, fontWeight: 700, marginBottom: 6, color: BLACK } }, t("uploadNewArtwork")), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 14, marginBottom: 32 } }, t("shareWithCommunity")), /* @__PURE__ */ React.createElement("div", { className: "upload-grid", style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 } }, isEbook ? "E-BOOK PREVIEW" : t("coverImage")), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsEbookViewerOpen(true), style: { display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 6, border: `1px solid ${CERULEAN}`, background: "#fff", color: CERULEAN, fontSize: 12, fontWeight: 600, cursor: "pointer" } }, /* @__PURE__ */ React.createElement(BookOpen, { size: 14, color: CERULEAN }), "T\u1EA3i l\xEAn E-book")), isEbook ? /* @__PURE__ */ React.createElement("div", { style: { border: `1px solid ${GRAY_LIGHT}`, borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 400, background: "#F0F2F5", padding: "40px 0", display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", display: "flex", justifyContent: "center", alignItems: "center" } }, /* @__PURE__ */ React.createElement(
    HTMLFlipBook,
    {
      width: ebookOrientation === "landscape" ? 400 : 280,
      height: ebookOrientation === "landscape" ? 280 : 390,
      size: "stretch",
      minWidth: 200,
      maxWidth: 400,
      minHeight: 300,
      maxHeight: 600,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true,
      className: "shadow-2xl mx-auto"
    },
    [coverImage, ...additionalImages].filter(Boolean).map((img, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "demoPage bg-white overflow-hidden border border-gray-200" }, /* @__PURE__ */ React.createElement("img", { src: img, alt: `Page ${index + 1}`, className: "w-full h-full object-contain pointer-events-none", style: { width: "100%", height: "100%", display: "block" } })))
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: (e) => {
        e.preventDefault();
        setEbookOrientation((prev) => prev === "portrait" ? "landscape" : "portrait");
      },
      style: { position: "absolute", bottom: -40, background: "#fff", border: "1px solid #ccc", padding: "4px 12px", borderRadius: 4, fontSize: 12, cursor: "pointer", zIndex: 20 }
    },
    "Chuy\u1EC3n sang Ebook ",
    ebookOrientation === "portrait" ? "ngang" : "d\u1ECDc"
  )), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 30, background: "rgba(0,0,0,0.7)", color: "white", padding: "8px 20px", borderRadius: 30, fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", width: 8, height: 8, position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", opacity: 0.75 } }), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8" } })), "K\xE9o m\xE9p gi\u1EA5y ho\u1EB7c click v\xE0o g\xF3c \u0111\u1EC3 l\u1EADt trang")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", { type: "file", id: "coverInput", accept: "image/*", style: { display: "none" }, onChange: handleCoverUpload }), /* @__PURE__ */ React.createElement("div", { onClick: () => document.getElementById("coverInput")?.click(), style: { border: `2px dashed ${coverImage ? CERULEAN : GRAY_LIGHT}`, borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 400, background: GRAY_BG, cursor: "pointer" } }, coverImage ? /* @__PURE__ */ React.createElement("img", { src: coverImage, alt: "preview", style: { width: "100%", height: 400, objectFit: "cover", display: "block" } }) : /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 } }, /* @__PURE__ */ React.createElement(FileImage, { size: 36, color: MUTED, strokeWidth: 1.5 }), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 14, fontWeight: 600, margin: 0 } }, t("clickToSelectCover")), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 12, margin: 0 } }, t("imageFormatHint")))), !isFromDraft && /* @__PURE__ */ React.createElement("div", { style: { marginTop: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("additionalImages"), " (", additionalImages.length, "/9)"), /* @__PURE__ */ React.createElement("input", { type: "file", id: "additionalInput", accept: "image/*", multiple: true, style: { display: "none" }, onChange: handleAdditionalUpload }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, flexWrap: "wrap" } }, additionalImages.map((url, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, style: { width: 80, height: 64, borderRadius: 8, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: url, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { onClick: () => removeAdditional(idx), style: { position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 11 } }, "\xD7"))), additionalImages.length < 9 && /* @__PURE__ */ React.createElement("div", { onClick: () => document.getElementById("additionalInput")?.click(), style: { width: 80, height: 64, borderRadius: 8, border: `2px dashed ${GRAY_LIGHT}`, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", background: GRAY_BG } }, /* @__PURE__ */ React.createElement(Plus, { size: 22, color: MUTED })))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("courseName")), /* @__PURE__ */ React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), placeholder: "Design Graphic - Flowers Garden", style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, color: BLACK, outline: "none", boxSizing: "border-box", background: GRAY_BG } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("projectType")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6 } }, ["N\u0103m 1", "N\u0103m 2", "N\u0103m 3", "N\u0103m 4", "T\u1ED1t nghi\u1EC7p"].map((y) => /* @__PURE__ */ React.createElement("button", { key: y, onClick: () => setProjectYear(y), style: { flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${projectYear === y ? CERULEAN : GRAY_LIGHT}`, background: projectYear === y ? "#eef4ff" : GRAY_BG, color: projectYear === y ? CERULEAN : MUTED, fontSize: 12, fontWeight: projectYear === y ? 600 : 400, cursor: "pointer" } }, y)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("projectCategory")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10 } }, [{ key: false, label: t("individual"), desc: t("selfPerformed"), icon: /* @__PURE__ */ React.createElement(User, { size: 16 }) }, { key: true, label: t("group"), desc: t("teamwork"), icon: /* @__PURE__ */ React.createElement(Users, { size: 16 }) }].map((opt) => /* @__PURE__ */ React.createElement("div", { key: opt.label, onClick: () => setIsGroupProject(opt.key), style: { display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${isGroupProject === opt.key ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", background: isGroupProject === opt.key ? "#eef4ff" : GRAY_BG } }, /* @__PURE__ */ React.createElement("span", { style: { color: isGroupProject === opt.key ? CERULEAN : MUTED } }, opt.icon), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 600, color: isGroupProject === opt.key ? CERULEAN : BLACK, margin: 0 } }, opt.label), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, margin: 0 } }, opt.desc)))))), isGroupProject && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("addTeamMembers")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 } }, friends.map((f, i) => /* @__PURE__ */ React.createElement("span", { key: f.id || i, style: { background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 } }, /* @__PURE__ */ React.createElement(User, { size: 12 }), " ", f.fullName || f, /* @__PURE__ */ React.createElement(X, { size: 12, color: CERULEAN, onClick: () => setFriends(friends.filter((_, idx) => idx !== i)), style: { cursor: "pointer" } }))), /* @__PURE__ */ React.createElement("input", { value: friendInput, onChange: (e) => handleFriendSearch(e.target.value), placeholder: t("enterNameOrEmail"), style: { border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 120, color: BLACK, flex: 1 } })), friendResults.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", zIndex: 50, top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 200, overflowY: "auto" } }, friendResults.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, onClick: () => addFriend(u), style: { display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("img", { src: u.avatarUrl || "", alt: "", style: { width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, fontWeight: 500, margin: 0, color: BLACK } }, u.fullName), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, margin: 0 } }, u.email)))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("description")), /* @__PURE__ */ React.createElement("textarea", { value: description, onChange: (e) => setDescription(e.target.value), placeholder: t("describeYourArtwork"), style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, color: BLACK, outline: "none", resize: "vertical", minHeight: 90, lineHeight: 1.6, boxSizing: "border-box", background: GRAY_BG, fontFamily: "inherit" } })), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("category"), " *"), /* @__PURE__ */ React.createElement("select", { value: subject, onChange: (e) => setSubject(e.target.value), style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, background: GRAY_BG, color: BLACK } }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("selectOption")), allSubjects.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("tools")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 } }, tools.map((t2) => /* @__PURE__ */ React.createElement("span", { key: t2, style: { background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12 } }, t2, /* @__PURE__ */ React.createElement(X, { size: 12, color: CERULEAN, onClick: () => setTools(tools.filter((x) => x !== t2)), style: { cursor: "pointer", marginLeft: 4 } }))), /* @__PURE__ */ React.createElement("input", { value: toolInput, onChange: (e) => setToolInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter" && toolInput.trim()) {
      setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  }, placeholder: "Add tool...", style: { border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK } })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 } }, t("tags")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 } }, tags.map((tag) => /* @__PURE__ */ React.createElement("span", { key: tag, style: { background: "#e0eaff", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 } }, tag, /* @__PURE__ */ React.createElement(X, { size: 12, color: CERULEAN, onClick: () => setTags(tags.filter((x) => x !== tag)), style: { cursor: "pointer" } }))), /* @__PURE__ */ React.createElement("input", { value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }, placeholder: t("addTagPlaceholder"), style: { border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK } }))))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 40, borderTop: `1px solid ${GRAY_LIGHT}`, paddingTop: 32, paddingBottom: 64 } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 20, fontWeight: 700, color: BLACK, marginBottom: 8 } }, "N\u1ED9i dung chi ti\u1EBFt (Case Study Builder)"), /* @__PURE__ */ React.createElement("p", { style: { color: MUTED, fontSize: 13, marginBottom: 24 } }, "S\u1EED d\u1EE5ng c\xE1c kh\u1ED1i (Blocks) d\u01B0\u1EDBi \u0111\xE2y \u0111\u1EC3 tr\xECnh b\xE0y t\xE1c ph\u1EA9m c\u1EE7a b\u1EA1n th\xE0nh m\u1ED9t b\xE0i thuy\u1EBFt tr\xECnh chuy\xEAn nghi\u1EC7p nh\u01B0 tr\xEAn Behance."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 20, marginBottom: 24 } }, blocks.map((block, i) => /* @__PURE__ */ React.createElement("div", { key: block.id, style: { padding: 20, borderRadius: 12, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => removeBlock(block.id), style: { position: "absolute", top: 12, right: 12, cursor: "pointer", color: CRIMSON, fontWeight: "bold" } }, "\xD7"), block.type === "text" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 12px 0", fontSize: 14 } }, "Kh\u1ED1i V\u0103n B\u1EA3n (Text)"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: block.content,
      onChange: (e) => updateBlock(block.id, { content: e.target.value }),
      placeholder: "Nh\u1EADp ti\xEAu \u0111\u1EC1 ho\u1EB7c \u0111o\u1EA1n m\xF4 t\u1EA3...",
      style: { width: "100%", padding: 12, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, minHeight: 80, boxSizing: "border-box" }
    }
  )), block.type === "image" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 12px 0", fontSize: 14 } }, "Kh\u1ED1i H\xECnh \u1EA2nh (Image)"), block.data.url ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "center" } }, /* @__PURE__ */ React.createElement("img", { src: block.data.url, alt: "", style: { height: 100, objectFit: "cover", borderRadius: 8 } }), /* @__PURE__ */ React.createElement("button", { onClick: () => updateBlock(block.id, { data: { ...block.data, url: "" } }), style: { padding: "6px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, background: "#fff" } }, "\u0110\u1ED5i \u1EA3nh")) : /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "file",
      accept: "image/*",
      onChange: async (e) => {
        if (e.target.files?.[0]) {
          const url = await readFileAsDataURL(e.target.files[0]);
          updateBlock(block.id, { data: { ...block.data, url } });
        }
      }
    }
  )), block.type === "color" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 12px 0", fontSize: 14 } }, "B\u1EA3ng M\xE0u (Color Palette)"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" } }, block.data.colors.map((c, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement("input", { type: "color", value: c, onChange: (e) => {
    const newColors = [...block.data.colors];
    newColors[idx] = e.target.value;
    updateBlock(block.id, { data: { ...block.data, colors: newColors } });
  }, style: { width: 40, height: 40, padding: 0, border: "none", cursor: "pointer", borderRadius: 4 } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, textTransform: "uppercase" } }, c))), /* @__PURE__ */ React.createElement("button", { onClick: () => updateBlock(block.id, { data: { ...block.data, colors: [...block.data.colors, "#ffffff"] } }), style: { width: 40, height: 40, borderRadius: "50%", border: `1px dashed ${MUTED}`, background: "transparent", cursor: "pointer" } }, "+"))), block.type === "typography" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 12px 0", fontSize: 14 } }, "Font Ch\u1EEF (Typography)"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: block.data.fontName,
      onChange: (e) => updateBlock(block.id, { data: { ...block.data, fontName: e.target.value } }),
      style: { padding: "8px 12px", borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, width: "100%", boxSizing: "border-box", fontSize: 14 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "Inter" }, "Inter"),
    /* @__PURE__ */ React.createElement("option", { value: "Roboto" }, "Roboto"),
    /* @__PURE__ */ React.createElement("option", { value: "Outfit" }, "Outfit"),
    /* @__PURE__ */ React.createElement("option", { value: "Playfair Display" }, "Playfair Display"),
    /* @__PURE__ */ React.createElement("option", { value: "Montserrat" }, "Montserrat"),
    /* @__PURE__ */ React.createElement("option", { value: "Lora" }, "Lora")
  ), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 12, padding: 16, background: GRAY_BG, borderRadius: 8, fontSize: 24, fontFamily: block.data.fontName } }, "Aa Bb Cc Dd Ee 01234"))))), /* @__PURE__ */ React.createElement("h4", { style: { fontSize: 14, fontWeight: 600, color: MUTED, marginBottom: 12 } }, "Th\xEAm kh\u1ED1i n\u1ED9i dung:"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => addBlock("text"), style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" } }, "+ V\u0103n b\u1EA3n (Text)"), /* @__PURE__ */ React.createElement("button", { onClick: () => addBlock("image"), style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" } }, "+ H\xECnh \u1EA3nh (Image)"), /* @__PURE__ */ React.createElement("button", { onClick: () => addBlock("color"), style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" } }, "+ B\u1EA3ng m\xE0u (Color Palette)"), /* @__PURE__ */ React.createElement("button", { onClick: () => addBlock("typography"), style: { display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, border: `1px dashed ${CERULEAN}`, background: "#eef4ff", color: CERULEAN, fontWeight: 600, cursor: "pointer" } }, "+ Font ch\u1EEF (Typography)"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 24, padding: 32, background: "#f9f9f9", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 18, fontWeight: 700, color: BLACK, marginBottom: 16 } }, "Ho\xE0n t\u1EA5t v\xE0 \u0110\u0103ng \u0111\u1ED3 \xE1n"), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 14, fontWeight: 600, color: BLACK, display: "block", marginBottom: 8 } }, "M\u1EE5c \u0111\xEDch n\u1ED9p b\xE0i"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: submissionType,
      onChange: (e) => setSubmissionType(e.target.value),
      style: { width: "100%", padding: "12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, outline: "none", fontSize: 14 }
    },
    /* @__PURE__ */ React.createElement("option", { value: "Final" }, "N\u1ED9p b\u1EA3n cu\u1ED1i (Final)"),
    /* @__PURE__ */ React.createElement("option", { value: "Revision" }, "G\u1EEDi xin g\xF3p \xFD (Request for Revision)")
  )), submissionType === "Final" && /* @__PURE__ */ React.createElement("div", { style: { background: "#FEFCF3", border: `1px solid #F0E6CC`, borderRadius: 10, padding: "14px 16px", marginBottom: 20 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setAgreedToTerms(!agreedToTerms), style: { width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreedToTerms ? CERULEAN : GRAY_LIGHT}`, background: agreedToTerms ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" } }, agreedToTerms && /* @__PURE__ */ React.createElement(Check, { size: 12, color: "#fff", strokeWidth: 3 })), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 } }, t("fullCommitment"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10 } }, /* @__PURE__ */ React.createElement("div", { onClick: () => setNotifyOnConfirm(!notifyOnConfirm), style: { width: 18, height: 18, borderRadius: 4, border: `2px solid ${notifyOnConfirm ? CERULEAN : GRAY_LIGHT}`, background: notifyOnConfirm ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" } }, notifyOnConfirm && /* @__PURE__ */ React.createElement(Check, { size: 12, color: "#fff", strokeWidth: 3 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#666" } }, t("notifyOnConfirmText")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12 } }, isFromDraft && /* @__PURE__ */ React.createElement("button", { onClick: () => setShowUploadPreview(true), style: { flex: 1, padding: "13px", borderRadius: 10, border: `1px solid ${CERULEAN}`, background: "transparent", color: CERULEAN, fontSize: 15, fontWeight: 700, cursor: "pointer" } }, "Preview"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowPopup(true), disabled: submissionType === "Final" && !agreedToTerms, style: { flex: isFromDraft ? 1 : "auto", width: isFromDraft ? "auto" : "100%", padding: "13px", borderRadius: 10, border: "none", background: submissionType === "Revision" || agreedToTerms ? CERULEAN : GRAY_LIGHT, color: submissionType === "Revision" || agreedToTerms ? "#fff" : MUTED, fontSize: 15, fontWeight: 700, cursor: submissionType === "Revision" || agreedToTerms ? "pointer" : "not-allowed", letterSpacing: "0.3px" } }, submissionType === "Final" ? t("submitArtwork") : "N\u1ED9p b\xE0i")), submissionType === "Final" && /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", fontSize: 11, color: MUTED, marginTop: 8 } }, t("postSubmissionNote")))), showUploadPreview && isFromDraft && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 1e4, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden", fontFamily: "'Inter', sans-serif" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: -1, pointerEvents: "none" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", top: 0, left: 0, right: 0, height: 64, background: "#191919", zIndex: 1010, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 24px", borderBottom: "1px solid #333" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowUploadPreview(false), style: { background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 18, fontWeight: 900, color: "#fff", letterSpacing: "-0.5px", marginRight: 8 } }, "B\u0113hance"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("img", { src: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60", style: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "1px solid #333" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 15, fontWeight: 600, color: "#fff", lineHeight: "1.2" } }, title || "Untitled Project"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#bbb" } }, /* @__PURE__ */ React.createElement("span", { style: { cursor: "pointer", color: "#fff", fontWeight: 400 } }, currentUser?.fullName || currentUser?.name || "Author"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", { style: { color: "#0057ff", fontWeight: 600, cursor: "pointer", transition: "color 0.2s" } }, "Follow"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    setShowUploadPreview(false);
    setShowPopup(true);
  }, style: { padding: "8px 24px", borderRadius: 20, background: "#10a359", color: "#fff", border: "none", fontWeight: "bold", fontSize: 13, cursor: "pointer" } }, "Submit Artwork"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowUploadPreview(false), style: { background: "transparent", border: "none", color: "#888", width: 36, height: 36, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", marginLeft: 4 }, onMouseEnter: (e) => {
    e.currentTarget.style.background = "rgba(255,255,255,0.1)";
    e.currentTarget.style.color = "#fff";
  }, onMouseLeave: (e) => {
    e.currentTarget.style.background = "transparent";
    e.currentTarget.style.color = "#888";
  } }, /* @__PURE__ */ React.createElement(X, { size: 20 })))), /* @__PURE__ */ React.createElement("div", { className: "hidden xl:flex flex-col items-center gap-4 fixed right-6 top-[88px] z-[10020]" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-1.5 cursor-pointer group" }, /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("img", { src: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", className: "w-9 h-9 rounded-full border-2 border-[#151515] object-cover group-hover:scale-105 transition-transform" }), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-1 -right-1 w-4 h-4 bg-[#0057ff] rounded-full flex items-center justify-center text-white border-[1.5px] border-[#151515] font-bold text-[12px] leading-none pb-[1px]" }, "+")), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-medium text-white" }, "Follow")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-1.5 cursor-pointer group" }, /* @__PURE__ */ React.createElement("div", { className: "w-9 h-9 rounded-full bg-white flex items-center justify-center group-hover:scale-105 transition-transform shadow-md" }, /* @__PURE__ */ React.createElement(Mail, { size: 16, className: "text-black" })), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-medium text-white" }, "Message")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center gap-1.5 cursor-pointer group" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 rounded-full bg-[#0057ff] flex items-center justify-center group-hover:scale-105 transition-transform shadow-md shadow-blue-500/20" }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 18, className: "text-white fill-white" })), /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-medium text-white" }, "Appreciate"))), /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-8 left-1/2 -translate-x-1/2 bg-[#525760] rounded-xl flex items-center gap-6 z-[10020] shadow-2xl overflow-hidden pr-12 pl-4 py-3" }, /* @__PURE__ */ React.createElement("button", { className: "absolute top-2 right-2 text-white/60 hover:text-white transition-colors" }, /* @__PURE__ */ React.createElement(X, { size: 16 })), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-white rounded flex items-center justify-center shrink-0" }, /* @__PURE__ */ React.createElement(Image, { size: 24, className: "text-gray-300" })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold text-[15px] leading-tight" }, title || "Untitled Project"), /* @__PURE__ */ React.createElement("span", { className: "text-white/80 text-[13px] font-medium" }, currentUser?.fullName || currentUser?.name || "Author"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("button", { className: "bg-white hover:bg-gray-100 text-black font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 bg-black text-white rounded-full flex items-center justify-center font-bold text-[12px] pb-[1px]" }, "+"), "Follow ", currentUser?.fullName ? currentUser.fullName.split(" ").pop() : currentUser?.name || "Author"), /* @__PURE__ */ React.createElement("button", { className: "bg-[#0057ff] hover:bg-blue-700 text-white font-semibold text-[13px] px-4 py-2 rounded-full flex items-center gap-2 transition-colors" }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 16, className: "fill-white" }), "Appreciate"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", width: "100%", justifyContent: "center", position: "relative", minHeight: "100vh", paddingTop: 64 } }, /* @__PURE__ */ React.createElement("div", { style: { width: "calc(100% - 200px)", maxWidth: 1400, display: "flex", flexDirection: "column", background: "#151515", margin: "0 auto", minHeight: "calc(100vh - 64px)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", width: "100%", background: "transparent" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", background: "#ffffff", paddingBottom: blocks.length > 0 || coverImage ? 0 : 400 } }, coverImage && /* @__PURE__ */ React.createElement("div", { style: { width: "100%", margin: "0 auto", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("img", { src: coverImage, style: { width: "100%", height: "auto", display: "block" } })), blocks.length === 0 && !coverImage ? /* @__PURE__ */ React.createElement("div", { style: { height: 400, display: "flex", alignItems: "center", justifyContent: "center", color: "#888", background: "#ffffff" } }, "Empty Project") : blocks.map((block) => /* @__PURE__ */ React.createElement("div", { key: block.id, style: { width: block.fullWidth ? "100%" : "min(100%, 1024px)", margin: "0 auto", padding: block.fullWidth ? "0" : `0px`, marginBottom: 16 } }, block.type === "image" && block.content && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: block.content, style: { width: "100%", height: "auto", display: "block" } }), block.caption && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center", fontSize: 13, color: "#666", marginTop: 8, fontStyle: "italic" } }, block.caption)), block.type === "text" && /* @__PURE__ */ React.createElement("div", { style: { color: "#212121", padding: 16, fontSize: 17, fontFamily: "sans-serif", whiteSpace: "pre-wrap" }, dangerouslySetInnerHTML: { __html: block.content ? block.content.replace(/\n/g, "<br/>") : "" } }), block.type === "grid" && /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" } }, "Grid Preview"), block.type === "video" && /* @__PURE__ */ React.createElement("div", { style: { width: "100%", height: 300, background: "rgba(0,0,0,0.05)", border: "1px dashed rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(0,0,0,0.4)" } }, "Video/Audio Preview"))))))), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#111111", padding: "60px 40px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { style: { width: 80, height: 80, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", marginBottom: 32, cursor: "not-allowed" } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 36, color: "#fff" })), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 32, fontWeight: "bold", margin: "0 0 16px 0", textAlign: "center" } }, title || "Untitled Project"), description && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 18, color: "#aaa", textAlign: "center", maxWidth: 800 } }, description), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 24, color: "#888", fontSize: 14, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 16 }), " 0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Eye, { size: 16 }), " 0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 16 }), " 0")), /* @__PURE__ */ React.createElement("p", { style: { color: "#888", fontSize: 13, margin: "0 0 40px 0" } }, "Published: ", (/* @__PURE__ */ new Date()).toLocaleDateString())), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "#f9f9f9", padding: "60px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 65%", paddingRight: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, display: "flex", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("img", { src: currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User"), style: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("textarea", { placeholder: "What are your thoughts on this project?", style: { width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontSize: 14, fontFamily: "inherit" }, disabled: true }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", { disabled: true, style: { background: "#E8E8E8", color: "#666", border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: "not-allowed" } }, "Post a Comment")))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" } }, "No comments yet.")), /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" } }, "Owner"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("img", { src: currentUser?.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(currentUser?.fullName || currentUser?.name || "User"), style: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: 0, fontSize: 15, fontWeight: "bold", color: "#191919" } }, currentUser?.fullName || currentUser?.name || "Author")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "3" })), "Vietnam"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { style: { background: "#0057ff", color: "#fff", border: "none", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 } }, "+"), " Follow"), /* @__PURE__ */ React.createElement("button", { style: { background: "#fff", color: "#0057ff", border: "1px solid #EAEAEA", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Mail, { size: 16 }), " Message"))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("h3", { style: { margin: "0 0 16px 0", fontSize: 15, fontWeight: "bold", color: "#191919" } }, title || "Untitled Project"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, color: "#888", fontSize: 13 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 14 }), " 0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Eye, { size: 14 }), " 0"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 14 }), " 0"))))))))), /* @__PURE__ */ React.createElement(EbookViewerModal, { isOpen: isEbookViewerOpen, onClose: () => setIsEbookViewerOpen(false), onUseEbook: handleUseEbook }));
}
function OrderModal({ setPage, activeArtworkId, onClose }) {
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: ""
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
      let targetRecipientSlug = "uef-design-gallery";
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
      } catch {
      }
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
          description: orderData.description.trim()
        })
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
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#212121]" }, t("orderArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 20 } }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-3" }, t("orderDescription")), /* @__PURE__ */ React.createElement("div", { style: { background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: 8, padding: "12px 14px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "start", gap: 8 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#D97706", style: { flexShrink: 0, marginTop: "2px" } }), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#92400E]" }, /* @__PURE__ */ React.createElement("strong", null, t("notice")), " ", t("orderNotice"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 } }, t("fullName")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: orderData.name,
      onChange: (e) => setOrderData({ ...orderData, name: e.target.value }),
      placeholder: t("placeholderFullName"),
      style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 } }, t("emailStar")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      value: orderData.email,
      onChange: (e) => setOrderData({ ...orderData, email: e.target.value }),
      placeholder: "nguyenvana@example.com",
      style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 } }, t("phoneNumber")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "tel",
      value: orderData.phone,
      onChange: (e) => setOrderData({ ...orderData, phone: e.target.value }),
      placeholder: "090xxx xxx xx",
      style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 } }, t("company")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: orderData.company,
      onChange: (e) => setOrderData({ ...orderData, company: e.target.value }),
      placeholder: t("placeholderCompany"),
      style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK }
    }
  ))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: MUTED, marginBottom: 6 } }, t("requirementsDescription")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: orderData.description,
      onChange: (e) => setOrderData({ ...orderData, description: e.target.value }),
      placeholder: t("orderDescriptionPlaceholder"),
      rows: 4,
      style: { width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", resize: "vertical", minHeight: 100, boxSizing: "border-box", color: BLACK }
    }
  )))), /* @__PURE__ */ React.createElement("div", { className: "p-6 border-t border-[#E0E0E0] flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, disabled: sendingOrder, style: { flex: 1, padding: "12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: BLACK, opacity: sendingOrder ? 0.6 : 1 } }, t("cancel")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleSubmit,
      disabled: sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim(),
      style: {
        flex: 1,
        padding: "12px",
        borderRadius: 8,
        border: "none",
        background: sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim() ? GRAY_LIGHT : "#059669",
        color: sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim() ? MUTED : "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: sendingOrder || !orderData.name.trim() || !orderData.email.trim() || !orderData.description.trim() ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      }
    },
    sendingOrder ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("sending")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ShoppingCart, { size: 16 }), " ", t("confirmOrder"))
  ))));
}
function FeedbackModal({ setPage, activeArtworkId, onClose, userProfile }) {
  const [feedbackData, setFeedbackData] = useState("");
  const [sending, setSending] = useState(false);
  const handleSubmit = async () => {
    if (!feedbackData.trim()) {
      alert("Vui l\xF2ng nh\u1EADp n\u1ED9i dung nh\u1EADn x\xE9t");
      return;
    }
    setSending(true);
    try {
      let targetRecipientId = null;
      let targetRecipientSlug = "uef-design-gallery";
      let actualTitle = "T\xE1c ph\u1EA9m";
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
      } catch {
      }
      await api.messages.send({
        recipientId: targetRecipientId,
        recipientSlug: targetRecipientId ? null : targetRecipientSlug,
        senderName: userProfile?.fullName || userProfile?.name || "Gi\u1EA3ng vi\xEAn",
        senderEmail: userProfile?.email || "",
        senderCompany: "UEF",
        purpose: "feedback",
        content: JSON.stringify({
          artworkId: activeArtworkId,
          artworkTitle: actualTitle,
          artworkImage: actualImage,
          description: feedbackData.trim()
        })
      });
      alert("\u0110\xE3 g\u1EEDi feedback th\xE0nh c\xF4ng!");
      onClose();
    } catch (e) {
      alert("L\u1ED7i khi g\u1EEDi feedback: " + (e?.message || "Vui l\xF2ng th\u1EED l\u1EA1i"));
    } finally {
      setSending(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4", onClick: onClose }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-lg overflow-hidden", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "text-xl font-bold text-[#212121]" }, "Feedback K\xEDn"), /* @__PURE__ */ React.createElement("button", { onClick: onClose, className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { className: "p-6" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-4" }, "Nh\u1EADn x\xE9t n\xE0y s\u1EBD \u0111\u01B0\u1EE3c g\u1EEDi tr\u1EF1c ti\u1EBFp v\xE0o h\u1ED9p th\u01B0 c\u1EE7a sinh vi\xEAn v\xE0 kh\xF4ng c\xF4ng khai tr\xEAn h\u1EC7 th\u1ED1ng."), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: "#666666", marginBottom: 6 } }, "N\u1ED9i dung nh\u1EADn x\xE9t"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: feedbackData,
      onChange: (e) => setFeedbackData(e.target.value),
      placeholder: "Nh\u1EADp g\xF3p \xFD, nh\u1EADn x\xE9t v\u1EC1 b\u1ED1 c\u1EE5c, m\xE0u s\u1EAFc, \xFD t\u01B0\u1EDFng...",
      rows: 6,
      style: { width: "100%", padding: "12px", borderRadius: 8, border: `1px solid #E0E0E0`, fontSize: 14, outline: "none", resize: "vertical", minHeight: 120, boxSizing: "border-box", color: "#212121" }
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "p-6 border-t border-[#E0E0E0] flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: onClose, disabled: sending, style: { flex: 1, padding: "12px", borderRadius: 8, border: `1px solid #E0E0E0`, background: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", color: "#212121", opacity: sending ? 0.6 : 1 } }, "H\u1EE7y"), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleSubmit,
      disabled: sending || !feedbackData.trim(),
      style: {
        flex: 1,
        padding: "12px",
        borderRadius: 8,
        border: "none",
        background: sending || !feedbackData.trim() ? "#E0E0E0" : "#1a4ba8",
        color: sending || !feedbackData.trim() ? "#666666" : "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: sending || !feedbackData.trim() ? "not-allowed" : "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8
      }
    },
    sending ? "\u0110ang g\u1EEDi..." : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Send, { size: 16 }), " G\u1EEDi Feedback")
  ))));
}
function DetailPage({ setPage, setActiveArtworkId, activeArtworkId, pageParams, onBookmarkClick, isBookmarked }) {
  const { user: authUser } = useAuth();
  const [art, setArt] = useState({
    title: t("loading"),
    subject: t("loading"),
    coverImageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    description: "",
    tags: [],
    toolsUsed: [],
    likeCount: 0,
    commentCount: 0,
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    user: null,
    userId: null,
    isPublic: true
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
  const [replyingTo, setReplyingTo] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [gradeScore, setGradeScore] = useState("");
  const [gradeComment, setGradeComment] = useState("");
  const [gradeIsVisible, setGradeIsVisible] = useState(false);
  const [existingGrade, setExistingGrade] = useState(null);
  const [savingGrade, setSavingGrade] = useState(false);
  const ebookViewerRef = useRef(null);
  const toggleEbookFullscreen = () => {
    if (!document.fullscreenElement) {
      ebookViewerRef.current?.requestFullscreen().catch((err) => {
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
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const badgeMenuRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(e) {
      if (showBadgeMenu && badgeMenuRef.current && !badgeMenuRef.current.contains(e.target)) {
        setShowBadgeMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showBadgeMenu]);
  const [fullscreenImageIndex, setFullscreenImageIndex] = React.useState(0);
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShareToast(true);
    setTimeout(() => setShareToast(false), 2e3);
  };
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [downloadFormat, setDownloadFormat] = useState("png");
  const [downloading, setDownloading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [isReadingEbook, setIsReadingEbook] = useState(false);
  const [readerOrientation, setReaderOrientation] = useState("portrait");
  const [orderData, setOrderData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    description: ""
  });
  const [sendingOrder, setSendingOrder] = useState(false);
  const [navbarHeight, setNavbarHeight] = useState(0);
  const [categoryCovers, setCategoryCovers] = useState({});
  const [toolCovers, setToolCovers] = useState({});
  useEffect(() => {
    fetch("/api/artworks/category-covers").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) {
        const map = {};
        data.forEach((item) => {
          map[item.subject] = item.coverImageUrl;
        });
        setCategoryCovers(map);
      } else {
        setCategoryCovers(data);
      }
    }).catch(() => {
    });
    fetch("/api/artworks/tool-covers").then((r) => r.json()).then((data) => {
      if (Array.isArray(data)) {
        const map = {};
        data.forEach((item) => {
          map[item.tool] = item.coverImageUrl;
        });
        setToolCovers(map);
      } else {
        setToolCovers(data);
      }
    }).catch(() => {
    });
  }, []);
  useEffect(() => {
    const h = (e) => {
      if (e.key === "Escape") setShowFullscreen(false);
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);
  useEffect(() => {
    const measure = () => {
      const header = document.querySelector("header");
      if (header) setNavbarHeight(header.offsetHeight);
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
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
  useEffect(() => {
    console.log("\u{1F464} DetailPage - authUser:", authUser);
    console.log("\u{1F464} DetailPage - currentUserId:", currentUserId);
    console.log("\u{1F464} DetailPage - currentUserRole:", currentUserRole);
  }, [authUser, currentUserId, currentUserRole]);
  useEffect(() => {
    if (pageParams?.commentId && !loading && comments.length > 0) {
      setTimeout(() => {
        const el = document.getElementById("comment-" + pageParams.commentId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.style.transition = "all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)";
          el.style.backgroundColor = "rgba(26, 75, 168, 0.12)";
          el.style.transform = "scale(1.02) translateX(8px)";
          el.style.padding = "12px";
          el.style.borderRadius = "12px";
          setTimeout(() => {
            el.style.backgroundColor = "transparent";
            el.style.transform = "scale(1) translateX(0)";
            el.style.padding = "0px";
          }, 3e3);
        }
      }, 500);
    }
  }, [pageParams?.commentId, loading, comments]);
  useEffect(() => {
    if (!activeArtworkId) return;
    setLoading(true);
    setActiveImageIdx(0);
    setLoadError(false);
    if (String(activeArtworkId).startsWith("mock-")) {
      const mockArt = window.MOCK_PROJECTS?.find((p) => p.id === activeArtworkId);
      if (mockArt) {
        let parsedSettings = {};
        try {
          parsedSettings = typeof mockArt.settingsData === "string" ? JSON.parse(mockArt.settingsData) : mockArt.settingsData;
        } catch (e) {
        }
        setArt({
          ...mockArt,
          subject: mockArt.subject || t("artwork"),
          tags: mockArt.tags || [],
          toolsUsed: mockArt.toolsUsed || [],
          description: mockArt.description || "",
          settings: parsedSettings
        });
        setIsLiked(false);
        setLikeCount(0);
        setComments(mockArt.comments || []);
        setExistingGrade(null);
        setLoading(false);
        return;
      }
    }
    api.artworks.incrementView(activeArtworkId).catch(() => {
    });
    api.artworks.get(activeArtworkId).then((res) => {
      let parsedSettings = {};
      if (res.settingsData) {
        try {
          parsedSettings = typeof res.settingsData === "string" ? JSON.parse(res.settingsData) : res.settingsData;
        } catch (e) {
        }
      }
      setArt({
        ...res,
        subject: res.subject || t("artwork"),
        tags: res.tags || [],
        toolsUsed: res.toolsUsed || [],
        description: res.description || "",
        settings: parsedSettings
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
      const mockArt = artworks.find((a) => String(a.id) === String(activeArtworkId));
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
    api.artworks.related(activeArtworkId, 6).then(setRelatedArtworks).catch(() => {
    });
  }, [activeArtworkId]);
  const handleLike = async () => {
    if (liking) return;
    if (!authUser) return alert(t("loginWithEmailToUse"));
    const now = Date.now();
    if (now - lastLikeTimeRef.current < 2e3) {
      alert("B\u1EA1n thao t\xE1c qu\xE1 nhanh, vui l\xF2ng \u0111\u1EE3i m\u1ED9t ch\xFAt!");
      return;
    }
    lastLikeTimeRef.current = now;
    setLiking(true);
    setAnimatingLike(true);
    setTimeout(() => setAnimatingLike(false), 300);
    const wasLiked = isLiked;
    setIsLiked(!wasLiked);
    setLikeCount((prev) => wasLiked ? Math.max(0, prev - 1) : prev + 1);
    try {
      if (wasLiked) {
        await api.artworks.unlike(activeArtworkId);
      } else {
        await api.artworks.like(activeArtworkId);
      }
    } catch {
      setIsLiked(wasLiked);
      setLikeCount((prev) => wasLiked ? prev + 1 : Math.max(0, prev - 1));
    }
    setLiking(false);
  };
  const handleAssignBadge = async (badgeId) => {
    if (assigningBadge) return;
    setAssigningBadge(true);
    try {
      const res = await api.badges.assign(badgeId, activeArtworkId);
      if (res.status === "assigned") {
        const badge = lecturerBadges.find((b) => b.id === badgeId);
        if (badge) {
          setArt((prev) => ({ ...prev, badges: [...prev.badges || [], badge] }));
        }
      } else {
        setArt((prev) => ({ ...prev, badges: (prev.badges || []).filter((b) => b.id !== badgeId) }));
      }
    } catch (e) {
      alert("Error assigning badge: " + e.message);
    }
    setAssigningBadge(false);
  };
  const [mentionState, setMentionState] = useState({ query: null, index: -1, results: [], inputId: null });
  const [mentionMap, setMentionMap] = useState({});
  const handleCommentChange = async (e, inputId) => {
    const val = e.target.value;
    setCommentText(val);
    const cursor = e.target.selectionStart;
    const textBefore = val.substring(0, cursor);
    const match = textBefore.match(/@([a-zA-Z0-9_ À-ỹ]*)$/);
    if (match) {
      const query = match[1];
      setMentionState({ query, index: cursor - match[0].length, results: mentionState.results, inputId });
      try {
        const res = await api.users.searchMentions(query);
        setMentionState((prev) => prev.query === query ? { ...prev, results: res || [] } : prev);
      } catch {
      }
    } else {
      setMentionState({ query: null, index: -1, results: [], inputId: null });
    }
  };
  const handleSelectMention = (user) => {
    const inputElement = mentionState.inputId ? document.getElementById(mentionState.inputId) : null;
    const textBefore = commentText.substring(0, mentionState.index);
    const textAfter = inputElement ? commentText.substring(inputElement.selectionStart) : "";
    const newText = textBefore + `@${user.fullName} ` + textAfter;
    setCommentText(newText);
    setMentionMap((prev) => ({ ...prev, [user.fullName]: user.id }));
    setMentionState({ query: null, index: -1, results: [], inputId: null });
    if (inputElement) setTimeout(() => inputElement.focus(), 50);
  };
  const renderCommentText = (comment) => {
    let content = comment.content || comment.Content || "";
    const parts = content.split(/(@\[.*?\]\(.*?\))/g);
    if (parts.length === 1 && comment.parentId && !comment.ParentId) {
      const parent = comments.find((c) => c.id === comment.parentId);
      return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-gray-500 italic text-sm block" }, "@", parent?.user?.fullName || "User"), content);
    }
    return parts.map((part, i) => {
      const match = part.match(/@\[(.*?)\]\((.*?)\)/);
      if (match) {
        return /* @__PURE__ */ React.createElement("span", { key: i, style: { color: "#0057ff", fontWeight: 600 } }, "@", match[1]);
      }
      return part;
    });
  };
  const handleSendComment = async () => {
    if (!commentText.trim()) return;
    if (!currentUserId) {
      alert(t("loginToComment"));
      return;
    }
    setSendingComment(true);
    try {
      let finalContent = commentText.trim();
      const ids = [];
      Object.keys(mentionMap).forEach((name) => {
        if (finalContent.includes(`@${name}`)) {
          finalContent = finalContent.replaceAll(`@${name}`, `@[${name}](${mentionMap[name]})`);
          ids.push(mentionMap[name]);
        }
      });
      const payload = {
        content: finalContent,
        positionX: pendingComment ? pendingComment.x : null,
        positionY: pendingComment ? pendingComment.y : null,
        targetImageIndex: pendingComment ? pendingComment.index : null,
        parentId: replyingTo?.id || null,
        mentionedUserIds: ids
      };
      const resData = await api.artworks.comments.create(activeArtworkId, payload);
      const rawComment = resData.comment || resData.Comment || resData;
      const newComment = {
        id: rawComment.id || rawComment.Id,
        content: rawComment.content || rawComment.Content,
        positionX: rawComment.positionX ?? rawComment.PositionX,
        positionY: rawComment.positionY ?? rawComment.PositionY,
        targetImageIndex: rawComment.targetImageIndex ?? rawComment.TargetImageIndex,
        createdAt: rawComment.createdAt || rawComment.CreatedAt || (/* @__PURE__ */ new Date()).toISOString(),
        user: rawComment.user || rawComment.User || { fullName: authUser?.fullName || "User", avatarUrl: authUser?.image || authUser?.avatarUrl || "" },
        parentId: rawComment.parentId ?? rawComment.ParentId ?? replyingTo?.id
      };
      setComments((prev) => [newComment, ...prev]);
      setCommentText("");
      setPendingComment(null);
      setReplyingTo(null);
      setMentionMap({});
      setActionSuccessToast("B\xECnh lu\u1EADn th\xE0nh c\xF4ng!");
      setTimeout(() => setActionSuccessToast(""), 3e3);
    } catch (e) {
      alert(t("commentError") + (e?.message || t("pleaseTryAgain")));
    }
    setSendingComment(false);
    setSendingComment(false);
  };
  const handleUpdateCommentPos = async (commentId, newX, newY) => {
    try {
      await api.artworks.comments.update(activeArtworkId, commentId, { positionX: newX, positionY: newY });
      setComments((prev) => prev.map((c) => {
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
    if (!window.confirm("B\u1EA1n c\xF3 ch\u1EAFc mu\u1ED1n x\xF3a nh\u1EADn x\xE9t n\xE0y?")) return;
    try {
      await api.artworks.comments.delete(activeArtworkId, commentId);
      setComments((prev) => prev.filter((c) => (c.id || c.Id) !== commentId));
      setActiveCommentId(null);
    } catch (e) {
      alert("Kh\xF4ng th\u1EC3 x\xF3a nh\u1EADn x\xE9t. L\u1ED7i: " + e?.message);
    }
  };
  const handleSaveGrade = async () => {
    if (!canGrade) return;
    const scoreStr = String(gradeScore).replace(",", ".");
    const scoreVal = parseFloat(scoreStr);
    if (!gradeScore || isNaN(scoreVal) || scoreVal < 0 || scoreVal > 10) {
      alert("Vui l\xF2ng nh\u1EADp \u0111i\u1EC3m h\u1EE3p l\u1EC7 t\u1EEB 0 \u0111\u1EBFn 10 (v\xED d\u1EE5: 8 ho\u1EB7c 8.5)");
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
      setActionSuccessToast("C\u1EADp nh\u1EADt \u0111i\u1EC3m th\xE0nh c\xF4ng!");
      setTimeout(() => setActionSuccessToast(""), 3e3);
    } catch (e) {
      if (String(activeArtworkId).length < 5) {
        setExistingGrade({
          score: scoreVal,
          comment: gradeComment,
          lecturer: { fullName: authUser?.fullName, email: authUser?.email }
        });
        setActionSuccessToast("C\u1EADp nh\u1EADt \u0111i\u1EC3m th\xE0nh c\xF4ng (D\u1EEF li\u1EC7u m\u1EABu)!");
        setTimeout(() => setActionSuccessToast(""), 3e3);
      } else {
        alert((t("gradeError") || "L\u1ED7i ch\u1EA5m \u0111i\u1EC3m: ") + " " + (e?.message || t("pleaseTryAgain")));
      }
    }
    setSavingGrade(false);
  };
  const getHighResImageUrl = (url) => {
    if (typeof url === "string" && url.includes("behance.net") && url.includes("/404/")) {
      return url.replace("/404/", "/original/");
    }
    return url;
  };
  const allImages = [art.coverImageUrl, ...art.fileUrls || []].filter(Boolean).map(getHighResImageUrl);
  const allImagesDeduped = [...new Set(allImages)];
  const activeImage = allImagesDeduped[activeImageIdx] || allImagesDeduped[0] || art.coverImageUrl;
  const parsedBlocks = art.blocksJson ? typeof art.blocksJson === "string" ? JSON.parse(art.blocksJson) : art.blocksJson : [];
  const semesterMeta = {
    HK1: { label: "N\u0103m 1", icon: /* @__PURE__ */ React.createElement(Rocket, { size: 12 }) },
    HK2: { label: "N\u0103m 2", icon: /* @__PURE__ */ React.createElement(BookOpen, { size: 12 }) },
    HK3: { label: "N\u0103m 3", icon: /* @__PURE__ */ React.createElement(GraduationCap, { size: 12 }) }
  };
  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const dStr = !dateStr.endsWith("Z") && !dateStr.includes("+") ? dateStr + "Z" : dateStr;
    const diff = Date.now() - new Date(dStr).getTime();
    const mins = Math.floor(diff / 6e4);
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
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
      img.src = imgUrl;
    });
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
    const blob = await new Promise((res) => canvas.toBlob((b) => res(b), mime, fmt === "jpg" ? 0.92 : void 0));
    return { blob, width: canvas.width, height: canvas.height };
  };
  const getPdfBlob = async ({ blob, width, height }) => {
    const imgBytes = new Uint8Array(await blob.arrayBuffer());
    const pw = 595, ph = 842;
    const scale = Math.min(pw / width, ph / height) * 0.95;
    const iw = Math.round(width * scale), ih = Math.round(height * scale);
    const pdf = [
      `%PDF-1.4
`,
      `1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj
`,
      `2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj
`,
      `3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 ${pw} ${ph}]/Contents 4 0 R/Resources<</XObject<</Im0 5 0 R>>>>>>endobj
`,
      `4 0 obj<</Length ${40 + iw + ih}>>stream
q ${iw} 0 0 ${ih} ${(pw - iw) / 2} ${(ph - ih) / 2} cm /Im0 Do Q
endstream
endobj
`,
      `5 0 obj<</Type/XObject/Subtype/Image/Width ${width}/Height ${height}/ColorSpace/DeviceRGB/BitsPerComponent 8/Filter/DCTDecode/Length ${imgBytes.length}>>stream
`
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
    const last = enc.encode(`
endstream
endobj
xref
0 7
0000000000 65535 f 
${offsets.slice(0, 6).map((o, i) => `${String(o).padStart(10, "0")} 00000 n`).join("\n")}
trailer<</Size 7/Root 1 0 R>>
startxref
${offsets[6]}
%%EOF
`);
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
    } catch (e) {
      console.error("Download error:", e);
      alert(t("downloadError"));
    }
    setDownloading(false);
  };
  const seasonNames = { HK1: "M\xF9a 1", HK2: "M\xF9a 2", HK3: "M\xF9a 3" };
  if (loadError) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", gap: 16, minHeight: "100vh", background: "#fff" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: 16, background: "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 28, color: CRIMSON })), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 18, fontWeight: 700, color: BLACK, margin: 0 } }, t("cannotLoadArtwork")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: MUTED, margin: 0, maxWidth: 400, textAlign: "center" } }, t("artworkNotFound")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { background: CERULEAN, color: "#fff", border: "none", borderRadius: 8, padding: "10px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToGallery")));
  }
  if (loading) return /* @__PURE__ */ React.createElement(GlobalLoading, null);
  const isAuthor = authUser?.id === art?.userId || authUser?.id === art?.user?.id || authUser?.role === "student" && art?.user?.fullName === authUser?.fullName;
  const canSeeGrade = isAuthor || canGrade;
  return /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, zIndex: 1e3, display: "flex", flexDirection: "column", overflowY: "auto", overflowX: "hidden" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", backdropFilter: "blur(5px)", zIndex: -1, pointerEvents: "none" } }), actionSuccessToast && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 40, right: 40, background: "#4CAF50", color: "#fff", padding: "16px 24px", borderRadius: 12, zIndex: 1e4, fontWeight: "bold", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", transition: "all 0.3s", display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(Check, { size: 20 }), actionSuccessToast), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { position: "fixed", top: 20, right: 24, zIndex: 1010, background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 48, height: 48, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, /* @__PURE__ */ React.createElement(X, { size: 24 })), /* @__PURE__ */ React.createElement("style", null, `
        @keyframes followCheck {
          0% { transform: scale(0); opacity: 0; }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); opacity: 1; }
        }
      `), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", width: "100%", justifyContent: "center", position: "relative", minHeight: "100vh" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 40, left: 0, width: "calc(50vw - min(50vw - 100px, 700px))", zIndex: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none", boxShadow: "none", filter: "none", background: "transparent" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { pointerEvents: "auto", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "none", outline: "none", filter: "none" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none", WebkitTextStroke: "0px", filter: "none", outline: "none" } }, "Previous")), /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 40, right: 0, width: "calc(50vw - min(50vw - 100px, 700px))", zIndex: 1010, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, pointerEvents: "none", boxShadow: "none", filter: "none", background: "transparent" } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { pointerEvents: "auto", background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s", boxShadow: "none", outline: "none", filter: "none" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, /* @__PURE__ */ React.createElement(ChevronRight, { size: 20 })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#fff", textShadow: "none", background: "transparent", userSelect: "none", WebkitTextStroke: "0px", filter: "none", outline: "none" } }, "Next")), /* @__PURE__ */ React.createElement("div", { style: { width: "calc(100% - 200px)", maxWidth: 1400, display: "flex", flexDirection: "column", background: "#151515", margin: "0 auto", paddingBottom: 60 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", background: "#191919", color: "#fff", width: "100%", zIndex: 50, position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, /* @__PURE__ */ React.createElement("img", { onClick: () => {
    if (art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug });
    else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId });
  }, src: art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60", style: { width: 44, height: 44, borderRadius: "50%", objectFit: "cover", cursor: "pointer", border: "2px solid #333" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 2 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, fontWeight: "bold", color: "#fff" } }, art.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#bbb" } }, /* @__PURE__ */ React.createElement("span", { onClick: () => {
    if (art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug });
    else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId });
  }, style: { cursor: "pointer", color: "#fff", fontWeight: 500 } }, art.user?.fullName), /* @__PURE__ */ React.createElement("span", { style: { background: "#0057ff", color: "#fff", fontSize: 9, padding: "2px 4px", borderRadius: 4, fontWeight: "bold" } }, "PRO"), /* @__PURE__ */ React.createElement("span", null, "\u2022"), /* @__PURE__ */ React.createElement("span", { onClick: () => {
    if (!isFollowing) {
      setIsFollowing(true);
      setIsFollowingAnimPlaying(true);
      setTimeout(() => setIsFollowingAnimPlaying(false), 2500);
    } else {
      setIsFollowing(false);
      setIsFollowingAnimPlaying(false);
    }
  }, style: { color: isFollowing ? "#bbb" : "#0057ff", fontWeight: "bold", cursor: "pointer", transition: "color 0.2s" } }, isFollowing ? "Following" : "Follow")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, paddingRight: art.badges && art.badges.length > 0 ? 48 : 0 } }, (() => {
    const lecturerComments = comments?.filter((c) => c.positionX != null && (c.user?.id || c.user?.Id) !== art.user?.id) || [];
    const uniqueLecturers = [];
    lecturerComments.forEach((c) => {
      const u = c.user || c.User;
      if (u && !uniqueLecturers.find((l) => (l.id || l.Id) === (u.id || u.Id))) {
        uniqueLecturers.push(u);
      }
    });
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16 } }, currentUserId === art.user?.id && uniqueLecturers.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowLecturerFilter(!showLecturerFilter),
        style: { padding: "8px 16px", borderRadius: 20, border: "1px solid rgba(255,255,255,0.2)", background: "rgba(255,255,255,0.1)", color: "#fff", fontSize: 13, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)",
        onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"
      },
      /* @__PURE__ */ React.createElement(User, { size: 14, color: "#aaa" }),
      filterLecturerId ? uniqueLecturers.find((l) => (l.id || l.Id) === filterLecturerId)?.fullName || uniqueLecturers.find((l) => (l.id || l.Id) === filterLecturerId)?.FullName || "Gi\u1EA3ng vi\xEAn" : "T\u1EA5t c\u1EA3 nh\u1EADn x\xE9t",
      /* @__PURE__ */ React.createElement(ChevronDown, { size: 14, color: "#aaa" })
    ), showLecturerFilter && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "100%", right: 0, marginTop: 8, background: "#fff", borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", width: 220, zIndex: 1e3, overflow: "hidden", border: "1px solid #eee", display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement(
      "div",
      {
        onClick: () => {
          setFilterLecturerId("");
          setShowLecturerFilter(false);
        },
        style: { padding: "12px 16px", cursor: "pointer", fontSize: 14, background: filterLecturerId === "" ? "#f0f4ff" : "#fff", color: filterLecturerId === "" ? CERULEAN : "#333", fontWeight: filterLecturerId === "" ? 600 : 400, borderBottom: "1px solid #eee", transition: "0.2s", display: "flex", alignItems: "center", gap: 8 },
        onMouseEnter: (e) => e.currentTarget.style.background = filterLecturerId === "" ? "#f0f4ff" : "#f9f9f9",
        onMouseLeave: (e) => e.currentTarget.style.background = filterLecturerId === "" ? "#f0f4ff" : "#fff"
      },
      filterLecturerId === "" && /* @__PURE__ */ React.createElement(Check, { size: 14, color: CERULEAN }),
      /* @__PURE__ */ React.createElement("span", { style: { marginLeft: filterLecturerId === "" ? 0 : 22 } }, "T\u1EA5t c\u1EA3 nh\u1EADn x\xE9t")
    ), uniqueLecturers.map((l) => {
      const id = l.id || l.Id;
      const isSelected = filterLecturerId === id;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: id,
          onClick: () => {
            setFilterLecturerId(id);
            setShowLecturerFilter(false);
          },
          style: { padding: "12px 16px", cursor: "pointer", fontSize: 14, background: isSelected ? "#f0f4ff" : "#fff", color: isSelected ? CERULEAN : "#333", fontWeight: isSelected ? 600 : 400, borderBottom: "1px solid #eee", transition: "0.2s", display: "flex", alignItems: "center", gap: 8 },
          onMouseEnter: (e) => e.currentTarget.style.background = isSelected ? "#f0f4ff" : "#f9f9f9",
          onMouseLeave: (e) => e.currentTarget.style.background = isSelected ? "#f0f4ff" : "#fff"
        },
        isSelected && /* @__PURE__ */ React.createElement(Check, { size: 14, color: CERULEAN }),
        /* @__PURE__ */ React.createElement("span", { style: { marginLeft: isSelected ? 0 : 22 } }, l.fullName || l.FullName)
      );
    }))), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleShare,
        style: { background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)",
        onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"
      },
      /* @__PURE__ */ React.createElement(Link, { size: 14 }),
      " Share"
    ), !art.tags?.includes("EBOOK") && !art.tags?.includes("EBOOK_LANDSCAPE") && (currentUserRole === "lecturer" || currentUserRole === "admin" || currentUserId === art.user?.id) && /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          setPinpointMode(!pinpointMode);
          if (pinpointMode) setPendingComment(null);
        },
        style: { background: pinpointMode ? CERULEAN : "rgba(255,255,255,0.1)", color: "#fff", border: pinpointMode ? "none" : "1px solid rgba(255,255,255,0.2)", padding: "8px 16px", borderRadius: 20, fontSize: 13, cursor: "pointer", fontWeight: "bold", display: "flex", alignItems: "center", gap: 8, transition: "0.2s" },
        onMouseEnter: (e) => {
          if (!pinpointMode) e.currentTarget.style.background = "rgba(255,255,255,0.2)";
        },
        onMouseLeave: (e) => {
          if (!pinpointMode) e.currentTarget.style.background = "rgba(255,255,255,0.1)";
        }
      },
      currentUserRole === "lecturer" || currentUserRole === "admin" ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(MapPin, { size: 14 }), " ", pinpointMode ? "T\u1EAFt Pinpoint Comment" : "B\u1EADt Pinpoint Comment") : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Eye, { size: 14 }), " ", pinpointMode ? "\u1EA8n nh\u1EADn x\xE9t" : "Hi\u1EC7n nh\u1EADn x\xE9t")
    ));
  })(), art.badges && art.badges.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 60, display: "flex", gap: 8 } }, art.badges.slice(0, 5).map((badge, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "group", style: { position: "relative", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 48, background: badge.colorCode || "#B49A65", color: badge.textColor || "#fff", clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%)", display: "flex", justifyContent: "center", paddingTop: 10, fontWeight: "bold", fontSize: 14 } }, getBadgeShortName(badge.name)), /* @__PURE__ */ React.createElement("div", { className: "absolute top-full mt-2 left-0 bg-white text-black p-3 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none", style: { borderRadius: 8, boxShadow: "0 4px 12px rgba(0,0,0,0.15)", left: "50%", transform: "translateX(-50%)", border: "1px solid #E0E0E0" } }, /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 4, textTransform: "uppercase", textAlign: "center" } }, "FEATURED IN ", art.subject?.toUpperCase() || art.category?.toUpperCase() || "ARTWORK"), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 13, fontWeight: "bold", color: badge.textColor === "#ffffff" || badge.textColor === "#fff" || !badge.textColor ? "#333" : badge.textColor, textAlign: "center" } }, badge.name, " ", /* @__PURE__ */ React.createElement("span", { style: { color: "#888", fontWeight: "normal", fontSize: 12, marginLeft: 4 } }, "\u2014 ", new Date(badge.assignedAt || art.createdAt).toLocaleDateString("en-GB"))))))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", width: "100%", background: art.isEbook || art.tags?.includes("IS_EBOOK") ? "#F0F2F5" : "transparent" } }, art.isEbook || art.tags?.includes("IS_EBOOK") ? isReadingEbook ? /* @__PURE__ */ React.createElement("div", { ref: ebookViewerRef, style: { width: "100%", padding: "40px 0", display: "flex", justifyContent: "center", position: "relative", background: "#F0F2F5" } }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    setIsReadingEbook(false);
  }, style: { position: "absolute", top: 20, right: 20, background: "rgba(0,0,0,0.5)", color: "#fff", border: "none", width: 40, height: 40, borderRadius: "50%", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 } }, /* @__PURE__ */ React.createElement(X, { size: 20 })), /* @__PURE__ */ React.createElement(
    HTMLFlipBook,
    {
      width: readerOrientation === "landscape" ? 560 : 400,
      height: readerOrientation === "landscape" ? 400 : 560,
      size: "stretch",
      minWidth: 315,
      maxWidth: 1e3,
      minHeight: 400,
      maxHeight: 1533,
      maxShadowOpacity: 0.5,
      showCover: true,
      mobileScrollSupport: true,
      className: "shadow-2xl mx-auto"
    },
    allImagesDeduped.map((img, index) => /* @__PURE__ */ React.createElement("div", { key: index, className: "demoPage bg-white overflow-hidden border border-gray-200" }, /* @__PURE__ */ React.createElement("img", { src: img.imageUrl || img, alt: `Page ${index + 1}`, className: "w-full h-full object-contain pointer-events-none", style: { width: "100%", height: "100%", display: "block" } })))
  ), /* @__PURE__ */ React.createElement("button", { onClick: toggleEbookFullscreen, style: { position: "absolute", top: 20, left: 20, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13, zIndex: 10, transition: "0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)" }, /* @__PURE__ */ React.createElement(Maximize2, { size: 16 }), " To\xE0n m\xE0n h\xECnh"), /* @__PURE__ */ React.createElement("button", { onClick: () => setReaderOrientation((prev) => prev === "portrait" ? "landscape" : "portrait"), style: { position: "absolute", top: 20, left: 180, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: 20, padding: "8px 16px", display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontWeight: "bold", fontSize: 13, zIndex: 10, transition: "0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)" }, "Chuy\u1EC3n h\u01B0\u1EDBng ", readerOrientation === "portrait" ? "Ngang" : "D\u1ECDc"), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "rgba(0,0,0,0.7)", color: "white", padding: "10px 24px", borderRadius: 30, fontSize: 14, fontWeight: 500, display: "flex", alignItems: "center", gap: 8, backdropFilter: "blur(4px)", pointerEvents: "none", zIndex: 10 } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", width: 8, height: 8, position: "relative" } }, /* @__PURE__ */ React.createElement("span", { style: { position: "absolute", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8", animation: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite", opacity: 0.75 } }), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", width: "100%", height: "100%", borderRadius: "50%", background: "#00c2a8" } })), "K\xE9o m\xE9p gi\u1EA5y ho\u1EB7c click v\xE0o g\xF3c \u0111\u1EC3 l\u1EADt trang")) : /* @__PURE__ */ React.createElement("div", { style: { width: "100%", padding: "60px 0", display: "flex", flexDirection: "column", alignItems: "center", position: "relative", background: "#F0F2F5", cursor: "pointer" }, onClick: () => {
    setIsReadingEbook(true);
    setReaderOrientation(art.tags?.includes("EBOOK_LANDSCAPE") ? "landscape" : "portrait");
  } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: getHighResImageUrl(art.coverImageUrl), style: { maxWidth: "80%", maxHeight: "70vh", objectFit: "contain", boxShadow: "0 10px 40px rgba(0,0,0,0.2)", borderRadius: 4 }, alt: "Ebook Cover" }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.2)", borderRadius: 4 } }, /* @__PURE__ */ React.createElement("button", { style: { background: "#1a4ba8", color: "white", padding: "16px 32px", borderRadius: 30, display: "flex", gap: 10, alignItems: "center", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 16, boxShadow: "0 8px 24px rgba(0,0,0,0.3)", pointerEvents: "none" } }, /* @__PURE__ */ React.createElement(BookOpen, { size: 24 }), " \u0110\u1ECDc E-book")))) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", width: "100%" } }, allImagesDeduped.map((img, i) => {
    if (!img) return null;
    const imageComments = comments?.filter((c) => c.targetImageIndex === i && c.positionX != null) || [];
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { width: "100%", position: "relative" }, onMouseEnter: (e) => {
      const overlay = e.currentTarget.querySelector(".img-hover-actions");
      if (overlay) overlay.style.opacity = 1;
    }, onMouseLeave: (e) => {
      const overlay = e.currentTarget.querySelector(".img-hover-actions");
      if (overlay) overlay.style.opacity = 0;
    } }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: img,
        style: { width: "100%", display: "block", cursor: pinpointMode && (currentUserRole === "lecturer" || currentUserRole === "admin") ? "crosshair" : "default" },
        alt: "",
        onClick: (e) => {
          if (!pinpointMode || currentUserRole !== "lecturer" && currentUserRole !== "admin") return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width * 100;
          const y = (e.clientY - rect.top) / rect.height * 100;
          setPendingComment({ x, y, index: i });
        }
      }
    ), pinpointMode && imageComments.map((c, idx) => {
      const uid = c.user?.id || c.User?.Id || c.userId;
      if (filterLecturerId && uid !== filterLecturerId && uid !== art.user?.id) return null;
      const isMine = uid === currentUserId;
      const cId = c.id || c.Id;
      const isActive = activeCommentId === cId;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: cId || idx,
          style: { position: "absolute", left: `${c.positionX ?? c.PositionX}%`, top: `${c.positionY ?? c.PositionY}%`, zIndex: isActive ? 100 : 10 }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            onPointerDown: (e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.dataset.startX = e.clientX;
              e.currentTarget.dataset.startY = e.clientY;
              e.currentTarget.dataset.isDragging = "false";
              if (isMine) setDraggingCommentId(cId);
            },
            onPointerMove: (e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId) && isMine) {
                const dx = Math.abs(e.clientX - parseFloat(e.currentTarget.dataset.startX));
                const dy = Math.abs(e.clientY - parseFloat(e.currentTarget.dataset.startY));
                if (dx > 3 || dy > 3) {
                  e.currentTarget.dataset.isDragging = "true";
                  const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                  const newX = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
                  const newY = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100));
                  e.currentTarget.parentElement.style.left = `${newX}%`;
                  e.currentTarget.parentElement.style.top = `${newY}%`;
                  e.currentTarget.parentElement.dataset.newX = newX;
                  e.currentTarget.parentElement.dataset.newY = newY;
                }
              }
            },
            onPointerUp: (e) => {
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
            },
            style: { width: 24, height: 24, background: isActive ? "#000" : CRIMSON, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", cursor: isMine ? "grab" : "pointer", userSelect: "none", touchAction: "none" },
            title: !isActive ? "Nh\u1EA5n \u0111\u1EC3 xem" : ""
          },
          idx + 1
        ),
        isActive && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, left: 16, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8, cursor: "default" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("img", { src: c.user?.avatarUrl || c.User?.AvatarUrl || "https://ui-avatars.com/api/?name=User", style: { width: 24, height: 24, borderRadius: "50%" }, alt: "" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: "bold", color: "#333" } }, c.user?.fullName || c.User?.FullName)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.5 } }, c.content || c.Content), isMine && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleDeleteComment(cId), style: { padding: "4px 8px", background: "#fee", color: "#e53e3e", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: "bold" } }, "X\xF3a")))
      );
    }), pendingComment && pendingComment.index === i && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: `${pendingComment.x}%`, top: `${pendingComment.y}%`, zIndex: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, background: CERULEAN, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 0 0 4px rgba(26,75,168,0.3)", animation: "pulse 1.5s infinite" } }, "+"), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, left: 16, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8 }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        autoFocus: true,
        placeholder: "Th\xEAm nh\u1EADn x\xE9t...",
        value: commentText,
        id: "comment-textarea-1",
        onChange: (e) => handleCommentChange(e, "comment-textarea-1"),
        style: { width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPendingComment(null);
      setCommentText("");
    }, style: { padding: "6px 12px", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 12, fontWeight: 600 } }, "H\u1EE7y"), /* @__PURE__ */ React.createElement("button", { onClick: handleSendComment, style: { padding: "6px 12px", background: CERULEAN, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 } }, "G\u1EEDi")))), /* @__PURE__ */ React.createElement("div", { className: "img-hover-actions", style: { position: "absolute", top: 20, right: 20, display: "flex", gap: 12, opacity: 0, transition: "opacity 0.2s" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => {
          if (onBookmarkClick) {
            const singleImgArt = { ...art, id: `${art.id}_img_${i}`, title: `${art.title} - H\xECnh ${i + 1}`, coverImageUrl: img, images: [img] };
            onBookmarkClick(singleImgArt);
          }
        },
        style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "#ffeb3b" : "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 },
        onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)",
        onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)"
      },
      /* @__PURE__ */ React.createElement(Bookmark, { size: 16, fill: isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "#ffeb3b" : "none" }),
      isBookmarked && isBookmarked(`${art.id}_img_${i}`) ? "\u0110\xE3 l\u01B0u" : "L\u01B0u Moodboard"
    ), /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId });
    }, style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)" }, /* @__PURE__ */ React.createElement(Briefcase, { size: 16 }), " More Like This"), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowDownloadModal(true), style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)" }, /* @__PURE__ */ React.createElement(Download, { size: 16 }), " Download"), /* @__PURE__ */ React.createElement("button", { onClick: () => handleShare(), style: { display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 24, background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold", fontSize: 14 }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.8)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(0,0,0,0.6)" }, /* @__PURE__ */ React.createElement(Link, { size: 16 }), " Permalink")));
  })), parsedBlocks && parsedBlocks.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32, padding: "40px 60px", background: "#fff" } }, parsedBlocks.map((block, i) => /* @__PURE__ */ React.createElement("div", { key: block.id || i, style: { width: "100%" } }, block.type === "text" && /* @__PURE__ */ React.createElement("div", { style: { fontSize: 16, lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap" } }, block.content), block.type === "typography" && block.data?.fontName && /* @__PURE__ */ React.createElement("div", { style: { padding: 48, border: "1px solid #eee", borderRadius: 16, textAlign: "center", background: "#f8fafc", margin: "32px 0", boxShadow: "inset 0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("link", { href: `https://fonts.googleapis.com/css2?family=${block.data.fontName.replace(/ /g, "+")}:wght@400;700&display=swap`, rel: "stylesheet" }), /* @__PURE__ */ React.createElement("h1", { style: { fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 100, margin: "0 0 16px 0", color: "#1e293b", lineHeight: 1 } }, "Aa"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 28, fontWeight: "bold", margin: "0 0 12px 0", color: "#334155" } }, block.data.fontName), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 18, color: "#64748b", margin: 0, letterSpacing: 3 } }, "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z"), /* @__PURE__ */ React.createElement("p", { style: { fontFamily: `"${block.data.fontName}", sans-serif`, fontSize: 18, color: "#64748b", margin: "12px 0 0 0", letterSpacing: 4 } }, "0 1 2 3 4 5 6 7 8 9")), block.type === "image" && block.data?.url && (() => {
    const imageIndex = 1e3 + i;
    const imageComments = comments?.filter((c) => c.targetImageIndex === imageIndex && c.positionX != null) || [];
    return /* @__PURE__ */ React.createElement("div", { style: { width: "100%", position: "relative" } }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: block.data.url,
        style: { width: "100%", borderRadius: 8, display: "block", cursor: pinpointMode && (currentUserRole === "lecturer" || currentUserRole === "admin") ? "crosshair" : "default" },
        alt: "",
        onClick: (e) => {
          if (!pinpointMode || currentUserRole !== "lecturer" && currentUserRole !== "admin") return;
          const rect = e.currentTarget.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width * 100;
          const y = (e.clientY - rect.top) / rect.height * 100;
          setPendingComment({ x, y, index: imageIndex });
        }
      }
    ), pinpointMode && imageComments.map((c, idx) => {
      const uid = c.user?.id || c.User?.Id || c.userId;
      if (filterLecturerId && uid !== filterLecturerId && uid !== art.user?.id) return null;
      const isMine = uid === currentUserId;
      const cId = c.id || c.Id;
      const isActive = activeCommentId === cId;
      return /* @__PURE__ */ React.createElement(
        "div",
        {
          key: cId || idx,
          style: { position: "absolute", left: `${c.positionX ?? c.PositionX}%`, top: `${c.positionY ?? c.PositionY}%`, zIndex: isActive ? 100 : 10 }
        },
        /* @__PURE__ */ React.createElement(
          "div",
          {
            onPointerDown: (e) => {
              e.currentTarget.setPointerCapture(e.pointerId);
              e.currentTarget.dataset.startX = e.clientX;
              e.currentTarget.dataset.startY = e.clientY;
              e.currentTarget.dataset.isDragging = "false";
              if (isMine) setDraggingCommentId(cId);
            },
            onPointerMove: (e) => {
              if (e.currentTarget.hasPointerCapture(e.pointerId) && isMine) {
                const dx = Math.abs(e.clientX - parseFloat(e.currentTarget.dataset.startX));
                const dy = Math.abs(e.clientY - parseFloat(e.currentTarget.dataset.startY));
                if (dx > 3 || dy > 3) {
                  e.currentTarget.dataset.isDragging = "true";
                  const rect = e.currentTarget.parentElement.parentElement.getBoundingClientRect();
                  const newX = Math.max(0, Math.min(100, (e.clientX - rect.left) / rect.width * 100));
                  const newY = Math.max(0, Math.min(100, (e.clientY - rect.top) / rect.height * 100));
                  e.currentTarget.parentElement.style.left = `${newX}%`;
                  e.currentTarget.parentElement.style.top = `${newY}%`;
                  e.currentTarget.parentElement.dataset.newX = newX;
                  e.currentTarget.parentElement.dataset.newY = newY;
                }
              }
            },
            onPointerUp: (e) => {
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
            },
            style: { width: 24, height: 24, background: isActive ? "#000" : CRIMSON, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.3)", cursor: isMine ? "grab" : "pointer", userSelect: "none", touchAction: "none" },
            title: !isActive ? "Nh\u1EA5n \u0111\u1EC3 xem" : ""
          },
          idx + 1
        ),
        isActive && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, left: 16, background: "#fff", padding: 16, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8, cursor: "default" }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("img", { src: c.user?.avatarUrl || c.User?.AvatarUrl || "https://ui-avatars.com/api/?name=User", style: { width: 24, height: 24, borderRadius: "50%" }, alt: "" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, fontWeight: "bold", color: "#333" } }, c.user?.fullName || c.User?.FullName)), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 14, color: "#444", whiteSpace: "pre-wrap", lineHeight: 1.5 } }, c.content || c.Content), isMine && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => handleDeleteComment(cId), style: { padding: "4px 8px", background: "#fee", color: "#e53e3e", border: "1px solid #fecaca", borderRadius: 4, cursor: "pointer", fontSize: 11, fontWeight: "bold" } }, "X\xF3a")))
      );
    }), pendingComment && pendingComment.index === imageIndex && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: `${pendingComment.x}%`, top: `${pendingComment.y}%`, zIndex: 100 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, background: CERULEAN, color: "#fff", borderRadius: "50%", transform: "translate(-50%, -50%)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: 12, boxShadow: "0 0 0 4px rgba(26,75,168,0.3)", animation: "pulse 1.5s infinite" } }, "+"), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 16, left: 16, background: "#fff", padding: 12, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.15)", width: 250, display: "flex", flexDirection: "column", gap: 8 }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(
      "textarea",
      {
        autoFocus: true,
        placeholder: "Th\xEAm nh\u1EADn x\xE9t...",
        value: commentText,
        id: "comment-textarea-2",
        onChange: (e) => handleCommentChange(e, "comment-textarea-2"),
        style: { width: "100%", padding: 8, borderRadius: 6, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, resize: "vertical", minHeight: 60, boxSizing: "border-box" }
      }
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
      setPendingComment(null);
      setCommentText("");
    }, style: { padding: "6px 12px", background: "transparent", border: "none", color: "#666", cursor: "pointer", fontSize: 12, fontWeight: 600 } }, "H\u1EE7y"), /* @__PURE__ */ React.createElement("button", { onClick: handleSendComment, style: { padding: "6px 12px", background: CERULEAN, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontSize: 12, fontWeight: 600 } }, "G\u1EEDi")))));
  })(), block.type === "color" && block.data?.colors && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center", padding: "32px 0" } }, block.data.colors.map((c, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 80, height: 80, borderRadius: "50%", background: c, boxShadow: "0 4px 12px rgba(0,0,0,0.1)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 } }, c))))))), /* @__PURE__ */ React.createElement("div", { style: { background: "#111111", padding: "60px 40px", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center" } }, /* @__PURE__ */ React.createElement("button", { onClick: handleLike, style: { width: 80, height: 80, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", border: "none", cursor: "pointer", marginBottom: 32, transition: "transform 0.2s", transform: animatingLike ? "scale(1.2)" : "scale(1)" }, onMouseEnter: (e) => {
    if (!animatingLike) e.currentTarget.style.transform = "scale(1.05)";
  }, onMouseLeave: (e) => {
    if (!animatingLike) e.currentTarget.style.transform = "scale(1)";
  } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 36, color: "#fff", fill: isLiked ? "#fff" : "none" })), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 32, fontWeight: "bold", margin: "0 0 16px 0", textAlign: "center" } }, art.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 24, color: "#888", fontSize: 14, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 16 }), " ", likeCount || 0), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Eye, { size: 16 }), " ", art.viewCount || art._count?.views || 0), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 16 }), " ", comments?.length || 0)), /* @__PURE__ */ React.createElement("p", { style: { color: "#888", fontSize: 13, margin: "0 0 16px 0" } }, "Published: ", new Date(art.createdAt || Date.now()).toLocaleDateString()), art.aiScore != null && /* @__PURE__ */ React.createElement("div", { style: {
    background: art.aiScore >= 80 ? "linear-gradient(to right, #1a4ba8, #0ea5e9)" : art.aiScore >= 50 ? "linear-gradient(to right, #facc15, #eab308)" : "linear-gradient(to right, #ef4444, #dc2626)",
    borderRadius: 6,
    padding: "6px 14px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    boxShadow: "0 2px 5px rgba(0,0,0,0.4)",
    marginBottom: 60
  } }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 16, color: art.aiScore >= 50 && art.aiScore < 80 ? "#111" : "#fff" }), /* @__PURE__ */ React.createElement("span", { style: { color: art.aiScore >= 50 && art.aiScore < 80 ? "#111" : "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.5px" } }, "AI ANALYSIS (Originality: ", art.aiScore, "%)")), art.aiScore == null && /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 60 } }), /* @__PURE__ */ React.createElement("div", { style: { width: "100%", display: "flex", flexDirection: "column", borderTop: "1px solid #333", paddingTop: 40 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("img", { onClick: () => {
    if (art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug });
    else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId });
  }, src: art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60", style: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover", cursor: "pointer" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("h3", { onClick: () => {
    if (art.user?.portfolioSettings?.portfolioSlug) setPage("portfolio", { portfolioSlug: art.user.portfolioSettings.portfolioSlug });
    else setPage("portfolio", { portfolioSlug: art.user?.id || art.userId });
  }, style: { margin: 0, fontSize: 16, fontWeight: "bold", color: "#fff", cursor: "pointer" } }, art.user?.fullName), /* @__PURE__ */ React.createElement("span", { style: { background: "#0057ff", color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" } }, "PRO")), /* @__PURE__ */ React.createElement("button", { onClick: () => setIsFollowing(!isFollowing), style: { background: isFollowing ? "rgba(255,255,255,0.2)" : "#0057ff", color: "#fff", border: "none", padding: "6px 20px", borderRadius: 16, fontSize: 12, fontWeight: "bold", marginTop: 8, cursor: "pointer" } }, isFollowing ? "Following" : "Follow"))), /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 } }, relatedArtworks.slice(0, 4).map((rArt) => /* @__PURE__ */ React.createElement("div", { key: rArt.id, onClick: () => setPage("detail", { artworkId: rArt.id }), onMouseEnter: (e) => e.currentTarget.lastChild.style.opacity = 1, onMouseLeave: (e) => e.currentTarget.lastChild.style.opacity = 0, style: { cursor: "pointer", borderRadius: 8, overflow: "hidden", background: "#222", position: "relative", minWidth: 0 } }, /* @__PURE__ */ React.createElement("img", { src: rArt.coverImageUrl, style: { width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 50%)", opacity: 0, transition: "opacity 0.3s ease-in-out", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 16 } }, /* @__PURE__ */ React.createElement("span", { style: { color: "#fff", fontSize: 14, fontWeight: "bold", marginBottom: 8, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" } }, rArt.title), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, color: "#ccc", fontSize: 12, fontWeight: "bold" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 12 }), " ", rArt.likes || 0), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 12 }), " ", rArt.comments?.length || 0), /* @__PURE__ */ React.createElement("span", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Eye, { size: 12 }), " ", rArt.viewCount || rArt._count?.views || 0)))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%", marginTop: 40, borderTop: "1px solid #333", paddingTop: 30 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", transition: "all 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20 }), " V\u1EC1 th\u01B0 vi\u1EC7n"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), style: { background: "rgba(255,255,255,0.1)", border: "none", color: "#fff", padding: "12px 24px", borderRadius: 30, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontWeight: "bold", transition: "all 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.2)", onMouseLeave: (e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)" }, "Xem ti\u1EBFp ", /* @__PURE__ */ React.createElement(ChevronRight, { size: 20 }))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", background: "#f9f9f9", padding: "60px 40px" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 65%", paddingRight: 60 } }, existingGrade && canSeeGrade && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderTop: `4px solid ${CRIMSON}`, borderRadius: 8, padding: 32, marginBottom: 40, boxShadow: "0 4px 20px rgba(0,0,0,0.03)" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #EAEAEA", paddingBottom: 16, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 14, fontWeight: 700, color: MUTED, letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px 0" } }, "\u0110i\u1EC3m s\u1ED1 \u0111\u1ED3 \xE1n"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 42, fontWeight: 900, color: CERULEAN, lineHeight: 1 } }, existingGrade.score), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 16, color: MUTED, fontWeight: 600 } }, "/ 10"))), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("span", { style: { display: "inline-block", background: "#f0f4fc", color: CERULEAN, padding: "4px 12px", borderRadius: 4, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 8 } }, "\u0110\xE3 ch\u1EA5m \u0111i\u1EC3m"), existingGrade.lecturer && /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right" } }, /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 2px 0", fontSize: 13, fontWeight: 700, color: BLACK } }, existingGrade.lecturer.fullName), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 12, color: MUTED } }, existingGrade.lecturer.email)))), existingGrade.comment && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { style: { fontSize: 13, fontWeight: 700, color: BLACK, marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 } }, "Nh\u1EADn x\xE9t t\u1EEB Gi\u1EA3ng vi\xEAn ", existingGrade.isVisibleToStudent === false && /* @__PURE__ */ React.createElement("span", { style: { color: CRIMSON, fontSize: 11 } }, "(K\xEDn)")), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 15, color: "#333", lineHeight: 1.6, fontStyle: "italic" } }, '"', existingGrade.comment, '"'))), ["lecturer", "admin"].includes(authUser?.role) && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: "bold", marginBottom: 16, color: "#191919", display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(PenTool, { size: 18 }), " ", existingGrade ? t("updateGrade") : t("gradeThisArtwork")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginBottom: 12 } }, /* @__PURE__ */ React.createElement("input", { type: "text", value: gradeScore, onChange: (e) => setGradeScore(e.target.value.replace(/[^0-9.,]/g, "")), placeholder: t("scoreLabel"), style: { width: 100, padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", fontSize: 14 } }), /* @__PURE__ */ React.createElement("input", { type: "text", value: gradeComment, onChange: (e) => setGradeComment(e.target.value), placeholder: t("feedbackOptional"), style: { flex: 1, padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", fontSize: 14 } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", id: "gradeVisible", checked: gradeIsVisible, onChange: (e) => setGradeIsVisible(e.target.checked), style: { cursor: "pointer" } }), /* @__PURE__ */ React.createElement("label", { htmlFor: "gradeVisible", style: { fontSize: 13, color: MUTED, cursor: "pointer" } }, "Cho ph\xE9p sinh vi\xEAn xem nh\u1EADn x\xE9t n\xE0y (C\xF4ng khai nh\u1EADn x\xE9t)")), /* @__PURE__ */ React.createElement("button", { onClick: handleSaveGrade, disabled: savingGrade, onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)", onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)", style: { background: savingGrade ? "#999" : "#191919", color: "#fff", border: "none", padding: "12px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: savingGrade ? "not-allowed" : "pointer", transition: "transform 0.1s" } }, savingGrade ? "\u0110ang x\u1EED l\xFD..." : t("submitGrade"))), replyingTo ? /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: "16px 24px", marginBottom: 40, display: "flex", gap: 16, alignItems: "center", cursor: "pointer", transition: "background 0.2s" }, onClick: () => {
    setReplyingTo(null);
    setCommentText("");
  }, onMouseEnter: (e) => e.currentTarget.style.background = "#fafafa", onMouseLeave: (e) => e.currentTarget.style.background = "#fff" }, /* @__PURE__ */ React.createElement("img", { src: authUser?.image || authUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", style: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "10px 16px", background: "#f0f2f5", borderRadius: 20, color: "#65676b", fontSize: 14 } }, "Vi\u1EBFt b\xECnh lu\u1EADn m\u1EDBi...")) : /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, marginBottom: 40, display: "flex", gap: 16, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("img", { src: authUser?.image || authUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", style: { width: 40, height: 40, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, pendingComment && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 8, background: "#eef4ff", padding: "8px 12px", borderRadius: 6, color: CERULEAN, fontSize: 13, fontWeight: "bold" } }, /* @__PURE__ */ React.createElement(MapPin, { size: 16 }), "\u0110ang nh\u1EADn x\xE9t t\u1EA1i t\u1ECDa \u0111\u1ED9 tr\xEAn \u1EA2nh ", pendingComment.index + 1, /* @__PURE__ */ React.createElement("button", { onClick: () => setPendingComment(null), style: { marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: MUTED } }, "Hu\u1EF7 b\u1ECF")), /* @__PURE__ */ React.createElement("textarea", { id: "comment-textarea-3", value: commentText, onChange: (e) => handleCommentChange(e, "comment-textarea-3"), placeholder: "What are your thoughts on this project?", style: { width: "100%", padding: "12px", borderRadius: 6, border: "1px solid #CCC", outline: "none", resize: "vertical", minHeight: 80, boxSizing: "border-box", fontSize: 14, fontFamily: "inherit", position: "relative" } }), mentionState.query !== null && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "calc(100% - 40px)", left: 0, right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, maxHeight: 220, overflowY: "auto", marginTop: 4, padding: "8px 0" } }, mentionState.results.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", color: "#888", fontSize: 14, textAlign: "center" } }, "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi d\xF9ng") : mentionState.results.map((mu, index) => /* @__PURE__ */ React.createElement("div", { key: mu.id, onClick: () => handleSelectMention(mu), onMouseEnter: (e) => e.currentTarget.style.background = "#f0f2f5", onMouseLeave: (e) => e.currentTarget.style.background = "transparent", style: { padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" } }, /* @__PURE__ */ React.createElement("img", { src: mu.avatarUrl || "https://i.pravatar.cc/150", alt: "", style: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "#1c1e21" } }, mu.fullName), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#65676b" } }, mu.role === "lecturer" ? "Gi\u1EA3ng vi\xEAn" : mu.role === "admin" ? "Admin" : "Sinh vi\xEAn"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 12 } }, /* @__PURE__ */ React.createElement("button", { onClick: handleSendComment, onMouseDown: (e) => e.currentTarget.style.transform = "scale(0.95)", onMouseUp: (e) => e.currentTarget.style.transform = "scale(1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)", disabled: sendingComment || !commentText.trim(), style: { background: "#E8E8E8", color: "#666", border: "none", padding: "10px 24px", borderRadius: 20, fontSize: 14, fontWeight: "bold", cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.2s, transform 0.1s", ...commentText.trim() && { background: "#0057ff", color: "#fff" } } }, sendingComment ? "Posting..." : "Post a Comment")))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 32 } }, comments?.length === 0 && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#999", textAlign: "center", padding: "20px 0" } }, t("noComments")), (() => {
    const renderCommentItem = (c, isReply = false) => {
      let badgeNum = "";
      if (c.positionX != null && c.targetImageIndex != null) {
        const imageComments = comments.filter((x) => x.targetImageIndex === c.targetImageIndex && x.positionX != null);
        badgeNum = imageComments.findIndex((x) => (x.id || x.Id) === (c.id || c.Id)) + 1;
      }
      const currentId = c.id || c.Id;
      const replies = currentId ? comments.filter((r) => (r.parentId || r.ParentId) === currentId) : [];
      return /* @__PURE__ */ React.createElement("div", { id: "comment-" + currentId, key: currentId || Math.random(), style: { display: "flex", flexDirection: "column", gap: 16, marginTop: isReply ? 16 : 0, marginLeft: isReply ? 48 : 0, borderRadius: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16 } }, /* @__PURE__ */ React.createElement("img", { onClick: () => {
        setPage("portfolio", { portfolioSlug: c.user?.portfolioSettings?.portfolioSlug || c.user?.id || c.userId });
      }, src: c.user?.image || c.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", style: { width: isReply ? 32 : 40, height: isReply ? 32 : 40, borderRadius: "50%", objectFit: "cover", cursor: "pointer" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 4 } }, /* @__PURE__ */ React.createElement("span", { onClick: () => {
        setPage("portfolio", { portfolioSlug: c.user?.portfolioSettings?.portfolioSlug || c.user?.id || c.userId });
      }, style: { fontWeight: "bold", color: "#191919", fontSize: 14, cursor: "pointer", textDecoration: "none" }, onMouseEnter: (e) => e.currentTarget.style.textDecoration = "underline", onMouseLeave: (e) => e.currentTarget.style.textDecoration = "none" }, c.user?.fullName), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#888" } }, "\u2022 ", new Date(c.createdAt).toLocaleDateString()), badgeNum && /* @__PURE__ */ React.createElement("span", { style: { background: CRIMSON, color: "#fff", fontSize: 10, padding: "2px 6px", borderRadius: 10, fontWeight: "bold" } }, "Marker #", badgeNum, " on Image ", c.targetImageIndex + 1), /* @__PURE__ */ React.createElement("button", { onClick: () => {
        setReplyingTo({ id: c.id || c.Id, userName: c.user?.fullName });
        setMentionMap((prev) => ({ ...prev, [c.user?.fullName]: c.user?.id || c.userId || c.UserId }));
        setCommentText(`@${c.user?.fullName} `);
        setTimeout(() => {
          const textarea = document.getElementById("comment-textarea-inline-" + (c.id || c.Id));
          if (textarea) textarea.focus();
        }, 50);
      }, style: { background: "transparent", border: "none", color: "#0057ff", cursor: "pointer", padding: "2px 8px", fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center" } }, "Tr\u1EA3 l\u1EDDi"), (authUser?.id === c.userId || authUser?.id === c.user?.id || authUser?.id === art.userId || authUser?.role === "admin") && /* @__PURE__ */ React.createElement("button", { onClick: () => {
        if (window.confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a b\xECnh lu\u1EADn n\xE0y?")) {
          api.artworks.comments.delete(art.id, c.id || c.Id).then(() => setComments((prev) => prev.filter((x) => (x.id || x.Id) !== (c.id || c.Id)))).catch((err) => alert("L\u1ED7i x\xF3a b\xECnh lu\u1EADn: " + (err?.message || "")));
        }
      }, style: { background: "transparent", border: "none", color: "#999", cursor: "pointer", padding: "2px 4px", display: "flex", alignItems: "center", transition: "color 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.color = CRIMSON, onMouseLeave: (e) => e.currentTarget.style.color = "#999", title: "X\xF3a b\xECnh lu\u1EADn" }, /* @__PURE__ */ React.createElement(Trash2, { size: 12, strokeWidth: 2 }))), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, color: "#444", fontSize: 14, lineHeight: 1.6 } }, renderCommentText({ content: c.content || c.Content, parentId: c.parentId || c.ParentId })))), replies.length > 0 && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, (expandedComments[currentId] ? replies : replies.slice(0, 2)).map((r) => renderCommentItem(r, true)), replies.length > 2 && !expandedComments[currentId] && /* @__PURE__ */ React.createElement("button", { onClick: () => setExpandedComments((prev) => ({ ...prev, [currentId]: true })), style: { background: "transparent", border: "none", color: "#65676b", fontSize: 13, fontWeight: 600, cursor: "pointer", textAlign: "left", marginTop: 4, padding: "4px 8px", marginLeft: isReply ? 48 : 0, borderRadius: 4, display: "inline-block", width: "fit-content", transition: "background 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.background = "#f0f2f5", onMouseLeave: (e) => e.currentTarget.style.background = "transparent" }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement("svg", { viewBox: "0 0 24 24", width: "16", height: "16", stroke: "currentColor", strokeWidth: "2.5", fill: "none", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "9 18 15 12 9 6" })), "Xem th\xEAm ", replies.length - 2, " ph\u1EA3n h\u1ED3i"))), replyingTo?.id === currentId && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 12, marginLeft: isReply ? 48 : 0, transition: "all 0.3s" } }, /* @__PURE__ */ React.createElement("img", { src: authUser?.image || authUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", style: { width: 28, height: 28, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement(
        "textarea",
        {
          id: "comment-textarea-inline-" + currentId,
          value: commentText,
          onChange: (e) => handleCommentChange(e, "comment-textarea-inline-" + currentId),
          placeholder: "Vi\u1EBFt ph\u1EA3n h\u1ED3i...",
          style: { width: "100%", padding: "10px 14px", borderRadius: 16, border: "1px solid #CCC", outline: "none", resize: "none", minHeight: 40, boxSizing: "border-box", fontSize: 13, fontFamily: "inherit" }
        }
      ), mentionState.query !== null && mentionState.inputId === "comment-textarea-inline-" + currentId && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: "100%", left: 0, right: 0, background: "#fff", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 8, boxShadow: "0 -4px 12px rgba(0,0,0,0.1)", zIndex: 100, maxHeight: 220, overflowY: "auto", marginBottom: 4, padding: "8px 0" } }, mentionState.results.length === 0 ? /* @__PURE__ */ React.createElement("div", { style: { padding: "12px 16px", color: "#888", fontSize: 14, textAlign: "center" } }, "Kh\xF4ng t\xECm th\u1EA5y ng\u01B0\u1EDDi d\xF9ng") : mentionState.results.map((mu, index) => /* @__PURE__ */ React.createElement("div", { key: mu.id, onClick: () => handleSelectMention(mu), onMouseEnter: (e) => e.currentTarget.style.background = "#f0f2f5", onMouseLeave: (e) => e.currentTarget.style.background = "transparent", style: { padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", transition: "background 0.2s" } }, /* @__PURE__ */ React.createElement("img", { src: mu.avatarUrl || "https://i.pravatar.cc/150", alt: "", style: { width: 32, height: 32, borderRadius: "50%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: 600, color: "#1c1e21" } }, mu.fullName), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: "#65676b" } }, mu.role === "lecturer" ? "Gi\u1EA3ng vi\xEAn" : mu.role === "admin" ? "Admin" : "Sinh vi\xEAn"))))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "flex-end", marginTop: 8, gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => {
        setReplyingTo(null);
        setCommentText("");
      }, style: { background: "transparent", color: "#666", border: "none", padding: "6px 12px", borderRadius: 16, fontSize: 13, fontWeight: "bold", cursor: "pointer" } }, "H\u1EE7y"), /* @__PURE__ */ React.createElement("button", { onClick: handleSendComment, disabled: sendingComment || !commentText.trim(), style: { background: commentText.trim() ? "#0057ff" : "#E8E8E8", color: commentText.trim() ? "#fff" : "#666", border: "none", padding: "6px 16px", borderRadius: 16, fontSize: 13, fontWeight: "bold", cursor: commentText.trim() ? "pointer" : "not-allowed", transition: "all 0.2s" } }, sendingComment ? "\u0110ang g\u1EEDi..." : "G\u1EEDi ph\u1EA3n h\u1ED3i")))));
    };
    return comments?.filter((c) => !c.parentId && !c.ParentId).map((c) => renderCommentItem(c));
  })())), /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 35%", display: "flex", flexDirection: "column", gap: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" } }, "Owner"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 20 } }, /* @__PURE__ */ React.createElement("img", { onClick: () => {
    setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId });
  }, src: art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60", style: { width: 48, height: 48, borderRadius: "50%", objectFit: "cover", cursor: "pointer" } }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8 } }, /* @__PURE__ */ React.createElement("h3", { onClick: () => {
    setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId });
  }, style: { margin: 0, fontSize: 15, fontWeight: "bold", color: "#191919", cursor: "pointer" } }, art.user?.fullName), /* @__PURE__ */ React.createElement("span", { style: { background: "#0057ff", color: "#fff", fontSize: 9, padding: "2px 6px", borderRadius: 4, fontWeight: "bold" } }, "PRO")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: "#888", display: "flex", alignItems: "center", gap: 4, marginTop: 4 } }, /* @__PURE__ */ React.createElement("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" }, /* @__PURE__ */ React.createElement("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" }), /* @__PURE__ */ React.createElement("circle", { cx: "12", cy: "10", r: "3" })), " Ho Chi Minh City, VN"))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setIsFollowing(!isFollowing), style: { background: isFollowing ? "#EAEAEA" : "#0057ff", color: isFollowing ? "#333" : "#fff", border: "none", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, isFollowing ? "Following" : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { width: 16, height: 16, borderRadius: "50%", border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12 } }, "+"), " Follow")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowOrderModal(true), style: { background: "#fff", color: "#0057ff", border: "1px solid #EAEAEA", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(Mail, { size: 16 }), " Order"), (authUser?.role === "lecturer" || authUser?.role === "admin") && /* @__PURE__ */ React.createElement("button", { onClick: () => setShowFeedbackModal(true), style: { background: "#fff", color: "#1a4ba8", border: "1px solid #1a4ba8", padding: "10px", borderRadius: 24, fontSize: 14, fontWeight: "bold", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, /* @__PURE__ */ React.createElement(MessageSquare, { size: 16 }), " Feedback k\xEDn"))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" } }, "Project Made For"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, art.tags?.map((tStr, i) => {
    const tL = tStr.toLowerCase();
    let IconComp = Tag;
    if (tL.includes("package") || tL.includes("bao b\xEC")) IconComp = Package;
    else if (tL.includes("illustrator") || tL.includes("photoshop") || tL.includes("design")) IconComp = PenTool;
    else if (tL.match(/20\d{2}/) || tL.includes("n\u0103m") || tL.includes("k\u1EF3")) IconComp = Calendar;
    else if (tL.includes("\u0111\u1ED3 \xE1n") || tL.includes("project")) IconComp = FileText;
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 24, height: 24, borderRadius: "50%", background: "#eef4ff", display: "flex", alignItems: "center", justifyContent: "center" } }, /* @__PURE__ */ React.createElement(IconComp, { size: 14, color: "#0057ff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, fontWeight: "bold", color: "#191919" } }, tStr));
  }))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("h3", { style: { fontSize: 16, fontWeight: "bold", margin: "0 0 12px 0", color: "#191919" } }, art.title), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#666", lineHeight: 1.6, marginBottom: 16 } }, isDescExpanded ? art.description : (art.description?.slice(0, 100) || "") + ((art.description?.length || 0) > 100 ? "..." : "")), (art.description?.length || 0) > 100 && /* @__PURE__ */ React.createElement("button", { onClick: () => setIsDescExpanded(!isDescExpanded), style: { background: "none", border: "none", color: "#191919", fontWeight: "bold", padding: 0, cursor: "pointer", fontSize: 14, marginBottom: 24 } }, isDescExpanded ? "Show Less" : "Read More"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 16, color: "#888", fontSize: 13, marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid #EAEAEA" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 14 }), " ", likeCount || 0), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(Eye, { size: 14 }), " ", art.viewCount || art._count?.views || 0), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 4 } }, /* @__PURE__ */ React.createElement(MessageCircle, { size: 14 }), " ", comments?.length || 0)), /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 12, color: "#888" } }, "Published: ", new Date(art.createdAt || Date.now()).toLocaleDateString())), art.settings?.role && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 } }, "Role / Responsibility"), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: "#191919", margin: 0, fontWeight: 500 } }, art.settings.role)), art.settings?.aiUsage && art.settings.aiUsage !== "none" && /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: 24 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 16, color: "#2b64ff" }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#2b64ff", textTransform: "uppercase", letterSpacing: 1 } }, "AI Usage Declaration")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#191919", margin: "0 0 8px 0", fontWeight: 600 } }, art.settings.aiUsage === "brainstorm" && "Used AI for ideation & brainstorming", art.settings.aiUsage === "generation" && "Used AI to generate raw assets/images", art.settings.aiUsage === "editing" && "Used AI for post-processing & editing"), art.settings.aiPrompt && /* @__PURE__ */ React.createElement("div", { style: { background: "#F8F8F8", padding: 12, borderRadius: 6, fontSize: 13, color: "#666", lineHeight: 1.5, wordBreak: "break-word" } }, art.settings.aiPrompt)), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", border: "1px solid #EAEAEA", borderRadius: 8, padding: 24, boxShadow: "0 2px 10px rgba(0,0,0,0.02)" } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" } }, "Tools"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 } }, art.toolsUsed?.map((tool, i) => {
    const tLower = tool.toLowerCase();
    let iconBg = "#333", iconColor = "#fff", short = tool.substring(0, 2);
    let fallbackBg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
    if (tLower.includes("photoshop")) {
      iconBg = "#001e36";
      iconColor = "#31a8ff";
      short = "Ps";
      fallbackBg = "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400";
    } else if (tLower.includes("illustrator")) {
      iconBg = "#330000";
      iconColor = "#ff9a00";
      short = "Ai";
      fallbackBg = "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400";
    } else if (tLower.includes("indesign")) {
      iconBg = "#49021f";
      iconColor = "#ff3366";
      short = "Id";
      fallbackBg = "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400";
    } else if (tLower.includes("after effects")) {
      iconBg = "#00005b";
      iconColor = "#9999ff";
      short = "Ae";
      fallbackBg = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400";
    } else if (tLower.includes("lightroom")) {
      iconBg = "#000000";
      iconColor = "#31a8ff";
      short = "Lr";
      fallbackBg = "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400";
    } else if (tLower.includes("figma")) {
      iconBg = "#f24e1e";
      iconColor = "#fff";
      short = "Fi";
      fallbackBg = "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400";
    }
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", gap: 12, overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("img", { src: toolCovers[tool] || fallbackBg, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transform: "scale(1.1)", filter: "brightness(0.8) contrast(1.1)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1, width: 28, height: 28, background: iconBg, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: iconColor, fontWeight: "bold", fontSize: 13, border: `1px solid ${iconColor}40` } }, short), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", zIndex: 1, color: "#fff", fontWeight: 800, fontSize: 15, textShadow: "0 1px 4px rgba(0,0,0,0.8)", letterSpacing: "0.2px" } }, tool));
  })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 11, fontWeight: "bold", color: "#888", textTransform: "uppercase", letterSpacing: 1, marginBottom: 16, display: "block" } }, "Creative Fields"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, Array.from(/* @__PURE__ */ new Set([art.category, ...art.tags || []])).filter(Boolean).slice(0, 4).map((field, i) => {
    const fallbackCategories = {
      "graphic design": "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400",
      "creative": "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400",
      "modern": "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?w=400",
      "ui/ux": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400",
      "branding": "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400",
      "3d art": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400",
      "typography": "https://images.unsplash.com/photo-1515595967223-f9fa59af5a3b?w=400",
      "illustration": "https://images.unsplash.com/photo-1578301978693-85fa9c026109?w=400"
    };
    const fallbackImg = fallbackCategories[field.toLowerCase()] || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
    return /* @__PURE__ */ React.createElement("div", { key: i, style: { position: "relative", borderRadius: 8, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: "0 2px 4px rgba(0,0,0,0.1)" } }, /* @__PURE__ */ React.createElement("img", { src: categoryCovers[field] || fallbackImg, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, transform: "scale(1.1)", filter: "brightness(0.8) contrast(1.1)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" } }), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", zIndex: 1, color: "#fff", fontWeight: 900, fontSize: 15, textShadow: "0 2px 8px rgba(0,0,0,0.9)", letterSpacing: "0.5px", textAlign: "center" } }, field));
  }))))))), /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", right: 0, top: 80, bottom: 90, width: "calc(50vw - min(50vw - 100px, 700px))", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "min(10px, 1.2vh)", zIndex: 1010, pointerEvents: "none" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, pointerEvents: "auto" }, className: "sidebar-item", onClick: () => {
    if (!isFollowing) {
      setIsFollowing(true);
      setIsFollowingAnimPlaying(true);
      setTimeout(() => setIsFollowingAnimPlaying(false), 2500);
    } else {
      setIsFollowing(false);
      setIsFollowingAnimPlaying(false);
    }
  } }, /* @__PURE__ */ React.createElement("img", { onClick: (e) => {
    e.stopPropagation();
    setPage("portfolio", { portfolioSlug: art.user?.portfolioSettings?.portfolioSlug || art.user?.id || art.userId });
  }, src: art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=40", style: { width: 36, height: 36, borderRadius: "50%", border: "2px solid #191919", objectFit: "cover", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }), (!isFollowing || isFollowingAnimPlaying) && /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 18, right: -4, width: 18, height: 18, borderRadius: "50%", background: "#0057ff", color: "#fff", border: "2px solid #191919", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold", padding: 0, transition: "background 0.3s" } }, isFollowing ? /* @__PURE__ */ React.createElement(Check, { size: 10, style: { animation: "followCheck 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)" } }) : /* @__PURE__ */ React.createElement("span", { style: { lineHeight: 0.8 } }, "+")), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff", whiteSpace: "nowrap" } }, isFollowing ? "Following" : "Follow")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }, onClick: () => setShowOrderModal(true) }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(Mail, { size: 14, color: "#191919" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, "Hire")), (authUser?.role === "lecturer" || authUser?.role === "admin") && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }, onClick: () => setShowFeedbackModal(true) }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(MessageSquare, { size: 14, color: "#1a4ba8" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, "Feedback")), (() => {
    let toolsList = art.toolsUsed || art.tools || (art.tool ? art.tool.split(",").map((t2) => t2.trim()).filter(Boolean) : []);
    if (toolsList.length === 0) {
      toolsList = ["Illustrator", "Photoshop", "Stock"];
    }
    const getToolInfo = (toolName) => {
      const name = toolName.toLowerCase();
      let fallbackBg = "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400";
      if (name.includes("illustrator") || name === "ai") return { id: "Ai", bg: "#330000", color: "#ff9a00", name: "Illustrator", image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400" };
      if (name.includes("photoshop") || name === "ps") return { id: "Ps", bg: "#001e36", color: "#31a8ff", name: "Photoshop", image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400" };
      if (name.includes("premiere") || name === "pr") return { id: "Pr", bg: "#1a1a4b", color: "#9999ff", name: "Premiere Pro", image: fallbackBg };
      if (name.includes("figma")) return { id: "Fg", bg: "#1e1e1e", color: "#0acf83", name: "Figma", image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400" };
      if (name.includes("blender") || name === "bl") return { id: "Bl", bg: "#2f2f2f", color: "#ea7600", name: "Blender", image: fallbackBg };
      if (name.includes("procreate")) return { id: "Pr", bg: "#1a1a1a", color: "#5b5b5b", name: "Procreate", image: fallbackBg };
      if (name.includes("stock") || name === "st") return { id: "St", bg: "#0f2026", color: "#00a3f5", name: "Stock", image: fallbackBg };
      if (name.includes("after effects") || name === "ae") return { id: "Ae", bg: "#00005b", color: "#9999ff", name: "After Effects", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400" };
      if (name.includes("indesign") || name === "id") return { id: "Id", bg: "#49021f", color: "#ff3366", name: "InDesign", image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=400" };
      if (name.includes("lightroom") || name === "lr") return { id: "Lr", bg: "#000000", color: "#31a8ff", name: "Lightroom", image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=400" };
      return { id: toolName.substring(0, 2).toUpperCase(), bg: "#333", color: "#fff", name: toolName, image: fallbackBg };
    };
    const firstTool = getToolInfo(toolsList[0]);
    return /* @__PURE__ */ React.createElement("div", { className: "group", style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative", pointerEvents: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement("div", { style: { width: 20, height: 20, borderRadius: 4, background: firstTool.bg, color: firstTool.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 12, fontFamily: "sans-serif" } }, firstTool.id)), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, "Tools"), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 right-full -translate-y-1/2 mr-4 bg-white text-black p-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none", style: { borderRadius: 8, width: 220, zIndex: 100, boxShadow: "0 8px 30px rgba(0,0,0,0.2)" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: "50%", right: -6, transform: "translateY(-50%)", width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "6px solid #fff" } }), /* @__PURE__ */ React.createElement("div", { style: { fontSize: 10, fontWeight: "bold", color: "#888", marginBottom: 12, textTransform: "uppercase" } }, "Tools"), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 6 } }, toolsList.map((t2) => {
      const info = getToolInfo(t2);
      return /* @__PURE__ */ React.createElement("div", { key: t2, style: { position: "relative", display: "flex", alignItems: "center", gap: 12, background: "#151515", borderRadius: 6, padding: "8px 12px", overflow: "hidden" } }, /* @__PURE__ */ React.createElement("img", { src: toolCovers?.[t2] || info.image, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", opacity: 0.6, filter: "brightness(0.8) contrast(1.1)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 1, width: 24, height: 24, borderRadius: 4, background: info.bg, color: info.color, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "900", fontSize: 14, fontFamily: "sans-serif" } }, info.id), /* @__PURE__ */ React.createElement("span", { style: { position: "relative", zIndex: 1, fontSize: 14, fontWeight: "bold", color: "#fff" } }, info.name));
    }))));
  })(), canGrade && /* @__PURE__ */ React.createElement("div", { ref: badgeMenuRef, style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", position: "relative", pointerEvents: "auto" }, onClick: () => setShowBadgeMenu(!showBadgeMenu) }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: CERULEAN, display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(Star, { size: 14, color: "#fff", fill: "#fff" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff", whiteSpace: "nowrap" } }, "Badge"), /* @__PURE__ */ React.createElement("div", { className: "badge-menu", style: { display: showBadgeMenu ? "block" : "none", position: "absolute", top: 0, right: "100%", marginRight: 16, background: "#fff", borderRadius: 8, padding: 12, minWidth: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", zIndex: 200 }, onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("h4", { style: { margin: "0 0 10px", fontSize: 13, color: BLACK, fontWeight: 700 } }, "Huy hi\u1EC7u c\u1EE7a b\u1EA1n"), lecturerBadges.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { margin: 0, fontSize: 12, color: MUTED } }, "B\u1EA1n ch\u01B0a t\u1EA1o huy hi\u1EC7u n\xE0o.") : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 8 } }, lecturerBadges.map((b) => {
    const isAssigned = (art.badges || []).some((ab) => ab.id === b.id);
    return /* @__PURE__ */ React.createElement("div", { key: b.id, onClick: () => {
      handleAssignBadge(b.id);
      setShowBadgeMenu(false);
    }, style: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 6, background: isAssigned ? b.colorCode : GRAY_BG, color: isAssigned ? b.textColor || "#fff" : BLACK, fontSize: 13, fontWeight: 600, cursor: assigningBadge ? "wait" : "pointer" } }, /* @__PURE__ */ React.createElement(Star, { size: 14, fill: isAssigned ? b.textColor || "#fff" : "none", color: isAssigned ? b.textColor || "#fff" : BLACK }), b.name);
  })))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }, onClick: () => onBookmarkClick(art) }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(Folder, { size: 14, color: "#191919", fill: isBookmarked && isBookmarked(art.id) ? "#191919" : "none" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, isBookmarked && isBookmarked(art.id) ? "Saved" : "Save")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", marginTop: 4, pointerEvents: "auto" }, onClick: handleLike }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: "50%", background: "#0057ff", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)", transform: animatingLike ? "scale(1.2) rotate(-10deg)" : "scale(1)", boxShadow: isLiked ? "0 0 20px rgba(0,87,255,0.4)" : "none" }, onMouseEnter: (e) => {
    if (!animatingLike) e.currentTarget.style.transform = "scale(1.1)";
  }, onMouseLeave: (e) => {
    if (!animatingLike) e.currentTarget.style.transform = "scale(1)";
  } }, /* @__PURE__ */ React.createElement(ThumbsUp, { size: 18, color: "#fff", fill: isLiked ? "#fff" : "none" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, likeCount || 0)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, cursor: "pointer", pointerEvents: "auto" }, onClick: () => setShowReport(true) }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", transition: "transform 0.2s" }, onMouseEnter: (e) => e.currentTarget.style.transform = "scale(1.1)", onMouseLeave: (e) => e.currentTarget.style.transform = "scale(1)" }, /* @__PURE__ */ React.createElement(AlertTriangle, { size: 14, color: "#191919" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 10, fontWeight: "bold", color: "#fff" } }, "Report")))), shareToast && /* @__PURE__ */ React.createElement("div", { style: { position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", zIndex: 1e4, background: BLACK, color: "#fff", padding: "10px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500, boxShadow: "0 8px 24px rgba(0,0,0,0.2)" } }, t("linkCopied")), showFullscreen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center", style: { background: "rgba(0,0,0,0.92)" }, onClick: () => setShowFullscreen(false) }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowFullscreen(false), style: { position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, zIndex: 10 } }, "\u2715"), /* @__PURE__ */ React.createElement("img", { src: allImagesDeduped[fullscreenImageIndex], alt: "", style: { maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" }, onClick: (e) => e.stopPropagation() }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 } }, allImagesDeduped.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: (e) => {
    e.stopPropagation();
    setFullscreenImageIndex(i);
  }, style: { width: 8, height: 8, borderRadius: "50%", background: i === fullscreenImageIndex ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" } })))), showDownloadModal && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4", onClick: () => setShowDownloadModal(false) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-[#212121]" }, t("downloadArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowDownloadModal(false), className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mb-4" }, t("chooseFormatToDownload"), allImagesDeduped.length > 1 ? ` (${allImagesDeduped.length} ${t("images")})` : "", ":"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, [
    { key: "png", label: "PNG", desc: t("pngDescription") },
    { key: "jpg", label: "JPG", desc: t("jpgDescription") },
    { key: "pdf", label: "PDF", desc: t("pdfDescription") }
  ].map((opt) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: opt.key,
      onClick: () => {
        setDownloadFormat(opt.key);
        handleDownload(opt.key);
      },
      className: "flex items-center justify-between w-full px-4 py-3 rounded-lg border border-[#E0E0E0] hover:border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
      disabled: downloading
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-[#e0eaff] flex items-center justify-center text-[#1a4ba8] font-bold text-xs uppercase" }, opt.key), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121]" }, opt.label), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, opt.desc))),
    downloading && downloadFormat === opt.key ? /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-[#1a4ba8] border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }) : /* @__PURE__ */ React.createElement(FileDown, { size: 16, className: "text-[#1a4ba8]" })
  ))), canSeeGrade && art.originalCoverUrl && /* @__PURE__ */ React.createElement("div", { className: "mt-4 pt-4 border-t border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        saveAs(art.originalCoverUrl, `${art.title || "artwork"}_original.jpg`);
        setShowDownloadModal(false);
      },
      className: "flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg border-2 border-dashed border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer text-[#1a4ba8] font-bold text-sm"
    },
    /* @__PURE__ */ React.createElement(Download, { size: 16 }),
    " T\u1EA3i b\u1EA3n g\u1ED1c (Kh\xF4ng Watermark)"
  ))))), showReport && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4", onClick: () => !sendingReport && setShowReport(false) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-[#212121]" }, t("reportArtwork")), /* @__PURE__ */ React.createElement("button", { disabled: sendingReport, onClick: () => setShowReport(false), className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer disabled:opacity-50" }, /* @__PURE__ */ React.createElement(X, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#212121] mb-3 font-semibold" }, "Vui l\xF2ng ch\u1ECDn l\xFD do b\xE1o c\xE1o:"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 mb-5" }, [
    { id: "Inappropriate Content", label: "N\u1ED9i dung ph\u1EA3n c\u1EA3m / Kh\xF4ng ph\xF9 h\u1EE3p" },
    { id: "Copyright Violation", label: "Vi ph\u1EA1m b\u1EA3n quy\u1EC1n" },
    { id: "Spam", label: "Spam / Qu\u1EA3ng c\xE1o r\xE1c" },
    { id: "Other", label: "L\xFD do kh\xE1c" }
  ].map((reason) => /* @__PURE__ */ React.createElement("label", { key: reason.id, className: "flex items-center gap-2 cursor-pointer" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "radio",
      name: "reportReason",
      className: "w-4 h-4 text-[#1a4ba8]",
      checked: reportType === reason.id,
      onChange: () => setReportType(reason.id),
      disabled: sendingReport
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#212121]" }, reason.label)))), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      placeholder: "Cung c\u1EA5p th\xEAm chi ti\u1EBFt (Kh\xF4ng b\u1EAFt bu\u1ED9c)...",
      className: "w-full border border-[#E0E0E0] rounded-lg p-3 text-sm min-h-[100px] outline-none focus:border-[#1a4ba8] mb-4",
      value: reportDetail,
      onChange: (e) => setReportDetail(e.target.value),
      disabled: sendingReport
    }
  ), /* @__PURE__ */ React.createElement("div", { className: "flex justify-end gap-3" }, /* @__PURE__ */ React.createElement("button", { disabled: sendingReport, onClick: () => setShowReport(false), className: "px-4 py-2 rounded-lg text-sm font-semibold text-[#666666] hover:bg-[#F5F5F5] disabled:opacity-50" }, "H\u1EE7y"), /* @__PURE__ */ React.createElement(
    "button",
    {
      disabled: sendingReport || !reportType,
      onClick: () => {
        setSendingReport(true);
        api.artworks.report(activeArtworkId, { violationType: reportType, detail: reportDetail }).then(() => {
          setShowReport(false);
          setReportType("");
          setReportDetail("");
          alert("G\u1EEDi b\xE1o c\xE1o th\xE0nh c\xF4ng! Ch\xFAng t\xF4i s\u1EBD xem x\xE9t \u1EA5n ph\u1EA9m n\xE0y.");
        }).catch((err) => alert("C\xF3 l\u1ED7i x\u1EA3y ra: " + (err.message || "Kh\xF4ng th\u1EC3 g\u1EEDi b\xE1o c\xE1o"))).finally(() => setSendingReport(false));
      },
      className: "px-4 py-2 rounded-lg text-sm font-semibold text-white bg-[#d32f2f] hover:bg-[#b71c1c] disabled:opacity-50"
    },
    sendingReport ? "\u0110ang x\u1EED l\xFD..." : "G\u1EEDi b\xE1o c\xE1o"
  ))))), showOrderModal && activeArtworkId && /* @__PURE__ */ React.createElement(OrderModal, { setPage, activeArtworkId, onClose: () => setShowOrderModal(false) }), showFeedbackModal && activeArtworkId && /* @__PURE__ */ React.createElement(FeedbackModal, { setPage, activeArtworkId, onClose: () => setShowFeedbackModal(false), userProfile: authUser }), showFullscreen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[10000] flex items-center justify-center", style: { background: "rgba(0,0,0,0.92)" }, onClick: () => setShowFullscreen(false) }, /* @__PURE__ */ React.createElement("button", { onClick: () => setShowFullscreen(false), style: { position: "absolute", top: 20, right: 24, width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.15)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 22, zIndex: 10 } }, "\u2715"), /* @__PURE__ */ React.createElement("img", { src: allImagesDeduped[fullscreenImageIndex], alt: "", style: { maxWidth: "90%", maxHeight: "90vh", objectFit: "contain" }, onClick: (e) => e.stopPropagation() }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", bottom: 20, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8 } }, allImagesDeduped.map((_, i) => /* @__PURE__ */ React.createElement("div", { key: i, onClick: (e) => {
    e.stopPropagation();
    setFullscreenImageIndex(i);
  }, style: { width: 8, height: 8, borderRadius: "50%", background: i === fullscreenImageIndex ? "#fff" : "rgba(255,255,255,0.3)", cursor: "pointer" } })))), showDownloadModal && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4", onClick: () => setShowDownloadModal(false) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("h3", { className: "text-base font-bold text-[#212121]" }, t("downloadArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowDownloadModal(false), className: "text-[#666666] hover:text-[#212121] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 18 }))), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mb-4" }, t("chooseFormatToDownload"), allImagesDeduped.length > 1 ? ` (${allImagesDeduped.length} ${t("images")})` : "", ":"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-3" }, [
    { key: "png", label: "PNG", desc: t("pngDescription") },
    { key: "jpg", label: "JPG", desc: t("jpgDescription") },
    { key: "pdf", label: "PDF", desc: t("pdfDescription") }
  ].map((opt) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: opt.key,
      onClick: () => {
        setDownloadFormat(opt.key);
        handleDownload(opt.key);
      },
      className: "flex items-center justify-between w-full px-4 py-3 rounded-lg border border-[#E0E0E0] hover:border-[#1a4ba8] hover:bg-[#eef4ff] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
      disabled: downloading
    },
    /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 rounded-lg bg-[#e0eaff] flex items-center justify-center text-[#1a4ba8] font-bold text-xs uppercase" }, opt.key), /* @__PURE__ */ React.createElement("div", { className: "text-left" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121]" }, opt.label), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, opt.desc))),
    downloading && downloadFormat === opt.key ? /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-[#1a4ba8] border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }) : /* @__PURE__ */ React.createElement(FileDown, { size: 16, className: "text-[#1a4ba8]" })
  )))))));
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
    admin: { email: "admin@uef.edu.vn", password: "admin123" }
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
    const UEF_BLUE = "#0072bc";
    return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", background: "#1a1a2e url(/background-login.jpg) center/cover no-repeat" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 448, margin: "32px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "32px 32px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 72 } }), /* @__PURE__ */ React.createElement("img", { src: "/qs-stars.png", alt: "QS Stars", style: { height: 40 } })), /* @__PURE__ */ React.createElement("h4", { style: { margin: "20px 0 6px", fontWeight: 700, fontSize: 19, fontFamily: "'Public Sans', sans-serif", color: "rgba(0,114,188,0.78)", textTransform: "uppercase", textAlign: "center" } }, "UEF ID"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 24px", fontSize: 15, fontWeight: 400, color: "rgba(47,43,61,0.68)", background: "#e3efff", padding: "12px 16px", borderRadius: 6, textAlign: "center", lineHeight: 1.5 } }, "\u0110\u0103ng nh\u1EADp v\xE0o t\xE0i kho\u1EA3n UEF ID c\u1EE7a b\u1EA1n \u0111\u1EC3 truy c\u1EADp", /* @__PURE__ */ React.createElement("a", { href: "#", onClick: (e) => {
      e.preventDefault();
      setPage("home");
    }, style: { color: UEF_BLUE, marginLeft: 4 } }, "UEF Portfolio")), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "text",
        value: email,
        placeholder: "T\xEAn ng\u01B0\u1EDDi d\xF9ng ho\u1EB7c email",
        onChange: (e) => {
          setEmail(e.target.value);
          setLoginError("");
        },
        onKeyDown: handleKeyDown,
        disabled: logging,
        style: { width: "100%", padding: "10px 12px", border: `1px solid ${loginError ? "#E53E3E" : "#d1d5db"}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#212121", background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" },
        onFocus: (e) => {
          e.target.style.borderColor = UEF_BLUE;
          e.target.style.boxShadow = `0 0 0 1px ${UEF_BLUE}`;
        },
        onBlur: (e) => {
          if (!loginError) {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }
        }
      }
    )), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: showPassword ? "text" : "password",
        value: password,
        placeholder: "M\u1EADt kh\u1EA9u",
        onChange: (e) => {
          setPassword(e.target.value);
          setLoginError("");
        },
        onKeyDown: handleKeyDown,
        disabled: logging,
        style: { width: "100%", padding: "10px 44px 10px 12px", border: `1px solid ${loginError ? "#E53E3E" : "#d1d5db"}`, borderRadius: 6, fontSize: 14, outline: "none", boxSizing: "border-box", color: "#212121", background: "#fff", transition: "border-color 0.15s, box-shadow 0.15s" },
        onFocus: (e) => {
          e.target.style.borderColor = UEF_BLUE;
          e.target.style.boxShadow = `0 0 0 1px ${UEF_BLUE}`;
        },
        onBlur: (e) => {
          if (!loginError) {
            e.target.style.borderColor = "#d1d5db";
            e.target.style.boxShadow = "none";
          }
        }
      }
    ), /* @__PURE__ */ React.createElement(
      "button",
      {
        type: "button",
        onClick: () => setShowPassword(!showPassword),
        tabIndex: -1,
        "aria-label": showPassword ? "\u1EA8n m\u1EADt kh\u1EA9u" : "Hi\u1EC7n m\u1EADt kh\u1EA9u",
        style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#9ca3af" }
      },
      showPassword ? /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { clipRule: "evenodd", d: "M3.28033 2.21967C2.98744 1.92678 2.51256 1.92678 2.21967 2.21967C1.92678 2.51256 1.92678 2.98744 2.21967 3.28033L16.7197 17.7803C17.0126 18.0732 17.4874 18.0732 17.7803 17.7803C18.0732 17.4874 18.0732 17.0126 17.7803 16.7197L16.0352 14.9745C17.5064 13.8594 18.6595 12.3465 19.3344 10.5959C19.4814 10.2144 19.4816 9.79127 19.3347 9.40962C17.892 5.66051 14.256 3 9.99859 3C8.28207 3 6.66657 3.43249 5.2551 4.19444L3.28033 2.21967ZM7.75194 6.69128L8.84367 7.78301C9.18951 7.60223 9.58291 7.5 10.0002 7.5C11.3809 7.5 12.5002 8.61929 12.5002 10C12.5002 10.4173 12.398 10.8107 12.2172 11.1565L13.3091 12.2484C13.7454 11.6077 14.0004 10.8336 14.0004 10C14.0004 7.79086 12.2095 6 10.0004 6C9.16675 6 8.39268 6.25501 7.75194 6.69128Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { d: "M10.7484 13.9302L13.2711 16.4529C12.2462 16.8074 11.1458 17 10.0004 17C5.74298 17 2.10698 14.3395 0.664255 10.5904C0.517392 10.2087 0.517518 9.78563 0.66461 9.40408C1.15603 8.12932 1.90108 6.98057 2.83791 6.01969L6.0702 9.25198C6.02436 9.4943 6.00037 9.74435 6.00037 10C6.00037 12.2091 7.79123 14 10.0004 14C10.256 14 10.5061 13.976 10.7484 13.9302Z", fill: "currentColor" })) : /* @__PURE__ */ React.createElement("svg", { width: "20", height: "20", viewBox: "0 0 20 20", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z", fill: "currentColor" }), /* @__PURE__ */ React.createElement("path", { clipRule: "evenodd", d: "M0.664255 10.5904C0.517392 10.2087 0.517518 9.78563 0.66461 9.40408C2.10878 5.65788 5.7433 3 9.99859 3C14.256 3 17.892 5.66051 19.3347 9.40962C19.4816 9.79127 19.4814 10.2144 19.3344 10.5959C17.8902 14.3421 14.2557 17 10.0004 17C5.74298 17 2.10698 14.3395 0.664255 10.5904ZM14.0004 10C14.0004 12.2091 12.2095 14 10.0004 14C7.79123 14 6.00037 12.2091 6.00037 10C6.00037 7.79086 7.79123 6 10.0004 6C12.2095 6 14.0004 7.79086 14.0004 10Z", fillRule: "evenodd", fill: "currentColor" }))
    ))), loginError && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 6, padding: "10px 14px", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 13, margin: 0, lineHeight: 1.4 } }, loginError)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "rgba(47,43,61,0.78)", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", style: { width: 16, height: 16, borderRadius: 4, border: "1px solid #d1d5db", accentColor: UEF_BLUE } }), "Ghi nh\u1EDB t\xF4i"), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setPage("forgot_password"),
        style: { background: "none", border: "none", fontSize: 14, color: "#009900", cursor: "pointer", padding: 0 }
      },
      "Qu\xEAn m\u1EADt kh\u1EA9u?"
    )), /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: handleEmailLogin,
        disabled: logging || !email || !password,
        style: { width: "100%", padding: "16px 4px", borderRadius: 6, border: "none", background: logging ? "#d1d5db" : UEF_BLUE, color: "#fff", fontSize: 15, fontWeight: 500, letterSpacing: "0.43px", textTransform: "uppercase", cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "rgba(47, 43, 61, 0.14) 0 2px 6px 0", marginBottom: 24, transition: "background 0.15s" },
        onMouseEnter: (e) => {
          if (!logging) e.currentTarget.style.background = "#005a9e";
        },
        onMouseLeave: (e) => {
          if (!logging) e.currentTarget.style.background = UEF_BLUE;
        }
      },
      logging ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " \u0110ANG \u0110\u0102NG NH\u1EACP...") : "\u0110\u0102NG NH\u1EACP"
    ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "#e5e7eb" } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "rgba(47,43,61,0.68)", whiteSpace: "nowrap" } }, "Ho\u1EB7c \u0111\u0103ng nh\u1EADp b\u1EB1ng"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: "#e5e7eb" } })), /* @__PURE__ */ React.createElement(
      "a",
      {
        onClick: handleGoogleLogin,
        style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "10px 0", borderRadius: 8, border: "1px solid #e5e7eb", background: "#fff", fontSize: 15, color: "rgba(47,43,61,0.78)", cursor: "pointer", textDecoration: "none", marginBottom: 24 },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "#f9fafb";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "#fff";
        }
      },
      /* @__PURE__ */ React.createElement("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M23.76 12.2727C23.76 11.4218 23.6836 10.6036 23.5418 9.81818H12.24V14.46H18.6982C18.42 15.96 17.5745 17.2309 16.3036 18.0818L18.2427 19.5873L20.1818 21.0927C22.4509 19.0036 23.76 15.9273 23.76 12.2727Z", fill: "#4285F4" }), /* @__PURE__ */ React.createElement("path", { d: "M12.24 24C15.48 24 18.1964 22.9255 20.1818 21.0927L16.3036 18.0818C15.2291 18.8018 13.8545 19.2273 12.24 19.2273C9.11455 19.2273 6.46909 17.1164 5.52545 14.28L3.52091 15.8345L1.51636 17.3891C3.49091 21.3109 7.54909 24 12.24 24Z", fill: "#34A853" }), /* @__PURE__ */ React.createElement("path", { d: "M5.52545 14.28C5.28545 13.56 5.14909 12.7909 5.14909 12C5.14909 11.2091 5.28545 10.44 5.52545 9.72L3.52091 8.16546L1.51636 6.61091C0.703637 8.23091 0.240001 10.0636 0.240001 12C0.240001 13.9364 0.703637 15.7691 1.51636 17.3891L5.52545 14.28Z", fill: "#FBBC05" }), /* @__PURE__ */ React.createElement("path", { d: "M12.24 4.77273C14.0018 4.77273 15.5836 5.37818 16.8273 6.56727L20.2691 3.12545C18.1909 1.18909 15.4745 0 12.24 0C7.54909 0 3.49091 2.68909 1.51636 6.61091L5.52545 9.72C6.46909 6.88364 9.11455 4.77273 12.24 4.77273Z", fill: "#EA4335" })),
      /* @__PURE__ */ React.createElement("span", null, "Google")
    ), /* @__PURE__ */ React.createElement("div", { style: { background: "#ededed", padding: "8px 16px", borderRadius: 6, textAlign: "center", fontSize: 15, color: "rgba(47,43,61,0.78)", marginBottom: 16 } }, "N\u1EBFu b\u1EA1n c\u1EA7n tr\u1EE3 gi\xFAp, truy c\u1EADp ", /* @__PURE__ */ React.createElement("a", { href: "https://help.uef.edu.vn/sso/#howto", target: "_blank", style: { color: UEF_BLUE } }, "help.uef.edu.vn")), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "center" } }, /* @__PURE__ */ React.createElement(
      "button",
      {
        onClick: () => setShowUefLogin(false),
        style: { background: "none", border: "none", color: "rgba(47,43,61,0.58)", fontSize: 14, cursor: "pointer", padding: "4px 8px" }
      },
      "\u2190 C\xE1c ph\u01B0\u01A1ng th\u1EE9c \u0111\u0103ng nh\u1EADp kh\xE1c"
    ))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", justifyContent: "center", marginTop: 16 } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 6, padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", xmlns: "http://www.w3.org/2000/svg" }, /* @__PURE__ */ React.createElement("path", { d: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M7.99998 3H8.99998C6.99998 8 6.99998 16 8.99998 21H7.99998", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M15 3C17 8 17 16 15 21", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M3 16V15C8 17 16 17 21 15V16", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" }), /* @__PURE__ */ React.createElement("path", { d: "M3 9.00004C8 7.00004 16 7.00004 21 9.00004", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 14, color: "rgba(47,43,61,0.78)" } }, "Ti\u1EBFng Vi\u1EC7t"), /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 20 20", fill: "currentColor" }, /* @__PURE__ */ React.createElement("path", { clipRule: "evenodd", d: "M5.23017 7.20938C5.52875 6.92228 6.00353 6.93159 6.29063 7.23017L10 11.1679L13.7094 7.23017C13.9965 6.93159 14.4713 6.92228 14.7698 7.20938C15.0684 7.49647 15.0777 7.97125 14.7906 8.26983L10.5406 12.7698C10.3992 12.9169 10.204 13 10 13C9.79599 13 9.60078 12.9169 9.45938 12.7698L5.20938 8.26983C4.92228 7.97125 4.93159 7.49647 5.23017 7.20938Z", fillRule: "evenodd" }))))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f0f2f5" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, zIndex: 0 } }, /* @__PURE__ */ React.createElement(
    "img",
    {
      src: "/background-login.jpg",
      alt: "UEF Campus",
      style: { width: "100%", height: "100%", objectFit: "cover" }
    }
  ), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "rgba(0,0,0,0.35)" } })), /* @__PURE__ */ React.createElement("div", { style: { position: "relative", zIndex: 10, width: "100%", maxWidth: 420, margin: "0 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", padding: "40px 36px 32px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 32 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 80 } }), /* @__PURE__ */ React.createElement("img", { src: "/qs-stars.png", alt: "QS Stars", style: { height: 44 } })), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, textAlign: "center", marginBottom: 12 } }, t("loginWithEmailToUse")), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setShowUefLogin(true),
      style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "11px 0", borderRadius: 10, border: `1px solid ${GRAY_LIGHT}`, background: "#f8f9fa", fontSize: 14, fontWeight: 500, color: "#333", cursor: "pointer", transition: "all 0.15s" },
      onMouseEnter: (e) => {
        e.currentTarget.style.background = "#f0f1f3";
        e.currentTarget.style.borderColor = "#d0d0d0";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.background = "#f8f9fa";
        e.currentTarget.style.borderColor = GRAY_LIGHT;
      }
    },
    /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "", style: { height: 20 } }),
    /* @__PURE__ */ React.createElement("span", null, "\u0110\u0103ng nh\u1EADp v\u1EDBi UEF ID")
  ), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, margin: "20px 0" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: GRAY_LIGHT } }), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED } }, t("or")), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, height: 1, background: GRAY_LIGHT } })), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 6, marginBottom: 18 } }, [{ key: "student", label: t("student") }, { key: "lecturer", label: t("lecturer") }, { key: "admin", label: t("admin") }].map((r) => /* @__PURE__ */ React.createElement("button", { disabled: logging, key: r.key, onClick: () => {
    setAuthRole(r.key);
    autoFillLogin(r.key);
  }, style: { flex: 1, padding: "7px 0", borderRadius: 8, border: `1px solid ${authRole === r.key ? CERULEAN : GRAY_LIGHT}`, background: authRole === r.key ? `${CERULEAN}12` : "transparent", color: authRole === r.key ? CERULEAN : MUTED, fontSize: 12, fontWeight: 500, cursor: logging ? "not-allowed" : "pointer", opacity: logging ? 0.6 : 1, transition: "all 0.15s" } }, r.label))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, display: "flex", pointerEvents: "none", zIndex: 1 } }, /* @__PURE__ */ React.createElement(Mail, { size: 16 })), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "email",
      value: email,
      placeholder: "T\xEAn t\xE0i kho\u1EA3n",
      onChange: (e) => {
        setEmail(e.target.value);
        setLoginError("");
      },
      onKeyDown: handleKeyDown,
      disabled: logging,
      style: { width: "100%", padding: "11px 14px 11px 40px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1, transition: "border-color 0.15s" },
      onFocus: (e) => {
        e.target.style.borderColor = CERULEAN;
        e.target.style.boxShadow = `0 0 0 1px ${CERULEAN}`;
      },
      onBlur: (e) => {
        if (!loginError) {
          e.target.style.borderColor = GRAY_LIGHT;
          e.target.style.boxShadow = "none";
        }
      }
    }
  ))), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 12 } }, /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: MUTED, display: "flex", pointerEvents: "none", zIndex: 1 } }, /* @__PURE__ */ React.createElement(Lock, { size: 16 })), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: showPassword ? "text" : "password",
      value: password,
      placeholder: "M\u1EADt kh\u1EA9u",
      onChange: (e) => {
        setPassword(e.target.value);
        setLoginError("");
      },
      onKeyDown: handleKeyDown,
      disabled: logging,
      style: { width: "100%", padding: "11px 44px 11px 40px", borderRadius: 8, border: `1px solid ${loginError ? "#E53E3E" : GRAY_LIGHT}`, background: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box", color: BLACK, opacity: logging ? 0.6 : 1, transition: "border-color 0.15s" },
      onFocus: (e) => {
        e.target.style.borderColor = CERULEAN;
        e.target.style.boxShadow = `0 0 0 1px ${CERULEAN}`;
      },
      onBlur: (e) => {
        if (!loginError) {
          e.target.style.borderColor = GRAY_LIGHT;
          e.target.style.boxShadow = "none";
        }
      }
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      type: "button",
      onClick: () => setShowPassword(!showPassword),
      tabIndex: -1,
      style: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: logging ? "not-allowed" : "pointer", padding: 6, display: "flex", alignItems: "center", justifyContent: "center", color: MUTED }
    },
    showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 })
  ))), loginError && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 12 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 12, margin: 0, lineHeight: 1.4 } }, loginError)), /* @__PURE__ */ React.createElement("div", { style: { textAlign: "right", marginBottom: 8 } }, /* @__PURE__ */ React.createElement("span", { onClick: () => setPage("forgot_password"), style: { color: CERULEAN, fontSize: 12, cursor: "pointer", fontWeight: 500 } }, t("forgotPassword"))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleEmailLogin,
      disabled: logging || !email || !password,
      style: { width: "100%", padding: "13px", borderRadius: 10, border: "none", background: logging ? GRAY_LIGHT : CERULEAN, color: logging ? MUTED : "#fff", fontSize: 15, fontWeight: 600, cursor: logging ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, transition: "all 0.15s" }
    },
    logging ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("loggingIn")) : t("login")
  ), /* @__PURE__ */ React.createElement("p", { style: { color: "#999", fontSize: 10.5, marginTop: 14, textAlign: "center", lineHeight: 1.5 } }, t("loginWithEmailToUse"), /* @__PURE__ */ React.createElement("br", null), t("studentLabel"), ": ", /* @__PURE__ */ React.createElement("strong", null, "sv@uef.edu.vn"), " / ", t("passwordLabel"), ": ", /* @__PURE__ */ React.createElement("strong", null, "test123")))));
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
    if (!email) {
      setError(t("invalidEmail"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setStep("code");
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      }), 1e3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      setError(t("enterResetCode"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyResetCode(email, code);
      setStep("password");
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResetPassword = async () => {
    if (!password || password.length < 8) {
      setError(t("passwordMinLength"));
      return;
    }
    if (password !== confirmPw) {
      setError(t("passwordMismatch"));
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      setSuccess(true);
      setTimeout(() => setPage("auth"), 2e3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await forgotPassword(email);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      }), 1e3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const stepTitle = step === "email" ? t("forgotPasswordTitle") : step === "code" ? t("enterResetCode") : t("resetPassword");
  const stepDesc = step === "email" ? t("forgotPasswordDesc") : step === "code" ? t("resetCodeSentDesc") : t("resetCodeSentDesc");
  if (success) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" } }, /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#2F855A", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" } }, t("resetPasswordSuccess")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, t("resetPasswordSuccessDesc")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), style: { padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToLogin"))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80", alt: "bg", style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }, onClick: () => setPage("home") }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 32, filter: "brightness(0) invert(1)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 18, color: "#fff" } }, "Design Gallery"))), /* @__PURE__ */ React.createElement("div", { className: "auth-form-panel", style: { width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 340, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 30 } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 16, color: BLACK } }, "Design Gallery")), step !== "email" && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 6, marginBottom: 16, cursor: "pointer" }, onClick: () => {
    if (step === "password") {
      setStep("code");
    } else {
      setPage("auth");
    }
  } }, /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: CERULEAN, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "15 18 9 12 15 6" })), /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: CERULEAN, fontWeight: 500 } }, t("backToLogin"))), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" } }, stepTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, stepDesc), error && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 12, margin: 0 } }, error)), step === "email" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("email")), /* @__PURE__ */ React.createElement("input", { type: "email", value: email, onChange: (e) => {
    setEmail(e.target.value);
    setError("");
  }, onKeyDown: (e) => e.key === "Enter" && handleSendCode(), style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } })), /* @__PURE__ */ React.createElement("button", { onClick: handleSendCode, disabled: loading || !email, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("sendResetCode")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 } }, /* @__PURE__ */ React.createElement("span", { onClick: () => setPage("auth"), style: { color: CERULEAN, cursor: "pointer", fontWeight: 600 } }, t("backToLogin")))), step === "code" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("enterResetCode")), /* @__PURE__ */ React.createElement("input", { type: "text", value: code, onChange: (e) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
    setError("");
  }, placeholder: "000000", maxLength: 6, onKeyDown: (e) => e.key === "Enter" && handleVerifyCode(), style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" } })), /* @__PURE__ */ React.createElement("button", { onClick: handleVerifyCode, disabled: loading || code.length < 6, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("verifyCode")), cooldown > 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 } }, t("resendCode"), " (", cooldown, "s)") : /* @__PURE__ */ React.createElement("p", { onClick: handleResendCode, style: { fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 } }, t("resendCode"))), step === "password" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("resetNewPassword")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPw ? "text" : "password", value: password, onChange: (e) => {
    setPassword(e.target.value);
    setError("");
  }, onKeyDown: (e) => e.key === "Enter" && handleResetPassword(), style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPw(!showPw), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showPw ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("resetConfirmNewPassword")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showConfirm ? "text" : "password", value: confirmPw, onChange: (e) => {
    setConfirmPw(e.target.value);
    setError("");
  }, onKeyDown: (e) => e.key === "Enter" && handleResetPassword(), style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowConfirm(!showConfirm), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showConfirm ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 }))))), /* @__PURE__ */ React.createElement("button", { onClick: handleResetPassword, disabled: loading || !password || !confirmPw, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("resetPassword"))))));
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
    if (!password || password.length < 8) {
      setError(t("passwordMinLength"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    if (!email || !code) {
      setError("Th\xF4ng tin kh\xF4ng h\u1EE3p l\u1EC7, vui l\xF2ng th\u1EED l\u1EA1i");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await resetPassword(email, code, password);
      setSuccess(true);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" } }, /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#2F855A", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" } }, t("resetPasswordSuccess")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, t("resetPasswordSuccessDesc")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), style: { padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToLogin"))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80", alt: "bg", style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }, onClick: () => setPage("home") }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 32, filter: "brightness(0) invert(1)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 18, color: "#fff" } }, "Design Gallery"))), /* @__PURE__ */ React.createElement("div", { className: "auth-form-panel", style: { width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 340, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 30 } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 16, color: BLACK } }, "Design Gallery")), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" } }, t("resetPassword")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, t("resetCodeSentDesc")), error && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 12, margin: 0 } }, error)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("resetNewPassword")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPassword ? "text" : "password", value: password, onChange: (e) => {
    setPassword(e.target.value);
    setError("");
  }, style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPassword(!showPassword), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showPassword ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("resetConfirmNewPassword")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showConfirm ? "text" : "password", value: confirmPassword, onChange: (e) => {
    setConfirmPassword(e.target.value);
    setError("");
  }, style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowConfirm(!showConfirm), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showConfirm ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 }))))), /* @__PURE__ */ React.createElement("button", { onClick: handleReset, disabled: loading || !password || !confirmPassword, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("resetPassword")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 } }, /* @__PURE__ */ React.createElement("span", { onClick: () => setPage("auth"), style: { color: CERULEAN, cursor: "pointer", fontWeight: 600 } }, t("backToLogin"))))));
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
    if (!email) {
      setError("Vui l\xF2ng \u0111\u0103ng nh\u1EADp tr\u01B0\u1EDBc");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await sendEmailVerification(email);
      setSent(true);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      }), 1e3);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerify = async () => {
    if (!code || code.length < 6) {
      setError("Vui l\xF2ng nh\u1EADp m\xE3 x\xE1c th\u1EF1c");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await verifyEmail(email, code);
      setSuccess(true);
      refreshSession();
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };
  if (success) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%", alignItems: "center", justifyContent: "center", background: GRAY_BG } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 400, width: "100%", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 64, height: 64, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" } }, /* @__PURE__ */ React.createElement("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#2F855A", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, color: BLACK, margin: "0 0 8px" } }, t("emailVerified")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, t("emailVerifiedDesc")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("home"), style: { padding: "12px 32px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToHome"))));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100vh", width: "100%" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: 1, position: "relative" } }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=1200&q=80", alt: "bg", style: { width: "100%", height: "100%", objectFit: "cover" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(26,75,168,0.6) 0%, rgba(0,0,0,0.55) 100%)" } }), /* @__PURE__ */ React.createElement("div", { style: { position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }, onClick: () => setPage("home") }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 32, filter: "brightness(0) invert(1)" } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 18, color: "#fff" } }, "Design Gallery"))), /* @__PURE__ */ React.createElement("div", { className: "auth-form-panel", style: { width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 340, margin: "0 auto" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 10, marginBottom: 24 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 30 } }), /* @__PURE__ */ React.createElement("span", { style: { fontWeight: 700, fontSize: 16, color: BLACK } }, "Design Gallery")), /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" } }, t("verifyEmail")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, sent ? t("resetCodeSentDesc") : t("verifyEmailDesc")), error && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 12, margin: 0 } }, error)), !sent ? /* @__PURE__ */ React.createElement("button", { onClick: handleSendCode, disabled: loading || !email, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("sendVerificationCode")) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("enterResetCode")), /* @__PURE__ */ React.createElement("input", { type: "text", value: code, onChange: (e) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
    setError("");
  }, placeholder: "000000", maxLength: 6, style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" } })), /* @__PURE__ */ React.createElement("button", { onClick: handleVerify, disabled: loading || code.length < 6, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("verifyEmailButton")), cooldown > 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 } }, t("resendCode"), " (", cooldown, "s)") : /* @__PURE__ */ React.createElement("p", { onClick: handleSendCode, style: { fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 } }, t("resendCode"))))));
}
function AdminOrdersPage({ setPage }) {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    api.orders.list().then((data) => {
      if (data && data.orders && data.orders.length > 0) {
        setOrders(data.orders);
      } else {
        setOrders([
          { id: "1", senderName: "Nguy\u1EC5n V\u0103n A", senderEmail: "nva@example.com", purpose: "order", content: "Y\xEAu c\u1EA7u in 50 cu\u1ED1n Portfolio ch\u1EA5t l\u01B0\u1EE3ng cao, b\xECa c\u1EE9ng.", createdAt: (/* @__PURE__ */ new Date()).toISOString(), isRead: false },
          { id: "2", senderName: "Tr\u1EA7n Th\u1ECB B", senderEmail: "ttb@example.com", purpose: "order", content: "C\u1EA7n in t\u1EADp san \u0111\u1ED3 h\u1ECDa K16 s\u1ED1 l\u01B0\u1EE3ng 200 b\u1EA3n.", createdAt: new Date(Date.now() - 864e5).toISOString(), isRead: true }
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
    return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_orders", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center justify-center" }, /* @__PURE__ */ React.createElement(GlobalLoading, null), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 font-medium mt-4 animate-pulse" }, "\u0110ang t\u1EA3i d\u1EEF li\u1EC7u \u0111\u01A1n h\xE0ng...")));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_orders", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121] mb-6" }, "Qu\u1EA3n l\xFD \u0110\u01A1n h\xE0ng In \u1EA5n"), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left text-sm" }, /* @__PURE__ */ React.createElement("thead", { className: "bg-[#F8F8F8] border-b border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "px-5 py-4 font-bold text-[#212121]" }, "Kh\xE1ch h\xE0ng"), /* @__PURE__ */ React.createElement("th", { className: "px-5 py-4 font-bold text-[#212121]" }, "Li\xEAn h\u1EC7"), /* @__PURE__ */ React.createElement("th", { className: "px-5 py-4 font-bold text-[#212121]" }, "N\u1ED9i dung y\xEAu c\u1EA7u"), /* @__PURE__ */ React.createElement("th", { className: "px-5 py-4 font-bold text-[#212121]" }, "Ng\xE0y g\u1EEDi"), /* @__PURE__ */ React.createElement("th", { className: "px-5 py-4 font-bold text-[#212121]" }, "Tr\u1EA1ng th\xE1i"))), /* @__PURE__ */ React.createElement("tbody", { className: "divide-y divide-[#E0E0E0]" }, orders.map((order) => {
    let parsed = null;
    try {
      parsed = JSON.parse(order.content);
    } catch (e) {
      parsed = { description: order.content };
    }
    return /* @__PURE__ */ React.createElement("tr", { key: order.id, onClick: () => setSelectedOrder(order), className: "cursor-pointer border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "px-5 py-4 font-semibold text-[#212121]" }, order.senderName), /* @__PURE__ */ React.createElement("td", { className: "px-5 py-4 text-[#666666]" }, order.senderEmail), /* @__PURE__ */ React.createElement("td", { className: "px-5 py-4 text-[#666666] max-w-xs truncate" }, parsed.artworkTitle ? `\u0110\u1EB7t in: ${parsed.artworkTitle} - ` : "", parsed.description || order.content), /* @__PURE__ */ React.createElement("td", { className: "px-5 py-4 text-[#666666]" }, new Date(order.createdAt).toLocaleDateString("vi-VN")), /* @__PURE__ */ React.createElement("td", { className: "px-5 py-4" }, /* @__PURE__ */ React.createElement("span", { className: `px-2.5 py-1 rounded-full text-xs font-bold ${order.isRead ? "bg-[#E0E0E0] text-[#666]" : "bg-[#e0eaff] text-[#1a4ba8]"}` }, order.isRead ? "\u0110\xE3 xem" : "M\u1EDBi")));
  }))), orders.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "p-8 text-center text-[#666666]" }, "Kh\xF4ng c\xF3 \u0111\u01A1n h\xE0ng n\xE0o."))), selectedOrder && (() => {
    let parsed = null;
    try {
      parsed = JSON.parse(selectedOrder.content);
    } catch (e) {
      parsed = { description: selectedOrder.content };
    }
    return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col p-8 rounded-none" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6 border-b border-gray-100 pb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-light text-xl tracking-wide text-[#212121]" }, "Chi ti\u1EBFt \u0111\u01A1n h\xE0ng"), /* @__PURE__ */ React.createElement("button", { onClick: () => setSelectedOrder(null), className: "text-gray-400 hover:text-black transition-colors" }, /* @__PURE__ */ React.createElement(X, { size: 24, strokeWidth: 1.5 }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("img", { src: parsed.artworkImage || selectedOrder.coverImageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&h=500&fit=crop", alt: "Artwork", className: "w-full h-auto aspect-square object-cover border border-gray-100 rounded-none" })), /* @__PURE__ */ React.createElement("div", { className: "space-y-5" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "T\xE0i kho\u1EA3n ng\u01B0\u1EDDi \u0111\u1EB7t (Buyer)"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-800 font-light" }, selectedOrder.senderName, " (", selectedOrder.senderEmail, ")")), parsed.company && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "C\xF4ng ty / T\u1ED5 ch\u1EE9c"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-800 font-light" }, parsed.company)), parsed.phone && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-800 font-light" }, parsed.phone)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "T\xEAn \u1EA4n ph\u1EA9m"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-800 font-light" }, parsed.artworkTitle || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "T\xE1c gi\u1EA3 (Student)"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-800 font-light" }, selectedOrder.recipient?.fullName || "\u2014")), parsed.artworkId && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "Link li\xEAn k\u1EBFt"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("detail", { artworkId: parsed.artworkId }), className: "text-[13.5px] font-light text-[#1a4ba8] hover:text-[#0f2e6e] flex items-center gap-1.5 transition-colors" }, "Chuy\u1EC3n \u0111\u1EBFn \u1EA5n ph\u1EA9m ", /* @__PURE__ */ React.createElement(ExternalLink, { size: 14, strokeWidth: 1.5 }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("span", { className: "block text-[11px] text-gray-400 uppercase tracking-[0.15em] mb-1.5" }, "N\u1ED9i dung order"), " ", /* @__PURE__ */ React.createElement("p", { className: "text-[13.5px] text-gray-700 font-light bg-gray-50/50 p-4 border border-gray-100 rounded-xl leading-relaxed" }, parsed.description || selectedOrder.content))))));
  })());
}
function AdminDashboardPage({ setPage }) {
  const { user } = useAuth();
  const userRole = user?.role || "admin";
  const [adminStats, setAdminStats] = useState({ publishedArtworks: 0, reportedArtworks: 0, totalAccounts: 0, totalInteractions: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    Promise.all([
      api.admin.stats(),
      api.admin.artworks({ limit: "6" }).catch(() => ({ artworks: [] }))
    ]).then(([stats2, artRes]) => {
      setAdminStats(stats2);
      setRecentActivity((artRes.artworks || []).slice(0, 6));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const stats = [
    { label: t("publishedArtworks"), value: adminStats.publishedArtworks || 0, hint: t("totalPublishedArtworks"), accent: "#1a4ba8" },
    { label: t("reportedArtworks"), value: adminStats.reportedArtworks || 0, hint: t("needsProcessing"), accent: "#8B1A1A" },
    { label: t("totalAccounts"), value: adminStats.totalAccounts || 0, hint: "SV + GV + Admin", accent: "#212121" },
    { label: t("interactions"), value: (adminStats.totalInteractions || 0).toLocaleString(), hint: t("likesAndComments"), accent: "#0d2e6e" }
  ];
  const categoryCounts = [];
  const recent = recentActivity.slice(0, 4).map((a) => ({
    color: a.isPublic ? "#1a4ba8" : "#8B1A1A",
    text: `${a.user?.fullName || "User"} ${a.isPublic ? t("approvedArtwork") : t("justPosted")} "${(a.title || "").slice(0, 30)}"`
  }));
  const statusBadge = (s) => {
    if (s === "B\u1ECB b\xE1o c\xE1o") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "\u0110\xE3 \u1EA9n") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "N\u1ED5i b\u1EADt") return "bg-blue-50 text-[#1a4ba8] border border-[#a8bce0]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white relative" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8 bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121]" }, userRole === "lecturer" ? "T\u1ED5ng quan Gi\u1EA3ng vi\xEAn" : t("adminOverview")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mt-1" }, userRole === "lecturer" ? "Theo d\xF5i ti\u1EBFn \u0111\u1ED9, s\u1ED1 li\u1EC7u h\u1EC7 th\u1ED1ng c\u1EE7a sinh vi\xEAn" : t("adminDescription"))), /* @__PURE__ */ React.createElement("button", { onClick: async () => {
    const doc = new jsPDF();
    doc.addFont("https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf", "Roboto", "normal");
    doc.setFont("Roboto");
    doc.text("BAO CAO TONG QUAN HE THONG", 14, 20);
    autoTable(doc, {
      startY: 30,
      head: [["Chi tieu", "Gia tri", "Chu thich"]],
      body: stats.map((s) => [s.label, s.value, s.hint]),
      theme: "grid",
      styles: { font: "Roboto" }
    });
    doc.text("HOAT DONG GAN DAY", 14, doc.lastAutoTable.finalY + 15);
    autoTable(doc, {
      startY: doc.lastAutoTable.finalY + 25,
      head: [["Hoat dong", "Loai"]],
      body: recentActivity.map((a) => [
        a.user?.fullName + (a.isPublic ? " da duoc duyet an pham " : " vua dang an pham ") + a.title,
        a.isPublic ? "Duyet" : "Moi"
      ]),
      theme: "striped",
      styles: { font: "Roboto" }
    });
    doc.save("Bao_Cao_Tong_Quan.pdf");
  }, className: "px-4 py-2.5 bg-[#1a4ba8] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2e6e] transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(FileDown, { size: 16 }), " ", t("pdfReport"))), loading ? /* @__PURE__ */ React.createElement(GlobalLoading, null) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6" }, stats.map((s) => /* @__PURE__ */ React.createElement("div", { key: s.label, className: "bg-white border border-[#E0E0E0] rounded-xl p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-3" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, s.label), /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-extrabold text-[#212121] leading-none" }, s.value)), /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 rounded-full", style: { background: s.accent } })), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mt-3" }, s.hint)))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 xl:grid-cols-3 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "xl:col-span-2 bg-white border border-[#E0E0E0] rounded-xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-[#212121]" }, t("artworksToReview")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mt-1" }, t("artworksToReviewDesc"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin_artworks"), className: "text-sm font-semibold text-[#1a4ba8] hover:text-[#0d2e6e] transition-colors" }, t("openProcessingPage"), " \u2192")), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("artworkName")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("student")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("subject")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("date")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("status")))), /* @__PURE__ */ React.createElement("tbody", null, recentActivity.map((a) => {
    const aStatus = a.isPublic ? "\u0110ang hi\u1EC3n th\u1ECB" : a.isHighlighted ? "N\u1ED5i b\u1EADt" : "\u0110\xE3 \u1EA9n";
    return /* @__PURE__ */ React.createElement("tr", { key: a.id }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("img", { src: a.coverImageUrl, className: "w-10 h-10 rounded-md object-cover bg-[#E0E0E0] border border-[#E0E0E0]" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-[#212121] truncate max-w-[260px]" }, a.title))), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, a.user?.fullName || ""), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, a.subject || ""), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("span", { className: `text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge(aStatus)}` }, aStatus)));
  }))))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-5" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-[#212121] mb-4" }, t("artworkDistributionBySubject")), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, categoryCounts.map((c) => /* @__PURE__ */ React.createElement("div", { key: c.label, className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "w-24 text-xs text-[#666666]" }, c.label), /* @__PURE__ */ React.createElement("div", { className: "flex-1 h-2.5 bg-[#F8F8F8] rounded-full overflow-hidden border border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", { className: "h-full rounded-full", style: { width: `${Math.min(100, c.value / 60 * 100)}%`, background: c.color } })), /* @__PURE__ */ React.createElement("span", { className: "w-10 text-right text-xs font-semibold text-[#212121]" }, c.value))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-5" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-[#212121]" }, t("recentActivity")), /* @__PURE__ */ React.createElement("span", { className: "text-xs text-[#666666]" }, t("today"))), /* @__PURE__ */ React.createElement("div", { className: "space-y-3" }, recent.map((r, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "flex items-start gap-3" }, /* @__PURE__ */ React.createElement("span", { className: "mt-1 w-2.5 h-2.5 rounded-full", style: { background: r.color } }), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] leading-relaxed" }, r.text))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-5" }, /* @__PURE__ */ React.createElement("h3", { className: "text-sm font-bold text-[#212121] mb-4" }, t("quickActions")), /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin_artworks"), className: "w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, className: "text-[#8B1A1A]" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121]" }, t("handleViolations")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, t("hideDeleteHighlight")))), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin_users"), className: "w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left" }, /* @__PURE__ */ React.createElement(Users, { size: 16, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121]" }, t("manageAccounts")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, t("permissionsAndLock")))))))))));
}
function MessagesPage({ setPage, userData }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  useEffect(() => {
    api.messages.list().then((data) => {
      setMessages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const toggleMessage = (id) => {
    if (expandedId === id) {
      setExpandedId(null);
    } else {
      setExpandedId(id);
      api.messages.markRead(id).catch(() => {
      });
      setMessages((prev) => prev.map((m) => m.id === id ? { ...m, isRead: true } : m));
    }
  };
  const handleArchive = async (id) => {
    try {
      await api.messages.archive(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      alert(t("archiveError") + (e?.message || t("pleaseTryAgain")));
    }
  };
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = /* @__PURE__ */ new Date();
    const diff = now - d;
    if (diff < 864e5 && d.getDate() === now.getDate()) return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    if (diff < 1728e5) return t("yesterday");
    return d.toLocaleDateString("vi-VN");
  };
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG } }, /* @__PURE__ */ React.createElement(DashboardSidebar, { activePage: "messages", setPage, userData }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: "32px 40px" } }, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 22, fontWeight: 700, margin: "0 0 24px", color: BLACK } }, t("inboxTitle")), loading ? /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", color: MUTED, padding: 40 } }, t("loading")) : messages.length === 0 ? /* @__PURE__ */ React.createElement("p", { style: { textAlign: "center", color: MUTED, padding: 40, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` } }, t("noMessages")) : /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 12 } }, messages.map((msg) => /* @__PURE__ */ React.createElement("div", { key: msg.id, style: { display: "flex", flexDirection: "column", background: msg.isRead ? "#fff" : "#eef4ff", borderRadius: 12, border: `1px solid ${msg.isRead ? GRAY_LIGHT : "#a8bce0"}`, overflow: "hidden" } }, /* @__PURE__ */ React.createElement("div", { onClick: () => toggleMessage(msg.id), style: { display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 44, height: 44, borderRadius: "50%", background: msg.isRead ? GRAY_BG : CERULEAN, display: "flex", alignItems: "center", justifyContent: "center", color: msg.isRead ? MUTED : "#fff", fontWeight: 700, fontSize: 16 } }, msg.senderName?.charAt(0) || "?"), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, minWidth: 0 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "baseline", gap: 10 } }, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 15, fontWeight: msg.isRead ? 600 : 700, color: BLACK, margin: "0 0 4px" } }, msg.senderName), msg.senderCompany && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: MUTED } }, "\u2022 ", msg.senderCompany)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, alignItems: "center" } }, msg.purpose === "order" && /* @__PURE__ */ React.createElement("span", { style: { background: "#ECFDF5", border: `1px solid #10B981`, fontSize: 11, padding: "2px 8px", borderRadius: 12, color: "#059669", whiteSpace: "nowrap" } }, t("order")), msg.purpose && msg.purpose !== "order" && /* @__PURE__ */ React.createElement("span", { style: { background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, fontSize: 11, padding: "2px 8px", borderRadius: 12, color: MUTED, whiteSpace: "nowrap" } }, msg.purpose), msg.purpose === "order" && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: msg.isRead ? MUTED : BLACK, margin: 0, fontWeight: msg.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" } }, t("orderArtwork")), msg.purpose !== "order" && msg.content && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: msg.isRead ? MUTED : BLACK, margin: 0, fontWeight: msg.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 } }, msg.content?.substring(0, 100) || ""))), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 } }, /* @__PURE__ */ React.createElement("span", { style: { fontSize: 12, color: MUTED, whiteSpace: "nowrap" } }, formatDate(msg.createdAt)), msg.isRead ? /* @__PURE__ */ React.createElement(MailOpen, { size: 14, color: MUTED }) : /* @__PURE__ */ React.createElement(Mail, { size: 14, color: CERULEAN }))), expandedId === msg.id && /* @__PURE__ */ React.createElement("div", { style: { padding: "0 20px 20px 80px" } }, /* @__PURE__ */ React.createElement("div", { style: { padding: "16px", background: GRAY_BG, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}` } }, msg.purpose === "order" ? /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, alignItems: "start" } }, (() => {
    try {
      const data = JSON.parse(msg.content);
      return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 16, flexWrap: "wrap" } }, /* @__PURE__ */ React.createElement("div", { style: { flex: "0 0 120px", borderRadius: 8, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` } }, /* @__PURE__ */ React.createElement("img", { src: data.artworkImage, alt: data.artworkTitle, style: { width: "100%", height: 120, objectFit: "cover" } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, fontWeight: 600, color: BLACK, margin: "0 0 8px" } }, data.artworkTitle), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#444", margin: "0 0 8px", lineHeight: 1.5 } }, data.description || t("noDescription")), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 8, marginBottom: 8 } }, data.phone && /* @__PURE__ */ React.createElement("a", { href: `tel:${data.phone}`, style: { fontSize: 13, color: CERULEAN, textDecoration: "underline" } }, "\u{1F4DE} ", data.phone), data.company && /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: "#666" } }, "\u{1F3E2} ", data.company))));
    } catch {
      return /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: BLACK, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" } }, msg.content);
    }
  })()) : /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: BLACK, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" } }, msg.content)), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 10, marginTop: 16 } }, msg.purpose === "order" ? /* @__PURE__ */ React.createElement("button", { onClick: () => {
    const data = JSON.parse(msg.content);
    if (data.artworkId) {
      setPage("detail", { artworkId: data.artworkId });
    } else {
      setPage("messages");
    }
  }, style: { padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Mail, { size: 14 }), " ", t("viewArtwork")) : /* @__PURE__ */ React.createElement(
    "a",
    {
      href: `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.senderEmail)}&su=${encodeURIComponent(`Reply: ${msg.purpose || t("portfolioContact")}`)}&body=${encodeURIComponent(
        `--- Original message from ${msg.senderName} (${msg.senderEmail}) ---
${msg.purpose ? `Purpose: ${msg.purpose}
` : ""}${msg.content}

--- My reply ---
`
      )}`,
      target: "_blank",
      rel: "noopener noreferrer",
      style: { padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }
    },
    /* @__PURE__ */ React.createElement(Mail, { size: 14 }),
    " ",
    t("replyViaEmail")
  ), /* @__PURE__ */ React.createElement("button", { onClick: () => handleArchive(msg.id), style: { padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: "pointer", color: BLACK, display: "flex", alignItems: "center", gap: 6 } }, /* @__PURE__ */ React.createElement(Archive, { size: 14 }), " ", t("archive")))))))));
}
function AdminSidebar({ active, setPage }) {
  const { user } = useAuth();
  const userRole = user?.role || "admin";
  const items = [
    { icon: /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 18 }), label: t("overview"), page: "admin" },
    { icon: /* @__PURE__ */ React.createElement(Users, { size: 18 }), label: t("accounts"), page: "admin_users", adminOnly: true },
    { icon: /* @__PURE__ */ React.createElement(ShoppingCart, { size: 18 }), label: t("orders"), page: "admin_orders" },
    { icon: /* @__PURE__ */ React.createElement(ShieldAlert, { size: 18 }), label: "Qu\u1EA3n l\xFD \u1EA5n ph\u1EA9m", page: "admin_artworks" },
    { icon: /* @__PURE__ */ React.createElement(Folder, { size: 18 }), label: "In t\u1EADp san", page: "admin_export" },
    { icon: /* @__PURE__ */ React.createElement(Star, { size: 18 }), label: "Qu\u1EA3n l\xFD huy hi\u1EC7u", page: "badges", adminOnly: true },
    { icon: /* @__PURE__ */ React.createElement(FileBadge, { size: 18 }), label: t("watermarkSettings"), page: "admin_watermark", adminOnly: true },
    { icon: /* @__PURE__ */ React.createElement(Settings, { size: 18 }), label: "C\xE0i \u0111\u1EB7t giao di\u1EC7n", page: "admin_layout", adminOnly: true }
  ].filter((item) => !item.adminOnly || userRole === "admin");
  return /* @__PURE__ */ React.createElement("div", { className: "w-64 bg-[#F8F8F8] border-r border-[#E0E0E0] flex-shrink-0 flex flex-col h-full overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "p-6 border-b border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] text-sm uppercase tracking-wider" }, userRole === "lecturer" ? "GI\u1EA2NG VI\xCAN" : t("adminPanel")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] mt-1" }, userRole === "lecturer" ? "H\u1EC7 th\u1ED1ng Gi\u1EA3ng vi\xEAn" : t("adminSystem"))), /* @__PURE__ */ React.createElement("div", { className: "py-4" }, items.map((item) => /* @__PURE__ */ React.createElement("div", { key: item.label, onClick: () => setPage(item.page), className: `flex items-center gap-3 px-6 py-3 cursor-pointer border-r-4 ${active === item.page ? "bg-[#e0eaff] border-[#1a4ba8] text-[#1a4ba8]" : "border-transparent text-[#212121] hover:bg-white"}` }, /* @__PURE__ */ React.createElement("span", { className: active === item.page ? "text-[#1a4ba8]" : "text-[#666666]" }, item.icon), /* @__PURE__ */ React.createElement("span", { className: `text-sm ${active === item.page ? "font-semibold" : "font-medium"}` }, item.label)))), /* @__PURE__ */ React.createElement("div", { className: "mt-auto p-6" }));
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
  const [projectYear, setProjectYear] = useState("N\u0103m 3");
  const [isGroupProject, setIsGroupProject] = useState(false);
  const [friends, setFriends] = useState([]);
  const [friendInput, setFriendInput] = useState("");
  const [friendResults, setFriendResults] = useState([]);
  const [friendSearching, setFriendSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [originalCover, setOriginalCover] = useState("");
  const [additionalImages, setAdditionalImages] = useState([]);
  const [defaultWatermarkText, setDefaultWatermarkText] = useState(() => "UEF");
  const allSubjects = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const semesterToYear = { HK1: "N\u0103m 1", HK2: "N\u0103m 2", HK3: "N\u0103m 3" };
  const yearToSemester = { "N\u0103m 1": "HK1", "N\u0103m 2": "HK2", "N\u0103m 3": "HK3", "N\u0103m 4": "HK1", "T\u1ED1t nghi\u1EC7p": "HK2" };
  const yearToAcademic = { "N\u0103m 1": "2024-2025", "N\u0103m 2": "2023-2024", "N\u0103m 3": "2022-2023", "N\u0103m 4": "2021-2022", "T\u1ED1t nghi\u1EC7p": "2021-2022" };
  useEffect(() => {
    if (!activeArtworkId) return;
    setLoading(true);
    if (String(activeArtworkId).startsWith("mock-")) {
      const mockArt = window.MOCK_PROJECTS?.find((p) => p.id === activeArtworkId);
      if (mockArt) {
        setTitle(mockArt.title || "");
        setDescription(mockArt.description || "");
        setSubject(mockArt.subject || "");
        setTools(mockArt.toolsUsed || []);
        setTags(mockArt.tags || []);
        setOriginalCover(mockArt.coverImageUrl || "");
        setAdditionalImages((mockArt.fileUrls || []).filter((url) => url !== mockArt.coverImageUrl));
        setProjectYear("N\u0103m 3");
        setLoading(false);
        return;
      }
    }
    api.artworks.get(activeArtworkId).then((res) => {
      setTitle(res.title || "");
      setDescription(res.description || "");
      setSubject(res.subject || "");
      setTools(res.toolsUsed || []);
      setTags(res.tags || []);
      setOriginalCover(res.coverImageUrl || "");
      setAdditionalImages((res.fileUrls || []).filter((url) => url !== res.coverImageUrl));
      if (res.semester) {
        const yr = semesterToYear[res.semester];
        if (yr) setProjectYear(yr);
      }
      const collabs = res.collaborators || [];
      if (collabs.length > 0) {
        setIsGroupProject(true);
        setFriends(collabs);
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [activeArtworkId]);
  useEffect(() => {
    fetch("/api/site-settings?_t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((data) => {
      if (data.watermark_text) setDefaultWatermarkText(data.watermark_text);
    }).catch(() => {
    });
  }, []);
  const handleSave = async () => {
    if (!title.trim()) {
      setMessage({ type: "error", text: t("pleaseEnterCourseName") });
      return;
    }
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      let finalWm = defaultWatermarkText || "UEF";
      try {
        const settingsRes = await fetch("/api/site-settings", { cache: "no-store" });
        const settingsData = await settingsRes.json();
        if (settingsData.watermark_text !== void 0) {
          finalWm = settingsData.watermark_text || "UEF";
        }
      } catch (e) {
      }
      const body = {
        title: title.trim(),
        description: description.trim() || null,
        subject: subject || null,
        toolsUsed: tools,
        tags,
        collaborators: friends.map((f) => f.fullName || f),
        collaboratorIds: friends.map((f) => f.id).filter(Boolean),
        fileUrls: [coverImage || originalCover, ...additionalImages].filter(Boolean),
        coverImageUrl: coverImage || originalCover,
        watermarkText: finalWm,
        watermarkPosition: "bottom-right",
        semester: yearToSemester[projectYear] || "HK1",
        academicYear: yearToAcademic[projectYear] || "2024-2025"
      };
      await api.artworks.update(activeArtworkId, body);
      setMessage({ type: "success", text: t("updated") });
      setTimeout(() => setPage("dashboard"), 1e3);
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "L\u1ED7i l\u01B0u" });
    }
    setSaving(false);
  };
  const handleFriendSearch = (val) => {
    setFriendInput(val);
    if (val.length < 2) {
      setFriendResults([]);
      return;
    }
    setFriendSearching(true);
    api.users.search(val).then(setFriendResults).catch(() => {
    }).finally(() => setFriendSearching(false));
  };
  const addFriend = (user) => {
    if (!friends.find((f) => f.id === user.id)) {
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
    setAdditionalImages((prev) => [...prev, ...urls].slice(0, 9));
  };
  const removeImage = (idx) => {
    setAdditionalImages((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleDelete = async () => {
    if (!confirm(t("confirmDeleteArtwork"))) return;
    try {
      await api.artworks.delete(activeArtworkId);
      setPage("dashboard");
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "L\u1ED7i x\xF3a" });
    }
  };
  if (loading) return /* @__PURE__ */ React.createElement(GlobalLoading, null);
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white min-h-[calc(100vh-60px)] px-16 py-10" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-sm text-[#666666] mb-6 cursor-pointer hover:text-[#212121] transition-colors inline-flex", onClick: () => setPage("dashboard") }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { className: "rotate-90", size: 16 }), " ", t("backToMyArtworks")), /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121] mb-1" }, t("editArtwork")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-8" }, t("updateArtworkDetails")), message.text && /* @__PURE__ */ React.createElement("div", { className: `mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}` }, message.text), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("coverImage")), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer" }, /* @__PURE__ */ React.createElement("img", { src: coverImage || originalCover, alt: "cover", className: "w-full h-[360px] object-cover block" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center" }, /* @__PURE__ */ React.createElement("label", { className: "cursor-pointer" }, /* @__PURE__ */ React.createElement("span", { className: "px-5 py-2.5 rounded-lg border-2 border-white text-white text-sm font-semibold flex items-center gap-2 hover:bg-white hover:text-[#212121] transition-colors" }, /* @__PURE__ */ React.createElement(Image, { size: 16 }), " ", t("changeCoverImage")), /* @__PURE__ */ React.createElement("input", { type: "file", accept: "image/*", className: "hidden", onChange: handleCoverChange })))), /* @__PURE__ */ React.createElement("div", { className: "mt-4" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("additionalImages"), " (", additionalImages.length, "/9)"), /* @__PURE__ */ React.createElement("input", { type: "file", id: "editAdditionalInput", accept: "image/*", multiple: true, className: "hidden", onChange: handleAddImage }), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 flex-wrap" }, additionalImages.map((url, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "relative w-[90px] h-[72px] rounded-lg overflow-hidden border border-[#E0E0E0] group" }, /* @__PURE__ */ React.createElement("img", { src: url, alt: "", className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("button", { onClick: () => removeImage(idx), className: "absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" }, "\xD7"))), additionalImages.length < 9 && /* @__PURE__ */ React.createElement("button", { onClick: () => document.getElementById("editAdditionalInput")?.click(), className: "w-[90px] h-[72px] rounded-lg border-2 border-dashed border-[#E0E0E0] flex items-center justify-center text-[#666666] hover:border-[#1a4ba8] hover:text-[#1a4ba8] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(Plus, { size: 22 }))))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("courseName")), /* @__PURE__ */ React.createElement("input", { value: title, onChange: (e) => setTitle(e.target.value), className: "w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none focus:border-[#1a4ba8] focus:bg-white transition-colors" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("projectType")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-1.5" }, ["N\u0103m 1", "N\u0103m 2", "N\u0103m 3", "N\u0103m 4", "T\u1ED1t nghi\u1EC7p"].map((y) => /* @__PURE__ */ React.createElement("button", { key: y, onClick: () => setProjectYear(y), className: `flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${projectYear === y ? "bg-[#eef4ff] border-[#1a4ba8] text-[#1a4ba8]" : "bg-[#F8F8F8] border-[#E0E0E0] text-[#666666]"}` }, y)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("assignmentType")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, [{ key: false, label: t("individual"), icon: /* @__PURE__ */ React.createElement(User, { size: 16 }) }, { key: true, label: t("group"), icon: /* @__PURE__ */ React.createElement(Users, { size: 16 }) }].map((opt) => /* @__PURE__ */ React.createElement("div", { key: opt.label, onClick: () => setIsGroupProject(opt.key), className: `flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg border cursor-pointer ${isGroupProject === opt.key ? "bg-[#eef4ff] border-[#1a4ba8]" : "bg-[#F8F8F8] border-[#E0E0E0]"}` }, /* @__PURE__ */ React.createElement("span", { className: isGroupProject === opt.key ? "text-[#1a4ba8]" : "text-[#666666]" }, opt.icon), /* @__PURE__ */ React.createElement("span", { className: `text-sm font-semibold ${isGroupProject === opt.key ? "text-[#1a4ba8]" : "text-[#212121]"}` }, opt.label))))), isGroupProject && /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("addTeamMembers")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]" }, friends.map((f, i) => /* @__PURE__ */ React.createElement("span", { key: f.id || i, className: "inline-flex items-center gap-1.5 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full" }, /* @__PURE__ */ React.createElement(User, { size: 12 }), " ", f.fullName || f, "  ", /* @__PURE__ */ React.createElement(X, { size: 10, className: "cursor-pointer", onClick: () => setFriends(friends.filter((_, idx) => idx !== i)) }))), /* @__PURE__ */ React.createElement("input", { value: friendInput, onChange: (e) => handleFriendSearch(e.target.value), placeholder: t("enterNameOrEmail"), className: "border-none bg-transparent outline-none text-sm min-w-[120px] text-[#212121] flex-1" })), friendResults.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto" }, friendResults.map((u) => /* @__PURE__ */ React.createElement("div", { key: u.id, onClick: () => addFriend(u), className: "flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8F8F8] cursor-pointer border-b border-[#E0E0E0] last:border-b-0" }, /* @__PURE__ */ React.createElement("img", { src: u.avatarUrl || "", alt: "", className: "w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-medium text-[#212121]" }, u.fullName), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, u.email)))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("description")), /* @__PURE__ */ React.createElement("textarea", { value: description, onChange: (e) => setDescription(e.target.value), className: "w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none min-h-[80px] resize-y focus:border-[#1a4ba8] focus:bg-white transition-colors" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("category")), /* @__PURE__ */ React.createElement("select", { value: subject, onChange: (e) => setSubject(e.target.value), className: "w-full px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:bg-white transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("selectOption")), allSubjects.map((s) => /* @__PURE__ */ React.createElement("option", { key: s, value: s }, s)))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("tools")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]" }, tools.map((t2) => /* @__PURE__ */ React.createElement("span", { key: t2, className: "inline-flex items-center gap-1 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full" }, t2, /* @__PURE__ */ React.createElement(X, { size: 10, className: "cursor-pointer", onClick: () => setTools(tools.filter((x) => x !== t2)) }))), /* @__PURE__ */ React.createElement("input", { value: toolInput, onChange: (e) => setToolInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter" && toolInput.trim()) {
      setTools([...tools, toolInput.trim()]);
      setToolInput("");
    }
  }, placeholder: "Add tool...", className: "border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("tags")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]" }, tags.map((t2) => /* @__PURE__ */ React.createElement("span", { key: t2, className: "inline-flex items-center gap-1 bg-[#e0eaff] text-[#1a4ba8] text-xs px-2.5 py-1 rounded-full" }, t2, /* @__PURE__ */ React.createElement(X, { size: 10, className: "cursor-pointer", onClick: () => setTags(tags.filter((x) => x !== t2)) }))), /* @__PURE__ */ React.createElement("input", { value: tagInput, onChange: (e) => setTagInput(e.target.value), onKeyDown: (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  }, placeholder: t("addTag"), className: "border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" }))), /* @__PURE__ */ React.createElement("div", { className: "mt-auto pt-4 border-t border-[#E0E0E0] flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: handleDelete, className: "flex-1 py-3 rounded-lg border border-[#8B1A1A] text-[#8B1A1A] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(Trash2, { size: 16 }), " ", t("deleteArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: handleSave, disabled: saving, className: "flex-[2] py-3 rounded-lg border-none bg-[#1a4ba8] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50" }, /* @__PURE__ */ React.createElement(Check, { size: 16 }), " ", saving ? t("saving") : t("saveChanges")))))));
}
function AdminUsersPage({ setPage }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, user: null });
  const [editModal, setEditModal] = useState({ isOpen: false, user: null });
  const [importFileName, setImportFileName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [userBadges, setUserBadges] = useState([]);
  const [availableBadges, setAvailableBadges] = useState([]);
  const [badgesLoading, setBadgesLoading] = useState(false);
  const { userRole } = useAuth();
  const importInputRef = useRef(null);
  const roleLabel = { student: "Sinh vi\xEAn", lecturer: t("lecturer"), admin: t("admin"), guest: t("guestLabel") || "Kh\xE1ch" };
  const fetchUsers = () => {
    setLoading(true);
    api.admin.users().then((res) => {
      setUsers(res.users || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const handleEditChange = (field, value) => {
    setEditModal((prev) => ({ ...prev, user: { ...prev.user, [field]: value } }));
  };
  useEffect(() => {
    if (editModal.isOpen && editModal.user) {
      setBadgesLoading(true);
      Promise.all([
        fetch(`/api/accountbadges/user/${editModal.user.id}`).then((r) => r.json()),
        fetch("/api/accountbadges").then((r) => r.json())
      ]).then(([userB, allB]) => {
        setUserBadges(userB || []);
        setAvailableBadges(allB || []);
        setBadgesLoading(false);
      }).catch(() => setBadgesLoading(false));
    }
  }, [editModal.isOpen, editModal.user?.id]);
  const toggleBadge = async (badgeId) => {
    try {
      const res = await fetch(`/api/accountbadges/${badgeId}/assign/${editModal.user.id}`, { method: "POST" });
      const data = await res.json();
      if (data.status === "assigned") {
        const b = availableBadges.find((x) => x.id === badgeId);
        if (b) setUserBadges((prev) => [...prev, b]);
      } else {
        setUserBadges((prev) => prev.filter((x) => x.id !== badgeId));
      }
    } catch (e) {
      alert("L\u1ED7i c\u1EA5p/thu h\u1ED3i huy hi\u1EC7u: " + e.message);
    }
  };
  const handleSaveUser = async () => {
    try {
      await api.admin.updateUser(editModal.user.id, editModal.user);
      alert("\u0110\xE3 l\u01B0u th\xF4ng tin t\xE0i kho\u1EA3n th\xE0nh c\xF4ng!");
      fetchUsers();
    } catch (e) {
      alert("L\u1ED7i khi l\u01B0u: " + (e.message || ""));
    }
    setEditModal({ isOpen: false, user: null });
  };
  const toggleLockUser = async (user) => {
    try {
      await api.admin.lockUser(user.id, !user.isActive);
      fetchUsers();
    } catch {
    }
    setConfirmModal({ isOpen: false, user: null });
  };
  const setRole = async (userId, role) => {
    try {
      await api.admin.setUserRole(userId, role);
      fetchUsers();
    } catch {
    }
  };
  const filteredUsers = users.filter((u) => {
    const matchesSearch = (u.fullName || "").toLowerCase().includes(searchQuery.toLowerCase()) || (u.email || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });
  const handleExportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(filteredUsers.map((u) => ({
      "H\u1ECD t\xEAn": u.fullName,
      "Email": u.email,
      "Vai tr\xF2": roleLabel[u.role] || u.role,
      "Ng\xE0y tham gia": u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "\u2014",
      "Tr\u1EA1ng th\xE1i": u.isActive ? "Ho\u1EA1t \u0111\u1ED9ng" : "B\u1ECB kh\xF3a"
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Accounts");
    XLSX.writeFile(wb, "Accounts_Report.xlsx");
  };
  const handleDeleteUser = async (user) => {
    if (confirm("B\u1EA1n c\xF3 ch\u1EAFc ch\u1EAFn mu\u1ED1n x\xF3a ng\u01B0\u1EDDi d\xF9ng " + user.fullName + "?")) {
      try {
        await api.admin.deleteUser(user.id);
        fetchUsers();
      } catch (e) {
        alert("L\u1ED7i khi x\xF3a: " + (e.message || ""));
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
          const workbook = XLSX.read(data, { type: "array" });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          const payload = json.map((row) => {
            const roleStr = (row["Vai tr\xF2"] || row["Role"] || "").toLowerCase();
            return {
              fullName: row["H\u1ECD t\xEAn"] || row["FullName"] || row["H\u1ECD v\xE0 t\xEAn"] || "Imported User",
              email: row["Email"] || row["email"] || `user_${Date.now()}@uef.edu.vn`,
              role: roleStr.includes("gi\u1EA3ng vi\xEAn") ? "lecturer" : roleStr.includes("qu\u1EA3n tr\u1ECB") ? "admin" : "student",
              studentId: row["MSSV"] || row["M\xE3 sinh vi\xEAn"] || row["StudentId"] || null
            };
          });
          await api.admin.importUsers(payload);
          alert("\u0110\xE3 import d\u1EEF li\u1EC7u th\xE0nh c\xF4ng!");
          fetchUsers();
          setImportFileName("");
        } catch (err) {
          alert("L\u1ED7i khi x\u1EED l\xFD file: " + (err.message || ""));
          setImportFileName("");
        }
      };
      reader.readAsArrayBuffer(file);
    } catch (err) {
      alert("L\u1ED7i import: " + (err.message || ""));
      setImportFileName("");
    }
    e.target.value = "";
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white relative" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_users", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121]" }, t("manageAccounts")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mt-1" }, t("userListDescription"))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      ref: importInputRef,
      type: "file",
      accept: ".xlsx,.xls",
      className: "hidden",
      onChange: handleImportFile
    }
  ), /* @__PURE__ */ React.createElement("button", { onClick: handleExportExcel, className: "px-4 py-2 border border-[#1a4ba8] text-[#1a4ba8] rounded-lg text-sm font-semibold hover:bg-[#e0eaff] transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { size: 16 }), "Export Excel"), /* @__PURE__ */ React.createElement("button", { onClick: () => importInputRef.current?.click(), className: "px-4 py-2 bg-[#1a4ba8] text-white rounded-lg text-sm font-semibold hover:bg-[#0d2e6e] transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ArrowDownCircle, { size: 16, className: "-rotate-90" }), "Import Excel"), /* @__PURE__ */ React.createElement(
    "select",
    {
      value: roleFilter,
      onChange: (e) => setRoleFilter(e.target.value),
      className: "px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]"
    },
    /* @__PURE__ */ React.createElement("option", { value: "all" }, "T\u1EA5t c\u1EA3 vai tr\xF2"),
    /* @__PURE__ */ React.createElement("option", { value: "admin" }, "Qu\u1EA3n tr\u1ECB vi\xEAn (Admin)"),
    /* @__PURE__ */ React.createElement("option", { value: "lecturer" }, "Gi\u1EA3ng vi\xEAn"),
    /* @__PURE__ */ React.createElement("option", { value: "student" }, "Sinh vi\xEAn"),
    /* @__PURE__ */ React.createElement("option", { value: "guest" }, "Kh\xE1ch (Guest)")
  ), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]", size: 16 }), /* @__PURE__ */ React.createElement("input", { value: searchQuery, onChange: (e) => setSearchQuery(e.target.value), placeholder: t("searchUser"), className: "pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#1a4ba8]" })))), importFileName && /* @__PURE__ */ React.createElement("div", { className: "mb-5 bg-[#e0eaff] border border-[#a8bce0] text-[#1a4ba8] rounded-lg px-4 py-3 text-sm flex items-center justify-between" }, /* @__PURE__ */ React.createElement("span", { className: "font-medium" }, t("selectedFile"), ": ", importFileName), /* @__PURE__ */ React.createElement("button", { onClick: () => setImportFileName(""), className: "text-[#1a4ba8] hover:text-[#0d2e6e] font-semibold text-sm" }, t("deselect"))), loading ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-16 text-[#666666] text-sm" }, t("loadingList")) : filteredUsers.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-16 text-[#666666] text-sm" }, t("noUsers")) : /* @__PURE__ */ React.createElement("div", { className: "border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("fullNameHeader")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("email")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("role")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("joinDate")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("actions")))), /* @__PURE__ */ React.createElement("tbody", null, filteredUsers.map((u) => {
    const roleVal = roleLabel[u.role] || u.role;
    const locked = !u.isActive;
    return /* @__PURE__ */ React.createElement("tr", { key: u.id, onClick: (e) => {
      if (!e.target.closest("button")) setEditModal({ isOpen: true, user: u });
    }, className: "border-b border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("img", { src: u.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(u.fullName || "User") + "&background=random", className: "w-8 h-8 rounded-full object-cover bg-[#E0E0E0]" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-[#212121]" }, u.fullName))), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, u.email), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "relative inline-flex w-40" }, /* @__PURE__ */ React.createElement(
      "select",
      {
        value: u.role,
        onChange: (e) => setRole(u.id, e.target.value),
        className: "w-full appearance-none px-3 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
      },
      Object.entries(roleLabel).map(([k, v]) => /* @__PURE__ */ React.createElement("option", { key: k, value: k }, v))
    ), /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" }))), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, u.createdAt ? new Date(u.createdAt).toLocaleDateString("vi-VN") : "\u2014"), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center" }, /* @__PURE__ */ React.createElement("button", { onClick: () => locked ? toggleLockUser(u) : setConfirmModal({ isOpen: true, user: u }), className: `px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer ${locked ? "border-[#1a4ba8] text-[#1a4ba8] hover:bg-[#1a4ba8] hover:text-white" : "border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white"}`, title: locked ? t("unlock") : t("lockAccount") }, locked ? /* @__PURE__ */ React.createElement(Unlock, { size: 14 }) : /* @__PURE__ */ React.createElement(Lock, { size: 14 }), /* @__PURE__ */ React.createElement("span", { className: "text-xs font-semibold" }, locked ? t("unlock") : t("lockAccount"))))));
  }))))), confirmModal.isOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col p-6 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 28, className: "text-[#8B1A1A]" })), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#212121] mb-2" }, t("lockAccountQuestion")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-6" }, t("lockAccountConfirm"), " ", /* @__PURE__ */ React.createElement("strong", null, confirmModal.user?.name), "? ", t("lockAccountWarning")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setConfirmModal({ isOpen: false, user: null }), className: "flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, t("cancel")), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleLockUser(confirmModal.user), className: "flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer" }, t("confirmLock"))))), editModal.isOpen && editModal.user && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden flex flex-col p-6 max-h-[90vh] overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center mb-6 border-b pb-3" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-xl text-[#212121]" }, "Chi ti\u1EBFt & Ch\u1EC9nh s\u1EEDa T\xE0i kho\u1EA3n"), /* @__PURE__ */ React.createElement("button", { onClick: () => setEditModal({ isOpen: false, user: null }), className: "text-[#666666] hover:text-black" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#1a4ba8] border-b pb-2" }, "Th\xF4ng tin c\u01A1 b\u1EA3n"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4 mb-4" }, /* @__PURE__ */ React.createElement("img", { src: editModal.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(editModal.user.fullName || "User")}&background=random`, alt: "Avatar", className: "w-16 h-16 rounded-full object-cover border border-gray-200" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "H\u1ECD v\xE0 t\xEAn"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.fullName || "", onChange: (e) => handleEditChange("fullName", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Email"), /* @__PURE__ */ React.createElement("input", { type: "email", value: editModal.user.email || "", onChange: (e) => handleEditChange("email", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm", disabled: true })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "S\u1ED1 \u0111i\u1EC7n tho\u1EA1i"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.phone || "", onChange: (e) => handleEditChange("phone", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "\u0110\u1ECBa ch\u1EC9"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.address || "", onChange: (e) => handleEditChange("address", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Gi\u1EDBi thi\u1EC7u (Bio)"), /* @__PURE__ */ React.createElement("textarea", { value: editModal.user.bio || "", onChange: (e) => handleEditChange("bio", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm", rows: 2 }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-center border-b pb-2" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#1a4ba8]" }, "Th\xF4ng tin \u0111\u1ECBnh danh"), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-semibold px-2 py-1 bg-gray-100 rounded-md uppercase tracking-wider" }, roleLabel[editModal.user.role] || editModal.user.role)), editModal.user.role === "student" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "M\xE3 s\u1ED1 sinh vi\xEAn (MSSV)"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.studentId || "", className: "w-full border border-gray-300 bg-gray-50 rounded-md px-3 py-1.5 text-sm font-semibold text-gray-600 cursor-not-allowed", disabled: true, title: "MSSV kh\xF4ng th\u1EC3 thay \u0111\u1ED5i" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Chuy\xEAn ng\xE0nh (Major)"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.major || "", onChange: (e) => handleEditChange("major", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Kh\xF3a (Cohort)"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.cohort || "", onChange: (e) => handleEditChange("cohort", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm", placeholder: "V\xED d\u1EE5: K16" }))), editModal.user.role === "lecturer" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Khoa c\xF4ng t\xE1c"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.department || "", onChange: (e) => handleEditChange("department", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "H\u1ECDc h\xE0m / H\u1ECDc v\u1ECB"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.title || "", onChange: (e) => handleEditChange("title", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm", placeholder: "ThS, TS, v.v." })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "C\xE1c l\u1EDBp ph\u1EE5 tr\xE1ch"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.managedClasses ? editModal.user.managedClasses.join(", ") : "", onChange: (e) => handleEditChange("managedClasses", e.target.value.split(",").map((s) => s.trim())), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm", placeholder: "Nh\u1EADp c\xE1c l\u1EDBp, ph\xE2n c\xE1ch b\u1EB1ng d\u1EA5u ph\u1EA9y" }))), (editModal.user.role === "employer" || editModal.user.role === "guest") && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "T\xEAn C\xF4ng ty / T\u1ED5 ch\u1EE9c"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.company || "", onChange: (e) => handleEditChange("company", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "Ch\u1EE9c v\u1EE5"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.position || "", onChange: (e) => handleEditChange("position", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-1" }, "L\u0129nh v\u1EF1c (Industry)"), /* @__PURE__ */ React.createElement("input", { type: "text", value: editModal.user.industry || "", onChange: (e) => handleEditChange("industry", e.target.value), className: "w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm" }))))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 border-t pt-4" }, /* @__PURE__ */ React.createElement("h4", { className: "font-semibold text-[#1a4ba8] mb-3" }, "Huy hi\u1EC7u T\xE0i kho\u1EA3n"), badgesLoading ? /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, "\u0110ang t\u1EA3i...") : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-2" }, "Huy hi\u1EC7u hi\u1EC7n c\xF3 (bao g\u1ED3m t\u1EF1 \u0111\u1ED9ng)"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2" }, userBadges.length === 0 ? /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-400" }, "Ch\u01B0a c\xF3 huy hi\u1EC7u") : userBadges.map((b) => /* @__PURE__ */ React.createElement("div", { key: b.id, className: "flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-semibold", style: { background: b.bgColor || "#f0f0f0", color: b.textColor || "#333", borderColor: "rgba(0,0,0,0.1)" }, title: b.tooltip }, (b.iconUrl || getBadgeIcon(b.name)) && /* @__PURE__ */ React.createElement("img", { src: b.iconUrl || getBadgeIcon(b.name), className: "w-3.5 h-3.5 object-cover" }), b.name, b.type === "Default" && /* @__PURE__ */ React.createElement("span", { className: "opacity-70 text-[10px] ml-1" }, "(T\u1EF1 \u0111\u1ED9ng)"))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-gray-500 mb-2" }, "C\u1EA5p/Thu h\u1ED3i huy hi\u1EC7u t\xF9y ch\u1EC9nh"), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2 max-h-32 overflow-y-auto pr-2" }, availableBadges.filter((b) => b.type !== "Default").length === 0 ? /* @__PURE__ */ React.createElement("span", { className: "text-sm text-gray-400" }, "Ch\u01B0a c\xF3 huy hi\u1EC7u Custom n\xE0o trong h\u1EC7 th\u1ED1ng.") : availableBadges.filter((b) => b.type !== "Default").map((b) => {
    const hasBadge = userBadges.some((ub) => ub.id === b.id);
    return /* @__PURE__ */ React.createElement("div", { key: b.id, className: "flex items-center justify-between border border-gray-200 rounded-md p-2 hover:bg-gray-50" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, (b.iconUrl || getBadgeIcon(b.name)) && /* @__PURE__ */ React.createElement("img", { src: b.iconUrl || getBadgeIcon(b.name), className: "w-4 h-4 object-cover" }), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-medium" }, b.name)), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleBadge(b.id), className: `px-3 py-1 rounded text-xs font-bold ${hasBadge ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-blue-50 text-blue-600 hover:bg-blue-100"}` }, hasBadge ? "Thu h\u1ED3i" : "C\u1EA5p"));
  }))))), /* @__PURE__ */ React.createElement("div", { className: "mt-8 flex justify-end gap-3 border-t pt-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setEditModal({ isOpen: false, user: null }), className: "px-5 py-2 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50" }, "H\u1EE7y"), /* @__PURE__ */ React.createElement("button", { onClick: handleSaveUser, className: "px-5 py-2 bg-[#1a4ba8] rounded-lg text-sm font-semibold text-white hover:bg-[#0d2e6e]" }, "L\u01B0u thay \u0111\u1ED5i")))));
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
  const [displayedCount, setDisplayedCount] = useState(25);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const observerTarget = useRef(null);
  const fetchId = useRef(0);
  const fetchArtworks = () => {
    const id = ++fetchId.current;
    setLoading(true);
    const params = { page, limit, tab: activeTab };
    if (query.trim()) params.q = query.trim();
    if (filterSubject !== t("all")) params.subject = filterSubject;
    if (filterYear !== t("all")) params.year = filterYear;
    api.admin.artworks(params).then((res) => {
      if (id === fetchId.current) {
        setData((prev) => ({
          ...res,
          artworks: page === 1 ? res.artworks || [] : [...prev.artworks || [], ...res.artworks || []],
          counts: res.counts || { all: 0, reported: 0, pending: 0, hidden: 0, highlight: 0 }
        }));
        setLoading(false);
      }
    }).catch(() => {
      if (id === fetchId.current) setLoading(false);
    });
  };
  useEffect(() => {
    fetchArtworks();
  }, [page, limit, activeTab, query, filterSubject, filterYear]);
  useEffect(() => {
    setPageNum(1);
    setSelectedIds([]);
    setDisplayedCount(25);
  }, [activeTab, query, filterSubject, filterYear]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          if (displayedCount < (data.artworks?.length || 0)) {
            setIsLoadingMore(true);
            setTimeout(() => {
              setDisplayedCount((prev) => Math.min(prev + 25, data.artworks?.length || 0));
              setIsLoadingMore(false);
            }, 300);
          } else if (!loading && (data.page || 1) < (data.totalPages || 0)) {
            setPageNum((p) => p + 1);
          }
        }
      },
      { threshold: 0.1 }
    );
    if (observerTarget.current) observer.observe(observerTarget.current);
    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [loading, data.page, data.totalPages, displayedCount, data.artworks?.length]);
  const filtered = data.artworks || [];
  const selected = filtered.find((a) => a.id === selectedId) ?? null;
  const handleOpenGallery = (idx) => {
    const imgs = Array.from(new Set([selected?.coverImageUrl, ...selected?.fileUrls || []].filter(Boolean)));
    setGalleryImages(imgs);
    setGalleryIdx(idx);
  };
  useEffect(() => {
    if (!selectedId) {
      setReports([]);
      return;
    }
    setReportsLoading(true);
    api.artworks.reports(selectedId).then(setReports).catch(() => setReports([])).finally(() => setReportsLoading(false));
  }, [selectedId]);
  const toggleSelectAll = (checked) => {
    setSelectedIds(checked ? filtered.map((a) => a.id) : []);
  };
  const toggleSelect = (id, checked) => {
    setSelectedIds((prev) => checked ? Array.from(/* @__PURE__ */ new Set([...prev, id])) : prev.filter((x) => x !== id));
  };
  const approveArtwork = async (id) => {
    try {
      await api.admin.setArtworkStatus(id, true, "Approved");
      fetchArtworks();
    } catch {
    }
    setSelectedIds([]);
  };
  const hideArtwork = async (id) => {
    try {
      await api.admin.setArtworkStatus(id, false, "Draft");
      fetchArtworks();
    } catch {
    }
    setSelectedIds([]);
  };
  const reopenArtwork = async (id) => {
    try {
      await api.admin.setArtworkStatus(id, false, "Reopen");
      fetchArtworks();
    } catch {
    }
    setSelectedIds([]);
  };
  const toggleHighlight = async (id, val) => {
    try {
      await api.admin.toggleArtworkHighlight(id, val);
      fetchArtworks();
    } catch {
    }
  };
  const removeItems = async (ids) => {
    try {
      await Promise.all(ids.map((id) => api.admin.deleteArtwork(id)));
      fetchArtworks();
    } catch {
    }
    setSelectedIds([]);
    if (ids.includes(selectedId)) {
      const next = filtered.find((a) => !ids.includes(a.id));
      setSelectedId(next?.id ?? null);
    }
  };
  const badge = (s) => {
    if (s === t("violation")) return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "B\u1ECB b\xE1o c\xE1o") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "\u0110\xE3 \u1EA9n") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "N\u1ED5i b\u1EADt") return "bg-blue-50 text-[#1a4ba8] border border-[#a8bce0]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };
  const statusText = (s) => {
    if (s === "\u0110ang hi\u1EC3n th\u1ECB") return t("public");
    if (s === "B\u1ECB b\xE1o c\xE1o") return t("report");
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
    return data.counts ? data.counts[key] || 0 : 0;
  };
  const FilterSelect = ({ value, onChange, children }) => /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "select",
    {
      value,
      onChange,
      className: "appearance-none px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm text-[#212121] outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] cursor-pointer pr-9 hover:bg-[#F8F8F8] transition-colors"
    },
    children
  ), /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, className: "pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#666666]" }));
  const getArtworkStatus = (a) => {
    if (a.settingsData) {
      try {
        const settings = typeof a.settingsData === "string" ? JSON.parse(a.settingsData) : a.settingsData;
        if (settings.projectStatus) return settings.projectStatus;
      } catch (e) {
      }
    }
    return a.status;
  };
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white relative" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_artworks", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-hidden flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "p-8 border-b border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121]" }, "Qu\u1EA3n l\xFD \u1EA5n ph\u1EA9m"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mt-1" }, "Duy\u1EC7t v\xE0 qu\u1EA3n l\xFD c\xE1c \u1EA5n ph\u1EA9m tr\xEAn h\u1EC7 th\u1ED1ng"))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 flex flex-wrap items-center gap-2" }, [
    { key: "all", label: t("all") },
    { key: "reported", label: t("report") },
    { key: "pending", label: t("pending") },
    { key: "hidden", label: t("hidden") },
    { key: "highlight", label: t("highlighted") }
  ].map((t2) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: t2.key,
      onClick: () => {
        setActiveTab(t2.key);
        setSelectedIds([]);
      },
      className: `px-3.5 py-2 rounded-lg text-sm font-semibold border transition-colors ${activeTab === t2.key ? "bg-[#212121] text-white border-[#212121]" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"}`
    },
    t2.label,
    " ",
    /* @__PURE__ */ React.createElement("span", { className: `ml-2 text-xs px-2 py-0.5 rounded-full ${activeTab === t2.key ? "bg-white/15 text-white" : "bg-[#F8F8F8] border border-[#E0E0E0] text-[#666666]"}` }, tabCount(t2.key))
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-5 flex flex-wrap items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex-1 min-w-[260px]" }, /* @__PURE__ */ React.createElement(Search, { className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]", size: 16 }), /* @__PURE__ */ React.createElement("input", { value: query, onChange: (e) => setQuery(e.target.value), placeholder: t("searchArtworkStudentTags"), className: "w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" })), /* @__PURE__ */ React.createElement(FilterSelect, { value: filterSubject, onChange: (e) => setFilterSubject(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "T\u1EA5t c\u1EA3" }, t("subjectAll")), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF TH" }, "Thi\u1EBFt k\u1EBF TH"), /* @__PURE__ */ React.createElement("option", { value: "\u0110\u1ED3 ho\u1EA1 \u1EE9ng d\u1EE5ng" }, "\u0110\u1ED3 ho\u1EA1 \u1EE9ng d\u1EE5ng"), /* @__PURE__ */ React.createElement("option", { value: "Motion Design" }, "Motion Design"), /* @__PURE__ */ React.createElement("option", { value: "UX/UI" }, "UX/UI")), /* @__PURE__ */ React.createElement(FilterSelect, { value: filterYear, onChange: (e) => setFilterYear(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "T\u1EA5t c\u1EA3" }, t("yearAll")), /* @__PURE__ */ React.createElement("option", { value: "2024" }, "2024"), /* @__PURE__ */ React.createElement("option", { value: "2023" }, "2023"), /* @__PURE__ */ React.createElement("option", { value: "2022" }, "2022")), /* @__PURE__ */ React.createElement(FilterSelect, { value: filterTool, onChange: (e) => setFilterTool(e.target.value) }, /* @__PURE__ */ React.createElement("option", { value: "T\u1EA5t c\u1EA3" }, t("toolAll")), /* @__PURE__ */ React.createElement("option", { value: "Illustrator" }, "Illustrator"), /* @__PURE__ */ React.createElement("option", { value: "Photoshop" }, "Photoshop"), /* @__PURE__ */ React.createElement("option", { value: "Figma" }, "Figma"), /* @__PURE__ */ React.createElement("option", { value: "Blender" }, "Blender"), /* @__PURE__ */ React.createElement("option", { value: "Procreate" }, "Procreate")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 ml-auto" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        selectedIds.forEach((id) => hideArtwork(id));
        setSelectedIds([]);
      },
      disabled: selectedIds.length === 0,
      className: `px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#212121] border-[#E0E0E0] hover:bg-[#F8F8F8]"}`
    },
    t("hideSelected")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => toggleHighlight(selectedIds),
      disabled: selectedIds.length === 0,
      className: `px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"}`
    },
    "Highlight"
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setSelectedIds([]),
      disabled: selectedIds.length === 0,
      className: `px-3.5 py-2.5 rounded-lg text-sm font-semibold border transition-colors ${selectedIds.length === 0 ? "bg-[#F8F8F8] text-[#999999] border-[#E0E0E0] cursor-not-allowed" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8] hover:text-[#212121]"}`
    },
    t("deselect")
  )))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-hidden flex" }, /* @__PURE__ */ React.createElement("div", { className: "w-full overflow-hidden flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between px-6 py-3 bg-white border-b border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "checkbox",
      checked: selectedIds.length > 0 && selectedIds.length === filtered.length,
      onChange: (e) => toggleSelectAll(e.target.checked),
      className: "w-4 h-4"
    }
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm font-semibold text-[#212121]" }, Math.min(displayedCount, filtered.length), " / ", tabCount(activeTab), " ", t("artworks"))), selectedIds.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#666666]" }, t("selected"), " ", selectedIds.length)), /* @__PURE__ */ React.createElement("div", { className: "overflow-y-auto" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse" }, /* @__PURE__ */ React.createElement("thead", { className: "sticky top-0 z-10" }, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-10" }), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("artworkStudent")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("subject")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold" }, t("date")), /* @__PURE__ */ React.createElement("th", { className: "bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-36" }, t("status")))), /* @__PURE__ */ React.createElement("tbody", null, loading && page === 1 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "5", className: "px-4 py-16 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col items-center justify-center text-[#666]" }, /* @__PURE__ */ React.createElement("div", { className: "w-8 h-8 border-4 border-[#1a4ba8]/20 border-t-[#1a4ba8] rounded-full animate-spin mb-4" }), /* @__PURE__ */ React.createElement("p", { className: "font-semibold" }, t("loadingData") || "\u0110ang t\u1EA3i...")))) : filtered.length === 0 ? /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: "5", className: "px-4 py-12 text-center text-[#666666]" }, "Kh\xF4ng t\xECm th\u1EA5y \u1EA5n ph\u1EA9m n\xE0o.")) : filtered.slice(0, displayedCount).map((a) => /* @__PURE__ */ React.createElement(
    "tr",
    {
      key: a.id,
      onClick: () => setSelectedId(a.id),
      className: `transition-colors cursor-pointer ${selectedId === a.id ? "bg-[#e0eaff]" : (a._count?.reports || 0) > 0 ? "bg-red-50" : a.isPending ? "bg-amber-50" : "bg-white"} ${(a._count?.reports || 0) > 0 ? "border-l-4 border-l-[#8B1A1A]" : ""} hover:bg-[#F8F8F8]`
    },
    /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: selectedIds.includes(a.id),
        onChange: (e) => toggleSelect(a.id, e.target.checked),
        onClick: (e) => e.stopPropagation(),
        className: "w-4 h-4"
      }
    )),
    /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("img", { src: a.coverImageUrl, className: "w-10 h-10 rounded-md object-cover bg-[#E0E0E0] border border-[#E0E0E0]" }), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121] truncate" }, a.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] truncate" }, a.user?.fullName || "")))),
    /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, a.subject),
    /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3 text-sm text-[#666666]" }, a.createdAt ? new Date(a.createdAt).toLocaleDateString("vi-VN") : ""),
    /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium ${a.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}` }, a.isPublic ? /* @__PURE__ */ React.createElement(Check, { size: 12, className: "text-green-600" }) : /* @__PURE__ */ React.createElement(EyeOff, { size: 12, className: "text-[#666666]" }), a.isPublic ? t("public") : t("private")), getArtworkStatus(a) && (() => {
      const st = getArtworkStatus(a);
      return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium bg-[#eef4ff] text-[#1a4ba8] border border-[#d1e0ff]" }, st === "Draft" ? /* @__PURE__ */ React.createElement(Edit3, { size: 12 }) : st === "Revision" ? /* @__PURE__ */ React.createElement(Clock, { size: 12, className: "text-amber-600" }) : st === "Final" || st === "pending_approval" ? /* @__PURE__ */ React.createElement(Rocket, { size: 12 }) : st === "Reopen" ? /* @__PURE__ */ React.createElement(RefreshCw, { size: 12, className: "text-red-600" }) : st === "Approved" ? /* @__PURE__ */ React.createElement(CheckCircle, { size: 12, className: "text-green-600" }) : /* @__PURE__ */ React.createElement(Globe, { size: 12 }), st === "pending_approval" ? "Final" : st);
    })(), (a._count?.reports || 0) > 0 && /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 text-[10px] font-bold text-[#8B1A1A] bg-red-50 px-2 py-0.5 rounded-full border border-[#F5C5C5]" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 11 }), " ", a._count?.reports || 0)))
  )), isLoadingMore && Array.from({ length: 3 }).map((_, i) => /* @__PURE__ */ React.createElement("tr", { key: `skeleton-${i}`, className: "animate-pulse" }, /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-4 h-4 bg-gray-200 rounded" })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "w-10 h-10 bg-gray-200 rounded-md" }), /* @__PURE__ */ React.createElement("div", { className: "min-w-0 space-y-2" }, /* @__PURE__ */ React.createElement("div", { className: "h-3.5 bg-gray-200 rounded w-32" }), /* @__PURE__ */ React.createElement("div", { className: "h-3 bg-gray-200 rounded w-20" })))), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-3.5 bg-gray-200 rounded w-24" })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-3.5 bg-gray-200 rounded w-20" })), /* @__PURE__ */ React.createElement("td", { className: "px-4 py-3" }, /* @__PURE__ */ React.createElement("div", { className: "h-6 bg-gray-200 rounded-full w-24" })))), filtered.length === 0 && /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("td", { colSpan: 5, className: "text-center py-12 text-[#666666]" }, t("noMatchingArtworks"))))), /* @__PURE__ */ React.createElement("div", { ref: observerTarget, style: { height: 40, display: "flex", justifyContent: "center", alignItems: "center" } }, loading && page > 1 && /* @__PURE__ */ React.createElement("div", { className: "w-6 h-6 border-2 border-[#1a4ba8]/20 border-t-[#1a4ba8] rounded-full animate-spin" })))))), selected && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60", onClick: () => setSelectedId(null) }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col relative", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement("div", { className: "p-5 border-b border-[#E0E0E0] flex items-start justify-between gap-3 bg-[#f8f9fa]" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-1" }, t("artworkDetails")), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#212121] truncate" }, selected.title), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-[#666666] mt-0.5" }, selected.user?.fullName || selected.student)), /* @__PURE__ */ React.createElement("button", { onClick: () => setSelectedId(null), className: "w-8 h-8 flex items-center justify-center rounded-full bg-white border border-[#E0E0E0] text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors" }, /* @__PURE__ */ React.createElement(X, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "p-6 overflow-y-auto" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer", onClick: () => handleOpenGallery(0) }, /* @__PURE__ */ React.createElement("img", { src: selected.coverImageUrl, className: "w-full h-56 object-cover" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "text-white opacity-0 group-hover:opacity-100 text-[13px] font-medium transition-opacity" }, t("clickToZoom")))), (selected.fileUrls || []).length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-3 flex-wrap" }, Array.from(new Set([selected.coverImageUrl, ...selected.fileUrls || []].filter(Boolean))).map((url, idx) => /* @__PURE__ */ React.createElement("div", { key: idx, className: "w-12 h-10 rounded-md overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer hover:border-[#1a4ba8] transition-colors", onClick: () => handleOpenGallery(idx) }, /* @__PURE__ */ React.createElement("img", { src: url, alt: "", className: "w-full h-full object-cover" })))), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4 mt-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-1.5" }, t("subject")), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] font-medium text-[#333]" }, selected.subject)), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-1.5" }, t("tools")), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] font-medium text-[#333]" }, (selected.toolsUsed || []).join(", ") || "\u2014")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-1.5" }, t("status")), /* @__PURE__ */ React.createElement("span", { className: `inline-flex items-center gap-1 whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full ${selected.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}` }, selected.isPublic ? /* @__PURE__ */ React.createElement(Check, { size: 10, className: "text-green-600" }) : /* @__PURE__ */ React.createElement(EyeOff, { size: 10 }), selected.isPublic ? t("public") : t("private")), getArtworkStatus(selected) && (() => {
    const st = getArtworkStatus(selected);
    return /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-1 whitespace-nowrap text-[11px] px-2.5 py-1 rounded-full font-medium bg-[#eef4ff] text-[#1a4ba8] border border-[#d1e0ff] ml-2" }, st === "Draft" ? /* @__PURE__ */ React.createElement(Edit3, { size: 10 }) : st === "Revision" ? /* @__PURE__ */ React.createElement(Clock, { size: 10, className: "text-amber-600" }) : st === "Final" || st === "pending_approval" ? /* @__PURE__ */ React.createElement(Rocket, { size: 10 }) : st === "Reopen" ? /* @__PURE__ */ React.createElement(RefreshCw, { size: 10, className: "text-red-600" }) : st === "Approved" ? /* @__PURE__ */ React.createElement(CheckCircle, { size: 10, className: "text-green-600" }) : /* @__PURE__ */ React.createElement(Globe, { size: 10 }), st === "pending_approval" ? "Final" : st);
  })()), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-1.5" }, t("score")), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] font-medium text-[#333]" }, selected.score ?? t("notGraded")))), /* @__PURE__ */ React.createElement("div", { className: "mt-5" }, /* @__PURE__ */ React.createElement("a", { href: `${window.location.origin}/#/detail/${selected.id}`, target: "_blank", rel: "noopener noreferrer", className: "text-[13px] text-[#1a4ba8] hover:text-[#0d2e6e] font-semibold flex items-center gap-1.5 transition-colors" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 14 }), " ", t("viewDetails"), ": ", selected.title)), /* @__PURE__ */ React.createElement("div", { className: "mt-6" }, /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#888] uppercase tracking-wide mb-3 flex items-center gap-1.5" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 14 }), " ", t("reportViolation"), " ", reports.length > 0 && /* @__PURE__ */ React.createElement("span", { className: "bg-[#8B1A1A] text-white text-[9px] px-2 py-0.5 rounded-full" }, reports.length)), reportsLoading ? /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-[#666666]" }, t("loading")) : reports.length === 0 ? /* @__PURE__ */ React.createElement("p", { className: "text-[12px] text-[#666666] bg-[#F8F8F8] rounded-md p-3 border border-[#E0E0E0]" }, t("noReportsForArtwork")) : /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-2.5 max-h-[200px] overflow-y-auto pr-2" }, reports.map((r) => /* @__PURE__ */ React.createElement("div", { key: r.id, className: "bg-[#F8F8F8] rounded-md p-3 border border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-medium text-[#8B1A1A] bg-red-50 px-2 py-1 rounded border border-[#F5C5C5]" }, r.violationType), /* @__PURE__ */ React.createElement("span", { className: `text-[10px] font-bold px-2 py-1 rounded-full ${r.status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : r.status === "resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}` }, r.status === "pending" ? t("pending") : r.status === "resolved" ? t("processed") : t("dismissed"))), r.detail && /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-[#212121] mb-2 leading-relaxed" }, r.detail), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between" }, /* @__PURE__ */ React.createElement("p", { className: "text-[10px] text-[#666666]" }, t("by"), " ", r.user?.fullName || r.user?.email || t("user"), " \xB7 ", new Date(r.createdAt).toLocaleDateString("vi-VN")), r.status === "pending" && /* @__PURE__ */ React.createElement("div", { className: "flex gap-1.5" }, /* @__PURE__ */ React.createElement("button", { onClick: () => api.artworks.updateReportStatus(selected.id, r.id, "resolved").then(() => setReports((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "resolved" } : x))), className: "text-[10px] font-semibold text-green-700 bg-green-50 px-2.5 py-1 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer" }, t("resolve")), /* @__PURE__ */ React.createElement("button", { onClick: () => api.artworks.updateReportStatus(selected.id, r.id, "dismissed").then(() => setReports((prev) => prev.map((x) => x.id === r.id ? { ...x, status: "dismissed" } : x))), className: "text-[10px] font-semibold text-gray-500 bg-gray-50 px-2.5 py-1 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" }, t("dismiss")))))))), /* @__PURE__ */ React.createElement("div", { className: "mt-6 pt-4 border-t border-[#E0E0E0] grid grid-cols-2 gap-3" }, !selected.isPublic ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("button", { onClick: () => {
    approveArtwork(selected.id);
    setSelectedId(null);
  }, className: "py-2.5 rounded-lg border border-[#1a4ba8] bg-white text-[#1a4ba8] text-[13px] font-semibold hover:bg-[#eef4ff] transition-colors" }, /* @__PURE__ */ React.createElement(Check, { size: 14, className: "inline mr-1.5" }), " ", t("approveArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    reopenArtwork(selected.id);
    setSelectedId(null);
  }, className: "py-2.5 rounded-lg border border-amber-600 bg-white text-amber-600 text-[13px] font-semibold hover:bg-amber-50 transition-colors" }, /* @__PURE__ */ React.createElement(RefreshCw, { size: 14, className: "inline mr-1.5" }), " Y\xEAu c\u1EA7u l\xE0m l\u1EA1i")) : /* @__PURE__ */ React.createElement("button", { onClick: () => {
    hideArtwork(selected.id);
    setSelectedId(null);
  }, className: "py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-[13px] font-semibold text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors col-span-2" }, t("hideArtwork")), /* @__PURE__ */ React.createElement("button", { onClick: () => openConfirm("delete", selected.id), className: "py-2.5 rounded-lg border border-[#F5C5C5] bg-red-50 text-[13px] font-semibold text-[#8B1A1A] hover:bg-red-100 transition-colors" }, t("deletePermanently")), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleHighlight(selected.id, !selected.isHighlighted), className: `py-2.5 rounded-lg text-[13px] font-semibold border transition-colors ${selected.isHighlighted ? "bg-[#212121] text-white border-[#212121]" : "bg-[#e0eaff] text-[#1a4ba8] border-[#a8bce0] hover:bg-[#d0daf0]"}` }, selected.isHighlighted ? t("removeHighlight") : t("highlightArtwork")))))), confirmModal.isOpen && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden flex flex-col p-6 text-center" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 28, className: "text-[#8B1A1A]" })), /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#212121] mb-2" }, confirmModal.mode === "hide" ? t("hideArtworkQuestion") : t("deleteArtworkQuestion")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-6" }, confirmModal.mode === "hide" ? t("hideArtworkWarning") : t("deleteArtworkWarning")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: closeConfirm, className: "flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, t("cancel")), /* @__PURE__ */ React.createElement("button", { onClick: confirmAction, className: "flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer" }, t("confirm"))))), galleryIdx !== null && galleryImages.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/90 z-[100] flex items-center justify-center", onClick: () => setGalleryIdx(null) }, /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    setGalleryIdx((prev) => Math.max(0, prev - 1));
  }, className: "absolute left-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none" }, "\u2039"), /* @__PURE__ */ React.createElement("img", { src: galleryImages[galleryIdx], alt: "", className: "max-w-[90vw] max-h-[90vh] object-contain", onClick: (e) => e.stopPropagation() }), /* @__PURE__ */ React.createElement("button", { onClick: (e) => {
    e.stopPropagation();
    setGalleryIdx((prev) => Math.min(galleryImages.length - 1, prev + 1));
  }, className: "absolute right-6 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors z-10 cursor-pointer text-xl leading-none" }, "\u203A"), /* @__PURE__ */ React.createElement("button", { onClick: () => setGalleryIdx(null), className: "absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition-colors cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 })), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-6 left-1/2 -translate-x-1/2 text-white/70 text-sm" }, galleryIdx + 1, " / ", galleryImages.length)));
}
function AdminExportPage({ setPage, collections, onOpenExportConfig, onQuickCreateCollection, onOpenCatalogBuilder }) {
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_export", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col lg:flex-row lg:justify-between lg:items-end gap-4 mb-8 pb-6 border-b border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121]" }, t("exportPdfConfig")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mt-1" }, t("exportPdfConfigDesc"))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onQuickCreateCollection && onQuickCreateCollection(),
      className: "inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#1a4ba8] text-white rounded-xl font-bold hover:bg-[#0d2e6e] transition-colors shadow-sm cursor-pointer w-full lg:w-auto"
    },
    /* @__PURE__ */ React.createElement(Plus, { size: 18 }),
    t("createNewCollection")
  )), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5" }, collections.length === 0 && /* @__PURE__ */ React.createElement("div", { className: "col-span-full py-24 px-6 text-center border border-indigo-100/60 rounded-3xl bg-gradient-to-br from-[#f8fafe] via-white to-[#f0f4ff] shadow-sm relative overflow-hidden group" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 left-0 w-64 h-64 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 -translate-x-1/2 -translate-y-1/2" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 right-0 w-64 h-64 bg-indigo-100/40 rounded-full mix-blend-multiply filter blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700 translate-x-1/2 translate-y-1/2" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 mx-auto bg-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8 relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 rounded-full border border-[#1a4ba8]/10 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]" }), /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#f0f4ff] rounded-full flex items-center justify-center" }, /* @__PURE__ */ React.createElement(FolderPlus, { className: "text-[#1a4ba8]", size: 32, strokeWidth: 1.5 }))), /* @__PURE__ */ React.createElement("h3", { className: "text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#1a4ba8] to-[#0d2e6e] tracking-tight mb-3" }, "Ch\u01B0a c\xF3 Moodboard n\xE0o"), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-base mb-8 max-w-md mx-auto leading-relaxed" }, "H\xE3y t\u1EA1o Moodboard m\u1EDBi \u0111\u1EC3 l\u01B0u tr\u1EEF, ph\xE2n lo\u1EA1i v\xE0 xu\u1EA5t b\u1EA3n c\xE1c \u1EA5n ph\u1EA9m \u0111\u1ED3 \xE1n xu\u1EA5t s\u1EAFc nh\u1EA5t."), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onQuickCreateCollection && onQuickCreateCollection(),
      className: "inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#1a4ba8] text-white rounded-full font-bold hover:bg-[#0d2e6e] shadow-[0_8px_20px_-6px_rgba(26,75,168,0.4)] hover:shadow-[0_14px_25px_-6px_rgba(26,75,168,0.5)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
    },
    /* @__PURE__ */ React.createElement(Plus, { size: 20, strokeWidth: 2.5 }),
    t("createNewCollection", "T\u1EA1o Moodboard M\u1EDBi")
  ))), collections.map((c) => {
    const coverImage = c.items?.[0]?.artwork?.coverImageUrl || c.items?.[0]?.coverImageUrl || c.items?.[0]?.artwork?.img || c.items?.[0]?.img || null;
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: c.id,
        onClick: () => onOpenExportConfig && onOpenExportConfig(c.id),
        className: "group relative bg-white rounded-[16px] overflow-hidden border border-[#E0E0E0] cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)]"
      },
      /* @__PURE__ */ React.createElement("div", { className: "relative h-[200px] w-full bg-[#8f8f8f]" }, coverImage && /* @__PURE__ */ React.createElement("img", { src: coverImage, className: "w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 right-3 flex gap-2" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white/20 backdrop-blur-md rounded-full w-8 h-8 flex items-center justify-center text-white cursor-pointer hover:bg-white/40 transition-colors", title: t("openConfig") }, /* @__PURE__ */ React.createElement(FileDown, { size: 14 }))), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-4 left-4 right-4 flex justify-between items-end pointer-events-none" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-white drop-shadow-md m-0 truncate pr-4" }, c.name), /* @__PURE__ */ React.createElement("p", { className: "text-[13px] text-white/80 mt-1 mb-0" }, "C\u1EADp nh\u1EADt: ", new Date(c.updatedAt || Date.now()).toLocaleDateString())), /* @__PURE__ */ React.createElement("span", { className: "bg-white/30 backdrop-blur-md px-3 py-1 rounded-full text-white text-[12px] font-bold whitespace-nowrap" }, c.items?.length || 0, " m\u1EE5c")))
    );
  }))));
}
function SortableArtworkCard({ item, id, onClick, deleteMode, isSelected, onToggleSelect, isHidden, onToggleHide }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isHidden ? 0.4 : isDragging ? 0.8 : 1
  };
  const badgeColors = {
    "V\xE0ng": "#ecc94b",
    "B\u1EA1c": "#a0aec0",
    "\u0110\u1ED3ng": "#ed8936"
  };
  return /* @__PURE__ */ React.createElement(
    "div",
    {
      ref: setNodeRef,
      style,
      className: `group relative bg-white border rounded-xl overflow-hidden transition-all cursor-pointer ${isSelected ? "border-[#1a4ba8] shadow-md ring-2 ring-[#1a4ba8]/20" : "border-[#E0E0E0] hover:shadow-md hover:border-[#1a4ba8]"}`,
      onClick
    },
    /* @__PURE__ */ React.createElement("div", { className: "aspect-[4/3] bg-[#F8F8F8] overflow-hidden relative" }, /* @__PURE__ */ React.createElement(
      "img",
      {
        src: item.artwork?.coverImageUrl || item.artwork?.img || "",
        alt: item.artwork?.title || "",
        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300",
        draggable: false
      }
    ), item.category && /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-sm rounded text-[10px] font-bold text-white uppercase tracking-wider" }, item.category), /* @__PURE__ */ React.createElement(ProjectStatusIcon, { status: item.artwork?.status }), item.award && item.award !== "Kh\xF4ng c\xF3" && /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm", style: { backgroundColor: badgeColors[item.award] || "#fff", color: item.award === "V\xE0ng" ? "#744210" : item.award === "B\u1EA1c" ? "#2d3748" : "#7b341e" }, title: `Gi\u1EA3i ${item.award}` }, "\u2605")),
    /* @__PURE__ */ React.createElement("div", { className: "p-3" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121] truncate" }, item.artwork?.title || "Untitled"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] truncate" }, item.artwork?.user?.fullName || item.artwork?.student || "")),
    deleteMode ? /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-2 z-10", onClick: (e) => e.stopPropagation() }, /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: isSelected,
        onChange: onToggleSelect,
        className: "w-5 h-5 accent-[#8B1A1A] cursor-pointer shadow-sm"
      }
    )) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1 cursor-grab", ...attributes, ...listeners }, /* @__PURE__ */ React.createElement(GripVertical, { size: 16 })), /* @__PURE__ */ React.createElement("div", { className: "absolute top-2 right-9 opacity-0 group-hover:opacity-100 transition-opacity text-white bg-black/40 rounded p-1", onClick: (e) => {
      e.stopPropagation();
      onToggleHide();
    } }, isHidden ? /* @__PURE__ */ React.createElement(EyeOff, { size: 16 }) : /* @__PURE__ */ React.createElement(Eye, { size: 16 })))
  );
}
function CollectionExportConfigPage({ setPage, collection, onUpdateCollection, onOpenCatalogBuilder }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [detailArtwork, setDetailArtwork] = useState(null);
  const [saved, setSaved] = useState(false);
  const [showAwardDropdown, setShowAwardDropdown] = useState(false);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  if (!collection) {
    return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_export", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 p-8" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666]" }, t("collectionNotFound")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin_export"), className: "mt-4 px-4 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold hover:bg-[#F8F8F8]" }, t("goBack"))));
  }
  const detailedItems = collection.items.filter((it) => it.artwork);
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = detailedItems.findIndex((it) => it.artworkId === active.id);
      const newIndex = detailedItems.findIndex((it) => it.artworkId === over.id);
      const next = arrayMove(collection.items, oldIndex, newIndex);
      onUpdateCollection && onUpdateCollection({ items: next });
    }
  };
  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
    setSelectedForDelete([]);
  };
  const toggleSelectDelete = (artworkId) => {
    setSelectedForDelete(
      (prev) => prev.includes(artworkId) ? prev.filter((x) => x !== artworkId) : [...prev, artworkId]
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
    const next = collection.items.map((it) => it.artworkId === artworkId ? { ...it, isHidden: !it.isHidden } : it);
    onUpdateCollection && onUpdateCollection({ items: next });
  };
  const updateDetailArtworkLocal = (updates) => {
    if (!detailArtwork) return;
    setDetailArtwork({ ...detailArtwork, ...updates });
  };
  const handleSaveDetailArtwork = () => {
    if (!detailArtwork) return;
    const nextItems = collection.items.map((it) => it.artworkId === detailArtwork.artworkId ? detailArtwork : it);
    onUpdateCollection && onUpdateCollection({ items: nextItems });
    setDetailArtwork(null);
  };
  const activeCount = detailedItems.filter((it) => !it.isHidden).length;
  return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_export", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-8 flex flex-col" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-start justify-between gap-6 mb-8 pb-6 border-b border-[#E0E0E0] flex-shrink-0" }, /* @__PURE__ */ React.createElement("div", { className: "min-w-0 flex-1 max-w-xl" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, "Qu\u1EA3n l\xFD Moodboard"), /* @__PURE__ */ React.createElement(
    "input",
    {
      value: collection.name,
      onChange: (e) => onUpdateCollection && onUpdateCollection({ name: e.target.value }),
      className: "w-full text-2xl font-bold text-[#212121] bg-transparent border-none outline-none placeholder:text-[#ccc]",
      placeholder: t("collectionNamePlaceholder")
    }
  ), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: collection.curatorEssay || "",
      onChange: (e) => onUpdateCollection && onUpdateCollection({ curatorEssay: e.target.value }),
      className: "w-full mt-2 text-sm text-[#666666] bg-transparent border-none outline-none resize-none placeholder:text-[#ccc]",
      rows: 2,
      placeholder: t("collectionDescPlaceholder")
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 flex-shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin_export"), className: "px-4 py-2.5 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, t("goBack")), /* @__PURE__ */ React.createElement("button", { onClick: () => {
    onOpenCatalogBuilder && onOpenCatalogBuilder(collection);
  }, className: `px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer bg-[#1a4ba8] text-white hover:bg-[#0d2e6e]` }, /* @__PURE__ */ React.createElement(Settings, { size: 16 }), " Thi\u1EBFt l\u1EADp Xu\u1EA5t T\u1EADp San"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-8 flex-1 min-h-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4 flex-shrink-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121]" }, detailedItems.length, " \u1EA5n ph\u1EA9m (", activeCount, " hi\u1EC3n th\u1ECB)"), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2" }, deleteMode && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#666666]" }, t("selected"), " ", selectedForDelete.length), /* @__PURE__ */ React.createElement("button", { onClick: executeDelete, disabled: selectedForDelete.length === 0, className: `px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedForDelete.length > 0 ? "bg-[#8B1A1A] text-white" : "bg-[#E0E0E0] text-[#999]"}` }, t("delete"))), /* @__PURE__ */ React.createElement("button", { onClick: toggleDeleteMode, className: `px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${deleteMode ? "bg-[#8B1A1A] text-white border-[#8B1A1A]" : "bg-white text-[#666] border-[#E0E0E0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"}` }, /* @__PURE__ */ React.createElement(Trash2, { size: 14 }), " ", deleteMode ? t("exitDeleteMode") : t("deleteArtwork")))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto pr-2 pb-10" }, detailedItems.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-sm text-[#666666] border border-dashed border-[#E0E0E0] rounded-xl p-8 text-center" }, t("noArtworksInCollectionMsg")) : /* @__PURE__ */ React.createElement(DndContext, { sensors, collisionDetection: closestCenter, onDragEnd: handleDragEnd }, /* @__PURE__ */ React.createElement(SortableContext, { items: detailedItems.map((it) => it.artworkId), strategy: rectSortingStrategy }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 xl:grid-cols-4 gap-4" }, detailedItems.map((it) => /* @__PURE__ */ React.createElement(
    SortableArtworkCard,
    {
      key: it.artworkId,
      id: it.artworkId,
      item: it,
      deleteMode,
      isSelected: detailArtwork?.artworkId === it.artworkId || selectedForDelete.includes(it.artworkId),
      isHidden: it.isHidden,
      onToggleHide: () => toggleHide(it.artworkId),
      onToggleSelect: () => deleteMode ? toggleSelectDelete(it.artworkId) : setDetailArtwork(it),
      onClick: () => {
        if (deleteMode) return;
        setDetailArtwork(it);
        if (String(it.artworkId).startsWith("mock-")) {
          const mockArt = window.MOCK_PROJECTS?.find((p) => p.id === it.artworkId);
          if (mockArt) {
            setDetailArtwork((prev) => prev?.artworkId === it.artworkId ? { ...prev, artwork: { ...prev.artwork, ...mockArt } } : prev);
          }
        } else {
          api.artworks.get(it.artworkId).then((fullArt) => {
            setDetailArtwork((prev) => prev?.artworkId === it.artworkId ? { ...prev, artwork: { ...prev.artwork, ...fullArt } } : prev);
          }).catch(() => {
          });
        }
      }
    }
  ))))))), detailArtwork && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-50 flex items-center justify-center p-4" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/50", onClick: () => setDetailArtwork(null) }), /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-2xl shadow-xl w-full max-w-7xl max-h-[90vh] flex flex-col relative z-10 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "px-6 py-4 border-b border-[#E0E0E0] flex items-center justify-between bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] text-lg truncate pr-4" }, detailArtwork.artwork?.title), /* @__PURE__ */ React.createElement("button", { onClick: () => setDetailArtwork(null), className: "p-2 hover:bg-[#E0E0E0] rounded-full text-[#666] hover:text-[#212121] transition-colors" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-1 overflow-hidden min-h-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-3/5 flex flex-col border-r border-[#E0E0E0] p-6 overflow-hidden bg-white" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "w-full flex-1 min-h-0 bg-gray-100 rounded-xl overflow-hidden border border-[#E0E0E0] relative group cursor-pointer",
      onClick: () => window.open(`#/detail/${detailArtwork.artworkId}`, "_blank")
    },
    /* @__PURE__ */ React.createElement("img", { src: detailArtwork.artwork?.coverImageUrl || detailArtwork.artwork?.img, alt: "", className: "w-full h-full object-contain" }),
    /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" }, /* @__PURE__ */ React.createElement("span", { className: "text-white font-semibold flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Eye, { size: 18 }), " Xem to\xE0n b\u1ED9 \u1EA5n ph\u1EA9m"))
  ), (() => {
    const subImages = [];
    if (detailArtwork.artwork?.fileUrls && Array.isArray(detailArtwork.artwork.fileUrls)) {
      detailArtwork.artwork.fileUrls.forEach((url) => {
        if (!subImages.includes(url)) subImages.push(url);
      });
    }
    if (detailArtwork.artwork?.blocksJson) {
      try {
        const blocks = typeof detailArtwork.artwork.blocksJson === "string" ? JSON.parse(detailArtwork.artwork.blocksJson) : detailArtwork.artwork.blocksJson;
        if (Array.isArray(blocks)) {
          blocks.forEach((b) => {
            if (b.type === "image" && b.data?.url && !subImages.includes(b.data.url)) {
              subImages.push(b.data.url);
            }
          });
        }
      } catch (e) {
      }
    }
    if (subImages.length === 0) return null;
    return /* @__PURE__ */ React.createElement("div", { className: "mt-6 relative flex items-center" }, /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "absolute left-2 z-10 p-2 bg-white/90 shadow-md rounded-full border border-[#E0E0E0] text-[#666] hover:text-black hover:bg-white",
        onClick: (e) => {
          e.stopPropagation();
          document.getElementById("subimages-scroll").scrollBy({ left: -300, behavior: "smooth" });
        }
      },
      /* @__PURE__ */ React.createElement(ChevronLeft, { size: 20 })
    ), /* @__PURE__ */ React.createElement("div", { id: "subimages-scroll", className: "flex gap-3 overflow-x-auto px-12 py-2 no-scrollbar w-full snap-x" }, subImages.map((url, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "aspect-[4/3] h-32 shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-[#E0E0E0] snap-center" }, /* @__PURE__ */ React.createElement("img", { src: url, alt: "", className: "w-full h-full object-cover" })))), /* @__PURE__ */ React.createElement(
      "button",
      {
        className: "absolute right-2 z-10 p-2 bg-white/90 shadow-md rounded-full border border-[#E0E0E0] text-[#666] hover:text-black hover:bg-white",
        onClick: (e) => {
          e.stopPropagation();
          document.getElementById("subimages-scroll").scrollBy({ left: 300, behavior: "smooth" });
        }
      },
      /* @__PURE__ */ React.createElement(ChevronRight, { size: 20 })
    ));
  })()), /* @__PURE__ */ React.createElement("div", { className: "w-2/5 p-6 flex flex-col gap-5 overflow-y-auto bg-[#F8FAFC]" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider" }, "Chuy\xEAn \u0111\u1EC1 (Category)"), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: detailArtwork.category || detailArtwork.artwork?.category || "",
      onChange: (e) => updateDetailArtworkLocal({ category: e.target.value }),
      className: "w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]",
      placeholder: "VD: Brand Identity, Typography..."
    }
  )), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider" }, "Gi\u1EA3i th\u01B0\u1EDFng (Award)"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(
    "div",
    {
      className: "w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm flex justify-between items-center cursor-pointer hover:border-[#1a4ba8] transition-colors",
      onClick: () => setShowAwardDropdown(!showAwardDropdown)
    },
    detailArtwork.award || "Kh\xF4ng c\xF3",
    /* @__PURE__ */ React.createElement(ChevronDown, { size: 16, className: `text-[#666] transition-transform ${showAwardDropdown ? "rotate-180" : ""}` })
  ), showAwardDropdown && /* @__PURE__ */ React.createElement("div", { className: "absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-[#E0E0E0] rounded-lg shadow-lg overflow-hidden py-1" }, ["Kh\xF4ng c\xF3", "V\xE0ng", "B\u1EA1c", "\u0110\u1ED3ng"].map((opt) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: opt,
      className: `px-4 py-2 text-sm cursor-pointer hover:bg-[#F8F8F8] transition-colors ${detailArtwork.award === opt || !detailArtwork.award && opt === "Kh\xF4ng c\xF3" ? "bg-[#eef4ff] text-[#1a4ba8] font-semibold" : "text-[#212121]"}`,
      onClick: () => {
        updateDetailArtworkLocal({ award: opt });
        setShowAwardDropdown(false);
      }
    },
    opt
  ))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] mb-1.5 uppercase tracking-wider" }, "Ghi ch\xFA c\u1EE7a Gi\u1EA3ng vi\xEAn"), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: detailArtwork.note || "",
      onChange: (e) => updateDetailArtworkLocal({ note: e.target.value }),
      rows: 6,
      className: "w-full px-3 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] resize-none",
      placeholder: "Nh\u1EADn x\xE9t ng\u1EAFn g\u1ECDn v\u1EC1 t\xE1c ph\u1EA9m..."
    }
  )), /* @__PURE__ */ React.createElement("div", { className: "mt-auto pt-4 flex justify-end gap-3 border-t border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setDetailArtwork(null), className: "px-4 py-2 rounded-lg text-sm font-semibold text-[#666] hover:bg-[#E0E0E0] transition-colors" }, "H\u1EE7y"), /* @__PURE__ */ React.createElement("button", { onClick: handleSaveDetailArtwork, className: "px-4 py-2 rounded-lg text-sm font-bold text-white bg-[#1a4ba8] hover:bg-[#0d2e6e] transition-colors flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Save, { size: 16 }), " L\u01B0u thay \u0111\u1ED5i")))))))));
}
function AdminWatermarkPage({ setPage }) {
  const [watermarkText, setWatermarkText] = useState(() => "UEF");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  useEffect(() => {
    fetch("/api/site-settings?_t=" + Date.now(), { cache: "no-store" }).then((r) => r.json()).then((data) => {
      if (data.watermark_text !== void 0) setWatermarkText(data.watermark_text || "UEF");
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const handleSave = async () => {
    setSaving(true);
    setMessage({ type: "", text: "" });
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/site-settings?_t=" + Date.now(), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...token ? { "Authorization": `Bearer ${token}` } : {}
        },
        body: JSON.stringify({ key: "watermark_text", value: watermarkText.trim() || "UEF" })
      });
      if (!res.ok) throw new Error("Save failed");
      setMessage({ type: "success", text: t("watermarkSaved") });
    } catch {
      setMessage({ type: "error", text: t("watermarkSaveFailed") });
    }
    setSaving(false);
  };
  if (loading) {
    return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", height: "100%" } }, /* @__PURE__ */ React.createElement("p", { style: { color: MUTED } }, t("loading")));
  }
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", height: "100%" } }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_watermark", setPage }), /* @__PURE__ */ React.createElement("div", { style: { flex: 1, padding: 32, overflowY: "auto" } }, /* @__PURE__ */ React.createElement("div", { style: { maxWidth: 600 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("div", { style: { width: 36, height: 36, borderRadius: 8, background: "#e0eaff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 } }, /* @__PURE__ */ React.createElement("span", { style: { color: CERULEAN, fontSize: 18, fontWeight: 700 } }, "W")), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 20, fontWeight: 700, color: BLACK, margin: 0 } }, t("watermarkSettings")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, margin: "2px 0 0" } }, t("watermarkSettingsDesc")))), /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}`, padding: 24, marginTop: 20 } }, /* @__PURE__ */ React.createElement("label", { style: { display: "block", fontSize: 13, fontWeight: 600, color: BLACK, marginBottom: 6 } }, t("watermarkText")), /* @__PURE__ */ React.createElement(
    "input",
    {
      type: "text",
      value: watermarkText,
      onChange: (e) => setWatermarkText(e.target.value),
      placeholder: t("watermarkTextPlaceholder"),
      style: { width: "100%", padding: "10px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, outline: "none", boxSizing: "border-box" }
    }
  ), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, margin: "8px 0 0", lineHeight: 1.5 } }, t("watermarkTextHint"))), /* @__PURE__ */ React.createElement("div", { style: { marginTop: 20, display: "flex", alignItems: "center", gap: 12 } }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: handleSave,
      disabled: saving,
      style: { padding: "10px 28px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1 }
    },
    saving ? t("saving") : t("saveSettings")
  ), message.text && /* @__PURE__ */ React.createElement("span", { style: { fontSize: 13, color: message.type === "success" ? "#166534" : CRIMSON, fontWeight: 500 } }, message.text)))));
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
    if (!form.lastName || !form.firstName) {
      setError(t("enterFullName"));
      return;
    }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError(t("invalidEmail"));
      return;
    }
    if (form.password.length < 8) {
      setError(t("passwordMinLength"));
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          fullName: `${form.lastName} ${form.firstName}`.trim(),
          password: form.password
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("verify");
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      }), 1e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleVerifyCode = async () => {
    if (!code || code.length < 6) {
      setError("Vui l\xF2ng nh\u1EADp m\xE3 x\xE1c th\u1EF1c");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setStep("success");
      setTimeout(() => setPage("auth"), 2e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleResendCode = async () => {
    if (cooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setCooldown(60);
      const timer = setInterval(() => setCooldown((c) => {
        if (c <= 1) clearInterval(timer);
        return c - 1;
      }), 1e3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return /* @__PURE__ */ React.createElement("div", { style: { position: "relative", width: "100%", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Montserrat, -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif", background: "#1a1a2e url(/background-login.jpg) center/cover no-repeat" } }, /* @__PURE__ */ React.createElement("div", { style: { width: "100%", maxWidth: 448, margin: "32px 16px" } }, /* @__PURE__ */ React.createElement("div", { style: { background: "#fff", borderRadius: 8, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", padding: "32px 32px 24px" } }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 } }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", style: { height: 72 } }), /* @__PURE__ */ React.createElement("img", { src: "/qs-stars.png", alt: "QS Stars", style: { height: 40 } })), /* @__PURE__ */ React.createElement("h4", { style: { margin: "20px 0 6px", fontWeight: 700, fontSize: 19, fontFamily: "'Public Sans', sans-serif", color: "rgba(0,114,188,0.78)", textTransform: "uppercase", textAlign: "center" } }, "UEF PORTFOLIO"), /* @__PURE__ */ React.createElement("p", { style: { margin: "0 0 24px", fontSize: 15, fontWeight: 400, color: "rgba(47,43,61,0.68)", background: "#e3efff", padding: "12px 16px", borderRadius: 6, textAlign: "center", lineHeight: 1.5 } }, "T\u1EA1o t\xE0i kho\u1EA3n \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u tr\u01B0ng b\xE0y t\xE1c ph\u1EA9m c\u1EE7a b\u1EA1n tr\xEAn UEF Portfolio"), step === "form" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("form", { onSubmit: handleSubmit }, /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: 14 } }, /* @__PURE__ */ React.createElement("div", { style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 } }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("lastName")), /* @__PURE__ */ React.createElement("input", { type: "text", value: form.lastName, onChange: updateField("lastName"), required: true, style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("firstName")), /* @__PURE__ */ React.createElement("input", { type: "text", value: form.firstName, onChange: updateField("firstName"), required: true, style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("email")), /* @__PURE__ */ React.createElement("input", { type: "email", value: form.email, onChange: updateField("email"), required: true, style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("password")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPasswords.password ? "text" : "password", value: form.password, onChange: updateField("password"), required: true, style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPasswords({ ...showPasswords, password: !showPasswords.password }), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showPasswords.password ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("confirmPassword")), /* @__PURE__ */ React.createElement("div", { style: { position: "relative" } }, /* @__PURE__ */ React.createElement("input", { type: showPasswords.confirm ? "text" : "password", value: form.confirmPassword, onChange: updateField("confirmPassword"), required: true, style: { width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG } }), /* @__PURE__ */ React.createElement("button", { type: "button", onClick: () => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm }), tabIndex: -1, style: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED } }, showPasswords.confirm ? /* @__PURE__ */ React.createElement(EyeOff, { size: 18 }) : /* @__PURE__ */ React.createElement(Eye, { size: 18 }))))), error && /* @__PURE__ */ React.createElement("p", { style: { color: "#E53E3E", fontSize: 12, marginTop: 12, textAlign: "center" } }, error), /* @__PURE__ */ React.createElement("button", { type: "submit", disabled: loading, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer" } }, loading ? t("processing") : t("register"))), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 } }, t("alreadyHaveAccount"), " ", /* @__PURE__ */ React.createElement("span", { onClick: () => setPage("auth"), style: { color: CERULEAN, cursor: "pointer", fontWeight: 600 } }, t("login")))), step === "verify" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("h1", { style: { fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px" } }, t("verifyEmail")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 13, color: MUTED, marginBottom: 24 } }, t("resetCodeSentDesc")), error && /* @__PURE__ */ React.createElement("div", { style: { display: "flex", alignItems: "center", gap: 8, background: "#FFF5F5", border: "1px solid #FED7D7", borderRadius: 8, padding: "10px 14px", marginBottom: 16 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 16, color: "#E53E3E", style: { flexShrink: 0 } }), /* @__PURE__ */ React.createElement("p", { style: { color: "#C53030", fontSize: 12, margin: 0 } }, error)), /* @__PURE__ */ React.createElement("div", { style: { marginBottom: 16 } }, /* @__PURE__ */ React.createElement("label", { style: { fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 } }, t("enterResetCode")), /* @__PURE__ */ React.createElement("input", { type: "text", value: code, onChange: (e) => {
    setCode(e.target.value.replace(/\D/g, "").slice(0, 6));
    setError("");
  }, placeholder: "000000", maxLength: 6, style: { width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, textAlign: "center", letterSpacing: 8, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG, fontFamily: "monospace" } })), /* @__PURE__ */ React.createElement("button", { onClick: handleVerifyCode, disabled: loading || code.length < 6, style: { width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, cursor: loading ? "not-allowed" : "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 } }, loading ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full", style: { animation: "spin 0.8s linear infinite" } }), " ", t("processing")) : t("verifyEmailButton")), cooldown > 0 ? /* @__PURE__ */ React.createElement("p", { style: { fontSize: 11, color: MUTED, textAlign: "center", marginTop: 12 } }, t("resendCode"), " (", cooldown, "s)") : /* @__PURE__ */ React.createElement("p", { onClick: handleResendCode, style: { fontSize: 11, color: CERULEAN, textAlign: "center", marginTop: 12, cursor: "pointer", fontWeight: 500 } }, t("resendCode")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 } }, /* @__PURE__ */ React.createElement("span", { onClick: () => setPage("auth"), style: { color: CERULEAN, cursor: "pointer", fontWeight: 600 } }, t("backToLogin")))), step === "success" && /* @__PURE__ */ React.createElement("div", { style: { padding: 20, background: "#F0FFF0", borderRadius: 8, textAlign: "center" } }, /* @__PURE__ */ React.createElement("div", { style: { width: 48, height: 48, borderRadius: "50%", background: "#C6F6D5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" } }, /* @__PURE__ */ React.createElement("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "#2F855A", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "20 6 9 17 4 12" }))), /* @__PURE__ */ React.createElement("p", { style: { color: "#2F855A", fontWeight: 600, fontSize: 14 } }, t("registerSuccess"))))));
}
function LandingPage({ setPage, isLoggedIn, setActiveArtworkId }) {
  const { user } = useAuth();
  const userRole = user?.role;
  const [featuredArtworks, setFeaturedArtworks] = useState([]);
  const [activeCategory, setActiveCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const { getContentBySection, getContentItems, getSetting } = useSiteContent();
  const hero = getContentBySection("home", "hero");
  const stats = getContentItems("home", "stats");
  const features = getContentItems("home", "features");
  const steps = getContentItems("home", "steps");
  const testimonials = getContentItems("home", "testimonials");
  const cta = getContentBySection("home", "cta");
  const footerInfo = getContentBySection("footer", "footerInfo");
  const footerLinks = getContentItems("footer", "footerLinks");
  const dynamicCats = getSetting("homeCategories");
  const categories = dynamicCats ? dynamicCats.split(",").map((c) => ({ key: c.trim(), label: c.trim().toLowerCase() })) : [
    { key: "3D Art", label: "3d art" },
    { key: "Branding", label: "branding" },
    { key: "Poster", label: "poster" },
    { key: "Packaging", label: "packaging" }
  ];
  useEffect(() => {
    api.artworks.list({ limit: "16", sort: "newest" }).then((res) => {
      setFeaturedArtworks(res.artworks || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  const filtered = activeCategory ? featuredArtworks.filter((a) => a.subject === activeCategory) : featuredArtworks;
  const gridArtworks = (() => {
    if (filtered.length >= 6) return filtered.slice(0, 6);
    const usedIds = new Set(filtered.map((a) => a.id));
    const extras = featuredArtworks.filter((a) => !usedIds.has(a.id));
    return [...filtered, ...extras].slice(0, 6);
  })();
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-white font-sans text-[#212121]" }, /* @__PURE__ */ React.createElement("section", { className: "px-6 py-10 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("p", { className: "text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-4 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-8 h-px bg-[#1a4ba8]" }), " ", hero?.preTitle || t("facultyName")), /* @__PURE__ */ React.createElement("h2", { className: "text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6" }, hero?.title1 || t("heroTitle1"), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-[#1a4ba8]" }, hero?.title2 || t("heroTitle2")), " ", hero?.title3 || t("heroTitle3"), /* @__PURE__ */ React.createElement("br", null), hero?.title4 || t("heroTitle4")), /* @__PURE__ */ React.createElement("div", { className: "space-y-1 mb-4 max-w-sm" }, /* @__PURE__ */ React.createElement("div", { className: "h-0.5 bg-gray-200 w-full" }), /* @__PURE__ */ React.createElement("div", { className: "h-0.5 bg-gray-200 w-4/5" }), /* @__PURE__ */ React.createElement("div", { className: "h-0.5 bg-gray-200 w-3/5" })), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-3 mb-3" }, (!isLoggedIn || userRole === "student" || userRole === "guest") && /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(isLoggedIn ? "dashboard" : hero?.primaryCtaLink || "gallery"), className: "bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors" }, hero?.primaryCta || t("exploreGallery"), " ", /* @__PURE__ */ React.createElement(ArrowRight, { size: 18 })), isLoggedIn && userRole !== "student" && /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("admin"), className: "bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors" }, userRole === "lecturer" ? "Trang qu\u1EA3n l\xFD Gi\u1EA3ng vi\xEAn" : "Trang qu\u1EA3n l\xFD Admin", " ", /* @__PURE__ */ React.createElement(ArrowRight, { size: 18 })), !isLoggedIn && /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(hero?.secondaryCtaLink || "auth"), className: "bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors" }, hero?.secondaryCta || t("studentLogin"))), isLoggedIn ? /* @__PURE__ */ React.createElement("div", { className: "mb-16" }) : /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500 mb-16" }, hero?.note || t("loginNote")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8" }, stats.slice(0, 4).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold mb-1" }, s.content?.value), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, s.content?.label))), stats.length === 0 && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold mb-1" }, "500+"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, t("displayedArtworks"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold mb-1" }, "120+"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, t("participatingLecturers"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold mb-1" }, "18"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, t("subject"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-3xl font-bold mb-1" }, t("fourCourses")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-gray-500" }, t("creativeJourney")))))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 w-full relative" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-3" }, [0, 1, 2, 3, 4, 5].map((i) => {
    const art = gridArtworks[i];
    const slot = i < 2 ? 0 : i < 4 ? 1 : 2;
    const isTall = i % 2 === 0 && i < 2 || i % 2 !== 0 && i >= 4;
    const aspectClass = "aspect-[4/5]";
    const colIndex = i % 3;
    const animClass = colIndex === 1 ? "animate-[slideDownEntrance_1.2s_ease-out_both]" : "animate-[slideUpEntrance_1.2s_ease-out_both]";
    return /* @__PURE__ */ React.createElement("div", { key: i, className: `col-span-1 space-y-3 ${animClass}` }, /* @__PURE__ */ React.createElement("div", { className: `bg-gray-100 rounded-xl overflow-hidden ${aspectClass} ${art ? "cursor-pointer" : ""}`, onClick: () => {
      if (art) {
        setPage("detail", { artworkId: art.id });
      }
    } }, art ? /* @__PURE__ */ React.createElement("img", { src: art.coverImageUrl, alt: art.title, className: "w-full h-full object-cover hover:scale-105 transition-transform duration-500" }) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex items-center justify-center text-gray-300" }, /* @__PURE__ */ React.createElement(Image, { size: 32 }))));
  })), /* @__PURE__ */ React.createElement("div", { className: "absolute -bottom-6 -right-6 flex gap-2" }, categories.map((cat) => /* @__PURE__ */ React.createElement(
    "button",
    {
      key: cat.key,
      onClick: () => setActiveCategory(activeCategory === cat.key ? null : cat.key),
      className: `text-[10px] px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${activeCategory === cat.key ? "bg-[#1a4ba8] text-white" : "bg-gray-100 text-gray-600 border border-gray-200 hover:bg-[#1a4ba8]/10 hover:text-[#1a4ba8]"}`
    },
    cat.label
  ))))), /* @__PURE__ */ React.createElement("section", { className: "px-6 py-14 bg-gradient-to-b from-white to-gray-50/80" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "mb-8 text-center animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("p", { className: "text-[#DA291C] font-semibold text-xs tracking-[0.15em] uppercase mb-3 flex items-center gap-2 justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "w-6 h-px bg-[#DA291C]" }), " ", hero?.featuresPreTitle || t("coreFeatures"), /* @__PURE__ */ React.createElement("span", { className: "w-6 h-px bg-[#DA291C]" })), /* @__PURE__ */ React.createElement("h2", { className: "text-3xl md:text-4xl font-black text-[#212121] leading-tight" }, hero?.featuresTitle1 ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-[#1a4ba8]" }, hero.featuresTitle1), " ", hero.featuresTitle2, " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#DA291C]" }, hero.featuresTitle3)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-[#1a4ba8]" }, "M\u1ECDi th\u1EE9"), " b\u1EA1n c\u1EA7n trong", " ", /* @__PURE__ */ React.createElement("span", { className: "text-[#DA291C]" }, "m\u1ED9t n\u1EC1n t\u1EA3ng"))), /* @__PURE__ */ React.createElement("p", { className: "text-gray-500 mt-4 max-w-xl mx-auto text-[15px]" }, hero?.featuresDesc || "H\u1EC7 th\u1ED1ng E-Portfolio to\xE0n di\u1EC7n cho sinh vi\xEAn Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa UEF")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" }, features.length > 0 ? features.map((item, idx) => {
    const c = item.content;
    const icons = [Image, User, Star, Monitor, Heart, Users];
    const colorCycle = ["bg-[#1a4ba8]", "bg-[#DA291C]", "bg-gray-300"];
    const iconBg = ["bg-[#1a4ba8]/10", "bg-[#DA291C]/10", "bg-gray-200"];
    const iconColors = ["text-[#1a4ba8]", "text-[#DA291C]", "text-[#555]"];
    const ci = idx % 3;
    const IconComp = icons[idx] || Image;
    return /* @__PURE__ */ React.createElement("div", { key: item.id || idx, className: "group bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_${0.6 + idx * 0.1}s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: `h-1.5 ${colorCycle[ci]} w-full` }), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("div", { className: `w-12 h-12 rounded-xl ${iconBg[ci]} ${iconColors[ci]} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 ${ci === 0 ? "group-hover:bg-[#1a4ba8] group-hover:text-white" : ci === 1 ? "group-hover:bg-[#DA291C] group-hover:text-white" : "group-hover:bg-[#212121] group-hover:text-white"}` }, /* @__PURE__ */ React.createElement(IconComp, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, c.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed mb-5" }, c.description), c.tag && /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs font-semibold", style: { color: ci === 0 ? "#1a4ba8" : ci === 1 ? "#DA291C" : "#555" } }, /* @__PURE__ */ React.createElement("span", { className: `w-5 h-[2px] ${ci === 0 ? "bg-[#1a4ba8]" : ci === 1 ? "bg-[#DA291C]" : "bg-gray-300"}` }), " ", c.tag)));
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.6s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-[#1a4ba8] w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-5" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(Image, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("exhibitGallery")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed mb-5" }, t("exhibitGalleryDesc")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs font-semibold text-[#1a4ba8]" }, /* @__PURE__ */ React.createElement("span", { className: "w-5 h-[2px] bg-[#1a4ba8]" }), " gallery"))), /* @__PURE__ */ React.createElement("div", { className: "group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-[#DA291C] w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-7" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(User, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("personalPortfolio")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed mb-5" }, t("portfolioFeatureDesc")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 text-xs font-semibold text-[#DA291C]" }, /* @__PURE__ */ React.createElement("span", { className: "w-5 h-[2px] bg-[#DA291C]" }), " ", t("personalPortfolioLabel")))), /* @__PURE__ */ React.createElement("div", { className: "group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.8s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-gray-300 w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-7" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(Star, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("scoresAndFeedback")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed" }, t("gradingFeatureDesc")))), /* @__PURE__ */ React.createElement("div", { className: "group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.9s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-[#1a4ba8] w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-7" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(Monitor, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("multiDevice")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed" }, t("responsiveDesc")))), /* @__PURE__ */ React.createElement("div", { className: "group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.0s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-[#DA291C] w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-7" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(Heart, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("highlightAndInteract")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed" }, t("interactionDesc")))), /* @__PURE__ */ React.createElement("div", { className: "group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.1s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "h-1.5 bg-gray-300 w-full" }), /* @__PURE__ */ React.createElement("div", { className: "p-7" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300" }, /* @__PURE__ */ React.createElement(Users, { size: 22 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-[17px] text-[#212121] mb-2.5" }, t("recruitmentConnection")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500 leading-relaxed" }, t("recruitmentDesc")))))))), /* @__PURE__ */ React.createElement("section", { className: "px-6 py-10" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto border-t border-gray-100 pt-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex justify-between items-end mb-8" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement("span", { className: "w-6 h-px bg-[#1a4ba8]" }), " ", hero?.galleryPreTitle || t("featuredProducts")), /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-extrabold" }, hero?.galleryTitle || t("exploreNewestArtworks"))), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), className: "text-sm font-semibold border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50" }, t("viewFullGallery"), " \u203A")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5" }, featuredArtworks.slice(0, 10).map((work, idx) => /* @__PURE__ */ React.createElement("div", { key: work.id, className: "group cursor-pointer", onClick: () => setPage("detail", { artworkId: work.id }) }, /* @__PURE__ */ React.createElement("div", { className: "rounded-lg overflow-hidden mb-3 relative aspect-[4/3] bg-gray-100" }, /* @__PURE__ */ React.createElement("img", { src: work.coverImageUrl, alt: work.title, className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" }), idx === 0 && /* @__PURE__ */ React.createElement("div", { className: "absolute top-3 left-3 bg-[#1a4ba8] text-white text-[10px] font-bold px-2 py-1 rounded" }, t("featured"))), /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-[15px] mb-1" }, work.title), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between text-xs text-gray-500" }, /* @__PURE__ */ React.createElement("span", null, work.user?.fullName || getSetting("fallbackAuthorName") || "Sinh vi\xEAn UEF"), /* @__PURE__ */ React.createElement("span", { className: "flex items-center gap-1" }, /* @__PURE__ */ React.createElement(Heart, { size: 12 }), " ", work.likeCount || 0))))))), testimonials.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-[#0d2e6e] py-6 overflow-hidden border-y border-white/10 shadow-inner" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-8 whitespace-nowrap animate-[ticker_48s_linear_infinite] w-max" }, [...Array(2)].map((_, repIdx) => /* @__PURE__ */ React.createElement(React.Fragment, { key: repIdx }, testimonials.map((item, idx) => {
    const c = item.content;
    const initials = c.name ? c.name.split(" ").map((n) => n[0]).join("").slice(-2).toUpperCase() : "\u{1F464}";
    return /* @__PURE__ */ React.createElement("div", { key: item.id || idx, className: "inline-flex items-center gap-6 px-8 text-white/90 border-r border-white/20 mx-4" }, c.imageUrl ? /* @__PURE__ */ React.createElement("img", { src: c.imageUrl, alt: c.name, className: "w-24 h-24 rounded-md object-cover shadow-lg shrink-0 ring-2 ring-[#c9a227]/30" }) : /* @__PURE__ */ React.createElement("div", { className: "w-24 h-24 rounded-md bg-gradient-to-br from-[#1a4ba8] to-[#DA291C] flex items-center justify-center text-white font-bold text-xl shrink-0 shadow-lg" }, initials), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col whitespace-normal text-left max-w-md" }, /* @__PURE__ */ React.createElement("span", { className: "text-[11px] font-bold text-[#c9a227] tracking-wide uppercase" }, c.type, " ", c.role ? `\u2014 ${c.role}` : ""), /* @__PURE__ */ React.createElement("span", { className: "text-[14px] font-bold text-white mt-1 mb-1" }, c.name), c.quote && /* @__PURE__ */ React.createElement("span", { className: "text-[12px] text-white/80 leading-relaxed italic" }, '"', c.quote, '"')));
  }))))), /* @__PURE__ */ React.createElement("section", { className: "px-6 py-10 bg-gray-50/50" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto border-t border-gray-100 pt-8" }, /* @__PURE__ */ React.createElement("p", { className: "text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2 justify-center" }, /* @__PURE__ */ React.createElement("span", { className: "w-6 h-px bg-[#1a4ba8]" }), " ", hero?.stepsPreTitle || t("guide")), /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-extrabold text-center mb-10" }, hero?.stepsTitle || t("startInThreeSteps")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300" }), steps.length > 0 ? steps.map((item, idx) => {
    const c = item.content;
    return /* @__PURE__ */ React.createElement("div", { key: item.id || idx, className: "flex-1 flex flex-col items-center text-center z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm" }, c.step || idx + 1), /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, c.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, c.description));
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center text-center z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm" }, "1"), /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, t("login")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, t("step1Desc"))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center text-center z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm" }, "2"), /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, t("uploadArtworkStep")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, t("step2Desc"))), /* @__PURE__ */ React.createElement("div", { className: "flex-1 flex flex-col items-center text-center z-10" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm" }, "3"), /* @__PURE__ */ React.createElement("h3", { className: "font-bold mb-2" }, t("sharePortfolio")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-gray-500" }, t("step3Desc"))))))), /* @__PURE__ */ React.createElement("section", { className: "bg-gradient-to-r from-[#1a4ba8] to-[#0d2e6e] text-white px-6 py-14 relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" }), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8 relative z-10" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-3xl font-extrabold mb-3" }, cta?.title || t("readyToShowcase")), /* @__PURE__ */ React.createElement("p", { className: "text-white/70" }, cta?.subtitle || t("forStudents"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(cta?.primaryCtaLink || "auth"), className: "bg-white text-[#1a4ba8] hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors shadow-lg" }, cta?.primaryCta || t("loginNow")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(cta?.secondaryCtaLink || "gallery"), className: "border-2 border-white/40 hover:border-white text-white px-8 py-3 rounded-lg font-bold transition-colors" }, cta?.secondaryCta || t("viewGallery"))))), /* @__PURE__ */ React.createElement("footer", { className: "bg-white text-[#212121] py-10 px-6 border-t border-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", className: "h-9 object-contain" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-[#212121]" }, footerInfo?.brand || "Design Gallery"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666]" }, footerInfo?.subtitle || "Khoa Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa"))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666] leading-relaxed mb-4" }, footerInfo?.description || "N\u1EC1n t\u1EA3ng E-Portfolio k\u1EBFt n\u1ED1i sinh vi\xEAn Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa UEF v\u1EDBi gi\u1EA3ng vi\xEAn v\xE0 nh\xE0 tuy\u1EC3n d\u1EE5ng."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("a", { href: footerInfo?.emailUrl || "mailto:khoathietke@uef.edu.vn", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Mail, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.facebookUrl || "https://facebook.com/uef.edu.vn", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Globe, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.youtubeUrl || "https://youtube.com/@uefmedia", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center hover:bg-[#DA291C] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Eye, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.websiteUrl || "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 15 })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, t("contact")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm text-[#666]" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2.5" }, /* @__PURE__ */ React.createElement(MapPin, { size: 15, className: "text-[#DA291C] shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("span", null, footerInfo?.address || "141 \u0110i\u1EC7n Bi\xEAn Ph\u1EE7, Ph\u01B0\u1EDDng 15, Qu\u1EADn B\xECnh Th\u1EA1nh, TP.HCM")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Phone, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("span", null, footerInfo?.phone || "(028) 5422 5555")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Mail, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("a", { href: `mailto:${footerInfo?.email || "khoathietke@uef.edu.vn"}`, className: "hover:text-[#1a4ba8] transition-colors" }, footerInfo?.email || "khoathietke@uef.edu.vn")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Globe, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.websiteUrl || "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "hover:text-[#1a4ba8] transition-colors" }, footerInfo?.websiteLabel || "uef.edu.vn")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, footerInfo?.linksTitle || "Li\xEAn k\u1EBFt"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, footerLinks.length > 0 ? footerLinks.map((item, idx) => {
    const c = item.content;
    return /* @__PURE__ */ React.createElement("li", { key: item.id || idx }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(c.link), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, c.label));
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, "Gallery")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("about"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, t("aboutFaculty"))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, t("login"))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, "Tr\u01B0\u1EDDng UEF"))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, t("socialMedia")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://facebook.com/uef.edu.vn", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Globe, { size: 13 })), " Facebook")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://youtube.com/@uefmedia", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#DA291C] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Eye, { size: 13 })), " Youtube")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 13 })), " Website")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "mailto:khoathietke@uef.edu.vn", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Mail, { size: 13 })), " Email"))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-sm text-[#999] flex flex-col md:flex-row justify-between items-center gap-3" }, /* @__PURE__ */ React.createElement("p", null, getSetting("footerCopyright") || footerInfo?.copyright || t("footerCopyright")), /* @__PURE__ */ React.createElement("p", null, footerInfo?.footerBrand || t("footerBrand")))));
}
const lecturers = [
  { name: "TS. Nguy\u1EC5n V\u0103n T\xE0i", title: "Tr\u01B0\u1EDFng Khoa \xB7 Branding & Identity", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80", email: "nvtai@uef.edu.vn" },
  { name: "ThS. L\xEA Minh Ph\u01B0\u01A1ng", title: "Typography & Editorial Design", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80", email: "lmphuong@uef.edu.vn" },
  { name: "TS. Tr\u1EA7n Quang Kh\u1EA3i", title: "3D Art & Motion Graphics", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", email: "tqkhai@uef.edu.vn" },
  { name: "ThS. V\u0169 Thu H\xE0", title: "UX/UI Design & Interaction", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80", email: "vtha@uef.edu.vn" }
];
const lecturersList = [
  { name: "PGS. TS. Nguy\u1EC5n Minh Khoa", title: "Tr\u01B0\u1EDFng Khoa Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa", bio: "Chuy\xEAn ng\xE0nh: Visual Communication, Brand Identity & Design Strategy. H\u01A1n 20 n\u0103m kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y v\xE0 th\u1EF1c chi\u1EBFn.", skills: ["Typography", "Brand Identity", "Visual Communication"], img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  { name: "ThS. Tr\u1EA7n Th\u1ECB Lan Anh", title: "Gi\u1EA3ng vi\xEAn ch\xEDnh", bio: "Chuy\xEAn ng\xE0nh: UI/UX Design, Digital Product Design & Figma. C\u1ED1 v\u1EA5n thi\u1EBFt k\u1EBF cho nhi\u1EC1u startup c\xF4ng ngh\u1EC7.", skills: ["UI/UX", "Figma", "Product Design"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  { name: "ThS. L\xEA Qu\u1ED1c B\u1EA3o", title: "Gi\u1EA3ng vi\xEAn", bio: "Chuy\xEAn ng\xE0nh: Motion Graphics, After Effects & 3D Animation. Freelance director v\u1EDBi h\u01A1n 50 d\u1EF1 \xE1n th\u01B0\u01A1ng m\u1EA1i l\u1EDBn.", skills: ["Motion Graphics", "After Effects", "3D"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "ThS. Ph\u1EA1m H\u1ED3ng Nhung", title: "Gi\u1EA3ng vi\xEAn", bio: "Chuy\xEAn ng\xE0nh: Typography, Editorial Design & Packaging. T\u1EEBng \u0111o\u1EA1t 2 gi\u1EA3i th\u01B0\u1EDFng thi\u1EBFt k\u1EBF bao b\xEC qu\u1ED1c t\u1EBF.", skills: ["Typography", "Editorial", "Packaging"], img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "TS. Nguy\u1EC5n \u0110\xECnh Tr\u1ECDng", title: "Gi\u1EA3ng vi\xEAn cao c\u1EA5p", bio: "Chuy\xEAn ng\xE0nh: Illustration, Concept Art & Character Design. C\u1ED9ng t\xE1c vi\xEAn cho studio game v\xE0 phim ho\u1EA1t h\xECnh.", skills: ["Illustration", "Concept Art", "Character"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "ThS. V\u0169 Thanh Tuy\u1EC1n", title: "Gi\u1EA3ng vi\xEAn", bio: "Chuy\xEAn ng\xE0nh: Photography, Photo Editing & Visual Storytelling. Nhi\u1EBFp \u1EA3nh gia th\u01B0\u01A1ng m\u1EA1i v\u1EDBi studio t\u1EF1 do.", skills: ["Photography", "Photoshop", "Lightroom"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" }
];
const ABOUT_TABS = [
  { label: "Ch\u01B0\u01A1ng tr\xECnh \u0111\xE0o t\u1EA1o", id: "chuong-trinh-dao-tao" },
  { label: "\u0110\u1ED9i ng\u0169 gi\u1EA3ng vi\xEAn", id: "doi-ngu-giang-vien" },
  { label: "C\u01A1 s\u1EDF v\u1EADt ch\u1EA5t", id: "co-so-vat-chat" },
  { label: "Li\xEAn h\u1EC7", id: "lien-he" }
];
const studentFeatures = [
  { icon: Upload, title: "\u0110\u0103ng t\u1EA3i \u1EA5n ph\u1EA9m", desc: "Upload \u1EA3nh/PDF t\xE1c ph\u1EA9m thi\u1EBFt k\u1EBF k\xE8m th\xF4ng tin m\xF4n h\u1ECDc, c\xF4ng c\u1EE5 v\xE0 m\xF4 t\u1EA3 chi ti\u1EBFt." },
  { icon: Briefcase, title: "Portfolio c\xE1 nh\xE2n", desc: "T\u1EA1o h\u1ED3 s\u01A1 n\u0103ng l\u1EF1c tr\u1EF1c tuy\u1EBFn chuy\xEAn nghi\u1EC7p, d\u1EC5 d\xE0ng chia s\u1EBB v\u1EDBi nh\xE0 tuy\u1EC3n d\u1EE5ng." },
  { icon: MessageSquare, title: "K\u1EBFt n\u1ED1i & Ph\u1EA3n h\u1ED3i", desc: "Nh\u1EADn nh\u1EADn x\xE9t t\u1EEB gi\u1EA3ng vi\xEAn, k\u1EBFt n\u1ED1i v\u1EDBi nh\xE0 tuy\u1EC3n d\u1EE5ng qua h\u1EC7 th\u1ED1ng tin nh\u1EAFn." },
  { icon: BarChart2, title: "Theo d\xF5i ti\u1EBFn \u0111\u1ED9", desc: "Dashboard c\xE1 nh\xE2n qu\u1EA3n l\xFD b\xE0i \u0111\u0103ng, l\u01B0\u1EE3t t\u01B0\u01A1ng t\xE1c v\xE0 \u0111i\u1EC3m \u0111\xE1nh gi\xE1." },
  { icon: BookOpen, title: "H\u1ECDc t\u1EADp & Ph\xE1t tri\u1EC3n", desc: "Tham kh\u1EA3o t\xE1c ph\u1EA9m c\u1EE7a b\u1EA1n h\u1ECDc, h\u1ECDc h\u1ECFi k\u1EF9 thu\u1EADt thi\u1EBFt k\u1EBF \u0111a d\u1EA1ng." },
  { icon: Star, title: "C\u01A1 h\u1ED9i ngh\u1EC1 nghi\u1EC7p", desc: "Ti\u1EBFp c\u1EADn nh\xE0 tuy\u1EC3n d\u1EE5ng ti\u1EC1m n\u0103ng th\xF4ng qua Moodboard \u1EA5n ph\u1EA9m t\u1ED1t nghi\u1EC7p." }
];
const employerFeatures = [
  { icon: Search, title: "T\xECm ki\u1EBFm t\xE0i n\u0103ng", desc: "Duy\u1EC7t portfolio sinh vi\xEAn theo k\u1EF9 n\u0103ng, c\xF4ng c\u1EE5, m\xF4n h\u1ECDc v\xE0 n\u0103m t\u1ED1t nghi\u1EC7p." },
  { icon: Eye, title: "\u0110\xE1nh gi\xE1 n\u0103ng l\u1EF1c", desc: "Xem \u0111i\u1EC3m \u0111\xE1nh gi\xE1 t\u1EEB gi\u1EA3ng vi\xEAn, nh\u1EADn x\xE9t chuy\xEAn m\xF4n tr\xEAn t\u1EEBng t\xE1c ph\u1EA9m." },
  { icon: Send, title: "Li\xEAn h\u1EC7 tr\u1EF1c ti\u1EBFp", desc: "G\u1EEDi tin nh\u1EAFn tuy\u1EC3n d\u1EE5ng qua h\u1EC7 th\u1ED1ng \u2014 k\u1EBFt n\u1ED1i nhanh ch\xF3ng v\u1EDBi \u1EE9ng vi\xEAn ti\u1EC1m n\u0103ng." },
  { icon: Heart, title: "L\u01B0u & Theo d\xF5i", desc: "\u0110\xE1nh d\u1EA5u \u1EE9ng vi\xEAn tri\u1EC3n v\u1ECDng, theo d\xF5i c\u1EADp nh\u1EADt t\xE1c ph\u1EA9m m\u1EDBi nh\u1EA5t." },
  { icon: FileDown, title: "Xu\u1EA5t b\xE1o c\xE1o", desc: "T\u1ED5ng h\u1EE3p Moodboard \u1EE9ng vi\xEAn n\u1ED5i b\u1EADt, xu\u1EA5t PDF ph\u1EE5c v\u1EE5 tuy\u1EC3n d\u1EE5ng." },
  { icon: Globe, title: "Ti\u1EBFp c\u1EADn r\u1ED9ng", desc: "H\u01A1n 500 \u1EA5n ph\u1EA9m \u0111\u1ED3 \xE1n t\u1EEB sinh vi\xEAn ng\xE0nh Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa UEF." }
];
const schoolFeatures = [
  { icon: LayoutDashboard, title: "Qu\u1EA3n l\xFD \u0111\xE0o t\u1EA1o", desc: "Theo d\xF5i to\xE0n b\u1ED9 \u0111\u1ED3 \xE1n sinh vi\xEAn theo m\xF4n h\u1ECDc, semester v\xE0 n\u0103m h\u1ECDc." },
  { icon: Check, title: "\u0110\xE1nh gi\xE1 ch\u1EA5t l\u01B0\u1EE3ng", desc: "Gi\u1EA3ng vi\xEAn ch\u1EA5m \u0111i\u1EC3m, nh\u1EADn x\xE9t tr\u1EF1c ti\u1EBFp; th\u1ED1ng k\xEA \u0111i\u1EC3m s\u1ED1 theo l\u1EDBp v\xE0 m\xF4n." },
  { icon: Folder, title: "Moodboard tri\u1EC3n l\xE3m", desc: "T\u1EA1o tuy\u1EC3n t\u1EADp \u1EA5n ph\u1EA9m xu\u1EA5t s\u1EAFc, s\u1EAFp x\u1EBFp k\xE9o th\u1EA3 v\xE0 xu\u1EA5t t\u1EADp san PDF." },
  { icon: Bookmark, title: "L\u01B0u tr\u1EEF h\u1ECDc thu\u1EADt", desc: "L\u01B0u gi\u1EEF to\xE0n b\u1ED9 \u0111\u1ED3 \xE1n qua c\xE1c n\u0103m ph\u1EE5c v\u1EE5 ki\u1EC3m \u0111\u1ECBnh v\xE0 \u0111\u1ED1i s\xE1nh." },
  { icon: Users, title: "Qu\u1EA3n l\xFD ng\u01B0\u1EDDi d\xF9ng", desc: "Qu\u1EA3n l\xFD t\xE0i kho\u1EA3n sinh vi\xEAn, gi\u1EA3ng vi\xEAn; ph\xE2n quy\u1EC1n v\xE0 kh\xF3a/m\u1EDF t\xE0i kho\u1EA3n." },
  { icon: ShieldAlert, title: "Ki\u1EC3m duy\u1EC7t n\u1ED9i dung", desc: "Gi\xE1m s\xE1t n\u1ED9i dung \u0111\u0103ng t\u1EA3i, x\u1EED l\xFD b\xE1o c\xE1o vi ph\u1EA1m v\xE0 c\u1EA3nh c\xE1o." }
];
const facilitiesList = [
  {
    title: "Studio Thi\u1EBFt k\u1EBF",
    desc: "Kh\xF4ng gian l\xE0m vi\u1EC7c nh\xF3m v\u1EDBi b\u1EA3ng v\u1EBD, b\xE0n c\u1EAFt, khu in \u1EA5n th\u1EED nghi\u1EC7m v\xE0 h\u1EC7 th\u1ED1ng tr\xECnh chi\u1EBFu cho critique.",
    icon: PenTool,
    img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=80"
  },
  {
    title: "Ph\xF2ng m\xE1y chuy\xEAn d\u1EE5ng",
    desc: "M\xE1y c\u1EA5u h\xECnh cao cho Adobe CC, 3D v\xE0 motion; m\xE0n h\xECnh chu\u1EA9n m\xE0u ph\u1EE5c v\u1EE5 thi\u1EBFt k\u1EBF v\xE0 h\u1EADu k\u1EF3.",
    icon: Monitor,
    img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&q=80"
  },
  {
    title: "Thi\u1EBFt b\u1ECB ghi h\xECnh",
    desc: "B\u1ED9 kit quay/ch\u1EE5p, \u0111\xE8n studio v\xE0 ph\u1EE5 ki\u1EC7n gi\xFAp sinh vi\xEAn ho\xE0n thi\u1EC7n s\u1EA3n ph\u1EA9m \u1EA3nh, video v\xE0 content marketing.",
    icon: FileImage,
    img: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200&q=80"
  }
];
const softwareStack = [
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Adobe After Effects",
  "Figma",
  "Blender",
  "Procreate"
];
function AboutPage({ setPage, isLoggedIn }) {
  const [activeTab, setActiveTab] = useState("student");
  const [openFaq, setOpenFaq] = useState(null);
  const { getContentBySection, getContentItems, getSetting } = useSiteContent();
  const aboutHero = getContentBySection("about", "aboutHero");
  const aboutValues = getContentItems("about", "aboutValues");
  const aboutProcess = getContentItems("about", "aboutProcess");
  const aboutCta = getContentBySection("about", "aboutCta");
  const footerInfo = getContentBySection("footer", "footerInfo");
  const footerLinks = getContentItems("footer", "footerLinks");
  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };
  const [dynamicImages, setDynamicImages] = useState([]);
  useEffect(() => {
    fetch("http://localhost:5000/api/artworks").then((res) => res.json()).then((data) => {
      if (data.artworks && Array.isArray(data.artworks)) {
        const sorted = [...data.artworks].sort((a, b) => (b.viewCount || 0) + (b.likeCount || 0) - ((a.viewCount || 0) + (a.likeCount || 0)));
        const topImages = sorted.map((a) => a.coverImageUrl).filter(Boolean);
        setDynamicImages(topImages.slice(0, 10));
      }
    }).catch((err) => console.error(err));
  }, []);
  const defaultImages = [
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
  const images = dynamicImages.length > 0 ? [...dynamicImages, ...defaultImages].slice(0, 10) : defaultImages;
  return /* @__PURE__ */ React.createElement("div", { className: "bg-white min-h-screen text-[#212121] overflow-x-hidden font-sans" }, /* @__PURE__ */ React.createElement("section", { className: "relative min-h-[70vh] pt-16 pb-10 px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 items-center overflow-hidden bg-[#f9fafc]" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 z-0" }, /* @__PURE__ */ React.createElement("div", { className: "absolute -top-20 -left-20 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-[120px] opacity-15" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-40 left-1/4 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-[120px] opacity-15" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-10 right-10 w-[500px] h-[500px] bg-[#d6e8ff] rounded-full mix-blend-multiply filter blur-[120px] opacity-40" })), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 lg:pl-10 xl:pl-24 lg:pr-8" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-3 bg-gradient-to-r from-red-50 to-blue-50 border border-red-100 text-[#0d2e6e] px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest mb-6 animate-[fadeUp_0.5s_ease-out] shadow-sm" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-gradient-to-r from-red-500 to-blue-600 rounded-full animate-pulse" }), "Khoa Thi\u1EBFt K\u1EBF \u0110\u1ED3 H\u1ECDa UEF"), /* @__PURE__ */ React.createElement("h1", { className: "text-5xl lg:text-7xl font-extrabold leading-[1.1] text-[#0a0c0f] mb-6 tracking-tight animate-[fadeUp_0.7s_ease-out]" }, aboutHero?.title ? aboutHero.title.split("\n").map((line, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, i > 0 && /* @__PURE__ */ React.createElement("br", null), line)) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("span", { className: "text-transparent bg-clip-text bg-gradient-to-r from-[#0a0c0f] to-[#1a4ba8]" }, t("aboutHeroExplore")), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "relative inline-block mt-2" }, /* @__PURE__ */ React.createElement("span", { className: "absolute -bottom-2 left-0 w-full h-4 bg-red-100 -z-10 transform skew-x-[-12deg]" }), /* @__PURE__ */ React.createElement("span", { className: "text-red-600" }, t("aboutHeroExcellentProjects"))), /* @__PURE__ */ React.createElement("br", null), t("aboutHeroFromUefStudents"))), /* @__PURE__ */ React.createElement("p", { className: "text-[#555] text-lg leading-relaxed max-w-[540px] mb-8 font-medium border-l-[3px] border-red-500 pl-5 py-2 bg-gradient-to-r from-red-50/40 to-transparent animate-[fadeUp_0.9s_ease-out]" }, aboutHero?.description || /* @__PURE__ */ React.createElement(React.Fragment, null, t("aboutHeroDesc1"), " ", /* @__PURE__ */ React.createElement("strong", { className: "text-red-600" }, t("aboutHeroDesc2")))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-4 mb-4 animate-[fadeUp_1.1s_ease-out]" }, /* @__PURE__ */ React.createElement("a", { href: isLoggedIn ? void 0 : "#audience", onClick: (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      setPage("dashboard");
    }
  }, className: "group inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#1a4ba8] to-blue-700 text-white rounded-full font-bold text-[15px] hover:shadow-xl hover:shadow-blue-500/30 transition-all transform hover:-translate-y-0.5 cursor-pointer" }, t("aboutExploreNow"), " ", /* @__PURE__ */ React.createElement(ArrowRight, { size: 18, className: "group-hover:translate-x-1 transition-transform" })), !isLoggedIn && /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "inline-flex items-center px-8 py-4 bg-white border-2 border-gray-200 text-[#0a0c0f] rounded-full font-bold text-[15px] hover:border-red-500 hover:text-red-600 transition-colors" }, "\u0110\u0103ng nh\u1EADp")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-6 pt-5 mt-6 border-t border-[#e2e6ec] animate-[fadeUp_1.3s_ease-out]" }, aboutHero?.stats ? (() => {
    try {
      const statsArr = JSON.parse(aboutHero.stats);
      return statsArr.slice(0, 4).map((s, i) => /* @__PURE__ */ React.createElement("div", { key: i }, /* @__PURE__ */ React.createElement("div", { className: "text-[28px] font-black text-[#0d2e6e] leading-none" }, s.value), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider" }, s.label)));
    } catch {
      return null;
    }
  })() : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-[28px] font-black text-[#0d2e6e] leading-none" }, "500+"), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider" }, t("aboutArtworksOnDisplay"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "text-[28px] font-black text-[#0d2e6e] leading-none" }, "120+"), /* @__PURE__ */ React.createElement("div", { className: "text-[11px] text-[#8b96a8] mt-1.5 font-bold uppercase tracking-wider" }, t("aboutLecturersParticipating")))))), /* @__PURE__ */ React.createElement("div", { className: "hidden lg:flex relative z-10 h-full items-center justify-center pointer-events-none" }, /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 grid-rows-5 grid-flow-dense gap-2.5 w-full max-w-[500px] aspect-[4/5] p-8 pb-4 origin-center animate-[mosaicFloat_9s_ease-in-out_infinite] pointer-events-auto" }, /* @__PURE__ */ React.createElement("div", { className: "row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[0], className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase" }, "Branding")), /* @__PURE__ */ React.createElement("div", { className: "col-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[1], className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[2], className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase" }, "UI/UX")), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[3], className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[4], className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase" }, "Illustration")), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[5], className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[6], className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[7], className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "col-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[8], className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("span", { className: "absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase" }, "Poster")), /* @__PURE__ */ React.createElement("div", { className: "rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20 shadow-md" }, /* @__PURE__ */ React.createElement("img", { src: images[9], className: "w-full h-full object-cover" }))))), /* @__PURE__ */ React.createElement("div", { className: "bg-[#0d2e6e] py-2 overflow-hidden border-y border-white/10 shadow-inner" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-0 whitespace-nowrap animate-[ticker_32s_linear_infinite] w-max" }, [...Array(2)].map((_, i) => /* @__PURE__ */ React.createElement(React.Fragment, { key: i }, /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]" }), t("aboutTicker1")), /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]" }), t("aboutTicker2")), /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]" }), t("aboutTicker3")), /* @__PURE__ */ React.createElement("span", { className: "inline-flex items-center gap-3 px-10 text-[13px] font-bold text-white/90 border-r border-white/20" }, /* @__PURE__ */ React.createElement("span", { className: "w-2 h-2 bg-[#c9a227] rounded-full shadow-[0_0_10px_#c9a227]" }), t("aboutTicker4")))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white py-10 overflow-hidden relative" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent z-10" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent z-10" }), /* @__PURE__ */ React.createElement("div", { className: "text-center mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("span", { className: "w-7 h-[2px] bg-[#1a4ba8]" }), " ", t("aboutFeaturedArtworks"))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-4 w-max animate-[stripScroll_35s_linear_infinite] hover:[animation-play-state:paused] px-4" }, [...images, ...images].map((img, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "w-[240px] h-[160px] rounded-xl overflow-hidden shrink-0 group relative shadow-md" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" }), /* @__PURE__ */ React.createElement("img", { src: img, className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" }))))), /* @__PURE__ */ React.createElement("section", { id: "audience", className: "bg-gradient-to-b from-[#f5f6f8] to-white py-14 px-6 lg:px-12 border-t border-[#e2e6ec]" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "w-7 h-[2px] bg-[#1a4ba8]" }), " ", t("aboutCoreEcosystem")), /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-black text-[#0a0c0f] leading-[1.1] mb-6 tracking-tight" }, t("aboutSeamlessExperience1"), /* @__PURE__ */ React.createElement("br", null), t("aboutSeamlessExperience2")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-base leading-relaxed max-w-[600px] mb-6" }, t("aboutAudienceDesc")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 border-b-2 border-[#e2e6ec] mb-8 overflow-x-auto pb-1" }, /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("student"), className: `flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === "student" ? "bg-[#0d2e6e] text-white shadow-md transform -translate-y-1" : "text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100"}` }, /* @__PURE__ */ React.createElement(GraduationCap, { size: 18 }), " ", t("student")), /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("lecturer"), className: `flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === "lecturer" ? "bg-[#0d2e6e] text-white shadow-md transform -translate-y-1" : "text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100"}` }, /* @__PURE__ */ React.createElement(ClipboardList, { size: 18 }), " ", t("lecturer")), /* @__PURE__ */ React.createElement("button", { onClick: () => setActiveTab("recruiter"), className: `flex items-center gap-2 px-8 py-3.5 font-bold text-[15px] rounded-t-xl whitespace-nowrap transition-all ${activeTab === "recruiter" ? "bg-[#0d2e6e] text-white shadow-md transform -translate-y-1" : "text-[#8b96a8] hover:text-[#1a4ba8] hover:bg-gray-100"}` }, /* @__PURE__ */ React.createElement(Building2, { size: 18 }), " Nh\xE0 tuy\u1EC3n d\u1EE5ng")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-10 items-center" }, activeTab === "student" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight" }, t("aboutStudentTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-[15px] leading-relaxed mb-8" }, t("aboutStudentDesc")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-6 mb-8" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(LayoutGrid, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutStudentPoint1Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutStudentPoint1Desc")))), /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(Link, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutStudentPoint2Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutStudentPoint2Desc")))), /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(Zap, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutStudentPoint3Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutStudentPoint3Desc"))))), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "px-7 py-3.5 bg-[#0a0c0f] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a4ba8] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5" }, t("aboutStudentCreateNow"))), /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80", alt: "Student Dashboard", className: "w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-5 left-5 text-white" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-lg" }, t("aboutStudentDash1")), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-80" }, t("aboutStudentDash2"))))))), activeTab === "lecturer" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight" }, t("aboutLecturerTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-[15px] leading-relaxed mb-8" }, t("aboutLecturerDesc")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-6 mb-8" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#fef2f2] text-[#c0392b] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(FileBadge, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutLecturerPoint1Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutLecturerPoint1Desc")))), /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutLecturerPoint2Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutLecturerPoint2Desc")))))), /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80", alt: "Lecturer Dashboard", className: "w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-5 left-5 text-white" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-lg" }, t("aboutLecturerDash1")), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-80" }, t("aboutLecturerDash2"))))))), activeTab === "recruiter" && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h3", { className: "text-3xl font-extrabold text-[#0a0c0f] mb-4 leading-tight" }, t("aboutRecruiterTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-[15px] leading-relaxed mb-8" }, t("aboutRecruiterDesc")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-6 mb-8" }, /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#fdfaf1] text-[#c9a227] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(Filter, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutRecruiterPoint1Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutRecruiterPoint1Desc")))), /* @__PURE__ */ React.createElement("li", { className: "flex gap-4 group" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 shrink-0 rounded-xl bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm" }, /* @__PURE__ */ React.createElement(UserPlus, { size: 22 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-[#0a0c0f] text-[15px] block mb-1" }, t("aboutRecruiterPoint2Title")), /* @__PURE__ */ React.createElement("span", { className: "text-[#666] text-sm leading-relaxed" }, t("aboutRecruiterPoint2Desc")))))), /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-3xl overflow-hidden border border-[#e2e6ec] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] p-3" }, /* @__PURE__ */ React.createElement("div", { className: "rounded-2xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative group" }, /* @__PURE__ */ React.createElement("img", { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", alt: "Recruiter View", className: "w-full h-full object-cover opacity-95 transition-transform duration-700 group-hover:scale-105" }), /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-5 left-5 text-white" }, /* @__PURE__ */ React.createElement("div", { className: "font-bold text-lg" }, t("aboutRecruiterDash1")), /* @__PURE__ */ React.createElement("div", { className: "text-sm opacity-80" }, t("aboutRecruiterDash2")))))))))), /* @__PURE__ */ React.createElement("section", { className: "bg-white py-16 px-6 lg:px-12 text-[#212121] relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 w-[500px] h-[500px] bg-[#1a4ba8] rounded-full blur-[150px] opacity-[0.06] pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#DA291C] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-[700px] mb-12 text-center mx-auto animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-3" }, /* @__PURE__ */ React.createElement("span", { className: "w-7 h-[2px] bg-[#1a4ba8]" }), " ", t("aboutValuesPreTitle")), /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-5xl font-black mb-6 leading-tight tracking-tight text-[#212121]" }, /* @__PURE__ */ React.createElement("span", { className: "text-[#1a4ba8]" }, "Thi\u1EBFt k\u1EBF"), " v\xEC s\u1EF1 ph\xE1t tri\u1EC3n", /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("span", { className: "text-[#DA291C]" }, "to\xE0n di\u1EC7n"), " c\u1EE7a sinh vi\xEAn")), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-12" }, /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#1a4ba8]/20 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(26,75,168,0.12)] transition-all border-t-[4px] border-t-[#1a4ba8] group hover:-translate-y-2 duration-300 animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(LayoutGrid, { size: 28 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-2xl mb-4 text-[#212121]" }, "Portfolio Driven"), /* @__PURE__ */ React.createElement("p", { className: "text-[15px] text-[#555] leading-relaxed" }, t("aboutValue1Desc"))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#DA291C]/20 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(218,41,28,0.12)] transition-all border-t-[4px] border-t-[#DA291C] group hover:-translate-y-2 duration-300 animate-[fadeUp_0.9s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(ShieldCheck, { size: 28 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-2xl mb-4 text-[#212121]" }, "Academic Integrity"), /* @__PURE__ */ React.createElement("p", { className: "text-[15px] text-[#555] leading-relaxed" }, t("aboutValue2Desc"))), /* @__PURE__ */ React.createElement("div", { className: "bg-gray-50 border border-gray-200 p-6 rounded-3xl hover:shadow-[0_0_30px_rgba(0,0,0,0.08)] transition-all border-t-[4px] border-t-gray-300 group hover:-translate-y-2 duration-300 animate-[fadeUp_1.1s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-14 h-14 rounded-2xl bg-gray-200 text-[#555] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform" }, /* @__PURE__ */ React.createElement(Building2, { size: 28 })), /* @__PURE__ */ React.createElement("h3", { className: "font-extrabold text-2xl mb-4 text-[#212121]" }, "Industry Ready"), /* @__PURE__ */ React.createElement("p", { className: "text-[15px] text-[#555] leading-relaxed" }, t("aboutValue3Desc")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-gray-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-evenly gap-6 text-center animate-[fadeUp_1.3s_ease-out] shadow-sm" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight" }, "350+"), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#1a4ba8]" }, t("aboutStats1Title"))), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-px h-px md:h-20 bg-gray-200" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight" }, "98%"), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#DA291C]" }, t("aboutStats2Title"))), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-px h-px md:h-20 bg-gray-200" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "font-black text-5xl md:text-6xl text-[#212121] mb-2 tracking-tight" }, "45+"), /* @__PURE__ */ React.createElement("div", { className: "text-xs font-bold uppercase tracking-[0.2em] text-[#555]" }, t("aboutStats3Title")))))), /* @__PURE__ */ React.createElement("section", { className: "py-14 px-6 lg:px-12 bg-[#f9fafc] border-b border-[#e2e6ec] overflow-hidden relative" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-10 animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h2", { className: "text-4xl font-black text-[#0a0c0f] mb-4" }, t("aboutProcessTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] max-w-2xl mx-auto text-base" }, t("aboutProcessDesc"))), /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-col md:flex-row items-center justify-center gap-6 md:gap-6" }, /* @__PURE__ */ React.createElement("div", { className: "hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-gradient-to-r from-[#d6e8ff] via-[#1a4ba8] to-[#d6e8ff] -translate-y-1/2 z-0 opacity-40" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-[#1a4ba8] to-[#0d2e6e] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#1a4ba8]/20 ring-4 ring-white" }, "1"), /* @__PURE__ */ React.createElement("h4", { className: "font-extrabold text-[#0a0c0f] text-lg mb-3" }, t("aboutStep1Title")), /* @__PURE__ */ React.createElement("p", { className: "text-[14px] text-[#666] leading-relaxed" }, t("aboutStep1Desc"))), /* @__PURE__ */ React.createElement(ArrowRight, { className: "text-[#1a4ba8] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_0.8s_ease-out]", size: 32 }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_0.9s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-[#c0392b] to-[#8a1919] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c0392b]/20 ring-4 ring-white" }, "2"), /* @__PURE__ */ React.createElement("h4", { className: "font-extrabold text-[#0a0c0f] text-lg mb-3" }, t("aboutStep2Title")), /* @__PURE__ */ React.createElement("p", { className: "text-[14px] text-[#666] leading-relaxed" }, t("aboutStep2Desc"))), /* @__PURE__ */ React.createElement(ArrowRight, { className: "text-[#c0392b] hidden md:block relative z-10 bg-[#f9fafc] ring-8 ring-[#f9fafc] rounded-full animate-[fadeUp_1.0s_ease-out]", size: 32 }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 bg-white p-6 rounded-3xl border border-[#e2e6ec] shadow-lg flex-1 text-center w-full max-w-[300px] hover:-translate-y-2 transition-transform duration-300 animate-[fadeUp_1.1s_ease-out]" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-gradient-to-br from-[#c9a227] to-[#967615] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 font-black text-2xl shadow-xl shadow-[#c9a227]/20 ring-4 ring-white" }, "3"), /* @__PURE__ */ React.createElement("h4", { className: "font-extrabold text-[#0a0c0f] text-lg mb-3" }, t("aboutStep3Title")), /* @__PURE__ */ React.createElement("p", { className: "text-[14px] text-[#666] leading-relaxed" }, t("aboutStep3Desc")))))), /* @__PURE__ */ React.createElement("section", { id: "compare", className: "py-14 px-6 lg:px-12 bg-white" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-5xl mx-auto" }, /* @__PURE__ */ React.createElement("div", { className: "text-center mb-10 animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h2", { className: "text-4xl font-black text-[#0a0c0f] mb-4" }, t("aboutCompareTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-base" }, t("aboutCompareDesc"))), /* @__PURE__ */ React.createElement("div", { className: "overflow-x-auto rounded-2xl border border-[#e2e6ec] shadow-xl shadow-black/5 animate-[fadeUp_0.7s_ease-out]" }, /* @__PURE__ */ React.createElement("table", { className: "w-full text-left border-collapse min-w-[700px]" }, /* @__PURE__ */ React.createElement("thead", null, /* @__PURE__ */ React.createElement("tr", null, /* @__PURE__ */ React.createElement("th", { className: "bg-[#f9fafc] p-6 font-extrabold text-[#0a0c0f] border-b border-[#e2e6ec] text-[15px] uppercase tracking-wider w-[40%]" }, t("aboutCompareCol1")), /* @__PURE__ */ React.createElement("th", { className: "bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center" }, "Behance / Dribbble"), /* @__PURE__ */ React.createElement("th", { className: "bg-white p-6 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center" }, "Google Drive"), /* @__PURE__ */ React.createElement("th", { className: "bg-gradient-to-r from-[#0d2e6e] to-[#1a4ba8] p-6 font-extrabold text-white border-b border-[#0d2e6e] text-[15px] text-center shadow-inner" }, "UEF Gallery"))), /* @__PURE__ */ React.createElement("tbody", { className: "text-[15px]" }, /* @__PURE__ */ React.createElement("tr", { className: "hover:bg-[#f4f7fb] transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]" }, t("aboutCompareF1")), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black" }, /* @__PURE__ */ React.createElement(Check, { size: 24, className: "mx-auto" }))), /* @__PURE__ */ React.createElement("tr", { className: "hover:bg-[#f4f7fb] transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]" }, t("aboutCompareF2")), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black" }, /* @__PURE__ */ React.createElement(Check, { size: 24, className: "mx-auto" }))), /* @__PURE__ */ React.createElement("tr", { className: "hover:bg-[#f4f7fb] transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] font-bold text-[#0a0c0f]" }, t("aboutCompareF3")), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#1a4ba8] font-black" }, /* @__PURE__ */ React.createElement(Check, { size: 24, className: "mx-auto" }))), /* @__PURE__ */ React.createElement("tr", { className: "hover:bg-[#f4f7fb] transition-colors" }, /* @__PURE__ */ React.createElement("td", { className: "p-5 font-bold text-[#0a0c0f]" }, t("aboutCompareF4")), /* @__PURE__ */ React.createElement("td", { className: "p-5 text-center text-[#38a169]/80" }, /* @__PURE__ */ React.createElement(Check, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 text-center text-[#e53e3e]/70" }, /* @__PURE__ */ React.createElement(X, { size: 20, className: "mx-auto" })), /* @__PURE__ */ React.createElement("td", { className: "p-5 bg-[#f8fafc] text-center text-[#1a4ba8] font-black" }, /* @__PURE__ */ React.createElement(Check, { size: 24, className: "mx-auto" })))))))), /* @__PURE__ */ React.createElement("section", { id: "faq", className: "py-14 px-6 lg:px-12 bg-[#f9fafc] border-t border-[#e2e6ec]" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16" }, /* @__PURE__ */ React.createElement("div", { className: "animate-[fadeUp_0.5s_ease-out]" }, /* @__PURE__ */ React.createElement("h3", { className: "font-black text-4xl mb-5 tracking-tight text-[#0a0c0f]" }, t("aboutFaqTitle")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666] text-base leading-relaxed mb-10" }, t("aboutFaqDesc")), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#e2e6ec] shadow-md rounded-2xl p-6 flex items-start gap-5 hover:border-[#1a4ba8]/30 transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-12 h-12 bg-[#f0f4ff] text-[#1a4ba8] rounded-xl flex items-center justify-center shrink-0" }, /* @__PURE__ */ React.createElement(Mail, { size: 24 })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("strong", { className: "text-base block mb-1 font-extrabold text-[#0a0c0f]" }, t("aboutFaqTechSupport")), /* @__PURE__ */ React.createElement("span", { className: "text-sm text-[#666] block mb-3" }, t("aboutFaqTechSupportDesc")), /* @__PURE__ */ React.createElement("a", { href: "mailto:khoathietke@uef.edu.vn", className: "text-[#1a4ba8] font-bold hover:underline" }, "khoathietke@uef.edu.vn")))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4 animate-[fadeUp_0.7s_ease-out]" }, [
    { q: t("aboutFaq1Q"), a: t("aboutFaq1A") },
    { q: t("aboutFaq2Q"), a: t("aboutFaq2A") },
    { q: t("aboutFaq3Q"), a: t("aboutFaq3A") },
    { q: t("aboutFaq4Q"), a: t("aboutFaq4A") }
  ].map((faq, i) => /* @__PURE__ */ React.createElement("div", { key: i, className: "border border-[#e2e6ec] rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow" }, /* @__PURE__ */ React.createElement("button", { onClick: () => toggleFaq(i), className: "w-full flex items-center justify-between p-6 text-left bg-white transition-colors" }, /* @__PURE__ */ React.createElement("strong", { className: `text-base font-extrabold transition-colors ${openFaq === i ? "text-[#1a4ba8]" : "text-[#0a0c0f]"}` }, faq.q), /* @__PURE__ */ React.createElement(ChevronDown, { size: 20, className: `text-[#8b96a8] transition-transform duration-300 ${openFaq === i ? "rotate-180 text-[#1a4ba8]" : ""}` })), /* @__PURE__ */ React.createElement("div", { className: `overflow-hidden transition-all duration-300 ${openFaq === i ? "max-h-[200px] opacity-100" : "max-h-0 opacity-0"}` }, /* @__PURE__ */ React.createElement("div", { className: "p-6 pt-0 text-[15px] text-[#666] leading-relaxed border-t border-[#e2e6ec]/50 mt-2" }, faq.a))))))), /* @__PURE__ */ React.createElement("section", { className: "py-20 px-6 lg:px-12 bg-gradient-to-br from-[#0d2e6e] via-[#153b86] to-[#091a45] text-center text-white relative overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none animate-pulse" }), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#60afff]/20 rounded-full blur-[100px] pointer-events-none animate-pulse delay-1000" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] border border-white/10 rounded-full pointer-events-none" }), /* @__PURE__ */ React.createElement("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-white/10 rounded-full pointer-events-none border-dashed" }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 max-w-3xl mx-auto animate-[fadeUp_0.8s_ease-out]" }, /* @__PURE__ */ React.createElement("h2", { className: "text-4xl md:text-6xl font-black mb-8 leading-tight tracking-tight" }, t("aboutCtaTitle1"), /* @__PURE__ */ React.createElement("br", null), t("aboutCtaTitle2")), /* @__PURE__ */ React.createElement("p", { className: "text-white/80 mb-12 text-lg max-w-xl mx-auto" }, t("aboutCtaDesc")), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col sm:flex-row gap-4 justify-center" }, !isLoggedIn && /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "px-10 py-4 bg-white text-[#0d2e6e] font-black rounded-2xl text-[16px] hover:bg-[#f0f4ff] hover:-translate-y-1 transition-all shadow-xl shadow-black/30 duration-300" }, "B\u1EAFt \u0111\u1EA7u ngay mi\u1EC5n ph\xED"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(isLoggedIn ? "dashboard" : "gallery"), className: "px-10 py-4 bg-transparent text-white font-bold rounded-2xl text-[16px] border-2 border-white/30 hover:bg-white/10 hover:border-white/60 transition-all duration-300" }, "Kh\xE1m ph\xE1 Gallery")))), /* @__PURE__ */ React.createElement("footer", { className: "bg-white text-[#212121] py-10 px-6 lg:px-12 border-t border-gray-200" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "md:col-span-1" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ React.createElement("img", { src: "/logo-uef.png", alt: "UEF", className: "h-9 object-contain" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", { className: "font-bold text-[#212121]" }, footerInfo?.brand || "Design Gallery"), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666]" }, footerInfo?.subtitle || "Khoa Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa"))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666] leading-relaxed mb-4" }, footerInfo?.description || "N\u1EC1n t\u1EA3ng E-Portfolio k\u1EBFt n\u1ED1i sinh vi\xEAn Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa UEF v\u1EDBi gi\u1EA3ng vi\xEAn v\xE0 nh\xE0 tuy\u1EC3n d\u1EE5ng."), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("a", { href: footerInfo?.emailUrl || "mailto:khoathietke@uef.edu.vn", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Mail, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.facebookUrl || "https://facebook.com/uef.edu.vn", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Globe, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.youtubeUrl || "https://youtube.com/@uefmedia", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center hover:bg-[#DA291C] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(Eye, { size: 15 })), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.websiteUrl || "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "w-9 h-9 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center hover:bg-[#1a4ba8] hover:text-white transition-all" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 15 })))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, t("contact")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm text-[#666]" }, /* @__PURE__ */ React.createElement("li", { className: "flex items-start gap-2.5" }, /* @__PURE__ */ React.createElement(MapPin, { size: 15, className: "text-[#DA291C] shrink-0 mt-0.5" }), /* @__PURE__ */ React.createElement("span", null, footerInfo?.address || "141 \u0110i\u1EC7n Bi\xEAn Ph\u1EE7, Ph\u01B0\u1EDDng 15, Qu\u1EADn B\xECnh Th\u1EA1nh, TP.HCM")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Phone, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("span", null, footerInfo?.phone || "(028) 5422 5555")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Mail, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("a", { href: `mailto:${footerInfo?.email || "khoathietke@uef.edu.vn"}`, className: "hover:text-[#1a4ba8] transition-colors" }, footerInfo?.email || "khoathietke@uef.edu.vn")), /* @__PURE__ */ React.createElement("li", { className: "flex items-center gap-2.5" }, /* @__PURE__ */ React.createElement(Globe, { size: 15, className: "text-[#DA291C] shrink-0" }), /* @__PURE__ */ React.createElement("a", { href: footerInfo?.websiteUrl || "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "hover:text-[#1a4ba8] transition-colors" }, footerInfo?.websiteLabel || "uef.edu.vn")))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, "Li\xEAn k\u1EBFt"), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, footerLinks.length > 0 ? footerLinks.map((item, idx) => {
    const c = item.content;
    return /* @__PURE__ */ React.createElement("li", { key: item.id || idx }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage(c.link), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, c.label));
  }) : /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("gallery"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, "Gallery")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("about"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, t("aboutFaculty"))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, t("login"))), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "text-[#666] hover:text-[#1a4ba8] transition-colors" }, "Tr\u01B0\u1EDDng UEF"))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h4", { className: "font-bold text-sm text-[#1a4ba8] uppercase tracking-wider mb-5" }, t("socialMedia")), /* @__PURE__ */ React.createElement("ul", { className: "space-y-3 text-sm" }, /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://facebook.com/uef.edu.vn", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Globe, { size: 13 })), " Facebook")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://youtube.com/@uefmedia", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#DA291C] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Eye, { size: 13 })), " Youtube")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "https://uef.edu.vn", target: "_blank", rel: "noreferrer", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#eef4ff] text-[#1a4ba8] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 13 })), " Website")), /* @__PURE__ */ React.createElement("li", null, /* @__PURE__ */ React.createElement("a", { href: "mailto:khoathietke@uef.edu.vn", className: "flex items-center gap-2.5 text-[#666] hover:text-[#1a4ba8] transition-colors" }, /* @__PURE__ */ React.createElement("div", { className: "w-7 h-7 rounded-full bg-[#fff1f0] text-[#DA291C] flex items-center justify-center" }, /* @__PURE__ */ React.createElement(Mail, { size: 13 })), " Email"))))), /* @__PURE__ */ React.createElement("div", { className: "max-w-7xl mx-auto mt-8 pt-6 border-t border-gray-200 text-center text-sm text-[#999] flex flex-col md:flex-row justify-between items-center gap-4" }, /* @__PURE__ */ React.createElement("p", null, footerInfo?.copyright || getSetting("footerCopyright") || "\xA9 2026 UEF Design Gallery. T\u1EA5t c\u1EA3 b\u1EA3n quy\u1EC1n \u0111\u01B0\u1EE3c b\u1EA3o h\u1ED9."), /* @__PURE__ */ React.createElement("p", null, footerInfo?.footerBrand || t("aboutFooterDev"), " ", /* @__PURE__ */ React.createElement(Heart, { size: 14, className: "inline text-[#DA291C] mx-1" })))));
}
function SaveToCollectionModal({
  open,
  artwork,
  collections,
  onClose,
  onSave,
  onCreateCollection
}) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [note, setNote] = useState("");
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  useEffect(() => {
    if (!open || !artwork) return;
    const pre = collections.filter((c) => c.items.some((it) => it.artworkId === artwork.id)).map((c) => c.id);
    const firstNote = collections.flatMap((c) => c.items.map((it) => ({ ...it, collectionId: c.id }))).find((it) => it.artworkId === artwork.id)?.note || "";
    setSelectedIds(pre);
    setNote(firstNote);
    setCreating(false);
    setNewName("");
  }, [open, artwork, collections]);
  if (!open || !artwork) return null;
  const toggle = (id) => {
    setSelectedIds((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };
  const submitCreate = () => {
    const name = newName.trim();
    if (!name) return;
    const id = onCreateCollection ? onCreateCollection(name) : null;
    if (id) setSelectedIds((prev) => [...prev, id]);
    setCreating(false);
    setNewName("");
  };
  return /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 z-[10000] bg-black/50 flex items-end sm:items-center justify-center p-3 sm:p-6" }, /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "px-5 sm:px-6 py-4 border-b border-[#E0E0E0] bg-[#F8F8F8] flex items-start justify-between gap-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "w-11 h-11 rounded-xl overflow-hidden border border-[#E0E0E0] bg-white flex-shrink-0" }, /* @__PURE__ */ React.createElement("img", { src: artwork.coverImageUrl || artwork.img, alt: artwork.title, className: "w-full h-full object-cover" })), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-[#666666] uppercase tracking-wider" }, t("saveToCollectionFlow")), /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold text-[#212121] truncate" }, artwork.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666] truncate" }, artwork.student || artwork.user?.fullName || ""))), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "w-9 h-9 rounded-lg border border-[#E0E0E0] bg-white hover:bg-[#F8F8F8] transition-colors flex items-center justify-center text-[#666666]",
      title: t("close")
    },
    /* @__PURE__ */ React.createElement(X, { size: 18 })
  )), /* @__PURE__ */ React.createElement("div", { className: "px-5 sm:px-6 py-5" }, /* @__PURE__ */ React.createElement("div", { className: "mb-4" }, /* @__PURE__ */ React.createElement("p", { className: "text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("selectCollection")), /* @__PURE__ */ React.createElement("div", { className: "max-h-44 overflow-auto pr-1 space-y-2" }, collections.map((c) => /* @__PURE__ */ React.createElement(
    "label",
    {
      key: c.id,
      className: "flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[#E0E0E0] hover:border-[#a8bce0] hover:bg-[#eef4ff] transition-colors cursor-pointer"
    },
    /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121] truncate" }, c.name), /* @__PURE__ */ React.createElement("p", { className: "text-[11px] text-[#666666]" }, c.items.length, " ", t("artworks"))),
    /* @__PURE__ */ React.createElement(
      "input",
      {
        type: "checkbox",
        checked: selectedIds.includes(c.id),
        onChange: () => toggle(c.id),
        className: "w-4 h-4 accent-[#1a4ba8]"
      }
    )
  ))), /* @__PURE__ */ React.createElement("div", { className: "mt-3" }, !creating ? /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => setCreating(true),
      className: "text-sm font-semibold text-[#1a4ba8] hover:opacity-80 transition-opacity inline-flex items-center gap-2"
    },
    /* @__PURE__ */ React.createElement(Plus, { size: 16 }),
    " ",
    t("createNewCollection")
  ) : /* @__PURE__ */ React.createElement("div", { className: "flex gap-2 mt-2" }, /* @__PURE__ */ React.createElement(
    "input",
    {
      value: newName,
      onChange: (e) => setNewName(e.target.value),
      onKeyDown: (e) => e.key === "Enter" && submitCreate(),
      placeholder: t("collectionNamePlaceholder"),
      className: "flex-1 px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]"
    }
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: submitCreate,
      className: "px-3 py-2 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors"
    },
    t("create")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => {
        setCreating(false);
        setNewName("");
      },
      className: "px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors"
    },
    t("cancel")
  )))), /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2" }, t("curatorNote")), /* @__PURE__ */ React.createElement(
    "textarea",
    {
      value: note,
      onChange: (e) => setNote(e.target.value),
      placeholder: t("curatorNotePlaceholder"),
      className: "w-full min-h-[110px] px-4 py-3 rounded-2xl border border-[#E0E0E0] text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] resize-y"
    }
  ))), /* @__PURE__ */ React.createElement("div", { className: "px-5 sm:px-6 py-4 border-t border-[#E0E0E0] bg-white flex items-center justify-end gap-2" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: onClose,
      className: "px-4 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors"
    },
    t("close")
  ), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: () => onSave && onSave({ artworkId: artwork.id, selectedCollectionIds: selectedIds, note }),
      className: "px-4 py-2.5 rounded-xl bg-[#1a4ba8] text-white text-sm font-bold hover:bg-[#0d2e6e] transition-colors"
    },
    t("saveChanges")
  ))));
}
function PortfolioSettingsPage({ setPage, userData }) {
  const [settings, setSettings] = useState({ portfolioSlug: "", profileHeadline: "", major: "", yearLevel: "N\u0103m 3", isPortfolioPublic: true, socialLinks: {}, featuredArtworkIds: [] });
  const [myArtworks, setMyArtworks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    Promise.all([
      api.portfolios.mine().catch(() => ({})),
      api.users.myArtworks().catch(() => [])
    ]).then(([data, arts]) => {
      const p = data.portfolioSettings || data;
      setSettings({
        portfolioSlug: p.portfolioSlug || "",
        profileHeadline: p.profileHeadline || "",
        major: p.major || "",
        yearLevel: p.yearLevel || "N\u0103m 3",
        isPortfolioPublic: p.isPortfolioPublic !== false,
        socialLinks: typeof p.socialLinks === "string" ? function() {
          try {
            return JSON.parse(p.socialLinks);
          } catch {
            return {};
          }
        }() : p.socialLinks || {},
        featuredArtworkIds: p.featuredArtworkIds || []
      });
      setMyArtworks(Array.isArray(arts) ? arts : arts.artworks || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);
  const toggleFeatured = (id) => {
    setSettings((prev) => {
      const ids = prev.featuredArtworkIds || [];
      if (ids.includes(id)) return { ...prev, featuredArtworkIds: ids.filter((x) => x !== id) };
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
        featuredArtworkIds: settings.featuredArtworkIds
      });
      setMessage({ type: "success", text: t("portfolioSettingsSaved") });
    } catch {
      setMessage({ type: "error", text: "L\u1ED7i k\u1EBFt n\u1ED1i" });
    } finally {
      setSaving(false);
    }
  };
  const [timelineEntries, setTimelineEntries] = useState([]);
  const [timelineForm, setTimelineForm] = useState({ month: "", year: "", title: "", description: "", tags: "", linkUrl: "", linkLabel: "", imageUrl: "" });
  const [showTimelineForm, setShowTimelineForm] = useState(false);
  const [editingTimelineId, setEditingTimelineId] = useState(null);
  const [savingTimeline, setSavingTimeline] = useState(false);
  useEffect(() => {
    api.timeline.list().then(setTimelineEntries).catch(() => {
    });
  }, [loaded]);
  const openAddTimeline = () => {
    setEditingTimelineId(null);
    setTimelineForm({ month: "", year: "", title: "", description: "", tags: "", linkUrl: "", linkLabel: "", imageUrl: "" });
    setShowTimelineForm(true);
  };
  const openEditTimeline = (entry) => {
    setEditingTimelineId(entry.id);
    setTimelineForm({
      month: entry.month || "",
      year: entry.year || "",
      title: entry.title || "",
      description: entry.description || "",
      tags: entry.tags ? entry.tags.join(", ") : "",
      linkUrl: entry.linkUrl || "",
      linkLabel: entry.linkLabel || "",
      imageUrl: entry.imageUrl || ""
    });
    setShowTimelineForm(true);
  };
  const saveTimelineEntry = async () => {
    if (!timelineForm.month || !timelineForm.year || !timelineForm.title) return;
    setSavingTimeline(true);
    try {
      const body = { ...timelineForm, tags: timelineForm.tags.split(",").map((t2) => t2.trim()).filter(Boolean) };
      if (editingTimelineId) {
        const updated = await api.timeline.update(editingTimelineId, body);
        setTimelineEntries((prev) => prev.map((e) => e.id === editingTimelineId ? updated : e));
      } else {
        const created = await api.timeline.create(body);
        setTimelineEntries((prev) => [...prev, created]);
      }
      setShowTimelineForm(false);
    } catch (e) {
      alert(t("errorGeneric") + e.message);
    } finally {
      setSavingTimeline(false);
    }
  };
  const deleteTimelineEntry = async (id) => {
    if (!confirm(t("confirmDeleteTimeline"))) return;
    try {
      await api.timeline.delete(id);
      setTimelineEntries((prev) => prev.filter((e) => e.id !== id));
    } catch (e) {
      alert(t("errorGeneric") + e.message);
    }
  };
  const monthOptions = ["Th\xE1ng 1", "Th\xE1ng 2", "Th\xE1ng 3", "Th\xE1ng 4", "Th\xE1ng 5", "Th\xE1ng 6", "Th\xE1ng 7", "Th\xE1ng 8", "Th\xE1ng 9", "Th\xE1ng 10", "Th\xE1ng 11", "Th\xE1ng 12"];
  const yearOptions = ["2023", "2024", "2025", "2026", "2027"];
  if (!loaded) return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen items-center justify-center text-[#666666]" }, t("loading"));
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(DashboardSidebar, { activePage: "portfolio_settings", setPage, userData }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-10" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121] mb-2" }, t("portfolioSettings")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-sm mb-8" }, t("portfolioSettingsDesc")), message.text && /* @__PURE__ */ React.createElement("div", { className: `mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}` }, message.text), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-4" }, t("basicInfo")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("portfolioSlug")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center" }, /* @__PURE__ */ React.createElement("span", { className: "px-4 py-2 bg-[#F8F8F8] border border-r-0 border-[#E0E0E0] rounded-l-lg text-[#666666] text-sm" }, "portfoliohub.uef.edu.vn/"), /* @__PURE__ */ React.createElement("input", { type: "text", value: settings.portfolioSlug, onChange: (e) => setSettings({ ...settings, portfolioSlug: e.target.value }), className: "flex-1 px-4 py-2 border border-[#E0E0E0] rounded-r-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("profileHeadline")), /* @__PURE__ */ React.createElement("input", { type: "text", value: settings.profileHeadline, onChange: (e) => setSettings({ ...settings, profileHeadline: e.target.value }), placeholder: "Graphic Designer & Visual Artist", className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("major")), /* @__PURE__ */ React.createElement("select", { value: settings.major || "", onChange: (e) => setSettings({ ...settings, major: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("selectMajor")), /* @__PURE__ */ React.createElement("option", { value: t("graphicDesign") }, "Thi\u1EBFt k\u1EBF \u0110\u1ED3 h\u1ECDa"), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF Truy\u1EC1n th\xF4ng" }, "Thi\u1EBFt k\u1EBF Truy\u1EC1n th\xF4ng"), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF K\u1EF9 thu\u1EADt s\u1ED1 & UI/UX" }, "Thi\u1EBFt k\u1EBF K\u1EF9 thu\u1EADt s\u1ED1 & UI/UX"), /* @__PURE__ */ React.createElement("option", { value: "Motion Graphics & Video" }, "Motion Graphics & Video"), /* @__PURE__ */ React.createElement("option", { value: "Minh h\u1ECDa & Ngh\u1EC7 thu\u1EADt 3D" }, "Minh h\u1ECDa & Ngh\u1EC7 thu\u1EADt 3D"), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF Bao b\xEC" }, "Thi\u1EBFt k\u1EBF Bao b\xEC"), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF Nh\u1EADn di\u1EC7n Th\u01B0\u01A1ng hi\u1EC7u" }, "Thi\u1EBFt k\u1EBF Nh\u1EADn di\u1EC7n Th\u01B0\u01A1ng hi\u1EC7u"), /* @__PURE__ */ React.createElement("option", { value: "Nhi\u1EBFp \u1EA3nh & X\u1EED l\xFD H\xECnh \u1EA3nh" }, "Nhi\u1EBFp \u1EA3nh & X\u1EED l\xFD H\xECnh \u1EA3nh"), /* @__PURE__ */ React.createElement("option", { value: "Thi\u1EBFt k\u1EBF Qu\u1EA3ng c\xE1o" }, "Thi\u1EBFt k\u1EBF Qu\u1EA3ng c\xE1o"))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("schoolYear")), /* @__PURE__ */ React.createElement("select", { value: settings.yearLevel, onChange: (e) => setSettings({ ...settings, yearLevel: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8] bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "N\u0103m 1" }, "N\u0103m 1"), /* @__PURE__ */ React.createElement("option", { value: "N\u0103m 2" }, "N\u0103m 2"), /* @__PURE__ */ React.createElement("option", { value: "N\u0103m 3" }, "N\u0103m 3"), /* @__PURE__ */ React.createElement("option", { value: "N\u0103m 4" }, "N\u0103m 4"), /* @__PURE__ */ React.createElement("option", { value: "T\u1ED1t nghi\u1EC7p" }, "T\u1ED1t nghi\u1EC7p"))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-4" }, t("socialMedia")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, "Behance"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Globe, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: settings.socialLinks.behance || "", onChange: (e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, behance: e.target.value } }), placeholder: "https://behance.net/", className: "w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, "LinkedIn"), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement(Link, { size: 16, className: "absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: settings.socialLinks.linkedin || "", onChange: (e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } }), placeholder: "https://linkedin.com/in/", className: "w-full pl-10 pr-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" }))))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-1" }, t("featuredArtworks")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-4" }, t("maxFourFeatured")), (settings.featuredArtworkIds || []).length > 0 && /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 mb-4 flex-wrap" }, myArtworks.filter((a) => (settings.featuredArtworkIds || []).includes(a.id)).map((a) => /* @__PURE__ */ React.createElement("div", { key: a.id, className: "relative w-24 h-20 rounded-lg overflow-hidden border border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("img", { src: a.coverImageUrl, alt: a.title, className: "w-full h-full object-cover" }), /* @__PURE__ */ React.createElement("button", { onClick: () => toggleFeatured(a.id), className: "absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-black/50 text-white text-xs flex items-center justify-center cursor-pointer" }, "\xD7")))), /* @__PURE__ */ React.createElement("button", { onClick: () => document.getElementById("featPicker")?.classList.remove("hidden"), className: "px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, settings.featuredArtworkIds?.length ? t("changeArtwork") : t("selectFeaturedArtwork"), " (", (settings.featuredArtworkIds || []).length, "/4)")), /* @__PURE__ */ React.createElement("div", { id: "featPicker", className: "hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", onClick: (e) => {
    if (e.target === e.currentTarget) e.currentTarget.classList.add("hidden");
  } }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#212121]" }, t("selectFeaturedArtworks")), /* @__PURE__ */ React.createElement("button", { onClick: () => document.getElementById("featPicker")?.classList.add("hidden"), className: "text-[#666666] hover:text-[#212121] cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-4" }, t("selectMaxFour"), " (", (settings.featuredArtworkIds || []).length, "/4)"), myArtworks.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-10 text-[#666666] text-sm" }, t("noPublicArtworks"), " ", /* @__PURE__ */ React.createElement("a", { href: "/#/upload", className: "text-[#1a4ba8] hover:underline font-semibold" }, t("uploadNewArtwork"))) : /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 sm:grid-cols-4 gap-3" }, myArtworks.slice(0, 20).map((a) => {
    const selected = (settings.featuredArtworkIds || []).includes(a.id);
    return /* @__PURE__ */ React.createElement("div", { key: a.id, onClick: () => toggleFeatured(a.id), className: `relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all aspect-[4/3] ${selected ? "border-[#1a4ba8] ring-2 ring-[#1a4ba8] ring-offset-1" : "border-[#E0E0E0] hover:border-[#999]"}` }, /* @__PURE__ */ React.createElement("img", { src: a.coverImageUrl, alt: a.title, className: "w-full h-full object-cover" }), selected && /* @__PURE__ */ React.createElement("div", { className: "absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[#1a4ba8] text-white flex items-center justify-center text-xs font-bold" }, /* @__PURE__ */ React.createElement(Check, { size: 14 })), /* @__PURE__ */ React.createElement("div", { className: "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2" }, /* @__PURE__ */ React.createElement("p", { className: "text-white text-xs font-semibold truncate" }, a.title)));
  })), /* @__PURE__ */ React.createElement("button", { onClick: () => document.getElementById("featPicker")?.classList.add("hidden"), className: "mt-4 w-full py-2.5 rounded-lg bg-[#1a4ba8] text-white font-semibold cursor-pointer" }, t("confirm")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121]" }, t("timelineAchievements")), /* @__PURE__ */ React.createElement("button", { onClick: openAddTimeline, className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a4ba8] text-white text-sm font-semibold hover:bg-opacity-90 transition-opacity cursor-pointer" }, /* @__PURE__ */ React.createElement(Plus, { size: 15 }), t("add"))), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-4" }, t("manageTimeline")), timelineEntries.length === 0 ? /* @__PURE__ */ React.createElement("div", { className: "text-center py-8 text-sm text-[#666666]" }, t("noTimelineEntries")) : /* @__PURE__ */ React.createElement("div", { className: "space-y-2" }, timelineEntries.map((entry) => /* @__PURE__ */ React.createElement("div", { key: entry.id, className: "flex items-center justify-between px-4 py-3 rounded-lg bg-[#F8F8F8] border border-[#E0E0E0]" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 min-w-0" }, /* @__PURE__ */ React.createElement("div", { className: "shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-200" }, entry.imageUrl ? /* @__PURE__ */ React.createElement("img", { src: entry.imageUrl, alt: "", className: "w-full h-full object-cover" }) : /* @__PURE__ */ React.createElement("div", { className: "w-full h-full flex items-center justify-center text-xs text-[#999]" }, /* @__PURE__ */ React.createElement(Clock, { size: 16 }))), /* @__PURE__ */ React.createElement("div", { className: "min-w-0" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-semibold text-[#212121] truncate" }, entry.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, entry.month, " ", entry.year))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-2 shrink-0" }, /* @__PURE__ */ React.createElement("button", { onClick: () => openEditTimeline(entry), className: "p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer text-[#666666] hover:text-[#212121]" }, /* @__PURE__ */ React.createElement(Edit2, { size: 15 })), /* @__PURE__ */ React.createElement("button", { onClick: () => deleteTimelineEntry(entry.id), className: "p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer text-[#666666] hover:text-red-600" }, /* @__PURE__ */ React.createElement(Trash2, { size: 15 }))))))), showTimelineForm && /* @__PURE__ */ React.createElement("div", { className: "fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4", onClick: (e) => {
    if (e.target === e.currentTarget) setShowTimelineForm(false);
  } }, /* @__PURE__ */ React.createElement("div", { className: "bg-white rounded-xl w-full max-w-lg max-h-[85vh] overflow-y-auto p-6" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-lg text-[#212121]" }, editingTimelineId ? t("editTimelineEntry") : t("addTimelineEntry")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowTimelineForm(false), className: "text-[#666666] hover:text-[#212121] cursor-pointer" }, /* @__PURE__ */ React.createElement(X, { size: 20 }))), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("month")), /* @__PURE__ */ React.createElement("select", { value: timelineForm.month, onChange: (e) => setTimelineForm({ ...timelineForm, month: e.target.value }), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("selectMonth")), monthOptions.map((m) => /* @__PURE__ */ React.createElement("option", { key: m, value: m }, m)))), /* @__PURE__ */ React.createElement("div", { className: "flex-1" }, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("year")), /* @__PURE__ */ React.createElement("select", { value: timelineForm.year, onChange: (e) => setTimelineForm({ ...timelineForm, year: e.target.value }), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] bg-white" }, /* @__PURE__ */ React.createElement("option", { value: "" }, t("selectYear")), yearOptions.map((y) => /* @__PURE__ */ React.createElement("option", { key: y, value: y }, y))))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("title")), /* @__PURE__ */ React.createElement("input", { type: "text", value: timelineForm.title, onChange: (e) => setTimelineForm({ ...timelineForm, title: e.target.value }), placeholder: t("timelineTitlePlaceholder"), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("description")), /* @__PURE__ */ React.createElement("textarea", { value: timelineForm.description, onChange: (e) => setTimelineForm({ ...timelineForm, description: e.target.value }), rows: 3, placeholder: t("timelineDescPlaceholder"), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] resize-none" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("tagsCommaSeparated")), /* @__PURE__ */ React.createElement("input", { type: "text", value: timelineForm.tags, onChange: (e) => setTimelineForm({ ...timelineForm, tags: e.target.value }), placeholder: t("tagsPlaceholder"), className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("linkPaperCert")), /* @__PURE__ */ React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ React.createElement("input", { type: "text", value: timelineForm.linkUrl, onChange: (e) => setTimelineForm({ ...timelineForm, linkUrl: e.target.value }), placeholder: "https://...", className: "flex-1 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("input", { type: "text", value: timelineForm.linkLabel, onChange: (e) => setTimelineForm({ ...timelineForm, linkLabel: e.target.value }), placeholder: t("linkLabelPlaceholder"), className: "w-1/3 px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-xs font-medium text-[#212121] mb-1.5" }, t("bgImageUrl")), /* @__PURE__ */ React.createElement("input", { type: "text", value: timelineForm.imageUrl, onChange: (e) => setTimelineForm({ ...timelineForm, imageUrl: e.target.value }), placeholder: "https://images.unsplash.com/...", className: "w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 mt-6" }, /* @__PURE__ */ React.createElement("button", { onClick: saveTimelineEntry, disabled: savingTimeline || !timelineForm.title || !timelineForm.month || !timelineForm.year, className: "flex-1 py-2.5 rounded-lg bg-[#1a4ba8] text-white text-sm font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50" }, savingTimeline ? t("savingDots") : editingTimelineId ? t("update") : t("addNew")), /* @__PURE__ */ React.createElement("button", { onClick: () => setShowTimelineForm(false), className: "px-6 py-2.5 rounded-lg border border-[#E0E0E0] text-sm font-medium text-[#212121] hover:bg-[#F8F8F8] transition-colors cursor-pointer" }, t("cancel"))))), timelineEntries.length > 0 && /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6 overflow-hidden" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-between mb-4" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121]" }, t("previewTimeline")), /* @__PURE__ */ React.createElement("a", { href: `${window.location.origin}/#/portfolio${settings.portfolioSlug ? "/" + settings.portfolioSlug : ""}`, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-[#1a4ba8] font-semibold hover:underline" }, t("viewOnPortfolio"), " \u2192")), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "relative overflow-hidden rounded-xl", style: { minHeight: 260, backgroundImage: `url(${timelineEntries[0]?.imageUrl || ""})`, backgroundSize: "cover", backgroundPosition: "center" } }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0", style: { background: "rgba(0,0,0,0.6)" } }), /* @__PURE__ */ React.createElement("div", { className: "relative z-10 p-5 flex items-center", style: { minHeight: 260 } }, /* @__PURE__ */ React.createElement("div", { className: "w-full", style: { background: BLACK, color: "#fff", padding: "20px 24px", borderRadius: 16, boxShadow: "0 8px 32px rgba(0,0,0,0.4)" } }, /* @__PURE__ */ React.createElement("div", { className: "mb-2" }, /* @__PURE__ */ React.createElement("span", { className: "inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold", style: { background: "#dbeafe", color: "#1e40af" } }, timelineEntries[0]?.month, " ", timelineEntries[0]?.year)), /* @__PURE__ */ React.createElement("h4", { className: "text-base font-bold mb-1.5" }, timelineEntries[0]?.title), /* @__PURE__ */ React.createElement("p", { className: "text-xs leading-relaxed", style: { color: "#9ca3af" } }, timelineEntries[0]?.description)))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-2 mt-3" }, timelineEntries.slice(0, 6).map((e, i) => /* @__PURE__ */ React.createElement("div", { key: e.id, className: `w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[#1a4ba8]" : "bg-[#E0E0E0]"}` })), timelineEntries.length > 6 && /* @__PURE__ */ React.createElement("span", { className: "text-[10px] text-[#666666]" }, "+", timelineEntries.length - 6)), /* @__PURE__ */ React.createElement("p", { className: "text-center text-[10px] text-[#999] mt-2 flex items-center justify-center gap-1" }, /* @__PURE__ */ React.createElement(Calendar, { size: 11 }), timelineEntries.length, " ", t("achievementMilestones")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8 flex items-center justify-between" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-1" }, t("portfolioStatus")), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666]" }, t("portfolioVisibilityDesc"))), /* @__PURE__ */ React.createElement("label", { className: "relative inline-flex items-center cursor-pointer" }, /* @__PURE__ */ React.createElement("input", { type: "checkbox", className: "sr-only peer", checked: settings.isPortfolioPublic, onChange: (e) => setSettings({ ...settings, isPortfolioPublic: e.target.checked }) }), /* @__PURE__ */ React.createElement("div", { className: "w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-4" }, /* @__PURE__ */ React.createElement("button", { onClick: save, disabled: saving, className: "px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50" }, saving ? t("saving") : t("saveSettings")), /* @__PURE__ */ React.createElement("a", { href: `${window.location.origin}/#/portfolio${settings.portfolioSlug ? "/" + settings.portfolioSlug : ""}`, target: "_blank", rel: "noopener noreferrer", className: "px-6 py-2 border border-[#1a4ba8] text-[#1a4ba8] rounded-lg font-bold hover:bg-[#eef4ff] transition-colors" }, /* @__PURE__ */ React.createElement(ExternalLink, { size: 16, className: "inline mr-1.5" }), t("viewPortfolio"))))));
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
    fetch("/api/users/me").then((r) => r.json()).then((data) => {
      if (data && data.id) {
        setProfile({
          fullName: data.fullName || "",
          studentId: data.studentId || "",
          email: data.email || "",
          avatarUrl: data.avatarUrl || ""
        });
      }
    }).catch(() => {
    }).finally(() => setLoaded(true));
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
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: t("profileUpdated") });
        setPendingAvatar(null);
        setProfile((p) => ({ ...p, avatarUrl: data.user?.avatarUrl || p.avatarUrl }));
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
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass })
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
    return /* @__PURE__ */ React.createElement("div", { className: "flex h-screen items-center justify-center text-[#666666]" }, t("loadingInfo"));
  }
  return /* @__PURE__ */ React.createElement("div", { className: "flex min-h-screen bg-[#F8F8F8]" }, /* @__PURE__ */ React.createElement(DashboardSidebar, { activePage: "settings", setPage, userData }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto p-10" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-3xl mx-auto" }, /* @__PURE__ */ React.createElement("h2", { className: "text-2xl font-bold text-[#212121] mb-2" }, t("accountSettings")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-sm mb-8" }, "Qu\u1EA3n l\xFD th\xF4ng tin c\xE1 nh\xE2n v\xE0 b\u1EA3o m\u1EADt t\xE0i kho\u1EA3n."), message.text && /* @__PURE__ */ React.createElement("div", { className: `mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}` }, message.text), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-4" }, t("avatar")), /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-6" }, /* @__PURE__ */ React.createElement("img", { src: pendingAvatar || profile.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80", className: "w-20 h-20 rounded-full object-cover border-2 border-[#E0E0E0]" }), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("div", { className: "flex gap-3 mb-2" }, /* @__PURE__ */ React.createElement("input", { type: "file", id: "avatarInput", accept: "image/*", style: { display: "none" }, onChange: (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result;
      if (typeof dataUrl === "string") setPendingAvatar(dataUrl);
    };
    reader.readAsDataURL(file);
  } }), /* @__PURE__ */ React.createElement("button", { onClick: () => document.getElementById("avatarInput")?.click(), className: "px-4 py-2 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-medium text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer" }, "T\u1EA3i \u1EA3nh m\u1EDBi"), /* @__PURE__ */ React.createElement("button", { onClick: () => setPendingAvatar(""), className: "px-4 py-2 bg-white border border-[#8B1A1A] text-[#8B1A1A] rounded-lg text-sm font-medium hover:bg-[#8B1A1A] hover:text-white transition-colors cursor-pointer" }, "X\xF3a \u1EA3nh")), /* @__PURE__ */ React.createElement("p", { className: "text-xs text-[#666666]" }, "\u0110\u1ECBnh d\u1EA1ng JPG, PNG ho\u1EB7c GIF. T\u1ED1i \u0111a 5MB.")))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-4" }, t("personalInfo")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", { className: userData?.role !== "lecturer" && userData?.role !== "admin" ? "grid grid-cols-2 gap-4" : "grid grid-cols-1 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("fullNameLabel")), /* @__PURE__ */ React.createElement("input", { type: "text", value: profile.fullName, onChange: (e) => setProfile({ ...profile, fullName: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" })), userData?.role !== "lecturer" && userData?.role !== "admin" && /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("studentId")), /* @__PURE__ */ React.createElement("input", { type: "text", value: profile.studentId, disabled: true, className: "w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" }))), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("emailAddress")), /* @__PURE__ */ React.createElement("input", { type: "email", value: profile.email, disabled: true, className: "w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" })))), /* @__PURE__ */ React.createElement("div", { className: "bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8" }, /* @__PURE__ */ React.createElement("h3", { className: "font-bold text-[#212121] mb-4" }, t("changePassword")), /* @__PURE__ */ React.createElement("div", { className: "space-y-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("currentPassword")), /* @__PURE__ */ React.createElement("input", { type: "password", value: passwords.current, onChange: (e) => setPasswords({ ...passwords, current: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-2 gap-4" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("newPassword")), /* @__PURE__ */ React.createElement("input", { type: "password", value: passwords.newPass, onChange: (e) => setPasswords({ ...passwords, newPass: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("label", { className: "block text-sm font-medium text-[#212121] mb-2" }, t("resetConfirmNewPassword")), /* @__PURE__ */ React.createElement("input", { type: "password", value: passwords.confirm, onChange: (e) => setPasswords({ ...passwords, confirm: e.target.value }), className: "w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#1a4ba8] focus:ring-1 focus:ring-[#1a4ba8]" }))), /* @__PURE__ */ React.createElement("button", { onClick: changePassword, disabled: changingPass, className: "px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50" }, changingPass ? "\u0110ang x\u1EED l\xFD..." : t("changePassword")))), /* @__PURE__ */ React.createElement("div", { className: "flex gap-3" }, /* @__PURE__ */ React.createElement("button", { onClick: saveProfile, disabled: saving, className: "px-6 py-2 bg-[#1a4ba8] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50" }, saving ? t("saving") : t("saveChanges"))))));
}
function PortalPage({ setPage }) {
  return /* @__PURE__ */ React.createElement("div", { className: "min-h-screen bg-[#F8F8F8] p-10 flex flex-col items-center" }, /* @__PURE__ */ React.createElement("div", { className: "max-w-6xl w-full mt-10" }, /* @__PURE__ */ React.createElement("h1", { className: "text-4xl font-bold text-[#212121] text-center mb-16 tracking-tight" }, "H\u1EC7 th\u1ED1ng Prototype Portfolio UEF"), /* @__PURE__ */ React.createElement("div", { className: "grid grid-cols-3 gap-8" }, /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-[#212121] mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(Globe, { size: 20, className: "text-[#1a4ba8]" }), " Public Views"), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("landing"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Globe, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Ch\u1EE7 (Landing Page)")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Trang \u0111\xF3n kh\xE1ch gi\u1EDBi thi\u1EC7u n\u1EC1n t\u1EA3ng")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("auth"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Lock, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang \u0110\u0103ng nh\u1EADp")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "M\xE0n h\xECnh \u0111\u0103ng nh\u1EADp sinh vi\xEAn / gi\u1EA3ng vi\xEAn")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("gallery"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Gallery T\u1ED5ng h\u1EE3p")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Hi\u1EC3n th\u1ECB to\xE0n b\u1ED9 t\xE1c ph\u1EA9m tr\xEAn h\u1EC7 th\u1ED1ng")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("about"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Globe, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Gi\u1EDBi thi\u1EC7u (About)")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Trang th\xF4ng tin v\u1EC1 Khoa v\xE0 gi\u1EA3ng vi\xEAn")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("portfolio"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(User, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Portfolio C\xE1 nh\xE2n")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "H\u1ED3 s\u01A1 c\xE1 nh\xE2n v\xE0 c\xE1c t\xE1c ph\u1EA9m c\u1EE7a sinh vi\xEAn")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("detail"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Image, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Chi ti\u1EBFt \u1EA4n ph\u1EA9m")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Xem chi ti\u1EBFt, b\xECnh lu\u1EADn v\xE0 th\u1EA3 tim t\xE1c ph\u1EA9m")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("about"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Briefcase, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Trang Gi\u1EDBi thi\u1EC7u Khoa")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Th\xF4ng tin \u0111\u1ED9i ng\u0169 gi\u1EA3ng vi\xEAn v\xE0 li\xEAn h\u1EC7"))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-[#212121] mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(PenTool, { size: 20, className: "text-[#1a4ba8]" }), " Student Dashboard"), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("dashboard"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Folder, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, t("studentDashboard"))), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Qu\u1EA3n l\xFD c\xE1c \u1EA5n ph\u1EA9m \u0111\xE3 t\u1EA3i l\xEAn c\u1EE7a sinh vi\xEAn")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("upload"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Plus, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Form Upload T\xE1c ph\u1EA9m")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Giao di\u1EC7n \u0111\u0103ng t\u1EA3i t\xE1c ph\u1EA9m m\u1EDBi")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("edit_artwork"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Edit2, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Form Ch\u1EC9nh s\u1EEDa \u1EA4n ph\u1EA9m")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Giao di\u1EC7n c\u1EADp nh\u1EADt th\xF4ng tin t\xE1c ph\u1EA9m")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("settings"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Settings, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, t("accountSettings"))), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "T\xF9y ch\u1EC9nh th\xF4ng tin c\xE1 nh\xE2n v\xE0 b\u1EA3o m\u1EADt")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("portfolio_settings"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Briefcase, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, t("portfolioSettings"))), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Tr\u1EA1ng th\xE1i c\xF4ng khai v\xE0 link m\u1EA1ng x\xE3 h\u1ED9i")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("messages"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(MessageSquare, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, t("inboxTitle"))), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Qu\u1EA3n l\xFD tin nh\u1EAFn li\xEAn h\u1EC7 t\u1EEB nh\xE0 tuy\u1EC3n d\u1EE5ng"))), /* @__PURE__ */ React.createElement("div", { className: "flex flex-col gap-4" }, /* @__PURE__ */ React.createElement("h2", { className: "text-lg font-bold text-[#212121] mb-2 flex items-center gap-2" }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 20, className: "text-[#8B1A1A]" }), " Admin & Lecturer"), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("admin"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(LayoutDashboard, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Admin Dashboard")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "M\xE0n h\xECnh t\u1ED5ng quan c\u1EE7a h\u1EC7 th\u1ED1ng qu\u1EA3n tr\u1ECB")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("admin_users"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Users, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Qu\u1EA3n l\xFD T\xE0i kho\u1EA3n (Users)")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Ph\xE2n quy\u1EC1n, kh\xF3a/m\u1EDF kh\xF3a t\xE0i kho\u1EA3n sinh vi\xEAn")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("admin_artworks"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Trash2, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Qu\u1EA3n l\xFD & C\u1EA3nh c\xE1o \u1EA4n ph\u1EA9m")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Ki\u1EC3m duy\u1EC7t post-moderation v\xE0 x\u1EED l\xFD vi ph\u1EA1m")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("admin_export"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(FileDown, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Qu\u1EA3n l\xFD Moodboard & Xu\u1EA5t PDF")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "Giao di\u1EC7n k\xE9o th\u1EA3 s\u1EAFp x\u1EBFp \u1EA5n ph\u1EA9m \u0111\u1EC3 xu\u1EA5t t\u1EADp san")), /* @__PURE__ */ React.createElement("div", { onClick: () => setPage("admin_layout"), className: "bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#1a4ba8] transition-all cursor-pointer" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center gap-3 mb-2" }, /* @__PURE__ */ React.createElement(Settings, { size: 20, className: "text-[#1a4ba8]" }), /* @__PURE__ */ React.createElement("h3", { className: "text-[#212121] font-medium text-base" }, "Layout Settings")), /* @__PURE__ */ React.createElement("p", { className: "text-[#666666] text-xs" }, "T\xF9y ch\u1EC9nh n\u1ED9i dung trang ch\u1EE7, gi\u1EDBi thi\u1EC7u & footer"))))));
}
function AccessDenied({ setPage }) {
  return /* @__PURE__ */ React.createElement("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: 16, padding: 40 } }, /* @__PURE__ */ React.createElement(ShieldAlert, { size: 64, color: CRIMSON, strokeWidth: 1.2 }), /* @__PURE__ */ React.createElement("h2", { style: { fontSize: 24, fontWeight: 700, color: BLACK, margin: 0 } }, t("accessDenied")), /* @__PURE__ */ React.createElement("p", { style: { fontSize: 14, color: MUTED, textAlign: "center", maxWidth: 400, lineHeight: 1.6 } }, "B\u1EA1n kh\xF4ng c\xF3 quy\u1EC1n truy c\u1EADp trang n\xE0y. Vui l\xF2ng \u0111\u0103ng nh\u1EADp v\u1EDBi t\xE0i kho\u1EA3n c\xF3 quy\u1EC1n ph\xF9 h\u1EE3p."), /* @__PURE__ */ React.createElement("div", { style: { display: "flex", gap: 12, marginTop: 8 } }, /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("home"), style: { padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("backToHome")), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage("auth"), style: { padding: "10px 24px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: BLACK, fontSize: 14, fontWeight: 600, cursor: "pointer" } }, t("login"))));
}
function TimelineSection({ entries: propEntries, slug, isOwner, setPage }) {
  const [fetchedEntries, setFetchedEntries] = useState(null);
  const [fetchDone, setFetchDone] = useState(false);
  const monthColors = { "Th\xE1ng 1": ["#dbeafe", "#1e40af"], "Th\xE1ng 2": ["#fef3c7", "#92400e"], "Th\xE1ng 3": ["#dcfce7", "#166534"], "Th\xE1ng 4": ["#fce7f3", "#9d174d"], "Th\xE1ng 5": ["#ccfbf1", "#0f766e"], "Th\xE1ng 6": ["#f3e8ff", "#6b21a8"], "Th\xE1ng 7": ["#e0f2fe", "#0369a1"], "Th\xE1ng 8": ["#fef9c3", "#a16207"], "Th\xE1ng 9": ["#dbeafe", "#1e40af"], "Th\xE1ng 10": ["#ffedd5", "#9a3412"], "Th\xE1ng 11": ["#fce7f3", "#9d174d"], "Th\xE1ng 12": ["#e0e7ff", "#4338ca"] };
  useEffect(() => {
    if (propEntries) {
      setFetchedEntries(propEntries);
      setFetchDone(true);
      return;
    }
    const fetchFn = isOwner ? api.timeline.list() : slug ? api.portfolios.timeline(slug) : api.timeline.list();
    fetchFn.then((data) => {
      if (data.error) throw new Error(data.error);
      setFetchedEntries(Array.isArray(data) ? data : []);
      setFetchDone(true);
    }).catch(() => {
      setFetchedEntries([]);
      setFetchDone(true);
    });
  }, [slug, propEntries]);
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
  const timelineData = rawEntries.map((e) => ({
    id: e.id,
    year: e.year || "",
    monthLabel: e.month ? "T" + e.month.replace("Th\xE1ng ", "") : "",
    month: e.month || "",
    title: e.title || "",
    description: e.description || "",
    tags: e.tags || [],
    link: e.linkUrl || "#",
    linkLabel: e.linkLabel || "Xem chi ti\u1EBFt \u2192",
    img: e.imageUrl || "",
    monthColor: monthColors[e.month] ? monthColors[e.month][0] : "#dbeafe",
    monthText: monthColors[e.month] ? monthColors[e.month][1] : "#1e40af"
  }));
  function goTo(newIdx) {
    if (isTransitioning.current || newIdx === activeIndex) return;
    if (newIdx < 0 || newIdx >= timelineData.length) return;
    isTransitioning.current = true;
    setActiveIndex(newIdx);
    setTimeout(() => {
      isTransitioning.current = false;
    }, 520);
  }
  function goNext() {
    goTo(Math.min(activeIndex + 1, timelineData.length - 1));
  }
  function goPrev() {
    goTo(Math.max(activeIndex - 1, 0));
  }
  function centerActiveDot() {
    requestAnimationFrame(() => {
      const strip = stripRef.current;
      const dots = strip?.querySelectorAll("[data-dot-idx]");
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
      const dots = strip.querySelectorAll("[data-dot-idx]");
      const containerRect = strip.getBoundingClientRect();
      const center = (containerRect.left + containerRect.right) / 2;
      let nearestIdx = activeIndex;
      let minDist = Infinity;
      dots.forEach((dot) => {
        const rect = dot.getBoundingClientRect();
        const dotCenter = (rect.left + rect.right) / 2;
        const dist = Math.abs(dotCenter - center);
        if (dist < minDist) {
          minDist = dist;
          nearestIdx = parseInt(dot.dataset.dotIdx);
        }
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
    strip.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    strip.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    strip.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      strip.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      strip.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
      strip.removeEventListener("scroll", onScroll);
    };
  }, [activeIndex]);
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex]);
  function getCardClass(i) {
    if (i === activeIndex) return { transform: "scale(1) translateY(0)", opacity: 1, pointerEvents: "auto", zIndex: 10 };
    if (i < activeIndex) return { transform: "scale(0.3) translateY(20px)", opacity: 0, pointerEvents: "none", zIndex: 1 };
    return { transform: "scale(0.3) translateY(-20px)", opacity: 0, pointerEvents: "none", zIndex: 1 };
  }
  if (!fetchDone) return null;
  if (timelineData.length === 0) {
    if (isOwner) {
      return /* @__PURE__ */ React.createElement("div", { className: "w-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm min-h-[300px]" }, /* @__PURE__ */ React.createElement("div", { className: "w-16 h-16 bg-[#E8EFFF] rounded-full flex items-center justify-center mb-4" }, /* @__PURE__ */ React.createElement(Plus, { size: 24, className: "text-[#1a4ba8]" })), /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#212121] mb-2" }, "Ch\u01B0a c\xF3 Timeline n\xE0o"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666] mb-6" }, "B\u1EA1n ch\u01B0a th\xEAm b\u1EA5t k\u1EF3 c\u1ED9t m\u1ED1c n\xE0o. H\xE3y th\xEAm \u0111\u1EC3 l\xE0m n\u1ED5i b\u1EADt h\u1ED3 s\u01A1 c\u1EE7a b\u1EA1n."), /* @__PURE__ */ React.createElement("button", { onClick: () => setPage && setPage("portfolio_settings"), className: "px-6 py-2.5 bg-[#1a4ba8] text-white rounded-full text-[15px] font-semibold hover:bg-[#153e8a] transition-colors cursor-pointer" }, "Th\xEAm Timeline"));
    } else {
      return /* @__PURE__ */ React.createElement("div", { className: "w-full flex flex-col items-center justify-center p-12 bg-white border border-[#E0E0E0] rounded-xl shadow-sm min-h-[300px]" }, /* @__PURE__ */ React.createElement("h3", { className: "text-lg font-bold text-[#212121] mb-2" }, "Ch\u01B0a c\xF3 Timeline n\xE0o"), /* @__PURE__ */ React.createElement("p", { className: "text-sm text-[#666666]" }, "Ng\u01B0\u1EDDi d\xF9ng n\xE0y ch\u01B0a thi\u1EBFt l\u1EADp timeline chia s\u1EBB h\xE0nh tr\xECnh h\u1ECDc t\u1EADp."));
    }
  }
  return /* @__PURE__ */ React.createElement("section", { className: "pt-4 pb-6 w-full" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-end justify-between gap-6 mb-6" }, /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("h2", { className: "text-xl sm:text-2xl font-extrabold text-[#212121] tracking-tight" }, t("achievementJourney")))), /* @__PURE__ */ React.createElement("div", { className: "relative" }, /* @__PURE__ */ React.createElement("div", { className: "relative flex flex-col md:flex-row mb-6 overflow-hidden bg-white", style: { borderRadius: 4, border: `1px solid ${GRAY_LIGHT}`, minHeight: 340 } }, /* @__PURE__ */ React.createElement("div", { ref: cardsRef, className: "relative w-full md:w-1/2 z-10 flex items-center justify-center", style: { minHeight: 340 } }, timelineData.map((item, i) => {
    const cardStyle = getCardClass(i);
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        key: item.id,
        className: "absolute inset-0 flex items-center justify-center p-8",
        style: { transition: "transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)", ...cardStyle }
      },
      /* @__PURE__ */ React.createElement("div", { className: "w-full max-w-[420px]" }, /* @__PURE__ */ React.createElement("div", { className: "mb-5" }, /* @__PURE__ */ React.createElement(
        "span",
        {
          className: "inline-block px-3 py-1 rounded-full text-xs font-semibold",
          style: { background: item.monthColor, color: item.monthText }
        },
        item.month,
        " ",
        item.year
      )), /* @__PURE__ */ React.createElement("h3", { className: "text-xl md:text-3xl font-bold mb-3 leading-snug", style: { color: BLACK } }, item.title), /* @__PURE__ */ React.createElement("p", { className: "text-sm leading-relaxed mb-5", style: { color: MUTED } }, item.description), /* @__PURE__ */ React.createElement("div", { className: "flex flex-wrap gap-2 mb-5" }, item.tags.map((t2) => /* @__PURE__ */ React.createElement("span", { key: t2, className: "text-xs font-medium px-2.5 py-1 rounded-full", style: { background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, color: "#4b5563" } }, t2))), /* @__PURE__ */ React.createElement(
        "a",
        {
          href: item.link,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-flex items-center gap-1.5 text-sm font-semibold transition-colors",
          style: { color: CERULEAN },
          onMouseEnter: (e) => e.currentTarget.style.color = "#065d75",
          onMouseLeave: (e) => e.currentTarget.style.color = CERULEAN
        },
        item.linkLabel,
        /* @__PURE__ */ React.createElement("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" }), /* @__PURE__ */ React.createElement("polyline", { points: "15 3 21 3 21 9" }), /* @__PURE__ */ React.createElement("line", { x1: "10", y1: "14", x2: "21", y2: "3" }))
      ))
    );
  })), /* @__PURE__ */ React.createElement("div", { className: "w-full md:w-1/2 relative min-h-[300px] md:min-h-full" }, /* @__PURE__ */ React.createElement("div", { className: "absolute inset-0", style: { backgroundImage: `url(${timelineData[activeIndex].img})`, backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.5s cubic-bezier(0.4,0,0.2,1)" } }))), /* @__PURE__ */ React.createElement("div", { className: "flex justify-center items-center gap-4 mb-6" }, /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: goPrev,
      className: "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer",
      style: { background: "#fff", border: `1px solid ${GRAY_LIGHT}`, color: MUTED },
      onMouseEnter: (e) => e.currentTarget.style.background = GRAY_BG,
      onMouseLeave: (e) => e.currentTarget.style.background = "#fff"
    },
    /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "15 18 9 12 15 6" }))
  ), /* @__PURE__ */ React.createElement("span", { className: "text-sm", style: { color: MUTED } }, /* @__PURE__ */ React.createElement("span", { className: "font-semibold", style: { color: BLACK } }, activeIndex + 1), /* @__PURE__ */ React.createElement("span", { className: "mx-1" }, "/"), /* @__PURE__ */ React.createElement("span", null, timelineData.length)), /* @__PURE__ */ React.createElement(
    "button",
    {
      onClick: goNext,
      className: "w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer",
      style: { background: CERULEAN, border: "none", color: "#fff", boxShadow: "0 4px 12px rgba(26,75,168,0.3)" },
      onMouseEnter: (e) => e.currentTarget.style.background = "#065d75",
      onMouseLeave: (e) => e.currentTarget.style.background = CERULEAN
    },
    /* @__PURE__ */ React.createElement("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "9 18 15 12 9 6" }))
  )), /* @__PURE__ */ React.createElement("div", { className: "relative px-4" }, /* @__PURE__ */ React.createElement("div", { className: "absolute h-[2px] left-0 right-0 top-1/2 -translate-y-1/2 z-0", style: { background: GRAY_LIGHT } }), /* @__PURE__ */ React.createElement("div", { ref: stripRef, className: "overflow-x-auto no-scrollbar cursor-grab active:cursor-grabbing relative z-10" }, /* @__PURE__ */ React.createElement("div", { className: "flex items-center justify-center gap-16 md:gap-24 py-3 px-8 min-w-max" }, timelineData.map((item, i) => /* @__PURE__ */ React.createElement(
    "div",
    {
      key: item.id,
      "data-dot-idx": i,
      className: "shrink-0 flex flex-col items-center gap-2 cursor-pointer select-none",
      onClick: () => {
        if (!isTransitioning.current && i !== activeIndex) goTo(i);
      }
    },
    /* @__PURE__ */ React.createElement("span", { className: "text-xs font-medium transition-colors", style: { color: i === activeIndex ? CERULEAN : MUTED, fontWeight: i === activeIndex ? 700 : 500 } }, item.monthLabel),
    /* @__PURE__ */ React.createElement("div", { className: "w-3 h-3 rounded-full transition-all duration-[400ms]", style: {
      background: i === activeIndex ? CERULEAN : GRAY_LIGHT,
      transform: i === activeIndex ? "scale(1.6)" : "scale(1)",
      boxShadow: i === activeIndex ? `0 0 0 4px rgba(26,75,168,0.2)` : "none"
    } }),
    /* @__PURE__ */ React.createElement("span", { className: "text-xs transition-colors", style: { color: i === activeIndex ? CERULEAN : "#999", fontWeight: i === activeIndex ? 700 : 400 } }, item.year)
  ))))), /* @__PURE__ */ React.createElement("p", { className: "text-center text-xs mt-4 flex items-center justify-center gap-1.5", style: { color: "#aaa" } }, /* @__PURE__ */ React.createElement("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ React.createElement("polyline", { points: "15 18 9 12 15 6" })), "K\xE9o timeline ho\u1EB7c d\xF9ng n\xFAt \u0111\u1EC3 xem chi ti\u1EBFt")), /* @__PURE__ */ React.createElement("style", null, `
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `));
}
export default function App() {
  useAccountBadgesGlobal();
  const { user: authUser, loading, logout, refreshSession } = useAuth();
  const getHashState = useCallback(() => {
    const hash = window.location.hash.replace(/^#\/?/, "");
    if (!hash) return { page: "gallery", id: null };
    const parts = hash.split("/");
    return { page: parts[0] || "gallery", id: parts.length > 1 ? parts.slice(1).join("/") : null };
  }, []);
  const [page, setPageState] = useState(() => getHashState().page);
  const [activeArtworkId, setActiveArtworkIdState] = useState(() => {
    const h = getHashState();
    return h.page === "detail" && h.id ? h.id : artworks[2]?.id ?? 1;
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
    portfolioSettings: authUser.portfolioSettings || null
  } : null;
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has("code") || urlParams.has("state") || window.location.pathname.includes("callback") || window.location.hash.includes("access_token");
    if (hasOAuthParams) {
      console.log("\u{1F504} OAuth callback detected in App, forcing refresh...");
      const retryRefresh = () => {
        refreshSession();
        setTimeout(() => refreshSession(), 1e3);
        setTimeout(() => refreshSession(), 2e3);
        setTimeout(() => refreshSession(), 3e3);
      };
      retryRefresh();
      setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 3500);
    }
  }, [refreshSession]);
  const [collections, setCollections] = useState([]);
  const [collectionsLoading, setCollectionsLoading] = useState(true);
  const [activeCollectionId, setActiveCollectionId] = useState(null);
  const [catalogCollection, setCatalogCollection] = useState(null);
  const [journalCollection, setJournalCollection] = useState(null);
  const [showJournalSettings, setShowJournalSettings] = useState(false);
  const [showJournalBuilder, setShowJournalBuilder] = useState(false);
  const [journalOrientation, setJournalOrientation] = useState("portrait");
  const [journalDraft, setJournalDraft] = useState(null);
  const handleOpenJournalFlow = (c) => {
    setJournalCollection(c);
    let draft = null;
    try {
      if (c.curatorEssay && c.curatorEssay.startsWith("{")) {
        draft = JSON.parse(c.curatorEssay);
      }
    } catch (e) {
    }
    if (!draft) {
      const savedDrafts = JSON.parse(localStorage.getItem("uef_journal_drafts") || "{}");
      draft = savedDrafts[c.id];
    }
    if (draft) {
      if (window.confirm("B\u1EA1n c\xF3 m\u1ED9t b\u1EA3n nh\xE1p thi\u1EBFt k\u1EBF t\u1EADp san ch\u01B0a ho\xE0n th\xE0nh cho Moodboard n\xE0y. B\u1EA1n c\xF3 mu\u1ED1n ti\u1EBFp t\u1EE5c ch\u1EC9nh s\u1EEDa b\u1EA3n nh\xE1p \u0111\xF3 kh\xF4ng?\n\nCh\u1ECDn OK \u0111\u1EC3 ti\u1EBFp t\u1EE5c.\nCh\u1ECDn Cancel \u0111\u1EC3 b\u1EAFt \u0111\u1EA7u thi\u1EBFt k\u1EBF m\u1EDBi.")) {
        setJournalOrientation(draft.orientation || "portrait");
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
    api.collections.update(journalCollection.id, { curatorEssay: JSON.stringify(draftData) }).catch((err) => {
      console.error("L\u1ED7i khi l\u01B0u nh\xE1p l\xEAn DB:", err);
    });
    const savedDrafts = JSON.parse(localStorage.getItem("uef_journal_drafts") || "{}");
    savedDrafts[journalCollection.id] = draftData;
    localStorage.setItem("uef_journal_drafts", JSON.stringify(savedDrafts));
  };
  useEffect(() => {
    api.collections.list().then((data) => {
      let result = Array.isArray(data) ? data : [];
      setCollections(result);
      setCollectionsLoading(false);
    }).catch(() => {
      setCollectionsLoading(false);
    });
  }, []);
  const [saveModal, setSaveModal] = useState({ open: false, artwork: null });
  const [optimisticSavedIds, setOptimisticSavedIds] = useState([]);
  const [toast, setToast] = useState(null);
  useEffect(() => {
    if (!toast) return;
    const t2 = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t2);
  }, [toast]);
  const isSavedReal = (artworkId) => collections.some((c) => c.items.some((it) => it.artworkId === artworkId));
  const isBookmarked = (artworkId) => optimisticSavedIds.includes(artworkId) || isSavedReal(artworkId);
  const openSaveFlow = (art) => {
    if (!art) return;
    setOptimisticSavedIds((prev) => prev.includes(art.id) ? prev : [...prev, art.id]);
    setSaveModal({ open: true, artwork: art });
    if (String(art.id).startsWith("mock-")) {
      const mockArt = window.MOCK_PROJECTS?.find((p) => p.id === art.id);
      if (mockArt) {
        setSaveModal((prev) => prev.artwork?.id === art.id ? { ...prev, artwork: { ...prev.artwork, ...mockArt } } : prev);
      }
    } else {
      api.artworks.get(art.id).then((fullArt) => {
        setSaveModal((prev) => prev.artwork?.id === art.id ? { ...prev, artwork: fullArt } : prev);
      }).catch(() => {
        const mockArt = artworks.find((a) => String(a.id) === String(art.id));
        if (mockArt) {
          setSaveModal((prev) => prev.artwork?.id === art.id ? { ...prev, artwork: { ...prev.artwork, ...mockArt } } : prev);
        }
      });
    }
    setToast({
      title: "\u0110\xE3 l\u01B0u t\u1EA1m",
      message: "Ch\u1ECDn Moodboard v\xE0 th\xEAm ghi ch\xFA gi\xE1m tuy\u1EC3n \u0111\u1EC3 l\u01B0u ch\xEDnh th\u1EE9c."
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
    api.collections.create({ collectionName: name }).catch(() => {
    });
    return name;
  };
  const saveToCollections = async ({ artworkId, selectedCollectionIds, note }) => {
    const prevCollections = [...collections];
    const savedArtworkObj = saveModal.artwork;
    setCollections(
      (prev) => prev.map((c) => {
        const has = c.items.some((it) => it.artworkId === artworkId);
        const shouldHave = selectedCollectionIds.includes(c.id);
        if (shouldHave) {
          const nextItems = has ? c.items.map((it) => it.artworkId === artworkId ? { ...it, note } : it) : [...c.items, { artworkId, note, artwork: savedArtworkObj }];
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
          ops.push(api.collections.addItem(c.id, { artworkId, note: note || void 0 }));
        } else if (shouldHave && has && note !== void 0) {
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
    setCollections(
      (prev) => prev.map((c) => c.id === activeCollectionId ? { ...c, ...patch } : c)
    );
    if (patch.name || patch.curatorEssay !== void 0 || patch.theme) {
      api.collections.update(activeCollectionId, patch).catch(() => {
      });
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
  return /* @__PURE__ */ React.createElement("div", { className: "font-sans min-h-screen bg-[#F8F8F8] text-[#212121]" }, page !== "auth" && page !== "register" && page !== "portal" && page !== "forgot_password" && page !== "reset_password" && page !== "verify_email" && /* @__PURE__ */ React.createElement(AppHeader, { activePage: page, setPage, isLoggedIn, userRole, onLogout: handleLogout, userData }), page === "portal" && /* @__PURE__ */ React.createElement(PortalPage, { setPage }), page === "home" && /* @__PURE__ */ React.createElement(LandingPage, { setPage, isLoggedIn, setActiveArtworkId }), page === "landing" && /* @__PURE__ */ React.createElement(LandingPage, { setPage, isLoggedIn, setActiveArtworkId }), page === "gallery" && /* @__PURE__ */ React.createElement(
    GalleryPage,
    {
      setPage,
      setActiveArtworkId,
      onBookmarkClick: openSaveFlow,
      isBookmarked
    }
  ), page === "portfolio" && /* @__PURE__ */ React.createElement(PortfolioPage, { setPage, pageParams, onBookmarkClick: openSaveFlow, isBookmarked }), page === "dashboard" && (userRole === "student" || userRole === "guest" ? /* @__PURE__ */ React.createElement(DashboardPage, { setPage, setActiveArtworkId, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "moodboards" && (userRole === "student" || userRole === "guest" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(StudentMoodboardsPage, { setPage, setActiveArtworkId, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "badges" && (userRole === "admin" ? /* @__PURE__ */ React.createElement(BadgesPage, { setPage, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "upload" && (isLoggedIn ? userRole === "student" || userRole === "guest" ? /* @__PURE__ */ React.createElement(UploadPage, { setPage, setActiveArtworkId, pageParams }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "detail" && /* @__PURE__ */ React.createElement(
    DetailPage,
    {
      setPage,
      setActiveArtworkId,
      activeArtworkId,
      pageParams,
      onBookmarkClick: openSaveFlow,
      isBookmarked
    }
  ), page === "auth" && /* @__PURE__ */ React.createElement(AuthPage, { setPage, onLoginSuccess: handleLogin }), page === "register" && /* @__PURE__ */ React.createElement(RegisterPage, { setPage }), page === "forgot_password" && /* @__PURE__ */ React.createElement(ForgotPasswordPage, { setPage }), page === "reset_password" && /* @__PURE__ */ React.createElement(ResetPasswordPage, { setPage, pageParams }), page === "verify_email" && /* @__PURE__ */ React.createElement(EmailVerificationPage, { setPage }), page === "settings" && (isLoggedIn ? /* @__PURE__ */ React.createElement(SettingsPage, { setPage, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "portfolio_settings" && (isLoggedIn ? userRole === "student" ? /* @__PURE__ */ React.createElement(PortfolioSettingsPage, { setPage, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin" && (userRole === "admin" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(AdminDashboardPage, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "about" && /* @__PURE__ */ React.createElement(AboutPage, { setPage, isLoggedIn }), page === "messages" && (isLoggedIn ? /* @__PURE__ */ React.createElement(MessagesPage, { setPage, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "pending_artworks" && (isLoggedIn && (userRole === "lecturer" || userRole === "admin") ? /* @__PURE__ */ React.createElement(PendingArtworksPage, { setPage, userData }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "edit_artwork" && (isLoggedIn ? /* @__PURE__ */ React.createElement(EditArtworkPage, { setPage, activeArtworkId }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_orders" && (userRole === "admin" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(AdminOrdersPage, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_users" && (userRole === "admin" ? /* @__PURE__ */ React.createElement(AdminUsersPage, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_artworks" && (userRole === "admin" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(AdminArtworksPage, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_export" && (userRole === "admin" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(
    AdminExportPage,
    {
      setPage,
      collections,
      onOpenExportConfig: openExportConfig,
      onQuickCreateCollection: async () => {
        const id = await createCollection(`Moodboard m\u1EDBi`);
        if (id !== null) openExportConfig(id);
      }
    }
  ) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_watermark" && (userRole === "admin" ? /* @__PURE__ */ React.createElement(AdminWatermarkPage, { setPage }) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "admin_layout" && (userRole === "admin" ? /* @__PURE__ */ React.createElement("div", { className: "flex h-screen bg-[#F8F8F8] overflow-hidden" }, /* @__PURE__ */ React.createElement(AdminSidebar, { active: "admin_layout", setPage }), /* @__PURE__ */ React.createElement("div", { className: "flex-1 overflow-y-auto" }, /* @__PURE__ */ React.createElement(LayoutSettings, { setPage }))) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), page === "collection_export_config" && (userRole === "admin" || userRole === "lecturer" ? /* @__PURE__ */ React.createElement(
    CollectionExportConfigPage,
    {
      setPage,
      collection: activeCollection,
      onUpdateCollection: updateActiveCollection,
      onOpenCatalogBuilder: (c) => handleOpenJournalFlow(c)
    }
  ) : /* @__PURE__ */ React.createElement(AccessDenied, { setPage })), /* @__PURE__ */ React.createElement(
    SaveToCollectionModal,
    {
      open: saveModal.open,
      artwork: saveModal.artwork,
      collections,
      onClose: closeSaveFlow,
      onSave: saveToCollections,
      onCreateCollection: createCollection
    }
  ), toast && /* @__PURE__ */ React.createElement("div", { className: "fixed bottom-5 right-5 z-[80]" }, /* @__PURE__ */ React.createElement("div", { className: "bg-[#212121] text-white rounded-2xl shadow-lg px-4 py-3 w-[320px] border border-white/10" }, /* @__PURE__ */ React.createElement("p", { className: "text-sm font-bold" }, toast.title), toast.message && /* @__PURE__ */ React.createElement("p", { className: "text-xs text-white/80 mt-1 leading-relaxed" }, toast.message))), catalogCollection && /* @__PURE__ */ React.createElement(
    CatalogBuilderWizard,
    {
      collection: catalogCollection,
      onClose: () => setCatalogCollection(null)
    }
  ), /* @__PURE__ */ React.createElement(
    JournalSettingsModal,
    {
      isOpen: showJournalSettings,
      onClose: () => setShowJournalSettings(false),
      onContinue: (orientation) => {
        setJournalOrientation(orientation);
        setShowJournalSettings(false);
        setShowJournalBuilder(true);
      }
    }
  ), /* @__PURE__ */ React.createElement(
    JournalBuilderModal,
    {
      isOpen: showJournalBuilder,
      onClose: () => setShowJournalBuilder(false),
      collection: journalCollection,
      orientation: journalOrientation,
      initialDraft: journalDraft,
      onSaveDraft: handleSaveJournalDraft
    }
  ), /* @__PURE__ */ React.createElement(ChatBot, { userRole }));
}
