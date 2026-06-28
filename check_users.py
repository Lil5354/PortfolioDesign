import sqlite3
conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.execute("SELECT user_id, email, role FROM users WHERE email LIKE '%sv@%' OR role = 'lecturer'")
print(cur.fetchall())

cur = conn.execute("SELECT id, title, student_id FROM artworks LIMIT 2")
print(cur.fetchall())
