import sqlite3
import json

conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.cursor()
cur.execute("SELECT name, sql FROM sqlite_master WHERE type='table'")
tables = cur.fetchall()
with open('schema_out.json', 'w', encoding='utf-8') as f:
    json.dump(tables, f, ensure_ascii=False, indent=2)
