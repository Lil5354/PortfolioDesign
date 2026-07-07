const db = require('better-sqlite3')('./UEFGallery.API/gallery.db'); console.log(db.prepare('SELECT user_id, portfolio_slug FROM portfolio_settings WHERE user_id LIKE %e49b%').all());
