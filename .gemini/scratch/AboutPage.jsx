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

export default AboutPage;
