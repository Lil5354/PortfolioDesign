import sqlite3
import uuid
import datetime
import json
import os

db_path = os.path.join("UEFGallery.API", "gallery.db")
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

sections = [
  ("home", "hero", "Hero Banner"),
  ("home", "features", "Features Cards"),
  ("home", "steps", "Step Guide"),
  ("home", "stats", "Statistics"),
  ("home", "testimonials", "Testimonials / Quotes"),
  ("home", "gallery", "Featured Artworks"),
  ("home", "cta", "Call to Action"),
  ("about", "aboutHero", "About Hero"),
  ("about", "aboutAudience", "Audience Tabs"),
  ("about", "aboutValues", "Core Values"),
  ("about", "aboutProcess", "Process Steps"),
  ("about", "aboutCompare", "Comparison Table"),
  ("about", "aboutFaq", "FAQ"),
  ("about", "aboutTeam", "Lecturer Team"),
  ("about", "aboutCta", "About CTA"),
  ("footer", "footerLinks", "Footer Links"),
  ("footer", "footerSocial", "Social Media"),
  ("footer", "footerInfo", "Footer Info"),
]

now = datetime.datetime.utcnow().isoformat() + "Z"

for idx, (page, sec, label) in enumerate(sections):
    cursor.execute("SELECT section_id FROM site_sections WHERE section = ?", (sec,))
    row = cursor.fetchone()
    if not row:
        sec_id = str(uuid.uuid4())
        cursor.execute("""
            INSERT INTO site_sections (section_id, page, section, label, sort_order, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (sec_id, page, sec, label, idx + 1, 1, now, now))
        
        item_id = str(uuid.uuid4())
        content = json.dumps({
            "title": f"Mẫu {label}",
            "description": f"Mô tả cho {label}"
        })
        cursor.execute("""
            INSERT INTO site_section_items (item_id, section_id, sort_order, content, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (item_id, sec_id, 1, content, 1, now, now))

conn.commit()
conn.close()
print("Thành công nạp toàn bộ cấu trúc Layout Settings.")
