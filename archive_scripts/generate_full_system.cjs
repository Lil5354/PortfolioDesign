const puppeteer = require('puppeteer');
const fs = require('fs');
const crypto = require('crypto');
const Database = require('better-sqlite3');

(async () => {
  console.log("Starting scraping from Behance...");
  const browser = await puppeteer.launch({ headless: "new", args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
  
  const categories = ['ui-ux', 'branding', 'illustration', 'packaging', '3d-art', 'graphic-design', 'typography', 'photography'];
  const results = [];
  
  for (const cat of categories) {
    console.log(`Scraping category: ${cat}`);
    try {
      await page.goto(`https://www.behance.net/search/projects?search=${cat}`, { waitUntil: 'networkidle2', timeout: 60000 });
      for (let i = 0; i < 8; i++) {
        await page.evaluate(() => window.scrollBy(0, window.innerHeight * 2));
        await new Promise(r => setTimeout(r, 1500));
      }
      
      const items = await page.evaluate((category) => {
        const nodes = document.querySelectorAll('img');
        const data = [];
        nodes.forEach(node => {
          const img = node.getAttribute('src');
          if (img && (img.includes('mir-s3-cdn-cf.behance.net/project_modules/') || img.includes('mir-s3-cdn-cf.behance.net/projects/'))) {
            const title = node.getAttribute('alt') || (category.toUpperCase() + ' Project');
            if (title.length > 5) {
              data.push({ title: title, imageUrl: img, category: category });
            }
          }
        });
        return data;
      }, cat);
      
      console.log(`Got ${items.length} from ${cat}`);
      results.push(...items);
    } catch (e) {
      console.error("Error scraping", cat, e.message);
    }
  }
  
  await browser.close();
  
  const unique = [];
  for (const item of results) {
    if (!unique.find(u => u.imageUrl === item.imageUrl)) unique.push(item);
  }
  console.log(`Total unique collected: ${unique.length}`);
  
  if (unique.length < 500) {
      console.log("Not enough images scraped. Padding with duplicates...");
      const original = [...unique];
      while (unique.length < 1000 && original.length > 0) {
          unique.push(original[unique.length % original.length]);
      }
  }

  console.log("Connecting to DB...");
  const db = new Database('./UEFGallery.API/gallery.db');
  
  // Clear tables
  const tables = ['artworks', 'users', 'account_badges', 'user_account_badges', 'badges', 'artwork_badges', 'portfolio_settings', 'timeline_entries', 'collection_items'];
  for (const t of tables) {
      try { db.prepare(`DELETE FROM ${t}`).run(); } catch(e) {}
  }
  
  // 1. Create Account Badges
  console.log("Creating Account Badges...");
  const accountBadgesData = [
      { id: crypto.randomUUID(), name: "Sinh viên Năm 1", icon: "/Logoicon/nam-1.png", bg: "#1a4ba8" },
      { id: crypto.randomUUID(), name: "Sinh viên Năm 2", icon: "/Logoicon/nam-2.png", bg: "#1a4ba8" },
      { id: crypto.randomUUID(), name: "Sinh viên Năm 3", icon: "/Logoicon/nam-3.png", bg: "#1a4ba8" },
      { id: crypto.randomUUID(), name: "Sinh viên Năm cuối", icon: "/Logoicon/nam-cuoi.png", bg: "#da291c" }
  ];
  const insertAcctBadge = db.prepare(`INSERT INTO account_badges (account_badge_id, name, icon_url, text_color, bg_color, tooltip, type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
  for (const b of accountBadgesData) {
      insertAcctBadge.run(b.id, b.name, b.icon, "#ffffff", b.bg, b.name, "year", new Date().toISOString());
  }

  // Create a dummy lecturer for tags
  const sysLecturerId = crypto.randomUUID();
  db.prepare(`INSERT INTO users (user_id, email, password_hash, full_name, student_id, role, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`).run(sysLecturerId, 'admin@uef.edu.vn', '', 'System Admin', '00000', 'lecturer', new Date().toISOString(), new Date().toISOString());

  // 2. Create Tag Badges
  console.log("Creating Tag Badges...");
  const tagNames = ["UI/UX", "3D Art", "Branding", "Illustration", "Typography", "Photography", "Packaging", "Motion Design", "Editorial"];
  const tags = [];
  const insertBadge = db.prepare(`INSERT INTO badges (badge_id, name, color_code, text_color, lecturer_id, created_at) VALUES (?, ?, ?, ?, ?, ?)`);
  for (const t of tagNames) {
      const id = crypto.randomUUID();
      tags.push({ id, name: t });
      insertBadge.run(id, t, "#f0f0f0", "#333333", sysLecturerId, new Date().toISOString());
  }

  // 3. Create 100 Users
  console.log("Creating 100 Users...");
  const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Đỗ', 'Hồ', 'Ngô', 'Dương', 'Lý'];
  const middleNames = ['Văn', 'Thị', 'Hoàng', 'Minh', 'Thanh', 'Ngọc', 'Hữu', 'Quang', 'Hải', 'Thùy', 'Phương', 'Bích', 'Thu', 'Đức'];
  const lastNames = ['Anh', 'Bảo', 'Cường', 'Dũng', 'Đạt', 'Hoa', 'Hương', 'Khoa', 'Linh', 'Mai', 'Nam', 'Oanh', 'Phong', 'Quỳnh', 'Sơn', 'Trang', 'Tuấn', 'Uyên', 'Vy', 'Yến'];
  
  const users = [];
  const insertUser = db.prepare(`INSERT INTO users (user_id, email, password_hash, full_name, student_id, role, avatar_url, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?)`);
  const insertUserBadge = db.prepare(`INSERT INTO user_account_badges (user_id, account_badge_id, assigned_at) VALUES (?, ?, ?)`);
  const insertPortfolio = db.prepare(`INSERT INTO portfolio_settings (setting_id, user_id, is_portfolio_public, show_email, contact_enabled, display_order, public_moodboards, updated_at) VALUES (?, ?, 1, 1, 1, 'grid', '[]', ?)`);
  const insertTimeline = db.prepare(`INSERT INTO timeline_entries (entry_id, user_id, month, year, title, description, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`);
  const insertCollection = db.prepare(`INSERT INTO collection_items (collection_item_id, lecturer_id, artwork_id, collection_name, added_at) VALUES (?, ?, ?, ?, ?)`);

  db.transaction(() => {
    for (let i = 0; i < 100; i++) {
        const name = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${middleNames[Math.floor(Math.random() * middleNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
        const email = `sv${Math.floor(Math.random() * 900000) + 100000}@uef.edu.vn`;
        const userId = crypto.randomUUID();
        const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=200`;
        users.push({ id: userId, name, email });

        insertUser.run(userId, email, '$2a$11$0FfXfR.x3r8oO/O6cO3/iO7cQy4bU1lq3p8tF9GZ5v2w4x6y8z0A2', name, `202${i}000`, 'student', avatar, new Date().toISOString(), new Date().toISOString());
        
        // Assign year badge
        const yBadge = accountBadgesData[Math.floor(Math.random() * 4)].id;
        insertUserBadge.run(userId, yBadge, new Date().toISOString());

        // Portfolio setting
        insertPortfolio.run(crypto.randomUUID(), userId, new Date().toISOString());

        // Timeline
        insertTimeline.run(crypto.randomUUID(), userId, "09", "2021", "Bắt đầu học tại UEF", "Nhập học ngành Thiết kế đồ họa.", 1, new Date().toISOString(), new Date().toISOString());
        insertTimeline.run(crypto.randomUUID(), userId, "05", "2023", "Đồ án giữa kỳ", "Hoàn thành đồ án xuất sắc.", 2, new Date().toISOString(), new Date().toISOString());
        
        // Moodboard (Collection)
        // insertCollection.run(crypto.randomUUID(), userId, null, "Cảm hứng Thiết kế 2024", new Date().toISOString());
    }
  })();

  // 4. Create Artworks
  console.log("Creating 200 Artworks...");
  const insertArtwork = db.prepare(`INSERT INTO artworks (artwork_id, user_id, title, description, subject, cover_image_url, file_urls, collaborator_ids, is_public, is_pending, is_highlighted, is_ai_confirmed, is_ai_verified, view_count, like_count, tags, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1, ?, ?, ?, ?, ?)`);
  const insertArtBadge = db.prepare(`INSERT INTO artwork_badges (artwork_id, badge_id, assigned_at) VALUES (?, ?, ?)`);
  
  let imgIndex = 0;
  
  db.transaction(() => {
    // 200 public highlighted artworks (2 per user)
    for (let i = 0; i < 200; i++) {
        const user = users[i % 100];
        const cover = unique[imgIndex++];
        const files = [];
        for (let j = 0; j < 4; j++) {
            if (imgIndex >= unique.length) imgIndex = 0;
            files.push(unique[imgIndex++].imageUrl);
        }
        
        // Collaborators
        const collabs = [];
        for (let c = 0; c < 4; c++) {
            const rUser = users[Math.floor(Math.random() * 100)].id;
            if (rUser !== user.id && !collabs.includes(rUser)) collabs.push(rUser);
        }

        const artId = crypto.randomUUID();
        const tagsArr = JSON.stringify(['design', cover.category]);
        const isHighlight = (i < 100) ? 1 : 0; // Each user gets exactly 1 highlighted artwork

        insertArtwork.run(
            artId, user.id, cover.title, `A beautiful ${cover.category} project.`, cover.category, cover.imageUrl, JSON.stringify(files), JSON.stringify(collabs),
            1, 0, isHighlight, Math.floor(Math.random() * 5000) + 100, Math.floor(Math.random() * 500) + 10, tagsArr, new Date(Date.now() - Math.random() * 10000000000).toISOString(), new Date().toISOString()
        );

        // Tags
        const tag1 = tags[Math.floor(Math.random() * tags.length)].id;
        let tag2 = tags[Math.floor(Math.random() * tags.length)].id;
        while (tag2 === tag1) {
            tag2 = tags[Math.floor(Math.random() * tags.length)].id;
        }
        insertArtBadge.run(artId, tag1, new Date().toISOString());
        insertArtBadge.run(artId, tag2, new Date().toISOString());
    }

    // 100 draft artworks (1 per user)
    for (let i = 0; i < 100; i++) {
        const user = users[i];
        if (imgIndex >= unique.length) imgIndex = 0;
        const cover = unique[imgIndex++];
        const files = [unique[(imgIndex+1)%unique.length].imageUrl, unique[(imgIndex+2)%unique.length].imageUrl];
        
        const artId = crypto.randomUUID();
        insertArtwork.run(
            artId, user.id, `Draft: ${cover.title}`, `Draft project.`, cover.category, cover.imageUrl, JSON.stringify(files), "[]",
            0, 1, 0, 0, 0, "[]", new Date().toISOString(), new Date().toISOString()
        );
    }
  })();

  console.log("Successfully generated all data!");
})();
