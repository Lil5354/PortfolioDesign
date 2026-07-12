import sqlite3

conn = sqlite3.connect('UEFGallery.API/gallery.db')
cur = conn.cursor()
cur.execute("UPDATE Messages SET Content = replace(Content, '119', 'df8f539e-711b-4101-89a5-553cda7de449')")
conn.commit()
conn.close()
print("DB fixed")
