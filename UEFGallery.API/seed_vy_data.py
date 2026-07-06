import sqlite3
import uuid
import json
from datetime import datetime

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

user_id = '931b288c-9d48-4dc7-826b-64574e6f1879'

# 1. Update Portfolio Settings
social_links = json.dumps({"behance":"https://behance.net/duonghuuvy", "linkedin":"https://linkedin.com/in/duonghuuvy"})
banner_url = "https://mir-s3-cdn-cf.behance.net/projects/max_808_webp/052bf1243652865.Y3JvcCwzMDQ0LDIzODEsMCw1MzU.jpg"

cursor.execute("SELECT setting_id FROM portfolio_settings WHERE user_id = ?", (user_id,))
res = cursor.fetchone()
if res:
    cursor.execute("""
        UPDATE portfolio_settings 
        SET profile_headline = ?, major = ?, year_level = ?, is_portfolio_public = 1, social_links = ?, banner_url = ?
        WHERE user_id = ?
    """, ("Họa sĩ thiết kế tự do", "Thiết kế Đồ họa", "Năm 4", social_links, banner_url, user_id))
else:
    cursor.execute("""
        INSERT INTO portfolio_settings (setting_id, user_id, profile_headline, major, year_level, is_portfolio_public, social_links, banner_url, public_moodboards, updated_at, show_email, contact_enabled, display_order)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, 1)
    """, (str(uuid.uuid4()), user_id, "Creative Designer", "Graphic Design", "Senior", 1, social_links, banner_url, json.dumps(["Creative Inspiration"]), datetime.now().isoformat()))

# 2. Insert Artworks
artworks_data = [
    ("Neon Cyberpunk City", "A futuristic city in neon colors.", "https://images.unsplash.com/photo-1515630278258-407f66498911?w=800&q=80", "Illustration"),
    ("Minimalist Typography Poster", "Exploring typography in a minimalist way.", "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", "Typography"),
    ("Abstract Nature", "Nature elements in an abstract composition.", "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=800&q=80", "Digital Art"),
    ("Corporate Branding", "Brand identity for a modern corporate.", "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", "Branding"),
    ("Vintage Magazine Layout", "Editorial design inspired by 90s magazines.", "https://images.unsplash.com/photo-1544716278-e513176f20b5?w=800&q=80", "Editorial"),
    ("3D Product Render", "High-quality 3D render for a perfume bottle.", "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=800&q=80", "3D"),
    ("UI/UX Mobile App", "Interface design for a wellness app.", "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&q=80", "UI/UX"),
    ("E-commerce Web Design", "Web design for a fashion brand.", "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", "Web Design")
]

artwork_ids = []
for title, desc, cover, category in artworks_data:
    art_id = str(uuid.uuid4())
    artwork_ids.append(art_id)
    cursor.execute("""
        INSERT INTO artworks (
            artwork_id, user_id, title, description, tools_used, subject, semester, academic_year, tags, 
            collaborators, collaborator_ids, cover_image_url, original_cover_url, watermark_image_url, file_urls, 
            watermark_text, watermark_position, is_public, is_pending, is_highlighted, is_ai_confirmed, ai_score, 
            ai_generated_pct, is_ai_verified, view_count, like_count, portfolio_slug, blocks_json, created_at, updated_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 0, 0, 0, 150, 45, '', '[]', ?, ?)
    """, (
        art_id, user_id, title, desc, '[]', category, "HK1", "2023-2024", '[]', '[]', '[]', cover, cover, '', '[]', '', 'BottomRight',
        datetime.now().isoformat(), datetime.now().isoformat()
    ))

# 3. Update Featured Artworks
cursor.execute("UPDATE portfolio_settings SET featured_artwork_ids = ? WHERE user_id = ?", (json.dumps(artwork_ids[:3]), user_id))

# 4. Insert Timeline Entries
cursor.execute("DELETE FROM timeline_entries WHERE user_id = ?", (user_id,))
timelines = [
    ("Tháng 9", "2022", "Bắt đầu học UEF", "Nhập học ngành Thiết kế Đồ họa.", "education", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80"),
    ("Tháng 5", "2024", "Thực tập tại Agency", "Làm việc với vai trò Junior UI/UX Designer.", "work", "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&q=80"),
    ("Tháng 12", "2025", "Đồ án Tốt nghiệp", "Hoàn thành đồ án với điểm số xuất sắc.", "award", "https://images.unsplash.com/photo-1523287562758-66c7fc58967f?w=800&q=80")
]
for m, y, t, d, ty, img in timelines:
    cursor.execute("""
        INSERT INTO timeline_entries (entry_id, user_id, month, year, title, description, tags, image_url, sort_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, '[]', ?, 0, ?, ?)
    """, (str(uuid.uuid4()), user_id, m, y, t, d, img, datetime.now().isoformat(), datetime.now().isoformat()))

# 5. Insert Collection Items (Moodboard)
cursor.execute("DELETE FROM collection_items WHERE lecturer_id = ? AND collection_name = 'Creative Inspiration'", (user_id,))
for art_id in artwork_ids[3:7]:
    cursor.execute("""
        INSERT INTO collection_items (collection_item_id, lecturer_id, artwork_id, collection_name, added_at)
        VALUES (?, ?, ?, ?, ?)
    """, (str(uuid.uuid4()), user_id, art_id, "Creative Inspiration", datetime.now().isoformat()))

# 6. Update badge icons so they display properly
cursor.execute("UPDATE account_badges SET icon_url = '/Logoicon/nam-cuoi.png'")

db.commit()
db.close()
print("Seeded successfully!")
