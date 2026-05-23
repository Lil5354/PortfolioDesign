import { useState } from "react";
import { LecturerCard } from "./components/ui/LecturerCard";
import { MajorCard } from "./components/ui/MajorCard";
import { MapPin, Mail, Phone, Globe, ArrowRight } from "lucide-react";

// ─── Design Tokens (đồng bộ với prototype chính) ──────────────────────────────
const C = {
  bg:        "#FFFFFF",
  bgLight:   "#F8F8F8",
  border:    "#E0E0E0",
  text:      "#212121",
  muted:     "#666666",
  cta:       "#077E9E",
  ctaDark:   "#055F78",
  danger:    "#8B1A1A",
  dangerBg:  "#FFF5F5",
};

// ─── Shared SVG Icon Kit (lucide-style, stroke only) ──────────────────────────
const Icon = ({ name, size = 16, color = C.muted, strokeWidth = 1.75 }) => {
  const s = { width: size, height: size, display: "inline-block", flexShrink: 0 };
  const p = { fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    eye:        <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
    lock:       <><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
    mail:       <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></>,
    user:       <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
    settings:   <><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></>,
    link:       <><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" /></>,
    globe:      <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></>,
    camera:     <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
    penTool:    <><path d="m12 19 7-7 3 3-7 7-3-3z" /><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" /><path d="m2 2 7.586 7.586" /><circle cx="11" cy="11" r="2" /></>,
    bookmark:   <><path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" /></>,
    trash:      <><polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" /></>,
    photo:      <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></>,
    bell:       <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
    chart:      <><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></>,
    users:      <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></>,
    check:      <><polyline points="20 6 9 17 4 12" /></>,
    chevDown:   <><polyline points="6 9 12 15 18 9" /></>,
    logIn:      <><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></>,
    grid:       <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
    fileText:   <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></>,
    shield:     <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></>,
    upload:     <><polyline points="16 16 12 12 8 16" /><line x1="12" y1="12" x2="12" y2="21" /><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" /></>,
  };
  return (
    <svg viewBox="0 0 24 24" style={s} {...p}>
      {paths[name]}
    </svg>
  );
};

// ─── Toggle Switch ─────────────────────────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <div
      onClick={() => onChange(!on)}
      style={{
        width: 42, height: 24, borderRadius: 12,
        background: on ? C.cta : C.border,
        cursor: "pointer", position: "relative",
        transition: "background 0.2s", flexShrink: 0,
      }}
    >
      <div style={{
        position: "absolute", top: 3, left: on ? 21 : 3,
        width: 18, height: 18, borderRadius: "50%",
        background: "#fff", transition: "left 0.2s",
        boxShadow: "0 1px 4px rgba(0,0,0,0.18)",
      }} />
    </div>
  );
}

