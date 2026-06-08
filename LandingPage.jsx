import { useSiteContent } from "./lib/site-content";
import { useI18n } from "./lib/i18n";
import { ArrowRight, Image as ImageIcon, User, Star, Monitor, Heart, Users, Mail, Phone, MapPin, Globe } from "lucide-react";

export function LandingPage({ setPage, isLoggedIn, userRole, onLogout }) {
  const { t, currentLang, setLang: setLanguage } = useI18n();
  const { getContentBySection, getContentItems, getSetting } = useSiteContent();
  const hero = getContentBySection('home', 'hero');
  const stats = getContentItems('home', 'stats');
  const journey = getContentBySection('home', 'creativeJourney');
  const featuresHeading = getContentBySection('home', 'featuresHeading');
  const features = getContentItems('home', 'features');
  const stepsHeading = getContentBySection('home', 'stepsHeading');
  const steps = getContentItems('home', 'steps');
  const testimonials = getContentItems('home', 'testimonials');
  const cta = getContentBySection('home', 'cta');
  const footerInfo = getContentBySection('footer', 'footerInfo');
  const footerLinks = getContentItems('footer', 'footerLinks');

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
          <button onClick={() => setPage("gallery")} className="text-gray-500 hover:text-[#212121]">{t("gallery")}</button>
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
            <span className="w-8 h-px bg-[#1a4ba8]"></span> {hero?.preTitle || t("facultyOfGraphicDesign")}
          </p>
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-[1.1] mb-6">
            {hero?.title1 || t("whereToDisplay")}<br />
            <span className="text-[#1a4ba8]">{hero?.title2 || t("artwork")}</span><br />
            {hero?.title3 || t("ofUefStudents")}
          </h2>
          <div className="space-y-1 mb-10 max-w-sm">
            <div className="h-0.5 bg-gray-200 w-full"></div>
            <div className="h-0.5 bg-gray-200 w-4/5"></div>
            <div className="h-0.5 bg-gray-200 w-3/5"></div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            <button onClick={() => setPage(hero?.primaryCtaLink || "gallery")} className="bg-[#1a4ba8] text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 hover:bg-[#1642a6] transition-colors">
              {hero?.primaryCta || t("aboutCtaBtn2")} <ArrowRight size={18} />
            </button>
            <button onClick={() => setPage(hero?.secondaryCtaLink || "auth")} className="bg-white text-[#212121] border border-gray-300 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
              {hero?.secondaryCta || t("studentLogin")}
            </button>
          </div>
          <p className="text-xs text-gray-500 mb-16">{hero?.note || t("loginNote")}</p>
          
          <div className="flex flex-wrap items-center gap-8 border-t border-gray-100 pt-8">
            {stats.slice(0, 4).map((s, i) => (
              <div key={i}>
                <p className="text-3xl font-bold mb-1">{s.content.value}</p>
                <p className="text-xs text-gray-500">{s.content.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 w-full relative">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-1 space-y-3">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={artworks[0]?.img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src={artworks[2]?.img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="col-span-1 space-y-3 pt-8">
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-square">
                <img src={artworks[1]?.img} alt="Artwork" className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-100 rounded-xl overflow-hidden aspect-[3/4]">
                <img src={artworks[3]?.img} alt="Artwork" className="w-full h-full object-cover" />
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
        </div>
      </section>

      {/* Features Section */}
      <section className="px-8 py-24 bg-gradient-to-b from-white to-gray-50/80">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center animate-[fadeUp_0.5s_ease-out]">
            <p className="text-[#DA291C] font-semibold text-xs tracking-[0.15em] uppercase mb-3 flex items-center gap-2 justify-center">
              <span className="w-6 h-px bg-[#DA291C]"></span> {featuresHeading?.preTitle || t("coreFeatures")}
              <span className="w-6 h-px bg-[#DA291C]"></span>
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-[#212121] leading-tight">{featuresHeading?.title || t("everythingInOnePlatform")}</h2>
            <p className="text-gray-500 mt-4 max-w-xl mx-auto text-[15px]">{featuresHeading?.description || ''}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, idx) => {
              const c = item.content;
              const ci = idx % 3;
              const IconComp = icons[idx] || ImageIcon;
              return (
                <div key={item.id || idx} className={`group bg-white rounded-2xl border border-gray-200 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden animate-[fadeUp_${0.6 + idx * 0.1}s_ease-out]`}>
                  <div className={`h-1.5 ${colorCycle[ci]} w-full`}></div>
                  <div className="p-7">
                    <div className={`w-12 h-12 rounded-xl ${iconBg[ci]} flex items-center justify-center mb-5 group-hover:scale-110 transition-all duration-300 ${ci === 0 ? 'group-hover:bg-[#1a4ba8] group-hover:text-white' : ci === 1 ? 'group-hover:bg-[#DA291C] group-hover:text-white' : 'group-hover:bg-[#212121] group-hover:text-white'}`}>
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
            })}
          </div>
        </div>
      </section>

      {/* Latest Artworks */}
      <section className="px-8 py-20">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <div className="flex justify-between items-end mb-12">
            <div>
              <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2">
                <span className="w-6 h-px bg-[#1a4ba8]"></span> {journey?.title || t("featuredProducts")}
              </p>
              <h2 className="text-3xl font-extrabold">{journey?.subtitle || t("exploreLatestArtworks")}</h2>
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
                  {idx === 0 && <div className="absolute top-3 left-3 bg-[#1a4ba8] text-white text-[10px] font-bold px-2 py-1 rounded">{t("highlighted")}</div>}
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
      {testimonials.length > 0 && (
        <div className="bg-[#0d2e6e] py-8 overflow-hidden border-y border-white/10 shadow-inner">
          <div className="flex gap-10 whitespace-nowrap animate-[ticker_55s_linear_infinite] w-max">
            {[...Array(2)].map(() => (
              <>
                {testimonials.map((item, idx) => {
                  const c = item.content;
                  return (
                    <div key={item.id || idx} className="inline-flex items-center gap-8 px-8 text-white/90 border-r border-white/20 mx-4">
                      {c.imageUrl && (
                        <img src={c.imageUrl} alt={c.name} className="w-[140px] h-[140px] rounded-xl object-cover shadow-lg shrink-0 ring-2 ring-white/20" />
                      )}
                      <div className="flex flex-col whitespace-normal text-left max-w-sm">
                        <span className="text-[11px] font-bold text-[#c9a227] tracking-[0.12em] uppercase">Đại diện {c.type} — {c.role}</span>
                        <span className="text-[14px] font-bold text-white mt-1.5">{c.name}</span>
                        <span className="text-[12px] text-white/60 mb-1.5">{c.role}</span>
                        {c.quote && <span className="text-[12.5px] text-white/80 leading-relaxed italic border-l-2 border-[#c9a227] pl-3">"{c.quote}"</span>}
                      </div>
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      )}

      {/* Steps Section */}
      <section className="px-8 py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto border-t border-gray-100 pt-16">
          <p className="text-[#1a4ba8] font-semibold text-xs tracking-widest uppercase mb-2 flex items-center gap-2 justify-center">
            <span className="w-6 h-px bg-[#1a4ba8]"></span> {stepsHeading?.preTitle || t("guidelines")}
          </p>
          <h2 className="text-3xl font-extrabold text-center mb-16">{stepsHeading?.title || t("startIn3Steps")}</h2>
          
          <div className="flex flex-col md:flex-row justify-center items-center gap-8 relative max-w-4xl mx-auto">
            <div className="hidden md:block absolute top-6 left-[15%] right-[15%] h-px bg-gray-300 z-0 border-t border-dashed border-gray-300"></div>
            {steps.map((item, idx) => {
              const c = item.content;
              return (
                <div key={item.id || idx} className="flex-1 flex flex-col items-center text-center z-10">
                  <div className="w-12 h-12 bg-[#1a4ba8] text-white rounded-full flex items-center justify-center font-bold text-lg mb-6 border-4 border-gray-50 shadow-sm">{c.step || idx + 1}</div>
                  <h3 className="font-bold mb-2">{c.title}</h3>
                  <p className="text-sm text-gray-500">{c.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-[#1A1A1A] text-white px-8 py-20">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl font-extrabold mb-3">{cta?.title || `Sẵn sàng trưng bày ${t("artwork")} của bạn?`}</h2>
            <p className="text-gray-400">{cta?.subtitle || `Dành cho sinh viên Thiết kế Đồ họa UEF`}</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => setPage(cta?.primaryCtaLink || "auth")} className="bg-[#1a4ba8] hover:bg-[#1642a6] text-white px-8 py-3 rounded-lg font-bold transition-colors">{cta?.primaryCta || "Đăng nhập ngay"}</button>
            <button onClick={() => setPage(cta?.secondaryCtaLink || "gallery")} className="border border-gray-600 hover:border-gray-400 text-white px-8 py-3 rounded-lg font-bold transition-colors">{cta?.secondaryCta || t("viewGallery")}</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] text-gray-400 py-10 px-8 text-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-uef.png" alt="UEF" className="h-7 object-contain" />
            <div>
              <p className="font-bold text-white">{getSetting('siteName') || footerInfo?.brand || `UEF Design Gallery - ${t("facultyOfGraphicDesign")}`}</p>
              <p className="text-xs mt-1">{getSetting('footerCopyright') || footerInfo?.copyright || ''}</p>
            </div>
          </div>
          <div className="flex gap-6">
            {footerLinks.map((item, idx) => {
              const c = item.content;
              return (
                <button key={item.id || idx} onClick={() => setPage(c.link)} className="hover:text-white">{c.label}</button>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
