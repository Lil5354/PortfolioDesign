const fs = require('fs');
let code = fs.readFileSync('LandingPage.jsx', 'utf8');

// Import useI18n
if (!code.includes('import { useI18n } from ')) {
  code = code.replace('import { ArrowRight', 'import { useI18n } from "./lib/i18n";\nimport { ArrowRight');
}

// Add const { t, currentLang, setLang } = useI18n();
if (!code.includes('useI18n()')) {
  code = code.replace('const artworks = [', 'const { t, currentLang, setLang: setLanguage } = useI18n();\n  const artworks = [');
}

// Replace strings
code = code.replace(/Khám phá Gallery/g, '{t("aboutCtaBtn2")}');
code = code.replace(/Đăng nhập sinh viên/g, '{t("studentLogin")}');
code = code.replace(/>Đăng nhập</g, '>{t("login")}<');
code = code.replace(/Mọi thứ bạn cần trong một nền tảng/g, '{t("everythingInOnePlatform")}');
code = code.replace(/VI \/ EN/g, '<button onClick={() => setLanguage(currentLang === "vi" ? "en" : "vi")} className="font-bold uppercase">{currentLang === "vi" ? "EN" : "VI"}</button>');
code = code.replace(/Trang chủ/g, '{t("home")}');
code = code.replace(/Giới thiệu Khoa/g, '{t("aboutFaculty")}');
code = code.replace(/Khoa Thiết kế Đồ họa/g, '{t("facultyOfGraphicDesign")}');
code = code.replace(/Nơi trưng bày/g, '{t("whereToDisplay")}');
code = code.replace(/tác phẩm/g, '{t("artwork")}');
code = code.replace(/của sinh viên UEF/g, '{t("ofUefStudents")}');
code = code.replace(/Ấn phẩm trưng bày/g, '{t("publishedArtworks")}');
code = code.replace(/Giảng viên tham gia/g, '{t("participatingLecturers")}');
code = code.replace(/>Môn học</g, '>{t("subjects")}<');
code = code.replace(/Hành trình sáng tạo/g, '{t("creativeJourneys")}');
code = code.replace(/Tính năng cốt lõi/g, '{t("coreFeatures")}');
code = code.replace(/Sản phẩm nổi bật/g, '{t("featuredProducts")}');
code = code.replace(/Khám phá ấn phẩm mới nhất/g, '{t("exploreLatestArtworks")}');
code = code.replace(/Xem toàn bộ Gallery &rsaquo;/g, '{t("viewFullGallery")} &rsaquo;');
code = code.replace(/>Nổi bật</g, '>{t("highlighted")}<');
code = code.replace(/Hướng dẫn/g, '{t("guidelines")}');
code = code.replace(/Bắt đầu chỉ trong 3 bước/g, '{t("startIn3Steps")}');
code = code.replace(/Đăng tải ấn phẩm/g, '{t("uploadArtwork")}');
code = code.replace(/Chia sẻ Portfolio/g, '{t("sharePortfolio")}');
code = code.replace(/Sẵn sàng trưng bày tác phẩm của bạn\?/g, '{t("readyToDisplay")}?');
code = code.replace(/>Xem Gallery</g, '>{t("viewGallery")}<');
code = code.replace(/>Liên hệ</g, '>{t("contact")}<');
code = code.replace(/>Chính sách</g, '>{t("policy")}<');
code = code.replace(/Gallery Triển lãm/g, '{t("exhibitionGallery")}');
code = code.replace(/Portfolio Cá nhân/g, '{t("personalPortfolio")}');
code = code.replace(/Điểm số & Nhận xét/g, '{t("scoresAndFeedback")}');
code = code.replace(/Đa thiết bị/g, '{t("multiDevice")}');
code = code.replace(/Nổi bật & Tương tác/g, '{t("highlightAndInteract")}');
code = code.replace(/Kết nối Tuyển dụng/g, '{t("recruitmentConnection")}');

// Fix the hover issue on the first frame of Features Section
code = code.replace(/border-\[#077E9E\] shadow-sm hover:shadow-md transition-shadow/g, 'border-gray-200 hover:border-[#077E9E] hover:shadow-md transition-all cursor-default');
code = code.replace(/bg-\[#E8F4F8\] text-\[#077E9E\]/g, 'bg-gray-100 text-gray-600 group-hover:bg-[#E8F4F8] group-hover:text-[#077E9E]');
// We need to add group class to the container
code = code.replace(/className="bg-white p-8 rounded-2xl border-gray-200 hover:border-\[#077E9E\] hover:shadow-md transition-all cursor-default"/g, 'className="group bg-white p-8 rounded-2xl border border-gray-200 hover:border-[#077E9E] hover:shadow-md transition-all cursor-default"');

fs.writeFileSync('LandingPage.jsx', code);
