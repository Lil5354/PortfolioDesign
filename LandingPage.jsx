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
        <div className="flex items-center gap-3">
          <div className="bg-[#212121] text-white font-serif font-bold text-xl px-3 py-1 rounded-md">UEF</div>
          <div>
            <h1 className="font-bold text-sm leading-tight">Design Gallery</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-wide">{t("facultyOfGraphicDesign")}</p>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <button className="text-[#077E9E] border-b-2 border-[#077E9E] pb-1">{t("home")}</button>
          <button onClick={() => setPage("gallery")} className="text-gray-500 hover:text-[#212121]">Gallery</button>
          <button onClick={() => setPage("about")} className="text-gray-500 hover:text-[#212121]">{t("aboutFaculty")}</button>
        </nav>
        <div className="flex items-center gap-4 text-sm font-medium">
          <span className="text-gray-400"><button onClick={() => setLanguage(currentLang === "vi" ? "en" : "vi")} className="font-bold uppercase">{currentLang === "vi" ? "EN" : "VI"}</button></span>
          <button onClick={() => setPage("auth")} className="bg-[#077E9E] text-white px-5 py-2 rounded-lg hover:bg-[#066a85] transition-colors">{t("login")}</button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-8 py-20 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="flex-1">
          <p className="text-[#077E9E] font-semibold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
            <span className="w-8 h-px bg-[#077E9E]"></span> {t("facultyOfGraphicDesign")}
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            {t("whereToDisplay")}<br />
            <span className="text-[#077E9E]">{t("artwork")}</span> thiết kế<br />
            {t("ofUefStudents")}
          </h2>
          <div className="space-y-1 mb-10 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => setPage("gallery")} className="bg-[#077E9E] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#066a85] transition-colors">
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
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] hover:shadow-md transition-all cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 group-hover:bg-[#E8F4F8] group-hover:text-[#077E9E] rounded-lg flex items-center justify-center mb-6">
                <ImageIcon size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("exhibitionGallery")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Hiển thị toàn bộ ấn phẩm theo Masonry Layout, lọc theo môn học, năm học, công cụ và thể loại.</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <ImageIcon size={14} /> gallery
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <User size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("personalPortfolio")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">Mỗi sinh viên có trang portfolio riêng với URL chia sẻ, phù hợp gửi cho nhà tuyển dụng.</p>
              <div className="flex items-center gap-2 text-xs font-medium text-[#077E9E] bg-[#E8F4F8] w-fit px-3 py-1.5 rounded-md">
                <User size={14} /> portfolio cá nhân
              </div>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Star size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("scoresAndFeedback")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Giảng viên chấm điểm trực tiếp trên hệ thống. Sinh viên nhận thông báo và xem kết quả công khai hoặc ẩn.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Monitor size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("multiDevice")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Giao diện responsive, hiển thị hoàn hảo trên desktop, tablet và điện thoại di động.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Heart size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("highlightAndInteract")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Like, Bookmark ấn phẩm. Giảng viên highlight {t("artwork")} xuất sắc lên đầu Gallery.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] transition-colors cursor-default">
              <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center mb-6">
                <Users size={20} />
              </div>
              <h3 className="font-bold text-lg mb-3">{t("recruitmentConnection")}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Nhà tuyển dụng liên hệ sinh viên qua form -> email chuyển tiếp thẳng đến @uef.edu.vn.</p>
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
                    <div className="absolute top-3 left-3 bg-[#077E9E] text-white text-[10px] font-bold px-2 py-1 rounded">{t("highlighted")}</div>
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
            <span className="w-6 h-px bg-[#077E9E]"></span> {t("guidelines")}
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-16">{t("startIn3Steps")}</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">1</div>
              <h3 className="font-bold mb-2">{t("login")}</h3>
              <p className="text-sm text-gray-500">Dùng email của bạn để đăng nhập vào hệ thống</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">2</div>
              <h3 className="font-bold mb-2">{t("uploadArtwork")}</h3>
              <p className="text-sm text-gray-500">Upload ảnh/PDF kèm thông tin môn học, công cụ và mô tả</p>
            </div>
            
            <div className="flex-1 flex flex-col items-center text-center z-10">
              <div className="w-12 h-12 bg-[#077E9E] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">3</div>
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
            <button onClick={() => setPage("auth")} className="bg-[#077E9E] hover:bg-[#066a85] text-white px-8 py-3 rounded-lg font-bold transition-colors">Đăng nhập ngay</button>
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
