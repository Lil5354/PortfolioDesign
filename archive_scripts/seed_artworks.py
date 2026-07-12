import sqlite3, json, uuid, random, datetime
db = sqlite3.connect('UEFGallery.API/gallery.db')
db.execute('DELETE FROM artworks')
db.commit()
behance = json.load(open('behance_data.json', encoding='utf8'))
students = db.execute("SELECT user_id FROM Users WHERE email LIKE 'sv%@uef.edu.vn'").fetchall()
i = 0
for student in students:
    for j in range(10):
        b = behance[i % len(behance)]
        i += 1
        db.execute('INSERT INTO Artworks (artwork_id, user_id, title, description, subject, cover_image_url, is_public, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified, view_count, like_count, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, 0, 0, 1, 1, ?, ?, ?, ?, ?)', (str(uuid.uuid4()), student[0], b.get('title',''), b.get('description',''), b.get('category',''), b.get('imageUrl',''), random.randint(100, 50100), random.randint(10, 5010), json.dumps(['design', b.get('category', '')]), datetime.datetime.now().isoformat(), datetime.datetime.now().isoformat()))
db.commit()
print('Seeded!')
