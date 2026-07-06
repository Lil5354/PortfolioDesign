import sqlite3
import random
import uuid

conn = sqlite3.connect('gallery.db')
cursor = conn.cursor()

# 1. Rename "Mock User" and fix avatars
vn_names = [
    "Trần Hữu Thắng", "Lê Văn Đạt", "Nguyễn Thị Mai", "Phạm Văn Đức", "Hoàng Ngọc Hân",
    "Vũ Minh Tuấn", "Đỗ Quỳnh Như", "Bùi Tấn Phát", "Hồ Bích Liên", "Ngô Quốc Bảo",
    "Đặng Thu Thảo", "Dương Tùng Lâm", "Lý Thị Kiều", "Trần Khả Ái", "Lê Gia Khiêm",
    "Nguyễn Bảo Trâm", "Phạm Hữu Trí", "Hoàng Kim Oanh", "Vũ Nhật Nam", "Đỗ Thị Thu"
]

cursor.execute("SELECT user_id, full_name, avatar_url FROM Users WHERE role = 'student'")
students = cursor.fetchall()

for (user_id, full_name, avatar_url) in students:
    new_name = full_name
    if "mock" in full_name.lower() or "student" in full_name.lower():
        new_name = random.choice(vn_names) + f" {random.randint(1, 99)}"
        vn_names.append(new_name) # to avoid running out if not enough, though random.choice is fine
    
    # Always set a reliable avatar URL using DiceBear or pravatar
    # pravatar sometimes goes down, DiceBear is very stable
    new_avatar = f"https://api.dicebear.com/7.x/notionists/svg?seed={user_id}"
    
    cursor.execute("UPDATE Users SET full_name = ?, avatar_url = ? WHERE user_id = ?", (new_name, new_avatar, user_id))

# 2. Ensure each student has at least 5 artworks
cursor.execute("SELECT artwork_id, title, description, tools_used, subject, semester, academic_year, tags, collaborators, collaborator_ids, cover_image_url, original_cover_url, watermark_image_url, file_urls, watermark_text, watermark_position, is_public, is_pending, is_highlighted, is_ai_confirmed, ai_score, ai_generated_pct, is_ai_verified, view_count, like_count, portfolio_slug, blocks_json, created_at, updated_at FROM Artworks LIMIT 200")
all_artworks_template = cursor.fetchall()

for (user_id, _, _) in students:
    cursor.execute("SELECT count(*) FROM Artworks WHERE user_id = ?", (user_id,))
    count = cursor.fetchone()[0]
    
    if count < 5:
        needed = 5 - count
        templates = random.sample(all_artworks_template, min(needed, len(all_artworks_template)))
        
        for t in templates:
            new_id = str(uuid.uuid4())
            # t[0] is artwork_id, we replace it with new_id, and t[1] is user_id in the target table (wait, the SELECT didn't include user_id)
            # The columns selected:
            # 0: artwork_id, 1: title, 2: description, 3: tools_used, 4: subject, 5: semester, 6: academic_year, 7: tags, 
            # 8: collaborators, 9: collaborator_ids, 10: cover_image_url, 11: original_cover_url, 12: watermark_image_url, 
            # 13: file_urls, 14: watermark_text, 15: watermark_position, 16: is_public, 17: is_pending, 18: is_highlighted, 
            # 19: is_ai_confirmed, 20: ai_score, 21: ai_generated_pct, 22: is_ai_verified, 23: view_count, 24: like_count, 
            # 25: portfolio_slug, 26: blocks_json, 27: created_at, 28: updated_at
            
            cursor.execute("""
                INSERT INTO Artworks (
                    artwork_id, user_id, title, description, tools_used, subject, semester, academic_year, tags, 
                    collaborators, collaborator_ids, cover_image_url, original_cover_url, watermark_image_url, file_urls, 
                    watermark_text, watermark_position, is_public, is_pending, is_highlighted, is_ai_confirmed, ai_score, 
                    ai_generated_pct, is_ai_verified, view_count, like_count, portfolio_slug, blocks_json, created_at, updated_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                new_id, user_id, t[1], t[2], t[3], t[4], t[5], t[6], t[7],
                t[8], t[9], t[10], t[11], t[12], t[13], t[14], t[15], t[16], t[17], t[18],
                t[19], t[20], t[21], t[22], t[23], t[24], t[25], t[26], t[27], t[28]
            ))

conn.commit()
conn.close()

print("Data fixed successfully.")
