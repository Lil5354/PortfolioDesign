import sqlite3

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

# 1. Update the account_badges table with the correct icons
badges = [
    ("Sinh viên Năm 1", "/Logoicon/nam-1.png"),
    ("Sinh viên Năm 2", "/Logoicon/nam-2.png"),
    ("Sinh viên Năm 3", "/Logoicon/nam-3.png"),
    ("Sinh viên Năm cuối", "/Logoicon/nam-cuoi.png")
]

for name, icon in badges:
    cursor.execute("UPDATE account_badges SET icon_url = ? WHERE name LIKE ?", (icon, '%' + name + '%'))

# 2. Get the badge ID for "Năm cuối"
cursor.execute("SELECT account_badge_id FROM account_badges WHERE name LIKE '%Năm cuối%'")
res = cursor.fetchone()

if res:
    nam_cuoi_id = res[0]
    user_id = '931b288c-9d48-4dc7-826b-64574e6f1879' # user Vy
    
    # 3. Delete all badges for this user
    cursor.execute("DELETE FROM user_account_badges WHERE user_id = ?", (user_id,))
    
    # 4. Insert only the "Năm cuối" badge
    cursor.execute("INSERT INTO user_account_badges (user_id, account_badge_id, assigned_at) VALUES (?, ?, datetime('now'))", (user_id, nam_cuoi_id))

db.commit()
db.close()
print("Badges fixed!")
