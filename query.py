import sqlite3
import json

conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.cursor()
cur.execute("SELECT user_id, full_name FROM users WHERE full_name LIKE '%Vy%'")
rows = cur.fetchall()
with open('users_out.json', 'w', encoding='utf-8') as f:
    json.dump(rows, f, ensure_ascii=False)
