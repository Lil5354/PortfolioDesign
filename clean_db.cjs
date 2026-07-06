const Database = require('better-sqlite3');
const db = new Database('./UEFGallery.API/gallery.db');

db.pragma('foreign_keys = OFF');

const users = db.prepare('SELECT user_id, email, full_name FROM Users').all();
console.log('Total users:', users.length);
let deletedCount = 0;

for (const user of users) {
  if (user.full_name.toLowerCase().includes('mock') || user.email.toLowerCase().includes('test_reporter') || user.email.toLowerCase().includes('dummy') || user.email.toLowerCase().includes('user_')) {
    if (!user.email.toLowerCase().includes('pupu') && !user.full_name.toLowerCase().includes('pupu') && !user.email.toLowerCase().includes('guest@uef.edu.vn')) {
      try { db.prepare('DELETE FROM Artworks WHERE user_id = ?').run(user.user_id); } catch(e){ console.log(e); }
      try { db.prepare('DELETE FROM Comments WHERE user_id = ?').run(user.user_id); } catch(e){}
      try { db.prepare('DELETE FROM Follows WHERE follower_id = ? OR followed_id = ?').run(user.user_id, user.user_id); } catch(e){}
      try { db.prepare('DELETE FROM Likes WHERE user_id = ?').run(user.user_id); } catch(e){}
      try { db.prepare('DELETE FROM PortfolioSettings WHERE user_id = ?').run(user.user_id); } catch(e){}
      try { db.prepare('DELETE FROM Users WHERE user_id = ?').run(user.user_id); } catch(e){ console.log("Users error:", e); }
      deletedCount++;
    }
  }
}

console.log('Deleted mock users:', deletedCount);
db.close();
