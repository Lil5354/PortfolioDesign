import { useState, useRef, useEffect, useCallback } from "react";
import { useAuth } from "./lib/AuthContext";
import { LecturerCard } from "./components/ui/LecturerCard";
import { MajorCard } from "./components/ui/MajorCard";
import { api } from "./lib/api-client";
import CatalogBuilderWizard from "./components/catalog/CatalogBuilderWizard";
import NotificationBell from "./components/NotificationBell";

import {
  Image, Eye, Heart, Globe, LayoutDashboard, Folder, MessageSquare, BarChart2,
  Settings, Trash2, Edit2, Search, X, Check, ArrowDownCircle, ExternalLink,
  Maximize2, Lock, FileImage, ShieldAlert, Plus, Send, Clock, PenTool, Bookmark,
  Mail, Link, User, Briefcase, Unlock, FileDown, GripVertical, Users, LogOut, ChevronDown, MailOpen,
  MapPin, Phone, ArrowRight, Star, Monitor, BookOpen, Calendar, EyeOff, Archive
} from "lucide-react";

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isActive = (id) => activePage === id || (id === "home" && (activePage === "home" || activePage === "landing"));
  const navItems = [
    { id: "home", label: "Trang chủ" },
    { id: "intro", label: "Giới thiệu", external: true },
    { id: "gallery", label: "Gallery" },
  ];
  if (isLoggedIn && userRole === "student") navItems.push({ id: "portfolio", label: "Portfolio" });

  const userName = userData?.name || "Người dùng";
  const userEmail = userData?.email || "";
  const userAvatar = userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-gray-100 bg-white sticky top-0 z-50">
      <div className="flex items-center gap-3 cursor-pointer" onClick={() => setPage("home")}>
        <img src="/logo-uef.png" alt="UEF" className="h-9 object-contain" />
        <div>
          <h1 className="font-bold text-sm leading-tight">Design Gallery</h1>
          <p className="text-[10px] text-gray-500 uppercase tracking-wide">Khoa Thiết kế Đồ họa</p>
        </div>
      </div>
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
        {navItems.map((item) => (
          <button key={item.id} onClick={() => item.external ? window.location.href = '/introduction.html' : setPage(item.id)} className={`pb-1 transition-colors ${isActive(item.id) ? "text-[#077E9E] border-b-2 border-[#077E9E]" : "text-gray-500 hover:text-[#212121]"}`}>{item.label}</button>
        ))}
      </nav>
      <div className="flex items-center gap-3 text-sm font-medium">
        {isLoggedIn && <NotificationBell setPage={setPage} />}
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
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("dashboard"); setIsDropdownOpen(false); }}><LayoutDashboard size={16} className="text-[#666666]" /> Dashboard Sinh viên</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("settings"); setIsDropdownOpen(false); }}><Settings size={16} className="text-[#666666]" /> Cài đặt Tài khoản</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("portfolio_settings"); setIsDropdownOpen(false); }}><Briefcase size={16} className="text-[#666666]" /> Cài đặt Portfolio</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("messages"); setIsDropdownOpen(false); }}><Mail size={16} className="text-[#666666]" /> Hộp thư</div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("admin"); setIsDropdownOpen(false); }}><LayoutDashboard size={16} className="text-[#666666]" /> Dashboard Admin</div>
                      <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#F8F8F8] cursor-pointer text-[#212121] text-sm" onClick={() => { setPage("settings"); setIsDropdownOpen(false); }}><Settings size={16} className="text-[#666666]" /> Cài đặt Tài khoản</div>
                    </>
                  )}
                </div>
                <div className="border-t border-[#E0E0E0] py-1">
                  <div className="flex items-center gap-3 px-4 py-2 hover:bg-[#FEF2F2] hover:text-[#8B1A1A] cursor-pointer text-[#8B1A1A] text-sm font-medium transition-colors" onClick={() => { onLogout && onLogout(); setIsDropdownOpen(false); }}><LogOut size={16} /> Đăng xuất</div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button onClick={() => setPage("register")} className="text-gray-500 hover:text-[#212121] px-4 py-1.5 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">Đăng ký</button>
            <button onClick={() => setPage("auth")} className="bg-[#077E9E] text-white px-5 py-1.5 rounded-lg hover:bg-[#066a85] transition-colors">Đăng nhập</button>
          </>
        )}
      </div>
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
                      title="Lưu vào bộ sưu tập"
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
                  <span style={{ color: BLACK, fontSize: 11, fontWeight: 500 }}>Riêng tư</span>
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
    student: a.user?.fullName || "Sinh viên",
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
          <h1 style={{ fontSize: 32, fontWeight: 700, margin: 0, color: BLACK, letterSpacing: "-1px" }}>Thư viện tác phẩm</h1>
          <p style={{ color: MUTED, fontSize: 15, marginTop: 6 }}>Khám phá hàng trăm ấn phẩm sáng tạo từ sinh viên Thiết kế Đồ họa UEF</p>
        </div>
        <div style={{ display: "flex", gap: 24, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${GRAY_LIGHT}` }}>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Danh mục</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => { setCategory(c); }} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: category === c ? "none" : `1px solid ${GRAY_LIGHT}`, background: category === c ? BLACK : "#fff", color: category === c ? "#fff" : BLACK, transition: "all .15s" }}>{c}</button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Năm học</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {years.map(y => (
                <button key={y} onClick={() => setYear(y)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: year === y ? "none" : `1px solid ${GRAY_LIGHT}`, background: year === y ? BLACK : "#fff", color: year === y ? "#fff" : BLACK, transition: "all .15s" }}>{y}</button>
              ))}
            </div>
          </div>
          <div>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, display: "block", marginBottom: 8 }}>Công cụ</span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {tools.map(t => (
                <button key={t} onClick={() => setTool(t)} style={{ padding: "5px 12px", borderRadius: 20, fontSize: 12, cursor: "pointer", border: tool === t ? "none" : `1px solid ${GRAY_LIGHT}`, background: tool === t ? BLACK : "#fff", color: tool === t ? "#fff" : BLACK, transition: "all .15s" }}>{t}</button>
              ))}
            </div>
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 13, color: MUTED }}>{data.total} tác phẩm được tìm thấy</span>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setSort("newest")} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${sort === "newest" ? CERULEAN : GRAY_LIGHT}`, background: sort === "newest" ? `${CERULEAN}12` : "#fff", fontSize: 12, cursor: "pointer", color: sort === "newest" ? CERULEAN : BLACK, fontWeight: sort === "newest" ? 600 : 400 }}>Mới nhất</button>
            <button onClick={() => setSort("most_likes")} style={{ padding: "6px 12px", borderRadius: 6, border: `1px solid ${sort === "most_likes" ? CERULEAN : GRAY_LIGHT}`, background: sort === "most_likes" ? `${CERULEAN}12` : "#fff", fontSize: 12, cursor: "pointer", color: sort === "most_likes" ? CERULEAN : BLACK, fontWeight: sort === "most_likes" ? 600 : 400 }}>Nhiều like nhất</button>
          </div>
        </div>
      </div>
      <div style={{ padding: "0 48px 64px" }}>
        {loading ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: MUTED, fontSize: 14 }}>Đang tải dữ liệu...</div>
        ) : mapped.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: MUTED, fontSize: 14 }}>Không tìm thấy tác phẩm nào</div>
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
                <button onClick={() => paginate(page - 1)} disabled={page <= 1} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: page <= 1 ? GRAY_BG : "#fff", color: page <= 1 ? MUTED : BLACK, fontSize: 13, cursor: page <= 1 ? "not-allowed" : "pointer" }}>Trước</button>
                {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => paginate(p)} style={{ width: 36, height: 36, borderRadius: 8, border: "none", background: p === page ? CERULEAN : GRAY_BG, color: p === page ? "#fff" : MUTED, fontSize: 13, fontWeight: p === page ? 600 : 400, cursor: "pointer" }}>{p}</button>
                ))}
                <button onClick={() => paginate(page + 1)} disabled={page >= data.totalPages} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: page >= data.totalPages ? GRAY_BG : "#fff", color: page >= data.totalPages ? MUTED : BLACK, fontSize: 13, cursor: page >= data.totalPages ? "not-allowed" : "pointer" }}>Sau</button>
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
  const [contactPurpose, setContactPurpose] = useState("Tuyển dụng / Thực tập");
  const [contactContent, setContactContent] = useState("");
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioArtworks, setPortfolioArtworks] = useState([]);
  const [portfolioSettingsData, setPortfolioSettingsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const hashSlug = (window.location.hash.match(/^#\/portfolio\/(.+)/) || [])[1] || "";
  const slug = pageParams?.portfolioSlug || hashSlug;
  const titleByYear = { "Năm 1": "Nhà thiết kế mầm non", "Năm 2": "Nhà thiết kế tập sự", "Năm 3": "Nhà thiết kế chuyên nghiệp", "Năm 4": "Nhà thiết kế cao cấp", "Tốt nghiệp": "Nhà thiết kế xuất sắc" };

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

  if (loading) return <div className="flex min-h-screen items-center justify-center text-[#666666]">Đang tải portfolio...</div>;
  if (!portfolioData) return <div className="flex min-h-screen items-center justify-center text-[#666666]">Portfolio không tồn tại hoặc đang ở chế độ riêng tư.</div>;

  const { user, portfolioSettings, stats, featuredArtworks, privateGrade } = portfolioData;
  const profile = {
    fullName: user?.fullName || "Sinh viên",
    profileHeadline: portfolioSettings?.profileHeadline || "Design Student",
    bio: user?.bio || "",
    avatarUrl: user?.avatarUrl || "",
    email: user?.email || "",
  };
  const socialLinksRaw = portfolioSettings?.socialLinks || {};
  const socialLinks = [
    socialLinksRaw.behance && { label: "Behance", href: socialLinksRaw.behance, icon: "globe" },
    socialLinksRaw.linkedin && { label: "LinkedIn", href: socialLinksRaw.linkedin, icon: "link" },
    profile.email && portfolioSettings?.showEmail && { label: "Email", href: `mailto:${profile.email}`, icon: "mail" },
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
      alert("Lỗi khi gửi: " + (e?.message || "Vui lòng thử lại"));
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
                    Portfolio công khai
                  </p>
                  <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#212121] leading-[1.05]">
                    {profile.fullName}
                  </h1>
                </div>
              </div>

              <p className="text-base sm:text-lg text-[#666666] font-medium mb-2">
                {titleByYear[portfolioSettingsData?.portfolioSettings?.yearLevel || portfolioSettingsData?.yearLevel || portfolioSettings?.yearLevel || "Năm 3"]} • {portfolioSettingsData?.portfolioSettings?.major || portfolioSettingsData?.major || portfolioSettings?.major || "Thiết kế Đồ họa"} • UEF
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
                  Liên hệ
                </button>
                <button className="px-5 py-2.5 rounded-xl border border-[#E0E0E0] bg-white text-[#212121] text-sm font-semibold hover:bg-[#F8F8F8] transition-colors">
                  Chia sẻ
                </button>
              </div>

              {/* quick stats (giữ tinh thần thiết kế cũ) */}
              <div className="mt-10 flex flex-wrap gap-8 border-t border-[#E0E0E0] pt-6">
                {[{ label: "Tác phẩm", val: stats?.artworkCount || 0 }, { label: "Lượt xem", val: stats?.viewCount?.toLocaleString() || "0" }, { label: "Lượt thích", val: stats?.likeCount?.toLocaleString() || "0" }].map((s) => (
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
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#212121] tracking-tight">Những đồ án xuất sắc</h2>
              <p className="text-sm text-[#666666] mt-2 max-w-2xl">
                Bento grid giúp nhấn mạnh 4–6 đồ án tốt nhất (không “đổ” tất cả ảnh ra cùng lúc), hover để xem tên đồ án & công cụ.
              </p>
            </div>
            <button className="hidden sm:inline-flex px-4 py-2 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#212121] hover:bg-[#F8F8F8] transition-colors">
              Xem tất cả →
            </button>
          </div>

          <div className="bento-grid">
            {featuredWorks.map((w) => (
              <div
                key={w.id}
                onClick={() => setPage && setPage("detail")}
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
            <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>RIÊNG TƯ</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: BLACK }}>Nhận xét từ Giảng viên · GV. Trần Văn Phúc</span>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 12, color: MUTED }}>Điểm tổng kết:</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: CERULEAN }}>{privateGrade.score}</span>
                <span style={{ fontSize: 13, color: MUTED }}>/10</span>
              </div>
            </div>
            <p style={{ fontSize: 13, color: "#555", marginTop: 6, lineHeight: 1.6, marginBottom: 0 }}>{privateGrade.comment}</p>
          </div>
        </div>
        )}

        <TimelineSection />

        <div style={{ borderBottom: `1px solid ${GRAY_LIGHT}`, marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 0 }}>
            {["Tất cả tác phẩm", "Poster", "Branding", "UI/UX"].map((t, i) => (
              <button key={t} style={{ padding: "10px 20px", background: "none", border: "none", cursor: "pointer", fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? BLACK : MUTED, borderBottom: i === 0 ? `2px solid ${BLACK}` : "2px solid transparent", marginBottom: -1 }}>{t}</button>
            ))}
          </div>
        </div>
        <MasonryGrid items={artworks.slice(0, 6)} onArtworkClick={() => setPage("detail")} />
        <div style={{ height: 64 }} />
      </main>

      {isContactModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#E0E0E0] flex justify-between items-center bg-[#F8F8F8]">
              <h3 className="font-bold text-lg text-[#212121]">Gửi tin nhắn liên hệ</h3>
              <button onClick={closeContactModal} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            {contactState === "success" ? (
              <div className="p-8 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 bg-[#E8F4F8] rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-[#077E9E]" />
                </div>
                <h4 className="text-xl font-bold text-[#212121] mb-2">Đã gửi thành công!</h4>
                <p className="text-sm text-[#666666] mb-6">Tin nhắn của bạn đã được chuyển đến {profile.fullName}.</p>
                <button onClick={closeContactModal} className="w-full py-2.5 bg-[#F8F8F8] border border-[#E0E0E0] rounded-lg text-sm font-semibold text-[#212121] hover:bg-[#E0E0E0] transition-colors cursor-pointer">Đóng</button>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">Họ Tên / Đơn vị</label>
                  <input value={contactName} onChange={e => setContactName(e.target.value)} type="text" placeholder="Nhập tên của bạn" className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">Email liên hệ</label>
                  <input value={contactEmail} onChange={e => setContactEmail(e.target.value)} type="email" placeholder="email@company.com" className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">Mục đích</label>
                  <select value={contactPurpose} onChange={e => setContactPurpose(e.target.value)} className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] bg-white cursor-pointer">
                    <option value="Tuyển dụng / Thực tập">Tuyển dụng / Thực tập</option>
                    <option value="Hợp tác dự án (Freelance)">Hợp tác dự án (Freelance)</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#666666] mb-1.5">Nội dung</label>
                  <textarea value={contactContent} onChange={e => setContactContent(e.target.value)} placeholder="Nhập nội dung tin nhắn..." className="w-full px-3 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] min-h-[100px] resize-y" />
                </div>
                <button onClick={handleContactSubmit} disabled={contactState === "loading"} className={`mt-2 w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-all flex justify-center items-center gap-2 ${contactState === "loading" ? "bg-[#666666] cursor-wait" : "bg-[#077E9E] hover:opacity-90 cursor-pointer"}`}>
                  {contactState === "loading" ? "Đang gửi..." : <><Send size={16} /> Gửi tin nhắn</>}
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
    { icon: <Image size={18} />, label: "Tác phẩm của tôi", page: "dashboard" },
    { icon: <MessageSquare size={18} />, label: "Hộp thư", page: "messages" },
    { icon: <User size={18} />, label: "Cài đặt Tài khoản", page: "settings" },
    { icon: <Briefcase size={18} />, label: "Cài đặt Portfolio", page: "portfolio_settings" },
  ];
  const profileName = userData?.name || "Sinh viên";
  const profileAvatar = userData?.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80";
  const studentYear = "Sinh viên";

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
    { label: "Tổng tác phẩm", val: totalArtworks.toLocaleString(), icon: <Image size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: "Lượt xem", val: totalViews.toLocaleString(), icon: <Eye size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: "Lượt thích", val: totalLikes.toLocaleString(), icon: <Heart size={24} color={BLACK} strokeWidth={1.5} /> },
    { label: "Tác phẩm công khai", val: publicCount.toString(), icon: <Globe size={24} color={BLACK} strokeWidth={1.5} /> },
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="dashboard" setPage={setPage} userData={userData} />

      <div style={{ flex: 1, padding: "32px 40px", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: BLACK }}>Tác phẩm của tôi</h2>
            <p style={{ color: MUTED, fontSize: 13, marginTop: 4 }}>Quản lý và kiểm soát quyền hiển thị tác phẩm</p>
          </div>
          <button onClick={() => setPage("upload")} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            <Plus size={18} color="#fff" />
            Đăng ấn phẩm mới
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: MUTED, fontSize: 14 }}>Đang tải dữ liệu...</div>
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
                      <span style={{ background: art.isPublic ? "#E8F4F8" : "#F8F8F8", color: art.isPublic ? CERULEAN : MUTED, fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: `1px solid ${art.isPublic ? "#B3D9E8" : GRAY_LIGHT}` }}>{art.isPublic ? "Công khai" : "Riêng tư"}</span>
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
                        <span style={{ fontSize: 11, color: MUTED }}>Công khai</span>
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
                <Users size={20} color={CERULEAN} /> Đồng tác giả ({collabArtworks.length})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {collabArtworks.map(art => (
                  <div key={art.id} style={{ background: "#fff", borderRadius: 12, overflow: "hidden", border: `1px solid ${GRAY_LIGHT}` }}>
                    <div style={{ position: "relative", background: GRAY_BG }}>
                      <img src={art.coverImageUrl} alt={art.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block", cursor: "pointer" }} onClick={() => { setActiveArtworkId(art.id); setPage("detail"); }} />
                      <div style={{ position: "absolute", top: 8, left: 8 }}>
                        <span style={{ background: "#F0FDF4", color: "#166534", fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 10, border: "1px solid #BBF7D0", display: "flex", alignItems: "center", gap: 3 }}>
                          <Users size={10} /> {art.user?.fullName || "Đồng tác giả"}
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
    if (!coverImage) { setError("Vui lòng chọn ảnh chính"); return; }
    if (!title.trim()) { setError("Vui lòng nhập tên học phần"); return; }
    if (!subject) { setError("Vui lòng chọn danh mục"); return; }
    if (!checked1 || !checked2 || !checked3) { setError("Vui lòng xác nhận đầy đủ cam kết"); return; }
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
      setError(e?.message || "Lỗi khi đăng tác phẩm");
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
                <h4 className="text-xl font-bold text-[#212121] mb-2">Đăng tải thành công!</h4>
                <p className="text-sm text-[#666666]">Tác phẩm của bạn đã được gửi lên hệ thống.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
                  <div style={{ width: 40, height: 40, background: "#FEF2F2", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <ShieldAlert size={20} color={CRIMSON} strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: BLACK }}>Cam kết Học thuật</h3>
                    <p style={{ fontSize: 12, color: MUTED, margin: 0 }}>Bắt buộc trước khi đăng bài</p>
                  </div>
                </div>
                <p style={{ fontSize: 13, color: "#444", lineHeight: 1.7, marginBottom: 20, background: GRAY_BG, padding: "12px 14px", borderRadius: 8, borderLeft: `3px solid ${CRIMSON}` }}>
                  Để đảm bảo tính trung thực và toàn vẹn học thuật, bạn cần xác nhận các cam kết sau trước khi đăng tác phẩm lên hệ thống.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  {[
                    { id: "c1", state: checked1, set: setChecked1, text: "Tôi xác nhận tác phẩm này là sản phẩm tự thực hiện, không sử dụng bất kỳ công cụ AI tạo sinh nào (Midjourney, DALL·E, Stable Diffusion, v.v.)" },
                    { id: "c2", state: checked2, set: setChecked2, text: "Tôi không sao chép hoặc sử dụng tác phẩm của người khác mà không có sự cho phép và ghi rõ nguồn" },
                    { id: "c3", state: checked3, set: setChecked3, text: "Tôi hiểu rằng vi phạm cam kết này sẽ dẫn đến hậu quả theo quy chế học vụ của trường UEF" },
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
                  <button onClick={() => setShowPopup(false)} disabled={uploadState === "loading"} style={{ flex: 1, padding: "10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: uploadState === "loading" ? "not-allowed" : "pointer", color: MUTED }}>Hủy</button>
                  <button onClick={handleUploadSubmit} disabled={(!checked1 || !checked2 || !checked3) || uploadState === "loading"} style={{ flex: 2, padding: "10px", borderRadius: 8, border: "none", background: (checked1 && checked2 && checked3 && !uploadState) ? CERULEAN : GRAY_LIGHT, color: (checked1 && checked2 && checked3 && !uploadState) ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: (checked1 && checked2 && checked3 && !uploadState) ? "pointer" : "not-allowed" }}>
                    {uploadState === "loading" ? "Đang xử lý..." : "Xác nhận & Đăng bài"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: BLACK }}>Đăng ấn phẩm mới</h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 32 }}>Chia sẻ tác phẩm sáng tạo của bạn với cộng đồng UEF</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 10 }}>Ảnh chính *</label>
            <input type="file" id="coverInput" accept="image/*" style={{ display: "none" }} onChange={handleCoverUpload} />
            <div onClick={() => document.getElementById("coverInput")?.click()} style={{ border: `2px dashed ${coverImage ? CERULEAN : GRAY_LIGHT}`, borderRadius: 12, overflow: "hidden", position: "relative", minHeight: 400, background: GRAY_BG, cursor: "pointer" }}>
              {coverImage ? (
                <img src={coverImage} alt="preview" style={{ width: "100%", height: 400, objectFit: "cover", display: "block" }} />
              ) : (
                <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <FileImage size={36} color={MUTED} strokeWidth={1.5} />
                  <p style={{ color: MUTED, fontSize: 14, fontWeight: 600, margin: 0 }}>Nhấp để chọn ảnh chính</p>
                  <p style={{ color: MUTED, fontSize: 12, margin: 0 }}>PNG, JPG • Tối đa 20MB</p>
                </div>
              )}
            </div>
            <div style={{ marginTop: 16 }}>
              <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Ảnh bổ sung ({additionalImages.length}/9)</label>
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
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tên môn học *</label><input value={title} onChange={e => setTitle(e.target.value)} placeholder="Design Graphic - Flowers Garden" style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 14, color: BLACK, outline: "none", boxSizing: "border-box", background: GRAY_BG }} /></div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Loại đồ án</label>
              <div style={{ display: "flex", gap: 6 }}>{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} style={{ flex: 1, padding: "8px 0", borderRadius: 8, border: `1px solid ${projectYear === y ? CERULEAN : GRAY_LIGHT}`, background: projectYear === y ? "#F0F8FB" : GRAY_BG, color: projectYear === y ? CERULEAN : MUTED, fontSize: 12, fontWeight: projectYear === y ? 600 : 400, cursor: "pointer" }}>{y}</button>))}</div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Loại bài</label>
              <div style={{ display: "flex", gap: 10 }}>
                {[{ key: false, label: "Cá nhân", desc: "Tự thực hiện", icon: <User size={16} /> }, { key: true, label: "Nhóm", desc: "Làm việc nhóm", icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} style={{ display: "flex", alignItems: "center", gap: 10, flex: 1, padding: "10px 14px", borderRadius: 8, border: `1px solid ${isGroupProject === opt.key ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", background: isGroupProject === opt.key ? "#F0F8FB" : GRAY_BG }}><span style={{ color: isGroupProject === opt.key ? CERULEAN : MUTED }}>{opt.icon}</span><div><p style={{ fontSize: 13, fontWeight: 600, color: isGroupProject === opt.key ? CERULEAN : BLACK, margin: 0 }}>{opt.label}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{opt.desc}</p></div></div>))}
              </div>
            </div>
            {isGroupProject && (<div style={{ position: "relative" }}><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Thêm thành viên nhóm</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{friends.map((f, i) => (<span key={f.id || i} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}><User size={12} /> {f.fullName || f}<X size={12} color={CERULEAN} onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} style={{ cursor: "pointer" }} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder="Nhập tên hoặc email..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 120, color: BLACK, flex: 1 }} /></div>{friendResults.length > 0 && (<div style={{ position: "absolute", zIndex: 50, top: "100%", left: 0, right: 0, marginTop: 4, background: "#fff", border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", maxHeight: 200, overflowY: "auto" }}>{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", cursor: "pointer", borderBottom: `1px solid ${GRAY_LIGHT}` }}><img src={u.avatarUrl || ""} alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG }} /><div><p style={{ fontSize: 13, fontWeight: 500, margin: 0, color: BLACK }}>{u.fullName}</p><p style={{ fontSize: 11, color: MUTED, margin: 0 }}>{u.email}</p></div></div>))}</div>)}</div>)}
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Mô tả</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả về tác phẩm của bạn..." style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, color: BLACK, outline: "none", resize: "vertical", minHeight: 90, lineHeight: 1.6, boxSizing: "border-box", background: GRAY_BG, fontFamily: "inherit" }} /></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Danh mục *</label>
                <select value={subject} onChange={e => setSubject(e.target.value)} style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, background: GRAY_BG, color: BLACK }}>
                  <option value="">-- Chọn --</option>
                  {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Công cụ</label>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>
                  {tools.map(t => (<span key={t} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12 }}>{t}<X size={12} color={CERULEAN} onClick={() => setTools(tools.filter(x => x !== t))} style={{ cursor: "pointer", marginLeft: 4 }} /></span>))}
                  <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} />
                </div>
              </div>
            </div>
            <div><label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Tags</label><div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: GRAY_BG, minHeight: 44 }}>{tags.map(t => (<span key={t} style={{ background: "#E8F4F8", color: CERULEAN, fontSize: 12, padding: "3px 10px", borderRadius: 12, display: "flex", alignItems: "center", gap: 5 }}>{t}<X size={12} color={CERULEAN} onClick={() => setTags(tags.filter(x => x !== t))} style={{ cursor: "pointer" }} /></span>))}<input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder="Thêm tag..." style={{ border: "none", background: "transparent", outline: "none", fontSize: 13, minWidth: 80, color: BLACK }} /></div></div>
            <div style={{ background: "#FEFCF3", border: `1px solid #F0E6CC`, borderRadius: 10, padding: "14px 16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: 12 }}>
                <div onClick={() => setAgreedToTerms(!agreedToTerms)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${agreedToTerms ? CERULEAN : GRAY_LIGHT}`, background: agreedToTerms ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1, cursor: "pointer" }}>{agreedToTerms && <Check size={12} color="#fff" strokeWidth={3} />}</div>
                <p style={{ fontSize: 12, color: "#666", lineHeight: 1.6, margin: 0 }}>Tôi cam kết tác phẩm này là sản phẩm tự thực hiện, không sao chép từ nguồn không hợp lệ. Tôi chịu trách nhiệm về nội dung đăng tải. Tôi hiểu rằng tác phẩm sẽ được giảng viên/admin xác nhận trước khi công khai trên hệ thống.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div onClick={() => setNotifyOnConfirm(!notifyOnConfirm)} style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${notifyOnConfirm ? CERULEAN : GRAY_LIGHT}`, background: notifyOnConfirm ? CERULEAN : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, cursor: "pointer" }}>{notifyOnConfirm && <Check size={12} color="#fff" strokeWidth={3} />}</div>
                <span style={{ fontSize: 12, color: "#666" }}>Nhận thông báo khi tác phẩm được xác nhận</span>
              </div>
            </div>
            <div style={{ paddingTop: 4 }}>
              <button onClick={() => setShowPopup(true)} disabled={!agreedToTerms} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: agreedToTerms ? CERULEAN : GRAY_LIGHT, color: agreedToTerms ? "#fff" : MUTED, fontSize: 15, fontWeight: 700, cursor: agreedToTerms ? "pointer" : "not-allowed", letterSpacing: "0.3px" }}>Đăng tác phẩm</button>
              <p style={{ textAlign: "center", fontSize: 11, color: MUTED, marginTop: 8 }}>Sau khi đăng, GV/Admin sẽ xác nhận trước khi công khai</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailPage({ setPage, setActiveArtworkId, activeArtworkId, onBookmarkClick, isBookmarked }) {
  const { user: authUser } = useAuth();
  const [art, setArt] = useState({
    title: "Đang tải...", subject: "Đang tải...", coverImageUrl: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80",
    description: "", tags: [], toolsUsed: [], likeCount: 0, commentCount: 0,
    createdAt: new Date().toISOString(), user: null, userId: null, isPublic: true,
  });
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
    setActiveImageIdx(0);
    api.artworks.get(activeArtworkId).then(res => {
      setArt({
        ...res,
        subject: res.subject || "Ấn phẩm",
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
    }).catch(() => {});
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
      alert("Vui lòng đăng nhập để bình luận");
      return;
    }
    setSendingComment(true);
    try {
      const newComment = await api.artworks.comments.create(activeArtworkId, commentText.trim());
      setComments(prev => [newComment, ...prev]);
      setCommentText("");
    } catch (e) {
      alert("Lỗi khi gửi bình luận: " + (e?.message || "Vui lòng thử lại"));
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
      alert("Lỗi khi lưu đánh giá: " + (e?.message || "Vui lòng thử lại"));
    }
    setSavingGrade(false);
  };

  const allImages = [art.coverImageUrl, ...(art.fileUrls || [])].filter(Boolean);
  const allImagesDeduped = [...new Set(allImages)];
  const activeImage = allImagesDeduped[activeImageIdx] || allImagesDeduped[0] || art.coverImageUrl;

  const semesterToYear = { HK1: "Năm 1", HK2: "Năm 2", HK3: "Năm 3" };

  const timeAgo = (dateStr) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Vừa xong";
    if (mins < 60) return `${mins} phút trước`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} ngày trước`;
    return new Date(dateStr).toLocaleDateString("vi-VN");
  };

  return (
    <div style={{ background: "#fff", minHeight: "100vh" }}>
      <div style={{ padding: "20px 48px", borderBottom: `1px solid ${GRAY_LIGHT}`, display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 13, color: MUTED, cursor: "pointer" }} onClick={() => setPage("gallery")}>Gallery</span>
        <span style={{ fontSize: 13, color: MUTED }}>/</span>
        <span style={{ fontSize: 13, color: MUTED }}>{art.subject || "Ấn phẩm"}</span>
        <span style={{ fontSize: 13, color: MUTED }}>/</span>
        <span style={{ fontSize: 13, color: BLACK, fontWeight: 500 }}>{art.title}</span>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "65fr 35fr", minHeight: "calc(100vh - 105px)" }}>
        <div style={{ background: GRAY_BG, display: "flex", flexDirection: "row", alignItems: "stretch", position: "relative", padding: 0 }}>
          {allImagesDeduped.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "16px 12px", overflowY: "auto", flexShrink: 0, zIndex: 3, justifyContent: "center" }}>
              {allImagesDeduped.map((url, idx) => (
                <div key={idx} onClick={() => setActiveImageIdx(idx)} style={{ width: 56, height: 48, borderRadius: 6, overflow: "hidden", border: `2px solid ${idx === activeImageIdx ? CERULEAN : GRAY_LIGHT}`, cursor: "pointer", opacity: idx === activeImageIdx ? 1 : 0.55, transition: "all .15s", flexShrink: 0 }}>
                  <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", padding: "32px 32px 0" }}>
            <img src={activeImage} alt={art.title} style={{ maxWidth: "100%", maxHeight: "70vh", objectFit: "contain", borderRadius: 4, display: "block", position: "relative", zIndex: 2 }} />
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
              <p style={{ color: "rgba(0,0,0,0.06)", fontSize: 48, fontWeight: 900, transform: "rotate(-25deg)", userSelect: "none", letterSpacing: 4, textTransform: "uppercase" }}>UEF · PORTFOLIO</p>
            </div>
            <div style={{ position: "absolute", bottom: 20, right: 24, display: "flex", gap: 8, zIndex: 3 }}>
              {[<Maximize2 size={16} />, <ArrowDownCircle size={16} />, <Link size={16} />].map((icon, i) => (
                <button key={i} style={{ width: 36, height: 36, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{icon}</button>
              ))}
            </div>
          </div>
        </div>

        <div style={{ borderLeft: `1px solid ${GRAY_LIGHT}`, padding: "32px 28px", overflow: "auto", display: "flex", flexDirection: "column", gap: 0 }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
              <span style={{ background: "#F0F8FB", color: CERULEAN, fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10 }}>{art.subject}</span>
              <span style={{ fontSize: 12, color: MUTED }}>{new Date(art.createdAt).toLocaleDateString("vi-VN")}</span>
            </div>
            <h1 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 8px", color: BLACK, lineHeight: 1.3 }}>{art.title}</h1>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
              {art.semester && <span style={{ background: "#FEF3E2", color: "#92400E", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}><BookOpen size={12} /> {semesterToYear[art.semester] || art.semester}</span>}
              {art.academicYear && <span style={{ background: "#E8F0FE", color: "#1E40AF", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}><Calendar size={12} /> {art.academicYear}</span>}
              {(art.collaborators || []).length > 0 && <span style={{ background: "#F0FDF4", color: "#166534", fontSize: 11, fontWeight: 600, padding: "3px 9px", borderRadius: 10, display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {(art.collaborators || []).length} thành viên</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img
                src={art.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"}
                alt="" style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", background: GRAY_BG, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert("Tác giả chưa thiết lập portfolio.");
                }}
              />
              <span
                style={{ fontSize: 13, color: MUTED, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert("Tác giả chưa thiết lập portfolio.");
                }}
              >{art.user?.fullName}</span>
              <span style={{ fontSize: 12, color: MUTED }}>·</span>
              <span
                style={{ fontSize: 12, color: CERULEAN, cursor: "pointer" }}
                onClick={() => {
                  const slug = art.user?.portfolioSettings?.portfolioSlug;
                  if (slug) setPage("portfolio", { portfolioSlug: slug });
                  else alert("Tác giả chưa thiết lập portfolio.");
                }}
              >Xem portfolio</span>
            </div>
          </div>

          {art.subject && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Danh mục</span>
            <div style={{ marginTop: 4 }}>
              <span style={{ background: "#F0F8FB", color: CERULEAN, fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 8, border: `1px solid #B3D9E8` }}>{art.subject}</span>
            </div>
          </div>}

          {(art.toolsUsed || []).length > 0 && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Công cụ sử dụng</span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 4 }}>
              {art.toolsUsed.map(tool => (
                <span key={tool} style={{ background: "#F0F0F0", color: "#333", fontSize: 12, padding: "4px 10px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}` }}>{tool}</span>
              ))}
            </div>
          </div>}

          {(art.collaborators || []).length > 0 && <div style={{ marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1 }}>Đồng tác giả</span>
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
            {art.description || "Chưa có mô tả cho tác phẩm này."}
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
                {isBookmarked && isBookmarked(art.id) ? "Đã lưu" : "Lưu"}
              </button>
              <button onClick={() => setShowReport(true)} style={{ padding: "8px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: MUTED, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                <ShieldAlert size={16} /> Báo cáo
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
                    {existingGrade ? "Đã chấm điểm" : "Đánh giá của Giảng viên"}
                  </p>
                  <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>
                    {existingGrade ? `Điểm: ${existingGrade.score}/10` : "Nhập điểm và lời nhận xét"}
                  </p>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Điểm số (0–10)</label>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <input value={gradeScore} onChange={e => setGradeScore(e.target.value)} type="number" min="0" max="10" step="0.5" placeholder="8.5" style={{ width: 80, padding: "9px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 20, fontWeight: 700, color: CERULEAN, background: "#fff", outline: "none", textAlign: "center" }} />
                  <div>
                    <p style={{ fontSize: 11, color: MUTED, margin: 0 }}>Nhập điểm từ 0 đến 10</p>
                    {gradeScore && <div style={{ display: "flex", gap: 2, marginTop: 4 }}>
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => <div key={n} style={{ width: 14, height: 5, borderRadius: 2, background: parseFloat(gradeScore) >= n ? CERULEAN : GRAY_LIGHT }} />)}
                    </div>}
                  </div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: MUTED, textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>Lời phê bình & Nhận xét</label>
                <textarea value={gradeComment} onChange={e => setGradeComment(e.target.value)} placeholder="Nhận xét về kỹ thuật thực hiện, tư duy thiết kế, điểm mạnh và góp ý cải thiện..." style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, lineHeight: 1.6, resize: "vertical", minHeight: 100, background: "#fff", outline: "none", fontFamily: "inherit", color: BLACK, boxSizing: "border-box" }} />
              </div>
              <button onClick={handleSaveGrade} disabled={!gradeScore || savingGrade} style={{ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: gradeScore && !savingGrade ? CERULEAN : GRAY_LIGHT, color: gradeScore && !savingGrade ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: gradeScore && !savingGrade ? "pointer" : "not-allowed" }}>
                {savingGrade ? "Đang lưu..." : existingGrade ? "Cập nhật đánh giá" : "Lưu đánh giá"}
              </button>
            </div>
          )}

          {existingGrade && !canGrade && (
            <div style={{ background: "#F0FFF0", borderRadius: 12, padding: "20px", border: `1px solid #C6F6C6`, marginBottom: 20 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ fontSize: 32, fontWeight: 700, color: CERULEAN }}>{existingGrade.score}</div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, margin: "0 0 4px", color: BLACK }}>Điểm đánh giá</p>
                  {existingGrade.comment && <p style={{ fontSize: 12, color: "#444", margin: 0, lineHeight: 1.5 }}>{existingGrade.comment}</p>}
                  {existingGrade.lecturer && <p style={{ fontSize: 11, color: MUTED, marginTop: 4 }}>Bởi: {existingGrade.lecturer.fullName}</p>}
                </div>
              </div>
            </div>
          )}

          <div style={{ marginTop: 32 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: BLACK, marginBottom: 16 }}>Bình luận ({comments.length})</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16, marginBottom: 32 }}>
              <div style={{ border: `1px solid ${GRAY_LIGHT}`, borderRadius: 8, padding: 12, background: GRAY_BG }}>
                {currentUserId ? (
                  <>
                    <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Để lại bình luận của bạn..." style={{ width: "100%", border: "none", background: "transparent", outline: "none", resize: "none", minHeight: 60, fontSize: 13, color: BLACK, fontFamily: "inherit" }} />
                    <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
                      <button onClick={handleSendComment} disabled={!commentText.trim() || sendingComment} style={{ padding: "8px 16px", borderRadius: 6, border: "none", background: commentText.trim() && !sendingComment ? CERULEAN : GRAY_LIGHT, color: commentText.trim() && !sendingComment ? "#fff" : MUTED, fontSize: 13, fontWeight: 600, cursor: commentText.trim() && !sendingComment ? "pointer" : "not-allowed", display: "flex", alignItems: "center", gap: 6 }}>
                        <Send size={14} /> {sendingComment ? "Đang gửi..." : "Gửi bình luận"}
                      </button>
                    </div>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "16px 0" }}>
                    <p style={{ fontSize: 13, color: MUTED, margin: "0 0 10px" }}>Vui lòng <strong style={{ color: CERULEAN, cursor: "pointer" }} onClick={() => setPage("auth")}>đăng nhập</strong> để bình luận</p>
                  </div>
                )}
              </div>
              {comments.length === 0 && (
                <p style={{ fontSize: 13, color: MUTED, textAlign: "center", padding: "20px 0" }}>Chưa có bình luận nào.</p>
              )}
              {comments.map(cmt => (
                <div key={cmt.id} style={{ display: "flex", gap: 12 }}>
                  <img src={cmt.user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80"} alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                  <div>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, margin: "0 0 4px", color: BLACK }}>
                        {cmt.user?.fullName}
                        {cmt.user?.id === art.userId && <span style={{ fontSize: 11, color: CERULEAN, fontWeight: 400, marginLeft: 4 }}>(Tác giả)</span>}
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

      {showReport && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReport(false)}>
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-[#E0E0E0] flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#212121]">Báo cáo ấn phẩm</h3>
              <button onClick={() => setShowReport(false)} className="text-[#666666] hover:text-[#212121] transition-colors cursor-pointer"><X size={20} /></button>
            </div>
            <div className="p-6">
              <label className="block text-sm font-semibold text-[#666666] mb-3">Loại vi phạm</label>
              <div className="flex flex-wrap gap-2 mb-5">
                {["Đạo văn / Sao chép", "Nội dung không phù hợp", "Thông tin sai lệch", "Xâm phạm bản quyền", "Spam / Quảng cáo", "Khác"].map(t => (
                  <button key={t} onClick={() => setReportType(t)} className={`px-3.5 py-2 rounded-lg text-sm font-medium border transition-colors cursor-pointer ${reportType === t ? "bg-[#077E9E] text-white border-[#077E9E]" : "bg-white text-[#666666] border-[#E0E0E0] hover:bg-[#F8F8F8]"}`}>{t}</button>
                ))}
              </div>
              <label className="block text-sm font-semibold text-[#666666] mb-2">Chi tiết vi phạm</label>
              <textarea value={reportDetail} onChange={e => setReportDetail(e.target.value)} placeholder="Mô tả chi tiết về vi phạm..." className="w-full p-3 rounded-lg border border-[#E0E0E0] text-sm outline-none focus:border-[#077E9E] resize-vertical min-h-[120px] font-inherit text-[#212121] box-border" style={{ fontFamily: "inherit" }} />
              <button onClick={async () => {
                if (!reportType) return;
                setSendingReport(true);
                try {
                  await api.artworks.report(activeArtworkId, { violationType: reportType, detail: reportDetail });
                  setShowReport(false);
                  setReportType("");
                  setReportDetail("");
                  alert("Cảm ơn bạn! Báo cáo đã được gửi đến quản trị viên.");
                } catch (e) {
                  alert("Lỗi khi gửi báo cáo: " + (e?.message || "Vui lòng thử lại"));
                }
                setSendingReport(false);
              }} disabled={!reportType || sendingReport} className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer ${!reportType || sendingReport ? "bg-[#E0E0E0] text-[#999]" : "bg-[#8B1A1A] text-white hover:bg-opacity-90"}`}>
                {sendingReport ? "Đang gửi..." : "Gửi báo cáo"}
              </button>
            </div>
          </div>
        </div>
      )}

      {relatedArtworks.length > 0 && (
        <div style={{ padding: "40px 48px 64px", borderTop: `1px solid ${GRAY_LIGHT}` }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, color: BLACK, marginBottom: 24 }}>Khám phá thêm</h3>
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
      setLoginError("Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoginError("");
    setLogging(true);
    try {
      await loginWithEmail(email, password);
      await refreshSession();
      setPage("home");
    } catch (e) {
      setLoginError(e?.message || "Đăng nhập thất bại");
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

  return (
    <div style={{ display: "flex", height: "100vh", width: "100%" }}>
      <div style={{ flex: 1, position: "relative" }}>
        <img src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/hoc-phi-uef-.jpg" alt="auth-bg" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.2)" }} />
        <div style={{ position: "absolute", top: 40, left: 40, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }} onClick={() => setPage("home")}>
          <img src="/logo-uef.png" alt="UEF" style={{ height: 32, filter: "brightness(0) invert(1)" }} />
          <span style={{ fontWeight: 700, fontSize: 18, color: "#fff" }}>Design Gallery</span>
        </div>
      </div>
      <div style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 64px" }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: BLACK, marginBottom: 8 }}>Đăng nhập</h2>
        <p style={{ color: MUTED, fontSize: 14, marginBottom: 24 }}>Chào mừng trở lại với hệ thống Portfolio UEF</p>

        <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
          {[{ key: "student", label: "Sinh viên" }, { key: "lecturer", label: "Giảng viên" }, { key: "admin", label: "Quản trị" }].map((r) => (
            <button disabled={logging} key={r.key} onClick={() => setAuthRole(r.key)} style={{ flex: 1, padding: "7px 0", borderRadius: 6, border: `1px solid ${authRole === r.key ? CERULEAN : GRAY_LIGHT}`, background: authRole === r.key ? `${CERULEAN}12` : "transparent", color: authRole === r.key ? CERULEAN : MUTED, fontSize: 12, fontWeight: 500, cursor: logging ? "not-allowed" : "pointer", opacity: logging ? 0.6 : 1 }}>{r.label}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Email</label>
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
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: MUTED, marginBottom: 6 }}>Mật khẩu</label>
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
            <><span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" style={{ animation: "spin 0.8s linear infinite" }}></span> Đang đăng nhập...</>
          ) : "Đăng nhập"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
          <div style={{ flex: 1, height: 1, background: GRAY_LIGHT }} />
          <span style={{ fontSize: 12, color: MUTED }}>Hoặc</span>
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
          Đăng nhập với Google
        </button>

          <p style={{ color: "#666", fontSize: 11, marginTop: 16, textAlign: "center", lineHeight: 1.5 }}>
          Đăng nhập bằng email của bạn để sử dụng hệ thống.<br />
          Sinh viên: <strong>sv@uef.edu.vn</strong> / Mật khẩu: <strong>test123</strong>
        </p>
      </div>
    </div>
  )
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
    { label: "Ấn phẩm đang hiển thị", value: adminStats.publishedArtworks || 0, hint: "Tổng ấn phẩm công khai", accent: "#077E9E" },
    { label: "Bài bị báo cáo", value: adminStats.reportedArtworks || 0, hint: "Cần xử lý", accent: "#8B1A1A" },
    { label: "Tổng tài khoản", value: adminStats.totalAccounts || 0, hint: "SV + GV + Admin", accent: "#212121" },
    { label: "Lượt tương tác", value: (adminStats.totalInteractions || 0).toLocaleString(), hint: "Lượt thích + bình luận", accent: "#055F78" },
  ];

  const categoryCounts = [];
  const recent = recentActivity.slice(0, 4).map(a => ({
    color: a.isPublic ? "#077E9E" : "#8B1A1A",
    text: `${a.user?.fullName || "User"} ${a.isPublic ? "đã được duyệt" : "vừa đăng"} ấn phẩm "${(a.title || "").slice(0, 30)}"`,
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
            <h2 className="text-2xl font-bold text-[#212121]">Tổng quan Quản trị</h2>
            <p className="text-sm text-[#666666] mt-1">Theo dõi số liệu hệ thống và xử lý vi phạm / cảnh cáo ấn phẩm</p>
          </div>
          <button onClick={() => setPage("admin_export")} className="px-4 py-2.5 bg-[#077E9E] text-white rounded-lg text-sm font-semibold hover:bg-[#055F78] transition-colors flex items-center gap-2">
            <FileDown size={16} /> Báo cáo PDF
          </button>
        </div>

        {loading ? <div className="text-center py-16 text-[#666666] text-sm">Đang tải dữ liệu...</div> : (
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
                <h3 className="text-sm font-bold text-[#212121]">Ấn phẩm cần chú ý</h3>
                <p className="text-xs text-[#666666] mt-1">Danh sách bài bị báo cáo / đã ẩn / nổi bật</p>
              </div>
              <button onClick={() => setPage("admin_artworks")} className="text-sm font-semibold text-[#077E9E] hover:text-[#055F78] transition-colors">
                Mở trang xử lý →
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Tên ấn phẩm</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Sinh viên</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Môn học</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Ngày</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Trạng thái</th>
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
              <h3 className="text-sm font-bold text-[#212121] mb-4">Phân bổ ấn phẩm theo môn học</h3>
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
                <h3 className="text-sm font-bold text-[#212121]">Hoạt động gần đây</h3>
                <span className="text-xs text-[#666666]">Hôm nay</span>
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
              <h3 className="text-sm font-bold text-[#212121] mb-4">Thao tác nhanh</h3>
              <div className="space-y-2">
                <button onClick={() => setPage("admin_artworks")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left">
                  <ShieldAlert size={16} className="text-[#8B1A1A]" />
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">Xử lý vi phạm</p>
                    <p className="text-xs text-[#666666]">Ẩn / xóa / highlight ấn phẩm</p>
                  </div>
                </button>
                <button onClick={() => setPage("admin_users")} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg border border-[#E0E0E0] hover:bg-[#F8F8F8] transition-colors text-left">
                  <Users size={16} className="text-[#077E9E]" />
                  <div>
                    <p className="text-sm font-semibold text-[#212121]">Quản lý tài khoản</p>
                    <p className="text-xs text-[#666666]">Phân quyền và khóa/mở khóa</p>
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
      alert("Lỗi khi lưu trữ: " + (e?.message || "Vui lòng thử lại"));
    }
  };

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diff = now - d;
    if (diff < 86400000 && d.getDate() === now.getDate()) return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
    if (diff < 172800000) return "Hôm qua";
    return d.toLocaleDateString("vi-VN");
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 60px)", background: GRAY_BG }}>
      <DashboardSidebar activePage="messages" setPage={setPage} userData={userData} />
      <div style={{ flex: 1, padding: "32px 40px" }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: "0 0 24px", color: BLACK }}>Hộp thư đến</h2>
        {loading ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40 }}>Đang tải...</p>
        ) : messages.length === 0 ? (
          <p style={{ textAlign: "center", color: MUTED, padding: 40, background: "#fff", borderRadius: 12, border: `1px solid ${GRAY_LIGHT}` }}>Chưa có tin nhắn nào.</p>
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
                      {msg.purpose && <span style={{ background: GRAY_BG, border: `1px solid ${GRAY_LIGHT}`, fontSize: 11, padding: "2px 8px", borderRadius: 12, color: MUTED, whiteSpace: "nowrap" }}>{msg.purpose}</span>}
                      <p style={{ fontSize: 13, color: msg.isRead ? MUTED : BLACK, margin: 0, fontWeight: msg.isRead ? 400 : 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>{msg.content?.substring(0, 100) || ""}</p>
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
                      <p style={{ fontSize: 14, color: BLACK, lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{msg.content}</p>
                    </div>
                    <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                      <a
                        href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.senderEmail)}&su=${encodeURIComponent(`Phản hồi: ${msg.purpose || "Liên hệ từ Portfolio"}`)}&body=${encodeURIComponent(
                          `--- Tin nhắn gốc từ ${msg.senderName} (${msg.senderEmail}) ---\n${msg.purpose ? `Mục đích: ${msg.purpose}\n` : ""}${msg.content}\n\n--- Phản hồi của tôi ---\n`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ padding: "8px 16px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6 }}
                      >
                        <Mail size={14} /> Phản hồi qua Email
                      </a>
                      <button onClick={() => handleArchive(msg.id)} style={{ padding: "8px 16px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", fontSize: 13, cursor: "pointer", color: BLACK, display: "flex", alignItems: "center", gap: 6 }}>
                        <Archive size={14} /> Lưu trữ
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
    { icon: <LayoutDashboard size={18} />, label: "Tổng quan", page: "admin" },
    { icon: <Users size={18} />, label: "Tài khoản", page: "admin_users" },
    { icon: <ShieldAlert size={18} />, label: "Cảnh cáo ấn phẩm", page: "admin_artworks" },
    { icon: <Folder size={18} />, label: "Quản lý bộ sưu tập", page: "admin_export" },
  ];

  return (
    <div className="w-64 bg-[#F8F8F8] border-r border-[#E0E0E0] flex-shrink-0 flex flex-col h-full overflow-y-auto">
      <div className="p-6 border-b border-[#E0E0E0]">
        <h3 className="font-bold text-[#212121] text-sm uppercase tracking-wider">Admin Panel</h3>
        <p className="text-xs text-[#666666] mt-1">Hệ thống quản trị UEF</p>
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
          <Globe size={16} /> Về trang Portal
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
    if (!title.trim()) { setMessage({ type: "error", text: "Vui lòng nhập tên môn học" }); return; }
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
        semester: yearToSemester[projectYear] || "HK1",
        academicYear: yearToAcademic[projectYear] || "2024-2025",
      };
      await api.artworks.update(activeArtworkId, body);
      setMessage({ type: "success", text: "Đã cập nhật!" });
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
    if (!confirm("Xóa ấn phẩm này?")) return;
    try {
      await api.artworks.delete(activeArtworkId);
      setPage("dashboard");
    } catch (e) {
      setMessage({ type: "error", text: e?.message || "Lỗi xóa" });
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-[#666666]">Đang tải...</div>;

  return (
    <div className="bg-white min-h-[calc(100vh-60px)] px-16 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-[#666666] mb-6 cursor-pointer hover:text-[#212121] transition-colors inline-flex" onClick={() => setPage("dashboard")}>
          <ArrowDownCircle className="rotate-90" size={16} /> Quay lại Tác phẩm của tôi
        </div>
        <h2 className="text-2xl font-bold text-[#212121] mb-1">Chỉnh sửa Ấn phẩm</h2>
        <p className="text-sm text-[#666666] mb-8">Cập nhật thông tin chi tiết cho tác phẩm của bạn</p>
        {message.text && (
          <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
            {message.text}
          </div>
        )}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Ảnh bìa</label>
            <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer">
              <img src={coverImage || originalCover} alt="cover" className="w-full h-[360px] object-cover block" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer">
                  <span className="px-5 py-2.5 rounded-lg border-2 border-white text-white text-sm font-semibold flex items-center gap-2 hover:bg-white hover:text-[#212121] transition-colors"><Image size={16} /> Đổi ảnh bìa</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
                </label>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Ảnh bổ sung ({additionalImages.length}/9)</label>
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
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Tên môn học</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none focus:border-[#077E9E] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Loại đồ án</label><div className="flex gap-1.5">{["Năm 1", "Năm 2", "Năm 3", "Năm 4", "Tốt nghiệp"].map((y) => (<button key={y} onClick={() => setProjectYear(y)} className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${projectYear === y ? 'bg-[#F0F8FB] border-[#077E9E] text-[#077E9E]' : 'bg-[#F8F8F8] border-[#E0E0E0] text-[#666666]'}`}>{y}</button>))}</div></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Loại bài</label><div className="flex gap-3">{[{ key: false, label: "Cá nhân", icon: <User size={16} /> }, { key: true, label: "Nhóm", icon: <Users size={16} /> }].map((opt) => (<div key={opt.label} onClick={() => setIsGroupProject(opt.key)} className={`flex items-center gap-2 flex-1 px-4 py-2.5 rounded-lg border cursor-pointer ${isGroupProject === opt.key ? 'bg-[#F0F8FB] border-[#077E9E]' : 'bg-[#F8F8F8] border-[#E0E0E0]'}`}><span className={isGroupProject === opt.key ? 'text-[#077E9E]' : 'text-[#666666]'}>{opt.icon}</span><span className={`text-sm font-semibold ${isGroupProject === opt.key ? 'text-[#077E9E]' : 'text-[#212121]'}`}>{opt.label}</span></div>))}</div></div>
            {isGroupProject && (<div className="relative"><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Thêm thành viên nhóm</label><div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">{friends.map((f, i) => (<span key={f.id || i} className="inline-flex items-center gap-1.5 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full"><User size={12} /> {f.fullName || f}  <X size={10} className="cursor-pointer" onClick={() => setFriends(friends.filter((_, idx) => idx !== i))} /></span>))}<input value={friendInput} onChange={e => handleFriendSearch(e.target.value)} placeholder="Nhập tên hoặc email..." className="border-none bg-transparent outline-none text-sm min-w-[120px] text-[#212121] flex-1" /></div>{friendResults.length > 0 && (<div className="absolute z-50 top-full mt-1 left-0 right-0 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-48 overflow-y-auto">{friendResults.map(u => (<div key={u.id} onClick={() => addFriend(u)} className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#F8F8F8] cursor-pointer border-b border-[#E0E0E0] last:border-b-0"><img src={u.avatarUrl || ''} alt="" className="w-7 h-7 rounded-full object-cover bg-[#E0E0E0]" /><div><p className="text-sm font-medium text-[#212121]">{u.fullName}</p><p className="text-xs text-[#666666]">{u.email}</p></div></div>))}</div>)}</div>)}
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Mô tả</label><textarea value={description} onChange={e => setDescription(e.target.value)} className="w-full px-4 py-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-[#212121] text-sm outline-none min-h-[80px] resize-y focus:border-[#077E9E] focus:bg-white transition-colors" /></div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Danh mục</label>
              <select value={subject} onChange={e => setSubject(e.target.value)} className="w-full px-3 py-2.5 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] text-sm text-[#212121] outline-none focus:border-[#077E9E] focus:bg-white transition-colors cursor-pointer">
                <option value="">-- Chọn --</option>
                {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Công cụ</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tools.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTools(tools.filter(x => x !== t))} /></span>))}
                <input value={toolInput} onChange={e => setToolInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && toolInput.trim()) { setTools([...tools, toolInput.trim()]); setToolInput(""); } }} placeholder="Add tool..." className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div><label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Tags</label>
              <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-[#E0E0E0] bg-[#F8F8F8] min-h-[44px]">
                {tags.map(t => (<span key={t} className="inline-flex items-center gap-1 bg-[#E8F4F8] text-[#077E9E] text-xs px-2.5 py-1 rounded-full">{t}<X size={10} className="cursor-pointer" onClick={() => setTags(tags.filter(x => x !== t))} /></span>))}
                <input value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && tagInput.trim()) { setTags([...tags, tagInput.trim()]); setTagInput(""); } }} placeholder="Thêm tag..." className="border-none bg-transparent outline-none text-sm min-w-[80px] text-[#212121]" />
              </div>
            </div>
            <div className="mt-auto pt-4 border-t border-[#E0E0E0] flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-3 rounded-lg border border-[#8B1A1A] text-[#8B1A1A] text-sm font-semibold flex items-center justify-center gap-2 hover:bg-red-50 transition-colors cursor-pointer"><Trash2 size={16} /> Xóa ấn phẩm</button>
              <button onClick={handleSave} disabled={saving} className="flex-[2] py-3 rounded-lg border-none bg-[#077E9E] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50"><Check size={16} /> {saving ? "Đang lưu..." : "Lưu thay đổi"}</button>
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

  const roleLabel = { student: "Sinh viên", lecturer: "Giảng viên", admin: "Admin" };

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
            <h2 className="text-2xl font-bold text-[#212121]">Quản lý Tài khoản</h2>
            <p className="text-sm text-[#666666] mt-1">Danh sách người dùng và phân quyền hệ thống</p>
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
              <input placeholder="Tìm kiếm user..." className="pl-10 pr-4 py-2 bg-white border border-[#E0E0E0] rounded-lg text-sm w-64 outline-none focus:border-[#077E9E]" />
            </div>
          </div>
        </div>
        {importFileName && (
          <div className="mb-5 bg-[#E8F4F8] border border-[#B3D9E8] text-[#077E9E] rounded-lg px-4 py-3 text-sm flex items-center justify-between">
            <span className="font-medium">Đã chọn file: {importFileName}</span>
            <button onClick={() => setImportFileName("")} className="text-[#077E9E] hover:text-[#055F78] font-semibold text-sm">Bỏ chọn</button>
          </div>
        )}

        {loading ? <div className="text-center py-16 text-[#666666] text-sm">Đang tải danh sách...</div> : users.length === 0 ? <div className="text-center py-16 text-[#666666] text-sm">Không có người dùng</div> : (
        <div className="border border-[#E0E0E0] rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">Họ Tên</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">Email</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">Vai trò</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-left px-4 py-3 text-xs uppercase tracking-wider font-semibold">Ngày tham gia</th>
                <th className="bg-[#F8F8F8] text-[#666666] text-center px-4 py-3 text-xs uppercase tracking-wider font-semibold">Hành động</th>
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
                      <button onClick={() => locked ? toggleLockUser(u) : setConfirmModal({ isOpen: true, user: u })} className={`px-3 py-1.5 flex items-center gap-2 rounded-md border transition-colors cursor-pointer ${locked ? 'border-[#077E9E] text-[#077E9E] hover:bg-[#077E9E] hover:text-white' : 'border-[#8B1A1A] text-[#8B1A1A] hover:bg-[#8B1A1A] hover:text-white'}`} title={locked ? "Mở khóa" : "Khóa tài khoản"}>
                        {locked ? <Unlock size={14} /> : <Lock size={14} />}
                        <span className="text-xs font-semibold">{locked ? "Mở khóa" : "Khóa tài khoản"}</span>
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
            <h3 className="font-bold text-lg text-[#212121] mb-2">Khóa tài khoản?</h3>
            <p className="text-sm text-[#666666] mb-6">Bạn có chắc chắn muốn khóa tài khoản của <strong>{confirmModal.user?.name}</strong>? Người dùng sẽ không thể đăng nhập vào hệ thống.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmModal({ isOpen: false, user: null })} className="flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">Hủy</button>
              <button onClick={() => toggleLockUser(confirmModal.user?.id)} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">Xác nhận Khóa</button>
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
  const [filterSubject, setFilterSubject] = useState("Tất cả");
  const [filterYear, setFilterYear] = useState("Tất cả");
  const [filterTool, setFilterTool] = useState("Tất cả");
  const [selectedId, setSelectedId] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);
  const [confirmModal, setConfirmModal] = useState({ isOpen: false, mode: "delete", artId: null });
  const [galleryIdx, setGalleryIdx] = useState(null);
  const [galleryImages, setGalleryImages] = useState([]);
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
  }).filter(a => filterSubject === "Tất cả" ? true : a.subject === filterSubject)
    .filter(a => filterYear === "Tất cả" ? true : a.academicYear === filterYear);

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
    if (s === "Vi phạm") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Bị báo cáo") return "bg-red-50 text-[#8B1A1A] border border-[#F5C5C5]";
    if (s === "Đã ẩn") return "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]";
    if (s === "Nổi bật") return "bg-blue-50 text-[#077E9E] border border-[#B3D9E8]";
    return "bg-white text-[#212121] border border-[#E0E0E0]";
  };

  const statusText = (s) => {
    if (s === "Đang hiển thị") return "Công khai";
    if (s === "Bị báo cáo") return "Báo cáo";
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
              <h2 className="text-2xl font-bold text-[#212121]">Xử lý Ấn phẩm</h2>
              <p className="text-sm text-[#666666] mt-1">Xử lý vi phạm / báo cáo và quản lý trạng thái hiển thị</p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            {[
              { key: "all", label: "Tất cả" },
              { key: "reported", label: "Báo cáo" },
              { key: "pending", label: "Chờ duyệt" },
              { key: "hidden", label: "Đã ẩn" },
              { key: "highlight", label: "Nổi bật" },
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
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Tìm theo tên ấn phẩm, sinh viên, tags..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E]" />
            </div>
            <FilterSelect value={filterSubject} onChange={(e) => setFilterSubject(e.target.value)}>
              <option value="Tất cả">Môn học: Tất cả</option>
              <option value="Thiết kế TH">Thiết kế TH</option>
              <option value="Đồ hoạ ứng dụng">Đồ hoạ ứng dụng</option>
              <option value="Motion Design">Motion Design</option>
              <option value="UX/UI">UX/UI</option>
            </FilterSelect>
            <FilterSelect value={filterYear} onChange={(e) => setFilterYear(e.target.value)}>
              <option value="Tất cả">Năm học: Tất cả</option>
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </FilterSelect>
            <FilterSelect value={filterTool} onChange={(e) => setFilterTool(e.target.value)}>
              <option value="Tất cả">Công cụ: Tất cả</option>
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
                Ẩn đã chọn
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
                Bỏ chọn
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
                <span className="text-sm font-semibold text-[#212121]">{filtered.length} ấn phẩm</span>
              </div>
              {selectedIds.length > 0 && (
                <span className="text-sm text-[#666666]">Đã chọn {selectedIds.length}</span>
              )}
            </div>

            <div className="overflow-y-auto">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 z-10">
                  <tr>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-10"></th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Ấn phẩm / Sinh viên</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Môn học</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold">Ngày</th>
                    <th className="bg-[#F8F8F8] text-[#666666] px-4 py-3 text-xs uppercase tracking-wider font-semibold w-36">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((a) => (
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
                            {a.isPublic ? "Công khai" : "Riêng tư"}
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
                      <td colSpan={5} className="text-center py-12 text-[#666666]">Không có ấn phẩm phù hợp.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 bg-[#F8F8F8]">
            {!selected && (
              <div className="bg-white border border-[#E0E0E0] rounded-xl p-8 text-center text-[#666666]">
                Chọn một ấn phẩm để xem chi tiết
              </div>
            )}

            {selected && (
              <div className="bg-white border border-[#E0E0E0] rounded-xl overflow-hidden">
                <div className="p-5 border-b border-[#E0E0E0] flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Chi tiết ấn phẩm</p>
                    <h3 className="text-lg font-bold text-[#212121] truncate">{selected.title}</h3>
                    <p className="text-sm text-[#666666] mt-1">{selected.student}</p>
                  </div>
                  <button onClick={() => setSelectedId(null)} className="text-sm font-semibold text-[#666666] hover:text-[#212121] transition-colors">Đóng</button>
                </div>

                <div className="p-5">
                  <div className="rounded-xl overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] relative group cursor-pointer" onClick={() => {
                    const imgs = [selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean);
                    setGalleryImages(imgs);
                    setGalleryIdx(0);
                  }}>
                    <img src={selected.coverImageUrl} className="w-full h-64 object-cover" />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 text-sm font-semibold transition-opacity">Nhấp để phóng to</span>
                    </div>
                  </div>
                  {(selected.fileUrls || []).length > 0 && (
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {[selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean).map((url, idx) => (
                        <div key={idx} className="w-14 h-12 rounded-lg overflow-hidden border border-[#E0E0E0] bg-[#F8F8F8] cursor-pointer hover:border-[#077E9E] transition-colors" onClick={() => {
                          const imgs = [selected.coverImageUrl, ...(selected.fileUrls || [])].filter(Boolean);
                          setGalleryImages(imgs);
                          setGalleryIdx(idx);
                        }}>
                          <img src={url} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Môn học</p>
                      <p className="text-sm font-semibold text-[#212121]">{selected.subject}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Công cụ</p>
                      <p className="text-sm font-semibold text-[#212121]">{(selected.toolsUsed || []).join(", ") || "—"}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Trạng thái</p>
                      <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs px-2.5 py-1 rounded-full font-medium ${selected.isPublic ? "bg-white text-[#212121] border border-[#E0E0E0]" : "bg-[#F8F8F8] text-[#666666] border border-[#E0E0E0]"}`}>
                        {selected.isPublic ? <Check size={12} className="text-green-600" /> : <EyeOff size={12} />}
                        {selected.isPublic ? "Công khai" : "Riêng tư"}
                      </span>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Điểm</p>
                      <p className="text-sm font-semibold text-[#212121]">{selected.score ?? "Chưa chấm"}</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <a href={`${window.location.origin}/#/detail/${selected.id}`} target="_blank" rel="noopener noreferrer" className="text-sm text-[#077E9E] hover:text-[#055F78] font-semibold flex items-center gap-1.5 transition-colors">
                      <ExternalLink size={14} /> Xem chi tiết: {selected.title}
                    </a>
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-3 flex items-center gap-2">
                      <ShieldAlert size={14} /> Báo cáo vi phạm {reports.length > 0 && <span className="bg-[#8B1A1A] text-white text-[10px] px-2 py-0.5 rounded-full">{reports.length}</span>}
                    </p>
                    {reportsLoading ? (
                      <p className="text-sm text-[#666666]">Đang tải...</p>
                    ) : reports.length === 0 ? (
                      <p className="text-sm text-[#666666] bg-[#F8F8F8] rounded-lg p-3 border border-[#E0E0E0]">Chưa có báo cáo nào cho ấn phẩm này.</p>
                    ) : (
                      <div className="flex flex-col gap-3 max-h-[320px] overflow-y-auto">
                        {reports.map(r => (
                          <div key={r.id} className="bg-[#F8F8F8] rounded-lg p-3 border border-[#E0E0E0]">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-xs font-semibold text-[#8B1A1A] bg-red-50 px-2 py-0.5 rounded border border-[#F5C5C5]">{r.violationType}</span>
                              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.status === "pending" ? "bg-yellow-50 text-yellow-700 border border-yellow-200" : r.status === "resolved" ? "bg-green-50 text-green-700 border border-green-200" : "bg-gray-50 text-gray-500 border border-gray-200"}`}>
                                {r.status === "pending" ? "Chờ xử lý" : r.status === "resolved" ? "Đã xử lý" : "Đã bỏ qua"}
                              </span>
                            </div>
                            {r.detail && <p className="text-sm text-[#212121] mb-2">{r.detail}</p>}
                            <div className="flex items-center justify-between">
                              <p className="text-[10px] text-[#666666]">
                                Bởi {r.user?.fullName || r.user?.email || "Người dùng"} · {new Date(r.createdAt).toLocaleDateString("vi-VN")}
                              </p>
                              {r.status === "pending" && (
                                <div className="flex gap-1">
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "resolved").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "resolved" } : x)))} className="text-[10px] font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded border border-green-200 hover:bg-green-100 transition-colors cursor-pointer">Xử lý xong</button>
                                  <button onClick={() => api.artworks.updateReportStatus(selected.id, r.id, "dismissed").then(() => setReports(prev => prev.map(x => x.id === r.id ? { ...x, status: "dismissed" } : x)))} className="text-[10px] font-semibold text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">Bỏ qua</button>
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
                        <Check size={14} className="inline mr-1" /> Duyệt bài
                      </button>
                    ) : (
                      <button onClick={() => hideArtwork(selected.id)} className="py-2.5 rounded-lg border border-[#E0E0E0] bg-white text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] hover:text-[#212121] transition-colors">
                        Ẩn bài
                      </button>
                    )}
                    <button onClick={() => openConfirm("delete", selected.id)} className="py-2.5 rounded-lg border border-[#F5C5C5] bg-red-50 text-sm font-bold text-[#8B1A1A] hover:bg-red-100 transition-colors">
                      Xóa vĩnh viễn
                    </button>
                  </div>

                  <button onClick={() => toggleHighlight(selected.id, !selected.isHighlighted)} className={`mt-3 w-full py-2.5 rounded-lg text-sm font-semibold border transition-colors ${
                    selected.isHighlighted ? "bg-[#212121] text-white border-[#212121]" : "bg-[#E8F4F8] text-[#077E9E] border-[#B3D9E8] hover:bg-[#D9EEF6]"
                  }`}>
                    {selected.isHighlighted ? "Bỏ Highlight" : "Highlight ấn phẩm"}
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
            <h3 className="font-bold text-lg text-[#212121] mb-2">{confirmModal.mode === "hide" ? "Ẩn ấn phẩm?" : "Xóa ấn phẩm?"}</h3>
            <p className="text-sm text-[#666666] mb-6">
              {confirmModal.mode === "hide"
                ? "Ấn phẩm sẽ bị ẩn khỏi gallery công khai."
                : "Ấn phẩm sẽ bị xóa khỏi danh sách. Hành động này không thể hoàn tác trong prototype."}
            </p>
            <div className="flex gap-3">
              <button onClick={closeConfirm} className="flex-1 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">Hủy</button>
              <button onClick={confirmAction} className="flex-1 py-2 rounded-lg border-none bg-[#8B1A1A] text-sm font-semibold text-white hover:bg-opacity-90 transition-opacity cursor-pointer">Xác nhận</button>
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
            <h2 className="text-2xl font-bold text-[#212121]">Cấu hình xuất PDF Triển lãm</h2>
            <p className="text-sm text-[#666666] mt-1">
              Chọn bộ sưu tập & mở trang cấu hình tiền kỳ (pre-export): chỉnh tên tập san, lời tựa giám tuyển, kéo-thả thứ tự, chọn theme.
            </p>
          </div>
          <button
            onClick={() => onQuickCreateCollection && onQuickCreateCollection()}
            className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#077E9E] text-white rounded-xl font-bold hover:bg-[#055F78] transition-colors shadow-sm cursor-pointer w-full lg:w-auto"
          >
            <Plus size={18} />
            Tạo bộ sưu tập mới
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
                    <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-1">Bộ sưu tập</p>
                    <h3 className="text-lg font-bold text-[#212121] truncate">{c.name}</h3>
                    <p className="text-sm text-[#666666] mt-1">{c.items.length} tác phẩm · Theme: <span className="font-semibold text-[#212121]">{c.theme}</span></p>
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
                      Chưa có tác phẩm. Hãy “Lưu” từ Gallery/Detail để thêm vào bộ sưu tập.
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[11px] text-[#666666]">
                    * Ghi chú giám tuyển (note) sẽ ưu tiên in kèm khi export.
                  </span>
                  <span className="text-sm font-bold text-[#077E9E]">Mở cấu hình →</span>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); onOpenCatalogBuilder && onOpenCatalogBuilder(c); }}
                  className="mt-3 w-full py-2 rounded-lg bg-[#212121] text-white text-xs font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileDown size={14} /> Tạo tập san PDF
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CollectionExportConfigPage({ setPage, collection, onUpdateCollection }) {
  const [deleteMode, setDeleteMode] = useState(false);
  const [selectedForDelete, setSelectedForDelete] = useState([]);
  const [detailArtwork, setDetailArtwork] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [saved, setSaved] = useState(false);

  if (!collection) {
    return (
      <div className="flex h-screen overflow-hidden bg-white">
        <AdminSidebar active="admin_export" setPage={setPage} />
        <div className="flex-1 p-8">
          <p className="text-sm text-[#666666]">Không tìm thấy bộ sưu tập.</p>
          <button onClick={() => setPage("admin_export")} className="mt-4 px-4 py-2 rounded-lg border border-[#E0E0E0] text-sm font-semibold hover:bg-[#F8F8F8]">
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const detailedItems = collection.items
    .filter((it) => it.artwork);

  const reorder = (from, to) => {
    if (from === null || from === undefined) return;
    const next = [...collection.items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onUpdateCollection && onUpdateCollection({ items: next });
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
  };

  const linkToDetail = (artworkId) => {
    const url = `${window.location.origin}/#/detail/${artworkId}`;
    return url;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <AdminSidebar active="admin_export" setPage={setPage} />
      <div className="flex-1 overflow-y-auto p-8">
        <div className="flex items-start justify-between gap-6 mb-8 pb-6 border-b border-[#E0E0E0]">
          <div className="min-w-0 flex-1 max-w-xl">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Cấu hình bộ sưu tập</p>
            <input
              value={collection.name}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ name: e.target.value })}
              className="w-full text-2xl font-bold text-[#212121] bg-transparent border-none outline-none placeholder:text-[#ccc]"
              placeholder="Tên bộ sưu tập..."
            />
            <textarea
              value={collection.curatorEssay || ""}
              onChange={(e) => onUpdateCollection && onUpdateCollection({ curatorEssay: e.target.value })}
              className="w-full mt-2 text-sm text-[#666666] bg-transparent border-none outline-none resize-none placeholder:text-[#ccc]"
              rows={2}
              placeholder="Mô tả bộ sưu tập..."
            />
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => setPage("admin_export")} className="px-4 py-2.5 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">
              Quay lại
            </button>
            <button onClick={() => { onUpdateCollection && onUpdateCollection({ name: collection.name, curatorEssay: collection.curatorEssay, theme: collection.theme }); setSaved(true); setTimeout(() => setSaved(false), 2000); }} className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center gap-2 cursor-pointer ${saved ? "bg-green-600 text-white" : "bg-[#212121] text-white hover:opacity-90"}`}>
              <Check size={16} /> {saved ? "Đã lưu" : "Lưu thay đổi"}
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold text-[#212121]">
            {detailedItems.length} tác phẩm
          </p>
          <div className="flex items-center gap-2">
            {deleteMode && (
              <>
                <span className="text-sm text-[#666666]">Đã chọn {selectedForDelete.length}</span>
                <button onClick={executeDelete} disabled={selectedForDelete.length === 0} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${selectedForDelete.length > 0 ? "bg-[#8B1A1A] text-white" : "bg-[#E0E0E0] text-[#999]"}`}>
                  Xóa
                </button>
              </>
            )}
            <button onClick={toggleDeleteMode} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1.5 ${deleteMode ? "bg-[#8B1A1A] text-white border-[#8B1A1A]" : "bg-white text-[#666] border-[#E0E0E0] hover:border-[#8B1A1A] hover:text-[#8B1A1A]"}`}>
              <Trash2 size={14} /> {deleteMode ? "Thoát xóa" : "Xóa ấn phẩm"}
            </button>
          </div>
        </div>

        {/* Artwork Grid */}
        {detailedItems.length === 0 ? (
          <div className="text-sm text-[#666666] border border-dashed border-[#E0E0E0] rounded-xl p-8 text-center">
            Chưa có tác phẩm trong bộ sưu tập.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {detailedItems.map((it, idx) => (
              <div
                key={`${it.artworkId}-${idx}`}
                draggable
                onDragStart={() => setDragIndex(idx)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => { reorder(dragIndex, idx); setDragIndex(null); }}
                onDragEnd={() => setDragIndex(null)}
                onClick={() => setDetailArtwork(it)}
                className="group relative bg-white border border-[#E0E0E0] rounded-xl overflow-hidden hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer"
              >
                <div className="aspect-[4/3] bg-[#F8F8F8] overflow-hidden">
                  <img
                    src={it.artwork?.coverImageUrl || it.artwork?.img || ""}
                    alt={it.artwork?.title || ""}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    draggable={false}
                  />
                </div>
                <div className="p-3">
                  <p className="text-sm font-semibold text-[#212121] truncate">{it.artwork?.title || "Untitled"}</p>
                  <p className="text-xs text-[#666666] truncate">{it.artwork?.user?.fullName || it.artwork?.student || ""}</p>
                </div>
                {deleteMode && (
                  <div className="absolute top-2 left-2 z-10" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedForDelete.includes(it.artworkId)}
                      onChange={() => toggleSelectDelete(it.artworkId)}
                      className="w-5 h-5 accent-[#8B1A1A] cursor-pointer"
                    />
                  </div>
                )}
                {dragIndex !== idx && (
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#666]">
                    <GripVertical size={16} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Detail modal */}
        {detailArtwork && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setDetailArtwork(null)}>
            <div className="bg-white rounded-xl shadow-lg w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-5">
                <img src={detailArtwork.artwork?.coverImageUrl || detailArtwork.artwork?.img} alt={detailArtwork.artwork?.title} className="w-full h-40 object-cover rounded-lg mb-3" />
                <h3 className="text-lg font-bold text-[#212121]">{detailArtwork.artwork?.title}</h3>
                <p className="text-sm text-[#666666] mb-3">{detailArtwork.artwork?.user?.fullName || detailArtwork.artwork?.student}</p>
                {detailArtwork.note && <p className="text-sm text-[#444] bg-[#F8F8F8] rounded-lg p-3 mb-3"><span className="font-semibold">Ghi chú:</span> {detailArtwork.note}</p>}
                <a
                  href={linkToDetail(detailArtwork.artworkId)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#077E9E] hover:text-[#055F78] transition-colors"
                >
                  <ExternalLink size={14} /> Xem chi tiết ấn phẩm
                </a>
              </div>
              <div className="px-5 py-3 border-t border-[#E0E0E0] flex justify-end">
                <button onClick={() => setDetailArtwork(null)} className="px-4 py-2 rounded-lg text-sm font-semibold text-[#666] hover:bg-[#F8F8F8] transition-colors cursor-pointer">Đóng</button>
              </div>
            </div>
          </div>
        )}
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

    if (!form.lastName || !form.firstName) { setError("Vui lòng nhập họ và tên"); return; }
    if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError("Email không hợp lệ"); return; }
    if (form.password.length < 8) { setError("Mật khẩu phải có ít nhất 8 ký tự"); return; }
    if (form.password !== form.confirmPassword) { setError("Mật khẩu xác nhận không khớp"); return; }

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
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 300, lineHeight: 1.55, letterSpacing: "-0.3px", margin: "0 0 14px" }}>"Sáng tạo là kết nối mọi thứ với nhau." <br /><span style={{ fontSize: 16, opacity: 0.8 }}>Tham gia cộng đồng sáng tạo UEF</span></p>
        </div>
      </div>
      <div style={{ width: 480, background: "#fff", display: "flex", flexDirection: "column", justifyContent: "center", padding: "48px 56px", overflow: "auto" }}>
        <div style={{ width: "100%", maxWidth: 340, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}><img src="/logo-uef.png" alt="UEF" style={{ height: 30 }} /><span style={{ fontWeight: 700, fontSize: 16, color: BLACK }}>Design Gallery</span></div>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: "0 0 6px", letterSpacing: "-0.6px" }}>Tạo tài khoản mới</h1>
          <p style={{ fontSize: 13, color: MUTED, marginBottom: 24 }}>Tạo tài khoản để khám phá và kết nối với cộng đồng sáng tạo</p>

          {success ? (
            <div style={{ padding: 20, background: "#F0FFF0", borderRadius: 8, textAlign: "center" }}>
              <p style={{ color: "#2F855A", fontWeight: 600, fontSize: 14 }}>✓ Đăng ký thành công! Đang chuyển đến trang đăng nhập...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Họ</label>
                    <input type="text" value={form.lastName} onChange={updateField("lastName")} placeholder="Nguyễn" required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Tên</label>
                    <input type="text" value={form.firstName} onChange={updateField("firstName")} placeholder="Minh Anh" required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Email</label>
                  <input type="email" value={form.email} onChange={updateField("email")} placeholder="example@gmail.com" required style={{ width: "100%", padding: "11px 14px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Mật khẩu</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.password ? "text" : "password"} value={form.password} onChange={updateField("password")} placeholder="•••••••• (tối thiểu 8 ký tự, gồm chữ và số)" required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, password: !showPasswords.password })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.password ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 500, color: BLACK, display: "block", marginBottom: 6 }}>Xác nhận mật khẩu</label>
                  <div style={{ position: "relative" }}>
                    <input type={showPasswords.confirm ? "text" : "password"} value={form.confirmPassword} onChange={updateField("confirmPassword")} placeholder="••••••••" required style={{ width: "100%", padding: "11px 14px", paddingRight: 44, borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, fontSize: 13, outline: "none", boxSizing: "border-box", color: BLACK, background: GRAY_BG }} />
                    <button type="button" onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })} tabIndex={-1} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 6, color: MUTED }}>{showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                  </div>
                </div>
              </div>

              {error && <p style={{ color: "#E53E3E", fontSize: 12, marginTop: 12, textAlign: "center" }}>{error}</p>}

              <button type="submit" disabled={loading} style={{ width: "100%", padding: "13px", borderRadius: 8, border: "none", background: loading ? GRAY_LIGHT : CERULEAN, color: loading ? MUTED : "#fff", fontSize: 14, fontWeight: 600, marginTop: 16, cursor: loading ? "not-allowed" : "pointer" }}>
                {loading ? "Đang xử lý..." : "Đăng ký"}
              </button>
            </form>
          )}

          <p style={{ fontSize: 12, color: MUTED, textAlign: "center", marginTop: 20 }}>Đã có tài khoản? <span onClick={() => setPage("auth")} style={{ color: CERULEAN, cursor: "pointer", fontWeight: 600 }}>Đăng nhập</span></p>
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
            <span className="w-8 h-px bg-[#077E9E]"></span> Khoa Thiết kế Đồ họa
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            Nơi trưng bày<br />
            <span className="text-[#077E9E]">tác phẩm</span> thiết kế<br />
            của sinh viên UEF
          </h2>
          <div className="space-y-1 mb-10 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => setPage("gallery")} className="bg-[#077E9E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#066a85] transition-colors">
              Khám phá Gallery <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage("auth")} className="bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              Đăng nhập sinh viên
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-16">* Dành cho sinh viên đăng nhập bằng email của bạn</p>
          
          <div className="flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
            <div>
              <p className="text-3xl font-bold mb-1">500+</p>
              <p className="text-xs text-gray-500">Ấn phẩm trưng bày</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">120+</p>
              <p className="text-xs text-gray-500">Giảng viên tham gia</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">18</p>
              <p className="text-xs text-gray-500">Môn học</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">4 khoá</p>
              <p className="text-xs text-gray-500">Hành trình sáng tạo</p>
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
            <span className="w-6 h-px bg-[#077E9E]"></span> Tính năng cốt lõi
          </p>
          <h2 className="text-3xl font-extrabold mb-12">Mọi thứ bạn cần trong một nền tảng</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-8 rounded-2xl border border-[#077E9E] shadow-sm hover:shadow-md transition-shadow">
              <div className="w-10 h-10 bg-[#E8F4F8] text-[#077E9E] rounded-lg flex items-center justify-center mb-6">
                <Image size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Gallery Triển lãm</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Hiển thị toàn bộ ấn phẩm theo Masonry Layout, lọc theo môn học, năm học, công cụ và thể loại.</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <Image size={14} /> gallery
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <User size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Portfolio Cá nhân</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Mỗi sinh viên có trang portfolio riêng với URL chia sẻ, phù hợp gửi cho nhà tuyển dụng.</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <User size={14} /> portfolio cá nhân
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Star size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Điểm số & Nhận xét</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Giảng viên chấm điểm trực tiếp trên hệ thống. Sinh viên nhận thông báo và xem kết quả công khai hoặc ẩn.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Monitor size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Đa thiết bị</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Giao diện responsive, hiển thị hoàn hảo trên desktop, tablet và điện thoại di động.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Nổi bật & Tương tác</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Like, Bookmark ấn phẩm. Giảng viên highlight tác phẩm xuất sắc lên đầu Gallery.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">Kết nối Tuyển dụng</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Nhà tuyển dụng liên hệ sinh viên qua form -&gt; email chuyển tiếp thẳng đến @uef.edu.vn.</p>
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
                <span className="w-6 h-px bg-[#077E9E]"></span> Sản phẩm nổi bật
              </p>
              <h2 className="text-3xl font-extrabold">Khám phá ấn phẩm mới nhất</h2>
            </div>
            <button onClick={() => setPage("gallery")} className="text-sm font-semibold border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50">
              Xem toàn bộ Gallery &rsaquo;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {artworks.map((work, idx) => (
              <div key={work.id} className="group cursor-pointer">
                <div className={`rounded-xl overflow-hidden mb-4 relative ${idx % 2 === 0 ? 'aspect-square' : 'aspect-[4/5]'}`}>
                  <img src={work.img} alt={work.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {idx === 0 && (
                    <div className="absolute top-3 left-3 bg-[#077E9E] text-white text-[10px] font-bold px-2 py-1 rounded">Nổi bật</div>
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
            <span className="w-6 h-px bg-[#077E9E]"></span> Hướng dẫn
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-16">Bắt đầu chỉ trong 3 bước</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">1</div>
              <h3 className="font-bold mb-2">Đăng nhập</h3>
              <p className="text-sm text-gray-500">Dùng email của bạn để đăng nhập vào hệ thống</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">2</div>
              <h3 className="font-bold mb-2">Đăng tải ấn phẩm</h3>
              <p className="text-sm text-gray-500">Upload ảnh/PDF kèm thông tin môn học, công cụ và mô tả</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">3</div>
              <h3 className="font-bold mb-2">Chia sẻ Portfolio</h3>
              <p className="text-sm text-gray-500">Nhận link portfolio cá nhân để gửi cho nhà tuyển dụng</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#1A1A1A] text-white px-8 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-3">Sẵn sàng trưng bày tác phẩm của bạn?</h2>
            <p className="text-gray-400">Dành cho sinh viên Thiết kế Đồ họa UEF — đăng nhập ngay hôm nay</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPage("auth")} className="bg-[#077E9E] hover:bg-[#066a85] text-white px-8 py-3 rounded-lg font-bold transition-colors">Đăng nhập ngay</button>
            <button onClick={() => setPage("gallery")} className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-colors">Xem Gallery</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-10 px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-gray-800 text-white font-serif font-bold w-8 h-8 flex items-center justify-center rounded">UEF</div>
            <div>
              <p className="font-bold text-white">UEF Design Gallery - Khoa Thiết kế Đồ họa</p>
              <p className="text-xs mt-1">© 2024 Trương Vĩnh Ký - Khóa 21 - Tài chính TP.HCM</p>
            </div>
          </div>
          <div className="flex gap-6">
            <button onClick={() => setPage("gallery")} className="hover:text-white">Gallery</button>
            <button onClick={() => setPage("about")} className="hover:text-white">Giới thiệu Khoa</button>
            <a href="#" className="hover:text-white">Liên hệ</a>
            <a href="#" className="hover:text-white">Chính sách</a>
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
  const [audience, setAudience] = useState("student");
  const audienceData = [
    { key: "student", label: "Sinh viên", icon: <Users size={20} />, color: "#077E9E", bg: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1400&q=80", headline: "Nơi Sáng Tạo Của Bạn Được Tỏa Sáng", desc: "Khoa Thiết kế Đồ họa UEF trang bị cho bạn tư duy thiết kế, kỹ năng công cụ và portfolio chuyên nghiệp để tự tin bước vào ngành công nghiệp sáng tạo." },
    { key: "employer", label: "Nhà tuyển dụng", icon: <Briefcase size={20} />, color: "#055F78", bg: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1400&q=80", headline: "Săn Lùng Tài Năng Thiết Kế Trẻ", desc: "Khám phá những ấn phẩm xuất sắc nhất từ sinh viên Thiết kế Đồ họa UEF — nguồn nhân lực thiết kế chất lượng cao cho doanh nghiệp của bạn." },
    { key: "lecturer", label: "Giảng viên", icon: <PenTool size={20} />, color: "#8B1A1A", bg: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?w=1400&q=80", headline: "Đồng Hành Cùng Thế Hệ Nhà Thiết Kế", desc: "Tham gia đội ngũ giảng viên Khoa Thiết kế Đồ họa UEF — nơi bạn có thể truyền cảm hứng và định hướng cho những tài năng trẻ." },
  ];
  const current = audienceData.find((a) => a.key === audience) || audienceData[0];

  return (
    <div className="bg-white min-h-screen font-sans w-full">
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={current.bg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${current.color}dd 0%, rgba(0,0,0,0.7) 100%)` }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 z-10">
          <div className="flex mb-8 gap-2">{audienceData.map((a) => (<button key={a.key} onClick={() => setAudience(a.key)} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${audience === a.key ? "bg-white text-[#212121] shadow-lg" : "bg-white/15 text-white hover:bg-white/25"}`}>{a.icon} {a.label}</button>))}</div>
          <p className="text-white/80 font-semibold text-xs tracking-wider uppercase mb-3">Khoa Thiết Kế Đồ Họa</p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5 leading-tight">{current.headline}</h1>
          <p className="text-white/85 max-w-2xl leading-relaxed text-[15px] md:text-base mb-10">{current.desc}</p>
          <div className="flex flex-wrap items-center gap-8 md:gap-16 border-t border-white/20 pt-8">
            <div><p className="text-4xl font-bold tracking-tight text-white mb-1">500+</p><p className="text-sm text-white/70">Ấn phẩm trưng bày</p></div>
            <div><p className="text-4xl font-bold tracking-tight text-white mb-1">12</p><p className="text-sm text-white/70">Giảng viên chuyên môn</p></div>
            <div><p className="text-4xl font-bold tracking-tight text-white mb-1">1,200+</p><p className="text-sm text-white/70">Sinh viên theo học</p></div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        {audience === "student" && (<>
          <section className="mb-20"><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Chương trình đào tạo</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Hành Trình Trở Thành Nhà Thiết Kế Chuyên Nghiệp</h2><p className="text-gray-600 mb-10 max-w-3xl leading-relaxed text-[15px]">Từ năm nhất đến tốt nghiệp, bạn sẽ được trang bị toàn diện: tư duy thẩm mỹ, kỹ năng công cụ chuẩn ngành, và portfolio đủ mạnh để ứng tuyển.</p><div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12"><MajorCard title="Thiết kế đồ họa Truyền thông" desc="Brand identity, print design, packaging, typography và visual communication." /><MajorCard title="Thiết kế Kỹ thuật số & UI/UX" desc="Web design, mobile app, user experience và interactive design." /><MajorCard title="Motion Graphics & Video" desc="Animation, motion design, video editing và visual effects." /><MajorCard title="Minh họa & Nghệ thuật 3D" desc="Digital illustration, concept art, character design và 3D modeling." /></div><button onClick={() => setPage("gallery")} className="w-full py-4 bg-[#077E9E] hover:bg-[#055F78] text-white rounded-xl font-semibold transition-colors">Khám phá Gallery ấn phẩm sinh viên →</button></section>
          <section className="mb-20"><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Đội ngũ giảng viên</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Những Người Thầy Dẫn Đường</h2><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">{lecturers.map((lec) => (<div key={lec.email} className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-lg hover:border-[#077E9E] transition-all"><div className="flex items-center gap-4"><img src={lec.img} alt={lec.name} className="w-14 h-14 rounded-full object-cover border border-gray-200" /><div><p className="text-gray-900 font-bold text-sm">{lec.name}</p><p className="text-[#077E9E] text-xs font-semibold">{lec.title}</p></div></div></div>))}</div><div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">{lecturersList.slice(0, 3).map((lec) => (<LecturerCard key={lec.name} {...lec} avatar={lec.img} />))}</div></section>
          <section className="mb-20"><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Cơ sở vật chất</p><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">{facilitiesList.map((f) => { const I = f.icon; return (<div key={f.title} className="bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-[#077E9E] transition-all"><div className="h-44 bg-gray-100 overflow-hidden"><img src={f.img} alt={f.title} className="w-full h-full object-cover" /></div><div className="p-6"><div className="flex items-start gap-4 mb-3"><div className="w-12 h-12 rounded-xl bg-[#077E9E]/10 flex items-center justify-center flex-shrink-0"><I className="w-6 h-6 text-[#077E9E]" /></div><div><h3 className="text-gray-900 font-bold">{f.title}</h3><p className="text-gray-500 text-sm leading-relaxed mt-1">{f.desc}</p></div></div></div></div>); })}</div></section>
        </>)}
        {audience === "employer" && (<>
          <section className="mb-20"><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Dành cho Nhà tuyển dụng</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Tìm Kiếm Tài Năng Thiết Kế Trẻ?</h2><p className="text-gray-600 mb-10 max-w-3xl leading-relaxed text-[15px]">Hơn 500 ấn phẩm đồ án từ sinh viên Thiết kế Đồ họa UEF — chất lượng đã qua đánh giá của giảng viên. Dễ dàng tìm kiếm ứng viên theo kỹ năng, môn học và năm tốt nghiệp.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">{[{ icon: <Search size={24} />, title: "Duyệt Portfolio", desc: "Xem hồ sơ năng lực và bộ sưu tập tác phẩm của từng sinh viên." }, { icon: <MessageSquare size={24} />, title: "Liên hệ trực tiếp", desc: "Gửi tin nhắn tuyển dụng qua hệ thống." }, { icon: <Star size={24} />, title: "Gợi ý thông minh", desc: "Bộ lọc theo kỹ năng, công cụ, môn học." }].map((item) => (<div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#077E9E] transition-all"><div className="w-12 h-12 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-5 text-[#077E9E]">{item.icon}</div><h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p></div>))}</div><button onClick={() => setPage("gallery")} className="w-full py-4 bg-[#077E9E] hover:bg-[#055F78] text-white rounded-xl font-semibold transition-colors">Khám phá Gallery ấn phẩm →</button></section>
        </>)}
        {audience === "lecturer" && (<>
          <section className="mb-20"><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Dành cho Giảng viên</p><h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Công Cụ Giảng Dạy & Quản Lý Đồ Án</h2><p className="text-gray-600 mb-10 max-w-3xl leading-relaxed text-[15px]">Hệ thống Portfolio UEF giúp giảng viên chấm điểm, nhận xét trực tiếp trên tác phẩm, quản lý lớp học và xuất bộ sưu tập triển lãm.</p><div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">{[{ icon: <Check size={24} />, title: "Chấm điểm & Nhận xét", desc: "Đánh giá trực tiếp trên từng ấn phẩm." }, { icon: <Folder size={24} />, title: "Quản lý lớp học", desc: "Xem danh sách lớp, theo dõi tiến độ nộp bài." }, { icon: <FileDown size={24} />, title: "Xuất PDF Triển lãm", desc: "Tạo bộ sưu tập, kéo thả sắp xếp và xuất tập san." }].map((item) => (<div key={item.title} className="bg-white border border-gray-200 rounded-2xl p-8 hover:shadow-lg hover:border-[#077E9E] transition-all"><div className="w-12 h-12 bg-[#E8F4F8] rounded-xl flex items-center justify-center mb-5 text-[#077E9E]">{item.icon}</div><h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3><p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p></div>))}</div><button onClick={() => setPage("gallery")} className="w-full py-4 bg-[#077E9E] hover:bg-[#055F78] text-white rounded-xl font-semibold transition-colors">Xem Gallery ấn phẩm sinh viên →</button></section>
        </>)}
        <section className="pt-8 border-t border-gray-200"><div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24"><div><p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Liên hệ</p><h2 className="text-3xl font-bold text-gray-900 mb-8">Kết nối với Khoa Thiết kế Đồ họa</h2><div className="space-y-6"><div className="flex items-start gap-4"><div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><MapPin className="w-5 h-5 text-[#077E9E]" /></div><div><p className="text-sm font-bold text-gray-900 mb-1">Địa chỉ</p><p className="text-sm text-gray-600">141-145 Điện Biên Phủ, Phường 15, Q. Bình Thạnh, TP.HCM</p></div></div><div className="flex items-start gap-4"><div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><Mail className="w-5 h-5 text-[#077E9E]" /></div><div><p className="text-sm font-bold text-gray-900 mb-1">Email</p><a href="mailto:khoathietke@uef.edu.vn" className="text-sm text-gray-600 hover:text-[#077E9E]">khoathietke@uef.edu.vn</a></div></div><div className="flex items-start gap-4"><div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0"><Phone className="w-5 h-5 text-[#077E9E]" /></div><div><p className="text-sm font-bold text-gray-900 mb-1">Điện thoại</p><p className="text-sm text-gray-600">(028) 5422 5555</p></div></div></div></div><div className="bg-white border border-gray-200 rounded-2xl p-8 md:p-10"><h3 className="text-xl font-bold text-gray-900 mb-6">Gửi tin nhắn cho chúng tôi</h3><form className="space-y-4"><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className="block text-sm font-medium text-gray-900 mb-2">Họ tên</label><input placeholder="Nguyễn Văn A" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#077E9E]" /></div><div><label className="block text-sm font-medium text-gray-900 mb-2">Email</label><input type="email" placeholder="email@company.com" className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#077E9E]" /></div></div><div><label className="block text-sm font-medium text-gray-900 mb-2">Nội dung</label><textarea rows={4} placeholder="Mô tả nhu cầu..." className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm outline-none focus:border-[#077E9E] resize-none" /></div><button className="w-full py-3 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-[#055F78] transition-colors">Gửi tin nhắn</button></form></div></div></section>
      </div>
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
              <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider">Lưu vào bộ sưu tập</p>
              <p className="text-sm font-bold text-[#212121] truncate">{artwork.title}</p>
              <p className="text-xs text-[#666666] truncate">{artwork.student || artwork.user?.fullName || ""}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-[#E0E0E0] bg-white hover:bg-[#F8F8F8] transition-colors flex items-center justify-center text-[#666666]"
            title="Đóng"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 sm:px-6 py-5">
          {/* collections */}
          <div className="mb-4">
            <p className="text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">Chọn bộ sưu tập</p>
            <div className="max-h-44 overflow-auto pr-1 space-y-2">
              {collections.map((c) => (
                <label
                  key={c.id}
                  className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl border border-[#E0E0E0] hover:border-[#B3D9E8] hover:bg-[#F0F8FB] transition-colors cursor-pointer"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#212121] truncate">{c.name}</p>
                    <p className="text-[11px] text-[#666666]">{c.items.length} tác phẩm</p>
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
                  <Plus size={16} /> + Tạo bộ sưu tập mới
                </button>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submitCreate()}
                    placeholder="Tên bộ sưu tập…"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]"
                  />
                  <button
                    onClick={submitCreate}
                    className="px-3 py-2 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors"
                  >
                    Tạo
                  </button>
                  <button
                    onClick={() => {
                      setCreating(false);
                      setNewName("");
                    }}
                    className="px-3 py-2 rounded-xl border border-[#E0E0E0] text-sm font-semibold text-[#666666] hover:bg-[#F8F8F8] transition-colors"
                  >
                    Hủy
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* curator note */}
          <div className="mb-2">
            <label className="block text-xs font-semibold text-[#666666] uppercase tracking-wider mb-2">
              Ghi chú của giám tuyển
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ghi nhận xét chuyên môn riêng (sẽ lưu vào COLLECTION_ITEMS.note và ưu tiên in kèm khi xuất PDF)…"
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
            Đóng
          </button>
          <button
            onClick={() => onSave && onSave({ artworkId: artwork.id, selectedCollectionIds: selectedIds, note })}
            className="px-4 py-2.5 rounded-xl bg-[#077E9E] text-white text-sm font-bold hover:bg-[#055F78] transition-colors"
          >
            Lưu thay đổi
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
      setMessage({ type: "success", text: "Đã lưu cài đặt portfolio!" });
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối" });
    } finally {
      setSaving(false);
    }
  };

  if (!loaded) return <div className="flex h-screen items-center justify-center text-[#666666]">Đang tải...</div>;

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <DashboardSidebar activePage="portfolio_settings" setPage={setPage} userData={userData} />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#212121] mb-2">Cài đặt Portfolio</h2>
          <p className="text-[#666666] text-sm mb-8">Quản lý cách hiển thị hồ sơ năng lực của bạn với nhà tuyển dụng.</p>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>{message.text}</div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">Thông tin cơ bản</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Đường dẫn Portfolio (Slug)</label>
                <div className="flex items-center">
                  <span className="px-4 py-2 bg-[#F8F8F8] border border-r-0 border-[#E0E0E0] rounded-l-lg text-[#666666] text-sm">portfoliohub.uef.edu.vn/</span>
                  <input type="text" value={settings.portfolioSlug} onChange={(e) => setSettings({ ...settings, portfolioSlug: e.target.value })} className="flex-1 px-4 py-2 border border-[#E0E0E0] rounded-r-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Tiêu đề nghề nghiệp (Profile Headline)</label>
                <input type="text" value={settings.profileHeadline} onChange={(e) => setSettings({ ...settings, profileHeadline: e.target.value })} placeholder="Graphic Designer & Visual Artist" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Chuyên ngành</label>
                <select value={settings.major || ""} onChange={(e) => setSettings({ ...settings, major: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E] bg-white">
                  <option value="">Chọn chuyên ngành</option>
                  <option value="Thiết kế Đồ họa">Thiết kế Đồ họa</option>
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
                <label className="block text-sm font-medium text-[#212121] mb-2">Năm học</label>
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
            <h3 className="font-bold text-[#212121] mb-4">Mạng xã hội</h3>
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
            <h3 className="font-bold text-[#212121] mb-1">Ấn phẩm tiêu biểu</h3>
            <p className="text-sm text-[#666666] mb-4">Chọn tối đa 4 tác phẩm để hiển thị ở đầu portfolio.</p>
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
              {settings.featuredArtworkIds?.length ? "Thay đổi ấn phẩm" : "Chọn ấn phẩm tiêu biểu"} ({(settings.featuredArtworkIds || []).length}/4)
            </button>
          </div>

          <div id="featPicker" className="hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) e.currentTarget.classList.add('hidden'); }}>
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[80vh] overflow-y-auto p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-[#212121]">Chọn ấn phẩm tiêu biểu</h3>
                <button onClick={() => document.getElementById('featPicker')?.classList.add('hidden')} className="text-[#666666] hover:text-[#212121] cursor-pointer"><X size={20} /></button>
              </div>
              <p className="text-sm text-[#666666] mb-4">Chọn tối đa 4 tác phẩm (đã chọn {(settings.featuredArtworkIds || []).length}/4)</p>
              {myArtworks.length === 0 ? (
                <div className="text-center py-10 text-[#666666] text-sm">Bạn chưa có ấn phẩm công khai nào. <a href="/#/upload" className="text-[#077E9E] hover:underline font-semibold">Đăng ấn phẩm mới</a></div>
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
              <button onClick={() => document.getElementById('featPicker')?.classList.add('hidden')} className="mt-4 w-full py-2.5 rounded-lg bg-[#077E9E] text-white font-semibold cursor-pointer">Xác nhận</button>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-[#212121] mb-1">Trạng thái Portfolio</h3>
              <p className="text-sm text-[#666666]">Chuyển sang "Riêng tư" nếu bạn không muốn ai xem được portfolio này.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.isPortfolioPublic} onChange={(e) => setSettings({ ...settings, isPortfolioPublic: e.target.checked })} />
              <div className="w-11 h-6 bg-[#E0E0E0] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#077E9E]"></div>
            </label>
          </div>

            <div className="flex items-center gap-4">
              <button onClick={save} disabled={saving} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">{saving ? "Đang lưu..." : "Lưu cài đặt"}</button>
              <a href={`${window.location.origin}/#/portfolio${settings.portfolioSlug ? '/' + settings.portfolioSlug : ''}`} target="_blank" rel="noopener noreferrer" className="px-6 py-2 border border-[#077E9E] text-[#077E9E] rounded-lg font-bold hover:bg-[#F0F8FB] transition-colors">
                <ExternalLink size={16} className="inline mr-1.5" />Xem Portfolio
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
        setMessage({ type: "success", text: "Đã cập nhật thông tin!" });
        setPendingAvatar(null);
        setProfile(p => ({ ...p, avatarUrl: data.user?.avatarUrl || p.avatarUrl }));
        refreshSession();
        setTimeout(() => refreshSession(), 300);
      } else if (res.status === 401) {
        setMessage({ type: "error", text: "Phiên đăng nhập hết hạn" });
      } else {
        setMessage({ type: "error", text: data.error || "Lỗi cập nhật" });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối" });
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async () => {
    if (!passwords.current || !passwords.newPass || !passwords.confirm) {
      setMessage({ type: "error", text: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
    if (passwords.newPass.length < 8) {
      setMessage({ type: "error", text: "Mật khẩu mới phải có ít nhất 8 ký tự" });
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setMessage({ type: "error", text: "Mật khẩu xác nhận không khớp" });
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
        setMessage({ type: "success", text: "Đổi mật khẩu thành công!" });
        setPasswords({ current: "", newPass: "", confirm: "" });
      } else {
        setMessage({ type: "error", text: data.error || "Đổi mật khẩu thất bại" });
      }
    } catch {
      setMessage({ type: "error", text: "Lỗi kết nối" });
    } finally {
      setChangingPass(false);
    }
  };

  if (!loaded) {
    return <div className="flex h-screen items-center justify-center text-[#666666]">Đang tải thông tin...</div>;
  }

  return (
    <div className="flex min-h-screen bg-[#F8F8F8]">
      <DashboardSidebar activePage="settings" setPage={setPage} userData={userData} />

      <div className="flex-1 overflow-y-auto p-10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-[#212121] mb-2">Cài đặt Tài khoản</h2>
          <p className="text-[#666666] text-sm mb-8">Quản lý thông tin cá nhân và bảo mật tài khoản.</p>

          {message.text && (
            <div className={`mb-6 px-4 py-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-800" : "bg-red-50 text-red-800"}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-6">
            <h3 className="font-bold text-[#212121] mb-4">Ảnh đại diện</h3>
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
            <h3 className="font-bold text-[#212121] mb-4">Thông tin cá nhân</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Họ và Tên</label>
                  <input type="text" value={profile.fullName} onChange={(e) => setProfile({ ...profile, fullName: e.target.value })} className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Mã Sinh viên</label>
                  <input type="text" value={profile.studentId} disabled className="w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Địa chỉ Email</label>
                <input type="email" value={profile.email} disabled className="w-full px-4 py-2 border border-[#E0E0E0] bg-[#F8F8F8] text-[#666666] rounded-lg text-sm outline-none cursor-not-allowed" />
              </div>
            </div>
          </div>

          <div className="bg-white border border-[#E0E0E0] rounded-xl p-6 mb-8">
            <h3 className="font-bold text-[#212121] mb-4">Đổi mật khẩu</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#212121] mb-2">Mật khẩu hiện tại</label>
                <input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Mật khẩu mới</label>
                  <input type="password" value={passwords.newPass} onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#212121] mb-2">Xác nhận mật khẩu mới</label>
                  <input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })} placeholder="••••••••" className="w-full px-4 py-2 border border-[#E0E0E0] rounded-lg text-sm outline-none focus:border-[#077E9E] focus:ring-1 focus:ring-[#077E9E]" />
                </div>
              </div>
              <button onClick={changePassword} disabled={changingPass} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
                {changingPass ? "Đang xử lý..." : "Đổi mật khẩu"}
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={saveProfile} disabled={saving} className="px-6 py-2 bg-[#077E9E] text-white rounded-lg font-bold hover:bg-opacity-90 transition-opacity cursor-pointer disabled:opacity-50">
              {saving ? "Đang lưu..." : "Lưu thay đổi"}
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
                <h3 className="text-[#212121] font-medium text-base">Dashboard Sinh viên</h3>
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
                <h3 className="text-[#212121] font-medium text-base">Cài đặt Tài khoản</h3>
              </div>
              <p className="text-[#666666] text-xs">Tùy chỉnh thông tin cá nhân và bảo mật</p>
            </div>
            <div onClick={() => setPage("portfolio_settings")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <Briefcase size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Cài đặt Portfolio</h3>
              </div>
              <p className="text-[#666666] text-xs">Trạng thái công khai và link mạng xã hội</p>
            </div>
            <div onClick={() => setPage("messages")} className="bg-[#FFFFFF] border border-[#E0E0E0] rounded-lg p-5 hover:-translate-y-1 hover:shadow-md hover:border-[#077E9E] transition-all cursor-pointer">
              <div className="flex items-center gap-3 mb-2">
                <MessageSquare size={20} className="text-[#077E9E]" />
                <h3 className="text-[#212121] font-medium text-base">Hộp thư đến</h3>
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
      <h2 style={{ fontSize: 24, fontWeight: 700, color: BLACK, margin: 0 }}>Truy cập bị từ chối</h2>
      <p style={{ fontSize: 14, color: MUTED, textAlign: "center", maxWidth: 400, lineHeight: 1.6 }}>
        Bạn không có quyền truy cập trang này. Vui lòng đăng nhập với tài khoản có quyền phù hợp.
      </p>
      <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
        <button onClick={() => setPage("home")} style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: CERULEAN, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Về trang chủ</button>
        <button onClick={() => setPage("auth")} style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${GRAY_LIGHT}`, background: "#fff", color: BLACK, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Đăng nhập</button>
      </div>
    </div>
  );
}

function TimelineSection() {
  const timelineData = [
    { id: 1, year: "2023", monthLabel: "T9", month: "Tháng 9", title: "Đồ án nhập môn lập trình", description: "Hoàn thành đồ án Quản lý Thư viện bằng C++ với kiến trúc OOP. Đạt 9.5/10 và được giảng viên chọn làm mẫu cho khoá sau.", tags: ["C++", "OOP", "Xuất sắc"], link: "https://example.com/do-an-2023", linkLabel: "Xem đồ án →", monthColor: "#dbeafe", monthText: "#1e40af" },
    { id: 2, year: "2024", monthLabel: "T3", month: "Tháng 3", title: "Giải Nhất NCKH cấp Trường", description: "Nghiên cứu ứng dụng AI trong phân tích cảm xúc văn bản tiếng Việt. Đạt giải Nhất và được chọn tham dự cấp Bộ.", tags: ["Nghiên cứu", "AI/NLP", "Giải Nhất"], link: "https://example.com/nckh-2024", linkLabel: "Xem báo cáo →", monthColor: "#dcfce7", monthText: "#166534" },
    { id: 3, year: "2024", monthLabel: "T8", month: "Tháng 8", title: "Công bố bài báo IEEE", description: "Đồng tác giả bài báo 'Sentiment Analysis for Vietnamese E-commerce Reviews' đăng trên hội nghị IEEE RIVF 2024.", tags: ["IEEE", "Công bố QT", "NLP"], link: "https://example.com/ieee-paper", linkLabel: "Xem bài báo →", monthColor: "#f3e8ff", monthText: "#6b21a8" },
    { id: 4, year: "2025", monthLabel: "T2", month: "Tháng 2", title: "Thực tập tại FPT Software", description: "Tham gia team Frontend phát triển hệ thống quản lý nội bộ. Đánh giá thực tập: Xuất sắc (9.0/10).", tags: ["Thực tập", "React", "FPT"], link: "https://example.com/fpt-intern", linkLabel: "Xem chứng nhận →", monthColor: "#fef3c7", monthText: "#92400e" },
    { id: 5, year: "2025", monthLabel: "T6", month: "Tháng 6", title: "Học bổng Toàn phần kỳ 6", description: "Đạt học bổng toàn phần học kỳ 6 nhờ duy trì GPA 3.8/4.0 và thành tích nghiên cứu xuất sắc.", tags: ["Học bổng", "GPA 3.8", "Toàn phần"], link: "https://example.com/scholarship", linkLabel: "Xem quyết định →", monthColor: "#fce7f3", monthText: "#9d174d" },
    { id: 6, year: "2026", monthLabel: "T5", month: "Tháng 5", title: "Tốt nghiệp Thủ khoa", description: "Tốt nghiệp loại Xuất sắc với đồ án 'Hệ thống gợi ý học tập thích ứng'. Điểm bảo vệ: 9.8/10.", tags: ["Thủ khoa", "Xuất sắc", "Đồ án"], link: "https://example.com/thesis", linkLabel: "Xem đồ án tốt nghiệp →", monthColor: "#ccfbf1", monthText: "#0f766e" },
  ];

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
          <h2 className="text-2xl sm:text-3xl font-extrabold text-black tracking-tight">Hành trình thành tích</h2>
          <p className="text-sm text-muted mt-2 max-w-lg">
            Những cột mốc đáng nhớ trên chặng đường học tập và nghiên cứu.
          </p>
        </div>
      </div>

      <div className="relative">
        <div className="relative h-[400px] md:h-[440px] flex items-center justify-center mb-6" style={{ background: GRAY_BG, borderRadius: 24, border: `1px solid ${GRAY_LIGHT}` }}>
          <div ref={cardsRef} className="relative w-full max-w-[420px] h-full flex items-center justify-center">
            {timelineData.map((item, i) => {
              const cardStyle = getCardClass(i);
              return (
                <div key={item.id} className="absolute inset-0 flex items-center justify-center px-4"
                  style={{ transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.5s cubic-bezier(0.4,0,0.2,1)', ...cardStyle }}>
                  <div className="w-full max-w-[400px]" style={{ background: BLACK, color: '#fff', padding: '32px 36px', borderRadius: 24, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }}>
                    <div className="flex items-start justify-between mb-6">
                      <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ background: item.monthColor, color: item.monthText }}>
                        {item.month} {item.year}
                      </span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-bold mb-3 leading-snug">{item.title}</h3>
                    <p className="text-sm leading-relaxed mb-6" style={{ color: '#9ca3af' }}>
                      {item.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.tags.map(t => (
                        <span key={t} className="text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
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
      setCollections(Array.isArray(data) ? data : []);
      setCollectionsLoading(false);
    }).catch(() => setCollectionsLoading(false));
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
    setToast({ title: "Đã tạo bộ sưu tập", message: name });
    api.collections.create({ collectionName: name }).catch(() => {});
    return name;
  };

  const saveToCollections = async ({ artworkId, selectedCollectionIds, note }) => {
    const prevCollections = [...collections];
    setCollections((prev) =>
      prev.map((c) => {
        const has = c.items.some((it) => it.artworkId === artworkId);
        const shouldHave = selectedCollectionIds.includes(c.id);
        if (shouldHave) {
          const nextItems = has
            ? c.items.map((it) => (it.artworkId === artworkId ? { ...it, note } : it))
            : [...c.items, { artworkId, note }];
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
    setToast({ title: "Đã lưu vào bộ sưu tập", message: "Đã cập nhật ghi chú giám tuyển." });

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
