const Database = require('better-sqlite3');
const fs = require('fs');
const crypto = require('crypto');

const db = new Database('./UEFGallery.API/gallery.db');
const behanceData = JSON.parse(fs.readFileSync('behance_data.json', 'utf8'));

const students = db.prepare("SELECT user_id as id FROM Users WHERE email IN ('thaodtt22@uef.edu.vn', 'guest@uef.edu.vn')").all();

const insertArtwork = db.prepare(`
  INSERT INTO Artworks (artwork_id, user_id, title, description, subject, cover_image_url, is_public, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified, view_count, like_count, tags, created_at, updated_at)
  VALUES (@id, @user_id, @title, @description, @subject, @cover_image_url, @is_public, @is_pending, @is_highlighted, @is_ai_confirmed, @is_ai_verified, @view_count, @like_count, @tags, @created_at, @updated_at)
`);

let artworkIndex = 150; // Use some offset so they get different artworks
db.transaction(() => {
  for (const student of students) {
      db.prepare('DELETE FROM Artworks WHERE user_id = ?').run(student.id);
  }

  for (const student of students) {
    for (let j = 0; j < 10; j++) {
      if (artworkIndex >= behanceData.length) artworkIndex = 0;
      const bData = behanceData[artworkIndex++];
      
      try {
        insertArtwork.run({
          id: crypto.randomUUID(),
          user_id: student.id,
          title: bData.title || 'Untitled Design',
          description: bData.description || 'A graphic design project.',
          subject: bData.category || 'Graphic Design',
          cover_image_url: bData.imageUrl,
          is_public: 1,
          is_pending: 0,
          is_highlighted: 0,
          is_ai_confirmed: 1,
          is_ai_verified: 1,
          view_count: Math.floor(Math.random() * 50000) + 100,
          like_count: Math.floor(Math.random() * 5000) + 10,
          tags: JSON.stringify(['design', bData.category || 'creative']),
          created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Error inserting artwork", e);
      }
    }
  }
})();

console.log("Seeded artworks for special users.");
