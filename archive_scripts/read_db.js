const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\prototype\\UEFGallery.API\\gallery.db', sqlite3.OPEN_READONLY, (err) => {
  if (err) {
    console.error(err.message);
  }
});

db.serialize(() => {
  db.each(`SELECT Key, Value FROM SiteSettings`, (err, row) => {
    if (err) {
      console.error(err.message);
    }
    console.log(row.Key + "\t" + row.Value);
  });
});

db.close();
