const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('gallery.db');

db.serialize(() => {
    // 1. Backdate some users
    db.run(`UPDATE users SET created_at = datetime('now', '-' || abs(random() % 14) || ' days')`);
    
    // 2. Backdate some artworks
    db.run(`UPDATE artworks SET created_at = datetime('now', '-' || abs(random() % 14) || ' days')`);
    
    // 3. Create a daily_stats table if it doesn't exist to store views per day, or just mock it.
    // Instead of complex schema changes, I'll just create a new table for daily views for simplicity.
    db.run(`CREATE TABLE IF NOT EXISTS daily_views (
        date TEXT PRIMARY KEY,
        views INTEGER
    )`);
    
    // Populate daily_views for the last 14 days with random data
    db.run(`DELETE FROM daily_views`);
    for (let i = 0; i < 14; i++) {
        // More views in recent days, fewer in older days to make a nice curve
        let views = Math.floor(Math.random() * 20) + 5;
        if (i < 7) views += Math.floor(Math.random() * 30);
        if (i === 3 || i === 4) views += 40; // spike
        db.run(`INSERT INTO daily_views (date, views) VALUES (date('now', '-${i} days'), ${views})`);
    }
    
    // Also update some random artworks, users, and reports to have a recent CreatedAt date (last 14 days)
    // so that the chart for 'artworks', 'users', and 'reports' will have data.
    db.run(`UPDATE artworks SET created_at = datetime('now', '-' || (abs(random()) % 14) || ' days') WHERE rowid % 3 = 0`);
    db.run(`UPDATE users SET created_at = datetime('now', '-' || (abs(random()) % 14) || ' days') WHERE rowid % 2 = 0`);
    db.run(`UPDATE reports SET created_at = datetime('now', '-' || (abs(random()) % 14) || ' days')`);

    // Populate dummy reports so there are "Reported Artworks"
    for (let i = 0; i < 5; i++) {
        db.run(`INSERT INTO reports (report_id, artwork_id, user_id, violation_type, detail, status, created_at, updated_at) 
                SELECT 
                    lower(hex(randomblob(16))), 
                    artwork_id, 
                    (SELECT user_id FROM users LIMIT 1 OFFSET abs(random() % 5)), 
                    'Spam', 'Demo report', 'pending', datetime('now', '-' || abs(random() % 14) || ' days'), datetime('now')
                FROM artworks ORDER BY random() LIMIT 1`);
    }

    console.log("Historical data seeded successfully.");
});

db.close();
