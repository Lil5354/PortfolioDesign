import React, { useState } from 'react';
import { ArrowRight, Info, GraduationCap, ClipboardList, Building2, LayoutGrid, Link, Zap, FileBadge, UserPlus, Filter, ShieldCheck, Mail, Phone, MapPin, ChevronDown, Check, X, CheckCircle2 } from 'lucide-react';

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
        {/* Subtle Background pattern */}
        <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_55%_80%_at_100%_50%,rgba(214,232,255,0.6)_0%,transparent_70%),radial-gradient(ellipse_35%_40%_at_5%_90%,rgba(155,28,28,0.06)_0%,transparent_60%)]"></div>
        
        <div className="relative z-10 lg:pr-12">
          <div className="inline-flex items-center gap-2 bg-[#d6e8ff] text-[#0d2e6e] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-8">
            <span className="w-1.5 h-1.5 bg-[#1e6fd9] rounded-full animate-ping"></span>
            Faculty of Graphic Design — UEF
          </div>
          <h1 className="text-5xl lg:text-7xl font-serif leading-[1.1] text-[#0a0c0f] mb-4 tracking-tight">
            Discover<br/>
            <span className="text-[#1a4ba8] italic">The best projects</span><br/>
            from UEF students
          </h1>
          <p className="text-[#666] text-base leading-relaxed max-w-[460px] mb-10">
            Nền tảng E-Portfolio tích hợp đánh giá học thuật — nơi sinh viên trưng bày tác phẩm, giảng viên chấm điểm chuyên nghiệp, và nhà tuyển dụng tìm kiếm nhân tài <strong className="text-[#1a4ba8]">đã được kiểm định.</strong>
          </p>
          <div className="flex flex-wrap gap-3 mb-4">
            <a href="#audience" className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#0d2e6e] text-white rounded-xl font-bold text-[15px] hover:bg-[#1a4ba8] hover:-translate-y-0.5 transition-all shadow-lg shadow-[#0d2e6e]/20">
              Explore Gallery <ArrowRight size={16} />
            </a>
            <button onClick={() => setPage("auth")} className="inline-flex items-center px-7 py-3.5 bg-transparent border-2 border-[#e2e6ec] text-[#0a0c0f] rounded-xl font-bold text-[15px] hover:border-[#1a4ba8] hover:text-[#1a4ba8] transition-colors">
              Student Login
            </button>
          </div>
          <p className="text-xs text-[#8b96a8] mb-10 flex items-center gap-1.5">
            <Info size={13} /> For students, log in with your UEF email
          </p>
          <div className="flex gap-8 pt-7 border-t border-[#e2e6ec]">
            <div>
              <div className="text-[26px] font-extrabold font-serif text-[#0d2e6e] leading-none">500+</div>
              <div className="text-[11px] text-[#8b96a8] mt-1 font-bold uppercase tracking-wider">Displayed Artworks</div>
            </div>
            <div>
              <div className="text-[26px] font-extrabold font-serif text-[#0d2e6e] leading-none">120+</div>
              <div className="text-[11px] text-[#8b96a8] mt-1 font-bold uppercase tracking-wider">Participating Lecturers</div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex relative z-10 h-full items-center justify-center pointer-events-none">
          <div className="grid grid-cols-3 grid-rows-4 gap-2.5 w-full max-w-[500px] aspect-[3/4] p-8 pb-4 origin-center animate-[mosaicFloat_9s_ease-in-out_infinite] pointer-events-auto">
            <div className="row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[0]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Branding</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[1]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[2]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">UI/UX</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[3]} className="w-full h-full object-cover" /></div>
            <div className="row-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[4]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Illustration</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[5]} className="w-full h-full object-cover" /></div>
            <div className="col-span-2 rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[6]} className="w-full h-full object-cover" /><span className="absolute bottom-2 left-2 bg-black/65 text-white text-[10px] font-bold px-2 py-1 rounded backdrop-blur uppercase">Poster</span></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[7]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[8]} className="w-full h-full object-cover" /></div>
            <div className="rounded-xl overflow-hidden relative group transition-transform hover:scale-105 hover:z-20"><img src={images[9]} className="w-full h-full object-cover" /></div>
          </div>
        </div>
      </section>

      {/* TICKER */}
      <div className="bg-[#0d2e6e] py-4 overflow-hidden border-y border-white/10">
        <div className="flex gap-0 whitespace-nowrap animate-[ticker_32s_linear_infinite] w-max">
          {[...Array(2)].map((_, i) => (
            <React.Fragment key={i}>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-medium text-white/70 border-r border-white/15"><span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>UEF Design Gallery — Nền tảng E-Portfolio tích hợp đánh giá học thuật</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-medium text-white/70 border-r border-white/15"><span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>Được kiểm định bởi giảng viên Khoa Thiết kế Đồ họa UEF</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-medium text-white/70 border-r border-white/15"><span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>80%+ nhà tuyển dụng xác nhận E-Portfolio hữu ích trong tuyển dụng</span>
              <span className="inline-flex items-center gap-3 px-10 text-[13px] font-medium text-white/70 border-r border-white/15"><span className="w-1.5 h-1.5 bg-[#c9a227] rounded-full"></span>gallery.uef.edu.vn/portfolio/[ten-sinh-vien]</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* GALLERY STRIP */}
      <div className="bg-white py-16 overflow-hidden">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8]">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> Featured Artworks
          </div>
        </div>
        <div className="flex gap-4 w-max animate-[stripScroll_35s_linear_infinite] hover:[animation-play-state:paused]">
          {[...images, ...images].map((img, i) => (
            <div key={i} className="w-[220px] h-[160px] rounded-xl overflow-hidden shrink-0 group">
              <img src={img} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>

      {/* AUDIENCE SECTION (Core Platform) */}
      <section id="audience" className="bg-[#f5f6f8] py-24 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-[#1a4ba8] mb-5">
            <span className="w-7 h-[2px] bg-[#1a4ba8]"></span> Core Platform
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#0a0c0f] leading-[1.1] mb-4">Everything you need<br/>in one platform</h2>
          <p className="text-[#666] text-base leading-relaxed max-w-[560px] mb-12">
            Được xây dựng cho ba nhóm người dùng cốt lõi với trải nghiệm riêng biệt, tích hợp mượt mà trong cùng một hệ sinh thái.
          </p>

          <div className="flex gap-0 border-b-2 border-[#e2e6ec] mb-12 overflow-x-auto">
            <button onClick={() => setActiveTab("student")} className={`flex items-center gap-2 px-8 py-4 font-bold text-[15px] border-b-4 -mb-0.5 whitespace-nowrap transition-colors ${activeTab === 'student' ? 'border-[#0d2e6e] text-[#0d2e6e]' : 'border-transparent text-[#8b96a8] hover:text-[#1a4ba8]'}`}>
              <GraduationCap size={18} /> Sinh viên
            </button>
            <button onClick={() => setActiveTab("lecturer")} className={`flex items-center gap-2 px-8 py-4 font-bold text-[15px] border-b-4 -mb-0.5 whitespace-nowrap transition-colors ${activeTab === 'lecturer' ? 'border-[#0d2e6e] text-[#0d2e6e]' : 'border-transparent text-[#8b96a8] hover:text-[#1a4ba8]'}`}>
              <ClipboardList size={18} /> Giảng viên
            </button>
            <button onClick={() => setActiveTab("recruiter")} className={`flex items-center gap-2 px-8 py-4 font-bold text-[15px] border-b-4 -mb-0.5 whitespace-nowrap transition-colors ${activeTab === 'recruiter' ? 'border-[#0d2e6e] text-[#0d2e6e]' : 'border-transparent text-[#8b96a8] hover:text-[#1a4ba8]'}`}>
              <Building2 size={18} /> Nhà tuyển dụng
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {activeTab === "student" && (
              <>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <h3 className="text-3xl font-serif text-[#0a0c0f] mb-4 leading-tight">Xây dựng hồ sơ chuyên nghiệp từ năm nhất</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Mỗi bài tập học thuật là một viên gạch tạo nên danh tiếng nghề nghiệp. UEF Design Gallery biến tác phẩm từ "bài nộp một lần" thành tài sản số lâu dài mang thương hiệu UEF.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center"><LayoutGrid size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Portfolio Masonry chuẩn thẩm mỹ</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Trưng bày tác phẩm đa phương tiện, hỗ trợ Pantone/CMYK và quy trình sáng tác.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center"><Link size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Cá nhân hóa liên kết định danh</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Sở hữu đường dẫn gallery.uef.edu.vn/portfolio/[tên-của-bạn] chuyên nghiệp.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#d6e8ff] text-[#1a4ba8] flex items-center justify-center"><Zap size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Tự động kết xuất Tập San PDF</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Tạo cuốn Portfolio PDF chuẩn in ấn chỉ với 1 cú click chuột để gửi nhà tuyển dụng.</span>
                      </div>
                    </li>
                  </ul>
                  <button onClick={() => setPage("auth")} className="px-6 py-3 bg-[#0a0c0f] text-white rounded-lg font-bold text-sm hover:bg-[#212121] transition-colors">Tạo Portfolio Ngay</button>
                </div>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#e2e6ec] shadow-xl p-2 pb-0">
                    <div className="rounded-xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative">
                      <img src="https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80" alt="Student Dashboard" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 border border-black/5 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "lecturer" && (
              <>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <h3 className="text-3xl font-serif text-[#0a0c0f] mb-4 leading-tight">Số hóa toàn diện quy trình đánh giá</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Chấm điểm, nhận xét và cấp chứng nhận điện tử trực tiếp trên nền tảng. Loại bỏ hoàn toàn giấy tờ, minh bạch và lưu trữ vĩnh viễn.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#fef2f2] text-[#c0392b] flex items-center justify-center"><FileBadge size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Đánh giá & Cấp Verification Badge</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Xác thực tác phẩm chất lượng bằng huy hiệu "Đã kiểm định", gia tăng uy tín cho sinh viên.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center"><ShieldCheck size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Bảo vệ bản quyền trí tuệ</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Hệ thống Watermark thông minh và kiểm soát truy cập riêng tư.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#e2e6ec] shadow-xl p-2 pb-0">
                    <div className="rounded-xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative">
                      <img src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80" alt="Lecturer Dashboard" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 border border-black/5 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === "recruiter" && (
              <>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <h3 className="text-3xl font-serif text-[#0a0c0f] mb-4 leading-tight">Nguồn ứng viên thiết kế chất lượng cao</h3>
                  <p className="text-[#666] text-[15px] leading-relaxed mb-8">
                    Tiếp cận trực tiếp với mạng lưới sinh viên đồ họa UEF. Tìm kiếm theo năng lực thực tế, không chỉ qua CV chữ viết.
                  </p>
                  <ul className="space-y-4 mb-8">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#fdfaf1] text-[#c9a227] flex items-center justify-center"><Filter size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Lọc ứng viên theo Skill-tag</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Tìm kiếm chính xác 3D Modeling, UI/UX, hoặc Branding trong vài giây.</span>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-lg bg-[#f0f2f5] text-[#1a4ba8] flex items-center justify-center"><UserPlus size={20} /></div>
                      <div>
                        <strong className="text-[#0a0c0f] text-sm block mb-1">Kết nối & Tuyển dụng trực tiếp</strong>
                        <span className="text-[#666] text-sm leading-relaxed">Gửi lời mời phỏng vấn hoặc đề xuất dự án ngay trên nền tảng.</span>
                      </div>
                    </li>
                  </ul>
                </div>
                <div className="animate-[fadeUp_0.4s_ease-out]">
                  <div className="bg-white rounded-2xl overflow-hidden border border-[#e2e6ec] shadow-xl p-2 pb-0">
                    <div className="rounded-xl overflow-hidden bg-[#f0f2f5] aspect-[4/3] relative">
                      <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80" alt="Recruiter View" className="w-full h-full object-cover opacity-90" />
                      <div className="absolute inset-0 border border-black/5 rounded-xl"></div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* PILLARS SECTION (Replaces AI dark section) */}
      <section className="bg-black py-24 px-6 lg:px-12 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-[620px] mb-16">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-[0.12em] uppercase text-white/50 mb-5">
              <span className="w-7 h-[2px] bg-white/30"></span> Core Values
            </div>
            <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Được thiết kế vì sự phát triển toàn diện</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[3px] border-t-[#60afff]">
              <div className="w-12 h-12 rounded-xl bg-[#1e6fd9]/20 text-[#60afff] flex items-center justify-center mb-6">
                <LayoutGrid size={24} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Portfolio Driven</h3>
              <p className="text-sm text-white/50 leading-relaxed">Thiết kế xoay quanh tác phẩm. Giao diện tối giản để nhường chỗ cho sự sáng tạo của người dùng lên ngôi.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[3px] border-t-[#ff7b6e]">
              <div className="w-12 h-12 rounded-xl bg-[#c0392b]/20 text-[#ff7b6e] flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Academic Integrity</h3>
              <p className="text-sm text-white/50 leading-relaxed">Đề cao tính học thuật, bản quyền tác giả và quy trình đánh giá minh bạch từ đội ngũ giảng viên UEF.</p>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all border-t-[3px] border-t-[#f5d87e]">
              <div className="w-12 h-12 rounded-xl bg-[#c9a227]/20 text-[#f5d87e] flex items-center justify-center mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="font-serif text-2xl mb-3">Industry Ready</h3>
              <p className="text-sm text-white/50 leading-relaxed">Cầu nối trực tiếp mang sinh viên đến với các cơ hội nghề nghiệp thực tế ngay từ khi còn ngồi trên ghế nhà trường.</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-20 text-center">
             <div>
                <div className="font-serif text-5xl font-bold mb-2">350+</div>
                <div className="text-xs uppercase tracking-widest text-white/40">Verified Projects</div>
             </div>
             <div className="w-px h-16 bg-white/10 hidden md:block"></div>
             <div>
                <div className="font-serif text-5xl font-bold mb-2">98%</div>
                <div className="text-xs uppercase tracking-widest text-white/40">Student Satisfaction</div>
             </div>
             <div className="w-px h-16 bg-white/10 hidden md:block"></div>
             <div>
                <div className="font-serif text-5xl font-bold mb-2">45+</div>
                <div className="text-xs uppercase tracking-widest text-white/40">Partner Companies</div>
             </div>
          </div>
        </div>
      </section>

      {/* COMPARE SECTION */}
      <section id="compare" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-[#0a0c0f] mb-4">Tại sao chọn UEF Design Gallery?</h2>
            <p className="text-[#666]">So sánh giá trị mang lại so với các nền tảng lưu trữ truyền thống.</p>
          </div>
          <div className="overflow-x-auto rounded-xl border border-[#e2e6ec] shadow-sm">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="bg-[#f5f6f8] p-5 font-bold text-[#0a0c0f] border-b border-[#e2e6ec] text-sm">Tính năng</th>
                  <th className="bg-white p-5 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Behance / Dribbble</th>
                  <th className="bg-white p-5 font-bold text-[#666] border-b border-[#e2e6ec] text-sm text-center">Google Drive</th>
                  <th className="bg-[#0d2e6e] p-5 font-bold text-white border-b border-[#0d2e6e] text-sm text-center">UEF Gallery</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr>
                  <td className="p-4 border-b border-[#e2e6ec] font-semibold text-[#0a0c0f] bg-[#f5f6f8]">Môi trường học thuật UEF</td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#38a169]"><Check size={18} className="mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#e2e6ec] font-semibold text-[#0a0c0f] bg-[#f5f6f8]">Xác thực từ Giảng viên (Badge)</td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#38a169]"><Check size={18} className="mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 border-b border-[#e2e6ec] font-semibold text-[#0a0c0f] bg-[#f5f6f8]">Kết xuất PDF Layout chuẩn</td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 border-b border-[#e2e6ec] bg-[#f8fafc] text-center text-[#38a169]"><Check size={18} className="mx-auto" /></td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-[#0a0c0f] bg-[#f5f6f8]">Tìm kiếm nội bộ dành cho Recruiter</td>
                  <td className="p-4 text-center text-[#38a169]"><Check size={18} className="mx-auto" /></td>
                  <td className="p-4 text-center text-[#e53e3e]"><X size={18} className="mx-auto" /></td>
                  <td className="p-4 bg-[#f8fafc] text-center text-[#38a169]"><Check size={18} className="mx-auto" /></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PROCESS FLOW */}
      <section className="py-24 px-6 lg:px-12 bg-[#f5f6f8] border-t border-[#e2e6ec]">
        <div className="max-w-7xl mx-auto text-center">
           <h2 className="text-3xl md:text-4xl font-serif text-[#0a0c0f] mb-12">Quy trình vận hành khép kín</h2>
           
           <div className="flex flex-col md:flex-row items-center justify-center gap-4">
             <div className="bg-white p-6 rounded-xl border border-[#e2e6ec] shadow-sm flex-1 text-center w-full max-w-[240px]">
               <div className="w-12 h-12 bg-[#d6e8ff] text-[#1a4ba8] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">1</div>
               <h4 className="font-bold text-[#0a0c0f] text-sm mb-2">Sinh viên Upload</h4>
               <p className="text-xs text-[#666]">Đăng tải tác phẩm với đầy đủ hình ảnh, mô tả, thông số.</p>
             </div>
             <ArrowRight className="text-[#8b96a8] hidden md:block" />
             <div className="bg-white p-6 rounded-xl border border-[#e2e6ec] shadow-sm flex-1 text-center w-full max-w-[240px]">
               <div className="w-12 h-12 bg-[#d6e8ff] text-[#1a4ba8] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">2</div>
               <h4 className="font-bold text-[#0a0c0f] text-sm mb-2">Giảng viên Chấm điểm</h4>
               <p className="text-xs text-[#666]">Duyệt, đánh giá và cấp huy hiệu xác thực chất lượng.</p>
             </div>
             <ArrowRight className="text-[#8b96a8] hidden md:block" />
             <div className="bg-white p-6 rounded-xl border border-[#e2e6ec] shadow-sm flex-1 text-center w-full max-w-[240px]">
               <div className="w-12 h-12 bg-[#d6e8ff] text-[#1a4ba8] rounded-full flex items-center justify-center mx-auto mb-4 font-bold">3</div>
               <h4 className="font-bold text-[#0a0c0f] text-sm mb-2">Xuất bản & Tìm kiếm</h4>
               <p className="text-xs text-[#666]">Hiển thị công khai, nhà tuyển dụng có thể tiếp cận.</p>
             </div>
           </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6 lg:px-12 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-12">
           <div>
             <h3 className="font-serif text-3xl mb-4">Câu hỏi thường gặp</h3>
             <p className="text-[#666] text-sm leading-relaxed mb-8">Tất cả những thông tin bạn cần biết về nền tảng UEF Design Gallery.</p>
             <div className="bg-[#f5f6f8] border border-[#e2e6ec] rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 bg-[#0d2e6e] text-white rounded-lg flex items-center justify-center shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <strong className="text-sm block">Hỗ trợ kỹ thuật</strong>
                  <span className="text-xs text-[#666]">khoathietke@uef.edu.vn</span>
                </div>
             </div>
           </div>
           
           <div className="space-y-4">
             {[
               { q: "Sinh viên ngành khác có được sử dụng nền tảng không?", a: "Hiện tại, nền tảng UEF Design Gallery được thiết kế riêng và cấp quyền ưu tiên cho sinh viên thuộc Khoa Thiết kế Đồ họa (Graphic Design) của UEF để đảm bảo tính chuyên môn." },
               { q: "Làm sao để tác phẩm được gán nhãn Verified?", a: "Sau khi bạn đăng tải, giảng viên phụ trách môn học hoặc đồ án đó sẽ vào xem xét và đánh giá. Nếu đạt chất lượng, giảng viên sẽ cấp huy hiệu Verified." },
               { q: "Tính năng xuất PDF hoạt động như thế nào?", a: "Trong phần Quản lý Portfolio, bạn có thể chọn layout (Modern, Classic, Editorial), chọn màu sắc và font chữ. Hệ thống sẽ tự động ghép các tác phẩm bạn chọn thành một file PDF chuyên nghiệp để tải xuống." }
             ].map((faq, i) => (
               <div key={i} className="border border-[#e2e6ec] rounded-xl overflow-hidden bg-white">
                 <button onClick={() => toggleFaq(i)} className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-[#f9fafc] transition-colors">
                   <strong className="text-sm font-semibold text-[#0a0c0f]">{faq.q}</strong>
                   <ChevronDown size={18} className={`text-[#8b96a8] transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                 </button>
                 {openFaq === i && (
                   <div className="p-5 pt-0 text-sm text-[#666] leading-relaxed border-t border-[#e2e6ec]/50">
                     {faq.a}
                   </div>
                 )}
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 px-6 lg:px-12 bg-gradient-to-br from-[#0d2e6e] to-[#091a45] text-center text-white relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 leading-tight">Sẵn sàng xây dựng dấu ấn<br/>nghề nghiệp của bạn?</h2>
          <p className="text-white/60 mb-10 text-[15px]">Gia nhập cùng hàng trăm sinh viên thiết kế khác và kết nối với các nhà tuyển dụng hàng đầu.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => setPage("auth")} className="px-8 py-4 bg-white text-[#0d2e6e] font-bold rounded-xl text-[15px] hover:bg-white/90 hover:scale-105 transition-all shadow-xl shadow-black/20">Bắt đầu ngay</button>
            <button onClick={() => setPage("gallery")} className="px-8 py-4 bg-white/10 text-white font-bold rounded-xl text-[15px] border border-white/20 hover:bg-white/20 transition-all">Khám phá Gallery</button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0a0c0f] text-white/50 py-12 px-6 lg:px-12 text-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#1a4ba8] text-white font-serif font-bold w-10 h-10 flex items-center justify-center rounded-xl text-xs">UEF</div>
            <div>
              <p className="font-bold text-white text-base leading-none mb-1">Khoa Thiết kế Đồ họa</p>
              <p className="text-xs">Trường Đại học Kinh tế - Tài chính TP.HCM</p>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-medium">
            <button onClick={() => setPage("gallery")} className="hover:text-white transition-colors">Gallery</button>
            <a href="#about" className="hover:text-white transition-colors">Giới thiệu</a>
            <a href="#audience" className="hover:text-white transition-colors">Nền tảng</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-white/10 text-center md:text-left text-xs flex flex-col md:flex-row justify-between items-center gap-4">
           <p>© 2026 UEF Design Gallery. All rights reserved.</p>
           <p>Phát triển bởi sinh viên UEF.</p>
        </div>
      </footer>
    </div>
  );
}

export default AboutPage;
