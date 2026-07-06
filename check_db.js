import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./UEFGallery.API/gallery.db');

db.serialize(() => {
  const artworkId = 'df8f539e-711b-4101-89a5-553cda7de449';
  
  db.get('SELECT * FROM artworks WHERE id = ?', [artworkId], (err, row) => {
    if (err) console.error(err);
    else console.log('Artwork status in DB:', row);
  });
  
  db.get('SELECT COUNT(*) as count FROM reports WHERE artwork_id = ?', [artworkId], (err, row) => {
    if (err) console.error(err);
    else console.log('Total Reports in DB:', row.count);
  });
});

db.close();
