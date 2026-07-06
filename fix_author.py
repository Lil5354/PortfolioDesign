import sqlite3
import json

db_path = "c:/TÀI LIỆU NĂM CUỐI VÀ CV/prototype/UEFGallery.API/gallery.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT message_id, content FROM messages WHERE purpose = 'order'")
orders = cursor.fetchall()

updated = 0
for order in orders:
    try:
        content = json.loads(order[1])
        if "artworkId" in content:
            artwork_id = content["artworkId"]
            cursor.execute("SELECT user_id FROM artworks WHERE artwork_id = ?", (artwork_id,))
            user_row = cursor.fetchone()
            if user_row:
                real_user_id = user_row[0]
                cursor.execute("UPDATE messages SET recipient_id = ? WHERE message_id = ?", (real_user_id, order[0]))
                updated += 1
    except Exception as e:
        print(f"Error parsing json for {order[0]}: {e}")

conn.commit()
print(f"Updated {updated} orders with their real artwork author IDs.")
conn.close()
