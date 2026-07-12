import sqlite3
import json
import uuid
import datetime

user_id = '80019fed-fb5a-4dca-aa5f-5db7f5f4ce9b'

# Load behance data
try:
    with open('../behance_data.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
except FileNotFoundError:
    print("behance_data.json not found")
    exit(1)

# Get 20 artworks
artworks = data[:20]

db = sqlite3.connect('gallery.db')
cursor = db.cursor()

# Clear existing artworks for this user? The user didn't ask to clear, but maybe they have 6 artworks currently (from screenshot). Let's leave them or delete them? "insert 20 ảnh ấn phẩm nghệ thuật". Let's just insert them.
# Wait, let's delete existing artworks to keep it clean and exact 20? No, just add them.

now = datetime.datetime.utcnow().isoformat()

for art in artworks:
    art_id = str(uuid.uuid4())
    title = art.get('title', 'Artwork')
    description = art.get('description', 'A beautiful design project.')
    image_url = art.get('imageUrl', '')
    
    # Insert into artworks
    cursor.execute("""
        INSERT INTO artworks (artwork_id, user_id, title, description, cover_image_url, created_at, updated_at, is_public, view_count, like_count, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified)
        VALUES (?, ?, ?, ?, ?, ?, ?, 1, 0, 0, 0, 0, 0, 0)
    """, (art_id, user_id, title, description, image_url, now, now))
    

db.commit()
db.close()

print("Inserted 20 artworks successfully.")