// ─── Shared NavBar ─────────────────────────────────────────────────────────────
function NavBar({ page, setPage }) {
  const tabs = [
    ["auth",     "Đăng nhập"],
    ["settings", "Cài đặt"],
    ["admin",    "Quản trị GV"],
    ["about",    "Giới thiệu"],
  ];
  return (
    <nav style={{
      background: C.bg, borderBottom: `1px solid ${C.border}`,
      padding: "0 40px", display: "flex", alignItems: "center",
      justifyContent: "space-between", height: 58,
      position: "sticky", top: 0, zIndex: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 28, height: 28, background: C.cta, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>P</span>
        </div>
        <span style={{ fontWeight: 700, fontSize: 15, color: C.text, letterSpacing: "-0.3px" }}>PortfolioHub</span>
        <span style={{ fontSize: 11, color: C.muted, marginLeft: 4, background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 4, padding: "2px 6px" }}>Giao diện phụ</span>
      </div>
      <div style={{ display: "flex", gap: 3 }}>
        {tabs.map(([key, label]) => (
          <button key={key} onClick={() => setPage(key)} style={{
            padding: "6px 14px", borderRadius: 6, border: "none", cursor: "pointer",
            fontSize: 13, fontWeight: 500,
            background: page === key ? C.cta : "transparent",
            color: page === key ? "#fff" : C.muted,
            transition: "all 0.15s",
          }}>{label}</button>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", border: `2px solid ${C.border}` }}>
          <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
        <span style={{ fontSize: 13, color: C.text, fontWeight: 500 }}>Minh Anh</span>
      </div>
    </nav>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 1 — Auth / Login
// ══════════════════════════════════════════════════════════════════════════════
function AuthPage() {
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [focused, setFocused] = useState(null);

  const inputStyle = (name) => ({
    width: "100%", padding: "11px 14px 11px 40px",
    border: `1px solid ${focused === name ? C.cta : C.border}`,
    borderRadius: 8, fontSize: 14, color: C.text,
    background: C.bg, outline: "none",
    transition: "border-color 0.15s",
    boxSizing: "border-box",
  });

  return (
    <div style={{ display: "flex", height: "calc(100vh - 58px)", overflow: "hidden" }}>
      {/* ── Left: artwork panel ── */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        <img
          src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2023/08/hoc-phi-uef-.jpg"
          alt="artwork"
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
        {/* gradient overlay */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(135deg, rgba(7,126,158,0.55) 0%, rgba(0,0,0,0.5) 100%)",
        }} />
        {/* quote */}
        <div style={{ position: "absolute", bottom: 48, left: 48, right: 48 }}>
          <p style={{ color: "rgba(255,255,255,0.95)", fontSize: 22, fontWeight: 300, lineHeight: 1.55, letterSpacing: "-0.3px", margin: "0 0 14px" }}>
            "Thiết kế không chỉ là cách nó trông thế nào — <br />
            đó là cách nó <em>vận hành</em>."
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: "50%", overflow: "hidden", border: "2px solid rgba(255,255,255,0.5)" }}>
              <img src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=80" alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ color: "#fff", fontSize: 13, fontWeight: 600, margin: 0 }}>Steve Jobs</p>
              <p style={{ color: "rgba(255,255,255,0.65)", fontSize: 11, margin: 0 }}>Co-founder, Apple Inc.</p>
            </div>
          </div>
        </div>
        {/* top-left badge */}
        <div style={{ position: "absolute", top: 32, left: 40, display: "flex", gap: 8, alignItems: "center" }}>
          <div style={{ width: 32, height: 32, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>P</span>
          </div>
          <span style={{ color: "#fff", fontSize: 14, fontWeight: 600, letterSpacing: "-0.2px" }}>PortfolioHub</span>
        </div>
        {/* stats strip */}
        <div style={{ position: "absolute", top: 32, right: 32, display: "flex", flexDirection: "column", gap: 8 }}>
          {[["1,200+", "Tác phẩm"], ["340", "Sinh viên"], ["48", "Giảng viên"]].map(([n, l]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.12)", backdropFilter: "blur(6px)", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 8, padding: "8px 14px", textAlign: "right" }}>
              <p style={{ color: "#fff", fontWeight: 700, fontSize: 16, margin: 0, letterSpacing: "-0.3px" }}>{n}</p>
              <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 11, margin: 0 }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right: login form ── */}
      <div style={{ width: 480, background: C.bg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px 56px" }}>
        <div style={{ width: "100%", maxWidth: 340 }}>
          {/* logo mark */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 34, height: 34, background: C.cta, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>P</span>
              </div>
              <span style={{ fontWeight: 700, fontSize: 16, color: C.text }}>PortfolioHub</span>
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, color: C.text, margin: "0 0 8px", letterSpacing: "-0.6px" }}>Đăng nhập hệ thống</h1>
            <p style={{ fontSize: 13, color: C.muted, margin: 0 }}>Sử dụng email của bạn để đăng nhập</p>
          </div>

          {/* email */}
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.text, display: "block", marginBottom: 6, letterSpacing: "0.2px" }}>Địa chỉ Email</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Icon name="mail" size={15} color={focused === "email" ? C.cta : C.muted} />
              </span>
              <input
                type="email"
                placeholder="minhanh@uef.edu.vn"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onFocus={() => setFocused("email")}
                onBlur={() => setFocused(null)}
                style={inputStyle("email")}
              />
            </div>
          </div>

          {/* password */}
          <div style={{ marginBottom: 8 }}>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.text, display: "block", marginBottom: 6, letterSpacing: "0.2px" }}>Mật khẩu</label>
            <div style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Icon name="lock" size={15} color={focused === "pass" ? C.cta : C.muted} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={pass}
                onChange={e => setPass(e.target.value)}
                onFocus={() => setFocused("pass")}
                onBlur={() => setFocused(null)}
                style={{ ...inputStyle("pass"), paddingRight: 40 }}
              />
              <button
                onClick={() => setShowPass(s => !s)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", display: "flex" }}
              >
                <Icon name="eye" size={15} color={C.muted} />
              </button>
            </div>
          </div>

          <div style={{ textAlign: "right", marginBottom: 24 }}>
            <span style={{ fontSize: 12, color: C.cta, cursor: "pointer", fontWeight: 500 }}>Quên mật khẩu?</span>
          </div>

          {/* CTA */}
          <button style={{
            width: "100%", padding: "12px", borderRadius: 8, border: "none",
            background: C.cta, color: "#fff", fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            letterSpacing: "0.1px",
          }}>
            <Icon name="logIn" size={15} color="#fff" />
            Đăng nhập
          </button>

          {/* divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: C.border }} />
            <span style={{ fontSize: 12, color: C.muted }}>hoặc</span>
            <div style={{ flex: 1, height: 1, background: C.border }} />
          </div>

          {/* SSO */}
          <button style={{
            width: "100%", padding: "11px", borderRadius: 8,
            border: `1px solid ${C.border}`, background: C.bg,
            color: C.text, fontSize: 13, fontWeight: 500, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Icon name="shield" size={15} color={C.muted} />
            Đăng nhập qua cổng UEF SSO
          </button>

          {/* role switch */}
          <div style={{ marginTop: 28, display: "flex", gap: 6 }}>
            {["Sinh viên", "Giảng viên", "Quản trị"].map((r, i) => (
              <button key={r} style={{
                flex: 1, padding: "7px 0", borderRadius: 6,
                border: `1px solid ${i === 0 ? C.cta : C.border}`,
                background: i === 0 ? `${C.cta}12` : "transparent",
                color: i === 0 ? C.cta : C.muted,
                fontSize: 12, fontWeight: 500, cursor: "pointer",
              }}>{r}</button>
            ))}
          </div>
          <p style={{ fontSize: 11, color: C.muted, textAlign: "center", marginTop: 14 }}>
            Bằng cách đăng nhập, bạn đồng ý với <span style={{ color: C.cta, cursor: "pointer" }}>Điều khoản sử dụng</span>.
          </p>
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 2 — Student Settings
// ══════════════════════════════════════════════════════════════════════════════
function SettingsPage() {
  const [profilePublic, setProfilePublic] = useState(true);
  const [showEmail, setShowEmail] = useState(false);
  const [allowComment, setAllowComment] = useState(true);
  const [activeSection, setActiveSection] = useState("profile");

  const sideItems = [
    ["profile", "user", "Hồ sơ cá nhân"],
    ["display", "photo", "Hiển thị & Quyền riêng tư"],
    ["links",   "link",  "Liên kết mạng xã hội"],
    ["notif",   "bell",  "Thông báo"],
    ["security","shield","Bảo mật"],
  ];

  const Field = ({ label, placeholder, value, type = "text", icon }) => {
    const [foc, setFoc] = useState(false);
    return (
      <div>
        <label style={{ fontSize: 12, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>{label}</label>
        <div style={{ position: "relative" }}>
          {icon && (
            <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
              <Icon name={icon} size={14} color={foc ? C.cta : C.muted} />
            </span>
          )}
          <input
            type={type}
            defaultValue={value}
            placeholder={placeholder}
            onFocus={() => setFoc(true)}
            onBlur={() => setFoc(false)}
            style={{
              width: "100%", boxSizing: "border-box",
              padding: icon ? "10px 14px 10px 38px" : "10px 14px",
              border: `1px solid ${foc ? C.cta : C.border}`, borderRadius: 8,
              fontSize: 13, color: C.text, background: C.bg, outline: "none",
              transition: "border-color 0.15s",
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 58px)", background: C.bgLight }}>
      {/* sidebar */}
      <aside style={{ width: 220, background: C.bg, borderRight: `1px solid ${C.border}`, padding: "28px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 20px", borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
          <p style={{ fontSize: 11, fontWeight: 600, color: C.muted, letterSpacing: "0.8px", textTransform: "uppercase", margin: 0 }}>Cài đặt tài khoản</p>
        </div>
        {sideItems.map(([key, icon, label]) => (
          <div
            key={key}
            onClick={() => setActiveSection(key)}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "9px 20px", cursor: "pointer",
              background: activeSection === key ? `${C.cta}0f` : "transparent",
              borderLeft: activeSection === key ? `2px solid ${C.cta}` : "2px solid transparent",
            }}
          >
            <Icon name={icon} size={15} color={activeSection === key ? C.cta : C.muted} />
            <span style={{ fontSize: 13, fontWeight: activeSection === key ? 600 : 400, color: activeSection === key ? C.cta : C.muted }}>{label}</span>
          </div>
        ))}
      </aside>

      {/* main */}
      <main style={{ flex: 1, padding: "36px 48px", maxWidth: 760 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4, letterSpacing: "-0.4px" }}>Hồ sơ cá nhân</h2>
        <p style={{ fontSize: 13, color: C.muted, marginBottom: 32 }}>Thông tin hiển thị công khai trên trang Portfolio của bạn.</p>

        {/* avatar block */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 16 }}>Ảnh đại diện</p>
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", overflow: "hidden", border: `3px solid ${C.border}` }}>
                <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&q=80" alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{
                position: "absolute", bottom: 0, right: 0, width: 24, height: 24,
                background: C.cta, borderRadius: "50%", border: `2px solid ${C.bg}`,
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
              }}>
                <Icon name="camera" size={11} color="#fff" />
              </div>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: "0 0 4px" }}>Nguyễn Minh Anh</p>
              <p style={{ fontSize: 12, color: C.muted, margin: "0 0 10px" }}>JPG, PNG · Tối đa 5MB</p>
              <div style={{ display: "flex", gap: 8 }}>
                <button style={{ padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 6, background: C.bg, fontSize: 12, color: C.text, cursor: "pointer", display: "flex", alignItems: "center", gap: 6 }}>
                  <Icon name="upload" size={12} color={C.muted} /> Tải ảnh lên
                </button>
                <button style={{ padding: "6px 14px", border: `1px solid #f5c6c6`, borderRadius: 6, background: C.dangerBg, fontSize: 12, color: C.danger, cursor: "pointer" }}>Xóa</button>
              </div>
            </div>
          </div>
        </div>

        {/* info fields */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>Thông tin cơ bản</p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Họ và Tên" value="Nguyễn Minh Anh" icon="user" />
            <Field label="Mã sinh viên" value="21DGR00042" placeholder="Mã SV..." />
          </div>
          <Field label="Tiêu đề nghề nghiệp" value="Graphic Designer & Visual Artist" placeholder="VD: Brand Designer" icon="penTool" />
          <div>
            <label style={{ fontSize: 12, fontWeight: 500, color: C.text, display: "block", marginBottom: 6 }}>Tiểu sử</label>
            <textarea
              defaultValue="Sinh viên năm 4 chuyên ngành Thiết kế Đồ họa. Tập trung vào Brand Identity, Editorial Design và Motion Graphics."
              rows={3}
              style={{ width: "100%", boxSizing: "border-box", padding: "10px 14px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, color: C.text, resize: "none", outline: "none", lineHeight: 1.65 }}
            />
          </div>
        </div>

        {/* social links */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 20, display: "flex", flexDirection: "column", gap: 14 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>Liên kết mạng xã hội</p>
          <Field label="Behance" placeholder="https://behance.net/username" value="https://behance.net/minhanh" icon="globe" />
          <Field label="LinkedIn" placeholder="https://linkedin.com/in/username" value="" icon="link" />
          <Field label="Instagram" placeholder="@username" value="@minhanh.design" icon="camera" />
        </div>

        {/* visibility toggles */}
        <div style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 12, padding: "24px 28px", marginBottom: 28, display: "flex", flexDirection: "column", gap: 16 }}>
          <p style={{ fontSize: 13, fontWeight: 600, color: C.text, margin: 0 }}>Hiển thị & Quyền riêng tư</p>
          {[
            ["Portfolio công khai", "Cho phép tất cả mọi người xem trang Portfolio của bạn", profilePublic, setProfilePublic],
            ["Hiển thị địa chỉ email", "Hiển thị email liên hệ trên trang cá nhân", showEmail, setShowEmail],
            ["Cho phép bình luận", "Giảng viên và sinh viên khác có thể để lại nhận xét", allowComment, setAllowComment],
          ].map(([title, desc, val, setter]) => (
            <div key={title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 14, borderBottom: `1px solid ${C.border}` }}>
              <div style={{ flex: 1, marginRight: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: C.text, margin: "0 0 2px" }}>{title}</p>
                <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>{desc}</p>
              </div>
              <Toggle on={val} onChange={setter} />
            </div>
          ))}
          <div style={{ display: "flex", alignItems: "center", gap: 8, paddingTop: 4 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: profilePublic ? "#16a34a" : C.muted }} />
            <span style={{ fontSize: 12, color: C.muted }}>
              Portfolio của bạn hiện đang <strong style={{ color: profilePublic ? "#16a34a" : C.muted }}>{profilePublic ? "Công khai" : "Riêng tư"}</strong>
            </span>
          </div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button style={{ padding: "10px 24px", borderRadius: 8, border: `1px solid ${C.border}`, background: C.bg, color: C.muted, fontSize: 13, cursor: "pointer" }}>Hủy bỏ</button>
          <button style={{ padding: "10px 24px", borderRadius: 8, border: "none", background: C.cta, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="check" size={14} color="#fff" /> Lưu thay đổi
          </button>
        </div>
      </main>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════════════════════
// SCREEN 3 — Lecturer Admin Dashboard
// ══════════════════════════════════════════════════════════════════════════════
const adminArtworks = [
  { id: 1, title: "Neon Dreams Poster", student: "Nguyễn Minh Anh", code: "21DGR042", status: "pending", img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80", cat: "Poster", bookmarked: false },
  { id: 2, title: "Urban Decay Series", student: "Trần Bảo Long",   code: "21DGR018", status: "approved", img: "https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=400&q=80", cat: "Photography", bookmarked: true },
  { id: 3, title: "Brand Identity Vol.2",student: "Lê Thị Hương",   code: "21DGR031", status: "pending", img: "https://images.unsplash.com/photo-1634986666676-ec8fd927c23d?w=400&q=80", cat: "Branding", bookmarked: false },
  { id: 4, title: "Floating Worlds 3D", student: "Phạm Đức Tuân",   code: "21DGR055", status: "pending", img: "https://images.unsplash.com/photo-1617791160536-598cf32026fb?w=400&q=80", cat: "3D Art", bookmarked: true },
  { id: 5, title: "Type Study #7",       student: "Vũ Ngọc Mai",    code: "21DGR009", status: "approved", img: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&q=80", cat: "Typography", bookmarked: false },
  { id: 6, title: "Cyberpunk City",      student: "Hoàng Anh Kiệt", code: "21DGR077", status: "pending", img: "https://images.unsplash.com/photo-1534972195531-d756b9bfa9f2?w=400&q=80", cat: "Illustration", bookmarked: false },
  { id: 7, title: "Editorial Layout",    student: "Nguyễn Minh Anh", code: "21DGR042", status: "pending", img: "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&q=80", cat: "Print", bookmarked: false },
  { id: 8, title: "Motion Blur Study",   student: "Trần Bảo Long",  code: "21DGR018", status: "approved", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400&q=80", cat: "Photography", bookmarked: true },
];

function AdminPage() {
  const [tab, setTab] = useState("all");
  const [works, setWorks] = useState(adminArtworks);
  const [filter, setFilter] = useState("all");
  const [scoreTarget, setScoreTarget] = useState(null);

  const toggleBookmark = (id) => setWorks(ws => ws.map(w => w.id === id ? { ...w, bookmarked: !w.bookmarked } : w));
  const removeWork   = (id) => setWorks(ws => ws.filter(w => w.id !== id));

  const displayed = tab === "collection"
    ? works.filter(w => w.bookmarked)
    : filter === "all" ? works : works.filter(w => w.status === filter);

  const stats = [
    [`${works.length}`,                          "Tổng tác phẩm"],
    [`${works.filter(w => w.status === "pending").length}`, "Chờ duyệt"],
    [`${works.filter(w => w.bookmarked).length}`, "Trong bộ sưu tập"],
    ["4.7",                                       "Điểm TB"],
  ];

  return (
    <div style={{ display: "flex", minHeight: "calc(100vh - 58px)", background: C.bgLight }}>
      {/* sidebar */}
      <aside style={{ width: 220, background: C.bg, borderRight: `1px solid ${C.border}`, padding: "24px 0", flexShrink: 0 }}>
        <div style={{ padding: "0 20px 18px", borderBottom: `1px solid ${C.border}`, marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 38, height: 38, borderRadius: "50%", overflow: "hidden" }}>
              <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=80&q=80" alt="av" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div>
              <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: C.text }}>TS. Nguyễn Văn Tài</p>
              <p style={{ margin: 0, fontSize: 11, color: C.muted }}>Giảng viên</p>
            </div>
          </div>
        </div>
        {[["grid","Tổng quan",true],["photo","Tác phẩm",false],["users","Sinh viên",false],["chart","Thống kê",false],["settings","Cài đặt",false]].map(([icon, label, active]) => (
          <div key={label} style={{ display:"flex",alignItems:"center",gap:10,padding:"9px 20px",cursor:"pointer",background:active?`${C.cta}0f`:"transparent",borderLeft:active?`2px solid ${C.cta}`:"2px solid transparent" }}>
            <Icon name={icon} size={15} color={active?C.cta:C.muted} />
            <span style={{ fontSize:13,fontWeight:active?600:400,color:active?C.cta:C.muted }}>{label}</span>
          </div>
        ))}
        <div style={{ padding: "20px 20px 0", borderTop: `1px solid ${C.border}`, marginTop: 12 }}>
          <p style={{ fontSize: 11, color: C.muted, fontWeight: 600, letterSpacing: "0.6px", textTransform: "uppercase", marginBottom: 10 }}>Lớp học</p>
          {["Thiết kế Đồ họa K21", "Typography K22", "Motion Design K21"].map(c => (
            <div key={c} style={{ fontSize: 12, color: C.muted, padding: "6px 0", borderBottom: `1px solid ${C.border}`, cursor: "pointer" }}>{c}</div>
          ))}
        </div>
      </aside>

      {/* main */}
      <main style={{ flex: 1, padding: "32px 40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px", letterSpacing: "-0.4px" }}>Quản trị Giảng viên</h2>
            <p style={{ color: C.muted, fontSize: 13, margin: 0 }}>Duyệt và chấm điểm tác phẩm sinh viên</p>
          </div>
          <button style={{ padding: "9px 18px", borderRadius: 8, border: "none", background: C.cta, color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="fileText" size={14} color="#fff" /> Xuất PDF bộ sưu tập
          </button>
        </div>

        {/* stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 28 }}>
          {stats.map(([val, label]) => (
            <div key={label} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, padding: "16px 18px" }}>
              <p style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 700, color: C.cta, letterSpacing: "-0.4px" }}>{val}</p>
              <p style={{ margin: 0, fontSize: 12, color: C.muted }}>{label}</p>
            </div>
          ))}
        </div>

        {/* tabs + filter */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 2, background: C.bgLight, border: `1px solid ${C.border}`, borderRadius: 8, padding: 3 }}>
            {[["all","Tất cả tác phẩm"],["collection","Bộ sưu tập xuất PDF"]].map(([key,label]) => (
              <button key={key} onClick={() => setTab(key)} style={{ padding:"7px 16px",borderRadius:6,border:"none",cursor:"pointer",fontSize:13,fontWeight:500,background:tab===key?C.bg:C.bgLight,color:tab===key?C.text:C.muted,boxShadow:tab===key?"0 1px 3px rgba(0,0,0,0.08)":"none" }}>
                {label}
                {key === "collection" && works.filter(w=>w.bookmarked).length > 0 && (
                  <span style={{ marginLeft:6,background:C.cta,color:"#fff",borderRadius:10,fontSize:10,padding:"1px 6px" }}>{works.filter(w=>w.bookmarked).length}</span>
                )}
              </button>
            ))}
          </div>
          {tab === "all" && (
            <div style={{ display: "flex", gap: 8 }}>
              {[["all","Tất cả"],["pending","Chờ duyệt"],["approved","Đã duyệt"]].map(([v,l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{ padding:"6px 12px",borderRadius:6,border:`1px solid ${filter===v?C.cta:C.border}`,background:filter===v?`${C.cta}12`:"transparent",color:filter===v?C.cta:C.muted,fontSize:12,cursor:"pointer",fontWeight:filter===v?600:400 }}>{l}</button>
              ))}
            </div>
          )}
        </div>

        {/* grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16 }}>
          {displayed.map(work => (
            <div key={work.id} style={{ background: C.bg, border: `1px solid ${C.border}`, borderRadius: 10, overflow: "hidden" }}>
              <div style={{ position: "relative" }}>
                <img src={work.img} alt={work.title} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
                <span style={{
                  position: "absolute", top: 8, left: 8,
                  padding: "3px 8px", borderRadius: 4, fontSize: 10, fontWeight: 600,
                  background: work.status === "approved" ? "#dcfce7" : "#fef9c3",
                  color: work.status === "approved" ? "#166534" : "#854d0e",
                }}>{work.status === "approved" ? "Đã duyệt" : "Chờ duyệt"}</span>
                {work.bookmarked && (
                  <span style={{ position: "absolute", top: 8, right: 8, background: C.cta, borderRadius: 4, padding: "2px 6px", fontSize: 10, color: "#fff", fontWeight: 600 }}>PDF</span>
                )}
              </div>
              <div style={{ padding: "12px 14px" }}>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: 13, color: C.text }}>{work.title}</p>
                <p style={{ margin: "0 0 2px", fontSize: 12, color: C.muted }}>{work.student}</p>
                <p style={{ margin: "0 0 10px", fontSize: 11, color: C.border.replace("#E0","#A0"), color: "#aaa" }}>{work.code} · {work.cat}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* action buttons */}
                  <div style={{ display: "flex", gap: 6 }}>
                    {/* grade */}
                    <button
                      onClick={() => setScoreTarget(work.id === scoreTarget ? null : work.id)}
                      title="Chấm điểm"
                      style={{ width:30,height:30,borderRadius:6,border:`1px solid ${C.border}`,background:scoreTarget===work.id?`${C.cta}12`:C.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
                    >
                      <Icon name="penTool" size={13} color={scoreTarget===work.id?C.cta:C.muted} />
                    </button>
                    {/* bookmark */}
                    <button
                      onClick={() => toggleBookmark(work.id)}
                      title="Thêm vào bộ sưu tập"
                      style={{ width:30,height:30,borderRadius:6,border:`1px solid ${work.bookmarked?C.cta:C.border}`,background:work.bookmarked?`${C.cta}12`:C.bg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
                    >
                      <Icon name="bookmark" size={13} color={work.bookmarked?C.cta:C.muted} strokeWidth={work.bookmarked?2.5:1.75} />
                    </button>
                    {/* delete */}
                    <button
                      onClick={() => removeWork(work.id)}
                      title="Ẩn/Xóa tác phẩm"
                      style={{ width:30,height:30,borderRadius:6,border:`1px solid #f5c6c6`,background:C.dangerBg,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center" }}
                    >
                      <Icon name="trash" size={13} color={C.danger} />
                    </button>
                  </div>
                  <span style={{ fontSize: 11, color: C.muted, background: Cconst lecturersList = [
  { name: "PGS. TS. Nguyễn Minh Khoa", title: "Trưởng Khoa Thiết kế Đồ họa", bio: "Chuyên ngành: Visual Communication, Brand Identity & Design Strategy. Hơn 20 năm kinh nghiệm giảng dạy và thực chiến.", skills: ["Typography", "Brand Identity", "Visual Communication"], img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80" },
  { name: "ThS. Trần Thị Lan Anh", title: "Giảng viên chính", bio: "Chuyên ngành: UI/UX Design, Digital Product Design & Figma. Cố vấn thiết kế cho nhiều startup công nghệ.", skills: ["UI/UX", "Figma", "Product Design"], img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80" },
  { name: "ThS. Lê Quốc Bảo", title: "Giảng viên", bio: "Chuyên ngành: Motion Graphics, After Effects & 3D Animation. Freelance director với hơn 50 dự án thương mại lớn.", skills: ["Motion Graphics", "After Effects", "3D"], img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { name: "ThS. Phạm Hồng Nhung", title: "Giảng viên", bio: "Chuyên ngành: Typography, Editorial Design & Packaging. Từng đoạt 2 giải thưởng thiết kế bao bì quốc tế.", skills: ["Typography", "Editorial", "Packaging"], img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80" },
  { name: "TS. Nguyễn Đình Trọng", title: "Giảng viên cao cấp", bio: "Chuyên ngành: Illustration, Concept Art & Character Design. Cộng tác viên cho studio game và phim hoạt hình.", skills: ["Illustration", "Concept Art", "Character"], img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { name: "ThS. Vũ Thanh Tuyền", title: "Giảng viên", bio: "Chuyên ngành: Photography, Photo Editing & Visual Storytelling. Nhiếp ảnh gia thương mại với studio tự do.", skills: ["Photography", "Photoshop", "Lightroom"], img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
];

function AboutPage() {
  const [activeTab, setActiveTab] = useState("Tổng quan");
  const tabs = ["Tổng quan", "Chương trình đào tạo", "Đội ngũ giảng viên", "Cơ sở vật chất", "Liên hệ"];

  return (
    <div className="bg-white min-h-[calc(100vh-58px)] font-sans w-full">
      {/* Hero Section */}
      <section className="bg-[#077E9E] text-white pt-20 pb-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <p className="text-white/80 font-semibold text-sm tracking-wider uppercase mb-4">
            Khoa Thiết Kế Đồ Họa
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 font-serif">
            Nơi Sáng Tạo
            <br /> Được Triển Lãm
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed mb-12">
            Khoa Thiết kế Đồ họa UEF đào tạo thế hệ nhà thiết kế chuyên nghiệp, trang bị kỹ năng thực chiến và tư duy sáng tạo để đáp ứng nhu cầu ngành công nghiệp sáng tạo hiện đại.
          </p>
          
          <div className="flex flex-wrap items-center gap-8 md:gap-16 border-t border-white/20 pt-8 mt-4">
            <div>
              <p className="text-4xl font-bold tracking-tight mb-1">500+</p>
              <p className="text-sm text-white/80 font-medium">Ấn phẩm trưng bày</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight mb-1">12</p>
              <p className="text-sm text-white/80 font-medium">Giảng viên chuyên môn</p>
            </div>
            <div>
              <p className="text-4xl font-bold tracking-tight mb-1">1,200+</p>
              <p className="text-sm text-white/80 font-medium">Sinh viên theo học</p>
            </div>
          </div>
        </div>
        
        {/* Background shapes */}
        <div className="absolute top-0 right-0 bottom-0 w-1/2 overflow-hidden pointer-events-none opacity-20">
          <div className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-white blur-3xl"></div>
        </div>
      </section>

      {/* Tab Navigation (Sticky) */}
      <div className="sticky top-[58px] z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap px-6 py-4 text-sm font-semibold transition-colors relative ${
                activeTab === tab ? "text-[#077E9E]" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#077E9E] rounded-t-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        
        {/* Chương trình đào tạo Section */}
        <section id="chuong-trinh-dao-tao" className="mb-24 pt-8">
          <p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Về Chương Trình</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 max-w-2xl leading-tight">Đào tạo Nhà thiết kế Chuyên nghiệp Thế kỷ 21</h2>
          <p className="text-gray-600 mb-12 max-w-3xl leading-relaxed text-[15px]">
            Khoa Thiết kế Đồ họa trực thuộc Trường Đại học Kinh tế - Tài chính TP. Hồ Chí Minh (UEF), được thành lập với sứ mệnh đào tạo nguồn nhân lực chất lượng cao cho ngành công nghiệp sáng tạo tại Việt Nam và khu vực Đông Nam Á.<br/><br/>
            Chương trình đào tạo kết hợp lý thuyết học thuật và thực hành chuyên sâu, giúp sinh viên không chỉ thành thạo các công cụ thiết kế chuyên nghiệp mà còn phát triển tư duy thẩm mỹ và khả năng giải quyết vấn đề bằng ngôn ngữ thiết kế.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MajorCard 
              title="Thiết kế đồ họa Truyền thông" 
              desc="Brand identity, print design, packaging, typography và visual communication."
            />
            <MajorCard 
              title="Thiết kế Kỹ thuật số & UI/UX" 
              desc="Web design, mobile app, user experience và interactive design."
            />
            <MajorCard 
              title="Motion Graphics & Video" 
              desc="Animation, motion design, video editing và visual effects."
            />
            <MajorCard 
              title="Minh họa & Nghệ thuật 3D" 
              desc="Digital illustration, concept art, character design và 3D modeling."
            />
          </div>
        </section>

        {/* Đội ngũ giảng viên Section */}
        <section id="doi-ngu-giang-vien" className="mb-24 pt-8">
          <p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Đội ngũ giảng viên</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Những Người Thầy Dẫn Đường Sáng Tạo</h2>
          <p className="text-gray-600 mb-12 max-w-3xl leading-relaxed text-[15px]">
            Đội ngũ giảng viên Khoa Thiết kế Đồ họa UEF bao gồm các chuyên gia với nhiều năm kinh nghiệm thực tiễn trong ngành và nền tảng học thuật vững chắc.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {lecturersList.map((lec) => (
              <LecturerCard key={lec.name} {...lec} avatar={lec.img} />
            ))}
          </div>
          
          <div className="flex justify-center">
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
              Xem toàn bộ giảng viên (12)
            </button>
          </div>
        </section>

        {/* Highlight Colorful Block */}
        <section className="mb-24 pt-8">
          <p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Ấn phẩm sinh viên nổi bật</p>
          <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100 shadow-sm flex flex-col">
            <div className="h-20 bg-[#F9A8D4]"></div>
            <div className="h-20 bg-[#93C5FD]"></div>
            <div className="h-20 bg-[#86EFAC]"></div>
            <div className="h-20 bg-[#FDE047]"></div>
          </div>
          <button className="w-full py-4 bg-[#077E9E] hover:bg-[#055F78] text-white rounded-xl font-semibold text-[15px] transition-colors">
            Xem Gallery đầy đủ
          </button>
        </section>

        {/* Liên hệ & CTA Section */}
        <section id="lien-he" className="pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
            
            {/* Liên hệ */}
            <div>
              <p className="text-[#077E9E] font-semibold text-xs tracking-wider uppercase mb-3">Thông tin liên hệ</p>
              <h2 className="text-3xl font-bold text-gray-900 mb-8">Kết nối với chúng tôi</h2>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#077E9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Địa chỉ</p>
                    <p className="text-sm text-gray-600">141-145 Điện Biên Phủ, Phường 15, Q. Bình Thạnh, TP.HCM</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-[#077E9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Email</p>
                    <a href="mailto:khoathietke@uef.edu.vn" className="text-sm text-gray-600 hover:text-[#077E9E]">khoathietke@uef.edu.vn</a>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-[#077E9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Điện thoại</p>
                    <p className="text-sm text-gray-600">(028) 5422 5555</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-[#077E9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 mb-1">Website</p>
                    <a href="https://uef.edu.vn" target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-[#077E9E]">uef.edu.vn</a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA */}
            <div className="bg-[#055F78] rounded-2xl p-8 md:p-10 text-white flex flex-col justify-center relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-4">Bạn là Nhà tuyển dụng?</h3>
                <p className="text-white/80 mb-8 text-[15px] leading-relaxed">
                  Tìm kiếm tài năng thiết kế trẻ? Khám phá ngay portfolio các sản phẩm sinh viên xuất sắc nhất để tìm kiếm ứng viên tiềm năng cho doanh nghiệp của bạn.
                </p>
                <button className="bg-white text-[#055F78] px-6 py-3.5 rounded-lg font-bold text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 w-max">
                  Khám phá Portfolio <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
              <div className="absolute top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none"></div>
            </div>
            
          </div>
        </section>

      </div>
    </div>
  );

// ══════════════════════════════════════════════════════════════════════════════
// App Root
// ══════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [page, setPage] = useState("auth");

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', 'Helvetica Neue', sans-serif", minHeight: "100vh", background: C.bgLight }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input, select, textarea, button { font-family: inherit; }
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&display=swap');
        body { background: ${C.bgLight}; }
        input:focus, textarea:focus { box-shadow: 0 0 0 3px ${C.cta}22; }
      `}</style>
      <NavBar page={page} setPage={setPage} />
      {page === "auth"     && <AuthPage />}
      {page === "settings" && <SettingsPage />}
      {page === "admin"    && <AdminPage />}
      {page === "about"    && <AboutPage />}
    </div>
  );
}
