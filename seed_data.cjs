const Database = require('better-sqlite3');
const fs = require('fs');
const crypto = require('crypto');

const db = new Database('./UEFGallery.API/gallery.db');

let behanceData = [];
try {
  behanceData = JSON.parse(fs.readFileSync('behance_data.json', 'utf8'));
} catch (e) {
  console.error("No behance data found!", e);
  process.exit(1);
}

if (behanceData.length < 200) {
  const original = [...behanceData];
  while (behanceData.length < 200 && original.length > 0) {
    behanceData.push(original[behanceData.length % original.length]);
  }
}

const existingUsers = db.prepare("SELECT user_id as id FROM Users WHERE email LIKE 'sv%@uef.edu.vn'").all();

let students = [];
if (existingUsers.length === 20) {
  students = existingUsers;
} else {
    const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
    const middleNames = ['Văn', 'Thị', 'Hoàng', 'Minh', 'Thanh', 'Ngọc', 'Hữu', 'Quang', 'Hải', 'Thùy', 'Phương', 'Bích', 'Thu', 'Đức'];
    const lastNames = ['Anh', 'Bảo', 'Cường', 'Dũng', 'Đạt', 'Hoa', 'Hương', 'Khoa', 'Linh', 'Mai', 'Nam', 'Oanh', 'Phong', 'Quỳnh', 'Sơn', 'Trang', 'Tuấn', 'Uyên', 'Vy', 'Yến'];

    function getRandomName() {
      return `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    }

    for (let i = 0; i < 20; i++) {
      const name = getRandomName();
      const email = `sv${Math.floor(Math.random() * 90000) + 10000}@uef.edu.vn`;
      const studentId = `202${Math.floor(Math.random() * 900000) + 100000}`;
      
      students.push({
        id: crypto.randomUUID(),
        email,
        password_hash: '$2a$11$0FfXfR.x3r8oO/O6cO3/iO7cQy4bU1lq3p8tF9GZ5v2w4x6y8z0A2',
        full_name: name,
        student_id: studentId,
        role: 'student',
        avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        is_active: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    const insertUser = db.prepare(`
      INSERT INTO Users (user_id, email, password_hash, full_name, student_id, role, avatar_url, is_active, created_at, updated_at)
      VALUES (@id, @email, @password_hash, @full_name, @student_id, @role, @avatar_url, @is_active, @created_at, @updated_at)
    `);

    db.transaction(() => {
      for (const s of students) {
        try { insertUser.run(s); } catch (e) {}
      }
    })();
}


const insertArtwork = db.prepare(`
  INSERT INTO Artworks (artwork_id, user_id, title, description, subject, cover_image_url, is_public, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified, view_count, like_count, tags, created_at, updated_at)
  VALUES (@id, @user_id, @title, @description, @subject, @cover_image_url, @is_public, @is_pending, @is_highlighted, @is_ai_confirmed, @is_ai_verified, @view_count, @like_count, @tags, @created_at, @updated_at)
`);

let artworkIndex = 0;
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
          created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          updated_at: new Date().toISOString()
        });
      } catch (e) {
        console.error("Error inserting artwork", e);
      }
    }
  }
})();

console.log("Seeded 200 artworks total (10 per student).");

const insertFollow = db.prepare(`
  INSERT INTO Follows (follower_id, followed_id, created_at)
  VALUES (@follower_id, @followed_id, @created_at)
`);

db.transaction(() => {
  for (const s1 of students) {
    db.prepare('DELETE FROM Follows WHERE follower_id = ? OR followed_id = ?').run(s1.id, s1.id);
    const followersCount = Math.floor(Math.random() * 15) + 1;
    const followers = [...students].sort(() => 0.5 - Math.random()).slice(0, followersCount);
    for (const f of followers) {
      if (f.id !== s1.id) {
        try {
          insertFollow.run({ follower_id: f.id, followed_id: s1.id, created_at: new Date().toISOString() });
        } catch (e) {}
      }
    }
  }
})();

console.log("Follows seeded.");
db.close();
