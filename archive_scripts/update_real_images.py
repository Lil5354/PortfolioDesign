import sqlite3
import json
import random
import sys

def main(json_file_path):
    # Read the JSON file with real Behance data
    with open(json_file_path, 'r', encoding='utf-8') as f:
        real_data = json.load(f)
        
    if not real_data:
        print("No data found in JSON.")
        return

    # Connect to SQLite DB
    db_path = "gallery.db"
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all artworks
    cursor.execute("SELECT artwork_id FROM artworks")
    artworks = cursor.fetchall()

    for idx, (artwork_id,) in enumerate(artworks):
        # Pick a random real graphic design project
        item = random.choice(real_data)
        title = item.get("title", f"Graphic Design Project {idx}")
        image_url = item.get("imageUrl", "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800")
        
        # Generate 2-3 images (duplicating the main image or taking random others)
        file_urls = [image_url]
        for _ in range(random.randint(1, 2)):
            file_urls.append(random.choice(real_data).get("imageUrl", image_url))
        
        file_urls_json = json.dumps(file_urls)
        
        # Update the database
        cursor.execute("""
            UPDATE artworks 
            SET title = ?, cover_image_url = ?, file_urls = ?
            WHERE artwork_id = ?
        """, (title, image_url, file_urls_json, artwork_id))

    conn.commit()
    conn.close()
    print(f"Successfully updated {len(artworks)} artworks with real Behance images!")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python update_real_images.py <json_data_file>")
    else:
        main(sys.argv[1])
