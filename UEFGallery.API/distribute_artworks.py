import sqlite3
import random

conn = sqlite3.connect('gallery.db')
cursor = conn.cursor()

# Get all student IDs (role = 'student')
cursor.execute("SELECT user_id FROM Users WHERE role = 'student'")
users = [row[0] for row in cursor.fetchall()]

if not users:
    print("No students found.")
    exit()

# Get all artwork IDs
cursor.execute("SELECT artwork_id FROM Artworks")
artworks = [row[0] for row in cursor.fetchall()]

if not artworks:
    print("No artworks found.")
    exit()

# Assign 2-3 artworks for each student to make sure everyone has some
artworks_to_distribute = list(artworks)
random.shuffle(artworks_to_distribute)

for user_id in users:
    # take 2 artworks from the list for this user
    for _ in range(2):
        if artworks_to_distribute:
            aw = artworks_to_distribute.pop()
            cursor.execute("UPDATE Artworks SET user_id = ? WHERE artwork_id = ?", (user_id, aw))

# Distribute the rest randomly
for aw in artworks_to_distribute:
    cursor.execute("UPDATE Artworks SET user_id = ? WHERE artwork_id = ?", (random.choice(users), aw))

conn.commit()
conn.close()

print(f"Assigned {len(artworks)} artworks randomly to {len(users)} students.")
