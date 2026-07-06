import sqlite3
db_path = "c:/TÀI LIỆU NĂM CUỐI VÀ CV/prototype/UEFGallery.API/gallery.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()
cursor.execute("PRAGMA table_info(Messages)")
cols = cursor.fetchall()
if not cols:
    cursor.execute("PRAGMA table_info(messages)")
    cols = cursor.fetchall()
print([c[1] for c in cols])
