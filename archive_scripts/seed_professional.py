import sqlite3
import uuid
import datetime
import json
import os

db_path = os.path.join("UEFGallery.API", "gallery.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Clean up existing layouts
cursor.execute("DELETE FROM site_sections")
cursor.execute("DELETE FROM site_section_items")

now = datetime.datetime.now(datetime.UTC).isoformat()

def add_section(page, section, label, sort_order, items):
    sec_id = str(uuid.uuid4())
    cursor.execute("""
        INSERT INTO site_sections (section_id, page, section, label, sort_order, is_active, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    """, (sec_id, page, section, label, sort_order, 1, now, now))
    
    for idx, item in enumerate(items):
        item_id = str(uuid.uuid4())
        content = json.dumps(item, ensure_ascii=False)
        cursor.execute("""
            INSERT INTO site_section_items (item_id, section_id, sort_order, content, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (item_id, sec_id, idx + 1, content, 1, now, now))

# --- HOMEPAGE ---
add_section("home", "hero", "Hero Banner", 1, [{
    "preTitle": "KHOA THIẾT KẾ ĐỒ HỌA UEF",
    "title1": "Nơi Trưng Bày Những",
    "title2": "Tác Phẩm",
    "title3": "Sáng Tạo Nhất",
    "title4": "Của Sinh Viên Đồ Họa",
    "primaryCta": "Khám phá không gian",
    "primaryCtaLink": "gallery",
    "secondaryCta": "Đăng nhập Sinh viên",
    "secondaryCtaLink": "auth",
    "note": "* Dành riêng cho sinh viên ngành Thiết kế đồ họa UEF."
}])

add_section("home", "stats", "Statistics", 2, [
    {"value": "1000+", "label": "TÁC PHẨM ĐỒ HỌA"},
    {"value": "150+", "label": "SINH VIÊN NỔI BẬT"},
    {"value": "24", "label": "CHUYÊN NGÀNH MỞ RỘNG"},
    {"value": "100%", "label": "BẢO VỆ BẢN QUYỀN"}
])

add_section("home", "features", "Features Cards", 3, [
    {"title": "Triển Lãm Đa Phương Tiện", "description": "Không gian trưng bày 3D, Branding, UI/UX và Packaging với chất lượng hiển thị cực sắc nét.", "tag": "gallery"},
    {"title": "Hồ Sơ Cá Nhân Chuyên Nghiệp", "description": "Xây dựng Portfolio online mang đậm dấu ấn cá nhân, thu hút ngay sự chú ý của nhà tuyển dụng.", "tag": "portfolio"},
    {"title": "Đánh Giá Trực Tiếp", "description": "Giảng viên có thể chấm điểm và nhận xét trực tiếp trên từng pixel của tác phẩm.", "tag": "feedback"}
])

add_section("home", "steps", "Step Guide", 4, [
    {"stepNumber": "01", "title": "Tạo Hồ Sơ", "description": "Đăng nhập và hoàn thiện thông tin cá nhân."},
    {"stepNumber": "02", "title": "Đăng Tải", "description": "Upload các tác phẩm HD của bạn lên hệ thống."},
    {"stepNumber": "03", "title": "Nhận Xét", "description": "Đợi phản hồi chuyên sâu từ các giảng viên."}
])

add_section("home", "testimonials", "Testimonials / Quotes", 5, [
    {"content": "Một nền tảng tuyệt vời giúp sinh viên đồ họa dễ dàng giới thiệu năng lực thực sự của mình tới doanh nghiệp.", "author": "Trần Thanh Tâm", "role": "Trưởng Khoa TKĐH", "avatar": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80"},
    {"content": "Nhờ có UEF Gallery, mình đã nhận được lời mời làm việc ngay từ khi đồ án tốt nghiệp còn đang được trưng bày.", "author": "Nguyễn Hà Linh", "role": "Sinh Viên K20", "avatar": "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80"}
])

add_section("home", "gallery", "Featured Artworks", 6, [{
    "title": "Tác Phẩm Nổi Bật",
    "description": "Chiêm ngưỡng những đồ án xuất sắc nhất do sinh viên UEF thực hiện."
}])

add_section("home", "cta", "Call to Action", 7, [{
    "title": "Bạn đã sẵn sàng để tỏa sáng?",
    "description": "Bắt đầu xây dựng e-portfolio của riêng bạn và tham gia vào cộng đồng sáng tạo ngay hôm nay.",
    "buttonText": "Tạo Portfolio Ngay",
    "buttonLink": "auth",
    "backgroundImage": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=2000"
}])

# --- ABOUT PAGE ---
add_section("about", "aboutHero", "About Hero", 1, [{
    "description": "UEF Creative Gallery là không gian trưng bày kỹ thuật số độc quyền, tôn vinh những sáng tạo vượt bậc của sinh viên Khoa Thiết kế Đồ họa.",
    "stats": "[{\"value\":\"500+\",\"label\":\"Ấn phẩm\"},{\"value\":\"120+\",\"label\":\"Sinh viên\"}]"
}])

add_section("about", "aboutAudience", "Audience Tabs", 2, [
    {"tab": "Dành cho Sinh viên", "content": "Nền tảng lưu trữ và bảo vệ bản quyền tối đa cho mọi ấn phẩm của bạn."},
    {"tab": "Dành cho Doanh nghiệp", "content": "Tiếp cận trực tiếp với nguồn nhân lực thiết kế chất lượng cao."}
])

add_section("about", "aboutValues", "Core Values", 3, [
    {"title": "Sáng Tạo Không Giới Hạn", "description": "Tự do thể hiện cá tính nghệ thuật."},
    {"title": "Chuyên Nghiệp Hóa", "description": "Quy trình đánh giá và trưng bày đạt chuẩn doanh nghiệp."},
    {"title": "Bảo Mật An Toàn", "description": "Áp dụng Watermark tự động chống vi phạm bản quyền."}
])

add_section("about", "aboutProcess", "Process Steps", 4, [
    {"step": "1", "title": "Thiết Kế", "description": "Sinh viên sáng tạo đồ án."},
    {"step": "2", "title": "Kiểm Duyệt", "description": "Giảng viên đánh giá chuyên môn."},
    {"step": "3", "title": "Trưng Bày", "description": "Tác phẩm được publish lên hệ thống."}
])

add_section("about", "aboutCompare", "Comparison Table", 5, [
    {"feature": "Watermark tự động", "uef": "Có", "other": "Không"},
    {"feature": "Dành riêng cho sinh viên UEF", "uef": "Có", "other": "Không"}
])

add_section("about", "aboutFaq", "FAQ", 6, [
    {"question": "Ai có thể đăng tải tác phẩm?", "answer": "Chỉ sinh viên UEF đã được cấp tài khoản mới có thể tải lên tác phẩm."},
    {"question": "Tác phẩm của tôi có bị copy không?", "answer": "Hệ thống tự động đóng dấu bản quyền ẩn (watermark) lên từng ảnh HD của bạn."}
])

add_section("about", "aboutTeam", "Lecturer Team", 7, [
    {"name": "ThS. Nguyễn Trường", "role": "Giảng viên 3D", "avatar": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80"},
    {"name": "ThS. Lê Hoàng", "role": "Giảng viên Branding", "avatar": "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80"}
])

add_section("about", "aboutCta", "About CTA", 8, [{
    "title": "Tham Gia Cùng Chúng Tôi",
    "description": "Để lại dấu ấn sáng tạo của bạn trong hành trình đại học.",
    "buttonText": "Đăng Ký Ngay",
    "buttonLink": "auth"
}])

# --- FOOTER ---
add_section("footer", "footerLinks", "Footer Links", 1, [
    {"label": "Trang Chủ", "url": "/"},
    {"label": "Bộ Sưu Tập", "url": "/gallery"},
    {"label": "Giới Thiệu", "url": "/about"},
    {"label": "Đăng Nhập", "url": "/auth"}
])

add_section("footer", "footerSocial", "Social Media", 2, [
    {"platform": "Facebook", "url": "https://facebook.com/uef", "icon": "facebook"},
    {"platform": "Behance", "url": "https://behance.net/uef", "icon": "behance"}
])

add_section("footer", "footerInfo", "Footer Info", 3, [{
    "address": "141 Điện Biên Phủ, Phường 15, Q. Bình Thạnh, TP.HCM",
    "phone": "(028) 5422 5555",
    "email": "thietkedohoa@uef.edu.vn"
}])

conn.commit()
conn.close()
print("Success")
