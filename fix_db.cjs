const Database = require('better-sqlite3');
const db = new Database('./UEFGallery.API/gallery.db');
db.prepare("UPDATE Users SET full_name = 'Thảo Dũng' WHERE email = 'thaodtt22@uef.edu.vn'").run();
db.prepare("UPDATE Users SET full_name = 'Khách (Guest)' WHERE email = 'guest@uef.edu.vn'").run();
console.log('Fixed users');
db.close();
