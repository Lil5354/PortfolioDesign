import sqlite3
import json

db_path = "c:/TÀI LIỆU NĂM CUỐI VÀ CV/prototype/UEFGallery.API/gallery.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Get 3 random artworks
cursor.execute("SELECT artwork_id, title, cover_image_url FROM artworks LIMIT 3")
artworks = cursor.fetchall()

# Get the orders
cursor.execute("SELECT message_id, content FROM messages WHERE purpose = 'order'")
orders = cursor.fetchall()

for i, order in enumerate(orders):
    if i < len(artworks):
        artwork = artworks[i]
        new_content = {
            "artworkId": artwork[0],
            "artworkTitle": artwork[1],
            "artworkImage": artwork[2],
            "company": "Hoa Mai Printing" if i == 0 else "NXB Kim Đồng" if i == 1 else "VLU",
            "phone": "0987654321",
            "description": order[1] if not order[1].startswith('{') else json.loads(order[1]).get('description', 'Yêu cầu in ấn')
        }
        cursor.execute("UPDATE messages SET content = ? WHERE message_id = ?", (json.dumps(new_content, ensure_ascii=False), order[0]))

conn.commit()
print("Updated orders with JSON content!")
conn.close()
