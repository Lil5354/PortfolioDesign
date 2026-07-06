import sqlite3
import json
import random
import uuid
from datetime import datetime, timedelta

def main():
    conn = sqlite3.connect('gallery.db')
    cursor = conn.cursor()

    # Clear existing artworks
    cursor.execute("DELETE FROM Artworks")

    # Get students
    cursor.execute("SELECT user_id FROM Users WHERE role = 'student'")
    students = [row[0] for row in cursor.fetchall()]

    if not students:
        print("No students found!")
        return

    # Load 119 Behance images
    behance_images = []
    try:
        with open('../behance_data.json', 'r', encoding='utf-8') as f:
            data = json.load(f)
            behance_images = [item['imageUrl'] for item in data if 'imageUrl' in item]
    except Exception as e:
        print("Could not load behance_data:", e)
    
    # Fallback/Additional real design images from SeedController
    real_images = [
        "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1000&q=80",
        "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=1000&q=80",
        "https://images.unsplash.com/photo-1558655146-d09347e92766?w=1000&q=80",
        "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=1000&q=80",
        "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=1000&q=80",
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=1000&q=80",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1000&q=80",
        "https://images.unsplash.com/photo-1563089145-599997674d42?w=1000&q=80",
        "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1000&q=80",
        "https://images.unsplash.com/photo-1505909182942-e2f09aee3e89?w=1000&q=80",
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1000&q=80",
        "https://images.unsplash.com/photo-1604871000636-074fa5117945?w=1000&q=80",
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=1000&q=80",
        "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=1000&q=80",
        "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=1000&q=80",
        "https://images.unsplash.com/photo-1561070791-36c11767b26a?w=1000&q=80",
        "https://images.unsplash.com/photo-1561089489-f13d5e730d72?w=1000&q=80",
        "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?w=1000&q=80"
    ]
    
    all_images = list(set(behance_images + real_images))
    if not all_images:
        all_images = real_images

    adjectives = ["Minimalist", "Modern", "Creative", "Vibrant", "Abstract", "Corporate", "Retro", "Vintage", "Futuristic", "Neon", "Cyberpunk", "Eco-friendly", "Luxury", "Dynamic", "Geometric", "Isometric", "Playful", "Elegant", "Dark", "Light"]
    nouns = ["Branding", "UI/UX Design", "Poster Series", "Typography", "Logo Concept", "Mobile App", "Web Interface", "Packaging", "Motion Graphics", "Illustration", "Character Design", "3D Art", "Editorial Layout", "Social Media Templates", "Dashboard UI", "Visual Identity", "Photography Zine", "Icon Set", "Menu Design", "Album Cover"]

    categories = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"]

    generated_titles = set()
    artworks_to_insert = []

    # Generate 500 artworks to ensure every student has ~6-7 artworks
    for i in range(500):
        student_id = students[i % len(students)]
        
        # Ensure unique title
        while True:
            title = f"{random.choice(adjectives)} {random.choice(nouns)} #{random.randint(100, 9999)}"
            if title not in generated_titles:
                generated_titles.add(title)
                break
        
        cover_image = random.choice(all_images)
        
        # More than 3 images (4 or 5)
        num_images = random.randint(4, 5)
        file_urls = [cover_image] + random.sample(all_images, num_images - 1)
        
        subject = random.choice(categories)
        created_at = (datetime.utcnow() - timedelta(days=random.randint(1, 300))).strftime('%Y-%m-%d %H:%M:%S')

        artwork = (
            str(uuid.uuid4()), # id
            student_id,
            title,
            f"Một ấn phẩm đồ họa độc đáo tập trung vào {subject.lower()} với phong cách thiết kế hiện đại.", # desc
            json.dumps(["Figma", "Photoshop", "Illustrator"][:random.randint(1,3)]), # tools
            subject,
            "HK1",
            "2023-2024",
            json.dumps(["Design", "Creative", subject]),
            "[]", # collaborators
            "[]", # collaborator_ids
            cover_image,
            cover_image,
            "",
            json.dumps(file_urls),
            "",
            "BottomRight",
            1, # is_public
            0, # is_pending
            0, # is_highlighted
            0, # is_ai_confirmed
            0.0,
            0.0,
            0,
            random.randint(100, 5000), # view count
            random.randint(10, 500), # like count
            "",
            "[]",
            created_at,
            created_at
        )
        artworks_to_insert.append(artwork)

    # Insert batch
    cursor.executemany("""
        INSERT INTO Artworks (
            artwork_id, user_id, title, description, tools_used, subject, semester, academic_year, tags, 
            collaborators, collaborator_ids, cover_image_url, original_cover_url, watermark_image_url, file_urls, 
            watermark_text, watermark_position, is_public, is_pending, is_highlighted, is_ai_confirmed, ai_score, 
            ai_generated_pct, is_ai_verified, view_count, like_count, portfolio_slug, blocks_json, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, artworks_to_insert)

    conn.commit()
    conn.close()

    print(f"Successfully generated {len(artworks_to_insert)} unique artworks across {len(students)} students.")

if __name__ == "__main__":
    main()
