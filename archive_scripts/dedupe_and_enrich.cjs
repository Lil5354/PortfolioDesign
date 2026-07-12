const Database = require('better-sqlite3');
const fs = require('fs');

const db = new Database('./UEFGallery.API/gallery.db');
const behanceData = JSON.parse(fs.readFileSync('behance_data.json', 'utf8'));

db.transaction(() => {
  // 1. Delete duplicates
  const duplicates = db.prepare('SELECT cover_image_url, MIN(artwork_id) as keep_id FROM Artworks GROUP BY cover_image_url HAVING COUNT(*) > 1').all();
  let deletedCount = 0;
  for (const dup of duplicates) {
    const result = db.prepare('DELETE FROM Artworks WHERE cover_image_url = ? AND artwork_id != ?').run(dup.cover_image_url, dup.keep_id);
    deletedCount += result.changes;
  }
  console.log(`Deleted ${deletedCount} duplicate artworks.`);

  // 2. Add 2-3 images to file_urls for all artworks
  const allArtworks = db.prepare('SELECT artwork_id, subject FROM Artworks').all();
  let enrichedCount = 0;
  for (const art of allArtworks) {
    // Find some images from the same subject, or just random
    const sameSubject = behanceData.filter(b => b.category === art.subject);
    const pool = sameSubject.length > 5 ? sameSubject : behanceData;
    
    // Pick 2-3 random images
    const numImages = Math.floor(Math.random() * 2) + 2; // 2 or 3
    const fileUrls = [];
    for (let i = 0; i < numImages; i++) {
      const randomIndex = Math.floor(Math.random() * pool.length);
      fileUrls.push(pool[randomIndex].imageUrl);
    }
    
    db.prepare('UPDATE Artworks SET file_urls = ? WHERE artwork_id = ?').run(JSON.stringify(fileUrls), art.artwork_id);
    enrichedCount++;
  }
  console.log(`Enriched ${enrichedCount} artworks with 2-3 additional images.`);
})();

db.close();
