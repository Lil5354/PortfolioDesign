import sqlite3
import json

conn = sqlite3.connect('gallery.db')
c = conn.cursor()

def check_json(table, columns, row):
    for i, col in enumerate(columns):
        val = row[i]
        if isinstance(val, str) and val.strip():
            # Check if this column is meant to be JSON in EF Core
            # Typical JSON columns in EF Core: tags, blocks_json, file_urls, collaborators, collaborator_ids, social_links
            if col in ['tags', 'blocks_json', 'file_urls', 'collaborators', 'collaborator_ids', 'social_links', 'featured_artwork_ids', 'public_moodboards']:
                try:
                    json.loads(val)
                except Exception as e:
                    print(f"INVALID JSON in {table}.{col} (ID: {row[0]}): {val[:50]} (Error: {e})")

for table in ['artworks', 'users', 'portfolio_settings', 'timeline_entries']:
    c.execute(f"PRAGMA table_info({table})")
    columns = [r[1] for r in c.fetchall()]
    c.execute(f"SELECT * FROM {table}")
    for row in c.fetchall():
        check_json(table, columns, row)
