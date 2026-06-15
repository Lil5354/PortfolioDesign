import http from 'http';

const loginData = JSON.stringify({ email: "admin@example.com", password: "password123" });

const req = http.request({
  hostname: 'localhost',
  port: 5000,
  path: '/api/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': loginData.length
  }
}, res => {
  let body = '';
  res.on('data', d => body += d);
  res.on('end', () => {
    const data = JSON.parse(body);
    
    const testData = JSON.stringify({ id: "test-123", sectionId: "homepage-hero", sortOrder: 1, isActive: true, content: { title: "Test" } });
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/site-sections/homepage-hero/items',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + data.token,
        'Content-Length': testData.length
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => console.log('POST full payload:', res2.statusCode, body2));
    });
    req2.write(testData);
    req2.end();
  });
});

req.write(loginData);
req.end();
