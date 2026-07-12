import sqlite3

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

cursor.execute("PRAGMA table_info('timeline_entries')")
print('Cols:', cursor.fetchall())

cursor.execute("SELECT * FROM timeline_entries")
entries = cursor.fetchall()
print('Count:', len(entries))
for e in entries:
    print(e)
db.close()
