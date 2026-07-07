const db = require('better-sqlite3')('UEFGallery.API/gallery.db');
const uuid = require('crypto').randomUUID;

const categories = ["Poster", "Branding", "UI/UX", "3D Art", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];

// Insert dummy SYSTEM user
db.prepare('INSERT OR IGNORE INTO users (user_id, email, password_hash, full_name, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)').run('SYSTEM', 'system@uef.edu.vn', 'hash', 'System Admin', 'admin', 1, new Date().toISOString(), new Date().toISOString());

const insertBadge = db.prepare('INSERT INTO badges (badge_id, name, color_code, text_color, lecturer_id, created_at) VALUES (?, ?, ?, ?, ?, ?)');

// Insert Categories as SYSTEM badges
categories.forEach(cat => {
    insertBadge.run(uuid(), cat, '#64748B', '#FFFFFF', 'SYSTEM', new Date().toISOString());
});

// Insert 4 custom edit badges for the admin
insertBadge.run(uuid(), 'Best Concept', '#f59e0b', '#FFFFFF', 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd', new Date().toISOString());
insertBadge.run(uuid(), 'Top 10 Branding', '#3b82f6', '#FFFFFF', 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd', new Date().toISOString());
insertBadge.run(uuid(), 'Masterpiece', '#8b5cf6', '#FFFFFF', 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd', new Date().toISOString());
insertBadge.run(uuid(), 'Excellent Typography', '#10b981', '#FFFFFF', 'e49b9f2d-1d5d-4840-bac1-e59ffd7e93bd', new Date().toISOString());

console.log('Inserted badges successfully.');
