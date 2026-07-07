const db = require('better-sqlite3')('./UEFGallery.API/gallery.db');
db.pragma('foreign_keys = OFF');

// Pick the specific user
const user = db.prepare("SELECT user_id, full_name, email FROM users WHERE user_id = '5cf74b3b-f62e-4684-b897-c79b36381300'").get();
if (!user) {
    console.log('No user found');
    process.exit(1);
}
console.log('Making perfect demo for:', user.full_name);

// 1. Set a perfect avatar
db.prepare("UPDATE users SET avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&fit=crop&q=80' WHERE user_id = ?").run(user.user_id);

// 2. Set portfolio settings
const socialLinks = JSON.stringify({
    facebook: 'https://facebook.com',
    behance: 'https://behance.net',
    linkedin: 'https://linkedin.com'
});
db.prepare(`UPDATE portfolio_settings SET 
    banner_url = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&fit=crop&q=80',
    social_links = ?,
    profile_headline = 'Creative Designer & 3D Artist | Passionate about crafting digital experiences',
    contact_enabled = 1,
    show_email = 1
    WHERE user_id = ?`).run(socialLinks, user.user_id);

// 3. Setup Timeline
db.prepare('DELETE FROM timeline_entries WHERE user_id = ?').run(user.user_id);
const crypto = require('crypto');
const insertTimeline = db.prepare('INSERT INTO timeline_entries (entry_id, user_id, title, description, month, year, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
insertTimeline.run(crypto.randomUUID(), user.user_id, 'Started University', 'Began my journey at UEF', '09', '2022', 1, new Date().toISOString(), new Date().toISOString());
insertTimeline.run(crypto.randomUUID(), user.user_id, 'First Award', 'Won the 1st prize in creative design contest', '05', '2023', 2, new Date().toISOString(), new Date().toISOString());
insertTimeline.run(crypto.randomUUID(), user.user_id, 'Freelance Designer', 'Started working with international clients', '01', '2024', 3, new Date().toISOString(), new Date().toISOString());
insertTimeline.run(crypto.randomUUID(), user.user_id, 'Graduation Project', 'Currently working on my final thesis', '06', '2025', 4, new Date().toISOString(), new Date().toISOString());

// 4. Setup Moodboard
const collName = 'Inspiration Moodboard';
db.prepare('DELETE FROM collection_items WHERE lecturer_id = ?').run(user.user_id); // cleanup if exists

const someArtworks = db.prepare("SELECT artwork_id FROM artworks WHERE cover_image_url != '' LIMIT 5").all();
const insertItem = db.prepare('INSERT INTO collection_items (collection_item_id, lecturer_id, artwork_id, collection_name, note, added_at) VALUES (?, ?, ?, ?, ?, ?)');
someArtworks.forEach((art, i) => {
    insertItem.run(crypto.randomUUID(), user.user_id, art.artwork_id, collName, 'Great reference', new Date().toISOString());
});

db.prepare('UPDATE portfolio_settings SET public_moodboards = ? WHERE user_id = ?').run(JSON.stringify([collName]), user.user_id);

// 5. Fix broken images for this user
const brokenArts = db.prepare("SELECT artwork_id FROM artworks WHERE user_id = ? AND (cover_image_url IS NULL OR cover_image_url = '' OR cover_image_url LIKE '%/images/default%')").all(user.user_id);
const validImage = db.prepare("SELECT cover_image_url FROM artworks WHERE cover_image_url != '' AND cover_image_url NOT LIKE '%/images/default%' LIMIT 1").get().cover_image_url;
const fixArt = db.prepare('UPDATE artworks SET cover_image_url = ? WHERE artwork_id = ?');
brokenArts.forEach(art => {
    fixArt.run(validImage, art.artwork_id);
});

console.log('Demo setup complete for user:', user.user_id);
db.pragma('foreign_keys = ON');
