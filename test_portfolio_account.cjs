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

async function runTests() {
  console.log("=== BẮT ĐẦU TEST PORTFOLIO, SETTINGS, VÀ ADMIN ===");
  
  // 1. Try to register a new user
  console.log("\n[1] Registering a test user...");
  const regBody = { email: `test_${Date.now()}@uef.edu.vn`, password: "password123", fullName: "Test User", role: "student" };
  const regRes = await makeRequest('POST', '/auth/register', regBody);
  console.log(`  Register Status: ${regRes.statusCode}`);
  let token = null;
  if (regRes.statusCode === 200 || regRes.statusCode === 201) {
     const loginRes = await makeRequest('POST', '/auth/login', { email: regBody.email, password: "password123" });
     if (loginRes.statusCode === 200) token = JSON.parse(loginRes.body).token;
  } else {
     // fallback to a known test user if register fails
     const loginRes = await makeRequest('POST', '/auth/login', { email: "student@uef.edu.vn", password: "password123" });
     if (loginRes.statusCode === 200) token = JSON.parse(loginRes.body).token;
  }

  if (!token) {
     console.log("  ❌ Could not get a user token to proceed. Testing without token...");
  } else {
     console.log("  ✅ Got user token.");
  }

  // 2. Test Settings Account
  console.log("\n[2] Test Settings Account (/api/users/me, /api/users/profile)");
  if (token) {
      const getMe = await makeRequest('GET', '/users/me', null, token);
      console.log(`  GET /users/me -> ${getMe.statusCode}`);
      
      const putProfile = await makeRequest('PUT', '/users/profile', { fullName: "Updated Name" }, token);
      console.log(`  PUT /users/profile -> ${putProfile.statusCode}`);
  }

  // 3. Test Portfolio
  console.log("\n[3] Test Portfolio (/api/portfolios/mine)");
  if (token) {
      const getPort = await makeRequest('GET', '/portfolios/mine', null, token);
      console.log(`  GET /portfolios/mine -> ${getPort.statusCode}`);
      
      const putPort = await makeRequest('PUT', '/portfolios/mine/visibility', { isPortfolioPublic: true }, token);
      console.log(`  PUT /portfolios/mine/visibility -> ${putPort.statusCode}`);
  }

  // 4. Test Admin
  console.log("\n[4] Test Admin (/api/admin/users)");
  const adminRes = await makeRequest('GET', '/admin/users', null, token);
  if (adminRes.statusCode === 401 || adminRes.statusCode === 403) {
      console.log(`  ✅ Successfully blocked non-admin access to Admin API: ${adminRes.statusCode}`);
  } else {
      console.log(`  ⚠️ Admin API returned ${adminRes.statusCode}`);
  }

}

runTests();
