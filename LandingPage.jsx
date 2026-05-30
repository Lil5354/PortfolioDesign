import { useState } from "react";
import { useI18n } from "./lib/i18n";
import { ArrowRight, Image as ImageIcon, User, Star, Monitor, Heart, Users, Mail, Phone, MapPin, Globe } from "lucide-react";

export function LandingPage({ setPage, isLoggedIn, userRole, onLogout }) {
  const { t, currentLang, setLang: setLanguage } = useI18n();
  const artworks = [
    { id: 1, img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&q=80", title: "Kỷ niệm UEF", student: "Nguyễn Lê Minh Anh", likes: 142 },
    { id: 2, img: "https://i.pinimg.com/1200x/64/52/dc/6452dc484427b34cc0be14c3d80c948a.jpg", title: "Poster Design", student: "Trần Bảo Long", likes: 89 },
    { id: 3, img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80", title: "Typography", student: "Lê Thị Hương", likes: 203 },
    { id: 4, img: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800&q=80", title: "Packaging", student: "Phạm Quốc Việt", likes: 56 },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-[#212121]">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white sticky top-0 z-50">
        <img src="/logo-uef.png" alt="UEF" className="h-11 object-contain" />
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button className="text-[#1a4ba8] border-b-2 border-[#1a4ba8] pb-1">{t("home")}</button>
          <button onClick={() => setPage("gallery")} className="text-gray-500 hover:text-[#212121]">Gallery</button>
          <button onClick={() => setPage("about")} className="text-gray-500 hover:text-[#212121]">{t("aboutFaculty")}</button>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-gray-400"><button onClick={() => setLanguage(currentLang === "vi" ? "en" : "vi")} className="font-bold uppercase">{currentLang === "vi" ? "EN" : "VI"}</button></span>
          <button onClick={() => setPage("auth")} className="bg-[#1a4ba8] text-white px-5 py-2 rounded-lg hover:bg-[#1642a6] transition-colors">{t("login")}</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[#1a4ba8]"></span> {t("facultyOfGraphicDesign")}
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            {t("whereToDisplay")}<br />
            <span className="text-[#1a4ba8]">{t("artwork")}</span> thiết kế<br />
            {t("ofUefStudents")}
          </h2>
          <div className="space-y-1 mb-10 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => setPage("gallery")} className="bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors">
              {t("aboutCtaBtn2")} <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage("auth")} className="bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {t("studentLogin")}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-16">* Dành cho sinh viên đăng nhập bằng email của bạn</p>
          
          <div className="flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
            <div>
              <p className="text-3xl font-bold mb-1">500+</p>
              <p className="text-xs text-gray-500">{t("publishedArtworks")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">120+</p>
              <p className="text-xs text-gray-500">{t("participatingLecturers")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">18</p>
              <p className="text-xs text-gray-500">{t("subjects")}</p>
            </div>
            <div>
              <p className="text-3xl font-bold mb-1">4 khoá</p>
              <p className="text-xs text-gray-500">{t("creativeJourneys")}</p>
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
            <span className="bg-[#1a4ba8] text-white text-[10px] px-3 py-1.5 rounded-full font-medium">3d art</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">branding</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">poster</span>
            <span className="bg-gray-100 text-gray-600 border border-gray-200 text-[10px] px-3 py-1.5 rounded-full font-medium">packaging</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-24 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center animate-[fadeUp_0.5s_ease-out]">
            <p className="text-[#DA291C] font-semibold text-xs tracking-[0.15em] uppercase mb-3 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#DA291C]"></span> {t("coreFeatures")}
              <span className="w-6 h-px bg-[#DA291C]"></span>
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#212121] leading-tight">
              <span className="text-[#1a4ba8]">Mọi thứ</span> bạn cần trong{' '}
              <span className="text-[#DA291C]">một nền tảng</span>
            </h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-[15px]">Hệ thống E-Portfolio toàn diện cho sinh viên Thiết kế Đồ họa UEF</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 🟦 BLUE — Card 1 */}
            <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.6s_ease-out]">
              <div className="h-1.5 bg-[#1a4ba8] w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300">
                  <ImageIcon size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("exhibitionGallery")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">Hiển thị toàn bộ ấn phẩm theo Masonry Layout, lọc theo môn học, năm học, công cụ và thể loại.</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#1a4ba8]">
                  <span className="w-5 h-[2px] bg-[#1a4ba8]"></span> gallery
                </div>
              </div>
            </div>

            {/* 🟥 RED — Card 2 */}
            <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.7s_ease-out]">
              <div className="h-1.5 bg-[#DA291C] w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300">
                  <User size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("personalPortfolio")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-5">Mỗi sinh viên có trang portfolio riêng với URL chia sẻ, phù hợp gửi cho nhà tuyển dụng.</p>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#DA291C]">
                  <span className="w-5 h-[2px] bg-[#DA291C]"></span> portfolio cá nhân
                </div>
              </div>
            </div>

            {/* ⬜ WHITE/GRAY — Card 3 */}
            <div className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.8s_ease-out]">
              <div className="h-1.5 bg-gray-300 w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300">
                  <Star size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("scoresAndFeedback")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Giảng viên chấm điểm trực tiếp trên hệ thống. Sinh viên nhận thông báo và xem kết quả công khai hoặc ẩn.</p>
              </div>
            </div>

            {/* 🟦 BLUE — Card 4 */}
            <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#1a4ba8]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_0.9s_ease-out]">
              <div className="h-1.5 bg-[#1a4ba8] w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#1a4ba8]/10 text-[#1a4ba8] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#1a4ba8] group-hover:text-white transition-all duration-300">
                  <Monitor size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("multiDevice")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Giao diện responsive, hiển thị hoàn hảo trên desktop, tablet và điện thoại di động.</p>
              </div>
            </div>

            {/* 🟥 RED — Card 5 */}
            <div className="group bg-white rounded-2xl border border-gray-200 hover:border-[#DA291C]/30 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.0s_ease-out]">
              <div className="h-1.5 bg-[#DA291C] w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-[#DA291C]/10 text-[#DA291C] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#DA291C] group-hover:text-white transition-all duration-300">
                  <Heart size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("highlightAndInteract")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Like, Bookmark ấn phẩm. Giảng viên highlight {t("artwork")} xuất sắc lên đầu Gallery.</p>
              </div>
            </div>

            {/* ⬜ WHITE/GRAY — Card 6 */}
            <div className="group bg-gray-50 rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_1.1s_ease-out]">
              <div className="h-1.5 bg-gray-300 w-full"></div>
              <div className="p-7">
                <div className="w-12 h-12 rounded-xl bg-gray-200 text-[#555] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-[#212121] group-hover:text-white transition-all duration-300">
                  <Users size={22} />
                </div>
                <h3 className="font-extrabold text-[17px] text-[#212121] mb-2.5">{t("recruitmentConnection")}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">Nhà tuyển dụng liên hệ sinh viên qua form -> email chuyển tiếp thẳng đến @uef.edu.vn.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Artworks */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-[#1a4ba8]"></span> {t("featuredProducts")}
              </p>
              <h2 className="text-3xl font-extrabold">{t("exploreLatestArtworks")}</h2>
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
                    <div className="absolute top-3 left-3 bg-[#1a4ba8] text-white text-[10px] font-bold px-2 py-1 rounded">{t("highlighted")}</div>
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

      {/* Quotes Ticker */}
      <div className="bg-[#0d2e6e] py-8 overflow-hidden border-y border-white/10 shadow-inner">
        <div className="flex gap-10 whitespace-nowrap animate-[ticker_55s_linear_infinite] w-max">
          {[...Array(2)].map((_, i) => (
            <>
              <div className="inline-flex items-center gap-8 px-8 text-white/90 border-r border-white/20 mx-4">
                <img
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=280&q=80&fit=crop&crop=face&auto=format"
                  alt="Bà Nguyễn Thị Vọng"
                  className="w-[140px] h-[140px] rounded-xl object-cover shadow-lg shrink-0 ring-2 ring-white/20"
                />
                <div className="flex flex-col whitespace-normal text-left max-w-sm">
                  <span className="text-[11px] font-bold text-[#c9a227] tracking-[0.12em] uppercase">Đại diện Doanh nghiệp — FPT Software</span>
                  <span className="text-[14px] font-bold text-white mt-1.5">Bà NGUYỄN THỊ VỌNG</span>
                  <span className="text-[12px] text-white/60 mb-1.5">Giám đốc vận hành đơn vị EBS</span>
                  <span className="text-[12.5px] text-white/80 leading-relaxed italic border-l-2 border-[#c9a227] pl-3">"Đại diện doanh nghiệp, tôi đánh giá cao khung chương trình đào tạo của UEF. Chúng tôi luôn săn đón những nguồn lực vững chuyên môn, giỏi thực hành và tốt ngoại ngữ."</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-8 px-8 text-white/90 border-r border-white/20 mx-4">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=280&q=80&fit=crop&crop=face&auto=format"
                  alt="Trần Tấn Đạt"
                  className="w-[140px] h-[140px] rounded-xl object-cover shadow-lg shrink-0 ring-2 ring-white/20"
                />
                <div className="flex flex-col whitespace-normal text-left max-w-sm">
                  <span className="text-[11px] font-bold text-[#c9a227] tracking-[0.12em] uppercase">Đại diện Sinh viên</span>
                  <span className="text-[14px] font-bold text-white mt-1.5">TRẦN TẤN ĐẠT</span>
                  <span className="text-[12px] text-white/60 mb-1.5">Sinh viên khóa 2020</span>
                  <span className="text-[12.5px] text-white/80 leading-relaxed italic border-l-2 border-[#c9a227] pl-3">"Em hoàn toàn hài lòng khi lựa chọn học Công nghệ thông tin ở UEF. Ngoài kỹ năng chuyên môn, em được trau dồi về kỹ năng tiếng Anh chuyên ngành, tăng cường khả năng ghi nhớ, lập luận logic cùng các kỹ năng mềm cần thiết."</span>
                </div>
              </div>
              <div className="inline-flex items-center gap-8 px-8 text-white/90 border-r border-white/20 mx-4">
                <img
                  src="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=280&q=80&fit=crop&crop=face&auto=format"
                  alt="Cô Văn Thị Thiên Trang"
                  className="w-[140px] h-[140px] rounded-xl object-cover shadow-lg shrink-0 ring-2 ring-white/20"
                />
                <div className="flex flex-col whitespace-normal text-left max-w-sm">
                  <span className="text-[11px] font-bold text-[#c9a227] tracking-[0.12em] uppercase">Đại diện Giảng viên — Khoa CNTT</span>
                  <span className="text-[14px] font-bold text-white mt-1.5">Cô VĂN THỊ THIÊN TRANG</span>
                  <span className="text-[12px] text-white/60 mb-1.5">Phó khoa, khoa Công nghệ thông tin</span>
                  <span className="text-[12.5px] text-white/80 leading-relaxed italic border-l-2 border-[#c9a227] pl-3">"Ở UEF, ngành Công nghệ thông tin được đào tạo bài bản với sự kết hợp giữa lý thuyết và thực tiễn. Sinh viên có thời lượng lớn tham quan thực tế tại doanh nghiệp, công ty để hình dung được công việc trong tương lai."</span>
                </div>
              </div>
            </>
          ))}
        </div>
      </div>

      {/* Steps Section */}
      <section className="px-8 py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2 justify-center">
            <span className="w-6 h-px bg-[#1a4ba8]"></span> {t("guidelines")}
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-16">{t("startIn3Steps")}</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">1</div>
              <h3 className="font-bold mb-2">{t("login")}</h3>
              <p className="text-sm text-gray-500">Dùng email của bạn để đăng nhập vào hệ thống</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">2</div>
              <h3 className="font-bold mb-2">{t("uploadArtwork")}</h3>
              <p className="text-sm text-gray-500">Upload ảnh/PDF kèm thông tin môn học, công cụ và mô tả</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">3</div>
              <h3 className="font-bold mb-2">{t("sharePortfolio")}</h3>
              <p className="text-sm text-gray-500">Nhận link portfolio cá nhân để gửi cho nhà tuyển dụng</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#1A1A1A] text-white px-8 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-3">Sẵn sàng trưng bày {t("artwork")} của bạn?</h2>
            <p className="text-gray-400">Dành cho sinh viên Thiết kế Đồ họa UEF — đăng nhập ngay hôm nay</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPage("auth")} className="bg-[#1a4ba8] hover:bg-[#1642a6] text-white px-8 py-3 rounded-lg font-bold transition-colors">Đăng nhập ngay</button>
            <button onClick={() => setPage("gallery")} className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-colors">{t("viewGallery")}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-10 px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-uef.png" alt="UEF" className="h-7 object-contain" />
            <div>
              <p className="font-bold text-white">UEF Design Gallery - {t("facultyOfGraphicDesign")}</p>
              <p className="text-xs mt-1">© 2024 Trương Vĩnh Ký - Khóa 21 - Tài chính TP.HCM</p>
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
