const db = require('better-sqlite3')('./UEFGallery.API/gallery.db');
db.pragma('foreign_keys = OFF');

// Delete all users except 10 specific ones
const allGeneratedUsers = db.prepare(`SELECT user_id FROM users WHERE email LIKE 'sv%@uef.edu.vn' LIMIT 10`).all();
const keepIds = allGeneratedUsers.map(u => u.user_id);
console.log('Keeping', keepIds.length, 'users');

if (keepIds.length === 0) {
    console.log('No generated students found! Aborting.');
    process.exit(1);
}

// Ensure dummy sys admin is kept for tags
const sysLecturer = db.prepare(`SELECT user_id FROM users WHERE email = 'admin@uef.edu.vn'`).get();
if (sysLecturer) keepIds.push(sysLecturer.user_id);

const placeholders = keepIds.map(() => '?').join(',');

// Delete from tables that reference users
db.prepare(`DELETE FROM follows`).run();
db.prepare(`DELETE FROM messages`).run();
db.prepare(`DELETE FROM notifications`).run();
db.prepare(`DELETE FROM comments`).run();
db.prepare(`DELETE FROM likes`).run();
db.prepare(`DELETE FROM reports`).run();
db.prepare(`DELETE FROM grades`).run();

// Delete timeline, portfolio, user_account_badges for users not in keepIds
db.prepare(`DELETE FROM timeline_entries WHERE user_id NOT IN (${placeholders})`).run(...keepIds);
db.prepare(`DELETE FROM portfolio_settings WHERE user_id NOT IN (${placeholders})`).run(...keepIds);
db.prepare(`DELETE FROM user_account_badges WHERE user_id NOT IN (${placeholders})`).run(...keepIds);

// Delete the users
const deleted = db.prepare(`DELETE FROM users WHERE user_id NOT IN (${placeholders})`).run(...keepIds);
console.log('Deleted users:', deleted.changes);

// Reassign all artworks to the remaining 10 students
const artworks = db.prepare(`SELECT artwork_id FROM artworks`).all();
const students = keepIds.filter(id => id !== (sysLecturer ? sysLecturer.user_id : ''));
const updateArtwork = db.prepare(`UPDATE artworks SET user_id = ? WHERE artwork_id = ?`);
let studentIdx = 0;
for (const art of artworks) {
    updateArtwork.run(students[studentIdx % students.length], art.artwork_id);
    studentIdx++;
}
console.log('Reassigned', artworks.length, 'artworks among', students.length, 'students');

// Fix badges: assign badges to the 10 students (round robin 4 badges)
db.prepare('DELETE FROM user_account_badges').run();
const badges = db.prepare('SELECT account_badge_id FROM account_badges WHERE type = ?').all('year');
if (badges.length > 0) {
    const insertBadge = db.prepare('INSERT INTO user_account_badges (user_id, account_badge_id, assigned_at) VALUES (?, ?, ?)');
    for (let i = 0; i < students.length; i++) {
        insertBadge.run(students[i], badges[i % badges.length].account_badge_id, new Date().toISOString());
    }
    console.log('Assigned badges to students');
}

db.pragma('foreign_keys = ON');
console.log('Done');
