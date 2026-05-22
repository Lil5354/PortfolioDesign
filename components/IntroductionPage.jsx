import { useEffect, useRef, useState, useCallback } from "react";
import { ArrowRight, ExternalLink, MapPin, Mail, Instagram, Twitter, Linkedin } from "lucide-react";

function useScrollReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(el); } },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, isVisible];
}

function ClipText({ children, className = "", as: Tag = "div", delay = 0, disable = false }) {
  const [ref, isVisible] = useScrollReveal(0.01);
  const visible = disable ? true : isVisible;
  return (
    <div ref={disable ? undefined : ref} className={disable ? "" : "overflow-hidden"}>
      <Tag
        className={className}
        style={{
          transform: visible
            ? "translate3d(0, 0, 0) scale3d(1,1,1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0deg)"
            : "translate3d(0, 100%, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 10deg)",
          opacity: visible ? 1 : 0,
          transition: `transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
        }}
      >
        {children}
      </Tag>
    </div>
  );
}

function FadeUpCard({ children, className = "", delay = 0, disable = false }) {
  const [ref, isVisible] = useScrollReveal(0.05);
  const visible = disable ? true : isVisible;
  return (
    <div
      ref={disable ? undefined : ref}
      className={className}
      style={{
        transform: visible
          ? "translate3d(0, 0, 0) scale3d(1,1,1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 0deg)"
          : "translate3d(0, 80px, 0) scale3d(1, 1, 1) rotateX(0) rotateY(0) rotateZ(0) skew(0, 10deg)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s, opacity 0.9s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

function CardHover({ children, className = "" }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`relative group cursor-default ${className}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500 ease-out"
        style={{
          background: hovered ? "#077E9E" : "transparent",
          transform: hovered ? "scale(1)" : "scale(0.85)",
          opacity: hovered ? 0.06 : 0,
        }}
      />
      {children}
    </div>
  );
}

const StripeBackground = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    <div className="relative h-full max-w-7xl mx-auto">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute top-0 bottom-0 w-px"
          style={{
            left: `${(i + 0.5) * 25}%`,
            background: "rgba(0,0,0,0.04)",
          }}
        />
      ))}
    </div>
  </div>
);

const publications = [
  {
    id: 1,
    title: "Poster Design",
    desc: "Ấn phẩm poster ấn tượng từ các môn học Đồ họa thông tin, Nhiếp ảnh, thể hiện tư duy thị giác sắc bén.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M3 9h18" /><path d="M9 3v18" />
      </svg>
    ),
    color: "#001e36",
    tool: "Adobe Photoshop",
  },
  {
    id: 2,
    title: "Branding Identity",
    desc: "Hệ thống nhận diện thương hiệu hoàn chỉnh: logo, bộ ấn phẩm văn phòng, bao bì sản phẩm.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="3" /><circle cx="12" cy="12" r="8" strokeDasharray="2 4" />
      </svg>
    ),
    color: "#300000",
    tool: "Adobe Illustrator",
  },
  {
    id: 3,
    title: "UI/UX Design",
    desc: "Thiết kế giao diện ứng dụng di động & web, trải nghiệm người dùng được tối ưu qua các dự án thực tế.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
      </svg>
    ),
    color: "#003d33",
    tool: "Figma",
  },
  {
    id: 4,
    title: "3D Art & Modeling",
    desc: "Sản phẩm 3D đa dạng: kiến trúc nội thất, nhân vật game, sản phẩm công nghiệp được dựng hình chi tiết.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2L2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" />
      </svg>
    ),
    color: "#1a0033",
    tool: "Blender",
  },
  {
    id: 5,
    title: "Motion Graphics",
    desc: "Video đồ họa chuyển động, typography động, quảng cáo sản phẩm với hiệu ứng hình ảnh sống động.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
    ),
    color: "#002b45",
    tool: "After Effects",
  },
  {
    id: 6,
    title: "Illustration",
    desc: "Minh họa kỹ thuật số đa phong cách: sách thiếu nhi, concept art, fashion illustration, editorial.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 19V5" /><path d="M5 12l7-7 7 7" />
      </svg>
    ),
    color: "#3d0000",
    tool: "Procreate",
  },
];

