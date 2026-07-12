import http from 'http';

const loginData = JSON.stringify({ email: "admin@uef.edu.vn", password: "password123" });

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
    
    // Artwork ID from the screenshot: 75bd05f0-7446-419c-beb9-fc685b0ebb4b
    const artworkId = '75bd05f0-7446-419c-beb9-fc685b0ebb4b';
    
    const req2 = http.request({
      hostname: 'localhost',
      port: 5000,
      path: `/api/artworks/${artworkId}/like`,
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + data.token,
        'Content-Type': 'application/json',
        'Content-Length': 0
      }
    }, res2 => {
      let body2 = '';
      res2.on('data', d => body2 += d);
      res2.on('end', () => console.log('POST Like Response:', res2.statusCode, body2));
    });
    req2.end();
  });
});

req.write(loginData);
req.end();
