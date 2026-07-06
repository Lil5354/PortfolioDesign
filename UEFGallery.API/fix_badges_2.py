import sqlite3

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

# 1. Update the account_badges table with the correct icons
badges = [
    ("Designer Mầm non", "/Logoicon/nam-1.png"),
    ("Designer Thực tập", "/Logoicon/nam-2.png"),
    ("Designer Chuyên nghiệp", "/Logoicon/nam-3.png"),
    ("Designer Tiền bối", "/Logoicon/nam-cuoi.png")
]

for name, icon in badges:
    cursor.execute("UPDATE account_badges SET icon_url = ? WHERE name = ?", (icon, name))

# 2. Get the badge ID for "Designer Tiền bối"
cursor.execute("SELECT account_badge_id FROM account_badges WHERE name = 'Designer Tiền bối'")
res = cursor.fetchone()

if res:
    tien_boi_id = res[0]
    user_id = '931b288c-9d48-4dc7-826b-64574e6f1879' # user Vy
    
    # 3. Delete all badges for this user
    cursor.execute("DELETE FROM user_account_badges WHERE user_id = ?", (user_id,))
    
    # 4. Insert only the "Designer Tiền bối" badge
    cursor.execute("INSERT INTO user_account_badges (user_id, account_badge_id, assigned_at) VALUES (?, ?, datetime('now'))", (user_id, tien_boi_id))

db.commit()
db.close()
with open('fix_done.txt', 'w') as f:
    f.write('Done!')
