const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('c:\\TÀI LIỆU NĂM CUỐI VÀ CV\\prototype\\UEFGallery.API\\gallery.db');

db.all("SELECT Id, Email, Role FROM Users WHERE Role = 'admin' LIMIT 1", (err, adminRows) => {
    if (err) console.error(err);
    console.log("Admin Users:", adminRows);
    
    db.all("SELECT Id, Email, Role FROM Users WHERE Role = 'student' LIMIT 1", (err, studentRows) => {
        if (err) console.error(err);
        console.log("Student Users:", studentRows);
        
        db.all("SELECT Id, Email, Role FROM Users WHERE Role = 'lecturer' LIMIT 1", (err, lecRows) => {
           console.log("Lecturer Users:", lecRows);
           db.close();
        });
    });
});
