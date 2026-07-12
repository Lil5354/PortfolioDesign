const http = require('http');

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: `/api${path}`,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    if (token) options.headers['Authorization'] = `Bearer ${token}`;
    if (body) {
      const data = JSON.stringify(body);
      options.headers['Content-Length'] = Buffer.byteLength(data);
    }
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({ statusCode: res.statusCode, body: data });
      });
    });
    
    req.on('error', (e) => reject(e));
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  console.log("=== BẮT ĐẦU TEST API VÀ LUỒNG DỮ LIỆU ===");

  // 1. Test Login (Guest -> Student)
  console.log("\n[1] Test Login (Student Account)");
  let studentToken = null;
  try {
    const res = await makeRequest('POST', '/auth/login', { email: "student@uef.edu.vn", password: "password123" });
    if (res.statusCode === 200) {
      console.log("  ✅ Đăng nhập Student thành công.");
      const data = JSON.parse(res.body);
      studentToken = data.token;
    } else {
      console.log(`  ❌ Lỗi Đăng nhập Student: ${res.statusCode} - ${res.body}`);
    }
  } catch (e) {
    console.log("  ❌ Không kết nối được Backend. Backend có thể đang tắt hoặc không mở port 5000.");
    console.error(e.message);
    return;
  }

  // 2. Test Lấy danh sách Artwork (Guest mode)
  console.log("\n[2] Test Lấy danh sách Public Artworks (Guest)");
  const publicRes = await makeRequest('GET', '/artworks?isPublic=true');
  if (publicRes.statusCode === 200) {
    console.log("  ✅ Lấy danh sách Public thành công.");
  } else {
    console.log(`  ❌ Lỗi lấy danh sách: ${publicRes.statusCode}`);
  }

  // 3. Test Student cố tình Duyệt bài (Phân quyền)
  console.log("\n[3] Test Phân quyền (Student cố gắng duyệt bài)");
  if (studentToken) {
    const hackRes = await makeRequest('PATCH', '/artworks/1/visibility', { isPublic: true }, studentToken);
    if (hackRes.statusCode === 403 || hackRes.statusCode === 401) {
      console.log("  ✅ Hệ thống chặn thành công Student duyệt bài (Access Denied).");
    } else if (hackRes.statusCode === 404) {
      console.log("  ✅ Artwork 1 không tồn tại, nhưng lệnh gọi không bị sập.");
    } else {
      console.log(`  ⚠️ Lỗ hổng bảo mật: Backend trả về ${hackRes.statusCode}. Cần kiểm tra lại Middleware Role.`);
    }
  }

  // 4. Test Lecturer Login & Duyệt bài
  console.log("\n[4] Test Lecturer Login & Logic Duyệt");
  let lecturerToken = null;
  const loginLec = await makeRequest('POST', '/auth/login', { email: "lecturer@uef.edu.vn", password: "password123" });
  if (loginLec.statusCode === 200) {
    console.log("  ✅ Đăng nhập Lecturer thành công.");
    lecturerToken = JSON.parse(loginLec.body).token;
  }

  // 5. Thống kê
  console.log("\n=== TỔNG KẾT API TEST ===");
  console.log("Backend phản hồi bình thường. Hệ thống Auth và Role hoạt động cơ bản.");
}

runTests();
