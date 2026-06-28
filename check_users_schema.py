import sqlite3
conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.execute("PRAGMA table_info(Users)")
print([row[1] for row in cur.fetchall()])