const lecturers = [
  { id: 1, name: "ThS. Nguyễn Văn An", role: "Trưởng Khoa TKĐH", achievement: "Chuyên gia tư vấn thiết kế cho 20+ doanh nghiệp", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&q=80" },
  { id: 2, name: "ThS. Trần Thị Bích", role: "Phó Khoa", achievement: "Giải thưởng Giảng viên trẻ xuất sắc 2024", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&q=80" },
  { id: 3, name: "ThS. Lê Hoàng Minh", role: "Giảng viên chính", achievement: "Tốt nghiệp Thạc sĩ Thiết kế ĐH RMIT", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80" },
  { id: 4, name: "GV. Phạm Ngọc Hân", role: "Giảng viên", achievement: "Chuyên gia thiết kế đồ họa tại các agency lớn", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=300&q=80" },
];

const students = [
  { id: 1, name: "Nguyễn Lê Minh Anh", achievement: "Giải Nhất cuộc thi Thiết kế Poster UEF 2024", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80" },
  { id: 2, name: "Trần Bảo Long", achievement: "Top 10 Designer trẻ Việt Nam 2024", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80" },
  { id: 3, name: "Lê Thị Hương", achievement: "Tác phẩm được chọn triển lãm Quốc tế", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80" },
];

export function IntroductionPage({ setPage }) {
  const heroRef = useRef(null);
  const [heroBgScale, setHeroBgScale] = useState(1.2);

  useEffect(() => {
    const handleScroll = () => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, (window.innerHeight - rect.top) / window.innerHeight));
        setHeroBgScale(1.2 - progress * 0.2);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setTimeout(() => setHeroBgScale(1), 100);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121] overflow-hidden">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center bg-[#090b19] overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="relative h-full max-w-7xl mx-auto">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="absolute top-0 bottom-0 w-px" style={{ left: `${(i + 0.5) * 25}%`, background: "rgba(255,255,255,0.06)" }} />
            ))}
          </div>
        </div>
        <div
          className="absolute inset-0 transition-transform duration-[1.5s] ease-out"
          style={{
            backgroundImage: "url(https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1600&q=80)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            transform: `scale3d(${heroBgScale}, ${heroBgScale}, 1)`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-[#090b19]/90 via-[#090b19]/70 to-transparent" />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-8 py-32 z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-1">
              <ClipText disable delay={0.2}>
                <div className="text-[#077E9E] text-xs tracking-[0.15em] uppercase font-semibold rotate-0 lg:-rotate-90 lg:origin-left whitespace-nowrap lg:translate-y-24 mb-4 lg:mb-0">
                  Giới thiệu
                </div>
              </ClipText>
            </div>
            <div className="lg:col-span-8">
              <ClipText disable delay={0.4}>
                <div className="text-[#077E9E] text-xs tracking-[0.2em] uppercase font-semibold mb-6 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#077E9E]" /> Khoa Thiết kế Đồ họa
                </div>
              </ClipText>
              <ClipText disable delay={0.5}>
                <h1 className="text-6xl lg:text-8xl font-extrabold text-white leading-[1.05] mb-4">
                  Thiết kế Đồ họa
                </h1>
              </ClipText>
              <ClipText disable delay={0.6}>
                <h1 className="text-6xl lg:text-8xl font-extrabold text-white/70 leading-[1.05] mb-8">
                  UEF.
                </h1>
              </ClipText>
              <ClipText disable delay={0.7}>
                <p className="text-white/50 text-lg max-w-xl mb-10 leading-relaxed">
                  Đại học Kinh tế - Tài chính Thành phố Hồ Chí Minh. Nơi ươm mầm những tài năng thiết kế trẻ cho thời đại số.
                </p>
              </ClipText>
              <ClipText disable delay={0.8}>
                <div className="flex gap-4">
                  <button
                    onClick={() => document.getElementById("about-section")?.scrollIntoView({ behavior: "smooth" })}
                    className="bg-[#077E9E] hover:bg-[#066a85] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 transition-all duration-300"
                  >
                    Khám phá thêm <ArrowRight size={18} />
                  </button>
                  <button
                    onClick={() => setPage("gallery")}
                    className="border border-white/20 text-white/80 hover:border-white/40 hover:text-white px-8 py-4 rounded-full font-semibold transition-all duration-300"
                  >
                    Xem Gallery
                  </button>
                </div>
              </ClipText>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: About UEF - 2 Images */}
      <section id="about-section" className="relative py-32 px-8 bg-white">
        <StripeBackground />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            <div>
              <ClipText delay={0.1}>
                <div className="text-[#077E9E] text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#077E9E]" /> Về chúng tôi
                </div>
              </ClipText>
              <ClipText delay={0.2}>
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.15] mb-8">
                  Khoa Thiết kế Đồ họa <br />
                  <span className="text-[#077E9E]">UEF</span>
                </h2>
              </ClipText>
              <ClipText delay={0.3}>
                <div className="space-y-4 text-[#666666] leading-relaxed text-base">
                  <p>
                    Khoa Thiết kế Đồ họa trực thuộc Đại học Kinh tế - Tài chính TP.HCM (UEF) được thành lập với sứ mệnh đào tạo những nhà thiết kế có tư duy sáng tạo, nắm vững công nghệ và đáp ứng nhu cầu nhân lực chất lượng cao của ngành công nghiệp sáng tạo.
                  </p>
                  <p>
                    Chương trình đào tạo tích hợp giữa nền tảng mỹ thuật truyền thống và công nghệ thiết kế hiện đại, giúp sinh viên thành thạo các công cụ như Adobe Creative Suite, Figma, Blender và các nền tảng thiết kế khác.
                  </p>
                </div>
              </ClipText>
              <ClipText delay={0.4}>
                <div className="grid grid-cols-4 gap-8 mt-10 pt-10 border-t border-gray-100">
                  {[
                    { n: "500+", l: "Sinh viên" },
                    { n: "18", l: "Môn học" },
                    { n: "20+", l: "Giảng viên" },
                    { n: "4", l: "Khóa đào tạo" },
                  ].map((s) => (
                    <div key={s.n}>
                      <p className="text-3xl font-extrabold text-[#212121]">{s.n}</p>
                      <p className="text-xs text-[#666666] mt-1 uppercase tracking-wide">{s.l}</p>
                    </div>
                  ))}
                </div>
              </ClipText>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                <FadeUpCard delay={0.3} className="space-y-4">
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80"
                      alt="Sinh viên UEF"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&q=80"
                      alt="Giờ học thiết kế"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </FadeUpCard>
                <FadeUpCard delay={0.5} className="space-y-4 pt-8">
                  <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1562774053-701939374585?w=600&q=80"
                      alt="Campus UEF"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-gray-100">
                    <img
                      src="https://images.unsplash.com/photo-1607453998774-d533f65dac99?w=600&q=80"
                      alt="Không gian sáng tạo"
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                </FadeUpCard>
              </div>
              <div className="absolute -bottom-4 -left-4 bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#E8F4F8] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#077E9E]" stroke="currentColor" strokeWidth="2">
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-sm">Đào tạo chất lượng cao</p>
                    <p className="text-xs text-[#666666]">Thiết kế Đồ họa UEF</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Notable Publications */}
      <section className="relative py-32 px-8 bg-[#F8F8F8]">
        <StripeBackground />
        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
            <div className="lg:col-span-9">
              <ClipText delay={0.1}>
                <div className="text-[#077E9E] text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-3">
                  <span className="w-8 h-px bg-[#077E9E]" /> Ấn phẩm
                </div>
              </ClipText>
              <ClipText delay={0.2}>
                <h2 className="text-4xl lg:text-5xl font-extrabold leading-[1.15]">
                  Ấn phẩm tiêu biểu
                </h2>
              </ClipText>
            </div>
            <div className="lg:col-span-3 flex items-end justify-start lg:justify-end">
              <ClipText delay={0.3}>
                <button
                  onClick={() => setPage("gallery")}
                  className="border border-gray-300 text-[#212121] px-6 py-3 rounded-full font-semibold flex items-center gap-2 hover:bg-[#077E9E] hover:text-white hover:border-[#077E9E] transition-all duration-300"
                >
                  Xem toàn bộ <ArrowRight size={16} />
                </button>
              </ClipText>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {publications.map((pub, idx) => (
              <FadeUpCard key={pub.id} delay={0.1 * idx}>
                <CardHover>
                  <div className="bg-white rounded-2xl p-8 border border-gray-100 h-full transition-shadow duration-500 hover:shadow-xl">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-8 transition-colors duration-500"
                      style={{ backgroundColor: `${pub.color}0d`, color: pub.color }}
                    >
                      {pub.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{pub.title}</h3>
                    <p className="text-sm text-[#666666] leading-relaxed mb-8">{pub.desc}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs font-medium text-[#077E9E] bg-[#E8F4F8] px-3 py-1.5 rounded-full">
                        {pub.tool}
                      </span>
                      <button
                        onClick={() => setPage("gallery")}
                        className="text-[#212121] hover:text-[#077E9E] transition-colors"
                      >
                        <ArrowRight size={18} />
                      </button>
                    </div>
                  </div>
                </CardHover>
              </FadeUpCard>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: Lecturers & Students */}
      <section className="relative py-32 px-8 bg-white">
        <StripeBackground />
        <div className="relative max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <ClipText delay={0.1}>
              <div className="text-[#077E9E] text-xs tracking-[0.2em] uppercase font-semibold mb-4 flex items-center gap-3 justify-center">
                <span className="w-8 h-px bg-[#077E9E]" /> Đội ngũ
              </div>
            </ClipText>
            <ClipText delay={0.2}>
              <h2 className="text-4xl lg:text-5xl font-extrabold">
                Giảng viên &amp; Sinh viên tiêu biểu
              </h2>
            </ClipText>
            <ClipText delay={0.3}>
              <p className="text-[#666666] mt-4 max-w-xl mx-auto">
                Những người đã và đang tạo nên thành công của Khoa Thiết kế Đồ họa UEF
              </p>
            </ClipText>
          </div>

          {/* Lecturers */}
          <div className="mb-16">
            <ClipText delay={0.1}>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-[#212121]" /> Giảng viên
              </h3>
            </ClipText>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {lecturers.map((lec, idx) => (
                <FadeUpCard key={lec.id} delay={0.1 * idx}>
                  <div className="group">
                    <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-gray-100 mb-5 relative">
                      <img
                        src={lec.img}
                        alt={lec.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="absolute bottom-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                        {[Instagram, Twitter, Linkedin].map((Icon, i) => (
                          <a key={i} href="#" className="w-8 h-8 bg-white/90 backdrop-blur rounded-full flex items-center justify-center text-[#212121] hover:bg-[#077E9E] hover:text-white transition-colors">
                            <Icon size={14} />
                          </a>
                        ))}
                      </div>
                    </div>
                    <h4 className="font-bold text-base">{lec.name}</h4>
                    <p className="text-sm text-[#077E9E] font-medium mb-1">{lec.role}</p>
                    <p className="text-xs text-[#666666]">{lec.achievement}</p>
                  </div>
                </FadeUpCard>
              ))}
            </div>
          </div>

          {/* Students */}
          <div>
            <ClipText delay={0.1}>
              <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                <span className="w-6 h-px bg-[#212121]" /> Sinh viên xuất sắc
              </h3>
            </ClipText>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((stu, idx) => (
                <FadeUpCard key={stu.id} delay={0.1 * idx}>
                  <div className="flex items-center gap-5 p-6 rounded-2xl border border-gray-100 hover:border-[#077E9E]/20 hover:shadow-md transition-all duration-500 bg-[#F8F8F8]">
                    <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 shrink-0">
                      <img src={stu.img} alt={stu.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">{stu.name}</h4>
                      <p className="text-xs text-[#666666] mt-1 leading-relaxed">{stu.achievement}</p>
                    </div>
                  </div>
                </FadeUpCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
