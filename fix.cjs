const db = require('better-sqlite3')('./UEFGallery.API/gallery.db'); db.prepare("UPDATE portfolio_settings SET display_order = 'newest'").run(); console.log('Updated DB');
