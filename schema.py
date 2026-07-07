import sqlite3
conn = sqlite3.connect('UEFGallery.API/gallery.db')
print('portfolio_settings:', [t for t in conn.execute("PRAGMA table_info(portfolio_settings)")])
