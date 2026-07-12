const http = require('http');

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: { 'Content-Type': 'application/json' }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) {
      const data = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: data }));
    });
    
    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runSetup() {
  console.log("=== BẮT ĐẦU CẬP NHẬT TRƯỜNG DỮ LIỆU ĐỘNG ===");

  // 1. Get Admin Token
  console.log("\n[1] Lấy Admin token...");
  const loginRes = await makeRequest('POST', '/auth/login', { email: "admin@uef.edu.vn", password: "admin123" });
  if (loginRes.statusCode !== 200) {
      console.log("Không thể đăng nhập bằng admin@uef.edu.vn/admin, thử password khác...");
      const loginRes2 = await makeRequest('POST', '/auth/login', { email: "admin@test.com", password: "password123" });
      if (loginRes2.statusCode !== 200) {
         console.log("Lỗi đăng nhập admin. Cannot proceed.");
         return;
      }
  }
  let token = null;
  try {
     token = JSON.parse(loginRes.body).token;
  } catch(e) {}
  if (!token) { console.log("Failed to parse token"); return; }
  console.log("✅ Lấy token thành công.");

  // 2. Global settings
  console.log("\n[2] Đẩy Global Settings (homeCategories, fallbackAuthorName)");
  await makeRequest('PUT', '/site-settings', { key: "homeCategories", value: "3D Art, Branding, Poster, Packaging" }, token);
  await makeRequest('PUT', '/site-settings', { key: "fallbackAuthorName", value: "Sinh viên UEF" }, token);
  console.log("✅ Cập nhật Global Settings thành công.");

  // 3. Site Sections
  console.log("\n[3] Lấy danh sách Site Sections");
  const secRes = await makeRequest('GET', '/site-sections', null, token);
  console.log("Status:", secRes.statusCode);
  console.log("Body:", secRes.body);
  const sections = JSON.parse(secRes.body);

  // Update Hero Section
  const heroSec = sections.find(s => s.page === 'home' && s.section === 'hero');
  if (heroSec && heroSec.items && heroSec.items.length > 0) {
      const heroItem = heroSec.items[0];
      const content = heroItem.content || {};
      content.featuresTitle1 = content.featuresTitle1 || "Mọi thứ";
      content.featuresTitle2 = content.featuresTitle2 || "bạn cần trong";
      content.featuresTitle3 = content.featuresTitle3 || "một nền tảng";
      content.featuresDesc = content.featuresDesc || "Hệ thống E-Portfolio toàn diện cho sinh viên Thiết kế Đồ họa UEF";
      
      const updateHero = {
          id: heroItem.id,
          sectionId: heroSec.id,
          content: content,
          sortOrder: heroItem.sortOrder
      };
      const res = await makeRequest('PUT', `/site-section-items/${heroItem.id}`, updateHero, token);
      console.log(`✅ Cập nhật Hero Section (Thêm fields Features): ${res.statusCode}`);
  }

  // Update Footer Info
  const footerSec = sections.find(s => s.page === 'footer' && s.section === 'footerInfo');
  if (footerSec && footerSec.items && footerSec.items.length > 0) {
      const footerItem = footerSec.items[0];
      const content = footerItem.content || {};
      content.linksTitle = content.linksTitle || "Liên kết";
      
      const updateFooter = {
          id: footerItem.id,
          sectionId: footerSec.id,
          content: content,
          sortOrder: footerItem.sortOrder
      };
      const res = await makeRequest('PUT', `/site-section-items/${footerItem.id}`, updateFooter, token);
      console.log(`✅ Cập nhật Footer Info (Thêm linksTitle): ${res.statusCode}`);
  }

  console.log("\nHOÀN TẤT SETUP DỮ LIỆU ĐỘNG.");
}

runSetup();
